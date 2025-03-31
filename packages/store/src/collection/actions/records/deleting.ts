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
            throwOnError = false,
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
