import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Table, Container, Image, Button, Form } from 'react-bootstrap'
import { AuctionHouseItem } from '@/components'

interface Realm {
    items: {
        auctionHouses: Array<any>
        locale: string
        localizedName: string
        name: string
        realmId: number
        gameVersion: string
    }[]
}

const Auction = () => {
    const [realms, setRealms] = useState<Realm | null>(null)
    const [itemId, setItemId] = useState<number | null>(null)

    const fetchRealms = () => {
        axios
            .get('/api/v1/tsm/realms')
            .then(({ data }) => setRealms(data))
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemId(Number(event.target.value)) // Convert input value to a number
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    console.log(realms)

    useEffect(() => {
        fetchRealms()
    }, [])

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
                {realms && (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Server Name</th>
                                <th>Region</th>
                            </tr>
                        </thead>
                        <tbody>
                            {realms.items.map((realm, index) => (
                                <tr key={index}>
                                    <td>{realm.name}</td>
                                    <td>{realm.gameVersion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
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
