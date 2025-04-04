/**
 * Internal dependencies
 */
import type { CollectionConfig, State } from '../../types';

/**
 * Returns the collection config given its namespace and collection name.
 *
 * @param state Data state.
 * @param namespace  The namespace of the collections.
 * @param collection The collection name.
 *
 * @return Collection config
 */
export function getCollectionConfig(
	state: State,
	namespace: string,
	collection: string
): CollectionConfig | undefined {
	return state.collections?.config?.[ namespace ]?.[ collection ];
}
