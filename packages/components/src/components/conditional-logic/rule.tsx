/**
 * External dependencies
 */
import React, { useMemo, useCallback } from 'react';

/**
 * WordPress dependencies
 */
import {
	SelectControl,
	Button,
	__experimentalInputControl as InputControl,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Local dependencies.
 */
import {
	useMergeTags,
	usePlaceholder,
	useOptions,
	smartTag as SmartTagType,
} from '../hooks';

const NON_OPTION_CONDITIONS = [ 'is_empty', 'is_between', 'is_not_empty', 'begins_with', 'ends_with' ];

/**
 * A single conditional logic rule.
 */
export type ConditionalLogicRule = {
	/**
	 * The full rule.
	 */
	full: string | undefined;

	/**
	 * The type of the rule.
	 */
	type: string | undefined;

	/**
	 * The value of the rule.
	 */
	value: string | undefined;

	/**
	 * The condition of the rule.
	 */
	condition: string | undefined;
};

// Consider adding a type for the props
type ConditionalLogicRuleProps = {
	rule: ConditionalLogicRule;
	comparisons: Record<string, any>;
	availableSmartTags: Record<string, SmartTagType>;
	mergeTagsArray: SmartTagType[];
	index: number;
	updateRule: ( index: number, value: Partial<ConditionalLogicRule> ) => void;
	removeRule: ( index: number ) => void;
};

/**
 * Displays a single conditional logic rule.
 */
export const ConditionalLogicRule: React.FC<ConditionalLogicRuleProps> = (
	props
) => {
	const {
		rule,
		comparisons,
		availableSmartTags,
		mergeTagsArray,
		index,
		updateRule,
		removeRule,
	} = props;

	/**
	 * Updates the value of the rule.
	 *
	 * @param value The value to update.
	 */
	const updateValue = useCallback(
		( value: string | undefined ) => updateRule( index, { value } ),
		[ updateRule, index ]
	);

	/**
	 * Updates the condition of the rule.
	 *
	 * @param condition The condition to update.
	 */
	const updateCondition = useCallback(
		( condition: string | undefined ) => updateRule( index, { condition } ),
		[ updateRule, index ]
	);

	/**
	 * Removes the rule.
	 */
	const localRemoveRule = useCallback(
		() => removeRule( index ),
		[ removeRule, index ]
	);

	/**
	 * The full rule.
	 */
	const ruleFull: string = rule.full ?? ( rule.type ? `[[${ rule.type }]]` : '' );

	/**
	 * The closing bracket index of the rule.
	 */
	const closingBracketIndex = ruleFull.indexOf( ']]' );

	/**
	 * The opening bracket index of the rule.
	 */
	const openingBracketIndex = ruleFull.indexOf( '[[', closingBracketIndex );

	/**
	 * Whether the rule has multiple tags.
	 */
	const hasMultipleTags =
		closingBracketIndex === -1 ||
		( openingBracketIndex !== -1 &&
			openingBracketIndex > closingBracketIndex );

	// Handles update of the full rule.
	const onUpdateFull = useCallback(
		( fullMergeTag: string | undefined ) => {
			const toUpdate: Partial<ConditionalLogicRule> = {
				full: fullMergeTag,
			};

			// Get first part between [[]].
			if ( fullMergeTag ) {
				const firstTag =
					fullMergeTag.match( /\[\[([^\s\]]+)/ )?.[ 1 ] || '';

				if ( firstTag ) {
					toUpdate.type = firstTag
						.replace( '[[', '' )
						.replace( ']]', '' );
				}
			}

			updateRule( index, toUpdate );
		},
		[ updateRule, index ]
	);

	/**
	 * On merge tag click.
	 *
	 * @param mergeTag The merge tag to click.
	 */
	const onMergeTagClick = useCallback(
		( mergeTag: string ) => {
			onUpdateFull(
				ruleFull ? `${ ruleFull } ${ mergeTag }`.trim() : mergeTag
			);
		},
		[ onUpdateFull, ruleFull ]
	);

	/**
	 * The merge tag suffix.
	 */
	const mergeTagSuffix = useMergeTags( {
		availableSmartTags: mergeTagsArray,
		onMergeTagClick,
	} );

	// Value merge tag.
	const onValueMergeTagClick = useCallback(
		( mergeTag: string ) => {
			updateValue(
				rule.value ? `${ rule.value } ${ mergeTag }`.trim() : mergeTag
			);
		},
		[ updateValue, rule.value ]
	);

	/**
	 * The value merge tag suffix.
	 */
	const valueMergeTagSuffix = useMergeTags( {
		availableSmartTags: mergeTagsArray,
		onMergeTagClick: onValueMergeTagClick,
	} );

	/**
	 * The smart tag.
	 */
	const smartTag = useMemo( () => {
		const tag = rule.type;

		if ( !tag ) {
			return null;
		}

		if ( availableSmartTags[ tag ] !== undefined ) {
			return availableSmartTags[ tag ];
		}

		// Convert first occurrence of _ to .
		const altTag = tag.replace( '_', '.' );
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
			const split = ( string: string | string[] ) =>
				Array.isArray( string ) ? string : string.split( /[\s,]+/ );

			// Check deprecated alternatives.
			if ( value.deprecated && split( value.deprecated ).includes( tag ) ) {
				return value;
			}
		}

		return null;
	}, [ rule.type, availableSmartTags ] );

	// Contains available options.
	const availableOptions = usePlaceholder(
		useOptions( smartTag?.options || [] ),
		__( 'Select a value', 'newsletter-optin-box' )
	);

	// Checks whether the selected condition type has options.
	const hasOptions = !hasMultipleTags && availableOptions.length > 1;

	// Contains data type.
	const dataType = hasMultipleTags
		? 'string'
		: smartTag?.conditional_logic || 'string';

	// Sets available comparisons for the selected condition.
	const availableComparisons = usePlaceholder(
		useMemo( () => {
			const types = [] as any[];

			// Filter object of available condition types to include where key === rule.type.
			Object.keys( comparisons ).forEach( ( key ) => {
				const comparison_type = comparisons[ key ].type;

				if ( hasOptions && NON_OPTION_CONDITIONS.includes( key ) ) {
					return;
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

	const skipValue =
		'is_empty' === rule.condition || 'is_not_empty' === rule.condition;

	return (
		<HStack justify="flex-start" wrap expanded>
			<div style={ { minWidth: 320 } }>
				<InputControl
					type="text"
					label={ __( 'Smart Tag', 'newsletter-optin-box' ) }
					hideLabelFromVision={ true }
					placeholder={ __(
						'Enter a smart tag',
						'newsletter-optin-box'
					) }
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
							placeholder={ __(
								'Enter a value',
								'newsletter-optin-box'
							) }
							hideLabelFromVision={ true }
							value={ rule.value ? rule.value : '' }
							onChange={ updateValue }
							suffix={ valueMergeTagSuffix }
							__next40pxDefaultSize
						/>
					) }
				</div>
			) }

			<Button
				onClick={ localRemoveRule }
				icon="trash"
				variant="tertiary"
				isDestructive
			/>
		</HStack>
	);
};
