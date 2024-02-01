import { ITEM_RARITY } from '../constants'

const rarityColorMap: Record<ITEM_RARITY, string> = {
    [ITEM_RARITY.POOR]: 'rgb(131, 131, 131)', // grey
    [ITEM_RARITY.COMMON]: '#FFFFFF', // White
    [ITEM_RARITY.UNCOMMON]: '#1EFF00', // Green
    [ITEM_RARITY.RARE]: '#0070DD', // Blue
    [ITEM_RARITY.EPIC]: '#A335EE', // Purple
    [ITEM_RARITY.LEGENDARY]: '#FF8000', // Orange
}

export const getItemColor = (rarityType: ITEM_RARITY): string => {
    const rarityValues = Object.values(ITEM_RARITY)

    if (rarityValues.includes(rarityType)) {
        return rarityColorMap[rarityType as ITEM_RARITY]
    }
    return '#FFFFFF' // default to white
}
