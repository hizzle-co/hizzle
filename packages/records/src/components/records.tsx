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
import { TableProvider, Table, TableProviderProps, ActionsPanel, Pagination, Filters } from '.';

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

	/**
	 * Optional bulk actions.
	 */
	bulkActions?: React.ReactNode;

	/**
	 * Optional filters button.
	 */
	filtersButton?: React.ReactNode;
};

export const Records: React.FC<TableProps> = ( {
	emptyMessage,
	isLoading,
	footerSlot,
	searchLabel,
	bulkActions,
	filtersButton,
	...props
} ) => {
	const hasData = props.data?.length > 0;
	const tableNoticeId = useId();

	// TODO: Add views for grid and list.
	return (
		<TableProvider { ...props }>
			<div className="hizzlewp-records-wrapper">
				<ErrorBoundary>
					<ActionsPanel
						bulkActions={ bulkActions }
						searchLabel={ searchLabel }
						filtersButton={ filtersButton }
					/>
				</ErrorBoundary>
				<VStack spacing={ 4 }>
					<Filters />
					<div>
						<ErrorBoundary>
							<Table aria-busy={ isLoading } aria-describedby={ tableNoticeId } />
						</ErrorBoundary>

						{ ( !hasData || isLoading ) && (
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
						) }
					</div>

					<ErrorBoundary>
						<Pagination footerSlot={ footerSlot } />
					</ErrorBoundary>
				</VStack>
			</div>
		</TableProvider>
	);
}
