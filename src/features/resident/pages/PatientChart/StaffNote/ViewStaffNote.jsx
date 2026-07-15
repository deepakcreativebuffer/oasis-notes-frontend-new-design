/** @format */

// NOTE: Form is "Staffing Note" in code but "ART Meeting" in the UI.
// See CreateStaffNote.js header for context.

import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { getData } from "@/features/shared/services";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import { useParams, useSearchParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  signatureFormat,
  formatDateToMMDDYYYY,
  convertTimeFormat,
} from "@/utils/utils";
import "@/assets/styles/Print.css";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import { downloadReport } from "@/utils";
const ViewStaffNote = () => {
  const { id } = useParams();
  const [details, setDetails] = useState({});
  const Profile = useSelector(userProfile);
  const hoursFormat = Profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = useRef(null);
  const fetchHandler = () => {
    getData(setDetails, `employee/getStaffingNoteById/${id}`);
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
        Profile,
        Profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(details?.data?.patientId),
    pageStyle: `
    @page {
      size: portrait !important;
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
    downloadReport(handlePrint);
  };
  const print = usePrint(printRef, handlePrint2);
  const [searchParams] = useSearchParams();
  const [hasAutoPrinted, setHasAutoPrinted] = useState(false);
  useEffect(() => {
    if (
      !hasAutoPrinted &&
      searchParams.get("autoPrint") === "1" &&
      details?.data
    ) {
      setHasAutoPrinted(true);
      setTimeout(() => handlePrint2(), 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details, searchParams, hasAutoPrinted]);
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper isArrow={true} title={"ART Meeting"} />
      <Container>
        <div className="staffing-note" ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">ART Meeting</h1>
          <div className="view-details">
            <Row>
              <Col
                col={12}
                sm={5}
                md={6}
                lg={4}
                className={`${!details?.data?.residentName && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Resident Name : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.residentName}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={4}
                md={6}
                lg={4}
                className={`${!details?.data?.patientId?.ahcccsId && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">AHCCCS ID : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.patientId?.ahcccsId}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={3}
                md={6}
                lg={4}
                className={`${!details?.data?.patientId?.admitDate && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Admit Date : </p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(details?.data?.patientId?.admitDate)}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={5}
                md={6}
                lg={4}
                className={`${!details?.data?.todayDate && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.todayDate &&
                      formatDateToMMDDYYYY(details?.data?.todayDate)}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={4}
                md={6}
                lg={4}
                className={`${!details?.data?.beginTime && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Begin time : </p>
                  <h5 className="view-value mb-0">
                    {convertTimeFormat(details?.data?.beginTime, hoursFormat)}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={3}
                md={6}
                lg={4}
                className={`${!details?.data?.endTime && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">End time : </p>
                  <h5 className="view-value mb-0">
                    {convertTimeFormat(details?.data?.endTime, hoursFormat)}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!details?.data?.patientId?.diagnosis && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Diagnosis (specify if new or continuing) :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.patientId?.diagnosis}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!details?.data?.participantsPresent && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Participant : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.participantsPresent}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!(details?.data?.patientId?.presentingProblems && details?.data?.patientId?.presentingProblems.length > 0) && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Presenting Problems : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.patientId?.presentingProblems?.join(", ") ||
                      "N/A"}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!details?.data?.staffingWithin30Days && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Was ART Meeting conducted within 30 days :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.staffingWithin30Days}
                  </h5>
                </div>
                {details?.data?.staffingWithin30Days === "No" && (
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">
                      If ART Meeting was not conducted within 30 days why :
                    </p>
                    <h5 className="view-value mb-0">
                      {details?.data?.reasonForNoStaffingWithin30Days}
                    </h5>
                  </div>
                )}
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={6}
                className={`${(details?.data?.clinicTreatmentPlanRequested == null || details?.data?.clinicTreatmentPlanRequested === "") && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Was resident’s behavioral health treatment plan from the
                    clinic requested :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.clinicTreatmentPlanRequested ? "Yes" : "No"}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={6}
                className={`${(details?.data?.stepDownDiscussed == null || details?.data?.stepDownDiscussed === "") && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Was step down discussed : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.stepDownDiscussed ? "Yes" : "No"}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={6}
                lg={6}
                className={`${!details?.data?.goalsAddressed && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Were resident’s goals addressed :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.goalsAddressed}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={6}
                lg={6}
                className={`${!details?.data?.progress && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">ART Meeting Summary : </p>
                  <h5 className="view-value mb-0">{details?.data?.progress}</h5>
                </div>
              </Col>
              <Col col={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Barriers : </p>
                  <h5 className="view-value mb-0">
                    {(() => {
                      const rawBarriers =
                        details?.data?.patientId?.stepDownBarriers || [];
                      const otherValue =
                        details?.data?.patientId?.stepDownBarriersOther;
                      if (
                        !Array.isArray(rawBarriers) ||
                        rawBarriers.length === 0
                      ) {
                        return "";
                      }
                      const mapped = rawBarriers.map(
                        (item) =>
                          ({
                            Cognitive: "Cognitive",
                            cognitive: "Cognitive",
                            "Lack of Insight": "Lack of Insight",
                            lackOfInsight: "Lack of Insight",
                            Financial: "Financial",
                            financial: "Financial",
                            "Refusal of Treatment/services":
                              "Refusal of Treatment/services",
                            refusalOfTreatment: "Refusal of Treatment/services",
                            "Social Stigma": "Social Stigma",
                            socialStigma: "Social Stigma",
                            "Housing instability": "Housing instability",
                            housinginstability: "Housing instability",
                            "Racial/Cultural discrimination":
                              "Racial/Cultural discrimination",
                            racial: "Racial/Cultural discrimination",
                            "Language/Communication barriers":
                              "Language/Communication barriers",
                            language: "Language/Communication barriers",
                            "Poor health literacy": "Poor health literacy",
                            poorHealth: "Poor health literacy",
                            "Social determinants of health":
                              "Social determinants of health",
                            socialDeterminants: "Social determinants of health",
                            "Limited availibility to Mental Health awareness & Education":
                              "Limited availibility to Mental Health awareness & Education",
                            limitedavailibilitytoMentalHealthawarenessEducation:
                              "Limited availibility to Mental Health awareness & Education",
                            "Lack of Mental Health professionals & Services":
                              "Lack of Mental Health professionals & Services",
                            "lackofMentalHealthprofessionals&Services":
                              "Lack of Mental Health professionals & Services",
                            "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations":
                              "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations",
                            "warningSigns&SymptomsofSuicidalIdeations":
                              "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations",
                            "Unresolved Trauma": "Unresolved Trauma",
                            unresolvedTrauma: "Unresolved Trauma",
                            "Emerging Psychotic symptoms":
                              "Emerging Psychotic symptoms",
                            emergingPsychoticsymptoms:
                              "Emerging Psychotic symptoms",
                            "Substance use cravings": "Substance use cravings",
                            substanceUseCravings: "Substance use cravings",
                            "Cognitive distortions": "Cognitive distortions",
                            cognitiveDistortions: "Cognitive distortions",
                            "Functional dependence": "Functional dependence",
                            functionalDependence: "Functional dependence",
                            "Lack of coordination between care providers":
                              "Lack of coordination between care providers",
                            lackOfCoordination:
                              "Lack of coordination between care providers",
                            "Geographical barriers": "Geographical barriers",
                            geographicalBarriers: "Geographical barriers",
                            Transportation: "Transportation",
                            transportation: "Transportation",
                            Childcare: "Childcare",
                            childcare: "Childcare",
                            "Time constraint": "Time constraint",
                            timeConstraint: "Time constraint",
                            Other: "Other",
                          })[item] || item,
                      );

                      const hasOther = mapped.some(
                        (v) =>
                          typeof v === "string" && v.toLowerCase() === "other",
                      );
                      const filtered = mapped.filter(
                        (v) =>
                          typeof v !== "string" || v.toLowerCase() !== "other",
                      );

                      if (hasOther && otherValue) {
                        filtered.push(`Other: ${otherValue}`);
                      } else if (hasOther) {
                        filtered.push("Other");
                      }

                      return filtered.length > 0 ? filtered.join(", ") : "N/A";
                    })()}
                  </h5>
                  <div
                    className={`view-details-grid-inline my-2 ${
                      !details?.data?.patientId?.stepDownBarriersText &&
                      "hidePrint"
                    }`}
                  >
                    <p className="view-label mb-1"> Comment : </p>
                    <h5 className="view-value mb-0">
                      {details?.data?.patientId?.stepDownBarriersText}
                    </h5>
                  </div>
                </div>
              </Col>

              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!details?.data?.explanationForNoStaffing && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    If ART Meeting was not conducted please explain why :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.explanationForNoStaffing}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!details?.data?.recommendations && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Recommendations : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.recommendations}
                  </h5>
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col col={12} sm={12} md={12} lg={12}>
                <p className="text-end mb-0">
                  {signatureFormat({
                    date: details?.data?.signedDate,
                    time: details?.data?.signedTime,
                    sign: details?.data?.staffSignature,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: details?.data?.adminSignature,
                    date: details?.data?.adminDateSigned,
                    time: details?.data?.adminSignedTime,
                    hoursFormat,
                  })}
                </p>
                {details?.data?.signers?.map?.((signer) =>
                  signer?.signature?.length ? (
                    <div className="text-end mb-0" key={signer?.signerId}>
                      {signatureFormat({
                        sign: signer?.signature,
                        date: signer?.dateSigned,
                        time: signer?.signedTime,
                        hoursFormat,
                      })}
                    </div>
                  ) : null,
                )}
              </Col>
            </Row>
            <div className="signature-sections-inline mt-3">
              {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): hidden per client request. See documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */}
              {/* <SignatureSection role="bht" label="BHT Signature" variant="green" mode="view" signature={details?.data?.signatures?.bht} /> */}
              {/* <SignatureSection role="bhp" label="BHP Signature" variant="purple" mode="view" signature={details?.data?.signatures?.bhp} /> */}
              {/* <SignatureSection role="admin" label="Admin Signature" variant="pink" mode="view" signature={details?.data?.signatures?.admin} /> */}
              <SignatureSection
                role="resident"
                label="Resident/Representative Signature"
                variant="blue"
                mode="view"
                signature={details?.data?.signatures?.resident}
                signerNameOverride={
                  details?.data?.residentName ||
                  `${details?.data?.patientId?.firstName ?? ""} ${details?.data?.patientId?.lastName ?? ""}`.trim()
                }
              />
              <SignatureSection
                role="witness"
                label="Witness Signature"
                variant="yellow"
                mode="view"
                signature={details?.data?.signatures?.witness}
              />
            </div>
            <Row className="mt-3">
              <Col col={12} sm={12} md={12} lg={12}>
                <button
                  className="print_btn hidePrint"
                  type="button"
                  onClick={print}
                >
                  PRINT REPORT
                </button>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewStaffNote,
});
