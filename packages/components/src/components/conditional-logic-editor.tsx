/**
 * External dependencies
 */
import React, { useCallback, useMemo, useState } from 'react';

/**
 * WordPress dependencies
 */
import {
	SelectControl,
	ToggleControl,
	Button,
	__experimentalInputControl as InputControl,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalText as Text,
	Modal,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useMergeTags } from './setting';

// Action.
const ifOptions = [
	{
		label: __( 'Only run if', 'newsletter-optin-box' ),
		value: 'allow',
	},
	{
		label: __( 'Do not run if', 'newsletter-optin-box' ),
		value: 'prevent',
	},
]

// Matches.
const typeOptions = [
	{
		label: __( 'all', 'newsletter-optin-box' ),
		value: 'all',
	},
	{
		label: __( 'any', 'newsletter-optin-box' ),
		value: 'any',
	},
]

/**
 * Adds a placeholder to the beginning of an array.
 *
 * @param {Array} array
 * @param {String} placeholder
 * @return {Array}
 */
function usePlaceholder( array, placeholder ) {
	return useMemo( () => {

		return [
			{
				label: placeholder,
				value: '',
				disabled: true,
			},
			...array,
		];
	}, [ array, placeholder ] );
}

/**
 * Displays the conditional logic editor type selector.
 *
 * @param {Object} props
 * @param {String} props.type
 * @param {String} props.action
 * @param {Function} props.setConditionalLogicAttribute
 */
export function ConditionalLogicTypeSelector( { type, action, ruleCount, setConditionalLogicAttribute } ): React.ReactNode {

	const hasMultiple = ruleCount > 1;

	return (
		<HStack justify="flex-start" wrap>
			<SelectControl
				label={ __( 'If', 'newsletter-optin-box' ) }
				hideLabelFromVision={ true }
				value={ action ? action : 'allow' }
				options={ ifOptions }
				onChange={ ( val ) => setConditionalLogicAttribute( 'action', val ) }
				size="default"
				__nextHasNoMarginBottom
			/>

			{ hasMultiple && (
				<>
					<SelectControl
						label={ __( 'all', 'newsletter-optin-box' ) }
						hideLabelFromVision={ true }
						value={ type ? type : 'all' }
						options={ typeOptions }
						onChange={ ( val ) => setConditionalLogicAttribute( 'type', val ) }
						size="default"
						__nextHasNoMarginBottom
					/>
					<Text>
						{ __( 'of the following rules are true:', 'newsletter-optin-box' ) }
					</Text>
				</>
			) }
		</HStack>
	);
}

type Rule = {
	full: string | undefined;
	type: string | undefined;
	value: string | number | undefined;
	condition: string | undefined;
}

// Consider adding a type for the props
type ConditionalLogicRuleProps = {
	rule: Rule;
	comparisons: any; // Replace 'any' with a more specific type
	availableSmartTags: any; // Replace 'any' with a more specific type
	mergeTagsArray: any[]; // Replace 'any' with a more specific type
	index: number;
	updateRule: ( index: number, value: Partial<Rule> ) => void;
	removeRule: ( index: number ) => void;
};

/**
 * Displays a single conditional logic rule.
 */
export function ConditionalLogicRule( {
	rule,
	comparisons,
	availableSmartTags,
	mergeTagsArray,
	index,
	updateRule,
	removeRule
}: ConditionalLogicRuleProps ): React.ReactNode {
	const updateValue = ( value: string | number | undefined ) => updateRule( index, { value } );
	const updateCondition = ( condition: string | undefined ) => updateRule( index, { condition } );
	const localRemoveRule = () => removeRule( index );

	const ruleFull: string = rule.full ?? ( rule.type ? `[[${ rule.type }]]` : '' );
	const closingBracketIndex = ruleFull.indexOf( ']]' );
	const openingBracketIndex = ruleFull.indexOf( '[[', closingBracketIndex );
	const hasMultipleTags = closingBracketIndex === -1 || ( openingBracketIndex !== -1 && openingBracketIndex > closingBracketIndex );

	// Handles update of the full rule.
	const onUpdateFull = ( fullMergeTag: string | undefined ) => {
		const toUpdate: Partial<Rule> = {
			full: fullMergeTag,
		}

		// Get first part between [[]].
		if ( fullMergeTag ) {
			const firstTag = fullMergeTag.match( /\[\[([^\s\]]+)/ )?.[ 1 ] || '';

			if ( firstTag ) {
				toUpdate.type = firstTag.replace( '[[', '' ).replace( ']]', '' );
			}
		}

		updateRule( index, toUpdate );
	};

	// On add merge tag...
	const onMergeTagClick = ( mergeTag: string ) => {
		onUpdateFull( ruleFull ? `${ ruleFull } ${ mergeTag }`.trim() : mergeTag );
	};

	const mergeTagSuffix = useMergeTags( { availableSmartTags: mergeTagsArray, onMergeTagClick } );

	// Value merge tag.
	const onValueMergeTagClick = ( mergeTag: string ) => {
		updateValue( rule.value ? `${ rule.value } ${ mergeTag }`.trim() : mergeTag );
	};

	const valueMergeTagSuffix = useMergeTags( { availableSmartTags: mergeTagsArray, onMergeTagClick: onValueMergeTagClick } );

	// Container for the matching smart tag.
	const smartTag = useMemo( () => {

		const tag = rule.type;

		if ( availableSmartTags[ tag ] !== undefined ) {
			return availableSmartTags[ tag ];
		}

		// Convert first occurrence of _ to .
		const altTag = tag.replace( '_', '.', 1 );
		if ( availableSmartTags[ altTag ] !== undefined ) {
			return availableSmartTags[ altTag ];
		}

		for ( const [ key, value ] of Object.entries( availableSmartTags ) ) {
			// Check without prefix.
			if ( key.indexOf( '.' ) !== -1 ) {
				const withoutPrefix = key.split( '.' ).slice( 1 );
				if ( withoutPrefix.join( '.' ) === tag ) {
					return value;
				}
			}

			// Converts a space or comma separated list to array.
			const split = ( string ) => Array.isArray( string ) ? string : string.split( /[\s,]+/ );

			// Check deprecated alternatives.
			if ( value.deprecated && split( value.deprecated ).includes( tag ) ) {
				return value;
			}
		}

		return null;
	}, [ rule.type, availableSmartTags ] );

	// Contains available options.
	const availableOptions = usePlaceholder(
		useOptions( smartTag?.options ),
		__( 'Select a value', 'newsletter-optin-box' )
	);

	// Checks whether the selected condition type has options.
	const hasOptions = !hasMultipleTags && availableOptions.length > 1;

	// Contains data type.
	const dataType = hasMultipleTags ? 'string' : ( smartTag?.conditional_logic || 'string' );

	// Sets available comparisons for the selected condition.
	const availableComparisons = usePlaceholder(
		useMemo( () => {
			const types = [] as any[];

			// Filter object of available condition types to include where key === rule.type.
			Object.keys( comparisons ).forEach( key => {
				let comparison_type = comparisons[ key ].type;

				if ( hasOptions ) {

					if ( 'string' === dataType && 'is' != key && 'is_not' != key ) {
						return;
					}

					if ( 'is_empty' === key || 'is_not_empty' === key || 'is_between' === key ) {
						return;
					}
				}

				if ( 'any' === comparison_type || comparison_type == dataType ) {
					types.push( {
						label: comparisons[ key ].name,
						value: key,
					} );
				}
			} );
			return types;
		}, [ dataType, comparisons ] ),
		__( 'Select a comparison', 'newsletter-optin-box' )
	);

	const skipValue = 'is_empty' === rule.condition || 'is_not_empty' === rule.condition;

	return (
		<HStack justify="flex-start" wrap expanded>
			<div style={ { minWidth: 320 } }>
				<InputControl
					type="text"
					label={ __( 'Smart Tag', 'newsletter-optin-box' ) }
					hideLabelFromVision={ true }
					placeholder={ __( 'Enter a smart tag', 'newsletter-optin-box' ) }
					value={ ruleFull }
					onChange={ onUpdateFull }
					autoComplete="off"
					suffix={ mergeTagSuffix }
					__next40pxDefaultSize
				/>
			</div>
			<div style={ { width: 150 } }>
				<SelectControl
					label={ __( 'Comparison', 'newsletter-optin-box' ) }
					hideLabelFromVision={ true }
					value={ rule.condition ? rule.condition : 'is' }
					options={ availableComparisons }
					onChange={ updateCondition }
					size="default"
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</div>

			{ !skipValue && (
				<div style={ { minWidth: 320 } }>

					{ hasOptions && (
						<SelectControl
							label={ __( 'Value', 'newsletter-optin-box' ) }
							hideLabelFromVision={ true }
							value={ rule.value ? rule.value : '' }
							options={ availableOptions }
							onChange={ updateValue }
							size="default"
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					) }

					{ !hasOptions && (
						<InputControl
							type={ 'number' === dataType ? 'number' : 'text' }
							label={ __( 'Value', 'newsletter-optin-box' ) }
							placeholder={ __( 'Enter a value', 'newsletter-optin-box' ) }
							hideLabelFromVision={ true }
							value={ rule.value ? rule.value : '' }
							onChange={ updateValue }
							suffix={ valueMergeTagSuffix }
							__next40pxDefaultSize
						/>
					) }
				</div>
			) }

			<Button onClick={ localRemoveRule } icon="trash" variant="tertiary" isDestructive />

		</HStack>
	);
}

/**
 * Prepares the available options for the selected condition.
 *
 * @param {Array|Object} options
 * @return {Array}
 */
function useOptions( options ) {

	return useMemo( () => {

		if ( !options ) {
			return [];
		}

		// Arrays.
		if ( Array.isArray( options ) ) {
			return options.map( ( option, index ) => {
				return {
					label: option,
					value: index,
				};
			} );
		}

		// Objects.
		return Object.keys( options ).map( ( key ) => {
			return {
				label: options[ key ],
				value: key,
			};
		} );
	}, [ options ] );
}

/**
 * Displays the available conditional logic rules.
 *
 * @param {Object} props
 * @param {Array} props.rules
 * @param {Object} props.comparisons
 * @param {Array} props.availableSmartTags
 * @param {Function} props.setConditionalLogicAttribute
 * @return {JSX.Element}
 */
export function ConditionalLogicRules( { rules, comparisons, availableSmartTags, setConditionalLogicAttribute, disableTags, disableProps, closeModal } ) {

	// Filter available smart rules.
	const theRules = useMemo( () => {

		if ( !Array.isArray( rules ) ) {
			return [];
		}

		return rules.filter( rule => rule.type && rule.type !== '' );
	}, [ rules ] );

	// Filter available smart tags to only include those that support conditional logic.
	const filteredSmartTags = useMemo( () => {
		const types = {};

		availableSmartTags.forEach( ( smartTag ) => {
			if ( smartTag.conditional_logic ) {
				types[ smartTag.smart_tag ] = {
					...smartTag,
					key: smartTag.smart_tag,
					type: smartTag.conditional_logic,
					isPremium: (
						Array.isArray( disableTags ) && disableTags.some( ( tag ) => smartTag.smart_tag.startsWith( tag ) ) ||
						Array.isArray( disableProps ) && disableProps.some( ( prop ) => !!smartTag[ prop ] )
					),
				};
			}
		} );

		return types;
	}, [ availableSmartTags ] );

	/**
	 * Removes a rule from the conditional logic.
	 *
	 * @param {Number} index
	 */
	const removeRule = useCallback( ( index ) => {
		const newRules = [ ...theRules ];
		newRules.splice( index, 1 );
		setConditionalLogicAttribute( 'rules', newRules );
	}, [ theRules, setConditionalLogicAttribute ] );

	/**
	 * Updates a rule in the conditional logic.
	 *
	 * @param {Number} index
	 * @param {String} key
	 * @param {String} value
	 */
	const updateRule = useCallback( ( index, value ) => {
		const newRules = [ ...theRules ];

		newRules[ index ] = {
			...newRules[ index ],
			...value
		};
		setConditionalLogicAttribute( 'rules', newRules );
	}, [ theRules, setConditionalLogicAttribute ] );

	// Merge tags array.
	const mergeTagsArray = useMemo( () => Object.values( filteredSmartTags ), [ filteredSmartTags ] );

	/**
	 * Adds a new conditional logic rule.
	 */
	const addRule = useCallback( ( smartTag, full ) => {
		const smartTagObject = filteredSmartTags[ smartTag ];
		const options = smartTagObject?.options || [];
		const placeholder = smartTagObject?.placeholder || '';
		let value = ( Array.isArray( options ) && options.length ) ? Object.keys( options )[ 0 ] : placeholder;

		// If the smartTag has a default value.
		if ( smartTagObject?.default ) {
			value = smartTagObject.default;
		}

		const newRules = [ ...theRules ];
		newRules.push( {
			type: smartTag,
			condition: 'is',
			full,
			value,
		} );
		setConditionalLogicAttribute( 'rules', newRules );
	}, [ theRules ] );

	// Button to add a new condition.
	const text = theRules.length === 0 ? __( 'Add a conditional logic rule', 'newsletter-optin-box' ) : __( 'Add another rule', 'newsletter-optin-box' );
	const addCondition = useMergeTags( {
		availableSmartTags: mergeTagsArray,
		onMergeTagClick: addRule,
		raw: true,
		icon: 'plus',
		label: text,
		text,
		toggleProps: { variant: 'primary' }
	} );

	return (
		<>
			{ theRules.map( ( rule, index ) => (
				<ConditionalLogicRule
					key={ index }
					rule={ rule }
					index={ index }
					updateRule={ updateRule }
					removeRule={ removeRule }
					comparisons={ comparisons }
					availableSmartTags={ filteredSmartTags }
					mergeTagsArray={ mergeTagsArray }
				/>
			) ) }

			<HStack justify="flex-start" wrap>
				{ addCondition }
				{ closeModal && (
					<Button onClick={ closeModal } variant="secondary">
						{ __( 'Return to editor', 'newsletter-optin-box' ) }
					</Button>
				) }
			</HStack>
		</>
	);
}

/**
 * Displays the conditional logic editor.
 *
 * @param {Object} props
 * @param {String} props.className The class name.
 * @param {String} props.label The label.
 * @param {String} props.prop The prop to update.
 * @param {Array} props.availableSmartTags The available smart tags.
 * @param {Object} props.comparisons The available comparisons.
 * @param {Object} props.value The current value.
 * @param {String} props.toggleText The toggle text.
 * @param {Function} props.onChange
 * @return {JSX.Element}
 */
export default function ConditionalLogicEditor( { onChange, value, comparisons, toggleText, availableSmartTags, className, inModal = false, ...extra } ) {

	const [ isOpen, setIsOpen ] = useState( false );

	const theValue = useMemo( () => {
		// If value is not an Object, set it to the default.
		if ( typeof value !== 'object' ) {
			return {
				enabled: false,
				action: 'allow',
				rules: [],
				type: 'all',
			};
		}

		return value;
	}, [ value ] );

	// Sets conditional logic attribute.
	const setConditionalLogicAttribute = useCallback( ( prop, val ) => {
		onChange( {
			...theValue,
			[ prop ]: val,
		} );
	}, [ onChange, theValue ] );

	const el = (
		<VStack spacing={ 5 }>
			<ConditionalLogicTypeSelector
				ruleCount={ Array.isArray( theValue.rules ) ? theValue.rules.length : 0 }
				type={ theValue.type }
				action={ theValue.action }
				setConditionalLogicAttribute={ setConditionalLogicAttribute }
			/>

			<ConditionalLogicRules
				rules={ theValue.rules }
				comparisons={ comparisons }
				availableSmartTags={ availableSmartTags }
				setConditionalLogicAttribute={ setConditionalLogicAttribute }
				closeModal={ inModal && ( () => setIsOpen( false ) ) }
				{ ...extra }
			/>
		</VStack>
	);

	return (
		<VStack spacing={ 5 } className={ className }>
			<ToggleControl
				checked={ theValue.enabled ? true : false }
				onChange={ ( val ) => setConditionalLogicAttribute( 'enabled', val ) }
				label={ toggleText ? toggleText : __( 'Optionally enable/disable this trigger depending on specific conditions.', 'newsletter-optin-box' ) }
				__nextHasNoMarginBottom
			/>

			{ theValue.enabled && (
				<>
					{ inModal ? (
						<>
							{ isOpen && (
								<Modal
									title={ __( 'Conditional Logic', 'newsletter-optin-box' ) }
									onRequestClose={ () => setIsOpen( false ) }
									isFullScreen
								>
									{ el }
								</Modal>
							) }
							<Button variant="secondary" className="noptin-block-button" onClick={ () => setIsOpen( true ) }>
								{ __( 'Edit Conditional Logic', 'newsletter-optin-box' ) }
							</Button>
						</>
					) : (
						<>
							{ el }
						</>
					) }
				</>
			) }
		</VStack>
	);
}
