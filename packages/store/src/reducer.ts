/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { collectionsReducer } from './collection/reducer';
import { createUndoManager } from './undo-manager';
import type { State } from './types';

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
	collections: collectionsReducer,
	editsReference,
	undoManager,
	userPermissions,
} );
