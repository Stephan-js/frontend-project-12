import React from 'react';
import PropTypes from 'prop-types';

class Message extends React.PureComponent {
  render() {
    const { user, message } = this.props;
    return (
      <div className="text-break mb-2">
        <b>{user}</b>
        {': '}
        {message}
      </div>
    );
  }
}

Message.propTypes = {
  user: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default Message;
