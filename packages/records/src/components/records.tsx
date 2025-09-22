/**
 * External dependencies
 */
import React, { useId } from 'react';
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	__experimentalVStack as VStack,
	__experimentalText as Text,
	Spinner,
	Slot,
} from '@wordpress/components';

/**
 * HizzleWP dependencies
 */
import { ErrorBoundary } from '@hizzlewp/components';

/**
 * Internal dependencies
 */
import { TableProvider, useTable, Table, TableProviderProps, ActionsPanel, Pagination, Filters } from '.';

export type TableProps<TData = Record<string, unknown>> = Omit<TableProviderProps<TData>, 'children'> & {

	/**
	 * The message to display when the table is empty.
	 */
	emptyMessage?: string;

	/**
	 * Whether to show the table in loading state.
	 */
	isLoading?: boolean;

	/**
	 * The label of the search input. Leave blank to disable the search input.
	 */
	searchLabel?: string;

	/**
	 * Optional bulk actions.
	 */
	bulkActions?: React.ReactNode;

	/**
	 * Optional filters button.
	 */
	filtersButton?: React.ReactNode;

	/**
	 * Slot name for extending.
	 */
	slotName?: string;
};

export const Records: React.FC<TableProps> = ( {
	emptyMessage,
	isLoading,
	searchLabel,
	bulkActions,
	filtersButton,
	data,
	slotName,
	...props
} ) => {
	const tableNoticeId = useId();
	const theSlotName = slotName || 'hizzlewp/records';

	// TODO: Add views for grid and list.
	return (
		<TableProvider { ...props } data={ isLoading ? [] : data }>
			<div className="hizzlewp-records-wrapper">
				<ErrorBoundary>
					<ActionsPanel
						bulkActions={ bulkActions }
						searchLabel={ searchLabel }
						filtersButton={ filtersButton }
					/>
				</ErrorBoundary>
				<VStack spacing={ 4 }>
					<Slot name={ `before/filters/${ theSlotName }` } />
					<Filters slotName={ theSlotName } />
					<div>
						<ErrorBoundary>
							<Table aria-busy={ isLoading } aria-describedby={ tableNoticeId } />
						</ErrorBoundary>

						<ErrorBoundary>
							<EmptyOrLoading
								isLoading={ isLoading }
								tableNoticeId={ tableNoticeId }
								emptyMessage={ emptyMessage }
							/>
						</ErrorBoundary>

						<ErrorBoundary>
							<Pagination />
						</ErrorBoundary>
					</div>
				</VStack>
			</div>
		</TableProvider>
	);
}

const EmptyOrLoading = ( { isLoading, tableNoticeId, emptyMessage }: { isLoading: boolean | undefined, tableNoticeId: string, emptyMessage: string | undefined } ) => {
	const table = useTable();
	const hasData = table.getRowModel().rows.length > 0;

	if ( !hasData || isLoading ) {
		return (
			<div
				className={ clsx( {
					'hizzlewp-records-loading': isLoading,
					'hizzlewp-records-no-results': !hasData && !isLoading,
				} ) }
				id={ tableNoticeId }
			>
				<p>{ isLoading ? (
					<Spinner />
				) : (
					<Text weight={ 700 } size={ 17 } variant="muted" truncate>
						{ emptyMessage || 'No results' }
					</Text>
				) }</p>
			</div>
		)
	}

	return null;
}
