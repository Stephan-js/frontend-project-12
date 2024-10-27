/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import classNames from 'classnames';
import * as Yup from 'yup';

function Register() {
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
            <div className="card border rounded-5 shadow-sm my-4">
              <div className="row card-body p-5">
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <img src="..." className="rounded" alt="Register-Image" height={200} width={200} />
                </div>
                <Formik
                  initialValues={{ username: '', password: '', password2: '' }}
                  validationSchema={Yup.object({
                    username: Yup.string()
                      .min(3, 'Must be at least 3 characters.')
                      .max(20, 'Must be 20 characters or less!')
                      .matches(/^[a-zA-Z0-9-_ ]*$/, 'Please, enter valid characters.'),
                    password: Yup.string()
                      .min(6, 'Must be at least 6 characters.')
                      .max(20, 'Must be 20 characters or less!')
                      .matches(/^[a-zA-Z0-9!?,._-]*$/, 'Please, enter valid characters.'),
                    password2: Yup.string()
                      .oneOf([Yup.ref('password'), null], 'Passwords must match.'),
                  })}
                  onSubmit={(values, { setErrors, resetForm }) => {
                    axios.post('/api/account/signup', { username: values.username, password: values.password })
                      .then((res) => {
                        localStorage.setItem('token', res.data.token);
                        resetForm();
                      })
                      .catch((err) => {
                        if (err.status === 409) {
                          document.location.href = '/login';
                        } else {
                          setErrors({ username: true, password2: true, password: 'Sorry, unknown error.' });
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
                      <h1 className="text-center mb-4">Register</h1>
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
                          <div className="invalid-feedback">{errors.username}</div>
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
                          <div className="invalid-feedback">{errors.password}</div>
                        ) : null}
                      </div>
                      <div className="form-floating mb-4">
                        <input
                          name="password2"
                          id="passwordInput2"
                          className={classNames('form-control', 'rounded-4', { 'is-invalid': errors.password2 && touched.password2 })}
                          aria-describedby="password2"
                          placeholder="confirm password"
                          type="password"
                          required
                          value={values.password2}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <label htmlFor="passwordInput2">
                          Confirm password
                        </label>
                        {errors.password2 && touched.password2 ? (
                          <div className="invalid-feedback">{errors.password2}</div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
