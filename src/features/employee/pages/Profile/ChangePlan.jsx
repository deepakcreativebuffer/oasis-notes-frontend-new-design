/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  ModalBody,
  Row,
} from "react-bootstrap";
import { profileService } from "@/features/shared/services";
import parse from "html-react-parser";
import { sanitizeHtml } from "@/utils/security/sanitizeHtml";
import { ClipLoader } from "react-spinners";
import { showNotification, logger } from "@/utils";
const ChangePlan = (props) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [response, setResponse] = useState({});
  const [otpRequested, setOtpRequested] = useState(false); // To track if OTP has been requested

  const handleSelect = (plan) => {
    if (plan === props.plan) {
      showNotification({
        message: `You are already subscribed to the ${plan} plan.`,
        type: "danger",
      });
      return;
    }
    setSelectedPlan(plan);
  };
  const fetchHandler = () => {
    profileService.getPricingPlans({
      setResponse: (data) => {
        const orderedPlans = data?.data?.sort((a, b) => {
          const order = ["Basic", "Growth"];
          return order.indexOf(a.name) - order.indexOf(b.name);
        });
        setPlans({
          ...data,
          data: orderedPlans,
        });
      },
    });
  };
  useEffect(() => {
    if (props?.show) {
      fetchHandler();
    }
  }, [props?.show]);
  const resetFields = () => {
    setOtp("");
    setSelectedPlan("");
    setOtpRequested(false);
  };
  const handleRequestOtp = async () => {
    if (!selectedPlan) {
      showNotification({
        message: "Please select a plan first.",
        type: "danger",
      });
      return;
    }
    try {
      setLoading(true);
      await profileService.requestPlanChange(selectedPlan, {
        setLoading,
        setResponse,
      });
      setLoading(false);
      setOtpRequested(true);
      showNotification({
        message: "OTP sent successfully.",
        type: "success",
      });
    } catch (error) {
      setLoading(false);
      logger.error("Failed to request OTP for plan change", error);
      const msg = error?.response?.data?.message || "Failed to request OTP.";
      showNotification({
        message: msg,
        type: "danger",
      });
    }
  };
  const handleResendOtp = async () => {
    try {
      await profileService.requestPlanChange(selectedPlan, {
        setLoading,
        setResponse,
      });
      setOtp("");
      showNotification({
        message: "OTP resent successfully.",
        type: "success",
      });
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
      const res = await profileService.confirmPlanChange(
        { otp },
        { setLoading },
      );
      if (res?.success) {
        resetFields();
        props.onHide();
      }
    } catch (error) {
      logger.error("Failed to confirm plan change", error);
      const msg =
        error?.response?.data?.message || "Failed to change subscription plan.";
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
        <h5 className="fw-bold mb-0">Choose Your Subscription Plan</h5>
      </Modal.Header>
      <ModalBody>
        <Row>
          {plans?.data?.map((plan) => (
            <Col key={plan.name} md={6} className="mb-4">
              <Card
                className={`h-100 upgrade-plan-card mt-4 ${plan.name === props.plan ? "select-plan-card" : "unselect-plan-card"}`}
                style={{
                  borderColor:
                    selectedPlan === plan.name ? "#006DA0" : "#cccccc",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <Card.Body className="py-4">
                  {plan.name === props.plan && (
                    <span className="select-plan-badge">Current Plan</span>
                  )}
                  <Card.Title className="fw-bold text-center">
                    {plan.name}
                  </Card.Title>
                  <h4 className="plan-per-month text-center">{`$${plan.perUser}/month`}</h4>

                  {parse(sanitizeHtml(plan.details?.[0]))}
                  <Button
                    className="select-plan-btn"
                    variant={selectedPlan === plan.name ? "primary" : "light"}
                    onClick={() => handleSelect(plan.name)}
                    disabled={plan.name === props.plan}
                    styled={{
                      color: plan.name === props.plan ? "white" : "black",
                    }}
                  >
                    {selectedPlan === plan.name
                      ? "Selected"
                      : props.plan === "Basic"
                        ? "Upgrade Plan"
                        : "Downgrade Plan"}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {otpRequested && (
          <>
            <Row>
              <Form.Group className="mb-3 mt-3">
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
          </>
        )}
        <Row className="justify-content-center mt-3">
          <Col md={12} className="text-center">
            <Button
              className="theme-button"
              onClick={otpRequested ? submitHandler : handleRequestOtp}
            >
              {otpRequested ? (
                "Confirm Plan Change"
              ) : loading ? (
                <ClipLoader color="#fff" />
              ) : (
                "Request OTP"
              )}
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};
export default ChangePlan;
