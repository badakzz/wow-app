import axios from 'axios'
import { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import { getItemColor } from '../utils/helpers'
import { ItemRarity } from '@/utils/constants'

interface ActionHouseItemProps {
    itemId: number
}

const AuctionHouseItem: React.FC<ActionHouseItemProps> = ({ itemId }) => {
    const [item, setItem] = useState<{
        itemMedia: { assets: any[] }
        itemData: {
            quality: {
                type: ItemRarity
            }
            name: string
        }
    } | null>(null)

    useEffect(() => {
        if (itemId) {
            fetchItem(itemId)
        }
    }, [itemId])

    const fetchItem = async (itemId: number) => {
        try {
            const response = await axios.get(`/api/v1/wow/items/${itemId}`)
            // const imageUrl = response.data.assets[0].value
            const item = response.data

            console.log('resp', response)
            setItem(item)
        } catch (error) {
            console.error('Error fetching image:', error)
        }
    }

    return (
        <div className="d-flex">
            {item && (
                <>
                    <Image
                        src={item.itemMedia.assets[0].value}
                        alt={`Item ${itemId}`}
                    />
                    <div
                        style={{
                            color: getItemColor(item.itemData.quality.type),
                        }}
                    >
                        {item.itemData.name}
                    </div>
                </>
            )}
        </div>
    )
}

export default AuctionHouseItem
