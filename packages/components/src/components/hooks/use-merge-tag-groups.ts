/**
 * External imports.
 */
import { useMemo } from 'react';

/**
 * WordPress imports.
 */
import { __ } from '@wordpress/i18n';
import type { IconKey as DashiconIconKey } from '@wordpress/components/src/dashicon/types';

export interface smartTag {

    /**
     * The smart tag string.
     */
    smart_tag: string;

    /**
     * The smart tag label.
     */
    label: string;

    /**
     * The smart tag description.
     */
    description: string;

    /**
     * The smart tag group.
     */
    group: string;

    /**
     * The smart tag placeholder.
     */
    placeholder: string;

    /**
     * The smart tag example.
     */
    example: string;

    /**
     * Whether the smart tag can be used as a conditional logic string.
     */
    conditional_logic: boolean;

    /**
     * The smart tag options.
     */
    options: any[];

    /**
     * An optional icon.
     */
    icon?: DashiconIconKey;

    /**
     * Whether this is a premium tag.
     */
    isPremium?: boolean;
}

/**
 * Prepares merge tag groups from the available merge tags.
 *
 */
export const useMergeTagGroups = ( availableSmartTags: smartTag[] ) => {

    return useMemo( () => {

        if ( !Array.isArray( availableSmartTags ) ) {
            return {};
        }

        const groups: Record<string, smartTag[]> = {};

        availableSmartTags.forEach( ( smartTag ) => {
            const group = smartTag.group ? smartTag.group : __( 'General', 'newsletter-optin-box' );

            if ( !Array.isArray( groups[ group ] ) ) {
                groups[ group ] = [];
            }

            groups[ group ].push( smartTag );
        } );

        return groups;
    }, [ availableSmartTags ] );
}
