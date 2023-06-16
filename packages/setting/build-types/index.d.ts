import type { FC } from 'react';
type Setting = import('./types').Setting;
type MergeTagsProps = import('./types').MergeTagsProps;
/**
 * Field props.
 */
type settingProps = MergeTagsProps & {
    /**
     * The setting key.
     */
    settingKey: string;
    /**
     * The setting object.
     */
    setting: Setting;
    /**
     * The saved object.
     */
    saved: {
        [key: string]: any;
    };
    /**
     * The property to update on the object.
     *
     * Usefull for nested objects.
     */
    prop?: string;
    /**
     * The function to update the object attributes.
     */
    setAttributes: (attributes: {
        [key: string]: any;
    }) => void;
};
/**
 * Displays a single setting.
 *
 */
declare const SettingControl: FC<settingProps>;
export default SettingControl;
