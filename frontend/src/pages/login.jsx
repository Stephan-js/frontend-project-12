/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Formik } from 'formik';

function Login() {
  return (
    <div className="h-100 d-flex flex-column">
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm">
        <div className="container">
          <a className="navbar-brand" href="/">Chat App</a>
        </div>
      </nav>
      <div className="container-fluid h-100">
        <div className="row align-items-center justify-content-center h-100">
          <div className="col-11 col-sm-10 col-md-8 col-xl-7 col-xxl-6">
            <div className="card border rounded-5 border-bottom-0 shadow-sm my-4">
              <div className="row card-body p-5">
                <div className="col-11 col-md-6 d-flex align-items-center justify-content-center">
                  <img src="..." className="rounded" alt="123" height={200} width={200} />
                </div>
                <Formik
                  initialValues={{ username: '', password: '' }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.username) {
                      errors.email = 'Required';
                    }

                    if (!values.password) {
                      errors.password = 'Required';
                    }

                    return errors;
                  }}
                  onSubmit={(values, actions) => {
                    setTimeout(() => {
                      alert(JSON.stringify(values, null, 2));
                      actions.setSubmitting(false);
                    }, 400);
                  }}
                >
                  {({
                    values,
                    // eslint-disable-next-line no-unused-vars
                    errors,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                  }) => (
                    <form className="col-12 col-md-6 mt-3 mt-md-0" onSubmit={handleSubmit}>
                      <h1 className="text-center mb-4">Login</h1>
                      <div className="form-floating mb-3">
                        <input
                          name="username"
                          id="usernameInput"
                          className="form-control"
                          aria-describedby="Username"
                          placeholder="Username"
                          type="text"
                          value={values.username}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <label htmlFor="usernameInput">
                          Username
                        </label>
                      </div>
                      <div className="form-floating mb-4">
                        <input
                          name="password"
                          id="passwordInput"
                          className="form-control"
                          aria-describedby="Password"
                          placeholder="Password"
                          type="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <label htmlFor="passwordInput">
                          Password
                        </label>
                      </div>
                      <button
                        onSubmit={isSubmitting}
                        type="submit"
                        className="w-100 mb-3 btn btn-outline-primary"
                      >
                        Submit
                      </button>
                    </form>
                  )}
                </Formik>
              </div>
              <div className="card-footer p-4 border rounded-5 rounded-top-0 border-start-0 border-end-0">
                <div className="text-center">
                  <span>Haven&apos;t account?</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
