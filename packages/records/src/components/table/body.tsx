/**
 * External dependencies
 */
import React from 'react';
import {
	flexRender,
} from '@tanstack/react-table';

/**
 * WordPress dependencies
 */
import { __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { useTable } from './context'

export const Body = () => {
	const table = useTable()

	return (
		<tbody>
			{ table.getRowModel().rows.map( row => (
				<tr key={ row.id } className="hizzle-records__table__row">
					{ row.getVisibleCells().map( cell => (
						<td key={ cell.id }>
							<div className="hizzle-records__table__cell-content-wrapper">
								{ flexRender( cell.column.columnDef.cell, cell.getContext() ) }
							</div>
						</td>
					) ) }
				</tr>
			) ) }
		</tbody>
	)
}
