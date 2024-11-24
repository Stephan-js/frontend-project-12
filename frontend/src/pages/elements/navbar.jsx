import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
// import Dropdown from 'react-bootstrap/Dropdown';

import React from 'react';
// import PropTypes from 'prop-types';

class NavbarMenu extends React.PureComponent {
  render() {
    return (
      <Navbar expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/">Chat App</Navbar.Brand>
          {/* <Dropdown>
            <Dropdown.Toggle variant="none" id="dropdown-basic">
              Settings
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="rounded-3"
              style={{
                position: 'absolute',
                'min-width': '0px',
                width: '93px',
                inset: '0px 2px auto auto',
                transform: 'translate(0px, 40px)',
              }}
            >
              <Dropdown.Item href="#/action-1">Log Out</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#/action-2">Rename</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
        </Container>
      </Navbar>
    );
  }
}

export default NavbarMenu;
