/**
 * External dependencies
 */
import type { smartTag } from '../hooks';

/**
 * Returns a merge tag's value.
 *
 * @param {smartTag} smartTag - The smart tag to get the value of.
 * @returns {string} The value of the smart tag.
 */
export const getMergeTagValue = (smartTag: smartTag): string => {
	if (smartTag.example) {
		return smartTag.example;
	}

	if (!smartTag.default) {
		return `${smartTag.smart_tag}`;
	}

	return `${smartTag.smart_tag} default="${smartTag.default}"`;
};
