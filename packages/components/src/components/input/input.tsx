/**
 * External dependencies
 */
import React, { useCallback } from 'react';

/**
 * Wordpress dependancies.
 */
import {
	__experimentalInputControl as InputControl,
	__experimentalInputControlPrefixWrapper as InputControlPrefixWrapper,
	__experimentalInputControlSuffixWrapper as InputControlSuffixWrapper,
	Button,
	Dropdown,
	DateTimePicker,
} from '@wordpress/components';
import type { InputControlProps } from '@wordpress/components/src/input-control/types';
import { next, calendar, tip } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import { format } from '@wordpress/date';

/**
 * Local dependencies.
 */
import { smartTag } from '../utils';

/**
 * Input types.
 */
const inputTypes = [
	'number',
	'search',
	'email',
	'password',
	'tel',
	'url',
	'date',
];

interface InputSettingProps extends Omit<InputControlProps, 'onChange'> {
	/**
	 * The setting configuration object.
	 */
	setting: Record<string, string>;

	/**
	 * Array of available smart tags that can be inserted into the input.
	 */
	availableSmartTags?: smartTag[];

	/**
	 * Callback function triggered when the input value changes.
	 *
	 * @param {string} value The new input value.
	 */
	onChange?: (value: string) => void;
}

/**
 * Displays an input setting
 *
 * @param {Object} props
 * @param {Function} props.attributes The attributes
 * @param {Object} props.setting The setting object.
 * @param {Array} props.availableSmartTags The available smart tags.
 * @return {JSX.Element}
 */
export const InputSetting: React.FC<InputSettingProps> = ({
	setting,
	availableSmartTags,
	isPressEnterToChange = true,
	...attributes
}) => {
	// On add merge tag...
	const onMergeTagClick = useCallback(
		(mergeTag) => {
			// Add the merge tag to the value.
			if (attributes.onChange) {
				attributes.onChange(
					attributes.value
						? `${attributes.value} ${mergeTag}`.trim()
						: mergeTag
				);
			}
		},
		[attributes.value, attributes.onChange]
	);

	const mergeTagSuffix = useMergeTags({
		availableSmartTags,
		onMergeTagClick,
	});

	// Merge tags.
	if (
		typeof attributes.suffix === 'string' ||
		attributes.suffix instanceof String
	) {
		attributes.suffix = (
			<InputControlSuffixWrapper>
				{attributes.suffix}
			</InputControlSuffixWrapper>
		);
	} else if (!setting.disabled && mergeTagSuffix && !attributes.suffix) {
		attributes.suffix = mergeTagSuffix;
	}

	if ('datetime-local' === setting.type) {
		attributes.suffix = (
			<InputControlSuffixWrapper>
				<Dropdown
					popoverProps={{ placement: 'bottom-start' }}
					renderToggle={({ isOpen, onToggle }) => (
						<Button
							onClick={onToggle}
							aria-expanded={isOpen}
							icon={calendar}
						/>
					)}
					renderContent={() => (
						<DateTimePicker
							currentDate={attributes.value}
							onChange={(newDate: string | null) => {
								// Convert to ISO 8601 format.
								if (newDate) {
									newDate = format('c', newDate);
								}
								if (attributes.onChange) {
									attributes.onChange(newDate || '');
								}
							}}
						/>
					)}
				/>
			</InputControlSuffixWrapper>
		);
	}

	if (setting.disabled) {
		attributes.readOnly = true;
		attributes.onFocus = (e) => e.target.select();

		if (setting.value) {
			attributes.value = setting.value;
		}
	}

	// Prefix.
	if (
		typeof attributes.prefix === 'string' ||
		attributes.prefix instanceof String
	) {
		attributes.prefix = (
			<InputControlPrefixWrapper>
				{attributes.prefix}
			</InputControlPrefixWrapper>
		);
	}

	return (
		<InputControl
			{...attributes}
			type={inputTypes.includes(setting.type) ? setting.type : 'text'}
			placeholder={setting.placeholder ? setting.placeholder : ''}
			isPressEnterToChange={isPressEnterToChange}
			__next40pxDefaultSize
		/>
	);
};
