import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Table, Container, Image } from 'react-bootstrap'

const Auction = () => {
    const [realms, setRealms] = useState(null)

    const fetchRealms = () => {
        axios
            .get('/api/v1/tsm/fetch_realms')
            .then(({ data }) => setRealms(data))
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
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
            </Container>
        </>
    )
}

export default Auction
