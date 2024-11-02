/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import io from 'socket.io-client';
import axios from 'axios';

import Channel from './chat/channel';
import Message from './chat/messeg';

function handleServerErrror(err) {
  if (err.status === 401) {
    document.location.href = '/login';
  } else {
    console.log(err);
  }
}

function ChatPage() {
  const socket = io('http://localhost:5001');

  const [activeChannel, setActive] = useState(null);
  const [channels, setChanels] = useState(null);
  const [message, setMeseges] = useState([]);

  useEffect(() => {
    axios.get('/api/messages', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((resp) => {
        if (resp.data) setMeseges(resp.data);
        socket.on('newMessage', (newMessage) => setMeseges((prevMessages) => [...prevMessages, newMessage]));
      })
      .catch(handleServerErrror);
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
      .catch(handleServerErrror);
  }, []);

  return (
    <div className="h-100 flex-column d-flex">
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
                <button type="button" className="p-0 ms-2 ms-md-0 text-primary btn btn-group-vertical">+</button>
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
                      const messegeData = { body: messege, channelId: activeChannel, username: '123' };
                      axios.post('/api/messages', messegeData, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                      })
                        .then((resp) => {
                          resetForm();
                        })
                        .catch(handleServerErrror);
                    }}
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
                      <form className="py-1 border rounded-4" onSubmit={handleSubmit}>
                        <div className="p-1 input-group has-validation">
                          <input
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
                        </div>
                      </form>
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
