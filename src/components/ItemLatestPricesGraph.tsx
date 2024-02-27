import axios from 'axios'
import { useEffect, useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts'

type ItemLatestPricesGraphProps = {
    itemId: number
    auctionHouseId: number
}

const ItemLatestPricesGraph: React.FC<ItemLatestPricesGraphProps> = ({
    itemId,
    auctionHouseId,
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

    const formatXAxis = (tickItem) => {
        // Assuming your snapshotDate is in a format that can be directly passed to Date constructor
        const date = new Date(tickItem)
        // Format the date to show hour and minutes. Adjust the format as needed.
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
                <LineChart width={400} height={400} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="snapshotDate" tickFormatter={formatXAxis} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="marketValue"
                        stroke="#8884d8"
                    />
                </LineChart>
            )}
        </>
    )
}

export default ItemLatestPricesGraph
