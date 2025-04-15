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
} from '@wordpress/components';

/**
 * HizzleWP dependencies
 */
import { ErrorBoundary } from '@hizzlewp/components';

/**
 * Internal dependencies
 */
import { TableProvider, Table, TableProviderProps, ActionsPanel, Pagination } from '.';

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
	 * Footer slot.
	 */
	footerSlot?: string;

	/**
	 * The label of the search input. Leave blank to disable the search input.
	 */
	searchLabel?: string;
};

export const Records: React.FC<TableProps> = (
	{ emptyMessage, isLoading, footerSlot, searchLabel, ...props }
) => {
	const hasData = props.data?.length > 0;
	const tableNoticeId = useId();

	// TODO: Add views for grid and list.
	return (
		<TableProvider { ...props }>
			<ErrorBoundary>
				<ActionsPanel
					bulkActions={ props.bulkActions }
					searchLabel={ searchLabel }
				/>
			</ErrorBoundary>
			<div className="hizzle-records__wrapper">
				<VStack spacing={ 4 }>
					<ErrorBoundary>
						<Table aria-busy={ isLoading } aria-describedby={ tableNoticeId } />
					</ErrorBoundary>

					{ ( !hasData || isLoading ) && (
						<div
							className={ clsx( {
								'hizzle-records__loading': isLoading,
								'hizzle-records__no-results': !hasData && !isLoading,
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
					) }

					<ErrorBoundary>
						<Pagination footerSlot={ footerSlot } />
					</ErrorBoundary>
				</VStack>
			</div>
		</TableProvider>
	);
}
