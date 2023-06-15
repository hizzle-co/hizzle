export * as hooks from './hooks';
type AnyConfig = import('@wordpress/data/src/types').AnyConfig;
type StoreDescriptor = import('@wordpress/data/src/types').StoreDescriptor<AnyConfig>;
/**
 * Initializes the store.
 *
 * @param {string} namespace The namespace.
 * @param {string} collection The collection.
 * @return {StoreDescriptor} The store.
 */
export default function initStore(namespace: string, collection: string): StoreDescriptor;
