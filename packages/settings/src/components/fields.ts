import { ISetting } from '@hizzlewp/components';
import type React from 'react';

export type FieldTree = Record<string, any>;
const wrappers = [ 'sub_sections', 'settings', 'children' ];
const containers = [ 'integration_panel', 'settings_group', 'horizontal' ];

export const getValue = ( value: any, path: string ) => path.split( '.' ).reduce( ( node, key ) =>
    node && Object.prototype.hasOwnProperty.call( node, key ) ? node[ key ] : undefined, value );

export const getField = ( fields: FieldTree, path: string[] ) => path.reduce( ( node, key ) =>
    node && Object.prototype.hasOwnProperty.call( node, key ) ? node[ key ] : undefined, fields as any );

export const setValue = ( value: any, path: string, next: any ): any => {
    const [ key, ...rest ] = path.split( '.' );
    if ( [ '__proto__', 'prototype', 'constructor' ].includes( key ) ) return value;
    const copy = Array.isArray( value ) ? [ ...value ] : { ...value };
    copy[ key ] = rest.length ? setValue( copy[ key ], rest.join( '.' ), next ) : next;
    return copy;
};

export const mergePatch = ( saved: Record<string, any>, patch: Record<string, any> ): Record<string, any> => Object.entries( patch ).reduce( ( result, [ key, value ] ) => ( {
    ...result,
    [ key ]: value && typeof value === 'object' && !Array.isArray( value ) && result[ key ] && typeof result[ key ] === 'object'
        ? mergePatch( result[ key ], value ) : value,
} ), { ...saved } );

export const scopedPatch = ( fields: FieldTree, attributes: Record<string, any> ) => {
    let patch = {};
    const visit = ( tree: FieldTree ) => Object.entries( tree ).forEach( ( [ key, field ] ) => {
        if ( !field || typeof field !== 'object' ) return;
        if ( field.el || field.type ) {
            if ( containers.includes( field.el || field.type ) ) visit( field.settings || field.children || {} );
            else if ( !field.disabled && !field.readonly && ![ 'button', 'paragraph', 'hero', 'heading', 'html' ].includes( field.el || field.type ) && getValue( attributes, key ) !== undefined ) {
                patch = setValue( patch, key, getValue( attributes, key ) );
            }
        } else visit( field.sub_sections || field.settings || field );
    } );
    visit( fields );
    return patch;
};

/** Defaults belong to option-value paths, not to the section/group path. */
export const withDefaults = ( fields: FieldTree, saved: Record<string, any> ) => {
    let result = { ...saved };
    const visit = ( tree: FieldTree ) => Object.entries( tree ).forEach( ( [ key, field ] ) => {
        if ( !field || typeof field !== 'object' ) return;
        if ( field.el || field.type ) {
            if ( containers.includes( field.el || field.type ) ) {
                visit( field.settings || field.children || {} );
            } else if ( !field.disabled && field.default !== undefined && getValue( result, key ) === undefined ) {
                result = setValue( result, key, field.default );
            }
        } else {
            visit( field.sub_sections || field.settings || field );
        }
    } );
    visit( fields );
    return result;
};

/** Decorate every declared URL button, including buttons in nested groups. */
export const withLinkHandlers = ( fields: FieldTree, follow: ( path: string[], event: React.MouseEvent ) => void, prefix: string[] = [] ): FieldTree =>
    Object.fromEntries( Object.entries( fields ).map( ( [ key, value ] ) => {
        if ( !value || typeof value !== 'object' ) return [ key, value ];
        const path = [ ...prefix, key ];
        const field = { ...value };
        wrappers.forEach( ( wrapper ) => {
            if ( field[ wrapper ] ) field[ wrapper ] = withLinkHandlers( field[ wrapper ], follow, [ ...path, wrapper ] );
        } );
        if ( field.el === 'button' && field.buttonProps && 'href' in field.buttonProps ) {
            field.buttonProps = { ...field.buttonProps,
                onClick: ( event: React.MouseEvent ) => follow( path, event ),
                onAuxClick: ( event: React.MouseEvent ) => { if ( event.button === 1 ) follow( path, event ); },
            };
        }
        // Root tab and subsection maps have no field type.
        if ( !field.el && !field.type && !wrappers.some( ( wrapper ) => wrapper in field ) ) {
            return [ key, withLinkHandlers( value, follow, path ) ];
        }
        return [ key, field ];
    } ) );

export interface ISection {
    name: string;
    title: string;
    path: string;
    settings: Record<string, ISetting>;
}
export interface ITab extends Omit<ISection, 'settings'> { sections: ISection[]; }

export const asTabs = ( fields: FieldTree ): ITab[] => Object.entries( fields ).filter( ( [ , tab ] ) => tab?.sub_sections ).map( ( [ name, tab ] ) => {
    const sections = Object.entries( tab.sub_sections ).map( ( [ key, section ]: [ string, any ] ) => ( {
        name: key, title: section.label, path: `/${ name }/${ key }`, settings: section.settings,
    } ) );
    return { name, title: tab.label, path: sections[ 0 ]?.path || `/${ name }`, sections };
} );
