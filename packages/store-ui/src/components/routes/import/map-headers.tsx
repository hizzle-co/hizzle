/**
 * External dependencies
 */
import Papa from 'papaparse';
import React, { useState, useEffect, useMemo } from "react";

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	Notice,
	Tip,
	TextControl,
	ToggleControl,
	SelectControl,
	Button,
	Slot,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from "@wordpress/components";

/**
 * HizzleWP dependencies
 */
import { useProvidedCollectionConfig } from '@hizzlewp/store';
import { useOptions } from '@hizzlewp/components';

/**
 * Normalizes a string to make it possible to guess the header.
 *
 * @param {string} string The string to normalize.
 * @returns {string} The normalized string.
 */
const normalizeString = ( string ) => {

	// Strip all non-alphanumeric characters.
	string = string.replace( /[^a-zA-Z0-9]/g, '' );

	// Convert to lowercase.
	string = string.toLowerCase();

	// If begins with cf_ or meta_, remove it.
	if ( string.startsWith( 'cf' ) ) {
		string = string.slice( 2 );
	}

	if ( string.startsWith( 'meta' ) ) {
		string = string.slice( 4 );
	}

	return string;
}

/**
 * Allows the user to map a single header.
 *
 * @param {Object} props
 * @param {Array} props.options The available options.
 * @param {Object} props.field The field.
 * @param {string} props.value The current value.
 * @param {Function} props.setValue The function to set the value.
 * @param {string} props.customValue The current custom value.
 * @param {Function} props.setCustomValue The function to set the custom value.
 */
const MapHeader = ( { options, fieldOptions, fieldLabel, value, setValue, customValue, setCustomValue } ) => {

	const preparedOptions = useOptions( fieldOptions );

	return (
		<HStack spacing={ 4 } justify="flex-start" wrap >

			<SelectControl
				label={ fieldLabel }
				value={ value }
				onChange={ setValue }
				options={ options }
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				style={ { width: '320px', maxWidth: '100%' } }
			/>

			{ '-1' === value && (
				<>
					{ preparedOptions.length > 0 ? (
						<SelectControl
							label={ __( 'Select value', 'newsletter-optin-box' ) }
							value={ customValue }
							onChange={ setCustomValue }
							options={ [
								{ value: '', label: __( 'Select value', 'newsletter-optin-box' ), disabled: true },
								...preparedOptions ]
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							style={ { width: '320px', maxWidth: '100%' } }
						/>
					) : (
						<TextControl
							label={ __( 'Enter value', 'newsletter-optin-box' ) }
							placeholder={ __( 'Enter a value to assign all imported records', 'newsletter-optin-box' ) }
							value={ customValue }
							onChange={ setCustomValue }
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							style={ { width: '320px', maxWidth: '100%' } }
						/>
					) }
				</>
			) }

		</HStack>
	);
}

export interface MappedHeaders {
	[ key: string ]: {
		/**
		 * The value of the header.
		 */
		value: string;

		/**
		 * Whether the header is mapped.
		 */
		mapped: boolean;

		/**
		 * The custom value of the header.
		 */
		customValue?: any;

		/**
		 * Whether the header is a boolean.
		 */
		is_boolean?: boolean;
	};
}

/**
 * Allows the user to map CSV headers to fields.
 *
 * @param {Object} props
 * @param {Object} props.file The file to import.
 * @param {Object} props.schema The schema of the collection.
 * @param {Array} props.ignore The fields to ignore.
 * @param {Array} props.hidden The fields to hide.
 * @param {Function} props.back The callback to call when clicking on the back button.
 * @param {Function} props.onContinue A callback to call when the headers are set.
 */
export const MapHeaders = ( { file, back, onContinue } ) => {

	const { config: { namespace, collection, ignore, props } } = useProvidedCollectionConfig() || {};

	// Prepare state.
	const [ fileHeaders, setFileHeaders ] = useState( [] );
	const [ mappedHeaders, setMappedHeaders ] = useState<MappedHeaders>( {} );
	const [ updateRecords, setUpdateRecords ] = useState( false );
	const [ error, setError ] = useState<Error | null>( null );

	// Parse the first few lines of the file to get the headers.
	useEffect( () => {
		Papa.parse( file, {
			header: true,
			skipEmptyLines: 'greedy',
			preview: 5,
			complete: ( results ) => {
				setFileHeaders( results.meta.fields );
			},
			error( error ) {
				setError( error );
			},
		} );
	}, [ file ] );

	// Try guessing the headers.
	useEffect( () => {
		if ( !fileHeaders.length ) {
			return;
		}

		const guessedHeaders = {};

		// Loop through the headers.
		fileHeaders.forEach( ( header ) => {

			const normalizedHeader = normalizeString( header );
			let partialMatch = false;

			// Loop through the fields.
			let match = props.find( ( field ) => {

				// If the field is hidden or ignored, don't show it.
				if ( 'date_created' !== field.name && ( field.readonly || [ ...ignore, 'id' ].includes( field.name ) ) ) {
					return false;
				}

				const normalizedKey = normalizeString( field.name );
				const normalizedLabel = normalizeString( field.label );

				return normalizedHeader === normalizedKey || normalizedHeader === normalizedLabel;
			} );

			// If no match, check for a partial match.
			if ( !match ) {
				match = props.find( ( field ) => {

					// If the field is hidden or ignored, don't show it.
					if ( 'date_created' !== field.name && ( field.readonly || [ ...ignore, 'id' ].includes( field.name ) ) ) {
						return false;
					}

					const normalizedKey = normalizeString( field.name );
					const normalizedLabel = normalizeString( field.label );

					return normalizedHeader.includes( normalizedKey ) || normalizedHeader.includes( normalizedLabel ) || normalizedKey.includes( normalizedHeader ) || normalizedLabel.includes( normalizedHeader );
				} );

				partialMatch = true;
			}

			if ( match && ( !partialMatch || !guessedHeaders[ match.name ] ) ) {
				guessedHeaders[ match.name ] = {
					mapped: true,
					value: header,
					is_boolean: match.is_boolean,
				}
			}
		} );

		setMappedHeaders( guessedHeaders );

	}, [ fileHeaders, props ] );

	// Prepare the select values.
	const selectValues = useMemo( () => {

		const values = [
			{
				value: '',
				label: __( 'Ignore Field', 'newsletter-optin-box' ),
			},
			{
				value: '-1',
				label: __( 'Manually enter value', 'newsletter-optin-box' ),
			},
			{
				value: '-2',
				label: __( 'Map Field', 'newsletter-optin-box' ),
				disabled: true,
			},
		];

		fileHeaders.forEach( header => {
			values.push( {
				value: header,
				label: header,
			} )
		} );

		return values;
	}, [ fileHeaders ] );

	// If we have an error, display it.
	if ( error ) {

		return (
			<Notice status="error" isDismissible={ false }>
				<p>{ error.message }</p>
				<Button variant="link" onClick={ back }>
					{ __( 'Try again', 'newsletter-optin-box' ) }
				</Button>
			</Notice>
		);
	}

	return (
		<VStack spacing={ 4 }>
			<Tip>
				{ __( 'Map the headers of your CSV file to record fields.', 'newsletter-optin-box' ) }
			</Tip>

			{ props.map( ( field ) => {
				// If the field is hidden or ignored, don't show it.
				if ( 'date_created' !== field.name && ( field.readonly || [ ...ignore, 'id' ].includes( field.name ) ) ) {
					return null;
				}

				const header = mappedHeaders[ field.name ] || { is_boolean: field.is_boolean };
				const value = header.value || '';

				return (
					<MapHeader
						key={ field.name }
						options={ selectValues }
						fieldLabel={ field.label }
						fieldOptions={ field.enum }
						value={ value }
						setValue={ ( newValue ) => {
							setMappedHeaders( {
								...mappedHeaders,
								[ field.name ]: {
									...header,
									mapped: !( [ '', '-1', '-2' ].includes( newValue ) ),
									value: newValue,
								}
							} );
						} }
						customValue={ header.customValue || '' }
						setCustomValue={ ( newValue ) => {
							setMappedHeaders( {
								...mappedHeaders,
								[ field.name ]: {
									...header,
									customValue: newValue,
								}
							} );
						} }
					/>
				);
			} ) }

			<ToggleControl
				label={ __( 'Update existing records', 'newsletter-optin-box' ) }
				checked={ updateRecords }
				onChange={ ( newValue ) => setUpdateRecords( newValue ) }
				__nextHasNoMarginBottom
			/>

			<Slot name={ `${ namespace }_${ collection }_import_records_below` }>
				{ ( fills ) => (
					<>
						{ Array.isArray( fills ) && fills.map( ( fill, index ) => (
							<Tip key={ index }>{ fill }</Tip>
						) ) }
					</>
				) }
			</Slot>

			<HStack justify="flex-start" wrap>
				<Button variant="primary" onClick={ () => onContinue( mappedHeaders, updateRecords ) }>
					{ __( 'Import', 'newsletter-optin-box' ) }
				</Button>
				<Button variant="secondary" onClick={ back }>
					{ __( 'Import a different file', 'newsletter-optin-box' ) }
				</Button>
			</HStack>
		</VStack>
	);
}
