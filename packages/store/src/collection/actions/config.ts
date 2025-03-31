import { CollectionConfig } from '../../types';

export type CollectionConfigAction = {
    type: 'ADD_COLLECTION_CONFIG',
    config: CollectionConfig
}

/**
 * Returns an action object used in adding new collection config.
 *
 * @param config Collection config.
 *
 * @return {CollectionConfigAction} Action object.
 */
export function addCollectionConfig( config: CollectionConfig ): CollectionConfigAction {
    return {
        type: 'ADD_COLLECTION_CONFIG',
        config,
    };
}
