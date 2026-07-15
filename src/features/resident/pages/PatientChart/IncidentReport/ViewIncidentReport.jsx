/** @format */

import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { patientChartService } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { useParams } from "react-router-dom";
import {
  convertTimeFormat,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import Loader from "@/features/shared/ui/Loader/Loader";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { usePrint } from "@shared/hooks";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import { PrintThis } from "@/utils";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";

const ViewIncidentReport = () => {
  const [details, setDetails] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = useRef(null);
  const fetchHandler = () => {
    patientChartService.incidentReport.getById(id, {
      setResponse: setDetails,
      setLoading,
    });
  };
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        profileInfo,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(details?.data?.patientId),
    pageStyle: `
    @page {
      size: portrait!important;
      margin: 12mm 9mm!important;
    }    
    .card {
      page-break-inside: avoid;
    }
    .view-details-grid {
      page-break-inside: avoid;
    }
  `,
  });
  const handlePrint2 = () => {
    PrintThis(handlePrint);
  };
  const print = usePrint(printRef, handlePrint2);
  let signerIndex1 = details?.data?.signers?.findIndex?.(
    (signer, i) => signer.signerId === profileInfo._id,
  );
  if (signerIndex1 === undefined || signerIndex1 === null) signerIndex1 = -1;
  let signerIndex2 = details?.data?.signers2?.findIndex?.(
    (signer, i) => signer.signerId === profileInfo._id,
  );
  if (signerIndex2 === undefined || signerIndex2 === null) signerIndex2 = -1;
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper title={"Incident Report Form"} isArrow={true} />
      {loading ? (
        <Loader />
      ) : (
        <Container>
          <div className="incident-report" ref={componentRef}>
            <h1 className="pdfTitle my-3 hidden">Incident Report Form</h1>
            {(profileInfo.userType === ROLES.ADMIN ||
              (profileInfo.userType === ROLES.EMPLOYEE &&
                profileInfo.accountType === ACCOUNT_TYPES.ADMINISTRATOR) ||
              (profileInfo.userType === ROLES.EMPLOYEE &&
                profileInfo.accountType === ACCOUNT_TYPES.REGULAR) ||
              (profileInfo.userType === ROLES.EMPLOYEE &&
                profileInfo.accountType === ACCOUNT_TYPES.RESTRICTED)) && (
              <>
                <Row>
                  <Col xs={12}></Col>
                </Row>
                <div className="view-details">
                  <Row>
                    <Col
                      xs={12}
                      sm={8}
                      md={12}
                      lg={3}
                      className={`${!details?.data?.patientId && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Resident&apos;s Name :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.patientId &&
                            fetchPaitentName(details?.data?.patientId)}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={4}
                      md={12}
                      lg={3}
                      className={`${!details?.data?.dateOfIncident && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Date of Incident : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.dateOfIncident &&
                            formatDateToMMDDYYYY(details?.data?.dateOfIncident)}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={8}
                      md={12}
                      lg={3}
                      className={`${!details?.data?.beginTime && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Begin Time : </p>
                        <h5 className="view-value mb-0">
                          {convertTimeFormat(
                            details?.data?.beginTime,
                            hoursFormat,
                          )}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={4}
                      md={12}
                      lg={3}
                      className={`${!details?.data?.endTime && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">End Time : </p>
                        <h5 className="view-value mb-0">
                          {convertTimeFormat(
                            details?.data?.endTime,
                            hoursFormat,
                          )}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={6}
                      className={`${!details?.data?.employeesInvolved && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Name of Employee/s Involved :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.employeesInvolved
                            ?.map((employees) => fetchPaitentName(employees))
                            .join(", ")}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={6}
                      className={`${!details?.data?.residentsInvolved && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Name Resident/s Involved :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.residentsInvolved
                            ?.map((employees) => fetchPaitentName(employees))
                            .join(", ")}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className={`${!details?.data?.personObservingReporting && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Name/Title of Person Observing/Reporting Incident
                          :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.personObservingReporting}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={6}
                      className={`mb-1 mb-md-3 ${!details?.data?.incidents && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3 h-100">
                        <p className="view-label mb-1">INCIDENTS </p>

                        <div className="view-value">
                          <ul className="ps-3 mt-2">
                            {details?.data?.incidents?.map(
                              (incidents, index) => (
                                <li className="mb-2 list-disc" key={index}>
                                  {incidents}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={6}
                      className={`mb-1 mb-md-3 ${!details?.data?.levelOfSeverity && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3 h-100">
                        <p className="view-label mb-1">LEVEL OF SEVERITY</p>

                        <div className="view-value">
                          <ul className="ps-3 mt-2">
                            {details?.data?.levelOfSeverity?.map(
                              (levelOfSeverity, index) => (
                                <li className="mb-2 list-disc" key={index}>
                                  {levelOfSeverity}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className={`${!details?.data?.eventDetails && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Describe the event in detail : What happened before,
                          during, and after the incident :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.eventDetails}
                        </h5>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Form.Label className="fw-bold">
                        MEDICATION ERRORS
                      </Form.Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${!details?.data?.medicationErrorsMissedDose && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Missed Dose : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.medicationErrorsMissedDose
                            ? "Yes"
                            : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.medicationErrorsWrongClient === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Refused Medication : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.medicationErrorsWrongClient
                            ? "Yes"
                            : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.medicationErrorsWrongClient === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Wrong Client : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.medicationErrorsWrongClient
                            ? "Yes"
                            : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.medicationErrorsWrongTime === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Wrong Time : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.medicationErrorsWrongTime
                            ? "Yes"
                            : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.medicationErrorsWrongMed === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Wrong Med : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.medicationErrorsWrongMed
                            ? "Yes"
                            : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.medicationErrorsNone === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">None : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.medicationErrorsNone ? "Yes" : "No"}
                        </h5>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Form.Label className="fw-bold">
                        Action/s taken: (Check all that apply)
                      </Form.Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.actionsTakenSenttoERHospital === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Sent to ER/Hospital :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.actionsTakenSenttoERHospital
                            ? "Yes"
                            : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.actionsTakenFirstAid === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">First Aid : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.actionsTakenFirstAid ? "Yes" : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.actionsTakenNoMedicalCareRequired === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          No Medical Care Required :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.actionsTakenNoMedicalCareRequired
                            ? "Yes"
                            : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.CareRefused === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Care Refused : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.CareRefused ? "Yes" : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.actionsTakenFireDepartmentCalled === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Fire Department Called :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.actionsTakenFireDepartmentCalled
                            ? "Yes"
                            : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.actionsTakenPoliceCalled === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Police Called : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.actionsTakenPoliceCalled
                            ? "Yes"
                            : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={6}
                      className={`${details?.data?.actionsTakenReferredtoAdministratorRiskManagement === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Referred to Administrator/Risk Management :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {details?.data
                            ?.actionsTakenReferredtoAdministratorRiskManagement
                            ? "Yes"
                            : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={6}
                      className={`${details?.data?.actionsTakenMaintenanceCalledWorkOrderCompleted === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Maintenance Called/Work Order Completed :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {details?.data
                            ?.actionsTakenMaintenanceCalledWorkOrderCompleted
                            ? "Yes"
                            : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={6}
                      className={`${details?.data?.actionsTakenOther === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Other : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.actionsTakenOther ? "Yes" : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={6}
                      className={`${details?.data?.actionsTakenOtherComment === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Other : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.actionsTakenOtherComment}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      className={`${details?.data?.abuseNeglectInvolved === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          If Abuse, Neglect Neglected :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.abuseNeglectInvolved ? " Yes" : " No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      className={`${details?.data?.stateContacted === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">State contacted : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.stateContacted ? " Yes" : " No"}
                        </h5>
                      </div>
                    </Col>
                    {!details?.data?.abuseNeglectInvolved && (
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        className={`${!details?.data?.abuseNeglectInvolvedifYes && "hidePrint"}`}
                      >
                        <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                          <p className="view-label mb-1">If No, Explain : </p>
                          <h5 className="view-value mb-0">
                            {details?.data?.abuseNeglectInvolvedifYes}
                          </h5>
                        </div>
                      </Col>
                    )}
                  </Row>
                  <Row className="mt-2">
                    <Col xs={12} md={12} lg={12}>
                      <Form.Label className="fw-bold">Notifications</Form.Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.notificationsFamily === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3 flex justify-between flex-col">
                        <div>
                          <span className="view-label mb-1">Family : </span>
                          <span className="view-value mb-0">
                            {details?.data?.notificationsFamily ? "Yes" : "No"}
                          </span>
                        </div>
                        <div>
                          <span className="view-label mb-1">
                            Date of Notification :{" "}
                          </span>
                          <span className="view-value mb-0">
                            {formatDateToMMDDYYYY(
                              details?.data?.notificationDate,
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="view-label mb-1">
                            Time of Notification :{" "}
                          </span>
                          <span className="view-value mb-0">
                            {convertTimeFormat(
                              details?.data?.notificationTime,
                              hoursFormat,
                            )}
                          </span>
                        </div>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.notificationsGuardian === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3 flex justify-between flex-col">
                        <div>
                          <span className="view-label mb-1">Guardian : </span>
                          <span className="view-value mb-0">
                            {details?.data?.notificationsGuardian
                              ? "Yes"
                              : "No"}
                          </span>
                        </div>
                        <div>
                          <span className="view-label mb-1">
                            Date of Notification :{" "}
                          </span>
                          <span className="view-value mb-0">
                            {formatDateToMMDDYYYY(
                              details?.data?.notificationDateGuardian,
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="view-label mb-1">
                            Time of Notification :{" "}
                          </span>
                          <span className="view-value mb-0">
                            {convertTimeFormat(
                              details?.data?.notificationTimeGuardian,
                              hoursFormat,
                            )}
                          </span>
                        </div>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.notificationsCaseManager === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3 flex justify-between flex-col">
                        <div>
                          <span className="view-label mb-1">
                            Case Manager :{" "}
                          </span>
                          <span className="view-value mb-0">
                            {details?.data?.notificationsCaseManager
                              ? "Yes"
                              : "No"}
                          </span>
                        </div>
                        <div>
                          <span className="view-label mb-1">
                            Date of Notification :{" "}
                          </span>
                          <span className="view-value mb-0">
                            {formatDateToMMDDYYYY(
                              details?.data?.notificationDateCaseManager,
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="view-label mb-1">
                            Time of Notification :{" "}
                          </span>
                          <span className="view-value mb-0">
                            {convertTimeFormat(
                              details?.data?.notificationTimeCaseManager,
                              hoursFormat,
                            )}
                          </span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.notificationsOther === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3 flex justify-between flex-col">
                        <div>
                          <span className="view-label mb-1">Other : </span>
                          <span className="view-value mb-0">
                            {details?.data?.otherNotificationValue}
                          </span>
                        </div>
                        <div>
                          <span className="view-label mb-1">
                            Date of Notification :{" "}
                          </span>
                          <span className="view-value mb-0">
                            {formatDateToMMDDYYYY(
                              details?.data?.notificationDateOther,
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="view-label mb-1">
                            Time of Notification :{" "}
                          </span>
                          <span className="view-value mb-0">
                            {convertTimeFormat(
                              details?.data?.notificationTimeOther,
                              hoursFormat,
                            )}
                          </span>
                        </div>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={4}
                      className={`${details?.data?.notificationsOther2 === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3 flex justify-between flex-col">
                        <div>
                          <span className="view-label mb-1">Other : </span>
                          <span className="view-value mb-0">
                            {details?.data?.other2NotificationValue}
                          </span>
                        </div>
                        <div>
                          <span className="view-label mb-1">
                            Date of Notification :{" "}
                          </span>
                          <span className="view-value mb-0">
                            {formatDateToMMDDYYYY(
                              details?.data?.notificationDateOther2,
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="view-label mb-1">
                            Time of Notification :{" "}
                          </span>
                          <span className="view-value mb-0">
                            {convertTimeFormat(
                              details?.data?.notificationTimeOther2,
                              hoursFormat,
                            )}
                          </span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Form.Label className="fw-bold">
                        Mode of communication
                      </Form.Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={3}
                      className={`${details?.data?.modeEmail === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Email : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.modeEmail ? "Yes" : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={3}
                      className={`${details?.data?.modePhoneCall === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Phone Call : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.modePhoneCall ? "Yes" : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={3}
                      className={`${details?.data?.modeInPerson === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">In Person : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.modeInPerson ? "Yes" : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={3}
                      className={`${details?.data?.modeOther === (null || undefined) && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Other : </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.modeOther ? "Yes" : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className={`${!details?.data?.reportCompletedBy && "hidePrint"}`}
                    >
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Report Completed By :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {details?.data?.reportCompletedBy}
                        </h5>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col xs={12} sm={12}>
                      <Form.Label className="fw-bold">
                        INCIDENT REPORTS ARE TO BE COMPLETED AND FORWARDED
                        WITHIN 24 HOURS OF INCIDENT TO ADMINISTRATOR
                      </Form.Label>
                    </Col>
                  </Row>
                </div>
              </>
            )}

            {(profileInfo.userType === ROLES.ADMIN ||
              (profileInfo.userType === ROLES.EMPLOYEE &&
                profileInfo.accountType === ACCOUNT_TYPES.ADMINISTRATOR)) &&
              (details?.data?.investigationOfInvestment ||
                details?.data?.recommendationAndActions ||
                details?.data?.followUp) && (
                <>
                  <div className="view-details">
                    <Row>
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        lg={4}
                        className={`${!details?.data?.investigationOfInvestment && "hidePrint"}`}
                      >
                        <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                          <p className="view-label mb-1">
                            Investigation of Incident :{" "}
                          </p>
                          <h5 className="view-value mb-0">
                            {details?.data?.investigationOfInvestment}
                          </h5>
                        </div>
                      </Col>
                      <Col
                        xs={12}
                        sm={12}
                        md={6}
                        lg={4}
                        className={`${!details?.data?.recommendationAndActions && "hidePrint"}`}
                      >
                        <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                          <p className="view-label mb-1">
                            Recommendations and Actions :{" "}
                          </p>
                          <h5 className="view-value mb-0">
                            {details?.data?.recommendationAndActions}
                          </h5>
                        </div>
                      </Col>
                      <Col
                        xs={12}
                        sm={12}
                        md={6}
                        lg={4}
                        className={`${!details?.data?.followUp && "hidePrint"}`}
                      >
                        <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                          <p className="view-label mb-1">Follow up : </p>
                          <h5 className="view-value mb-0">
                            {details?.data?.followUp}
                          </h5>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </>
              )}
            <Row className="mt-2">
              <Col xs={12} sm={12} className="text-end">
                {signatureFormat({
                  sign: details?.data?.savedSignedPartA,
                  date: details?.data?.signedDatePartA,
                  time: details?.data?.signedTimePartA,
                  hoursFormat,
                })}

                {signatureFormat({
                  sign: details?.data?.adminSignature,
                  date: details?.data?.adminDateSigned,
                  time: details?.data?.adminSignedTime,
                  hoursFormat,
                })}

                {details?.data?.signers?.map(
                  (signer, i) =>
                    signer.signature && (
                      <Form.Label className="w-100 text-end mb-0">
                        {signatureFormat({
                          sign: signer.signature,
                          date: signer.dateSigned,
                          time: signer.signedTime,
                          hoursFormat,
                        })}
                      </Form.Label>
                    ),
                )}
              </Col>
            </Row>

            {details?.data?.signatures && (
              <div className="signature-sections-inline mt-3 border-0">
                <SignatureSection
                  role="bht"
                  label="BHT Signature"
                  variant="blue"
                  signature={details.data.signatures.bht}
                  viewMode={true}
                  externalName
                />
                <SignatureSection
                  role="bhp"
                  label="BHP Signature"
                  variant="pink"
                  signature={details.data.signatures.bhp}
                  viewMode={true}
                  externalName
                />
                {/* <SignatureSection
                  role="resident"
                  label="Resident/Representative Signature"
                  variant="blue"
                  signature={details.data.signatures.resident}
                  viewMode={true}
                  signerNameOverride={
                    details?.data?.residentsInvolved?.length > 0
                      ? details.data.residentsInvolved
                          .map((r) =>
                            `${r?.firstName || ""} ${r?.lastName || ""}`.trim(),
                          )
                          .join(", ")
                      : details?.data?.patientId?.firstName
                        ? `${details?.data?.patientId?.firstName} ${details?.data?.patientId?.lastName}`.trim()
                        : ""
                  }
                /> */}
                {/* <SignatureSection
                  role="witness"
                  label="Witness Signature"
                  variant="yellow"
                  signature={details.data.signatures.witness}
                  viewMode={true}
                  externalName
                /> */}
              </div>
            )}

            <button
              className="print_btn hidePrint"
              type="button"
              onClick={print}
            >
              PRINT REPORT
            </button>
          </div>
        </Container>
      )}
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewIncidentReport,
});
