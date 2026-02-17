/**
 * External dependencies
 */
import { useState, useEffect } from 'react';

/**
 * WordPress dependencies
 */
import {
    Button,
    Spinner,
    Notice,
    __experimentalText as Text,
    __experimentalInputControl as InputControl,
    __experimentalHStack as HStack,
    __experimentalVStack as VStack,
    __experimentalItemGroup as ItemGroup,
    __experimentalItem as Item,
    Modal,
    Icon,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { format, getSettings } from '@wordpress/date';

export interface LicenseDetails {
    /**
     * The full license key.
     */
    license_key: string;

    /**
     * The license key as asterisks, partially masked for security.
     */
    license_key_ast: string;

    /**
     * The product ID for this license key.
     */
    product_id: number | null;

    /**
     * The product name for this license key.
     */
    product_name: string | null;

    /**
     * The product SKU for this license key.
     */
    product_sku: string | null;

    /**
     * The user ID associated with this license key.
     */
    user_id: number;

    /**
     * The email address associated with this license key.
     */
    email: string;

    /**
     * The first name associated with this license key.
     */
    first_name: string;

    /**
     * The last name associated with this license key.
     */
    last_name: string;

    /**
     * The display name associated with this license key.
     */
    display_name: string;

    /**
     * Whether the license key is currently active.
     */
    is_active: boolean;

    /**
     * Whether the license key has expired.
     */
    has_expired: boolean;

    /**
     * The date the license key was created.
     */
    date_created: string;

    /**
     * The date the license key expires. Empty for lifetime licenses.
     */
    date_expires: string;

    /**
     * The maximum number of activations allowed for this license key.
     */
    max_activations: number;

    /**
     * A record of activations with the site as the key and the activation date as the value.
     */
    activations: Record<string, string>;

    /**
     * A string representation of the activations, e.g., "7 / 10".
     */
    the_activations: string;

    /**
     * Whether the license key is currently active on the site.
     */
    is_active_on_site: boolean;
}

export interface LicenseError {
    code: string;
    message: string;
    data?: {
        status?: number;
    }
}

export type LicenseResponse =
    | { ok: true; license: LicenseDetails }
    | { ok: false; error: LicenseError };

// Cache to avoid redundant API calls for the same license key during a session, e.g, when component re-renders.
const LICENSE_DETAILS: Record<string, LicenseResponse> = {};

const getLicenseCheckURL = ( hostName: string, licenseKey: string, homeURL: string, plugin?: string ) => {
    return addQueryArgs(
        `https://${ hostName }/wp-json/hizzle/v1/licenses/${ licenseKey }/`,
        {
            website: homeURL,
            downloads: plugin || '',
        }
    );
}

export const getLicenseKeyDetails = async ( hostName: string, licenseKey: string, homeURL: string, plugin?: string ) => {
    const url = getLicenseCheckURL( hostName, licenseKey, homeURL, plugin );

    if ( LICENSE_DETAILS[ url ] ) {
        return LICENSE_DETAILS[ url ];
    }

    try {
        const response = await fetch( url, {
            headers: {
                Accept: 'application/json',
            },
        } );

        const json = await response.json();

        if ( !response.ok ) {
            console.error( 'License validation failed:', json );

            const result: LicenseResponse = {
                ok: false,
                error: json as LicenseError,
            };
            LICENSE_DETAILS[ url ] = result;
            return result;
        }

        const result: LicenseResponse = {
            ok: true,
            license: ( json as { license: LicenseDetails } ).license,
        };

        LICENSE_DETAILS[ url ] = result;
        return result;
    } catch ( e ) {
        const result: LicenseResponse = {
            ok: false,
            error: {
                code: 'network_error',
                message: 'Failed to validate license key',
                data: { status: 0 },
            },
        };

        // Don't cache this.
        // LICENSE_DETAILS[ url ] = result;
        return result;
    }
};

export const activateLicenseKey = async ( prefix: string, hostName: string, licenseKey: string, homeURL: string, plugin?: string ) => {
    // Activate via API.
    const data = await apiFetch<{ message: string; success: true; data: any; }>( {
        path: `/${ prefix }/v1/license/activate`,
        method: 'POST',
        data: {
            license_key: licenseKey,
            plugin: plugin || '',
        },
    } );

    // Delete checks cache.
    const url = getLicenseCheckURL( hostName, licenseKey, homeURL, plugin );
    delete LICENSE_DETAILS[ url ];

    return data as {
        message: string;
        success: true;
        data: any;
    }
};

export const deactivateLicenseKey = async ( prefix: string, hostName: string, licenseKey: string, homeURL: string, plugin?: string ) => {
    // Deactivate via API.
    const data = await apiFetch<{ message: string; success: true; }>( {
        path: addQueryArgs( `/${ prefix }/v1/license/deactivate`, {
            plugin: plugin || '',
        } ),
        method: 'DELETE',
    } );

    // Delete checks cache.
    const url = getLicenseCheckURL( hostName, licenseKey, homeURL, plugin );
    delete LICENSE_DETAILS[ url ];

    return data;
};

const LicenseExpiry = ( { license }: { license: LicenseDetails } ) => {

    if ( !license.is_active || license.has_expired ) {
        return (
            <Text color="#a00" weight={ 600 }>
                <strong>Inactive :(</strong>
            </Text>
        );
    }

    if ( !license.date_expires ) {
        return (
            <Text color="#008000" weight={ 600 }>
                <strong>Lifetime License</strong>
            </Text>
        );
    }

    return (
        <span>
            <Text weight={ 600 }>
                Expires on:
            </Text>
            &nbsp;
            <Text variant="muted">
                { license.date_expires ?
                    format( getSettings().formats.date || 'Y-m-d', license.date_expires ) :
                    <>&ndash;</>
                }
            </Text>
        </span>
    )
}

interface LicenseActivationProps {
    currentLicenseKey: string;
    homeURL: string;
    prefix?: string;
    hostName: string;
    plugin?: string;
    help?: React.ReactNode;
    label?: React.ReactNode;
    purchaseURL?: string;
}

export const LicenseActivation = ( {
    currentLicenseKey,
    homeURL,
    prefix,
    hostName,
    plugin,
    help,
    label,
    purchaseURL,
}: LicenseActivationProps ) => {
    // License key state management
    const [ licenseKey, setLicenseKey ] = useState<string | undefined>( currentLicenseKey );
    const [ checkedLicenseKey, setCheckedLicenseKey ] = useState<string | undefined>( currentLicenseKey );
    const [ isCheckingLicenseKey, setIsCheckingLicenseKey ] = useState<boolean>( false );
    const [ licenseInfo, setLicenseInfo ] = useState<LicenseDetails | null>( null );

    // Activation state.
    const [ isActivating, setIsActivating ] = useState<boolean>( false );
    const [ isDeactivating, setIsDeactivating ] = useState<boolean>( false );
    const [ isOpen, setIsOpen ] = useState<boolean>( false );
    const [ error, setError ] = useState<string | null>( null );
    const [ successMessage, setSuccessMessage ] = useState<string | null>( null );

    // Set default prefix if not provided
    if ( !prefix ) {
        prefix = hostName.replace( /\./g, '_' );

        // Backwards compatibility
        if ( prefix === 'my_noptin_com' ) {
            prefix = 'noptin';
        }
    }

    // Checks the license key remotely.
    useEffect( () => {
        let isMounted = true;

        if ( checkedLicenseKey ) {
            setIsCheckingLicenseKey( true );
            getLicenseKeyDetails(
                hostName,
                checkedLicenseKey || '',
                homeURL,
                plugin
            )
                .then( ( response ) => {
                    if ( !isMounted ) return;

                    if ( response.ok ) {
                        setLicenseInfo( response.license );
                    } else {
                        setError( response.error.message || 'Failed to fetch license details' );
                    }
                } )
                .catch( ( e ) => {
                    console.error( e );
                    if ( isMounted ) {
                        setError( e?.message || 'Failed to check license key' );
                    }
                } ).finally( () => {
                    if ( isMounted ) {
                        setIsCheckingLicenseKey( false );
                    }
                } );
        }

        return () => {
            isMounted = false;
        };
    }, [ homeURL, plugin, hostName, checkedLicenseKey ] );

    /**
     * Reset error when license key changes.
     */
    useEffect( () => {
        setError( null );
        setSuccessMessage( null );
    }, [ licenseKey ] );

    /**
     * Saves the license key.
     */
    const onActivateLicenseKey = async () => {
        try {
            // Show loading state for activation process.
            setIsActivating( true );
            setError( null );
            setSuccessMessage( null );

            const result = await activateLicenseKey(
                prefix,
                hostName,
                licenseKey || '',
                homeURL,
                plugin
            );

            setSuccessMessage( result.message || 'License activated successfully.' );

            // Update the checked license key to trigger re-fetching license details and showing the license info.
            setCheckedLicenseKey( licenseKey );
        } catch ( e: any ) {
            setError( e?.message || 'Failed to activate license key' );
        } finally {
            setIsActivating( false );
        }
    };

    const onDeactivateLicenseKey = async () => {
        try {
            // Show loading state for deactivation process.
            setIsDeactivating( true );
            setError( null );
            setSuccessMessage( null );

            const result = await deactivateLicenseKey(
                prefix,
                hostName,
                licenseKey || '',
                homeURL,
                plugin
            );

            setSuccessMessage( result.message || 'License deactivated successfully.' );
            setCheckedLicenseKey( '' );
            setLicenseKey( '' );
            setLicenseInfo( null );
        } catch ( e: any ) {
            setError( e?.message || 'Failed to deactivate license key' );
        } finally {
            setIsDeactivating( false );
        }
    };

    const onRemoveSuccessMessage = () => {
        setSuccessMessage( null );
    }

    // If we don't have a license key yet, or we're in the process of activating, or there's an error, show the input form.
    if ( !checkedLicenseKey || isActivating || error ) {
        return (
            <VStack spacing={ 4 }>
                {/** Shown on successful deactivation */ }
                { successMessage && (
                    <Notice status="success" isDismissible={ true } onRemove={ onRemoveSuccessMessage }>
                        { successMessage }
                    </Notice>
                ) }

                <InputControl
                    type="text"
                    value={ licenseKey || '' }
                    onChange={ setLicenseKey }
                    label={ label }
                    placeholder={ `Enter your ${ hostName } license key to activate` }
                    suffix={ (
                        <div style={ { paddingRight: 2 } }>
                            <Button
                                variant="primary"
                                isBusy={ isActivating }
                                disabled={ isActivating || !licenseKey }
                                onClick={ onActivateLicenseKey }
                            >
                                { isActivating ? 'Activating...' : 'Activate' }
                            </Button>
                        </div>
                    ) }
                    help={ help }
                    disabled={ isActivating }
                    __next40pxDefaultSize
                />
                { error && (
                    <Notice status="error" isDismissible={ false }>
                        { error }
                    </Notice>
                ) }
            </VStack>
        );
    }

    return (
        <VStack>
            {/** Shown on successful activation */ }
            { successMessage && (
                <Notice status="success" isDismissible={ true } onRemove={ onRemoveSuccessMessage }>
                    { successMessage }
                </Notice>
            ) }

            { ( isCheckingLicenseKey || !licenseInfo ) ? (
                <HStack alignment="flex-start" justify="flex-start">
                    <Spinner />
                    <Text>Fetching license info...</Text>
                </HStack>
            ) : (
                <>
                    <ItemGroup style={ { maxWidth: 360 } } isBordered isSeparated>
                        { licenseInfo.product_name && (
                            <Item>
                                <Text weight={ 600 }>
                                    Plan:
                                </Text>
                                &nbsp;
                                <Text variant="muted">
                                    { licenseInfo.product_name || 'Paid Plan' }
                                </Text>
                            </Item>
                        ) }
                        <Item>
                            <Text weight={ 600 }>
                                Email:
                            </Text>
                            &nbsp;
                            <Text variant="muted">
                                { licenseInfo.email || <>&ndash;</> }
                            </Text>
                        </Item>
                        <Item>
                            <Text weight={ 600 }>
                                License Key:
                            </Text>
                            &nbsp;
                            <Text color="#008000">
                                { licenseInfo.license_key_ast || <>&ndash;</> }
                            </Text>
                        </Item>
                        <Item>
                            <Text weight={ 600 }>
                                Active on this site:
                            </Text>
                            &nbsp;
                            <Icon
                                icon={ licenseInfo.is_active_on_site ? 'yes-alt' : 'no-alt' }
                                style={ { color: licenseInfo.is_active_on_site ? '#008000' : '#a00' } }
                            />
                        </Item>
                        { ( licenseInfo.is_active && !licenseInfo.has_expired ) && (
                            <Item>
                                <Text weight={ 600 }>
                                    Activations:
                                </Text>
                                &nbsp;
                                <Text variant="muted">
                                    { licenseInfo.the_activations }
                                </Text>
                            </Item>
                        ) }
                        <Item>
                            <Text weight={ 600 }>
                                Created:
                            </Text>
                            &nbsp;
                            <Text variant="muted">
                                { licenseInfo.date_created ?
                                    format( getSettings().formats.date || 'Y-m-d', licenseInfo.date_created ) :
                                    <>&ndash;</>
                                }
                            </Text>
                        </Item>
                        <Item>
                            <LicenseExpiry license={ licenseInfo } />
                        </Item>
                        <Item onClick={ () => setIsOpen( true ) }>
                            <Text color="#a00">
                                Deactivate
                            </Text>
                        </Item>
                    </ItemGroup>
                    { ( !licenseInfo.is_active || licenseInfo.has_expired ) && (
                        <div>
                            <Text color="#a00">
                                This license key is inactive. Please purchase a new license key to receive updates and support.
                            </Text>
                            &nbsp;
                            { purchaseURL && (
                                <Button href={ purchaseURL } target="_blank" variant="link">
                                    View Pricing
                                </Button>
                            ) }
                        </div>
                    ) }
                    { isOpen && (
                        <Modal
                            title="Deactivate License"
                            onRequestClose={ () => setIsOpen( false ) }
                        >
                            <VStack spacing={ 5 }>
                                <Text>
                                    Are you sure you want to deactivate this license key?
                                </Text>
                                <HStack justify="flex-start">
                                    <Button
                                        variant="primary"
                                        onClick={ () => setIsOpen( false ) }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        isBusy={ isDeactivating }
                                        disabled={ isDeactivating }
                                        onClick={ onDeactivateLicenseKey }
                                        isDestructive
                                    >
                                        { isDeactivating ? 'Deactivating...' : 'Yes, deactivate' }
                                    </Button>
                                </HStack>
                            </VStack>
                        </Modal>
                    ) }
                </>
            ) }
        </VStack>
    );
};
