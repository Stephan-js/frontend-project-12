import React, { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";

import io from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";

import ModalProblem from "./elements/modalProblem";
import ModalInput from "./elements/modalInput";
import Chat from "./chatPage/chat";
import Loading from "./chatPage/loading";

import NavbarMenu from "./elements/navbar";

function ChatPage() {
  const [channels, setChanels] = useState(null);
  const [messages, setMeseges] = useState(null);

  const [channelMenu, setChanMenu] = useState(null);
  const [problem, setProblem] = useState(null);

  const handleServerError = (err) => {
    if (err.status === 401) {
      setProblem("login");
      localStorage.removeItem("token");
    }
  };

  const reconnect = useRef();

  useEffect(() => {
    const token = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    axios
      .all([
        axios.get("/api/messages", token),
        axios.get("/api/channels", token),
      ])
      .then(
        axios.spread((mess, chan) => {
          setMeseges(mess.data ?? []);

          let active;
          const { data } = chan;
          const activeId = Cookies.get("active-channel");
          if (data.filter(({ id }) => activeId === id)[0]) active = activeId;
          else active = data[0].id;
          setChanels({ active, data });
        }),
      )
      .catch(handleServerError);
  }, []);

  useEffect(() => {
    const socket = io({
      reconnection: false,
      extraHeaders: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const setUpErrEvents = () => {
      socket.on("disconnect", () => setProblem("internet"));
      socket.on("connect_error", (err) => {
        if (err.message === "invalid token") {
          setTimeout(() => {
            setProblem("login");
            localStorage.removeItem("token");
          }, 1000);
        }
      });
    };

    socket.on("newMessage", (respond) =>
      setMeseges((prevMessages) => [...prevMessages, respond]),
    );
    socket.on("newChannel", (newChannel) =>
      setChanels(({ data, active }) => {
        const newData = [...data, newChannel];
        return { active, data: newData };
      }),
    );
    socket.on("removeChannel", (deleted) =>
      setChanels((chan) => {
        let active;
        const data = chan.data.filter(({ id }) => id !== deleted.id);
        if (deleted.id === chan.active) active = chan.data[0].id;
        else active = chan.active;
        return { active, data };
      }),
    );
    socket.on("renameChannel", (changed) =>
      setChanels(({ data, active }) => {
        const newChanels = data.filter(({ id }) => id !== changed.id);
        const newData = [...newChanels, changed];
        return { active, data: newData };
      }),
    );

    setUpErrEvents();

    reconnect.current = (e) => {
      socket.io.open((err) => {
        e.target.disabled = true;
        if (!err) {
          setProblem(null);
          e.target.disabled = false;

          setUpErrEvents();
        } else {
          setTimeout(() => {
            e.target.disabled = false;
          }, 2000);
        }
      });
    };
  }, []);

  return (
    <div className="h-100 flex-column d-flex">
      <ToastContainer stacked />

      <ModalProblem
        problem={problem}
        show={!!problem}
        reconnect={reconnect.current}
      />
      <ModalInput
        handleServerError={handleServerError}
        hide={() => setChanMenu(null)}
        data={channelMenu ?? { type: null, id: null }}
        show={!!channelMenu}
      />
      <NavbarMenu />
      <div className="h-100 container-fluid my-4 my-md-5 d-flex">
        <div
          className="container overflow-hidden align-self-center chat rounded-4 shadow"
          style={{ height: "570px" }}
        >
          {channels ? (
            <Chat
              setChanMenu={setChanMenu}
              handleServerError={handleServerError}
              setChanels={setChanels}
              channels={channels}
              messages={messages}
            />
          ) : (
            <Loading />
          )}
        </div>
      </div>
      <div />
    </div>
  );
}

export default ChatPage;
