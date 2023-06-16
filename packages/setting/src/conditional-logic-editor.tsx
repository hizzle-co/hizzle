import {
	TextControl,
	SelectControl,
	ToggleControl,
	Flex,
	FlexItem,
	FlexBlock,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import type { FC } from 'react';
import type {
    ConditionalLogic,
    ConditionalLogicRule,
    MergeTagsProps,
    LabelValuePair,
    Setting
} from './types';

// Condition type.
interface ConditionType {
    /**
     * The key.
     */
    key: string;

    /**
     * The label.
     */
    label: string;

    /**
     * The options.
     */
    options?: LabelValuePair[];

    /**
     * The type.
     */
    type: string;

    /**
     * The placeholder.
     */
    placeholder: string;
}


// Matches.
const typeOptions = [
	{
		label: __( 'all', 'hizzlewp' ),
		value: 'all',
	},
	{
		label: __( 'any', 'hizzlewp' ),
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
function addPlaceholder( array, placeholder ) {
	return [
		{
			label: placeholder,
			value: '',
			disabled: true,
		},
		...array,
	];
}

interface ConditionalLogicTypeSelectorProps {

    /**
     * The type of conditional logic.
     */
    type: ConditionalLogic['type'];

    /**
     * The action of conditional logic.
     */
    action: ConditionalLogic['action'];

    /**
     * The number of rules.
     */
    ruleCount: number;

    /**
     * Sets a conditional logic attribute.
     */
    setConditionalLogicAttribute: ( key: keyof ConditionalLogic, value: any ) => void;

    /**
     * The available condition types.
     */
    ifOptions?: LabelValuePair[];
}

/**
 * Displays the conditional logic editor type selector.
 *
 */
const ConditionalLogicTypeSelector: FC<ConditionalLogicTypeSelectorProps> = ({ type, action, ruleCount, setConditionalLogicAttribute, ifOptions }) => {

	const hasMultiple = ruleCount > 1;

	return (
		<Flex className="hizzle-component__field-lg" wrap>
			<FlexItem>
				<SelectControl
					label={ __( 'If', 'hizzlewp' ) }
					hideLabelFromVision={ true }
					value={ action ? action : 'allow' }
					options={ifOptions || []}
					onChange={ ( val ) => setConditionalLogicAttribute( 'action', val ) }
					size="default"
					__nextHasNoMarginBottom
				/>
			</FlexItem>

			{hasMultiple && (
				<>
					<FlexItem>
						<SelectControl
							label={ __( 'all', 'hizzlewp' ) }
							hideLabelFromVision={ true }
							value={ type ? type : 'all' }
							options={ typeOptions }
							onChange={ ( val ) => setConditionalLogicAttribute( 'type', val ) }
							size="default"
							__nextHasNoMarginBottom
						/>
					</FlexItem>
					<FlexBlock>
						{__( 'of the following rules are true:', 'hizzlewp' )}
					</FlexBlock>
				</>
			)}
		</Flex>
	);
}

interface ConditionalLogicRuleProps {

    /**
     * The conditional logic rule.
     */
    rule: ConditionalLogicRule;

    /**
     * The available comparisons.
     */
    comparisons: LabelValuePair[];

    /**
     * The available condition types.
     */
    availableConditionTypes: {
        [key: string]: ConditionType;
    }

    /**
     * The condition type.
     */
    conditionType: string;

    /**
     * Whether the rule is the last rule.
     */
    isLastRule: boolean;

    /**
     * Callback to update a rule.
     */
    updateRule: ( key: string, value: string ) => void;

    /**
     * The callback to remove a rule.
     */
    removeRule: () => void;
}

/**
 * Displays a single conditional logic rule.
 *
 */
const ConditionalLogicRule: FC<ConditionalLogicRuleProps> = ({ rule, comparisons, availableConditionTypes, updateRule, removeRule, conditionType, isLastRule }) => {

	// Fetches a condition type.
	const getConditionType = ( type: string ) => availableConditionTypes[ type ];

	// Retrieves the selected condition type.
	const selectedConditionType = useMemo( () => getConditionType( rule.type ) || {}, [ availableConditionTypes, rule.type ] );

	// Contains available options.
	const availableOptions = selectedConditionType.options || [];

	// Checks whether the selected condition type has options.
	const hasOptions = availableOptions.length > 0;

	// Contains data type.
	const dataType = useMemo( () => selectedConditionType.type ? selectedConditionType.type : 'string', [ selectedConditionType ] );

	// Sets available comparisons for the selected condition.
	const availableComparisons = useMemo( () => {
		const types: LabelValuePair[] = [];

		// Filter object of available condition types to include where key === rule.type.
		Object.keys( comparisons ).forEach( key => {
			let comparison_type = comparisons[key].type;

			if ( hasOptions ) {

				if ( 'string' === dataType && 'is' != key  && 'is_not' != key ) {
					return;
				}

				if ( 'is_empty' === key || 'is_not_empty' === key || 'is_between' === key ) {
					return;
				}
			}

			if ( 'any' === comparison_type || comparison_type == dataType ) {
				types.push(
					{
						label: comparisons[ key ].name,
						value: key,
					}
				);
			}
		});
		return types;
	}, [ dataType ] );

	// Sets the default type and the available comparisons.
	let defaultConditionType = '';
	const conditionOptions:LabelValuePair[] = [];

	Object.keys( availableConditionTypes ).forEach( ( key ) => {
		const conditionType = availableConditionTypes[ key ];

		if ( '' === defaultConditionType ) {
			defaultConditionType = conditionType.type;
		}

		conditionOptions.push( {
			label: conditionType.label,
			value: key,
		} );
	} );

	// Handles an update and sets any default values.
	const handleUpdate = ( key:string, value:string ) => {
		updateRule( key, value );

		if ( 'type' !== key && '' === rule.type ) {
			updateRule( 'type', defaultConditionType );
		}

		if ( 'condition' !== key && '' === rule.condition ) {
			updateRule( 'condition', 'is' );
		}

		if ( 'type' === key ) {
			updateRule( 'condition', 'is' );
			updateRule( 'value', '' );
		}
	}

	const skipValue = 'is_empty' === rule.condition || 'is_not_empty' === rule.condition;
	const showSelect = hasOptions && ! skipValue;
	const showInput = ! hasOptions && ! skipValue;

	return (
		<Flex className="hizzle-component__field-lg" wrap>

			<FlexItem>
				<SelectControl
					label={ __( 'Condition Type', 'hizzlewp' ) }
					hideLabelFromVision={ true }
					value={ rule.type ? rule.type : defaultConditionType }
					options={addPlaceholder( conditionOptions, __( 'Select a condition', 'hizzlewp' ) )}
					onChange={ ( val ) => handleUpdate( 'type', val ) }
					size="default"
					__nextHasNoMarginBottom
				/>
			</FlexItem>

			<FlexItem>
				<SelectControl
					label={ __( 'Comparison', 'hizzlewp' ) }
					hideLabelFromVision={ true }
					value={ rule.condition ? rule.condition : 'is' }
					options={addPlaceholder( availableComparisons, __( 'Select a comparison', 'hizzlewp' ) )}
					onChange={ ( val ) => handleUpdate( 'condition', val ) }
					size="default"
					__nextHasNoMarginBottom
				/>
			</FlexItem>

			<FlexItem>

				{showSelect && (
					<SelectControl
						label={ __( 'Value', 'hizzlewp' ) }
						hideLabelFromVision={ true }
						value={ rule.value ? rule.value : '' }
						options={addPlaceholder( availableOptions, __( 'Select a value', 'hizzlewp' ) )}
						onChange={ ( val ) => updateRule( 'value', val ) }
						size="default"
						__nextHasNoMarginBottom
					/>
				)}

				{showInput && (
					<TextControl
						type={ 'number' === dataType ? 'number' : 'text' }
						label={ __( 'Value', 'hizzlewp' ) }
						hideLabelFromVision={ true }
						value={ rule.value ? rule.value : '' }
						onChange={ ( val ) => updateRule( 'value', val ) }
						__nextHasNoMarginBottom
					/>
				)}
			</FlexItem>

			<FlexItem>
				<Button onClick={ removeRule } icon="trash"/>
			</FlexItem>

			<FlexBlock>
				{ ! isLastRule && (
					<>
						{conditionType === 'any' && __( 'or', 'hizzlewp' )}
						{conditionType === 'all' && __( 'and', 'hizzlewp' )}
					</>
				)}
			</FlexBlock>
		</Flex>
	);
}

/**
 * Conditional logic rules props.
 */
interface conditionalLogicRulesProps extends MergeTagsProps {

    /**
     * The available conditional logic rules.
     */
    rules: ConditionalLogicRule[];

    /**
     * The condition type.
     */
    conditionType: "all" | "any";

    /**
     * The available comparisons.
     */
    comparisons?: LabelValuePair[];

	/**
     * Sets a conditional logic attribute.
     */
    setConditionalLogicAttribute: ( key: keyof ConditionalLogic, value: any ) => void;

}

/**
 * Displays the available conditional logic rules.
 *
 */
const ConditionalLogicRules: FC<conditionalLogicRulesProps> = ({ rules, conditionType, comparisons, availableSmartTags, setConditionalLogicAttribute }) => {

	const theRules = Array.isArray( rules ) ? rules : [];

	/**
	 * Removes a rule from the conditional logic.
	 *
	 */
	const removeRule = ( index: number ) => {
		const newRules = [ ...theRules ];
		newRules.splice( index, 1 );
		setConditionalLogicAttribute( 'rules', newRules );
	};

	/**
	 * Updates a rule in the conditional logic.
	 *
	 */
	const updateRule = ( index: number, key: string, value: string ) => {
		const newRules = [ ...theRules ];
		newRules[ index ][ key ] = value;
		setConditionalLogicAttribute( 'rules', newRules );
	};

	// Sets available condition types.
	const availableConditionTypes = useMemo( () => {
		const types: { [key: string]: ConditionType } = {};

		availableSmartTags.forEach( ( smartTag ) => {
			if ( smartTag.conditional_logic ) {
				types[ smartTag.smart_tag ] = {
					key: smartTag.smart_tag,
					label: smartTag.label,
					options: smartTag.options,
					type: smartTag.conditional_logic,
					placeholder: smartTag.placeholder ? smartTag.placeholder : '',
				};
			}
		} );
	
		return types;
	}, [ availableSmartTags ] );

	/**
	 * Adds a new conditional logic rule.
	 */
	const addRule = () => {
		const type        = Object.keys(availableConditionTypes)[0];
		const options     = availableConditionTypes[type].options;
		const placeholder = availableConditionTypes[type].placeholder ? availableConditionTypes[type].placeholder : '';
		const value       = ( Array.isArray( options ) && options.length) ? Object.keys( options )[0] : placeholder;

		const newRules = [ ...theRules ];
		newRules.push( {
			type,
			condition: 'is',
			value,
		} );
		setConditionalLogicAttribute( 'rules', newRules );
	};

	const count = theRules.length;
	return (
		<div className="noptin-conditional-logic-rules">
			{theRules.map( ( rule, index ) => (
				<ConditionalLogicRule
					key={ index }
					rule={rule}
					updateRule={ ( key, value ) => updateRule( index, key, value ) }
					removeRule={ () => removeRule( index ) }
					availableConditionTypes={ availableConditionTypes }
					isLastRule={ index === count - 1 }
					conditionType={ conditionType }
					comparisons={ comparisons || [] }
				/>
			) )}
			<Button
				className="noptin-add-conditional-rule"
				onClick={ addRule }
				variant="secondary"
			>
				{ 0 === count ? __( 'Add a rule', 'hizzlewp' ) : __( 'Add another rule', 'hizzlewp' )}
			</Button>
		</div>
	);
}

/**
 * Conditional logic props.
 */
interface conditionalLogicProps extends MergeTagsProps {

	/**
	 * The conditions change handler.
	 */
	onChange: (conditionalLogic: ConditionalLogic ) => void;

	/**
	 * The current value.
	 */
	value: ConditionalLogic;

	/**
	 * The current setting object.
	 */
	setting: Setting;

    /**
     * Optional class name.
     */
    className?: string;

}

/**
 * Displays the conditional logic editor.
 *
 */
const ConditionalLogicEditor: FC<conditionalLogicProps> = ({ onChange, value, setting, availableSmartTags, className }) => {

	// If value is not an Object, set it to the default.
	if ( typeof value !== 'object' ) {
		value = {
			enabled: false,
			action: 'allow',
			rules: [{condition: 'is', type: 'date', value: ''}],
			type: 'all',
		};
	}

	// Sets conditional logic attribute.
	const setConditionalLogicAttribute = ( prop: string, val: any ) => {
		onChange( {
			...value,
			[ prop ]: val,
		} );
	};

	return (
		<div className={ className }>
			<ToggleControl
				checked={ value.enabled ? true : false }
				onChange={ ( val ) => setConditionalLogicAttribute( 'enabled', val ) }
				className="hizzle-component__field"
				label={ setting.toggleLabel }
				__nextHasNoMarginBottom
			/>

			{ value.enabled && (
				<>

					<ConditionalLogicTypeSelector
						ruleCount={ value.rules ? value.rules.length : 0 }
						type={ value.type }
						action={ value.action }
                        ifOptions={ setting.ifOptions }
						setConditionalLogicAttribute={ setConditionalLogicAttribute }
					/>

					<ConditionalLogicRules
						rules={ value.rules }
						conditionType={ value.type }
						comparisons={ setting.comparisons }
						availableSmartTags={ availableSmartTags }
						setConditionalLogicAttribute={ setConditionalLogicAttribute }
					/>
				</>
			)}
		</div>
	);
}

export default ConditionalLogicEditor;
