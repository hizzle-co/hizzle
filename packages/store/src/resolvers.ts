/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { STORE_NAME } from './constants';
import { DEFAULT_ENTITY_KEY } from './collections';
import {
	forwardResolver,
	getNormalizedCommaSeparable,
	getUserPermissionCacheKey,
	getUserPermissionsFromAllowHeader,
	ALLOWED_RESOURCE_ACTIONS,
	RECEIVE_INTERMEDIATE_RESULTS,
} from './utils';
import { CollectionRecordKey, GetRecordsHttpQuery } from './selectors';
import { CollectionConfig } from './types';

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
			const configs = await resolveSelect.getCollectionsConfig( namespace );
			const entityConfig = configs.find(
				( config ) => config.collection === collection
			);
			if ( !entityConfig ) {
				return;
			}

			const lock = await dispatch.__unstableAcquireStoreLock(
				STORE_NAME,
				[ 'collections', 'records', namespace, collection, key ],
				{ exclusive: false }
			);

			try {
				if ( query !== undefined && query._fields ) {
					// If requesting specific fields, items and query association to said
					// records are stored by ID reference. Thus, fields must always include
					// the ID.
					query = {
						...query,
						_fields: [
							...new Set( [
								...( getNormalizedCommaSeparable(
									query._fields
								) || [] ),
								entityConfig.key || DEFAULT_ENTITY_KEY,
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
						...query,
					}
				);

				if ( query !== undefined && query._fields ) {
					query = { ...query, include: [ key ] };

					// The resolution cache won't consider query as reusable based on the
					// fields, so it's tested here, prior to initiating the REST request,
					// and without causing `getRecords` resolution to occur.
					const hasRecords = select.hasRecords(
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
					dispatch.receiveRecords( namespace, collection, [ record ], query );
					dispatch.receiveUserPermissions(
						receiveUserPermissionArgs
					);
					dispatch.finishResolutions(
						'canUser',
						canUserResolutionsArgs
					);
				} );
			} finally {
				dispatch.__unstableReleaseStoreLock( lock );
			}
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
			const configs: CollectionConfig[] = await resolveSelect.getCollectionsConfig( namespace );
			const entityConfig = configs.find(
				( config ) => config.collection === collection
			);
			if ( !entityConfig ) {
				return;
			}

			const lock = await dispatch.__unstableAcquireStoreLock(
				STORE_NAME,
				[ 'collections', 'records', namespace, collection ],
				{ exclusive: false }
			);

			const key = entityConfig.key || DEFAULT_ENTITY_KEY;

			function getResolutionsArgs( records ) {
				return records
					.filter( ( record ) => record?.[ key ] )
					.map( ( record ) => [ namespace, collection, record[ key ] ] );
			}

			try {
				if ( query._fields ) {
					// If requesting specific fields, items and query association to said
					// records are stored by ID reference. Thus, fields must always include
					// the ID.
					query = {
						...query,
						_fields: [
							...new Set( [
								...( getNormalizedCommaSeparable( query._fields ) ||
									[] ),
								key,
							] ),
						].join(),
					};
				}

				const path = addQueryArgs( entityConfig.baseURL, {
					...entityConfig.baseURLParams,
					...query,
				} );

				let records: Record<string, any>[] = [],
					meta: { totalItems: number; totalPages: number; };
				if ( entityConfig.supportsPagination && query.per_page !== -1 ) {
					const response = await apiFetch<Response>( { path, parse: false } );
					records = Object.values( await response.json() );
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
					query[ RECEIVE_INTERMEDIATE_RESULTS ] === true
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
							dispatch.receiveRecords(
								namespace,
								collection,
								records,
								query
							);
							dispatch.finishResolutions(
								'getRecord',
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
				if ( query._fields ) {
					records = records.map( ( record ) => {
						query._fields.split( ',' ).forEach( ( field ) => {
							if ( !record.hasOwnProperty( field ) ) {
								record[ field ] = undefined;
							}
						} );

						return record;
					} );
				}

				registry.batch( () => {
					dispatch.receiveRecords(
						namespace,
						collection,
						records,
						query,
						false,
						undefined,
						meta
					);

					// When requesting all fields, the list of results can be used to resolve
					// the `getRecord` and `canUser` selectors in addition to `getRecords`.
					// See https://github.com/WordPress/gutenberg/pull/26575
					// See https://github.com/WordPress/gutenberg/pull/64504
					if ( !query?._fields && !query.context ) {
						const targetHints = records
							.filter( ( record ) => record?.[ key ] )
							.map( ( record ) => ( {
								id: record[ key ],
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
							'getRecord',
							getResolutionsArgs( records )
						);
						dispatch.finishResolutions(
							'canUser',
							canUserResolutionsArgs
						);
					}

					dispatch.__unstableReleaseStoreLock( lock );
				} );
			} finally {
				dispatch.__unstableReleaseStoreLock( lock );
			}
		};

getCollectionRecords.shouldInvalidate = ( action, namespace: string, collection: string ) => {
	return (
		( action.type === 'RECEIVE_ITEMS' || action.type === 'REMOVE_ITEMS' ) &&
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
				namespace,
				collection,
				baseURL: `/${ namespace }/v1/${ collection }`,
				baseURLParams: { context: 'edit' },
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
