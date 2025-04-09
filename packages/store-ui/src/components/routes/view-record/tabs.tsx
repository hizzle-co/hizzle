/**
 * External dependencies
 */
import React, { useCallback } from "react";
import { Button, NavigableMenu, __experimentalHStack as HStack } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * HizzleWP dependencies
 */
import { ErrorBoundary } from '@hizzlewp/components';
import { useRoute, updatePath } from '@hizzlewp/history';
import { useProvidedCollectionConfig, useProvidedRecordId } from '@hizzlewp/store';

/**
 * Allows the user to view a single inner record.
 *
 */
export const Tabs = () => {

    // Prepare the state.
    const { config: { labels, tabs: schemaTabs, namespace, collection } } = useProvidedCollectionConfig();
    const recordId = useProvidedRecordId();
    const recordPath = `${ namespace }/${ collection }/${ recordId }`;
    const { params } = useRoute();

    // Prepare the tabs.
    const tabs = [
        {
            title: labels?.edit_item || labels?.singular_name || 'Edit',
            name: 'overview',
        }
    ]

    // Add any additional tabs.
    if ( schemaTabs && !Array.isArray( schemaTabs ) ) {
        Object.entries( schemaTabs ).map( ( [ name, { title } ] ) => (
            tabs.push( {
                title,
                name,
            } )
        ) );
    }

    // Fired when a tab is selected.
    const onTabSelect = useCallback( ( tabIndex ) => {
        const newTab = tabs[ tabIndex ]?.name || 'overview';
        const newPath = 'overview' === newTab ? recordPath : `${ recordPath }/${ newTab }`;
        updatePath( newPath );
    }, [ recordPath ] );

    const currentTab = params?.get( 'tab' ) || 'overview';

    // Display the update record screen.
    return (
        <ErrorBoundary>
            { tabs.length > 1 ? (
                <HStack
                    as={ NavigableMenu }
                    orientation="horizontal"
                    className="hizzle-interface__header-menu"
                    expanded={ false }
                    spacing={ 0 }
                    alignment="stretch"
                    onNavigate={ onTabSelect }
                    wrap
                >
                    { tabs.map( ( recordTab, index ) => (
                        <Button
                            key={ recordTab.name }
                            isPressed={ recordTab.name === currentTab || ( !currentTab && 0 === index ) }
                            onClick={ () => onTabSelect( index ) }
                            __next40pxDefaultSize
                        >
                            { recordTab.title }
                        </Button>
                    ) ) }
                </HStack>
            ) : (
                <>{ labels?.singular_name || 'Item' }</>
            ) }
        </ErrorBoundary >
    );
};
