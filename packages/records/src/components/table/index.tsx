/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __experimentalVStack as VStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { TableProvider, TableProviderProps } from './context';
import { Head } from './head';
import { Body } from './body';
import { Pagination } from './pagination';

export type TableProps<TData = Record<string, unknown>> = Omit<TableProviderProps<TData>, 'children'>;

export function Table<TData = Record<string, unknown>>(
	props: TableProps<TData>
) {
	return (
		<TableProvider {...props}>
			<div className="hizzle-records__table-wrapper dataviews-wrapper">
				<VStack spacing={4}>
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
