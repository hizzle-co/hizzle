/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { config } from './config';
import { records } from './records';
import { State } from '../../types';

export type CollectionsState = {
    config: State[ 'collections' ][ 'config' ];
    records: State[ 'collections' ][ 'records' ];
    reducer?: ( state: State[ 'collections' ][ 'records' ], action ) => State[ 'collections' ][ 'records' ];
};

/**
 * Reducer keeping track of the registered collections config and data.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export const collectionsReducer = ( state: CollectionsState = { config: {}, records: {} }, action ) => {
	const newConfig = config( state.config, action );

	// Generates a dynamic reducers for the collections.
	let collectionsDataReducer = state.reducer;
	if ( ! collectionsDataReducer || newConfig !== state.config ) {
		collectionsDataReducer = combineReducers<CollectionsState[ 'records' ]>(
			Object.entries( newConfig ).reduce(
				( memo, [ namespace, collections ] ) => {
					const namespaceReducer = combineReducers(
						Object.entries( collections ).reduce<Record<string, ReturnType<typeof records>>>(
							( namespaceMemo, [ collection, collectionConfig ] ) => ( {
								...namespaceMemo,
								[ collection ]: records( collectionConfig ),
							} ),
							{}
						)
					);

					memo[ namespace ] = namespaceReducer;
					return memo;
				},
				{}
			)
		);
	}

	const newData = collectionsDataReducer ? collectionsDataReducer( state.records, action ) : state.records;

	if (
		newData === state.records &&
		newConfig === state.config &&
		collectionsDataReducer === state.reducer
	) {
		return state;
	}

	return {
		reducer: collectionsDataReducer,
		records: newData,
		config: newConfig,
	};
};
