/**
 * HizzleWP dependencies.
 */
import { stringToColor } from '@hizzlewp/components';

/**
 * Generates a badge color based on the given string.
 *
 * @param {string} str The string to generate a color for.
 * @return {Object} The generated background and text colors.
 */
export default function getEnumBadge( str ) {

	// Try to guess the color from the string.
	if ( ['subscribed', 'subscribe', 'active', 'yes', 'true', '1'].includes( str ) ) {
		return {
			backgroundColor: '#78c67a',
			color: '#111111',
		}
	}

	if ( ['unsubscribed', 'unsubscribe', 'inactive', 'no', 'false', '0'].includes( str ) ) {
		return {
			backgroundColor: '#fbcfbd',
			color: '#241c15',
		}
	}

	if ( ['pending', 'waiting', 'maybe', '2'].includes( str ) ) {
		return {
			backgroundColor: '#fbeeca',
			color: '#241c15',
		}
	}

	// Generate unique color for the string.
	const color = stringToColor( str, {
		saturation: [60, 100],
   		lightness: [30, 45],
	} );

	return {
		backgroundColor: color.color,
		color: color.isLight ? '#111111' : '#ffffff',
	}
}
