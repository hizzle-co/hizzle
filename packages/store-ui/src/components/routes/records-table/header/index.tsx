/**
 * External dependencies.
 */
import React from 'react';

/**
 * WordPress dependencies.
 */
import { __ } from "@wordpress/i18n";
import { __experimentalHStack as HStack, FlexItem } from "@wordpress/components";
import { useSelect } from "@wordpress/data";

/**
 * HizzleWP dependencies.
 */
import { ErrorBoundary } from '@hizzlewp/components';
import { useProvidedCollection, store as hizzleStore } from '@hizzlewp/store';

/**
 * Local dependencies.
 */
import { ExportButton } from "./export";
import { BulkDelete } from "./delete";
import { BulkEdit } from "./edit";

/**
 * Get the bulk action arguments.
 *
 * @param {Record<string, any>} query The query.
 * @returns The bulk action arguments.
 */
export const useBulkActionArgs = ( query: Record<string, any> ) => {

	// If we're here, the namespace and collection are provided.
	const { namespace, collection } = useProvidedCollection() || {};

	// Get the selected records.
	const records = useSelect(
		( select ) => ( {
			selected: select( hizzleStore ).getSelectedCollectionRecords( namespace as string, collection as string, query ),
			isAllSelected: select( hizzleStore ).getIsAllCollectionRecordsSelected( namespace as string, collection as string, query ),
			matchingRecordsCount: select( hizzleStore ).getCollectionRecordsTotalItems( namespace as string, collection as string, query ),
		} ),
		[ namespace, collection, query ]
	);

	// Get the selected records.
	const selected = Object.values( records.selected ).filter( Boolean );

	// Use the query if we're selecting all records or if there are no selected records.
	const isAllSelected = records.isAllSelected || !selected.length;

	const toIgnore = [ 'order', 'orderby', 'paged', 'per_page' ];
	const filteredQuery = Object.fromEntries(
		Object.entries( query ).filter( ( [ key ] ) => !toIgnore.includes( key ) )
	);

	return {
		isAllSelected,
		query: isAllSelected ? filteredQuery : {
			include: Object.keys( records.selected ).filter( key => records.selected[ key ] ),
		},
		recordsCount: isAllSelected ? records.matchingRecordsCount : selected.length,
	}
}

/**
 * Action item.
 *
 * @param {React.ReactNode} children The children.
 * @returns The action item.
 */
const ActionItem: React.FC<{ children: React.ReactNode }> = ( { children } ) => {
	return (

		<FlexItem>
			<ErrorBoundary>
				{ children }
			</ErrorBoundary>
		</FlexItem>
	);
}

/**
 * Header.
 *
 * @param {Record<string, any>} query The query.
 * @returns The header.
 */
export const Header: React.FC<{ query: Record<string, any> }> = ( { query } ) => {
	const args = useBulkActionArgs( query );

	return (
		<HStack>
			<ActionItem>
				<BulkEdit { ...args } isBulkEditing />
			</ActionItem>
			<ActionItem>
				<ExportButton { ...args } />
			</ActionItem>
			<ActionItem>
				<BulkDelete { ...args } />
			</ActionItem>
		</HStack>
	);
};
