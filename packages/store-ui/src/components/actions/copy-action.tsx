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
export const CopyAction = ( { value, onClick = () => {}, as = Button, ...props } ) => {

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
            onClick?.();
        }
    );

    const Component = as || Button;

    return (
        <Component label="Click to copy" ref={ ref } showTooltip { ...props } />
    );
}
