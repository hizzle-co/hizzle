/**
 * External dependencies
 */
import Papa from 'papaparse';
import React, { useState, useMemo } from "react";

/**
 * WordPress dependencies.
 */
import { ToggleControl, Button, Icon, Modal, Spinner, Flex, FlexItem, __experimentalText as Text, } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";

/**
 * HizzleWP dependencies.
 */
import { ErrorBoundary } from '@hizzlewp/components';

/**
 * Local dependencies.
 */
import { usePartialRecords, useSchema } from "../../store-data/hooks";

/**
 * Fetches records from the API and converts them to CSV.
 *
 * @param {Object} args
 * @param {Array} args.fields The fields to export.
 * @param {Function} args.back The callback to call when clicking on the back button.
 * @param {Array} args.schema The schema of the collection.
 */
const DownloadProgress = ({ fields, back, schema, namespace, collection, selected, query }) => {

	// Fetch the records.
	const exportArgs = selected.length === 0 ? { ...query } : { include: selected.join( ',' ) };

	// Add the fields to the args.
	exportArgs.__fields = fields.join( ',' );
	exportArgs.number = -1;

	// Set context to edit.
	exportArgs.context = 'edit';

	const records = usePartialRecords(namespace, collection, exportArgs);

	// Loop through columns and and try to replace the column name with the label where possible.
	const columns = useMemo( () => {

		if ( ! records.data?.length ) {
			return [];
		}

		// Pluck name and label from the schema.
		const knownFields = schema.reduce((acc, field) => {
			acc[field.name] = field.label;
			return acc;
		}, {});

		return Object.keys(records.data[0]).map((column) => {
			return knownFields[column] || column;
		});
	}, [schema, records.data]);

	// Convert data from array of objects to array of arrays.
	const recordArray = useMemo(() => {

		if (!records.data?.length) {
			return [];
		}

		return records.data.map((record) => {
			return Object.values(record);
		});
	}, [records.data]);

	const backButton = (
		<Button variant="link" onClick={back}>
			{__('Go Back', 'newsletter-optin-box')}
		</Button>
	);

	// Short spinner if loading.
	if (records.isResolving) {
		return (
			<Text size={ 16 } as="p">
				<Spinner style={{marginLeft: 0}} />
				{__('Preparing records...', 'newsletter-optin-box')}
			</Text>
		);
	}

	// Show error if any.
	if ( 'ERROR' === records.status ) {

		return (
			<Notice status="error" isDismissible={false}>
				{records.error.message || __('An unknown error occurred.', 'newsletter-optin-box')}&nbsp; &nbsp;
				{backButton}
			</Notice>
		)
	}

	// If no records, nothing to export.
	if (!records.data.length) {
		return (
			<Notice status="info" isDismissible={false}>
				{__('Found no records to export.', 'newsletter-optin-box')}&nbsp; &nbsp;
				{backButton}
			</Notice>
		)
	}

	// Convert to CSV.
	const csv = Papa.unparse(
		{
			fields: columns,
			data: recordArray,
		},
		{ escapeFormulae: true }
	);

	const filename = `${namespace}-${collection}-${Date.now()}.csv`;

	// Force download.
	return (
		<Notice status="success" isDismissible={false}>
			{__("Done! Click the button below to download records.", 'newsletter-optin-box')}
			&nbsp; &nbsp;
			<Button
				variant="primary"
				href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
				download={ filename }
				text={ __('Download CSV', 'newsletter-optin-box') }
			/>
		</Notice>
	);
}

/**
 * Allows the user to select which fields to export.
 *
 * @param {Object} args
 * @param {Array} args.fields The fields to export.
 * @param {Function} args.setFields The function to update the fields.
 * @param {Object} args.schema The schema of the collection.
 * @param {Array} args.schema.schema The schema of the collection.
 * @param {Array} args.schema.ignore The fields to ignore.
 * @param {Function} args.next The function to go to the next step.
 */
const DownloadFields = ({ fields, setFields, schema: { schema, ignore }, next } ) => {

	return (
		<Flex direction={'column'} gap={4}>

			<FlexItem>
				<p className="description">
					{__('Select the fields to include in your exported file', 'newsletter-optin-box')}
				</p>
			</FlexItem>

			{schema.map((field) => {

				// Abort if dynamic field.
				if (ignore.includes(field.name)) {
					return;
				}

				return (
					<FlexItem key={field.name}>
						<ToggleControl
							label={field.label === field.description ? field.label : `${field.label} (${field.description})`}
							checked={fields.includes(field.name)}
							onChange={() => {
								if (fields.includes(field.name)) {
									setFields(fields.filter((name) => name !== field.name));
								} else {
									setFields([...fields, field.name]);
								}
							}}
							__nextHasNoMarginBottom
						/>
					</FlexItem>
				)
			})}

			<FlexItem>
				<Button className="hizzlewp-block-button" variant="primary" onClick={next}>
					<Icon icon="download" />
					{__('Download', 'newsletter-optin-box')}
				</Button>
			</FlexItem>
		</Flex>
	);
}

/**
 * The modal content.
 *
 */
const TheModal = ( { namespace, collection, ...props} ) => {

	// Prepare state.
	const schema = useSchema(namespace, collection);
	const [fields, setFields] = useState((schema.data.schema
		.map((field) => (schema.data.hidden.includes(field.name) || schema.data.ignore.includes(field.name)) ? null : field.name)
		.filter( item => !!item )
	));
	const [step, setStep] = useState('fields');

	// If we are showing fields...
	if ('fields' === step) {
		return (
			<DownloadFields
				fields={fields}
				setFields={setFields}
				schema={schema.data}
				next={() => setStep('progress')}
			/>
		);
	}

	// If we are showing the download progress...
	if ('progress' === step) {
		return (
			<DownloadProgress
				fields={fields}
				schema={schema.data.schema}
				back={() => setStep('fields')}
				namespace = {namespace}
				collection = {collection}
				{...props}
			/>
		);
	}
}

/**
 * Displays a modal allowing users to export all records matching the current collection.
 *
 */
export default function ExportButton( {  count, selected, ...props } ) {

	const [isOpen, setOpen] = useState(false);
	const downloadAll = selected.length === 0;
	const title       = downloadAll ? __( 'Download', 'newsletter-optin-box' ) : __( 'Download Selected', 'newsletter-optin-box' );
	const modalTitle  = downloadAll ? sprintf(
		/* translators: %s: number of records */
		__( 'Download all %s records', 'newsletter-optin-box' ),
		count
	) : sprintf(
		/* translators: %s: number of records */
		__( 'Download %s selected records', 'newsletter-optin-box' ),
		selected.length
	);

	return (
		<>

			<Button
				onClick={() => setOpen(true)}
				variant="tertiary"
				text={ title }
			/>

			{isOpen && (
				<Modal title={ modalTitle } onRequestClose={() => setOpen(false)}>
					<div className="hizzle-records-export-modal__body">
						<ErrorBoundary>
							<TheModal count={count} selected={selected} {...props} />
						</ErrorBoundary>
					</div>
				</Modal>
			)}

		</>
	);

}
