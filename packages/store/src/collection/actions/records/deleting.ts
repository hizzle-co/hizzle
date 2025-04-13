/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { CollectionRecordKey } from '../../../types';
import { STORE_NAME } from '../../../constants';
import type { CollectionAction } from '..';

export type RemoveItemsAction = CollectionAction & {
    /**
     * The type of the action.
     */
    type: 'REMOVE_ITEMS';

    /**
     * The IDs of the items to remove.
     */
    itemIds: Array<CollectionRecordKey>;

    /**
     * Whether to invalidate the cache.
     */
    invalidateCache: boolean;
};

export type DeleteCollectionRecordAction = CollectionAction & {
    /**
     * The type of the action.
     */
    type: 'DELETE_COLLECTION_RECORD_START' | 'DELETE_COLLECTION_RECORD_FINISH';

    /**
     * The ID of the record to delete.
     */
    recordId: CollectionRecordKey;

    /**
     * The error that occurred during the deletion.
     */
    error?: Error;
};

/**
 * Returns an action object used in signalling that collection records have been
 * deleted and they need to be removed from collections state.
 *
 * @param {string}              namespace       Namespace of the removed collection.
 * @param {string}              collection      Collection of the removed collection.
 * @param {Array|number|string} records         Record IDs of the removed entities.
 * @param {boolean}             invalidateCache Controls whether we want to invalidate the cache.
 * @return {Object} Action object.
 */
export function removeItems( namespace: string, collection: string, records: CollectionRecordKey | Array<CollectionRecordKey>, invalidateCache = false ) {
    return {
        type: 'REMOVE_ITEMS',
        itemIds: Array.isArray( records ) ? records : [ records ],
        namespace,
        collection,
        invalidateCache,
    };
}

/**
 * Action triggered to delete a collection record.
 *
 * @param {string}        namespace  Namespace of the deleted collection.
 * @param {string}        collection Name of the deleted collection.
 * @param {number|string} recordId   Record ID of the deleted record.
 * @param {?Object}       query      Special query parameters for the
 *                                   DELETE API call.
 */
export const deleteCollectionRecord =
    (
        namespace: string,
        collection: string,
        recordId: CollectionRecordKey,
        query: object | null = null,
        {
            throwOnError = true,
            fetchHandler = apiFetch,
        } = {},
    ) =>
        async ( { dispatch, resolveSelect } ) => {
            const collectionConfig = await resolveSelect.getCollectionConfig( namespace, collection );

            let error;
            let deletedRecord = false;
            if ( !collectionConfig ) {
                return;
            }

            // Lock the store to prevent other actions from modifying the collection records.
            const lock = await dispatch.__unstableAcquireStoreLock(
                STORE_NAME,
                [ 'collections', 'records', namespace, collection, recordId ],
                { exclusive: true }
            );

            try {
                dispatch( {
                    type: 'DELETE_COLLECTION_RECORD_START',
                    namespace,
                    collection,
                    recordId,
                } );

                let hasError = false;
                try {
                    let path = `${ collectionConfig.baseURL }/${ recordId }`;

                    if ( query ) {
                        path = addQueryArgs( path, query );
                    }

                    deletedRecord = await fetchHandler( {
                        path,
                        method: 'DELETE',
                    } );

                    await dispatch( removeItems( namespace, collection, recordId, true ) );
                } catch ( _error ) {
                    hasError = true;
                    error = _error;
                }

                dispatch( {
                    type: 'DELETE_COLLECTION_RECORD_FINISH',
                    namespace,
                    collection,
                    recordId,
                    error,
                } );

                if ( hasError && throwOnError ) {
                    throw error;
                }

                return deletedRecord;
            } finally {
                dispatch.__unstableReleaseStoreLock( lock );
            }
        };

/**
 * Action triggered to bulk delete collection records.
 *
 * @param {string}        namespace   Namespace of the collection.
 * @param {string}        collection  Collection name.
 * @param {Record<string, any>} query Query object. We'll use the query to determine which records to delete.
 * @param {Object}        options     Saving options.
 * @param {boolean}       options.throwOnError If false, this action suppresses all
 *                                the exceptions. Defaults to false.
 * @param {Function} options.fetchHandler The fetch handler to use. Defaults to apiFetch.
 */
export const bulkDeleteCollectionRecords =
    (
        namespace: string,
        collection: string,
        query: Record<string, any>,
        {
            throwOnError = true,
            fetchHandler = apiFetch
        } = {}
    ) =>
        async ( { dispatch, resolveSelect } ) => {
            const collectionConfig = await resolveSelect.getCollectionConfig( namespace, collection );

            if ( !collectionConfig ) {
                return;
            }

            const lock = await dispatch.__unstableAcquireStoreLock(
                STORE_NAME,
                [ 'collections', 'records', namespace, collection ],
                { exclusive: true }
            );

            try {
                dispatch( {
                    type: 'DO_BULK_DELETE_COLLECTION_RECORDS_START',
                    namespace,
                    collection,
                    query,
                } );
                let response;
                let error;
                let hasError = false;
                try {

                    response = await fetchHandler( {
                        path: addQueryArgs( collectionConfig.baseURL, query ),
                        method: 'DELETE',
                    } );
                } catch ( _error ) {
                    hasError = true;
                    error = _error;
                }

                dispatch( {
                    type: 'DO_BULK_DELETE_COLLECTION_RECORDS_FINISH',
                    namespace,
                    collection,
                    query,
                    error,
                    invalidateCache: !hasError,
                } );

                if ( hasError && throwOnError ) {
                    throw error;
                }

                return response;
            } finally {
                dispatch.__unstableReleaseStoreLock( lock );
            }
        };