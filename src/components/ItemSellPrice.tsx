import { Image } from 'react-bootstrap'

type ItemSellPriceProps = {
    gold: string
    silver: string
    copper: string
}

const ItemSellPrice: React.FC<ItemSellPriceProps> = ({
    gold,
    silver,
    copper,
}) => {
    return (
        <div>
            Sell price: {gold}
            <Image src="/gold.webp" alt="gold" /> {silver}
            <Image src="/silver.webp" alt="silver" /> {copper}
            <Image src="/copper.webp" alt="copper" />
        </div>
    )
}
export default ItemSellPrice
