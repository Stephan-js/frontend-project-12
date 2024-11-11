/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';
import axios from 'axios';
import Cookies from 'js-cookie';

import ModalMini from './chatPage/modalMini';
import ModalS from './chatPage/modal';
import Chat from './chatPage/chat';

function ChatPage() {
  const socket = io({
    reconnection: false,
    extraHeaders: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const [activeChannel, setActive] = useState(null);
  const [channels, setChanels] = useState(null);
  const [messages, setMeseges] = useState([]);

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
        <Chat
          setChanMenu={setChanMenu}
          handleServerError={handleServerError}
          setActive={setActive}
          activeChannel={activeChannel}
          channels={channels}
          messages={messages}
        />
      </div>
    </div>
  );
}

export default ChatPage;
