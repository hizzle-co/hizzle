import type { UndoManager } from '@wordpress/undo-manager';

export type AnyFunction = ( ...args: any[] ) => any;

/**
 * A prop / field of a record.
 */
export type RecordProp = {
	/**
	 * The prop name, e.g first_name
	 */
	name: string;

	/**
	 * The prop label, e.g First Name
	 */
	label: string;

	/**
	 * Description or help text for the prop
	 */
	description: string;

	/**
	 * Whether the prop can be null
	 */
	nullable: boolean;

	/**
	 * The default value of the prop
	 */
	default?: any;

	/**
	 * The possible values of the prop
	 */
	enum?: string[] | Record<string, string>;

	/**
	 * Whether the prop is read-only
	 */
	readonly: boolean;

	/**
	 * Whether the prop can have multiple values
	 */
	multiple?: boolean;

	/**
	 * Whether the prop is dynamic,
	 * i.e. whether it's a computed value
	 */
	is_dynamic: boolean;

	/**
	 * Whether the prop is a boolean
	 */
	is_boolean: boolean;

	/**
	 * Whether the prop is a number
	 */
	is_numeric: boolean;

	/**
	 * Whether the prop is a float
	 */
	is_float: boolean;

	/**
	 * Whether the prop is a date
	 */
	is_date: boolean;

	/**
	 * Whether the prop is a textarea
	 */
	is_textarea: boolean;

	/**
	 * Whether the prop is saved as a meta field.
	 */
	is_meta: boolean;

	/**
	 * Whether the prop is a token field e.g tags.
	 */
	is_tokens: boolean;

	/**
	 * Additional JS props for the prop.
	 */
	js_props?: Record<string, any>;

	/**
	 * Suggestions for the prop, if it's a token field.
	 */
	suggestions?: string[];
}

/**
 * The config of a collection.
 */
export type CollectionConfig = {
	/**
	 * The properties of the collection.
	 */
	props: RecordProp[];

	/**
	 * The properties to ignore.
	 */
	ignore: string[];

	/**
	 * The properties to hide (from the edit screen).
	 */
	hidden: string[];

	/**
	 * Additional routes for the collection.
	 */
	routes: {
		[ route: string ]: {
			/**
			 * The title shown in the admin menu.
			 */
			title: string;
		};
	};

	/**
	 * The labels for the collection.
	 */
	labels: {
		/**
		 * The name of the collection, e.g, Subscribers.
		 */
		name?: string;

		/**
		 * The singular name of the collection, e.g, Subscriber.
		 */
		singular_name?: string;

		/**
		 * The add new text, e.g, Add New.
		 */
		add_new?: string;

		/**
		 * The add new item text, e.g, Add New Subscriber.
		 */
		add_new_item?: string;

		/**
		 * The edit item text, e.g, Edit Subscriber.
		 */
		edit_item?: string;

		/**
		 * The new item text, e.g, New Subscriber.
		 */
		new_item?: string;

		/**
		 * The view item text, e.g, View Subscriber.
		 */
		view_item?: string;

		/**
		 * The view items text, e.g, View Subscribers.
		 */
		view_items?: string;

		/**
		 * The search items text, e.g, Search Subscribers.
		 */
		search_items?: string;

		/**
		 * The not found text, e.g, No subscribers found.
		 */
		not_found?: string;

		/**
		 * The import text, e.g, Import Subscribers.
		 */
		import?: string;
	};

	/**
	 * The extra setting fields for the collection.
	 */
	settings: Record<string, any> | null;

	/**
	 * The key of the collection.
	 */
	key: string;

	/**
	 * The namespace of the collection, e.g, noptin.
	 */
	namespace: string;

	/**
	 * The collection name, e.g, subscribers.
	 */
	collection: string;

	/**
	 * The singular name of the collection, e.g, subscriber.
	 */
	singular_name: string;

	/**
	 * The base URL of the collection.
	 */
	baseURL: string;

	/**
	 * Default params added to the base URL when fetching data.
	 */
	baseURLParams: Record<string, any>;

	/**
	 * Edits that do not persist in the database.
	 */
	transientEdits: Record<string, any>;

	/**
	 * Edits that are merged before being saved to the database.
	 */
	mergedEdits: Record<string, any>;

	/**
	 * The primary property of the entity, e.g, email.
	 */
	id_prop: string;

	/**
	 * Whether the collection supports pagination.
	 */
	supportsPagination: boolean;

	/**
	 * Extra properties for the collection.
	 */
	[ extra: string ]: any;
};

/**
 * Interface for the state of an API request.
 */
export type API_STATE = {
	/**
	 * Whether the request is pending.
	 */
	pending: boolean;

	/**
	 * The error that occurred during the request.
	 */
	error: Error;
};

/**
 * The key for collection records. Usually a number if the key field is 'id'.
 */
export type CollectionRecordKey = string | number;

/**
 * The REST API context parameter.
 */
export type API_CONTEXT = 'view' | 'edit';

/**
 * The type of a collection record.
 */
export type CollectionRecord = Record<string, any>;

/**
 * This is an incomplete, high-level approximation of the State type.
 */
export interface State {
	/**
	 * The different collections.
	 */
	collections: {
		/**
		 * The collection configs, grouped by namespace and collection name.
		 */
		config: {
			[ namespace: string ]: {
				[ collection: string ]: CollectionConfig;
			};
		};

		/**
		 * Collection records grouped by the namespace and collection name.
		 *
		 * @example
		 *
		 * ```ts
		 * // returns state.collections.records.noptin.subscribers
		 * const records = getCollectionRecords( state, 'noptin', 'subscribers' );
		 * ```
		 */
		records: {
			[ namespace: string ]: {
				/**
				 * Each record is grouped by collection name.
				 */
				[ collection: string ]: {
					/**
					 * Record of edits for the entity, keyed by entity ID.
					 */
					edits: Record<CollectionRecordKey, Partial<CollectionRecord>>;

					/**
					 * Record of saving states for the entity, keyed by entity ID.
					 */
					saving: Record<
						CollectionRecordKey,
						Partial<API_STATE>
					>;

					/**
					 * Record of deleting states for the entity, keyed by entity ID.
					 */
					deleting: Record<CollectionRecordKey, Partial<API_STATE>>;

					/**
					 * Data for entity queries.
					 */
					queriedData: {
						/**
						 * Items returned by queries, grouped by context and item ID.
						 */
						items: Record<API_CONTEXT, Record<CollectionRecordKey, CollectionRecord>>;

						/**
						 * Tracks whether an item has all its fields or is incomplete, grouped by context and item ID.
						 */
						itemIsComplete: Record<API_CONTEXT, Record<CollectionRecordKey, boolean>>;

						/**
						 * Query results as arrays of item IDs, grouped by context and query string.
						 */
						queries: {
							[ context: string ]: {
								[ query: string ]: {
									itemIds: CollectionRecordKey[];
									meta: Record<string, any>;
								};
							};
						};
					};
				};
			}
		};
	};

	/**
	 * The undo manager.
	 */
	undoManager: UndoManager;

	/**
	 * The user permissions.
	 */
	userPermissions: Record<string, boolean>;

	/**
	 * A reference to the edits.
	 */
	editsReference: Record<string, any>;
}
