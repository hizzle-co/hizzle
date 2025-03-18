/**
 * External dependencies
 */
import type { smartTag } from '../hooks';

/**
 * Returns a merge tag's value.
 *
 */
export const getMergeTagValue = (smartTag: smartTag) => {
	if (smartTag.example) {
		return smartTag.example;
	}

	if (!smartTag.default) {
		return `${smartTag.smart_tag}`;
	}

	return `${smartTag.smart_tag} default="${smartTag.default}"`;
};
