/**
 * External dependencies.
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __experimentalSurface as Surface } from '@wordpress/components';

export const Footer = ({ children }: { children: React.ReactNode }) => {
	if (!children) {
		return null;
	}

	return <Surface style={{ padding: '10px 20px' }}>{children}</Surface>;
};
