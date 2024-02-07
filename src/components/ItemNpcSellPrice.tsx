import { Image } from 'react-bootstrap'

type ItemNpcSellPriceProps = {
    gold: string
    silver: string
    copper: string
}

const ItemNpcSellPrice: React.FC<ItemNpcSellPriceProps> = ({
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
export default ItemNpcSellPrice
