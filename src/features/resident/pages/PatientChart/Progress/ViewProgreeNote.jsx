/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { patientChartService } from "@/features/shared/services";
import {
  convertTimeFormat,
  formatDateToMMDDYYYY,
  handleMeal,
  otherHandler,
} from "@/utils/utils";
import { signatureFormat } from "@/utils/utils";
import { useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import "@/assets/styles/Print.css";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { PrintThis } from "@/utils";
const ViewProgreeNote = () => {
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  useEffect(() => {
    patientChartService.progressNote.getById(id, { setResponse: setDetail });
  }, [id]);
  const componentRef = React.useRef();
  const printRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        detail?.data?.admin,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(detail?.data?.patientId),
    pageStyle: `
    @page {
      size: portrait !important;
      margin: 12mm 9mm!important;
    }     
    .card {
      page-break-inside: avoid;
    }
    .view-details-grid{
      page-break-inside: avoid;
     }
  `,
  });
  const handlePrint2 = () => {
    PrintThis(handlePrint);
  };
  const printHandler = () => {
    fun();
  };
  const fun = usePrint(printRef, handlePrint2);
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper title={"Shift Progress Note"} isArrow={true} />
      <Container>
        <div className="progress-note" ref={componentRef}>
          <h1 className="pdfTitle mt-3 hidden">Shift Progress Note</h1>
          <div className="view-details w-100 mt-3">
            <Row>
              <Col
                sm={5}
                md={6}
                lg={4}
                className={`${!detail?.data?.residentName && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Resident Name :</p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.residentName}
                  </h5>
                </div>
              </Col>
              <Col
                sm={3}
                md={6}
                lg={4}
                className={`${!detail?.data?.patientId?.admitDate && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Admit Date : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.patientId?.admitDate &&
                      formatDateToMMDDYYYY(detail?.data?.patientId?.admitDate)}
                  </h5>
                </div>
              </Col>
              <Col
                sm={4}
                md={6}
                lg={4}
                className={`${!detail?.data?.patientId?.dateOfBirth && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">DOB : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.patientId?.dateOfBirth &&
                      formatDateToMMDDYYYY(
                        detail?.data?.patientId?.dateOfBirth,
                      )}
                  </h5>
                </div>
              </Col>
              <Col
                md={6}
                sm={5}
                lg={4}
                className={`${!detail?.data?.date && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.date &&
                      formatDateToMMDDYYYY(detail?.data?.date)}
                  </h5>
                </div>
              </Col>
              <Col
                md={6}
                sm={7}
                lg={4}
                className={`${!detail?.data?.patientId?.ahcccsId && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">AHCCCS ID : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.patientId?.ahcccsId}
                  </h5>
                </div>
              </Col>
              <Col
                md={12}
                sm={12}
                lg={6}
                className={`${!detail?.data?.patientId?.diagnosis && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Diagnosis (specify if new or continuing) :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.patientId?.diagnosis}
                  </h5>
                </div>
              </Col>
              <Col
                md={6}
                sm={5}
                lg={3}
                className={`${!detail?.data?.shiftBeginning && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Shift: Beginning Time : </p>
                  <h5 className="view-value mb-0">
                    {convertTimeFormat(
                      detail?.data?.shiftBeginning,
                      hoursFormat,
                    )}
                  </h5>
                </div>
              </Col>
              <Col
                md={6}
                sm={7}
                lg={3}
                className={`${!detail?.data?.shiftEnd && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Shift: End Time : </p>
                  <h5 className="view-value mb-0">
                    {convertTimeFormat(detail?.data?.shiftEnd, hoursFormat)}
                  </h5>
                </div>
              </Col>
              <Col
                md={12}
                sm={12}
                lg={6}
                className={`${!detail?.data?.appointment && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Appointment : </p>
                  <h5 className="view-value mb-0">
                    {(detail?.data?.appointment ||
                      detail?.data?.appointmentOther) &&
                      otherHandler(
                        detail?.data?.appointment,
                        "Other",
                        detail?.data?.appointmentOther,
                      )}{" "}
                  </h5>
                </div>
              </Col>
              <Col
                md={12}
                sm={12}
                lg={6}
                className={`${!detail?.data?.mood && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Mood : </p>
                  <h5 className="view-value mb-0">
                    {(detail?.data?.mood || detail?.data?.moodOther) &&
                      otherHandler(
                        detail?.data?.mood,
                        "Other",
                        detail?.data?.moodOther,
                      )}
                  </h5>
                </div>
              </Col>
              <Col
                md={12}
                sm={12}
                lg={6}
                className={`${!detail?.data?.behaviors && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Behaviors : </p>
                  <h5 className="view-value mb-0">
                    {(detail?.data?.behaviors ||
                      detail?.data?.behaviorsOther) &&
                      otherHandler(
                        detail?.data?.behaviors,
                        "Other",
                        detail?.data?.behaviorsOther,
                      )}
                  </h5>
                </div>
              </Col>
              <Col
                md={12}
                sm={12}
                lg={6}
                className={`${!detail?.data?.speech && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Speech : </p>
                  <h5 className="view-value mb-0">
                    {(detail?.data?.speech || detail?.data?.speechOther) &&
                      otherHandler(
                        detail?.data?.speech,
                        "Other",
                        detail?.data?.speechOther,
                      )}
                  </h5>
                </div>
              </Col>
              <Col
                md={12}
                sm={12}
                lg={6}
                className={`${(detail?.data?.residentRedirectedOnBehaviors ?? "") === "" && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Resident redirected on behaviors? :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.residentRedirectedOnBehaviors ? "Yes" : "No"}
                  </h5>
                </div>
              </Col>
              <Col
                md={12}
                sm={12}
                lg={6}
                className={`${!detail?.data?.participatedInGroupIndividualTherapySession && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Participated in group/individual therapy session(s)? :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.participatedInGroupIndividualTherapySession}
                  </h5>
                </div>
              </Col>
              <Col
                md={12}
                sm={12}
                lg={6}
                className={`${(detail?.data?.HealthAndWelfareChecks ?? "") === "" && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Health and welfare checks at least every 30 minutes to 1
                    hour? :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.HealthAndWelfareChecks ? " Yes" : " No"}
                  </h5>
                </div>
              </Col>
              <Col
                md={6}
                sm={12}
                lg={6}
                className={`${(detail?.data?.communityOutings ?? "") === "" && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Outing in community? : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.communityOutings ? "Yes" : "No"}
                  </h5>
                </div>
              </Col>
              <Col
                md={6}
                sm={12}
                lg={6}
                className={`${!detail?.data?.mealPreparation && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Meal preparation : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.mealPreparation}
                  </h5>
                </div>
              </Col>
              <Col
                md={6}
                sm={12}
                lg={6}
                className={`${!detail?.data?.mealOffered && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Meal offered and taken : </p>
                  <h5 className="view-value mb-0">
                    {handleMeal(detail?.data?.mealOffered)}
                  </h5>
                </div>
              </Col>
              <Col
                md={6}
                sm={12}
                lg={6}
                className={`${!detail?.data?.snacksOffered && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Snacks offered and taken : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.snacksOffered}
                  </h5>
                </div>
              </Col>
              <Col
                md={6}
                sm={12}
                lg={6}
                className={`${(detail?.data?.awolElopement ?? "") === "" && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">AWOL : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.awolElopement ? " Yes" : " No"}
                  </h5>
                </div>
              </Col>
              <Col
                md={6}
                sm={12}
                lg={6}
                className={`${(detail?.data?.adlsCompleted ?? "") === "" && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">ADLS Completed? : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.adlsCompleted ? " Yes" : " No"}
                  </h5>
                </div>
              </Col>
              <Col
                md={6}
                sm={12}
                lg={6}
                className={`${!detail?.data?.medicationAdministered && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Medication administered : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.medicationAdministered}
                  </h5>
                </div>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <h5 className="fw-bold">Prompts</h5>
              </Col>
            </Row>
            <Row>
              <Col
                md={12}
                sm={12}
                lg={6}
                className={`${(detail?.data?.promptedToTakeMedications ?? "") === "" && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Was resident prompted to take medications :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.promptedToTakeMedications ? " Yes" : " No"}
                  </h5>
                </div>
              </Col>
              <Col
                md={12}
                sm={12}
                lg={6}
                className={`${(detail?.data?.promptedToCompleteADLS ?? "") === "" && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Was resident prompted to complete ADLS :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.promptedToCompleteADLS ? " Yes" : " No"}
                  </h5>
                </div>
              </Col>
              <Col
                md={12}
                sm={12}
                lg={6}
                className={`${(detail?.data?.waterTemperature ?? "") === "" && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Was the water temperature adjusted for resident :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.waterTemperature ? " Yes" : " No"}
                  </h5>
                </div>
              </Col>

              <Col
                md={12}
                sm={12}
                lg={6}
                className={`${(detail?.data?.appropriateClothing ?? "") === "" && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Was resident assisted in selecting appropriate clothing
                    :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.appropriateClothing ? " Yes" : " No"}
                  </h5>
                </div>
              </Col>
              <Col
                md={12}
                sm={12}
                lg={12}
                className={`${!detail?.data?.activities && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Activities : </p>
                  <h5 className="view-value mb-0">
                    {otherHandler(
                      detail?.data?.activities,
                      "Other",
                      detail?.data?.activitiesOther,
                    )}
                  </h5>
                </div>
              </Col>
              <Col md={12} sm={12} lg={12}>
                <div className="view-details-grid flex flex-wrap gap-2 my-1 my-md-2 p-3">
                  <div>
                    <span className="view-label mb-1">I : </span>
                    <span className="view-value mb-0">Independent</span>
                  </div>
                  <div>
                    <span className="view-label mb-1">R : </span>
                    <span className="view-value mb-0">Refused</span>
                  </div>
                  <div>
                    <span className="view-label mb-1">PA : </span>
                    <span className="view-value mb-0">Partial Assist</span>
                  </div>
                  <div>
                    <span className="view-label mb-1">TA : </span>
                    <span className="view-value mb-0">Total Assist</span>
                  </div>
                  <div>
                    <span className="view-label mb-1">VP : </span>
                    <span className="view-value mb-0">Verbal Prompt</span>
                  </div>
                  <div>
                    <span className="view-label mb-1">NP : </span>
                    <span className="view-value mb-0">No prompt</span>
                  </div>
                  <div>
                    <span className="view-label mb-1">HP : </span>
                    <span className="view-value mb-0">Home Pass</span>
                  </div>
                  <div>
                    <span className="view-label mb-1">H : </span>
                    <span className="view-value mb-0">Hospitalization </span>
                  </div>
                </div>
              </Col>
              <Col
                md={12}
                sm={12}
                lg={12}
                className={`${!detail?.data?.noteSummary && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Shift Note Summary : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.noteSummary}
                  </h5>
                </div>
              </Col>
            </Row>
          </div>
          <div className="w-100 text-end mt-2">
            {signatureFormat({
              sign: detail?.data?.bhtSignature,
              date: detail?.data?.dateSigned,
              time: detail?.data?.signedTime,
              hoursFormat,
            })}
            {signatureFormat({
              sign: detail?.data?.adminSignature,
              date: detail?.data?.adminDateSigned,
              time: detail?.data?.adminSignedTime,
              hoursFormat,
            })}
          </div>
          <div className="text-end">
            {detail?.data?.signers?.map(
              (signer) =>
                signer.signature && (
                  <div key={signer?.signerId}>
                    {signatureFormat({
                      sign: signer.signature,
                      date: signer.dateSigned,
                      time: signer.signedTime,
                      hoursFormat,
                    })}
                  </div>
                ),
            )}
          </div>
          <button className="print_btn hidePrint" type="button" onClick={fun}>
            PRINT REPORT
          </button>
        </div>
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewProgreeNote,
});
