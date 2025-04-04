/**
 * External dependencies.
 */
import React from "react";

/**
 * WordPress dependencies.
 */
import { Flex, FlexBlock, FlexItem, Button, Icon } from "@wordpress/components";
import { dateI18n, getSettings } from "@wordpress/date";
import { getQueryArg, addQueryArgs } from "@wordpress/url";
import { useState, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * HizzleWP dependencies.
 */
import type { RecordProp } from "@hizzlewp/store/build-types/types";
import { updatePath } from '@hizzlewp/history';

/**
 * Local dependencies.
 */
import getEnumBadge from "./enum-colors";

const Badge = ( props ) => {

	const { className, ...rest } = props;

	return <span className={ `hizzlewp-badge ${ className || '' }` } { ...rest } />;
}

/**
 * Checks if a value is an object.
 */
const isObject = ( obj ) => obj && typeof obj === 'object' && obj.constructor === Object;

/**
 * Takes an avatar URL then generates consistent colors for the avatar.
 *
 * @param {string} avatarUrl The avatar URL.
 * @return {Object} The generated background and text colors.
 */
export const normalizeAvatarColors = ( avatarUrl, fallbackText, isGrid = false ) => {

	if ( !avatarUrl ) {
		return avatarUrl;
	}

	// If this is a grid view, replace s=64 with s=360.
	if ( isGrid ) {
		avatarUrl = addQueryArgs( avatarUrl, { s: 360 } );
	}

	const fallback = getQueryArg( avatarUrl, 'd' ) as string | undefined;

	// Abort if we're not falling back to ui-avatar.
	if ( !fallback || !fallback.includes( 'ui-avatars.com' ) ) {
		return avatarUrl;
	}

	const match = fallback.match( /\/api\/(.*?)\/64\// );
	const text = ( match && match.length > 1 ) ? match[ 1 ] : fallback;

	// Generate unique color for the string.
	const color = getEnumBadge( fallbackText || text );

	// Replace the colors in the URL.
	const index = fallback.indexOf( '/64/' );

	if ( index !== -1 ) {
		avatarUrl = addQueryArgs( avatarUrl, {
			d: `${ fallback.substring( 0, index + 4 ) }/${ color.backgroundColor.replace( '#', '' ) }/${ color.color.replace( '#', '' ) }`,
		} );
	}

	// Replace the size in the URL.
	if ( avatarUrl.includes( '%2F64%2F%' ) ) {
		avatarUrl = avatarUrl.replace( '%2F64%2F%', '%2F360%2F%' );
	}

	return avatarUrl;
}

type PrimaryColumnProps = {
	record: Record<string, any>;
	name: string;
	basePath?: string;
	viewType?: 'table' | 'grid';
	path?: string;
}

/**
 * Displays the primary column.
 * @param {Object} props
 * @param {Object} props.record The record object.
 * @param {string} props.name  The name of the column.
 * @param {string} props.label The label of the column.
 * @param {string} props.description The description of the column.
 */
const PrimaryColumn: React.FC<PrimaryColumnProps> = ( { record, name, viewType, path } ) => {

	const value = record[ name ];
	const avatar_url = viewType !== 'table' ? '' : normalizeAvatarColors( record.avatar_url, value );
	const avatar = avatar_url ? <img className="hizzlewp-avatar" src={ avatar_url } alt={ value } /> : null;
	const open = useCallback( () => path ? updatePath( path ) : null, [ path ] );

	const ColValue = (
		<Flex className="hizzlewp-table__cell--primary">
			{ avatar && (
				<FlexItem>
					{ avatar }
				</FlexItem>
			) }
			<FlexBlock>
				{ value }
			</FlexBlock>
		</Flex>
	);

	const btnStyle = {
		width: '100%',
		alignItems: 'start',
		textDecoration: 'none',
	}

	if ( !path ) {
		return ColValue;
	}

	return (
		<Button variant="link" style={ btnStyle } onClick={ open }>
			{ ColValue }
		</Button>
	);
}

/**
 * Displays badge list.
 *
 * @param {Object} props
 * @param {Array} props.value The value.
 * @param {Object} props.enums The enums.
 * @returns {JSX.Element}
 */
const BadgeList = ( { value, enums = {} } ) => {

	const [ isOpen, setIsOpen ] = useState( false );
	const toShow = isOpen ? value : value.slice( 0, 2 );
	const showToggle = value.length > 2;

	// Display the list.
	return (
		<Flex gap={ 2 } justify="flex-start" wrap>
			{ toShow.map( ( val ) => (
				<FlexItem key={ val }>
					<Badge style={ getEnumBadge( val ) }>{ enums[ val ] || val }</Badge>
				</FlexItem>
			) ) }

			{ showToggle && (
				<FlexItem>
					<Button variant="link" onClick={ () => setIsOpen( !isOpen ) }>
						{ isOpen ? __( 'Hide', 'newsletter-optin-box' ) : __( 'Show all', 'newsletter-optin-box' ) }
					</Button>
				</FlexItem>
			) }
		</Flex>
	);
}

type CellProps = {
	row: Record<string, any>;
	header: RecordProp;
	viewType?: 'table' | 'grid';
	isBadge?: boolean;
	path?: string;
}

/**
 * Displays a single cell in the records table.
 * @param {Object} props
 * @param {Object} props.row The record object.
 */
export const DisplayCell: React.FC<CellProps> = ( { row, header, viewType = 'table', isBadge = false, path } ) => {

	const value = row[ header.name ];

	// Nulls and undefined values are displayed as a dash.
	if ( value === null || value === undefined || value === '' ) {
		return isBadge ? '' : <span className="hizzlewp-table__cell--null">&ndash;</span>;
	}

	// Empty arrays are displayed as a dash.
	if ( Array.isArray( value ) && value.length === 0 ) {
		return isBadge ? '' : <span className="noptin-table__cell--null">&ndash;</span>;
	}

	if ( header.is_primary && typeof value === 'string' ) {
		return <PrimaryColumn record={ row } name={ header.name } viewType={ viewType } path={ path } />;
	}

	// Avatar URLs are displayed as an avatar.
	if ( 'avatar_url' === header.name ) {
		const avatar_url = normalizeAvatarColors( row.avatar_url, value, viewType !== 'table' );

		if ( !avatar_url ) {
			return null;
		}

		if ( viewType !== 'table' ) {
			return <img src={ avatar_url } alt={ value } />
		}

		return avatar_url ? <img className="hizzlewp-avatar" src={ avatar_url } alt={ value } /> : null;
	}

	// Boolean values are displayed as a toggle.
	if ( header.is_boolean ) {

		const icon = value ? 'yes' : 'no';
		const color = value ? '#3a9001' : '#880000';
		return <Icon size={ 24 } style={ { color } } icon={ icon } />;
	}

	// Dates are formatted as a date.
	if ( header.is_date && value ) {
		const settings = getSettings();
		// If value contains 10 chars, format as date, otherwise format as datetime.
		if ( value.length === 10 ) {
			return dateI18n( settings.formats.date, value );
		}

		return dateI18n( settings.formats.datetime, value );
	}

	// Tokens.
	if ( header.is_tokens && Array.isArray( value ) ) {
		return <BadgeList value={ value } />;
	}

	// Array with enum values are displayed as a badge.
	if ( header.enum && Array.isArray( value ) ) {
		return <BadgeList value={ value } enums={ header.enum } />;
	}

	// Strings, numbers, and floats are displayed as is.
	if ( header.is_numeric || header.is_float || typeof value === 'string' ) {

		// If we have an enum, display the label.
		if ( header.enum && isObject( header.enum ) ) {
			return <Badge style={ getEnumBadge( value ) }>{ header.enum?.[ value ] || value }</Badge>;
		}

		return value;
	}

	return JSON.stringify( value );
}
