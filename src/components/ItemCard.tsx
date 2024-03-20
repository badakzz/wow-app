import { Item } from '../utils/types'
import { getItemColorByRarity } from '../utils/helpers'
import { Image, Dropdown } from 'react-bootstrap'
import { FaEllipsisVertical } from 'react-icons/fa6'
import { FaEye, FaTrash } from 'react-icons/fa'
import { CSSProperties } from 'react'
import { AuctionItemDetails, ItemCharacteristics } from '.'
import { Tooltip } from 'react-tooltip'

type ItemCardProps = {
    item: Item | null
    deleteItem: (item: Item) => void
    showItemDetails: (item: Item) => void
    auctionHouseId: number
}

const ItemCard: React.FC<ItemCardProps> = ({
    item,
    deleteItem,
    showItemDetails,
    auctionHouseId,
}) => {
    const nameColor = item ? getItemColorByRarity(item.itemRarity) : 'inherit'
    const tooltipId = `tooltip-card-${item?.itemId}`

    return (
        item && (
            <div className="d-flex align-items-center item-card justify-content-between">
                <div
                    data-tooltip-id={tooltipId}
                    data-tooltip-float
                    className="d-flex align-items-center gap-3"
                >
                    <Image
                        src={item.mediaUrl}
                        alt="item-icon"
                        className="item-card-icon"
                    />
                    <span style={{ ...styles.itemName, color: nameColor }}>
                        {item.itemName}
                    </span>
                    <Tooltip id={tooltipId} className="tooltip-inner">
                        <ItemCharacteristics itemId={item.itemId as number} />
                    </Tooltip>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <AuctionItemDetails
                        className="card-tooltip"
                        itemId={item?.itemId as number}
                        auctionHouseId={auctionHouseId}
                    />
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="transparent"
                            className="border-0 bg-transparent p-0"
                        >
                            <FaEllipsisVertical />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={() => showItemDetails(item)}
                            >
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
