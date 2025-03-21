/**
 * External dependencies
 */
import React, {
    createContext,
    useContext,
    ReactNode,
    useMemo,
    useState,
} from 'react';

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    TableOptions,
    Table,
    ColumnOrderState,
    TableState,
} from '@tanstack/react-table';

/**
 * Interface for the TableContext
 */
interface TableContextProps<TData> {
    table: Table<TData>;
}

/**
 * Interface for the TableProvider props
 */
export interface TableProviderProps<TData> extends Omit<TableOptions<TData>, 'getCoreRowModel'> {
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
}

/**
 * Create the context
 */
const TableContext = createContext<TableContextProps<any> | undefined>( undefined );

/**
 * Provider component for the table context
 */
export function TableProvider<TData>( {
    children,
    enableSorting = true,
    enableFiltering = true,
    enablePagination = true,
    onChange,
    state = {},
    ...tableOptions
}: TableProviderProps<TData> ) {

    const table = useReactTable( {
        ...tableOptions,
        getCoreRowModel: getCoreRowModel(),
        state,
        enableSorting,
        onColumnOrderChange: ( columnOrder ) => {
            if ( onChange && columnOrder ) {
                onChange( { ...state, columnOrder } );
            }
        },
        onColumnVisibilityChange: ( columnVisibility ) => {
            if ( onChange && columnVisibility ) {
                onChange( {
                    ...state,
                    columnVisibility: columnVisibility( state.columnVisibility || {} )
                } );
            }
        },
        ...( enableSorting && {
            manualSorting: true,
            onSortingChange: ( sorting ) => {
                if ( onChange && sorting ) {
                    onChange( {
                        ...state,
                        sorting: sorting( state.sorting ),
                        pagination: {
                            pageSize: state.pagination?.pageSize || 10,
                            pageIndex: 0,
                        }
                    } );
                }
            },
        } ),
        ...( enableFiltering && { getFilteredRowModel: getFilteredRowModel() } ),
        ...( enablePagination && {
            manualPagination: true,
            onPaginationChange: ( pagination ) => {
                if ( onChange && pagination ) {
                    onChange( {
                        ...state,
                        pagination: pagination( state.pagination ),
                    } );
                }
            },
        } ),
    } );

    const value = useMemo( () => ( { table } ), [ table ] );

    return (
        <TableContext.Provider value={ value }>
            { children }
        </TableContext.Provider>
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

    return context.table as Table<TData>;
}
