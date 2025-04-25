/**
 * External dependencies
 */
import React, { useMemo } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalVStack as VStack } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';

/**
 * HizzleWP dependencies.
 */
import { Interface, Header } from '@hizzlewp/interface';
import { ErrorBoundary } from '@hizzlewp/components';
import { usePath, getHistory } from '@hizzlewp/history';

/**
 * Local dependancies.
 */
import { EditorNotices, EditorSnackbars } from './notices';
import { Collection } from './collection';

/**
 * Highlights the corresponding WordPress admin menu item
 * @param {string} href The URL to navigate to
 */
const highlightAdminMenuItem = ( href ) => {
	// Extract the page parameter from the URL
	const urlParams = new URLSearchParams( href.split( '?' )[ 1 ] || '' );
	const page = urlParams.get( 'page' );

	if ( !page ) return;

	// Find and highlight the corresponding admin menu item
	setTimeout( () => {
		const adminMenuItems = document.querySelectorAll( '#adminmenu a' );
		adminMenuItems.forEach( ( menuItem ) => {
			const menuItemHref = menuItem.getAttribute( 'href' );
			if ( menuItemHref && menuItemHref.includes( `page=${ page }` ) ) {
				// Remove current class from all items
				document.querySelectorAll( '#adminmenu .current' ).forEach( el =>
					el.classList.remove( 'current' ) );

				// Find parent li and add appropriate classes
				const parentLi = menuItem.closest( 'li' );
				if ( parentLi ) {
					parentLi.classList.add( 'current' );

					// If it's a submenu item, highlight parent too
					const topLevelParent = parentLi.closest( '.wp-has-submenu' );
					if ( topLevelParent ) {
						topLevelParent.classList.add( 'wp-has-current-submenu' );
						topLevelParent.classList.add( 'wp-menu-open' );
						topLevelParent.classList.remove( 'wp-not-current-submenu' );
					}
				}

				// Add current class to the link
				menuItem.classList.add( 'current' );
				menuItem.setAttribute( 'aria-current', 'page' );
			}
		} );
	}, 0 );
};

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
					onClick: updatePath ? () => {
						// Navigate to the URL
						getHistory().push( addQueryArgs( href, { hizzlewp_path: updatePath } ) );

						// Highlight the corresponding WordPress admin menu item
						highlightAdminMenuItem( href );
					} : undefined,
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
