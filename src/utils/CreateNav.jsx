/** @format */

import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userProfile } from "@/store/authSlice";

import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";

const CreateNav = ({
  title,
  link,
  isTimesheet = false,
  permissonCheck,
  isAuthorizedToCreate = true,
  setModalShow,
  url,
}) => {
  const navigate = useNavigate();
  const profileInfo = useSelector(userProfile);
  const isRestricted = profileInfo?.accountType === ACCOUNT_TYPES.RESTRICTED;
  const isResidentOrGuardian =
    profileInfo?.userType === ROLES.PATIENT ||
    profileInfo?.userType === ROLES.GUARDIAN;

  return (
    <Container>
      <div className="page-title-bar mb-3">
        <Row className="align-items-center">
          <Col xs={2} xl="3">
            <div className="d-flex align-items-center">
              <img
                onClick={() => navigate(-1)}
                src="/back_button2.png"
                alt=""
                className="arrow cursor-pointer me-3 hidePrint"
              />
              <p className="m-0 fw-bold d-none d-lg-inline-block">Back</p>
            </div>
          </Col>
          <Col xs={8} xl="6">
            <p className="heading text-truncate-hd mb-sm-0"> {title} </p>
          </Col>

          <Col xs={2} xl="3">
            <div className="create-button text-end">
              {!isTimesheet &&
                isAuthorizedToCreate &&
                !isResidentOrGuardian && (
                  <Button
                    variant="primary"
                    className={`theme-button opacity-${isRestricted ? 50 : 100}`}
                    onClick={() => navigate(link)}
                    disabled={isRestricted}
                  >
                    {" "}
                    +{" "}
                    <span className="d-none d-lg-inline-block">Create New</span>
                  </Button>
                )}
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default CreateNav;
