/**
 * External dependencies.
 */
import React, { useMemo, useCallback } from 'react';

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
	__experimentalHeading as Heading,
	NavigableMenu,
	Card,
} from '@wordpress/components';
import type { ButtonProps } from '@wordpress/components/build-types/button/types';
import { __ } from "@wordpress/i18n";
import { arrowLeft, rotateRight } from "@wordpress/icons";
import { useDispatch } from '@wordpress/data';

/**
 * HizzleWP dependencies.
 */
import { ErrorBoundary } from '@hizzlewp/components';
import { Outlet, useRoute, updatePath } from '@hizzlewp/history';
import { CollectionProvider, useProvidedCollectionConfig, store as hizzleStore } from '@hizzlewp/store';

/**
 * Internal dependencies.
 */
import { UpsellCard } from "../upsell";
import { usePreparedQuery } from './records-table';

/**
 * Refreshes the records.
 */
const RefreshRecords = ( { namespace, collection } ) => {
	const query = usePreparedQuery( namespace, collection );
	const { invalidateResolution } = useDispatch( hizzleStore );
	const onRefresh = () => invalidateResolution( 'getCollectionRecords', [ namespace, collection, query ] );

	return (
		<Button
			icon={ rotateRight }
			onClick={ onRefresh }
			variant="tertiary"
			label="Refresh"
			showTooltip
		/>
	)
};

/**
 * Displays main layout.
 *
 * @param {Object} props
 */
const Layout = (): React.ReactNode => {
	const { config: { namespace, collection, labels, routes, fills } } = useProvidedCollectionConfig();
	const { path } = useRoute();

	const basePath = `/${ namespace }/${ collection }`;

	const actions = useMemo( () => {
		const actions: ButtonProps[] = [];

		if ( basePath !== path ) {
			return actions;
		}

		// Show button to add new item.
		actions.push( {
			text: labels?.add_new_item || 'Add New',
			onClick: () => updatePath( `${ basePath }/add` ),
			variant: 'primary',
		} );

		if ( routes ) {
			Object.entries( routes ).forEach( ( [ route, { title, ...extra } ] ) => {
				actions.push( {
					text: title,
					onClick: !extra.href ? () => updatePath( route ) : undefined,
					variant: 'secondary',
					...extra,
				} );
			} );
		}

		return actions;
	}, [ labels, routes, path ] );

	/**
	 * Goes to the collection index.
	 */
	const goToCollectionIndex = useCallback( () => {
		updatePath( `${ namespace }/${ collection }` );
	}, [ namespace, collection ] );

	return (
		<>
			<HStack wrap>

				<ErrorBoundary>
					<HStack expanded={ false } spacing={ 2 } justify="flex-start" wrap>
						{
							basePath !== path ? (
								<>
									<Button
										variant="primary"
										onClick={ goToCollectionIndex }
										icon={ arrowLeft }
										label={ labels?.view_items || 'View Items' }
										showTooltip
										__next40pxDefaultSize
									/>

									<span>
										<Slot name={ `${ basePath }/title` } />
									</span>
								</>
							) : (
								<>
									<Heading level={ 1 } size={ 16 } truncate>
										{ labels?.name || 'Items' }
									</Heading>
									<RefreshRecords namespace={ namespace } collection={ collection } />
								</>
							)
						}
					</HStack>
				</ErrorBoundary>
				<ErrorBoundary>
					{ actions.length > 0 ? (
						<HStack
							as={ NavigableMenu }
							orientation="horizontal"
							className="hizzle-store-ui__header-menu"
							expanded={ false }
							spacing={ 0 }
							alignment="stretch"
							wrap
						>
							{ actions.map( ( action ) => (
								<ErrorBoundary key={ action.text }>
									<Button __next40pxDefaultSize { ...action } />
								</ErrorBoundary>
							) ) }
						</HStack>
					) : (
						<Slot name={ `${ basePath }/actions` } />
					) }
				</ErrorBoundary>
			</HStack>
			<Card isRounded={ false }>

				<ErrorBoundary>
					<Outlet path="/:namespace/:collection" />
				</ErrorBoundary>

				{ fills && fills.map( ( fill ) => (
					<Fill key={ fill.name } name={ `${ fill.name }` }>
						<ErrorBoundary>
							{ fill.content && <span dangerouslySetInnerHTML={ { __html: fill.content } } /> }
							{ fill.upsell && <UpsellCard upsell={ fill.upsell } /> }
						</ErrorBoundary>
					</Fill>
				) ) }
			</Card>
		</>
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
	const id = params?.get( 'recordId' );

	// Render the rest of the page.
	return (
		<CollectionProvider namespace={ namespace } collection={ collection } recordId={ id ? Number( id ) : id }>
			<ErrorBoundary>
				<CheckConfig>
					<Layout />
				</CheckConfig>
			</ErrorBoundary>
		</CollectionProvider>
	);
};
