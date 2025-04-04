/**
 * External dependencies
 */
import fastDeepEqual from 'fast-deep-equal/es6';

/**
 * Internal dependencies
 */
import type { CollectionRecordKey, CollectionRecord } from '../../../types';
import { DEFAULT_ENTITY_KEY, DEFAULT_CONTEXT } from '../../../constants';
import type { ReceiveCollectionRecordsAction } from '../../actions';

/**
 * Define action types for better type safety
 */
type EditCollectionRecordAction = {
    type: 'EDIT_COLLECTION_RECORD';
    namespace: string;
    collection: string;
    recordId: CollectionRecordKey;
    edits: Partial<CollectionRecord>;
};

type Action = EditCollectionRecordAction | ReceiveCollectionRecordsAction | { type: 'other' };

export const edits = (
    state: Record<CollectionRecordKey, Partial<CollectionRecord>> = {},
    action: Action
) => {
    switch ( action.type ) {
        // If the action is a receive items action,
        // we need to update the edits for the records.
        // Removes saved edits that are no longer in the items.
        case 'RECEIVE_COLLECTION_RECORDS':
            const context = action.query?.context ?? DEFAULT_CONTEXT;
            if ( context !== DEFAULT_CONTEXT ) {
                return state;
            }

            const nextState = { ...state };

            for ( const record of action.records ?? [] ) {
                const recordId = record?.[ action.key || DEFAULT_ENTITY_KEY ];
                const edits = nextState[ recordId ];
                if ( !edits ) {
                    continue;
                }

                // Only keep edits that are still different to the persisted value.
                const nextEdits = Object.keys( edits ).reduce(
                    ( acc, key ) => {
                        // If the edited value is still different to the persisted value,
                        // keep the edited value in edits.
                        if (
                            // Edits are the "raw" attribute values, but records may have
                            // objects with more properties, so we use `get` here for the
                            // comparison.
                            !fastDeepEqual(
                                edits[ key ],
                                record[ key ]?.raw ?? record[ key ]
                            ) &&
                            // Sometimes the server alters the sent value which means
                            // we need to also remove the edits before the api request.
                            ( !action.persistedEdits ||
                                !fastDeepEqual(
                                    edits[ key ],
                                    action.persistedEdits[ key ]
                                ) )
                        ) {
                            acc[ key ] = edits[ key ];
                        }
                        return acc;
                    },
                    {}
                );

                // If there are any edits, save them.
                if ( Object.keys( nextEdits ).length ) {
                    nextState[ recordId ] = nextEdits;
                } else {
                    delete nextState[ recordId ];
                }
            }

            return nextState;

        case 'EDIT_COLLECTION_RECORD':
            const nextEdits = {
                ...state[ action.recordId ],
                ...action.edits,
            };
            Object.keys( nextEdits ).forEach( ( key ) => {
                // Delete cleared edits so that the properties
                // are not considered dirty.
                if ( nextEdits[ key ] === undefined ) {
                    delete nextEdits[ key ];
                }
            } );
            return {
                ...state,
                [ action.recordId ]: nextEdits,
            };
    }

    return state;
}
