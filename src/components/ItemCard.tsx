import { Item } from '../utils/types'
import { getItemColorByRarity } from '../utils/helpers'
import { Image, Dropdown } from 'react-bootstrap'
import { FaEllipsisVertical } from 'react-icons/fa6'
import { FaEye, FaTrash } from 'react-icons/fa'
import { CSSProperties } from 'react'

type ItemCardProps = {
    item: Item | null
    deleteItem: (item: Item) => void
}

const ItemCard: React.FC<ItemCardProps> = ({ item, deleteItem }) => {
    const showDetails = () => console.log('Showing details for', item?.itemName)

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
                            <div className="d-flex align-items-center justify-content-start gap-3">
                                <FaEye />
                                <span>Show details</span>
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => deleteItem(item)}>
                            <div
                                style={styles.deleteAction}
                                className="d-flex align-items-center justify-content-start gap-3"
                            >
                                <FaTrash />
                                <span>Delete</span>
                            </div>
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
    deleteAction: {
        color: 'red',
    },
}

export default ItemCard
