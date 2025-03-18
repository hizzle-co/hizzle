/**
 * External dependencies
 */
import React, { useCallback, useMemo } from 'react';

/**
 * Wordpress dependancies.
 */
import { RawHTML } from '@wordpress/element';
import { FormTokenField } from '@wordpress/components';
import type {
	FormTokenFieldProps,
	TokenItem,
} from '@wordpress/components/src/form-token-field/types';

/**
 * Local dependencies.
 */
import { SelectOption } from '.';

/**
 * The multi checkbox setting props.
 */
interface MultiSelectSettingProps
	extends Omit<FormTokenFieldProps, 'children'> {
	/**
	 * The options.
	 */
	options: SelectOption[];
}

/**
 * Multi select control.
 *
 */
export const MultiSelectSetting = ({
	options,
	value,
	onChange,
	...attributes
}: MultiSelectSettingProps) => {
	const theValue = Array.isArray(value) ? value : [];
	const suggestions = useMemo(
		() => options.map((option: SelectOption) => option.label),
		[options]
	);
	const validate = useCallback(
		(input: string) => suggestions.includes(input),
		[suggestions]
	);
	const valueLabels = useMemo(
		() =>
			theValue.map((value) => {
				const option = options.find((option) => option.value === value);
				return option ? option.label : value;
			}),
		[value, options]
	);

	const onValueChange = useCallback(
		(labels) => {
			const newValues = new Set<string | TokenItem>();
			for (const label of labels) {
				// Search for option with this label.
				const option: SelectOption | undefined = options.find(
					(option) => option.label === label
				);

				if (undefined !== option) {
					newValues.add(option.value);
				}
			}

			if (onChange) {
				onChange(Array.from(newValues));
			}
		},
		[onChange, options]
	);

	const render = useCallback(
		(args: { item: string }) => {
			const option = options.find((option) => option.label === args.item);

			if (option && option.render) {
				return <RawHTML>{option.render as string}</RawHTML>;
			}

			return <>{args.item}</>;
		},
		[options]
	);

	return (
		<FormTokenField
			value={valueLabels}
			suggestions={suggestions}
			onChange={onValueChange}
			__experimentalShowHowTo={false}
			__experimentalExpandOnFocus={true}
			__nextHasNoMarginBottom={true}
			__next40pxDefaultSize={true}
			__experimentalValidateInput={validate}
			__experimentalRenderItem={render}
			{...attributes}
		/>
	);
};
