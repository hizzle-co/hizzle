/**
 * WordPress dependencies
 */
import { __experimentalHStack as HStack, Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { FilterSummary, ColumnFilter } from './filter-summary';
import { ResetFilters } from './reset-filters';
import { useTable } from '..';

export const Filters: React.FC<{ slotName: string }> = ( { slotName } ) => {
	const table = useTable();
	const filters = table.getState().columnFilters;
	const columns = table.getAllLeafColumns();

	if ( filters.length === 0 ) {
		return null;
	}

	return (
		<HStack
			justify="flex-start"
			style={ { width: 'fit-content' } }
			className="hizzlewp-records-filters__container"
			wrap
		>
			<Slot name={ `start/in/filters/${ slotName }` } />
			{ filters.map( ( filter ) => (
				<FilterSummary
					key={ filter.id }
					column={ columns.find( ( column ) => column.id === filter.id ) }
					filter={ filter as ColumnFilter }
					onRemove={ () => {
						table.setColumnFilters(
							filters.filter( ( f ) => f.id !== filter.id )
						);
					} }
				/>
			) ) }

			<ResetFilters />
			<Slot name={ `end/in/filters/${ slotName }` } />
		</HStack>
	);
}
