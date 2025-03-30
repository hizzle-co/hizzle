import type { Reducer } from 'redux';

/**
 * Higher-order reducer creator which substitutes the action object before
 * passing to the original reducer.
 *
 * @param {AnyFunction} replacer Function mapping original action to replacement.
 *
 * @return {AnyFunction} Higher-order reducer.
 */
const replaceAction = ( replacer: ( action: any ) => any ) : Reducer => ( reducer: Reducer ) => ( state, action ) => {
	return reducer( state, replacer( action ) );
};

export default replaceAction;
