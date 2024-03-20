import { useEffect, useState } from 'react'
import { ItemPricingDifferential, ItemSellPrice } from '.'
import axios from 'axios'
import { AuctionItem } from '../utils/types'
import {
    formatRawPriceToCopperSilverGold,
    minutesSinceTimestamp,
} from '../utils/helpers'
import { useToast } from '../utils/hooks'
import { FaInfoCircle } from 'react-icons/fa'
import { Tooltip } from 'react-tooltip'

type AuctionItemDetailsProps = {
    itemId: number
    auctionHouseId: number
} & any

const AuctionItemDetails: React.FC<AuctionItemDetailsProps> = ({
    itemId,
    auctionHouseId,
    ...restOfProps
}) => {
    const [data, setData] = useState<AuctionItem[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [tooltipId, setTooltipId] = useState<number | null>(null)
    const itemSellPrice =
        data && data.length > 0
            ? formatRawPriceToCopperSilverGold(data[0].minBuyout)
            : null

    const { showToast } = useToast()

    const fetchAuctionItemDetails = () => {
        setIsLoading(true)
        axios
            .get(`/api/v2/${itemId}/${auctionHouseId}`)
            .then((response) => {
                setData(response.data as AuctionItem[])
                console.log({ data })
                setTooltipId(response.data[0]?.itemId as number)
                setError('')
            })
            .catch((error: any) => {
                setIsLoading(false)
                if (error.response && error.response.status === 404) {
                    setError('No data available for this item.')
                    showToast({
                        message: `No data available for this item: ${error.message}`,
                    })
                } else {
                    setError('An error occurred while fetching data.')
                    showToast({
                        message: `An error occurred while fetching data: ${error.message}`,
                    })
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
        <div {...restOfProps}>
            {tooltipId && (
                <>
                    <FaInfoCircle
                        data-tooltip-id={String(tooltipId)}
                        data-tooltip-float
                    />
                    <Tooltip id={String(tooltipId)} className="tooltip-inner">
                        <div className="d-flex flex-column justify-content-start auction-item-details-container">
                            {isLoading && <div>Loading...</div>}
                            {!isLoading &&
                            !error &&
                            data &&
                            data[0].quantity > 0 ? (
                                <>
                                    <div>
                                        {minutesSinceTimestamp(
                                            data[0].snapshotDate
                                        )}
                                    </div>
                                    <div className="d-flex gap-2">
                                        Minimum buyout :
                                        {itemSellPrice && (
                                            <ItemSellPrice
                                                gold={itemSellPrice.gold}
                                                silver={itemSellPrice.silver}
                                                copper={itemSellPrice.copper}
                                            />
                                        )}
                                    </div>
                                    <div>
                                        Current number of auctions:{' '}
                                        {data[0].numAuctions}
                                    </div>
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
                    </Tooltip>
                </>
            )}
        </div>
    )
}

export default AuctionItemDetails
