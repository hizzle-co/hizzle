/**
 * External dependencies.
 */
import domReady from '@wordpress/dom-ready';
import React, { createRoot } from "@wordpress/element";
import { SlotFillProvider } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import './style.scss';
import Layout from './components/layout';
import { SettingsProvider } from './components/settings-provider';

declare global {
	interface Window {
		hizzleWPSettings?: {
			data: {
				option_name: string;
				saved: Record<string, any>;
				settings: Record<string, any>;
				[ key: string ]: any;
			};
		};
	}
}

const { option_name, saved, settings, ...rest } = window.hizzleWPSettings?.data || {};

domReady( () => {

	const target = document.getElementById( 'hizzlewp-settings__app' );

	// Abort if the target element is not found.
	if ( !target || !settings ) {
		return;
	}

	const App = () => (
		<SlotFillProvider>
			<SettingsProvider
				option_name={ option_name || 'hizzlewp_settings' }
				settings={ settings || {} }
				saved={ saved || {} }
			>
				<Layout { ...rest } />
			</SettingsProvider>
		</SlotFillProvider>
	);

	createRoot( target ).render( <App /> );
} );
