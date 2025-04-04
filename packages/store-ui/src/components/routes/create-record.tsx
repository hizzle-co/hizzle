/**
 * External dependencies
 */
import React, { useState, useMemo, useCallback } from "react";
import {
	Spinner,
	Fill,
	Tip,
	Flex,
	FlexBlock,
	Slot,
	Button,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import { store as noticesStore } from '@wordpress/notices';

/**
 * HizzleWP dependencies
 */
import { Setting, ErrorBoundary } from '@hizzlewp/components';
import { updatePath } from '@hizzlewp/history';
import { store as hizzleStore } from '@hizzlewp/store';

/**
 * Local dependancies.
 */
import { prepareField } from "./records-table/filters";
import { useProvidedCollectionConfig } from "@hizzlewp/store";

export const prepareEditableSchemaFields = ( schema, hidden, ignore ) => (
	schema.map( ( field ) => {

		// Abort for readonly and dynamic fields.
		if ( field.readonly || field.is_dynamic || 'metadata' === field.name ) {
			return null;
		}

		// Abort for hidden fields...
		if ( Array.isArray( hidden ) && hidden.includes( field.name ) ) {
			return null;
		}

		// ... and fields to ignore.
		if ( Array.isArray( ignore ) && ignore.includes( field.name ) ) {
			return null;
		}

		return prepareField( field );
	} ).filter( item => !!item )
);

export const EditSchemaForm = ( { record, onChange, schema, hidden, ignore, onSubmit, loading, slotName, submitText } ) => {

	// Prepare form fields.
	const fields = useMemo( () => prepareEditableSchemaFields( schema, hidden, ignore ), [ schema, hidden, ignore ] );

	return (
		<VStack as="form" spacing={ 4 } style={ { opacity: loading ? 0.5 : 1 } } onSubmit={ onSubmit }>

			{ fields.map( ( field ) => (
				<Setting
					settingKey={ field.name }
					saved={ record }
					setAttributes={ onChange }
					setting={ field }
					key={ field.name }
				/>
			) ) }

			{ slotName && (
				<Slot name={ slotName }>
					{ ( fills ) => (
						Array.isArray( fills ) ?
							fills.map( ( fill, index ) => (
								<Tip key={ index }>{ fill }</Tip>
							)
							) : fills
					) }
				</Slot>
			) }

			<Button className="hizzlewp-block-button" variant="primary" onClick={ onSubmit } isBusy={ loading } __next40pxDefaultSize>
				{ loading ? <Spinner /> : submitText }
			</Button>
		</VStack>
	);
}

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
	const handleSubmit = useCallback( ( e: React.FormEvent<HTMLFormElement> | undefined ) => {

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
		<EditSchemaForm
			record={ record }
			onChange={ ( newProps ) => setRecord( { ...record, ...newProps } ) }
			onSubmit={ handleSubmit }
			submitText={ labels?.save_item || __( 'Save', 'newsletter-optin-box' ) }
			schema={ props }
			hidden={ hidden }
			ignore={ newIgnore }
			loading={ loading }
			slotName={ `${ namespace }_${ collection }_record_create_below` }
		/>
	);
};

const SectionWithErrorBoundary: React.FC<{ children: React.ReactNode }> = ( { children } ) => {
	return (
		<FlexBlock>
			<ErrorBoundary>
				{ children }
			</ErrorBoundary>
		</FlexBlock>
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
		<HStack alignment="flex-start" wrap>
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
