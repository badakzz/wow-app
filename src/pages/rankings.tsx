import axios from 'axios'
import Head from 'next/head'
import { Container, Image } from 'react-bootstrap'

const Rankings = () => {
    axios
        .get('/api/v1/warcraftlogs/zones/latest_encounter')
        .then(({ data }) => data)

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
                <div className="d-flex align-items-center justify-content-center">
                    <div className="flex-half text-align-start">
                        <h1 className="mb-5">
                            WoW Season of Discovery Companion
                        </h1>
                    </div>
                    <div className="flex-half d-flex align-items-center justify-content-center">
                        <Image
                            src="/wowsodlogo.png "
                            alt="wowsodlogo"
                            width="70%"
                        ></Image>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default Rankings
