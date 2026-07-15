/** @format */

import React from "react";
import "./Intake.css";
import { intake1, intake2, intake3, intake4, intake5, intake6 } from "@/assets";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import HOC from "@/features/shared/layout/Outer/HOC";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";

const Intake = () => {
  const profile = useSelector(userProfile);

  const intakes = [
    {
      label: "Initial Assessment",
      link: `/initial-Assessment-resident-list`,
      image: intake1,
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("pia"),
    },
    {
      label: "Nursing Assessment",
      link: `/nursing-assessment-resident-list`,
      image: intake2,
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("pna"),
    },
    {
      label: "Behavioral Health Treatment Plan",
      link: `/treatment-plan-resident-list`,
      image: intake3,
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("ptp"),
    },
    {
      label: "Face Sheet",
      link: `/faceSheet-resident-list`,
      image: intake4,
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("pfs"),
    },
    {
      label: "Safety Plan",
      link: `/safety-plan-resident-list`,
      image: intake5,
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("psp"),
    },
    {
      label: "Resident Intakes",
      link: "/resident-intake-resident-list",
      image: intake6,
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("pri"),
    },
  ];

  return (
    <>
      <Container className="intake_chart_container">
        <div className="page-title-bar mb-3">
          <Row className="align-items-center">
            <Col xs={2} xl="3"></Col>
            <Col xs={8} xl="6">
              <p className="heading text-truncate-hd mb-sm-0">Intake</p>
            </Col>
            <Col xs={2} xl="3"></Col>
          </Row>
        </div>
        <Row>
          {intakes.map((intake) => (
            <Col xs={12} sm={6} md={6} lg={4} xl={4} className="mb-3">
              <Card body className="mb-3 chart_images">
                <Link
                  key={intake.label}
                  tabIndex={intake.isDisabled ? -1 : 0}
                  className={`small-card ${
                    intake.isDisabled ? "disabled-link" : ""
                  }`}
                  to={intake.link}
                  aria-disabled={intake.isDisabled}
                >
                  <div className="image">
                    <img src={intake.image} alt="Icon" className="card-icon" />
                  </div>
                  <p>{intake.label}</p>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default HOC({ Wcomponenet: Intake });
