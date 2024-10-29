/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Channel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { show: false };

    this.handleClick = this.handleClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleClick() {
    this.setState(({ show }) => ({ show: !show }));
  }

  handleBlur() {
    this.setState({ show: false });
  }

  render() {
    const {
      name,
      id,
      removable,
      active,
    } = this.props;

    if (!removable) {
      return (
        <li id={id} className="nav-item w-100 mb-1">
          <button
            className={classNames('w-100', 'rounded-3', 'text-start', 'btn', { 'btn-secondary': active })}
            type="button"
          >
            <span># </span>
            {name}
          </button>
        </li>
      );
    }
    const { show } = this.state;

    return (
      <li id={id} className="nav-item w-100 mb-1">
        <div className="d-flex btn-group">
          <button
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
            onClick={this.handleClick}
            onBlur={this.handleBlur}
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
            <li><a className="dropdown-item" href="#">Rename</a></li>
            <li><a className="dropdown-item" href="#">Delete</a></li>
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
