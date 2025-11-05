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
	DatePicker,
} from '@wordpress/components';
import type { InputControlProps } from '@wordpress/components/src/input-control/types';
import { calendar } from '@wordpress/icons';
import { format } from '@wordpress/date';

/**
 * Local dependencies.
 */
import { useMergeTags, smartTag } from '../hooks';

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
];

interface InputSettingProps extends InputControlProps {
	/**
	 * The setting configuration object.
	 */
	setting: Record<string, string>;

	/**
	 * Array of available smart tags that can be inserted into the input.
	 */
	availableSmartTags?: smartTag[];
}

const DATE_COMPONENTS = {
	'datetime-local': {
		component: DateTimePicker,
		// Convert to ISO 8601 format.
		format: 'c',
		icon: calendar,
	},
	date: {
		component: DatePicker,
		format: 'Y-m-d',
		icon: calendar,
	},
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
export const InputSetting: React.FC<InputSettingProps> = ( {
	setting,
	availableSmartTags,
	isPressEnterToChange = true,
	...attributes
} ) => {
	// On add merge tag...
	const onMergeTagClick = useCallback(
		( mergeTag ) => {
			// Add the merge tag to the value.
			if ( attributes.onChange ) {
				// @ts-expect-error Event handler is not needed.
				attributes.onChange(
					attributes.value
						? `${ attributes.value } ${ mergeTag }`.trim()
						: mergeTag
				);
			}
		},
		[ attributes.value, attributes.onChange ]
	);

	const mergeTagSuffix = useMergeTags( {
		availableSmartTags,
		onMergeTagClick,
	} );

	// Merge tags.
	if (
		typeof attributes.suffix === 'string' ||
		attributes.suffix instanceof String
	) {
		attributes.suffix = (
			<InputControlSuffixWrapper>
				{ attributes.suffix }
			</InputControlSuffixWrapper>
		);
	} else if ( !setting.disabled && mergeTagSuffix && !attributes.suffix ) {
		attributes.suffix = mergeTagSuffix;
	}

	if ( Object.keys( DATE_COMPONENTS ).includes( setting.type ) ) {
		const date = DATE_COMPONENTS[ setting.type as keyof typeof DATE_COMPONENTS ];
		const DateComponent = date.component;

		attributes.suffix = (
			<InputControlSuffixWrapper>
				<Dropdown
					popoverProps={ { placement: 'bottom-start' } }
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							onClick={ onToggle }
							aria-expanded={ isOpen }
							icon={ date.icon }
						/>
					) }
					renderContent={ () => (
						<DateComponent
							currentDate={ attributes.value }
							onChange={ ( newDate: string | null ) => {
								if ( newDate && date.format ) {
									console.log( newDate )
									newDate = format( date.format, newDate );
								}
								if ( attributes.onChange ) {
									// @ts-expect-error Event handler is not needed.
									attributes.onChange( newDate || '' );
								}
							} }
						/>
					) }
				/>
			</InputControlSuffixWrapper>
		);
	}

	if ( setting.disabled ) {
		attributes.readOnly = true;
		attributes.onFocus = ( e ) => e.target.select();

		if ( setting.value ) {
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
				{ attributes.prefix }
			</InputControlPrefixWrapper>
		);
	}

	return (
		<InputControl
			{ ...attributes }
			type={ inputTypes.includes( setting.type ) ? setting.type : 'text' }
			placeholder={ setting.placeholder ? setting.placeholder : '' }
			isPressEnterToChange={ isPressEnterToChange }
			__next40pxDefaultSize
		/>
	);
};
