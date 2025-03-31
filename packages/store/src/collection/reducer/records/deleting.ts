/**
 * Internal dependencies
 */
import type { CollectionRecordKey, API_STATE } from '../../../types';
import type { DeleteCollectionRecordAction, UnknownAction } from '../../actions';

export const deleting = ( state: Record<CollectionRecordKey, Partial<API_STATE>> = {}, action: DeleteCollectionRecordAction | UnknownAction ) => {
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
