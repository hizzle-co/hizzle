/**
 * External dependencies
 */
import React, { useState, useCallback } from "react";

/**
 * WordPress dependencies
 */
import { __, sprintf } from "@wordpress/i18n";
import {
	Button,
	Modal,
	Spinner,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	__experimentalText as Text,
} from "@wordpress/components";
import { useDispatch } from "@wordpress/data";

/**
 * HizzleWP dependencies
 */
import { store as hizzleStore, useProvidedCollection } from '@hizzlewp/store';

type DeleteTarget = {
	query: Record<string, any>;
	isAllSelected: boolean;
	recordsCount: number;
};

/**
 * Displays a delete button.
 *
 */
export const BulkDelete = ( { query, isAllSelected, recordsCount } ) => {

	// If we're here, the namespace and collection are provided.
	const { namespace, collection } = useProvidedCollection() || {};

	// Whether the modal is open.
	const [ deleteTarget, setDeleteTarget ] = useState<DeleteTarget | null>( null );

	// Deleting state.
	const [ error, setError ] = useState<Error | null>( null );
	const [ deleting, setDeleting ] = useState( false );

	// Title.
	const title = isAllSelected ? __( 'Delete', 'newsletter-optin-box' ) : __( 'Delete Selected', 'newsletter-optin-box' );
	const modalTitle = deleteTarget?.isAllSelected ? __( 'Delete', 'newsletter-optin-box' ) : __( 'Delete Selected', 'newsletter-optin-box' );

	const { bulkDeleteCollectionRecords } = useDispatch( hizzleStore );

	// A function to delete records.
	const onDeleteRecords = useCallback( ( e ) => {

		e?.preventDefault();

		// Delete once.
		if ( deleting || !deleteTarget ) {
			return;
		}

		setDeleting( true );

		bulkDeleteCollectionRecords( namespace as string, collection as string, deleteTarget.query )
			.then( () => {
				setDeleteTarget( null );
			} )
			.catch( ( error ) => {
				setError( error );
			} )
			.finally( () => {
				setDeleting( false );
			} );
	}, [ deleting, namespace, collection, deleteTarget ] );

	const warningText = error?.message || ( deleteTarget?.isAllSelected ? sprintf(
		// translators: %d: Number of records being deleted.
		__( 'Are you sure you want to delete %d matching records?', 'newsletter-optin-box' ),
		deleteTarget.recordsCount
	) : sprintf(
		// translators: %d: Number of records being deleted.
		__( 'Are you sure you want to delete %d selected records?', 'newsletter-optin-box' ),
		deleteTarget?.recordsCount || 0
	) );

	return (
		<>

			<Button
				onClick={ () => {
					setError( null );
					// Freeze the target while the confirmation modal is open. Fetching
					// records resets table selection and must not broaden this delete.
					setDeleteTarget( {
						query: { ...query },
						isAllSelected,
						recordsCount,
					} );
				} }
				variant="tertiary"
				text={ title }
				label={ !isAllSelected ? __( 'Delete Selected', 'newsletter-optin-box' ) : 'Delete all matching records' }
				showTooltip
				isDestructive
			/>

			{ deleteTarget && (
				<Modal title={ modalTitle } onRequestClose={ () => setDeleteTarget( null ) }>
					<VStack>
						{ deleting ? (
							<>
								<Spinner />
								{ __( 'Deleting...', 'newsletter-optin-box' ) }
							</>
						) : (
							<>
								<Text isDestructive>
									{ warningText }
								</Text>

								<HStack wrap>
									<Button className="hizzlewp-block-button" isDestructive variant="primary" onClick={ onDeleteRecords }>
										{ __( 'Yes, Delete!', 'newsletter-optin-box' ) }
									</Button>

									<Button className="hizzlewp-block-button" onClick={ () => setDeleteTarget( null ) } variant="secondary">
										{ __( 'Cancel', 'newsletter-optin-box' ) }
									</Button>
								</HStack>
							</>
						) }
					</VStack>
				</Modal>
			) }

		</>
	);
}
