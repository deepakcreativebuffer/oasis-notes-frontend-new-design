/** @format */

import "./login.css";
import { FaCheckCircle, FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import LoginCarouselSlide from "./Carousel";
import { useNavigate } from "react-router-dom";
import {
  GenerateOtp,
  LoginUser,
  requestPasswordReset,
  verifyForgotPasswordOtp,
} from "../../services";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { LoginSlice } from "@/store/authSlice";
import { ROLES, ROUTES } from "../../constants";
import { showNotification } from "@/utils";
const Login = () => {
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [showLoginOtp, setShowLoginOtp] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");
  const [showResetPasswordLink, setShowResetPasswordLink] = useState(false);
  const [, setUserId] = useState("");
  const [passwordResetLinkMsg, setPasswordResetLinkMsg] = useState("");
  const dispatch = useDispatch();
  const payload = {
    email: email.toLowerCase()?.trim(),
    password: password?.trim(),
    otp: loginOtp.trim(),
  };
  const resendOTP = async (e) => {
    e.preventDefault();
    setLoginOtp("");
    if (!email?.trim() || !password?.trim()) {
      showNotification({
        message: "Username and Passwords fields cannot be empty",
        type: "danger",
      });
      return;
    }
    const res = await GenerateOtp({
      setLoading,
      payload,
    });
    if (res.success) {
      // Notification already shown by GenerateOtp
    } else {
      // Notification already shown by GenerateOtp
    }
    setLoading(false);
  };
  const forgetPasswordResendOTP = async (e) => {
    setOtp("");
    if (!email?.trim()) {
      showNotification({
        message: "Username fields cannot be empty",
        type: "danger",
      });
      return;
    }
    e.preventDefault();
    setLoading(true);
    const res = await requestPasswordReset(email);
    if (res.success) {
      showNotification({
        message: "OTP Successfully sent to your email",
        type: "success",
      });
      setShowOtp(true);
    } else {
      showNotification(res);
    }
    setLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!showLoginOtp) {
      if (!email?.trim() || !password?.trim()) {
        showNotification({
          message: "Username and Passwords fields cannot be empty",
          type: "danger",
        });
        return;
      }
      const res = await GenerateOtp({
        setLoading,
        payload,
      });
      if (res.success) {
        if (res?.message === "Login successful.") {
          const data = {
            profile: {
              data: res.data,
            },
            payload,
          };
          setShowLoginOtp(false);
          dispatch(LoginSlice(data));
          setLoading(false);
          if (res?.data?.userType === ROLES.ADMIN) {
            navigate(ROUTES.DASHBOARD);
          } else if (res?.data?.userType === ROLES.PATIENT) {
            navigate(ROUTES.PATIENT_PANEL);
          } else if (res?.data?.userType === ROLES.GUARDIAN) {
            navigate(ROUTES.PATIENT_PANEL);
          } else {
            navigate(ROUTES.EMPLOYEE_HOME);
          }
          showNotification({
            message: "Welcome",
          });
        } else {
          setShowLoginOtp(true);
        }
      } else {
        setShowLoginOtp(false);
      }
    } else {
      try {
        if (!email?.trim() || !password?.trim()) {
          showNotification({
            message: "Username and Passwords fields cannot be empty",
            type: "danger",
          });
          return;
        }
        const data = await dispatch(
          LoginUser({
            setLoading,
            payload,
            navigate,
          }),
        );
        setLoading(false);
        if (data?.userType === ROLES.ADMIN) {
          navigate(ROUTES.DASHBOARD);
        } else if (data?.userType === ROLES.PATIENT) {
          navigate(ROUTES.PATIENT_PANEL);
        } else if (data?.userType === ROLES.GUARDIAN) {
          navigate(ROUTES.PATIENT_PANEL);
        } else {
          navigate(ROUTES.EMPLOYEE_HOME);
        }
        showNotification({
          message: "Welcome",
        });
      } catch (err) {
        setLoading(false);
        showNotification({
          message: err?.message || "Invalid OTP",
          type: "danger",
        });
      }
    }
  };
  const handleForget = async (e) => {
    e.preventDefault();
    if (showOtp) {
      if (!email?.trim()) {
        showNotification({
          message: "Username fields cannot be empty",
          type: "danger",
        });
        return;
      }
      setLoading(true);
      const res = await verifyForgotPasswordOtp(email, otp);
      if (res.success) {
        setUserId(res.data?.userId);
        setShowOtp(false);
        setForgetPassword(false);
        setShowResetPasswordLink(true);
        showNotification({
          message: "OTP verified successfully",
        });
        setPasswordResetLinkMsg(res.message);
      } else {
        showNotification(res);
      }
      setLoading(false);
    } else {
      if (!email?.trim()) {
        showNotification({
          message: "Username fields cannot be empty",
          type: "danger",
        });
        return;
      }
      setLoading(true);
      const res = await requestPasswordReset(email);
      if (res.success) {
        showNotification({
          message: "OTP Successfully sent to your email",
          type: "success",
        });
        setShowOtp(true);
      } else {
        showNotification(res);
      }
      setLoading(false);
    }
  };
  const closeAll = () => {
    setForgetPassword(false);
    setShowOtp(false);
    setShowResetPasswordLink(false);
  };
  return (
    <>
      <div className="v-application__wrap">
        <Container fluid className="p-lg-0">
          <Row className="align-items-center">
            <Col xs={12} lg={6}>
              <div className="login-carousel">
                <LoginCarouselSlide />
              </div>
            </Col>
            <Col xs={12} lg={6}>
              <div className="login-cred">
                <div className="bg-blur">
                  <div className="round-1"></div>
                  <div className="round-2"></div>
                </div>
                <div className="login-logo text-center">
                  <img src="/logo.png" alt="logo" />
                </div>
                <Card>
                  <Card.Body>
                    <div className="right-div-login-page px-0 px-lg-4">
                      <div>
                        <h4 className="fw-bold text-[#1a9fb2] text-center">
                          Login Panel
                        </h4>
                      </div>
                      <div className="Main">
                        {forgetPassword ? (
                          <Form
                            onSubmit={handleForget}
                            className="mt-8 text-left w-full"
                          >
                            <p className="text-sm">
                              If you have verified the email address for your
                              user account, enter your User ID here and we’ll
                              email you a link to reset your password
                            </p>

                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold">
                                Email ID{" "}
                              </Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                value={email}
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </Form.Group>
                            {showOtp && (
                              <Form.Group className="mb-3">
                                <div className=" justify-content-between align-items-center">
                                  <Form.Label className="fw-bold">
                                    OTP{" "}
                                  </Form.Label>
                                  <button
                                    onClick={forgetPasswordResendOTP}
                                    className="resend-otp-btn text-[#68BFCC]"
                                    type="button"
                                  >
                                    Resend OTP
                                  </button>
                                </div>
                                <Form.Control
                                  type="tel"
                                  name="otp"
                                  value={otp}
                                  placeholder="Enter OTP"
                                  onChange={(e) => {
                                    const value = e.target.value?.trim();
                                    if (/^\d*$/.test(value)) {
                                      setOtp(value);
                                    }
                                  }}
                                />
                              </Form.Group>
                            )}

                            <Form.Group
                              className="mb-3"
                              controlId="formBasicCheckbox"
                            ></Form.Group>
                            <div className="w-full m-auto flex flex-col justify-center mt-8">
                              <div className="forget-pass-btns">
                                <Button
                                  variant="primary"
                                  type="submit"
                                  className="sendLink"
                                >
                                  Submit
                                </Button>
                                <Button
                                  variant="primary"
                                  type="button"
                                  className="Cancel"
                                  onClick={() => closeAll()}
                                >
                                  Cancel
                                </Button>
                              </div>
                              <p className="text-[#444] text-center mt-8 text-sm">
                                {" "}
                                If you have not verified your email address,
                                please contact your onsite System Administrator
                                for help resetting your password.
                              </p>

                              <hr className="text-gray-500" />
                              <p className="opacity-60 text-sm">
                                By logging in, you agree to the{" "}
                                <span className="text-blue-500 underline opacity-100 text-sm">
                                  End User License Agreement
                                </span>{" "}
                              </p>
                              <p className="mb-0 flex justify-between flex-wrap text-[#1a9fb2] mt-4 text-sm"></p>
                            </div>
                          </Form>
                        ) : showResetPasswordLink ? (
                          <div className="mt-12 text-center w-full">
                            <Alert variant="success">
                              <span className="d-flex align-items-center justify-content-center gap-2">
                                <FaCheckCircle
                                  className="fs-5"
                                  variant="success"
                                />
                                <span className="fs-5">
                                  {passwordResetLinkMsg}
                                </span>
                              </span>
                            </Alert>
                            <div className="forget-pass-btns mt-3">
                              <Button
                                variant="primary"
                                type="button"
                                className="Cancel"
                                onClick={() => closeAll()}
                              >
                                Go Back to Login Page
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Form
                            className="mt-12 text-left w-full"
                            onSubmit={handleSubmit}
                          >
                            <Form.Group
                              className="mb-3"
                              controlId="formBasicEmail"
                            >
                              <Form.Label className="fw-bold">
                                Email ID{" "}
                              </Form.Label>
                              <Form.Control
                                type="email"
                                placeholder="Enter email"
                                required
                                value={email}
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </Form.Group>

                            <Form.Group className="password_input_group mb-3">
                              <Form.Label className="fw-bold">
                                Password
                              </Form.Label>
                              <div className="relative">
                                <Form.Control
                                  type={showPasswordLogin ? "text" : "password"}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Password"
                                  className="pe-5"
                                  minLength={6}
                                  required
                                />{" "}
                                <div
                                  onClick={() =>
                                    setShowPasswordLogin(!showPasswordLogin)
                                  }
                                  className="absolute top-[30%] inline-block bg-white right-2 cursor-pointer"
                                >
                                  {!showPasswordLogin ? (
                                    <FaEye />
                                  ) : (
                                    <FaEyeSlash />
                                  )}
                                </div>
                              </div>
                            </Form.Group>
                            {showLoginOtp && (
                              <div className=" justify-content-between align-items-center">
                                <button
                                  onClick={resendOTP}
                                  className="resend-otp-btn text-[#68BFCC]"
                                  type="button"
                                >
                                  Resend OTP
                                </button>
                              </div>
                            )}
                            {showLoginOtp && (
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">OTP</Form.Label>
                                <Form.Control
                                  type="tel"
                                  name="otp"
                                  placeholder="Enter OTP"
                                  value={loginOtp}
                                  onChange={(e) => {
                                    const value = e.target.value?.trim();
                                    if (/^\d*$/.test(value)) {
                                      setLoginOtp(value);
                                    }
                                  }}
                                />
                              </Form.Group>
                            )}

                            <div className="w-full m-auto flex flex-col justify-center mt-8">
                              <Button
                                className="login_btn"
                                variant="primary"
                                type="submit"
                              >
                                {loading ? (
                                  <ClipLoader color="#fff" />
                                ) : showOtp ? (
                                  "Submit OTP"
                                ) : (
                                  "Login"
                                )}
                              </Button>

                              <button
                                className="forget_password"
                                onClick={() => {
                                  setForgetPassword(true);
                                  setEmail("");
                                  setPassword("");
                                }}
                              >
                                {" "}
                                Forgot Your Password?
                              </button>

                              <hr className="text-gray-500" />
                              <p className="opacity-60 text-sm">
                                By logging in, you agree to the{" "}
                                <span className="text-blue-500 underline opacity-100">
                                  End User License Agreement
                                </span>{" "}
                              </p>
                              <p className="mb-0 flex justify-between flex-wrap mt-4 text-[#1a9fb2] text-[14px]"></p>
                            </div>
                          </Form>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
export default Login;
