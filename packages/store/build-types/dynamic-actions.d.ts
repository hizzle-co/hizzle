/**
 * Creates dynamic actions for the store.
 * @param {string} namespace The namespace.
 * @param {string} collection The collection.
 * @link https://unfoldingneurons.com/2020/wordpress-data-store-properties-action-creator-generators
 */
export default function createDynamicActions(namespace: string, collection: string): {
    /**
     * Creates a record.
     *
     * @param {Object} data
     * @return {Object} Action.
     */
    createRecord(data: any, dispatch: any): Generator<any, import("./types").Action | undefined, unknown>;
    /**
     * Updates a record.
     *
     * @param {string} id
     * @param {Object} data
     * @return {Object} Action.
     */
    updateRecord(id: any, data: any, dispatch: any): Generator<any, any, unknown>;
    /**
     * Deletes a record.
     *
     * @param {string} id
     * @return {Object} Action.
     */
    deleteRecord(id: any, dispatch: any): Generator<any, {
        type: string;
        id: any;
    }, unknown>;
    /**
     * Deletes multiple records.
     *
     * @param {string} queryString
     * @return {Object} Action.
     */
    deleteRecords(queryString: any, dispatch: any): Generator<any, {
        type: string;
    }, unknown>;
    /**
     * Empties the cache.
     *
     * @param {string} queryString
     * @return {Object} Action.
     */
    emptyCache(dispatch: any): Generator<any, void, unknown>;
};
