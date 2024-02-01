import Head from 'next/head'
import { useState } from 'react'
import { Container, Image, Button, Form } from 'react-bootstrap'
import {
    AuctionHouseItem,
    RealmPicker,
    FactionPicker,
    RegionPicker,
} from '../components'
import { FACTION, REGION } from '../utils/constants'

const Auction = () => {
    const [itemId, setItemId] = useState<number | null>(null)
    const [faction, setFaction] = useState<string>(FACTION.ALLIANCE)
    const [region, setRegion] = useState<string>(REGION.EUROPE)
    const [auctionHouseId, setAuctionHouseId] = useState<number | null>(null)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemId(Number(event.target.value))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    return (
        <>
            <Head>
                <title>Wow App</title>
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
                        <RegionPicker region={region} setRegion={setRegion} />
                        <FactionPicker
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
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="itemId">
                        <Form.Label>Item ID</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter Item ID"
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                {itemId !== null && <AuctionHouseItem itemId={itemId} />}
            </Container>
        </>
    )
}

export default Auction
