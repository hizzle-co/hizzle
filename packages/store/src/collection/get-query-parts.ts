/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { withWeakMapCache, getNormalizedCommaSeparable } from '../utils';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE, DEFAULT_CONTEXT } from '../constants';
import { CollectionRecordKey } from '../types';

/**
 * An object of properties describing a specific query.
 */
type WPQueriedDataQueryParts = {
	/**
	 * The query page (1-based index, default 1).
	 */
	page: number;

	/**
	 * Items per page for query (default 10).
	 */
	perPage: number;

	/**
	 * An encoded stable string of all non-pagination, non-fields query parameters.
	 */
	stableKey: string;

	/**
	 * Target subset of fields to derive from item objects.
	 */
	fields?: string[];

	/**
	 * Specific item IDs to include.
	 */
	include?: CollectionRecordKey[];

	/**
	 * Scope under which the request is made; determines returned fields in response.
	 */
	context: string;
}

/**
 * Given a query object, returns an object of parts, including pagination
 * details (`page` and `perPage`, or default values). All other properties are
 * encoded into a stable (idempotent) `stableKey` value.
 *
 * @param {Object} query Optional query object.
 *
 * @return {WPQueriedDataQueryParts} Query parts.
 */
export function getQueryParts( query: Record<string, any> ): WPQueriedDataQueryParts {
	const parts: WPQueriedDataQueryParts = {
		stableKey: '',
		page: DEFAULT_PAGE,
		perPage: DEFAULT_PER_PAGE,
		fields: undefined,
		include: undefined,
		context: DEFAULT_CONTEXT,
	};

	// Ensure stable key by sorting keys. Also more efficient for iterating.
	const keys = Object.keys( query ).sort();

	for ( let i = 0; i < keys.length; i++ ) {
		const key = keys[ i ];
		let value = query[ key ];

		switch ( key ) {
			case 'paged':
				parts[ key ] = Number( value );

				if ( parts.page !== DEFAULT_PAGE ) {
					parts.stableKey +=
						( parts.stableKey ? '&' : '' ) +
						'page=' + value;
				}
				break;

			case 'per_page':
				parts.perPage = Number( value );

				if ( parts.perPage !== DEFAULT_PER_PAGE ) {
					parts.stableKey +=
						( parts.stableKey ? '&' : '' ) +
						'per_page=' + value;
				}
				break;

			case 'context':
				parts.context = value;
				break;

			case '_fields':
				parts.fields = getNormalizedCommaSeparable( value ) ?? [];
				break;
			case 'page':
				// Page is the admin page, so we use paged instead.
				break;
			default:

				// Two requests with different include values cannot have same results.
				if ( key === 'include' ) {
					if ( typeof value === 'number' ) {
						value = value.toString();
					}
					parts.include = (
						getNormalizedCommaSeparable( value ) ?? []
					).map( Number );
					// Normalize value for `stableKey`.
					value = parts.include.join();
				}

				// While it could be any deterministic string, for simplicity's
				// sake mimic querystring encoding for stable key.
				//
				// TODO: For consistency with PHP implementation, addQueryArgs
				// should accept a key value pair, which may optimize its
				// implementation for our use here, vs. iterating an object
				// with only a single key.
				parts.stableKey +=
					( parts.stableKey ? '&' : '' ) +
					addQueryArgs( '', { [ key ]: value } ).slice( 1 );
		}
	}

	return parts;
}

export default withWeakMapCache( getQueryParts );
