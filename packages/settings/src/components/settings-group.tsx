/**
 * External dependencies
 */
import React from 'react';
import classnames from 'clsx';

/**
 * WordPress dependencies
 */
import {
    Card,
    CardBody,
    CardHeader,
    __experimentalHeading as Heading,
} from '@wordpress/components';

/**
 * HizzleWP dependencies.
 */
import { checkConditions } from '@hizzlewp/components';

/**
 * Local dependancies.
 */
import { SettingsList } from './section';
import { useSettings } from './settings-provider';

/**
 * Displays a settings group.
 *
 */
export function SettingsGroup( { id, label, className, settings, conditions, cardProps } ): React.ReactNode {

    const { saved } = useSettings();

    if ( Array.isArray( conditions ) && !checkConditions( conditions, saved ) ) {
        return null;
    }

    return (
        <Card
            id={ id }
            isRounded={ false }
            className={ classnames( 'hizzlewp-settings__group', className ) }
            { ...( cardProps || {} ) }
        >
            <CardHeader>
                <Heading level={ 4 } size={ 16 }>
                    { label }
                </Heading>
            </CardHeader>

            <CardBody>
                <SettingsList settings={ settings } />
            </CardBody>

        </Card>
    );
}
