/**
 * External dependencies
 */
import React, { useCallback, useEffect } from "react";
import Papa from 'papaparse';

/**
 * WordPress dependencies
 */
import { useDispatch } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { store as noticesStore } from '@wordpress/notices';
import {
	Spinner,
	Button,
	FlexItem,
	Notice,
	ProgressBar,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from "@wordpress/components";

/**
 * HizzleWP dependencies
 */
import { useProvidedCollectionConfig, store as hizzlewpStore } from '@hizzlewp/store';
import { updatePath } from "@hizzlewp/history";
import { AnimatedNumber } from "@hizzlewp/components";

/**
 * Internal dependancies.
 */
import { StatCard } from "../view-record/overview/stats";
import { MappedHeaders } from './map-headers';
import { useImportReducer } from './reducer';

const MIN_CHUNK_SIZE = 1;
const MAX_CHUNK_SIZE = 99;
const IDEAL_DURATION = 20000; // 20 seconds

const calculateChunkSize = ( lastDurationInMilliseconds: number, lastChunkSize: number ) => {

	if ( lastDurationInMilliseconds <= 0 || lastChunkSize <= 0 ) {
		return MIN_CHUNK_SIZE;
	}

	const ratePerMillisecond = lastChunkSize / lastDurationInMilliseconds;

	// Ensure we don't go past the maximum chunk size.
	return Math.min(
		Math.max(
			// Ensure we don't go past the minimum chunk size.
			MIN_CHUNK_SIZE,
			Math.floor( ratePerMillisecond * IDEAL_DURATION )
		),
		MAX_CHUNK_SIZE
	);
};

/**
 * parses a CSV file.
 *
 * @param {Object} file The file to parse.
 * @param {Function} cb The callback to call when done.
 */
const parseCSV = ( file, onComplete, onError ) => {

	Papa.parse( file, {
		header: true,
		skipEmptyLines: 'greedy',
		complete( results ) {
			onComplete( results );
		},
		error( error ) {
			onError( error );
		},
	} );
}

/**
 * Parses a record.
 *
 * @param {Object} record The raw record.
 * @returns {Object} The parsed record.
 */
const useParseRecord = ( headers: MappedHeaders ) => useCallback( ( record: Record<string, any> ) => {
	const parsed: Record<string, any> = {};

	Object.keys( headers ).forEach( ( key ) => {

		// Abort if the header is not mapped.
		if ( '' === headers[ key ].value ) {
			return;
		}

		// Are we mapping the field?
		if ( headers[ key ].mapped ) {
			parsed[ key ] = record[ headers[ key ].value ];
		} else if ( undefined !== headers[ key ].customValue ) {
			parsed[ key ] = headers[ key ].customValue;
		}

		// If the field is a boolean, convert it.
		if ( headers[ key ].is_boolean ) {
			parsed[ key ] = [ '0', '', 'false', 'FALSE', 'no' ].includes( parsed[ key ] ) ? false : true;
		}

	} );

	return parsed;
}, [ headers ] );

/**
 * The props for the Progress component.
 */
interface ProgressProps {
	/**
	 * The file to import.
	 */
	file: File;

	/**
	 * Known fields to file headers mapping.
	 */
	headers: MappedHeaders;

	/**
	 * The callback to call when clicking on the back button.
	 */
	back: () => void;

	/**
	 * Whether to update existing records.
	 */
	updateRecords: boolean;
}

/**
 * Imports the file and displays the progress.
 *
 * @param {Object} props
 * @param {Object} props.file The file to import.
 * @param {Object} props.headers Known fields to file headers mapping.
 * @param {Function} props.back The callback to call when clicking on the back button.
 */
export const Progress = ( { file, headers, back, updateRecords }: ProgressProps ) => {

	const { config: { namespace, collection, labels } } = useProvidedCollectionConfig() || {};
	const [ {
		paused,
		done,
		lastDuration,
		parsed,
		total,
		processed,
		stats,
		previousStats,
		chunks,
	}, dispatch ] = useImportReducer();

	// Dispatch.
	const { doBatchCollectionAction } = useDispatch( hizzlewpStore );
	const { createErrorNotice, removeAllNotices } = useDispatch( noticesStore );
	const setErrors = useCallback( ( errors: Error[] ) => {
		removeAllNotices( 'default', 'hizzlewp-import-progress' );
		errors.forEach( ( error ) => {
			createErrorNotice(
				error.message,
				{
					isDismissible: true,
					type: 'default',
					context: 'hizzlewp-import-progress',
				}
			);
		} );
	}, [ createErrorNotice, removeAllNotices ] );

	/**
	 * Parses a record.
	 */
	const parseRecord = useParseRecord( headers );

	// Import chunks.
	useEffect( () => {

		// Abort if paused.
		if ( paused ) {
			return;
		}

		const startTime = new Date().getTime();
		const newChunks = [ ...chunks ];

		// Get the next chunk.
		const chunk: Record<string, any>[] | undefined = newChunks.shift();

		// If there's no chunk, we're done.
		if ( !chunk ) {

			if ( false === done ) {
				dispatch( { type: 'UPDATE', done: true } );
			}

			return;
		}

		// If we're done, set the done flag to false.
		if ( true === done ) {
			dispatch( { type: 'UPDATE', done: false } );
		}

		// Import the chunk.
		doBatchCollectionAction( namespace, collection, { import: chunk, update: updateRecords } )
			.then( ( result ) => {
				let chunkStats = { ...stats };
				let errors: Error[] = [];

				// Process the chunk results.
				result?.import?.forEach( ( record ) => {
					if ( record.is_error ) {
						chunkStats.failed++;
						errors.push( record.data as Error );
						return;
					}

					Object.keys( chunkStats ).forEach( ( key ) => {
						if ( record.data?.[ key ] ) {
							chunkStats[ key ]++;
						}
					} );
				} );

				dispatch( { type: 'UPDATE_STATS', ...chunkStats } );
				setErrors( errors );
			} ).catch( ( error ) => {
				dispatch( { type: 'UPDATE_STATS', ...stats, failed: stats.failed + chunk.length } );
				setErrors( [ error ] );
			} ).finally( () => {

				// Calculate the time (in milliseconds) taken to process the chunk.
				const diff = Math.min( 2000, new Date().getTime() - startTime );

				// Check if we've processed everything.
				if ( newChunks.length === 0 ) {
					dispatch( {
						type: 'UPDATE',
						processed: processed + chunk.length,
						chunks: newChunks,
						lastDuration: Math.ceil( diff )
					} );
					return;
				}

				// Adjust the number of records per chunk,
				// so that we speed up or slow down the import
				// based on server performance.
				const newChunkSize = calculateChunkSize( diff, chunk.length );

				const recalculatedChunks: Record<string, any>[][] = [];

				// Flatten the old chunks.
				const oldChunks = newChunks.flat();

				// Create new chunks.
				for ( let i = 0; i < oldChunks.length; i += newChunkSize ) {
					const records = oldChunks.slice( i, i + newChunkSize );
					recalculatedChunks.push( records );
				}

				// Update the chunks.
				dispatch( {
					type: 'UPDATE',
					processed: processed + chunk.length,
					chunks: recalculatedChunks,
					lastDuration: Math.ceil( diff )
				} );
			} );
	}, [ chunks, paused, dispatch, doBatchCollectionAction, setErrors ] );

	// Parse the file.
	useEffect( () => {

		// Parse the file.
		parseCSV(
			file,
			( results ) => {

				// Create chunks of 10 records per chunk.
				const batchSize = 10;
				const newChunks: Record<string, any>[][] = [];
				for ( let i = 0; i < results.data.length; i += batchSize ) {
					const records: Record<string, any>[] = results.data.slice( i, i + batchSize );
					newChunks.push( records.map( ( record ) => parseRecord( record ) ) );
				}

				// Update the state.
				dispatch( {
					type: 'UPDATE',
					parsed: true,
					total: results.data.length,
					chunks: newChunks,
					paused: false
				} );
			},
			( error ) => setErrors( [ error ] ),
		);
	}, [ file, headers ] );

	// Abort if the file is not parsed.
	if ( !parsed ) {
		return (
			<Heading level={ 3 } size={ 20 }>
				{ __( 'Parsing', 'newsletter-optin-box' ) }
				<code>{ file.name }</code>...
				&nbsp;
				<Spinner />
			</Heading>
		)
	}

	// Abort if total == 0.
	if ( 0 === total ) {
		return (
			<Notice isDismissible={ false } status="error">
				{ sprintf(
					// translators: %s: file name.
					__( 'No records found in %s.', 'newsletter-optin-box' ),
					file.name
				)
				}
			</Notice>
		)
	}

	return (
		<VStack className="hizzlewp-import-progress">

			{ !done && (
				<>
					<Heading level={ 3 } size={ 20 }>
						{ __( 'Importing', 'newsletter-optin-box' ) }
						<code>{ file.name }</code>...
						&nbsp;
						{ !paused && <Spinner /> }

						&nbsp;
						<Button
							variant="link"
							onClick={ () => dispatch( {
								type: 'UPDATE',
								paused: !paused
							} ) }
						>
							{ paused ? __( 'Resume', 'newsletter-optin-box' ) : __( 'Pause', 'newsletter-optin-box' ) }
						</Button>
					</Heading>

					{ !paused && (
						<ProgressBar
							value={ !processed ? 0 : Math.floor( ( processed / total ) * 100 ) }
						/>
					) }
				</>
			) }

			{ done && (
				<Heading level={ 3 } size={ 20 }>
					{ __( 'Processed', 'newsletter-optin-box' ) }
					<code>{ file.name }</code>
				</Heading>
			) }

			<HStack spacing={ 4 } justify="flex-start" wrap>

				<FlexItem>
					<StatCard
						value={ <AnimatedNumber to={ total } duration={ 3000 } /> }
						label={ __( 'Records Found', 'newsletter-optin-box' ) }
						status="light"
					/>
				</FlexItem>

				{ stats.created > 0 && (
					<FlexItem>
						<StatCard
							value={
								<AnimatedNumber
									from={ previousStats.created || 0 }
									to={ stats.created }
									duration={ ( done || paused ) ? 300 : lastDuration }
								/>
							}
							label={ __( 'Records Created', 'newsletter-optin-box' ) }
							status="success"
						/>
					</FlexItem>
				) }

				{ stats.updated > 0 && (
					<FlexItem>
						<StatCard
							value={
								<AnimatedNumber
									from={ previousStats.updated || 0 }
									to={ stats.updated }
									duration={ ( done || paused ) ? 300 : lastDuration }
								/>
							}
							label={ __( 'Records Updated', 'newsletter-optin-box' ) }
							status="success"
						/>
					</FlexItem>
				) }

				{ stats.failed > 0 && (
					<FlexItem>
						<StatCard
							value={
								<AnimatedNumber
									from={ previousStats.failed || 0 }
									to={ stats.failed }
									duration={ ( done || paused ) ? 300 : lastDuration }
								/>
							}
							label={ __( 'Records Failed', 'newsletter-optin-box' ) }
							status="error"
						/>
					</FlexItem>
				) }

				{ stats.skipped > 0 && (
					<FlexItem>
						<StatCard
							value={
								<AnimatedNumber
									from={ previousStats.skipped || 0 }
									to={ stats.skipped }
									duration={ ( done || paused ) ? 300 : lastDuration }
								/>
							}
							label={ __( 'Records Skipped', 'newsletter-optin-box' ) }
							status="info"
						/>
					</FlexItem>
				) }
			</HStack>

			{ done && (
				<div>
					<Button
						variant="primary"
						className="hizzlewp-block-button"
						text={ labels.view_items || 'View Records' }
						onClick={ () => updatePath( `/${ namespace }/${ collection }` ) }
						style={ { maxWidth: 200 } }
					/>
				</div>
			) }

		</VStack>
	);
}
