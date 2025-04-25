/**
 * External dependencies
 */
import React, { useMemo } from "react";

/**
 * WordPress dependencies
 */
import { __experimentalVStack as VStack, Icon, Button, Notice, CardBody } from "@wordpress/components";
import { sprintf } from "@wordpress/i18n";

/**
 * HizzleWP dependencies
 */
import { useCollectionRecordTabContent } from '@hizzlewp/store';
import type { CollectionTab } from "@hizzlewp/store";
import type { TableProviderProps } from '@hizzlewp/records/build-types/components/table/context';
import { ErrorBoundary } from "@hizzlewp/components";
import { Records as RecordsTable } from '@hizzlewp/records';

/**
 * Local dependencies
 */
import getEnumBadge from "../../records-table/enum-colors";

const prepareSearchValue = ( row: Record<string, any>, header: CollectionTab[ 'headers' ][ number ] ) => {
    const { is_list, item, args, is_boolean, label } = header;

    const value = row[ header.name ];

    if ( is_list ) {
        if ( !Array.isArray( value ) || 0 === value.length ) {
            return '';
        }

        return value.map( ( arrayValue ) => {
            let value = arrayValue;

            if ( item && args ) {
                return sprintf( item, ...args.map( arg => arrayValue[ arg ] ) );
            }

            return value;
        } ).join( ' ' );
    }

    if ( is_boolean ) {
        return value ? label : '';
    }

    return value;
}

/**
 * Displays a single cell.
 *
 * @param {Object} props
 * @returns The cell.
 */
const DisplayCell = ( { row, header, headerKey }: { row: Record<string, any>, header: CollectionTab[ 'headers' ][ number ], headerKey: string } ) => {

    const { is_list, item, args, is_primary, url, is_boolean, is_badge } = header;

    // If we're displaying a list of values, display a list.
    // For example, in Noptin, we display a list of links that
    // someone clicked on.
    // In this case, item === %s - %s and args === [ 'link', 'date' ]
    // So we'd display:
    // <ul>
    //     <li>example.com - 2021-01-01</li>
    //     <li>example.com - 2021-01-02</li>
    //     <li>example.com - 2021-01-03</li>
    // </ul>

    if ( is_list ) {

        if ( !Array.isArray( row[ headerKey ] ) || 0 === row[ headerKey ].length ) {
            return '—';
        }

        return (
            <VStack as="ul" spacing={ 4 } style={ { margin: 0 } }>
                { row[ headerKey ].map( ( arrayValue, index ) => {
                    let value = arrayValue;

                    if ( item && args ) {
                        const replacements = args.map( arg => arrayValue[ arg ] );
                        value = sprintf( item, ...replacements );
                    }

                    return <li key={ index } style={ { margin: 0 } } dangerouslySetInnerHTML={ { __html: value } } />
                } ) }
            </VStack>
        );
    }

    // Primary column with a URL.
    if ( is_primary && url ) {
        const recordUrl = row[ url ];

        if ( !recordUrl ) {
            return (
                <div className="hizzle-records__table-title-field">
                    { row[ headerKey ] }
                </div>
            );
        }

        const btnStyle = {
            width: '100%',
            alignItems: 'start',
            textDecoration: 'none',
        }

        return (
            <div className="hizzle-records__table-title-field">
                <Button variant="link" style={ btnStyle } href={ recordUrl } target="_blank">
                    { row[ headerKey ] }
                </Button>
            </div>
        );
    }

    if ( is_boolean ) {
        const theIcon = row[ headerKey ] ? 'yes' : 'no';
        return <Icon icon={ theIcon } />;
    }

    if ( is_badge && row[ headerKey ] ) {
        return (
            <span className="hizzlewp-badge" style={ getEnumBadge( row[ headerKey ] ) }>
                { row[ headerKey ] }
            </span>
        )
    }

    return <div dangerouslySetInnerHTML={ { __html: row[ headerKey ] } } />;
}

type TableProps = {
    namespace: string;
    collection: string;
    recordId: string;
    tabName: string;
    tab: CollectionTab;
}

/**
 * Displays the table content.
 *
 * @param {Object} props
 * @returns The table content.
 */
export const Table = ( { namespace, collection, recordId, tabName, tab }: TableProps ) => {

    // Prepare the data.
    const data = useCollectionRecordTabContent( namespace, collection, recordId, tabName );

    // Available columns.
    const columns: TableProviderProps<Record<string, any>>[ 'columns' ] = useMemo( () => ( tab.headers.map( ( prop ) => ( {
        accessorKey: prop.name,
        accessorFn: ( row ) => prepareSearchValue( row, prop ),
        header: prop.label,
        enableSorting: false,
        enableHiding: !prop.is_primary,
        cell: ( { row } ) => (
            <DisplayCell
                row={ row.original }
                header={ prop }
                headerKey={ prop.name }
            />
        ),
    } ) ) ), [ tab.headers ] );

    if ( !data.isResolving && data.error ) {
        return (
            <CardBody>
                <Notice status="error" isDismissible={ false }>
                    { data.error?.message }
                </Notice>
            </CardBody>
        );
    }

    return (
        <ErrorBoundary>
            <RecordsTable
                key={`${namespace}-${collection}-${recordId}-${tabName}`}
                rowCount={ data.data?.length || 0 }
                data={ data.data || [] }
                columns={ columns }
                emptyMessage={ tab.emptyMessage }
                isLoading={ data.isResolving }
                searchLabel="Search"
                enableRowSelection={ false }
                enableSorting
                enablePagination
            />
        </ErrorBoundary>
    );
}
