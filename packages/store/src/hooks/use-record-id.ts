/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { RecordContext } from '../collection-context';

/**
 * Hook that returns the ID for the nearest
 * provided record of the specified namespace and collection.
 *
 * @param {string} namespace The record namespace.
 * @param {string} collection The record collection.
 */
export const useRecordId = ( namespace: string, collection: string ) => {
	const context = useContext( RecordContext );
	return context?.[ namespace ]?.[ collection ];
};
