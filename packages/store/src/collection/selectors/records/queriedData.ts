/**
 * External dependencies
 */
import EquivalentKeyMap from 'equivalent-key-map';

/**
 * WordPress dependencies
 */
import { createSelector } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getNormalizedCommaSeparable, setNestedValue } from '../../../utils';
import { State, CollectionRecordKey, API_CONTEXT, CollectionRecord } from '../../../types';
import getQueryParts from '../../get-query-parts';
import { DEFAULT_CONTEXT } from '../../../constants';

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
		query?: Record<string, any>
	): CollectionRecord | Partial<CollectionRecord> | null | undefined => {
		const queriedState =
			state.collections.records?.[ namespace ]?.[ collection ]?.queriedData;
		if ( !queriedState ) {
			return undefined;
		}
		const context: API_CONTEXT = query?.context ?? DEFAULT_CONTEXT;

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
		const context: API_CONTEXT = query?.context ?? DEFAULT_CONTEXT;
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
		query?: Record<string, any>
	) => {
		const context = query?.context ?? DEFAULT_CONTEXT;
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
 * @param query Optional records query.
 *
 * @return  Whether entity records have been received.
 */
export function hasCollectionRecords(
	state: State,
	namespace: string,
	collection: string,
	query?: Record<string, any>
): boolean {
	return Array.isArray( getCollectionRecords( state, namespace, collection, query ) );
}

/**
 * Returns the Collection's records.
 *
 * @param state      State tree
 * @param namespace  The namespace of the collection.
 * @param collection The collection name.
 * @param query Optional records query. If requesting specific
 *              fields, fields must always include the ID.
 *
 * @return Records.
 */
export const getCollectionRecords = ( (
	state: State,
	namespace: string,
	collection: string,
	query?: Record<string, any>
): CollectionRecord[] | null => {
	// Queried data state is prepopulated for all known entities. If this is not
	// assigned for the given parameters, then it is known to not exist.
	const queriedState =
		state.collections.records?.[ namespace ]?.[ collection ]?.queriedData;
	if ( !queriedState ) {
		return null;
	}

	// Get the items for the given query.
	return getQueriedItems( queriedState, query );
} );

/**
 * Cache of state keys to EquivalentKeyMap where the inner map tracks queries
 * to their resulting items set. WeakMap allows garbage collection on expired
 * state references.
 *
 * @type {WeakMap<Object,EquivalentKeyMap>}
 */
const queriedItemsCacheByState = new WeakMap<any, EquivalentKeyMap>();

/**
 * Returns items for a given query, or null if the items are not known. Caches
 * result both per state (by reference) and per query (by deep equality).
 * The caching approach is intended to be durable to query objects which are
 * deeply but not referentially equal, since otherwise:
 *
 * `getQueriedItems( state, {} ) !== getQueriedItems( state, {} )`
 *
 * @param {Object}  state State object.
 * @param {?Object} query Optional query.
 *
 * @return {?Array} Query items.
 */
export const getQueriedItems = createSelector( ( state: State['collections']['records']['namespace']['collection']['queriedData'], query = {} ) => {
	let queriedItemsCache = queriedItemsCacheByState.get( state );
	if ( queriedItemsCache ) {
		const queriedItems = queriedItemsCache.get( query );
		if ( queriedItems !== undefined ) {
			return queriedItems;
		}
	} else {
		queriedItemsCache = new EquivalentKeyMap();
		queriedItemsCacheByState.set( state, queriedItemsCache );
	}

	const items = getQueriedItemsUncached( state, query );
	queriedItemsCache.set( query, items );
	return items;
} );

/**
 * Returns items for a given query, or null if the items are not known.
 *
 * @param {Object}  state State object.
 * @param {?Object} query Optional query.
 *
 * @return {?Array} Query items.
 */
function getQueriedItemsUncached( state: State['collections']['records']['namespace']['collection']['queriedData'], query?: Record<string, any> ) {
	const { stableKey, page, perPage, include, fields, context } =
		getQueryParts( query );

	// Fetch all item IDs for the given query.
	let itemIds: CollectionRecordKey[] | undefined;

	if ( state.queries?.[ context ]?.[ stableKey ] ) {
		itemIds = state.queries[ context ][ stableKey ].itemIds;
	}

	if ( ! Array.isArray( itemIds ) ) {
		return null;
	}

	// If we're requesting paged results, calculate the start and end offsets.
	const startOffset = perPage === -1 ? 0 : ( page - 1 ) * perPage;
	const endOffset =
		perPage === -1
			? itemIds.length
			: Math.min( startOffset + perPage, itemIds.length );

	// Initialize an empty array to store the filtered items.
	const items: CollectionRecord[] = [];

	// Iterate through the item IDs in the specified range.
	for ( let i = startOffset; i < endOffset; i++ ) {
		const itemId = itemIds[ i ];
		if ( Array.isArray( include ) && ! include.includes( itemId ) ) {
			continue;
		}
		if ( itemId === undefined ) {
			continue;
		}
		// Having a target item ID doesn't guarantee that this object has been queried.
		if ( ! state.items[ context ]?.hasOwnProperty( itemId ) ) {
			return null;
		}

		// Get the item from the state.
		const item = state.items[ context ][ itemId ];

		// Initialize an empty object to store the filtered item.
		let filteredItem: any;
		if ( Array.isArray( fields ) && fields.length > 0 ) {
			filteredItem = {};

			// Iterate through the fields in the specified array.
			for ( let f = 0; f < fields.length; f++ ) {
				const field = fields[ f ].split( '.' );
				let value = item;
				field.forEach( ( fieldName ) => {
					value = value?.[ fieldName ];
				} );

				setNestedValue( filteredItem, field, value );
			}
		} else {
			// If expecting a complete item, validate that completeness, or
			// otherwise abort.
			if ( ! state.itemIsComplete[ context ]?.[ itemId ] ) {
				return null;
			}

			// Add the complete item to the items array.
			filteredItem = item;
		}

		items.push( filteredItem );
	}

	return items;
}

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
	query: Record<string, any>
): number | null => {
	// Queried data state is prepopulated for all known collections. If this is not
	// assigned for the given parameters, then it is known to not exist.
	const queriedState =
		state.collections.records?.[ namespace ]?.[ collection ]?.queriedData;
	if ( !queriedState ) {
		return null;
	}

	const { stableKey, context } = getQueryParts( query );
	return queriedState.queries?.[ context ]?.[ stableKey ]?.meta?.totalItems ?? null;
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
	query: Record<string, any>
): number | null => {
	// Queried data state is prepopulated for all known collections. If this is not
	// assigned for the given parameters, then it is known to not exist.
	const queriedState =
		state.collections.records?.[ namespace ]?.[ collection ]?.queriedData;
	if ( !queriedState ) {
		return null;
	}

	// If we're requesting all items, return 1 page.
	if ( query.per_page === -1 ) {
		return 1;
	}

	const { stableKey, context, perPage } = getQueryParts( query );

	// If `per_page` is not set, get the info from query's meta.
	if ( !query.per_page ) {
		const totalPages = queriedState.queries?.[ context ]?.[ stableKey ]?.meta?.totalPages;

		if ( totalPages ) {
			return totalPages;
		}
	}

	// Get the total number of items.
	const totalItems = queriedState.queries?.[ context ]?.[ stableKey ]?.meta?.totalItems ?? null;
	if ( !totalItems ) {
		return null;
	}

	// Return the total number of pages.
	return Math.ceil( totalItems / perPage );
};
