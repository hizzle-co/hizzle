/**
 * External dependencies.
 */
import React, { useMemo, useEffect } from 'react';

/**
 * WordPress dependencies
 */
import {
	__experimentalUseNavigator as useNavigator,
	NavigableMenu,
	__experimentalSurface as Surface,
	__experimentalVStack as VStack,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useViewportMatch } from '@wordpress/compose';

/**
 * HizzleWP dependencies.
 */
import { Setting, ErrorBoundary } from '@hizzlewp/components';
import { usePath, updatePath } from '@hizzlewp/history';

/**
 * Local dependencies
 */
import { useSettings, ITab } from './settings-provider';
import { IntegrationSection } from './integration-section';
import { SettingsGroup } from './settings-group';

/**
 * Displays the current settings section.
 */
export const Section = () => {

	// Whether we are on a small screen.
	const isSmallScreen = useViewportMatch( 'small', '<' );

	// The available setting tabs.
	const { settings: tabs } = useSettings();

	// The current settings params.
	const { params, location, goTo } = useNavigator();

	// Prepare the path.
	const path = usePath();

	// Listen to hizzlewp_path query parameter changes in the URL
	useEffect( () => {
		if ( path !== location.path ) {
			goTo( path );
		}
	}, [ path, location.path ] );

	// Prepare the current tab and section.
	const { tab, section } = useMemo( () => {

		// If no tab is provided, use the first tab.
		if ( !params.tab ) {
			return {
				tab: tabs[ 0 ].name,
				section: tabs[ 0 ].sections[ 0 ].name,
			};
		}

		// Get the current tab.
		const tab = tabs.find( ( tab ) => tab.name === params.tab );

		// If no tab is found, use the first tab.
		if ( !tab ) {
			return {
				tab: tabs[ 0 ].name,
				section: tabs[ 0 ].sections[ 0 ].name,
			};
		}

		// If no section is provided, use the first section.
		if ( !params.section ) {
			return {
				tab: tab.name,
				section: tab.sections[ 0 ].name,
			};
		}

		const section = tab.sections.find( ( section ) => section.name === params.section );

		// If no section is found, use the first section.
		if ( !section ) {
			return {
				tab: tab.name,
				section: tab.sections[ 0 ].name,
			};
		}

		return {
			tab: tab.name,
			section: section.name,
		};
	}, [ params.tab, params.section, tabs ] );

	const currentTab = useMemo( () => {
		return tabs.find( ( _tab ) => _tab.name === tab );
	}, [ tab, tabs ] );

	return (
		<div>
			<VStack
				spacing={ 4 }
				data-current-path={ location.path }
				key={ path }
				style={ {
					maxWidth: 620,
					padding: 20,
				} }
			>
				{ 1 < tabs.length && (
					<Surface
						className="hizzlewp-settings__tabs"
						orientation={ isSmallScreen ? 'vertical' : 'horizontal' }
						onNavigate={ ( index ) => updatePath( tabs[ index ].path ) }
						as={ NavigableMenu }
						borderBottom
						borderTop
						borderLeft
						borderRight
					>
						{ tabs.map( ( _tab ) => (
							<Button
								key={ _tab.path }
								onClick={ () => updatePath( _tab.path ) }
								className={ `components-tab-panel__tabs-item ${ tab === _tab.name ? 'is-active' : '' }` }
								aria-selected={ tab === _tab.name }
							>
								{ _tab.title }
							</Button>
						) ) }
					</Surface>
				) }

				{ currentTab && (
					<SectionsList
						{ ...currentTab }
						currentTab={ tab }
						currentSection={ section }
					/>
				) }
			</VStack>
		</div>
	);
}

interface SectionsListProps extends ITab {
	currentTab: string;
	currentSection: string;
}

const SectionsList = ( { name, sections, currentTab, currentSection }: SectionsListProps ) => {

	const { location } = useNavigator();

	const section = useMemo( () => {
		return sections.find( ( section ) => section.name === currentSection );
	}, [ currentTab, currentSection ] );

	return (
		<ErrorBoundary>
			{ 1 < sections.length && (
				<NavigableMenu
					className={ `hizzlewp-settings__sections-menu hizzlewp-settings__sections-menu--${ name }` }
					orientation="horizontal"
					onNavigate={ ( index ) => updatePath( sections[ index ].path ) }
				>
					{ sections.map( ( section ) => (
						<Button
							key={ section.path }
							onClick={ () => updatePath( section.path ) }
							variant="tertiary"
							isPressed={ location.path === section.path }
						>
							{ section.title }
						</Button>
					) ) }
				</NavigableMenu>
			) }

			{ section && (
				<SettingsList settings={ section.settings } />
			) }
		</ErrorBoundary>
	);
}

export const SettingsList = ( { settings } ) => {

	return (
		<VStack spacing={ 4 }>
			{ Object.keys( settings ).map( ( setting ) => (
				<ErrorBoundary key={ setting }>
					<SingleSetting
						settingKey={ setting }
						setting={ settings[ setting ] }
					/>
				</ErrorBoundary>
			) ) }
		</VStack>
	);
}

const SingleSetting = ( { setting, settingKey } ) => {
	const { saved, setAttributes } = useSettings();

	if ( 'integration_panel' === setting.el ) {
		return <IntegrationSection { ...setting } />;
	}

	if ( 'settings_group' === setting.el ) {
		return <SettingsGroup { ...setting } />;
	}

	return (
		<Setting
			settingKey={ settingKey }
			setting={ setting }
			saved={ saved }
			setAttributes={ setAttributes }
		/>
	);
}
