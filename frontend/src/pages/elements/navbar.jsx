import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

import React from "react";

class NavbarMenu extends React.PureComponent {
  render() {
    return (
      <Navbar expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/">Chat App</Navbar.Brand>
          {localStorage.getItem("token") ? (
            <Button
              variant="outline-dark"
              className="rounded-3"
              type="submit"
              onClick={() => {
                localStorage.removeItem("token");
                document.location.href = "/login";
              }}
            >
              Log Out
            </Button>
          ) : null}
        </Container>
      </Navbar>
    );
  }
}

export default NavbarMenu;
