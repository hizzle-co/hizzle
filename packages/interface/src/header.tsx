/**
 * External dependencies.
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalSurface as Surface,
	__experimentalText as Text,
	Button,
	Slot,
} from '@wordpress/components';

type HeaderProps = {
	brand?: {
		/**
		 * The brand logo URL.
		 */
		logo?: string;

		/**
		 * The brand name.
		 */
		name?: string;

		/**
		 * The brand version.
		 */
		version?: string;
	};
	actions?: Record<string, any>[];
	extra?: React.ReactNode;
};

export const Header = ({
	brand = undefined,
	actions = undefined,
	extra = undefined,
}: HeaderProps) => {
	if (!brand && !actions && !extra) {
		return null;
	}

	return (
		<HStack
			as={Surface}
			style={{ padding: '10px 20px', zIndex: 1000 }}
			wrap
		>
			{brand && (
				<div>
					<HStack>
						{brand?.logo && (
							<img
								src={brand.logo}
								alt={brand.name}
								style={{ width: 'auto', height: '40px' }}
							/>
						)}
						{brand?.name && (
							<Text weight={600} size={14}>
								{brand?.name}
							</Text>
						)}
						{brand?.version && (
							<Text weight={600} size={14} variant="muted">
								{brand?.version}
							</Text>
						)}
					</HStack>
				</div>
			)}
			{extra && <div>{extra}</div>}
			{actions && (
				<div>
					<HStack>
						{actions.map((action, index) => (
							<Button key={index} {...action} />
						))}
					</HStack>
				</div>
			)}
			<Slot name="hizzle-interface__header" />
		</HStack>
	);
};
