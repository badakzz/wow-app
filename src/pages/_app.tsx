import type { AppProps } from 'next/app'
import { ToastProvider } from '../components'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ToastProvider>
            <Component {...pageProps} />
        </ToastProvider>
    )
}
