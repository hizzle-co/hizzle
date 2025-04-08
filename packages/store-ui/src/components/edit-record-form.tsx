/**
 * External dependencies
 */
import React, { useMemo } from "react";
import {
	Spinner,
	Tip,
	Animate,
	Slot,
	Button,
	__experimentalVStack as VStack,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * HizzleWP dependencies
 */
import { Setting, ErrorBoundary } from '@hizzlewp/components';
import type { RecordProp } from '@hizzlewp/store/build-types/types';
import { prepareField } from "./routes/records-table/filters";

const MaybeAnimate = ( { children, loading }: { children: React.ReactNode, loading: boolean } ) => {

	if ( loading ) {
		return (
			<Animate type="loading">{
				( { className } ) => (
					<div className={ className } style={ { cursor: 'wait' } }>
						{ children }
					</div>
				)
			}</Animate>
		);
	}

	return children;
};

type EditRecordFormProps = {
	record: Record<string, any>;
	onChange: ( value: any ) => void;
	schema: RecordProp[];
	hidden: string[];
	ignore: string[];
	onSubmit: ( e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement> ) => void;
	loading: boolean;
	slotName: string;
	submitText: string;
};

export const EditRecordForm = ( { record, onChange, schema, hidden, ignore, onSubmit, loading, slotName, submitText }: EditRecordFormProps ) => {

	// Prepare form fields.
	const fields = useMemo( () => prepareEditableRecordFields( schema, hidden, ignore ), [ schema, hidden, ignore ] );

	return (
		<MaybeAnimate loading={ loading }>
			<VStack as="form" spacing={ 6 } style={ { pointerEvents: loading ? 'none' : 'auto' } } onSubmit={ onSubmit }>

				{ fields.map( ( field ) => (
					<ErrorBoundary key={ field.name }>
						<Setting
							settingKey={ field.name }
							saved={ record }
							setAttributes={ onChange }
							setting={ field }
						/>
					</ErrorBoundary>
				) ) }

				{ slotName && (
					<Slot name={ slotName }>
						{ ( fills ) => (
							Array.isArray( fills ) ?
								fills.map( ( fill, index ) => (
									<Tip key={ index }>{ fill }</Tip>
								)
								) : fills
						) }
					</Slot>
				) }

				<Button className="hizzlewp-block-button" variant="primary" onClick={ onSubmit } isBusy={ loading }>
					{ loading ? <Spinner /> : submitText }
				</Button>
			</VStack>
		</MaybeAnimate>
	);
}

export const prepareEditableRecordFields = ( schema: RecordProp[], hidden: string[], ignore: string[] ) => (
	schema.map( ( field ) => {

		// Abort for readonly and dynamic fields.
		if ( field.readonly || field.is_dynamic || 'metadata' === field.name ) {
			return null;
		}

		// Abort for hidden fields...
		if ( Array.isArray( hidden ) && hidden.includes( field.name ) ) {
			return null;
		}

		// ... and fields to ignore.
		if ( Array.isArray( ignore ) && ignore.includes( field.name ) ) {
			return null;
		}

		return prepareField( field );
	} ).filter( item => !!item )
);
