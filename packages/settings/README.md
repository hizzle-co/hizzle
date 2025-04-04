# Settings UI

This package displays data provided by the `@hizzlewp/settings` package.

### Installation

```bash
npm install @hizzlewp/settings
composer require hizzlewp/store
```

### Usage

```php
use Hizzle\Store\UI\CollectionProvider;

class MyClass {
    private static $hook_suffix;

    public function __construct() {
        add_action( 'admin_menu', [ __CLASS__, 'add_admin_menu' ] );
        add_action( 'admin_enqueue_scripts', [ __CLASS__, 'enqueue_scripts' ] );
    }

    public static function add_admin_menu() {
        self::$hook_suffix = add_menu_page(
            'My Plugin',
            'My Plugin',
            'manage_options',
            'my-plugin',
            [ __CLASS__, 'render_admin_page' ]
        );
    }

    public static function render_admin_page() {
        // Check permission.
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'You do not have sufficient permissions to access this page.', 'hizzlewp' ) );
        }

        // Render the page.
        echo '<div id="hizzlewp-settings-ui"></div>';
    }

    public static function enqueue_scripts() {
        if ( self::$hook_suffix !== get_current_screen()->id ) {
            return;
        }

        wp_enqueue_script( 'hizzlewp-settings' );
    }
}
```
