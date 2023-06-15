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
     * @return {Object} Action.
     */
    getRecords(queryString: string): Generator<Object, import("./types").Action, unknown>;
    /**
     * Fetches a record from the API.
     *
     * @return {Object} Action.
     */
    getRecord(id: number): Generator<{
        type: string; /**
         * Fetches the records from the API.
         *
         * @return {Object} Action.
         */
        request: import("@wordpress/api-fetch/build-types/types").APIFetchOptions;
    }, import("./types").Action, unknown>;
    /**
     * Fetch the collection schema from the API.
     *
     * @return {Object} Action.
     */
    getSchema(): Generator<{
        type: string; /**
         * Fetches the records from the API.
         *
         * @return {Object} Action.
         */
        request: import("@wordpress/api-fetch/build-types/types").APIFetchOptions;
    }, import("./types").Action, unknown>;
    /**
     * Fetch a single record tab's content from the API.
     *
     * @return {Object} Action.
     */
    getTabContent(id: number, tab_id: string): Generator<{
        type: string; /**
         * Fetches the records from the API.
         *
         * @return {Object} Action.
         */
        request: import("@wordpress/api-fetch/build-types/types").APIFetchOptions;
    }, import("./types").Action, unknown>;
    /**
     * Retrieves a single record's overview data.
     *
     * @return {Object} Action.
     */
    getRecordOverview(id: number): Generator<{
        type: string; /**
         * Fetches the records from the API.
         *
         * @return {Object} Action.
         */
        request: import("@wordpress/api-fetch/build-types/types").APIFetchOptions;
    }, import("./types").Action, unknown>;
};
