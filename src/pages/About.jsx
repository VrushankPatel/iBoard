import { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Navbar, Nav } from "react-bootstrap";

class About extends Component {
  constructor(props) {
    super();
    this.state = {
      foreground: localStorage.darkMode === "true" ? "lightgrey" : "black",
      navbarTheme: localStorage.darkMode === "true" ? "dark" : "light",
    };
  }
  render() {
    const txtStyle = {
      fontSize: "xxx-large",
      fontWeight: "200",
      color: "#363634",
      fontFamily: "Exo",
    };
    const subTxtStyle = {
      fontSize: "xx-large",
      fontWeight: "200",
      color: "#363634",
      fontFamily: "Exo",
    };
    const colStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }

    return (
      <div>
        <Navbar bg={this.state.navbarTheme} expand="md">
          <Navbar.Brand
            href="/"
            style={{
              fontFamily: "Exo",
              fontSize: "XX-Large",
              color: this.state.foreground,
            }}
          >
            iBoard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link style={{ color: this.state.foreground }} href="/">
                Home
              </Nav.Link>
              <Nav.Link style={{ color: this.state.foreground }} href="/About" >
                About
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Container>
          <Row className="justify-content-center">
            <Col
              lg={12}
              style={colStyle}
            >
              <Row>
                <h3
                  className="pt-5"
                  style={txtStyle}
                >
                  iBoard v1.0.0
                </h3>
              </Row>
            </Col>
            <Col
              lg={12}
              style={colStyle}
            >
              <Row>
                <h3 style={subTxtStyle}>
                  Developed and Maintained By :
                  <a style={{ textDecoration: "none" }} target="_blank" rel="noreferrer" href="https://vrushankpatel.github.io/"> Vrushank Patel</a>
                </h3>
              </Row>
            </Col>
            {/* <Col
            lg={4}
            className="pt-5"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CUploadPicture />
          </Col> */}
          </Row>
        </Container >
      </div>
    );
  }
}

export default About;
