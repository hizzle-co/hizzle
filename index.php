<?php
/*
Plugin Name: HizzleWP DEV
Plugin URI: https://hizzlewp.com/
Description: HizzleWP DEV
Version: 1.0.0
Author: picocodes
Author URI: https://github.com/picocodes/
License: GPL-3.0+
License URI: http://www.gnu.org/licenses/gpl-2.0.txt
Text Domain: hizzlewp
Domain Path: /languages
Requires at least: 4.9
Tested up to: 6.0
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'HIZZLE_SCRIPT_MANAGER_FILE', plugin_dir_path( __FILE__ ) . 'src/ScriptManager.php' );

require_once plugin_dir_path( __FILE__ ) . 'src/ScriptManager.php';
