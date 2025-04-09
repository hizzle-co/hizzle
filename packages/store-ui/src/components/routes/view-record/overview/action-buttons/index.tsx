/**
 * External dependencies
 */
import React from "react";

/**
 * WordPress dependencies
 */
import {
    Button,
    __experimentalHStack as HStack,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Local dependencies
 */
import { DeleteLink } from "./delete";
import { RemoteActionLink } from "./remote-action-link";
import { CopyButton } from "./copy-button";

type ActionButton = {
    label: string;
    value: string;
    action: string;
    hide: boolean;
}

type ActionButtonsProps = {
    links: ActionButton[];
    namespace: string;
    collection: string;
    id: string;
}

/**
 * Displays action links.
 *
 * @param {Object} props
 * @param {Array} props.links
 */
export const ActionButtons = ( { links, ...props } : ActionButtonsProps ) => (
    <HStack justify="flex-end" spacing={ 2 } wrap>
        { links.map( ( { label, value, action, hide } ) => {

            // Hide the link.
            if ( hide ) {
                return <React.Fragment key={ label } />;
            }

            // Delete record.
            if ( 'delete' === action ) {
                return <DeleteLink key={ label } label={ label } confirm={ value } { ...props } />;
            }

            // Remote action.
            if ( 'remote' === action ) {
                return <RemoteActionLink key={ label } label={ label } actionName={ value } { ...props } />;
            }

            // Convert &amp; to &.
            if ( value ) {
                value = value.replace( /&amp;/g, '&' );
            }

            // Copy a value.
            if ( 'copy' === action ) {
                return <CopyButton key={ label } label={ label } value={ value } { ...props } />;
            }

            // Default to a link.
            return (
                <Button key={ label } href={ value } variant="secondary" target="_blank">
                    { label }
                </Button>
            );
        } ) }
    </HStack>
);
