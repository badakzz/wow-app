import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Table, Container, Image, Button } from 'react-bootstrap'

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
    const [img, setImg] = useState<string | null>(null)

    const fetchRealms = () => {
        axios
            .get('/api/v1/tsm/fetch_realms')
            .then(({ data }) => setRealms(data))
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }

    console.log(realms)

    const fetchImage = async () => {
        try {
            const response = await axios.get('/api/v1/wow/fetch_items/')
            const imageUrl = response.data

            setImg(imageUrl)
            console.log('IMG', { imageUrl, img })
        } catch (error) {
            console.error('Error fetching image:', error)
        }
    }

    useEffect(() => {
        setRealms(fetchRealms() as any)
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
                <Button onClick={fetchImage}>Fetch Image</Button>
                {img && <Image src={img} />}
            </Container>
        </>
    )
}

export default Auction
