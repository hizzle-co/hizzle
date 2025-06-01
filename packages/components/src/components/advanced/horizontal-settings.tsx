/**
 * External dependencies
 */
import React from 'react';

/**
 * Wordpress dependancies.
 */
import { __experimentalHStack as WPHStack } from '@wordpress/components';

/**
 * Local dependencies.
 */
import { Setting, type SettingProps, type ISetting } from '../setting';

type Props = SettingProps & {
	settings: Record<string, ISetting>;
}

/**
 * Stacks settings horizontally.
 *
 */
export const HorizontalSettings: React.FC<Props> = ( {
	settings,
	saved,
	settingKey,
	setting,
	...extra
} ) => {

	// Render each setting from the fetched data
	return (
		<WPHStack alignment="flex-start" justify="flex-start" wrap>
			{ Object.keys( settings ).map( ( settingKey ) => (
				<Setting
					key={ settingKey }
					settingKey={ settingKey }
					saved={ saved }
					setting={ settings[ settingKey ] }
					{ ...extra }
				/>
			) ) }
		</WPHStack>
	);
};
