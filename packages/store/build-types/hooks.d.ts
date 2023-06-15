/**
 * Uses the specified store.
 *
 * @param {String} namespace
 * @param {String} collection
 * @return {Object} The store.
 */
export function useStore(namespace: string, collection: string): any;
/**
 * Resolves the specified record.
 *
 * @param {String} namespace
 * @param {String} collection
 * @param {Number} recordId ID of the requested record.
 * @return {Object} The record resolution.
 */
export function useRecord(namespace: string, collection: string, recordId: number): any;
/**
 * Resolves the specified record's schema.
 *
 * @param {String} namespace
 * @param {String} collection
 * @param {Object} recordId ID of the requested record.
 * @param {String} tabID ID of the requested tab.
 * @return {Object} The records resolution.
 */
export function useTabContent(namespace: string, collection: string, recordId: any, tabID: string): any;
/**
 * Resolves the specified record's overview.
 *
 * @param {String} namespace
 * @param {String} collection
 * @param {Object} recordId ID of the requested record.
 * @return {Object} The records resolution.
 */
export function useRecordOverview(namespace: string, collection: string, recordId: any): any;
/**
 * Resolves the specified records.
 *
 * @param {String} namespace
 * @param {String} collection
 * @param {Object} queryArgs Query arguments.
 * @return {Object} The records resolution.
 */
export function useRecords(namespace: string, collection: string, queryArgs?: any): any;
/**
 * Resolves the store schema.
 *
 * @param {String} collection
 * @param {Object} queryArgs Query arguments.
 * @return {Object} The records resolution.
 */
export function useSchema(namespace: any, collection: string): any;
