import Form from "react-bootstrap/Form";

import React from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

import Channel from "../elements/channel";
import Message from "../elements/messeg";

class Chat extends React.PureComponent {
  render() {
    const { setChanMenu, setChanels, handleServerError, channels, messages } =
      this.props;
    const activeChanMesseges = messages.filter(
      ({ channelId }) => channelId === channels.active,
    );

    return (
      <div className="d-flex h-100 bg-white flex-column row flex-md-row">
        <div className="col-4 col-md-2 px-md-0 border-bottom border-md-end-0 border-md-right bg-light d-flex flex-row flex-md-column channels">
          <div className="d-flex mt-md-1 justify-content-between mb-md-2 ps-2 ps-md-4 pe-md-2 p-4">
            <b>Chaneles</b>
            <button
              onClick={() => {
                if (channels.data.length >= 20) {
                  toast("Oops! You can only have up to 20 channels.", {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                      >
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                      </svg>
                    ),
                  });
                } else setChanMenu({ type: "add" });
              }}
              type="button"
              className="p-0 d-flex justify-content-center align-items-center ms-2 ms-md-0 text-primary btn"
              style={{ width: "20px", height: "20px" }}
            >
              +
            </button>
          </div>
          <div className="flex-nowrap d-flex flex-row flex-md-column px-2 mt-3 mt-md-0 mb-3 nav-pills overflow-auto h-75 w-100 d-block">
            {channels.data
              ? channels.data.map((info) => (
                  <Channel
                    key={info.id}
                    name={info.name}
                    id={info.id}
                    removable={info.removable}
                    channels={channels}
                    handleRename={(d) => setChanMenu(d)}
                    handleErr={(err) => handleServerError(err)}
                    setChanels={(data) => setChanels(data)}
                  />
                ))
              : null}
          </div>
        </div>
        <div className="col p-0 messeges">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="mb-0">
                <b>
                  {channels.data
                    ? channels.data.filter(
                        ({ id }) => id === channels.active,
                      )[0].name
                    : null}
                </b>
              </p>
              <span className="text-muted">
                Meseges: {activeChanMesseges.length}
              </span>
            </div>
            <div className="overflow-auto px-5 ">
              {activeChanMesseges.map((info) => (
                <Message
                  key={info.id}
                  username={info.username}
                  id={info.id}
                  messege={info.body}
                />
              ))}
            </div>
            <div className="mt-auto px-5 py-3">
              <Formik
                initialValues={{ messege: "" }}
                validationSchema={Yup.object({
                  messege: Yup.string()
                    .max(160, "Must be 160 characters or less!")
                    .required("Required!"),
                })}
                onSubmit={({ messege }, { resetForm }) => {
                  resetForm();
                  const messegeData = {
                    body: messege,
                    channelId: channels.active,
                  };
                  axios
                    .post("/api/messages", messegeData, {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
                  <Form
                    className="py-1 border rounded-4"
                    onSubmit={handleSubmit}
                  >
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
                        className="btn btn-group-vertical border-0"
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
    );
  }
}

Chat.propTypes = {
  setChanels: PropTypes.isRequired,
  setChanMenu: PropTypes.isRequired,
  handleServerError: PropTypes.isRequired,
  channels: PropTypes.isRequired,
  messages: PropTypes.isRequired,
};

export default Chat;
