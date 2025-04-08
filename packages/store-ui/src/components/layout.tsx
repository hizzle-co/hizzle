/**
 * External dependencies
 */
import React, { useMemo } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalVStack as VStack } from '@wordpress/components';

/**
 * HizzleWP dependencies.
 */
import { Interface, Header } from '@hizzlewp/interface';
import { ErrorBoundary } from '@hizzlewp/components';

/**
 * Local dependancies.
 */
import { EditorNotices, EditorSnackbars } from './notices';
import { Collection } from './collection';

const TheHeader = ( props ) => {

	return (
		<ErrorBoundary>
			<Header { ...props } />
		</ErrorBoundary>
	);
}

export default function Layout( { defaultNamespace, defaultCollection, ...props } ): React.ReactNode {

	const theContent = useMemo( () => {
		return (
			<VStack id="hizzlewp-collection__main-content" style={ { padding: 20 } }>
				<ErrorBoundary>
					<EditorSnackbars />
				</ErrorBoundary>
				<ErrorBoundary>
					<EditorNotices />
				</ErrorBoundary>
				<ErrorBoundary>
					<Collection defaultNamespace={ defaultNamespace } defaultCollection={ defaultCollection } />
				</ErrorBoundary>
			</VStack>
		);
	}, [ defaultNamespace, defaultCollection ] );

	return (
		<Interface
			className="hizzlewp-settings__interface"
			header={ <TheHeader { ...props } /> }
			content={ theContent }
		/>
	);
}
