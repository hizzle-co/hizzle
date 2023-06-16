/**
 * Wordpress dependancies.
 */
import { __experimentalInputControl as InputControl } from '@wordpress/components';
import { useCallback, useMemo } from '@wordpress/element';
import { MergeTagsModalButton } from './merge-tags';
import type { FC } from 'react';
import type { InputControlProps } from '@wordpress/components/build-types/input-control/types';
type Setting = import( './types' ).Setting;
type MergeTagsProps = import( './types' ).MergeTagsProps;

type InputSettingProps = MergeTagsProps & InputControlProps & {

    /**
     * Input settings.
     */
    setting: Setting;

};

/**
 * Displays an input setting
 *
 */
const InputSetting: FC<InputSettingProps> = ({ setting, availableSmartTags, ...attributes }) => {

	// On add merge tag...
	const onMergeTagClick = useCallback((mergeTag: string) => {

		// Add the merge tag to the value.
		if ( attributes.onMergeTagClick ) {
			attributes.onMergeTagClick(attributes.value ? attributes.value + mergeTag : mergeTag);
		}
	}, [attributes.value, attributes.onMergeTagClick]);

	// Merge tags suffix.
	const suffix = useMemo(() => (
		<MergeTagsModalButton availableSmartTags={ availableSmartTags } onMergeTagClick={ onMergeTagClick }/>
	), [availableSmartTags, onMergeTagClick]);

	if ( setting.disabled ) {
		attributes.readOnly = true;
		attributes.onFocus = (e) => e.target.select();
	}

	return (
		<InputControl
			{...attributes}
			type={setting.type || 'text'}
			placeholder={setting.placeholder || ''}
			suffix={suffix}
			__next36pxDefaultSize
		/>
	);
}

export default InputSetting;
