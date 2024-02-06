import axios from 'axios'
import { useEffect, useState } from 'react'

type ItemPriceDifferentialProps = {
    itemId: number
    auctionHouseId: number
}

const ItemPriceDifferential: React.FC<ItemPriceDifferentialProps> = ({
    itemId,
    auctionHouseId,
}) => {
    const [data, setData] = useState<{ difference: number } | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchPriceDifferential = () => {
        setIsLoading(true)
        axios
            .get(
                `/api/v2/${itemId}/${auctionHouseId}/market_value_differential`
            )
            .then((response) => {
                setData(response.data)
                setError('')
            })
            .catch((err) => {
                setIsLoading(false)
                if (err.response && err.response.status === 404) {
                    setError('No data available for this item.')
                } else {
                    setError('An error occurred while fetching data.')
                }
            })
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        if (itemId && auctionHouseId) {
            fetchPriceDifferential()
        }
    }, [itemId, auctionHouseId])

    return (
        <div>
            {isLoading && <div>Loading...</div>}
            {!isLoading && error && <div>{error}</div>}
            {!isLoading && !error && data && (
                <div>
                    Market Value :
                    {data.difference >= 0 ? (
                        <div style={{ color: 'green' }}>+{data.difference}</div>
                    ) : (
                        <div style={{ color: 'red' }}>{data.difference}</div>
                    )}
                </div>
            )}
            {!isLoading && !error && !data && <div>No data to display.</div>}
        </div>
    )
}

export default ItemPriceDifferential
