/**
 * External dependencies
 */
import React from 'react';

/**
 * Wordpress dependancies.
 */
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import type {
	ToggleGroupControlProps,
	ToggleGroupControlOptionProps,
} from '@wordpress/components/src/toggle-group-control/types';

export interface ToggleGroupSettingProps
	extends Omit<ToggleGroupControlProps, 'children'> {
	options: ToggleGroupControlOptionProps[];
}

/**
 * Displays a toggle group setting
 *
 */
export const ToggleGroupSetting = ({
	options,
	...attributes
}: ToggleGroupSettingProps) => {
	return (
		<ToggleGroupControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			isBlock
			{...attributes}
		>
			{options.map((option, index) => (
				<ToggleGroupControlOption key={index} {...option} />
			))}
		</ToggleGroupControl>
	);
};
