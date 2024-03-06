import React from 'react'
import { Container, Nav, Navbar, Image } from 'react-bootstrap'

type Props = {
    children?: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary custom-navbar">
                <Container fluid>
                    <Navbar.Brand href="/">
                        <Image
                            src="/logo.png"
                            width="80"
                            height="40"
                            className="d-inline-block align-top mr-2"
                            alt="Logo"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {/* <Nav.Link href="#link">Blue Post Tracker</Nav.Link> */}
                            <Nav.Link href="auction">
                                Auction House Tracker
                            </Nav.Link>
                            {/* <Nav.Link href="#link">Runes</Nav.Link> */}
                            <Nav.Link href="rankings">Rankings</Nav.Link>
                            {/* <Nav.Link href="#link">BiS List</Nav.Link> */}
                            {/* <NavDropdown
                                title="Dropdown"
                                id="basic-nav-dropdown"
                            >
                                <NavDropdown.Item href="#action/3.1">
                                    Action
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">
                                    Something
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">
                                    Separated link
                                </NavDropdown.Item>
                            </NavDropdown> */}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {children}
        </>
    )
}

export default Layout
