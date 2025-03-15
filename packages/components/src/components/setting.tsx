/**
 * External dependencies
 */
import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';

/**
 * Wordpress dependancies.
 */
import { RawHTML } from '@wordpress/element';
import {
	__experimentalNumberControl as NumberControl,
	__experimentalInputControl as InputControl,
	__experimentalInputControlPrefixWrapper as InputControlPrefixWrapper,
	__experimentalInputControlSuffixWrapper as InputControlSuffixWrapper,
	__experimentalUnitControl as UnitControl,
	Notice,
	BaseControl,
	useBaseControlProps,
	CheckboxControl,
	FormTokenField,
	Spinner,
	Tip,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalText as Text,
	CardHeader,
	CardBody,
	Card,
	Modal,
	Flex,
	FlexBlock,
	FlexItem,
} from '@wordpress/components';
import { next, lock, calendar, tip } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import { useInstanceId, debounce } from '@wordpress/compose';
import { F10, isKeyboardEvent } from '@wordpress/keycodes';
import { format } from '@wordpress/date';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';


/**
 * Local dependancies.
 */
import { TimeControl } from './time';
import ConditionalLogicEditor from './conditional-logic-editor';
import { compare } from './operators';
import { smartTag, condition as settingCondition } from './automation-rules';

/**
 * Input types.
 */
const inputTypes = [ 'number', 'search', 'email', 'password', 'tel', 'url', 'date' ];

/**
 * Displays remote settings.
 *
 * @return {JSX.Element}
 */
function RemoteSettings( { setting, saved, settingKey, ...extra }: SettingProps ) {
	const [ loading, setLoading ] = useState( false );
	const [ settings, setSettings ] = useState( {} );
	const [ error, setError ] = useState( null );

	const remoteURL = useMemo( () => {
		if ( !setting.rest_route ) {
			return '';
		}

		const args = Object.entries( setting.rest_args || {} ).reduce( ( acc, [ key, value ] ) => {
			acc[ key ] = 'string' === typeof value && value.startsWith( '!' ) ? getNestedValue( saved, value.slice( 1 ) ) : value;
			return acc;
		}, {} );

		return addQueryArgs( setting.rest_route, args );
	}, [ setting.rest_route, setting.rest_args, saved ] );

	useEffect( () => {
		if ( !remoteURL ) {
			return;
		}

		setLoading( true );
		setError( null );

		apiFetch( {
			path: remoteURL,
		} ).then( ( data ) => {
			setSettings( data );
		} ).catch( ( error ) => {
			setSettings( {} );
			setError( error.message || 'An error occurred while fetching settings.' );
			console.error( error );
		} ).finally( () => {
			setLoading( false );
		} );

	}, [ remoteURL ] );

	if ( !remoteURL ) {
		return null;
	}

	if ( loading ) {
		return <Spinner />;
	}

	if ( error ) {
		return <Notice status="error">{ error }</Notice>;
	}

	return (
		<>
			{ Object.keys( settings ).map( ( settingKey ) => (
				<Setting
					key={ settingKey }
					settingKey={ settingKey }
					saved={ saved }
					setting={ settings[ settingKey ] }
					{ ...extra }
				/>
			) ) }
		</>
	);
}

/**
 * Key value repeater fields.
 */
const keyValueRepeaterFields = [
	{
		id: 'key',
		label: __( 'Key', 'noptin-addons-pack' ),
		type: 'text',
	},
	{
		id: 'value',
		label: __( 'Value', 'noptin-addons-pack' ),
		type: 'text',
	},
];

/**
 * Returns a merge tag's value.
 *
 * @param {Object} smartTag The smart tag.
 * @return {Array}
 */
function getMergeTagValue( smartTag ) {

	if ( smartTag.example ) {
		return smartTag.example;
	}

	if ( !smartTag.default ) {
		return `${ smartTag.smart_tag }`;
	}

	return `${ smartTag.smart_tag } default="${ smartTag.default }"`;
}

interface RepeaterKey {
	from: string;
	to: string;
	newOnly: boolean;
	maxLength: number;
	display: string;
}

/**
 * Displays a repeater setting.
 *
 * @param {Object} props
 * @param {Function} props.attributes The attributes
 * @param {Object} props.setting The setting object.
 * @param {Array} props.availableSmartTags The available smart tags.
 * @return {JSX.Element}
 */
function RepeaterControl( { availableSmartTags, value, onChange, button, fields, openModal, prepend, disable, disabled, onDisable, cardProps, repeaterKey, id, defaultItem, ...attributes } ) {

	const [ isOpen, setIsOpen ] = useState( false );

	// Ensure the value is an array.
	const theValue = Array.isArray( value ) ? value : [];

	// The base props.
	const theId = id || useInstanceId( RepeaterControl, 'noptin-repeater' );
	const { baseControlProps, controlProps } = useBaseControlProps( { ...attributes, id: theId } );

	// Prepare the default value.
	const defaultValue = defaultItem || {};

	if ( repeaterKey?.newOnly ) {
		defaultValue[ 'new' ] = true;
	}

	if ( !fields ) {
		console.warn( 'No fields provided to repeater control.' );
		return null;
	}

	Object.keys( fields ).forEach( ( fieldKey ) => {
		if ( undefined !== fields[ fieldKey ].default ) {
			defaultValue[ fieldKey ] = fields[ fieldKey ].default;
		}
	} );

	const showInModal = !!openModal;
	const keyOrIndex = ( item, index ) => item.key ? item.key : ( repeaterKey?.to && getNestedValue( item, repeaterKey.to ) ? getNestedValue( item, repeaterKey.to ) : index );

	// The actual fields.
	const el = (
		<VStack>
			{ prepend }
			{ theValue.map( ( item, index ) => (
				<Card
					size="small"
					className="noptin-no-shadow"
					id={ `${ theId }__item-${ keyOrIndex( item, index ) }` }
					data-index={ index }
					borderBottom
					borderLeft
					borderRight
					borderTop
					{ ...( cardProps || {} ) }
					key={ keyOrIndex( item, index ) }
				>
					<RepeaterItem
						id={ `${ theId }__item-${ keyOrIndex( item, index ) }` }
						fields={ fields }
						value={ item }
						availableSmartTags={ availableSmartTags }
						onChange={ ( newValue ) => {
							let theNewValue = { ...newValue };

							if ( repeaterKey?.to && repeaterKey.from && getNestedValue( theNewValue, repeaterKey.from ) ) {
								if ( !repeaterKey.newOnly || theNewValue[ 'new' ] ) {

									// Generate a merge tag from the label
									const mergeTag = getNestedValue( theNewValue, repeaterKey.from ).toString().trim().toLowerCase().replace( /[^a-z0-9]+/g, '_' );

									// Limit to 64 characters.
									theNewValue = updateNestedValue( theNewValue, repeaterKey.to, mergeTag.substring( 0, repeaterKey.maxLength || 64 ) );

									// Ensure the merge tag is unique.
									if ( theValue.find( ( value, valueIndex ) => index !== valueIndex && getNestedValue( value, repeaterKey.to ) === getNestedValue( theNewValue, repeaterKey.to ) ) ) {
										theNewValue = updateNestedValue( theNewValue, repeaterKey.to, `${ getNestedValue( theNewValue, repeaterKey.to ) }_${ index }` );
									}
								}

							}

							const newItems = [ ...theValue ];
							newItems[ index ] = theNewValue;
							onChange( newItems );
						} }
						onDelete={ () => {
							const newItems = [ ...theValue ];
							newItems.splice( index, 1 );
							onChange( newItems );
						} }
						onMoveUp={ index > 0 ? () => {
							const newItems = [ ...theValue ];
							const item = newItems[ index ];
							newItems.splice( index, 1 );
							newItems.splice( index - 1, 0, item );
							onChange( newItems );
						} : null }
						onMoveDown={ index < theValue.length - 1 ? () => {
							const newItems = [ ...theValue ];
							const item = newItems[ index ];
							newItems.splice( index, 1 );
							newItems.splice( index + 1, 0, item );
							onChange( newItems );
						} : null }
						repeaterKey={ repeaterKey }
					/>
				</Card>
			) ) }
			<HStack>
				<Button
					onClick={ () => {
						const newValue = [ ...theValue ];
						const timestamp = Date.now().toString( 36 );
						const randomStr = Math.random().toString( 36 ).substring( 2, 8 );
						newValue.push( { key: `${ timestamp }_${ randomStr }`, ...defaultValue } );
						onChange( newValue );
					} }
					variant="primary"
				>
					{ button || __( 'Add Item', 'newsletter-optin-box' ) }
				</Button>
				{ showInModal && (
					<Button
						onClick={ () => setIsOpen( false ) }
						variant="secondary"
					>
						{ __( 'Go Back', 'newsletter-optin-box' ) }
					</Button>
				) }
			</HStack>
		</VStack>
	);

	const showSettings = !disable || !disabled;

	// Render the control.
	return (
		<BaseControl { ...baseControlProps }>
			<div { ...controlProps }>
				{ showInModal && (
					<VStack>
						{ disable && (
							<ToggleControl
								label={ disable }
								checked={ disabled }
								onChange={ ( newValue ) => {
									if ( onDisable ) {
										onDisable( newValue );
									}
								} }
								__nextHasNoMarginBottom
							/>
						) }
						{ showSettings && (
							<>
								<Button
									onClick={ () => setIsOpen( true ) }
									variant="secondary"
								>
									{ openModal || __( 'Set Items', 'newsletter-optin-box' ) }
								</Button>
								{ isOpen && (
									<Modal
										title={ attributes.label || openModal || __( 'Set Items', 'newsletter-optin-box' ) }
										onRequestClose={ () => setIsOpen( false ) }
										size="medium"
									>
										{ el }
									</Modal>
								) }
							</>
						) }
					</VStack>
				) }
				{ !showInModal && el }
			</div>
		</BaseControl>
	);
}

/**
 * Displays a single item in the query repeater.
 *
 * @param {Object} props
 * @param {Function} props.onChange The on change handler
 * @param {Function} props.onDelete The on delete handler
 * @param {String} props.value The current value.
 * @param {Object} props.fields The available fields object.
 * @param {Array} props.availableSmartTags The available smart tags.
 * @param {RepeaterKey} props.repeaterKey The repeater key.
 * @return {JSX.Element}
 */
function RepeaterItem( { fields, availableSmartTags, value, onChange, repeaterKey, onDelete, onMoveUp, onMoveDown, id } ) {
	const [ isOpen, setIsOpen ] = useState( !repeaterKey?.from );
	const toggle = useCallback( () => { setIsOpen( !isOpen ), [ isOpen ] }, [ isOpen ] );
	const hideBody = !isOpen && repeaterKey?.from;
	let header: React.ReactNode = null;

	if ( repeaterKey ) {
		const badge = ( false !== repeaterKey.display && repeaterKey.to && value?.[ repeaterKey.to ] ) ? (
			<code>
				{ sprintf( repeaterKey.display || '%s', value?.[ repeaterKey.to ] ) }
			</code>
		) : null;

		const style = {
			paddingLeft: 16,
			paddingRight: 16,
			height: 48,
		}

		const cardLabel = getNestedValue( value, repeaterKey.from ) || getNestedValue( value, repeaterKey.fallback );
		header = (
			<CardHeader style={ { padding: 0 } }>
				<Flex
					as={ Button }
					onClick={ toggle }
					style={ style }
					aria-controls={ `${ id }__body` }
					aria-expanded={ !hideBody }
					type="button"
				>
					<HStack as={ FlexBlock }>
						<Text weight={ 600 }>
							{ cardLabel || __( '(new)', 'newsletter-optin-box' ) }
						</Text>
					</HStack>
					<FlexItem>
						<HStack>
							{ badge }
							<Icon icon={ isOpen ? 'arrow-up-alt2' : 'arrow-down-alt2' } />
						</HStack>
					</FlexItem>
				</Flex>
			</CardHeader>
		);
	}

	return (
		<>
			{ header }
			{ !hideBody && (
				<CardBody id={ `${ id }__body` } hidden={ hideBody }>
					<VStack>
						{ Object.keys( fields ).map( ( fieldKey ) => (
							<Setting
								key={ fieldKey }
								settingKey={ fieldKey }
								availableSmartTags={ availableSmartTags }
								setting={ fields[ fieldKey ] }
								saved={ value }
								setAttributes={ ( attributes ) => {
									onChange( { ...value, ...attributes } );
								} }
							/>
						) ) }
						<HStack className="noptin-repeater-item__actions" justify="flex-start">
							{ !value?.predefined && (
								<Button
									variant="link"
									onClick={ onDelete }
									text={ __( 'Remove Item', 'newsletter-optin-box' ) }
									isDestructive
								/>
							) }
							{ onMoveUp && (
								<Button
									onClick={ onMoveUp }
									icon="arrow-up-alt"
									text={ __( 'Move Up', 'newsletter-optin-box' ) }
									size="small"
									iconSize={ 16 }
								/>
							) }
							{ onMoveDown && (
								<Button
									onClick={ onMoveDown }
									icon="arrow-down-alt"
									text={ __( 'Move Down', 'newsletter-optin-box' ) }
									size="small"
									iconSize={ 16 }
								/>
							) }
						</HStack>
					</VStack>
				</CardBody>
			) }
		</>
	);
}

/**
 * Displays a key value repeater setting.
 *
 * @param {Object} props
 * @param {Function} props.attributes The attributes
 * @param {Object} props.setting The setting object.
 * @param {Array} props.availableSmartTags The available smart tags.
 * @return {JSX.Element}
 */
function KeyValueRepeater( { setting, availableSmartTags, value, onChange, ...attributes } ) {

	// The base props.
	const { baseControlProps, controlProps } = useBaseControlProps( attributes );

	// Ensure the value is an array.
	if ( !Array.isArray( value ) ) {
		value = [];
	}

	// Displays a single Item.
	const Item = useCallback( ( { item, index } ) => {
		return (
			<Flex className="noptin-repeater-item" wrap>

				{ keyValueRepeaterFields.map( ( field, fieldIndex ) => (
					<KeyValueRepeaterField
						key={ fieldIndex }
						availableSmartTags={ availableSmartTags }
						field={ field }
						value={ item[ field.id ] === undefined ? '' : item[ field.id ] }
						onChange={ ( newValue ) => {
							const newItems = [ ...value ];
							newItems[ index ][ field.id ] = newValue;
							onChange( newItems );
						} }
					/>
				) ) }

				<FlexItem>
					<Button
						icon="trash"
						variant="tertiary"
						className="noptin-component__field"
						label={ __( 'Delete', 'noptin-addons-pack' ) }
						showTooltip
						onClick={ () => {
							const newValue = [ ...value ];
							newValue.splice( index, 1 );
							onChange( newValue );
						} }
						isDestructive
					/>
				</FlexItem>
			</Flex>
		);
	}, [ value, onChange ] );

	// Render the control.
	return (
		<BaseControl { ...baseControlProps }>

			<div { ...controlProps }>
				{ value.map( ( item, index ) => <Item key={ index } item={ item } index={ index } /> ) }
				<Button
					onClick={ () => {
						const newValue = [ ...value ];
						newValue.push( {} );
						onChange( newValue );
					} }
					variant="secondary"
				>
					{ setting.add_field ? setting.add_field : __( 'Add', 'newsletter-optin-box' ) }
				</Button>
			</div>

		</BaseControl>
	);
}

/**
 * Displays a key value repeater setting field.
 *
 * @param {Object} props
 * @param {Function} props.onChange The on change handler
 * @param {String} props.value The current value.
 * @param {Object} props.field The field object.
 * @param {Array} props.availableSmartTags The available smart tags.
 * @return {JSX.Element}
 */
function KeyValueRepeaterField( { field, availableSmartTags, value, onChange } ) {

	// On add merge tag...
	const onMergeTagClick = useCallback( ( mergeTag ) => {

		// Add the merge tag to the value.
		if ( onChange ) {
			onChange( value ? `${ value } ${ mergeTag }`.trim() : mergeTag );
		}
	}, [ value, onChange ] );

	// Merge tags.
	const suffix = useMergeTags( { availableSmartTags, onMergeTagClick } );

	return (
		<FlexBlock>
			<InputControl
				label={ field.label }
				type={ field.type }
				value={ value }
				placeholder={ sprintf( __( 'Enter %s', 'noptin-addons-pack' ), field.label ) }
				className="noptin-component__field noptin-condition-field"
				suffix={ suffix }
				onChange={ onChange }
				isPressEnterToChange
				__next40pxDefaultSize
			/>
		</FlexBlock>
	);
}

/**
 * Displays a multi-checkbox setting.
 *
 * @param {Object} props
 * @param {Function} props.attributes The attributes
 * @param {Object} props.setting The setting object.
 * @return {JSX.Element}
 */
function MultiCheckbox( { setting, value, options, onChange, ...attributes } ) {

	// The base props.
	const { baseControlProps, controlProps } = useBaseControlProps( attributes );

	// Ensure the value is an array.
	if ( !Array.isArray( value ) ) {
		value = [];
	}

	// Render the control.
	return (
		<BaseControl { ...baseControlProps }>

			<div { ...controlProps }>
				{ options.map( ( option, index ) => (
					<CheckboxControl
						key={ index }
						label={ option.label }
						checked={ value.includes( option.value ) }
						onChange={ ( newValue ) => {
							if ( newValue ) {
								onChange( [ ...value, option.value ] );
							} else {
								onChange( value.filter( ( v ) => v !== option.value ) );
							}
						} }
					/>
				) ) }
			</div>

		</BaseControl>
	);
}

/**
 * Displays a TinyMCE editor.
 *
 * Users have to manually add the TinyMCE script to their page.
 */
function TinyMCESetting( { value, onChange, id, ...attributes } ) {

	// `useBaseControlProps` is a convenience hook to get the props for the `BaseControl`
	// and the inner control itself. Namely, it takes care of generating a unique `id`,
	// properly associating it with the `label` and `help` elements.
	const { baseControlProps, controlProps } = useBaseControlProps( {
		...attributes,
		id,
		__nextHasNoMarginBottom: true,
	} );

	const { wp, tinymce } = window;

	const didMount = useRef<boolean>( false );
	const elRef = useRef<HTMLDivElement>( null );

	// Reinitialize the editor when clicking on the tinyMCE tab.
	// Fixes a bug where the editor content resets when switching between visual and text mode.
	useEffect( () => {
		if ( !didMount.current ) {
			return;
		}

		const setContent = ( e ) => {
			if ( e?.target?.classList?.contains( 'wp-switch-editor' ) ) {
				setTimeout( () => {
					const editor = tinymce?.get( id );
					if ( editor ) {
						editor.setContent( value || '' );
						editor._lastChange = value;
					}
				}, 50 );
			}
		}

		elRef.current?.addEventListener( 'click', setContent );

		return () => {
			elRef.current?.removeEventListener( 'click', setContent );
		}
	}, [ elRef.current, value ] );

	useEffect( () => {
		if ( !didMount.current ) {
			return;
		}

		const editor = tinymce?.get( id );

		if ( editor && editor._lastChange !== value ) {
			//editor.setContent( value || '' );
			//editor._lastChange = value;
		}
	}, [ value ] );

	useEffect( () => {

		tinymce?.execCommand( 'mceRemoveEditor', true, id );

		function initialize() {
			wp.oldEditor.initialize( id, {
				tinymce: window.tinymce ? {
					content_css: false,
					theme_advanced_buttons: 'bold,italic,underline,|,bullist,numlist,blockquote,|,link,unlink,|,spellchecker,fullscreen,|,formatselect,styleselect',
					drag_drop_upload: true,
					toolbar1: 'formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,spellchecker,wp_adv,dfw',
					toolbar2: 'strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help',
					min_height: 400,
					wpautop: false,
					setup( editor ) {

						if ( value ) {
							editor.on( 'loadContent', () => editor.setContent( value ) );
						}

						editor.on( 'blur', () => {
							onChange( editor.getContent() );

							return false;
						} );

						const debouncedOnChange = debounce( () => {
							const value = editor.getContent();

							if ( value !== editor._lastChange ) {
								editor._lastChange = value;
								onChange( value );
							}
						}, 250 );
						editor.on( 'Paste Change input Undo Redo', debouncedOnChange );

						// We need to cancel the debounce call because when we remove
						// the editor (onUnmount) this callback is executed in
						// another tick. This results in setting the content to empty.
						editor.on( 'remove', debouncedOnChange.cancel );

						editor.on( 'keydown', ( event ) => {
							if ( isKeyboardEvent.primary( event, 'z' ) ) {
								// Prevent the gutenberg undo kicking in so TinyMCE undo stack works as expected.
								event.stopPropagation();
							}

							// If ctrl+s or cmd+s is pressed, save pending content.
							if ( isKeyboardEvent.primary( event, 's' ) ) {
								debouncedOnChange.flush();
							}

							const { altKey } = event;
							/*
							 * Prevent Mousetrap from kicking in: TinyMCE already uses its own
							 * `alt+f10` shortcut to focus its toolbar.
							 */
							if ( altKey && event.keyCode === F10 ) {
								event.stopPropagation();
							}
						} );

						didMount.current = true;
					},
					...( window?.tinyMCEPreInit?.mceInit[ id ] || {} )
				} : false,
				mediaButtons: true,
				quicktags: {
					buttons: 'strong,em,link,block,del,ins,img,ul,ol,li,code,close'
				},
			} );
		}

		function onReadyStateChange() {
			if ( document.readyState === 'complete' ) {
				initialize();
			}
		}

		if ( document.readyState === 'complete' ) {
			initialize();
		} else {
			document.addEventListener( 'readystatechange', onReadyStateChange );
		}

		return () => {
			document.removeEventListener(
				'readystatechange',
				onReadyStateChange
			);
			wp.oldEditor.remove( id );
		};
	}, [] );

	return (
		<BaseControl { ...baseControlProps }>
			<div ref={ elRef }>
				<textarea
					{ ...controlProps }
					className="wp-editor-area"
					style={ { width: '100%' } }
					value={ value }
					onChange={ ( e ) => onChange( e.target.value ) }
					rows={ 10 }
				/>
			</div>
		</BaseControl>
	);
}

/**
 * Fetches a nested value from an object.
 *
 * @param {Record<string, unknown>} obj - The object to fetch the value from.
 * @param {string[]} path - The nested path as an array of keys.
 * @returns {unknown} - The value.
 * @return {unknown}
 */
export const getNestedValue = ( obj: Record<string, unknown>, path: string | string[] ): unknown => {
	if ( !path || path.length === 0 ) {
		return undefined;
	}

	// If path is a string, splity on period.
	if ( typeof path === 'string' ) {
		path = path.split( '.' );
	}

	if ( path.length === 0 || !obj || typeof obj !== 'object' ) {
		return undefined;
	}

	const [ currentKey, ...remainingPath ] = path;

	if ( remainingPath.length === 0 ) {
		return obj[ currentKey ];
	}

	return getNestedValue( obj[ currentKey ] as Record<string, unknown>, remainingPath );
}

/**
 * Updates a value of any nested path in an object.
 *
 * @param {Record<string, unknown>} obj - The object to update.
 * @param {string[]} path - The nested path as an array of keys.
 * @param {unknown} value - The new value.
 * @returns {Record<string, unknown>} - The updated object.
 */
const updateNestedValue = ( obj: Record<string, unknown>, path: string[], value: unknown ): Record<string, unknown> => {
	if ( !path || path.length === 0 ) {
		return obj;
	}

	// If path is a string, splity on period.
	if ( typeof path === 'string' ) {
		path = path.split( '.' );
	}

	const [ currentKey, ...remainingPath ] = path;

	if ( remainingPath.length === 0 ) {
		return {
			...obj,
			[ currentKey ]: value,
		};
	}

	return {
		...obj,
		[ currentKey ]: updateNestedValue( ( obj[ currentKey ] || {} ) as Record<string, unknown>, remainingPath, value ),
	};
};

export interface Setting {
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
	 * Is input to change.
	 */
	isInputToChange?: boolean;

	/**
	 * Conditional logic.
	 */
	conditions?: settingCondition[];

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
	setting: Setting;
	/** The available smart tags. */
	availableSmartTags?: smartTag[] | undefined;
}

type defaultAttributesType = {
	/**
	 * The current value.
	 */
	value: any;

	/**
	 * The on change handler.
	 */
	onChange: ( value: any ) => void;

	[ key: string ]: any;
}

/**
 * Displays a single setting.
 *
 * @return {JSX.Element}
 */
export function Setting( { settingKey, setting, availableSmartTags = undefined, prop = undefined, saved, setAttributes }: SettingProps ) {

	const settingPath: string[] = ( prop ? `${ prop }.${ settingKey }` : settingKey ).split( '.' );
	const sanitize = setting.sanitize ? setting.sanitize : ( value ) => value;
	const theAvailableSmartTags = 'trigger_settings' === prop || false === setting.can_map || false === setting.map_field || !Array.isArray( availableSmartTags ) ? [] : availableSmartTags;

	/**
	 * Updates an object setting.
	 *
	 * @param {mixed} value The new value.
	 */
	const updateSetting = useCallback( ( value ) => {

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
					newAttributes[ currentKey ] = updateNestedValue( ( saved[ currentKey ] || {} ) as Record<string, unknown>, remainingPath, '' );
				}
			} );
		}

		const [ currentKey, ...remainingPath ] = settingPath;

		if ( remainingPath.length === 0 ) {
			newAttributes[ currentKey ] = value;
		} else {
			newAttributes[ currentKey ] = updateNestedValue( ( newAttributes[ currentKey ] || saved[ currentKey ] || {} ) as Record<string, unknown>, remainingPath, value );
		}

		return setAttributes( sanitize( newAttributes ) );
	}, [ saved, settingPath, setAttributes, sanitize ] );

	// Simple condition.
	if ( setting.if || setting.restrict ) {
		// Check if we're separating with period.
		const parts = setting.restrict ? setting.restrict.split( '.' ) : setting.if.split( '.' );
		if ( !getNestedValue( saved, parts ) ) {
			return null;
		}
	}

	// Key value conditions.
	if ( Array.isArray( setting.conditions ) ) {

		// Check if all conditions are met.
		const conditionsMet = setting.conditions.every( ( condition ) => {
			const parts = condition.key.split( '.' );
			const operator = condition.operator ? condition.operator : '==';

			return compare( condition.value, operator, getNestedValue( saved, parts ) );
		} );

		// If conditions are not met, return null.
		if ( !conditionsMet ) {
			return null;
		}
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

	// Prepare the current value.
	let value = getNestedValue( saved, settingPath );

	// If undefined, use the default value.
	if ( value === undefined || setting.disabled ) {
		value = setting.default;
	}

	// Do we have a value?
	const hasValue = value !== undefined && value !== '' && value !== null;

	// If we have options, convert from object to array.
	let options: SelectOption[] = [] as unknown as SelectOption[];
	if ( setting.options ) {

		// If options is an array of strings, convert to object with same key/value
		if ( Array.isArray( setting.options ) && setting.options.length > 0 && typeof setting.options[ 0 ] === 'string' ) {
			options = setting.options.reduce( ( acc, curr ) => {
				acc.push( {
					label: curr,
					value: curr,
				} );
				return acc;
			}, [] );
		} else if ( Array.isArray( setting.options ) ) {
			options = [ ...setting.options ];
		} else {
			options = Object.keys( setting.options ).map( ( key ) => {
				return {
					label: setting.options?.[ key ],
					value: key,
				};
			} );
		}
	}

	// Classname for the field.
	const className = `noptin-component__field-${ settingKey }`;

	// Help text.
	const help = typeof setting.description === 'string' ? <span dangerouslySetInnerHTML={ { __html: setting.description } } /> : setting.description;

	// Default attributes.
	const customAttributes = setting.customAttributes ? setting.customAttributes : {};
	const defaultAttributes: defaultAttributesType = {
		label: setting.label,
		value: hasValue ? value : '',
		onChange: updateSetting,
		className,
		help: help,
		...customAttributes,
	}

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

		if ( [ 'toggle', 'switch', 'checkbox', 'checkbox_alt', 'checkbox_real', 'text', 'number', 'email', 'tel', 'date', 'color', 'image' ].includes( setting.type ) ) {
			setting.el = 'input';
		}
	}

	// Displays a button.
	if ( setting.el === 'button' ) {
		return <div><Button { ...( setting.buttonProps || {} ) } /></div>;
	}

	// Toggle group.
	if ( setting.el === 'toggle_group' ) {
		return <ToggleGroupSetting { ...defaultAttributes } options={ options } />;
	}

	// Display select control.
	if ( setting.el === 'select' ) {

		// Multi select.
		if ( setting.multiple ) {
			return (
				<MultiSelectSetting
					{ ...defaultAttributes }
					options={ options }
				/>
			);
		}

		// Add a placeholder option if there's no option with an empty value.
		if ( !options.find( ( option ) => option?.value === '' ) ) {
			options.unshift( {
				label: setting.placeholder ? setting.placeholder : __( 'Select an option', 'newsletter-optin-box' ),
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
			value: String( option.value )
		} ) );

		// Ensure current value is a string
		const stringValue = 0 === defaultAttributes.value ? '0' : defaultAttributes.value ? String( defaultAttributes.value ) : '';
		defaultAttributes.value = stringValue;

		return (
			<ComboboxSetting
				{ ...defaultAttributes }
				placeholder={ setting.placeholder ? setting.placeholder : theAvailableSmartTags.length ? __( 'Select an option or map a dynamic value', 'newsletter-optin-box' ) : __( 'Select an option', 'newsletter-optin-box' ) }
				options={ stringOptions }
				allowReset={ setting.canSelectPlaceholder }
				availableSmartTags={ theAvailableSmartTags }
				expandOnFocus
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
				value={ Array.isArray( defaultAttributes.value ) ? defaultAttributes.value : [] }
				suggestions={ Array.isArray( setting.suggestions ) ? setting.suggestions : [] }
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				__experimentalShowHowTo={ false }
				__experimentalExpandOnFocus={ true }
				tokenizeOnBlur={ true }
			/>
		);
	}

	// Displays a multi-checkbox control.
	if ( setting.el === 'multi_checkbox' || setting.el === 'multi_checkbox_alt' ) {
		return <MultiCheckbox { ...defaultAttributes } options={ options } />;
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
			/>
		);
	}

	// Time input field.
	if ( setting.el === 'time' ) {
		return <TimeControl { ...defaultAttributes } />;
	}

	if ( 'color' === setting.el || ( setting.el === 'input' && 'color' === setting.type ) ) {
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
			/>
		);
	}

	// Text input field.
	if ( setting.el === 'input' ) {

		// Checkbox or toggle.
		if ( setting.type && [ 'toggle', 'switch', 'checkbox', 'checkbox_alt' ].includes( setting.type ) ) {
			return (
				<ToggleControl
					{ ...defaultAttributes }
					checked={ hasValue ? value : false }
					__nextHasNoMarginBottom
				/>
			);
		}

		if ( setting.type && [ 'checkbox_real' ].includes( setting.type ) ) {
			return (
				<CheckboxControl
					{ ...defaultAttributes }
					checked={ hasValue ? value : false }
					__nextHasNoMarginBottom
				/>
			);
		}

		// Number.
		if ( 'number' === setting.type ) {

			const addSuffix = ( suffix: any ) => {
				if ( !suffix ) {
					return undefined;
				}

				if ( typeof suffix === 'string' || suffix instanceof String ) {
					return <InputControlSuffixWrapper>{ suffix }</InputControlSuffixWrapper>;
				}

				return suffix;
			}

			const addPrefix = ( prefix: any ) => {
				if ( !prefix ) {
					return undefined;
				}

				if ( typeof prefix === 'string' || prefix instanceof String ) {
					return <InputControlPrefixWrapper>{ prefix }</InputControlPrefixWrapper>;
				}

				return prefix;
			}

			// Singular / Plural suffix.
			if ( Array.isArray( defaultAttributes.suffix ) ) {
				defaultAttributes.suffix = 1 === value || '1' === value ? addSuffix( defaultAttributes.suffix[ 0 ] ) : addSuffix( defaultAttributes.suffix[ 1 ] );
			} else {
				defaultAttributes.suffix = addSuffix( defaultAttributes.suffix );
			}

			// Singular / Plural prefix.
			if ( Array.isArray( defaultAttributes.prefix ) ) {
				defaultAttributes.prefix = 1 === value || '1' === value ? addPrefix( defaultAttributes.prefix[ 0 ] ) : addPrefix( defaultAttributes.prefix[ 1 ] );
			} else {
				defaultAttributes.prefix = addPrefix( defaultAttributes.prefix );
			}

			return (
				<NumberControl
					{ ...defaultAttributes }
					placeholder={ setting.placeholder ? setting.placeholder : '' }
					__next40pxDefaultSize
				/>
			);
		}

		// Image upload.
		if ( 'image' === setting.type ) {
			defaultAttributes.suffix = (
				<Button
					onClick={ () => {
						// Init the media uploader script.
						var image = window.wp.media( {
							title: __( 'Upload Image', 'newsletter-optin-box' ),
							multiple: false,
							library: {
								type: 'image'
							},
						} )

							// The open the media uploader modal.
							.open()

							// Update the associated key with the selected image's url
							.on( 'select', e => {
								let uploaded_image = image.state().get( 'selection' ).first();
								updateSetting( uploaded_image.toJSON().sizes[ 'full' ].url );
							} )
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
				isPressEnterToChange={ setting.isInputToChange ? false : true }
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
		return (
			<TinyMCESetting { ...defaultAttributes } />
		);
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
					<Tip>
						{ setting.content }
					</Tip>
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
	if ( setting.el === 'key_value_repeater' || setting.el === 'webhook_key_value_repeater' ) {
		return (
			<KeyValueRepeater
				{ ...defaultAttributes }
				setting={ setting }
				availableSmartTags={ theAvailableSmartTags }
			/>
		);
	}

	// Dynamic repeater, will eventually replace key value repeater.
	if ( setting.el === 'repeater' ) {
		return (
			<RepeaterControl
				{ ...defaultAttributes }
				availableSmartTags={ theAvailableSmartTags }
			/>
		);
	}

	console.log( setting );
	return settingKey;
}
