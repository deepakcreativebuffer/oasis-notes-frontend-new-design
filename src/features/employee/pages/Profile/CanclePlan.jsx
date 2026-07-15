/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, ModalBody, Row } from "react-bootstrap";
import { profileService } from "@/features/shared/services";
import { showNotification, logger } from "@/utils";
const CanclePlan = (props) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [response, setResponse] = useState({});
  const fetchHandler = () => {
    profileService.requestSubscriptionStatusChange({
      setResponse: setPlans,
      showAlert: true,
    });
  };
  useEffect(() => {
    if (props.show) {
      fetchHandler();
    }
  }, [props.show]);
  const resetFields = () => {
    setOtp("");
  };
  const handleResendOtp = async () => {
    try {
      await profileService.requestSubscriptionStatusChange({
        setLoading,
        setResponse,
      });
      showNotification({
        message: "OTP resent successfully.",
        type: "success",
      });
      resetFields();
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to resend OTP.";
      showNotification({
        message: msg,
        type: "danger",
      });
    }
  };
  const submitHandler = async () => {
    if (!otp) {
      showNotification({
        message: "Please enter the OTP.",
        type: "danger",
      });
      return;
    }
    try {
      const res = await profileService.confirmSubscriptionStatus(
        { otp },
        {
          setLoading,
          successMsg: props?.planCheck
            ? "The subscription plan has been resumed successfully"
            : "The plan you subscribed has been canceled",
        },
      );
      if (res?.success) {
        resetFields();
        props.onHide();
      }
    } catch (error) {
      logger.error("Failed to cancel subscription", error);
      const msg =
        error?.response?.data?.message || "Failed to cancel subscription plan.";
      showNotification({
        message: msg,
        type: "danger",
      });
    }
  };
  return (
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
          {props?.planCheck
            ? `Confirm To Resume Plan`
            : ` Confirm To Cancel Plan`}
        </h5>
      </Modal.Header>
      <ModalBody>
        <Row>
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label className="fw-bold">Enter OTP</Form.Label>
              <button
                onClick={handleResendOtp}
                className="resend-otp-btn mb-2 text-[#68BFCC]"
                type="button"
              >
                Resend OTP
              </button>
            </div>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value?.trim();
                if (/^\d*$/.test(value)) {
                  setOtp(value);
                }
              }}
              placeholder="Enter OTP"
            />
          </Form.Group>
        </Row>

        <Row className="justify-content-center mt-3">
          <Col md={12} className="text-center">
            <Button className="theme-button" onClick={submitHandler}>
              {props?.planCheck
                ? `Confirm Resume Plan`
                : ` Confirm Cancel Plan`}
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};
export default CanclePlan;
