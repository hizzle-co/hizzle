/**
 * External dependencies
 */
import React, { useCallback } from 'react';

/**
 * Wordpress dependancies.
 */
import {
	__experimentalInputControl as InputControl,
	FlexBlock,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Local dependancies.
 */
import { smartTag, useMergeTags } from '../hooks';

interface KeyValueRepeaterFieldProps {
	/**
	 * The onChange handler.
	 */
	onChange: ( value: string | undefined ) => void;

	/**
	 * The current value.
	 */
	value: string | undefined;

	/**
	 * The field object.
	 */
	field: {
		/**
		 * The field label.
		 */
		label: string;

		/**
		 * The field type.
		 */
		type: string;
	};

	/**
	 * The available smart tags.
	 */
	availableSmartTags?: smartTag[];
}

/**
 * Displays a key value repeater setting field.
 *
 */
export const KeyValueRepeaterField: React.FC<KeyValueRepeaterFieldProps> = ( {
	field,
	availableSmartTags,
	value,
	onChange,
} ) => {
	// On add merge tag...
	const onMergeTagClick = useCallback(
		( mergeTag: string ) => {
			// Add the merge tag to the value.
			if ( onChange ) {
				onChange( value ? `${ value } ${ mergeTag }`.trim() : mergeTag );
			}
		},
		[ value, onChange ]
	);

	// Merge tags.
	const suffix = useMergeTags( { availableSmartTags, onMergeTagClick } );

	return (
		<FlexBlock>
			<InputControl
				label={ field.label }
				type={ field.type }
				value={ value }
				className="hizzlewp-component__field hizzlewp-condition-field"
				suffix={ suffix }
				onChange={ onChange }
				isPressEnterToChange
				__next40pxDefaultSize
			/>
		</FlexBlock>
	);
};
