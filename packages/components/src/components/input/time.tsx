/**
 * External dependencies
 */
import React, { useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { getSettings as getDateSettings } from '@wordpress/date';
import {
	__experimentalNumberControl as NumberControl,
	Tooltip,
	BaseControl,
	useBaseControlProps,
	__experimentalHStack as HStack,
} from '@wordpress/components';

import type { BaseControlProps } from '@wordpress/components/src/base-control/types';

export interface TimeControlProps extends Omit<BaseControlProps, 'children'> {
	/**
	 * The value of the time control.
	 */
	value: string | undefined;

	/**
	 * The onChange handler.
	 */
	onChange: ( value: string ) => void;
}

/**
 * Creates an InputControl reducer used to pad an input so that it is always a
 * given width. For example, the hours and minutes inputs are padded to 2 so
 * that '4' appears as '04'.
 *
 * @param pad How many digits the value should be.
 */
function buildPadInputStateReducer( pad: number ) {
	return ( state, action ) => {
		const nextState = { ...state };
		if (
			action.type === 'COMMIT' ||
			action.type === 'PRESS_UP' ||
			action.type === 'PRESS_DOWN'
		) {
			if ( nextState.value !== undefined ) {
				nextState.value = nextState.value.toString().padStart( pad, '0' );
			}
		}
		return nextState;
	};
}

/**
 * Displays timezone information when user timezone is different from site
 * timezone.
 */
export const TimeZone = () => {
	const { timezone } = getDateSettings();

	// Convert timezone offset to hours.
	const userTimezoneOffset = -1 * ( new Date().getTimezoneOffset() / 60 );

	// System timezone and user timezone match, nothing needed.
	// Compare as numbers because it comes over as string.
	if ( Number( timezone.offset ) === userTimezoneOffset ) {
		return null;
	}

	const offsetSymbol = Number( timezone.offset ) >= 0 ? '+' : '';
	const zoneAbbr =
		'' !== timezone.abbr && isNaN( Number( timezone.abbr ) )
			? timezone.abbr
			: `UTC${ offsetSymbol }${ timezone.offset }`;

	// Replace underscore with space in strings like `America/Costa_Rica`.
	const prettyTimezoneString = timezone.string.replace( '_', ' ' );

	const timezoneDetail =
		'UTC' === timezone.string
			? 'Coordinated Universal Time'
			: `(${ zoneAbbr }) ${ prettyTimezoneString }`;

	// When the prettyTimezoneString is empty, there is no additional timezone
	// detail information to show in a Tooltip.
	const hasNoAdditionalTimezoneDetail =
		prettyTimezoneString.trim().length === 0;

	return hasNoAdditionalTimezoneDetail ? (
		<div className="components-datetime__timezone hizzlewp-time-control__timezone">
			{ zoneAbbr }
		</div>
	) : (
		<Tooltip placement="top" text={ timezoneDetail }>
			<div className="components-datetime__timezone hizzlewp-time-control__timezone">
				{ zoneAbbr }
			</div>
		</Tooltip>
	);
};

export const TimeControl = ( {
	value,
	onChange,
	...attributes
}: TimeControlProps ) => {
	// The base props.
	const { baseControlProps, controlProps } = useBaseControlProps( attributes );
	const parts = value ? value.split( ':' ) : [ '07', '00' ];
	const [ hours, setHours ] = useState<string | undefined>( parts[ 0 ] );
	const [ minutes, setMinutes ] = useState<string | undefined>( parts[ 1 ] );
	const pad = ( n: number | string | undefined, fallback = '00' ) => {
		n = Number( n );

		if ( isNaN( n ) ) {
			return fallback;
		}

		if ( n < 10 ) {
			return `0${ n }`;
		}

		return n;
	};

	const localValue = `${ pad( hours ) }:${ pad( minutes ) }`;

	useEffect( () => {
		if ( value !== localValue ) {
			onChange( localValue );
		}
	}, [ localValue ] );

	// Render the control.
	return (
		<BaseControl { ...baseControlProps }>
			<HStack>
				<div className="hizzlewp-time-control__inputs" dir="ltr">
					<NumberControl
						value={ pad( hours ) }
						onChange={ setHours }
						min={ 0 }
						max={ 23 }
						step={ 1 }
						{ ...controlProps }
						className="hizzlewp-time-control__hours"
						label={ __( 'Hours' ) }
						spinControls="none"
						isDragEnabled={ false }
						isShiftStepEnabled={ false }
						isPressEnterToChange
						hideLabelFromVision
						__next40pxDefaultSize
						__unstableStateReducer={ buildPadInputStateReducer( 2 ) }
					/>
					<span className="hizzlewp-time-control__separator" aria-hidden="true">:</span>
					<NumberControl
						className="hizzlewp-time-control__minutes"
						value={ pad( minutes ) }
						onChange={ setMinutes }
						min={ 0 }
						max={ 59 }
						step={ 1 }
						label={ __( 'Minutes' ) }
						spinControls="none"
						isDragEnabled={ false }
						isShiftStepEnabled={ false }
						isPressEnterToChange
						hideLabelFromVision
						__next40pxDefaultSize
						__unstableStateReducer={ buildPadInputStateReducer( 2 ) }
					/>
				</div>
				<TimeZone />
			</HStack>
		</BaseControl>
	);
};
