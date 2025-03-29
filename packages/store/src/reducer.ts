/**
 * External dependencies
 */
import fastDeepEqual from 'fast-deep-equal/es6';

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { combineReducers } from '@wordpress/data';
import { createUndoManager } from '@wordpress/undo-manager';
import type { HistoryChange } from '@wordpress/undo-manager';

/**
 * Internal dependencies
 */
import { ifMatchingAction, replaceAction } from './utils';
import { reducer as queriedDataReducer } from './queried-data';
import { DEFAULT_ENTITY_KEY } from './collections';
import { CollectionConfig } from './types';
import { State } from './selectors';

const withMultiCollectionRecordEdits = ( reducer ) => ( state, action ) => {
	if ( action.type === 'UNDO' || action.type === 'REDO' ) {
		const { record } = action;

		let newState = state;
		record.forEach( ( { id: { namespace, collection, recordId }, changes } ) => {
			newState = reducer( newState, {
				type: 'EDIT_COLLECTION_RECORD',
				namespace,
				collection,
				recordId,
				edits: Object.entries( changes as HistoryChange[] ).reduce(
					( acc, [ key, value ] ) => {
						acc[ key ] =
							action.type === 'UNDO' ? value.from : value.to;
						return acc;
					},
					{}
				),
			} );
		} );
		return newState;
	}

	return reducer( state, action );
};

type collectionState = State['collections']['records']['namespace']['collection']
type deleting = collectionState['deleting']
type saving = collectionState['saving']
type edits = collectionState['edits']

/**
 * Higher Order Reducer for a given collection config. It supports:
 *
 *  - Fetching
 *  - Editing
 *  - Saving
 *
 * @param {Object} collectionConfig Collection config.
 *
 * @return {AnyFunction} Reducer.
 */
function collection( collectionConfig: CollectionConfig ) {
	return compose( [
		withMultiCollectionRecordEdits,

		// Limit to matching action type so we don't attempt to replace action on
		// an unhandled action.
		ifMatchingAction(
			( action ) =>
				action.collection &&
				action.namespace &&
				action.collection === collectionConfig.collection &&
				action.namespace === collectionConfig.namespace
		),

		// Inject the entity config into the action.
		replaceAction( ( action ) => {
			return {
				key: entityConfig.key || DEFAULT_ENTITY_KEY,
				...action,
			};
		} ),
	] )(
		combineReducers( {
			queriedData: queriedDataReducer,
			edits: ( state: collectionState['edits'] = {}, action ) => {
				switch ( action.type ) {
					case 'RECEIVE_ITEMS':
						const context = action?.query?.context ?? 'edit';
						if ( context !== 'edit' ) {
							return state;
						}

						const nextState = { ...state };

						for ( const record of action.items ) {
							const recordId = record?.[ action.key ];
							const edits = nextState[ recordId ];
							if ( ! edits ) {
								continue;
							}

							const nextEdits = Object.keys( edits ).reduce(
								( acc, key ) => {
									// If the edited value is still different to the persisted value,
									// keep the edited value in edits.
									if (
										// Edits are the "raw" attribute values, but records may have
										// objects with more properties, so we use `get` here for the
										// comparison.
										! fastDeepEqual(
											edits[ key ],
											record[ key ]?.raw ?? record[ key ]
										) &&
										// Sometimes the server alters the sent value which means
										// we need to also remove the edits before the api request.
										( ! action.persistedEdits ||
											! fastDeepEqual(
												edits[ key ],
												action.persistedEdits[ key ]
											) )
									) {
										acc[ key ] = edits[ key ];
									}
									return acc;
								},
								{}
							);

							if ( Object.keys( nextEdits ).length ) {
								nextState[ recordId ] = nextEdits;
							} else {
								delete nextState[ recordId ];
							}
						}

						return nextState;

					case 'EDIT_COLLECTION_RECORD':
						const nextEdits = {
							...state[ action.recordId ],
							...action.edits,
						};
						Object.keys( nextEdits ).forEach( ( key ) => {
							// Delete cleared edits so that the properties
							// are not considered dirty.
							if ( nextEdits[ key ] === undefined ) {
								delete nextEdits[ key ];
							}
						} );
						return {
							...state,
							[ action.recordId ]: nextEdits,
						};
				}

				return state;
			},

			saving: ( state: saving = {}, action ) => {
				switch ( action.type ) {
					case 'SAVE_COLLECTION_RECORD_START':
					case 'SAVE_COLLECTION_RECORD_FINISH':
						return {
							...state,
							[ action.recordId ]: {
								pending:
									action.type === 'SAVE_COLLECTION_RECORD_START',
								error: action.error,
							},
						};
				}

				return state;
			},

			deleting: ( state: deleting = {}, action ) => {
				switch ( action.type ) {
					case 'DELETE_COLLECTION_RECORD_START':
					case 'DELETE_COLLECTION_RECORD_FINISH':
						return {
							...state,
							[ action.recordId ]: {
								pending:
									action.type ===
									'DELETE_COLLECTION_RECORD_START',
								error: action.error,
							},
						};
				}

				return state;
			},
		} )
	);
}

/**
 * Reducer keeping track of the registered collection configs.
 *
 * @param {Array} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Array} Updated state.
 */
export function collectionsConfig( state: State['collections']['config'] = {}, action: { type: string, config: CollectionConfig } ) {
	switch ( action.type ) {
		case 'ADD_COLLECTION_CONFIG':
			return {
				...state,
				[ action.config.namespace ]: {
					...state[ action.config.namespace ],
					[ action.config.collection ]: action.config,
				},
			};
	}

	return state;
}

type CollectionsState = {
	config: State['collections']['config'];
	records: State['collections']['records'];
	reducer?: ( state: State['collections']['records'], action ) => State['collections']['records'];
};

/**
 * Reducer keeping track of the registered collections config and data.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export const collections = ( state: CollectionsState = { config: {}, records: {} }, action ) => {
	const newConfig = collectionsConfig( state.config, action );

	// Generates a dynami c reducer for the collections.
	let collectionsDataReducer = state.reducer;
	if ( ! collectionsDataReducer || newConfig !== state.config ) {
		const collectionsByNamespace: CollectionsState['records'] = newConfig.reduce( ( acc, record ) => {
			const { namespace } = record;
			if ( ! acc[ namespace ] ) {
				acc[ namespace ] = [];
			}
			acc[ namespace ].push( record );
			return acc;
		}, {} );

		collectionsDataReducer = combineReducers(
			Object.entries( collectionsByNamespace ).reduce(
				( memo, [ namespace, collections ] ) => {
					const namespaceReducer = combineReducers(
						collections.reduce(
							( namespaceMemo, collectionConfig ) => ( {
								...namespaceMemo,
								[ collectionConfig.name ]: collection( collectionConfig ),
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

export function undoManager( state: State['undoManager'] = createUndoManager() ): State['undoManager'] {
	return state;
}

export function editsReference( state: State['editsReference'] = {}, action ): State['editsReference'] {
	switch ( action.type ) {
		case 'EDIT_COLLECTION_RECORD':
		case 'UNDO':
		case 'REDO':
			return {};
	}
	return state;
}

/**
 * State which tracks whether the user can perform an action on a REST
 * resource.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function userPermissions( state: State['userPermissions'] = {}, action ): State['userPermissions'] {
	switch ( action.type ) {
		case 'RECEIVE_USER_PERMISSION':
			return {
				...state,
				[ action.key ]: action.isAllowed,
			};
		case 'RECEIVE_USER_PERMISSIONS':
			return {
				...state,
				...action.permissions,
			};
	}

	return state;
}

export default combineReducers( {
	collections,
	editsReference,
	undoManager,
	userPermissions,
} );
