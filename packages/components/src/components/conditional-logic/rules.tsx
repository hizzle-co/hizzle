/**
 * External dependencies
 */
import React, { useCallback, useMemo } from 'react';

/**
 * WordPress dependencies
 */
import { Button, __experimentalHStack as HStack } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Local dependencies
 */
import { useMergeTags, smartTag as SmartTagType } from '../hooks';
import { ConditionalLogicRule } from '.';
import type { ConditionalLogicRule as ConditionalLogicRuleType } from '.';

export interface ConditionalLogicRulesProps {
	/**
	 * The conditional logic rules.
	 */
	rules: ConditionalLogicRuleType[];

	/**
	 * The available comparison operators.
	 */
	comparisons: Record<string, any>;

	/**
	 * The available smart tags that can be used in conditional logic.
	 */
	availableSmartTags: SmartTagType[];

	/**
	 * Function to update a conditional logic attribute.
	 *
	 * @param attribute The attribute to update.
	 * @param value The new value for the attribute.
	 */
	setConditionalLogicAttribute: (attribute: string, value: any) => void;

	/**
	 * List of tag prefixes that should be disabled/unavailable.
	 */
	disableTags?: string[];

	/**
	 * List of smart tag properties that, if present and truthy, will cause the tag to be disabled.
	 */
	disableProps?: string[];

	/**
	 * Function to close the modal when needed.
	 */
	closeModal?: () => void;
}

/**
 * Displays the available conditional logic rules.
 *
 */
export const ConditionalLogicRules: React.FC<ConditionalLogicRulesProps> = (
	props
) => {
	const {
		rules,
		comparisons,
		availableSmartTags,
		setConditionalLogicAttribute,
		disableTags = [],
		disableProps = [],
		closeModal = undefined,
	} = props;

	// Filter available smart rules.
	const theRules = useMemo(() => {
		if (!Array.isArray(rules)) {
			return [];
		}

		return rules.filter((rule) => rule.type && rule.type !== '');
	}, [rules]);

	// Filter available smart tags to only include those that support conditional logic.
	const filteredSmartTags = useMemo(() => {
		const types: Record<string, SmartTagType> = {};

		availableSmartTags.forEach((smartTag) => {
			if (smartTag.conditional_logic) {
				types[smartTag.smart_tag] = {
					...smartTag,
					type: smartTag.conditional_logic,
					isPremium:
						(Array.isArray(disableTags) &&
							disableTags.some((tag) =>
								smartTag.smart_tag.startsWith(tag)
							)) ||
						(Array.isArray(disableProps) &&
							disableProps.some((prop) => !!smartTag[prop])),
				};
			}
		});

		return types;
	}, [availableSmartTags]);

	/**
	 * Removes a rule from the conditional logic.
	 *
	 * @param {Number} index
	 */
	const removeRule = useCallback(
		(index) => {
			const newRules = [...theRules];
			newRules.splice(index, 1);
			setConditionalLogicAttribute('rules', newRules);
		},
		[theRules, setConditionalLogicAttribute]
	);

	/**
	 * Updates a rule in the conditional logic.
	 *
	 * @param {Number} index
	 * @param {String} key
	 * @param {String} value
	 */
	const updateRule = useCallback(
		(index, value) => {
			const newRules = [...theRules];

			newRules[index] = {
				...newRules[index],
				...value,
			};
			setConditionalLogicAttribute('rules', newRules);
		},
		[theRules, setConditionalLogicAttribute]
	);

	// Merge tags array.
	const mergeTagsArray = useMemo(
		() => Object.values(filteredSmartTags),
		[filteredSmartTags]
	);

	/**
	 * Adds a new conditional logic rule.
	 */
	const addRule = useCallback(
		(smartTag, full) => {
			const smartTagObject = filteredSmartTags[smartTag];
			const options = smartTagObject?.options || [];
			const placeholder = smartTagObject?.placeholder || '';
			let value =
				Array.isArray(options) && options.length
					? Object.keys(options)[0]
					: placeholder;

			// If the smartTag has a default value.
			if (smartTagObject?.default) {
				value = smartTagObject.default;
			}

			const newRules = [...theRules];
			newRules.push({
				type: smartTag,
				condition: 'is',
				full,
				value,
			});
			setConditionalLogicAttribute('rules', newRules);
		},
		[theRules]
	);

	// Button to add a new condition.
	const text =
		theRules.length === 0
			? __('Add a conditional logic rule', 'newsletter-optin-box')
			: __('Add another rule', 'newsletter-optin-box');
	const addCondition = useMergeTags({
		availableSmartTags: mergeTagsArray,
		onMergeTagClick: addRule,
		raw: true,
		icon: 'plus',
		label: text,
		text,
		toggleProps: { variant: 'primary' },
	});

	return (
		<>
			{theRules.map((rule, index) => (
				<ConditionalLogicRule
					key={index}
					rule={rule}
					index={index}
					updateRule={updateRule}
					removeRule={removeRule}
					comparisons={comparisons}
					availableSmartTags={filteredSmartTags}
					mergeTagsArray={mergeTagsArray}
				/>
			))}

			<HStack justify="flex-start" wrap>
				{addCondition}
				{closeModal && (
					<Button onClick={closeModal} variant="secondary">
						{__('Return to editor', 'newsletter-optin-box')}
					</Button>
				)}
			</HStack>
		</>
	);
};
