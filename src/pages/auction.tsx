import { useState, useRef } from 'react'
import {
    ItemCharacteristics,
    RealmPicker,
    FactionPicker,
    RegionPicker,
    ItemPicker,
    AuctionItemDetails,
    ItemLatestPricesGraph,
    Layout,
} from '../components'
import { FaPlusCircle, FaEye } from 'react-icons/fa'
import { FACTION, REGION } from '../utils/constants'

const Auction = () => {
    const [itemId, setItemId] = useState<number | null>(null)
    const [faction, setFaction] = useState<string>(FACTION.ALLIANCE)
    const [region, setRegion] = useState<string>(REGION.EUROPE)
    const [auctionHouseId, setAuctionHouseId] = useState<number | null>()
    const [graphVisibility, setGraphVisibility] = useState<boolean>(false)
    const itemPickerRef = useRef<any>(null)

    console.log(graphVisibility)
    const focusItemPicker = () => {
        if (itemPickerRef.current) {
            itemPickerRef.current.focus()
        }
    }

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
            {/* {localStorage && <></>} */}
            {!itemId && (
                <div className="no-items-placeholder" onClick={focusItemPicker}>
                    <div className="d-flex align-items-center gap-3">
                        <FaPlusCircle />
                        <span>Add an item to track...</span>
                    </div>
                </div>
            )}
            <div className="auction-core-container w-100 my-5">
                <div className="flex-column w-50 align-items-start auction-item-container">
                    {itemId && <ItemCharacteristics itemId={itemId} />}
                    <div className="d-flex flex-column justify-content-end">
                        {itemId && auctionHouseId && (
                            <div className="auction-item-details-margin">
                                <AuctionItemDetails
                                    itemId={itemId}
                                    auctionHouseId={auctionHouseId}
                                />
                            </div>
                        )}
                    </div>
                </div>
                {itemId && auctionHouseId && (
                    <FaEye onClick={() => setGraphVisibility(true)} />
                )}
                {graphVisibility && itemId && auctionHouseId && (
                    <ItemLatestPricesGraph
                        className="w-50"
                        itemId={itemId}
                        auctionHouseId={auctionHouseId}
                    />
                )}
            </div>
        </Layout>
    )
}

export default Auction
