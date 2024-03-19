import { useState, useRef, useEffect, CSSProperties } from 'react'
import {
    // ItemCharacteristics,
    RealmPicker,
    FactionPicker,
    RegionPicker,
    ItemPicker,
    // AuctionItemDetails,
    // ItemLatestPricesGraph,
    Layout,
    ItemCard,
} from '../components'
import {
    FaPlusCircle,
    //  FaEye
} from 'react-icons/fa'
import { FACTION, REGION } from '../utils/constants'
import { Item } from '@/utils/types'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const Auction = () => {
    const [item, setItem] = useState<Item | null>(null)

    const [faction, setFaction] = useState<string>(FACTION.ALLIANCE)
    const [region, setRegion] = useState<string>(REGION.EUROPE)
    const [auctionHouseId, setAuctionHouseId] = useState<number | null>()
    const [trackedItems, setTrackedItems] = useState<Item[]>([])
    const itemPickerRef = useRef<any>(null)

    useEffect(() => {
        // Attempt to retrieve the stored items
        const storedData = localStorage.getItem('trackedItems')
        console.log('Retrieved from localStorage:', storedData) // Debug log

        if (storedData) {
            // Parse the stored JSON, or fallback to an empty array if parsing fails
            const parsedData = JSON.parse(storedData) || []
            console.log('Parsed data:', parsedData) // Debug log

            setTrackedItems(parsedData)
        }
    }, [])

    const onDragEnd = (result: any) => {
        if (!result.destination) return
        const items = [...trackedItems]
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        setTrackedItems(items)
    }

    const handleNewItem = (newItem: Item) => {
        // Check if the new item already exists in the trackedItems array based on itemId
        const itemExists = trackedItems.some(
            (item) => item.itemId === newItem.itemId
        )

        if (!itemExists) {
            // If the item doesn't exist, add it to trackedItems and update localStorage
            const newTrackedItems = [...trackedItems, newItem]
            setTrackedItems(newTrackedItems)
            localStorage.setItem(
                'trackedItems',
                JSON.stringify(newTrackedItems)
            )
        }
    }

    const focusItemPicker = () => {
        if (itemPickerRef.current) {
            itemPickerRef.current.focus()
        }
    }

    useEffect(() => {
        if (item) {
            handleNewItem(item)
        }
    }, [item])

    const topComponents = (
        <div className="d-flex justify-content-between align-items-center w-100">
            <RealmPicker
                className="realm-picker"
                region={region}
                faction={faction}
                auctionHouseId={auctionHouseId}
                setAuctionHouseId={setAuctionHouseId}
            />
            <div className="d-flex gap-3">
                <RegionPicker
                    className="align-items-center text-align-center"
                    region={region}
                    setRegion={setRegion}
                />
                <FactionPicker
                    className="align-items-center text-align-center"
                    faction={faction}
                    setFaction={setFaction}
                />
            </div>
        </div>
    )

    return (
        <Layout
            title="SoD Auction House Tracker"
            topComponents={topComponents}
            topComponentsFlexClass="justify-content-between"
            topPicker={
                <ItemPicker
                    item={item}
                    setItem={setItem}
                    className="item-picker mb-4"
                />
            }
        >
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="items">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={styles.draggableWrapper}
                        >
                            {trackedItems.map((item, index) => (
                                <Draggable
                                    key={item.itemId as number}
                                    draggableId={String(item.itemId)}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                ...styles.draggable,
                                                ...provided.draggableProps
                                                    .style,
                                            }}
                                        >
                                            <ItemCard item={item} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <div className="no-items-placeholder" onClick={focusItemPicker}>
                <div className="d-flex align-items-center gap-3">
                    <FaPlusCircle />
                    <span>Add an item to track...</span>
                </div>
            </div>
        </Layout>
    )
}

const styles: { [key: string]: CSSProperties } = {
    draggableWrapper: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    draggable: {
        width: '100%',
    },
}

export default Auction
