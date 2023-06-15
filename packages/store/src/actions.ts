export { apiFetch } from '@wordpress/data-controls';

type RecordDescriptor = import( './types' ).RecordDescriptor;
type Action = import( './types' ).Action;
type Schema = import( './types' ).Schema;
type RecordOverview = import( './types' ).RecordOverview;


/**
 * Sets partial records.
 *
 * @param {RecordDescriptor[]} records
 * @param {string} queryString
 * @return {Action} Action.
 */
export const setPartialRecords = ( records: RecordDescriptor[], queryString: string ): Action => ( {
	type: 'SET_PARTIAL_RECORDS',
	records,
	queryString,
} );

/**
 * Sets new records.
 *
 * @param {RecordDescriptor} records
 * @param {string} queryString
 * @return {Action} Action.
 */
export const setRecords = ( records: RecordDescriptor[], queryString: string ): Action => ( {
	type: 'SET_RECORDS',
	records,
	queryString,
} );

/**
 * Sets a new record.
 *
 * @param {RecordDescriptor} record
 * @return {Action} Action.
 */
export const setRecord = ( record: RecordDescriptor ): Action => ( {
	type: 'SET_RECORD',
	record,
} );

/**
 * Sets the collection schema.
 *
 * @param {Schema} schema
 * @return {Action} Action.
 */
export const setSchema = ( schema: Schema ): Action => ( {
	type: 'SET_SCHEMA',
	schema,
} );

/**
 * Before deleting a record.
 *
 * @param {number} id
 * @return {Action} Action.
 */
export const beforeDeleteRecord = ( id: number ): Action => ( {
	type: 'BEFORE_DELETE_RECORD',
	id,
} );

/**
 * Sets a single record's schema.
 *
 * @param {number} id
 * @param {string} tab_id
 * @param {any} content
 * @return {Action} Action.
 */
export const setTabContent = ( id: number, tab_id: string, content: any ): Action => ( {
	type: 'SET_TAB_CONTENT',
	id,
	tab_id,
	content,
} );

/**
 * Sets a single record's overview.
 *
 * @param {number} id
 * @param {RecordOverview} overview
 * @return {Action} Action.
 */
export const setRecordOverview = ( id: number, overview: RecordOverview ): Action => ( {
	type: 'SET_RECORD_OVERVIEW',
	id,
	overview,
} );
