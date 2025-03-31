/**
 * Internal dependencies
 */
import type { CollectionRecordKey, API_STATE } from '../../../types';
import type { SaveCollectionRecordAction, UnknownAction } from '../../actions';

export const saving = ( state: Record<CollectionRecordKey, Partial<API_STATE>> = {}, action: SaveCollectionRecordAction | UnknownAction ) => {
    switch ( action.type ) {
        case 'SAVE_COLLECTION_RECORD_START':
        case 'SAVE_COLLECTION_RECORD_FINISH':
            return {
                ...state,
                [ action.recordId ]: {
                    pending:
                        action.type === 'SAVE_COLLECTION_RECORD_START',
                    error: action.error,
                },
            };
    }

    return state;
}
