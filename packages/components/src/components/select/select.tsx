/**
 * External dependencies
 */
import React from 'react';

/**
 * Wordpress dependancies.
 */
import {
	SelectControl,
} from '@wordpress/components';
import type { SelectControlSingleSelectionProps } from '@wordpress/components/src/select-control/types';


/**
 * Local dependencies.
 */
import { SelectOption } from '.';
import { useCombineOptions, smartTag } from '../hooks';

/**
 * The select setting props.
 */
interface SelectSettingProps extends SelectControlSingleSelectionProps {

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
 * Displays a select setting
 *
 */
export const SelectSetting: React.FC<SelectSettingProps> = ( { options, availableSmartTags, ...attributes } ) => {

	const allOptions = useCombineOptions( options, availableSmartTags );

	return (
		<SelectControl
			{ ...attributes }
			options={ allOptions }
		/>
	);
}
