/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import axios from 'axios';

import Channel from './chat/channel';
import Message from './chat/messeg';

function ChatPage() {
  const [activeChannel, setActive] = useState('1');
  const [channels, setChanels] = useState(null);

  const meseges = [{
    id: '1', body: 'Hewwwoooo :3', channelId: '1', username: 'admin',
  },
  {
    id: '2', body: 'Hiii!', channelId: '1', username: 'hacer',
  }];

  useEffect(() => {
    setChanels(null);
    axios.get('/api/channels', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((resp) => {
        setChanels(resp.data);
      })
      .catch(() => {
        document.location.href = '/login';
      });
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
                <Channel id="123" name="third" removable />
              </div>
            </div>
            <div className="col p-0 h-100">
              <div className="d-flex flex-column h-100">
                <div className="bg-light mb-4 p-3 shadow-sm small">
                  <p className="mb-0">
                    <b>Chanele</b>
                  </p>
                  <span className="text-muted">
                    Meseges: ??
                  </span>
                </div>
                <div className="chat-messages overflow-auto px-5 ">
                  {meseges ? meseges
                    .filter((messege) => messege.channelId === activeChannel)
                    .map((info) => <Message {...info} />) : null}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
