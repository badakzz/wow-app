/* eslint-disable react/jsx-key */
import React, { useMemo, useState, useEffect } from 'react'
import { useTable, useFilters, usePagination } from 'react-table'
import axios from 'axios'
import { Encounter, Ranking } from '../utils/types'
import { getRankingClassColor } from '../utils/helpers'
import { RankingClassPicker, RankingSpecIcon } from '.'
import { RANKING_CLASS } from '@/utils/constants'
import { Button, Spinner, Form } from 'react-bootstrap'

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
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [metric, setMetric] = useState('dps')

    const fetchData = async (encounterId: number, page: number) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/v1/warcraftlogs/raids', {
                operation: 'getEncounterDetails',
                parameters: {
                    encounterId: encounterId,
                    className: rankingClass,
                    page: page,
                    metric: metric,
                },
            })
            setData(response.data.rankings)
            setHasMorePages(response.data.hasMorePages)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
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
                        <RankingSpecIcon
                            rankingClass={row.original.class}
                            rankingSpec={row.original.spec}
                        />

                        {row.original.name}
                    </div>
                ),
            },
            {
                Header: 'DPS',
                accessor: 'amount' as keyof Ranking,
                disableFilters: true,
            },
        ],
        []
    )

    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
        useTable(
            {
                columns,
                data,
            },
            useFilters,
            usePagination
        )

    useEffect(() => {
        fetchData(encounter.value, pageIndex + 1)
    }, [encounter, rankingClass, pageIndex, metric])

    return (
        <div className="d-flex flex-column align-items-center justify-content-end rankings-main-container">
            <div className="rankings-picker-table-container d-flex flex-row justify-content-between align-items-start">
                {!isLoading && (
                    <>
                        <RankingClassPicker
                            className="mb-3"
                            rankingClass={rankingClass}
                            setRankingClass={setRankingClass}
                        />
                        <div className="d-flex gap-3">
                            <Form.Check
                                type={'radio'}
                                id={`radio-dps`}
                                name="metric"
                                label={`DPS`}
                                onChange={() => setMetric('dps')}
                                checked={metric === 'dps'}
                            />
                            <Form.Check
                                type={'radio'}
                                id={`radio-hps`}
                                name="metric"
                                label={`HPS`}
                                onChange={() => setMetric('hps')}
                                checked={metric === 'hps'}
                            />
                        </div>
                    </>
                )}
                {isLoading && (
                    <div className="spinner">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                )}
            </div>
            {!isLoading && (
                <div className="d-flex flex-wrap justify-content-end rankings-table-container">
                    <table {...getTableProps()} className="rankings-table">
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
                    <div className="rankings-pagination">
                        <Button
                            className="page-button"
                            onClick={() =>
                                setPageIndex((old) => Math.max(old - 1, 0))
                            }
                            disabled={pageIndex === 0}
                        >
                            <span>{'<'}</span>
                        </Button>
                        <Button
                            className="page-button"
                            onClick={() =>
                                setPageIndex((old) =>
                                    !hasMorePages ? old : old + 1
                                )
                            }
                            disabled={!hasMorePages}
                        >
                            <span>{'>'}</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TopRankingPerformersTable
