/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import memoize from './memoize';
import { Status } from './constants';

export const META_SELECTORS = [
	'getIsResolving',
	'hasStartedResolution',
	'hasFinishedResolution',
	'isResolving',
	'getCachedResolvers',
];

interface QuerySelectResponse<Data> {
	/** the requested selector return value */
	data: Data;

	/** is the record still being resolved? Via the `isResolving` meta-selector */
	isResolving: boolean;

	/** was the resolution started? Via the `hasStartedResolution` meta-selector */
	hasStarted: boolean;

	/** has the resolution finished? Via the `hasFinishedResolution` meta-selector. */
	hasResolved: boolean;

	/** Error that occurred during resolution. */
	error?: Error;
}

/**
 * Like useSelect, but the selectors return objects containing
 * both the original data AND the resolution info.
 *
 * @since 6.1.0 Introduced in WordPress core.
 *
 * @param {Function} mapQuerySelect see useSelect
 * @param {Array}    deps           see useSelect
 *
 * @example
 * ```js
 * import { useQuerySelect, store as hizzleStore } from '@hizzlewp/store';
 *
 * function SubscriberDisplay( { id } ) {
 *   const { data: subscriber, isResolving } = useQuerySelect( ( query ) => {
 *     return query( hizzleStore ).getCollectionRecord( 'noptin', 'subscribers', id )
 *   }, [ id ] );
 *
 *   if ( isResolving ) {
 *     return 'Loading...';
 *   }
 *
 *   return subscriber.email;
 * }
 *
 * // Rendered in the application:
 * // <SubscriberDisplay id={ 10 } />
 * ```
 *
 * In the above example, when `SubscriberDisplay` is rendered into an
 * application, the subscriber and the resolution details will be retrieved from
 * the store state using the `mapSelect` callback on `useQuerySelect`.
 *
 * If the id prop changes then any subscriber in the state for that id is
 * retrieved. If the id prop doesn't change and other props are passed in
 * that do change, the subscriber will not change because the dependency is just
 * the id.
 * @see useSelect
 *
 * @return {QuerySelectResponse} Queried data.
 */
export default function useQuerySelect<Data>( mapQuerySelect: Function, deps: Array<any> ): DataWithSelectors<Data> {
	return useSelect( ( select, registry ) => {
		const resolve = ( store ) => enrichSelectors( select( store ) );
		return mapQuerySelect( resolve, registry );
	}, deps );
}

interface EnrichedSelectors {
	<Selectors extends Record<string, ( ...args: any[] ) => any>>(
		selectors: Selectors
	): {
			[ Selector in keyof Selectors ]: (
				...args: Parameters<Selectors[ Selector ]>
			) => QuerySelectResponse<ReturnType<Selectors[ Selector ]>>;
		};
}

type DataWithSelectors<Data> = {
	data: Data,
	status: Status,
	isResolving: boolean,
	hasStarted: boolean,
	hasResolved: boolean,
	error: undefined | Error,
};

/**
 * Transform simple selectors into ones that return an object with the
 * original return value AND the resolution info.
 *
 * @param {Object} selectors Selectors to enrich
 * @return {EnrichedSelectors} Enriched selectors
 */
const enrichSelectors = memoize( ( ( selectors ) => {
	const resolvers: Record<string, (...args: unknown[]) => DataWithSelectors<any>> = {};

	for ( const selectorName in selectors ) {
		if ( META_SELECTORS.includes( selectorName ) ) {
			continue;
		}
		Object.defineProperty( resolvers, selectorName, {
			get:
				() =>
					( ...args: unknown[] ): DataWithSelectors<any> => {
						const data = selectors[ selectorName ]( ...args );
						const resolutionStatus = selectors.getResolutionState(
							selectorName,
							args
						);

						let status;
						switch ( resolutionStatus?.status ) {
							case 'resolving':
								status = Status.Resolving;
								break;
							case 'finished':
								status = Status.Success;
								break;
							case 'error':
								status = Status.Error;
								break;
							case undefined:
								status = Status.Idle;
								break;
						}

						return {
							data,
							status,
							isResolving: status === Status.Resolving,
							hasStarted: status !== Status.Idle,
							hasResolved:
								status === Status.Success ||
								status === Status.Error,
							error: status === Status.Error ? resolutionStatus?.error : undefined,
						};
					},
		} );
	}
	return resolvers;
} ) as EnrichedSelectors );
