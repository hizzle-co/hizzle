/**
 * External dependencies
 */
import { apiFetch } from '@wordpress/data-controls';
import { controls } from '@wordpress/data';
import { getQueryArg } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { setRecords, setRecord, setPartialRecords, setSchema, setTabContent, setRecordOverview } from './actions';

/**
 * Creates resolvers for the store.
 * @param {string} namespace The namespace.
 * @param {string} collection The collection.
 * @link https://unfoldingneurons.com/2020/wordpress-data-store-properties-resolvers
 */
export default function createResolvers( namespace: string, collection: string ) {

	return {

		/**
		 * Fetches the records from the API.
		 *
		 * @return {Object} Action.
		 */
		*getRecords( queryString: string ) {
			const path    = `${namespace}/v1/${collection}${queryString}`;
			const _fields = getQueryArg( queryString, '__fields' );
			const records = yield apiFetch( { path } );

			if ( records ) {

				if ( _fields ) {
					return setPartialRecords( records.items, queryString );
				}

				// Resolve each record to avoid further network requests.
				const STORE_NAME = `${namespace}/${collection}`;

				// Resolve to avoid further network requests.
				const resolutionsArgs = records.items.map( ( record ) => [ record.id ] );

				yield controls.dispatch(
					STORE_NAME,
					'startResolutions',
					'getRecord',
					resolutionsArgs
				);

				yield controls.dispatch(
					STORE_NAME,
					'finishResolutions',
					'getRecord',
					resolutionsArgs
				);

				return setRecords( records, queryString );
			}

			return setRecords( [], queryString );
		},

		/**
		 * Fetches a record from the API.
		 *
		 * @return {Object} Action.
		 */
		*getRecord( id: number ) {
			const path   = `${namespace}/v1/${collection}/${id}`;
			const record = yield apiFetch( { path } );

			return setRecord( record );
		},

		/**
		 * Fetch the collection schema from the API.
		 *
		 * @return {Object} Action.
		 */
		*getSchema() {
			const path   = `${namespace}/v1/${collection}/collection_schema`;
			const schema = yield apiFetch( { path } );

			return setSchema( schema );
		},

		/**
		 * Fetch a single record tab's content from the API.
		 *
		 * @return {Object} Action.
		 */
		*getTabContent( id: number, tab_id: string ) {
			const path    = `${namespace}/v1/${collection}/${id}/${tab_id}`;
			const content = yield apiFetch( { path } );

			return setTabContent( id, tab_id, content );
		},

		/**
		 * Retrieves a single record's overview data.
		 *
		 * @return {Object} Action.
		 */
		*getRecordOverview( id: number ) {
			const path     = `${namespace}/v1/${collection}/${id}/overview`;
			const overview = yield apiFetch( { path } );

			return setRecordOverview( id, overview );
		},
	}
}
