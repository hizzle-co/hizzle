/**
 * External dependencies.
 */
import React, { useMemo } from 'react';
/**
 * WordPress dependencies.
 */
import { Flex, FlexItem, ToggleControl, Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * HizzleWP dependencies.
 */
import { useProvidedCollectionConfig } from '@hizzlewp/store';

/**
 * Allows the user to select which fields to export.
 *
 * @param {Object} args
 * @param {Array} args.fields The fields to export.
 * @param {Function} args.setFields The function to update the fields.
 * @param {Object} args.schema The schema of the collection.
 * @param {Array} args.schema.schema The schema of the collection.
 * @param {Array} args.schema.ignore The fields to ignore.
 * @param {Function} args.next The function to go to the next step.
 */
export const SelectFields = ( { fields, setFields, next } ) => {
    const { config: { ignore, props } } = useProvidedCollectionConfig();
    const schema = useMemo( () => props.filter( ( field ) => !ignore.includes( field.name ) ), [ props, ignore ] );

    return (
        <Flex direction={ 'column' } gap={ 4 }>

            <FlexItem>
                <p className="description">
                    { __( 'Select the fields to include in your exported file', 'newsletter-optin-box' ) }
                </p>
            </FlexItem>

            { schema.map( ( field ) => {
                return (
                    <FlexItem key={ field.name }>
                        <ToggleControl
                            label={ field.label === field.description ? field.label : `${ field.label } (${ field.description })` }
                            checked={ fields.includes( field.name ) }
                            onChange={ () => {
                                if ( fields.includes( field.name ) ) {
                                    setFields( fields.filter( ( name ) => name !== field.name ) );
                                } else {
                                    setFields( [ ...fields, field.name ] );
                                }
                            } }
                            __nextHasNoMarginBottom
                        />
                    </FlexItem>
                )
            } ) }

            <FlexItem>
                <Button className="hizzlewp-block-button" variant="primary" onClick={ next }>
                    <Icon icon="download" />
                    { __( 'Download', 'newsletter-optin-box' ) }
                </Button>
            </FlexItem>
        </Flex>
    );
}
