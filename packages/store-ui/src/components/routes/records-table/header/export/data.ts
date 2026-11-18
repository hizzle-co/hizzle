import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { __, sprintf } from '@wordpress/i18n';
import type { CollectionConfig } from '@hizzlewp/store';

type ExportRecord = Record<string, any>;
export type ExportResult = { records: ExportRecord[]; background: boolean };

/**
 * Normalize a raw REST value without changing the cached record.
 *
 * @param value Saved value, possibly wrapped with raw and rendered representations.
 * @return Spreadsheet value, or undefined when server normalization is required.
 */
export function normalizeCachedValue( value: any ): any {
	if (
		value &&
		typeof value === 'object' &&
		!Array.isArray( value ) &&
		'raw' in value &&
		'rendered' in value
	) {
		value = value.raw;
	}
	if ( typeof value === 'boolean' ) {
		return Number( value );
	}
	if ( Array.isArray( value ) ) {
		if (
			value.some(
				( item ) =>
					( item !== null && typeof item === 'object' ) ||
					item === undefined
			)
		) {
			return undefined;
		}
		return value
			.map( ( item ) =>
				item === true
					? '1'
					: item === false || item === null
						? ''
						: String( item )
			)
			.join( ',' );
	}
	return value !== null && typeof value === 'object' ? undefined : value;
}

/**
 * Compare membership and ordering while allowing pagination and selected-ID subsets.
 *
 * @param query Table or export query.
 * @return Stable representation of its filters and ordering.
 */
function matchingQuery( query: Record<string, any> ): string {
	return JSON.stringify(
		Object.entries( query )
			.filter( ( [ key, value ] ) => {
				if (
					[
						'context',
						'_fields',
						'include',
						'paged',
						'per_page',
						'background_export',
					].includes( key )
				)
					return false;
				return (
					key !== 'page' ||
					( typeof value === 'string' &&
						value.trim() !== '' &&
						!Number.isFinite( Number( value ) ) )
				);
			} )
			.sort( ( [ first ], [ second ] ) => first.localeCompare( second ) )
	);
}

/**
 * Reuse only resolved query membership and saved, exportable field values.
 *
 * @param selectors Store selectors; cache-only reads must not start resolvers.
 * @param config Collection configuration and field contexts.
 * @param fields Selected CSV columns in order.
 * @param query Export selection, including optional selected IDs.
 * @param cacheQuery Original table query used to establish membership and freshness.
 * @param recordsCount Expected size of the entire export selection.
 * @return Normalized copies, or null when an export request is required.
 */
export function getCachedExport(
	selectors: any,
	config: CollectionConfig,
	fields: string[],
	query: Record<string, any>,
	cacheQuery: Record<string, any> | undefined,
	recordsCount: number | null
): ExportRecord[] | null {
	if ( !cacheQuery || recordsCount === null || !fields.length ) {
		return null;
	}
	if ( matchingQuery( query ) !== matchingQuery( cacheQuery ) ) {
		return null;
	}
	const props = new Map( config.props.map( ( prop ) => [ prop.name, prop ] ) );
	// Dynamic getters and structured metadata can differ between REST contexts.
	if (
		fields.some(
			( field ) =>
				!props.get( field )?.context?.includes( 'export' ) ||
				props.get( field )?.is_dynamic ||
				field === 'metadata'
		)
	) {
		return null;
	}
	const key = config.key || 'id';
	for ( const context of [ 'edit', 'view' ] ) {
		const sourceQuery =
			context === ( cacheQuery.context ?? 'view' )
				? cacheQuery
				: { ...cacheQuery, context };
		const args = [ config.namespace, config.collection, sourceQuery ];
		if (
			!selectors.hasFinishedResolution( 'getCollectionRecords', args ) ||
			selectors.isResolving( 'getCollectionRecords', args )
		) {
			continue;
		}
		const readQuery = {
			...sourceQuery,
			context,
			per_page: -1,
			paged: 1,
			_fields: [ key, ...fields ].join( ',' ),
		};
		// Selected rows may all be on the loaded page even when the full list has gaps.
		const candidates = selectors.getCollectionRecordsNoResolver(
			config.namespace,
			config.collection,
			readQuery
		) ?? ( query.include ? selectors.getCollectionRecordsNoResolver(
			config.namespace,
			config.collection,
			{ ...sourceQuery, context, _fields: readQuery._fields }
		) : null );
		if ( !candidates ) {
			continue;
		}
		const include = query.include
			? new Set(
				( Array.isArray( query.include )
					? query.include
					: String( query.include ).split( ',' )
				).map( String )
			)
			: null;
		const selected = include
			? candidates.filter( ( record ) => include.has( String( record[ key ] ) ) )
			: candidates;
		if (
			selected.length !== recordsCount ||
			new Set( selected.map( ( record ) => record[ key ] ) ).size !== recordsCount
		) {
			continue;
		}
		const result: ExportRecord[] = [];
		for ( const candidate of selected ) {
			const record = selectors.getCollectionRecordNoResolver(
				config.namespace,
				config.collection,
				candidate[ key ],
				{ context, _fields: fields.join( ',' ) }
			);
			if ( !record ) {
				break;
			}
			const normalized = Object.fromEntries(
				fields.map( ( field ) => [
					field,
					normalizeCachedValue( record[ field ] ),
				] )
			);
			if ( fields.some( ( field ) => normalized[ field ] === undefined ) ) {
				break;
			}
			result.push( normalized );
		}
		if ( result.length === recordsCount ) {
			return result;
		}
	}
	return null;
}

/**
 * Request an export page while preserving REST error messages for the modal.
 *
 * @param path REST request path.
 * @return Successful response with pagination headers.
 */
async function fetchExportPage( path: string ): Promise<Response> {
	try {
		return await apiFetch( { path, parse: false } );
	} catch ( error ) {
		// With parse:false, apiFetch throws the Response rather than its JSON error body.
		if ( !( error instanceof Response ) ) throw error;
		let details: { message?: string; data?: { params?: Record<string, string> } } | undefined;
		try {
			details = await error.json();
		} catch {
			// Empty or invalid error bodies still need an actionable message with the HTTP status.
		}
		if ( typeof details?.message === 'string' ) {
			const params = Object.values( details.data?.params ?? {} ).filter( ( value ) => typeof value === 'string' );
			throw new Error( [ details.message, ...params ].join( ' ' ) );
		}
		throw new Error( sprintf( 'Unable to export records (HTTP %d). Please try again.', error.status ) );
	}
}

/**
 * Fetch download data directly, without dispatching records into the shared store.
 *
 * @param config Collection endpoint and default parameters.
 * @param fields Selected CSV columns.
 * @param query Matching record filters and ordering.
 * @param recordsCount Expected selection size; unknown sizes use the background queue.
 * @return Export rows or confirmation that the background job was queued.
 */
export async function fetchExport(
	config: CollectionConfig,
	fields: string[],
	query: Record<string, any>,
	recordsCount: number | null
): Promise<ExportResult> {
	const background = recordsCount === null || recordsCount > 500;
	const params: Record<string, any> = {
		...config.baseURLParams,
		...query,
		context: 'export',
		_fields: fields.join( ',' ),
		background_export: background,
	};
	// Export the selection from its beginning, regardless of the visible table page.
	delete params.page;
	delete params.paged;
	// Preserve nonnumeric admin page slugs when they are part of the endpoint query.
	if (
		typeof query.page === 'string' &&
		query.page.trim() !== '' &&
		!Number.isFinite( Number( query.page ) )
	) {
		params.page = query.page;
	}
	if ( background ) {
		await apiFetch( {
			path: addQueryArgs( config.baseURL, { ...params, per_page: 1 } ),
		} );
		return { records: [], background: true };
	}
	const records: ExportRecord[] = [];
	let page = 1;
	let totalPages = 1;
	do {
		const response = await fetchExportPage( addQueryArgs( config.baseURL, {
			...params,
			paged: page,
			per_page: 500,
		} ) );
		const data = await response.json();
		if ( !Array.isArray( data ) ) {
			throw new Error( 'Invalid export response.' );
		}
		records.push( ...data );
		totalPages = Number( response.headers.get( 'X-WP-TotalPages' ) ) || 1;
		++page;
	} while ( page <= totalPages );
	return { records, background: false };
}
