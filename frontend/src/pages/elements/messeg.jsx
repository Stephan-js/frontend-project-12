import React from "react";
import PropTypes from "prop-types";

class Message extends React.PureComponent {
  render() {
    const { username, messege, id } = this.props;
    return (
      <div id={id} className="text-break mb-2">
        <b>{username}</b>
        {": "}
        {messege}
      </div>
    );
  }
}

Message.propTypes = {
  username: PropTypes.string.isRequired,
  messege: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default Message;
