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

    /**
     * If the merge tag can be used in the conditional logic editor, this is the conditional logic type.
     */
    conditional_logic?: 'string' | 'number' | 'date';

    /**
     * An optional placeholder.
     */
    placeholder?: string;

    /**
     * An optional key value pair list of options.
     */
    options?: LabelValuePair[];
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

    /**
     * Conditional logic toggle label.
     */
    toggleLabel?: string;

    /**
     * Available comparisons.
     */
    comparisons?: LabelValuePair[];

    [key: string]: any;
};

/**
 * Represents a single conditional logic rule.
 */
export type ConditionalLogicRule = {

    /**
     * The condition to check.
     */
    condition: string;

    /**
     * The object key to check.
     */
    type: string;

    /**
     * The value to check.
     */
    value: string;
}

/**
 * Represents a single conditional logic configuration.
 */
export type ConditionalLogic = {

    /**
     * Whether conditional logic is enabled.
     */
    enabled: boolean;

    /**
     * The conditional logic action.
     */
    action: 'allow' | 'deny';

    /**
     * The conditional logic rules.
     */
    rules: ConditionalLogicRule[];

    /**
     * The conditional logic type.
     */
    type: 'all' | 'any';

};
