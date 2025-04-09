/**
 * WordPress dependencies
 */
import {
    Card as WPCard,
    CardBody,
    Button,
    __experimentalVStack as VStack,
} from "@wordpress/components";
import { RawHTML } from "@wordpress/element";

/**
 * Displays a normal card.
 *
 * @param {Object} props
 * @param {String} props.heading The card heading.
 * @param {String} props.buttonText The card button text.
 * @param {Object} props.buttonLink The card button link.
 */
export const Card = ( { content, buttonText, buttonLink } ) => (
    <WPCard variant="secondary">
        <CardBody>
            <VStack spacing={ 8 }>
                <RawHTML>
                    { content }
                </RawHTML>

                { ( buttonText && buttonLink ) && (
                    <div>
                        <Button
                            variant="secondary"
                            href={ buttonLink }
                            text={ buttonText }
                        />
                    </div>
                ) }
            </VStack>
        </CardBody>
    </WPCard>
);
