/**
 * External dependencies
 */
import React from 'react';
import { Cell, flexRender, Row } from '@tanstack/react-table';
import classnames from 'clsx';

/**
 * Internal dependencies
 */
import { useTable } from './context';

/**
 * The body component for the table.
 */
export const Body: React.FC<{}> = () => {
	const table = useTable();

	return (
		<tbody>
			{ table.getRowModel().rows.map( ( row ) => (
				<TableRow key={ row.id } row={ row } />
			) ) }
		</tbody>
	);
};

/**
 * The row component for the table.
 *
 * @param {Object} props - The component props.
 * @param {Row<any>} props.row - The row to render.
 */
const TableRow: React.FC<{ row: Row<any>; primaryField?: string }> = ( { row } ) => {
	return (
		<tr
			key={ row.id }
			className={ classnames( 'hizzle-records__table__row', { 'is-selected': row.getIsSelected() } ) }
			onClick={ row.getCanSelect() ? row.getToggleSelectedHandler() : undefined }
		>
			{ row.getVisibleCells().map( ( cell ) => (
				<TableCell key={ cell.id } cell={ cell } />
			) ) }
		</tr>
	);
};

/**
 * The cell component for the table.
 *
 * @param {Object} props - The component props.
 * @param {Cell<any, unknown>} props.cell - The cell to render.
 */
const TableCell: React.FC<{ cell: Cell<any, unknown>; primaryField?: string }> = ( { cell } ) => {
	return (
		<td className={ classnames( 'hizzle-records__table__cell', { 'hizzle-records__table__checkbox-column': cell.column.id === 'hizzlewp-selection' } ) }>
			<div
				className={ classnames(
					'hizzle-records__table__cell-content-wrapper',
					`hizzle-records__table__cell-content-wrapper--${ cell.column.id }`,
				) }
			>
				{ flexRender(
					cell.column.columnDef.cell,
					cell.getContext()
				) }
			</div>
		</td>
	)
}
