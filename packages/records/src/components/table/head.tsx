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

				// Use the column order if it exists, otherwise use the visible headers.
				const columnOrder = stateColumnOrder.length > 0 ? stateColumnOrder : headers.map( ( header ) => header.id );

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
								if ( canMoveLeft ) {
									const newColumnOrder = [ ...columnOrder ];
									const previousId = newColumnOrder[ index - 1 ];
									newColumnOrder[ index - 1 ] = newColumnOrder[ index ];
									newColumnOrder[ index ] = previousId;
									table.setColumnOrder( newColumnOrder );
								}
							};

							/**
							 * Swap the current column with the one to its right.
							 */
							const moveRight = () => {
								if ( canMoveRight ) {
									const newColumnOrder = [ ...columnOrder ];
									const nextId = newColumnOrder[ index + 1 ];
									newColumnOrder[ index + 1 ] = newColumnOrder[ index ];
									newColumnOrder[ index ] = nextId;
									table.setColumnOrder( newColumnOrder );
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
												<>
													{ flexRender(
														header.column.columnDef
															.header,
														header.getContext()
													) }
												</>
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
