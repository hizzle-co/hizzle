/**
 * Internal dependencies
 */
import type { CollectionConfig, State } from '../../types';

type Action = {
    /**
     * The type of action
     */
    type: string,

    /**
     * The config to set
     */
    config: CollectionConfig
}

/**
 * Reducer for collection configs
 */
export const config = (
    state: State[ 'collections' ][ 'config' ] = {},
    action: Action
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
