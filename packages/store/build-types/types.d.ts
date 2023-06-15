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
    [key: string]: {
        label: string;
        value: any;
    };
};
/**
 * A map of record ids keyed by query.
 */
export type RecordIDs = {
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
export type PartialRecords = {
    [query: string]: {
        /**
         * The partial record data.
         */
        items: RecordDescriptor[];
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
export type TabContent = {
    [id: number]: {
        [tabName: string]: Object;
    };
};
/**
 * Record overview is a map of record overview areas keyed by record ID.
 */
export type RecordOverview = {
    /**
     * Type of component to render.
     */
    type: string;
    /**
     * In case the componet is stat_cards...
     */
    cards?: {
        /**
         * The title of the card.
         */
        title: string;
        /**
         * The value of the card.
         */
        value: string | number;
    }[];
    /**
     * In case the component is a action_links...
     */
    links?: {
        /**
         * The label of the link.
         */
        label: string;
        /**
         * The value, can be a URL or any other string.
         */
        value: string;
        /**
         * Optional action to perform when the link is clicked.
         *
         * If not provided, the link will be opened in a new tab.
         */
        action?: string;
    }[];
};
/**
 * Represents a single collection field.
 */
type SchemaField = {
    /**
     * The name of the field, e.g, phone.
     */
    name: string;
    /**
     * The label of the field, e.g, Phone.
     */
    label: string;
    /**
     * The description of the field.
     */
    description: string;
    /**
     * The maximum length of the field.
     * If null, the field has no maximum length.
     */
    length: number | null;
    /**
     * Whether the field can be null.
     * If true, the field can be null.
     * If false, the field cannot be null.
     */
    nullable: boolean;
    /**
     * The default value of the field.
     * If null, the field has no default value.
     */
    default: any | null;
    /**
     * The available options for the field.
     *
     * If an array or null the the field has no options.
     */
    enum: any[] | object | null;
    /**
     * Whether the field is readonly.
     */
    readonly: boolean;
    /**
     * Whether the field can have multiple values.
     */
    multiple: boolean;
    /**
     * Whether the field is dynamic.
     */
    is_dynamic: boolean;
    /**
     * Whether the field only accepts boolean values.
     */
    is_boolean: boolean;
    /**
     * Whether the field only accepts numeric values.
     */
    is_numeric: boolean;
    /**
     * Whether the field only accepts float values.
     */
    is_float: boolean;
    /**
     * Whether the field only accepts dates values.
     */
    is_date: boolean;
};
/**
 * Represents a single route.
 */
type Route = {
    /**
     * The ID of the component to render.
     */
    component: string;
    /**
     * An optional tip to display.
     */
    tip?: string;
    /**
     * The route title.
     */
    title: string;
    /**
     * An optional flag to indicate whether to hide the route from the navigation.
     */
    hide?: boolean;
};
/**
 * Represents a single collection schema.
 */
export type Schema = {
    /**
     * A list of fields in the schema.
     */
    schema: SchemaField[];
    /**
     * An array of fields to ignore.
     */
    ignore: string[];
    /**
     * An array of fields to hide from the table by default.
     */
    hidden: string[];
    /**
     * A map of routes keyed by route name.
     */
    routes: {
        [route: string]: Route;
    };
    /**
     * A map containing custom labels.
     */
    labels: {
        /**
         * The plural name of the collection, e.g, Subscribers.
         */
        name?: string;
        /**
         * The singular name of the collection, e.g, Subscriber.
         */
        singular_name?: string;
        /**
         * The label to use on the add new button, e.g, Add New.
         */
        add_new?: string;
        /**
         * The label to use on the add new card, e.g, Add New Subscriber.
         */
        add_new_item?: string;
        /**
         * The label to use on the edit card, e.g, Edit Subscriber.
         */
        edit_item?: string;
        /**
         * The label to use on the new card, e.g, New Subscriber.
         */
        new_item?: string;
        /**
         * The label to use on the view card, e.g, View Subscriber.
         */
        view_item?: string;
        /**
         * The label to use on the overview page, e.g, View Subscribers.
         */
        view_items?: string;
        /**
         * The label to use on the search form, e.g, Search Subscribers.
         */
        search_items?: string;
        /**
         * The label to use on the not found page, e.g, No Subscribers Found.
         */
        not_found?: string;
    };
    /**
     * The ID property of the collection.
     */
    id_prop: string;
    /**
     * An object containing the tabs to display on the edit page.
     */
    tabs: {
        [tabName: string]: {
            /**
             * The id of component to render.
             */
            component: string;
            /**
             * The title of the tab.
             */
            title: string;
            /**
             * The table headers, in case component is a table.
             */
            headers?: {
                label: string;
                value: any;
            }[];
            /**
             * The empty message to display if the table is empty.
             */
            emptyMessage?: string;
        };
    };
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
    schema: Schema;
    tabContent: {
        [recordIdTabId: string]: any;
    };
    recordOverview: {
        [id: number]: RecordOverview[];
    };
}
export {};
