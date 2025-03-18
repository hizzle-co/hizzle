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
	Button,
	ColorIndicator,
	ColorPicker,
	Dropdown,
} from '@wordpress/components';
import type { BaseControlProps } from '@wordpress/components/src/base-control/types';

interface ColorSettingProps extends Omit<BaseControlProps, 'children'> {
	/**
	 * The value.
	 */
	value: string;

	/**
	 * The onChange handler.
	 */
	onChange: (value: string) => void;
}

/**
 * Displays a color setting
 *
 */
export const ColorSetting: React.FC<ColorSettingProps> = ({
	value,
	onChange,
	...attributes
}) => {
	const { baseControlProps, controlProps } = useBaseControlProps({
		...attributes,
	});

	return (
		<BaseControl {...baseControlProps}>
			<Dropdown
				popoverProps={{ placement: 'bottom-start' }}
				renderToggle={({ isOpen, onToggle }) => (
					<Button onClick={onToggle} aria-expanded={isOpen}>
						<ColorIndicator colorValue={value} />
					</Button>
				)}
				renderContent={() => (
					<ColorPicker color={value} onChange={onChange} />
				)}
				{...controlProps}
			/>
		</BaseControl>
	);
};
