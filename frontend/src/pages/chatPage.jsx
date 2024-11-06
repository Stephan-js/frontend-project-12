/* eslint-disable react/jsx-props-no-spreading */
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import io from 'socket.io-client';
import axios from 'axios';

import Channel from './chat/channel';
import Message from './chat/messeg';

function handleServerError(err) {
  if (err.status === 401) {
    document.location.href = '/login';
    localStorage.removeItem('token');
  } else {
    console.log(err);
  }
}

function ChatPage() {
  const socket = io(document.location.href);

  const [activeChannel, setActive] = useState(null);
  const [channels, setChanels] = useState(null);
  const [message, setMeseges] = useState([]);
  const [addChannelShow, setShowChanMenu] = useState(false);

  useEffect(() => {
    axios.get('/api/messages', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((resp) => {
        if (resp.data) setMeseges(resp.data);
        socket.on('newMessage', (newMessage) => setMeseges((prevMessages) => [...prevMessages, newMessage]));
      })
      .catch(handleServerError);
  }, []);

  useEffect(() => {
    axios.get('/api/channels', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((resp) => {
        const { data } = resp;
        setChanels(data);
        setActive(data[0].id);
        socket.on('newChannel', (newChannel) => setChanels((prevChannels) => [...prevChannels, newChannel]));
      })
      .catch(handleServerError);
  }, []);

  return (
    <div className="h-100 flex-column d-flex">
      <Modal
        className="rounded-3"
        aria-labelledby="modal-title"
        centered
        show={addChannelShow}
        onHide={() => setShowChanMenu(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="modal-title">Add chanel</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ channelName: '' }}
          validationSchema={Yup.object({
            channelName: Yup.string()
              .max(16, 'Must be 16 characters or less!')
              .matches(/^[a-zA-Z0-9-_ ]*$/, 'Please, enter valid characters.')
              .required('Required!'),
          })}
            // eslint-disable-next-line no-unused-vars
          onSubmit={({ channelName }, { resetForm }) => {
            resetForm();
            const channelData = { name: channelName, secret: false };
            axios.post('/api/channels', channelData, {
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
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className="form-floating">
                  <Form.Control
                    name="channelName"
                    id="channelName-input"
                    className="rounded-4"
                    aria-describedby="channelName-label"
                    placeholder="Channel Name"
                    type="text"
                    required
                    value={values.channelName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Form.Label id="channelName-label" htmlFor="channelName-input">Username</Form.Label>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit" onSubmit={isSubmitting} variant="primary">
                  Save Changes
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm">
        <div className="container">
          <a className="navbar-brand" href="/">Chat App</a>
        </div>
      </nav>
      <div className="h-100 container-fluid my-4 my-md-5 d-flex">
        <div className="container h-100 overflow-hidden align-self-center chat rounded-4 shadow">
          <div className="d-flex h-100 bg-white flex-column row flex-md-row">
            <div className="col-4 col-md-2 px-md-0 border-bottom border-md-end-0 border-md-right bg-light d-flex flex-row flex-md-column channels">
              <div className="d-flex mt-md-1 justify-content-between mb-md-2 ps-2 ps-md-4 pe-md-2 p-4">
                <b>Chaneles</b>
                <button
                  onClick={() => setShowChanMenu(true)}
                  type="button"
                  className="p-0 ms-2 ms-md-0 text-primary btn btn-group-vertical"
                >
                  +
                </button>
              </div>
              <div className="flex-nowrap d-flex flex-row flex-md-column px-2 mt-3 mt-md-0 mb-3 nav-pills overflow-auto h-75 w-100 d-block">
                {channels ? channels
                  .map((info) => (
                    <Channel
                      {...info}
                      activeChannel={activeChannel}
                      onChange={(id) => setActive(id)}
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
                    {message ? message
                      .filter(({ channelId }) => channelId === activeChannel)
                      .length : '???'}
                  </span>
                </div>
                <div className="overflow-auto px-5 ">
                  {message ? message
                    .filter(({ channelId }) => channelId === activeChannel)
                    .map((info) => <Message {...info} />) : null}
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
                      const messegeData = { body: messege, channelId: activeChannel, username: '123' };
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
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
