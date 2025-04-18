/**
 * External dependencies
 */
import React, { createContext, useContext, useMemo } from 'react';

/**
 * Internal dependencies
 */
import { store as hizzleStore } from '.';
import useQuerySelect from './hooks/use-query-select';
import type { CollectionConfig, CollectionRecordKey } from './types';

/**
 * The type of the collection context.
 */
type NamespaceCollection = {
	/**
	 * The namespace of the collection.
	 */
	namespace: string;

	/**
	 * The collection name.
	 */
	collection: string;

	/**
	 * Optional. The current record ID.
	 */
	recordId?: CollectionRecordKey;
};

/**
 * The type of the collection context.
 */
type CollectionContextType = Record<string, Record<string, number>> & {
	/**
	 * The current collection.
	 */
	hizzle_store_current?: NamespaceCollection;
};

/**
 * Context for the collection.
 */
const CollectionContext = createContext<CollectionContextType>( {} );

type CollectionProviderProps = NamespaceCollection & {

	/**
	 * The children to wrap.
	 */
	children: React.ReactNode;
};

/**
 * Context provider component for providing
 * a collection.
 *
 * @param {Object} props            The component's props.
 * @param {string} props.namespace  The collection namespace.
 * @param {string} props.collection The collection name.
 * @param {number} props.recordId   The record ID.
 * @param {*}      props.children   The children to wrap.
 *
 * @return {Object} The provided children, wrapped with
 *                   the collection's context provider.
 */
export const CollectionProvider: React.FC<CollectionProviderProps> = ( { namespace, collection, recordId, children } ) => {
	const parent = useContext( CollectionContext );

	const childContext = useMemo(
		() => ( {
			...parent,
			[ namespace ]: {
				...parent?.[ namespace ],
				[ collection ]: recordId,
			},
			hizzle_store_current: { namespace, collection, recordId },
		} as CollectionContextType ),
		[ parent, namespace, collection, recordId ]
	);

	return (
		<CollectionContext.Provider value={ childContext }>
			{ children }
		</CollectionContext.Provider>
	);
};

/**
 * Hook that returns the current collection.
 *
 * @return {NamespaceCollection|undefined} The collection config from context.
 */
export function useProvidedCollection() {
	const { hizzle_store_current } = useContext( CollectionContext );
	return hizzle_store_current;
}

/**
 * Hook that returns the closest current record ID.
 *
 * @param {string} namespace  The namespace of the collection to use,
 *                            if not provided, the current namespace
 *                            will be used.
 * @param {string} collection The collection name to use,
 *                            if not provided, the current collection
 *                            will be used.
 *
 * @return {number|undefined} The current record ID from context.
 */
export function useProvidedRecordId( namespace: string | undefined = undefined, collection: string | undefined = undefined ) {
	const context = useContext( CollectionContext );

	if ( !namespace || !collection ) {
		return context?.hizzle_store_current?.recordId;
	}

	return context?.[ namespace ]?.[ collection ];
}

/**
 * Hook that returns the current collection config.
 */
export function useProvidedCollectionConfig() {
	const { namespace, collection } = useProvidedCollection() || {};

	const { data: config, ...querySelectRest } = useQuerySelect<CollectionConfig>(
		( query ) => {
			if ( !namespace || !collection ) {
				return {
					data: null,
				};
			}

			return query( hizzleStore ).getCollectionConfig( namespace, collection );
		},
		[ namespace, collection ]
	);

	return {
		config,
		...querySelectRest,
	};
}
