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
import { updateQueryString, usePath } from '@hizzlewp/history';

/**
 * Local dependancies.
 */
import { EditorNotices, EditorSnackbars } from './notices';
import { Collection } from './collection';

const TheHeader = ( props ) => {

	const path = usePath();
	const brand = useMemo( () => {

		if ( !props.brand?.menu ) {
			return props.brand;
		}

		const currentPath = props.brand.menu.find( ( item ) => item.updatePath && path && path.startsWith( item.updatePath ) );

		return {
			...props.brand,
			menu: props.brand.menu.map( ( { updatePath, href, ...item } ) => (
				{
					...item,
					href: updatePath ? undefined : href,
					onClick: updatePath ? () => updateQueryString( {}, updatePath, {} ) : undefined,
					isPressed: currentPath ? currentPath.updatePath === updatePath : item.isPressed,
				}
			) ),
		}
	}, [ props.brand, path ] );

	return (
		<ErrorBoundary>
			<Header { ...props } brand={ brand } />
		</ErrorBoundary>
	);
}

export default function Layout( { defaultNamespace, defaultCollection, ...props } ): React.ReactNode {

	const theContent = useMemo( () => {
		return (
			<VStack id="hizzlewp-collection__main-content" spacing={ 4 } style={ { padding: 20 } }>
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
