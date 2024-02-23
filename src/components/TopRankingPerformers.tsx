/* eslint-disable react/jsx-key */
import React, { useMemo, useState, useEffect } from 'react'
import { useTable, useFilters } from 'react-table'
import axios from 'axios'
import { Encounter, Ranking } from '../utils/types'
import { getRankingClassColor } from '../utils/helpers'
import { Form } from 'react-bootstrap'
import { RankingClassPicker } from '.'
import { RANKING_CLASS } from '@/utils/constants'

type TopRankingPerformersTableProps = {
    encounter: Encounter
}

const DefaultColumnFilter = ({
    column: { filterValue, preFilteredRows, setFilter },
}) => {
    const count = preFilteredRows.length

    return (
        <input
            value={filterValue || ''}
            onChange={(e) => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

const TopRankingPerformersTable: React.FC<TopRankingPerformersTableProps> = ({
    encounter,
}) => {
    const [data, setData] = useState<Ranking[]>([])
    const [page, setPage] = useState<number>(1)
    const [hasMorePages, setHasMorePages] = useState<boolean>(false)
    const [filter, setFilter] = useState<string>('')
    const [rankingClass, setRankingClass] = useState<RANKING_CLASS | null>(null)

    const fetchData = async (encounterId: number, page: number) => {
        try {
            const response = await axios.post('/api/v1/warcraftlogs/raids', {
                operation: 'getEncounterDetails',
                parameters: { encounterId: encounterId, page: page },
            })

            setData(response.data.rankings)
            setHasMorePages(response.data.hasMorePages)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchData(encounter.value, page)
    }, [encounter, page])

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name' as keyof Ranking,
                Cell: ({ row }: any) => (
                    <div
                        style={{
                            color: getRankingClassColor(row.original.class),
                        }}
                    >
                        {row.original.name}
                    </div>
                ),
                Filter: DefaultColumnFilter,
            },
            {
                Header: 'Amount',
                accessor: 'amount' as keyof Ranking,
                disableFilters: true, // Disable filters for this column
            },
        ],
        []
    )
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
    } = useTable(
        {
            columns,
            data,
        },
        useFilters // Use the useFilters hook
    )

    return (
        <>
            {/* <Form.Group>
                <Form.Control
                    type="text"
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Filter by class..."
                ></Form.Control>
            </Form.Group> */}
            <RankingClassPicker
                rankingClass={rankingClass}
                setRankingClass={setRankingClass}
            />
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                    {/* Render the column filter UI */}
                                    <div>
                                        {column.canFilter
                                            ? column.render('Filter')
                                            : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {hasMorePages && (
                <button onClick={() => setPage((prev) => prev + 1)}>
                    Next Page
                </button>
            )}
        </>
    )
}

export default TopRankingPerformersTable
