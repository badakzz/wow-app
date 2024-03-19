/* eslint-disable react/jsx-key */
import { useMemo, useState, useEffect, CSSProperties } from 'react'
import { useTable, useFilters, usePagination } from 'react-table'
import axios from 'axios'
import { Encounter, Ranking } from '../utils/types'
import { classToSpecMap, getRankingClassColor } from '../utils/helpers'
import { RankingClassPicker, RankingIcon, RankingSpecPicker } from '.'
import { RANKING_METRIC, RANKING_CLASS, RANKING_SPEC } from '../utils/constants'
import { Button, Spinner, Form, Modal } from 'react-bootstrap'

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
    const [rankingSpec, setRankingSpec] = useState<RANKING_SPEC | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [metric, setMetric] = useState<RANKING_METRIC>(RANKING_METRIC.DPS)

    const fetchData = async (encounterId: number, page: number) => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/v1/warcraftlogs/raids', {
                operation: 'getEncounterDetails',
                parameters: {
                    encounterId: encounterId,
                    className: rankingClass,
                    specName: rankingSpec,
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
                    <a
                        href={`https://sod.warcraftlogs.com/character/${row.original.server.region.toLowerCase()}/${row.original.server.name
                            .replace(/\s/g, '-')
                            .toLowerCase()}/${row.original.name.toLowerCase()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex gap-3 align-items-start text-align-center"
                        style={{
                            ...styles.rankingClass,
                            color: getRankingClassColor(row.original.class),
                        }}
                    >
                        <span style={styles.rankingId}>
                            {parseInt(row.id) + 1 + '.'}
                        </span>
                        <RankingIcon
                            className="table-spec-icon"
                            rankingClass={row.original.class}
                            rankingSpec={row.original.spec}
                        />

                        {row.original.name}
                    </a>
                ),
            },
            {
                Header: `${metric}`,
                accessor: 'amount' as keyof Ranking,
                disableFilters: true,
            },
        ],
        [metric]
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
        const isValidSpecForClass = () => {
            if (!rankingClass && rankingSpec) return false
            const validSpecs = classToSpecMap[rankingClass as RANKING_CLASS]
            return !rankingSpec || validSpecs?.includes(rankingSpec)
        }

        if (isValidSpecForClass()) {
            fetchData(encounter.value, pageIndex + 1)
        }
    }, [encounter, rankingClass, pageIndex, metric, rankingSpec])

    useEffect(() => {
        setRankingSpec(null)
    }, [rankingClass])

    return (
        <div className="d-flex flex-column align-items-center justify-content-end rankings-main-container">
            <div className="rankings-picker-table-container d-flex flex-row justify-content-between align-items-start">
                <>
                    <div className="d-flex gap-3">
                        <RankingClassPicker
                            className="class-picker mb-3"
                            rankingClass={rankingClass}
                            setRankingClass={setRankingClass}
                        />
                        {rankingClass && (
                            <RankingSpecPicker
                                key={rankingClass || 'default-key'}
                                rankingClass={rankingClass}
                                rankingSpec={rankingSpec}
                                setRankingSpec={setRankingSpec}
                            />
                        )}
                    </div>
                    <div className="d-flex gap-3">
                        <Form.Check
                            className="custom-radio-input"
                            type={'radio'}
                            id={`radio-dps`}
                            name="metric"
                            label={RANKING_METRIC.DPS}
                            onChange={() => setMetric(RANKING_METRIC.DPS)}
                            checked={metric === RANKING_METRIC.DPS}
                        />
                        <Form.Check
                            className="custom-radio-input"
                            type={'radio'}
                            id={`radio-hps`}
                            name="metric"
                            label={RANKING_METRIC.HPS}
                            onChange={() => setMetric(RANKING_METRIC.HPS)}
                            checked={metric === RANKING_METRIC.HPS}
                        />
                    </div>
                </>
                {isLoading && (
                    <Modal
                        className="ranking-page-loading-modal"
                        show={isLoading}
                        size="sm"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        onHide={() => {}}
                    >
                        <Modal.Body className="d-flex flex-column align-items-center gap-3 justify-content-center text-align-center">
                            <Spinner animation="border" role="status"></Spinner>
                            <span>Loading...</span>
                        </Modal.Body>
                    </Modal>
                )}
            </div>
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
        </div>
    )
}

const styles: { [key: string]: CSSProperties } = {
    rankingClass: {
        textDecoration: 'none',
    },
    rankingId: { color: 'white', width: '1rem' },
}

export default TopRankingPerformersTable
