/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useTable } from '..';

export const ResetFilters: React.FC = () => {
    const table = useTable();
    const filters = table.getState().columnFilters;

    return (
        <Button
            disabled={ !Array.isArray( filters ) || filters.length === 0 }
            accessibleWhenDisabled
            size="compact"
            variant="tertiary"
            className="hizzlewp-records-filters__reset-button"
            onClick={ () => {
                table.resetColumnFilters();
            } }
        >
            { __( 'Reset' ) }
        </Button>
    );
}
