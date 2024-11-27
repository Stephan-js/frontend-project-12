import Spinner from "react-bootstrap/Spinner";

import React from "react";

function Loading() {
  return (
    <div className="d-flex h-100 bg-white flex-column row flex-md-row">
      <div className="col-4 col-md-2 px-md-0 border-bottom border-md-end-0 border-md-right bg-light d-flex flex-row flex-md-column channels">
        <div className="d-flex mt-md-1 justify-content-between mb-md-2 ps-2 ps-md-4 pe-md-2 p-4">
          <b>Chaneles</b>
          <button
            disabled
            type="button"
            className="p-0 d-flex border-0 justify-content-center align-items-center ms-2 ms-md-0 text-primary btn"
            style={{ width: "20px", height: "20px" }}
          >
            +
          </button>
        </div>
      </div>
      <div className="col p-0 messeges">
        <div className="d-flex flex-column h-100">
          <div className="bg-light mb-4 p-3 shadow-sm small">
            <p className="mb-0">
              <b>Loading...</b>
            </p>
            <span className="text-muted">Meseges: ???</span>
          </div>
          <div className="h-100">
            <div className="d-flex align-items-center justify-content-center w-100 h-100">
              <Spinner animation="border" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
