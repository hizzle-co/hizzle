# Settings

Registered WordPress settings pages and embedded settings editors share one REST
API and React provider. The provider fetches values and fields, saves patches,
refreshes server-generated fields, and protects unsaved changes.

## Register an option

Register on every request, including REST requests. Enqueueing the page alone
cannot register its fields for subsequent API calls.

```php
use Hizzle\WordPress\ScriptManager;

ScriptManager::register_settings( 'my_options', array(
    'fields' => static function () {
        return ScriptManager::prepare_settings(
            array( 'general' => 'General' ),
            array( 'api_key' => array(
                'section' => 'general', 'el' => 'input',
                'type' => 'password', 'label' => 'API Key',
            ) )
        );
    },
    'capability' => 'manage_options',
) );
```

`fields` is a required callback that generates the current field tree. An optional
`values` callback can prepare editor values; otherwise the API calls `get_option`.
An optional `permission_callback` replaces the capability check and receives the
REST request. These checks apply to reading values, reading fields, and writing.
Only explicitly registered options are accessible. Normal WordPress option
sanitizers still run when updating the option.

## Endpoints

-   `GET /hizzlewp/v1/settings/{option}` returns saved values.
-   `GET /hizzlewp/v1/settings/{option}/fields` returns freshly generated fields.
-   `POST` or `PUT /hizzlewp/v1/settings/{option}` merges a JSON object of changed
    values into the current option. Nested objects merge; lists replace, including
    an empty list. An unchanged sanitized update succeeds. Database failures return
    an error rather than a success response.

All three accept `?hizzlewp_field=path.to.field`. A field selector chooses part of
**the field tree**, rather than creating a section prefix in the saved option.
For example, Noptin can select
`integrations.main.settings_section_google_sheets` while its values remain
`google_sheets_client_id` and `google_sheets_client_secret`.

Full structural paths also work, for example
`integrations.sub_sections.main.settings.settings_section_google_sheets.settings.google_sheets_client_id`.
Nested `children` maps and field keys containing dots are supported. Values for
an individual field with a dotted key use that nested option-value path.
Repeater child selectors can inspect field definitions, but do not identify a
saved row. Select the repeater field itself when reading or updating its values.

A scoped values request returns only existing values for the selected fields.
A scoped update rejects keys outside the selected writable fields, including
read-only fields and nested siblings. Send normal value keys in the JSON body:

```json
{ "google_sheets_client_id": "new-client-id" }
```

Unknown options or fields return 404; malformed selectors and invalid updates
return 400. The WordPress REST nonce/authentication mechanism applies as usual.

## React provider

```tsx
import { SettingsList, SettingsProvider, useSettings } from '@hizzlewp/settings';
import { Button, Notice, Spinner } from '@wordpress/components';

function Fields() {
    const { fields, save, reload, isFetching, isSaving, hasPendingChanges, error } = useSettings();
    if (isFetching && !Object.keys(fields).length) return <Spinner />;
    return <>
        {error && <Notice status="error">{error}<Button onClick={reload}>Retry</Button></Notice>}
        <SettingsList settings={fields} />
        <Button disabled={isSaving || !hasPendingChanges} onClick={() => save()}>Save Settings</Button>
    </>;
}

function GoogleSheetsSettings() {
    return <SettingsProvider option_name="noptin_options" path="integrations.main.settings_section_google_sheets">
        <Fields />
    </SettingsProvider>;
}
```

The provider accepts `option_name`, optional `path`, and `children`; consumers do
not pass initial fields, saved values, or custom persistence functions. It reads
all values for conditions referring outside the selected group, but limits field
loading and updates with the selector. Omit `path` for a complete settings page.

`useSettings()` exposes `fields`, tab-oriented `settings`, `saved`, `isFetching`,
`isSaving`, `hasPendingChanges`, `error`, `errorCode`, `setAttributes`, `reload`,
and `save`. `save()` resolves to true only after persistence and field refresh
succeed. Save failures retain edits. Refresh failures after persistence clear
the saved edits but report an error and can be retried without another write.
Hosts should use the dirty and busy states to guard their own close controls.

Defaults initialize without marking an untouched editor dirty. Repeater child
field defaults do not become unrelated top-level options. The list supports
conditional groups, integration panels and badges, and per-field error boundaries.
Integration panels can receive `initiallyOpen: true` in setup dialogs.

## Linked field actions

Declared fields with `el: 'button'` and `buttonProps.href` save pending edits before
navigation. The provider refreshes the fields and uses the clicked field's newly
generated URL, including when its original URL was empty. Stable field keys
identify the action across refreshes. A failed save, failed refresh, removed
button, or unavailable URL prevents navigation. Ordinary description/help links
retain their normal behavior.

New-tab targets and Ctrl/Meta/middle clicks reserve a window during the click so
browser popup blockers do not prevent navigation after the asynchronous save.
The opener is removed, and failure closes the reserved window.

Buttons with the `oauth-connect` CSS class (on `buttonProps.className`,
`className`, or `class`) always open a separate authorization window. Pending
changes are saved and the refreshed URL is used before authorization starts.
Popup blocking displays an error without saving or leaving the settings screen.

After successfully processing the OAuth callback, redirect the authorization
window to a settings page on the original screen's origin that loads
`hizzlewp-settings`, with `hizzlewp_oauth_complete=1`. The completed page sends a
same-origin BroadcastChannel notification for that authorization window and
closes itself. The original provider reloads saved values and field definitions.
Notifications are matched to the reserved window using a session-storage token;
no credentials are sent through the channel. The marker belongs on the final
redirect, after tokens are saved, rather than on the provider's registered OAuth
callback URL. Closing the window manually also reloads settings; it does not
imply that authorization succeeded. Edits made while the window is open are
preserved. Window polling stops when the provider unmounts.

## Full settings page

Enqueue `hizzlewp-settings`, render `<div id="hizzlewp-settings__app"></div>`, and
localize `hizzleWPSettings.data` with `option_name` and optional layout/brand props.
The page bootstraps its fetching provider and refreshes fields after every save.
Open integration panels remain open during saving and refreshes.

Browser consumers use the `hizzlewp-settings` script handle and
`window.hizzlewp.settings`. Package exports include `SettingsList`,
`SettingsProvider`, `useSettings`, and their public TypeScript types.

<!-- START TOKEN(Autogenerated API docs) -->

### ISettingsContextProps

Undocumented declaration.

### SettingsList

Undocumented declaration.

### SettingsProvider

Undocumented declaration.

### SettingsProviderProps

Undocumented declaration.

### useSettings

Undocumented declaration.


<!-- END TOKEN(Autogenerated API docs) -->
