/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Formik } from 'formik';

function Login() {
  return (
    <div>
      <Formik
        initialValues={{ email: '', password: '' }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = 'Required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address';
          }
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
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="a" className="form-label">Email address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                id="a"
                aria-describedby="emailHelp"
                onChange={handleChange}
                onBlur={handleBlur}
                values={values.email}
              />
              <div id="emailHelp" className="">{errors.email && touched.email && errors.email}</div>
            </div>
            <div>
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                id="exampleInputPassword1"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              <div id="emailHelp" className="">{errors.password && touched.password && errors.password}</div>
            </div>
            <div className="mb-3 from-check">
              <input type="checkbox" className="form-check-input" id="exampleCheck1" />
              <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
            </div>
            <button type="submit" className="btn btn-primary" onSubmit={isSubmitting}>Submit</button>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
