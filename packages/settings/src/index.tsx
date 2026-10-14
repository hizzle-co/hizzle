import domReady from '@wordpress/dom-ready';
import React, { createRoot } from '@wordpress/element';
import { SlotFillProvider } from '@wordpress/components';
import Layout from './components/layout';
import { SettingsProvider } from './components/settings-provider';
import { completeOAuthWindow } from './components/oauth-window';

completeOAuthWindow();

export { SettingsList } from './components/section';
export { SettingsProvider, useSettings } from './components/settings-provider';
export type { SettingsProviderProps, ISettingsContextProps } from './components/settings-provider';

declare global {
	interface Window {
		hizzleWPSettings?: { data: { option_name: string;[ key: string ]: any } };
	}
}

domReady( () => {

	const target = document.getElementById( 'hizzlewp-settings__app' );
	const { option_name, ...rest } = window.hizzleWPSettings?.data || {};

	// Abort if the target element is not found.
	if ( !target || !option_name ) return;
	createRoot( target ).render(
		<SlotFillProvider>
			<SettingsProvider option_name={ option_name }>
				<Layout { ...rest } />
			</SettingsProvider>
		</SlotFillProvider>
	);
} );
