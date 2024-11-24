import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import React from 'react';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';

class NavbarMenu extends React.PureComponent {
  render() {
    return (
      <Navbar expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/">Chat App</Navbar.Brand>
          {/* <NavDropdown
            title="Settings"
            className="rounded-3"
            id="collapsible-nav-dropdown"
            menuRole={{
              position: 'absolute',
              'min-width': '0px',
              'max-width': '100px',
              inset: '0px 0px auto auto',
              transform: 'translate(0px, 40px)',
            }}
          >
            <NavDropdown.Item href="#action/3.1">Log Out</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.2">Rename</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Delete</NavDropdown.Item>
          </NavDropdown> */}
        </Container>
      </Navbar>
    );
  }
}

export default NavbarMenu;
