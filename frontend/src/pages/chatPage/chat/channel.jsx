import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import axios from 'axios';

class Channel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleDeleteChannel = this.handleDeleteChannel.bind(this);
    this.handleRenameChannel = this.handleRenameChannel.bind(this);
  }

  handleClick(e) {
    const { setActive } = this.props;
    const { id } = e.target;
    if (id) {
      setActive(id);
      Cookies.set('active-channel', id, { sameSite: 'strict', expires: 31 });
    }
  }

  handleDeleteChannel(e) {
    const { handleErr } = this.props;
    const { id } = e.target;
    const activeId = Cookies.get('active-channel');

    if (activeId === id) Cookies.remove('active-channel');
    axios.delete(`/api/channels/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .catch(handleErr);
  }

  handleRenameChannel(e) {
    const { handleRename } = this.props;
    const { id } = e.target;

    handleRename({ type: 'rename', id });
  }

  render() {
    const {
      name,
      id,
      removable,
      activeChannel,
    } = this.props;

    const variant = activeChannel === id ? 'secondary' : 'none';
    const tooSmall = window.innerWidth < 768;
    if (!removable || tooSmall) {
      return (
        <div className="nav-item w-md-100 me-1 me-md-0 mb-md-1" style={{ 'min-width': 'fit-content' }}>
          <Button
            id={id}
            variant={variant}
            onClick={this.handleClick}
            className="rounded-3 w-100 text-start"
            type="button"
          >
            <span># </span>
            {name}
          </Button>
        </div>
      );
    }

    return (
      <div className="nav-item w-md-100 me-1 me-md-0 mb-md-1" style={{ 'min-width': 'fit-content' }}>
        <Dropdown as={ButtonGroup} className="w-100">
          <Button
            id={id}
            variant={variant}
            onClick={this.handleClick}
            className="rounded-3 w-100 text-start rounded-end-0"
            type="button"
          >
            <span># </span>
            {name}
          </Button>
          <Dropdown.Toggle
            split
            variant={variant}
            className="rounded-3 rounded-start-0"
            id="dropdown-split-basic"
          >
            <span className="visually-hidden">Toggle Dropdown</span>
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="rounded-3"
            style={{
              position: 'absolute',
              'min-width': '0px',
              'max-width': '100px',
              inset: '0px 0px auto auto',
              transform: 'translate(0px, 40px)',
            }}
          >
            <Dropdown.Item id={id} onClick={this.handleRenameChannel} href="#">Rename</Dropdown.Item>
            <Dropdown.Item id={id} onClick={this.handleDeleteChannel} href="#">Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

Channel.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  activeChannel: PropTypes.number.isRequired,
  handleRename: PropTypes.func.isRequired,
  setActive: PropTypes.func.isRequired,
  handleErr: PropTypes.func.isRequired,
  removable: PropTypes.bool,
};

Channel.defaultProps = {
  removable: true,
};

export default Channel;
