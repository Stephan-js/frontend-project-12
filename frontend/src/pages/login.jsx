import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Formik } from 'formik';

function Login() {
  return (
    <div className="h-100">
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm">
        <div className="container">
          <a className="navbar-brand" href="/">Chat App</a>
        </div>
      </nav>
      <div className="my-auto d-flex align-items-center justify-content-center h-100">
        <div className="card shadow-sm">
          <div className="card-body">
            <Formik
              initialValues={{ username: '', password: '' }}
              validate={(values) => {
                const errors = {};
                if (!values.username) {
                  errors.email = 'Required';
                  console.log('req');
                }

                if (!values.password) {
                  errors.password = 'Required';
                  console.log('req1');
                }

                console.log(values);
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  setSubmitting(false);
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
                <form onSubmit={handleSubmit}>
                  <div className="mb-3 mt-2">
                    <label htmlFor="usernameInput" className="form-label">
                      Username
                      <input
                        name="username"
                        id="usernameInput"
                        className="form-control"
                        aria-describedby="Username"
                        type="text"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="passwordInput" className="form-label">
                      Password
                      <input
                        name="password"
                        id="passwordInput"
                        className="form-control"
                        aria-describedby="Password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </label>
                  </div>
                  <button
                    onSubmit={isSubmitting}
                    type="submit"
                    className="btn btn-primary mb-2"
                  >
                    Submit
                  </button>
                </form>
              )}
            </Formik>
          </div>
          <div className="card-footer">
            <div className="text-center">
              <p>123123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
