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
export const getMergeTagValue = ( smartTag: smartTag ): string => {
	if ( smartTag.example ) {
		return smartTag.example;
	}

	if ( !smartTag.default ) {
		return `${ smartTag.smart_tag }`;
	}

	return `${ smartTag.smart_tag } default="${ smartTag.default }"`;
};

/**
 * Converts merge tag attributes into a complete merge tag.
 */
export const attributesToMergeTag = (
	attributes: Record<string, unknown>,
	mergeTag: string
): string => {
	let attributesString = '';

	if ( attributes ) {
		Object.entries( attributes || {} ).forEach( ( [ key, value ] ) => {
			if ( value === '' || value === null || value === undefined ) {
				return;
			}

			// Convert boolean values to 1 or 0.
			if ( typeof value === 'boolean' ) {
				value = value ? 1 : 0;
			}

			// Do not add quotes to numeric values.
			attributesString +=
				typeof value === 'number'
					? ` ${ key }=${ value }`
					: ` ${ key }="${ String( value ).replaceAll( '"', '&quot;' ) }"`;
		} );
	}

	return `[[${ mergeTag }${ attributesString }]]`;
};
