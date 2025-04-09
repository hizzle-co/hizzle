/**
 * External dependencies
 */
import React, { useCallback } from "react";

/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';
import {
    Button,
    Spinner,
} from "@wordpress/components";

/**
 * HizzleWP dependencies
 */
import { store as hizzleStore } from '@hizzlewp/store';

/**
 * Displays a remote action link.
 *
 * @param {Object} props
 */
export const RemoteActionLink = ( { label, actionName, namespace, collection, id } ) => {

    // Prepare the state.
    const { doRemoteCollectionRecordAction } = useDispatch( hizzleStore );
    const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

    const isDoingRemoteAction = useSelect(
        ( select ) => {

            return select( hizzleStore ).isDoingRemoteCollectionRecordAction(
                namespace,
                collection,
                id,
                actionName,
            );
        },
        [ namespace, collection, actionName, id ]
    );

    // A function to do a remote action.
    const onDoAction = useCallback( ( e ) => {

        e?.preventDefault();

        // Do once.
        if ( isDoingRemoteAction ) {
            return;
        }

        doRemoteCollectionRecordAction( namespace, collection, id, actionName )
            .then( ( res ) => {
                createSuccessNotice(
                    res?.message,
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
    }, [ doRemoteCollectionRecordAction, createSuccessNotice, createErrorNotice, namespace, collection, actionName, id ] );

    return (
		<Button variant="secondary" onClick={ onDoAction }>
			{ label }
			{ isDoingRemoteAction && <Spinner /> }
		</Button>
	)
}
