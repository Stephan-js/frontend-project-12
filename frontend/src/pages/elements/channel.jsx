import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";

import React from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import axios from "axios";

class Channel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleDeleteChannel = this.handleDeleteChannel.bind(this);
    this.handleRenameChannel = this.handleRenameChannel.bind(this);
  }

  handleClick(e) {
    const { setChanels } = this.props;
    const { id } = e.target;
    if (id) {
      setChanels(({ data }) => {
        return { active: id, data };
      });
      Cookies.set("active-channel", id, { sameSite: "strict", expires: 31 });
    }
  }

  handleDeleteChannel(e) {
    const { handleErr } = this.props;
    const { id } = e.target;
    const activeId = Cookies.get("active-channel");

    if (activeId === id) Cookies.remove("active-channel");
    axios
      .delete(`/api/channels/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        toast("Channel has been deleted!", {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
            </svg>
          ),
        });
      })
      .catch(handleErr);
  }

  handleRenameChannel(e) {
    const { handleRename } = this.props;
    const { id } = e.target;

    handleRename({ type: "rename", id });
  }

  render() {
    const { name, id, removable, channels } = this.props;

    const variant = channels.active === id ? "secondary" : "none";
    const tooSmall = window.innerWidth < 768;
    if (!removable || tooSmall) {
      return (
        <div
          className="nav-item w-md-100 me-1 me-md-0 mb-md-1"
          style={{ "min-width": "fit-content" }}
        >
          <Button
            id={id}
            variant={variant}
            onClick={this.handleClick}
            className="rounded-3 w-100 text-start"
            type="button"
          >
            <span># </span>
            {name}
          </Button>
        </div>
      );
    }

    return (
      <div
        className="nav-item w-md-100 me-1 me-md-0 mb-md-1"
        style={{ "min-width": "fit-content" }}
      >
        <Dropdown as={ButtonGroup} className="w-100">
          <Button
            id={id}
            variant={variant}
            onClick={this.handleClick}
            className="rounded-3 w-100 text-start rounded-end-0"
            type="button"
          >
            <span># </span>
            {name}
          </Button>
          <Dropdown.Toggle
            split
            variant={variant}
            className="rounded-3 rounded-start-0"
            id="dropdown-split-basic"
          >
            <span className="visually-hidden">Toggle Dropdown</span>
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="rounded-3"
            style={{
              position: "absolute",
              "min-width": "0px",
              "max-width": "100px",
              inset: "0px 0px auto auto",
              transform: "translate(0px, 40px)",
            }}
          >
            <Dropdown.Item id={id} onClick={this.handleRenameChannel} href="#">
              Rename
            </Dropdown.Item>
            <Dropdown.Item id={id} onClick={this.handleDeleteChannel} href="#">
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

Channel.propTypes = {
  id: PropTypes.isRequired,
  name: PropTypes.isRequired,
  channels: PropTypes.isRequired,
  handleRename: PropTypes.isRequired,
  setChanels: PropTypes.isRequired,
  handleErr: PropTypes.isRequired,
  removable: PropTypes,
};

Channel.defaultProps = {
  removable: true,
};

export default Channel;
