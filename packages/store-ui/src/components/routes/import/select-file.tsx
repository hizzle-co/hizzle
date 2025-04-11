/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
    FormFileUpload,
    Icon,
    Tip,
    Button,
    __experimentalText as Text,
    __experimentalVStack as VStack,
} from "@wordpress/components";

/**
 * Displays the file input.
 *
 * @param {Object} props
 */
export const SelectFile = ( { onUpload } ) => {

    return (
        <VStack spacing={ 5 }>

            <Text weight={ 600 } as="h3">
                { __( 'This tool allows you to import existing records from a CSV file.', 'newsletter-optin-box' ) }
            </Text>

            <FormFileUpload
                accept="text/csv"
                onChange={ ( event ) => onUpload( event?.currentTarget?.files?.[ 0 ] ) }
                className="hizzlewp-block-button is-primary"
            >
                <Icon icon="cloud-upload" />
                { __( 'Select a CSV file', 'newsletter-optin-box' ) }
            </FormFileUpload>

            <Tip>
                { __( 'The first row of the CSV file should contain the field names/headers.', 'newsletter-optin-box' ) }
                <br />
                { __( ' Have a different file type?', 'newsletter-optin-box' ) }&nbsp;
                <Button
                    variant="link"
                    href="https://convertio.co/csv-converter/"
                    target="_blank"
                    text={ __( 'Convert it to CSV', 'newsletter-optin-box' ) }
                />
            </Tip>
        </VStack>
    );
}
