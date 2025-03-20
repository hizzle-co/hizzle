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
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { next, lock } from '@wordpress/icons';
import { RawHTML } from '@wordpress/element';
import type { DropdownMenuProps } from '@wordpress/components/src/dropdown-menu/types';

/**
 * Local dependencies
 */
import { useMergeTagGroups, smartTag } from '.';
import { getMergeTagValue } from '../utils';

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
	onMergeTagClick?: (mergeTag: string, full?: string) => void;

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
export const useMergeTags = ({
	availableSmartTags = [],
	onMergeTagClick = () => {},
	raw = false,
	icon = 'shortcode',
	label = __('Insert dynamic field', 'newsletter-optin-box'),
	...dropdownProps
}: UseMergeTagsProps) => {
	const [searchTerm, setSearchTerm] = useState('');
	const groups = useMergeTagGroups(availableSmartTags);
	const totalGroups = Object.keys(groups).length;

	// Filter groups based on search term
	const filteredGroups = useMemo(() => {
		if (!searchTerm) return groups;

		const searchLower = searchTerm.toLowerCase();
		const filtered: typeof groups = {};

		Object.entries(groups).forEach(([groupName, items]) => {
			const matchingItems = items.filter(
				(item) =>
					item.label.toLowerCase().includes(searchLower) ||
					item.smart_tag.toLowerCase().includes(searchLower) ||
					groupName.toLowerCase().includes(searchLower) ||
					item.description?.toLowerCase().includes(searchLower)
			);

			if (matchingItems.length > 0) {
				filtered[groupName] = matchingItems;
			}
		});

		return filtered;
	}, [groups, searchTerm]);

	const hasResults = Object.keys(filteredGroups).length > 0;

	// If we have merge tags, show the merge tags button.
	let inserter: React.ReactNode = null;

	if (totalGroups > 0) {
		inserter = (
			<DropdownMenu icon={icon} label={label} {...dropdownProps}>
				{({ onClose }) => (
					<VStack>
						<SearchControl
							__nextHasNoMarginBottom
							value={searchTerm}
							onChange={setSearchTerm}
						/>
						{hasResults && (
							<>
								<Tip>
									{__(
										'Click a field to insert it.',
										'newsletter-optin-box'
									)}
									&nbsp;
									{__(
										'When your automation runs, each field will be replaced with actual data.',
										'newsletter-optin-box'
									)}
								</Tip>
								{Object.keys(filteredGroups).map((group) => (
									<MenuGroup
										label={
											totalGroups > 1 ? group : undefined
										}
										key={group}
									>
										{filteredGroups[group].map((item) => {
											const isPremium = item.isPremium;
											const itemLabel = isPremium
												? `${item.label} - Premium`
												: item.label;

											return (
												<MenuItem
													icon={
														isPremium
															? lock
															: item.icon || next
													}
													iconPosition="left"
													label="Click to add dynamic value"
													showTooltip
													disabled={isPremium}
													onClick={() => {
														if (isPremium) return;

														const tagValue =
															getMergeTagValue(
																item
															);
														const value = raw
															? item.smart_tag
															: `[[${tagValue}]]`;
														onMergeTagClick?.(
															value,
															`[[${tagValue}]]`
														);

														onClose();
													}}
													key={item.smart_tag}
												>
													<RawHTML>
														{itemLabel}
													</RawHTML>
												</MenuItem>
											);
										})}
									</MenuGroup>
								))}
							</>
						)}
						{!hasResults && (
							<MenuGroup>
								<MenuItem disabled>
									{__(
										'No matching items found',
										'newsletter-optin-box'
									)}
								</MenuItem>
							</MenuGroup>
						)}
					</VStack>
				)}
			</DropdownMenu>
		);
	}

	return inserter;
};
