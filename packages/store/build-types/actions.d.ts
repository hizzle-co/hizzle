export { apiFetch } from '@wordpress/data-controls';
type RecordDescriptor = import('./types').RecordDescriptor;
type Action = import('./types').Action;
type Schema = import('./types').Schema;
type RecordOverview = import('./types').RecordOverview;
/**
 * Sets partial records.
 *
 * @param {RecordDescriptor[]} records
 * @param {string} queryString
 * @return {Action} Action.
 */
export declare const setPartialRecords: (records: RecordDescriptor[], queryString: string) => Action;
/**
 * Sets new records.
 *
 * @param {RecordDescriptor} records
 * @param {string} queryString
 * @return {Action} Action.
 */
export declare const setRecords: (records: RecordDescriptor[], queryString: string) => Action;
/**
 * Sets a new record.
 *
 * @param {RecordDescriptor} record
 * @return {Action} Action.
 */
export declare const setRecord: (record: RecordDescriptor) => Action;
/**
 * Sets the collection schema.
 *
 * @param {Schema} schema
 * @return {Action} Action.
 */
export declare const setSchema: (schema: Schema) => Action;
/**
 * Before deleting a record.
 *
 * @param {number} id
 * @return {Action} Action.
 */
export declare const beforeDeleteRecord: (id: number) => Action;
/**
 * Sets a single record's schema.
 *
 * @param {number} id
 * @param {string} tab_id
 * @param {any} content
 * @return {Action} Action.
 */
export declare const setTabContent: (id: number, tab_id: string, content: any) => Action;
/**
 * Sets a single record's overview.
 *
 * @param {number} id
 * @param {RecordOverview} overview
 * @return {Action} Action.
 */
export declare const setRecordOverview: (id: number, overview: RecordOverview) => Action;
