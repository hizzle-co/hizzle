/**
 * External dependencies
 */
import { getQueryArg } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { DEFAULT_STATE } from './default';

type StateDescriptor = import( './types' ).StateDescriptor;
type RecordDescriptor = import( './types' ).RecordDescriptor;
type Summary = import( './types' ).Summary;
type Schema = import( './types' ).Schema;
type RecordOverview = import( './types' ).RecordOverview;

/**
 * Retrieves record IDs.
 *
 * @param {string} queryString
 * @return {number[]} Records.
 */
export const getRecordIDs = ( state: StateDescriptor, queryString: string ): number[] => {
    queryString = queryString === '' ? 'all' : queryString;

    // Check if records are already loaded.
    if ( Array.isArray( state.recordIDs[queryString]?.items ) ) {
        return state.recordIDs[queryString].items;
    }

    return [];
};

/**
 * Retrieves query total.
 *
 * @param {string} queryString
 * @return {number} Total Records.
 */
export const getQueryTotal = ( state: StateDescriptor, queryString: string ): number => {
    queryString = queryString === '' ? 'all' : queryString;
    const total = state.recordIDs[queryString]?.total;

    return total ? total : 0;
};

/**
 * Retrieves query summary.
 *
 * @param {string} queryString
 * @return {Summary} Summary.
 */
export const getQuerySummary = ( state: StateDescriptor, queryString: string ): Summary => {
    queryString = queryString === '' ? 'all' : queryString;
    const querySummary = state.recordIDs[queryString]?.summary;

    return querySummary ? querySummary : {};
};

/**
 * Retrieves records.
 *
 * @param {string} queryString
 * @return {RecordDescriptor[]} Records.
 */
export const getRecords = ( state: StateDescriptor, queryString: string ): RecordDescriptor[] => {
    queryString = queryString === '' ? 'all' : queryString;
    const _fields = getQueryArg( queryString, '__fields' );

    // If we have fields, we need to use the partial records store.
    if ( _fields ) {
        return Array.isArray( state.partialRecords[queryString]?.items ) ? state.partialRecords[queryString]?.items : [];
    }

    // Check if records are already loaded.
    if ( !Array.isArray( state.recordIDs[queryString]?.items ) ) {
        return [];
    }

    // Loop through records to find the record.
    return state.recordIDs[queryString].items.map( ( id ) => state.records[id] );
};

/**
 * Retrieves a record.
 *
 * @param {number} id
 * @return {RecordDescriptor | null} Record.
 */
export const getRecord = ( state: StateDescriptor, id: number ): RecordDescriptor | null => state.records[id] || null;

/**
 * Retrieves the schema for the collection.
 *
 * @return {StateDescriptor.schema} schema.
 */
export const getSchema = ( state: StateDescriptor ): Schema => state.schema || DEFAULT_STATE.schema;

/**
 * Retrieves a single record tab's content.
 *
 * @param {string} id
 * @param {string} tab_id
 * @return {any} Tab content.
 */
export const getTabContent = ( state: StateDescriptor, id: string, tab_id: string ): JSX.Element => state.tabContent[`${id}_${tab_id}`] || {};

/**
 * Retrieves a single record's overview data.
 *
 * @param {number} id
 * @return {RecordOverview[]} Record overview data.
 */
export const getRecordOverview = ( state: StateDescriptor, id: number ): any[] => state.recordOverview[id] || [];
