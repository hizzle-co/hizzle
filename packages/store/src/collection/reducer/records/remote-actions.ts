/**
 * Internal dependencies
 */
import type { CollectionRecordKey, API_STATE } from '../../../types';
import type { DoRemoteCollectionRecordActionAction, UnknownAction } from '../../actions';

export const remoteActions = ( state: Record<string, Record<CollectionRecordKey, Partial<API_STATE>>> = {}, action: DoRemoteCollectionRecordActionAction | UnknownAction ) => {
    switch ( action.type ) {
        case 'DO_REMOTE_COLLECTION_RECORD_ACTION_START':
        case 'DO_REMOTE_COLLECTION_RECORD_ACTION_FINISH':
            return {
                ...state,
                [ action.action ]: {
                    ...state[ action.action ],
                    [ action.recordId ]: {
                        pending:
                            action.type === 'DO_REMOTE_COLLECTION_RECORD_ACTION_START',
                        error: action.error,
                    },
                },
            };
    }

    return state;
}
