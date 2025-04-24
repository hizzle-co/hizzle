/**
 * External dependencies.
 */
import React, { useState } from 'react';

/**
 * WordPress dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button, Modal } from '@wordpress/components';

/**
 * HizzleWP dependencies
 */
import { ErrorBoundary } from '@hizzlewp/components';

/**
 * Internal dependencies.
 */
import { Modal as ExportModal } from './modal';

/**
 * Displays a modal allowing users to export all records matching the current collection.
 *
 */
export const ExportButton = ( { query, isAllSelected, recordsCount } ) => {

    // Whether the modal is open.
    const [ isOpen, setOpen ] = useState( false );

    // Title.
    const title = isAllSelected ? __( 'Download', 'newsletter-optin-box' ) : __( 'Download Selected', 'newsletter-optin-box' );

    const modalTitle = isAllSelected ? sprintf(
        /* translators: %s: number of records */
        __( 'Download all %s records', 'newsletter-optin-box' ),
        recordsCount
    ) : sprintf(
        /* translators: %s: number of records */
        __( 'Download %s selected records', 'newsletter-optin-box' ),
        recordsCount
    );

    return (
        <>
            <Button
                onClick={ () => setOpen( true ) }
                variant="tertiary"
                text={ title }
            />

            { isOpen && (
                <Modal title={ modalTitle } onRequestClose={ () => setOpen( false ) }>
                    <div className="hizzle-records-export-modal__body">
                        <ErrorBoundary>
                            <ExportModal query={ query } />
                        </ErrorBoundary>
                    </div>
                </Modal>
            ) }

        </>
    );
}
