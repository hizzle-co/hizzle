/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useQuerySelect from './use-query-select';
import { store as hizzleStore } from '..';
import type { Status } from './constants';
import { CollectionRecordKey, CollectionRecord } from '../types';
import apiFetch from '@wordpress/api-fetch';

export interface RecordResolution<RecordType> {
	/** The requested collection record or null if not resolved */
	record: RecordType | null;

	/** The edited collection record */
	editedRecord: RecordType | undefined;

	/** The edits to the edited collection record */
	edits: Partial<RecordType>;

	/** Apply local (in-browser) edits to the edited collection record */
	edit: ( diff: Partial<RecordType>, editOptions?: { undoIgnore?: boolean } ) => void;

	/** Persist the edits to the server */
	save: ( saveOptions?: { throwOnError?: boolean, fetchHandler?: typeof apiFetch } ) => Promise<void>;

	/**
	 * Is the record still being resolved?
	 */
	isResolving: boolean;

	/**
	 * Does the record have any local edits?
	 */
	hasEdits: boolean;

	/**
	 * Is the record resolved by now?
	 */
	hasResolved: boolean;

	/** Resolution status */
	status: Status;

	/**
	 * Error that occurred during resolution.
	 */
	error?: Error;
}

export interface Options {
	/**
	 * Whether to run the query or short-circuit and return null.
	 *
	 * @default true
	 */
	enabled: boolean;
}

const EMPTY_OBJECT = {};

/**
 * Resolves the specified collection record.
 *
 * @param    namespace  Namespace e.g, noptin.
 * @param    collection Collection e.g, `subscribers`.
 * @param    recordId   ID of the requested record.
 * @param    options    Optional hook options.
 * @example
 * ```js
 * import { useCollectionRecord } from '@hizzlewp/store';
 *
 * function SubscriberDisplay( { id } ) {
 *   const { record, isResolving, error } = useCollectionRecord( 'noptin', 'subscribers', id );
 *
 *   if ( isResolving ) {
 *     return 'Loading...';
 *   }
 *
 *   if ( error ) {
 *     return 'Error: ' + error.message;
 *   }
 *
 *   return record.email;
 * }
 *
 * // Rendered in the application:
 * // <SubscriberDisplay id={ 1 } />
 * ```
 *
 * In the above example, when `SubscriberDisplay` is rendered into an
 * application, the subscriber and the resolution details will be retrieved from
 * the store state using `getCollectionRecord()`, or resolved if missing.
 *
 * @example
 * ```js
 * import { useCallback } from 'react';
 * import { useDispatch } from '@wordpress/data';
 * import { __ } from '@wordpress/i18n';
 * import { TextControl } from '@wordpress/components';
 * import { store as noticeStore } from '@wordpress/notices';
 * import { useCollectionRecord } from '@hizzlewp/store';
 *
 * function SubscriberForm( { id } ) {
 * 	const subscriber = useCollectionRecord( 'noptin', 'subscribers', id );
 * 	const { createSuccessNotice, createErrorNotice } =
 * 		useDispatch( noticeStore );
 *
 * 	const setEmail = useCallback( ( email ) => {
 * 		subscriber.edit( { email } );
 * 	}, [ subscriber.edit ] );
 *
 * 	if ( subscriber.isResolving ) {
 * 		return 'Loading...';
 * 	}
 *
 * 	if ( subscriber.error ) {
 * 		return 'Error: ' + subscriber.error.message;
 * 	}
 *
 * 	async function onEdit( event ) {
 * 		event.preventDefault();
 * 		try {
 * 			await subscriber.save();
 * 			createSuccessNotice( __( 'Subscriber updated.' ), {
 * 				type: 'snackbar',
 * 			} );
 * 		} catch ( error ) {
 * 			createErrorNotice( error.message, { type: 'snackbar' } );
 * 		}
 * 	}
 *
 * 	return (
 * 		<form onSubmit={ onEdit }>
 * 			<TextControl
 *				__nextHasNoMarginBottom
 *				__next40pxDefaultSize
 * 				label={ __( 'Email' ) }
 * 				value={ subscriber.editedRecord.email }
 * 				onChange={ setEmail }
 * 			/>
 * 			<button type="submit">{ __( 'Save' ) }</button>
 * 		</form>
 * 	);
 * }
 *
 * // Rendered in the application:
 * // <SubscriberForm id={ 1 } />
 * ```
 *
 * In the above example, updating and saving the subscriber email is handled
 * via the `edit()` and `save()` mutation helpers provided by
 * `useRecord()`;
 *
 * @return Entity record data.
 */
export const useCollectionRecord = <RecordType extends CollectionRecord>(
	namespace: string,
	collection: string,
	recordId: CollectionRecordKey,
	options: Options = { enabled: true }
): RecordResolution<RecordType> => {
	const { editCollectionRecord, saveEditedCollectionRecord } = useDispatch( hizzleStore );

	const mutations = useMemo(
		(): Pick<RecordResolution<RecordType>, 'edit' | 'save'> => ( {
			edit: ( edits: Partial<RecordType>, editOptions: { undoIgnore?: boolean } = {} ) =>
				editCollectionRecord( namespace, collection, recordId, edits, editOptions ),
			save: ( saveOptions: { throwOnError?: boolean, fetchHandler?: typeof apiFetch } = {} ) =>
				saveEditedCollectionRecord( namespace, collection, recordId, {
					throwOnError: true,
					...saveOptions,
				} ),
		} ),
		[ editCollectionRecord, namespace, collection, recordId, saveEditedCollectionRecord ]
	);

	const { editedRecord, hasEdits, edits } = useSelect(
		( select ): Pick<RecordResolution<RecordType>, 'editedRecord' | 'hasEdits' | 'edits'> => {
			if ( !options.enabled ) {
				return {
					editedRecord: EMPTY_OBJECT as RecordType,
					hasEdits: false,
					edits: EMPTY_OBJECT,
				};
			}

			return {
				editedRecord: select( hizzleStore ).getEditedCollectionRecord(
					namespace,
					collection,
					recordId
				) as RecordType | undefined,
				hasEdits: select( hizzleStore ).hasEditsForCollectionRecord(
					namespace,
					collection,
					recordId
				),
				edits: select( hizzleStore ).getCollectionRecordNonTransientEdits(
					namespace,
					collection,
					recordId
				),
			};
		},
		[ namespace, collection, recordId, options.enabled ]
	);

	const { data: record, ...querySelectRest } = useQuerySelect<RecordType>(
		( query ) => {
			if ( !options.enabled ) {
				return {
					data: null,
				};
			}
			return query( hizzleStore ).getCollectionRecord(
				namespace,
				collection,
				recordId
			);
		},
		[ namespace, collection, recordId, options.enabled ]
	);

	return {
		record,
		editedRecord,
		hasEdits,
		edits,
		...querySelectRest,
		...mutations,
	};
}
