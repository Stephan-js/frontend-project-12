import React from 'react';

import Channel from './chat/channel';
import Chat from './chat/chat';

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
            <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
              <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                <b>Chaneles</b>
                <button type="button" className="p-0 text-primary btn btn-group-vertical">+</button>
              </div>
              <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
                <Channel name="first" />
                <Channel name="second" active />
                <Channel name="third" menu />
              </ul>
            </div>
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
