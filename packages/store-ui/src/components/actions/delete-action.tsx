/**
 * External dependencies
 */
import React, { useState } from "react";
import type { ElementType, ReactElement } from 'react';

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

type DeleteActionProps = {
    namespace: string;
    collection: string;
    id: string;
    onClick?: () => void;
    as?: ElementType;
    [ key: string ]: any;
};

/**
 * Displays a delete action.
 */
export const DeleteAction = ( { as = Button, onClick = () => {}, ...props }: DeleteActionProps ): ReactElement => {

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
