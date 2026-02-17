/**
 * External dependencies
 */
import React, { useCallback } from 'react';

/**
 * Wordpress dependancies.
 */
import { RawHTML } from '@wordpress/element';
import {
	__experimentalNumberControl as NumberControl,
	__experimentalInputControlPrefixWrapper as InputControlPrefixWrapper,
	__experimentalInputControlSuffixWrapper as InputControlSuffixWrapper,
	__experimentalUnitControl as UnitControl,
	RadioControl,
	CheckboxControl,
	FormTokenField,
	Tip,
	__experimentalHStack as HStack,
	Button,
	Icon,
	Tooltip,
	ToggleControl,
} from '@wordpress/components';
import { tip } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Local dependancies.
 */
import {
	smartTag,
	getNestedValue,
	updateNestedValue,
	SelectOption,
	SelectSetting,
	MultiSelectSetting,
	MultiCheckbox,
	ComboboxSetting,
	ToggleGroupSetting,
	TinyMCESetting,
	InputSetting,
	TextareaSetting,
	ColorSetting,
	RepeaterControl,
	KeyValueRepeater,
	RemoteSettings,
	HorizontalSettings,
	TimeControl,
	ConditionalLogicEditor,
	useOptions,
	ComparisonCondition,
	checkConditions,
	LicenseActivation,
} from '.';

declare global {
	interface Window {
		hizzleWPHomeURL: string;
	}
}

export interface ISetting {
	/** The element to render */
	el?: string;

	/**
	 * The input type.
	 */
	type?: string;

	/**
	 * The field label.
	 */
	label: string;

	/**
	 * Help text.
	 */
	description?: string | React.ReactNode;

	/**
	 * Placeholder text.
	 */
	placeholder?: string;

	/**
	 * Conditional logic.
	 */
	conditions?: ComparisonCondition[];

	/**
	 * Conditional logic callback.
	 */
	condition?: ( saved: Record<string, unknown> ) => boolean;

	/**
	 * The default value.
	 */
	default?: any;

	/**
	 * Select options.
	 */
	options?: SelectOption[] | Record<string, string>;

	/**
	 * Custom attributes.
	 */
	customAttributes?: Record<string, unknown>;

	/**
	 * Whether the setting is disabled.
	 */
	disabled?: boolean;

	/**
	 * Reset on change.
	 */
	resetOnChange?: string[];

	/**
	 * Other options.
	 */
	[ key: string ]: any;
}

export interface SettingProps {
	/** The setting key. */
	settingKey: string;
	/** @deprecated The property to update on the object. */
	prop?: string;
	/** The object to update. */
	saved: Record<string, unknown>;
	/** The function to update the object. */
	setAttributes: ( attributes: Record<string, unknown> ) => void;
	/** The setting object. */
	setting: ISetting;
	/** The available smart tags. */
	availableSmartTags?: smartTag[] | undefined;
}

type defaultAttributesType = {
	/**
	 * The label.
	 */
	label: string | React.ReactNode;

	/**
	 * The help text.
	 */
	help?: string;

	/**
	 * The current value.
	 */
	value: any;

	/**
	 * The on change handler.
	 */
	onChange: ( value: any ) => void;

	[ key: string ]: any;
};

const addSuffix = ( suffix: any ) => {
	if ( !suffix ) {
		return undefined;
	}

	if ( typeof suffix === 'string' || suffix instanceof String ) {
		return (
			<InputControlSuffixWrapper>
				{ suffix }
			</InputControlSuffixWrapper>
		);
	}

	return suffix;
};

const addPrefix = ( prefix: any ) => {
	if ( !prefix ) {
		return undefined;
	}

	if ( typeof prefix === 'string' || prefix instanceof String ) {
		return (
			<InputControlPrefixWrapper>
				{ prefix }
			</InputControlPrefixWrapper>
		);
	}

	return prefix;
};

/**
 * Displays a single setting.
 *
 * @return {JSX.Element}
 */
export function Setting( {
	settingKey,
	setting,
	availableSmartTags = undefined,
	prop = undefined,
	saved,
	setAttributes,
}: SettingProps ) {
	const settingPath: string[] = (
		prop ? `${ prop }.${ settingKey }` : settingKey
	).split( '.' );
	const sanitize = setting.sanitize ? setting.sanitize : ( value ) => value;
	const theAvailableSmartTags =
		'trigger_settings' === prop ||
			false === setting.can_map ||
			false === setting.map_field ||
			!Array.isArray( availableSmartTags )
			? []
			: availableSmartTags;

	/**
	 * Updates an object setting.
	 *
	 * @param {mixed} value The new value.
	 */
	const updateSetting = useCallback(
		( value ) => {
			// Get the current value.
			const currentValue = getNestedValue( saved, settingPath );

			// If the value is the same, abort.
			if ( currentValue === value ) {
				return;
			}

			const newAttributes: { [ key: string ]: any } = {};

			if ( setting.resetOnChange ) {
				setting.resetOnChange.forEach( ( key ) => {
					const [ currentKey, ...remainingPath ] = key.split( '.' );

					if ( remainingPath.length === 0 ) {
						newAttributes[ currentKey ] = '';
					} else {
						newAttributes[ currentKey ] = updateNestedValue(
							( saved[ currentKey ] || {} ) as Record<
								string,
								unknown
							>,
							remainingPath,
							''
						);
					}
				} );
			}

			const [ currentKey, ...remainingPath ] = settingPath;

			if ( remainingPath.length === 0 ) {
				newAttributes[ currentKey ] = value;
			} else {
				newAttributes[ currentKey ] = updateNestedValue(
					( newAttributes[ currentKey ] ||
						saved[ currentKey ] ||
						{} ) as Record<string, unknown>,
					remainingPath,
					value
				);
			}

			return setAttributes( sanitize( newAttributes ) );
		},
		[ saved, settingPath, setAttributes, sanitize ]
	);

	// If we have options, convert from object to array.
	const options: SelectOption[] = useOptions( setting.options || [] );

	// Simple condition.
	if ( setting.if || setting.restrict ) {
		// Check if we're separating with period.
		const parts = setting.restrict
			? setting.restrict.split( '.' )
			: setting.if.split( '.' );
		if ( !getNestedValue( saved, parts ) ) {
			return null;
		}
	}

	// Key value conditions.
	if ( Array.isArray( setting.conditions ) && !checkConditions( setting.conditions, saved ) ) {
		return null;
	}

	// Abort early if condition is not met.
	if ( setting.condition && !setting.condition( saved ) ) {
		return null;
	}

	// Remote settings.
	if ( 'remote' === setting.el ) {
		return (
			<RemoteSettings
				settingKey={ settingKey }
				setting={ setting }
				availableSmartTags={ availableSmartTags }
				saved={ saved }
				prop={ prop }
				setAttributes={ setAttributes }
			/>
		);
	}

	// Horizontal settings.
	if ( 'horizontal' === setting.el ) {
		return (
			<HorizontalSettings
				settingKey={ settingKey }
				setting={ setting }
				saved={ saved }
				availableSmartTags={ availableSmartTags }
				prop={ prop }
				setAttributes={ setAttributes }
				settings={ setting.settings || {} }
			/>
		);
	}

	// Prepare the current value.
	let value = getNestedValue( saved, settingPath );

	// If undefined, use the default value.
	if ( value === undefined || setting.disabled ) {
		value = setting.default;
	}

	// Do we have a value?
	const hasValue = value !== undefined && value !== '' && value !== null;

	// Classname for the field.
	const className = `hizzlewp-component__field-${ settingKey }`;

	// Help text.
	const help =
		typeof setting.description === 'string' ? (
			<span dangerouslySetInnerHTML={ { __html: setting.description } } />
		) : (
			setting.description
		);

	// Default attributes.
	const customAttributes = setting.customAttributes
		? setting.customAttributes
		: {};
	const defaultAttributes: defaultAttributesType = {
		label: typeof setting.label === 'string' ? (
			<span dangerouslySetInnerHTML={ { __html: setting.label } } />
		) : (
			setting.label
		),
		value: hasValue ? value : '',
		onChange: updateSetting,
		className,
		help: help as string,
		...customAttributes,
	};

	// Maybe add tooltip to the label.
	if ( setting.tooltip ) {
		defaultAttributes.label = (
			<HStack justify="flex-start">
				<span>{ setting.label }</span>
				<Tooltip delay={ 0 } placement="top" text={ setting.tooltip }>
					<span>
						<Icon icon="info" style={ { color: '#454545' } } />
					</span>
				</Tooltip>
			</HStack>
		);
	}

	// If we have setting.type but no setting.el, set setting.el to setting.type.
	if ( setting.type && !setting.el ) {
		setting.el = setting.type;

		if (
			[
				'toggle',
				'switch',
				'checkbox',
				'checkbox_alt',
				'checkbox_real',
				'text',
				'number',
				'email',
				'tel',
				'date',
				'color',
				'image',
			].includes( setting.type )
		) {
			setting.el = 'input';
		}
	}

	// Displays a button.
	if ( setting.el === 'button' ) {
		return (
			<div>
				<Button { ...( setting.buttonProps || {} ) } />
			</div>
		);
	}

	// Toggle group.
	if ( setting.el === 'toggle_group' ) {
		return <ToggleGroupSetting { ...defaultAttributes } label={ defaultAttributes.label as string } options={ options } />;
	}

	// Display select control.
	if ( setting.el === 'select' ) {
		// Multi select.
		if ( setting.multiple ) {
			return (
				<MultiSelectSetting { ...defaultAttributes } label={ defaultAttributes.label as string } options={ options } />
			);
		}

		// Add a placeholder option if there's no option with an empty value.
		if ( !options.find( ( option ) => option?.value === '' ) ) {
			options.unshift( {
				label: setting.placeholder
					? setting.placeholder
					: __( 'Select an option', 'newsletter-optin-box' ),
				value: '',
				disabled: !setting.canSelectPlaceholder,
			} );
		}

		return (
			<SelectSetting
				{ ...defaultAttributes }
				availableSmartTags={ theAvailableSmartTags }
				options={ options }
				__nextHasNoMarginBottom
				__next40pxDefaultSize
			/>
		);
	}

	// Display combobox control.
	if ( setting.el === 'combobox' ) {
		// Ensure all option values are strings
		const stringOptions = options.map( ( option ) => ( {
			...option,
			value: String( option.value ),
		} ) );

		// Ensure current value is a string
		const stringValue =
			0 === defaultAttributes.value
				? '0'
				: defaultAttributes.value
					? String( defaultAttributes.value )
					: '';
		defaultAttributes.value = stringValue;

		return (
			<ComboboxSetting
				{ ...defaultAttributes }
				options={ stringOptions }
				allowReset={ setting.canSelectPlaceholder }
				availableSmartTags={ theAvailableSmartTags }
				__nextHasNoMarginBottom
				__next40pxDefaultSize
			/>
		);
	}

	// Display a form token field.
	if ( setting.el === 'form_token' || setting.el === 'token' ) {
		return (
			<FormTokenField
				{ ...defaultAttributes }
				label={ defaultAttributes.label as string }
				value={
					Array.isArray( defaultAttributes.value )
						? defaultAttributes.value
						: []
				}
				suggestions={
					Array.isArray( setting.suggestions )
						? setting.suggestions
						: []
				}
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				__experimentalShowHowTo={ false }
				__experimentalExpandOnFocus={ true }
				tokenizeOnBlur={ true }
			/>
		);
	}

	// Displays a multi-checkbox control.
	if (
		setting.el === 'multi_checkbox' ||
		setting.el === 'multi_checkbox_alt'
	) {
		return <MultiCheckbox { ...defaultAttributes } __nextHasNoMarginBottom options={ options } />;
	}

	// Conditional logic editor.
	if ( setting.el === 'conditional_logic' ) {
		return (
			<ConditionalLogicEditor
				{ ...defaultAttributes }
				availableSmartTags={ availableSmartTags }
				comparisons={ setting.comparisons }
				toggleText={ setting.toggle_text }
				inModal={ setting.in_modal }
				ifOptions={ setting.if_options }
			/>
		);
	}

	// License activation.
	if ( setting.el === 'license_activation' ) {
		return (
			<LicenseActivation
				{ ...defaultAttributes }
				currentLicenseKey={ setting.license_key }
				homeURL={ window.hizzleWPHomeURL }
				hostName={ setting.hostName }
				plugin={ setting.plugin }
				manageURL={ setting.manageURL }
				purchaseURL={ setting.purchaseURL }
				prefix={ setting.prefix }
			/>
		);
	}

	// Time input field.
	if ( setting.el === 'time' ) {
		return <TimeControl { ...defaultAttributes } />;
	}

	if (
		'color' === setting.el ||
		( setting.el === 'input' && 'color' === setting.type )
	) {
		return <ColorSetting { ...defaultAttributes } __nextHasNoMarginBottom />;
	}

	// Unit control.
	if ( setting.el === 'unit' ) {
		return (
			<UnitControl
				labelPosition="edge"
				__unstableInputWidth="80px"
				__next40pxDefaultSize
				isPressEnterToChange
				{ ...defaultAttributes }
				prefix={ addPrefix( defaultAttributes.prefix ) }
			/>
		);
	}

	// Radio.
	if ( setting.el === 'radio' ) {
		const { value: radioValue, ...radioOptions } = defaultAttributes;
		return (
			<RadioControl
				{ ...radioOptions }
				selected={ radioValue }
				options={ options }
			/>
		);
	}

	// Text input field.
	if ( setting.el === 'input' ) {
		// Checkbox or toggle.
		if (
			setting.type &&
			[ 'toggle', 'switch', 'checkbox', 'checkbox_alt' ].includes(
				setting.type
			)
		) {
			return (
				<ToggleControl
					{ ...defaultAttributes }
					checked={ hasValue ? !!value : false }
					__nextHasNoMarginBottom
				/>
			);
		}

		if ( setting.type && [ 'checkbox_real' ].includes( setting.type ) ) {
			return (
				<CheckboxControl
					{ ...defaultAttributes }
					label={ defaultAttributes.label as string }
					checked={ hasValue ? !!value : false }
					__nextHasNoMarginBottom
				/>
			);
		}

		// Number.
		if ( 'number' === setting.type ) {

			// Singular / Plural suffix.
			if ( Array.isArray( defaultAttributes.suffix ) ) {
				defaultAttributes.suffix =
					1 === value || '1' === value
						? addSuffix( defaultAttributes.suffix[ 0 ] )
						: addSuffix( defaultAttributes.suffix[ 1 ] );
			} else {
				defaultAttributes.suffix = addSuffix( defaultAttributes.suffix );
			}

			// Singular / Plural prefix.
			if ( Array.isArray( defaultAttributes.prefix ) ) {
				defaultAttributes.prefix =
					1 === value || '1' === value
						? addPrefix( defaultAttributes.prefix[ 0 ] )
						: addPrefix( defaultAttributes.prefix[ 1 ] );
			} else {
				defaultAttributes.prefix = addPrefix( defaultAttributes.prefix );
			}

			return (
				<NumberControl
					isDragEnabled={ false }
					isShiftStepEnabled={ false }
					{ ...defaultAttributes }
					placeholder={ setting.placeholder ? setting.placeholder : '' }
					__next40pxDefaultSize
				/>
			);
		}

		// Image upload.
		if ( 'image' === setting.type && window.wp?.media ) {
			defaultAttributes.suffix = (
				<Button
					onClick={ () => {
						// Init the media uploader script.
						const image = window.wp
							.media( {
								title: __(
									'Upload Image',
									'newsletter-optin-box'
								),
								multiple: false,
								library: {
									type: 'image',
								},
							} )

							// The open the media uploader modal.
							.open()

							// Update the associated key with the selected image's url
							.on( 'select', () => {
								const uploaded_image = image
									.state()
									.get( 'selection' )
									.first();
								updateSetting(
									uploaded_image.toJSON().sizes[ 'full' ].url
								);
							} );
					} }
					icon="upload"
					label={ __( 'Upload Image', 'newsletter-optin-box' ) }
					showTooltip
				/>
			);
		}

		return (
			<InputSetting
				{ ...defaultAttributes }
				setting={ setting }
				availableSmartTags={ theAvailableSmartTags }
			/>
		);
	}

	// Textarea field.
	if ( setting.el === 'textarea' ) {
		return (
			<TextareaSetting
				{ ...defaultAttributes }
				setting={ setting }
				placeholder={ setting.placeholder ? setting.placeholder : '' }
				availableSmartTags={ theAvailableSmartTags }
			/>
		);
	}

	// TinyMCE editor.
	if ( setting.el === 'tinymce' ) {
		return <TinyMCESetting { ...defaultAttributes } />;
	}

	// Paragraph.
	if ( setting.el === 'paragraph' ) {
		return (
			<div className={ className }>
				{ setting.raw ? (
					<div className="components-tip">
						<Icon icon={ tip } />
						<RawHTML>{ setting.content }</RawHTML>
					</div>
				) : (
					<Tip>{ setting.content }</Tip>
				) }
			</div>
		);
	}

	// Heading.
	if ( setting.el === 'hero' ) {
		return (
			<div className={ className }>
				<h3>{ setting.content }</h3>
			</div>
		);
	}

	// Key value repeater.
	if (
		setting.el === 'key_value_repeater' ||
		setting.el === 'webhook_key_value_repeater'
	) {
		return (
			<KeyValueRepeater
				{ ...defaultAttributes }
				setting={ setting }
				availableSmartTags={ theAvailableSmartTags }
				__nextHasNoMarginBottom
			/>
		);
	}

	// Dynamic repeater, will eventually replace key value repeater.
	if ( setting.el === 'repeater' ) {
		return (
			<RepeaterControl
				{ ...defaultAttributes }
				__nextHasNoMarginBottom
				availableSmartTags={ theAvailableSmartTags }
			/>
		);
	}

	console.log( setting );
	return settingKey;
}
