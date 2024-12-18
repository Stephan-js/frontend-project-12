import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import React from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { Formik } from "formik";
import axios from "axios";

class ModalInput extends React.PureComponent {
  render() {
    const { handleServerError, hide, show, data } = this.props;

    return (
      <Modal
        className="rounded-3"
        aria-labelledby="modal-title"
        centered
        show={show}
        onHide={hide}
      >
        <Modal.Header>
          <Modal.Title id="modal-title">
            {data.type !== "add" ? "Rename channel" : "Add chanel"}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ channelName: "" }}
          validate={({ channelName }) => {
            const errors = {};
            if (!channelName) {
              errors.channelName = "Requaired";
              return errors;
            }
            if (channelName.length < 3) {
              errors.channelName = "Need to be at least 3 characters";
              return errors;
            }
            const eachWord = channelName.split(" ");

            if (eachWord.length > 2) {
              errors.channelName = "Too long!";
              return errors;
            }
            eachWord.forEach((word) => {
              if (word.length > 9) {
                errors.channelName = "Too long!";
              }
            });

            return errors;
          }}
          onSubmit={({ channelName }, { resetForm }) => {
            resetForm();
            const channelData = { name: channelName };

            if (data.type !== "add") {
              axios
                .patch(`/api/channels/${data.id}`, channelData, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                })
                .then(() => {
                  toast("Channel has been renamed!", {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                      </svg>
                    ),
                  });
                })
                .catch(handleServerError);
            } else {
              axios
                .post("/api/channels", channelData, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                })
                .then(() => {
                  toast("Channel has been added!", {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                      </svg>
                    ),
                  });
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
                  <Form.Label
                    id="channelName-label"
                    htmlFor="channelName-input"
                  >
                    Channel Name
                  </Form.Label>
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

ModalInput.propTypes = {
  data: PropTypes.isRequired,
  show: PropTypes.isRequired,
  hide: PropTypes.isRequired,
  handleServerError: PropTypes.isRequired,
};

export default ModalInput;
