/**
 * Creates resolvers for the store.
 * @param {string} namespace The namespace.
 * @param {string} collection The collection.
 * @link https://unfoldingneurons.com/2020/wordpress-data-store-properties-resolvers
 */
export default function createResolvers(namespace: string, collection: string): {
    /**
     * Fetches the records from the API.
     *
     * @param {String} queryString
     * @return {Object} Action.
     */
    getRecords(queryString: string): any;
    /**
     * Fetches a record from the API.
     *
     * @param {string} id
     * @return {Object} Action.
     */
    getRecord(id: string): any;
    /**
     * Fetch the collection schema from the API.
     *
     * @return {Object} Action.
     */
    getSchema(): any;
    /**
     * Fetch a single record tab's content from the API.
     *
     * @param {string} id
     * @param {string} tab_id
     * @return {Object} Action.
     */
    getTabContent(id: string, tab_id: string): any;
    /**
     * Retrieves a single record's overview data.
     *
     * @param {string} id
     * @return {Object} Action.
     */
    getRecordOverview(id: string): any;
};
