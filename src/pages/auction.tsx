import Head from 'next/head'
import { useState } from 'react'
import { Container } from 'react-bootstrap'
import {
    ItemCharacteristics,
    RealmPicker,
    FactionPicker,
    RegionPicker,
    ItemPicker,
    AuctionItemDetails,
    ItemLatestPricesGraph,
} from '../components'
import { FACTION, REGION } from '../utils/constants'

const Auction = () => {
    const [itemId, setItemId] = useState<number | null>(null)
    const [faction, setFaction] = useState<string>(FACTION.ALLIANCE)
    const [region, setRegion] = useState<string>(REGION.EUROPE)
    const [auctionHouseId, setAuctionHouseId] = useState<number | null>()

    return (
        <>
            <Head>
                <title>SoD Auction House Tracker</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container className="container-top-margin main-container p-5">
                <h1>SoD Auction tracker</h1>
                <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
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
                <ItemPicker
                    className="item-picker"
                    itemId={itemId}
                    setItemId={setItemId}
                />
                <div className="auction-core-container d-flex justify-content-between gap-5 w-100 my-5">
                    <div className="w-50 align-items-start justify-content-between auction-item-container">
                        {itemId && <ItemCharacteristics itemId={itemId} />}
                        {itemId && auctionHouseId && (
                            <div className="auction-item-details-margin">
                                <AuctionItemDetails
                                    itemId={itemId}
                                    auctionHouseId={auctionHouseId}
                                />
                            </div>
                        )}
                    </div>
                    {itemId && auctionHouseId && (
                        <ItemLatestPricesGraph
                            className="w-50"
                            itemId={itemId}
                            auctionHouseId={auctionHouseId}
                        />
                    )}
                </div>
            </Container>
        </>
    )
}

export default Auction
