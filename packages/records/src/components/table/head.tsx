/**
 * External dependencies
 */
import React, { memo, forwardRef } from 'react';

/**
 * WordPress dependencies
 */
import { flexRender } from '@tanstack/react-table';
import {
	Icon,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	MenuItemsChoice,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	arrowLeft,
	arrowRight,
	arrowUp,
	arrowDown,
	unseen,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { useTable } from './context';

const sortArrows = {
	asc: '↑',
	desc: '↓',
};

const sortIcons = {
	asc: arrowUp,
	desc: arrowDown,
};

const SORTING_DIRECTIONS = ['asc', 'desc'];

const HeaderMenuToggle = memo(
	forwardRef(function HeaderMenuToggle({ children, ...props }, ref) {
		return (
			<Button
				{...props}
				size="compact"
				ref={ref}
				variant="tertiary"
				className="hizzle-records__table-header-button"
				icon={undefined}
			>
				{children}
			</Button>
		);
	})
);

export const Head = () => {
	const table = useTable();
	const { columnOrder } = table.getState();

	return (
		<thead>
			{table.getHeaderGroups().map((headerGroup) => {
				const headers = headerGroup.headers;
				const canMove = headers.length > 1 && columnOrder.length > 1;

				return (
					<tr
						key={headerGroup.id}
						className="hizzle-records__table__row"
					>
						{headerGroup.headers.map((header, index) => (
							<th
								key={header.id}
								scope="col"
								colSpan={header.colSpan}
							>
								{header.isPlaceholder ? (
									<>&nbsp;</>
								) : (
									<DropdownMenu
										label={
											header.column.columnDef
												.header as string
										}
										toggleProps={{
											as: HeaderMenuToggle,
											className:
												'hizzle-records__table-header-button',
											children: (
												<>
													{flexRender(
														header.column.columnDef
															.header,
														header.getContext()
													)}
													{header.column.getCanSort() &&
														header.column.getIsSorted() && (
															<span aria-hidden="true">
																{
																	sortArrows[
																		header.column.getIsSorted() as keyof typeof sortArrows
																	]
																}
															</span>
														)}
												</>
											),
										}}
									>
										{({ onClose }) => {
											const canMoveLeft = index > 0;
											const canMoveRight =
												index < headers.length - 1;

											const moveLeft = () => {
												if (index > 0) {
													const newColumnOrder = [
														...columnOrder,
													];
													// Swap the current column with the one to its left
													[
														newColumnOrder[index],
														newColumnOrder[
															index - 1
														],
													] = [
														newColumnOrder[
															index - 1
														],
														newColumnOrder[index],
													];
													table.setColumnOrder(
														newColumnOrder
													);
												}
											};

											const moveRight = () => {
												if (
													index <
													headers.length - 1
												) {
													const newColumnOrder = [
														...columnOrder,
													];
													// Swap the current column with the one to its right
													[
														newColumnOrder[index],
														newColumnOrder[
															index + 1
														],
													] = [
														newColumnOrder[
															index + 1
														],
														newColumnOrder[index],
													];
													table.setColumnOrder(
														newColumnOrder
													);
												}
											};

											return (
												<>
													{header.column.getCanSort() && (
														<MenuGroup label="Sort">
															{SORTING_DIRECTIONS.map(
																(direction) => (
																	<MenuItem
																		icon={
																			sortIcons[
																				direction as keyof typeof sortIcons
																			]
																		}
																		key={
																			direction
																		}
																		onClick={() => {
																			// Close the menu.
																			onClose();

																			// Toggle sorting.
																			header.column.toggleSorting(
																				direction ===
																					'desc'
																			);
																		}}
																	>
																		{
																			direction
																		}
																	</MenuItem>
																)
															)}
														</MenuGroup>
													)}
													{(canMove ||
														header.column.getCanHide()) && (
														<MenuGroup>
															{canMove && (
																<MenuItem
																	icon={
																		arrowLeft
																	}
																	disabled={
																		!canMoveLeft
																	}
																	onClick={
																		moveLeft
																	}
																>
																	{__(
																		'Move left'
																	)}
																</MenuItem>
															)}
															{canMove && (
																<MenuItem
																	icon={
																		arrowRight
																	}
																	disabled={
																		!canMoveRight
																	}
																	onClick={
																		moveRight
																	}
																>
																	{__(
																		'Move right'
																	)}
																</MenuItem>
															)}
															{header.column.getCanHide() && (
																<MenuItem
																	icon={
																		unseen
																	}
																	onClick={header.column.getToggleVisibilityHandler()}
																	role="menuitemcheckbox"
																>
																	{__(
																		'Hide column'
																	)}
																</MenuItem>
															)}
														</MenuGroup>
													)}
												</>
											);
										}}
									</DropdownMenu>
								)}
							</th>
						))}
					</tr>
				);
			})}
		</thead>
	);
};
