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

export function Table<TData>(
	props: Omit<TableProviderProps<TData>, 'children'>
) {
	return (
		<TableProvider {...props}>
			<div className="hizzlewp-table-container dataviews-wrapper">
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
