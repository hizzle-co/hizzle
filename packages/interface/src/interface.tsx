/**
 * External dependencies.
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import {
	InterfaceSkeleton,
	FullscreenMode,
} from '@wordpress/interface';
import { store as preferencesStore } from '@wordpress/preferences';
import { useSelect, useDispatch } from '@wordpress/data';
import { useViewportMatch } from '@wordpress/compose';

const STORE_NAME = 'hizzlewp/interface';

export const usePreferences = <T = any>( key: string, namespace: string = STORE_NAME ) => {
	const preferences = useSelect(
		( select ) => select( preferencesStore ).get( namespace, key ) as T,
		[ key ]
	);

	const { set } = useDispatch( preferencesStore );

	return {
		preferences,
		setPreferences: ( value: T ) => set( namespace, key, value ),
	};
};

const WithFullscreenMode = ( { children, storeName = STORE_NAME }: { children: React.ReactNode, storeName?: string } ) => {
	const isFullscreenActive = useSelect(
		( select ) =>
			!!select( preferencesStore ).get( storeName || STORE_NAME, 'fullscreenMode' ),
		[ storeName ]
	);

	const isMobileViewport = useViewportMatch( 'medium', '<' );

	return (
		<>
			<FullscreenMode
				isActive={ isFullscreenActive && !isMobileViewport }
			/>
			{ children }
		</>
	);
};

/**
 * The main interface component for the application.
 *
 * @param {Object} props                     Component props.
 * @param {React.ReactNode} [props.header]   Header component.
 * @param {React.ReactNode} [props.sidebar]  Sidebar component.
 * @param {React.ReactNode} [props.secondarySidebar] Secondary sidebar component.
 * @param {React.ReactNode} [props.content]  Content component.
 * @param {React.ReactNode} [props.footer]   Footer component.
 * @param {React.ReactNode} [props.actions]  Action components.
 * @param {React.ReactNode} [props.editorNotices] Editor notices component.
 * @param {boolean} [props.isDistractionFree] Whether the interface is in distraction free mode.
 * @param {Object} [props.labels]            Interface labels.
 * @param {string} [props.className]         Additional CSS class names.
 * @return {JSX.Element}              The interface component.
 */
export const Interface = ( { className = '', storeName = STORE_NAME, ...rest }: { className?: string, storeName?: string } & Record<string, any> ) => {
	const useClassName = [ 'hizzlewp-app__interface', className ]
		.filter( Boolean )
		.join( ' ' );

	return (
		<WithFullscreenMode storeName={ storeName }>
			<InterfaceSkeleton
				className={ useClassName }
				isDistractionFree={ false }
				{ ...rest }
			/>
		</WithFullscreenMode>
	);
};
