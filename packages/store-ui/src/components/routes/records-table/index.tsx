/**
 * External dependencies
 */
import React, { useMemo, useCallback } from "react";

/**
 * WordPress dependencies.
 */
import {
	Notice,
	Spinner,
} from "@wordpress/components";
import { useDispatch } from '@wordpress/data';

/**
 * HizzleWP dependencies.
 */
import { ErrorBoundary } from '@hizzlewp/components';
import { useCollectionRecords, useProvidedCollectionConfig, store as hizzleStore } from '@hizzlewp/store';
import { useQuery, updateQueryString } from '@hizzlewp/history';
import { Records, PER_PAGE_OPTIONS } from '@hizzlewp/records';
import type { TableProviderProps } from '@hizzlewp/records/build-types/components/table/context';
import { usePreferences } from '@hizzlewp/interface';

/**
 * Local dependencies.
 */
import { DisplayCell } from './display-cell';
import { Header } from './header';
import { FiltersButton } from './filters';

/**
 * Returns a prepared query.
 *
 * @returns {Record<string, any>} The prepared query.
 */
export const usePreparedQuery = ( namespace: string, collection: string ): Record<string, any> => {

	// Prepare the state saved in preferences.
	const { preferences } = usePreferences( 'recordsTablePreferences', `${ namespace }/${ collection }` );

	// Current query.
	const query = useQuery();

	return useMemo( () => {
		const preparedQuery: Record<string, any> = { ...query };

		if ( !query.orderby && preferences?.sorting?.[ 0 ]?.id ) {
			preparedQuery.orderby = preferences.sorting[ 0 ].id;
			preparedQuery.order = preferences.sorting[ 0 ].desc ? 'desc' : 'asc';
		}

		if ( !query.per_page && preferences?.pagination?.pageSize ) {
			preparedQuery.per_page = preferences.pagination.pageSize;
		}

		// If per_page is set but not in PER_PAGE_OPTIONS, default to -1 (show all)
		if ( preparedQuery.per_page && !PER_PAGE_OPTIONS.includes( Number( query.per_page ) ) ) {
			preparedQuery.per_page = -1;
		}

		return preparedQuery;
	}, [ query, preferences ] );
};

/**
 * Renders a records overview table for the matching path.
 *
 * @returns The records table.
 */
export const RecordsTable = () => {
	// If we're here, the config is already resolved and won't return undefined.
	const { config: { namespace, collection, props, ignore, hidden, badges, labels } } = useProvidedCollectionConfig() || {};

	// Prepare the state saved in preferences.
	const { preferences, setPreferences } = usePreferences( 'recordsTablePreferences', `${ namespace }/${ collection }` );

	// Backwards compatibility.
	const { preferences: viewPreferences } = usePreferences( 'view', `${ namespace }/${ collection }` );

	// Current query.
	const query = useQuery();
	const preparedQuery = usePreparedQuery( namespace, collection );

	// Record results for the current query.
	const results = useCollectionRecords( namespace, collection, preparedQuery );

	// Available columns.
	const { columns, primaryColumn } = useMemo( () => {
		const columns: TableProviderProps<Record<string, any>>[ 'columns' ] = [];
		let primaryColumn = '';

		props.forEach( ( prop ) => {
			// Abort if dynamic column.
			if ( ( prop.is_textarea && !prop.is_tokens && ( !prop.enum || Array.isArray( prop.enum ) ) ) || ignore.includes( prop.name ) || 'hide' === prop.js_props?.table ) {
				return;
			}

			if ( prop.is_primary ) {
				primaryColumn = prop.name;
			}

			columns.push( {
				accessorKey: prop.name,
				header: prop.label,
				enableSorting: !prop.is_dynamic && !prop.is_meta,
				enableColumnFilter: !prop.is_dynamic,
				enableHiding: !prop.is_primary,
				cell: ( { row } ) => (
					<DisplayCell
						row={ row.original }
						header={ prop }
						isBadge={ Array.isArray( badges ) && badges.includes( prop.name ) }
						path={ `${ namespace }/${ collection }/${ row.original.id }` }
					/>
				),
				meta: {
					is_primary: prop.is_primary,
					enum: prop.enum,
					multiple: prop.multiple,
					is_dynamic: prop.is_dynamic,
					is_boolean: prop.is_boolean,
					is_numeric: prop.is_numeric || prop.is_float,
					is_date: prop.is_date,
					is_tokens: prop.is_tokens,
					suggestions: prop.suggestions,
				},
			} );
		} );

		return { columns, primaryColumn };
	}, [ props, ignore ] );

	const columnVisibility = useMemo( () => {
		const hiddenColumns = Array.isArray( viewPreferences?.hiddenFields ) ? viewPreferences?.hiddenFields : hidden;

		return hiddenColumns.reduce( ( acc, column ) => {
			acc[ column ] = false;
			return acc;
		}, {} );
	}, [ hidden, viewPreferences ] );

	// State.
	const state = useMemo( () => {
		const querySort = query.orderby;
		const queryOrder = query.order || 'desc';
		const isShowingAll = preparedQuery.per_page && Number( preparedQuery.per_page ) === -1;

		const state = {
			columnVisibility,
			columnPinning: {
				left: [ 'hizzlewp-selection', primaryColumn ].filter( Boolean ),
				right: [ 'hizzlewp-actions' ],
			},
			...preferences,
			sorting: querySort ? [ { id: querySort, desc: queryOrder === 'desc' } ] : ( preferences?.sorting || [] ),
			pagination: {
				pageSize: isShowingAll ? results.totalItems : ( query.per_page || preferences?.pagination?.pageSize || 25 ),

				// Don't read the current page from preferences, as it's not saved.
				pageIndex: isShowingAll ? 0 : ( query.paged ? ( Number( query.paged ) - 1 ) : 0 ),
			},
			rowSelection: results.selected,
			globalFilter: query.search || '',
		} as Partial<TableProviderProps<Record<string, any>>[ 'state' ]>;

		return state;
	}, [ results.selected, results.totalItems, query, preferences ] );

	// Update state.
	const onChange = useCallback( ( state: Partial<TableProviderProps<Record<string, any>>[ 'state' ]> ) => {
		setPreferences( state );

		const isShowingAll = state?.pagination?.pageSize && !PER_PAGE_OPTIONS.includes( Number( state?.pagination?.pageSize ) );
		updateQueryString( {
			orderby: state?.sorting?.[ 0 ]?.id || '',
			order: state?.sorting?.[ 0 ]?.desc ? 'desc' : 'asc',
			per_page: isShowingAll ? '-1' : `${ state?.pagination?.pageSize || 25 }`,
			paged: isShowingAll ? '1' : `${ ( state?.pagination?.pageIndex || 0 ) + 1 }`,
		} );
	}, [ setPreferences ] );

	// Toggle a record's selection.
	const { setSelectedCollectionRecords } = useDispatch( hizzleStore );

	if ( results.isResolving || !results.hasResolved ) {
		return (
			<div className="hizzlewp-records-table-loading">
				<Spinner />
			</div>
		);
	}

	if ( results.status === 'ERROR' ) {
		return (
			<Notice status="error" isDismissible={ false }>
				{ results.error?.message || 'An unknown error occurred.' }
			</Notice>
		);
	}

	return (
		<ErrorBoundary>
			<Records
				rowCount={ results.totalItems || 0 }
				data={ results.records || [] }
				columns={ columns }
				enableSorting
				enableFiltering
				enablePagination
				state={ state }
				onChange={ onChange }
				enableRowSelection={ true }
				onRowSelectionChange={
					( rowSelection ) => setSelectedCollectionRecords( namespace, collection, preparedQuery, rowSelection( state?.rowSelection || {} ) )
				}
				onColumnPinningChange={
					( columnPinning ) => onChange( { ...state, columnPinning: columnPinning( state?.columnPinning || {} ) } )
				}
				onGlobalFilterChange={
					( globalFilter ) => {
						updateQueryString( { search: globalFilter || '' } );
					}
				}
				getRowId={ ( row ) => row.id }
				footerSlot="hizzlewp-collection__footer"
				searchLabel={ labels?.search_items || 'Search' }
				bulkActions={ <Header query={ preparedQuery } /> }
				filtersButton={ <FiltersButton /> }
			/>
		</ErrorBoundary>
	);
}
