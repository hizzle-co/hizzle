/**
 * External dependencies
 */
import React, { useMemo } from "react";

/**
 * WordPress dependencies
 */
import { Spinner } from "@wordpress/components";

/**
 * HizzleWP dependencies
 */
import { useCollectionRecordTabContent } from '@hizzlewp/store';

export const Table = ( { namespace, collection, recordId, tabName } ) => {

    // Prepare the data.
    const data = useCollectionRecordTabContent( namespace, collection, recordId, tabName );

    // In case we don't have an content yet, display a spinner.
    if ( data.isResolving ) {
        return (
            <Spinner />
        );
    }

    return <>TODO</>;
}
