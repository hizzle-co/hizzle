/**
 * External dependencies
 */
import React, { useMemo } from "react";

/**
 * WordPress dependencies
 */
import {
	Spinner,
	Tip,
	Animate,
	Slot,
	Button,
	__experimentalVStack as VStack,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
	useShortcut,
} from '@wordpress/keyboard-shortcuts';

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
	extraSettings?: Record<string, any>;
};

export const EditRecordForm = ( { record, onChange, schema, hidden, ignore, onSubmit, loading, slotName, submitText, extraSettings }: EditRecordFormProps ) => {

	// Prepare form fields.
	const fields = useMemo( () => {
		let prepared = prepareEditableRecordFields( schema, hidden, ignore );

		if ( extraSettings ) {
			Object.entries( extraSettings ).forEach( ( [ key, { prop_pos, ...setting } ] ) => {
				setting.name = key;

				if ( ! prop_pos || ! prepared.find( field => field.name === prop_pos ) ) {
					prepared.push( setting );
				} else {
					const index = prepared.findIndex( field => field.name === prop_pos );
					prepared.splice( index + 1, 0, setting );
				}
			} );
		}

		return prepared;
	}, [ schema, hidden, ignore, extraSettings ] );

	// Handle the save shortcut.
	useShortcut( 'hizzlewp/save-record', ( e: React.KeyboardEvent<HTMLFormElement> ) => {
		e?.preventDefault();
		onSubmit();
	} );

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
