const storageKey = 'hizzlewp-settings-oauth-window';
export const oauthChannelName = 'hizzlewp-settings-oauth';

/** The blank authorization window inherits this tab's session storage. */
export const prepareOAuthWindow = () => {
    const token = `${ Date.now() }-${ Math.random().toString( 36 ).slice( 2 ) }`;
    try { sessionStorage.setItem( storageKey, token ); } catch { /* Closure polling remains available. */ }
    return token;
};
export const clearOAuthWindow = () => {
    try { sessionStorage.removeItem( storageKey ); } catch { /* Storage may be disabled. */ }
};

/** Notify the starting tab after the server saves tokens and redirects locally. */
export const completeOAuthWindow = () => {
    if ( new URL( window.location.href ).searchParams.get( 'hizzlewp_oauth_complete' ) !== '1' ) return;
    try {
        const token = sessionStorage.getItem( storageKey );
        if ( !token || typeof BroadcastChannel === 'undefined' ) return;
        const channel = new BroadcastChannel( oauthChannelName );
        channel.postMessage( { type: 'complete', token } );
        channel.close();
        clearOAuthWindow();
        window.close();
    } catch { /* The full settings page is the fallback if communication is unavailable. */ }
};
