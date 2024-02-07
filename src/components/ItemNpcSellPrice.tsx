import { GameCurrency } from '@/utils/types'
import { Image } from 'react-bootstrap'

const ItemNpcSellPrice: React.FC<GameCurrency> = ({ gold, silver, copper }) => {
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
