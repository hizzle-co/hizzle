/**
 * Updates a value of any nested path in an object.
 *
 * @param obj - The object to update.
 * @param path - The nested path as an array of keys.
 * @param value - The new value.
 * @returns {Record<string, unknown>} - The updated object.
 */
export const updateNestedValue = (
	obj: Record<string, unknown>,
	path: string[] | string,
	value: unknown
): Record<string, unknown> => {
	// Return the original object if path is empty or invalid
	if (!path || path.length === 0) {
		return obj;
	}

	// If path is a string, split it on periods to create an array of keys
	if (typeof path === 'string') {
		path = path.split('.');
	}

	// Destructure the path into the current key and the remaining path
	const [currentKey, ...remainingPath] = path;

	// If we've reached the end of the path, update the value at the current key
	if (remainingPath.length === 0) {
		return {
			...obj, // Preserve all existing properties
			[currentKey]: value, // Update or add the value at the current key
		};
	}

	// If we haven't reached the end of the path, recursively update the nested object
	return {
		...obj, // Preserve all existing properties
		[currentKey]: updateNestedValue(
			(obj[currentKey] || {}) as Record<string, unknown>, // Use existing object or create a new one
			remainingPath, // Continue with the remaining path
			value // Pass the value to be set at the end of the path
		),
	};
};
