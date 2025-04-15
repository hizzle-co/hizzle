/**
 * WordPress dependencies
 */
import { __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { useTable, TableProviderProps } from '..';
import { Config } from './config';
import { RecordsSearch } from './search';

/**
 * Actions panel component
 */
export const ActionsPanel = ( { bulkActions, searchLabel }: { bulkActions: TableProviderProps<any>[ 'bulkActions' ], searchLabel?: string } ) => {
	const table = useTable();

	return (
		<HStack expanded={ false }>
			{ bulkActions && bulkActions(
				table.getSelectedRowModel().rows.map( ( row ) => row.id ),
				table.getIsAllPageRowsSelected(),
				table.getIsAllRowsSelected()
			) }
			{ searchLabel && <RecordsSearch label={ searchLabel } /> }
			<Config />
		</HStack>
	);
};
