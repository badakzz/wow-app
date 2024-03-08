import { Layout } from '@/components'
import { Image } from 'react-bootstrap'

const Home = () => {
    return (
        <Layout title="SoD Wow App">
            <div className="d-flex align-items-center justify-content-center">
                <div className="flex-half text-align-start">
                    <h1 className="mb-5">WoW Season of Discovery Companion</h1>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                </div>
                <div className="flex-half d-flex align-items-center justify-content-center">
                    <Image
                        src="/wowsodlogo.png "
                        alt="wowsodlogo"
                        width="70%"
                    ></Image>
                </div>
            </div>
        </Layout>
    )
}

export default Home
