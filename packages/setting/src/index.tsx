/**
 * Wordpress dependancies.
 */
import { TextareaControl, SelectControl, ToggleControl, Tip } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';
import type { FC } from 'react';

/**
 * Internal dependencies
 */
import InputSetting from './input-setting';
import KeyValueRepeater from './key-value-repeater';
import ConditionalLogicEditor from './conditional-logic-editor';
type Setting = import( './types' ).Setting;
type MergeTagsProps = import( './types' ).MergeTagsProps;
type Condition = import( './types' ).Condition;

/**
 * Compares two values using the specified operator.
 *
 * @param {string} operator The operator to use.
 * @param {any} value1 The first value.
 * @param {any} value2 The second value.
 * @return {boolean} Whether the condition is met.
 */
const compare = ( operator: "=" | "!=" | ">" | "<" | ">=" | "<=", value1: any, value2: any ): boolean => {

	switch ( operator ) {
		case '=':
			return value1 == value2;
		case '!=':
			return value1 != value2;
		case '>':
			return value1 > value2;
		case '<':
			return value1 < value2;
		case '>=':
			return value1 >= value2;
		case '<=':
			return value1 <= value2;
	}

	return false;
}

/**
 * Checks if a setting is visible.
 *
 * @param {Condition} conditions The condition to check. You can use . to check nested properties.
 * @param {boolean} ifOR Whether to use OR or AND.
 * @param {Object} savedObject The saved object.
 * @return {boolean} Whether the setting is visible.
 */
const isVisible = ( conditions: Condition[], ifOR: boolean = false, savedObject: { [ key: string ]: any } ): boolean => {

	const isConditionMet = ( condition: Condition ) => {

		// Get the value.
		let value = {...savedObject};

		// Loop through the condition.
		const keys = condition.key.split( '.' );
		for ( const key of keys ) {

			// If the key is not set, return false.
			if ( value[ key ] === undefined ) {
				return compare( condition.operator, undefined, condition.value );
			}

			// Update the value.
			value = value[ key ];
		}

		return compare( condition.operator, value, condition.value );
	};

	if ( ifOR ) {
		return conditions.some( isConditionMet );
	}

	return conditions.every( isConditionMet );
}

/**
 * Field props.
 */
type settingProps = MergeTagsProps & {

	/**
	 * The setting key.
	 */
	settingKey: string;

	/**
	 * The setting object.
	 */
	setting: Setting;

	/**
	 * The saved object.
	 */
	saved: {
		[ key: string ]: any;
	}

	/**
	 * The property to update on the object.
	 *
	 * Usefull for nested objects.
	 */
	prop?: string;

	/**
	 * The function to update the object attributes.
	 */
	setAttributes: (attributes: { [ key: string ]: any }) => void;
}

/**
 * Displays a single setting.
 *
 */
const SettingControl: FC<settingProps> = ({ settingKey, setting, availableSmartTags, prop, saved, setAttributes }) => {

	/**
	 * Updates an object setting.
	 *
	 * @param {mixed} value The new value.
	 */
	const updateSetting = useCallback( ( value: any ) => {

		// If this is a root setting, update the object directly.
		if ( ! prop ) {
			return setAttributes({ [ settingKey ]: value });
		}

		// If this is a nested setting, update the object directly.
		const oldValue = saved[ prop ] ? saved[ prop ] : {};
		const newValue = {
			[ prop ]: {
				...oldValue,
				[ settingKey ]: value,
			},
		};

		setAttributes( newValue );
	}, [ settingKey, prop, saved, setAttributes ] );

	// Simple conditions.
	if ( setting.if && ! isVisible( setting.if, setting.ifOR, saved ) ) {
		return null;
	}

	// Abort early if condition is not met.
	if ( setting.condition && ! setting.condition( saved ) ) {
		return null;
	}

	// Prepare the current value.
	let value = saved[ settingKey ];

	// If this is a nested setting, get the value from the nested object.
	if ( prop ) {
		value = saved[ prop ] ? saved[ prop ][ settingKey ] : undefined;
	}

	// If undefined, use the default value.
	if ( value === undefined || setting.disabled ) {
		value = setting.default;
	}

	// Do we have a value?
	const hasValue = value !== undefined && value !== '' && value !== null;

	// If we have options, convert from object to array.
	const options = setting.options ? Object.entries( setting.options ).map( ([ key, label ]) => ({ value: key, label, disabled: false }) ) : [];
	
	// Classname for the field.
	const className = setting.fullWidth ? `hizzle-component__field hizzle-component__field-${settingKey}` : `hizzle-component__field-lg hizzle-component__field-${settingKey}`;

	// Help text.
	const help = setting.description ? <span dangerouslySetInnerHTML={ { __html: setting.description } } /> : '';

	// Default attributes.
	const defaultAttributes = {
		label: setting.label,
		value: hasValue ? value : '',
		onChange: updateSetting,
		className: `${className}`,
		help: help,
	}

	// Display select control.
	if ( setting.el === 'select' ) {

		// If we have a placeholder, add it to the options.
		if ( setting.placeholder ) {
			options.unshift({
				label: setting.placeholder,
				value: '',
				disabled: true,
			});
		}

		return <SelectControl {...defaultAttributes} options={options}  __nextHasNoMarginBottom __next36pxDefaultSize />;
	}

	// Conditional logic editor.
	if ( setting.el === 'conditional_logic' ) {
		return (
			<ConditionalLogicEditor
				{...defaultAttributes}
				availableSmartTags={availableSmartTags}
				comparisons={setting.comparisons}
				toggleText={setting.toggle_text}
			/>
		);
	}

	// Text input field.
	if ( setting.el === 'input' ) {

		// Checkbox or toggle.
		if ( setting.type && ['toggle', 'switch', 'checkbox', 'checkbox_alt'].includes( setting.type ) ) {
			return (
				<ToggleControl
					{...defaultAttributes}
					checked={hasValue ? value : false}
					onChange={(newValue) => {
						updateSetting(newValue);
					}}
				/>
			);
		}

		return (
			<InputSetting
				{...defaultAttributes}
				setting={setting}
				availableSmartTags={ availableSmartTags }
				onMergeTagClick={updateSetting}
			/>
		);
	}

	// Textarea field.
	if ( setting.el === 'textarea' ) {
		return (
			<TextareaControl
				{...defaultAttributes}
				placeholder={setting.placeholder ? setting.placeholder : ''}
				__nextHasNoMarginBottom
			/>
		);
	}

	// Paragraph.
	if ( setting.el === 'paragraph' ) {
		return (
			<div className={className}>
				<Tip>
					{setting.content}
				</Tip>
			</div>
		);
	}

	// Heading.
	if ( setting.el === 'hero' ) {
		return (
			<div className={className}>
				<h3>{setting.content}</h3>
			</div>
		);
	}

	// Key value repeater.
	if ( setting.el === 'key_value_repeater' || setting.el === 'webhook_key_value_repeater' ) {
		return (
			<KeyValueRepeater
				{...defaultAttributes}
				setting={setting}
				availableSmartTags={availableSmartTags}
			/>
		);
	}

	return settingKey;
}

export default SettingControl;
