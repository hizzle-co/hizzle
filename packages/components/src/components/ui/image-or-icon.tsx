/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { Icon, IconType, SVG, Path } from '@wordpress/components';

export type ImageOrIconProps = {
	/**
	 * The image URL, dashicon, or SVG.
	 */
	image?: string | {
		/**
		 * The fill color.
		 */
		fill?: string;

		/**
		 * The path.
		 */
		path?: string;

		/**
		 * The viewBox.
		 */
		viewBox?: string;

		/**
		 * The Provide either a path or icon.
		 */
		icon?: IconType;
	};

	/**
	 * The alt text.
	 */
	alt?: string;

	/**
	 * The width.
	 */
	width?: number;
};

/**
 * Icon component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.image - The image URL, dashicon, or SVG.
 * @param {string} props.alt - The alt text.
 * @param {number} props.width - The width.
 */
export const ImageOrIcon: React.FC<ImageOrIconProps> = ( { image, alt, width = 24 } ) => {
	// URLs.
	if ( typeof image === 'string' && image.startsWith( 'http' ) ) {
		return <img src={ image } width={ width } alt={ alt } style={ { maxWidth: width, height: 'auto' } } />;
	}

	// Dashicons.
	if ( image && typeof image === 'string' ) {
		return <Icon size={ width } icon={ image as IconType } style={ { color: '#424242' } } />;
	}

	// SVG or Dashicons with fill color.
	if ( image && typeof image === 'object' ) {
		const fill = image.fill || '#008000';
		const path = image.path || '';
		const viewBox = image.viewBox || '0 0 24 24';

		if ( image.path ) {
			return (
				<SVG viewBox={ viewBox } xmlns="http://www.w3.org/2000/svg" style={ { maxWidth: width } }>
					<Path fill={ fill } d={ path } />
				</SVG>
			);
		}

		return <Icon size={ width } style={ { color: fill } } icon={ image.icon } />;
	}

	return <Icon size={ width } icon="email" style={ { color: '#424242' } } />;;
};
