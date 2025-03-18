/**
 * External dependencies.
 */
import { useMemo } from 'react';

/**
 * Local dependencies.
 */
import { SelectOption } from '../select';

/**
 * Adds a placeholder to the beginning of an array.
 *
 * @param options The options.
 * @param placeholder The placeholder text.
 */
export const usePlaceholder = (
	options: SelectOption[],
	placeholder: string
) => {
	return useMemo(() => {
		return [
			{
				label: placeholder,
				value: '',
				disabled: true,
			},
			...options,
		];
	}, [options, placeholder]);
};
