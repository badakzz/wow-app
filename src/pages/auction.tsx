import { useState, useRef, useEffect } from 'react'
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
    const [itemId, setItemId] = useState<number | null>(null)
    const [faction, setFaction] = useState<string>(FACTION.ALLIANCE)
    const [region, setRegion] = useState<string>(REGION.EUROPE)
    const [auctionHouseId, setAuctionHouseId] = useState<number | null>()
    const [trackedItems, setTrackedItems] = useState<Item[]>([])
    const itemPickerRef = useRef<any>(null)

    useEffect(() => {
        // Load saved items from localStorage
        const itemsFromStorage = JSON.parse(
            localStorage.getItem('trackedItems') || '[]'
        )
        setTrackedItems(itemsFromStorage)
    }, [])

    useEffect(() => {
        // Save tracked items to localStorage whenever they change
        localStorage.setItem('trackedItems', JSON.stringify(trackedItems))
    }, [trackedItems])

    const onDragEnd = (result) => {
        if (!result.destination) return
        const items = Array.from(trackedItems)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        setTrackedItems(items)
    }

    // This function could be called when a new item is selected from the ItemPicker
    const handleNewItem = (newItemId) => {
        if (!trackedItems.includes(newItemId)) {
            setTrackedItems([...trackedItems, newItemId])
        }
    }

    const focusItemPicker = () => {
        if (itemPickerRef.current) {
            itemPickerRef.current.focus()
        }
    }

    useEffect(() => {
        if (itemId) {
            handleNewItem(itemId)
        }
    }, [itemId])

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
                    selectRef={itemPickerRef}
                    className="item-picker mb-4"
                    itemId={itemId}
                    setItemId={setItemId}
                />
            }
        >
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="items">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {trackedItems.map((id, index) => (
                                <Draggable
                                    key={id}
                                    draggableId={String(id)}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <ItemCard itemId={id} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            {!itemId && (
                <div className="no-items-placeholder" onClick={focusItemPicker}>
                    <div className="d-flex align-items-center gap-3">
                        <FaPlusCircle />
                        <span>Add an item to track...</span>
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default Auction
