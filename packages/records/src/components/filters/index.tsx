/**
 * WordPress dependencies
 */
import { __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { FilterSummary, ColumnFilter } from './filter-summary';
import { ResetFilters } from './reset-filters';
import { useTable } from '..';

export const Filters: React.FC = () => {
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
					onUpdate={ ( filter ) => {
						table.setColumnFilters(
							filters.map( ( f ) => f.id === filter.id ? filter : f )
						);
					} }
				/>
			) ) }

			<ResetFilters />
		</HStack>
	);
}
