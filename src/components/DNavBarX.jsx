import React from "react";
import { Navbar, Nav } from "react-bootstrap";


function DNavBar() {
    return (
        <div>
            <Navbar bg="light" expand="md">
                <Navbar.Brand
                    href="/"
                    style={{
                        fontFamily: "Exo",
                        fontSize: "XX-Large",
                        color: "#2b2b2a",
                    }}
                >
                    iBoard
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link>
                            Home
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default DNavBar;