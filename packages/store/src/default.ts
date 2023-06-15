type StateDescriptor = import('./types').StateDescriptor;

export const DEFAULT_STATE: StateDescriptor = {
    recordIDs: {},
    records: {},
    partialRecords: {},
    schema: {
		schema: [],
		hidden: [],
		ignore: [],
		routes: {},
		labels: {},
		id_prop: 'id',
		tabs: {},
	},
    tabContent: {},
    recordOverview: {},
};
