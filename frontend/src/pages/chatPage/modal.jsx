import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import axios from 'axios';

class ModalS extends React.PureComponent {
  render() {
    const {
      handleServerError,
      hide,
      show,
      addOrRename,
      id,
    } = this.props;

    const rename = addOrRename !== 'add';
    return (
      <Modal
        className="rounded-3"
        aria-labelledby="modal-title"
        centered
        show={show}
        onHide={hide}
      >
        <Modal.Header>
          <Modal.Title id="modal-title">{rename ? 'Rename channel' : 'Add chanel'}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ channelName: '' }}
          validate={({ channelName }) => {
            const errors = {};
            if (!channelName) {
              errors.channelName = 'Requaired';
              return errors;
            } if (channelName.length < 3) {
              errors.channelName = 'Need to be at least 3 characters';
              return errors;
            }
            const eachWord = channelName.split(' ');

            if (eachWord.length > 2) {
              errors.channelName = 'Too long!';
              return errors;
            }
            eachWord.forEach((word) => {
              if (word.length > 9) {
                errors.channelName = 'Too long!';
              }
            });

            return errors;
          }}
          onSubmit={({ channelName }, { resetForm }) => {
            resetForm();
            const channelData = { name: channelName };

            if (rename) {
              axios.patch(`/api/channels/${id}`, channelData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              })
                .then(() => {
                  // Show uniq complite messege
                })
                .catch(handleServerError);
            } else {
              axios.post('/api/channels', channelData, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              })
                .then(() => {
                  // Show uniq complite messege
                })
                .catch(handleServerError);
            }

            hide();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className="form-floating">
                  <Form.Control
                    name="channelName"
                    id="channelName-input"
                    className="rounded-4"
                    aria-describedby="channelName-label"
                    placeholder="Channel Name"
                    type="text"
                    value={values.channelName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.channelName && !!errors.channelName}
                  />
                  <Form.Label id="channelName-label" htmlFor="channelName-input">Channel Name</Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.channelName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={hide}
                  type="button"
                  variant="secondary"
                  className="rounded-3"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onSubmit={isSubmitting}
                  variant="dark"
                  className="rounded-3"
                >
                  Save Channel
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}

ModalS.propTypes = {
  addOrRename: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  handleServerError: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default ModalS;
