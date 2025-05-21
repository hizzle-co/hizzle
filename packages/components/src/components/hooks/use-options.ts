/**
 * External dependencies
 */
import { useMemo } from 'react';

/**
 * Local dependencies
 */
import { SelectOption } from '../select';

const prepareOptions = ( options: string[] | SelectOption[] | Record<string, string> ) => {

	// Arrays.
	if ( Array.isArray( options ) ) {
		// Check if the first option is an object (has label and value properties)
		if (
			options.length > 0 &&
			typeof options[ 0 ] === 'object' &&
			'label' in options[ 0 ] &&
			'value' in options[ 0 ]
		) {
			return options as SelectOption[];
		}

		return options.map( ( label ) => {
			return {
				label,
				value: label,
			};
		} );
	}

	// Objects.
	return Object.keys( options ).map( ( value ) => {
		return {
			label: options[ value ],
			value,
		};
	} );
}

/**
 * Prepares the available options for the selected condition.
 *
 * @param options The options.
 */
export const useOptions = (
	options: string[] | SelectOption[] | Record<string, string>
): SelectOption[] => {
	return useMemo( () => {
		if ( !options ) {
			return [];
		}

		// Dynamic options.
		if ( 'string' === typeof options ) {
			if ( window.hizzleWPComponentsSelectOptions?.[ options ] ) {
				return prepareOptions( window.hizzleWPComponentsSelectOptions[ options ] );
			}

			// If the option is not found, return an empty array.
			return [];
		}

		return prepareOptions( options );
	}, [ options ] );
};
