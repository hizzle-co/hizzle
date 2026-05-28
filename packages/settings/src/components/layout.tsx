/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * HizzleWP dependencies.
 */
import { Interface, Header, Footer } from '@hizzlewp/interface';

/**
 * Local dependancies.
 */
import { Settings } from './settings';
import { useSaveButtonProps } from './use-save-button-props';

const TheHeader = ( props ) => {

	return (
		<Header
			{ ...props }
			actions={ [
				useSaveButtonProps(),
			] }
		/>
	);
}

const TheFooter = () => (
	<Footer>
		<Button {...useSaveButtonProps() } />
	</Footer>
);

export default function Layout( props ): React.ReactNode {

	return (
		<Interface
			className="hizzlewp-settings__interface"
			header={ <TheHeader { ...props } /> }
			content={ <Settings /> }
			editorNotices={ true }
			footer={ <TheFooter /> }
		/>
	);
}
