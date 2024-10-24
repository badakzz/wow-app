import { Container } from 'react-bootstrap'
import Head from 'next/head'
import { ResponsiveNavbar } from '..'

type Props = {
    title: string
    topComponents?: React.ReactNode
    children?: React.ReactNode
    topComponentsFlexClass?: string
    topPicker?: React.ReactNode
}

const Layout: React.FC<Props> = ({
    title,
    topComponents,
    children,
    topComponentsFlexClass = '',
    topPicker,
}) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="layout-grid">
                <ResponsiveNavbar />
                <div className="main-content-container">
                    <div className="content-wrapper">
                        {topComponents && (
                            <div
                                className={`top-components-container ${topComponentsFlexClass}`}
                            >
                                {topComponents}
                            </div>
                        )}
                        {topPicker && topPicker}
                        <Container
                            className={`${
                                topComponents
                                    ? 'container-top-margin'
                                    : 'home-container-top-margin'
                            } main-container`}
                        >
                            {children}
                        </Container>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Layout
