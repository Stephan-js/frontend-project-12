/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/button-has-type */
import React from 'react';
import { Formik } from 'formik';

function ChannelList() {
  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>Chaneles</b>
        <button type="button" className="p-0 text-primary btn btn-group-vertical">+</button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        <li className="nav-item w-100">
          <button className="w-100 rounded-0 text-start btn" type="button">
            <span>#</span>
            First
          </button>
        </li>
        <li className="nav-item w-100">
          <button className="w-100 rounded-0 text-start btn btn-secondary" type="button">
            <span>#</span>
            First
          </button>
        </li>
        <li className="nav-item w-100">
          <div className="d-flex dropdown btn-group">
            <button className="w-100 rounded-0 text-start btn" type="button">
              <span>#</span>
              Third
            </button>
            <button
              className="flex-grow-0 btn dropdown-toggle-split dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="visually-hidden">Chanel control</span>
            </button>
            <ul className="dropdown-menu" style={{ position: 'absolute', inset: '0px 0px auto auto', transform: 'translate(0px, 40px)' }}>
              <li><a className="dropdown-item" href="#">Action</a></li>
              <li><a className="dropdown-item" href="#">Another acstion</a></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
}

function Chat() {
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
          <div className="text-break mb-2">
            <b>Admin</b>
            : Hello :3
          </div>
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
                  />
                  <button className="btn btn-group-vertical" type="button">
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

function ChatPage() {
  return (
    <div className="h-100 flex-column d-flex">
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm">
        <div className="container">
          <a className="navbar-brand" href="/">Chat App</a>
        </div>
      </nav>
      <div className="h-100 container-fluid my-3 my-sm-4 my-md-5">
        <div className="container h-100 overflow-hidden rounded-4 shadow">
          <div className="row h-100 bg-white flex-md-row">
            <ChannelList />
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
