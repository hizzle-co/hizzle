/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import {
	__experimentalNavigatorProvider as NavigatorProvider,
	__experimentalNavigatorScreen as NavigatorScreen,
} from '@wordpress/components';

/**
 * HizzleWP dependencies.
 */
import { ErrorBoundary } from '@hizzlewp/components';
import { getPath } from '@hizzlewp/history';

/**
 * Local dependencies
 */
import { Section } from './section';

export const Settings = () => {

	return (
		<ErrorBoundary>
			<NavigatorProvider initialPath={ getPath() }>
				<NavigatorScreen path="/">
					<Section />
				</NavigatorScreen>
				<NavigatorScreen path="/:tab">
					<Section />
				</NavigatorScreen>
				<NavigatorScreen path="/:tab/:section">
					<Section />
				</NavigatorScreen>
			</NavigatorProvider>
		</ErrorBoundary>
	);
};
