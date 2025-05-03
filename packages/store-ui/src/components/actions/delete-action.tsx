/**
 * External dependencies
 */
import React, { useState } from "react";

/**
 * WordPress dependencies
 */
import {
    Button,
    Modal,
} from "@wordpress/components";
import { trash } from "@wordpress/icons";

/**
 * Local dependencies
 */
import { DeleteModal } from "../routes/view-record/overview/action-buttons/delete";

/**
 * Displays a delete action.
 */
export const DeleteAction = ( { as = Button, onClick = () => {}, ...props } ) => {

    // Prepare the state.
    const [ isModalOpen, setIsModalOpen ] = useState( false );

    const Component = as || Button;
    const onClose = () => {
        setIsModalOpen( false );
        onClick?.();
    }

    return (
        <>
            <Component isDestructive onClick={ () => setIsModalOpen( true ) } icon={ trash } { ...props } />
            { isModalOpen && (
                <Modal
                    title={ props.label || props.text }
                    onRequestClose={ onClose }
                >
                    <DeleteModal
                        { ...props }
                        closeModal={ onClose }
                    />
                </Modal>
            ) }
        </>
    );
}
