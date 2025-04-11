/**
 * External dependencies
 */
import React, { useState } from 'react';

/**
 * Internal dependencies
 */
import { MapHeaders, MappedHeaders } from './map-headers';
import { Progress } from './progress';

export const ImportFile = ( { file, back }: { file: File, back: () => void } ) => {
    const [ mappedHeaders, setMappedHeaders ] = useState<MappedHeaders>();
    const [ updateRecords, setUpdateRecords ] = useState( false );

    // If we have no headers, map them.
    if ( !mappedHeaders ) {
        return (
            <MapHeaders
                file={ file }
                back={ back }
                onContinue={ ( headers, update ) => {
                    setMappedHeaders( headers );
                    setUpdateRecords( update );

                    // Scroll to the top.
                    window.scrollTo( { top: 0, behavior: 'smooth' } );
                } }
            />
        );
    }

    return (
        <Progress
            file={ file }
            headers={ mappedHeaders }
            back={ back }
            updateRecords={ updateRecords }
        />
    );
};
