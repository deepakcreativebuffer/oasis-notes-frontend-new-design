/** @format */
import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  authReleaseInfoImg,
  DischargeImg,
  stuffingNoteImg,
  ScheduleImg,
} from "@/assets";
import {
  dischargeImg,
  marsImg,
  informedConsentForm,
  MEDICATIONLOG,
} from "@/assets/index";
import HOC from "@/features/shared/layout/Outer/HOC";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import "../Intake/Intake.css";

const ProgressChartResident = () => {
  const profile = useSelector(userProfile);
  const patient_chart = [
    {
      src: DischargeImg,
      link: "/discharge-summary-resident-list",
      title: "Discharge Summary",
      isDisabled: !profile.userPermissions?.view
        ?.split(":")
        .includes("pdischarge"),
    },
    {
      src: stuffingNoteImg,
      link: "/staff-note-resident-list",
      title: "ART Meeting",
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("psn"),
    },
    {
      src: authReleaseInfoImg,
      link: "/authorization-resident-list",
      title: "Authorization for Release of information",
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("pa"),
    },
    {
      src: marsImg,
      link: "/mars-resident",
      title: "Medication Administration Record",
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("pmars"),
    },
    {
      src: informedConsentForm,
      link: "/informed-consent-resident-list",
      title: "Informed Consent for Medications",
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("pcm"),
    },
    {
      src: MEDICATIONLOG,
      link: "/prn-log-resident-list",
      title: "PRN",
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("pprn"),
    },
    {
      link: "/refusal-resident-list",
      src: dischargeImg,
      title: "Refusal of Medical Treatment Form",
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("prmt"),
    },
    {
      link: "/appendix-resident-list",
      src: ScheduleImg,
      title: "TB Risk Assessment",
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("papp"),
    },
    {
      link: "/bhp-progress-resident-list",
      src: dischargeImg,
      title: "BHP Progress Notes",
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("pbhpn"),
    },
    {
      link: "/asam-assessment-resident-list",
      src: ScheduleImg,
      title: "ASAM Criteria Checklist for Assessment",
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("pasamc"),
    },
    {
      link: "/discharge-planning-resident-list",
      src: ScheduleImg,
      title: "Discharge Planning",
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("pdp"),
    },
    {
      link: "/recertification-of-need-resident-list",
      src: ScheduleImg,
      title: "Re-Certification of Need (RON)",
      isDisabled: !(
        typeof profile.userPermissions?.view === "string"
          ? profile.userPermissions.view.split(":")
          : []
      ).includes("pron"),
    },
  ];
  return (
    <>
      <Container>
        <div className="page-title-bar mb-3">
          <Row className="align-items-center">
            <Col xs={2} xl="3"></Col>
            <Col xs={8} xl="6">
              <p className="heading text-truncate-hd mb-sm-0">Progress Chart</p>
            </Col>
            <Col xs={2} xl="3"></Col>
          </Row>
        </div>
        <div className="patient_chart_container">
          {patient_chart?.map((i, index) => (
            <Link
              to={i?.link}
              key={index}
              className={`chart_images cursor-pointer ${
                i.isDisabled ? "disabled-link" : ""
              }`}
              aria-disabled={i.isDisabled}
            >
              <img src={i.src} alt="" />
              <p>{i.title}</p>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
};

export default HOC({ Wcomponenet: ProgressChartResident });
