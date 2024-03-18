import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Item } from '../utils/types'
import { getItemColorByRarity } from '../utils/helpers'
import { Image } from 'react-bootstrap'

type ItemCardProps = {
    itemId: number | null
} & any

const ItemCard: React.FC<ItemCardProps> = ({ itemId, ...restOfProps }) => {
    const [item, setItem] = useState<Item | null>(null)

    console.log('a')

    useEffect(() => {
        const fetchItem = async (itemId: number) => {
            try {
                const response = await axios.get(`/api/v1/wow/items/${itemId}`)
                const item = response.data
                setItem(item)
            } catch (error) {
                console.error('Error fetching item:', error)
            }
        }
        if (itemId !== null) {
            fetchItem(itemId)
        }
    }, [itemId])

    if (!item) {
        return <div>Loading...</div>
    }

    return (
        <div className="d-flex gap-3">
            <Image
                src={item.itemMedia.assets[0].value}
                alt="item-icon"
                className="item-icon-sm"
            />
            <span
                style={{
                    color: getItemColorByRarity(item.itemData.quality.type),
                }}
            >
                {item.itemData.name}
            </span>
        </div>
    )
}

export default ItemCard
