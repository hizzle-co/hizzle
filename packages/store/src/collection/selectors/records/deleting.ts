/**
 * Internal dependencies
 */
import type { CollectionRecordKey, State } from '../../../types';

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
