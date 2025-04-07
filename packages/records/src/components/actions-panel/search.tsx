/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, memo } from '@wordpress/element';
import { SearchControl } from '@wordpress/components';
import { useDebouncedInput } from '@wordpress/compose';

interface SearchProps {
    /**
     * The label of the search input.
     */
    label?: string;

    /**
     * The current filters.
     */
    filters?: Record<string, any>;

    /**
     * The function to call when the search term changes.
     */
    onChange?: ( filters: Record<string, any> ) => void;
}

export const DataViewsSearch = memo( function Search( { label, filters, onChange }: SearchProps ) {
    /**
     * Initialize the search input with debounced value handling
     */
    const [ search, setSearch, debouncedSearch ] = useDebouncedInput(
        filters?.search ?? ''
    );

    /**
     * Update the search input when filters change
     */
    useEffect( () => {
        setSearch( filters?.search ?? '' );
    }, [ filters?.search, setSearch ] );

    /**
     * Create refs to maintain the latest onChange and filters values
     * without triggering effect dependencies
     */
    const onChangeViewRef = useRef( onChange );
    const filtersRef = useRef( filters );

    /**
     * Keep refs updated with the latest props
     */
    useEffect( () => {
        onChangeViewRef.current = onChange;
        filtersRef.current = filters;
    }, [ onChange, filters ] );

    /**
     * Apply the search filter when the debounced search value changes
     * and differs from the current search filter
     */
    useEffect( () => {
        if ( debouncedSearch !== filtersRef.current?.search ) {
            onChangeViewRef.current?.( {
                ...filtersRef.current,
                paged: 1,
                search: debouncedSearch,
            } );
        }
    }, [ debouncedSearch ] );

    /**
     * Determine the search label to display
     */
    const searchLabel = label || 'Search';
    return (
        <SearchControl
            className="hizzlewp-records-search"
            __nextHasNoMarginBottom
            onChange={ setSearch }
            value={ search }
            label={ searchLabel }
            placeholder={ searchLabel }
            size="compact"
        />
    );
} );
