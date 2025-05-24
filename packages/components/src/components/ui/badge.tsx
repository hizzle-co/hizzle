import React from "react";
import { stringToColor } from '..';

/**
 * Generates a badge color based on the given string.
 *
 * @param {string} str The string to generate a color for.
 * @return {Object} The generated background and text colors.
 */
const getColorStyles = ( str: string ) => {

    // Generate unique color for the string.
    const color = stringToColor( str, {
        saturation: [ 60, 100 ],
        lightness: [ 30, 45 ],
    } );

    return {
        backgroundColor: color.color,
        color: color.isLight ? '#111111' : '#ffffff',
    }
}

/**
 * React component that displays a badge.
 */
export const Badge: React.FC<{ text: string }> = ( { text } ) => {

    const style: React.CSSProperties = {
        whiteSpace: 'nowrap',
        borderRadius: '200px',
        height: '24px',
        lineHeight: '24px',
        padding: '3px 9px',
        display: 'inline-block',
        ...getColorStyles( text ),
    };

    return <span style={ style }>{ text }</span>;
}
