/**
 * External dependencies.
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalSurface as Surface,
	__experimentalText as Text,
	NavigableMenu,
	Button,
	Slot,
} from '@wordpress/components';
import type { ButtonProps } from '@wordpress/components/build-types/button/types';

/**
 * HizzleWP dependencies
 */
import { ImageOrIcon } from '@hizzlewp/components';

/**
 * HizzleWP header props.
 */
type HeaderProps = {
	brand?: {
		/**
		 * The brand logo URL.
		 */
		logo?: string;

		/**
		 * The brand name.
		 */
		name?: string;

		/**
		 * The brand version.
		 */
		version?: string;

		/**
		 * Available navigation links.
		 */
		menu?: Partial<ButtonProps>[];
	};
	actions?: Record<string, any>[];
	extra?: React.ReactNode;
};

export const Header = ( {
	brand = undefined,
	actions = undefined,
	extra = undefined,
}: HeaderProps ) => {
	if ( !brand && !actions && !extra ) {
		return null;
	}

	return (
		<HStack
			as={ Surface }
			style={ { paddingLeft: 20, paddingRight: 20, zIndex: 1000 } }
			spacing={ 4 }
			wrap
		>
			{ brand && (
				<HStack
					expanded={ false }
					style={ { paddingTop: 10, paddingBottom: 10 } }
					wrap
				>
					{ brand?.logo && (
						<ImageOrIcon
							image={ brand.logo }
							alt={ brand.name }
							width={ 24 }
						/>
					) }
					{ brand?.name && (
						<Text weight={ 600 } size={ 14 }>
							{ brand?.name }
						</Text>
					) }
					{ brand?.version && (
						<Text weight={ 600 } size={ 14 } variant="muted">
							{ brand?.version }
						</Text>
					) }
				</HStack>
			) }
			{ extra && (
				<div style={ { paddingTop: 10, paddingBottom: 10 } }>{ extra }</div>
			) }
			{ ( brand?.menu || actions ) && (
				<HStack
					as={ NavigableMenu }
					orientation="horizontal"
					className="hizzle-interface__header-menu"
					expanded={ false }
					spacing={ 1 }
					alignment="stretch"
					wrap
				>
					{ brand?.menu && brand.menu.map( ( item, index ) => (
						<Button
							key={ index }
							role="menuitem"
							__next40pxDefaultSize
							{ ...item }
						/>
					) ) }
					{ actions && actions.map( ( action, index ) => (
						<Button key={ index } role="menuitem" __next40pxDefaultSize { ...action } />
					) ) }
				</HStack>
			) }
			<Slot name="hizzle-interface__header" />
		</HStack>
	);
};
