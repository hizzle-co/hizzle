/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import type { ButtonProps } from '@wordpress/components/src/button/types';

/**
 * Local dependancies.
 */
import { useSettings } from './settings-provider';

export const useSaveButtonProps = () => {
    const { save, isSaving } = useSettings();

    return {
        variant: 'primary',
        text: isSaving ? __( 'Saving...', 'newsletter-optin-box' ) : __( 'Save Settings', 'newsletter-optin-box' ),
        onClick: save,
        isBusy: isSaving,
        disabled: isSaving,
    } as ButtonProps;
};
