/**
 * External dependencies
 */
import React, { useCallback } from 'react';

/**
 * Wordpress dependancies.
 */
import {
	Button,
	FlexItem,
	Flex,
	useBaseControlProps,
	BaseControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { BaseControlProps } from '@wordpress/components/src/base-control/types';

/**
 * Local dependancies.
 */
import { smartTag } from '../hooks';
import { KeyValueRepeaterField } from '.';
import type { Setting } from '../setting';

/**
 * Key value repeater fields.
 */
const keyValueRepeaterFields = [
	{
		id: 'key',
		label: __('Key', 'newsletter-optin-box'),
		type: 'text',
	},
	{
		id: 'value',
		label: __('Value', 'newsletter-optin-box'),
		type: 'text',
	},
];

type KeyValueRepeaterValue = {
	key: string;
	value: string;
};

interface KeyValueRepeaterProps extends Omit<BaseControlProps, 'children'> {
	/**
	 * The onChange handler.
	 */
	onChange: (value: KeyValueRepeaterValue[]) => void;

	/**
	 * The current value.
	 */
	value: KeyValueRepeaterValue[];

	/**
	 * The setting object.
	 */
	setting: Setting;

	/**
	 * The available smart tags.
	 */
	availableSmartTags?: smartTag[];
}

/**
 * Displays a key value repeater setting.
 *
 */
export const KeyValueRepeater: React.FC<KeyValueRepeaterProps> = ({
	setting,
	availableSmartTags,
	value,
	onChange,
	...attributes
}) => {
	// The base props.
	const { baseControlProps, controlProps } = useBaseControlProps(attributes);

	// Ensure the value is an array.
	if (!Array.isArray(value)) {
		value = [];
	}

	// Displays a single Item.
	const Item = useCallback(
		({ item, index }) => {
			return (
				<Flex className="hizzlewp-repeater-item" wrap>
					{keyValueRepeaterFields.map((field, fieldIndex) => (
						<KeyValueRepeaterField
							key={fieldIndex}
							availableSmartTags={availableSmartTags}
							field={field}
							value={
								item[field.id] === undefined
									? ''
									: item[field.id]
							}
							onChange={(newValue) => {
								const newItems = [...value];
								newItems[index][field.id] = newValue;
								onChange(newItems);
							}}
						/>
					))}

					<FlexItem>
						<Button
							icon="trash"
							variant="tertiary"
							className="hizzlewp-component__field"
							label="Delete"
							showTooltip
							onClick={() => {
								const newValue = [...value];
								newValue.splice(index, 1);
								onChange(newValue);
							}}
							isDestructive
						/>
					</FlexItem>
				</Flex>
			);
		},
		[value, onChange]
	);

	// Render the control.
	return (
		<BaseControl {...baseControlProps}>
			<div {...controlProps}>
				{value.map((item, index) => (
					<Item key={index} item={item} index={index} />
				))}
				<Button
					onClick={() => {
						const newValue = [...value];
						newValue.push(
							keyValueRepeaterFields.reduce((acc, field) => {
								acc[field.id] = '';
								return acc;
							}, {} as KeyValueRepeaterValue)
						);
						onChange(newValue);
					}}
					variant="secondary"
				>
					{setting.add_field
						? setting.add_field
						: __('Add', 'newsletter-optin-box')}
				</Button>
			</div>
		</BaseControl>
	);
};
