/**
 * Given a function, returns an enhanced function which caches the result and
 * tracks in WeakMap. The result is only cached if the original function is
 * passed a valid object-like argument (requirement for WeakMap key).
 *
 * @param {Function} fn Original function.
 *
 * @return {Function} Enhanced caching function.
 */
function withWeakMapCache<T extends ( key: any ) => any>( fn: T ): ( key: any ) => ReturnType<T> {
	const cache = new WeakMap();

	return ( key: any ): ReturnType<T> => {
		let value;
		if ( cache.has( key ) ) {
			value = cache.get( key );
		} else {
			value = fn( key );

			// Can reach here if key is not valid for WeakMap, since `has`
			// will return false for invalid key. Since `set` will throw,
			// ensure that key is valid before setting into cache.
			if ( key !== null && typeof key === 'object' ) {
				cache.set( key, value );
			}
		}

		return value;
	};
}

export default withWeakMapCache;
