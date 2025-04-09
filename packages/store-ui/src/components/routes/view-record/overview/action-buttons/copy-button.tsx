/**
 * WordPress dependencies
 */
import { useDispatch } from "@wordpress/data";
import { store as noticesStore } from "@wordpress/notices";
import { Button } from "@wordpress/components";
import { useCopyToClipboard } from '@wordpress/compose';

/**
 * Displays a copy link.
 */
export const CopyButton = ( { value, label } ) => {

    const { createInfoNotice } = useDispatch( noticesStore );

    const ref = useCopyToClipboard(
        value,
        () => {
            createInfoNotice(
                'Copied to clipboard.',
                {
                    type: 'snackbar',
                }
            );
        }
    );

    return (
        <Button label="Click to copy" variant="secondary" ref={ ref } showTooltip>
            { label }
        </Button>
    );
}
