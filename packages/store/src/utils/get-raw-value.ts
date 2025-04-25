/**
 * Returns the raw value of a record.
 *
 * @param {Object} record The record to get the value from.
 * @param {string} key The key of the record property to retrieve. Leave blank if record is already a value.
 * @return {any} The raw value of the record.
 */
export const getRawValue = ( record: Record<string, any> | null | undefined, key: string | undefined = undefined ): any => {
	if ( !record ) {
		return undefined;
	}

	const value = key ? record[ key ] : record;
	if ( value && typeof value === 'object' && 'raw' in value ) {
		return value.raw;
	}

	return value;
}
