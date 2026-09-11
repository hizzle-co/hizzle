/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, memo } from '@wordpress/element';
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
	const globalFilter = table.state.globalFilter ?? '';

    /**
     * Initialize the search input with debounced value handling
     */
    const [ search, setSearch, debouncedSearch ] = useDebouncedInput(
		globalFilter
    );
	const previousGlobalFilter = useRef( globalFilter );
	const syncingExternalFilter = useRef( false );

	/**
	 * Keep the input in sync when navigation changes the query externally.
	 * The ref prevents the old debounced value from immediately restoring it.
	 */
	useEffect( () => {
		if ( globalFilter === previousGlobalFilter.current ) {
			return;
		}

		previousGlobalFilter.current = globalFilter;

		if ( globalFilter !== debouncedSearch ) {
			syncingExternalFilter.current = true;
			setSearch( globalFilter );
		}
	}, [ globalFilter, debouncedSearch, setSearch ] );

    /**
     * Apply the search filter when the debounced search value changes
     * and differs from the current search filter
     */
    useEffect( () => {
		if ( syncingExternalFilter.current ) {
			if ( debouncedSearch === globalFilter ) {
				syncingExternalFilter.current = false;
			}

			return;
		}

		if ( debouncedSearch !== globalFilter ) {
            table.setGlobalFilter( debouncedSearch );
        }
	}, [ debouncedSearch, globalFilter, table.setGlobalFilter ] );

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
