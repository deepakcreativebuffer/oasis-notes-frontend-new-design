/** @format */

import React, { useEffect, useState } from "react";
import "./ChangePassword.css";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { changePasswordImg as ChangePasswordImg } from "@/assets";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setPassword } from "@/features/shared/services/index";
import { ROUTES } from "@/features/shared/constants/index";
import { showNotification } from "@/utils";

const Logo = () => (
  <div className="nav-logo-change">
    <img
      width="378"
      height="116"
      src="https://oasisnotes.com/wp-content/uploads/2024/07/oasisLogo.png"
      className="custom-logo changepassword-logo"
      alt="Oasisnotes.com"
      decoding="async"
      srcSet="https://oasisnotes.com/wp-content/uploads/2024/07/oasisLogo.png 378w, https://oasisnotes.com/wp-content/uploads/2024/07/oasisLogo-300x92.png 300w"
      sizes="(max-width: 378px) 100vw, 378px"
    />
  </div>
);

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._])[A-Za-z\d@$!%*?&#._]{8,}$/;

const ChangePassword = () => {
  const [token, setToken] = useState();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const newPassword = data.get("newPassword");
    const confirmPassword = data.get("confirmPassword");

    if (!newPassword?.trim() || !confirmPassword?.trim()) {
      showNotification({
        message: "Password fields cannot be empty",
        type: "danger",
      });
      return;
    }
    if (newPassword?.trim() !== confirmPassword?.trim()) {
      showNotification({
        message: "Confirm password does not match the password",
        type: "danger",
      });
      return;
    }
    if (!PASSWORD_REGEX.test(newPassword.trim())) {
      showNotification(
        "Error",
        "Password must be 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        "danger",
      );
      return;
    }

    const handleRequest = async () => {
      const res = await setPassword({
        token,
        password: newPassword?.trim(),
        confirm_password: confirmPassword?.trim(),
      });

      if (res.success) {
        navigate(ROUTES.HOME);
        showNotification({ message: res.message, type: "success" });
      } else {
        showNotification({ message: res.message, type: "danger" });
      }
    };
    handleRequest();
  };

  return (
    <div className="change-password-container-main">
      <Logo />
      <Container className="container-box container-box-change-password">
        <Row className="align-items-center">
          <Col sm="12" md="5">
            <div className="change-password-image p-4 d-none d-md-block">
              <img
                src={ChangePasswordImg}
                className="img-fluid"
                alt="passChange"
              />
            </div>
          </Col>
          <Col sm="12" md="6" className="offset-md-1">
            <div className="change-password-container p-4">
              <div className="change-password-card">
                <h3 className="change-password-heading mb-3 mb-md-5 fw-bold">
                  Change Password
                </h3>
                <form className="change-password-form" onSubmit={handleSubmit}>
                  <div className="form-group form-group-change-password">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        required
                      />
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inline-block bg-white cursor-pointer top-[30%] right-[8px]"
                      >
                        {!showPassword ? <FaEye /> : <FaEyeSlash />}
                      </div>
                    </div>
                  </div>
                  <div className="form-group form-group-change-password">
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                      />
                      <div
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inline-block bg-white cursor-pointer top-[30%] right-[8px]"
                      >
                        {!showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="change-password-button mt-3">
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChangePassword;
