/**
 * External dependencies.
 */
import React from 'react';

export const Footer = ({ children }: { children: React.ReactNode }) => {
	if (!children) {
		return null;
	}

	return <div style={{ padding: '10px 20px', backgroundColor: '#fff', position: 'relative' }}>{children}</div>;
};
