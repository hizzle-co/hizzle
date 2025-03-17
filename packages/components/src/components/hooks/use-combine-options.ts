/**
 * External dependencies
 */
import { useMemo } from 'react';

/**
 * Local dependencies
 */
import { useMergeTagGroups, smartTag } from '.';
import { SelectOption } from '../select';

/**
 * Combines options with dynamic value option.
 *
 * @param options The options.
 * @param availableSmartTags The available smart tags.
 */
export const useCombineOptions = ( options: SelectOption[], availableSmartTags: smartTag[] | undefined = [] ) => {
    const groups = useMergeTagGroups( availableSmartTags );

    return useMemo( () => {

        if ( !Array.isArray( availableSmartTags ) ) {
            return options;
        }

        let newOptions = [ ...options ];

        Object.keys( groups ).forEach( ( group ) => {
            if ( !Array.isArray( groups[ group ] ) || !groups[ group ].length ) {
                return;
            }

            newOptions.push( {
                value: `select_dynamic_value__${ group }`,
                label: `${ group } Dynamic Values`,
                disabled: true,
            } );

            groups[ group ].forEach( ( item ) => {
                newOptions.push( {
                    value: `[[${ item.smart_tag }]]`,
                    label: item.label,
                    render: item.label,
                    render_filtered: `${ group } &gt;&gt; ${ item.label }`,
                    search: `${ item.label } ${ group } ${ item.smart_tag } ${ item.description }`,
                } );
            } );
        } );

        return newOptions;
    }, [ groups, options ] );
}
