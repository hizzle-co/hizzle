/**
 * External dependencies
 */
import React from 'react';
import clsx from 'clsx';

/**
 * Internal dependencies
 */
import { useTable } from '../context';
import { Head } from './head';
import { Body } from './body';

/**
 * Displays records in a table.
 *
 * It must be a descendant of the TableProvider component.
 */
export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>> = ( { className, ...props } ) => {
	const table = useTable();
	const hasData = table.getRowModel().rows.length > 0;

	return (
		<table className={ clsx( 'hizzlewp-records-view-table', className ) } { ...props }>
			<Head />
			{ hasData && <Body /> }
		</table>
	);
}

Table.displayName = 'RecordsTable';
