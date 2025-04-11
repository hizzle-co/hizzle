/**
 * External dependencies
 */
import React from "react";

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
    Slot,
    __experimentalHStack as HStack,
    __experimentalVStack as VStack,
} from "@wordpress/components";
import { CardBody } from "@wordpress/components";

/**
 * HizzleWP dependencies
 */
import { useProvidedCollectionConfig, useProvidedRecordId } from '@hizzlewp/store';

/**
 * Internal dependencies
 */
import { SectionWithErrorBoundary } from '../../create-record';
import { EditRecord } from "./edit-record";
import { Overview } from "./overview";

/**
 * Allows the user to create new records.
 */
export const RecordOverview: React.FC = () => {

    // Prepare the state.
    // If we're here, we already have a record ID and the record is already loaded.
    const recordId = useProvidedRecordId();
    const { config: { namespace, collection, labels } } = useProvidedCollectionConfig();

    // Display the add record form.
    return (
        <CardBody>
            <HStack alignment="flex-start" justify="space-between" wrap>
                <SectionWithErrorBoundary>
                    <EditRecord />
                </SectionWithErrorBoundary>

                <SectionWithErrorBoundary>
                    <VStack spacing={ 5 }>
                        <Slot name={ `${ namespace }_${ collection }_record_overview_upsell` } />
                        <Overview namespace={ namespace } collection={ collection } id={ recordId } />
                    </VStack>
                </SectionWithErrorBoundary>
            </HStack>
        </CardBody>
    );
}
