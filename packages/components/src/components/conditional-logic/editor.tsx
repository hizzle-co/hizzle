/**
 * External dependencies
 */
import React, { useCallback, useMemo, useState } from 'react';

/**
 * WordPress dependencies
 */
import {
	ToggleControl,
	Button,
	__experimentalVStack as VStack,
	Modal,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	ConditionalLogicRules,
	ConditionalLogicRulesProps,
	ConditionalLogicTypeSelector,
} from '.';
import type { smartTag as SmartTagType } from '../hooks';

interface ConditionalLogicEditorProps
	extends Omit<
		ConditionalLogicRulesProps,
		| 'setConditionalLogicAttribute'
		| 'rules'
		| 'comparisons'
		| 'availableSmartTags'
		| 'className'
		| 'inModal'
		| 'closeModal'
	> {
	/**
	 * Function to handle changes to the conditional logic.
	 */
	onChange: (value: any) => void;

	/**
	 * The current conditional logic value.
	 */
	value: any;

	/**
	 * The available comparison operators.
	 */
	comparisons: Record<string, any>;

	/**
	 * Text to display for the toggle control.
	 */
	toggleText: string;

	/**
	 * The available smart tags that can be used in conditional logic.
	 */
	availableSmartTags?: SmartTagType[];

	/**
	 * CSS class name for the component.
	 */
	className?: string;

	/**
	 * Whether to display the editor in a modal.
	 */
	inModal: boolean;
}

/**
 * Displays the conditional logic editor.
 */
export const ConditionalLogicEditor: React.FC<ConditionalLogicEditorProps> = (
	props
) => {
	const {
		onChange,
		value,
		comparisons,
		toggleText,
		availableSmartTags,
		className,
		inModal = false,
		...extra
	} = props;
	const [isOpen, setIsOpen] = useState(false);

	const theValue = useMemo(() => {
		// If value is not an Object, set it to the default.
		if (typeof value !== 'object') {
			return {
				enabled: false,
				action: 'allow',
				rules: [],
				type: 'all',
			};
		}

		return value;
	}, [value]);

	// Sets conditional logic attribute.
	const setConditionalLogicAttribute = useCallback(
		(prop, val) => {
			onChange({
				...theValue,
				[prop]: val,
			});
		},
		[onChange, theValue]
	);

	if (!availableSmartTags) {
		return null;
	}

	const el = (
		<VStack spacing={5}>
			<ConditionalLogicTypeSelector
				ruleCount={
					Array.isArray(theValue.rules) ? theValue.rules.length : 0
				}
				type={theValue.type}
				action={theValue.action}
				setConditionalLogicAttribute={setConditionalLogicAttribute}
			/>

			<ConditionalLogicRules
				rules={theValue.rules}
				comparisons={comparisons}
				availableSmartTags={availableSmartTags}
				setConditionalLogicAttribute={setConditionalLogicAttribute}
				closeModal={
					inModal
						? () => {
								setIsOpen(false);
							}
						: undefined
				}
				{...extra}
			/>
		</VStack>
	);

	return (
		<VStack spacing={5} className={className}>
			<ToggleControl
				checked={theValue.enabled ? true : false}
				onChange={(val) => setConditionalLogicAttribute('enabled', val)}
				label={
					toggleText
						? toggleText
						: __(
								'Optionally enable/disable this trigger depending on specific conditions.',
								'newsletter-optin-box'
							)
				}
				__nextHasNoMarginBottom
			/>

			{theValue.enabled && (
				<>
					{inModal ? (
						<>
							{isOpen && (
								<Modal
									title={__(
										'Conditional Logic',
										'newsletter-optin-box'
									)}
									onRequestClose={() => setIsOpen(false)}
									isFullScreen
								>
									{el}
								</Modal>
							)}
							<Button
								variant="secondary"
								className="noptin-block-button"
								onClick={() => setIsOpen(true)}
							>
								{__(
									'Edit Conditional Logic',
									'newsletter-optin-box'
								)}
							</Button>
						</>
					) : (
						<>{el}</>
					)}
				</>
			)}
		</VStack>
	);
};
