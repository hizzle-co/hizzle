/**
 * External dependencies
 */
import React from "react";
import { Notice, Spinner, Fill } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * HizzleWP dependencies
 */
import { ErrorBoundary } from '@hizzlewp/components';
import { Outlet } from '@hizzlewp/history';
import { useProvidedCollectionConfig, useCollectionRecord, useProvidedRecordId } from '@hizzlewp/store';

/**
 * Local dependencies
 */
import { Tabs } from "./tabs";

/**
 * Ensure that the record config is loaded before rendering the page.
 *
 */
const CheckRecord: React.FC<{ children: React.ReactNode }> = ( { children } ) => {
    // Prepare the state.
    // If we're here, we already have a record ID.
    const recordId = useProvidedRecordId();
    const { config: { namespace, collection } } = useProvidedCollectionConfig();
    const { record, isResolving, hasResolved, error } = useCollectionRecord( namespace, collection, recordId as number );

    // Show loading indicator if still resolving.
    if ( isResolving || !hasResolved ) {
        return <Spinner />;
    }

    // Show error if any.
    if ( error || !record ) {
        return (
            <Notice status="error" isDismissible={ false }>
                { error?.message || 'An unknown error occurred.' }
            </Notice>
        );
    }

    return (
        <ErrorBoundary>
            { children }
        </ErrorBoundary>
    );
}

/**
 * Allows the user to view a single record.
 *
 */
export const ViewRecord: React.FC = () => {

    // Prepare the state.
    const recordId = useProvidedRecordId();
    const { config: { namespace, collection, labels } } = useProvidedCollectionConfig();

    if ( !recordId ) {
        return (
            <Notice status="error" isDismissible={ false }>
                No record ID found.
            </Notice>
        );
    }

    // Display the update record screen.
    return (
        <>
            <Fill name={ `/${ namespace }/${ collection }/title` }>
                <Tabs />
            </Fill>
            <CheckRecord>
                <Outlet path="/:namespace/:collection/:recordId" />
            </CheckRecord>
        </>
    );
}
