/**
 * WordPress dependencies
 */
import { createSelector } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { isSavingCollectionRecord, getRawCollectionRecord } from '.';
import type { CollectionRecordKey, CollectionRecord, State } from '../../../types';
import { getCollectionConfig } from '../config';
import { DEFAULT_CONTEXT } from '../../../constants';

/**
 * Returns the specified collection record's edits.
 *
 * @param state      State tree.
 * @param namespace  Record namespace.
 * @param collection Record collection.
 * @param recordId   Record ID.
 *
 * @return The collection record's edits.
 */
export function getCollectionRecordEdits(
    state: State,
    namespace: string,
    collection: string,
    recordId: CollectionRecordKey
) {
    return state.collections.records?.[ namespace ]?.[ collection ]?.edits?.[
        recordId
    ];
}

/**
 * Returns the specified collection record's non transient edits.
 *
 * Transient edits don't create an undo level, and
 * are not considered for change detection.
 * They are defined in the collection's config.
 *
 * @param state      State tree.
 * @param namespace  Record namespace.
 * @param collection Record collection.
 * @param recordId   Record ID.
 *
 * @return The collection record's non transient edits.
 */
export const getCollectionRecordNonTransientEdits = createSelector(
    (
        state: State,
        namespace: string,
        collection: string,
        recordId: CollectionRecordKey
    ) => {
        const { transientEdits } = getCollectionConfig( state, namespace, collection ) || {};
        const edits = getCollectionRecordEdits( state, namespace, collection, recordId ) || {};
        if ( !transientEdits ) {
            return edits;
        }
        return Object.keys( edits ).reduce( ( acc, key ) => {
            if ( !transientEdits[ key ] ) {
                acc[ key ] = edits[ key ];
            }
            return acc;
        }, {} );
    },
    ( state: State, namespace: string, collection: string, recordId: CollectionRecordKey ) => [
        state.collections.config,
        state.collections.records?.[ namespace ]?.[ collection ]?.edits?.[ recordId ],
    ]
);

/**
 * Returns true if the specified collection record has edits,
 * and false otherwise.
 *
 * @param state      State tree.
 * @param namespace  Record namespace.
 * @param collection Record collection.
 * @param recordId   Record ID.
 *
 * @return Whether the collection record has edits or not.
 */
export function hasEditsForCollectionRecord(
    state: State,
    namespace: string,
    collection: string,
    recordId: CollectionRecordKey
): boolean {
    return (
        isSavingCollectionRecord( state, namespace, collection, recordId ) ||
        Object.keys(
            getCollectionRecordEdits( state, namespace, collection, recordId )
        ).length > 0
    );
}

/**
 * Returns the specified collection record, merged with its edits.
 *
 * @param state      State tree.
 * @param namespace  Record namespace.
 * @param collection Record collection.
 * @param recordId   Record ID.
 *
 * @return The collection record, merged with its edits.
 */
export const getEditedCollectionRecord = createSelector( (
    state: State,
    namespace: string,
    collection: string,
    recordId: CollectionRecordKey
): CollectionRecord | undefined => {
    const raw = getRawCollectionRecord( state, namespace, collection, recordId );
    const edited = getCollectionRecordEdits( state, namespace, collection, recordId );

    if ( !raw && !edited ) {
        return;
    }
    return {
        ...raw,
        ...edited,
    };
},
    (
        state: State,
        namespace: string,
        collection: string,
        recordId: CollectionRecordKey,
        query?: Record<string, any>
    ) => {
        const context = query?.context ?? DEFAULT_CONTEXT;
        return [
            state.collections.config,
            state.collections.records?.[ namespace ]?.[ collection ]?.queriedData.items[
            context
            ]?.[ recordId ],
            state.collections.records?.[ namespace ]?.[ collection ]?.queriedData
                .itemIsComplete[ context ]?.[ recordId ],
            state.collections.records?.[ namespace ]?.[ collection ]?.edits?.[ recordId ],
        ];
    }
);
