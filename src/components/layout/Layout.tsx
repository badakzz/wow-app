import React from 'react'
import { Container } from 'react-bootstrap'
import Head from 'next/head'
import { SideNavbar } from '..'

type Props = {
    title: string
    children?: React.ReactNode
}

const Layout: React.FC<Props> = ({ title, children }) => {
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
                <Container className="container-top-margin main-container p-5">
                    {children}
                </Container>
            </div>
        </>
    )
}

export default Layout
