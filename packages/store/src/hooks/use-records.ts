/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import useQuerySelect from './use-query-select';
import { store as hizzleStore } from '..';
import type { Options } from '.';
import type { Status } from './constants';

interface EntityRecordsResolution< RecordType > {
	/** The requested entity record */
	records: RecordType[] | null;

	/**
	 * Is the record still being resolved?
	 */
	isResolving: boolean;

	/**
	 * Is the record resolved by now?
	 */
	hasResolved: boolean;

	/** Resolution status */
	status: Status;

	/**
	 * The total number of available items (if not paginated).
	 */
	totalItems: number | null;

	/**
	 * The total number of pages.
	 */
	totalPages: number | null;

	/** Error that occurred during resolution. */
	error?: Error;
}

const EMPTY_ARRAY = [];

/**
 * Resolves the specified collection records.
 *
 * @since 6.1.0 Introduced in WordPress core.
 *
 * @param    namespace   Namespace of the entity, e.g. `noptin`.
 * @param    collection  Collection of the entity, e.g. `subscribers`.
 * @param    queryArgs   Optional HTTP query description for how to fetch the data, passed to the requested API endpoint.
 * @param    options     Optional hook options.
 * @example
 * ```js
 * import { useRecords } from '@hizzlewp/store';
 *
 * function SubscribersList() {
 *   const { records, isResolving, error } = useRecords( 'noptin', 'subscribers' );
 *
 *   if ( isResolving ) {
 *     return 'Loading...';
 *   }
 *
 *   if ( error ) {
 *     return 'Error: ' + error.message;
 *   }
 *
 *   return (
 *     <ul>
 *       {records.map(( subscriber ) => (
 *         <li>{ subscriber.email }</li>
 *       ))}
 *     </ul>
 *   );
 * }
 *
 * // Rendered in the application:
 * // <SubscribersList />
 * ```
 *
 * In the above example, when `SubscribersList` is rendered into an
 * application, the list of records and the resolution details will be retrieved from
 * the store state using `getRecords()`, or resolved if missing.
 *
 * @return Collection records data.
 * @template RecordType
 */
export const useRecords = < RecordType >(
	namespace: string,
	collection: string,
	queryArgs: Record< string, unknown > = {},
	options: Options = { enabled: true }
): EntityRecordsResolution< RecordType > => {
	// Serialize queryArgs to a string that can be safely used as a React dep.
	// We can't just pass queryArgs as one of the deps, because if it is passed
	// as an object literal, then it will be a different object on each call even
	// if the values remain the same.
	const queryAsString = addQueryArgs( '', queryArgs );
 
	const { data: records, ...rest } = useQuerySelect<RecordType[]>(
		( query ) => {
			if ( ! options.enabled ) {
				return {
					// Avoiding returning a new reference on every execution.
					data: EMPTY_ARRAY,
				};
			}
			return query( hizzleStore ).getRecords( namespace, collection, queryArgs );
		},
		[ namespace, collection, queryAsString, options.enabled ]
	);

	const { totalItems, totalPages } = useSelect(
		( select ) => {
			if ( ! options.enabled ) {
				return {
					totalItems: null,
					totalPages: null,
				};
			}
			return {
				totalItems: select( hizzleStore ).getRecordsTotalItems(
					namespace,
					collection,
					queryArgs
				),
				totalPages: select( hizzleStore ).getRecordsTotalPages(
					namespace,
					collection,
					queryArgs
				),
			};
		},
		[ namespace, collection, queryAsString, options.enabled ]
	);

	return {
		records,
		totalItems,
		totalPages,
		...rest,
	};
}
