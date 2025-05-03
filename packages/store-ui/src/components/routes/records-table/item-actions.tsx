/**
 * External dependencies.
 */
import React, { useMemo, useEffect } from 'react';

/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	DropdownMenu,
	MenuItem,
	Button,
} from '@wordpress/components';
import { ButtonProps } from '@wordpress/components/build-types/button/types';
import { __ } from '@wordpress/i18n';
import { moreVertical } from '@wordpress/icons';

/**
 * HizzleWP dependencies
 */
import { updatePath } from '@hizzlewp/history';

/**
 * Local dependencies
 */
import { DeleteAction, RemoteAction, CopyAction } from '../../actions';

/**
 * Type definitions
 */
type Action = Omit<Partial<ButtonProps>, 'onClick'> & {
	id: string;
	type?: 'delete' | 'remote' | 'copy' | 'edit';
	isPrimary?: boolean;
	[ key: string ]: any;
};

type ItemActionsProps = {
	item: any;
	isOverview?: boolean;
	namespace: string;
	collection: string;
	id: string;
};

const EMPTY_ACTIONS: Action[] = [];
export const ItemActions = ( { item, isOverview = false, ...props }: ItemActionsProps ) => {
	const actions: Action[] = item.hizzlewp_actions || EMPTY_ACTIONS;

	// Prepend edit action.
	useEffect( () => {

	}, [ actions, isOverview ] );

	const { primaryActions, preparedActions } = useMemo(
		() => {
			const preparedActions = [ ...actions ];

			// Prepend edit action if it doesn't exist.
			if ( !isOverview && !preparedActions.find( ( action ) => action.id === 'edit' ) ) {
				preparedActions.unshift( {
					id: 'edit',
					type: 'edit',
					text: __( 'Edit' ),
					icon: 'edit',
					isPrimary: true,
				} );
			}

			// Append delete action if it doesn't exist.
			if ( !preparedActions.find( ( action ) => action.id === 'delete' ) ) {
				preparedActions.push( {
					id: 'delete',
					type: 'delete',
					text: __( 'Delete' ),
					icon: 'trash',
				} );
			}

			return {
				primaryActions: preparedActions.filter( ( action ) => action.isPrimary && !!action.icon ),
				preparedActions,
			};
		},
		[ actions ]
	);

	if ( isOverview ) {
		return <CompactItemActions item={ item } actions={ preparedActions } { ...props } />;
	}

	return (
		<HStack
			spacing={ 1 }
			justify="flex-end"
			className="hizzlewp-records-item-actions"
			style={ {
				flexShrink: '0',
				width: 'auto',
			} }
			onClick={ ( event: React.MouseEvent ) => {
				// Prevents onChangeSelection from triggering.
				event.stopPropagation();
			} }
		>
			{ primaryActions.map( ( action ) => (
				<CompactItemAction
					key={ action.id }
					as={ Button }
					item={ item }
					action={ action }
					onClose={ () => { } }
					{ ...props }
				/>
			) ) }
			<CompactItemActions item={ item } actions={ preparedActions } { ...props } />
		</HStack>
	);
}

type CompactItemActionsProps = Omit<ItemActionsProps, 'isCompact'> & {
	actions: Action[];
};

const CompactItemActions = ( { item, actions, ...props }: CompactItemActionsProps ) => {
	return (
		<DropdownMenu
			label={ __( 'Actions' ) }
			icon={ moreVertical }
			toggleProps={ {
				className: 'hizzlewp-records-all-actions-button',
				size: 'compact',
				disabled: !actions.length,
			} }
			popoverProps={ {
				placement: 'bottom-end',
			} }
		>
			{ ( { onClose } ) => (
				<>
					{ actions.map( ( action ) => <CompactItemAction key={ action.id } item={ item } action={ action } onClose={ onClose } { ...props } /> ) }
				</>
			) }
		</DropdownMenu>
	);
}

type CompactItemActionProps = Omit<ItemActionsProps, 'isCompact'> & {
	action: Action;
	onClose?: () => void;
	as?: React.ElementType;
};

const CompactItemAction = ( { item, action, onClose, as = undefined, ...props }: CompactItemActionProps ) => {

	const { isPrimary, type, ...actionProps } = action;

	if ( 'copy' === type ) {
		return <RenderAction as={ as } Component={ CopyAction } props={ props } { ...actionProps } onClick={ onClose } />;
	}

	if ( 'delete' === type ) {
		return <RenderAction as={ as } Component={ DeleteAction } props={ props } { ...actionProps } { ...props } onClick={ onClose } />;
	}

	if ( 'remote' === type ) {
		return <RenderAction as={ as } Component={ RemoteAction } props={ props } { ...actionProps } { ...props } onClick={ onClose } />;
	}

	const buttonProps = { ...actionProps };

	if ( 'edit' === type ) {
		buttonProps.onClick = () => {
			updatePath( `/${ props.namespace }/${ props.collection }/${ props.id }` );
			onClose?.();
		}
	}

	return <RenderAction as={ as } props={ props } { ...buttonProps } />;
}

type RenderActionProps = {
	props: Omit<CompactItemActionProps, 'item' | 'action' | 'onClose' | 'as'>;
	Component?: React.ElementType;
	as?: React.ElementType;
	id: string;
	text?: string;
	[ key: string ]: any;
}

const RenderAction = ( { props, Component = undefined, as, text, ...extraProps }: RenderActionProps ) => {
	const ActionAs = as || MenuItem;
	const actionProps: Record<string, any> = { label: text, ...extraProps };
	const RenderComponent = Component || ActionAs;

	if ( Component ) {
		actionProps.as = ActionAs;
	}

	if ( as ) {
		return (
			<RenderComponent showTooltip { ...actionProps } />
		)
	}

	return (
		<RenderComponent { ...actionProps }>
			{ text }
		</RenderComponent>
	)
}
