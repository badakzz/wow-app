import { useToast } from '../utils/hooks'
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

    const { showToast } = useToast()

    const fetchPriceDifferential = () => {
        axios
            .get(
                `/api/v2/${itemId}/${auctionHouseId}/market_value_differential`
            )
            .then((response) => {
                setData(response.data)
            })
            .catch((error: any) =>
                showToast({
                    message: `Error fetching market value: ${error.message}`,
                })
            )
    }

    useEffect(() => {
        if (itemId && auctionHouseId) {
            fetchPriceDifferential()
        }
    }, [itemId, auctionHouseId])

    const differenceAttributesMap = {
        positive: { color: 'green', sign: '+' },
        zero: { color: 'yellow', sign: '' },
        negative: { color: 'red', sign: '' },
    }

    const getAttributesForDifference = (difference: number) => {
        if (difference > 0) return differenceAttributesMap.positive
        if (difference < 0) return differenceAttributesMap.negative
        return differenceAttributesMap.zero
    }

    return (
        <>
            {data && (
                <div className="d-flex gap-2">
                    Market Value:
                    <span
                        style={{
                            color: getAttributesForDifference(data.difference)
                                .color,
                        }}
                    >
                        {getAttributesForDifference(data.difference).sign}
                        {data.difference}
                    </span>
                </div>
            )}
        </>
    )
}

export default ItemPricingDifferential
