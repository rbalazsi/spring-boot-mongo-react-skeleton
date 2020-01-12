import React from 'react'
import {LoaderButton} from "../common/LoaderButton";
import {Formik, Form, Field} from 'formik';

let yup = require('yup');

const loginSchema = yup.object({
    userName: yup.string().required("Username is required"),
    password: yup.string().required("Password is required")
});

/**
 * Login page.
 */
export const LoginPage = ({errorCode, errorMessage, isSubmitting, onLogin}) => (
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-lg-5">
                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="card-body p-0">
                        {errorCode === 0 && <div className="alert alert-danger" role="alert">Connection error occurred. The server may
                            be down due to maintenance. Please try again later.</div>}
                        {errorCode !== 0 && errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
                        <div className="p-5">
                            <div className="text-center">
                                <h1 className="h4 text-gray-900 mb-4">Sign In</h1>
                            </div>

                            <Formik
                                validationSchema={loginSchema}
                                onSubmit={onLogin}
                                initialValues={{
                                    userName: '',
                                    password: ''
                                }}
                            >
                                {({
                                      errors,
                                      touched
                                  }) => (
                                    <Form className="user">
                                        <div className="form-group">
                                            <Field type="text" name="userName" placeholder="User"
                                                   className={"form-control form-control-user" + (!!errors.userName && touched.userName ? " is-invalid" : "")}/>
                                            {errors.userName && touched.userName ? <div className="invalid-feedback">{errors.userName}</div> : null}
                                        </div>

                                        <div className="form-group">
                                            <Field type="password" name="password" placeholder="Password"
                                                   className={"form-control form-control-user" + (!!errors.password && touched.password ? " is-invalid" : "")}/>
                                            {errors.password && touched.password ? <div className="invalid-feedback">{errors.password}</div> : null}
                                        </div>

                                        <LoaderButton isLoading={isSubmitting}
                                                      loadingText="Logging in..."
                                                      type="submit"
                                                      className="btn-primary btn-large btn-block btn-user">
                                            Login
                                        </LoaderButton>
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
