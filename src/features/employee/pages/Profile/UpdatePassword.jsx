/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, Form, Modal, ModalBody } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import { authService } from "@/features/shared/services";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { ROLES } from "@/features/shared/constants";
import { showNotification } from "@/utils";
const UpdatePassword = (props) => {
  const ProfileDetails = useSelector(userProfile);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = (field) => {
    if (field === "old") setShowOldPassword(!showOldPassword);
    if (field === "new") setShowNewPassword(!showNewPassword);
    if (field === "confirm") setShowConfirmPassword(!showConfirmPassword);
  };
  const resetFields = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };
  const submitHandler = () => {
    const validatePassword = (password) => {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._])[A-Za-z\d@$!%*?&#._]{8,}$/;
      return passwordRegex.test(password);
    };
    if (
      !newPassword?.trim() ||
      !confirmNewPassword?.trim() ||
      !oldPassword?.trim()
    ) {
      showNotification({
        message: "Passwords fields cannot be empty",
        type: "danger",
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showNotification({
        message: "Confirm password does not match the password",
        type: "danger",
      });
      return;
    }
    if (!validatePassword(newPassword?.trim())) {
      showNotification({
        message:
          "Password must be 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        type: "danger",
      });
      return;
    }
    try {
      authService.changePassword(
        {
          password: oldPassword,
          newPassword,
          confirmPassword: confirmNewPassword,
        },
        { setLoading },
      );
      resetFields();
      props.onHide();
    } catch (error) {
      const msg = error?.response?.data?.message || "An error occurred";
      showNotification({
        message: msg,
        type: "danger",
      });
      props.onHide();
    }
  };
  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => {
          resetFields();
          props.onHide();
        }}
      >
        <Modal.Header closeButton>
          <h5 className="fw-bold mb-0">
            {ProfileDetails?.userType === ROLES.ADMIN
              ? "Change Admin Password"
              : "Change Password"}
          </h5>
        </Modal.Header>
        <ModalBody>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Old Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder={`Old Password`}
              />
              <InputGroup.Text onClick={() => togglePasswordVisibility("old")}>
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">New Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={`New Password`}
              />
              <InputGroup.Text onClick={() => togglePasswordVisibility("new")}>
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Confirm New Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder={`Confirm New Password`}
              />
              <InputGroup.Text
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </ModalBody>
        <Modal.Footer className="justify-content-center">
          <Button className="theme-button" onClick={submitHandler}>
            SAVE
          </Button>
          <Button className="theme-button-outline" onClick={props.onHide}>
            CANCEL
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default UpdatePassword;
