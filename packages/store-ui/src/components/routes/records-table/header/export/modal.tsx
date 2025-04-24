/**
 * External dependencies
 */
import React, { useState } from "react";

/**
 * WordPress dependencies.
 */
import { useProvidedCollectionConfig } from '@hizzlewp/store';

/**
 * Internal dependencies.
 */
import { Download } from './download';
import { SelectFields } from './select-fields';

/**
 * The modal content.
 *
 */
export const Modal = ( { query } ) => {

    // Prepare state.
    const { config: { hidden, ignore, props } } = useProvidedCollectionConfig();
    const [ fields, setFields ] = useState( ( props
        .map( ( field ) => ( hidden.includes( field.name ) || ignore.includes( field.name ) ) ? null : field.name )
        .filter( Boolean )
    ) );
    const [ step, setStep ] = useState( 'fields' );

    // If we are showing fields...
    if ( 'fields' === step ) {
        return (
            <SelectFields
                fields={ fields }
                setFields={ setFields }
                next={ () => setStep( 'progress' ) }
            />
        );
    }

    // If we are showing the download progress...
    return (
        <Download
            fields={ fields }
            query={ query }
            back={ () => setStep( 'fields' ) }
        />
    );
}
