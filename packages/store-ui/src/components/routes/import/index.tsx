/**
 * External dependencies
 */
import React, { useState } from "react";

/**
 * WordPress dependencies
 */
import {
    Fill,
    CardBody,
    __experimentalHStack as HStack,
    __experimentalHeading as Heading,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * HizzleWP dependencies
 */
import { useProvidedCollectionConfig } from '@hizzlewp/store';
import { ErrorBoundary } from "@hizzlewp/components";

/**
 * Internal dependencies
 */
import { SelectFile } from "./select-file";
import { ImportFile } from "./import-file";

/**
 * Allows the user to import new records.
 *
 */
export const Import: React.FC = () => {

    const { config: { namespace, collection, labels } } = useProvidedCollectionConfig() || {};

    const [ file, setFile ] = useState<File | null>( null );

    // Display the add record form.
    return (
        <CardBody>
            <Fill name={ `/${ namespace }/${ collection }/title` }>
                <Heading level={ 1 } size={ 16 } truncate>
                    { labels?.import || 'Import' }
                </Heading>
            </Fill>
            <ErrorBoundary>
                { file ? (
                    <ImportFile file={ file } back={ () => setFile( null ) } />
                ) : (
                    <SelectFile onUpload={ setFile } />
                ) }
            </ErrorBoundary>
        </CardBody>
    );
}
