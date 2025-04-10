/**
 * Internal dependencies
 */
import useQuerySelect from './use-query-select';
import { store as hizzleStore } from '..';
import { CollectionRecordKey } from '../types';

/**
 * Resolves the specified collection record's tab content.
 *
 * @param    namespace  Namespace e.g, noptin.
 * @param    collection Collection e.g, `subscribers`.
 * @param    recordId   ID of the requested record.
 * @param    tabName    The tab name, e.g, overview.
 * @example
 * ```js
 * import { useCollectionRecordTabContent } from '@hizzlewp/store';
 *
 * function SubscriberDisplay( { id } ) {
 *   const { data: overview, isResolving, error } = useCollectionRecordTabContent( 'noptin', 'subscribers', id, 'overview );
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
export const useCollectionRecordTabContent = (
	namespace: string,
	collection: string,
	recordId: CollectionRecordKey,
	tabName: string,
) => {

	return useQuerySelect<Array<any>>(
		( query ) => {
			return query( hizzleStore ).getCollectionRecordTabContent(
				namespace,
				collection,
				recordId,
				tabName,
			);
		},
		[ namespace, collection, recordId, tabName ]
	);
}
