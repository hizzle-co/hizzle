/**
 * External dependencies
 */
import React, { useState, useCallback, useMemo } from "react";

/**
 * WordPress dependencies
 */
import {
	Fill,
	FlexItem,
	Slot,
	CardBody,
	__experimentalHStack as HStack,
	__experimentalHeading as Heading,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import { store as noticesStore } from '@wordpress/notices';

/**
 * HizzleWP dependencies
 */
import { ErrorBoundary } from '@hizzlewp/components';
import { updatePath } from '@hizzlewp/history';
import {
	useProvidedCollectionConfig,
	useCollectionRecord,
	NEW_RECORD_KEY,
} from '@hizzlewp/store';

/**
 * Local dependancies.
 */
import { EditRecordForm } from "../edit-record-form";

/**
 * Displays the record creation form.
 *
 */
const CreateRecordForm: React.FC = () => {

	// Prepare the state.
	const { config: { namespace, collection, props, hidden, ignore, defaultProps, labels, settings } } = useProvidedCollectionConfig() || {};
	const { editedRecord, edit, isSaving, save } = useCollectionRecord( namespace, collection, NEW_RECORD_KEY );
	const [ loading, setLoading ] = useState( false );
	const newIgnore = useMemo( () => [ ...ignore, ...Object.keys( defaultProps || {} ) ], [ ignore, defaultProps ] );
	const { createErrorNotice, createSuccessNotice, removeAllNotices } = useDispatch( noticesStore );

	const isSubmitting = isSaving || loading;

	// A function to create a new record.
	const handleSubmit = useCallback( async ( e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement> ) => {

		e?.preventDefault();

		// Save once.
		if ( isSubmitting ) {
			return;
		}

		removeAllNotices();
		setLoading( true );

		try {
			const savedRecord = await save( { extraData: defaultProps } );
			createSuccessNotice(
				__( 'Record saved successfully.', 'newsletter-optin-box' ),
				{
					isDismissible: true,
					type: 'snackbar',
				}
			);
			updatePath( `/${ namespace }/${ collection }/${ savedRecord?.id }` );
		} catch ( error ) {
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
		} finally {
			setLoading( false );
		}
	}, [ save, defaultProps, namespace, collection, isSaving, loading, createErrorNotice, createSuccessNotice, removeAllNotices ] );

	// Display the add record form.
	return (
		<EditRecordForm
			record={ editedRecord || {} }
			onChange={ edit }
			onSubmit={ handleSubmit }
			submitText={ labels?.save_item || 'Save' }
			schema={ props }
			hidden={ hidden }
			ignore={ newIgnore }
			loading={ isSubmitting }
			slotName={ `${ namespace }_${ collection }_record_create_below` }
			extraSettings={ settings }
		/>
	);
};

export const SectionWithErrorBoundary: React.FC<{ children: React.ReactNode }> = ( { children } ) => {
	return (
		<FlexItem style={ { width: 400, maxWidth: '100%' } }>
			<ErrorBoundary>
				{ children }
			</ErrorBoundary>
		</FlexItem>
	);
};

/**
 * Allows the user to create new records.
 *
 */
export const CreateRecord: React.FC = () => {

	const { config: { namespace, collection, labels } } = useProvidedCollectionConfig() || {};

	// Display the add record form.
	return (
		<CardBody>
			<HStack alignment="flex-start" justify="space-between" wrap>
				<Fill name={ `/${ namespace }/${ collection }/title` }>
					<Heading level={ 1 } size={ 16 } truncate>
						{ labels?.add_new_item || 'Add New Item' }
					</Heading>
				</Fill>
				<SectionWithErrorBoundary>
					<CreateRecordForm />
				</SectionWithErrorBoundary>

				<Slot name={ `${ namespace }_${ collection }_record_create_upsell` }>
					{ ( fills ) => (
						fills ? (
							<SectionWithErrorBoundary>
								{ fills }
							</SectionWithErrorBoundary>
						) : null
					) }
				</Slot>
			</HStack>
		</CardBody>
	);
}
