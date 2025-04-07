/**
 * External dependencies
 */
import React from 'react';
import { flexRender } from '@tanstack/react-table';
import classnames from 'clsx';

/**
 * WordPress dependencies
 */
import { __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { useTable } from './context';

export const Body = () => {
	const table = useTable();

	return (
		<tbody>
			{ table.getRowModel().rows.map( ( row ) => (
				<tr
					key={ row.id }
					className={ classnames( 'hizzle-records__table__row', { 'is-selected': row.getIsSelected() } ) }
					onClick={ row.getToggleSelectedHandler() }
				>
					{ row.getVisibleCells().map( ( cell ) => (
						<td key={ cell.id } className={ classnames( 'hizzle-records__table__cell', { 'hizzle-records__table__checkbox-column': cell.column.id === 'hizzlewp-selection' } ) }>
							<div className="hizzle-records__table__cell-content-wrapper">
								{ flexRender(
									cell.column.columnDef.cell,
									cell.getContext()
								) }
							</div>
						</td>
					) ) }
				</tr>
			) ) }
		</tbody>
	);
};
