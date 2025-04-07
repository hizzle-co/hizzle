/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import {
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { TableProvider, TableProviderProps, useTable } from './context';
import { Head } from './head';
import { Body } from './body';
import { Pagination } from './pagination';

export type TableProps<TData = Record<string, unknown>> = Omit<TableProviderProps<TData>, 'children'>;

export function Table<TData = Record<string, unknown>>(
	props: TableProps<TData>
) {
	return (
		<TableProvider { ...props }>
			<ActionsPanel
				bulkActions={ props.bulkActions }
			/>
			<div className="hizzle-records__table-wrapper dataviews-wrapper">
				<VStack spacing={ 4 }>
					<table className="hizzle-records__table">
						<Head />
						<Body />
					</table>
					<Pagination />
				</VStack>
			</div>
		</TableProvider>
	);
}

const ActionsPanel = ( { bulkActions }: { bulkActions: TableProviderProps<any>[ 'bulkActions' ] } ) => {
	const table = useTable();

	return (
		<HStack expanded={ false }>
			{ bulkActions && bulkActions(
				table.getSelectedRowModel().rows.map( ( row ) => row.id ),
				table.getIsAllPageRowsSelected(),
				table.getIsAllRowsSelected()
			) }
		</HStack>
	);
};
