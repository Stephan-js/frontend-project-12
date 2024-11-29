import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import React from "react";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";

import image from "../img/reg.webp";

import NavbarMenu from "./elements/navbar";

function Register() {
  return (
    <div className="h-100 d-flex flex-column">
      <NavbarMenu />
      <div className="container-fluid h-100">
        <div className="row align-items-center justify-content-center h-100">
          <div className="col-11 col-sm-10 col-md-8 col-xl-7 col-xxl-6">
            <div className="card border rounded-5 shadow-sm my-4">
              <div className="row card-body p-5">
                <div
                  className="col-12 col-md-6 d-flex align-items-center justify-content-center"
                  style={{ height: "200px" }}
                >
                  <img
                    src={image}
                    className="rounded"
                    alt="Register-Image"
                    height={100}
                    width={100}
                  />
                </div>
                <Formik
                  initialValues={{ username: "", password: "", password2: "" }}
                  validationSchema={Yup.object({
                    username: Yup.string()
                      .min(3, "Must be at least 3 characters.")
                      .max(20, "Must be 20 characters or less!")
                      .matches(
                        /^[a-zA-Z0-9-_ ]*$/,
                        "Please, enter valid characters.",
                      ),
                    password: Yup.string()
                      .min(6, "Must be at least 6 characters.")
                      .max(20, "Must be 20 characters or less!")
                      .matches(
                        /^[a-zA-Z0-9!?,._-]*$/,
                        "Please, enter valid characters.",
                      ),
                    password2: Yup.string().oneOf(
                      [Yup.ref("password"), null],
                      "Passwords must match.",
                    ),
                  })}
                  onSubmit={(values, { setErrors }) => {
                    axios
                      .post("/api/account/signup", {
                        username: values.username,
                        password: values.password,
                      })
                      .then((res) => {
                        localStorage.setItem("token", res.data.token);
                        document.location.href = "/";
                      })
                      .catch((err) => {
                        if (err.status === 409) {
                          document.location.href = "/login";
                        } else {
                          setErrors({
                            username: true,
                            password: true,
                            password2: "Sorry, unknown error.",
                          });
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
                    <Form
                      noValidate
                      className="col-12 col-md-6 mt-3 mt-md-0"
                      onSubmit={handleSubmit}
                    >
                      <h1 className="text-center mb-4">Register</h1>
                      <Form.Group className="form-floating mb-4">
                        <Form.Control
                          name="username"
                          id="username-input"
                          className="rounded-4"
                          aria-describedby="username-label"
                          placeholder="Username"
                          type="text"
                          required
                          value={values.username}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.username && !!errors.username}
                        />
                        <Form.Label
                          id="username-label"
                          htmlFor="username-input"
                        >
                          Username
                        </Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="form-floating mb-4">
                        <Form.Control
                          name="password"
                          id="password-input"
                          className="rounded-4"
                          aria-describedby="password-label"
                          placeholder="Password"
                          type="password"
                          required
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={
                            (touched.password && !!errors.password) ||
                            (touched.password2 && !!errors.password2)
                          }
                        />
                        <Form.Label
                          id="password-label"
                          htmlFor="password-input"
                        >
                          Password
                        </Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="form-floating mb-4">
                        <Form.Control
                          name="password2"
                          id="password-input2"
                          className="rounded-4"
                          aria-describedby="password-label2"
                          placeholder="Confirm Password"
                          type="password"
                          required
                          value={values.password2}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.password2 && !!errors.password2}
                        />
                        <Form.Label
                          id="password-label2"
                          htmlFor="password-input2"
                        >
                          Confirm Password
                        </Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {errors.password2}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button
                        onSubmit={isSubmitting}
                        type="submit"
                        variant="outline-dark"
                        className="w-100 mb-3 rounded-5"
                      >
                        Submit
                      </Button>
                    </Form>
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
