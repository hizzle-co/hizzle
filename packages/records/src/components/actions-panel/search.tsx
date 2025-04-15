/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, memo } from '@wordpress/element';
import { SearchControl } from '@wordpress/components';
import { useDebouncedInput } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { useTable } from '..';

interface SearchProps {
    /**
     * The label of the search input.
     *
     * Leave blank to disable the search input.
     */
    label?: string;
}

export const RecordsSearch = memo( function Search( { label }: SearchProps ) {
    const table = useTable();

    /**
     * Initialize the search input with debounced value handling
     */
    const [ search, setSearch, debouncedSearch ] = useDebouncedInput(
        table.getState().globalFilter ?? ''
    );

    /**
     * Apply the search filter when the debounced search value changes
     * and differs from the current search filter
     */
    useEffect( () => {
        if ( debouncedSearch !== table.getState().globalFilter ) {
            table.setGlobalFilter( debouncedSearch );
        }
    }, [ debouncedSearch, table.setGlobalFilter ] );

    if ( !label ) {
        return null;
    }

    return (
        <SearchControl
            className="hizzlewp-records-search"
            __nextHasNoMarginBottom
            onChange={ setSearch }
            value={ search }
            label={ label }
            placeholder={ label }
            size="compact"
        />
    );
} );
