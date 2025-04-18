/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { CollectionRecordKey } from '../../../types';
import { STORE_NAME } from '../../../constants';
import type { CollectionAction } from '..';

export type DoRemoteCollectionRecordActionAction = CollectionAction & {
    /**
     * The type of the action.
     */
    type: 'DO_REMOTE_COLLECTION_RECORD_ACTION_START' | 'DO_REMOTE_COLLECTION_RECORD_ACTION_FINISH';

    /**
     * The ID of the record to save.
     */
    recordId: CollectionRecordKey;

    /**
     * The action to perform.
     */
    action: string;

    /**
     * The error that occurred during the saving.
     */
    error?: Error;
};

/**
 * Trigger a remote action on a collection record.
 *
 * @param {string}   namespace    Namespace of the collection.
 * @param {string}   collection   Collection name.
 * @param {CollectionRecordKey} recordId Record ID of the record to fire the action on.
 * @param {string}   action       Action to perform.
 * @param {Object}   options      Options for the action.
 * @param {boolean}  options.throwOnError If false, this action suppresses all
 *                                the exceptions. Defaults to false.
 * @param {Function} options.fetchHandler The fetch handler to use. Defaults to apiFetch.
 */
export const doRemoteCollectionRecordAction =
    (
        namespace: string,
        collection: string,
        recordId: CollectionRecordKey,
        action: string,
        {
            throwOnError = true,
            fetchHandler = apiFetch
        } = {}
    ) =>
        async ( { resolveSelect, dispatch } ) => {
            const collectionConfig = await resolveSelect.getCollectionConfig( namespace, collection );

            if ( !collectionConfig ) {
                return;
            }

            const lock = await dispatch.__unstableAcquireStoreLock(
                STORE_NAME,
                [ 'collections', 'records', namespace, collection, recordId ],
                { exclusive: true }
            );

            try {
                dispatch( {
                    type: 'DO_REMOTE_COLLECTION_RECORD_ACTION_START',
                    namespace,
                    collection,
                    recordId,
                    action,
                } );
                let response;
                let error;
                let hasError = false;
                try {
                    const path = `${ collectionConfig.baseURL }/${ recordId }/remote-action/${ action }`;

                    response = await fetchHandler( {
                        path,
                        method: 'POST',
                        data: {},
                    } );

                    if ( response?.record?.data ) {
                        dispatch.receiveCollectionRecords(
                            namespace,
                            collection,
                            [ response.record?.data ],
                            undefined,
                            undefined,
                            true,
                        );

                        dispatch.invalidateResolution(
                            'getCollectionRecordTabContent',
                            [ namespace, collection, recordId, 'overview' ]
                        );

                        if ( collectionConfig.tabs ) {
                            Object.keys( collectionConfig.tabs ).forEach( key => {
                                dispatch.invalidateResolution(
                                    'getCollectionRecordTabContent',
                                    [ namespace, collection, recordId, key ]
                                );
                            } )
                        }
                    }
                } catch ( _error ) {
                    hasError = true;
                    error = _error;
                }

                dispatch( {
                    type: 'DO_REMOTE_COLLECTION_RECORD_ACTION_FINISH',
                    namespace,
                    collection,
                    recordId,
                    action,
                    error,
                } );

                if ( hasError && throwOnError ) {
                    throw error;
                }

                return response?.result;
            } finally {
                dispatch.__unstableReleaseStoreLock( lock );
            }
        };

type BatchAction = {

    /**
     * The records to create.
     */
    create?: Record<string, any>[];

    /**
     * The records to update.
     *
     * Can be a boolean if importing records,
     * so that existing records are either updated or skipped.
     */
    update?: Record<string, any>[] | boolean;

    /**
     * The records to delete.
     */
    delete?: CollectionRecordKey[];

    /**
     * The records to import.
     */
    import?: Record<string, any>[];

    /**
     * The query object.
     */
    query?: Record<string, any>;
};

/**
 * Trigger a batch action on a collection record.
 *
 * @param {string}      namespace  Namespace of the collection.
 * @param {string}      collection Collection name.
 * @param {BatchAction} action     Action to perform.
 * @param {Object}   options       Options for the action.
 * @param {boolean}  options.throwOnError If false, this action suppresses all
 *                                the exceptions. Defaults to false.
 * @param {Function} options.fetchHandler The fetch handler to use. Defaults to apiFetch.
 */
export const doBatchCollectionAction =
    (
        namespace: string,
        collection: string,
        action: BatchAction,
        {
            throwOnError = true,
            fetchHandler = apiFetch
        } = {}
    ) =>
        async ( { resolveSelect, dispatch } ) => {
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
                    type: 'DO_BATCH_COLLECTION_ACTION_START',
                    namespace,
                    collection,
                    action,
                } );
                let response;
                let error;
                let hasError = false;
                try {
                    const path = `${ collectionConfig.baseURL }/batch`;

                    response = await fetchHandler( {
                        path,
                        method: 'POST',
                        data: action,
                    } );
                } catch ( _error ) {
                    hasError = true;
                    error = _error;
                }

                dispatch( {
                    type: 'DO_BATCH_COLLECTION_ACTION_FINISH',
                    namespace,
                    collection,
                    action,
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