import { Layout } from '@/components'
import { Image } from 'react-bootstrap'

const Home = () => {
    return (
        <Layout title="SoD Wow App">
            <div className="d-flex align-items-center justify-content-center">
                <div className="flex-half text-align-start">
                    <h1 className="mb-5">WoW Season of Discovery Companion</h1>
                    <p>Welcome to our app for World of Warcaft SoD.</p>
                    <p>
                        Here, you will be able to track auction house item
                        prices in real time on any server/faction, and quickly
                        get a record of the best performing classes and specs in
                        the different raids.
                    </p>
                </div>
                <div className="flex-half d-flex align-items-center justify-content-center">
                    <Image
                        src="/wowsodlogo.png "
                        alt="wowsodlogo"
                        width="70%"
                    ></Image>
                </div>
            </div>
            <div className="d-flex flex-column justify-content-start mt-5 gap-3">
                <a href="auction" className="home-links">
                    Auction house tracker
                </a>
                <a href="rankings" className="home-links">
                    Rankings
                </a>
            </div>
        </Layout>
    )
}

export default Home
