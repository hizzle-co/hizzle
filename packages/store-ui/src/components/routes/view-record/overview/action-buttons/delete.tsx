/**
 * External dependencies
 */
import React, { useState, useCallback } from "react";

/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';
import {
    __experimentalVStack as VStack,
    __experimentalHStack as HStack,
    __experimentalText as Text,
    Button,
    Modal,
    Notice,
} from "@wordpress/components";
import { trash } from "@wordpress/icons";

/**
 * HizzleWP dependencies
 */
import { store as hizzleStore } from '@hizzlewp/store';
import { updatePath } from '@hizzlewp/history';

/**
 * The props for the delete modal.
 */
type DeleteModalProps = {
    /**
     * The namespace of the collection.
     */
    namespace: string;

    /**
     * The collection of the record.
     */
    collection: string;

    /**
     * The ID of the record.
     */
    id: string;

    /**
     * The confirmation message.
     */
    confirm?: string;

    /**
     * A function to close the modal.
     */
    closeModal: () => void;
}

/**
 * Displays a delete modal.
 */
export const DeleteModal = ( { confirm = undefined, closeModal, namespace, collection, id }: DeleteModalProps ) => {

    // Prepare the state.
    const { deleteCollectionRecord } = useDispatch( hizzleStore );
    const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

    const { isDeleting, deletingError } = useSelect(
        ( select ) => {

            return {
                isDeleting: select( hizzleStore ).isDeletingCollectionRecord(
                    namespace,
                    collection,
                    id
                ),
                deletingError: select( hizzleStore ).getLastCollectionDeleteError(
                    namespace,
                    collection,
                    id
                ),
            };
        },
        [ namespace, collection, id ]
    );

    // A function to delete a record.
    const onDeleteRecord = useCallback( ( e ) => {

        e?.preventDefault();

        // Delete once.
        if ( isDeleting ) {
            return;
        }

        deleteCollectionRecord( namespace, collection, id )
            .then( () => {
                createSuccessNotice(
                    __( 'Record deleted successfully.', 'newsletter-optin-box' ),
                    {
                        type: 'snackbar',
                    }
                );

                updatePath( `/${ namespace }/${ collection }` );
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
    }, [ deleteCollectionRecord, createSuccessNotice, createErrorNotice, namespace, collection, id ] );

    return (
        <VStack spacing={ 8 }>
            <Text variant="muted">
                { confirm || __( 'Are you sure you want to delete this record?', 'newsletter-optin-box' ) }
            </Text>
            <HStack justify="flex-start">
                <Button variant="primary" isDestructive onClick={ onDeleteRecord } isBusy={ isDeleting } __next40pxDefaultSize>
                    { isDeleting ? __( 'Deleting...', 'newsletter-optin-box' ) : __( 'Delete', 'newsletter-optin-box' ) }
                </Button>
                <Button variant="secondary" onClick={ closeModal } __next40pxDefaultSize>
                    { __( 'Cancel', 'newsletter-optin-box' ) }
                </Button>
            </HStack>
            { deletingError && <Notice status="error" isDismissible={ false }>{ deletingError?.message }</Notice> }
        </VStack>
    );
}

/**
 * The props for the delete link.
 */
type DeleteLinkProps = Omit<DeleteModalProps, 'closeModal'> & {
    /**
     * The label of the link.
     */
    label: string;
}

/**
 * Displays a delete link.
 */
export const DeleteLink = ( { label, ...extra }: DeleteLinkProps ) => {

    // Prepare the state.
    const [ isModalOpen, setIsModalOpen ] = useState( false );

    return (
        <>
            <Button isDestructive onClick={ () => setIsModalOpen( true ) } icon={ trash } variant="secondary">
                { label }
            </Button>
            { isModalOpen && (
                <Modal
                    title={ label }
                    onRequestClose={ () => {
                        setIsModalOpen( false );
                    } }
                >
                    <DeleteModal
                        { ...extra }
                        closeModal={ () => setIsModalOpen( false ) }
                    />
                </Modal>
            ) }
        </>
    );
}
