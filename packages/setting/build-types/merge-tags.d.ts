import type { FC } from 'react';
type MergeTag = import('./types').MergeTag;
type MergeTagsProps = import('./types').MergeTagsProps;
type MergeTagProps = {
    /**
     * The merge tag object.
     */
    mergeTag: MergeTag;
    /**
     * The callback to call when a merge tag is clicked.
     */
    onMergeTagClick?: (mergeTag: string) => void;
};
/**
 * Displays a single merge tag.
 *
 */
export declare const MergeTag: FC<MergeTagProps>;
/**
 * Displays a list of available merge tags.
 *
 */
export declare const MergeTags: FC<MergeTagsProps>;
interface MergeTagsModalProps extends MergeTagsProps {
    /**
     * Whether the modal is open.
     */
    isOpen: boolean;
    /**
     * The function to close the modal.
     */
    closeModal: () => void;
}
/**
 * The merge tags modal.
 *
 */
export declare const MergeTagsModal: FC<MergeTagsModalProps>;
/**
 * The merge tags modal button.
 *
 */
export declare const MergeTagsModalButton: FC<MergeTagsProps>;
export {};
