/**
 * External dependencies
 */
import React, { useCallback, useState } from 'react';

/**
 * Wordpress dependancies.
 */
import {
	Button,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalText as Text,
	CardHeader,
	CardBody,
	Flex,
	FlexBlock,
	FlexItem,
	Icon,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Local dependancies.
 */
import { smartTag } from '../hooks';
import { Setting } from '../setting';
import type { Setting as SettingType } from '../setting';
import { getNestedValue } from '../utils';

export interface RepeaterKey {
	/**
	 * The path to the value to display, e.g, 'label = First Name'
	 *
	 * Shown in the header of the repeater item and used to generate the key.
	 */
	from: string;

	/**
	 * The path to an auto-generated value, e.g, 'merge_tag = first_name'.
	 *
	 * Shown as a badge in the header of the repeater item.
	 */
	to: string;

	/**
	 * Whether to only generate a key for new items.
	 */
	newOnly: boolean;

	/**
	 * The maximum length of the value.
	 *
	 * @default 64
	 */
	maxLength: number;

	/**
	 * The display value.
	 */
	display: string | false;

	/**
	 * The fallback value path.
	 */
	fallback?: string;
}

interface RepeaterItemProps {
	/**
	 * A unique id.
	 */
	id: string;

	/**
	 * The fields.
	 */
	fields: SettingType[];

	/**
	 * The available smart tags.
	 */
	availableSmartTags: smartTag[];

	/**
	 * The repeater key.
	 */
	repeaterKey?: RepeaterKey;

	/**
	 * The on change handler.
	 */
	onChange: (value: any) => void;

	/**
	 * The on delete handler.
	 */
	onDelete?: () => void;

	/**
	 * The on move up handler.
	 */
	onMoveUp?: () => void;

	/**
	 * The on move down handler.
	 */
	onMoveDown?: () => void;

	/**
	 * The value.
	 */
	value: {
		/**
		 * Whether the item is predefined, e.g, needed for the system to work.
		 *
		 * These can't be deleted.
		 */
		is_predefined?: boolean;

		/**
		 * The item data.
		 */
		[key: string]: unknown;
	};
}

/**
 * Displays a single item in a repeater field.
 */
export const RepeaterItem: React.FC<RepeaterItemProps> = (props) => {
	// Destructure props to get necessary values
	const {
		fields,
		availableSmartTags,
		value,
		onChange,
		repeaterKey = undefined,
		onDelete,
		onMoveUp,
		onMoveDown,
		id,
	} = props;

	// State to track if the repeater item is expanded or collapsed
	// Default to open if there's no label to display in the header.
	const [isOpen, setIsOpen] = useState(!repeaterKey?.from);

	// Toggle function to expand/collapse the repeater item
	const toggle = useCallback(() => {
		setIsOpen(!isOpen), [isOpen];
	}, [isOpen]);

	// Hide the body if the item is closed and we have a label to display in the header.
	const hideBody = !isOpen && repeaterKey?.from;

	// Initialize header as null, will be populated if repeaterKey exists
	let header: React.ReactNode = null;

	if (repeaterKey) {
		// Create a badge element if we have display text and a value at the 'to' path
		const badge =
			false !== repeaterKey.display &&
			repeaterKey.to &&
			value?.[repeaterKey.to] ? (
				<code>
					{sprintf(
						repeaterKey.display || '%s',
						value?.[repeaterKey.to]
					)}
				</code>
			) : null;

		// Style for the header button
		const style = {
			paddingLeft: 16,
			paddingRight: 16,
			height: 48,
		};

		// Get the label for the card from the specified path, or fallback if provided
		const cardLabel =
			getNestedValue(value, repeaterKey.from) ||
			getNestedValue(value, repeaterKey.fallback);

		// Build the header component with toggle functionality
		header = (
			<CardHeader style={{ padding: 0 }}>
				<Flex
					as={Button}
					onClick={toggle}
					style={style}
					aria-controls={`${id}__body`}
					aria-expanded={!hideBody}
					type="button"
				>
					<HStack as={FlexBlock}>
						<Text weight={600}>
							{(cardLabel as string) ||
								__('(new)', 'newsletter-optin-box')}
						</Text>
					</HStack>
					<FlexItem>
						<HStack>
							{badge}
							{/* Show different arrow icon based on open/closed state */}
							<Icon
								icon={
									isOpen ? 'arrow-up-alt2' : 'arrow-down-alt2'
								}
							/>
						</HStack>
					</FlexItem>
				</Flex>
			</CardHeader>
		);
	}

	return (
		<>
			{header}
			{!hideBody && (
				<CardBody id={`${id}__body`}>
					<VStack>
						{Object.keys(fields).map((fieldKey) => (
							<Setting
								key={fieldKey}
								settingKey={fieldKey}
								availableSmartTags={availableSmartTags}
								setting={fields[fieldKey]}
								saved={value as Record<string, unknown>}
								setAttributes={(attributes) => {
									onChange({ ...value, ...attributes });
								}}
							/>
						))}
						<HStack
							className="hizzlewp-repeater-item__actions"
							justify="flex-start"
						>
							{onDelete && !value?.predefined && (
								<Button
									variant="link"
									onClick={onDelete}
									text={__(
										'Remove Item',
										'newsletter-optin-box'
									)}
									isDestructive
								/>
							)}
							{onMoveUp && (
								<Button
									onClick={onMoveUp}
									icon="arrow-up-alt"
									text={__('Move Up', 'newsletter-optin-box')}
									size="small"
									iconSize={16}
								/>
							)}
							{onMoveDown && (
								<Button
									onClick={onMoveDown}
									icon="arrow-down-alt"
									text={__(
										'Move Down',
										'newsletter-optin-box'
									)}
									size="small"
									iconSize={16}
								/>
							)}
						</HStack>
					</VStack>
				</CardBody>
			)}
		</>
	);
};
