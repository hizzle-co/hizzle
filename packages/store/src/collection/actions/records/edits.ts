/**
 * External dependencies
 */
import fastDeepEqual from 'fast-deep-equal/es6';

/**
 * Internal dependencies
 */
import { CollectionRecordKey } from '../../../types';

/**
 * Action triggered to undo the last edit to
 * a collection record, if any.
 */
export const undo =
	() =>
		( { select, dispatch } ) => {
			const undoRecord = select.getUndoManager().undo();
			if ( !undoRecord ) {
				return;
			}
			dispatch( {
				type: 'UNDO',
				record: undoRecord,
			} );
		};

/**
 * Action triggered to redo the last undone
 * edit to a collection record, if any.
 */
export const redo =
	() =>
		( { select, dispatch } ) => {
			const redoRecord = select.getUndoManager().redo();
			if ( !redoRecord ) {
				return;
			}
			dispatch( {
				type: 'REDO',
				record: redoRecord,
			} );
		};

/**
 * Forces the creation of a new undo level.
 *
 * @return {Object} Action object.
 */
export const createUndoLevel =
	() =>
		( { select } ) => {
			select.getUndoManager().addRecord();
		};

/**
 * Returns an action object that triggers an
 * edit to a collection record.
 *
 * @param {string}        namespace            Namespace of the edited collection.
 * @param {string}        collection           Collection of the edited collection.
 * @param {number|string} recordId             Record ID of the edited collection record.
 * @param {Object}        edits                The edits.
 * @param {Object}        options              Options for the edit.
 * @param {boolean}       [options.undoIgnore] Whether to ignore the edit in undo history or not.
 *
 * @return {Object} Action object.
 */
export const editCollectionRecord =
	( namespace: string, collection: string, recordId: CollectionRecordKey, edits: object, options: { undoIgnore?: boolean } = {} ) =>
		( { select, dispatch } ) => {
			const collectionConfig = select.getCollectionConfig( namespace, collection );
			if ( !collectionConfig ) {
				throw new Error(
					`The collection being edited (${ namespace }, ${ collection }) does not have a loaded config.`
				);
			}
			const { mergedEdits = {} } = collectionConfig;
			const record = select.getRawCollectionRecord( namespace, collection, recordId );
			const editedRecord = select.getEditedCollectionRecord(
				namespace,
				collection,
				recordId
			);

			const edit = {
				namespace,
				collection,
				recordId,
				// Clear edits when they are equal to their persisted counterparts
				// so that the property is not considered dirty.
				edits: Object.keys( edits ).reduce( ( acc, key ) => {
					const recordValue = record[ key ];
					const editedRecordValue = editedRecord[ key ];
					const value = mergedEdits[ key ]
						? { ...editedRecordValue, ...edits[ key ] }
						: edits[ key ];
					acc[ key ] = fastDeepEqual( recordValue, value )
						? undefined
						: value;
					return acc;
				}, {} ),
			};
			if ( !options.undoIgnore ) {
				select.getUndoManager().addRecord(
					[
						{
							id: { namespace, collection, recordId },
							changes: Object.keys( edits ).reduce(
								( acc, key ) => {
									acc[ key ] = {
										from: editedRecord[ key ],
										to: edits[ key ],
									};
									return acc;
								},
								{}
							),
						},
					],
					options.isCached
				);
			}
			dispatch( {
				type: 'EDIT_COLLECTION_RECORD',
				...edit,
			} );
		};
