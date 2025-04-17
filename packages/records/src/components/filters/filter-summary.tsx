/**
 * External dependencies
 */
import clsx from 'clsx';
import type { Column } from '@tanstack/react-table';
import React, { useRef } from 'react';

/**
 * WordPress dependencies
 */
import {
	Dropdown,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	Tooltip,
	Icon,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { closeSmall } from '@wordpress/icons';

const ENTER = 'Enter';
const SPACE = ' ';

export interface ColumnFilter {
	id: string
	value: {
		suffix: '' | '_not' | '_min' | '_max' | '_before' | '_after',
		value: string | string[]
	}[]
}

interface FilterValueProps {
	value?: string | string[],
	label: string,
	column: Column<unknown, unknown>
	filter: ColumnFilter
	onRemove: () => void
}

const FilterValue: React.FC<FilterValueProps> = ( {
	value,
	label,
	column,
	filter,
	onRemove,
}: FilterValueProps ) => {
	const toggleRef = useRef<HTMLDivElement>( null );

	// Ensure value is an array
	if ( value && typeof value === 'string' ) {
		value = [ value ]
	}

	const meta: Record<string, any> = column.columnDef.meta as Record<string, any> || {};

	if ( meta.options && !Array.isArray( meta.options ) && Array.isArray( value ) ) {
		value = value.map( ( v ) => meta.options[ v ] || v );
	}

	const hasValues = Array.isArray( value ) && value.length > 0;

	return (
		<Dropdown
			contentClassName="hizzlewp-records-filters__summary-popover"
			popoverProps={ { placement: 'bottom-start', role: 'dialog' } }
			onClose={ () => {
				toggleRef.current?.focus();
			} }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<div className="hizzlewp-records-filters__summary-chip-container">
					<Tooltip
						text={ sprintf(
							/* translators: 1: Filter name. */
							__( 'Filter by: %1$s' ),
							column.columnDef.header as string || filter.id
						) }
						placement="top"
					>
						<HStack
							className={ clsx(
								'hizzlewp-records-filters__summary-chip has-reset',
								{
									'has-values': hasValues,
								}
							) }
							role="button"
							tabIndex={ 0 }
							onClick={ onToggle }
							onKeyDown={ ( event ) => {
								if ( [ ENTER, SPACE ].includes( event.key ) ) {
									onToggle();
									event.preventDefault();
								}
							} }
							aria-pressed={ isOpen }
							aria-expanded={ isOpen }
							ref={ toggleRef }
							expanded={ false }
							wrap
						>
							<span className="hizzlewp-records-filters__summary-filter-text-name">
								{ label }
							</span>

							{ Array.isArray( value ) && value.length > 0 && (
								<span className="hizzlewp-records-filters__summary-filter-text-value">
									{ value.join( ', ' ) }
								</span>
							) }
						</HStack>
					</Tooltip>

					<Tooltip
						text={ __( 'Remove' ) }
						placement="top"
					>
						<button
							className={ clsx(
								'hizzlewp-records-filters__summary-chip-remove',
								{ 'has-values': hasValues }
							) }
							onClick={ () => {
								onRemove();

								// Focus on hizzlewp-filter-button if it exists.
								document.querySelector<HTMLButtonElement>( '.hizzlewp-filter-button' )?.focus();
							} }
						>
							<Icon icon={ closeSmall } />
						</button>
					</Tooltip>
				</div>
			) }
			renderContent={ () => {
				return (
					<VStack spacing={ 0 } justify="flex-start">
						TODO: Add filter content here.
					</VStack>
				);
			} }
		/>
	);
}

interface FilterValuesProps {
	filter: ColumnFilter;
	column: Column<unknown, unknown>;
	onRemove: () => void;
}
const FilterValues: React.FC<FilterValuesProps> = ( {
	column,
	filter,
	onRemove,
} ) => {

	const value = filter.value;
	const label = column.columnDef.header as string || filter.id;

	if ( value === undefined || ( Array.isArray( value ) && value.length === 0 ) ) {
		return (
			<FilterValue
				label={ label }
				onRemove={ onRemove }
				column={ column }
				filter={ filter }
			/>
		);
	}

	if ( typeof value === 'string' ) {
		return (
			<FilterValue
				value={ value }
				label={ sprintf(
					/* translators: 1: Filter name. e.g.: "Status:". */
					__( '%1$s:' ),
					label
				) }
				onRemove={ onRemove }
				column={ column }
				filter={ filter }
			/>
		);
	}

	return value.map( ( { value: filterValue, suffix }, index ) => {
		const props = {
			column,
			filter,
			value: filterValue,
			onRemove: () => {
				value.splice( index, 1 );

				if ( value.length === 0 ) {
					onRemove();
				} else {
					column.setFilterValue( value );
				}
			},
		};

		switch ( suffix ) {
			case '':
				return (
					<FilterValue
						key={ label }
						label={
							column.columnDef.meta?.is_primary ?
								sprintf(
									/* translators: 1: Filter name. e.g.: "Status is:". */
									__( '%1$s in:' ),
									label
								) :
								sprintf(
									/* translators: 1: Filter name. e.g.: "Status:". */
									__( '%1$s:' ),
									label
								)
						}
						{ ...props }
					/>
				);
			case '_not':
				return (
					<FilterValue
						key={ `${ label }_not` }
						label={ sprintf(
							/* translators: 1: Filter name. e.g.: "Status is not:". */
							__( '%1$s is not:' ),
							label
						) }
						{ ...props }
					/>
				);
			case '_min':
				return (
					<FilterValue
						key={ `${ label }_min` }
						label={ sprintf(
							/* translators: 1: Filter name. e.g.: "Status is min:". */
							__( '%1$s is more or equal to:' ),
							label
						) }
						{ ...props }
					/>
				);
			case '_max':
				return (
					<FilterValue
						key={ `${ label }_max` }
						label={ sprintf(
							/* translators: 1: Filter name. e.g.: "Status is max:". */
							__( '%1$s is less or equal to:' ),
							label
						) }
						{ ...props }
					/>
				);
			case '_before':
				return (
					<FilterValue
						key={ `${ label }_before` }
						label={ sprintf(
							/* translators: 1: Filter name. e.g.: "Status is before:". */
							__( '%1$s is before:' ),
							label
						) }
						{ ...props }
					/>
				);
			case '_after':
				return (
					<FilterValue
						key={ `${ label }_after` }
						label={ sprintf(
							/* translators: 1: Filter name. e.g.: "Status is after:". */
							__( '%1$s is after:' ),
							label
						) }
						{ ...props }
					/>
				);
			default:
				return <React.Fragment key={ `${ label }-${ suffix }-unknown` } />;
		}
	} );
};

type FilterSummaryProps = {
	column?: Column<unknown, unknown>;
	filter: ColumnFilter;
	onRemove: () => void;
};

export const FilterSummary: React.FC<FilterSummaryProps> = ( {
	column,
	filter,
	onRemove,
} ) => {

	if ( !column ) {
		return null;
	}

	return (
		<FilterValues
			column={ column }
			filter={ filter }
			onRemove={ onRemove }
		/>
	);
}