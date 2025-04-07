/**
 * External dependencies.
 */
import React, { createContext, useContext, useMemo, useState, useCallback, useRef, useEffect } from 'react';

/**
 * WordPress dependencies.
 */
import apiFetch from '@wordpress/api-fetch';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * HizzleWP dependencies.
 */
import { ISetting } from '@hizzlewp/components';

/**
 * Interface for a settings section, e.g, PayPal.
 */
interface ISection {
	/**
	 * The section name.
	 */
	name: string;

	/**
	 * The section title.
	 */
	title: string;

	/**
	 * The section path.
	 */
	path: string;

	/**
	 * The section settings.
	 */
	settings: Record<string, ISetting>;
}

/**
 * Interface for a settings tab, e.g, Payment Methods.
 */
export interface ITab extends Omit<ISection, 'settings'> {
	/**
	 * The tab sections.
	 */
	sections: ISection[];
}

/**
 * Interface for the settings context.
 */
interface ISettingsContextProps {

	/**
	 * The setting option name.
	 */
	option_name: string;

	/**
	 * The saved settings.
	 */
	saved: Record<string, any>;

	/**
	 * The available setting as an array of tabs.
	 */
	settings: ITab[];

	/**
	 * Whether we are in the middle of saving the settings.
	 */
	isSaving: boolean;

	/**
	 * Save the settings.
	 */
	save: () => void;

	/**
	 * Set the attributes.
	 */
	setAttributes: ( attributes: Record<string, any> ) => void;
}

/**
 * Context for settings.
 */
const SettingsContext = createContext<ISettingsContextProps>( {
	option_name: '',
	saved: {},
	settings: [],
	isSaving: false,
	setAttributes: () => { },
	save: () => { },
} );

/**
 * Custom hook to access the context.
 */
export const useSettings = () => useContext( SettingsContext );

/**
 * Provider component for settings.
 */
interface SettingsProviderProps {
	/**
	 * The available setting fields grouped by the tab key.
	 */
	settings: Record<string, {

		/**
		 * The tab label.
		 */
		label: string;

		/**
		 * The tab sections grouped by the section key.
		 */
		sub_sections: Record<string, {
			/**
			 * The section label.
			 */
			label: string;

			/**
			 * The section settings.
			 */
			settings: Record<string, ISetting>;
		}>;
	}>;

	/**
	 * The saved settings.
	 */
	saved: Record<string, any>;

	/**
	 * The setting option name.
	 */
	option_name: string;

	/**
	 * The children.
	 */
	children: React.ReactNode;
}

/**
 * Provider component for settings.
 */
export const SettingsProvider: React.FC<SettingsProviderProps> = ( {
	settings,
	option_name,
	saved,
	children,
} ) => {

	const [ options, setOptions ] = useState( saved );
	const [ isSaving, setIsSaving ] = useState( false );
	const hasPendingChanges = useRef( false );
	const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

	// Prepare the tabs.
	const tabs = useMemo( () => {
		return Object.keys( settings ).map( ( tabKey: string ) => {
			const tab = settings[ tabKey ];
			const defaultSection = Object.keys( tab.sub_sections )[ 0 ];
			const sections: ISection[] = [];

			Object.keys( tab.sub_sections ).map( ( sectionKey ) => {
				const section = tab.sub_sections[ sectionKey ];

				sections.push( {
					name: sectionKey,
					title: section.label,
					settings: section.settings,
					path: `/${ tabKey }/${ sectionKey }`,
				} );
			} )

			return {
				name: tabKey,
				title: tab.label,
				path: `/${ tabKey }/${ defaultSection }`,
				sections,
			} as ITab;
		} );
	}, [ settings ] );

	// Show unsaved changes warning.
	useEffect( () => {

		/**
		 * Warns the user if there are unsaved changes before leaving the editor.
		 *
		 * @param {Event} event `beforeunload` event.
		 *
		 * @return {string | undefined} Warning prompt message, if unsaved changes exist.
		 */
		const warnIfUnsavedChanges = ( event: BeforeUnloadEvent ) => {
			if ( hasPendingChanges.current ) {
				event.returnValue = __(
					'You have unsaved changes. If you proceed, they will be lost.'
				);
				return event.returnValue;
			}
		};

		window.addEventListener( 'beforeunload', warnIfUnsavedChanges );

		return () => {
			window.removeEventListener( 'beforeunload', warnIfUnsavedChanges );
		};
	}, [ hasPendingChanges.current ] );

	/**
	 * Save the settings.
	 */
	const save = useCallback( () => {
		setIsSaving( true );
		hasPendingChanges.current = false;

		// Save the options.
		apiFetch( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: { [ option_name ]: { ...options } },
		} )

			// Update the state on success.
			.then( ( res ) => {

				// Display a success message.
				createSuccessNotice(
					__( 'Settings saved.' ),
					{
						type: 'snackbar',
					}
				);

				// Update the options.
				if ( typeof res === 'object' && res !== null && option_name in res ) {
					setOptions( res[ option_name ] as Record<string, any> );
				}

				return res;
			} )

			// Display an error on failure.
			.catch( ( err ) => {
				if ( err.message ) {
					createErrorNotice( err.message );
				} else {
					createErrorNotice( __( 'An error occurred while saving.' ) );
				}
			} )

			// Reset the state.
			.finally( () => {
				setIsSaving( false );
			} );
	}, [ options, setOptions, setIsSaving, createSuccessNotice, createErrorNotice, option_name ] );

	/**
	 * Sets options attributes.
	 */
	const setAttributes = useCallback( ( attributes: Record<string, any> ) => {
		hasPendingChanges.current = true;
		setOptions( {
			...options,
			...attributes,
		} );
	}, [ options, setOptions ] );

	const prepared = useMemo( () => {
		return {
			option_name,
			saved: options,
			settings: tabs,
			isSaving,
			save,
			setAttributes,
		};
	}, [ option_name, options, tabs, isSaving, save, setAttributes ] );

	const style: React.CSSProperties = useMemo( () => {
		return {
			pointerEvents: isSaving ? 'none' : 'auto',
			cursor: isSaving ? 'wait' : 'auto',
		};
	}, [ isSaving ] );

	return (
		<SettingsContext.Provider value={ prepared }>
			<div style={ style }>
				{ children }
			</div>
		</SettingsContext.Provider>
	);
};
