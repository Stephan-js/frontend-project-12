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

function ChatPage() {
  const socket = io({
    reconnection: false,
    extraHeaders: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const [activeChannel, setActive] = useState(null);
  const [channels, setChanels] = useState(null);
  const [message, setMeseges] = useState([]);

  const [channelMShow, setShowChanMenu] = useState(0);
  const [connectProblemShow, setConnectionMenu] = useState(false);
  const [loginProblemShow, setReloginMenu] = useState(false);

  const handleServerError = (err) => {
    if (err.status === 401) {
      setReloginMenu(true);
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    axios.get('/api/messages', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((resp) => {
        if (resp.data) setMeseges(resp.data);
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
      })
      .catch(handleServerError);
  }, []);

  useEffect(() => {
    socket.on('newMessage', (respond) => setMeseges((prevMessages) => [...prevMessages, respond]));
    socket.on('newChannel', (newChannel) => setChanels((prevChannels) => [...prevChannels, newChannel]));
    socket.on('removeChannel', (deleted) => setChanels((prevChannels) => {
      const newChanels = prevChannels.filter(({ id }) => id !== deleted.id);
      setActive((pervActive) => {
        if (deleted.id === pervActive) return prevChannels[0].id;
        return pervActive;
      });
      return newChanels;
    }));

    socket.on('disconnect', () => {
      setConnectionMenu(true);
    });
  }, []);

  return (
    <div className="h-100 flex-column d-flex">
      {/* Modals Part */}
      <Modal
        className="rounded-3"
        centered
        show={loginProblemShow}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Oops!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          It looks like you were signed out of your account. Please sign in again.
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-3"
            variant="dark"
            onClick={() => { document.location.href = '/login'; }}
          >
            To Login
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        className="rounded-3"
        centered
        show={connectProblemShow}
        onHide={() => setConnectionMenu(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Oops!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          It looks like you lost connection with the server.
          Please try reconnect or come back later!
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-3"
            variant="danger"
            onClick={(e) => {
              e.target.disabled = true;
              socket.io.open((err) => {
                if (!err) {
                  setConnectionMenu(false);
                }
              });
              setTimeout(() => {
                e.target.disabled = false;
              }, 2000);
            }}
          >
            Reconnect
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        className="rounded-3"
        aria-labelledby="modal-title"
        centered
        show={channelMShow !== 0}
        onHide={() => setShowChanMenu(0)}
      >
        <Modal.Header>
          <Modal.Title id="modal-title">{channelMShow === 2 ? 'Rename channel' : 'Add chanel'}</Modal.Title>
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

            if (channelMShow === 1) {
              axios.post('/api/channels', channelData, {
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

            setShowChanMenu(0);
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
                  onClick={() => setShowChanMenu(0)}
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
      {/* Actual chat part */}
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm">
        {/* TODO: Add exit button or/and menue button */}
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
                  onClick={() => setShowChanMenu(1)}
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
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
