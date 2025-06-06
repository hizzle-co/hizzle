/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { store as hizzleStore } from '..';
import { useProvidedRecordId } from '.';

/**
 * Hook that returns the value and a setter for the
 * specified property of the nearest provided
 * record of the specified namespace and collection.
 *
 * @param {string}        namespace  The record namespace.
 * @param {string}        collection  The record collection.
 * @param {string}        prop  The property name.
 * @param {number|string} [_id] An entity ID to use instead of the context-provided one.
 *
 * @return {[*, Function, *]} An array where the first item is the
 *                            property value, the second is the
 *                            setter and the third is the full value
 * 							  object from REST API containing more
 * 							  information like `raw`, `rendered` and
 * 							  `protected` props.
 */
export const useRecordProp = ( namespace: string, collection: string, prop: string, _id: number | string ) => {
	const providerId = useProvidedRecordId( namespace, collection );
	const id = _id ?? providerId;

	const { value, fullValue } = useSelect(
		( select ) => {
			const { getCollectionRecord, getEditedCollectionRecord } = select( hizzleStore );
			const record = getCollectionRecord( namespace, collection, id ); // Trigger resolver.
			const editedRecord = getEditedCollectionRecord( namespace, collection, id );
			return record && editedRecord
				? {
						value: editedRecord[ prop ],
						fullValue: record[ prop ],
				  }
				: {};
		},
		[ namespace, collection, id, prop ]
	);
	const { editCollectionRecord } = useDispatch( hizzleStore );
	const setValue = useCallback(
		( newValue ) => {
			editCollectionRecord( namespace, collection, id, {
				[ prop ]: newValue,
			} );
		},
		[ editCollectionRecord, namespace, collection, id, prop ]
	);

	return [ value, setValue, fullValue ];
}
