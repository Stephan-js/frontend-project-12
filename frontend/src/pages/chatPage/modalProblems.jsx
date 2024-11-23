import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import React from 'react';
import PropTypes from 'prop-types';

class ModalMini extends React.PureComponent {
  render() {
    const { problem, show, reconnect } = this.props;

    const loginP = problem === 'login';
    return (
      <Modal
        className="rounded-3"
        centered
        show={show}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Oops!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loginP ? 'It looks like you were signed out of your account. Please sign in again.'
            : 'It looks like you lost connection with the server. Please try reconnect or come back later!'}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-3"
            variant={loginP ? 'dark' : 'danger'}
            onClick={loginP ? () => { document.location.href = '/login'; } : reconnect}
          >
            {loginP ? 'To Login' : 'Reconnect'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ModalMini.propTypes = {
  problem: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  reconnect: PropTypes.func.isRequired,
};

export default ModalMini;
