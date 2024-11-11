/* eslint-disable react/jsx-props-no-spreading */
import Form from 'react-bootstrap/Form';

import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import io from 'socket.io-client';
import axios from 'axios';
import Cookies from 'js-cookie';

import Channel from './chat/channel';
import Message from './chat/messeg';
import ModalMini from './chat/modalMini';
import ModalS from './chat/modal';

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

  const [channelMenu, setChanMenu] = useState({ type: null, id: null });
  const [problem, setProblem] = useState(null);

  // Functions
  const handleServerError = (err) => {
    if (err.status === 401) {
      setProblem('login');
      localStorage.removeItem('token');
    }
  };

  const reconnect = (e) => {
    e.target.disabled = true;
    socket.io.open((err) => {
      if (!err) {
        setProblem(null);
      }
    });
    setTimeout(() => {
      e.target.disabled = false;
    }, 2000);
  };

  // Get Data
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
        const activeId = Cookies.get('active-channel');
        setChanels(data);

        if (data.filter(({ id }) => activeId === id)[0]) setActive(activeId);
        else {
          setActive(data[0].id);
          Cookies.remove('active-channel');
        }
      })
      .catch(handleServerError);
  }, []);

  // Set listneres
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
    socket.on('renameChannel', (changed) => setChanels((prevChannels) => {
      const newChanels = prevChannels.filter(({ id }) => id !== changed.id);
      return [...newChanels, changed];
    }));

    socket.on('disconnect', () => {
      setTimeout(() => setProblem('internet'), 1500);
    });
  }, []);

  return (
    <div className="h-100 flex-column d-flex">
      <ModalMini problem={problem} show={!!problem} reconnect={reconnect} />

      <ModalS
        handleServerError={handleServerError}
        hide={() => setChanMenu({ type: null, id: null })}
        addOrRename={channelMenu.type}
        id={channelMenu.id}
        show={!!channelMenu.type}
      />
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
                  onClick={() => setChanMenu({ type: 'add', id: undefined })}
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
