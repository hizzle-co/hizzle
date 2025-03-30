/**
 * External dependencies
 */
import fastDeepEqual from 'fast-deep-equal/es6';
import { v4 as uuid } from 'uuid';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { getNestedValue, setNestedValue } from './utils';
import { removeItems } from './collection';
import { DEFAULT_ENTITY_KEY } from './constants';
import { createBatch } from './batch';
import { STORE_NAME } from './constants';
import { store as hizzleStore } from '.';
import { CollectionRecordKey } from './selectors';
import { CollectionConfig, State } from './types';

/**
 * Returns an action object used in adding new collection config.
 *
 * @param config Collection config.
 *
 * @return {Object} Action object.
 */
export function addCollectionConfig( config: CollectionConfig ) {
	return {
		type: 'ADD_COLLECTION_CONFIG',
		config,
	};
}

/**
 * Returns an action object used in signalling that entity records have been received.
 *
 * @param {string}       namespace       Namespace of the received entity records.
 * @param {string}       collection      Collection of the received entity records.
 * @param {Array}        records         Records received.
 * @param {?Object}      query           Query Object.
 * @param {?boolean}     invalidateCache Should invalidate query caches.
 * @param {?Object}      persistedEdits  Edits to reset.
 * @param {?Object}      meta            Meta information about pagination.
 * @return {Object} Action object.
 */
export function receiveCollectionRecords(
	namespace: string,
	collection: string,
	records: Array<any>,
	query: object | null,
	invalidateCache: boolean | null = false,
	persistedEdits: object | null,
	meta: object | null
): object {

	const action: Record<string, any> = {
		type: 'RECEIVE_ITEMS',
		namespace,
		collection,
		invalidateCache,
		items: Array.isArray( records ) ? records : [ records ],
		persistedEdits,
		meta,
	}

	if ( query ) {
		action.query = query;
	}

	return action;
}

/**
 * Action triggered to delete a collection record.
 *
 * @param {string}        namespace                    Namespace of the deleted collection.
 * @param {string}        collection                   Collection of the deleted collection.
 * @param {number|string} recordId                     Record ID of the deleted record.
 * @param {?Object}       query                        Special query parameters for the
 *                                                     DELETE API call.
 */
export const deleteCollectionRecord =
	(
		namespace: string,
		collection: string,
		recordId: CollectionRecordKey,
		query: object | null
	) =>
		async ( { dispatch, resolveSelect } ) => {
			const collectionConfig = await resolveSelect.getCollectionConfig( namespace, collection );

			let error;
			let deletedRecord = false;
			if ( !collectionConfig ) {
				return;
			}

			const lock = await dispatch.__unstableAcquireStoreLock(
				STORE_NAME,
				[ 'entities', 'records', namespace, collection, recordId ],
				{ exclusive: true }
			);

			try {
				dispatch( {
					type: 'DELETE_COLLECTION_RECORD_START',
					namespace,
					collection,
					recordId,
				} );

				let hasError = false;
				try {
					let path = `${ collectionConfig.baseURL }/${ recordId }`;

					if ( query ) {
						path = addQueryArgs( path, query );
					}

					deletedRecord = await apiFetch( {
						path,
						method: 'DELETE',
					} );

					await dispatch( removeItems( namespace, collection, recordId, true ) );
				} catch ( _error ) {
					hasError = true;
					error = _error;
				}

				dispatch( {
					type: 'DELETE_COLLECTION_RECORD_FINISH',
					namespace,
					collection,
					recordId,
					error,
				} );

				if ( hasError ) {
					throw error;
				}

				return deletedRecord;
			} finally {
				dispatch.__unstableReleaseStoreLock( lock );
			}
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
	( namespace: string, collection: string, recordId: CollectionRecordKey, edits: object, options: Record<string, any> = {} ) =>
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

/**
 * Action triggered to undo the last edit to
 * an entity record, if any.
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
 * edit to an entity record, if any.
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
export const __unstableCreateUndoLevel =
	() =>
		( { select } ) => {
			select.getUndoManager().addRecord();
		};

/**
 * Action triggered to save an entity record.
 *
 * @param {string}   namespace                    Namespace of the collection.
 * @param {string}   collection                   Collection name.
 * @param {Object}   record                       Record to be saved.
 * @param {Object}   options                      Saving options.
 * @param {boolean}  [options.isAutosave=false]   Whether this is an autosave.
 * @param {Function} [options.__unstableFetch]    Internal use only. Function to
 *                                                call instead of `apiFetch()`.
 *                                                Must return a promise.
 * @param {boolean}  [options.throwOnError=false] If false, this action suppresses all
 *                                                the exceptions. Defaults to false.
 */
export const saveCollectionRecord =
	(
		namespace,
		collection,
		record,
		{
			isAutosave = false,
			__unstableFetch = apiFetch,
			throwOnError = false,
		} = {}
	) =>
		async ( { select, resolveSelect, dispatch } ) => {
			const configs = await resolveSelect.getEntitiesConfig( kind );
			const entityConfig = configs.find(
				( config ) => config.kind === kind && config.name === name
			);
			if ( !entityConfig ) {
				return;
			}
			const entityIdKey = entityConfig.key || DEFAULT_ENTITY_KEY;
			const recordId = record[ entityIdKey ];

			const lock = await dispatch.__unstableAcquireStoreLock(
				STORE_NAME,
				[ 'entities', 'records', kind, name, recordId || uuid() ],
				{ exclusive: true }
			);

			try {
				// Evaluate optimized edits.
				// (Function edits that should be evaluated on save to avoid expensive computations on every edit.)
				for ( const [ key, value ] of Object.entries( record ) ) {
					if ( typeof value === 'function' ) {
						const evaluatedValue = value(
							select.getEditedEntityRecord( kind, name, recordId )
						);
						dispatch.editEntityRecord(
							kind,
							name,
							recordId,
							{
								[ key ]: evaluatedValue,
							},
							{ undoIgnore: true }
						);
						record[ key ] = evaluatedValue;
					}
				}

				dispatch( {
					type: 'SAVE_COLLECTION_RECORD_START',
					namespace,
					collection,
					recordId,
				} );
				let updatedRecord;
				let error;
				let hasError = false;
				try {
					const path = `${ entityConfig.baseURL }${ recordId ? '/' + recordId : ''
						}`;
					const persistedRecord = select.getRawEntityRecord(
						kind,
						name,
						recordId
					);

					if ( isAutosave ) {
						// Most of this autosave logic is very specific to posts.
						// This is fine for now as it is the only supported autosave,
						// but ideally this should all be handled in the back end,
						// so the client just sends and receives objects.
						const currentUser = select.getCurrentUser();
						const currentUserId = currentUser
							? currentUser.id
							: undefined;
						const autosavePost = await resolveSelect.getAutosave(
							persistedRecord.type,
							persistedRecord.id,
							currentUserId
						);
						// Autosaves need all expected fields to be present.
						// So we fallback to the previous autosave and then
						// to the actual persisted entity if the edits don't
						// have a value.
						let data = {
							...persistedRecord,
							...autosavePost,
							...record,
						};
						data = Object.keys( data ).reduce(
							( acc, key ) => {
								if (
									[
										'title',
										'excerpt',
										'content',
										'meta',
									].includes( key )
								) {
									acc[ key ] = data[ key ];
								}
								return acc;
							},
							{
								// Do not update the `status` if we have edited it when auto saving.
								// It's very important to let the user explicitly save this change,
								// because it can lead to unexpected results. An example would be to
								// have a draft post and change the status to publish.
								status:
									data.status === 'auto-draft'
										? 'draft'
										: undefined,
							}
						);
						updatedRecord = await __unstableFetch( {
							path: `${ path }/autosaves`,
							method: 'POST',
							data,
						} );

						// An autosave may be processed by the server as a regular save
						// when its update is requested by the author and the post had
						// draft or auto-draft status.
						if ( persistedRecord.id === updatedRecord.id ) {
							let newRecord = {
								...persistedRecord,
								...data,
								...updatedRecord,
							};
							newRecord = Object.keys( newRecord ).reduce(
								( acc, key ) => {
									// These properties are persisted in autosaves.
									if (
										[ 'title', 'excerpt', 'content' ].includes(
											key
										)
									) {
										acc[ key ] = newRecord[ key ];
									} else if ( key === 'status' ) {
										// Status is only persisted in autosaves when going from
										// "auto-draft" to "draft".
										acc[ key ] =
											persistedRecord.status ===
												'auto-draft' &&
												newRecord.status === 'draft'
												? newRecord.status
												: persistedRecord.status;
									} else {
										// These properties are not persisted in autosaves.
										acc[ key ] = persistedRecord[ key ];
									}
									return acc;
								},
								{}
							);
							dispatch.receiveEntityRecords(
								kind,
								name,
								newRecord,
								undefined,
								true
							);
						} else {
							dispatch.receiveAutosaves(
								persistedRecord.id,
								updatedRecord
							);
						}
					} else {
						let edits = record;
						if ( entityConfig.__unstablePrePersist ) {
							edits = {
								...edits,
								...entityConfig.__unstablePrePersist(
									persistedRecord,
									edits
								),
							};
						}
						updatedRecord = await __unstableFetch( {
							path,
							method: recordId ? 'PUT' : 'POST',
							data: edits,
						} );
						dispatch.receiveEntityRecords(
							kind,
							name,
							updatedRecord,
							undefined,
							true,
							edits
						);
					}
				} catch ( _error ) {
					hasError = true;
					error = _error;
				}
				dispatch( {
					type: 'SAVE_COLLECTION_RECORD_FINISH',
					namespace,
					collection,
					recordId,
					error,
				} );

				if ( hasError && throwOnError ) {
					throw error;
				}

				return updatedRecord;
			} finally {
				dispatch.__unstableReleaseStoreLock( lock );
			}
		};

/**
 * Runs multiple core-data actions at the same time using one API request.
 *
 * Example:
 *
 * ```
 * const [ savedRecord, updatedRecord, deletedRecord ] =
 *   await dispatch( 'core' ).__experimentalBatch( [
 *     ( { saveEntityRecord } ) => saveEntityRecord( 'root', 'widget', widget ),
 *     ( { saveEditedEntityRecord } ) => saveEntityRecord( 'root', 'widget', 123 ),
 *     ( { deleteEntityRecord } ) => deleteEntityRecord( 'root', 'widget', 123, null ),
 *   ] );
 * ```
 *
 * @param {Array} requests Array of functions which are invoked simultaneously.
 *                         Each function is passed an object containing
 *                         `saveEntityRecord`, `saveEditedEntityRecord`, and
 *                         `deleteEntityRecord`.
 *
 * @return {(thunkArgs: Object) => Promise} A promise that resolves to an array containing the return
 *                                          values of each function given in `requests`.
 */
export const __experimentalBatch =
	( requests ) =>
		async ( { dispatch } ) => {
			const batch = createBatch();
			const api = {
				saveEntityRecord( kind, name, record, options ) {
					return batch.add( ( add ) =>
						dispatch.saveEntityRecord( kind, name, record, {
							...options,
							__unstableFetch: add,
						} )
					);
				},
				saveEditedEntityRecord( kind, name, recordId, options ) {
					return batch.add( ( add ) =>
						dispatch.saveEditedEntityRecord( kind, name, recordId, {
							...options,
							__unstableFetch: add,
						} )
					);
				},
				deleteEntityRecord( kind, name, recordId, query, options ) {
					return batch.add( ( add ) =>
						dispatch.deleteEntityRecord( kind, name, recordId, query, {
							...options,
							__unstableFetch: add,
						} )
					);
				},
			};
			const resultPromises = requests.map( ( request ) => request( api ) );
			const [ , ...results ] = await Promise.all( [
				batch.run(),
				...resultPromises,
			] );
			return results;
		};

/**
 * Action triggered to save an entity record's edits.
 *
 * @param {string}  kind     Kind of the entity.
 * @param {string}  name     Name of the entity.
 * @param {Object}  recordId ID of the record.
 * @param {Object=} options  Saving options.
 */
export const saveEditedEntityRecord =
	( kind, name, recordId, options ) =>
		async ( { select, dispatch, resolveSelect } ) => {
			if ( !select.hasEditsForEntityRecord( kind, name, recordId ) ) {
				return;
			}
			const configs = await resolveSelect.getEntitiesConfig( kind );
			const entityConfig = configs.find(
				( config ) => config.kind === kind && config.name === name
			);
			if ( !entityConfig ) {
				return;
			}
			const entityIdKey = entityConfig.key || DEFAULT_ENTITY_KEY;

			const edits = select.getEntityRecordNonTransientEdits(
				kind,
				name,
				recordId
			);
			const record = { [ entityIdKey ]: recordId, ...edits };
			return await dispatch.saveEntityRecord( kind, name, record, options );
		};

/**
 * Action triggered to save only specified properties for the collection record.
 *
 * @param {string}        namespace   Namespace of the collection.
 * @param {string}        collection  Collection name.
 * @param {number|string} recordId    ID of the record.
 * @param {Array}         itemsToSave List of record properties or property paths to save.
 * @param {Object}        options     Saving options.
 */
export const saveSpecifiedRecordEdits =
	( namespace: string, collection: string, recordId: CollectionRecordKey, itemsToSave: string[], options: Record<string, any> ) =>
		async ( { select, dispatch, resolveSelect } ) => {
			if ( !select.hasEditsForCollectionRecord( namespace, collection, recordId ) ) {
				return;
			}
			const edits = select.getCollectionRecordEdits(
				namespace,
				collection,
				recordId
			);
			const editsToSave = {};

			for ( const item of itemsToSave ) {
				setNestedValue( editsToSave, item, getNestedValue( edits, item ) );
			}

			const collectionConfig = await resolveSelect.getCollectionConfig( namespace, collection );

			const collectionIdKey = collectionConfig?.key || DEFAULT_ENTITY_KEY;

			// If a record key is provided then update the existing record.
			// This necessitates providing `recordKey` to saveCollectionRecord as part of the
			// `record` argument (here called `editsToSave`) to stop that action creating
			// a new record and instead cause it to update the existing record.
			if ( recordId ) {
				editsToSave[ collectionIdKey ] = recordId;
			}
			return await dispatch.saveCollectionRecord(
				namespace,
				collection,
				editsToSave,
				options
			);
		};

/**
 * Returns an action object used in signalling that the current user has
 * permission to perform an action on a REST resource.
 * Ignored from documentation as it's internal to the data store.
 *
 * @ignore
 *
 * @param {string}  key       A key that represents the action and REST resource.
 * @param {boolean} isAllowed Whether or not the user can perform the action.
 *
 * @return {Object} Action object.
 */
export function receiveUserPermission( key: string, isAllowed: boolean ) {
	return {
		type: 'RECEIVE_USER_PERMISSION',
		key,
		isAllowed,
	};
}

/**
 * Returns an action object used in signalling that the current user has
 * permission to perform an action on a REST resource. Ignored from
 * documentation as it's internal to the data store.
 *
 * @ignore
 *
 * @param {Object<string, boolean>} permissions An object where keys represent
 *                                              actions and REST resources, and
 *                                              values indicate whether the user
 *                                              is allowed to perform the
 *                                              action.
 *
 * @return {Object} Action object.
 */
export function receiveUserPermissions( permissions: Record<string, boolean> ) {
	return {
		type: 'RECEIVE_USER_PERMISSIONS',
		permissions,
	};
}
