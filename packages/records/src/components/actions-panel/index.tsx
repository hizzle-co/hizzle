/**
 * WordPress dependencies
 */
import { __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { Config } from './config';
import { RecordsSearch } from './search';

/**
 * Actions panel component
 */
export const ActionsPanel = ( { bulkActions = null, searchLabel = undefined, filtersButton = null }: { bulkActions?: React.ReactNode, searchLabel?: string, filtersButton?: React.ReactNode } ) => {
	const showingFilters = searchLabel || filtersButton;
	return (
		<HStack
			alignment="top"
			justify="space-between"
			className="hizzlewp-records__view-actions"
			spacing={ 1 }
			wrap
		>

			{ showingFilters && (
				<HStack
					justify="start"
					expanded={ false }
					className="hizzlewp-records__search"
				>
					{ searchLabel && <RecordsSearch label={ searchLabel } /> }
					{ filtersButton }
				</HStack>
			) }

			<HStack
				spacing={ 1 }
				expanded={ !showingFilters }
				style={ { flexShrink: 0 } }
				justify="end"
			>
				{ bulkActions }
				<Config />
			</HStack>
		</HStack>
	);
};
