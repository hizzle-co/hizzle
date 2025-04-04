/**
 * External dependencies
 */
import { v4 as uuid } from 'uuid';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { CollectionRecordKey } from '../../../types';
import { DEFAULT_ENTITY_KEY, STORE_NAME } from '../../../constants';
import type { CollectionAction } from '..';
import { getNestedValue, setNestedValue } from '../../../utils';

export type SaveCollectionRecordAction = CollectionAction & {
    /**
     * The type of the action.
     */
    type: 'SAVE_COLLECTION_RECORD_START' | 'SAVE_COLLECTION_RECORD_FINISH';

    /**
     * The ID of the record to save.
     */
    recordId: CollectionRecordKey;

    /**
     * The error that occurred during the saving.
     */
    error?: Error;
};

/**
 * Action triggered to save an collection record.
 *
 * @param {string}   namespace    Namespace of the collection.
 * @param {string}   collection   Collection name.
 * @param {Object}   data         Record to be saved.
 * @param {Object}   options      Options for the action.
 * @param {boolean}  options.throwOnError If false, this action suppresses all
 *                                the exceptions. Defaults to false.
 * @param {Function} options.fetchHandler The fetch handler to use. Defaults to apiFetch.
 */
export const saveCollectionRecord =
    (
        namespace: string,
        collection: string,
        data: Record<string, any>,
        {
            throwOnError = true,
            fetchHandler = apiFetch
        } = {}
    ) =>
        async ( { select, resolveSelect, dispatch } ) => {
            const collectionConfig = await resolveSelect.getCollectionConfig( namespace, collection );

            if ( !collectionConfig ) {
                return;
            }

            const recordId = data[ collectionConfig.key || DEFAULT_ENTITY_KEY ];

            const lock = await dispatch.__unstableAcquireStoreLock(
                STORE_NAME,
                [ 'collections', 'records', namespace, collection, recordId || uuid() ],
                { exclusive: true }
            );

            try {
                // Evaluate optimized edits.
                // (Function edits that should be evaluated on save to avoid expensive computations on every edit.)
                for ( const [ key, value ] of Object.entries( data ) ) {
                    if ( typeof value === 'function' ) {
                        const evaluatedValue = value(
                            select.getEditedCollectionRecord( namespace, collection, recordId )
                        );
                        dispatch.editCollectionRecord(
                            namespace,
                            collection,
                            recordId,
                            {
                                [ key ]: evaluatedValue,
                            },
                            { undoIgnore: true }
                        );
                        data[ key ] = evaluatedValue;
                    }

                    if ( value?.raw ) {
                        data[ key ] = value.raw;
                    }
                }

                dispatch( {
                    type: 'SAVE_COLLECTION_RECORD_START',
                    namespace,
                    collection,
                    recordId,
                } );
                let updatedRecord;
                let error;
                let hasError = false;
                try {
                    const path = `${ collectionConfig.baseURL }${ recordId ? '/' + recordId : '' }`;

                    updatedRecord = await fetchHandler( {
                        path,
                        method: recordId ? 'PUT' : 'POST',
                        data,
                    } );
                    dispatch.receiveCollectionRecords(
                        namespace,
                        collection,
                        [ updatedRecord ],
                        undefined,
                        undefined,
                        collectionConfig.key || DEFAULT_ENTITY_KEY,
                        true,
                        data,
                    );
                } catch ( _error ) {
                    hasError = true;
                    error = _error;
                }
                dispatch( {
                    type: 'SAVE_COLLECTION_RECORD_FINISH',
                    namespace,
                    collection,
                    recordId,
                    error,
                } );

                if ( hasError && throwOnError ) {
                    throw error;
                }

                return updatedRecord;
            } finally {
                dispatch.__unstableReleaseStoreLock( lock );
            }
        };

/**
 * Action triggered to save a collection record's edits.
 *
 * @param {string}  namespace     Namespace of the collection.
 * @param {string}  collection    Collection name.
 * @param {Object}  recordId ID of the record.
 * @param {Object=} options  Saving options.
 */
export const saveEditedCollectionRecord =
    ( namespace: string, collection: string, recordId: CollectionRecordKey, options: { throwOnError?: boolean, fetchHandler?: typeof apiFetch } = {} ) =>
        async ( { select, dispatch, resolveSelect } ) => {
            if ( !select.hasEditsForCollectionRecord( namespace, collection, recordId ) ) {
                return;
            }
            const collectionConfig = await resolveSelect.getCollectionConfig( namespace, collection );
            if ( !collectionConfig ) {
                return;
            }
            const entityIdKey = collectionConfig.key || DEFAULT_ENTITY_KEY;

            const edits = select.getCollectionRecordNonTransientEdits(
                namespace,
                collection,
                recordId
            );
            const record = { [ entityIdKey ]: recordId, ...edits };
            return await dispatch.saveCollectionRecord( namespace, collection, record, options );
        };

/**
 * Action triggered to save only specified properties for the collection record.
 *
 * @param {string}        namespace   Namespace of the collection.
 * @param {string}        collection  Collection name.
 * @param {number|string} recordId    ID of the record.
 * @param {Array}         itemsToSave List of record properties or property paths to save.
 * @param {Object}        options     Saving options.
 */
export const saveSpecifiedCollectionRecordEdits =
    ( namespace: string, collection: string, recordId: CollectionRecordKey, itemsToSave: string[], options: Record<string, any> ) =>
        async ( { select, dispatch, resolveSelect } ) => {
            if ( !select.hasEditsForCollectionRecord( namespace, collection, recordId ) ) {
                return;
            }
            const edits = select.getCollectionRecordEdits(
                namespace,
                collection,
                recordId
            );
            const editsToSave = {};

            for ( const item of itemsToSave ) {
                setNestedValue( editsToSave, item, getNestedValue( edits, item ) );
            }

            const collectionConfig = await resolveSelect.getCollectionConfig( namespace, collection );

            const collectionIdKey = collectionConfig?.key || DEFAULT_ENTITY_KEY;

            // If a record key is provided then update the existing record.
            // This necessitates providing `recordKey` to saveCollectionRecord as part of the
            // `record` argument (here called `editsToSave`) to stop that action creating
            // a new record and instead cause it to update the existing record.
            if ( recordId ) {
                editsToSave[ collectionIdKey ] = recordId;
            }
            return await dispatch.saveCollectionRecord(
                namespace,
                collection,
                editsToSave,
                options
            );
        };
