import Head from 'next/head'
import { Container } from 'react-bootstrap'

export default function Home() {
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
            <Container>
                <div>First Commit</div>
            </Container>
        </>
    )
}
