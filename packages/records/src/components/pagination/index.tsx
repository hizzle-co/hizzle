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
	Slot,
} from '@wordpress/components';
import { next, previous } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { useTable } from '../context';
import { PER_PAGE_OPTIONS } from '../../constants';

/**
 * Pagination component for the table
 */
export const Pagination: React.FC<{ slotName: string }> = ( { slotName } ) => {
	const table = useTable();
	const pageCount = table.getPageCount();
	const rowCount = table.getRowCount();
	const pageIndex = table.getState().pagination.pageIndex;
	const pageSize = table.getState().pagination.pageSize;
	const currentPage = table.getState().pagination.pageIndex + 1;

	// Don't show pagination if there are no rows.
	if ( rowCount < 1 ) {
		return null;
	}

	const pageSizeOptions = PER_PAGE_OPTIONS.map( ( value ) => {
		return {
			value: value.toString(),
			label: sprintf(
				// translators: 1: Number of records per page.
				_x( '%1$s per page', 'paging' ),
				value.toString()
			),
		};
	} );

	// Only show the "Show all" option if there are more rows than the largest per_page option.
	if ( rowCount > PER_PAGE_OPTIONS[ PER_PAGE_OPTIONS.length - 1 ] ) {
		pageSizeOptions.push( {
			value: rowCount.toString(),
			label: __( 'Show all' ),
		} );
	}

	const pageSelectOptions = table.getPageOptions().map( ( i ) => {
		const page = i + 1;
		return {
			value: page.toString(),
			label: page.toString(),
			'aria-label':
				currentPage === page
					? `Page ${ currentPage } of ${ pageCount }`
					: page.toString(),
		};
	} );

	return (
		<div className="hizzlewp-records-footer">
			<div className="hizzlewp-records-pagination">
				<HStack justify="space-between" alignment="center">
					<div className="hizzlewp-records__table-pagination-info">
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
					<Slot name={ `in/pagination/${ slotName }` } />
					<HStack
						expanded={ false }
						className="hizzlewp-records__table-pagination"
						justify="end"
						spacing={ 6 }
					>
						<HStack
							justify="flex-start"
							expanded={ false }
							spacing={ 1 }
							className="hizzlewp-records-pagination__page-select"
						>
							{ createInterpolateElement(
								sprintf(
									// translators: 1: Current page number, 2: Total number of pages.
									_x(
										'<div>Page</div>%1$s<div>of %2$s</div>',
										'paging'
									),
									'<CurrentPage />',
									pageCount.toString()
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
								( pageIndex + 1 ).toString(),
								pageCount.toString()
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
		</div>
	);
};
