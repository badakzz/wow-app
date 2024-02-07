import { GameCurrency } from '@/utils/types'
import { Image } from 'react-bootstrap'

type ItemSellPriceProps = GameCurrency & any

const ItemSellPrice: React.FC<ItemSellPriceProps> = ({
    gold,
    silver,
    copper,
    ...restOfProps
}) => {
    return (
        <span {...restOfProps}>
            {gold}
            <Image src="/gold.webp" alt="gold" /> {silver}
            <Image src="/silver.webp" alt="silver" /> {copper}
            <Image src="/copper.webp" alt="copper" />
        </span>
    )
}
export default ItemSellPrice
