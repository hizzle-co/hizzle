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
	store as interfaceStore,
} from '@wordpress/interface';
import { useSelect } from '@wordpress/data';
import { useViewportMatch } from '@wordpress/compose';

const STORE_NAME = 'hizzlewp/interface';

const WithFullscreenMode = ({ children }: { children: React.ReactNode }) => {
	const isFullscreenActive = useSelect(
		(select) =>
			!!select(interfaceStore).isFeatureActive(
				STORE_NAME,
				'fullscreenMode'
			),
		[]
	);

	const isMobileViewport = useViewportMatch('medium', '<');

	return (
		<>
			<FullscreenMode
				isActive={isFullscreenActive && !isMobileViewport}
			/>
			{children}
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
export const Interface = ({ className = '', ...rest }: { className?: string } & Record<string, any>) => {
	const useClassName = ['hizzlewp-app__interface', className]
		.filter(Boolean)
		.join(' ');

	return (
		<WithFullscreenMode>
			<InterfaceSkeleton
				className={useClassName}
				isDistractionFree={false}
				{...rest}
			/>
		</WithFullscreenMode>
	);
};
