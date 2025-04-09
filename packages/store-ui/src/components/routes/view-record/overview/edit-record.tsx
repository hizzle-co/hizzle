/**
 * External dependencies
 */
import React, { useCallback, useMemo } from "react";

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * HizzleWP dependencies
 */
import { useCollectionRecord, useProvidedCollectionConfig, useProvidedRecordId } from '@hizzlewp/store';

/**
 * Internal dependencies
 */
import { EditRecordForm } from "../../../edit-record-form";

/**
 * Allows the user to edit records.
 */
export const EditRecord: React.FC = () => {

	// Prepare the state.
	// If we're here, we already have a record ID and the record is already loaded.
	const recordId = useProvidedRecordId();
	const { config: { namespace, collection, labels, props, hidden, ignore, defaultProps } } = useProvidedCollectionConfig();
	const { editedRecord, edit, save, isSaving } = useCollectionRecord( namespace, collection, recordId as number );
	const { createErrorNotice, createSuccessNotice, removeAllNotices } = useDispatch( noticesStore );
	const newIgnore = useMemo( () => [ ...ignore, ...Object.keys( defaultProps || {} ) ], [ ignore, defaultProps ] );

	// A function to save a record.
	const onSaveRecord = useCallback( ( e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement> ) => {

		e?.preventDefault();

		// Save once.
		if ( isSaving ) {
			return;
		}

		removeAllNotices();

		save()
			.then( () => {
				createSuccessNotice(
					__( 'Record saved successfully.', 'newsletter-optin-box' ),
					{
						type: 'snackbar',
					}
				);
			} )
			.catch( ( error ) => {
				createErrorNotice(
					error.message,
					{
						isDismissible: true,
						type: 'default',
					}
				);

				// Scroll to the top of the page after saving
				const mainContent = document.getElementById( 'hizzlewp-collection__main-content' );
				if ( mainContent ) {
					mainContent.parentElement?.scrollTo( {
						top: 0,
						behavior: 'smooth'
					} );
				}
			} );
	}, [ save, isSaving, createErrorNotice, createSuccessNotice, removeAllNotices ] );

	// Display the add record form.
	return (
		<EditRecordForm
			record={ editedRecord || {} }
			onChange={ edit }
			onSubmit={ onSaveRecord }
			submitText={ labels?.save_item || 'Save' }
			schema={ props }
			hidden={ hidden }
			ignore={ newIgnore }
			loading={ isSaving }
			slotName={ `${ namespace }_${ collection }_record_overview_below` }
		/>
	);
}
