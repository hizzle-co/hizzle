/**
 * Returns an action object used in signalling that entity records have been
 * deleted and they need to be removed from entities state.
 *
 * @param {string}              kind            Kind of the removed entities.
 * @param {string}              name            Name of the removed entities.
 * @param {Array|number|string} records         Record IDs of the removed entities.
 * @param {boolean}             invalidateCache Controls whether we want to invalidate the cache.
 * @return {Object} Action object.
 */
export function removeItems( kind, name, records, invalidateCache = false ) {
	return {
		type: 'REMOVE_ITEMS',
		itemIds: Array.isArray( records ) ? records : [ records ],
		kind,
		name,
		invalidateCache,
	};
}
