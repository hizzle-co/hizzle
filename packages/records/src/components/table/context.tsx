/**
 * External dependencies
 */
import React, {
	createContext,
	useContext,
	ReactNode,
	useMemo,
} from 'react';

import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	TableOptions,
	Table,
	TableState,
} from '@tanstack/react-table';


/**
 * WordPress dependencies
 */
import { CheckboxControl } from '@wordpress/components';

/**
 * Interface for the TableContext
 */
interface TableContextProps<TData> {
	table: Table<TData>;
}

/**
 * Interface for the TableProvider props
 */
export interface TableProviderProps<TData>
	extends Omit<TableOptions<TData>, 'getCoreRowModel'> {
	/**
	 * The child components to render within the table provider.
	 */
	children: ReactNode;

	/**
	 * Whether to enable sorting functionality for the table.
	 * @default true
	 */
	enableSorting?: boolean;

	/**
	 * Whether to enable filtering functionality for the table.
	 * @default true
	 */
	enableFiltering?: boolean;

	/**
	 * Whether to enable pagination functionality for the table.
	 * @default true
	 */
	enablePagination?: boolean;

	/**
	 * The initial state of the table
	 */
	state?: Partial<TableState>;

	/**
	 * On change of the table state
	 */
	onChange?: ( state: Partial<TableState> ) => void;

	/**
	 * Optional function to render bulk actions UI.
	 * @param selected - The currently selected items.
	 * @returns React node to render for bulk actions.
	 */
	bulkActions?: ( selected: string[], isAllSelected: boolean, isAllPagesSelected: boolean ) => React.ReactNode;
}

/**
 * Create the context
 */
const TableContext = createContext<Table<any> | undefined>(
	undefined
);

const functionOrValue = ( value: any, oldValue: any ) => typeof value === 'function' ? value( oldValue ) : value;

/**
 * Provider component for the table context
 */
export function TableProvider<TData>( {
	children,
	enableSorting = true,
	enableFiltering = true,
	enablePagination = true,
	onChange,
	state = undefined,
	columns,
	bulkActions,
	initialState,
	...tableOptions
}: TableProviderProps<TData> ) {

	const tableColumns = useMemo( () => {
		if ( !bulkActions && !tableOptions.enableRowSelection ) {
			return columns;
		}

		return [
			{
				id: 'hizzlewp-selection',
				header: ( { table } ) => {
					return (
						<CheckboxControl
							type="checkbox"
							checked={ table.getIsAllPageRowsSelected() }
							onChange={ table.toggleAllPageRowsSelected }
							indeterminate={ table.getIsSomeRowsSelected() }
							aria-label={ table.getIsAllPageRowsSelected() ? 'Deselect all' : 'Select all' }
							className="hizzle-records__table-selection-checkbox"
							__nextHasNoMarginBottom
						/>
					)
				},
				cell: ( { row } ) => (
					<CheckboxControl
						type="checkbox"
						checked={ row.getIsSelected() }
						onChange={ row.toggleSelected }
						disabled={ !row.getCanSelect() }
						aria-label={ row.getIsSelected() ? 'Unselect item' : 'Select item' }
						className="hizzle-records__table-selection-checkbox"
						__nextHasNoMarginBottom
					/>
				),
				enableSorting: false,
				enableHiding: false,
				enableGlobalFilter: false,
			},
			...columns,
		];
	}, [ columns, bulkActions, tableOptions.enableRowSelection ] );

	const table = useReactTable( {
		...tableOptions,
		columns: tableColumns,
		getCoreRowModel: getCoreRowModel(),
		state,
		enableSorting,
		initialState: {
			...initialState,
			columnPinning: {
				left: [ 'hizzlewp-selection' ],
				right: [ 'hizzlewp-actions' ],
			},
		},

		// Server-side state management.
		...( state && {
			onColumnOrderChange: ( columnOrder ) => {
				if ( onChange && columnOrder ) {
					onChange( { ...state, columnOrder: functionOrValue( columnOrder, state.columnOrder || [] ) } );
				}
			},
			onColumnVisibilityChange: ( columnVisibility ) => {
				if ( onChange && columnVisibility ) {
					onChange( {
						...state,
						columnVisibility: functionOrValue( columnVisibility, state.columnVisibility || {} ),
					} );
				}
			},
			...( enableSorting && {
				manualSorting: true,
				onSortingChange: ( sorting ) => {
					if ( onChange && sorting ) {
						onChange( {
							...state,
							sorting: functionOrValue( sorting, state.sorting || [] ),
							...(
								state.pagination?.pageIndex ? {
									pagination: {
										pageSize: state.pagination?.pageSize || 10,
										pageIndex: 0,
									},
								} : {}
							),
						} );
					}
				},
			} ),
			...( enablePagination && {
				manualPagination: true,
				onPaginationChange: ( pagination ) => {
					if ( onChange && pagination ) {
						onChange( {
							...state,
							pagination: functionOrValue( pagination, state.pagination || {} ),
						} );
					}
				},
			} ),
		} ),

		// Client-side state management.
		...( !state && {
			...( enablePagination && {
				getPaginationRowModel: getPaginationRowModel(),
			} ),
			...( enableSorting && {
				getSortedRowModel: getSortedRowModel(),
			} ),
			...( enableFiltering && {
				getFilteredRowModel: getFilteredRowModel(),
				globalFilterFn: 'includesString',
			} ),
		} ),
	} );

	return (
		<TableContext.Provider value={ table }>{ children }</TableContext.Provider>
	);
}

/**
 * Hook to use the table context
 */
export function useTable<TData>() {
	const context = useContext( TableContext );

	if ( context === undefined ) {
		throw new Error( 'useTable must be used within a TableProvider' );
	}

	return context as Table<TData>;
}
