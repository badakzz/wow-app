import Head from 'next/head'
import { useState } from 'react'
import { Container, Image, Button, Form } from 'react-bootstrap'
import { AuctionHouseItem, RealmPicker, FactionPicker } from '../components'

const Auction = () => {
    const [itemId, setItemId] = useState<number | null>(null)
    const [faction, setFaction] = useState<string>('Alliance')
    const [auctionHouseId, setAuctionHouseId] = useState<number | null>(null)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemId(Number(event.target.value)) // Convert input value to a number
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    console.log('render', { faction, auctionHouseId })

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
            <Container className="container-top-margin custom-container p-5">
                <div className="d-flex align-items-center justify-content-center">
                    <div className="flex-half text-align-start">
                        <h1 className="mb-5">Auction tracker</h1>
                        If I speak
                    </div>
                    <div className="flex-half d-flex align-items-center justify-content-center">
                        <Image
                            src="/wowsodlogo.png "
                            alt="wowsodlogo"
                            width="70%"
                        ></Image>
                    </div>
                </div>
                <FactionPicker
                    className="faction-picker justify-content-end"
                    faction={faction}
                    setFaction={setFaction}
                />
                <RealmPicker
                    faction={faction}
                    auctionHouseId={auctionHouseId}
                    setAuctionHouseId={setAuctionHouseId}
                />
                {/* <Form onSubmit={handleSubmit}>
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
                {itemId !== null && <AuctionHouseItem itemId={itemId} />} */}
            </Container>
        </>
    )
}

export default Auction
