/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Channel extends React.PureComponent {
  render() {
    const { name, active, menu } = this.props;
    const btnClass = classNames('w-100', 'mb-1', 'rounded-3', 'text-start', 'btn', { 'btn-secondary': active });
    if (!menu) {
      return (
        <li className="nav-item w-100">
          <button
            className={btnClass}
            type="button"
          >
            <span>#</span>
            {name}
          </button>
        </li>
      );
    }
    return (
      <li className="nav-item w-100">
        <div className="d-flex dropdown btn-group">
          <button
            className={btnClass}
            type="button"
          >
            <span>#</span>
            {name}
          </button>
          <button
            className="flex-grow-0 btn dropdown-toggle-split dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="visually-hidden">Chanel control</span>
          </button>
          <ul
            className="dropdown-menu"
            style={{ position: 'absolute', inset: '0px 0px auto auto', transform: 'translate(0px, 40px)' }}
          >
            <li><a className="dropdown-item" href="#">Delete</a></li>
            <li><a className="dropdown-item" href="#">Rename</a></li>
          </ul>
        </div>
      </li>
    );
  }
}

Channel.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  menu: PropTypes.bool,
};

Channel.defaultProps = {
  active: false,
  menu: false,
};

export default Channel;
