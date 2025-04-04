import { Button, Tip } from "@wordpress/components";

/**
 * Displays an upsell div.
 */
export const Upsell = ( { children } ) => {
    return (
        <div className="hizzlewp-upsell-card">
            { children }
        </div>
    );
};

/**
 * Displays an upsell card.
 *
 * @param {Object} props
 * @returns 
 */
export const UpsellCard = ( { upsell } ) => {

    if ( !upsell ) {
        return null;
    }

    const { content, buttonURL, buttonText } = upsell;

    return (
        <Upsell>
            <Tip>
                { content }
                <Button href={ buttonURL } target="_blank" variant="link">
                    { buttonText }
                </Button>
            </Tip>
        </Upsell>
    );
};
