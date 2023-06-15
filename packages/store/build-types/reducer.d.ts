export function reducer(state: import("./types").StateDescriptor | undefined, action: any): {
    records: {
        [x: number]: any;
    };
    recordIDs: {
        [query: string]: {
            items: number[];
            summary: import("./types").Summary;
            total: number;
        };
    };
    partialRecords: {
        [query: string]: {
            [id: number]: import("./types").RecordDescriptor;
        };
    };
    schema: any;
    tabContent: {
        [id: number]: {
            [tabName: string]: Object;
        };
    };
    recordOverview: {
        [id: number]: any;
    };
};
