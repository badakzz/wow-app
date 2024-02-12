import axios from 'axios'
import { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import { getItemColorByRarity } from '../utils/helpers'
import { ITEM_RARITY } from '@/utils/constants'
import { ItemSellPrice } from '.'

type ItemCharacteristicsProps = {
    itemId: number | null
}

const ItemCharacteristics: React.FC<ItemCharacteristicsProps> = ({
    itemId,
}) => {
    const [item, setItem] = useState<{
        itemMedia: { assets: any[] }
        itemData: {
            item_subclass: {
                name: string
            }
            inventory_type: {
                name: string
            }
            level: string
            quality: {
                type: ITEM_RARITY
            }
            name: string
            preview_item: {
                binding: {
                    name: string
                }
                durability: {
                    display_string: string
                }
                sell_price: {
                    display_strings: {
                        copper: string
                        silver: string
                        gold: string
                    }
                }
                stats: [
                    {
                        display: {
                            display_string: string
                        }
                    }
                ]
                requirements: {
                    level: {
                        display_string: string
                    }
                }
            }
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
            const item = response.data
            console.log(item)
            setItem(item)
        } catch (error) {
            console.error('Error fetching item:', error)
        }
    }

    return (
        <>
            {item && (
                <div className="d-flex gap-2">
                    <div>
                        <Image
                            className="auction-item-img-border"
                            height={50}
                            width={50}
                            src={item.itemMedia.assets[0].value}
                            alt={`Item ${itemId}`}
                        />
                    </div>
                    <div className=" auction-item-details-container">
                        <div>
                            <div
                                style={{
                                    color: getItemColorByRarity(
                                        item.itemData.quality.type
                                    ),
                                }}
                            >
                                {item.itemData.name}
                            </div>
                            {item.itemData.preview_item.requirements && (
                                <div
                                    className="d-flex gap-1"
                                    style={{ color: 'rgb(255, 216, 44)' }}
                                >
                                    <span>Item level</span>
                                    <span>{item.itemData.level}</span>
                                </div>
                            )}
                            {item.itemData.preview_item.binding && (
                                <div>
                                    {item.itemData.preview_item.binding.name}
                                </div>
                            )}
                            {item.itemData.preview_item.stats &&
                                item.itemData.preview_item.stats.map(
                                    (stat, index) => {
                                        return (
                                            <div key={index}>
                                                {stat.display.display_string}
                                            </div>
                                        )
                                    }
                                )}
                            <div className="d-flex justify-content-between">
                                {item.itemData.inventory_type.name && (
                                    <div>
                                        {item.itemData.inventory_type.name}
                                    </div>
                                )}
                                {item.itemData.item_subclass.name && (
                                    <div>
                                        {item.itemData.item_subclass.name}
                                    </div>
                                )}
                            </div>
                            {item.itemData.preview_item.durability && (
                                <div>
                                    {
                                        item.itemData.preview_item.durability
                                            .display_string
                                    }
                                </div>
                            )}
                            {item.itemData.preview_item.requirements && (
                                <div>
                                    {
                                        item.itemData.preview_item.requirements
                                            .level.display_string
                                    }
                                </div>
                            )}
                            {item.itemData.preview_item.sell_price && (
                                <div className="d-flex gap-2">
                                    Sell price:
                                    <ItemSellPrice
                                        className="ml-5"
                                        gold={parseInt(
                                            item.itemData.preview_item
                                                .sell_price.display_strings.gold
                                        )}
                                        silver={parseInt(
                                            item.itemData.preview_item
                                                .sell_price.display_strings
                                                .silver
                                        )}
                                        copper={parseInt(
                                            item.itemData.preview_item
                                                .sell_price.display_strings
                                                .copper
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ItemCharacteristics
