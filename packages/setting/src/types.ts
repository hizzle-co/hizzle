import type { HTMLInputTypeAttribute } from 'react';

/**
 * A key value pair.
 */
export type KeyValuePair<T = string> = {

    /**
     * The key.
     */
    key: string;

    /**
     * The value.
     */
    value: T;
}

/**
 * A label value pair.
 */
export type LabelValuePair<T = string> = {

    /**
     * The key.
     */
    label: string;

    /**
     * The value.
     */
    value: T;
}

/**
 * A key value pair repeater field.
 */
export type keyValueRepeaterField = {
	/**
	 * The field ID.
	 */
	id: string;

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
 * A single merge tag.
 */
export type MergeTag = {

    /**
     * The merge tag name.
     */
    smart_tag: string;

    /**
     * The merge tag label.
     */
    label: string;

    /**
     * The merge tag description.
     */
    description?: string;

    /**
     * The merge tag type.
     */
    type: 'date' | 'string' | 'number';

    /**
     * The merge tag default value.
     */
    default?: string;

    /**
     * Example value.
     */
    example?: string;

    /**
     * A replacement value.
     */
    replacement?: string;
}

/**
 * A list of available merge tags.
 */
export type MergeTags = MergeTag[];

/**
 * The merge tags props.
 */
export interface MergeTagsProps {

    /**
     * A list of available merge tags.
     */
    availableSmartTags: MergeTag[];

    /**
     * The callback to call when a merge tag is clicked.
     */
    onMergeTagClick?: (mergeTag: string) => void;
};

/**
 * A single condition.
 */
export type Condition = {
    key: string;
    value: any;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=';
}

/**
 * A single setting.
 */
export type Setting = {

    /**
     * Callback to check if the setting is active.
     */
    condition?: (savedSetting: { [key: string]: any }) => boolean;

    /**
     * Condition to show this setting.
     */
    if?: Condition[];

    /**
     * Whether to check conditions using OR.
     *
     */
    ifOR?: boolean;

    /**
     * Whether the setting is disabled.
     */
    disabled?: boolean;

    /**
     * The default setting value.
     */
    default?: any;

    /**
     * A key value pair of dropdown options.
     */
    options?: { [key: string]: string };

    /**
     * Whether to display a full width setting.
     */
    fullWidth?: boolean;

    /**
     * The element to render.
     */
    el?: string;

    /**
     * The input type when el is input.
     */
    type?: HTMLInputTypeAttribute;

    /**
     * The element label.
     */
    label?: string;

    /**
     * An optional setting description.
     */
    description?: string;

    /**
     * An optional placeholder.
     */
    placeholder?: string;

    /**
     * Conditional logic if options.
     */
    ifOptions?: LabelValuePair[];

    [key: string]: any;
};
