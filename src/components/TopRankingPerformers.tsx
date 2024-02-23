/* eslint-disable react/jsx-key */
import React, { useMemo, useState, useEffect, CSSProperties } from 'react'
import { useTable, useFilters, usePagination } from 'react-table'
import axios from 'axios'
import { Encounter, Ranking } from '../utils/types'
import { getRankingClassColor } from '../utils/helpers'
import { RankingClassPicker } from '.'
import { RANKING_CLASS } from '@/utils/constants'
import { Button } from 'react-bootstrap'

type TopRankingPerformersTableProps = {
    encounter: Encounter
}

const TopRankingPerformersTable: React.FC<TopRankingPerformersTableProps> = ({
    encounter,
}) => {
    const [data, setData] = useState<Ranking[]>([])
    const [hasMorePages, setHasMorePages] = useState<boolean>(false)
    const [pageIndex, setPageIndex] = useState<number>(0)
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
            },
            {
                Header: 'Amount',
                accessor: 'amount' as keyof Ranking,
                disableFilters: true,
            },
        ],
        []
    )

    const filteredData = useMemo(() => {
        if (!rankingClass) return data
        return data.filter((item) => item.class === rankingClass)
    }, [data, rankingClass])

    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
        useTable(
            {
                columns,
                data: filteredData,
            },
            useFilters,
            usePagination
        )

    useEffect(() => {
        fetchData(encounter.value, pageIndex + 1)
    }, [encounter, pageIndex])

    return (
        <>
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
            <div className="pagination">
                <Button
                    className="page-button"
                    onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
                    disabled={pageIndex === 0}
                >
                    <span>{'<'}</span>
                </Button>
                <Button
                    className="page-button"
                    onClick={() =>
                        setPageIndex((old) => (!hasMorePages ? old : old + 1))
                    }
                    disabled={!hasMorePages}
                >
                    <span>{'>'}</span>
                </Button>
            </div>
        </>
    )
}

export default TopRankingPerformersTable
