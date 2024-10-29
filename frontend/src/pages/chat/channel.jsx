/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Channel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { show: false };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(({ show }) => ({ show: !show }));
  }

  render() {
    const {
      name,
      id,
      removable,
      active,
    } = this.props;
    const btnClass = classNames('w-100', 'mb-1', 'rounded-3', 'text-start', 'btn', { 'btn-secondary': active });

    if (!removable) {
      return (
        <li id={id} className="nav-item w-100">
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
    const { show } = this.state;

    return (
      <li id={id} className="nav-item w-100">
        <div className="d-flex dropdown btn-group">
          <button
            className={btnClass}
            type="button"
          >
            <span>#</span>
            {name}
          </button>
          <button
            onClick={this.handleClick}
            className={classNames('flex-grow-0', 'btn', 'dropdown-toggle-split', 'dropdown-toggle', { show })}
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded={show}
          >
            <span className="visually-hidden">Chanel control</span>
          </button>
          <ul
            className={classNames('dropdown-menu', { show })}
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
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  removable: PropTypes.bool,
};

Channel.defaultProps = {
  active: false,
  removable: true,
};

export default Channel;