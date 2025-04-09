/**
 * External dependencies
 */
import type { Action } from 'redux';

/**
 * Internal dependencies
 */
import { CollectionRecordKey } from '../../types';

export * from './config';
export * from './records';

export type CollectionAction = Action & {

    /**
     * The namespace of the collection.
     */
    namespace: string;

    /**
     * The name of the collection.
     */
    collection: string;
}

export type UnknownAction = Action<'unknown'>;

export type ReceiveCollectionRecordOverviewAction = CollectionAction & {
	/**
	 * The type of the action.
	 */
	type: 'RECEIVE_COLLECTION_RECORD_OVERVIEW';

	/**
	 * The ID of the record.
	 */
	recordId: CollectionRecordKey;

	/**
	 * The overview data.
	 */
	overview: Array<any>;
};
