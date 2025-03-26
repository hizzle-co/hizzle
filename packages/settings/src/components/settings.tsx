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

const section = <Section />;

export const Settings = () => {

	return (
		<ErrorBoundary>
			<NavigatorProvider initialPath={ getPath() }>
				<NavigatorScreen path="/">
					{ section }
				</NavigatorScreen>
				<NavigatorScreen path="/:tab">
					{ section }
				</NavigatorScreen>
				<NavigatorScreen path="/:tab/:section">
					{ section }
				</NavigatorScreen>
			</NavigatorProvider>
		</ErrorBoundary>
	);
};
