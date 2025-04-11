import { useReducer } from 'react';

/**
 * The state of the import.
 */
export interface ImportState {

    /**
     * Whether the import is done.
     */
    done: boolean;

    /**
     * The last duration of the import.
     */
    lastDuration: number;

    /**
     * Whether the import is paused.
     */
    paused: boolean;

    /**
     * Whether the file has been parsed.
     */
    parsed: boolean;

    /**
     * The total number of records.
     */
    total: number;

    /**
     * The number of records processed.
     */
    processed: number;

    /**
     * The stats of the import.
     */
    stats: {

        /**
         * The number of records updated.
         */
        updated: number;

        /**
         * The number of records created.
         */
        created: number;

        /**
         * The number of records failed.
         */
        failed: number;

        /**
         * The number of records skipped.
         */
        skipped: number;
    };

    /**
     * The previous stats of the import.
     */
    previousStats: {
        /**
         * The number of records updated.
         */
        updated: number;

        /**
         * The number of records created.
         */
        created: number;

        /**
         * The number of records failed.
         */
        failed: number;

        /**
         * The number of records skipped.
         */
        skipped: number;
    };

    /**
     * The chunks of records to import.
     */
    chunks: Record<string, any>[][];
}

/**
 * The action of the import.
 */
interface UpdateStatsAction {
    type: 'UPDATE_STATS';
    updated: number;
    created: number;
    failed: number;
    skipped: number;
}

interface UpdateKeyAction extends Partial<ImportState> {
    type: 'UPDATE';
}

export const importReducer = ( state: ImportState, { type, ...payload }: UpdateKeyAction | UpdateStatsAction ): ImportState => {
    switch ( type ) {
        case 'UPDATE_STATS':
            return {
                ...state,
                stats: { ...state.stats, ...payload },
                previousStats: { ...state.stats }
            };
        case 'UPDATE':
            return { ...state, ...payload };
        default:
            return state;
    }
};

export const useImportReducer = () => {
    return useReducer( importReducer, {
        done: false,
        lastDuration: 5000,
        paused: false,
        parsed: false,
        total: 0,
        processed: 0,
        stats: {
            updated: 0,
            created: 0,
            failed: 0,
            skipped: 0,
        },
        previousStats: {
            updated: 0,
            created: 0,
            failed: 0,
            skipped: 0,
        },
        chunks: [],
    } );
};
