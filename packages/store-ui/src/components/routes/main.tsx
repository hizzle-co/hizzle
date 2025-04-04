/**
 * External dependencies.
 */
import React, { useMemo } from 'react';

/**
 * WordPress dependencies.
 */
import {
	Spinner,
	Notice,
	Fill,
	Slot,
	Button,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalHeading as Heading,
	__experimentalText as Text,
	Card,
	CardHeader,
	CardBody,
} from '@wordpress/components';
import type { ButtonProps } from '@wordpress/components/build-types/button/types';
import { __ } from "@wordpress/i18n";

/**
 * HizzleWP dependencies.
 */
import { ErrorBoundary } from '@hizzlewp/components';
import { Outlet, useRoute, updatePath } from '@hizzlewp/history';
import { CollectionProvider, useProvidedCollectionConfig } from '@hizzlewp/store';

/**
 * Internal dependencies.
 */
import { UpsellCard } from "../upsell";

/**
 * Displays main layout.
 *
 * @param {Object} props
 */
const Layout = (): React.ReactNode => {
	const { config } = useProvidedCollectionConfig();
	const { path } = useRoute();

	const basePath = `/${ config.namespace }/${ config.collection }`;

	const actions = useMemo( () => {
		const actions: ButtonProps[] = [];

		if ( !config ) {
			return actions;
		}

		if ( basePath === path ) {
			// Show button to add new item.
			actions.push( {
				text: config.labels?.add_new_item || 'Add New',
				onClick: () => updatePath( `${ basePath }/add` ),
				variant: 'primary',
			} );
		} else {
			// Show button to view items.
			actions.push( {
				text: config.labels?.view_items || 'View Items',
				onClick: () => updatePath( basePath ),
				variant: 'primary',
			} );
		}

		if ( config.routes ) {
			Object.entries( config.routes ).forEach( ( [ route, { title, ...extra } ] ) => {
				actions.push( {
					text: title,
					onClick: !extra.href ? () => updatePath( route ) : undefined,
					...extra,
				} );
			} );
		}

		return actions;
	}, [ config, path ] );

	return (
		<Card isRounded={ false }>
			<CardHeader as={ HStack }>
				<Heading level={ 1 } size={ 18 } variant="muted">
					{ config.labels?.name || 'Items' }
					<Slot name={ `${ basePath }/title` }>
						{ ( fills ) => (
							( Array.isArray( fills ) && fills.length > 0 ) && (
								<ErrorBoundary>
									<Text variant="muted">/</Text>
									<Text>{ fills }</Text>
								</ErrorBoundary>
							)
						) }
					</Slot>
				</Heading>
				<ErrorBoundary>
					<HStack expanded={ false }>
						{ actions.map( ( action ) => (
							<ErrorBoundary key={ action.text }>
								<Button { ...action } />
							</ErrorBoundary>
						) ) }
					</HStack>
				</ErrorBoundary>
			</CardHeader>

			<CardBody>
				<VStack>
					<ErrorBoundary>
						<Outlet path="/:namespace/:collection" />
					</ErrorBoundary>
					<Slot name="noptin-interface-notices" />
					{ config.fills && config.fills.map( ( fill ) => (
						<Fill key={ fill.name } name={ `${ fill.name }` }>
							<ErrorBoundary>
								{ fill.content && <span dangerouslySetInnerHTML={ { __html: fill.content } } /> }
								{ fill.upsell && <UpsellCard upsell={ fill.upsell } /> }
							</ErrorBoundary>
						</Fill>
					) ) }
				</VStack>
			</CardBody>
		</Card>
	);
}

/**
 * Ensure that the collection config is loaded before rendering the page.
 *
 * @param {Object} props
 */
export const CheckConfig = ( { children } ) => {
	const { config, isResolving, hasResolved, error } = useProvidedCollectionConfig();

	// Show loading indicator if still resolving.
	if ( isResolving || !hasResolved ) {
		return <Spinner />;
	}

	// Show error if any.
	if ( error || !config ) {
		return (
			<Notice status="error" isDismissible={ false }>
				{ error?.message || 'An unknown error occurred.' }
			</Notice>
		);
	}

	return (
		<ErrorBoundary>
			{ children }
		</ErrorBoundary>
	);
}

/**
 * Displays the main layout.
 *
 * @param {Object} props
 */
export const Main = ( { defaultNamespace, defaultCollection }: { defaultNamespace: string, defaultCollection: string } ) => {

	const { params } = useRoute();
	const namespace = params?.get( 'namespace' ) || defaultNamespace;
	const collection = params?.get( 'collection' ) || defaultCollection;
	const id = params?.get( 'id' );

	// Render the rest of the page.
	return (
		<CollectionProvider namespace={ namespace } collection={ collection } recordId={ id }>
			<ErrorBoundary>
				<CheckConfig>
					<Layout />
				</CheckConfig>
			</ErrorBoundary>
		</CollectionProvider>
	);
};
