import React, { createContext, useContext, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { asTabs, FieldTree, ITab, getField, mergePatch, scopedPatch, withDefaults, withLinkHandlers } from './fields';

export type { ITab } from './fields';
export interface ISettingsContextProps {
    option_name: string;
    saved: Record<string, any>;
    fields: FieldTree;
    settings: ITab[];
    isFetching: boolean;
    isSaving: boolean;
    hasPendingChanges: boolean;
    error: string | null;
    errorCode: string | null;
    save: () => Promise<boolean>;
    reload: () => Promise<boolean>;
    setAttributes: ( attributes: Record<string, any> ) => void;
}

const SettingsContext = createContext<ISettingsContextProps>( {
    option_name: '', saved: {}, fields: {}, settings: [], isFetching: true, isSaving: false,
    hasPendingChanges: false, error: null, errorCode: null, save: async () => false, reload: async () => false, setAttributes: () => {},
} );
export const useSettings = (): ISettingsContextProps => useContext( SettingsContext );
export interface SettingsProviderProps {
    option_name: string;
    /** Select a field/group within the registered field tree. Values retain their normal option keys. */
    path?: string;
    children: React.ReactNode;
}

export const SettingsProvider = ( { option_name, path = '', children }: SettingsProviderProps ) => {
    const [ saved, setSaved ] = useState<Record<string, any>>( {} );
    const [ rawFields, setFields ] = useState<FieldTree>( {} );
    const [ isFetching, setIsFetching ] = useState( true );
    const [ isSaving, setIsSaving ] = useState( false );
    const [ hasPendingChanges, setPending ] = useState( false );
    const [ error, setError ] = useState<string | null>( null );
    const [ errorCode, setErrorCode ] = useState<string | null>( null );
    const changes = useRef<Record<string, any>>( {} );
    const values = useRef<Record<string, any>>( {} );
    const fieldSnapshot = useRef<FieldTree>( {} );
    const busy = useRef( false );
    const generation = useRef( 0 );
    const mounted = useRef( true );
    const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );
    const base = `/hizzlewp/v1/settings/${ encodeURIComponent( option_name ) }`;
    const selector = path ? `?hizzlewp_field=${ encodeURIComponent( path ) }` : '';

    const report = useCallback( ( err: any, notify = true ) => {
        if ( !mounted.current ) return;
        const message = err?.message || __( 'Could not load or save settings.' );
        setError( message );
        setErrorCode( err?.code || null );
        if ( notify ) createErrorNotice( message );
    }, [ createErrorNotice ] );

    const apply = useCallback( ( options: Record<string, any>, fields: FieldTree ) => {
        fieldSnapshot.current = fields;
        values.current = mergePatch( withDefaults( fields, options ), changes.current );
        setSaved( values.current );
        setFields( fields );
    }, [] );

    const reload = useCallback( async () => {
        if ( busy.current ) return false;
        busy.current = true;
        const current = generation.current;
        setIsFetching( true );
        setError( null );
        setErrorCode( null );
        try {
            // Read all values for conditions referring to fields outside the selected group.
            const [ options, fields ] = await Promise.all( [
                apiFetch<Record<string, any>>( { path: base } ),
                apiFetch<FieldTree>( { path: `${ base }/fields${ selector }` } ),
            ] );
            if ( !mounted.current || current !== generation.current ) return false;
            apply( options, fields );
            return true;
        } catch ( err ) {
            if ( current === generation.current ) report( err, false );
            return false;
        } finally {
            if ( current === generation.current ) { busy.current = false; if ( mounted.current ) setIsFetching( false ); }
        }
    }, [ base, selector, apply, report ] );

    useEffect( () => {
        mounted.current = true;
        generation.current++;
        busy.current = false;
        changes.current = {};
        values.current = {};
        fieldSnapshot.current = {};
        setPending( false );
        setSaved( {} );
        setFields( {} );
        setIsSaving( false );
        void reload();
        return () => { mounted.current = false; generation.current++; };
    }, [ reload ] );

    useEffect( () => {
        const warn = ( event: BeforeUnloadEvent ) => {
            if ( Object.keys( changes.current ).length ) { event.preventDefault(); event.returnValue = ''; }
        };
        window.addEventListener( 'beforeunload', warn );
        return () => window.removeEventListener( 'beforeunload', warn );
    }, [] );

    const save = useCallback( async () => {
        if ( busy.current ) return false;
        if ( !Object.keys( changes.current ).length ) return reload();
        busy.current = true;
        const current = generation.current;
        setIsSaving( true );
        setError( null );
        setErrorCode( null );
        let persisted = false;
        try {
            // The server merges this patch against the current option and enforces the field selector.
            await apiFetch<Record<string, any>>( { path: `${ base }${ selector }`, method: 'POST', data: changes.current } );
            if ( !mounted.current || current !== generation.current ) return false;
            persisted = true;
            changes.current = {};
            setPending( false );
            // Rebuild server-generated URLs, badges, and remote field choices after every save.
            const [ options, fields ] = await Promise.all( [
                apiFetch<Record<string, any>>( { path: base } ),
                apiFetch<FieldTree>( { path: `${ base }/fields${ selector }` } ),
            ] );
            if ( !mounted.current || current !== generation.current ) return false;
            apply( options, fields );
            createSuccessNotice( __( 'Settings saved.' ), { type: 'snackbar' } );
            return true;
        } catch ( err ) {
            if ( current === generation.current ) report( persisted ? new Error( __( 'Settings saved, but could not refresh the fields. Retry loading before continuing.' ) ) : err );
            return false;
        } finally {
            if ( current === generation.current ) { busy.current = false; if ( mounted.current ) setIsSaving( false ); }
        }
    }, [ base, selector, reload, apply, report, createSuccessNotice ] );

    const setAttributes = useCallback( ( attributes: Record<string, any> ) => {
        if ( busy.current ) return;
        const patch = path ? scopedPatch( fieldSnapshot.current, attributes ) : attributes;
        if ( !Object.keys( patch ).length ) return;
        changes.current = mergePatch( changes.current, patch );
        values.current = mergePatch( values.current, patch );
        setSaved( values.current );
        setPending( true );
        setError( null );
        setErrorCode( null );
    }, [ path ] );

    const follow = useCallback( async ( fieldPath: string[], event: React.MouseEvent ) => {
        event.preventDefault();
        event.stopPropagation();
        if ( busy.current ) return;
        // Inputs that commit on blur must contribute their last edit before saving.
        ( document.activeElement as HTMLElement )?.blur?.();
        const previous = getField( fieldSnapshot.current, fieldPath );
        const separate = previous?.buttonProps?.target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1;
        const popup = separate ? window.open( '', '_blank' ) : null;
        if ( popup ) popup.opener = null;
        if ( !await save() ) { popup?.close(); return; }
        const updated = getField( fieldSnapshot.current, fieldPath );
        const href = updated?.buttonProps?.href;
        if ( !href ) { popup?.close(); report( new Error( __( 'This action is not available. Review the refreshed settings.' ) ) ); return; }
        try {
            const url = new URL( href, window.location.href );
            if ( ![ 'http:', 'https:', 'mailto:', 'tel:' ].includes( url.protocol ) ) throw new Error( __( 'This action has an invalid URL.' ) );
            if ( separate ) {
                if ( !popup ) throw new Error( __( 'Your browser blocked the new window. Allow pop-ups and try again.' ) );
                popup.location.href = url.href;
            } else window.location.assign( url.href );
        } catch ( err ) { popup?.close(); report( err ); }
    }, [ save, report ] );

    const fields = useMemo( () => withLinkHandlers( rawFields, ( key, event ) => { void follow( key, event ); } ), [ rawFields, follow ] );
    const settings = useMemo( () => asTabs( fields ), [ fields ] );
    const context = { option_name, saved, fields, settings, isFetching, isSaving, hasPendingChanges, error, errorCode, save, reload, setAttributes };
    return <SettingsContext.Provider value={ context }>
        <div style={ { pointerEvents: isSaving || isFetching ? 'none' : 'auto', cursor: isSaving || isFetching ? 'wait' : 'auto' } }>
            { children }
        </div>
    </SettingsContext.Provider>;
};
