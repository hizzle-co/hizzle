export function reducer(state: import("./types").StateDescriptor | undefined, action: any): {
    schema: any;
    recordIDs: import("./types").RecordIDs;
    records: {
        [id: number]: import("./types").RecordDescriptor;
    };
    partialRecords: import("./types").PartialRecords;
    tabContent: {
        [recordIdTabId: string]: any;
    };
    recordOverview: {
        [id: number]: import("./types").RecordOverview[];
    };
} | {
    records: {
        [x: number]: any;
    };
    recordIDs: import("./types").RecordIDs;
    partialRecords: import("./types").PartialRecords;
    schema: import("./types").Schema;
    tabContent: {
        [recordIdTabId: string]: any;
    };
    recordOverview: {
        [id: number]: import("./types").RecordOverview[];
    };
} | {
    recordOverview: {
        [x: number]: any;
    };
    recordIDs: import("./types").RecordIDs;
    records: {
        [id: number]: import("./types").RecordDescriptor;
    };
    partialRecords: import("./types").PartialRecords;
    schema: import("./types").Schema;
    tabContent: {
        [recordIdTabId: string]: any;
    };
};
