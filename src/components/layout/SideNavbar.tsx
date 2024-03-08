import React from 'react'
import { Nav, Navbar, Image } from 'react-bootstrap'
import { FaRegChartBar } from 'react-icons/fa'
import { RiLineChartLine } from 'react-icons/ri'
import { useRouter } from 'next/router'

const SideNavbar: React.FC = () => {
    const router = useRouter()

    const isActive = (href: string) => router.pathname === href

    return (
        <div className="d-flex">
            <div className=" side-navbar bg-body-tertiary custom-navbar">
                <div className="navbar-brand-container">
                    <Navbar.Brand href="/" className="mb-5">
                        <Image
                            src="/logo.png"
                            width="80"
                            height="40"
                            alt="Logo"
                        />
                    </Navbar.Brand>
                </div>
                <Nav defaultActiveKey="/home" className="flex-column">
                    <Nav.Link
                        href="/auction"
                        className={
                            isActive('/auction')
                                ? 'custom-navbar-active'
                                : 'custom-navbar-inactive'
                        }
                    >
                        <RiLineChartLine className="mr-2" /> Auction House
                        Tracker
                    </Nav.Link>
                    <Nav.Link
                        href="/rankings"
                        className={
                            isActive('/rankings')
                                ? 'custom-navbar-active'
                                : 'custom-navbar-inactive'
                        }
                    >
                        <FaRegChartBar className="mr-2" /> Rankings
                    </Nav.Link>
                </Nav>
            </div>
        </div>
    )
}

export default SideNavbar
