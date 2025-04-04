/**
 * External dependencies.
 */
import domReady from '@wordpress/dom-ready';
import React, { createRoot } from "@wordpress/element";
import { SlotFillProvider } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import Layout from './components/layout';
import './style.scss';

declare global {
	interface Window {
		hizzleWPStore?: {
			data: {
				collection: string;
				namespace: string;
				[ key: string ]: any;
			};
		};
	}
}

const { collection, namespace, ...rest } = window.hizzleWPStore?.data || {};

domReady( () => {

	const target = document.getElementById( 'hizzlewp-store-ui' );

	// Abort if the target element is not found.
	if ( !target || !collection || !namespace ) {
		return;
	}

	const App = () => (
		<SlotFillProvider>
			<Layout
				defaultNamespace={ namespace }
				defaultCollection={ collection }
				{ ...rest }
			/>
		</SlotFillProvider>
	);

	createRoot( target ).render( <App /> );
} );
