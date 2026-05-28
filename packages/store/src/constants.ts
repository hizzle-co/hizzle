/**
 * The reducer key used in store registration.
 * This is defined in a separate file to avoid cycle-dependency
 *
 */
export const STORE_NAME = 'hizzle/store';

/**
 * The default entity key.
 */
export const DEFAULT_ENTITY_KEY = 'id';

/**
 * The default context.
 */
export const DEFAULT_CONTEXT = 'view';

/**
 * The default per page.
 */
export const DEFAULT_PER_PAGE = 25;

/**
 * The default page.
 */
export const DEFAULT_PAGE = 1;

/**
 * The key used to identify a new (unsaved) collection record in the store.
 * Consumers can use this key (or any non-numeric string) to manage draft
 * records before they are saved to the server.
 *
 * @example
 * ```js
 * import { useCollectionRecord, NEW_RECORD_KEY } from '@hizzlewp/store';
 *
 * function CreateSubscriber() {
 *   const { editedRecord, edit, save, isSaving } =
 *     useCollectionRecord( 'noptin', 'subscribers', NEW_RECORD_KEY );
 *   // ...
 * }
 * ```
 */
export const NEW_RECORD_KEY = 'new';
