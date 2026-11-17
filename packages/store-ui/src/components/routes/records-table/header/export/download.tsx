/**
 * External dependencies.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

/**
 * WordPress dependencies.
 */
import {
	Button,
	Notice,
	__experimentalText as Text,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRegistry } from '@wordpress/data';

/**
 * HizzleWP dependencies.
 */
import {
	store as hizzleStore,
	useProvidedCollectionConfig,
} from '@hizzlewp/store';
import { fetchExport, getCachedExport } from './data';
import type { ExportResult } from './data';

/**
 * Fetches records from the API and converts them to CSV.
 *
 * @param {Object} args
 * @param {Array} args.fields The fields to export.
 * @param {Function} args.back The callback to call when clicking on the back button.
 * @param {Object} args.query Export filters and ordering.
 * @param {Object} args.cacheQuery Original table query.
 * @param {number|null} args.recordsCount Number of selected records.
 */
export const Download = ( { fields, back, query, cacheQuery, recordsCount } ) => {
	const { config } = useProvidedCollectionConfig();
	const { namespace, collection, props } = config;
	const registry = useRegistry();
	const requestKey = JSON.stringify( [
		config.baseURL,
		config.baseURLParams,
		props,
		fields,
		query,
		cacheQuery,
		recordsCount,
	] );
	const pending = useRef<{
		key: string;
		promise: Promise<ExportResult>;
	} | null>( null );
	const [ result, setResult ] = useState<{
		key: string;
		data?: ExportResult;
		error?: any;
	} | null>( null );

	useEffect( () => {
		let active = true;
		if ( pending.current?.key !== requestKey ) {
			const cached = getCachedExport(
				registry.select( hizzleStore ),
				config,
				fields,
				query,
				cacheQuery,
				recordsCount ?? null
			);
			pending.current = {
				key: requestKey,
				promise:
					cached !== null
						? Promise.resolve( {
							records: cached,
							background: false,
						} )
						: fetchExport(
							config,
							fields,
							query,
							recordsCount ?? null
						),
			};
		}
		// Keep the in-flight promise across effect replay so a background job is queued once.
		pending.current.promise.then(
			( data ) => {
				if ( active ) setResult( { key: requestKey, data } );
			},
			( error ) => {
				if ( active ) setResult( { key: requestKey, error } );
			}
		);
		return () => {
			active = false;
		};
	}, [ requestKey, registry ] );

	const current = result?.key === requestKey ? result : null;
	const records = current?.data?.records ?? [];
	const shouldBackgroundExport =
		current?.data?.background ??
		( recordsCount == null || recordsCount > 500 );
	const csv = useMemo( () => {
		if ( !records.length ) return '';
		// Use selected column order, independent of REST object key order.
		const columns = fields.filter( ( field ) =>
			records.some( ( record ) =>
				Object.prototype.hasOwnProperty.call( record, field )
			)
		);
		return Papa.unparse(
			{
				fields: columns.map(
					( field ) =>
						props.find( ( prop ) => prop.name === field )?.js_props
							?.table_label ||
						props.find( ( prop ) => prop.name === field )?.label ||
						field
				),
				data: records.map( ( record ) =>
					columns.map( ( field ) => record[ field ] )
				),
			},
			{ escapeFormulae: true }
		) as string;
	}, [ records, props, fields ] );

	const backButton = (
		<Button variant="link" onClick={ back }>
			{ __( 'Go Back', 'newsletter-optin-box' ) }
		</Button>
	);

	// Short spinner if loading.
	if ( !current ) {
		return (
			<Text size={ 16 } as="p">
				<Spinner style={ { marginLeft: 0 } } />
				{ shouldBackgroundExport
					? __( 'Queuing export...', 'newsletter-optin-box' )
					: __( 'Preparing records...', 'newsletter-optin-box' ) }
			</Text>
		);
	}

	// Show error if any.
	if ( current.error ) {
		return (
			<Notice status="error" isDismissible={ false }>
				{ current.error?.message || 'Unable to export records. Please try again.' }
				&nbsp; &nbsp;
				{ backButton }
			</Notice>
		);
	}

	// If background export, show notice after request succeeds.
	if ( shouldBackgroundExport ) {
		return (
			<Notice status="success" isDismissible={ false }>
				We are generating your export in the background. We'll email you when it's ready.
				&nbsp; &nbsp;
				{ backButton }
			</Notice>
		);
	}

	// If no records, nothing to export.
	if ( !records.length ) {
		return (
			<Notice status="info" isDismissible={ false }>
				Found no records to export.&nbsp; &nbsp;
				{ backButton }
			</Notice>
		);
	}

	const filename = `${ namespace }-${ collection }-${ Date.now() }.csv`;

	// Force download.
	return (
		<Notice status="success" isDismissible={ false }>
			Done! Click the button below to download records.
			&nbsp; &nbsp;
			<Button
				variant="primary"
				text="Download CSV"
				onClick={ () =>
					saveAs(
						new Blob( [ csv ], { type: 'text/csv;charset=utf-8' } ),
						filename
					)
				}
			/>
		</Notice>
	);
};
