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
import { SettingsProvider, SettingsProviderProps } from './components/settings-provider';

declare global {
	interface Window {
		hizzleWPSettings?: {
			data: {
				option_name: string;
				saved: Record<string, any>;
				settings: SettingsProviderProps[ 'settings' ];
				[ key: string ]: any;
			};
		};
	}
}

const { option_name, saved = {}, settings, ...rest } = window.hizzleWPSettings?.data || {};

domReady( () => {

	const target = document.getElementById( 'hizzlewp-settings__app' );

	// Abort if the target element is not found.
	if ( !target || !settings ) {
		return;
	}

	// Loop through all settings, if there a setting has a default value
	// and the key does not exist in saved,
	// add it to saved.
	const checkDefaults = ( _settings: Record<string, any> ) => {

		// Check if we have a default value.
		Object.entries( _settings ).forEach( ( [ key, setting ] ) => {
			if ( 'default' in setting ) {
				if ( !( key in saved ) ) {
					saved[ key ] = setting.default;
				}
			}

			// Does the setting have children?
			[ 'children', 'settings' ].forEach( childKey => {
				if ( childKey in setting && typeof setting[ childKey ] === 'object' ) {
					checkDefaults( setting[ childKey ] );
				}
			} );
		} );
	}

	Object.values( { ...settings } ).forEach( tab => {
		Object.values( tab.sub_sections ).forEach( section => {
			checkDefaults( section.settings );
		} );
	} );

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
