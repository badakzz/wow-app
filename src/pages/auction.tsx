import Head from 'next/head'
import { useState } from 'react'
import { Container } from 'react-bootstrap'
import {
    ItemCharacteristics,
    RealmPicker,
    FactionPicker,
    RegionPicker,
    ItemPicker,
    ItemPricingDifferential,
    AuctionItemDetails,
} from '../components'
import { FACTION, REGION } from '../utils/constants'

const Auction = () => {
    const [itemId, setItemId] = useState<number | null>(null)
    const [faction, setFaction] = useState<string>(FACTION.ALLIANCE)
    const [region, setRegion] = useState<string>(REGION.EUROPE)
    const [auctionHouseId, setAuctionHouseId] = useState<number | null>(null)

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

                <ItemPicker itemId={itemId} setItemId={setItemId} />
                <div className="d-flex flex-row gap-3 my-5">
                    {itemId && <ItemCharacteristics itemId={itemId} />}
                    {itemId && auctionHouseId && (
                        <AuctionItemDetails
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
