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
	Button,
	__experimentalHStack as HStack,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * HizzleWP dependencies.
 */
import { ErrorBoundary } from '@hizzlewp/components';
import { useCollectionRecords, useProvidedCollectionConfig } from '@hizzlewp/store';
import { useQuery, updateQueryString } from '@hizzlewp/history';
import { Table } from '@hizzlewp/records';
import type { TableProviderProps } from '@hizzlewp/records/build-types/components/table/context';
import { usePreferences } from '@hizzlewp/interface';

/**
 * Local dependencies.
 */
import { DisplayCell } from './display-cell';

/**
 * Renders a records overview table for the matching path.
 *
 * @returns The records table.
 */
export const RecordsTable = () => {
	// If we're here, the config is already resolved and won't return undefined.
	const { config: { namespace, collection, props, ignore, hidden, badges } } = useProvidedCollectionConfig() || {};

	// Prepare the state saved in preferences.
	const { preferences, setPreferences } = usePreferences( 'recordsTablePreferences', `${ namespace }/${ collection }` );

	// Backwards compatibility.
	const { preferences: viewPreferences } = usePreferences( 'view', `${ namespace }/${ collection }` );

	// Current query.
	const query = useQuery();
	const preparedQuery = useMemo( () => {
		const preparedQuery = { ...query };

		if ( !query.orderby && preferences?.sorting?.[ 0 ]?.id ) {
			preparedQuery.orderby = preferences.sorting[ 0 ].id;
			preparedQuery.order = preferences.sorting[ 0 ].desc ? 'desc' : 'asc';
		}

		if ( !query.per_page && preferences?.pagination?.pageSize ) {
			preparedQuery.per_page = preferences.pagination.pageSize;
		}

		return preparedQuery;
	}, [ query, preferences ] );

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
				enableHiding: !prop.is_primary,
				cell: ( { row } ) => (
					<DisplayCell
						row={ row.original }
						header={ prop }
						isBadge={ Array.isArray( badges ) && badges.includes( prop.name ) }
						path={ `${ namespace }/${ collection }/${ row.original.id }` }
					/>
				),
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

		const state = {
			columnVisibility,
			columnPinning: {
				left: [ 'hizzlewp-selection', primaryColumn ].filter( Boolean ),
				right: [ 'hizzlewp-actions' ],
			},
			...preferences,
			sorting: querySort ? [ { id: querySort, desc: queryOrder === 'desc' } ] : ( preferences?.sorting || [] ),
			pagination: {
				pageSize: query.per_page || preferences?.pagination?.pageSize || 25,

				// Don't read the current page from preferences, as it's not saved.
				pageIndex: query.paged ? ( Number( query.paged ) - 1 ) : 0,
			}
		} as Partial<TableProviderProps<Record<string, any>>[ 'state' ]>;

		return state;
	}, [ results.records, query, preferences, setPreferences ] );
	console.log( {
		left: [ 'hizzlewp-selection', primaryColumn ].filter( Boolean ),
		right: [ 'hizzlewp-actions' ],
	}, state )
	// Update state.
	const onChange = useCallback( ( state: Partial<TableProviderProps<Record<string, any>>[ 'state' ]> ) => {
		setPreferences( state );

		updateQueryString( {
			orderby: state?.sorting?.[ 0 ]?.id || '',
			order: state?.sorting?.[ 0 ]?.desc ? 'desc' : 'asc',
			per_page: `${ state?.pagination?.pageSize || 25 }`,
			paged: `${ ( state?.pagination?.pageIndex || 0 ) + 1 }`,
		} );
	}, [ setPreferences ] );

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
			<Table
				rowCount={ results.totalItems || 0 }
				data={ results.records || [] }
				columns={ columns }
				enableSorting
				enableFiltering
				enablePagination
				state={ state }
				onChange={ onChange }
				onColumnPinningChange={ ( columnPinning ) => onChange( { ...state, columnPinning: columnPinning( state?.columnPinning || {} ) } ) }
				getRowId={ ( row ) => row.id }
				debugTable={ true }
				bulkActions={ ( selected, isAllSelected: boolean ) => (
					<BulkActions
						selected={ selected }
						isAllSelected={ isAllSelected }
						query={ preparedQuery }
					/>
				) }
			/>
		</ErrorBoundary>
	);
}

const BulkActions = ( { selected, isAllSelected, query } ) => {
	return (
		<>
			<Button>
				{ __( 'Edit', 'hizzlewp' ) }
			</Button>
			<Button>
				{ __( 'Export', 'hizzlewp' ) }
			</Button>
			<Button>
				{ __( 'Delete', 'hizzlewp' ) }
			</Button>
		</>
	);
};
