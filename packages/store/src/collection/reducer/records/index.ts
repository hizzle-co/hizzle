/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import type { CollectionConfig, State, HistoryChange } from '../../../types';
import { ifMatchingAction, replaceAction } from '../../../utils';
import { DEFAULT_ENTITY_KEY } from '../../../constants';
import { edits } from './edits';
import { saving } from './saving';
import { deleting } from './deleting';
import { queriedData } from './queriedData';
import { remoteActions } from './remote-actions';

export type collectionState = State[ 'collections' ][ 'records' ][ 'namespace' ][ 'collection' ]

/**
 * Reducer that handles multi-collection record edits.
 *
 * @param {Object} reducer - The reducer to use.
 * @param {Object} state - The current state.
 * @param {Object} action - The action to dispatch.
 */
const withMultiCollectionRecordEdits = ( reducer ) => ( state, action ) => {
    if ( action.type === 'UNDO' || action.type === 'REDO' ) {
        const { record } = action;

        let newState = state;
        record.forEach( ( { id: { namespace, collection, recordId }, changes } ) => {
            newState = reducer( newState, {
                type: 'EDIT_COLLECTION_RECORD',
                namespace,
                collection,
                recordId,
                edits: Object.entries( changes as HistoryChange[] ).reduce(
                    ( acc, [ key, value ] ) => {
                        acc[ key ] =
                            action.type === 'UNDO' ? value.from : value.to;
                        return acc;
                    },
                    {}
                ),
            } );
        } );
        return newState;
    }

    return reducer( state, action );
};

export const records = ( collection: CollectionConfig ) => {
    const reducers = combineReducers( {
        queriedData,
        edits,
        saving,
        deleting,
        remoteActions,
    } );

    const matchesAction = ( action ) => (
        Boolean(
            action.collection &&
            action.namespace &&
            action.collection === collection.collection &&
            action.namespace === collection.namespace
        )
    );

    return compose(
        withMultiCollectionRecordEdits,

        // Limit to matching action type so we don't attempt to replace action on
        // an unhandled action.
        ifMatchingAction( matchesAction ),

        // Inject the entity config into the action.
        replaceAction( ( action ) => {
            return {
                key: collection.key || DEFAULT_ENTITY_KEY,
                ...action,
            };
        } ),
    )( reducers ) as typeof reducers;
};
