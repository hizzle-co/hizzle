/**
 * External dependencies
 */
import React from 'react';
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	__experimentalText as Text,
	Spinner,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { TableProvider, TableProviderProps, useTable } from './context';
import { Head } from './head';
import { Body } from './body';
import { Pagination } from './pagination';

export type TableProps<TData = Record<string, unknown>> = Omit<TableProviderProps<TData>, 'children'> & {

	/**
	 * The message to display when the table is empty.
	 */
	emptyMessage?: string;

	/**
	 * Whether to show the table in loading state.
	 */
	isLoading?: boolean;
};

export function Table<TData = Record<string, unknown>>(
	{ emptyMessage, isLoading, ...props }: TableProps<TData>
) {
	const hasData = props.data?.length > 0;

	return (
		<TableProvider { ...props }>
			<ActionsPanel
				bulkActions={ props.bulkActions }
			/>
			<div className="hizzle-records__table-wrapper">
				<VStack spacing={ 4 }>
					<table className="hizzle-records__table">
						<Head />
						{ hasData && <Body /> }
					</table>
					<Pagination />
				</VStack>
				{ ( !hasData || isLoading ) && (
					<div
						className={ clsx( {
							'hizzle-records__table-loading': isLoading,
							'hizzle-records__table-no-results': !hasData && !isLoading,
						} ) }
					>
						<p>{ isLoading ? (
							<Spinner />
						) : (
							<Text weight={ 700 } size={ 17 } variant="muted" truncate>
								{ emptyMessage || 'No results' }
							</Text>
						) }</p>
					</div>
				) }
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
