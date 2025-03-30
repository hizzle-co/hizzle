/**
 * WordPress dependencies
 */
import { createSelector } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	getQueriedItems,
	getQueriedTotalItems,
	getQueriedTotalPages,
} from './collection';
import { DEFAULT_ENTITY_KEY } from './constants';
import {
	getNormalizedCommaSeparable,
	setNestedValue,
	getUserPermissionCacheKey,
} from './utils';
import { CollectionConfig, State, CollectionRecordKey, API_CONTEXT, CollectionRecord } from './types';

/**
 * HTTP Query parameters sent with the API request to fetch the entity records.
 */
export type GetRecordsHttpQuery = Record<string, any>;

type Optional<T> = T | undefined;

/**
 * Arguments for CollectionRecord selectors.
 */
export type CollectionResource = { namespace: string; collection: string; id?: CollectionRecordKey };

/**
 * Returns the collection config given its namespace and collection name.
 *
 * @param state Data state.
 * @param namespace  The namespace of the collections.
 * @param collection The collection name.
 *
 * @return Collection config
 */
export function getCollectionConfig(
	state: State,
	namespace: string,
	collection: string
): CollectionConfig | undefined {
	return state.collections?.config?.[ namespace ]?.[ collection ];
}

/**
 * Returns the Collection's record object by key. Returns `null` if the record is not
 * yet received, undefined if the record is known to not exist, or the
 * record object if it exists and is received.
 *
 * @param state      State tree
 * @param namespace  The namespace of the collection.
 * @param collection The collection name.
 * @param key        Record's key / id.
 * @param query      Optional query. If requesting specific
 *                   fields, fields must always include the ID.
 *
 * @return Record.
 */
export const getCollectionRecord = createSelector(
	( (
		state: State,
		namespace: string,
		collection: string,
		key: CollectionRecordKey,
		query?: GetRecordsHttpQuery
	): CollectionRecord | Partial<CollectionRecord> | null | undefined => {
		const queriedState =
			state.collections.records?.[ namespace ]?.[ collection ]?.queriedData;
		if ( !queriedState ) {
			return undefined;
		}
		const context: API_CONTEXT = query?.context ?? 'edit';

		if ( query === undefined ) {
			// If expecting a complete item, validate that completeness.
			if ( !queriedState.itemIsComplete[ context ]?.[ key ] ) {
				return undefined;
			}

			return queriedState.items[ context ][ key ];
		}

		const item = queriedState.items[ context ]?.[ key ];
		if ( item && query._fields ) {
			const filteredItem = {};
			const fields = getNormalizedCommaSeparable( query._fields ) ?? [];
			for ( let f = 0; f < fields.length; f++ ) {
				const field = fields[ f ].split( '.' );
				let value = item;
				field.forEach( ( fieldName ) => {
					value = value?.[ fieldName ];
				} );
				setNestedValue( filteredItem, field, value );
			}
			return filteredItem as Partial<CollectionRecord>;
		}

		return item;
	} ),
	( state: State, namespace, collection, recordId, query ) => {
		const context: API_CONTEXT = query?.context ?? 'edit';
		return [
			state.collections.records?.[ namespace ]?.[ collection ]?.queriedData?.items[
			context
			]?.[ recordId ],
			state.collections.records?.[ namespace ]?.[ collection ]?.queriedData
				?.itemIsComplete[ context ]?.[ recordId ],
		];
	}
);

/**
 * Returns the Collection's record object by key.
 *
 * Doesn't trigger a resolver nor requests the collection records from the API
 * if the record isn't available in the local state.
 *
 * @param state      State tree
 * @param namespace  The namespace of the collection.
 * @param collection The collection name.
 * @param key        Record's key / id.
 *
 * @return Record.
 */
export function getCollectionRecordNoResolver( state: State, namespace: string, collection: string, key: CollectionRecordKey ) {
	return getCollectionRecord( state, namespace, collection, key );
}

/**
 * Returns the collection's record object by key,
 * with its attributes mapped to their raw values.
 *
 * @param state State tree.
 * @param namespace  The namespace of the collection.
 * @param collection The collection name.
 * @param key   Record's key.
 *
 * @return Object with the collection's raw attributes.
 */
export const getRawCollectionRecord = createSelector(
	(
		state: State,
		namespace: string,
		collection: string,
		key: CollectionRecordKey
	): CollectionRecord | undefined => {
		const record = getCollectionRecord(
			state,
			namespace,
			collection,
			key
		);
		return (
			record &&
			Object.keys( record ).reduce( ( accumulator, _key ) => {
				if (
					record[ _key ] &&
					typeof record[ _key ] === 'object' &&
					record[ _key ]?.raw !== undefined
				) {
					accumulator[ _key ] = record[ _key ]?.raw;
				} else {
					accumulator[ _key ] = record[ _key ];
				}
				return accumulator;
			}, {} as any )
		);
	},
	(
		state: State,
		namespace: string,
		collection: string,
		recordId: CollectionRecordKey,
		query?: GetRecordsHttpQuery
	) => {
		const context = query?.context ?? 'edit';
		return [
			state.collections.config,
			state.collections.records?.[ namespace ]?.[ collection ]?.queriedData?.items[
			context
			]?.[ recordId ],
			state.collections.records?.[ namespace ]?.[ collection ]?.queriedData
				?.itemIsComplete[ context ]?.[ recordId ],
		];
	}
);

/**
 * Returns true if records have been received for the given set of parameters,
 * or false otherwise.
 *
 * @param state State tree
 * @param namespace  The namespace of the collection.
 * @param collection The collection name.
 * @param query Optional terms query. For valid query parameters see the [Reference](https://developer.wordpress.org/rest-api/reference/) in the REST API Handbook and select the entity kind. Then see the arguments available for "List [Entity kind]s".
 *
 * @return  Whether entity records have been received.
 */
export function hasCollectionRecords(
	state: State,
	namespace: string,
	collection: string,
	query?: GetRecordsHttpQuery
): boolean {
	return Array.isArray( getCollectionRecords( state, namespace, collection, query ) );
}

/**
 * Returns the Collection's records.
 *
 * @param state      State tree
 * @param namespace  The namespace of the collection.
 * @param collection The collection name.
 * @param query Optional terms query. If requesting specific
 *              fields, fields must always include the ID.
 *
 * @return Records.
 */
export const getCollectionRecords = ( (
	state: State,
	namespace: string,
	collection: string,
	query?: GetRecordsHttpQuery
): CollectionRecord[] | null => {
	// Queried data state is prepopulated for all known entities. If this is not
	// assigned for the given parameters, then it is known to not exist.
	const queriedState =
		state.collections.records?.[ namespace ]?.[ collection ]?.queriedData;
	if ( !queriedState ) {
		return null;
	}
	return getQueriedItems( queriedState, query );
} );

/**
 * Returns the Collection's total available records for a given query (ignoring pagination).
 *
 * @param state State tree
 * @param namespace  The namespace of the collection.
 * @param collection The collection name.
 * @param query Optional terms query. If requesting specific
 *              fields, fields must always include the ID.
 *
 * @return number | null.
 */
export const getCollectionRecordsTotalItems = (
	state: State,
	namespace: string,
	collection: string,
	query: GetRecordsHttpQuery
): number | null => {
	// Queried data state is prepopulated for all known collections. If this is not
	// assigned for the given parameters, then it is known to not exist.
	const queriedState =
		state.collections.records?.[ namespace ]?.[ collection ]?.queriedData;
	if ( !queriedState ) {
		return null;
	}
	return getQueriedTotalItems( queriedState, query );
};

/**
 * Returns the number of available pages for the given query.
 *
 * @param state      State tree
 * @param namespace  The namespace of the collection.
 * @param collection The collection name.
 * @param query Optional terms query. If requesting specific
 *              fields, fields must always include the ID.
 *
 * @return number | null.
 */
export const getCollectionRecordsTotalPages = (
	state: State,
	namespace: string,
	collection: string,
	query: GetRecordsHttpQuery
): number | null => {
	// Queried data state is prepopulated for all known collections. If this is not
	// assigned for the given parameters, then it is known to not exist.
	const queriedState =
		state.collections.records?.[ namespace ]?.[ collection ]?.queriedData;
	if ( !queriedState ) {
		return null;
	}
	if ( query.per_page === -1 ) {
		return 1;
	}
	const totalItems = getQueriedTotalItems( queriedState, query );
	if ( !totalItems ) {
		return totalItems;
	}
	// If `per_page` is not set and the query relies on the defaults of the
	// REST endpoint, get the info from query's meta.
	if ( !query.per_page ) {
		return getQueriedTotalPages( queriedState, query );
	}
	return Math.ceil( totalItems / query.per_page );
};

type DirtyCollectionRecord = {
	title: string;
	key: CollectionRecordKey;
	namespace: string;
	collection: string;
};

/**
 * Returns the list of dirty collection records.
 *
 * @param state State tree.
 *
 * @return The list of updated records
 */
export const getDirtyCollectionRecords = createSelector(
	( state: State ): Array<DirtyCollectionRecord> => {
		const {
			collections: { records },
		} = state;
		const dirtyRecords: DirtyCollectionRecord[] = [];
		Object.keys( records ).forEach( ( namespace ) => {
			Object.keys( records[ namespace ] ).forEach( ( collection ) => {
				const primaryKeys = (
					Object.keys( records[ namespace ][ collection ].edits ) as string[]
				).filter(
					( primaryKey ) =>
						// The collection record must exist (not be deleted),
						// and it must have edits.
						getCollectionRecord( state, namespace, collection, primaryKey ) &&
						hasEditsForCollectionRecord( state, namespace, collection, primaryKey )
				);

				if ( primaryKeys.length ) {
					const collectionConfig = getCollectionConfig( state, namespace, collection );
					primaryKeys.forEach( ( primaryKey ) => {
						const collectionRecord = getEditedCollectionRecord(
							state,
							namespace,
							collection,
							primaryKey
						);
						dirtyRecords.push( {
							// We avoid using primaryKey because it's transformed into a string
							// when it's used as an object key.
							key: collectionRecord
								? collectionRecord[
								collectionConfig?.key || DEFAULT_ENTITY_KEY
								]
								: undefined,
							title:
								collectionConfig?.getTitle?.( collectionRecord ) || '',
							collection,
							namespace,
						} );
					} );
				}
			} );
		} );

		return dirtyRecords;
	},
	( state ) => [ state.entities.records ]
);

/**
 * Returns the list of collections currently being saved.
 *
 * @param state State tree.
 *
 * @return The list of records being saved.
 */
export const getCollectionRecordsBeingSaved = createSelector(
	( state: State ): Array<DirtyCollectionRecord> => {
		const {
			collections: { records },
		} = state;
		const recordsBeingSaved: DirtyCollectionRecord[] = [];
		Object.keys( records ).forEach( ( namespace ) => {
			Object.keys( records[ namespace ] ).forEach( ( collection ) => {
				const primaryKeys = (
					Object.keys( records[ namespace ][ collection ].saving ) as string[]
				).filter( ( primaryKey ) =>
					isSavingCollectionRecord( state, namespace, collection, primaryKey )
				);

				if ( primaryKeys.length ) {
					const collectionConfig = getCollectionConfig( state, namespace, collection );
					primaryKeys.forEach( ( primaryKey ) => {
						const collectionRecord = getEditedCollectionRecord(
							state,
							namespace,
							collection,
							primaryKey
						);
						recordsBeingSaved.push( {
							// We avoid using primaryKey because it's transformed into a string
							// when it's used as an object key.
							key: collectionRecord
								? collectionRecord[
								collectionConfig?.key || DEFAULT_ENTITY_KEY
								]
								: undefined,
							title:
								collectionConfig?.getTitle?.( collectionRecord ) || '',
							collection,
							namespace,
						} );
					} );
				}
			} );
		} );
		return recordsBeingSaved;
	},
	( state: State ) => [ state.collections.records ]
);

/**
 * Returns the specified collection record's edits.
 *
 * @param state    State tree.
 * @param namespace  Record namespace.
 * @param collection Record collection.
 * @param recordId   Record ID.
 *
 * @return The collection record's edits.
 */
export function getCollectionRecordEdits(
	state: State,
	namespace: string,
	collection: string,
	recordId: CollectionRecordKey
): Optional<any> {
	return state.collections.records?.[ namespace ]?.[ collection ]?.edits?.[
		recordId
	];
}

/**
 * Returns the specified collection record's non transient edits.
 *
 * Transient edits don't create an undo level, and
 * are not considered for change detection.
 * They are defined in the collection's config.
 *
 * @param state      State tree.
 * @param namespace  Record namespace.
 * @param collection Record collection.
 * @param recordId   Record ID.
 *
 * @return The collection record's non transient edits.
 */
export const getCollectionRecordNonTransientEdits = createSelector(
	(
		state: State,
		namespace: string,
		collection: string,
		recordId: CollectionRecordKey
	): Optional<any> => {
		const { transientEdits } = getCollectionConfig( state, namespace, collection ) || {};
		const edits = getCollectionRecordEdits( state, namespace, collection, recordId ) || {};
		if ( !transientEdits ) {
			return edits;
		}
		return Object.keys( edits ).reduce( ( acc, key ) => {
			if ( !transientEdits[ key ] ) {
				acc[ key ] = edits[ key ];
			}
			return acc;
		}, {} );
	},
	( state: State, namespace: string, collection: string, recordId: CollectionRecordKey ) => [
		state.collections.config,
		state.collections.records?.[ namespace ]?.[ collection ]?.edits?.[ recordId ],
	]
);

/**
 * Returns true if the specified collection record has edits,
 * and false otherwise.
 *
 * @param state      State tree.
 * @param namespace  Record namespace.
 * @param collection Record collection.
 * @param recordId   Record ID.
 *
 * @return Whether the collection record has edits or not.
 */
export function hasEditsForCollectionRecord(
	state: State,
	namespace: string,
	collection: string,
	recordId: CollectionRecordKey
): boolean {
	return (
		isSavingCollectionRecord( state, namespace, collection, recordId ) ||
		Object.keys(
			getCollectionRecordEdits( state, namespace, collection, recordId )
		).length > 0
	);
}

/**
 * Returns the specified collection record, merged with its edits.
 *
 * @param state      State tree.
 * @param namespace  Record namespace.
 * @param collection Record collection.
 * @param recordId   Record ID.
 *
 * @return The collection record, merged with its edits.
 */
export const getEditedCollectionRecord = createSelector( (
	state: State,
	namespace: string,
	collection: string,
	recordId: CollectionRecordKey
): CollectionRecord | undefined => {
	const raw = getRawCollectionRecord( state, namespace, collection, recordId );
	const edited = getCollectionRecordEdits( state, namespace, collection, recordId );

	if ( !raw && !edited ) {
		return;
	}
	return {
		...raw,
		...edited,
	};
},
	(
		state: State,
		namespace: string,
		collection: string,
		recordId: CollectionRecordKey,
		query?: GetRecordsHttpQuery
	) => {
		const context = query?.context ?? 'edit';
		return [
			state.collections.config,
			state.collections.records?.[ namespace ]?.[ collection ]?.queriedData.items[
			context
			]?.[ recordId ],
			state.collections.records?.[ namespace ]?.[ collection ]?.queriedData
				.itemIsComplete[ context ]?.[ recordId ],
			state.collections.records?.[ namespace ]?.[ collection ]?.edits?.[ recordId ],
		];
	}
);

/**
 * Returns true if the specified collection record is saving, and false otherwise.
 *
 * @param state      State tree.
 * @param namespace  Record namespace.
 * @param collection Record collection.
 * @param recordId   Record ID.
 *
 * @return Whether the collection record is saving or not.
 */
export function isSavingCollectionRecord(
	state: State,
	namespace: string,
	collection: string,
	recordId: CollectionRecordKey
): boolean {
	return (
		state.collections.records?.[ namespace ]?.[ collection ]?.saving?.[
			recordId as CollectionRecordKey
		]?.pending ?? false
	);
}

/**
 * Returns true if the specified collection record is deleting, and false otherwise.
 *
 * @param state      State tree.
 * @param namespace  Record namespace.
 * @param collection Record collection.
 * @param recordId   Record ID.
 *
 * @return Whether the collection record is deleting or not.
 */
export function isDeletingCollectionRecord(
	state: State,
	namespace: string,
	collection: string,
	recordId: CollectionRecordKey
): boolean {
	return (
		state.collections.records?.[ namespace ]?.[ collection ]?.deleting?.[
			recordId as CollectionRecordKey
		]?.pending ?? false
	);
}

/**
 * Returns the specified collection record's last save error.
 *
 * @param state    State tree.
 * @param namespace  Record namespace.
 * @param collection Record collection.
 * @param recordId Record ID.
 *
 * @return The collection record's save error.
 */
export function getLastCollectionSaveError(
	state: State,
	namespace: string,
	collection: string,
	recordId: CollectionRecordKey
): any {
	return state.collections?.records?.[ namespace ]?.[ collection ]?.saving?.[ recordId ]
		?.error;
}

/**
 * Returns the specified collection record's last delete error.
 *
 * @param state      State tree.
 * @param namespace  Record namespace.
 * @param collection Record collection.
 * @param recordId Record ID.
 *
 * @return The collection record's save error.
 */
export function getLastCollectionDeleteError(
	state: State,
	namespace: string,
	collection: string,
	recordId: CollectionRecordKey
) {
	return state.collections?.records?.[ namespace ]?.[ collection ]?.deleting?.[ recordId ]
		?.error;
}

/**
 * Returns the previous edit from the current undo offset
 * for the entity records edits history, if any.
 *
 * @param state State tree.
 *
 * @return The undo manager.
 */
export function getUndoManager( state: State ) {
	return state.undoManager;
}

/**
 * Returns true if there is a previous edit from the current undo offset
 * for the collection records edits history, and false otherwise.
 *
 * @param state State tree.
 *
 * @return Whether there is a previous edit or not.
 */
export function hasUndo( state: State ): boolean {
	return state.undoManager.hasUndo();
}

/**
 * Returns true if there is a next edit from the current undo offset
 * for the collection records edits history, and false otherwise.
 *
 * @param state State tree.
 *
 * @return Whether there is a next edit or not.
 */
export function hasRedo( state: State ): boolean {
	return state.undoManager.hasRedo();
}

/**
 * Returns whether the current user can perform the given action on the given
 * REST resource.
 *
 * Calling this may trigger an OPTIONS request to the REST API via the
 * `canUser()` resolver.
 *
 * https://developer.wordpress.org/rest-api/reference/
 *
 * @param state    Data state.
 * @param action   Action to check. One of: 'create', 'read', 'update', 'delete'.
 * @param resource Entity resource to check. Accepts entity object `{ namespace: 'noptin', collection: 'subscribers', id: 1 }`.
 * @param id       Optional ID of the rest resource to check.
 *
 * @return Whether or not the user can perform the action,
 *                             or `undefined` if the OPTIONS request is still being made.
 */
export function canUser(
	state: State,
	action: string,
	resource: CollectionResource,
): boolean | undefined {
	if ( !resource.namespace || !resource.collection ) {
		return false;
	}

	return state.userPermissions[ getUserPermissionCacheKey( action, resource ) ];
}

/**
 * Returns the collection records permissions for the given collection record ids.
 */
export const getCollectionRecordsPermissions = createSelector(
	(
		state: State,
		namespace: string,
		collection: string,
		ids: string | string[]
	) => {
		const normalizedIds = Array.isArray( ids ) ? ids : [ ids ];
		return normalizedIds.map( ( id ) => ( {
			delete: canUser( state, 'delete', { namespace, collection, id } ),
			update: canUser( state, 'update', { namespace, collection, id } ),
		} ) );
	},
	( state ) => [ state.userPermissions ]
);

/**
 * Returns the collection record permissions for the given collection record id.
 *
 * @param state Data state.
 * @param namespace  Collection namespace.
 * @param collection Collection name.
 * @param id    Collection record id.
 *
 * @return The collection record permissions.
 */
export function getCollectionRecordPermissions(
	state: State,
	namespace: string,
	collection: string,
	id: string
) {
	return getCollectionRecordsPermissions( state, namespace, collection, id )[ 0 ];
}

/**
 * Returns a new reference when edited values have changed. This is useful in
 * inferring where an edit has been made between states by comparison of the
 * return values using strict equality.
 *
 * @example
 *
 * ```
 * const hasEditOccurred = (
 *    getReferenceByDistinctEdits( beforeState ) !==
 *    getReferenceByDistinctEdits( afterState )
 * );
 * ```
 *
 * @param state Editor state.
 *
 * @return A value whose reference will change only when an edit occurs.
 */
export function getReferenceByDistinctEdits( state: State ) {
	return state.editsReference;
}
