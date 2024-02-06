import Head from 'next/head'
import { useState } from 'react'
import { Container } from 'react-bootstrap'
import {
    ItemDetails,
    RealmPicker,
    FactionPicker,
    RegionPicker,
    ItemPicker,
    ItemPriceDifferential,
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
                <title>Auction House Tracker</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container className="container-top-margin main-container p-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h1>Auction tracker</h1>
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
                <RealmPicker
                    region={region}
                    faction={faction}
                    auctionHouseId={auctionHouseId}
                    setAuctionHouseId={setAuctionHouseId}
                />
                <ItemPicker itemId={itemId} setItemId={setItemId} />
                <div className="d-flex flex-row gap-3 my-5">
                    {itemId && <ItemDetails itemId={itemId} />}
                    {itemId && auctionHouseId && (
                        <ItemPriceDifferential
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
