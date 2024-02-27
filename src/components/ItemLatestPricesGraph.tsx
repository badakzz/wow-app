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

const ItemLatestPricesGraph: React.FC<ItemLatestPricesGraphProps> = ({
    itemId,
    auctionHouseId,
    ...restOfProps
}) => {
    const [data, setData] = useState([])
    console.log(data)

    const fetchLatestPrices = async () => {
        try {
            const response = await axios.get(
                `/api/v2/${itemId}/${auctionHouseId}/latest`
            )
            setData(response.data)
        } catch (error) {
            console.error('Failed to fetch data:', error)
        }
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

    return (
        <>
            {data && (
                <ResponsiveContainer width="100%" height={400} {...restOfProps}>
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="snapshotDate"
                            tickFormatter={formatXAxis}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            stroke="#8884d8"
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#82ca9d"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            yAxisId="right"
                            dataKey="quantity"
                            fill="rgb(100, 177, 255)"
                            name="Quantity"
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="marketValue"
                            stroke="#a884d8"
                            name="Market Value"
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="minBuyout"
                            stroke="#82ca9d"
                            name="Minimum Buyout"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            )}
        </>
    )
}

export default ItemLatestPricesGraph
