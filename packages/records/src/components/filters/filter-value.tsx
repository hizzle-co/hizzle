/**
 * External dependencies
 */
import type { Column } from '@tanstack/react-table';
import React, { useState } from 'react';

/**
 * WordPress dependencies
 */
import {
    SelectControl,
    FormTokenField,
    TextareaControl,
    __experimentalNumberControl as NumberControl,
    Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * HizzleWP dependencies
 */
import { MultiSelectSetting, useOptions, InputSetting } from '@hizzlewp/components';

const RenderInput = ( { meta, value, onUpdate, label } ) => {
    const options = useOptions( meta.options || [] );

    if ( meta.el === 'is_tokens' ) {
        return (
            <FormTokenField
                label={ label }
                value={ Array.isArray( value ) ? value : [] }
                onChange={ onUpdate }
                suggestions={ meta.suggestions || [] }
                __next40pxDefaultSize
                __nextHasNoMarginBottom
            />
        )
    }

    if ( options.length > 0 ) {

        if ( meta.multiple ) {
            return (
                <MultiSelectSetting
                    label={ label }
                    value={ value }
                    options={ options }
                    onChange={ onUpdate }
                />
            );
        }

        return (
            <SelectControl
                label={ label }
                value={ value }
                options={ options }
                onChange={ onUpdate }
                __next40pxDefaultSize
                __nextHasNoMarginBottom
            />
        );
    }

    if ( meta.is_numeric || meta.is_float ) {
        return (
            <NumberControl
                label={ label }
                value={ value }
                onChange={ onUpdate }
                __next40pxDefaultSize
            />
        )
    }

    if ( meta.is_primary || meta.is_textarea ) {
        return (
            <TextareaControl
                label={ label }
                value={ value }
                onChange={ onUpdate }
                help={ __( 'Separate multiple values with a comma.', 'newsletter-optin-box' ) }
                __nextHasNoMarginBottom
            />
        )
    }

    return (
        <InputSetting
            label={ label }
            value={ value }
            onChange={ onUpdate }
            setting={ {
                type: meta.is_date ? 'datetime-local' : 'text',
            } }
        />
    )
}

interface Props {
    value?: string | string[];
    onUpdate: ( filter: string | string[] | undefined ) => void;
    column: Column<any>;
    label: string;
}


export const EditFilterValue: React.FC<Props> = ( { value, onUpdate, column, label } ) => {
    const meta: Record<string, string> = column.columnDef.meta as Record<string, string> || {};
    const [ localValue, setLocalValue ] = useState( value );

    return (
        <>
            <RenderInput
                meta={ meta }
                value={ localValue }
                onUpdate={ setLocalValue }
                label={ label }
            />
            <div>
                <Button variant="primary" onClick={ () => onUpdate( localValue ) }>
                    { __( 'Apply', 'newsletter-optin-box' ) }
                </Button>
            </div>
        </>
    );
};
