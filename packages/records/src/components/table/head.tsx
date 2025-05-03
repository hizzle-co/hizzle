/**
 * External dependencies
 */
import React, { memo, forwardRef } from 'react';
import classnames from 'clsx';

/**
 * WordPress dependencies
 */
import { flexRender, Header } from '@tanstack/react-table';
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	arrowLeft,
	arrowRight,
	arrowUp,
	arrowDown,
	unseen,
	check,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { useTable } from '../context';
import { SORTING_DIRECTIONS } from '../../constants';

const sortArrows = {
	asc: '↑',
	desc: '↓',
};

const sortIcons = {
	asc: arrowUp,
	desc: arrowDown,
};

type MenuProps = {
	/**
	 * A function to close the dropdown menu.
	 */
	onClose?: () => void;

	/**
	 * The current header.
	 */
	header: Header<any, any>;
}

const Sort = ( { onClose, header }: MenuProps ) => (
	<MenuGroup label="Sort">
		{ SORTING_DIRECTIONS.map(
			( direction ) => (
				<MenuItem
					icon={ header.column.getIsSorted() === direction ? check : sortIcons[ direction ] }
					key={ direction }
					onClick={ () => {
						// Close the menu.
						onClose?.();

						// Toggle sorting.
						header.column.toggleSorting( direction === 'desc' );
					} }
				>
					{
						direction
					}
				</MenuItem>
			)
		) }
	</MenuGroup>
);

type MoveOrPinProps = MenuProps & {
	canMoveLeft: boolean;
	canMoveRight: boolean;
	moveLeft: () => void;
	moveRight: () => void;
}

const MoveOrPin = ( { header, canMoveLeft, canMoveRight, moveLeft, moveRight }: MoveOrPinProps ) => {

	// Abort if the column cannot be moved or pinned.
	if ( !canMoveLeft && !canMoveRight && !header.column.getCanPin() ) {
		return null;
	}

	// Show pin if we cannot move the column or if the column is already pinned.
	const canMove = ( canMoveLeft || canMoveRight ) && !( header.column.getCanPin() && header.column.getIsPinned() );

	return (
		<MenuGroup label={ canMove ? __( 'Move' ) : __( 'Pin' ) }>
			{ canMove && (
				<>
					<MenuItem
						icon={ arrowLeft }
						disabled={ !canMoveLeft }
						onClick={ moveLeft }
					>
						{ __( 'Move left' ) }
					</MenuItem>
					<MenuItem
						icon={ arrowRight }
						disabled={ !canMoveRight }
						onClick={ moveRight }
					>
						{ __( 'Move right' ) }
					</MenuItem>
				</>
			) }
			{ header.column.getCanPin() && (
				<>
					<MenuItem
						isSelected={ header.column.getIsPinned() === 'left' }
						onClick={ () => header.column.pin( header.column.getIsPinned() === 'left' ? false : 'left' ) }
						icon={ header.column.getIsPinned() === 'left' ? check : undefined }
					>
						{ __( 'Pin left' ) }
					</MenuItem>
					<MenuItem
						isSelected={ header.column.getIsPinned() === 'right' }
						onClick={ () => header.column.pin( header.column.getIsPinned() === 'right' ? false : 'right' ) }
						icon={ header.column.getIsPinned() === 'right' ? check : undefined }
					>
						{ __( 'Pin right' ) }
					</MenuItem>
				</>
			) }
		</MenuGroup>
	);
};

const HeaderMenuToggle = memo(
	forwardRef( function HeaderMenuToggle( { children, ...props }, ref ) {
		return (
			<Button
				{ ...props }
				size="compact"
				ref={ ref }
				variant="tertiary"
				className="hizzlewp-records-view-table-header-button"
				icon={ undefined }
			>
				{ children }
			</Button>
		);
	} )
);

export const Head = () => {
	const table = useTable();
	const { columnOrder: stateColumnOrder, columnPinning } = table.getState();

	return (
		<thead>
			{ table.getHeaderGroups().map( ( headerGroup ) => {

				// Get all visible headers.
				const headers = headerGroup.headers;
				const headerIds = headers.map( ( header ) => header.id );

				// Use the column order if it exists, otherwise use the visible headers.
				const columnOrder = stateColumnOrder.length > 0 ? stateColumnOrder : headerIds;

				// Whether the columns can be moved.
				// If there is only one column, it cannot be moved.
				const canMove = headers.length > 1;

				// Can not move before the last left pinned column or after the first right pinned column.
				const lastLeftPinnedId = columnPinning?.left?.[ columnPinning.left.length - 1 ];
				const firstRightPinnedId = columnPinning?.right?.[ 0 ];
				const lastLeftPinnedIndex = lastLeftPinnedId ? headers.findIndex( header => header.id === lastLeftPinnedId ) : -1;
				const firstRightPinnedIndex = firstRightPinnedId ? headers.findIndex( header => header.id === firstRightPinnedId ) : -1;

				return (
					<tr
						key={ headerGroup.id }
						className="hizzlewp-records-view-table__row"
					>
						{ headerGroup.headers.map( ( header, index ) => {

							// Whether the column can be moved left or right.
							const canMoveLeft = canMove && !header.column.getIsPinned() && index > ( lastLeftPinnedIndex + 1 );
							const canMoveRight = canMove && !header.column.getIsPinned() && index < ( firstRightPinnedIndex < 0 ? headers.length - 1 : firstRightPinnedIndex - 1 );

							/**
							 * Swap the current column with the one to its left.
							 */
							const moveLeft = () => {

								if ( !canMoveLeft ) return;

								// Find the actual index in columnOrder
								const currentColumnId = header.column.id;
								const currentOrderIndex = columnOrder.indexOf( currentColumnId );

								// Safety check for invalid current column
								if ( currentOrderIndex === -1 ) {
									// If the column is not ordered, use headerIds order.
									// If the column is not in columnOrder, find its position in headerIds
									const headerIndex = headerIds.indexOf( currentColumnId );
									if ( headerIndex === -1 ) return; // Safety check

									// Find the closest previous column in headerIds that exists in columnOrder
									let prevHeaderIndex = headerIndex - 1;
									while ( prevHeaderIndex >= 0 ) {
										const prevHeaderId = headerIds[ prevHeaderIndex ];
										const prevOrderIndex = columnOrder.indexOf( prevHeaderId );

										if ( prevOrderIndex !== -1 ) {
											// Found a valid previous column in both headerIds and columnOrder
											const newColumnOrder = [ ...columnOrder ];
											newColumnOrder.splice( prevOrderIndex + 1, 0, currentColumnId );
											table.setColumnOrder( newColumnOrder );
											break;
										}
										prevHeaderIndex--;
									}

									// If no valid previous column was found, add to the beginning
									if ( prevHeaderIndex < 0 ) {
										const newColumnOrder = [ currentColumnId, ...columnOrder ];
										table.setColumnOrder( newColumnOrder );
									}

									return;
								}

								// Find the previous visible column with a safety counter
								let prevOrderIndex = currentOrderIndex - 1;
								let safetyCounter = columnOrder.length;

								while ( prevOrderIndex >= 0 && safetyCounter > 0 ) {
									// Check if this column is visible and valid
									if ( headers.some( h => h.id === columnOrder[ prevOrderIndex ] ) ) {
										// Found a valid previous column
										const newColumnOrder = [ ...columnOrder ];
										const previousId = newColumnOrder[ prevOrderIndex ];
										newColumnOrder[ prevOrderIndex ] = currentColumnId;
										newColumnOrder[ currentOrderIndex ] = previousId;
										table.setColumnOrder( newColumnOrder );
										break;
									}
									prevOrderIndex--;
									safetyCounter--;
								}
							};

							/**
							 * Swap the current column with the one to its right.
							 */
							const moveRight = () => {
								if ( !canMoveRight ) return;

								// Find the actual index in columnOrder
								const currentColumnId = header.column.id;
								const currentOrderIndex = columnOrder.indexOf( currentColumnId );

								// Safety check for invalid current column
								if ( currentOrderIndex === -1 ) {
									// If the column is not ordered, use headerIds order.
									// If the column is not in columnOrder, find its position in headerIds
									const headerIndex = headerIds.indexOf( currentColumnId );
									if ( headerIndex === -1 ) return; // Safety check

									// Find the closest next column in headerIds that exists in columnOrder
									let nextHeaderIndex = headerIndex + 1;
									while ( nextHeaderIndex < headerIds.length ) {
										const nextHeaderId = headerIds[ nextHeaderIndex ];
										const nextOrderIndex = columnOrder.indexOf( nextHeaderId );

										if ( nextOrderIndex !== -1 ) {
											// Found a valid next column in both headerIds and columnOrder
											const newColumnOrder = [ ...columnOrder ];
											newColumnOrder.splice( nextOrderIndex, 0, currentColumnId );
											table.setColumnOrder( newColumnOrder );
											break;
										}
										nextHeaderIndex++;
									}

									// If no valid next column was found, add to the end
									if ( nextHeaderIndex >= headerIds.length ) {
										const newColumnOrder = [ ...columnOrder, currentColumnId ];
										table.setColumnOrder( newColumnOrder );
									}
								}

								// Find the next visible column with a safety counter
								let nextOrderIndex = currentOrderIndex + 1;
								let safetyCounter = columnOrder.length;

								while ( nextOrderIndex < columnOrder.length && safetyCounter > 0 ) {
									// Check if this column is visible and valid
									if ( headers.some( h => h.id === columnOrder[ nextOrderIndex ] ) ) {
										// Found a valid next column
										const newColumnOrder = [ ...columnOrder ];
										const nextId = newColumnOrder[ nextOrderIndex ];
										newColumnOrder[ nextOrderIndex ] = currentColumnId;
										newColumnOrder[ currentOrderIndex ] = nextId;
										table.setColumnOrder( newColumnOrder );
										break;
									}
									nextOrderIndex++;
									safetyCounter--;
								}
							};

							// Whether to show the header as a dropdown.
							const showAsDropdown = (

								// Don't show as dropdown if the header is a already a react component.
								typeof header.column.columnDef.header !== 'function' && (

									// Show as dropdown if the column can be sorted, pinned, hidden, or moved.
									header.column.getCanSort() ||
									header.column.getCanPin() ||
									header.column.getCanHide() ||
									canMoveLeft ||
									canMoveRight
								)
							);

							// Whether this header is sorted.
							const isSorted = header.column.getCanSort() && !!header.column.getIsSorted();

							return (
								<th
									key={ header.id }
									scope="col"
									colSpan={ header.colSpan }
									className={ classnames( 'hizzlewp-records-view-table__cell', {
										'hizzlewp-records-view-table__checkbox-column': header.column.id === 'hizzlewp-selection',
										'hizzlewp-records-view-table__actions-column': header.column.id === 'hizzlewp-actions',
										'hizzlewp-records-view-table__filtered-by-column': header.column.getCanFilter() && header.column.getIsFiltered(),
										'hizzlewp-records-view-table__sorted-column': isSorted,
										'hizzlewp-records-view-table__pinned-column__left': header.column.getIsPinned() === 'left',
										'hizzlewp-records-view-table__pinned-column__right': header.column.getIsPinned() === 'right',
									} ) }
								>
									{ header.isPlaceholder ? (
										<>&nbsp;</>
									) : (
										<>
											{ showAsDropdown ? (
												<DropdownMenu
													label={
														typeof header.column.columnDef.header === 'string'
															? header.column.columnDef.header
															: ''
													}
													toggleProps={ {
														as: HeaderMenuToggle,
														className:
															'hizzlewp-records-view-table-header-button',
														children: (
															<>
																{ flexRender(
																	header.column.columnDef.header,
																	header.getContext()
																) }
																{ isSorted && (
																	<span aria-hidden="true">
																		{
																			sortArrows[
																			header.column.getIsSorted() as keyof typeof sortArrows
																			]
																		}
																	</span>
																) }
															</>
														),
													} }
												>
													{ ( { onClose } ) => (
														<>

															{ header.column.getCanSort() && (
																<Sort onClose={ onClose } header={ header } />
															) }

															<MoveOrPin
																header={ header }
																canMoveLeft={ canMoveLeft }
																canMoveRight={ canMoveRight }
																moveLeft={ moveLeft }
																moveRight={ moveRight }
															/>

															{ header.column.getCanHide() && (
																<MenuGroup>
																	<MenuItem
																		icon={ unseen }
																		onClick={ header.column.getToggleVisibilityHandler() }
																		role="menuitemcheckbox"
																	>
																		{ __( 'Hide column' ) }
																	</MenuItem>
																</MenuGroup>
															) }
														</>
													) }
												</DropdownMenu>
											) : (
												<span className="hizzlewp-records-view-table-header">
													{ flexRender(
														header.column.columnDef
															.header,
														header.getContext()
													) }
												</span>
											) }
										</>
									) }
								</th>
							)
						} ) }
					</tr>
				);
			} ) }
		</thead>
	);
};
