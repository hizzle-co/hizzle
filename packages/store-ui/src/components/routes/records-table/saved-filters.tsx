/**
 * External dependencies
 */
import React, { useState, useMemo, useCallback } from "react";

/**
 * WordPress dependencies
 */
import {
	Button,
	Modal,
	SelectControl,
	Notice,
	__experimentalInputControl as InputControl,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
} from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs, getQueryArgs } from '@wordpress/url';

/**
 * HizzleWP dependencies
 */
import { useProvidedCollectionConfig } from "@hizzlewp/store";
import { usePreferences } from '@hizzlewp/interface';
import type { SelectOption } from "@hizzlewp/components";
import { updateQueryString, useQuery } from '@hizzlewp/history';

/**
 * A saved filter configuration.
 */
type SavedFilters = { [ query: string ]: string };

/**
 * Hook to manage saved filters using WordPress preferences
 */
const useSavedFilters = ( namespace: string, collection: string ) => {
	const { preferences, setPreferences } = usePreferences<SavedFilters>( 'savedFilters', `${ namespace }/${ collection }` );
	const savedFilters: SavedFilters = preferences || {};

	/**
	 * Saves a new filter configuration.
	 */
	const saveFilter = ( name: string, query: string ) => {
		setPreferences( {
			...savedFilters,
			[ prepareQueryString( query ) ]: name.trim(),
		} );
	};

	/**
	 * Deletes a saved filter configuration.
	 */
	const deleteFilter = ( query: string ) => {
		setPreferences(
			Object.fromEntries(
				Object.entries( savedFilters ).filter( ( [ key ] ) => key !== prepareQueryString( query ) )
			)
		);
	};

	return {
		savedFilters: {
			...Object
				.entries( savedFilters.savedFilters )
				.reduce(
					(
						acc,
						[ query, name ] ) => ( { ...acc, [ prepareQueryString( query ) ]: name.trim() } ),
					{} as Record<string, string>
				)
		},
		saveFilter,
		deleteFilter,
	};
};

/**
 * Hook that returns all available filters (default + saved).
 */
export const useAvailableFilters = () => {
	const { config: { namespace, collection, defaultFilters } } = useProvidedCollectionConfig();
	const savedFilters = useSavedFilters( namespace, collection );
	const preparedDefaultFilters: SavedFilters = {
		...Object
			.entries( defaultFilters || {} )
			.reduce(
				(
					acc,
					[ query, name ] ) => ( { ...acc, [ prepareQueryString( query ) ]: name.trim() } ),
				{} as Record<string, string>
			),
	};

	const allFilters = useMemo( () => {
		return {
			...savedFilters.savedFilters,
			...preparedDefaultFilters,
		}
	}, [ savedFilters, preparedDefaultFilters ] );

	return {
		...savedFilters,
		defaultFilters: preparedDefaultFilters,
		allFilters,
		getQueryName( query: Record<string, string> ) {
			return allFilters[ prepareQueryString( addQueryArgs( '', query ) ) ];
		},
		hasNamedFilter( name: string ) {
			return Boolean( savedFilters.savedFilters[ name.trim() ] );
		},
	};
};

/**
 * Modal for saving current filters
 */
const SaveFilterModal: React.FC<{
	onClose: () => void;
	allFilters: SavedFilters;
	onSave: ( name: string ) => void;
}> = ( { onClose, allFilters, onSave } ) => {
	const [ filterName, setFilterName ] = useState<string | undefined>( '' );
	const [ error, setError ] = useState<string>( '' );

	const handleSave = () => {
		if ( !filterName?.trim() ) {
			setError( __( 'Please enter a filter name.', 'hizzlewp' ) );
			return;
		}

		if ( Object.values( allFilters ).find( savedName => savedName === filterName.trim() ) ) {
			// Ask for confirmation to overwrite
			if ( !window.confirm(
				sprintf(
					// translators: %s: filter name
					__( 'A filter named "%s" already exists. Do you want to overwrite it?', 'hizzlewp' ),
					filterName.trim()
				)
			) ) {
				return;
			}
		}

		onSave( filterName.trim() );
		handleClose();
	};

	const handleClose = () => {
		setFilterName( '' );
		setError( '' );
		onClose();
	};

	return (
		<Modal
			title={ __( 'Add to saved filters', 'hizzlewp' ) }
			onRequestClose={ handleClose }
		>
			<VStack>
				{ error && (
					<Notice status="error" isDismissible={ false }>
						{ error }
					</Notice>
				) }

				<InputControl
					label={ __( 'Filter Name', 'hizzlewp' ) }
					value={ filterName }
					onChange={ setFilterName }
					placeholder={ __( 'Enter a name for this filter set', 'hizzlewp' ) }
					onKeyDown={ ( e ) => {
						if ( e.key === 'Enter' ) {
							e.preventDefault();
							handleSave();
						}
					} }
					__next40pxDefaultSize
				/>

				<HStack justify="flex-end" spacing={ 2 }>
					<Button variant="tertiary" onClick={ handleClose }>
						{ __( 'Cancel', 'hizzlewp' ) }
					</Button>
					<Button variant="primary" onClick={ handleSave }>
						{ __( 'Save Filter', 'hizzlewp' ) }
					</Button>
				</HStack>
			</VStack>
		</Modal>
	);
};

/**
 * Main component for managing saved filters
 */
export const SavedFiltersManager: React.FC<{ query: Record<string, any> }> = ( { query } ) => {
	const preparedQuery = prepareQueryString( addQueryArgs( '', query ) );
	const { savedFilters, saveFilter, deleteFilter, allFilters, defaultFilters } = useAvailableFilters();
	const isQuerySaved = !!allFilters[ preparedQuery ];
	const isDefaultQuery = !!defaultFilters[ preparedQuery ];
	const [ isSaveModalOpen, setIsSaveModalOpen ] = useState( false );

	return (
		<>
			{ ( isQuerySaved && !isDefaultQuery ) && (
				<Button
					size="compact"
					variant="tertiary"
					onClick={ () => deleteFilter( preparedQuery ) }
					icon="trash"
					label={ __( 'Remove from saved filters', 'hizzlewp' ) }
					isDestructive
					showTooltip
				/>
			) }

			{ !isQuerySaved && (
				<>
					<Button
						size="compact"
						variant="tertiary"
						onClick={ () => setIsSaveModalOpen( true ) }
						icon="heart"
						label={ __( 'Add to saved filters', 'hizzlewp' ) }
						showTooltip
					/>

					{ isSaveModalOpen && (
						<SaveFilterModal
							onClose={ () => setIsSaveModalOpen( false ) }
							allFilters={ allFilters }
							onSave={ ( name ) => saveFilter( name, preparedQuery ) }
						/>
					) }
				</>
			) }
		</>
	);
};

/**
 * Allows a user to select saved filters / views.
 */
export const SavedFiltersDropdown: React.FC = () => {
	const { allFilters } = useAvailableFilters();
	const query = addQueryArgs( '', useQuery() );

	// Prepare options for the select control.
	const options: SelectOption[] = [
		{
			label: __( 'Select a view...', 'hizzlewp' ),
			value: '',
			disabled: true,
		},
		...Object.entries( allFilters ).map( ( [ value, label ] ) => ( { label, value } ) )
	];

	const onChange = useCallback( ( newQuery: string ) => {
		if ( newQuery ) {
			updateQueryString( { ...getQueryArgs( prepareQueryString( newQuery ) ), paged: '1' } );
		}
	}, [ updateQueryString ] );

	// Abort if no filters available.
	if ( Object.keys( allFilters ).length === 0 ) {
		return null;
	}

	return (
		<SelectControl
			label={ __( 'Select a view...', 'hizzlewp' ) }
			value={ prepareQueryString( query ) }
			options={ options }
			onChange={ onChange }
			style={ { maxWidth: 200 } }
			__nextHasNoMarginBottom
			hideLabelFromVision
		/>
	);
};

/**
 * Prepares a query string.
 */
export const prepareQueryString = ( query: string ) => {

	// Abort if no query.
	if ( !query ) {
		return '';
	}

	// Parse query args.
	const { paged, per_page, page, ...queryArgs } = getQueryArgs( query );

	// Abort if no query args.
	if ( Object.keys( queryArgs ).length === 0 ) {
		return '';
	}

	// Order query args.
	const orderedQueryArgs = Object.keys( queryArgs ).sort().reduce( ( obj, key ) => {
		obj[ key ] = queryArgs[ key ];
		return obj;
	}, {} as Record<string, unknown> );

	// Return ordered query string.
	return addQueryArgs( '', orderedQueryArgs );
};
