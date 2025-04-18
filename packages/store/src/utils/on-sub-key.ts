import type { Reducer } from 'redux';

/**
 * Higher-order reducer creator which creates a combined reducer object, keyed
 * by a property on the action object.
 *
 * @param {string} actionProperty Action property by which to key object.
 *
 * @return Higher-order reducer.
 */
export const onSubKey =
	( actionProperty: string ) =>
	( reducer: Reducer ) : Reducer =>
	( state = {}, action: any ) => {
		// Retrieve subkey from action. Do not track if undefined; useful for cases
		// where reducer is scoped by action shape.
		const key: string = action[ actionProperty ];
		if ( key === undefined ) {
			return state;
		}

		// Avoid updating state if unchanged. Note that this also accounts for a
		// reducer which returns undefined on a key which is not yet tracked.
		const nextKeyState = reducer( state[ key ], action );
		if ( nextKeyState === state[ key ] ) {
			return state;
		}

		return {
			...state,
			[ key ]: nextKeyState,
		};
	};

export default onSubKey;
