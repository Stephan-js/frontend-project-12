import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import io from 'socket.io-client';
import axios from 'axios';
import Cookies from 'js-cookie';

import ModalProblem from './elements/modalProblems';
import ModalInput from './elements/modalInput';
import Chat from './chatPage/chat';
import Loading from './chatPage/loading';

import NavbarMenu from './elements/navbar';

function ChatPage() {
  const socket = io({
    reconnection: false,
    extraHeaders: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const [activeChannel, setActive] = useState(null);
  const [channels, setChanels] = useState(null);
  const [messages, setMeseges] = useState(null);

  const [channelMenu, setChanMenu] = useState({ type: null, id: null, show: false });
  const [problem, setProblem] = useState(null);

  const handleServerError = (err) => {
    if (err.status === 401) {
      setProblem('login');
      localStorage.removeItem('token');
    }
  };

  const setUpErrListeners = () => {
    socket.on('disconnect', () => {
      setTimeout(() => setProblem('internet'), 1000);
    });
    socket.on('connect_error', () => {
      setTimeout(() => {
        setProblem('login');
        localStorage.removeItem('token');
      }, 500);
    });
  };

  const reconnect = (e) => {
    socket.io.open((err) => {
      e.target.disabled = true;
      if (!err) {
        setProblem(null);
        e.target.disabled = false;

        setUpErrListeners();
      } else {
        setTimeout(() => {
          e.target.disabled = false;
        }, 2000);
      }
    });
  };

  useEffect(() => {
    const token = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    };
    axios.all([
      axios.get('/api/messages', token),
      axios.get('/api/channels', token),
    ])
      .then(axios.spread((mess, chan) => {
        setMeseges(mess.data ?? []);

        const dataChan = chan.data;
        const activeId = Cookies.get('active-channel');
        if (dataChan.filter(({ id }) => activeId === id)[0]) setActive(activeId);
        else setActive(dataChan[0].id);
        setChanels(dataChan);
      }))
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
    socket.on('renameChannel', (changed) => setChanels((prevChannels) => {
      const newChanels = prevChannels.filter(({ id }) => id !== changed.id);
      return [...newChanels, changed];
    }));

    setUpErrListeners();
  }, []);

  return (
    <div className="h-100 flex-column d-flex">
      <ToastContainer stacked />

      <ModalProblem problem={problem} show={!!problem} reconnect={reconnect} />
      <ModalInput
        handleServerError={handleServerError}
        hide={() => setChanMenu({ type: null, id: null, show: false })}
        type={channelMenu.type}
        id={channelMenu.id}
        show={channelMenu.show}
      />
      <NavbarMenu />
      <div className="h-100 container-fluid my-4 my-md-5 d-flex">
        <div className="container overflow-hidden align-self-center chat rounded-4 shadow" style={{ height: '570px' }}>
          {channels ? (
            <Chat
              setChanMenu={setChanMenu}
              handleServerError={handleServerError}
              setActive={setActive}
              activeChannel={activeChannel}
              channels={channels}
              messages={messages}
            />
          ) : <Loading />}
        </div>
      </div>
      <div />
    </div>
  );
}

export default ChatPage;
