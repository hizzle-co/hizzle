/**
 * External dependencies.
 */
import React, { useMemo } from 'react';

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
	actions?: Action[];
	isOverview?: boolean;
	namespace: string;
	collection: string;
	id: string;
};

const EMPTY_ACTIONS: Action[] = [];
export const ItemActions = ( { actions, isOverview = false, ...props }: ItemActionsProps ) => {

	const { primaryActions, preparedActions } = useMemo(
		() => {
			const preparedActions = [ ...actions || EMPTY_ACTIONS ];

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
					isPrimary: isOverview,
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
			expanded={ false }
		>
			{ primaryActions.map( ( action ) => (
				<CompactItemAction
					key={ action.id }
					as={ Button }
					action={ action }
					onClose={ () => { } }
					{ ...props }
				/>
			) ) }
			<CompactItemActions actions={ preparedActions } { ...props } isOverview={ isOverview } />
		</HStack>
	);
}

type CompactItemActionsProps = ItemActionsProps & {
	actions: Action[];
};

const CompactItemActions = ( { actions, isOverview, ...props }: CompactItemActionsProps ) => {
	let buttonProps: Record<string, any> = {
		className: 'hizzlewp-records-all-actions-button',
		size: 'compact',
	}

	if ( isOverview ) {
		buttonProps = {
			iconSize: 32,
			variant: 'tertiary',
		}
	}

	return (
		<DropdownMenu
			label={ __( 'Actions' ) }
			icon={ moreVertical }
			toggleProps={ {
				...buttonProps,
				disabled: !actions.length,
			} }
			popoverProps={ {
				placement: 'bottom-end',
			} }
		>
			{ ( { onClose } ) => (
				<>
					{ actions.map( ( action ) => <CompactItemAction key={ action.id } action={ action } onClose={ onClose } { ...props } /> ) }
				</>
			) }
		</DropdownMenu>
	);
}

type CompactItemActionProps = Omit<ItemActionsProps, 'isOverview'> & {
	action: Action;
	onClose?: () => void;
	as?: React.ElementType;
};

const CompactItemAction = ( { action, onClose, as = undefined, ...props }: CompactItemActionProps ) => {

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
	props: Omit<CompactItemActionProps, 'action' | 'onClose' | 'as'>;
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
