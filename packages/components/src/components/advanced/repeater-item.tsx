/**
 * External dependencies
 */
import React, { useCallback, useState } from 'react';

/**
 * Wordpress dependancies.
 */
import {
	Button,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalText as Text,
	CardHeader,
	CardBody,
	Flex,
	FlexBlock,
	FlexItem,
	Icon,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Local dependancies.
 */
import { smartTag } from '../hooks';
import { Setting, ISetting } from '../setting';
import { getNestedValue } from '../utils';

export interface RepeaterKey {
	/**
	 * The path to the value to display, e.g, 'label = First Name'
	 *
	 * Shown in the header and used to generate the key. Omit for a key-only header.
	 */
	from?: string;

	/**
	 * The path to an auto-generated value, e.g, 'merge_tag = first_name'.
	 *
	 * Shown as a badge in the header of the repeater item.
	 */
	to: string;

	/**
	 * Whether to only generate a key for new items.
	 */
	newOnly: boolean;

	/**
	 * The maximum length of the value.
	 *
	 * @default 64
	 */
	maxLength: number;

	/**
	 * The display value.
	 */
	display: string | false;

	/**
	 * The fallback value path.
	 */
	fallback?: string;

	/** Allow the card to remain expanded with a non-interactive header. */
	collapsible?: boolean;
}

interface RepeaterItemProps {
	/**
	 * A unique id.
	 */
	id: string;

	/**
	 * The fields.
	 */
	fields: ISetting[];

	/**
	 * The available smart tags.
	 */
	availableSmartTags: smartTag[];

	/**
	 * The repeater key.
	 */
	repeaterKey?: RepeaterKey;

	/**
	 * The on change handler.
	 */
	onChange: ( value: any ) => void;

	/**
	 * The on delete handler.
	 */
	onDelete?: () => void;

	/**
	 * The on move up handler.
	 */
	onMoveUp?: () => void;

	/**
	 * The on move down handler.
	 */
	onMoveDown?: () => void;

	/**
	 * The value.
	 */
	value: {
		/**
		 * Whether the item is predefined, e.g, needed for the system to work.
		 *
		 * These can't be deleted.
		 */
		is_predefined?: boolean;

		/**
		 * The item data.
		 */
		[ key: string ]: unknown;
	};
}

/**
 * Displays a single item in a repeater field.
 */
export const RepeaterItem: React.FC<RepeaterItemProps> = ( props ) => {
	// Destructure props to get necessary values
	const {
		fields,
		availableSmartTags,
		value,
		onChange,
		repeaterKey = undefined,
		onDelete,
		onMoveUp,
		onMoveDown,
		id,
	} = props;

	// Headers can remain expanded when their text is intended for selection.
	const canCollapse = !!repeaterKey && repeaterKey.collapsible !== false;
	const [ isOpen, setIsOpen ] = useState( !canCollapse );
	const toggle = useCallback( () => setIsOpen( ( current ) => !current ), [] );
	const hideBody = canCollapse && !isOpen;
	let header: React.ReactNode = null;

	if ( repeaterKey ) {
		const keyValue = repeaterKey.to
			? getNestedValue( value, repeaterKey.to )
			: '';

		// Create a badge element if we have display text and a value at the 'to' path
		const badge =
			repeaterKey.display !== false && keyValue ? (
				<code
					style={ {
						minWidth: 0,
						whiteSpace: 'normal',
						overflowWrap: 'anywhere',
						userSelect: canCollapse ? 'text' : 'all',
					} }
				>
					{ sprintf( repeaterKey.display || '%s', keyValue ) }
				</code>
			) : null;
		const cardLabel =
			( repeaterKey.from
				? getNestedValue( value, repeaterKey.from )
				: undefined ) || getNestedValue( value, repeaterKey.fallback );
		header = (
			<CardHeader style={ { padding: 0 } }>
				<Flex
					as={ canCollapse ? Button : 'div' }
					onClick={ canCollapse ? toggle : undefined }
					style={ {
						padding: '12px 16px',
						minHeight: 48,
						height: 'auto',
						textAlign: 'left',
						width: '100%',
						minWidth: 0,
					} }
					aria-controls={ canCollapse ? `${ id }__body` : undefined }
					aria-expanded={ canCollapse ? !hideBody : undefined }
				>
					<HStack
						as={ FlexBlock }
						justify="flex-start"
						style={ { minWidth: 0 } }
					>
						{ repeaterKey.from || repeaterKey.fallback ? (
							<Text weight={ 600 }>
								{ ( cardLabel as string ) ||
									__( '(new)', 'newsletter-optin-box' ) }
							</Text>
						) : (
							badge
						) }
					</HStack>
					<FlexItem>
						<HStack>
							{ ( repeaterKey.from || repeaterKey.fallback ) &&
								badge }
							{ canCollapse && (
								<Icon
									icon={
										isOpen
											? 'arrow-up-alt2'
											: 'arrow-down-alt2'
									}
								/>
							) }
						</HStack>
					</FlexItem>
				</Flex>
			</CardHeader>
		);
	}

	return (
		<>
			{ header }
			{ !hideBody && (
				<CardBody id={ `${ id }__body` }>
					<VStack>
						{ Object.keys( fields ).map( ( fieldKey ) => (
							<Setting
								key={ fieldKey }
								settingKey={ fieldKey }
								availableSmartTags={ availableSmartTags }
								setting={ fields[ fieldKey ] }
								saved={ value as Record<string, unknown> }
								setAttributes={ ( attributes ) => {
									onChange( { ...value, ...attributes } );
								} }
							/>
						) ) }
						<HStack
							className="hizzlewp-repeater-item__actions"
							justify="flex-start"
						>
							{ onDelete && !value?.predefined && (
								<Button
									variant="link"
									onClick={ onDelete }
									text={ __(
										'Remove Item',
										'newsletter-optin-box'
									) }
									isDestructive
								/>
							) }
							{ onMoveUp && (
								<Button
									onClick={ onMoveUp }
									icon="arrow-up-alt"
									text={ __( 'Move Up', 'newsletter-optin-box' ) }
									size="small"
									iconSize={ 16 }
								/>
							) }
							{ onMoveDown && (
								<Button
									onClick={ onMoveDown }
									icon="arrow-down-alt"
									text={ __(
										'Move Down',
										'newsletter-optin-box'
									) }
									size="small"
									iconSize={ 16 }
								/>
							) }
						</HStack>
					</VStack>
				</CardBody>
			) }
		</>
	);
};
