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
	DropdownMenu,
	MenuItem,
	Slot,
} from '@wordpress/components';
import type { ButtonProps } from '@wordpress/components/build-types/button/types';
import type { MenuItemProps } from '@wordpress/components/build-types/menu-item/types';
import { arrowRight, chevronDownSmall } from '@wordpress/icons';

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
		menu?: HeaderMenuItem[];
	};
	actions?: Record<string, any>[];
	extra?: React.ReactNode;
};

type HeaderSubMenuItem = Record<string, any> & Partial<ButtonProps>;
type HeaderMenuItem = HeaderSubMenuItem & {
	items?: HeaderSubMenuItem[];
};

const renderHeaderMenuItem = ( item: HeaderMenuItem, index: number ) => {
	if ( !Array.isArray( item.items ) || 1 > item.items.length ) {
		return (
			<Button
				key={ index }
				role="menuitem"
				__next40pxDefaultSize
				{ ...item as ButtonProps }
			/>
		);
	}

	const { items, href, ...toggleProps } = item;

	return (
		<DropdownMenu
			key={ index }
			icon={ chevronDownSmall }
			label={ toggleProps.label || toggleProps.text || '' }
			text={ toggleProps.text || toggleProps.label || '' }
			className="hizzle-interface__header-menu-dropdown"
			toggleProps={ {
				role: 'menuitem',
				__next40pxDefaultSize: true,
				iconPosition: 'right',
				...toggleProps as Record<string, any>,
			} }
		>
			{ ( { onClose } ) => (
				<>
					{ items.map( ( child, childIndex ) => {
						const {
							onClick: childOnClick,
							href: childHref,
							children: childContent,
							className: childClassName,
							...childProps
						} = child;

						return (
							<MenuItem
								key={ childIndex }
								role="menuitem"
								icon={ arrowRight }
								iconPosition="left"
								className={ `${ childClassName || '' } hizzle-interface__header-menu-dropdown-item` }
								{ ...childProps as MenuItemProps }
								onClick={ ( event ) => {
									if ( childHref ) {
										window.location.href = childHref;
									}

									childOnClick?.( event );
									onClose();
								} }
							>
								{ childContent ?? childProps.label }
							</MenuItem>
						);
					} ) }
				</>
			) }
		</DropdownMenu>
	);
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
							width={ 40 }
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
					{ brand?.menu && brand.menu.map( renderHeaderMenuItem ) }
					{ actions && actions.map( ( action, index ) => (
						<Button key={ index } role="menuitem" __next40pxDefaultSize { ...action } />
					) ) }
				</HStack>
			) }
			<Slot name="hizzle-interface__header" />
		</HStack>
	);
};
