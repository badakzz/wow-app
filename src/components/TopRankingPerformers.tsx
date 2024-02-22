/* eslint-disable react/jsx-key */
import React, { useMemo, useState, useEffect } from 'react'
import { useTable } from 'react-table'
import axios from 'axios'
import { Encounter, Ranking } from '../utils/types'
import { getRankingClassColor } from '../utils/helpers'

type TopRankingPerformersTableProps = {
    encounter: Encounter
}

const TopRankingPerformersTable: React.FC<TopRankingPerformersTableProps> = ({
    encounter,
}) => {
    const [data, setData] = useState<Ranking[]>([])
    const [page, setPage] = useState<number>(1)
    const [hasMorePages, setHasMorePages] = useState<boolean>(false)

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
                            color: getRankingClassColor(
                                row.original.class.toUpperCase()
                            ),
                        }}
                    >
                        {row.original.name}
                    </div>
                ),
            },
            {
                Header: 'Amount',
                accessor: 'amount' as keyof Ranking,
            },
        ],
        []
    )

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data })

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
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
