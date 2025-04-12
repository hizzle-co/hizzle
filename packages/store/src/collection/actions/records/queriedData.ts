/**
 * Internal dependencies
 */
import { CollectionRecordKey } from '../../../types';
import type { CollectionAction } from '..';

export type ReceiveCollectionRecordTabContentAction = CollectionAction & {
	/**
	 * The type of the action.
	 */
	type: 'RECEIVE_COLLECTION_RECORD_TAB_CONTENT';

	/**
	 * The ID of the record.
	 */
	recordId: CollectionRecordKey;

	/**
	 * The tab name.
	 */
	tabName: string;

	/**
	 * The tab content.
	 */
	content: any;
};

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

export type ToggleAllCollectionRecordsSelectedAction = CollectionAction & {
	/**
	 * The type of the action.
	 */
	type: 'TOGGLE_ALL_COLLECTION_RECORDS_SELECTED';

	/**
	 * The query object.
	 */
	query?: Record<string, any>;

	/**
	 * Whether it is selected or unselected. Leave undefined to toggle.
	 */
	selected?: boolean;
};

export type ToggleCollectionRecordSelectedAction = Omit<ToggleAllCollectionRecordsSelectedAction, 'type'> & {
	/**
	 * The type of the action.
	 */
	type: 'TOGGLE_COLLECTION_RECORD_SELECTED';

	/**
	 * The ID of the record.
	 */
	recordId: CollectionRecordKey;

	/**
	 * Whether the shift key is pressed.
	 */
	isShiftKey: boolean;

	/**
	 * The ID of the record to start the range selection from.
	 */
	rangeStartId?: CollectionRecordKey;
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

/**
 * Returns an action object used in signalling that a record's tab content has been received.
 *
 * @param {string}        namespace  Namespace of the record.
 * @param {string}        collection Collection of the record.
 * @param {number|string} recordId   Record id of received tab content.
 * @param {tabName}       tabName    The tab name, e.g, overview.
 * @param {any}           content    The tab content.
 * @return {Object} Action object.
 */
export function receiveCollectionRecordTabContent(
	namespace: string,
	collection: string,
	recordId: CollectionRecordKey,
	tabName: string,
	content: any,
): ReceiveCollectionRecordTabContentAction {

	return {
		type: 'RECEIVE_COLLECTION_RECORD_TAB_CONTENT',
		namespace,
		collection,
		recordId,
		tabName,
		content,
	}
}

/**
 * Returns an action object used to toggle all records selection for a given query.
 *
 * @param {string} namespace  Namespace of the collection.
 * @param {string} collection Collection name.
 * @param {Object} query      Optional query parameters.
 * @return {Object} Action object.
 */
export function toggleAllCollectionRecordsSelected(
	namespace: string,
	collection: string,
	query: Record<string, any> = {},
	selected?: boolean,
): ToggleAllCollectionRecordsSelectedAction {
	return {
		type: 'TOGGLE_ALL_COLLECTION_RECORDS_SELECTED',
		namespace,
		collection,
		query,
		selected,
	};
}

/**
 * Returns an action object used to toggle a record selection for a given query.
 *
 * @param {string} namespace  Namespace of the collection.
 * @param {string} collection Collection name.
 * @param {Object} query      Optional query parameters.
 * @param {number|string} recordId Record id of received tab content.
 * @param {boolean} selected Whether to select the record.
 * @param {boolean} isShiftKey Whether the shift key is pressed.
 * @return {Object} Action object.
 */
export function toggleCollectionRecordSelected(
	namespace: string,
	collection: string,
	query: Record<string, any>,
	recordId: CollectionRecordKey,
	selected?: boolean,
	isShiftKey: boolean = false,
	rangeStartId?: CollectionRecordKey,
): ToggleCollectionRecordSelectedAction {
	return {
		type: 'TOGGLE_COLLECTION_RECORD_SELECTED',
		namespace,
		collection,
		query,
		recordId,
		selected,
		isShiftKey,
		rangeStartId,
	};
}
