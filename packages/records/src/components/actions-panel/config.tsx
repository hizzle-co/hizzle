/**
 * WordPress dependencies
 */
import {
	MenuItem,
	MenuItemsChoice,
	DropdownMenu as OriginalDropdownMenu,
	__experimentalHStack as HStack,
	__experimentalText as Text,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import React, { memo } from 'react';
import { cog, check, chevronRightSmall } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { useTable } from '..';
import { SORTING_DIRECTIONS, SORTING_ICONS, SORTING_LABELS, PER_PAGE_OPTIONS } from '../../constants';

const PageSizeMenu: React.FC = () => {
	const table = useTable();
	const rowCount = table.getRowCount();
	const pageSize = table.getState().pagination.pageSize;
	const isShowingAll = pageSize && !PER_PAGE_OPTIONS.includes( Number( pageSize ) );

	const pageSizeOptions = PER_PAGE_OPTIONS.map( ( value ) => {
		return {
			value: value.toString(),
			label: value.toString(),
		};
	} );

	// Only show the "Show all" option if there are more rows than the largest per_page option
	// and the total count is 1000 or less to avoid performance issues.
	if ( rowCount > PER_PAGE_OPTIONS[ PER_PAGE_OPTIONS.length - 1 ] && rowCount <= 1000 ) {
		pageSizeOptions.push( {
			value: rowCount.toString(),
			label: __( 'Show all' ),
		} );
	}

	return (
		<OriginalDropdownMenu
			label={ __( 'Items per page' ) }
			icon={ chevronRightSmall }
			popoverProps={ {
				placement: 'left',
			} }
			toggleProps={ {
				as: MenuItem,
				children: (
					<HStack>
						<span>{ __( 'Items per page' ) }</span>
						{ pageSize && (
							<Text
								variant="muted"
								aria-hidden="true"
							>
								{ isShowingAll ? __( 'All' ) : pageSize }
							</Text>
						) }
					</HStack>
				),
			} }
			disableOpenOnArrowDown
		>
			{ ( { onClose } ) => (
				<div onMouseLeave={ onClose }>
					<MenuItemsChoice
						choices={ pageSizeOptions }
						onSelect={ ( size ) => {
							table.setPageSize( Number( size ) );
							onClose();
						} }
						value={ pageSize.toString() }
						onHover={ ( size ) => {
							console.log( 'onHover', size );
						} }
					/>
				</div>
			) }
		</OriginalDropdownMenu>
	);
}

const FieldsVisibilityMenu: React.FC = () => {
	const table = useTable();
	const fields = table.getAllLeafColumns();
	const hidableFields = fields.filter( field => field.getCanHide() );

	if ( !hidableFields?.length ) {
		return null;
	}

	return (
		<OriginalDropdownMenu
			label={ __( 'Fields' ) }
			icon={ chevronRightSmall }
			popoverProps={ {
				placement: 'left',
			} }
			toggleProps={ {
				as: MenuItem,
				children: (
					<HStack>
						<span>{ __( 'Fields' ) }</span>
					</HStack>
				),
			} }
			disableOpenOnArrowDown
		>
			{ ( { onClose } ) => (
				<div onMouseLeave={ onClose }>
					{ hidableFields?.map( ( field ) => {
						return (
							<MenuItem
								key={ field.id }
								role="menuitemcheckbox"
								isSelected={ field.getIsVisible() }
								label={ field.columnDef.header as string }
								icon={ field.getIsVisible() ? check : undefined }
								onClick={ () => { field.toggleVisibility() } }
							>
								{ field.columnDef.header as string }
							</MenuItem>
						);
					} ) }
				</div>
			) }
		</OriginalDropdownMenu>
	);
}

const SortMenu: React.FC = () => {
	const table = useTable();
	const fields = table.getAllLeafColumns();
	const sortableFields = fields.filter( field => field.getCanSort() );
	const sortField = table.getState().sorting?.[ 0 ]?.id;
	const isDescending = table.getState().sorting?.[ 0 ]?.desc;

	if ( !sortableFields?.length ) {
		return null;
	}

	const sortColumn = !sortField ? undefined : fields.find(
		( field ) => field.id === sortField
	);

	return (
		<OriginalDropdownMenu
			label={ __( 'Sort by' ) }
			icon={ chevronRightSmall }
			popoverProps={ {
				placement: 'right-start',
			} }
			toggleProps={ {
				as: MenuItem,
				children: (
					<HStack>
						<span>{ __( 'Sort by' ) }</span>
						{ sortColumn && <Text variant="muted" aria-hidden="true">{ sortColumn.columnDef.header as string }</Text> }
					</HStack>
				),
			} }
			disableOpenOnArrowDown
		>
			{ ( { isOpen, onToggle } ) => (
				<div>
					{ sortableFields?.map( ( field ) => (
						<OriginalDropdownMenu
							key={ field.id }
							style={ {
								minWidth: '220px',
							} }
							label={ field.columnDef.header as string }
							icon={ chevronRightSmall }
							popoverProps={ {
								placement: 'right-start',
							} }
							toggleProps={ {
								as: MenuItem,
								children: (
									<HStack>
										<span>{ field.columnDef.header as string }</span>
									</HStack>
								),
							} }
						>
							{ ( { onClose } ) => (
								<div onMouseLeave={ onClose }>
									<MenuItemsChoice
										choices={ SORTING_DIRECTIONS.map( ( direction ) => ( {
											label: SORTING_LABELS[ direction ],
											value: direction,
											icon: SORTING_ICONS[ direction ],
										} ) ) }
										onSelect={ ( sorting ) => {
											const hasSelectedDescending = 'desc' === sorting;

											if ( hasSelectedDescending === isDescending && field.id === sortField ) {
												field.clearSorting();
											} else {
												field.toggleSorting( hasSelectedDescending );
											}

											onClose();
										} }
										value={ field.id === sortField ? ( isDescending ? 'desc' : 'asc' ) : '' }
										onHover={ ( sorting ) => {
											console.log( 'onHover', sorting );
										} }
									/>
								</div>
							) }

						</OriginalDropdownMenu>
					) ) }
				</div>
			) }
		</OriginalDropdownMenu >
	);
}

export const Config = memo( function Config() {
	return (
		<OriginalDropdownMenu
			icon={ cog }
			size="compact"
			label={ __( 'View options' ) }
		>
			{ () => (
				<>
					<SortMenu />
					<FieldsVisibilityMenu />
					<PageSizeMenu />
				</>
			) }
		</OriginalDropdownMenu>
	);
} );
