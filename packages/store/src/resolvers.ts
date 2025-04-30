/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { STORE_NAME } from './constants';
import { DEFAULT_ENTITY_KEY, DEFAULT_CONTEXT } from './constants';
import {
	forwardResolver,
	getNormalizedCommaSeparable,
	getUserPermissionCacheKey,
	getUserPermissionsFromAllowHeader,
	ALLOWED_RESOURCE_ACTIONS,
	RECEIVE_INTERMEDIATE_RESULTS,
} from './utils';
import { GetRecordsHttpQuery } from './selectors';
import { CollectionRecordKey, CollectionConfig } from './types';

const throwWPError = async ( error: Response | unknown ) => {
	// If error is a Response object, try to extract WP_Error from the body
	if ( error instanceof Response ) {
		let errorMessage = error.statusText;
		try {
			const errorData = await error.json();
			if ( errorData && ( errorData.code || errorData.message ) ) {
				errorMessage = errorData.message || errorData.code;
			}
		} catch ( jsonError ) {
			// If we can't parse the JSON, just continue with the original error
			console.error( 'Failed to parse error response:', jsonError );
		}

		throw new Error( errorMessage );
	}

	throw error;
}

/**
 * Requests a collection's record tab content from the REST API.
 *
 * @param {string}        namespace  Collection namespace.
 * @param {string}        collection Collection name.
 * @param {number|string} recordId   Record's key
 * @param {string}        tabName    The tab name.
 */
export const getCollectionRecordTabContent =
	( namespace: string, collection: string, recordId: CollectionRecordKey, tabName: string ) =>
		async ( { dispatch, resolveSelect } ) => {
			const entityConfig = await resolveSelect.getCollectionConfig( namespace, collection );
			if ( !entityConfig ) {
				return;
			}

			const path = addQueryArgs(
				`${ entityConfig.baseURL }/${ recordId }/${ tabName }`,
				{
					...entityConfig.baseURLParams,
					uniqid: Math.random(),
				}
			);

			const content = await apiFetch( { path } );

			dispatch.receiveCollectionRecordTabContent( namespace, collection, recordId, tabName, content );
		};

getCollectionRecordTabContent.shouldInvalidate = ( action, namespace: string, collection: string, recordId: CollectionRecordKey ) => {
	return (
		( [ 'DO_BATCH_COLLECTION_ACTION_FINISH' ].includes( action.type ) ) &&
		action.invalidateCache &&
		namespace === action.namespace &&
		collection === action.collection
	) ||
		(
			( [ 'SAVE_COLLECTION_RECORD_FINISH' ].includes( action.type ) ) &&
			!action.error &&
			namespace === action.namespace &&
			collection === action.collection &&
			recordId === action.recordId
		);
};

/**
 * Requests a collection's record from the REST API.
 *
 * @param {string}           namespace  Collection namespace.
 * @param {string}           collection Collection name.
 * @param {number|string}    key   Record's key
 * @param {Object|undefined} query Optional object of query parameters to
 *                                 include with request. If requesting specific
 *                                 fields, fields must always include the ID.
 */
export const getCollectionRecord =
	( namespace: string, collection: string, key: CollectionRecordKey = '', query: GetRecordsHttpQuery = {} ) =>
		async ( { select, dispatch, registry, resolveSelect } ) => {
			const entityConfig = await resolveSelect.getCollectionConfig( namespace, collection );
			if ( !entityConfig ) {
				return;
			}

			const lock = await dispatch.__unstableAcquireStoreLock(
				STORE_NAME,
				[ 'collections', 'records', namespace, collection, key ],
				{ exclusive: false }
			);

			const ID_KEY = entityConfig.key || DEFAULT_ENTITY_KEY;

			try {
				if ( query !== undefined && query.__fields ) {
					// If requesting specific fields, items and query association to said
					// records are stored by ID reference. Thus, fields must always include
					// the ID.
					query = {
						...query,
						__fields: [
							...new Set( [
								...( getNormalizedCommaSeparable(
									query.__fields
								) || [] ),
								ID_KEY,
							] ),
						].join(),
					};
				}

				// Disable reason: While true that an early return could leave `path`
				// unused, it's important that path is derived using the query prior to
				// additional query modifications in the condition below, since those
				// modifications are relevant to how the data is tracked in state, and not
				// for how the request is made to the REST API.

				// eslint-disable-next-line @wordpress/no-unused-vars-before-return
				const path = addQueryArgs(
					entityConfig.baseURL + ( key ? '/' + key : '' ),
					{
						...entityConfig.baseURLParams,
						uniqid: Math.random(),
						...query,
					}
				);

				if ( query !== undefined && query.__fields ) {
					query = { ...query, include: [ key ] };

					// The resolution cache won't consider query as reusable based on the
					// fields, so it's tested here, prior to initiating the REST request,
					// and without causing `getCollectionRecords` resolution to occur.
					const hasRecords = select.hasCollectionRecords(
						namespace,
						collection,
						query
					);
					if ( hasRecords ) {
						return;
					}
				}

				const response = await apiFetch<Response>( { path, parse: false } );
				const record = await response.json();
				const permissions = getUserPermissionsFromAllowHeader(
					response.headers?.get( 'allow' )
				);

				const canUserResolutionsArgs: [ string, { namespace: string; collection: string; id: string | number } ][] = [];
				const receiveUserPermissionArgs = {};
				for ( const action of ALLOWED_RESOURCE_ACTIONS ) {
					receiveUserPermissionArgs[
						getUserPermissionCacheKey( action, {
							namespace,
							collection,
							id: key,
						} )
					] = permissions[ action ];

					canUserResolutionsArgs.push( [
						action,
						{ namespace, collection, id: key },
					] );
				}

				registry.batch( () => {
					dispatch.receiveCollectionRecords( namespace, collection, [ record ], query );
					dispatch.receiveUserPermissions(
						receiveUserPermissionArgs
					);
					dispatch.finishResolutions(
						'canUser',
						canUserResolutionsArgs
					);
				} );
			} catch ( error ) {
				await throwWPError( error );
			} finally {
				dispatch.__unstableReleaseStoreLock( lock );
			}
		};

getCollectionRecord.shouldInvalidate = ( action, namespace: string, collection: string ) => {
	return (
		( [ 'DO_BATCH_COLLECTION_ACTION_FINISH' ].includes( action.type ) ) &&
		action.invalidateCache &&
		namespace === action.namespace &&
		collection === action.collection
	);
};

/**
 * Requests a collection's record from the REST API.
 */
export const getRawCollectionRecord = forwardResolver( 'getCollectionRecord' );

/**
 * Requests an collection's edited record from the REST API.
 */
export const getEditedCollectionRecord = forwardResolver( 'getCollectionRecord' );

/**
 * Requests the collection's records from the REST API.
 *
 * @param {string}  namespace  Collection namespace.
 * @param {string}  collection Collection name.
 * @param {?Object} query      Query Object. If requesting specific fields, fields
 *                        must always include the ID.
 */
export const getCollectionRecords =
	( namespace: string, collection: string, query: Record<string, any> = {} ) =>
		async ( { dispatch, registry, resolveSelect } ) => {
			const entityConfig: CollectionConfig | undefined = await resolveSelect.getCollectionConfig( namespace, collection );
			if ( !entityConfig ) {
				return;
			}

			const lock = await dispatch.__unstableAcquireStoreLock(
				STORE_NAME,
				[ 'collections', 'records', namespace, collection ],
				{ exclusive: false }
			);

			const ID_KEY = entityConfig.key || DEFAULT_ENTITY_KEY;

			function getResolutionsArgs( records ) {
				return records
					.filter( ( record ) => record?.[ ID_KEY ] )
					.map( ( record ) => [ namespace, collection, record[ ID_KEY ] ] );
			}

			try {
				if ( query.__fields ) {
					// If requesting specific fields, items and query association to said
					// records are stored by ID reference. Thus, fields must always include
					// the ID.
					query = {
						...query,
						__fields: [
							...new Set( [
								...( getNormalizedCommaSeparable( query.__fields ) ||
									[] ),
								ID_KEY,
							] ),
						].join(),
					};
				}

				const path = addQueryArgs( entityConfig.baseURL, {
					...entityConfig.baseURLParams,
					uniqid: Math.random(),
					__next_as_array: true,
					...query,
				} );

				let records: Record<string, any>[] = [],
					meta: { totalItems: number; totalPages: number; };
				if ( entityConfig.supportsPagination && query.per_page !== -1 ) {
					const response = await apiFetch<Response>( { path, parse: false } );
					records = await response.json();

					meta = {
						totalItems: parseInt(
							response.headers.get( 'X-WP-Total' ) as string
						),
						totalPages: parseInt(
							response.headers.get( 'X-WP-TotalPages' ) as string
						),
					};
				} else if (
					query.per_page === -1 &&
					query[ RECEIVE_INTERMEDIATE_RESULTS ] !== false
				) {
					let page = 1;
					let totalPages: number;

					do {
						const response = await apiFetch<Response>( {
							path: addQueryArgs( path, { page, per_page: 100 } ),
							parse: false,
						} );
						const pageRecords = Object.values( await response.json() ) as Record<string, any>[];

						totalPages = parseInt(
							response.headers.get( 'X-WP-TotalPages' ) as string
						);

						records.push( ...pageRecords );
						registry.batch( () => {
							dispatch.receiveCollectionRecords(
								namespace,
								collection,
								records,
								query,
							);
							dispatch.finishResolutions(
								'getCollectionRecord',
								getResolutionsArgs( pageRecords )
							);
						} );
						page++;
					} while ( page <= totalPages );

					meta = {
						totalItems: records.length,
						totalPages: 1,
					};
				} else {
					records = Object.values( await apiFetch( { path } ) );
					meta = {
						totalItems: records.length,
						totalPages: 1,
					};
				}

				// If we request fields but the result doesn't contain the fields,
				// explicitly set these fields as "undefined"
				// that way we consider the query "fulfilled".
				if ( query.__fields ) {
					records = records.map( ( record ) => {
						query.__fields.split( ',' ).forEach( ( field ) => {
							if ( !record.hasOwnProperty( field ) ) {
								record[ field ] = undefined;
							}
						} );

						return record;
					} );
				}

				registry.batch( () => {
					dispatch.receiveCollectionRecords(
						namespace,
						collection,
						records,
						query,
						meta,
					);

					// When requesting all fields, the list of results can be used to resolve
					// the `getCollectionRecord` and `canUser` selectors in addition to `getCollectionRecords`.
					// See https://github.com/WordPress/gutenberg/pull/26575
					// See https://github.com/WordPress/gutenberg/pull/64504
					if ( !query?.__fields && !query.context ) {
						const targetHints = records
							.filter( ( record ) => record?.[ ID_KEY ] )
							.map( ( record ) => ( {
								links: record?._links,
								id: record[ ID_KEY ],
								permissions: getUserPermissionsFromAllowHeader(
									record?._links?.self?.[ 0 ].targetHints.allow
								),
							} ) );

						const canUserResolutionsArgs: [ string, { namespace: string; collection: string; id: string } ][] = [];
						const receiveUserPermissionArgs: Record<string, boolean> = {};
						for ( const targetHint of targetHints ) {
							for ( const action of ALLOWED_RESOURCE_ACTIONS ) {
								canUserResolutionsArgs.push( [
									action,
									{ namespace, collection, id: targetHint.id },
								] );

								receiveUserPermissionArgs[
									getUserPermissionCacheKey( action, {
										namespace,
										collection,
										id: targetHint.id,
									} )
								] = targetHint.permissions[ action ];
							}
						}

						dispatch.receiveUserPermissions(
							receiveUserPermissionArgs
						);
						dispatch.finishResolutions(
							'getCollectionRecord',
							getResolutionsArgs( records )
						);
						dispatch.finishResolutions(
							'canUser',
							canUserResolutionsArgs
						);
					}

					dispatch.__unstableReleaseStoreLock( lock );
				} );
			} catch ( error ) {
				await throwWPError( error );
			} finally {
				dispatch.__unstableReleaseStoreLock( lock );
			}
		};

getCollectionRecords.shouldInvalidate = ( action, namespace: string, collection: string ) => {
	return (
		( [
			'DO_BATCH_COLLECTION_ACTION_FINISH',
			'DO_BULK_DELETE_COLLECTION_RECORDS_FINISH',
			'DO_BULK_UPDATE_COLLECTION_RECORDS_FINISH',
			'RECEIVE_COLLECTION_RECORDS',
			'REMOVE_ITEMS'
		].includes( action.type ) ) &&
		action.invalidateCache &&
		namespace === action.namespace &&
		collection === action.collection
	);
};

/**
 * Requests a collection's config from the REST API.
 *
 * @param {string} namespace Collection namespace.
 * @param {string} collection Collection name.
 */
export const getCollectionConfig =
	( namespace: string, collection: string ) =>
		async ( { dispatch } ) => {

			const config = await apiFetch<CollectionConfig>( {
				path: `/${ namespace }/v1/${ collection }/collection_schema`,
			} );

			if ( !config ) {
				return;
			}

			dispatch.addCollectionConfig( {
				...config,
				tabs: ( config.tabs && !Array.isArray( config.tabs ) ) ? config.tabs : undefined,
				namespace,
				collection,
				props: config.schema || [],
				baseURL: `/${ namespace }/v1/${ collection }`,
				baseURLParams: { context: DEFAULT_CONTEXT, uniqid: Math.random() },
				transientEdits: {
					selection: true,
				},
				mergedEdits: { metadata: true },
				key: DEFAULT_ENTITY_KEY,
				getTitle: ( record ) => {
					if ( config.id_prop ) {
						return record?.[ config.id_prop ]?.rendered || record?.[ config.id_prop ];
					}

					return String( record?.[ DEFAULT_ENTITY_KEY ] || '' );
				},
				supportsPagination: true,
			} );
		};
