/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf, isRTL, _x } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import {
	__experimentalHStack as HStack,
	Button,
	SelectControl,
	Fill,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { useTable } from './context';
import { next, previous } from '@wordpress/icons';

/**
 * Pagination component for the table
 */
export const Pagination = ( { footerSlot }: { footerSlot?: string } ) => {
	const table = useTable();
	const pageCount = table.getPageCount();
	const pageIndex = table.getState().pagination.pageIndex;
	const pageSize = table.getState().pagination.pageSize;
	const currentPage = table.getState().pagination.pageIndex + 1;

	// If there's only one page, don't show pagination
	if ( pageCount <= 1 ) {
		return null;
	}

	const pageSizeOptions = [
		{ value: '10', label: __( '10 per page' ) },
		{ value: '25', label: __( '25 per page' ) },
		{ value: '50', label: __( '50 per page' ) },
		{ value: '100', label: __( '100 per page' ) },
	];

	const pageSelectOptions = Array.from( Array( pageCount ) ).map( ( _, i ) => {
		const page = i + 1;
		return {
			value: page.toString(),
			label: page.toString(),
			'aria-label':
				currentPage === page
					? sprintf(
						// translators: Current page number in total number of pages
						__( 'Page %1$s of %2$s' ),
						currentPage,
						pageCount
					)
					: page.toString(),
		};
	} );

	const Wrap = ( { children }: { children: React.ReactNode } ) => {
		if ( footerSlot ) {
			return <Fill name={ footerSlot }>{ children }</Fill>;
		}

		return children;
	};

	return (
		<Wrap>
			<div className="hizzle-records__table-pagination">
				<HStack justify="space-between" alignment="center">
					<div className="hizzle-records__table-pagination-info">
						<SelectControl
							value={ pageSize.toString() }
							options={ pageSizeOptions }
							onChange={ ( value ) => {
								table.setPageSize( Number( value ) );
							} }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</div>
					<HStack
						expanded={ false }
						className="hizzle-records__table-pagination"
						justify="end"
						spacing={ 6 }
					>
						<HStack
							justify="flex-start"
							expanded={ false }
							spacing={ 1 }
							className="hizzle-records__table-pagination__page-select"
						>
							{ createInterpolateElement(
								sprintf(
									// translators: 1: Current page number, 2: Total number of pages.
									_x(
										'<div>Page</div>%1$s<div>of %2$s</div>',
										'paging'
									),
									'<CurrentPage />',
									pageCount
								),
								{
									div: <div aria-hidden />,
									CurrentPage: (
										<SelectControl
											aria-label={ __( 'Current page' ) }
											value={ currentPage.toString() }
											options={ pageSelectOptions }
											onChange={ ( newValue ) => {
												table.setPageIndex(
													Number( newValue ) - 1
												);
											} }
											size="small"
											__nextHasNoMarginBottom
											variant="minimal"
										/>
									),
								}
							) }
						</HStack>
						<HStack expanded={ false } spacing={ 1 }>
							{ sprintf(
								// translators: Current page number in total number of pages
								__( 'Page %1$s of %2$s' ),
								pageIndex + 1,
								pageCount
							) }
							<Button
								onClick={ () => table.previousPage() }
								disabled={ !table.getCanPreviousPage() }
								label={ __( 'Previous page' ) }
								icon={ isRTL() ? next : previous }
								showTooltip
								__next40pxDefaultSize
								accessibleWhenDisabled
							/>
							<Button
								onClick={ () => table.nextPage() }
								disabled={ !table.getCanNextPage() }
								label={ __( 'Next page' ) }
								icon={ isRTL() ? previous : next }
								showTooltip
								__next40pxDefaultSize
								accessibleWhenDisabled
							/>
						</HStack>
					</HStack>
				</HStack>
			</div>
		</Wrap>
	);
};
