/**
 * Internal dependencies
 */
import type { CollectionRecordKey, API_STATE } from '../../../types';

type Action = {
    type: 'DELETE_COLLECTION_RECORD_START' | 'DELETE_COLLECTION_RECORD_FINISH' | string;
    recordId: CollectionRecordKey;
    error?: Error;
};

export const deleting = ( state: Record<CollectionRecordKey, Partial<API_STATE>> = {}, action: Action ) => {
    switch ( action.type ) {
        case 'DELETE_COLLECTION_RECORD_START':
        case 'DELETE_COLLECTION_RECORD_FINISH':
            return {
                ...state,
                [ action.recordId ]: {
                    pending:
                        action.type === 'DELETE_COLLECTION_RECORD_START',
                    error: action.error,
                },
            };
    }

    return state;
}
