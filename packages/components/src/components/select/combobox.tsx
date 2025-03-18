/**
 * External dependencies
 */
import React, { useState } from 'react';

/**
 * Wordpress dependancies.
 */
import { ComboboxControl } from '@wordpress/components';
import type { ComboboxControlProps } from '@wordpress/components/src/combobox-control/types';

/**
 * Local dependancies.
 */
import { useCombineOptions, smartTag } from '../hooks';

/**
 * A single select option.
 */
export interface SelectOption {
	/**
	 * The option label.
	 */
	label: string;

	/**
	 * The option value.
	 */
	value: string;

	/**
	 * Whether the option is disabled.
	 */
	disabled?: boolean;

	/**
	 * The raw render HTML for combo box.
	 */
	render?: React.ReactNode;

	/**
	 * The raw render HTML for combo box (used when filtering).
	 */
	render_filtered?: string;

	/**
	 * The search string for the option.
	 */
	search?: string;
}

interface ComboboxSettingProps extends ComboboxControlProps {
	/**
	 * The options.
	 */
	options: SelectOption[];

	/**
	 * The available smart tags.
	 */
	availableSmartTags?: smartTag[];
}

/**
 * Displays a combobox setting
 *
 */
export const ComboboxSetting = ({
	options,
	availableSmartTags,
	...attributes
}: ComboboxSettingProps) => {
	const allOptions = useCombineOptions(options, availableSmartTags);
	const [filteredOptions, setFilteredOptions] = useState(allOptions);
	const hasFilteredOptions = filteredOptions.length !== allOptions.length;

	return (
		<ComboboxControl
			{...attributes}
			options={filteredOptions}
			onFilterValueChange={(inputValue) => {
				if (!inputValue) {
					setFilteredOptions(allOptions);
					return;
				}

				const filterOption = (option) => {
					// Abort for disabled and placeholder options.
					if (option.disabled || option.value === '') {
						return false;
					}

					const search = option.search
						? option.search.toLowerCase()
						: option.label.toLowerCase();

					return search.includes(inputValue.toLowerCase());
				};

				setFilteredOptions(allOptions.filter(filterOption));
			}}
			__experimentalRenderItem={({ item, ...props }) => {
				if (item.render_filtered && hasFilteredOptions) {
					return (
						<div
							{...props}
							dangerouslySetInnerHTML={{
								__html: item.render_filtered,
							}}
						/>
					);
				}

				if (item.render) {
					// Check if we have a string or a component.
					if (typeof item.render === 'string') {
						return (
							<div
								{...props}
								dangerouslySetInnerHTML={{
									__html: item.render,
								}}
							/>
						);
					}

					return item.render;
				}
				return item.label;
			}}
		/>
	);
};
