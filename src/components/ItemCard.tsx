import { Item } from '../utils/types'
import { getItemColorByRarity } from '../utils/helpers'
import { Image } from 'react-bootstrap'

type ItemCardProps = {
    item: Item | null
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
    return (
        item && (
            <div className="d-flex gap-3">
                <Image
                    src={item.mediaUrl}
                    alt="item-icon"
                    className="item-icon-sm"
                />
                <span
                    style={{
                        color: getItemColorByRarity(item.itemRarity),
                    }}
                >
                    {item.itemName}
                </span>
            </div>
        )
    )
}

export default ItemCard
