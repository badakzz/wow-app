import { ITEM_RARITY } from '../constants'

export type Item = {
    itemId: Number
    itemName: string
    itemRarity: ITEM_RARITY
    mediaUrl: string
}
