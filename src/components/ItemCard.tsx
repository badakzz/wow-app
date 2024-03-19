import { Item } from '../utils/types'
import { getItemColorByRarity } from '../utils/helpers'
import { Image, Dropdown } from 'react-bootstrap'
import { FaEllipsisVertical } from 'react-icons/fa6'
import { CSSProperties } from 'react'

type ItemCardProps = {
    item: Item | null
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
    const showDetails = () => console.log('Showing details for', item?.itemName)
    const deleteItem = () => console.log('Deleting', item?.itemName)

    const nameColor = item ? getItemColorByRarity(item.itemRarity) : 'inherit'

    return (
        item && (
            <div className="d-flex align-items-center item-card justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <Image
                        src={item.mediaUrl}
                        alt="item-icon"
                        className="item-card-icon"
                    />
                    <span style={{ ...styles.itemName, color: nameColor }}>
                        {item.itemName}
                    </span>
                </div>
                <Dropdown>
                    <Dropdown.Toggle
                        variant="transparent"
                        className="border-0 bg-transparent p-0"
                    >
                        <FaEllipsisVertical />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={showDetails}>
                            Show details
                        </Dropdown.Item>
                        <Dropdown.Item onClick={deleteItem}>
                            Delete
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        )
    )
}

const styles: { [key: string]: CSSProperties } = {
    itemName: {
        padding: '0.6rem',
    },
}

export default ItemCard
