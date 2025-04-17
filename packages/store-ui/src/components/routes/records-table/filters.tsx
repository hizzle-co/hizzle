/**
 * External dependencies
 */
import React, { useState, useMemo, Fragment } from "react";
import { Button, Modal } from "@wordpress/components";
import { __, _x, sprintf } from "@wordpress/i18n";

/**
 * HizzleWP dependencies
 */
import { Setting } from '@hizzlewp/components';
import type { ISetting } from '@hizzlewp/components';
import { useProvidedCollectionConfig } from "@hizzlewp/store";
import { useQuery, updateQueryString } from '@hizzlewp/history';

interface ColumnFilter {
	id: string
	value: {
		suffix: '' | '_not' | '_min' | '_max' | '_before' | '_after',
		value: string
	}[]
}

// Convert flat filters object to ColumnFilter[] format
export const flatFiltersToColumnFilters = ( filters: Record<string, string> ): ColumnFilter[] => {
	const columnFilters: Record<string, ColumnFilter> = {};

	Object.entries( filters ).forEach( ( [ key, value ] ) => {
		if ( !value ) return;

		// Check if this is a field with a suffix
		const suffixMatch = key.match( /(.*?)(_not|_min|_max|_before|_after)$/ );
		const fieldName = suffixMatch ? suffixMatch[ 1 ] : key;
		const suffix = suffixMatch ?
			( suffixMatch[ 2 ] as '' | '_not' | '_min' | '_max' | '_before' | '_after' ) :
			( '' );

		// Create the column filter if it doesn't exist
		if ( !columnFilters[ fieldName ] ) {
			columnFilters[ fieldName ] = {
				id: fieldName,
				value: []
			};
		}

		// Add the value
		columnFilters[ fieldName ].value.push( {
			suffix,
			value
		} );
	} );

	return Object.values( columnFilters );
};

// Convert ColumnFilter[] format to flat filters object
export const columnFiltersToFlatFilters = ( columnFilters: ColumnFilter[] ): Record<string, string> => {
	const flatFilters: Record<string, string> = {};

	columnFilters.forEach( filter => {
		filter.value.forEach( value => {
			flatFilters[ filter.id + value.suffix ] = value.value;
		} );
	} );

	return flatFilters;
};

/**
 * Displays the bulk edit form.
 */
const EditForm = ( { fields, onApplyFilters, filters, setAttributes } ) => {

	// Display the edit records form.
	return (
		<form onSubmit={ onApplyFilters }>

			{ fields.map( ( field ) => {

				// If field.is_numeric || field.is_float, show _min and _max fields.
				// If field.is_date, show _before and _after fields.
				const mainSetting = {
					name: field.name,
					...prepareField( field ),
					default: '',
					placeholder: __( 'Any', 'newsletter-optin-box' ),
					canSelectPlaceholder: true,
				};

				let secondarySetting: typeof mainSetting | null = null;

				if ( field.is_boolean ) {
					mainSetting.el = 'select';
					mainSetting.options = {
						'1': __( 'Yes', 'newsletter-optin-box' ),
						'0': __( 'No', 'newsletter-optin-box' ),
					};
				} else if ( field.is_numeric || field.is_float ) {
					mainSetting.name = `${ field.name }_min`;
					mainSetting.label = sprintf(
						// translators: %s: Field label.
						_x( '%s - Min', 'Number', 'newsletter-optin-box' ),
						field.label
					);

					secondarySetting = {
						...mainSetting,
						name: `${ field.name }_max`,
						label: sprintf(
							// translators: %s: Field label.
							_x( '%s - Max', 'Number', 'newsletter-optin-box' ),
							field.label
						)
					}
				} else if ( field.is_date ) {
					mainSetting.name = `${ field.name }_after`;
					mainSetting.label = sprintf(
						// translators: %s: Date field label.
						_x( '%s - After', 'Date', 'newsletter-optin-box' ),
						field.label
					);

					secondarySetting = {
						...mainSetting,
						name: `${ field.name }_before`,
						label: sprintf(
							// translators: %s: Date field label.
							_x( '%s - Before', 'Date', 'newsletter-optin-box' ),
							field.label
						)
					}
				} else if ( field.is_primary ) {
					mainSetting.el = 'textarea'
					mainSetting.description = __( 'Separate multiple values with a comma.', 'newsletter-optin-box' );
				} else {

					secondarySetting = {
						...mainSetting,
						name: `${ field.name }_not`,
						label: sprintf(
							// translators: %s: Field label.
							__( '%s - Exclude', 'newsletter-optin-box' ),
							field.label
						)
					}

				}

				return (
					<Fragment key={ field.name }>
						<div style={ { marginBottom: '1.6rem' } }>
							<Setting
								settingKey={ mainSetting.name }
								saved={ filters }
								setAttributes={ setAttributes }
								setting={ mainSetting }
							/>
						</div>

						{ secondarySetting && (
							<div style={ { marginBottom: '1.6rem' } }>
								<Setting
									settingKey={ secondarySetting.name }
									saved={ filters }
									setAttributes={ setAttributes }
									setting={ secondarySetting }
								/>
							</div>
						) }
					</Fragment>
				);
			} ) }
		</form>
	);

}

/**
 * Displays the bulk edit modal.
 */
const TheModal = ( { currentFilters, fields, setOpen } ) => {
	const [ filters, setFilters ] = useState( { ...currentFilters } );

	// A function to apply the filters.
	const onApplyFilters = ( e ) => {
		e?.preventDefault();

		// If there are no filters, don't set the query param
		if ( filters && Object.keys( filters ).length === 0 ) {
			updateQueryString( { hizzlewp_filters: '' } );
		} else {
			updateQueryString( { hizzlewp_filters: JSON.stringify( filters ) } );
		}

		setOpen( false );
	}

	// Sets edited attributes.
	const setAttributes = ( atts ) => {
		setFilters( { ...filters, ...atts } );
	}

	// Display the edit records modal.
	return (
		<>

			<EditForm
				fields={ fields }
				filters={ filters }
				onApplyFilters={ onApplyFilters }
				setAttributes={ setAttributes }
			/>

			<Button className="hizzlewp-block-button" variant="primary" onClick={ onApplyFilters } text={ __( 'Apply Filters', 'newsletter-optin-box' ) } />
		</>
	);
}

/**
 * Returns a list of filterable fields.
 */
export const useFilterableFields = ( { isBulkEditing = false } ) => {
	const { config: data } = useProvidedCollectionConfig();

	return useMemo( () => {

		if ( !data.schema ) {
			return [];
		}

		return data.schema.filter( ( field ) => {

			// Remove readonly fields.
			if ( ( field.readonly && isBulkEditing ) || field.is_dynamic ) {
				return false;
			}

			// Remove ignorable fields.
			if ( Array.isArray( data.ignore ) && data.ignore.includes( field.name ) ) {
				return false;
			}

			// Remove hidden fields.
			if ( Array.isArray( data.hidden ) && data.hidden.includes( field.name ) ) {
				return false;
			}

			// Allow tokens.
			if ( field.is_tokens ) {
				return true;
			}

			// If we're not bulk editing, include numbers and dates.
			if ( !isBulkEditing && ( field.is_numeric || field.is_float || field.is_date || field.is_primary ) ) {
				return true;
			}

			// Remove non-selectable fields.
			if ( !field.enum || Array.isArray( field.enum ) ) {
				return false;
			}

			return true;
		} );
	}, [ data, isBulkEditing ] );
}

/**
 * Prepares a field for use in a setting.
 */
export const prepareField = ( field ) => {

	const prepared: ISetting = {
		default: field.default,
		label: field.label,
		el: 'input',
		type: 'text',
		name: field.name,
		isInputToChange: true,
	};

	// Custom attributes.
	if ( field.js_props?.setting ) {
		prepared.customAttributes = field.js_props.setting;
	}

	// Conditions.
	if ( field.js_props?.conditions ) {
		prepared.conditions = field.js_props?.conditions;
	}

	// Tokens.
	if ( field.is_tokens ) {
		prepared.el = 'form_token';
		prepared.suggestions = field.suggestions;
	} else if ( field.enum && !Array.isArray( field.enum ) ) {
		prepared.el = 'select';
		prepared.options = field.enum;

		if ( field.multiple ) {
			prepared.multiple = true;
		}
	} else if ( field.is_textarea ) {
		prepared.el = 'textarea';
	}

	if ( field.is_numeric || field.is_float ) {
		prepared.type = 'number';
	}

	if ( field.is_date ) {
		prepared.type = 'datetime-local';
		prepared.placeholder = 'YYYY-MM-DDTHH:MM:SS+ZZ:ZZ';
	}

	if ( field.is_boolean ) {
		prepared.type = 'toggle';
	}

	if ( field.description && field.description !== field.label ) {
		prepared.description = field.description;
	}

	return prepared;
}

/**
 * Returns the filters and the fields.
 */
export const useFilters = () => {
	const query = useQuery();
	const fields = useFilterableFields( { isBulkEditing: false } );
	return useMemo( () => {
		const filters: ColumnFilter[] = [];
		const filtersString = query?.hizzlewp_filters;

		if ( !filtersString || typeof filtersString !== 'string' ) {
			return { fields, filters: [], preparedFilters: {} };
		}

		try {
			const parsedFilters = JSON.parse( filtersString as string );

			if ( !parsedFilters || 'object' !== typeof parsedFilters ) {
				return { fields, filters: [], preparedFilters: {} };
			}

			const columnFilters = flatFiltersToColumnFilters( parsedFilters );

			if ( !Array.isArray( columnFilters ) ) {
				return { fields, filters: [], preparedFilters: {} };
			}

			filters.push( ...columnFilters );
		} catch ( error ) {
			return { fields, filters: [], preparedFilters: {} };
		}

		const filteredFilters = filters.filter( ( filter ) => {
			return filter.id && fields.some( ( field ) => field.name === filter.id ) && Array.isArray( filter.value ) && filter.value.length > 0;
		} );

		const preparedFilters = columnFiltersToFlatFilters( filteredFilters );
		return { fields, filters: filteredFilters, preparedFilters };
	}, [ query, fields ] );
}

/**
 * Displays a filters edit button.
 */
export const FiltersButton: React.FC = () => {

	const [ isOpen, setOpen ] = useState( false );
	const { fields, preparedFilters } = useFilters();
	const numFilters = Object.keys( preparedFilters ).length;
	const buttonText = numFilters > 0 ? sprintf(
		// translators: %d: number of filters applied.
		__( 'Applied Filters (%d)', 'newsletter-optin-box' ),
		numFilters
	) : __( 'Filter Records', 'newsletter-optin-box' );

	// Display the button.
	return (
		<>
			{ fields.length > 0 && (
				<>
					<Button
						onClick={ () => setOpen( true ) }
						variant={ numFilters > 0 ? 'tertiary' : undefined }
						icon="filter"
						text={ buttonText }
					/>

					{ isOpen && (
						<Modal title={ __( 'Filter records', 'newsletter-optin-box' ) } onRequestClose={ () => setOpen( false ) }>
							<TheModal fields={ fields } currentFilters={ preparedFilters } setOpen={ setOpen } />
						</Modal>
					) }
				</>
			) }
		</>
	);
}
