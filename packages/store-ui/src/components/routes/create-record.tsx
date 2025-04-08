/**
 * External dependencies
 */
import React, { useState, useCallback } from "react";
import {
	Fill,
	FlexItem,
	Slot,
	__experimentalHStack as HStack,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import { store as noticesStore } from '@wordpress/notices';

/**
 * HizzleWP dependencies
 */
import { ErrorBoundary } from '@hizzlewp/components';
import { updatePath } from '@hizzlewp/history';
import { store as hizzleStore, useProvidedCollectionConfig } from '@hizzlewp/store';

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
	const { config: { namespace, collection, props, hidden, ignore, defaultProps, labels } } = useProvidedCollectionConfig() || {};
	const { saveCollectionRecord } = useDispatch( hizzleStore );
	const [ loading, setLoading ] = useState( false );
	const [ record, setRecord ] = useState( {} );
	const newIgnore = [ ...ignore, ...Object.keys( defaultProps || {} ) ];
	const { createErrorNotice, createSuccessNotice, removeAllNotices } = useDispatch( noticesStore );

	// A function to create a new record.
	const handleSubmit = useCallback( ( e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement> ) => {

		e?.preventDefault();

		// Save once.
		if ( loading ) {
			return;
		}

		removeAllNotices();
		setLoading( true );

		saveCollectionRecord( namespace, collection, { ...record, ...defaultProps }, { throwOnError: true } )
			.then( ( { id } ) => {
				createSuccessNotice(
					__( 'Record saved successfully.', 'newsletter-optin-box' ),
					{
						isDismissible: true,
						type: 'default',
					}
				);

				updatePath( `/${ namespace }/${ collection }/${ id }` );
			} )
			.catch( ( error ) => {
				createErrorNotice(
					error.message,
					{
						isDismissible: true,
						type: 'default',
					}
				);
			} )
			.finally( () => {
				setLoading( false );
			} );
	}, [ record, defaultProps, namespace, collection, saveCollectionRecord, createErrorNotice, createSuccessNotice, removeAllNotices ] );

	// Display the add record form.
	return (
		<EditRecordForm
			record={ record }
			onChange={ ( newProps ) => setRecord( { ...record, ...newProps } ) }
			onSubmit={ handleSubmit }
			submitText={ labels?.save_item || 'Save' }
			schema={ props }
			hidden={ hidden }
			ignore={ newIgnore }
			loading={ loading }
			slotName={ `${ namespace }_${ collection }_record_create_below` }
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
		<HStack alignment="flex-start" justify="space-between" wrap>
			<Fill name={ `/${ namespace }/${ collection }/title` }>
				{ labels?.add_new_item || 'Add New Item' }
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
	);
}
