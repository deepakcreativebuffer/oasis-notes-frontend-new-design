/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import { useParams } from "react-router-dom";
import { getData } from "@/features/shared/services";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  convertTimeFormat,
  formatDateToMMDDYYYY,
  signatureFormat,
  updateArrayOrder,
} from "@/utils/utils";
import "@/assets/styles/Print.css";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import Loader from "@/features/shared/ui/Loader/Loader";
import ReactQuill from "react-quill";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
const ViewTherapy = () => {
  const [detail, setDetail] = useState({});
  const { id } = useParams();
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const fetchHandler = useCallback(() => {
    getData(setDetail, `employee/getTherapySessionById/${id}`);
  }, [id]);
  useEffect(() => {
    fetchHandler();
  }, [fetchHandler]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        profileInfo,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      detail?.data?.residentId[0] || detail?.patientId,
      profileInfo,
    ),
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
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper title={"Therapy Progress Notes"} isArrow={true} />
      {detail?.data ? (
        <Container>
          <div ref={componentRef}>
            <h1 className="pdfTitle my-3 hidden">Therapy Progress Notes</h1>
            <div className="view-details">
              {Array.from({
                length: detail?.data?.residentId?.length || 0,
              })?.map((_, i) => (
                <>
                  <Row>
                    <Col xs={12} sm={5} md={6} lg={4} xl={3}>
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Resident’s Name : </p>
                        <h5 className="view-value mb-0">
                          {detail?.data?.residentId?.[i]?.firstName +
                            " " +
                            detail?.data?.residentId?.[i]?.lastName}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={3} md={6} lg={4} xl={3}>
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Ahcccs Id : </p>
                        <h5 className="view-value mb-0">
                          {" "}
                          {detail?.data?.residentId?.[i]?.ahcccsId}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4} xl={6}>
                      <div className="view-details-grid view-details-grid-inline  my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Diagnosis : </p>
                        <h5 className="view-value mb-0">
                          {" "}
                          {detail?.data?.residentId?.[i]?.diagnosis}
                        </h5>
                      </div>
                    </Col>
                  </Row>
                </>
              ))}
              <Row>
                <Col xs={12} sm={3} md={6} lg={3}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Date : </p>
                    <h5 className="view-value mb-0">
                      {detail?.data?.date &&
                        formatDateToMMDDYYYY(detail?.data?.date)}{" "}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={3} md={6} lg={3}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Start Time : </p>
                    <h5 className="view-value mb-0">
                      {convertTimeFormat(detail?.data?.startTime, hoursFormat)}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={3} md={6} lg={3}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">End Time : </p>
                    <h5 className="view-value mb-0">
                      {convertTimeFormat(detail?.data?.endTime, hoursFormat)}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={3} md={6} lg={3}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Total Duration : </p>
                    <h5 className="view-value mb-0">
                      {detail?.data?.totalDuration}{" "}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={3}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Therapy Type : </p>
                    <h5 className="view-value mb-0">
                      {detail?.data?.therapyType.join(", ") || "none"}
                    </h5>
                  </div>
                </Col>
                {detail?.data?.therapyType?.includes("Group Therapy") && (
                  <Col xs={12} sm={12} md={12} lg={3}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Facility :</p>
                      <h5 className="view-value mb-0">
                        {detail?.data?.facilityId?.[0]?.name}
                      </h5>
                    </div>
                  </Col>
                )}
                <Col xs={12} sm={12} md={6} lg={3}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Facility Address : </p>
                    <h5 className="view-value mb-0">
                      {detail?.data?.location}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={3}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Employee/Contractor : </p>
                    <h5 className="view-value mb-0">
                      {detail?.data?.behaviorTech}
                    </h5>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Topic : </p>
                    <h5 className="view-value mb-0">{detail?.data?.topic}</h5>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 px-3 py-3 reactquillprint">
                    <p className="view-label mb-2">Note Summary : </p>
                    <ReactQuill
                      theme="bubble"
                      value={detail?.data?.noteSummary}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 px-3 py-3 reactquillprint">
                    <p className="view-label mb-2">Recommendation : </p>
                    <ReactQuill
                      theme="bubble"
                      value={detail?.data?.planRecommendation}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              {Array.from({
                length: detail?.data?.residentId?.length || 0,
              })?.map((_, i) => (
                <>
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={4}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Resident Completed Therapy Session? :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {detail?.data?.residentIdData?.[i]
                            ?.residentCompletedSession === true ||
                          detail?.data?.residentIdData?.[i]
                            ?.residentCompletedSession === "true"
                            ? "yes"
                            : detail?.data?.residentIdData?.[i]
                                  ?.residentCompletedSession === false ||
                                detail?.data?.residentIdData?.[i]
                                  ?.residentCompletedSession === "false"
                              ? "no"
                              : ""}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Were there any treatment goals addressed? :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {detail?.data?.residentIdData?.[i]
                            ?.treatmentGoalsAddressed === true ||
                          detail?.data?.residentIdData?.[i]
                            ?.treatmentGoalsAddressed === "true"
                            ? "yes"
                            : detail?.data?.residentIdData?.[i]
                                  ?.treatmentGoalsAddressed === false ||
                                detail?.data?.residentIdData?.[i]
                                  ?.treatmentGoalsAddressed === "false"
                              ? "no"
                              : ""}
                        </h5>
                      </div>
                    </Col>

                    <Col xs={12} sm={12} md={12} lg={4}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Resident Participation :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {(
                            updateArrayOrder(
                              detail?.data?.residentIdData[
                                i
                              ]?.residentParticipation?.filter(
                                (value) =>
                                  value &&
                                  value !== "" &&
                                  value !== "undefined" &&
                                  value !== "null",
                              ),
                            ) || []
                          )
                            .map((item) => {
                              if (item === "Other") {
                                return `Other : ${detail?.data?.residentIdData[i]?.residentParticipationOther || ""}`;
                              }
                              if (item === "None" || item === "none") {
                                return item;
                              }
                              return `${item}%`;
                            })
                            .join(" , ")}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Resident Appearance :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {detail?.data?.residentIdData[i]
                            ?.residentAppearance &&
                            updateArrayOrder(
                              detail?.data?.residentIdData[
                                i
                              ]?.residentAppearance?.filter(
                                (value) => value !== "",
                              ),
                            )?.join(", ")}

                          {`${detail?.data?.residentIdData[i].residentAppearance.includes("Other") ? `: ${detail?.data?.residentIdData[i].residentAppearanceOther}` : " "}`}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Resident Mood : </p>
                        <h5 className="view-value mb-0">
                          {detail?.data?.residentIdData[i]?.residentMood &&
                            updateArrayOrder(
                              detail?.data?.residentIdData[
                                i
                              ]?.residentMood?.filter((value) => value !== ""),
                            )?.join(", ")}

                          {` ${detail?.data?.residentIdData[i].residentMood.includes("Other") ? `: ${detail?.data?.residentIdData[i].residentMoodOther}` : " "}`}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Resident Quality : </p>
                        <h5 className="view-value mb-0">
                          {detail?.data?.residentIdData[i]?.residentQuality &&
                            updateArrayOrder(
                              detail?.data?.residentIdData[
                                i
                              ]?.residentQuality?.filter(
                                (value) => value !== "",
                              ),
                            )?.join(", ")}
                          {` ${detail?.data?.residentIdData[i].residentQuality.includes("Other") ? `: ${detail?.data?.residentIdData[i].residentQualityOther}` : " "}`}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Resident Progress : </p>
                        <h5 className="view-value mb-0">
                          {detail?.data?.residentIdData[i]?.residentProgress &&
                            updateArrayOrder(
                              detail?.data?.residentIdData[
                                i
                              ]?.residentProgress?.filter(
                                (value) => value !== "",
                              ),
                            )?.join(", ")}
                          {`${detail?.data?.residentIdData[i].residentProgress.includes("Other") ? `: ${detail?.data?.residentIdData[i].residentProgressOther}` : " "}`}
                        </h5>
                      </div>
                    </Col>

                    <Col xs={12} sm={12} md={12} lg={6}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1 mx-1">
                          Resident Response :
                        </p>
                        <h5 className="view-value mb-0">
                          {detail?.data?.residentIdData[i]?.residentResponse}
                        </h5>
                      </div>
                    </Col>

                    <Col xs={12} sm={12} md={12} lg={6}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Goals Addressed : </p>
                        <h5 className="view-value mb-0">
                          {detail?.data?.residentIdData[i]?.goalsAddressed &&
                            updateArrayOrder(
                              detail?.data?.residentIdData[
                                i
                              ]?.goalsAddressed?.filter(
                                (value) => value !== "",
                              ),
                            )?.join(", ")}
                          {` ${detail?.data?.residentIdData[i]?.goalsAddressed?.includes("Other") ? `: ${detail?.data?.residentIdData[i]?.goalsAddressedOther || ""}` : ""}`}
                        </h5>
                      </div>
                    </Col>

                    <Col xs={12} sm={12} md={12} lg={12}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Any significant information not specified above?
                          :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {detail?.data?.residentIdData[i]
                            ?.significantInfoNotSpecifiedAbove1 === true
                            ? "Yes"
                            : "No"}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      {detail?.data?.residentIdData[i]?.pleaseSpecify &&
                        detail?.data?.residentIdData[i]
                          ?.significantInfoNotSpecifiedAbove1 && (
                          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                            <p className="view-label mb-1">
                              Other significant information :{" "}
                            </p>
                            <h5 className="view-value mb-0">
                              {detail?.data?.residentIdData[i]?.pleaseSpecify}
                            </h5>
                          </div>
                        )}
                    </Col>
                  </Row>
                </>
              ))}

              <div className="signature-sections-inline mt-3">
                <SignatureSection
                  role="bht"
                  label="BHT Signature"
                  variant="blue"
                  mode="view"
                  signature={detail?.data?.signatures?.bht}
                />
                <SignatureSection
                  role="bhp"
                  label="BHP Signature"
                  variant="pink"
                  mode="view"
                  signature={detail?.data?.signatures?.bhp}
                />
                {/* <SignatureSection
                  role="resident"
                  label="Resident/Representative Signature"
                  variant="blue"
                  mode="view"
                  signature={detail?.data?.signatures?.resident}
                  signerNameOverride={
                    detail?.data?.residentId?.length > 0
                      ? detail?.data?.residentId
                          ?.map((r) => `${r.firstName} ${r.lastName}`.trim())
                          .join(", ")
                      : detail?.data?.patientId?.firstName
                        ? `${detail?.data?.patientId?.firstName} ${detail?.data?.patientId?.lastName}`.trim()
                        : ""
                  }
                /> */}
                {/* <SignatureSection
                  role="witness"
                  label="Witness Signature"
                  variant="yellow"
                  mode="view"
                  signature={detail?.data?.signatures?.witness}
                /> */}
              </div>

              <Row>
                <Col xs={12} lg={12} className="text-end">
                  {signatureFormat({
                    sign: detail?.data?.behavioralTechnicianSignature,
                    date: detail?.data?.behavioralTechnicianDateSigned,
                    time: detail?.data?.behavioralTechnicianSignedTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: detail?.data?.adminSignature,
                    date: detail?.data?.adminDateSigned,
                    time: detail?.data?.adminSignedTime,
                    hoursFormat,
                  })}
                  {detail?.data?.signers?.map?.((signer) =>
                    signer?.signature?.length ? (
                      <Form.Label
                        className="w-100 text-end mb-0"
                        key={signer?.signerId}
                      >
                        {signatureFormat({
                          sign: signer?.signature,
                          date: signer?.dateSigned,
                          time: signer?.signedTime,
                          hoursFormat,
                        })}
                      </Form.Label>
                    ) : null,
                  )}
                </Col>
              </Row>
            </div>
            <Row>
              <Col xs={12}>
                <button
                  className="employee_create_btn hidePrint mt-3 mt-md-4"
                  type="button"
                  onClick={print}
                >
                  PRINT REPORT
                </button>
              </Col>
            </Row>
          </div>
        </Container>
      ) : (
        <div className="isLoading">
          <Loader />
        </div>
      )}
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewTherapy,
});
