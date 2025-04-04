/**
 * Internal dependencies
 */
import type { CollectionRecordKey, State } from '../../../types';

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
 * Returns the error that occurred while saving the specified collection record, and undefined otherwise.
 *
 * @param state      State tree.
 * @param namespace  Record namespace.
 * @param collection Record collection.
 * @param recordId   Record ID.
 *
 * @return Whether the collection record has a save error or not.
 */
export function getLastCollectionSaveError(
	state: State,
	namespace: string,
	collection: string,
	recordId: CollectionRecordKey
): Error | undefined {
	return (
		state.collections.records?.[ namespace ]?.[ collection ]?.saving?.[
			recordId as CollectionRecordKey
		]?.error
	);
}
