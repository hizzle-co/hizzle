/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { arrowUp, arrowDown } from '@wordpress/icons';

export const PER_PAGE_OPTIONS = [ 10, 25, 50, 75, 100, 250, 500, 1000 ];
export const SORTING_DIRECTIONS = [ 'asc', 'desc' ];
export const SORTING_ARROWS = { asc: '↑', desc: '↓' };
export const SORTING_VALUES = { asc: 'ascending', desc: 'descending' } as const;
export const SORTING_LABELS = {
	asc: __( 'Sort ascending' ),
	desc: __( 'Sort descending' ),
};
export const SORTING_ICONS = {
	asc: arrowUp,
	desc: arrowDown,
};
