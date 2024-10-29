/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { Formik } from 'formik';
import * as Yup from 'yup';

import image from '../img/login.jpg';

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
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <img src={image} className="rounded" alt="Login-Image" height={200} width={200} />
                </div>
                <Formik
                  initialValues={{ username: '', password: '' }}
                  validationSchema={Yup.object({
                    username: Yup.string()
                      .max(20, 'Must be 20 characters or less!')
                      .matches(/^[a-zA-Z0-9-_ ]*$/, 'Please, enter valid characters.'),
                    password: Yup.string()
                      .max(20, 'Must be 20 characters or less!')
                      .matches(/^[a-zA-Z0-9!?,._-]*$/, 'Please, enter valid characters.'),
                  })}
                  onSubmit={(values, { setErrors }) => {
                    axios.post('/api/account/login', { username: values.username, password: values.password })
                      .then((res) => {
                        localStorage.setItem('token', res.data.token);
                        document.location.href = '/';
                      })
                      .catch((err) => {
                        if (err.status === 401) {
                          setErrors({ username: true, password: 'Wrong password or username.' });
                        } else {
                          setErrors({ username: true, password: 'Sorry, unknown error.' });
                        }
                      });
                  }}
                >
                  {({
                    values,
                    touched,
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
                          className={classNames('form-control', 'rounded-4', { 'is-invalid': errors.username && touched.username })}
                          aria-describedby="Username"
                          placeholder="Username"
                          type="text"
                          required
                          value={values.username}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <label htmlFor="usernameInput">
                          Username
                        </label>
                        {errors.username && touched.username ? (
                          <div className="ms-2 invalid-feedback">{errors.username}</div>
                        ) : null}
                      </div>
                      <div className="form-floating mb-4">
                        <input
                          name="password"
                          id="passwordInput"
                          className={classNames('form-control', 'rounded-4', { 'is-invalid': errors.password && touched.password })}
                          aria-describedby="Password"
                          placeholder="Password"
                          type="password"
                          required
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <label htmlFor="passwordInput">
                          Password
                        </label>
                        {errors.password && touched.password ? (
                          <div className="ms-2 invalid-feedback">{errors.password}</div>
                        ) : null}
                      </div>
                      <button
                        onSubmit={isSubmitting}
                        type="submit"
                        className="w-100 mb-3 btn btn-outline-dark rounded-5"
                      >
                        Submit
                      </button>
                    </form>
                  )}
                </Formik>
              </div>
              <div className="card-footer p-4 border rounded-5 rounded-top-0 border-start-0 border-end-0">
                <div className="text-center">
                  <span>Haven&apos;t account? </span>
                  <a href="/register">Register!</a>
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
