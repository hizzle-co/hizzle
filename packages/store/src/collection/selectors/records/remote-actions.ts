/**
 * Internal dependencies
 */
import type { State, CollectionRecordKey } from '../../../types';

/**
 * Returns whether a remote action is running for a specific record.
 *
 * @param {State}                state       The store state.
 * @param {string}               namespace   The namespace of the collection.
 * @param {string}               collection  The name of the collection.
 * @param {string}               actionName  The name of the remote action.
 * @param {CollectionRecordKey}  recordId    The ID of the record.
 * @return {boolean} Whether the remote action is running.
 */
export const isDoingRemoteCollectionRecordAction = (
    state: State,
    namespace: string,
    collection: string,
    recordId: CollectionRecordKey,
    actionName: string,
): boolean => {
    return Boolean(
        state.collections.records?.[ namespace ]?.[ collection ]?.remoteActions?.[ actionName ]?.[ recordId ]?.pending
    );
};

/**
 * Returns the error for a remote action for a specific record.
 *
 * @param {State}                state       The store state.
 * @param {string}               namespace   The namespace of the collection.
 * @param {string}               collection  The name of the collection.
 * @param {string}               actionName  The name of the remote action.
 * @param {CollectionRecordKey}  recordId    The ID of the record.
 * @return {Error|undefined} The error for the remote action, if any.
 */
export const getRemoteActionError = (
    state: State,
    namespace: string,
    collection: string,
    recordId: CollectionRecordKey,
    actionName: string,
): Error | undefined => {
    return state.collections.records?.[ namespace ]?.[ collection ]?.remoteActions?.[ actionName ]?.[ recordId ]?.error;
};
