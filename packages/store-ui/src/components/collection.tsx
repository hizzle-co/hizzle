/**
 * External dependencies
 */
import React, { useMemo } from "react";

/**
 * HizzleWP dependencies.
 */
import { ErrorBoundary } from '@hizzlewp/components';
import { Router } from '@hizzlewp/history';

/**
 * Internal dependencies.
 */
import { Main } from "./routes/main";
import { RecordsTable } from "./routes/records-table";
import { CreateRecord } from "./routes/create-record";
import { ViewRecord, RecordOverview, TabContent } from "./routes/view-record";
import { Import } from "./routes/import";

/**
 * Displays a single collection.
 *
 * @param {Object} props
 * @param {string} props.defaultNamespace The default namespace.
 * @param {string} props.defaultCollection The default collection.
 */
export const Collection = ( { defaultNamespace, defaultCollection }: { defaultNamespace: string, defaultCollection: string } ) => {

	// Define routes
	const routes = useMemo( () => {
		return [
			{
				path: '/:namespace/:collection',
				element: (
					<ErrorBoundary>
						<Main defaultNamespace={ defaultNamespace } defaultCollection={ defaultCollection } />
					</ErrorBoundary>
				),
				index: (
					<ErrorBoundary>
						<RecordsTable />
					</ErrorBoundary>
				),
				children: [
					{
						path: '/:namespace/:collection/add',
						element: (
							<ErrorBoundary>
								<CreateRecord />
							</ErrorBoundary>
						),
					},
					{
						path: '/:namespace/:collection/import',
						element: (
							<ErrorBoundary>
								<Import />
							</ErrorBoundary>
						),
					},
					{
						path: '/:namespace/:collection/:recordId',
						element: (
							<ErrorBoundary>
								<ViewRecord />
							</ErrorBoundary>
						),
						index: (
							<ErrorBoundary>
								<RecordOverview />
							</ErrorBoundary>
						),
						children: [
							{
								path: '/:namespace/:collection/:recordId/:tab',
								element: (
									<ErrorBoundary>
										<TabContent />
									</ErrorBoundary>
								),
							}
						],
					}
				],
			},
		];
	}, [ defaultNamespace, defaultCollection ] );

	return (
		<ErrorBoundary>
			<Router basePath={ `/${ defaultNamespace }/${ defaultCollection }` } routes={ routes } />
		</ErrorBoundary>
	);
};
