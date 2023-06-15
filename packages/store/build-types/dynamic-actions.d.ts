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
    createRecord(data: any, dispatch: any): any;
    /**
     * Updates a record.
     *
     * @param {string} id
     * @param {Object} data
     * @return {Object} Action.
     */
    updateRecord(id: string, data: any, dispatch: any): any;
    /**
     * Deletes a record.
     *
     * @param {string} id
     * @return {Object} Action.
     */
    deleteRecord(id: string, dispatch: any): any;
    /**
     * Deletes multiple records.
     *
     * @param {string} queryString
     * @return {Object} Action.
     */
    deleteRecords(queryString: string, dispatch: any): any;
    /**
     * Empties the cache.
     *
     * @param {string} queryString
     * @return {Object} Action.
     */
    emptyCache(dispatch: any): any;
};
