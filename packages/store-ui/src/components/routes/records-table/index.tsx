/**
 * External dependencies
 */
import React, { useMemo, useCallback } from "react";

/**
 * WordPress dependencies.
 */
import {
	Notice,
	Spinner
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

	// Current query.
	const query = useQuery();

	// Record results for the current query.
	const results = useCollectionRecords( namespace, collection, query );

	// Prepare the state saved in preferences.
	const { preferences, setPreferences } = usePreferences( 'recordsTablePreferences', `${ namespace }/${ collection }` );

	// Backwards compatibility.
	const { preferences: viewPreferences } = usePreferences( 'view', `${ namespace }/${ collection }` );

	// Available columns.
	const columns = useMemo( () => {
		const columns: TableProviderProps<Record<string, any>>[ 'columns' ] = [];

		props.forEach( ( prop ) => {
			// Abort if dynamic column.
			if ( ( prop.is_textarea && !prop.is_tokens && ( !prop.enum || Array.isArray( prop.enum ) ) ) || ignore.includes( prop.name ) || 'hide' === prop.js_props?.table ) {
				return;
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
				//elements: prop.enum ? useOptions( prop.enum ) : undefined,
				//...prop
			} );
		} );

		return columns;
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
			/>
		</ErrorBoundary>
	);
}
