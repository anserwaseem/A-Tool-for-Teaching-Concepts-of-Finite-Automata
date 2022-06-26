import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/NavBar.css";

const NavBar = ({ pageName }) => {
  return (
    <Navbar expand="lg" sticky="top" className="dark-bg">
      <Container fluid className="mx-5">
        <Navbar.Brand href="/" className="fs-2 fw-bold">
          A3S
        </Navbar.Brand>
        <Navbar.Text id="pageName">{pageName}</Navbar.Text>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="#home" className="fs-4 fw-light">
              What We Provide?
            </Nav.Link>
            <Nav.Link href="#link" className="fs-4 fw-light">
              Help
            </Nav.Link>
            <NavDropdown
              title={<span id="editor-dropdown">Editor</span>}
              className="fs-4"
            >
              <NavDropdown.Item href="#action/3.1">
                <Nav.Link as={Link} to="/EditStates">
                  Using States and Transitions
                </Nav.Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Nav.Link as={Link} to="/EditTransitionTable">
                  Using Transition Table
                </Nav.Link>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
