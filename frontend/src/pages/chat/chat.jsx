/* eslint-disable no-unused-vars */
import React from 'react';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import { Formik } from 'formik';

import Message from './messeg';

class Chat extends React.PureComponent {
  render() {
    return (
      <div className="col p-0 h-100">
        <div className="d-flex flex-column h-100">
          <div className="bg-light mb-4 p-3 shadow-sm small">
            <p className="mb-0">
              <b>Chanel</b>
            </p>
            <span className="text-muted">
              Meseges: ??
            </span>
          </div>
          <div className="chat-messages overflow-auto px-5 ">
            <Message user="admin" message="Hewwwo :3" />
          </div>
          <div className="mt-auto px-5 py-3">
            <Formik
              initialValues={{ messege: '' }}
            >
              {({
                values,
                touched,
                errors,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form className="py-1 border rounded-2" onSubmit={handleSubmit}>
                  <div className="input-group has-validation">
                    <input
                      className="border-0 p-0 ps-2 form-control"
                      name="messege"
                      aria-label="New messege"
                      placeholder="Type here..."
                      value={values.messege}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <button
                      className="btn btn-group-vertical"
                      type="button"
                      onSubmit={isSubmitting}
                    >
                      <span className="visually-hidden">Messege input</span>
                      =&gt;
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
