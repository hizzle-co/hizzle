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
import { __experimentalVStack as VStack } from '@wordpress/components';

/**
 * Local dependencies.
 */
import { InterfaceNotices, InterfaceSnackbars } from './notices';

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
 * Props for the main interface component for the application.
 */
export interface InterfaceProps extends Record<string, any> {
	/**
	 * Header component.
	 */
	header?: React.ReactNode;

	/**
	 * Sidebar component.
	 */
	sidebar?: React.ReactNode;

	/**
	 * Secondary sidebar component.
	 */
	secondarySidebar?: React.ReactNode;

	/**
	 * Content component.
	 */
	content?: React.ReactNode;

	/**
	 * Footer component.
	 */
	footer?: React.ReactNode;

	/**
	 * Action components.
	 */
	actions?: React.ReactNode;

	/**
	 * Editor notices component.
	 */
	editorNotices?: React.ReactNode | true;

	/**
	 * Whether the interface is in distraction-free mode.
	 */
	isDistractionFree?: boolean;

	/**
	 * Interface labels.
	 */
	labels?: Record<string, string>;

	/**
	 * Additional CSS class names.
	 */
	className?: string;
}

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
 * @param {React.ReactNode|true} [props.editorNotices] Editor notices component.
 * @param {boolean} [props.isDistractionFree] Whether the interface is in distraction free mode.
 * @param {Object} [props.labels]            Interface labels.
 * @param {string} [props.className]         Additional CSS class names.
 * @return {JSX.Element}              The interface component.
 */
export const Interface = ( { className = '', storeName = STORE_NAME, content, editorNotices, ...rest }: InterfaceProps ) => {
	const useClassName = [ 'hizzlewp-app__interface', className ]
		.filter( Boolean )
		.join( ' ' );

	let newContent = content;

	if ( true === editorNotices ) {
		newContent = (
			<VStack>
				<InterfaceSnackbars />
				<InterfaceNotices />
				{ content }
			</VStack>
		);
	}

	return (
		<WithFullscreenMode storeName={ storeName }>
			<InterfaceSkeleton
				className={ useClassName }
				isDistractionFree={ false }
				content={ newContent }
				editorNotices={ true === editorNotices ? undefined : editorNotices }
				{ ...rest }
			/>
		</WithFullscreenMode>
	);
};
