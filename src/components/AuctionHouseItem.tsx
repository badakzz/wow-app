import axios from 'axios'
import { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import { getItemColorByRarity } from '../utils/helpers'
import { ITEM_RARITY } from '@/utils/constants'
import { ItemSellPrice } from '.'

type ActionHouseItemProps = {
    itemId: number | null
}

const AuctionHouseItem: React.FC<ActionHouseItemProps> = ({ itemId }) => {
    const [item, setItem] = useState<{
        itemMedia: { assets: any[] }
        itemData: {
            item_subclass: {
                name: string
            }
            inventory_type: {
                name: string
            }
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
                requirements: {
                    level: {
                        display_string: string
                    }
                }
            }
        }
    } | null>(null)

    console.log('itm', item)

    useEffect(() => {
        if (itemId) {
            fetchItem(itemId)
        }
    }, [itemId])

    const fetchItem = async (itemId: number) => {
        try {
            const response = await axios.get(`/api/v1/wow/items/${itemId}`)
            const item = response.data
            setItem(item)
        } catch (error) {
            console.error('Error fetching image:', error)
        }
    }

    return (
        <>
            {item && console.log(item.itemData.quality.type)}
            {item &&
                console.log(getItemColorByRarity(item.itemData.quality.type))}
            {item && (
                <div className="d-flex gap-2">
                    <div>
                        <Image
                            className="auction-house-item-img-border"
                            height={50}
                            width={50}
                            src={item.itemMedia.assets[0].value}
                            alt={`Item ${itemId}`}
                        />
                    </div>
                    <div className="auction-house-item-container">
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
                            <div className="d-flex flex-col justify-content-between">
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
                                <div style={{ color: 'rgb(255, 216, 44)' }}>
                                    {
                                        item.itemData.preview_item.requirements
                                            .level.display_string
                                    }
                                </div>
                            )}
                            {item.itemData.preview_item.binding && (
                                <div>
                                    {item.itemData.preview_item.binding.name}
                                </div>
                            )}
                            {item.itemData.preview_item.sell_price && (
                                <ItemSellPrice
                                    gold={
                                        item.itemData.preview_item.sell_price
                                            .display_strings.gold
                                    }
                                    silver={
                                        item.itemData.preview_item.sell_price
                                            .display_strings.silver
                                    }
                                    copper={
                                        item.itemData.preview_item.sell_price
                                            .display_strings.copper
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AuctionHouseItem
