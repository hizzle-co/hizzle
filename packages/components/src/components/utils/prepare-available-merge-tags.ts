import { smartTag } from '../hooks';
import { getNestedValue } from '.';

/**
 * Returns a list of available smart tags.
 *
 * @param {Record<string, any>} smartTags - The smart tags to prepare.
 * @param {Record<string, any>} savedSettings - The saved settings to use for conditional logic.
 * @return {smartTag[]} The prepared smart tags.
 */
export function prepareAvailableSmartTags(
	smartTags: Record<string, any>,
	savedSettings: Record<string, any> = {}
): smartTag[] {
	const tags: smartTag[] = [];

	if (!smartTags) {
		return tags;
	}

	Object.keys(smartTags).forEach((key) => {
		const smartTag = smartTags[key];

		// Abort if the smartTag is hidden.
		if (smartTag.hidden) {
			return;
		}

		// Check if conditions have been met.
		if (smartTag.conditions) {
			// Check if all conditions have been met.
			const condition_matched = smartTag.conditions.every((condition) => {
				let matched = false;
				const savedValue = getNestedValue(savedSettings, condition.key);

				if (Array.isArray(condition.value)) {
					matched = condition.value.some((val) => val == savedValue);
				} else {
					matched = condition.value == savedValue;
				}

				const should_match = condition.operator === 'is';

				return matched === should_match;
			});

			if (!condition_matched) {
				return;
			}
		}

		let label = key;

		if (smartTag.label) {
			label = smartTag.label;
		} else if (smartTag.description) {
			label = smartTag.description;
		}

		tags.push({
			...smartTag,
			smart_tag: key,
			label,
			example: smartTag.example ? smartTag.example : '',
			description: smartTag.description ? smartTag.description : '',
			placeholder: smartTag.placeholder ? smartTag.placeholder : '',
			conditional_logic: smartTag.conditional_logic
				? smartTag.conditional_logic
				: false,
			options: smartTag.options ? smartTag.options : [],
		});
	});

	return tags;
}
