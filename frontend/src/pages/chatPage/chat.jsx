import Form from 'react-bootstrap/Form';

import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import Channel from './chat/channel';
import Message from './chat/messeg';

class Chat extends React.PureComponent {
  render() {
    const {
      setChanMenu,
      handleServerError,
      setActive,
      activeChannel,
      channels,
      messages,
    } = this.props;
    return (
      <div className="d-flex h-100 bg-white flex-column row flex-md-row">
        <div className="col-4 col-md-2 px-md-0 border-bottom border-md-end-0 border-md-right bg-light d-flex flex-row flex-md-column channels">
          <div className="d-flex mt-md-1 justify-content-between mb-md-2 ps-2 ps-md-4 pe-md-2 p-4">
            <b>Chaneles</b>
            <button
              onClick={() => setChanMenu({ type: 'add', id: undefined })}
              type="button"
              className="p-0 d-flex justify-content-center align-items-center ms-2 ms-md-0 text-primary btn"
              style={{ width: '20px', height: '20px' }}
            >
              +
            </button>
          </div>
          <div className="flex-nowrap d-flex flex-row flex-md-column px-2 mt-3 mt-md-0 mb-3 nav-pills overflow-auto h-75 w-100 d-block">
            {channels ? channels
              .map((info) => (
                <Channel
                  name={info.name}
                  id={info.id}
                  remremovable={info.remremovable}
                  activeChannel={activeChannel}
                  handleRename={(d) => setChanMenu(d)}
                  handleErr={(err) => handleServerError(err)}
                  setActive={(id) => setActive(id)}
                />
              )) : null}
          </div>
        </div>
        <div className="col p-0 messeges">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="mb-0">
                <b>
                  {channels ? channels
                    .filter(({ id }) => id === activeChannel)[0].name : null}
                </b>
              </p>
              <span className="text-muted">
                Meseges:
                {' '}
                {messages ? messages
                  .filter(({ channelId }) => channelId === activeChannel)
                  .length : '???'}
              </span>
            </div>
            <div className="overflow-auto px-5 ">
              {messages ? messages
                .filter(({ channelId }) => channelId === activeChannel)
                .map((info) => (
                  <Message
                    username={info.username}
                    id={info.id}
                    messege={info.body}
                  />
                )) : null}
            </div>
            <div className="mt-auto px-5 py-3">
              <Formik
                initialValues={{ messege: '' }}
                validationSchema={Yup.object({
                  messege: Yup.string()
                    .max(160, 'Must be 160 characters or less!')
                    .required('Required!'),
                })}
                onSubmit={({ messege }, { resetForm }) => {
                  resetForm();
                  const messegeData = { body: messege, channelId: activeChannel };
                  axios.post('/api/messages', messegeData, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                  })
                    .catch(handleServerError);
                }}
              >
                {({
                  values,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form className="py-1 border rounded-4" onSubmit={handleSubmit}>
                    <Form.Group className="p-1 input-group">
                      <Form.Control
                        required
                        className="shadow-none border-0 p-0 ps-2 form-control"
                        name="messege"
                        aria-label="New messege"
                        placeholder="Type here..."
                        value={values.messege}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <button
                        className="btn btn-group-vertical"
                        type="submit"
                        onSubmit={isSubmitting}
                      >
                        <span className="visually-hidden">Messege input</span>
                        =&gt;
                      </button>
                    </Form.Group>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Chat.propTypes = {
  setChanMenu: PropTypes.func.isRequired,
  handleServerError: PropTypes.func.isRequired,
  setActive: PropTypes.func.isRequired,
  activeChannel: PropTypes.string.isRequired,
  channels: PropTypes.isRequired,
  messages: PropTypes.isRequired,
};

export default Chat;
