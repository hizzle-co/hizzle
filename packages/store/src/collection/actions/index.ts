import type { Action } from 'redux';

export * from './config';
export * from './records';

export type CollectionAction = Action & {

    /**
     * The namespace of the collection.
     */
    namespace: string;

    /**
     * The name of the collection.
     */
    collection: string;
}

export type UnknownAction = Action<'unknown'>;