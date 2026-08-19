/**
 * External dependencies
 */
import React, { useMemo, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	SearchControl,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Tip,
	Button,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { next, lock } from '@wordpress/icons';
import { RawHTML } from '@wordpress/element';
import type { DropdownMenuProps } from '@wordpress/components/src/dropdown-menu/types';

/**
 * Local dependencies
 */
import { SettingProps, ISetting, Setting } from '..';
import { useMergeTagGroups, smartTag } from '.';
import { attributesToMergeTag, getMergeTagValue } from '../utils';

export interface MergeTagSettingsProps {
	/** The merge tag attribute definitions to display. */
	settings: Record<string, ISetting>;
	/** Whether the merge tag is guaranteed to return a value. */
	neverEmpty?: boolean;
	/** The object containing the saved attribute values. */
	saved: Record<string, unknown>;
	/** Updates the saved attribute values. */
	setAttributes: ( attributes: Record<string, unknown> ) => void;
	/** Optional property containing the attribute values. */
	prop?: string;
	/** Smart tags available inside attribute inputs. */
	availableSmartTags?: smartTag[];
	/** Optional Setting implementation used to render each attribute. */
	SettingComponent?: React.ComponentType<SettingProps>;
}

/**
 * Displays the settings supported by a merge tag.
 */
export function MergeTagSettings( {
	settings,
	neverEmpty = false,
	saved,
	setAttributes,
	prop,
	availableSmartTags,
	SettingComponent = Setting,
}: MergeTagSettingsProps ) {
	return (
		<>
			{ Object.entries( settings )
				.filter( ( [ key ] ) => !neverEmpty || 'default' !== key )
				.map( ( [ key, setting ] ) => (
					<SettingComponent
						key={ key }
						settingKey={ key }
						setting={ setting }
						saved={ saved }
						setAttributes={ setAttributes }
						prop={ prop }
						availableSmartTags={ availableSmartTags }
					/>
				) ) }
		</>
	);
}

interface UseMergeTagsProps extends Omit<DropdownMenuProps, 'label'> {
	/**
	 * The available smart tags.
	 */
	availableSmartTags?: smartTag[];

	/**
	 * The on merge tag click callback.
	 *
	 * @param {string} mergeTag The merge tag.
	 * @param {string} full The full merge tag.
	 */
	onMergeTagClick?: ( mergeTag: string, full?: string ) => void;

	/**
	 * Whether or not to return the raw value.
	 *
	 * @default false
	 */
	raw?: boolean;

	/**
	 * The screenreader text.
	 *
	 * @default 'Insert dynamic field'
	 */
	label?: string;
}

/**
 * Makes it possible to use the merge tag selector in a field.
 *
 * @return {JSX.Element}
 */
export const useMergeTags = ( {
	availableSmartTags = [],
	onMergeTagClick = () => { },
	raw = false,
	icon = 'shortcode',
	label = 'Insert dynamic field',
	...dropdownProps
}: UseMergeTagsProps ) => {
	const [ searchTerm, setSearchTerm ] = useState( '' );
	const [ selectedSmartTag, setSelectedSmartTag ] = useState<smartTag | null>(
		null
	);
	const [ attributes, setAttributes ] = useState<Record<string, unknown>>( {} );
	const groups = useMergeTagGroups( availableSmartTags );
	const totalGroups = Object.keys( groups ).length;

	// Filter groups based on search term
	const filteredGroups = useMemo( () => {
		if ( !searchTerm ) return groups;

		const searchLower = searchTerm.toLowerCase();
		const filtered: typeof groups = {};

		Object.entries( groups ).forEach( ( [ groupName, items ] ) => {
			const matchingItems = items.filter(
				( item ) =>
					item.label.toLowerCase().includes( searchLower ) ||
					item.smart_tag.toLowerCase().includes( searchLower ) ||
					groupName.toLowerCase().includes( searchLower ) ||
					item.description?.toLowerCase().includes( searchLower )
			);

			if ( matchingItems.length > 0 ) {
				filtered[ groupName ] = matchingItems;
			}
		} );

		return filtered;
	}, [ groups, searchTerm ] );

	const hasResults = Object.keys( filteredGroups ).length > 0;
	const getAttributes = ( item: smartTag ) =>
		Object.entries( item.attributes || {} ).filter(
			( [ key ] ) => !item.never_empty || 'default' !== key
		);
	const configureSmartTag = ( item: smartTag ) => {
		setAttributes(
			getAttributes( item ).reduce(
				( saved, [ key, setting ] ) => ( {
					...saved,
					[ key ]: setting.default ?? '',
				} ),
				{}
			)
		);
		setSelectedSmartTag( item );
	};
	const insertSmartTag = (
		item: smartTag,
		configuredAttributes?: Record<string, unknown>
	) => {
		const full = configuredAttributes
			? attributesToMergeTag( configuredAttributes, item.smart_tag )
			: `[[${ getMergeTagValue( item ) }]]`;
		const value = raw
			? configuredAttributes
				? full.slice( 2, -2 )
				: item.smart_tag
			: full;

		onMergeTagClick?.( value, full );
	};

	// If we have merge tags, show the merge tags button.
	let inserter: React.ReactNode = null;

	if ( totalGroups > 0 ) {
		inserter = (
			<DropdownMenu icon={ icon } label={ label } { ...dropdownProps }>
				{ ( { onClose } ) => (
					<VStack style={ { minWidth: 200 } }>
						{ selectedSmartTag ? (
							<>
								<Button
									variant="link"
									onClick={ () => setSelectedSmartTag( null ) }
								>
									Go Back
								</Button>
								<RawHTML>{ selectedSmartTag.label }</RawHTML>
								<MergeTagSettings
									settings={ selectedSmartTag.attributes || {} }
									neverEmpty={ selectedSmartTag.never_empty }
									saved={ attributes }
									setAttributes={ ( updated ) =>
										setAttributes( ( current ) => ( {
											...current,
											...updated,
										} ) )
									}
									availableSmartTags={ availableSmartTags }
								/>
								<div>
									<Button
										variant="primary"
										onClick={ () => {
											insertSmartTag(
												selectedSmartTag,
												attributes
											);
											setSelectedSmartTag( null );
											onClose();
										} }
									>
										{ __(
											'Insert',
											'newsletter-optin-box'
										) }
									</Button>
								</div>
							</>
						) : (
							<>
								<SearchControl
									__nextHasNoMarginBottom
									value={ searchTerm }
									onChange={ setSearchTerm }
								/>
								{ hasResults && (
									<>
										<Tip>
											{ __(
												'Click a field to insert it.',
												'newsletter-optin-box'
											) }
											&nbsp;
											{ __(
												'When your automation runs, each field will be replaced with actual data.',
												'newsletter-optin-box'
											) }
										</Tip>
										{ Object.keys( filteredGroups ).map(
											( group ) => (
												<MenuGroup
													label={
														totalGroups > 1
															? group
															: undefined
													}
													key={ group }
												>
													{ filteredGroups[ group ].map(
														( item ) => {
															const isPremium =
																item.isPremium;
															const itemLabel =
																isPremium
																	? `${ item.label } - Premium`
																	: item.label;

															return (
																<MenuItem
																	icon={
																		isPremium
																			? lock
																			: item.icon ||
																			next
																	}
																	iconPosition="left"
																	label="Click to add dynamic value"
																	showTooltip
																	disabled={
																		isPremium
																	}
																	onClick={ () => {
																		if (
																			isPremium
																		)
																			return;

																		if (
																			getAttributes(
																				item
																			)
																				.length
																		) {
																			configureSmartTag(
																				item
																			);
																		} else {
																			insertSmartTag(
																				item
																			);
																			onClose();
																		}
																	} }
																	key={
																		item.smart_tag
																	}
																>
																	<RawHTML>
																		{
																			itemLabel
																		}
																	</RawHTML>
																</MenuItem>
															);
														}
													) }
												</MenuGroup>
											)
										) }
									</>
								) }
								{ !hasResults && (
									<MenuGroup>
										<MenuItem disabled>
											No matching items found
										</MenuItem>
									</MenuGroup>
								) }
							</>
						) }
					</VStack>
				) }
			</DropdownMenu>
		);
	}

	return inserter;
};
