/* eslint-disable react/self-closing-comp */
import React from 'react';

function Page404() {
  return (
    <section className="py-3 py-md-5 min-vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="text-center">
              <h2 className="d-flex justify-content-center align-items-center gap-2 mb-4">
                <span className="display-1 fw-bold">404</span>
              </h2>
              <h3 className="h2 mb-2">Oops! You&apos;re lost.</h3>
              <p className="mb-5">The page you are looking for was not found.</p>
              <a className="btn btn-dark rounded-5 px-5 fs-6 m-0" href="/" role="button">Back to Home</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page404;
