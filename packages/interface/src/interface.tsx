/**
 * External dependencies.
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { InterfaceSkeleton } from '@wordpress/interface';
import { __ } from '@wordpress/i18n';

/**
 * The main interface component for the application.
 *
 * @param {Object} props              Component props.
 * @param {React.ReactNode} [props.header]   Header component.
 * @param {React.ReactNode} [props.sidebar]  Sidebar component.
 * @param {React.ReactNode} [props.content]  Content component.
 * @param {React.ReactNode} [props.footer]   Footer component.
 * @param {React.ReactNode} [props.actions]  Action components.
 * @param {string} [props.className]  Additional CSS class names.
 * @return {JSX.Element}              The interface component.
 */
export const NoptinInterface = (props) => (
	<InterfaceSkeleton className="noptin-app__interface" {...props} />
);
