import { __ } from '@wordpress/i18n';
import { Tip, Modal, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import type { FC, FocusEventHandler } from 'react';
type MergeTag = import( './types' ).MergeTag;
type MergeTagsProps = import( './types' ).MergeTagsProps;
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
 * Calculates the value to show for this merge tag.
 */
const getMergeTagValue = (mergeTag: MergeTag) => {

    // If we have an example, use it.
    if ( mergeTag.example ) {
        return mergeTag.example;
    }

    let defaultValue = "default value";

    if ( mergeTag.replacement ) {
        defaultValue = mergeTag.replacement;
    }

    if ( mergeTag.default ) {
        defaultValue = mergeTag.default;
    }

    if ( ! defaultValue ) {
        return `${mergeTag.smart_tag}`;
    }

    return `${mergeTag.smart_tag} default="${defaultValue}"`;

};

/**
 * Displays a single merge tag.
 *
 */
export const MergeTag: FC<MergeTagProps> = ({mergeTag, onMergeTagClick}) => {

    // The merge tag value to use.
    const value = `[[${getMergeTagValue( mergeTag )}]]`;

    // Only show the description if it's different from the label.
    const showDescription = mergeTag.description && mergeTag.description !== mergeTag.label;

    // Selects the merge tag.
    const select: FocusEventHandler<HTMLInputElement> = (e) => {

        // Select.
        e.target.select();

    };

    return (
        <tr className="hizzle-merge-tag">
            <td>
                <label>
                    <span className="hizzle-merge-tag-label">{mergeTag.label}</span>
                    <input
                        type="text"
                        className="widefat"
                        value={value}
                        onFocus={select}
                        onClick={ () => onMergeTagClick && onMergeTagClick( value ) }
                        readOnly
                    />
                </label>
                {showDescription && <p className="description hizzle-mb0">{mergeTag.description}</p>}
            </td>
        </tr>
    );
};

/**
 * Displays a list of available merge tags.
 *
 */
export const MergeTags: FC<MergeTagsProps> = ({availableSmartTags, onMergeTagClick}) => {

    return (
        <div className="hizzle-merge-tags-wrapper">
            <table className="widefat striped">
                <tbody>
                    {availableSmartTags.map((mergeTag) => (
                        <MergeTag key={mergeTag.smart_tag} mergeTag={mergeTag} onMergeTagClick={onMergeTagClick} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

interface MergeTagsModalProps extends MergeTagsProps {

    /**
     * Whether the modal is open.
     */
    isOpen: boolean;

    /**
     * The function to close the modal.
     */
    closeModal: () => void;
};

/**
 * The merge tags modal.
 *
 */
export const MergeTagsModal: FC<MergeTagsModalProps>  = ({isOpen, closeModal, availableSmartTags, onMergeTagClick}) => {

    return (
        <>
            { isOpen && (
                <Modal title={__( 'Smart Tags', 'hizzlewp' )} onRequestClose={ closeModal }>
                    <div className="hizzle-component__field-lg hizzle-component__field-hizzle_description">
                        <Tip>
                            {__( 'You can use the following smart tags to generate dynamic values.', 'hizzlewp' )}
                        </Tip>
                    </div>
                    <MergeTags availableSmartTags={availableSmartTags} onMergeTagClick={onMergeTagClick} />
                </Modal>
            ) }
        </>
    );
};

/**
 * The merge tags modal button.
 *
 */
export const MergeTagsModalButton: FC<MergeTagsProps> = ({ availableSmartTags, onMergeTagClick, ...props}) => {

    // Are we showing the modal?
	const [showModal, setShowModal] = useState(false);

    if ( ! Array.isArray(availableSmartTags) || availableSmartTags.length === 0 ) {
        return null;
    }

    return (
        <>

			<Button
				icon="shortcode"
				variant="tertiary"
				isPressed={showModal}
				label={__( 'Insert merge tag', 'hizzlewp' )}
				onClick={() => {
					setShowModal(true);
				}}
				showTooltip
                {...props}
			/>

			<MergeTagsModal
				isOpen={showModal}
				closeModal={ () => setShowModal(false) }
				availableSmartTags={availableSmartTags}
				onMergeTagClick={(mergeTag: string) => {
                    if ( onMergeTagClick ) {
                        onMergeTagClick(mergeTag);
                        setShowModal( false );
                    }
                }}
			/>
		</>
    );
};
