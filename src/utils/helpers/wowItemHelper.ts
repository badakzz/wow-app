import { ItemRarity } from '../constants'

const rarityColorMap: Record<ItemRarity, string> = {
    [ItemRarity.Poor]: 'rgb(131, 131, 131)', // grey
    [ItemRarity.Common]: '#FFFFFF', // White
    [ItemRarity.Uncommon]: '#1EFF00', // Green
    [ItemRarity.Rare]: '#0070DD', // Blue
    [ItemRarity.Epic]: '#A335EE', // Purple
    [ItemRarity.Legendary]: '#FF8000', // Orange
}

export const getItemColor = (rarityType: ItemRarity): string => {
    const rarityValues = Object.values(ItemRarity)

    if (rarityValues.includes(rarityType)) {
        return rarityColorMap[rarityType as ItemRarity]
    }
    return '#FFFFFF' // default to white
}
