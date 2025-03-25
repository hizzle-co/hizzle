/**
 * External dependencies
 */
import React, { useCallback, useEffect } from 'react';

/**
 * Wordpress dependancies.
 */
import {
	TextareaControl,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import type { TextareaControlProps } from '@wordpress/components/src/textarea-control/types';
import { useInstanceId } from '@wordpress/compose';

/**
 * Local dependencies.
 */
import { ISetting } from '../setting';
import { useMergeTags, smartTag } from '../hooks';

/**
 * The textarea setting props.
 */
interface TextareaSettingProps
	extends TextareaControlProps,
		Omit<
			React.TextareaHTMLAttributes<HTMLTextAreaElement>,
			'onChange' | 'value'
		> {
	/**
	 * The available smart tags.
	 */
	availableSmartTags?: smartTag[];

	/**
	 * Whether to auto grow the textarea.
	 */
	autoGrow?: boolean;

	/**
	 * The setting.S
	 */
	setting: ISetting;

	/**
	 * The id.
	 */
	id?: string;
}

/**
 * Displays a textarea setting
 *
 */
export const TextareaSetting: React.FC<TextareaSettingProps> = ({
	availableSmartTags,
	autoGrow = false,
	label,
	id,
	setting,
	...attributes
}) => {
	// On add merge tag...
	const onMergeTagClick = useCallback(
		(mergeTag) => {
			// Add the merge tag to the value.
			if (attributes.onChange) {
				attributes.onChange(
					attributes.value
						? `${attributes.value} ${mergeTag}`.trim()
						: mergeTag
				);
			}
		},
		[attributes.value, attributes.onChange]
	);

	const mergeTagSuffix = useMergeTags({
		availableSmartTags,
		onMergeTagClick,
		toggleProps: { size: 'small' },
	});

	const newLabel =
		!setting.disabled && mergeTagSuffix ? (
			<HStack>
				<span>{label}</span>
				{mergeTagSuffix}
			</HStack>
		) : (
			label
		);

	const maybeId = id
		? id
		: useInstanceId(TextareaSetting, 'hizzlewp-textarea');

	// Maybe auto grow.
	useEffect(() => {
		if (autoGrow) {
			const el = document.getElementById(maybeId);
			if (el) {
				el.style.height = 'auto';
				el.style.height = `${el.scrollHeight}px`;
			}
		}
	}, [attributes.value, autoGrow, maybeId]);

	if (setting.disabled) {
		attributes.readOnly = true;
		attributes.onFocus = (e) => e.target.select();

		if (setting.value) {
			attributes.value = setting.value;
		}
	}

	return (
		<TextareaControl
			{...attributes}
			id={maybeId}
			label={newLabel}
			__nextHasNoMarginBottom
		/>
	);
};
