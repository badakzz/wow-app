import { Navbar, Nav, Container, Image } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { RiLineChartLine } from 'react-icons/ri'
import { FaRegChartBar } from 'react-icons/fa'

const ResponsiveNavbar: React.FC = () => {
    const router = useRouter()

    const isActive = (href: string) => router.pathname === href

    return (
        <Navbar
            bg="dark"
            expand="xxl"
            className="responsive-navbar flex-xxl-column"
        >
            <Container className="navbar-container flex-grow-1 px-0">
                <div className="navbar-brand-container">
                    <Navbar.Brand href="/">
                        <Image
                            src="/logo.png"
                            width="80"
                            height="40"
                            alt="Logo"
                        />
                    </Navbar.Brand>
                </div>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse
                    className="responsive-navbar-collapse"
                    id="basic-navbar-nav"
                >
                    <Nav className="mr-auto flex-column">
                        <Nav.Link
                            href="/auction"
                            className={`responsive-navbar-nav-link ${
                                isActive('/auction')
                                    ? 'responsive-navbar-active'
                                    : 'responsive-navbar-inactive'
                            }`}
                        >
                            <div className="d-flex align-items-center gap-1">
                                <RiLineChartLine />
                                <span>Auction House Tracker</span>
                            </div>
                        </Nav.Link>
                        <Nav.Link
                            href="/rankings"
                            className={`responsive-navbar-nav-link ${
                                isActive('/rankings')
                                    ? 'responsive-navbar-active'
                                    : 'responsive-navbar-inactive'
                            }`}
                        >
                            <div className="d-flex flex-row align-items-center gap-1">
                                <FaRegChartBar />
                                <span>Rankings</span>
                            </div>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default ResponsiveNavbar
