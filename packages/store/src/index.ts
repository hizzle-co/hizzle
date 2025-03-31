/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import * as resolvers from './resolvers';
import createLocksActions from './locks/actions';
import { STORE_NAME } from './constants';

const storeConfig = () => ( {
	reducer,
	actions: {
		...actions,
		...createLocksActions(),
	},
	selectors,
	resolvers,
} );

/**
 * Store definition for the code data namespace.
 *
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/data/README.md#createReduxStore
 */
export const store = createReduxStore( STORE_NAME, storeConfig() );

register( store );

export * from './collection-provider';
export * from './hooks';
export * from './constants';
