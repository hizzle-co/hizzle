export function getRecordIDs(state: import("./types").StateDescriptor | undefined, queryString: string): any[] | null;
export function getQueryTotal(state: import("./types").StateDescriptor | undefined, queryString: string): number;
export function getQuerySummary(state: import("./types").StateDescriptor | undefined, queryString: string): any;
export function getRecords(state: import("./types").StateDescriptor | undefined, queryString: string): any[] | null;
export function getRecord(state: import("./types").StateDescriptor | undefined, id: string): any | null;
export function getSchema(state?: import("./types").StateDescriptor): any | null;
export function getTabContent(state: import("./types").StateDescriptor | undefined, id: string, tab_id: string): any;
export function getRecordOverview(state: import("./types").StateDescriptor | undefined, id: string): any;
