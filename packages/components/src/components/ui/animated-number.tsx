import React, { useEffect, useState } from "react";

/**
 * React component that animates from one number to another.
 *
 * @param {Object} props
 * @param {Number} props.from The value to animate from.
 * @param {Number} props.to The value to animate to.
 * @param {Number} props.duration The duration of the animation.
*/
export const AnimatedNumber = ( { from = 0, to, duration = 5000 } ) => {

    // Prepare state.
    const [ value, setValue ] = useState( from );

    // Update the value.
    useEffect( () => {

        // Abort if the values are the same.
        if ( from === to ) {
            setValue( to );
            return;
        }

        let animationFrameId;
        const startTime = Date.now();

        const updateNumber = () => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;

            if ( elapsedTime < duration ) {
                const newValue =
                    from +
                    ( ( to - from ) * elapsedTime ) / duration;
                setValue( Math.round( newValue ) );

                // Request next frame
                animationFrameId = requestAnimationFrame( updateNumber );
            } else {
                setValue( to );
            }
        };

        // Start the animation
        animationFrameId = requestAnimationFrame( updateNumber );

        // Clean up the animation frame on component unmount
        return () => cancelAnimationFrame( animationFrameId );
    }, [ from, to, duration ] );

    return <span>{ Math.round( value ) }</span>;
}
