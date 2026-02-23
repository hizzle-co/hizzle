/**
 * External dependencies.
 */
import React, { useMemo } from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

/**
 * WordPress dependencies.
 */
import { Button, Notice, __experimentalText as Text, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * HizzleWP dependencies.
 */
import { useCollectionRecords, useProvidedCollectionConfig } from '@hizzlewp/store';

/**
 * Fetches records from the API and converts them to CSV.
 *
 * @param {Object} args
 * @param {Array} args.fields The fields to export.
 * @param {Function} args.back The callback to call when clicking on the back button.
 * @param {Array} args.schema The schema of the collection.
 */
export const Download = ( { fields, back, query, recordsCount } ) => {

    const shouldBackgroundExport = ( recordsCount || 0 ) > 500;

    const { config: { namespace, collection, props } } = useProvidedCollectionConfig();

    // Fetch the records.
    const exportArgs = {
        ...query,
        __fields: fields.join( ',' ),
        per_page: shouldBackgroundExport ? 1 : -1,
        context: 'edit',
        background_export: shouldBackgroundExport,
    }

    const records = useCollectionRecords( namespace, collection, exportArgs );

    // Loop through columns and and try to replace the column name with the label where possible.
    const columns = useMemo( () => {

        if ( !records.records?.length ) {
            return [];
        }

        // Pluck name and label from the schema.
        const knownFields = props.reduce( ( acc, field ) => {
            acc[ field.name ] = field.js_props?.table_label || field.label;
            return acc;
        }, {} );

        // Map the known fields to record fields.
        return Object.keys( records.records[ 0 ] ).map( ( column ) => {
            return knownFields[ column ] || column;
        } );
    }, [ props, records.records ] );

    // Convert to CSV.
    const csv = useMemo( () => {

        if ( !records.records?.length || !columns.length ) {
            return '';
        }

        return Papa.unparse(
            {
                fields: columns,
                data: records.records.map( ( record ) => {
                    return Object.values( record );
                } ),
            },
            { escapeFormulae: true }
        ) as string;
    }, [ records.records, columns ] );

    const backButton = (
        <Button variant="link" onClick={ back }>
            { __( 'Go Back', 'newsletter-optin-box' ) }
        </Button>
    );

    // Short spinner if loading.
    if ( records.isResolving ) {
        return (
            <Text size={ 16 } as="p">
                <Spinner style={ { marginLeft: 0 } } />
                { shouldBackgroundExport
                    ? __( 'Queuing export...', 'newsletter-optin-box' )
                    : __( 'Preparing records...', 'newsletter-optin-box' )
                }
            </Text>
        );
    }

    // Show error if any.
    if ( 'ERROR' === records.status || records.error ) {

        return (
            <Notice status="error" isDismissible={ false }>
                { records.error?.message || 'An unknown error occurred.' }&nbsp; &nbsp;
                { backButton }
            </Notice>
        )
    }

    // If background export, show notice after request succeeds.
    if ( shouldBackgroundExport ) {
        return (
            <Notice status="success" isDismissible={ false }>
                { __( "We are generating your export in the background. We'll email you when it's ready.", 'newsletter-optin-box' ) }
                &nbsp; &nbsp;
                { backButton }
            </Notice>
        );
    }

    // If no records, nothing to export.
    if ( !records.records?.length ) {
        return (
            <Notice status="info" isDismissible={ false }>
                Found no records to export.&nbsp; &nbsp;
                { backButton }
            </Notice>
        )
    }

    const filename = `${ namespace }-${ collection }-${ Date.now() }.csv`;

    // Force download.
    return (
        <Notice status="success" isDismissible={ false }>
            { __( "Done! Click the button below to download records.", 'newsletter-optin-box' ) }
            &nbsp; &nbsp;
            <Button
                variant="primary"
                text={ __( 'Download CSV', 'newsletter-optin-box' ) }
                onClick={ () => saveAs(
                    new Blob( [ csv ], { type: "text/csv;charset=utf-8" } ),
                    filename
                ) }
            />
        </Notice>
    );
}
