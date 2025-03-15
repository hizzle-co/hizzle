/**
 * External dependencies
 */
import React from 'react';

/**
 * Wordpress dependancies.
 */
import {
	BaseControl,
	useBaseControlProps,
	CheckboxControl,
} from '@wordpress/components';
import type { BaseControlProps } from '@wordpress/components/src/base-control/types';

/**
 * Local dependencies.
 */
import { SelectOption } from '.';

/**
 * The multi checkbox setting props.
 */
interface MultiCheckboxSettingProps extends Omit<BaseControlProps, "children"> {

	/**
	 * The value.
	 */
	value: string[];

	/**
	 * The options.
	 */
	options: SelectOption[];

	/**
	 * The onChange handler.
	 */
	onChange: ( value: string[] ) => void;
}

/**
 * Displays a multi-checkbox setting.
 *
 */
export const MultiCheckbox = ( { value, options, onChange, ...attributes }: MultiCheckboxSettingProps ) => {

	// The base props.
	const { baseControlProps, controlProps } = useBaseControlProps( attributes );

	// Ensure the value is an array.
	if ( !Array.isArray( value ) ) {
		value = value ? [ value ] : [];
	}

	// Render the control.
	return (
		<BaseControl { ...baseControlProps }>
			<div { ...controlProps }>
				{ options.map( ( option, index ) => (
					<CheckboxControl
						key={ index }
						label={ option.label }
						checked={ value.includes( option.value ) }
						onChange={ ( newValue ) => {
							if ( newValue ) {
								onChange( [ ...value, option.value ] );
							} else {
								onChange( value.filter( ( v ) => v !== option.value ) );
							}
						} }
					/>
				) ) }
			</div>
		</BaseControl>
	);
}
