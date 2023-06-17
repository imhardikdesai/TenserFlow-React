import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    // create a navbar
    <nav>
      <ul></ul>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">ML</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link className="navLink" to="/object">
                Object Detection
              </Link>
              <Link className="navLink" to="/face">
                Face Detection
              </Link>
              <Link className="navLink" to="/body">
                Body Segmentation
              </Link>
              <Link className="navLink" to="/hand">
                Hand Pose
              </Link>
              <Link className="navLink" to="/portrait">
                Portrait Depth Estimation
              </Link>
              <Link className="navLink" to="/text">
                Text Toxicity
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </nav>
  );
};

export default Home;
