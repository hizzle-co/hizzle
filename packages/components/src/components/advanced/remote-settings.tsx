/**
 * External dependencies
 */
import React, { useState, useEffect, useMemo } from 'react';

/**
 * Wordpress dependancies.
 */
import { Spinner, Notice } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Local dependencies.
 */
import { Setting, type SettingProps } from '../setting';
import { getNestedValue } from '../utils';

/**
 * Displays remote settings.
 *
 */
export const RemoteSettings: React.FC<SettingProps> = ({
	setting,
	saved,
	settingKey,
	...extra
}) => {
	// State for tracking loading status
	const [loading, setLoading] = useState(false);

	// State for storing fetched settings
	const [settings, setSettings] = useState({});

	// State for storing any error messages
	const [error, setError] = useState(null);

	// Construct the remote URL with query parameters
	const remoteURL = useMemo(() => {
		// If no rest_route is provided, return empty string
		if (!setting.rest_route) {
			return '';
		}

		// Process rest_args to handle special values that start with '!'
		const args = Object.entries(setting.rest_args || {}).reduce(
			(acc, [key, value]) => {
				acc[key] =
					'string' === typeof value && value.startsWith('!')
						? getNestedValue(saved, value.slice(1))
						: value;
				return acc;
			},
			{}
		);

		// Combine the route with processed arguments
		return addQueryArgs(setting.rest_route, args);
	}, [setting.rest_route, setting.rest_args, saved]);

	// Effect to fetch settings from the remote URL
	useEffect(() => {
		// Skip if no URL is available
		if (!remoteURL) {
			return;
		}

		// Set loading state and clear any previous errors
		setLoading(true);
		setError(null);

		// Fetch data from the WordPress REST API
		apiFetch({
			path: remoteURL,
		})
			.then((data) => {
				// Store the fetched settings
				setSettings(data as Record<string, unknown>);
			})
			.catch((error) => {
				// Handle errors by clearing settings and displaying error message
				setSettings({});
				setError(
					error.message ||
						'An error occurred while fetching settings.'
				);
				console.error(error);
			})
			.finally(() => {
				// Always mark loading as complete when done
				setLoading(false);
			});
	}, [remoteURL]);

	// If no URL is available, don't render anything
	if (!remoteURL) {
		return null;
	}

	// Show loading spinner while fetching data
	if (loading) {
		return <Spinner />;
	}

	// Show error notice if an error occurred
	if (error) {
		return <Notice status="error">{error}</Notice>;
	}

	// Render each setting from the fetched data
	return (
		<>
			{Object.keys(settings).map((settingKey) => (
				<Setting
					key={settingKey}
					settingKey={settingKey}
					saved={saved}
					setting={settings[settingKey]}
					{...extra}
				/>
			))}
		</>
	);
};
