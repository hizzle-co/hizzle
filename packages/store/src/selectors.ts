/**
 * WordPress dependencies
 */
import { createSelector } from '@wordpress/data';

import {
	getUserPermissionCacheKey,
} from './utils';
import { State, CollectionRecordKey } from './types';

export * from './collection/selectors';

/**
 * HTTP Query parameters sent with the API request to fetch the entity records.
 */
export type GetRecordsHttpQuery = Record<string, any>;

/**
 * Arguments for CollectionRecord selectors.
 */
export type CollectionResource = { namespace: string; collection: string; id?: CollectionRecordKey };


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
