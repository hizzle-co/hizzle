/**
 * External dependencies
 */
import { useDispatch } from "@wordpress/data";
import { useState, Fragment } from "@wordpress/element";
import { Button, Modal, Notice, Spinner, Icon } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";

/**
 * HizzleWP dependencies
 */
import { Setting } from '@hizzlewp/components';
import { store as hizzleStore, useProvidedCollection } from '@hizzlewp/store';

/**
 * Local dependancies.
 */
import { useFilterableFields, prepareField } from "../filters";

/**
 * Displays the bulk edit form.
 */
const EditForm = ( { editableFields, onSave, changes, setAttributes } ) => {

	// Display the edit records form.
	return (
		<form onSubmit={ onSave }>

			{ editableFields.map( ( field ) => {

				const preparedSetting = {
					name: field.name,
					...prepareField( field ),
					default: '',
					placeholder: __( 'Do not update', 'newsletter-optin-box' ),
				};

				let toRemoveSetting: typeof preparedSetting | null = null;

				if ( field.multiple ) {
					preparedSetting.label = sprintf(
						// translators: %s: Field label, e.g. "Tags".
						__( '%s - To Add', 'newsletter-optin-box' ),
						field.label
					);
					preparedSetting.name = `${ field.name }::add`;

					toRemoveSetting = {
						...preparedSetting,
						name: `${ field.name }::remove`,
						label: sprintf(
							// translators: %s: Field label, e.g. "Tags".
							__( '%s - To Remove', 'newsletter-optin-box' ),
							field.label
						)
					}

				}

				return (
					<Fragment key={ field.name }>
						<div style={ { marginBottom: '1.6rem' } }>
							<Setting
								settingKey={ preparedSetting.name }
								saved={ changes }
								setAttributes={ setAttributes }
								setting={ preparedSetting }
							/>
						</div>

						{ toRemoveSetting && (
							<div style={ { marginBottom: '1.6rem' } }>
								<Setting
									settingKey={ toRemoveSetting.name }
									saved={ changes }
									setAttributes={ setAttributes }
									setting={ toRemoveSetting }
								/>
							</div>
						) }
					</Fragment>
				);
			} ) }
		</form>
	);

}

/**
 * Displays a bulk edit button.
 *
 */
export const BulkEdit = ( { isBulkEditing = true, query, isAllSelected, recordsCount } ) => {

	// If we're here, the namespace and collection are provided.
	const { namespace, collection } = useProvidedCollection() || {};

	// Whether the modal is open.
	const [ isOpen, setOpen ] = useState( false );

	// Title.
	const title = isAllSelected ? __( 'Bulk Edit', 'newsletter-optin-box' ) : __( 'Edit Selected', 'newsletter-optin-box' );

	// Saving state.
	const [ error, setError ] = useState<Error | null>( null );
	const [ saving, setSaving ] = useState( false );
	const [ saved, setSaved ] = useState( false );

	// Data to update.
	const [ changes, setChanges ] = useState( {} );
	const hasChanges = Object.keys( changes ).length > 0;
	const setAttributes = ( atts ) => {
		setChanges( { ...changes, ...atts } );

		if ( error ) {
			setError( null );
		}

		if ( saved ) {
			setSaved( false );
		}
	}

	// A function to save records.
	const { bulkUpdateCollectionRecords } = useDispatch( hizzleStore );
	const onSaveRecords = ( e ) => {

		e?.preventDefault();

		// Save once.
		if ( saving ) {
			return;
		}

		setSaving( true );

		bulkUpdateCollectionRecords( namespace || '', collection || '', query, changes )
			.then( () => {
				setSaved( true );
				setChanges( {} );
			} )
			.catch( ( error ) => {
				setError( error );
			} )
			.finally( () => {
				setSaving( false );
			} );
	}

	// Get the bulk editable fields.
	const editableFields = useFilterableFields( { isBulkEditing } );

	// Whether we should display the button.
	if ( editableFields.length === 0 ) {
		return null;
	}

	// Display the button.
	return (
		<>
			<Button
				onClick={ () => setOpen( true ) }
				variant="tertiary"
				text={ title }
				label={ !isAllSelected ? __( 'Edit Selected', 'newsletter-optin-box' ) : __( 'Edit all matching records', 'newsletter-optin-box' ) }
				showTooltip
			/>

			{ isOpen && (
				<Modal title={ title } onRequestClose={ () => setOpen( false ) }>
					<EditForm
						editableFields={ editableFields }
						changes={ changes }
						onSave={ onSaveRecords }
						setAttributes={ setAttributes }
					/>

					{ hasChanges && (
						<Button className="hizzlewp-block-button" variant="primary" onClick={ onSaveRecords } isBusy={ saving }>
							{ !saving && <Icon icon="cloud-saved" /> }&nbsp;
							{ sprintf(
								saving ?
									// translators: %d: Number of records being saved.
									__( 'Updating %d records...', 'newsletter-optin-box' ) :
									// translators: %d: Number of records being edited.
									__( 'Update %d records', 'newsletter-optin-box' ),
								recordsCount
							) }
							{ saving && <Spinner /> }
						</Button>
					) }
					{ error && !hasChanges && (
						<Notice status="error" isDismissible={ true }>
							{ error.message }
						</Notice>
					) }

					{ saved && !hasChanges && (
						<Notice status="success" isDismissible={ true }>
							{ __( 'Records updated successfully.', 'newsletter-optin-box' ) }
						</Notice>
					) }
				</Modal>
			) }
		</>
	);
}
