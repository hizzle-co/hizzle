import type { Reducer } from 'redux';

/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import {
	conservativeMapItem,
	ifMatchingAction,
	replaceAction,
	onSubKey,
	getRawValue,
} from '../../../utils';
import { DEFAULT_ENTITY_KEY, DEFAULT_CONTEXT } from '../../../constants';
import getQueryParts from '../../get-query-parts';
import type { CollectionRecord, CollectionRecordKey } from '../../../types';
import type { collectionState } from '.';
import type {
	RemoveItemsAction,
	ReceiveCollectionRecordsAction,
	ReceiveCollectionRecordTabContentAction,
	ToggleAllCollectionRecordsSelectedAction,
	SetSelectedCollectionRecordsAction,
} from '../../actions';

type QueriedDataState = collectionState[ 'queriedData' ]

function getContextFromAction( action ) {
	const { query } = action;
	if ( !query ) {
		return DEFAULT_CONTEXT;
	}

	const queryParts = getQueryParts( query );
	return queryParts.context;
}

/**
 * Returns a merged array of item IDs, given details of the received paginated
 * items. The array is sparse-like with `undefined` entries where holes exist.
 *
 * @param {?Array<number>} itemIds     Original item IDs (default empty array).
 * @param {number[]}       nextItemIds Item IDs to merge.
 * @param {number}         page        Page of items merged.
 * @param {number}         perPage     Number of items per page.
 *
 * @return {number[]} Merged array of item IDs.
 */
function getMergedItemIds( itemIds: CollectionRecordKey[], nextItemIds: number[], page: number, perPage: number ): CollectionRecordKey[] {
	const receivedAllIds = page === 1 && perPage === -1;
	if ( receivedAllIds ) {
		return nextItemIds;
	}
	const nextItemIdsStartIndex = ( page - 1 ) * perPage;

	// If later page has already been received, default to the larger known
	// size of the existing array, else calculate as extending the existing.
	const size = Math.max(
		itemIds?.length ?? 0,
		nextItemIdsStartIndex + nextItemIds.length
	);

	// Preallocate array since size is known.
	const mergedItemIds = new Array( size );

	for ( let i = 0; i < size; i++ ) {
		// Preserve existing item ID except for subset of range of next items.
		// We need to check against the possible maximum upper boundary because
		// a page could receive fewer than what was previously stored.
		const isInNextItemsRange =
			i >= nextItemIdsStartIndex && i < nextItemIdsStartIndex + perPage;
		mergedItemIds[ i ] = isInNextItemsRange
			? nextItemIds[ i - nextItemIdsStartIndex ]
			: itemIds?.[ i ];
	}

	return mergedItemIds;
}

/**
 * Helper function to filter out records with certain IDs.
 * Records are keyed by their ID.
 *
 * @param {Object} records Record objects, keyed by record ID.
 * @param {Array}  ids     Record IDs to filter out.
 *
 * @return {Object} Filtered records.
 */
const removeRecordsById = (
	records: Record<CollectionRecordKey, CollectionRecord>,
	ids: CollectionRecordKey[] ): Record<CollectionRecordKey, CollectionRecord> => {
	return Object.fromEntries(
		Object.entries( records ).filter(
			( [ id ] ) =>
				!ids.some( ( itemId ) => {
					if ( Number.isInteger( itemId ) ) {
						return itemId === +id;
					}
					return itemId === id;
				} )
		)
	);
}

/**
 * Reducer tracking items state, keyed by ID. Items are assumed to be normal,
 * where identifiers are common across all queries.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Next state.
 */
const items = ( state: QueriedDataState[ 'items' ] = { view: {}, edit: {} }, action: RemoveItemsAction | ReceiveCollectionRecordsAction ): QueriedDataState[ 'items' ] => {
	switch ( action.type ) {
		case 'RECEIVE_COLLECTION_RECORDS': {
			const context = getContextFromAction( action );
			const key = action.key || DEFAULT_ENTITY_KEY;
			return {
				...state,
				[ context ]: {
					...state[ context ],
					...action.records.reduce( ( accumulator, value ) => {
						const itemId = getRawValue( value, key );

						accumulator[ itemId ] = conservativeMapItem(
							state?.[ context ]?.[ itemId ],
							value
						);
						return accumulator;
					}, {} ),
				},
			};
		}
		case 'REMOVE_ITEMS': {
			const result = { ...state };

			Object.keys( result ).forEach( ( context ) => {
				result[ context ] = removeRecordsById( result[ context ], action.itemIds );
			} );

			return result;
		}
	}
	return state;
}

/**
 * Reducer tracking item completeness, keyed by ID. A complete item is one for
 * which all fields are known. This is used in supporting `__fields` queries,
 * where not all properties associated with an entity are necessarily returned.
 * In such cases, completeness is used as an indication of whether it would be
 * safe to use queried data for a non-`__fields`-limited request.
 *
 * @param {Object<string,Object<string,boolean>>} state  Current state.
 * @param {Object}                                action Dispatched action.
 *
 * @return {Object<string,Object<string,boolean>>} Next state.
 */
const itemIsComplete = ( state: QueriedDataState[ 'itemIsComplete' ] = { view: {}, edit: {} }, action: RemoveItemsAction | ReceiveCollectionRecordsAction ): QueriedDataState[ 'itemIsComplete' ] => {
	switch ( action.type ) {
		case 'RECEIVE_COLLECTION_RECORDS': {

			const context = getContextFromAction( action );
			const { query, key = DEFAULT_ENTITY_KEY } = action;

			// An item is considered complete if it is received without an associated
			// fields query.
			const queryParts = query ? getQueryParts( query ) : { fields: [] };
			const isCompleteQuery =
				!query || !Array.isArray( queryParts.fields ) || queryParts.fields.length === 0;

			return {
				...state,
				[ context ]: {
					...state[ context ],
					...action.records.reduce( ( result, item ) => {
						const itemId = getRawValue( item, key );

						// Defer to completeness if already assigned. Technically the
						// data may be outdated if receiving items for a field subset.
						result[ itemId ] =
							state?.[ context ]?.[ itemId ] || isCompleteQuery;

						return result;
					}, {} ),
				},
			};
		}
		case 'REMOVE_ITEMS':
			const result = { ...state };

			Object.keys( result ).forEach( ( context ) => {
				result[ context ] = removeRecordsById( result[ context ], action.itemIds );
			} );

			return result;
	}

	return state;
}

/**
 * Composable for query reducers.
 */
const withQueryComposables = (
	cb: ( state: QueriedDataState[ 'queries' ][ 'context' ][ 'stableKey' ], action ) => QueriedDataState[ 'queries' ][ 'context' ][ 'stableKey' ]
) => {
	return compose(
		// Limit to matching action type so we don't attempt to replace action on
		// an unhandled action.
		ifMatchingAction( ( action ) => 'query' in action ),

		// Inject query parts into action for use both in `onSubKey` and reducer.
		replaceAction( ( action ) => {
			// `ifMatchingAction` still passes on initialization, where state is
			// undefined and a query is not assigned. Avoid attempting to parse
			// parts. `onSubKey` will omit by lack of `stableKey`.
			if ( action.query ) {
				return {
					...action,
					...getQueryParts( action.query ),
				};
			}

			return action;
		} ),

		// Items are keyed by context.
		onSubKey( 'context' ),

		// Queries shape is shared, but keyed by query `stableKey` part. Original
		// reducer tracks only a single query object.
		onSubKey( 'stableKey' ),
	)( cb ) as Reducer<QueriedDataState[ 'queries' ]>;
}

/**
 * Reducer tracking queries state, keyed by stable query key. Each reducer
 * query object includes `itemIds` and `requestingPageByPerPage`.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Next state.
 */
const receiveQueries = withQueryComposables( ( state, action ) => {
	const { page = 1, perPage = -1, key = DEFAULT_ENTITY_KEY } = action;

	return {
		itemIds: getMergedItemIds(
			state?.itemIds || [],
			action.records.map( ( item ) => getRawValue( item, key ) ).filter( Boolean ),
			page,
			perPage
		),
		meta: action.meta,
		// Reset selected and allSelected when receiving records.
		selected: {},
		allSelected: false,
	};
} );

/**
 * Reducer handling TOGGLE_ALL_COLLECTION_RECORDS_SELECTED action.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Next state.
 */
const toggleAllCollectionRecordsSelected = withQueryComposables( ( state, action ) => {
	const { selected } = action;

	return {
		...state,
		allSelected: selected !== undefined ? selected : !state.allSelected,
	};
} );

/**
 * Reducer handling TOGGLE_COLLECTION_RECORD_SELECTED action.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Next state.
 */
const setSelectedCollectionRecords = withQueryComposables( ( state, action ) => {
	const { selected } = action;

	return {
		...state,
		selected,
		allSelected: state.allSelected ? Object.values( selected ).every( Boolean ) : false,
	};
} );

/**
 * Reducer tracking queries state.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Next state.
 */
const queries = ( state: QueriedDataState[ 'queries' ] = { view: {}, edit: {} }, action: RemoveItemsAction | ReceiveCollectionRecordsAction | ToggleAllCollectionRecordsSelectedAction | SetSelectedCollectionRecordsAction ): QueriedDataState[ 'queries' ] => {
	switch ( action.type ) {
		case 'RECEIVE_COLLECTION_RECORDS':
			return receiveQueries( state, action );
		case 'REMOVE_ITEMS':
			const removedItems = action.itemIds.reduce( ( result, itemId ) => {
				result[ itemId ] = true;
				return result;
			}, {} as Record<CollectionRecordKey, boolean> );

			return Object.fromEntries(
				Object.entries( state ).map(
					( [ context, contextQueries ] ) => [
						context,
						Object.fromEntries(
							Object.entries( contextQueries ).map(
								( [ query, queryItems ] ) => [
									query,
									{
										itemIds: ( queryItems ).itemIds.filter(
											( queryId ) =>
												!removedItems[ queryId ]
										),
										meta: ( queryItems ).meta,
										selected: Object.fromEntries(
											Object.entries( ( queryItems ).selected ).filter(
												( [ queryId ] ) =>
													!removedItems[ queryId ]
											)
										),
										allSelected: ( queryItems ).allSelected
									},
								]
							)
						),
					]
				)
			);
		case 'TOGGLE_ALL_COLLECTION_RECORDS_SELECTED':
			return toggleAllCollectionRecordsSelected( state, action );
		case 'SET_SELECTED_COLLECTION_RECORDS':
			return setSelectedCollectionRecords( state, action );
		default:
			return state;
	}
};

/**
 * Reducer tracking item tab content, keyed by ID.
 *
 * @param {Object<string,Object<string,boolean>>} state  Current state.
 * @param {Object}                                action Dispatched action.
 *
 * @return {Object<string,Object<string,boolean>>} Next state.
 */
const tabs = ( state: QueriedDataState[ 'tabs' ] = {}, action: ReceiveCollectionRecordTabContentAction ): QueriedDataState[ 'tabs' ] => {
	if ( 'RECEIVE_COLLECTION_RECORD_TAB_CONTENT' === action.type ) {
		return {
			...state,
			[ action.recordId ]: {
				...state[ action.recordId ],
				[ action.tabName ]: action.content,
			},
		};
	}

	return state;
}

export const queriedData = combineReducers( {
	items,
	itemIsComplete,
	tabs,
	queries,
} );
