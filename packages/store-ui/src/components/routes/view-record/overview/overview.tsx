/**
 * External dependencies
 */
import React from "react";

/**
 * WordPress dependencies
 */
import {
    __experimentalGrid as Grid,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * HizzleWP dependencies
 */
import { useCollectionRecordOverview } from '@hizzlewp/store';

/**
 * Internal dependencies
 */
import { ActionButtons } from "./action-buttons";
import { Stats } from "./stats";
import { Card } from "./card";

/**
 * Displays a record's overview.
 *
 */
export const Overview = ( { namespace, collection, id } ) => {

    // Prepare the overview.
    const overview = useCollectionRecordOverview( namespace, collection, id );

    // In case we don't have an overview yet, display a spinner.
    if ( overview.isResolving ) {
        return (
            <>
                <Grid columns={ 3 }>
                    <div className="hizzlewp-overview-loading-placeholder__card" />
                    <div className="hizzlewp-overview-loading-placeholder__card" />
                    <div className="hizzlewp-overview-loading-placeholder__card" />
                </Grid>
            </>
        );
    }

    // Abort if we have an error.
    if ( overview.error || !Array.isArray( overview.data ) || !overview.data.length ) {
        return null;
    }

    // Display the overview.
    return (
        <>
            { overview.data.map( ( data, index ) => {
                switch ( data.type ) {
                    case 'stat_cards':
                        return <Stats key={ index } cards={ data.cards } />;
                    case 'action_links':
                        return <ActionButtons key={ index } links={ data.links } namespace={ namespace } collection={ collection } id={ id } />;
                    case 'card':
                        return <Card key={ index } { ...data } />;

                    default:
                        return null;
                }
            } ) }
        </>
    );
}
