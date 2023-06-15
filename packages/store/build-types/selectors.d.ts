type StateDescriptor = import('./types').StateDescriptor;
type RecordDescriptor = import('./types').RecordDescriptor;
type Summary = import('./types').Summary;
type Schema = import('./types').Schema;
/**
 * Retrieves record IDs.
 *
 * @param {string} queryString
 * @return {number[]} Records.
 */
export declare const getRecordIDs: (state: StateDescriptor, queryString: string) => number[];
/**
 * Retrieves query total.
 *
 * @param {string} queryString
 * @return {number} Total Records.
 */
export declare const getQueryTotal: (state: StateDescriptor, queryString: string) => number;
/**
 * Retrieves query summary.
 *
 * @param {string} queryString
 * @return {Summary} Summary.
 */
export declare const getQuerySummary: (state: StateDescriptor, queryString: string) => Summary;
/**
 * Retrieves records.
 *
 * @param {string} queryString
 * @return {RecordDescriptor[]} Records.
 */
export declare const getRecords: (state: StateDescriptor, queryString: string) => RecordDescriptor[];
/**
 * Retrieves a record.
 *
 * @param {number} id
 * @return {RecordDescriptor | null} Record.
 */
export declare const getRecord: (state: StateDescriptor, id: number) => RecordDescriptor | null;
/**
 * Retrieves the schema for the collection.
 *
 * @return {StateDescriptor.schema} schema.
 */
export declare const getSchema: (state: StateDescriptor) => Schema;
/**
 * Retrieves a single record tab's content.
 *
 * @param {string} id
 * @param {string} tab_id
 * @return {any} Tab content.
 */
export declare const getTabContent: (state: StateDescriptor, id: string, tab_id: string) => JSX.Element;
/**
 * Retrieves a single record's overview data.
 *
 * @param {number} id
 * @return {RecordOverview[]} Record overview data.
 */
export declare const getRecordOverview: (state: StateDescriptor, id: number) => any[];
export {};
