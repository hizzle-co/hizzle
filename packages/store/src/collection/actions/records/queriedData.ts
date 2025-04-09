/**
 * Internal dependencies
 */
import { CollectionRecordKey } from '../../../types';
import type { CollectionAction } from '..';

export type ReceiveCollectionRecordsAction = CollectionAction & {
	/**
	 * The type of the action.
	 */
	type: 'RECEIVE_COLLECTION_RECORDS';

	/**
	 * The records received.
	 */
	records: Array<any>;

	/**
	 * The query object.
	 */
	query?: Record<string, any>;

	/**
	 * Whether to invalidate the cache.
	 */
	invalidateCache?: boolean;

	/**
	 * The persisted edits.
	 */
	persistedEdits?: Record<string, any>;

	/**
	 * The meta information about pagination.
	 */
	meta?: Record<string, any>;

	/**
	 * The key of the collection record.
	 */
	key?: CollectionRecordKey;
};

/**
 * Returns an action object used in signalling that entity records have been received.
 *
 * @param {string}       namespace       Namespace of the received entity records.
 * @param {string}       collection      Collection of the received entity records.
 * @param {Array}        records         Records received.
 * @param {?Object}      query           Query Object.
 * @param {?boolean}     invalidateCache Should invalidate query caches.
 * @param {?Object}      persistedEdits  Edits to reset.
 * @param {?Object}      meta            Meta information about pagination.
 * @return {Object} Action object.
 */
export function receiveCollectionRecords(
	namespace: string,
	collection: string,
	records: Array<any>,
	query: object | undefined = undefined,
	meta: object | undefined = undefined,
	invalidateCache: boolean = false,
	persistedEdits: object | undefined = undefined,
): ReceiveCollectionRecordsAction {

	const action: ReceiveCollectionRecordsAction = {
		type: 'RECEIVE_COLLECTION_RECORDS',
		namespace,
		collection,
		invalidateCache,
		records: Array.isArray( records ) ? records : [ records ],
		persistedEdits,
		meta,
	}

	if ( query ) {
		action.query = query;
	}

	return action;
}
