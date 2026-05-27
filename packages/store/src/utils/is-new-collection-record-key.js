/**
 * Returns whether the given key identifies a new (unsaved) collection record.
 *
 * A key is considered "new" when it is a non-numeric string – that is, any
 * string that cannot be interpreted as a positive integer.  Consumers use
 * such keys (e.g. `'new'`, a UUID, etc.) to track draft records in the store
 * before they are persisted to the server.
 *
 * @param {string|number} key The record key to test.
 * @return {boolean} `true` if the key represents an unsaved record.
 */
export default function isNewCollectionRecordKey( key ) {
	return typeof key === 'string' && !/^\s*\d+\s*$/.test( key );
}
