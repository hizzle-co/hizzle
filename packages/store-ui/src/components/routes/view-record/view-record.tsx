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
import { useProvidedCollectionConfig, useCollectionRecord, useProvidedRecordId, getRawValue } from '@hizzlewp/store';

/**
 * Local dependencies
 */
import { Tabs } from "./tabs";
import { ItemActions } from "../records-table/item-actions";


const RecordActions: React.FC<{ namespace: string, collection: string, recordId: string | number }> = ( { namespace, collection, recordId } ) => {
    const { record } = useCollectionRecord( namespace, collection, recordId as number );

    return (
        <Fill name={ `/${ namespace }/${ collection }/actions` }>
            <ItemActions
                actions={ record?.hizzlewp_actions }
                namespace={ namespace }
                collection={ collection }
                id={ getRawValue( record?.id ) }
                isOverview
            />
        </Fill >
    );
}

/**
 * Ensure that the record config is loaded before rendering the page.
 *
 */
const CheckRecord: React.FC<{ children: React.ReactNode, namespace: string, collection: string, recordId: string | number }> = ( { children, namespace, collection, recordId } ) => {
    // Prepare the state.
    // If we're here, we already have a record ID.
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
    const { config: { namespace, collection } } = useProvidedCollectionConfig();

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
            <CheckRecord namespace={ namespace } collection={ collection } recordId={ recordId }>
                <RecordActions namespace={ namespace } collection={ collection } recordId={ recordId } />
                <Outlet path="/:namespace/:collection/:recordId" />
            </CheckRecord>
        </>
    );
}
