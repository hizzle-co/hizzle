import type { HTMLInputTypeAttribute, ReactNode } from 'react';
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
};
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
};
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
};
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
}
/**
 * A single condition.
 */
export type Condition = {
    key: string;
    value: any;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=';
};
/**
 * A single setting.
 */
export type Setting = {
    /**
     * Callback to check if the setting is active.
     */
    condition?: (savedSetting: {
        [key: string]: any;
    }) => boolean;
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
    options?: {
        [key: string]: string;
    };
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
};
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
export type repeaterControlProps = {
    /**
     * Start opting into the new margin-free styles that will become the default in a future version.
     *
     * @default false
     */
    __nextHasNoMarginBottom?: boolean;
    /**
     * The HTML `id` of the control element (passed in as a child to `BaseControl`) to which labels and help text are being generated.
     * This is necessary to accessibly associate the label with that element.
     *
     * The recommended way is to use the `useBaseControlProps` hook, which takes care of generating a unique `id` for you.
     * Otherwise, if you choose to pass an explicit `id` to this prop, you are responsible for ensuring the uniqueness of the `id`.
     */
    id?: string;
    /**
     * Additional description for the control.
     *
     * It is preferable to use plain text for `help`, as it can be accessibly associated with the control using `aria-describedby`.
     * When the `help` contains links, or otherwise non-plain text content, it will be associated with the control using `aria-details`.
     */
    help?: ReactNode;
    /**
     * If this property is added, a label will be generated using label property as the content.
     */
    label?: ReactNode;
    /**
     * If true, the label will only be visible to screen readers.
     *
     * @default false
     */
    hideLabelFromVision?: boolean;
    className?: string;
    /**
     * The setting change handler.
     */
    onChange: (items: KeyValuePair[]) => void;
    /**
     * The current value.
     */
    value: KeyValuePair[];
    /**
     * The current setting object.
     */
    setting: Setting;
};
