/**
 * External dependencies
 */
import React, { useMemo } from "react";
import { Slot } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * HizzleWP dependencies
 */
import { useRoute } from '@hizzlewp/history';
import { useProvidedCollectionConfig, useProvidedRecordId } from '@hizzlewp/store';

/**
 * Local dependencies.
 */
import { RecordOverview } from "../overview";
import { Table } from "./table";

/**
 * Displays a given inner tab.
 *
 */
export const TabContent = () => {

    // Prepare the state.
    const { config: { tabs, namespace, collection } } = useProvidedCollectionConfig();
    const recordId = useProvidedRecordId();
    const { params } = useRoute();
    const currentTab = params?.get( 'tab' ) || 'overview';

    const args = {
        namespace,
        collection,
        recordId,
        tabName: params?.get( 'tab' ) || 'overview',
    };

    const content = useMemo( () => {

        if ( !tabs || Array.isArray( tabs ) || !tabs[ args.tabName ] ) {
            return <RecordOverview />;
        }

        switch ( tabs[ args.tabName ].type ) {
            case 'table':
                return <Table tab={ tabs[ args.tabName ] } { ...args } />;
            default:
                return (
                    <Slot
                        name={ `${ namespace }-${ collection }-tab-${ args.tabName }` }
                        fillProps={ { tab: tabs[ args.tabName ], ...args } }
                    />
                );
        }
    }, [ tabs, args.tabName, namespace, collection, recordId ] );

    return (
        <div id={ `tab__${ namespace }-${ collection }__${ currentTab }__content` } className="hizzlewp-tab__content">
            { content }
        </div>
    );
}
