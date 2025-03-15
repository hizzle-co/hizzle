/**
 * Fetches a nested value from an object.
 *
 * @param obj - The object to fetch the value from.
 * @param path - The nested path as an array of keys.
 */
export const getNestedValue = ( obj: Record<string, unknown>, path: string | string[] | undefined ): unknown => {
    // Return undefined if path is empty or null
    if ( !path || path.length === 0 ) {
        return undefined;
    }

    // Convert string path to array by splitting on periods (e.g., "user.address.city" -> ["user", "address", "city"])
    if ( typeof path === 'string' ) {
        path = path.split( '.' );
    }

    // Return undefined if path is empty after splitting or if obj is not a valid object
    if ( path.length === 0 || !obj || typeof obj !== 'object' ) {
        return undefined;
    }

    // Destructure the path into the current key and the remaining path
    const [ currentKey, ...remainingPath ] = path;

    // If we've reached the end of the path, return the value at the current key
    if ( remainingPath.length === 0 ) {
        return obj[ currentKey ];
    }

    // Otherwise, recursively traverse deeper into the object
    return getNestedValue( obj[ currentKey ] as Record<string, unknown>, remainingPath );
}
