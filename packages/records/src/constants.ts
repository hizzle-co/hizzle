/**
 * WordPress dependencies
 */
import { arrowUp, arrowDown } from '@wordpress/icons';

export { PER_PAGE_OPTIONS } from '@hizzlewp/store';
export const SORTING_DIRECTIONS = [ 'asc', 'desc' ];
export const SORTING_ARROWS = { asc: '↑', desc: '↓' };
export const SORTING_VALUES = { asc: 'ascending', desc: 'descending' } as const;
export const SORTING_LABELS = {
	asc: 'Sort ascending',
	desc: 'Sort descending',
};
export const SORTING_ICONS = {
	asc: arrowUp,
	desc: arrowDown,
};
