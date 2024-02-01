import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/global.css'
import { Layout } from '../components'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
}
