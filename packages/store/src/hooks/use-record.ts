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

export interface RecordResolution<RecordType> {
	/** The requested entity record */
	record: RecordType | null;

	/** The edited entity record */
	editedRecord: Partial<RecordType>;

	/** The edits to the edited entity record */
	edits: Partial<RecordType>;

	/** Apply local (in-browser) edits to the edited entity record */
	edit: ( diff: Partial<RecordType> ) => void;

	/** Persist the edits to the server */
	save: () => Promise<void>;

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
 * @since 6.1.0 Introduced in WordPress core.
 *
 * @param    namespace  Namespace e.g, noptin.
 * @param    collection Collection e.g, `subscribers`.
 * @param    recordId   ID of the requested record.
 * @param    options    Optional hook options.
 * @example
 * ```js
 * import { useRecord } from '@hizzlewp/store';
 *
 * function SubscriberDisplay( { id } ) {
 *   const { record, isResolving, error } = useRecord( 'noptin', 'subscribers', id );
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
 * the store state using `getRecord()`, or resolved if missing.
 *
 * @example
 * ```js
 * import { useCallback } from 'react';
 * import { useDispatch } from '@wordpress/data';
 * import { __ } from '@wordpress/i18n';
 * import { TextControl } from '@wordpress/components';
 * import { store as noticeStore } from '@wordpress/notices';
 * import { useRecord } from '@hizzlewp/store';
 *
 * function SubscriberForm( { id } ) {
 * 	const subscriber = useRecord( 'noptin', 'subscribers', id );
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
 * @template RecordType
 */
export const useRecord = <RecordType>(
	namespace: string,
	collection: string,
	recordId: string | number,
	options: Options = { enabled: true }
): RecordResolution<RecordType> => {
	const { editRecord, saveRecord } = useDispatch( hizzleStore );

	const mutations = useMemo(
		() => ( {
			edit: ( record, editOptions: any = {} ) =>
				editRecord( namespace, collection, recordId, record, editOptions ),
			save: ( saveOptions: any = {} ) =>
				saveRecord( namespace, collection, recordId, {
					throwOnError: true,
					...saveOptions,
				} ),
		} ),
		[ editRecord, namespace, collection, recordId, saveRecord ]
	);

	const { editedRecord, hasEdits, edits } = useSelect(
		( select ) => {
			if ( !options.enabled ) {
				return {
					editedRecord: EMPTY_OBJECT,
					hasEdits: false,
					edits: EMPTY_OBJECT,
				};
			}

			return {
				editedRecord: select( hizzleStore ).getEditedRecord(
					namespace,
					collection,
					recordId
				),
				hasEdits: select( hizzleStore ).hasEditsForRecord(
					namespace,
					collection,
					recordId
				),
				edits: select( hizzleStore ).getRecordNonTransientEdits(
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
			return query( hizzleStore ).getRecord(
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
