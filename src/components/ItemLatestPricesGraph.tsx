import { formatRawPriceToCopperSilverGold } from '../utils/helpers'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts'
import { ItemSellPrice } from '.'

type ItemLatestPricesGraphProps = {
    itemId: number
    auctionHouseId: number
} & any

type CustomTooltipProps = {
    active?: boolean
    payload?: any[]
    label?: string
}

type CustomYAxisTickProps = {
    x?: number
    y?: number
    payload?: any
}

const ItemLatestPricesGraph: React.FC<ItemLatestPricesGraphProps> = ({
    itemId,
    auctionHouseId,
    ...restOfProps
}) => {
    const [data, setData] = useState([])

    const fetchLatestPrices = async () => {
        try {
            const response = await axios.get(
                `/api/v2/${itemId}/${auctionHouseId}/latest`
            )
            setData(
                response.data
                    .map((item: any) => ({
                        ...item,
                        formattedMarketValue: formatRawPriceToCopperSilverGold(
                            item.marketValue
                        ),
                        formattedMinBuyout: formatRawPriceToCopperSilverGold(
                            item.minBuyout
                        ),
                    }))
                    .reverse()
            )
        } catch (error) {
            console.error('Failed to fetch data:', error)
        }
    }

    const CustomYAxisTick: React.FC<CustomYAxisTickProps> = ({
        x,
        y,
        payload,
    }) => {
        const { gold, silver, copper } = formatRawPriceToCopperSilverGold(
            payload.value
        ) || {
            gold: 0,
            silver: 0,
            copper: 0,
        }

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={-5}
                    y={-16}
                    dy={16}
                    textAnchor="end"
                    fill="#8884d8"
                    fontSize={13}
                >
                    {`${gold}g ${silver}s ${copper}c`}
                </text>
            </g>
        )
    }

    const CustomTooltip: React.FC<CustomTooltipProps> = ({
        active,
        payload,
        label,
    }) => {
        if (active && payload && payload.length) {
            const marketValue = formatRawPriceToCopperSilverGold(
                payload[0].value
            )

            const minBuyout = payload.find((p) => p.dataKey === 'minBuyout')
            const minBuyoutValue = formatRawPriceToCopperSilverGold(
                minBuyout?.value
            )

            const date = new Date(label as string)
            const time = `${date.getHours()}:${
                date.getMinutes() < 10 ? '0' : ''
            }${date.getMinutes()}`

            const quantity = payload[0].payload.quantity

            return (
                <>
                    <div className="graph-tooltip">
                        <div className="label">{`Scanned at ${time}`}</div>
                        {minBuyoutValue && (
                            <div className="d-flex gap-2">
                                <span>Min Buyout:</span>
                                <ItemSellPrice
                                    gold={minBuyoutValue.gold}
                                    silver={minBuyoutValue.silver}
                                    copper={minBuyoutValue.copper}
                                />
                            </div>
                        )}
                        {marketValue && (
                            <div className="d-flex gap-2">
                                <span>Market Value:</span>
                                <ItemSellPrice
                                    gold={marketValue.gold}
                                    silver={marketValue.silver}
                                    copper={marketValue.copper}
                                />
                            </div>
                        )}
                        <div>Quantity: {quantity}</div>
                    </div>
                </>
            )
        }

        return null
    }

    const formatXAxis = (tickItem: string) => {
        const date = new Date(tickItem)
        return `${date.getHours()}:${
            date.getMinutes() < 10 ? '0' : ''
        }${date.getMinutes()}`
    }

    useEffect(() => {
        if (itemId && auctionHouseId) {
            fetchLatestPrices()
        }
    }, [itemId, auctionHouseId])

    const accumulatedQuantity = data.reduce(
        (acc, curr: any) => acc + curr.quantity,
        0
    )

    return (
        <>
            {data && accumulatedQuantity !== 0 && (
                <ResponsiveContainer width="100%" height={400} {...restOfProps}>
                    <ComposedChart
                        data={data}
                        margin={{ top: 5, right: 0, left: 50, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="snapshotDate"
                            tickFormatter={formatXAxis}
                            fontSize={13}
                        />
                        <YAxis
                            orientation="left"
                            stroke="#8884d8"
                            tick={<CustomYAxisTick />}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="quantity"
                            fill="rgb(100, 177, 255)"
                            name="Quantity"
                        />
                        <Line
                            type="monotone"
                            dataKey="marketValue"
                            stroke="rgb(238, 205, 21)"
                            name="Market Value"
                        />
                        <Line
                            type="monotone"
                            dataKey="minBuyout"
                            stroke="rgb(235, 37, 136)"
                            name="Minimum Buyout"
                        />
                        <Legend />
                    </ComposedChart>
                </ResponsiveContainer>
            )}
        </>
    )
}

export default ItemLatestPricesGraph
