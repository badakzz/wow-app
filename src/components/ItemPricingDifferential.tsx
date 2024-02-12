import axios from 'axios'
import { useEffect, useState } from 'react'

type ItemPricingDifferentialProps = {
    itemId: number
    auctionHouseId: number
}

const ItemPricingDifferential: React.FC<ItemPricingDifferentialProps> = ({
    itemId,
    auctionHouseId,
}) => {
    const [data, setData] = useState<{ difference: number } | null>(null)

    const fetchPriceDifferential = () => {
        axios
            .get(
                `/api/v2/${itemId}/${auctionHouseId}/market_value_differential`
            )
            .then((response) => {
                setData(response.data)
            })
    }

    useEffect(() => {
        if (itemId && auctionHouseId) {
            fetchPriceDifferential()
        }
    }, [itemId, auctionHouseId])

    return (
        <>
            {data && (
                <div className="d-flex gap-2">
                    Market Value :
                    {data.difference >= 0 ? (
                        <span style={{ color: 'green' }}>
                            +{data.difference}
                        </span>
                    ) : (
                        <span style={{ color: 'red' }}>{data.difference}</span>
                    )}
                </div>
            )}
        </>
    )
}

export default ItemPricingDifferential
