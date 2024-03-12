import React from 'react'
import { Container } from 'react-bootstrap'
import Head from 'next/head'
import { SideNavbar } from '..'

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
                <SideNavbar />
                <div className="d-flex flex-column">
                    <div
                        className={`top-components-container ${topComponentsFlexClass}`}
                    >
                        {topComponents}
                    </div>
                    {topPicker && topPicker}
                    <Container className="container-top-margin main-container p-5">
                        {children}
                    </Container>
                </div>
            </div>
        </>
    )
}

export default Layout
