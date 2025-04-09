/**
 * WordPress dependencies
 */
import {
    Flex,
    FlexItem,
    __experimentalHStack as HStack,
    __experimentalText as Text,
} from "@wordpress/components";

/**
 * Displays a stat card
 *
 * @param {Object} props
 * @param {Number} props.value - The value to display.
 * @param {String} props.label - The label to display.
 * @param {String} props.status - success, info, warning, error, light
 * @return {JSX.Element} The stat card.
 */
const StatCard = ( { value, label, status } ) => {

    return (
        <div className={ `hizzlewp-stat-card hizzlewp-stat-card__${ status || 'default' }` }>
            <Flex direction="column" justify="center" style={ { minHeight: 100 } }>

                <FlexItem>
                    <Text size={ 48 } weight={ 600 } as="h2">
                        { value }
                    </Text>
                </FlexItem>

                <FlexItem>
                    <Text size={ 13 } weight={ 400 } as="h3">
                        { label }
                    </Text>
                </FlexItem>
            </Flex>
        </div>
    );
}

/**
 * Displays stat cards.
 *
 * @param {Object} props
 * @param {Array} props.cards
 */
export const Stats = ( { cards } ) => (
    <HStack spacing={ 2 } justify="flex-end" wrap>
        { cards.map( ( { title, value, status } ) => (
            <FlexItem key={ title }>
                <StatCard
                    status={ status || 'info' }
                    label={ title }
                    value={ <span dangerouslySetInnerHTML={ { __html: value } } /> }
                />
            </FlexItem>
        ) ) }
    </HStack>
);
