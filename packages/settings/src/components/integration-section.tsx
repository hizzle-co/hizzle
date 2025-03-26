/**
 * External dependencies
 */
import React, { useState } from 'react';
import classnames from 'clsx';

/**
 * WordPress dependencies
 */
import {
    Card,
    CardBody,
    CardHeader,
    Flex,
    FlexBlock,
    FlexItem,
    Button,
    __experimentalText as Text,
    __experimentalHStack as HStack,
    __experimentalVStack as VStack,
    Icon,
} from '@wordpress/components';

/**
 * HizzleWP dependencies.
 */
import { checkConditions, compare } from '@hizzlewp/components';

/**
 * Local dependancies.
 */
import { useSettings } from './settings-provider';
import { SettingsList } from './section';

/**
 * Displays an integration section.
 *
 */
export function IntegrationSection( { id, heading, description, help_url, badges, className, settings, cardProps } ): JSX.Element {

    const [ isOpen, setIsOpen ] = useState( false );
    const { saved } = useSettings();

    let badge: React.ReactNode = null;

    badges.forEach( ( badgeInfo ) => {

        // Key value conditions.
        if ( !Array.isArray( badgeInfo.conditions ) || checkConditions( badgeInfo.conditions, saved ) ) {
            badge = <Text { ...badgeInfo.props }>{ badgeInfo.text }</Text>
        }
    } )

    const style = {
        paddingLeft: 16,
        paddingRight: 16,
        height: 48,
    }

    const HelpLinkOrDescription = () => {
        if ( help_url ) {
            return (
                <Button
                    href={ help_url }
                    target="_blank"
                    icon="info"
                    label="Learn more"
                    showTooltip
                />
            );
        }

        if ( description ) {
            return <Icon icon="info" style={ { color: '#454545' } } />;
        }

        return null;
    }

    return (
        <Card
            id={ id }
            size="small"
            className={ classnames( className, 'noptin-no-shadow' ) }
            { ...( cardProps || {} ) }
        >

            <CardHeader style={ { padding: 0 } }>
                <Flex as={ Button } onClick={ () => setIsOpen( !isOpen ) } style={ style } label={ description } showTooltip>
                    <HStack as={ FlexBlock }>
                        <Text as="h3" weight={ 600 }>
                            { heading }
                        </Text>
                        <HelpLinkOrDescription />
                    </HStack>
                    <FlexItem>
                        <HStack>
                            { badge }
                            <Icon icon={ isOpen ? 'arrow-up-alt2' : 'arrow-down-alt2' } />
                        </HStack>
                    </FlexItem>
                </Flex>
            </CardHeader>

            { isOpen && (
                <CardBody>
                    <VStack spacing={ 6 }>
                        <SettingsList settings={ settings } />
                        { help_url && (
                            <HStack alignment="flex-end" justify="flex-end">
                                <Button
                                    href={ help_url }
                                    target="_blank"
                                    label="Need help?"
                                    variant="secondary"
                                    showTooltip
                                >
                                    <Text>View integration guide</Text>
                                    <Icon icon="external" />
                                </Button>
                            </HStack>
                        ) }
                    </VStack>
                </CardBody>
            ) }

        </Card>
    );
}
