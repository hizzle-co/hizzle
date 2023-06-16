import type { FC } from 'react';
import type { ConditionalLogic, MergeTagsProps, Setting } from './types';
/**
 * Conditional logic props.
 */
interface conditionalLogicProps extends MergeTagsProps {
    /**
     * The conditions change handler.
     */
    onChange: (conditionalLogic: ConditionalLogic) => void;
    /**
     * The current value.
     */
    value: ConditionalLogic;
    /**
     * The current setting object.
     */
    setting: Setting;
    /**
     * Optional class name.
     */
    className?: string;
}
/**
 * Displays the conditional logic editor.
 *
 */
declare const ConditionalLogicEditor: FC<conditionalLogicProps>;
export default ConditionalLogicEditor;
