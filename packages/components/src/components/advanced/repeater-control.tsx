/**
 * External dependencies
 */
import React, { useState } from 'react';

/**
 * Wordpress dependancies.
 */
import {
	BaseControl,
	useBaseControlProps,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	Card,
	Modal,
	Button,
	ToggleControl,
} from '@wordpress/components';
import type { BaseControlProps } from '@wordpress/components/src/base-control/types';
import type { Props as CardProps } from '@wordpress/components/src/card/types';
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';

/**
 * Local dependancies.
 */
import { smartTag } from '../hooks';
import { getNestedValue, updateNestedValue } from '../utils';
import { RepeaterItem, RepeaterKey } from '.';

interface RepeaterControlProps extends Omit<BaseControlProps, 'children'> {
	/**
	 * Array of available smart tags that can be used in the repeater fields.
	 */
	availableSmartTags: smartTag[];

	/**
	 * The current value of the repeater control (array of items).
	 */
	value: Record<string, unknown>[];

	/**
	 * Callback function triggered when the repeater value changes.
	 * @param value - The updated array of repeater items
	 */
	onChange: (value: Record<string, unknown>[]) => void;

	/**
	 * Text to display on the "Add Item" button.
	 */
	button?: string;

	/**
	 * Configuration for the fields that appear in each repeater item.
	 */
	fields?: any[];

	/**
	 * Provide a label if you want the user to be able to disable the repeater control.
	 *
	 * E.g, Enable/Disable conditional logic.
	 */
	disable?: string;

	/**
	 * Whether the repeater control is disabled.
	 *
	 * E.g, when conditional logic is disabled.
	 */
	disabled?: boolean;

	/**
	 * Callback function triggered when the disable state changes.
	 */
	onDisable?: (value: boolean) => void;

	/**
	 * The string to display on the "Open Modal" button.
	 *
	 * E.g, "Edit conditional logic".
	 *
	 * Leave blank to hide the button.
	 */
	openModal?: string;

	/**
	 * The string to display before the repeater items.
	 *
	 * E.g, "Add items".
	 */
	prepend?: React.ReactNode;

	/**
	 * The repeater key.
	 */
	repeaterKey?: RepeaterKey;

	/**
	 * The card props.
	 */
	cardProps?: Omit<CardProps, 'children'>;

	/**
	 * The default item.
	 */
	defaultItem?: Record<string, unknown>;
}

/**
 * Displays a repeater setting.
 *
 */
export const RepeaterControl: React.FC<RepeaterControlProps> = (props) => {
	const {
		availableSmartTags,
		value,
		onChange,
		button,
		fields = [],
		openModal,
		prepend,
		disable,
		disabled,
		onDisable,
		cardProps,
		repeaterKey,
		id,
		defaultItem,
		...attributes
	} = props;
	const [isOpen, setIsOpen] = useState(false);

	// Ensure the value is an array.
	const theValue = Array.isArray(value) ? value : [];

	// The base props.
	const theId = id || useInstanceId(RepeaterControl, 'hizzlewp-repeater');
	const { baseControlProps, controlProps } = useBaseControlProps({
		...attributes,
		id: theId,
	});

	// Prepare the default value.
	const defaultValue = defaultItem || {};

	if (repeaterKey?.newOnly) {
		defaultValue['new'] = true;
	}

	if (!fields) {
		console.warn('No fields provided to repeater control.');
		return null;
	}

	Object.keys(fields).forEach((fieldKey) => {
		if (undefined !== fields[fieldKey].default) {
			defaultValue[fieldKey] = fields[fieldKey].default;
		}
	});

	const showInModal = !!openModal;
	const keyOrIndex = (item, index) =>
		item.key
			? item.key
			: repeaterKey?.to && getNestedValue(item, repeaterKey.to)
				? getNestedValue(item, repeaterKey.to)
				: index;

	// The actual fields.
	const el = (
		<VStack>
			{prepend}
			{theValue.map((item, index) => {
				// Move the item down.
				const onMoveDown = () => {
					// Create a copy of the current array
					const newItems = [...theValue];

					// Get the current item
					const item = newItems[index];

					// Remove the item from its current position
					newItems.splice(index, 1);

					// Insert the item at the next position
					newItems.splice(index + 1, 0, item);

					// Update the parent component with the new array
					onChange(newItems);
				};

				// Move the item up.
				const onMoveUp = () => {
					// Create a copy of the current array
					const newItems = [...theValue];

					// Get the current item
					const item = newItems[index];

					// Remove the item from its current position
					newItems.splice(index, 1);

					// Insert the item at the previous position
					newItems.splice(index - 1, 0, item);

					// Update the parent component with the new array
					onChange(newItems);
				};

				// Delete the item.
				const onDelete = () => {
					// Create a copy of the current array
					const newItems = [...theValue];

					// Remove the item from the array
					newItems.splice(index, 1);

					// Update the parent component with the new array
					onChange(newItems);
				};

				// Update the item.
				const localOnChange = (
					newItemValue: Record<string, unknown>
				) => {
					// Create a copy of the current item.
					let theNewItemValue = { ...newItemValue };

					// If the repeater key is set, and the item has a value at the 'from' path, and the item is not new only, or the item is new.
					if (
						repeaterKey?.to &&
						repeaterKey.from &&
						getNestedValue(theNewItemValue, repeaterKey.from)
					) {
						if (!repeaterKey.newOnly || theNewItemValue['new']) {
							// Generate a merge tag from the label.
							const label = getNestedValue(
								theNewItemValue,
								repeaterKey.from
							) as string;
							const mergeTag = label
								.toString()
								.trim()
								.toLowerCase()
								.replace(/[^a-z0-9]+/g, '_');

							// Limit to 64 characters.
							theNewItemValue = updateNestedValue(
								theNewItemValue,
								repeaterKey.to,
								mergeTag.substring(
									0,
									repeaterKey.maxLength || 64
								)
							);

							// Ensure the merge tag is unique.
							if (
								theValue.find(
									(value, valueIndex) =>
										index !== valueIndex &&
										getNestedValue(
											value,
											repeaterKey.to
										) ===
											getNestedValue(
												theNewItemValue,
												repeaterKey.to
											)
								)
							) {
								theNewItemValue = updateNestedValue(
									theNewItemValue,
									repeaterKey.to,
									`${getNestedValue(theNewItemValue, repeaterKey.to)}_${index}`
								);
							}
						}
					}

					const newItems = [...theValue];
					newItems[index] = theNewItemValue;
					onChange(newItems);
				};

				return (
					<Card
						size="small"
						className="hizzlewp-no-shadow"
						id={`${theId}__item-${keyOrIndex(item, index)}`}
						data-index={index}
						borderBottom
						borderLeft
						borderRight
						borderTop
						{...(cardProps || {})}
						key={keyOrIndex(item, index)}
					>
						<RepeaterItem
							id={`${theId}__item-${keyOrIndex(item, index)}`}
							fields={fields}
							value={item}
							availableSmartTags={availableSmartTags}
							onChange={localOnChange}
							onDelete={onDelete}
							onMoveUp={index > 0 ? onMoveUp : undefined}
							onMoveDown={
								index < theValue.length - 1
									? onMoveDown
									: undefined
							}
							repeaterKey={repeaterKey}
						/>
					</Card>
				);
			})}
			<HStack>
				<Button
					onClick={() => {
						const newValue = [...theValue];
						const timestamp = Date.now().toString(36);
						const randomStr = Math.random()
							.toString(36)
							.substring(2, 8);
						newValue.push({
							key: `${timestamp}_${randomStr}`,
							...defaultValue,
						});
						onChange(newValue);
					}}
					variant="primary"
				>
					{button || __('Add Item', 'newsletter-optin-box')}
				</Button>
				{showInModal && (
					<Button
						onClick={() => setIsOpen(false)}
						variant="secondary"
					>
						{__('Go Back', 'newsletter-optin-box')}
					</Button>
				)}
			</HStack>
		</VStack>
	);

	// Render the control.
	return (
		<BaseControl {...baseControlProps}>
			<div {...controlProps}>
				{showInModal ? (
					<VStack>
						{disable && onDisable && (
							<ToggleControl
								label={disable}
								checked={disabled}
								onChange={onDisable}
								__nextHasNoMarginBottom
							/>
						)}
						{(!disable || !disabled) && (
							<>
								<Button
									onClick={() => setIsOpen(true)}
									variant="secondary"
								>
									{openModal}
								</Button>
								{isOpen && (
									<Modal
										title={
											(attributes.label as string) ||
											openModal
										}
										onRequestClose={() => setIsOpen(false)}
										size="medium"
									>
										{el}
									</Modal>
								)}
							</>
						)}
					</VStack>
				) : (
					el
				)}
			</div>
		</BaseControl>
	);
};
