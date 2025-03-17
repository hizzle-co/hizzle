/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import {
	SelectControl,
	__experimentalHStack as HStack,
	__experimentalText as Text,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

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

interface ConditionalLogicTypeSelectorProps {
	/**
	 * The type of conditional logic to apply (all or any).
	 */
	type: string;

	/**
	 * The action to take (allow or prevent).
	 */
	action: string;

	/**
	 * Function to update a conditional logic attribute.
	 * 
	 * @param attribute The attribute to update.
	 * @param value The new value for the attribute.
	 */
	setConditionalLogicAttribute: ( attribute: string, value: any ) => void;

	/**
	 * The number of rules in the conditional logic.
	 */
	ruleCount: number;
}

/**
 * Displays the conditional logic editor type selector.
 *
 */
export const ConditionalLogicTypeSelector: React.FC<ConditionalLogicTypeSelectorProps> = ( props ) => {

	const { type, action, setConditionalLogicAttribute, ruleCount } = props;
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
				__next40pxDefaultSize
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
						__next40pxDefaultSize
					/>
					<Text>
						{ __( 'of the following rules are true:', 'newsletter-optin-box' ) }
					</Text>
				</>
			) }
		</HStack>
	);
}
