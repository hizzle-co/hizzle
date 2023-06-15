/**
 * External dependencies
 */
import { createReduxStore, register } from '@wordpress/data';
import { controls } from '@wordpress/data-controls';
import { controls as dataControls } from '@wordpress/data';

/**
 * Internal dependencies
 */
import * as actions from './actions';
import createDynamicActions from './dynamic-actions';
import { reducer } from './reducer';
import createResolvers from './resolvers';
import * as selectors from './selectors';
export * as hooks from './hooks';


type AnyConfig = import('@wordpress/data/src/types').AnyConfig;
type StoreDescriptor = import('@wordpress/data/src/types').StoreDescriptor<AnyConfig>;

// Cache the stores.
const stores: { [key: string]: StoreDescriptor } = {};

/**
 * Initializes the store.
 *
 * @param {string} namespace The namespace.
 * @param {string} collection The collection.
 * @return {StoreDescriptor} The store.
 */
export default function initStore(namespace: string, collection: string): StoreDescriptor {
    const STORE_NAME = `${namespace}/${collection}`;

    // If the store already exists, return it.
    if (stores[STORE_NAME]) {
        return stores[STORE_NAME];
    }

    // Create the store.
    stores[STORE_NAME] = createReduxStore(STORE_NAME, {
        reducer,
        actions: { ...actions, ...createDynamicActions(namespace, collection) },
        selectors: { ...selectors },
        controls: { ...controls, ...dataControls },
        resolvers: createResolvers(namespace, collection),
    });

    register(stores[STORE_NAME]);

    return stores[STORE_NAME];
}
