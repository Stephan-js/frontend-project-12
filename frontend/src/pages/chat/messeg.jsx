import React from 'react';
import PropTypes from 'prop-types';

class Message extends React.PureComponent {
  render() {
    const { id, username, body } = this.props;
    return (
      <div id={id} className="text-break mb-2">
        <b>{username}</b>
        {': '}
        {body}
      </div>
    );
  }
}

Message.propTypes = {
  id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default Message;
