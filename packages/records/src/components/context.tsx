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
	useTable as useReactTable,
	tableFeatures,
	columnFilteringFeature,
	globalFilteringFeature,
	columnOrderingFeature,
	columnPinningFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFn_includesString,
	TableOptions,
	TableState,
	ReactTable,
} from '@tanstack/react-table';

/**
 * WordPress dependencies
 */
import { CheckboxControl } from '@wordpress/components';

/**
 * Interface for the TableProvider props
 */
export const tableFeaturesConfig = tableFeatures( {
	columnFilteringFeature,
	globalFilteringFeature,
	columnOrderingFeature,
	columnPinningFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	filteredRowModel: createFilteredRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	sortedRowModel: createSortedRowModel(),
	filterFns: {
		includesString: filterFn_includesString,
	},
} );

export type TableFeaturesConfig = typeof tableFeaturesConfig;

export interface TableProviderProps<TData extends Record<string, any>>
	extends Omit<TableOptions<TableFeaturesConfig, TData>, 'features'> {
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
	 * Whether to enable pagination functionality for the table.
	 * @default true
	 */
	enablePagination?: boolean;

	/**
	 * The initial state of the table
	 */
	state?: Partial<TableState<TableFeaturesConfig>>;

	/**
	 * On change of the table state
	 */
	onChange?: ( state: Partial<TableState<TableFeaturesConfig>> ) => void;
}

/**
 * Create the context
 */
const TableContext = createContext<{ table: ReactTable<TableFeaturesConfig, Record<string, any>> } | undefined>(
	undefined
);

const functionOrValue = ( value: any, oldValue: any ) => typeof value === 'function' ? value( oldValue ) : value;

/**
 * Provider component for the table context
 */
export function TableProvider<TData extends Record<string, any>>( {
	children,
	enableSorting = true,
	enablePagination = true,
	onChange,
	columns,
	initialState,
	...tableOptions
}: TableProviderProps<TData> ) {

	const tableColumns = useMemo( () => {
		if ( !tableOptions.enableRowSelection ) {
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
							indeterminate={ table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected() }
							aria-label={ table.getIsAllPageRowsSelected() ? 'Deselect all' : 'Select all' }
							className="hizzlewp-records-view-table-selection-checkbox"
							__nextHasNoMarginBottom
						/>
					)
				},
				cell: ( { row } ) => (
					<CheckboxControl
						type="checkbox"
						checked={ row.getIsSelected() }
						onChange={ ( selected ) => row.toggleSelected( selected ) }
						disabled={ !row.getCanSelect() }
						aria-label={ row.getIsSelected() ? 'Unselect item' : 'Select item' }
						className="hizzlewp-records-view-table-selection-checkbox"
						__nextHasNoMarginBottom
					/>
				),
				enableSorting: false,
				enableHiding: false,
				enableGlobalFilter: false,
				enableColumnFilter: false,
			},
			...columns,
		];
	}, [ columns, tableOptions.enableRowSelection ] );

	const state = tableOptions.state;
	const table = useReactTable( {
		features: tableFeaturesConfig,
		...tableOptions,
		columns: tableColumns,
		enableSorting,
		initialState: {
			...initialState,
			columnPinning: {
				start: [ 'hizzlewp-selection' ],
				end: [ 'hizzlewp-actions' ],
			},
		},

		// Server-side state management.
		...( state && {
			...( tableOptions.onColumnFiltersChange && {
				onColumnFiltersChange: ( columnFilters ) => {
					if ( columnFilters ) {
						tableOptions.onColumnFiltersChange?.( functionOrValue( columnFilters, state.columnFilters || [] ) );
					}
				},
			} ),
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
										pageSize: state.pagination?.pageSize || 25,
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
			...( false !== tableOptions.enableFilters && {
				globalFilterFn: 'includesString',
			} ),
		} ),
	} );

	return (
		<TableContext.Provider value={ { table: table as ReactTable<TableFeaturesConfig, Record<string, any>> } }>{ children }</TableContext.Provider>
	);
}
TableProvider.displayName = 'RecordsTableProvider';

/**
 * Hook to use the table context
 */
export function useTable<TData extends Record<string, any>>() {
	const context = useContext( TableContext );

	if ( context === undefined ) {
		throw new Error( 'useTable must be used within a TableProvider' );
	}

	return context.table as unknown as ReactTable<TableFeaturesConfig, TData>;
}
