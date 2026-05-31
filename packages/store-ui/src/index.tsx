/**
 * External dependencies.
 */
import domReady from '@wordpress/dom-ready';
import React, { createRoot } from "@wordpress/element";
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import Layout from './components/layout';
import './style.scss';

declare global {
	interface Window {
		hizzleWPStoreUi?: {
			data: {
				collection: string;
				namespace: string;
				[ key: string ]: any;
			};
		};
	}
}

const { collection, namespace, ...rest } = window.hizzleWPStoreUi?.data || {};

domReady( () => {

	const target = document.getElementById( 'hizzlewp-store-ui' );

	// Abort if the target element is not found.
	if ( !target || !collection || !namespace ) {
		return;
	}

	dispatch( keyboardShortcutsStore ).registerShortcut( {
		name: 'hizzlewp/save-record',
		category: 'hizzlewp',
		description: 'Save the current record',
		keyCombination: {
			modifier: 'primary',
			character: 's',
		},
	} );

	const App = () => (
		<Layout
			defaultNamespace={ namespace }
			defaultCollection={ collection }
			{ ...rest }
		/>
	);

	createRoot( target ).render( <App /> );
} );
