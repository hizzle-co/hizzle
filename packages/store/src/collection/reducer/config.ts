/**
 * Internal dependencies
 */
import type { CollectionConfig, State } from '../../types';
import { CollectionConfigAction } from '../actions/config';

/**
 * Reducer for collection configs
 */
export const config = (
    state: State[ 'collections' ][ 'config' ] = {},
    action: CollectionConfigAction
): Record<string, Record<string, CollectionConfig>> => {
    switch ( action.type ) {
        case 'ADD_COLLECTION_CONFIG':
            return {
                ...state,
                [ action.config.namespace ]: {
                    ...state[ action.config.namespace ],
                    [ action.config.collection ]: action.config,
                },
            };
        default:
            return state;
    }
}
