/**
 * External dependencies
 */
import React, { useEffect, useRef } from 'react';

declare global {
	interface Window {
		tinyMCEPreInit?: {
			mceInit: Record<string, any>;
		};
		tinymce?: any;
		wp?: any;
	}
}

/**
 * Wordpress dependancies.
 */
import {
	BaseControl,
	useBaseControlProps,
} from '@wordpress/components';
import type { BaseControlProps } from '@wordpress/components/src/base-control/types';
import { debounce } from '@wordpress/compose';
import { F10, isKeyboardEvent } from '@wordpress/keycodes';

interface TinyMCESettingProps extends BaseControlProps {
	/**
	 * The value.
	 */
	value: string;

	/**
	 * The onChange handler.
	 */
	onChange: ( value: string ) => void;
}

/**
 * Displays a TinyMCE editor.
 *
 * Users have to manually add the TinyMCE script to their page.
 */
export const TinyMCESetting: React.FC<TinyMCESettingProps> = ( { value, onChange, ...attributes } ) => {

	// `useBaseControlProps` is a convenience hook to get the props for the `BaseControl`
	// and the inner control itself. Namely, it takes care of generating a unique `id`,
	// properly associating it with the `label` and `help` elements.
	const { baseControlProps, controlProps } = useBaseControlProps( {
		...attributes,
		__nextHasNoMarginBottom: true,
	} );

	const id = attributes.id as string;
	const { wp, tinymce } = window;

	const didMount = useRef<boolean>( false );
	const elRef = useRef<HTMLDivElement>( null );

	// Reinitialize the editor when clicking on the tinyMCE tab.
	// Fixes a bug where the editor content resets when switching between visual and text mode.
	useEffect( () => {
		if ( !didMount.current ) {
			return;
		}

		const setContent = ( e ) => {
			if ( e?.target?.classList?.contains( 'wp-switch-editor' ) ) {
				setTimeout( () => {
					const editor = tinymce?.get( id );
					if ( editor ) {
						editor.setContent( value || '' );
						editor._lastChange = value;
					}
				}, 50 );
			}
		}

		elRef.current?.addEventListener( 'click', setContent );

		return () => {
			elRef.current?.removeEventListener( 'click', setContent );
		}
	}, [ elRef.current, value ] );

	useEffect( () => {
		if ( !didMount.current ) {
			return;
		}

		const editor = tinymce?.get( id );

		if ( editor && editor._lastChange !== value ) {
			//editor.setContent( value || '' );
			//editor._lastChange = value;
		}
	}, [ value ] );

	useEffect( () => {

		tinymce?.execCommand( 'mceRemoveEditor', true, id );

		function initialize() {
			wp.oldEditor.initialize( id, {
				tinymce: window.tinymce ? {
					content_css: false,
					theme_advanced_buttons: 'bold,italic,underline,|,bullist,numlist,blockquote,|,link,unlink,|,spellchecker,fullscreen,|,formatselect,styleselect',
					drag_drop_upload: true,
					toolbar1: 'formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,spellchecker,wp_adv,dfw',
					toolbar2: 'strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help',
					min_height: 400,
					wpautop: false,
					setup( editor ) {

						if ( value ) {
							editor.on( 'loadContent', () => editor.setContent( value ) );
						}

						editor.on( 'blur', () => {
							onChange( editor.getContent() );

							return false;
						} );

						const debouncedOnChange = debounce( () => {
							const value = editor.getContent();

							if ( value !== editor._lastChange ) {
								editor._lastChange = value;
								onChange( value );
							}
						}, 250 );
						editor.on( 'Paste Change input Undo Redo', debouncedOnChange );

						// We need to cancel the debounce call because when we remove
						// the editor (onUnmount) this callback is executed in
						// another tick. This results in setting the content to empty.
						editor.on( 'remove', debouncedOnChange.cancel );

						editor.on( 'keydown', ( event ) => {
							if ( isKeyboardEvent.primary( event, 'z' ) ) {
								// Prevent the gutenberg undo kicking in so TinyMCE undo stack works as expected.
								event.stopPropagation();
							}

							// If ctrl+s or cmd+s is pressed, save pending content.
							if ( isKeyboardEvent.primary( event, 's' ) ) {
								debouncedOnChange.flush();
							}

							const { altKey } = event;
							/*
							 * Prevent Mousetrap from kicking in: TinyMCE already uses its own
							 * `alt+f10` shortcut to focus its toolbar.
							 */
							if ( altKey && event.keyCode === F10 ) {
								event.stopPropagation();
							}
						} );

						didMount.current = true;
					},
					...( window?.tinyMCEPreInit?.mceInit[ id ] || {} )
				} : false,
				mediaButtons: true,
				quicktags: {
					buttons: 'strong,em,link,block,del,ins,img,ul,ol,li,code,close'
				},
			} );
		}

		function onReadyStateChange() {
			if ( document.readyState === 'complete' ) {
				initialize();
			}
		}

		if ( document.readyState === 'complete' ) {
			initialize();
		} else {
			document.addEventListener( 'readystatechange', onReadyStateChange );
		}

		return () => {
			document.removeEventListener(
				'readystatechange',
				onReadyStateChange
			);
			wp.oldEditor.remove( id );
		};
	}, [] );

	return (
		<BaseControl { ...baseControlProps }>
			<div ref={ elRef }>
				<textarea
					{ ...controlProps }
					className="wp-editor-area"
					style={ { width: '100%' } }
					value={ value }
					onChange={ ( e ) => onChange( e.target.value ) }
					rows={ 10 }
				/>
			</div>
		</BaseControl>
	);
}
