import type { FC } from 'react';
import type { InputControlProps } from '@wordpress/components/build-types/input-control/types';
type Setting = import('./types').Setting;
type MergeTagsProps = import('./types').MergeTagsProps;
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
declare const InputSetting: FC<InputSettingProps>;
export default InputSetting;
