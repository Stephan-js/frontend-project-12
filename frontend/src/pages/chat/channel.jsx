/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Channel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { show: false };

    this.handleClick = this.handleClick.bind(this);
    this.handleClickMenu = this.handleClickMenu.bind(this);
    this.handleDeleteChannel = this.handleDeleteChannel.bind(this);
    this.handleRenameChannel = this.handleRenameChannel.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleClick(e) {
    const { setActive } = this.props;
    const { id } = e.target;
    if (id) setActive(id);
  }

  handleClickMenu() {
    this.setState(({ show }) => ({ show: !show }));
  }

  handleBlur() {
    this.setState({ show: false });
  }

  handleDeleteChannel(e) {
    const { handleErr } = this.props;
    const { id } = e.target;

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
    const active = activeChannel === id;

    if (!removable) {
      return (
        <div className="nav-item w-md-100 me-1 me-md-0 mb-md-1" style={{ 'min-width': 'fit-content' }}>
          <button
            id={id}
            onClick={this.handleClick}
            className={classNames('w-100', 'rounded-3', 'text-start', 'btn', { 'btn-secondary': active })}
            type="button"
          >
            <span># </span>
            {name}
          </button>
        </div>
      );
    }
    const { show } = this.state;

    return (
      <div className="nav-item w-md-100 me-1 me-md-0 mb-md-1" style={{ 'min-width': 'fit-content' }}>
        <div className="d-flex btn-group">
          <button
            id={id}
            onClick={this.handleClick}
            className={classNames(
              'w-100',
              'rounded-3',
              'rounded-end-0',
              'text-start',
              'btn',
              { 'btn-secondary': active },
            )}
            type="button"
          >
            <span># </span>
            {name}
          </button>
          <button
            onClick={this.handleClickMenu}
            // onBlur={this.handleBlur}
            className={classNames(
              'flex-grow-0',
              'rounded-3',
              'rounded-start-0',
              'btn',
              'dropdown-toggle-split',
              'dropdown-toggle',
              { show, 'btn-secondary': active },
            )}
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded={show}
          >
            <span className="visually-hidden">Toggle Dropdown</span>
          </button>
          <ul
            className={classNames('dropdown-menu', 'rounded-3', { show })}
            style={{
              position: 'absolute',
              'min-width': '0px',
              'max-width': '100px',
              inset: '0px 0px auto auto',
              transform: 'translate(0px, 40px)',
            }}
          >
            <li><a id={id} className="dropdown-item" onClick={this.handleRenameChannel} href="#">Rename</a></li>
            <li><a id={id} className="dropdown-item" onClick={this.handleDeleteChannel} href="#">Delete</a></li>
          </ul>
        </div>
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
