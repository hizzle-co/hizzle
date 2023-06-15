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
import { DEFAULT_STATE } from './default';

// Cache the stores.
const stores: { [key: string]: object } = {};

/**
 * Initializes the store.
 *
 * @param {string} namespace The namespace.
 * @param {string} collection The collection.
 * @return {object} The store descriptor.
 */
export default function initStore(namespace: string, collection: string): object {
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
        initialState: { ...DEFAULT_STATE },
    });

    register(stores[STORE_NAME]);

    return stores[STORE_NAME];
}
