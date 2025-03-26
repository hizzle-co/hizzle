/**
 * External dependencies
 */
import React from 'react';

/**
 * HizzleWP dependencies.
 */
import { ErrorBoundary } from '@hizzlewp/components';
import { Router, RouteConfig } from '@hizzlewp/history';

/**
 * Local dependencies
 */
import { Section } from './section';

const element = <Section />;

export const Settings = () => {

	// Define routes.
	const routes: RouteConfig[] = [
		{
			path: '/',
			element,
			children: [
				{
					path: '/:tab',
					element,
					children: [
						{
							path: '/:tab/:section',
							element,
						},
					],
				},
			],
		},
	];

	return (
		<ErrorBoundary>
			<Router routes={ routes } />
		</ErrorBoundary>
	);
};
