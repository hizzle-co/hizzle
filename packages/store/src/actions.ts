/**
 * Internal dependencies.
 */
import { createBatch } from './batch';

export * from './collection/actions';

/**
 * Runs multiple store actions at the same time using one API request.
 *
 * Example:
 *
 * ```
 * const [ savedRecord, updatedRecord, deletedRecord ] =
 *   await dispatch( 'hizzlewp/store' ).batch( [
 *     ( { saveCollectionRecord } ) => saveCollectionRecord( 'noptin', 'subscribers', { email: 'john@doe.com', name: 'John Doe' } ),
 *     ( { saveEditedCollectionRecord } ) => saveEditedCollectionRecord( 'noptin', 'subscribers', 123 ),
 *     ( { deleteCollectionRecord } ) => deleteCollectionRecord( 'noptin', 'subscribers', 123, null ),
 *   ] );
 * ```
 *
 * @param {Array} requests Array of functions which are invoked simultaneously.
 *                         Each function is passed an object containing
 *                         `saveCollectionRecord`, `saveEditedCollectionRecord`, and
 *                         `deleteCollectionRecord`.
 *
 * @return {(thunkArgs: Object) => Promise} A promise that resolves to an array containing the return
 *                                          values of each function given in `requests`.
 */
export const batch =
	( requests ) =>
		async ( { dispatch } ) => {
			const batch = createBatch();
			const api = {
				saveCollectionRecord( namespace, collection, record, options ) {
					return batch.add( ( add ) =>
						dispatch.saveCollectionRecord( namespace, collection, record, {
							...options,
							fetchHandler: add,
						} )
					);
				},
				saveEditedCollectionRecord( namespace, collection, recordId, options ) {
					return batch.add( ( add ) =>
						dispatch.saveEditedCollectionRecord( namespace, collection, recordId, {
							...options,
							fetchHandler: add,
						} )
					);
				},
				deleteCollectionRecord( namespace, collection, recordId, query, options ) {
					return batch.add( ( add ) =>
						dispatch.deleteCollectionRecord( namespace, collection, recordId, query, {
							...options,
							fetchHandler: add,
						} )
					);
				},
			};
			const resultPromises = requests.map( ( request ) => request( api ) );
			const [ , ...results ] = await Promise.all( [
				batch.run(),
				...resultPromises,
			] );
			return results;
		};

/**
 * Returns an action object used in signalling that the current user has
 * permission to perform an action on a REST resource.
 * Ignored from documentation as it's internal to the data store.
 *
 * @ignore
 *
 * @param {string}  key       A key that represents the action and REST resource.
 * @param {boolean} isAllowed Whether or not the user can perform the action.
 *
 * @return {Object} Action object.
 */
export function receiveUserPermission( key: string, isAllowed: boolean ) {
	return {
		type: 'RECEIVE_USER_PERMISSION',
		key,
		isAllowed,
	};
}

/**
 * Returns an action object used in signalling that the current user has
 * permission to perform an action on a REST resource. Ignored from
 * documentation as it's internal to the data store.
 *
 * @ignore
 *
 * @param {Object<string, boolean>} permissions An object where keys represent
 *                                              actions and REST resources, and
 *                                              values indicate whether the user
 *                                              is allowed to perform the
 *                                              action.
 *
 * @return {Object} Action object.
 */
export function receiveUserPermissions( permissions: Record<string, boolean> ) {
	return {
		type: 'RECEIVE_USER_PERMISSIONS',
		permissions,
	};
}
