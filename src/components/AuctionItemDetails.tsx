import { useEffect, useState } from 'react'
import { ItemPricingDifferential } from '.'
import axios from 'axios'
import { AuctionItem } from '../utils/types'
import { minutesSinceTimestamp } from '../utils/helpers/tsmAuctionItemHelper'

type AuctionItemDetailsProps = {
    itemId: number
    auctionHouseId: number
}

const AuctionItemDetails: React.FC<AuctionItemDetailsProps> = ({
    itemId,
    auctionHouseId,
}) => {
    const [data, setData] = useState<AuctionItem[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchAuctionItemDetails = () => {
        setIsLoading(true)
        axios
            .get(`/api/v2/${itemId}/${auctionHouseId}`)
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
            fetchAuctionItemDetails()
        }
    }, [itemId, auctionHouseId])

    return (
        <>
            <div>
                {isLoading && <div>Loading...</div>}
                {!isLoading && error && <div>{error}</div>}
                {!isLoading && !error && data && data[0].quantity > 0 ? (
                    <>
                        <div>{minutesSinceTimestamp(data[0].snapshotDate)}</div>
                        <div>Minimum Buyout: {data[0].minBuyout}</div>
                        <div>Number of auctions: {data[0].numAuctions}</div>
                        <ItemPricingDifferential
                            itemId={itemId}
                            auctionHouseId={auctionHouseId}
                        />
                    </>
                ) : (
                    <div>No recent sell for this item.</div>
                )}
                {!isLoading && !error && !data && (
                    <div>No data to display.</div>
                )}
            </div>
        </>
    )
}

export default AuctionItemDetails
