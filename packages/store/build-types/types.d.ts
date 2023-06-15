/**
 * A single record in a data store.
 */
export interface RecordDescriptor {
    /**
     * Record ID.
     */
    id: number;
    [key: string]: any;
}
/**
 * Summary is an array of objects containing key and value properties.
 */
export type Summary = {
    key: string;
    value: string;
}[];
/**
 * A map of record ids keyed by query.
 */
type RecordIDs = {
    [query: string]: {
        /**
         * The record IDs.
         */
        items: number[];
        /**
         * The summary to display below the table.
         */
        summary: Summary;
        /**
         * The total number of records that match the query.
         */
        total: number;
    };
};
type PartialRecords = {
    [query: string]: {
        [id: number]: RecordDescriptor;
    };
};
type TabContent = {
    [id: number]: {
        [tabName: string]: Object;
    };
};
type RecordOverview = {
    [id: number]: any;
};
/**
 * State descriptor.
 */
export interface StateDescriptor {
    recordIDs: RecordIDs;
    records: {
        [id: number]: RecordDescriptor;
    };
    partialRecords: PartialRecords;
    schema: any;
    tabContent: TabContent;
    recordOverview: RecordOverview;
}
export {};
