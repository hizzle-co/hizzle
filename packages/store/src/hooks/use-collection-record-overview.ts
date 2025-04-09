/**
 * Internal dependencies
 */
import useQuerySelect from './use-query-select';
import { store as hizzleStore } from '..';
import { CollectionRecordKey } from '../types';

/**
 * Resolves the specified collection record's overview.
 *
 * @param    namespace  Namespace e.g, noptin.
 * @param    collection Collection e.g, `subscribers`.
 * @param    recordId   ID of the requested record.
 * @example
 * ```js
 * import { useCollectionRecordOverview } from '@hizzlewp/store';
 *
 * function SubscriberDisplay( { id } ) {
 *   const { data: overview, isResolving, error } = useCollectionRecordOverview( 'noptin', 'subscribers', id );
 *
 *   if ( isResolving ) {
 *     return 'Loading...';
 *   }
 *
 *   if ( error ) {
 *     return 'Error: ' + error.message;
 *   }
 *
 *   return <RenderOverview overview={ overview } />
 * }
 *
 * ```
 *
 * @return Entity record overview.
 */
export const useCollectionRecordOverview = (
	namespace: string,
	collection: string,
	recordId: CollectionRecordKey,
) => {

	return useQuerySelect<Array<any>>(
		( query ) => {
			return query( hizzleStore ).getCollectionRecordOverview(
				namespace,
				collection,
				recordId
			);
		},
		[ namespace, collection, recordId ]
	);
}
