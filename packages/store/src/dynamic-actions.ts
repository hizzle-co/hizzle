/**
 * External dependencies
 */
import {apiFetch} from '@wordpress/data-controls';
import { UseDispatchReturn } from '@wordpress/data/build-types/types';

/**
 * Internal dependencies
 */
import {setRecord} from './actions';
import initStore from './index';

const store = initStore( 'my-namespace', 'my-collection' );

/**
 * Creates dynamic actions for the store.
 * @param {string} namespace The namespace.
 * @param {string} collection The collection.
 * @link https://unfoldingneurons.com/2020/wordpress-data-store-properties-action-creator-generators
 */
export default function createDynamicActions( namespace: string, collection: string ) {

	return {

		/**
		 * Creates a record.
		 *
		 * @param {Object} data
		 * @return {Object} Action.
		 */
		*createRecord( data, dispatch ) {
			const path   = `${namespace}/v1/${collection}`;
			const method = 'POST';
			const result = yield apiFetch( { path, method, data } );

			if ( result ) {

				// Invalidate the getRecords selector.
				yield dispatch.invalidateResolutionForStoreSelector( 'getRecords' );

				// Invalidate the getRecord selector.
				yield dispatch.invalidateResolution( 'getRecord', [ result.id ] );

				// Resolve to avoid further network requests.
				yield dispatch.startResolution( 'getRecord', [ result.id ] );
				yield dispatch.finishResolution( 'getRecord', [ result.id ] );

				// Set the record.
				return setRecord( result );
			}
		},

		/**
		 * Updates a record.
		 *
		 * @param {string} id
		 * @param {Object} data
		 * @return {Object} Action.
		 */
		*updateRecord( id, data, dispatch ) {
			const path   = `${namespace}/v1/${collection}/${id}`;
			const method = 'PUT';
			const result = yield apiFetch( { path, method, data } );

			if ( result ) {

				// Resolve to avoid further network requests.
				yield dispatch.startResolution( 'getRecord', [ result.id ] );
				yield dispatch.finishResolution( 'getRecord', [ result.id ] );

				// Set the record.
				return dispatch.setRecord( result );
			}
		},

		/**
		 * Deletes a record.
		 *
		 * @param {string} id
		 * @return {Object} Action.
		 */
		*deleteRecord( id, dispatch ) {

			/**
			 * Fire action before deleting record.
			 */
			yield dispatch.beforeDeleteRecord( id );

			// Delete the record.
			const path   = `${namespace}/v1/${collection}/${id}`;
			const method = 'DELETE';

			yield apiFetch( { path, method } );

			// Invalidate the getRecord selector.
			yield dispatch.invalidateResolution( 'getRecord', [ id ] );

			return {
				type: 'DELETE_RECORD',
				id
			};
		},

		/**
		 * Deletes multiple records.
		 *
		 * @param {string} queryString
		 * @return {Object} Action.
		 */
		*deleteRecords( queryString, dispatch ) {

			// Delete the record.
			const path   = `${namespace}/v1/${collection}${queryString}`;
			const method = 'DELETE';

			// Delete the records.
			yield apiFetch( { path, method } );

			// Invalidate related selectors.
			yield dispatch.emptyCache( dispatch );

			return { type: 'DELETE_RECORDS' };
		},

		/**
		 * Empties the cache.
		 *
		 * @param {string} queryString
		 * @return {Object} Action.
		 */
		*emptyCache( dispatch ) {
			yield dispatch.invalidateResolutionForStoreSelector( 'getRecords' );
			yield dispatch.invalidateResolutionForStoreSelector( 'getRecord' );
			yield dispatch.invalidateResolutionForStoreSelector( 'getRecordOverview' );
			yield dispatch.invalidateResolutionForStoreSelector( 'getTabContent' );
		},
	}
}
