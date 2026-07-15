/** @format */

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { DefaultCheckBox } from "@/utils/Makers";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { medicationService } from "@/features/shared/services";
import { useParams } from "react-router-dom";
import Loader from "@/features/shared/ui/Loader/Loader";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  fetchPaitentName,
  formatDateWithoutUTCHandleToMMDDYYYY,
  signatureFormat,
  updateArrayOrder,
} from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
const ViewMentalStatus = () => {
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});
  useEffect(() => {
    medicationService.mentalStatus.getById(id, {
      setResponse: setDetails,
      setLoading,
    });
  }, [id]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        details?.data?.patientId,
        profile,
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
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper title={"Mental Status"} isArrow={true} />
      <h1 className="pdfTitle my-3 hidden">
        Mental Status Examination Reports
      </h1>
      {loading ? (
        <Loader />
      ) : (
        <Container>
          <div ref={componentRef}>
            <Row className="text-center mt-3">
              <Col xs={12} md={12}>
                <h6 className="fw-bold">Before appointment</h6>
              </Col>
            </Row>
            <div className="view-details mb-3">
              <Row>
                <Col
                  xs={12}
                  sm={8}
                  md={12}
                  lg={6}
                  className={`${!details?.data?.patientId && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Resident's Name : </p>
                    <h5 className="view-value mb-0">
                      {details?.data?.patientId &&
                        fetchPaitentName(details?.data?.patientId)}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={12} lg={6}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Today's Date : </p>
                    <h5 className="view-value mb-0">
                      {formatDateWithoutUTCHandleToMMDDYYYY(
                        details?.data?.createdAt,
                      )}
                    </h5>
                  </div>
                </Col>
                {(details?.data?.beforeAppearance?.length > 0 ||
                  details?.data?.beforeAppearanceOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.beforeAppearance && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Appearance : </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.beforeAppearance &&
                          updateArrayOrder(
                            details?.data?.beforeAppearance?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`apperance${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.beforeAppearanceOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.beforeBehaviorPsychomotorActivity?.length >
                  0 ||
                  details?.data?.beforeBehaviorPsychomotorActivityOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.beforeBehaviorPsychomotorActivity && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">
                        Behavior/psychomotor activity :{" "}
                      </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.beforeBehaviorPsychomotorActivity &&
                          updateArrayOrder(
                            details?.data?.beforeBehaviorPsychomotorActivity?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`beforeBehaviorPsychomotorActivity${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {
                            details?.data
                              ?.beforeBehaviorPsychomotorActivityOther
                          }
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.beforeOrientation?.length > 0 ||
                  details?.data?.beforeOrientationOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.beforeOrientation && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Orientation : </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.beforeOrientation &&
                          updateArrayOrder(
                            details?.data?.beforeOrientation?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`beforeOrientation${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.beforeOrientationOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.beforeAffect?.length > 0 ||
                  details?.data?.beforeAffectOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.beforeAffect && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Affect : </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.beforeAffect &&
                          updateArrayOrder(
                            details?.data?.beforeAffect?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`beforeAffect${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.beforeAffectOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.beforeSpeechAndThought?.length > 0 ||
                  details?.data?.beforeSpeechAndThoughtOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.beforeSpeechAndThought && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Speech and thought : </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.beforeSpeechAndThought &&
                          updateArrayOrder(
                            details?.data?.beforeSpeechAndThought?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`beforeSpeechAndThought${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.beforeSpeechAndThoughtOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.beforeThoughtContent?.length > 0 ||
                  details?.data?.beforeThoughtContentOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.beforeThoughtContent && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Thought Content : </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.beforeThoughtContent &&
                          updateArrayOrder(
                            details?.data?.beforeThoughtContent?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`beforeThoughtContent${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.beforeThoughtContentOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.beforeOrientationAndConsciousness?.length >
                  0 ||
                  details?.data?.beforeOrientationAndConsciousnessOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.beforeOrientationAndConsciousness && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">
                        Orientation and consciousness :{" "}
                      </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.beforeOrientationAndConsciousness &&
                          updateArrayOrder(
                            details?.data?.beforeOrientationAndConsciousness?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`beforeOrientationAndConsciousness${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {
                            details?.data
                              ?.beforeOrientationAndConsciousnessOther
                          }
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.beforeMemoryAndIntelligence?.length > 0 ||
                  details?.data?.beforeMemoryAndIntelligenceOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.beforeMemoryAndIntelligence && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">
                        Memory and intelligence :{" "}
                      </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.beforeMemoryAndIntelligence &&
                          updateArrayOrder(
                            details?.data?.beforeMemoryAndIntelligence?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`beforeMemoryAndIntelligence${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.beforeMemoryAndIntelligenceOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.beforeReliabilityJudgmentAndInsight?.length >
                  0 ||
                  details?.data?.beforeReliabilityJudgmentAndInsightOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.beforeReliabilityJudgmentAndInsight && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">
                        Reliability, judgment, and insight :{" "}
                      </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.beforeReliabilityJudgmentAndInsight &&
                          updateArrayOrder(
                            details?.data?.beforeReliabilityJudgmentAndInsight?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`beforeReliabilityJudgmentAndInsight${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {
                            details?.data
                              ?.beforeReliabilityJudgmentAndInsightOther
                          }
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.beforeMood?.length > 0 ||
                  details?.data?.beforeMoodOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.beforeMood && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Mood : </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.beforeMood &&
                          updateArrayOrder(
                            details?.data?.beforeMood?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`beforeMood${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.beforeMoodOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
            <Row className="text-center">
              <Col xs={12} sm={12} md={12}>
                <h6 className="fw-bold">After appointment </h6>
              </Col>
            </Row>
            <div className="view-details mb-3">
              <Row>
                {(details?.data?.afterAppearance?.length > 0 ||
                  details?.data?.afterAppearanceOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.afterAppearance && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Appearance : </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.afterAppearance &&
                          updateArrayOrder(
                            details?.data?.afterAppearance?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`afterAppearance${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.afterAppearanceOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.afterBehaviorPsychomotorActivity?.length > 0 ||
                  details?.data?.afterBehaviorPsychomotorActivityOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.afterBehaviorPsychomotorActivity && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">
                        Behavior/psychomotor activity :{" "}
                      </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.afterBehaviorPsychomotorActivity &&
                          updateArrayOrder(
                            details?.data?.afterBehaviorPsychomotorActivity?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`afterBehaviorPsychomotorActivity${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.afterBehaviorPsychomotorActivityOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.afterOrientation?.length > 0 ||
                  details?.data?.afterOrientationOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.afterOrientation && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Orientation : </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.afterOrientation &&
                          updateArrayOrder(
                            details?.data?.afterOrientation?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`afterOrientation${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.afterOrientationOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.afterAffect?.length > 0 ||
                  details?.data?.afterAffectOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.afterAffect && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Affect : </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.afterAffect &&
                          updateArrayOrder(
                            details?.data?.afterAffect?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`afterAffect${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.afterAffectOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.afterSpeechAndThought?.length > 0 ||
                  details?.data?.afterSpeechAndThoughtOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.afterSpeechAndThought && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Speech and thought : </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.afterSpeechAndThought &&
                          updateArrayOrder(
                            details?.data?.afterSpeechAndThought?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`afterSpeechAndThought${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.afterSpeechAndThoughtOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.afterthoughtContent?.length > 0 ||
                  details?.data?.afterthoughtContentOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.afterthoughtContent && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Thought Content : </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.afterthoughtContent &&
                          updateArrayOrder(
                            details?.data?.afterthoughtContent?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`afterthoughtContent${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.afterthoughtContentOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.afterOrientationAndConsciousness?.length > 0 ||
                  details?.data?.afterOrientationAndConsciousnessOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.afterOrientationAndConsciousness && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">
                        Orientation and consciousness :{" "}
                      </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.afterOrientationAndConsciousness &&
                          updateArrayOrder(
                            details?.data?.afterOrientationAndConsciousness?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`afterOrientationAndConsciousness${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.afterOrientationAndConsciousnessOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.afterMemoryAndIntelligence?.length > 0 ||
                  details?.data?.afterMemoryAndIntelligenceOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.afterMemoryAndIntelligence && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">
                        Memory and intelligence :{" "}
                      </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.afterMemoryAndIntelligence &&
                          updateArrayOrder(
                            details?.data?.afterMemoryAndIntelligence?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`afterMemoryAndIntelligence${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.afterMemoryAndIntelligenceOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.afterReliabilityJudgmentAndInsight?.length >
                  0 ||
                  details?.data?.afterReliabilityJudgmentAndInsightOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.afterReliabilityJudgmentAndInsight && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">
                        Reliability, judgment, and insight :{" "}
                      </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.afterReliabilityJudgmentAndInsight &&
                          updateArrayOrder(
                            details?.data?.afterReliabilityJudgmentAndInsight?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`afterReliabilityJudgmentAndInsight${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {
                            details?.data
                              ?.afterReliabilityJudgmentAndInsightOther
                          }
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {(details?.data?.afterMood?.length > 0 ||
                  details?.data?.afterMoodOther) && (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className={`${!details?.data?.afterMood && "hidePrint"}`}
                  >
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Mood : </p>
                      <div className="radio-inline mb-0">
                        {details?.data?.afterMood &&
                          updateArrayOrder(
                            details?.data?.afterMood?.filter(
                              (value) => value !== "",
                            ),
                          )?.map((i, index) => (
                            <DefaultCheckBox
                              readOnly={true}
                              inline
                              label={i}
                              key={`afterMood${index}`}
                            />
                          ))}
                        <span className="view-value">
                          {details?.data?.afterMoodOther}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
            <Row>
              <Col xs={12} sm={12}>
                <Form.Label className="w-100 text-end mb-0">
                  {signatureFormat({
                    sign: details?.data?.driverSignature,
                    date: details?.data?.signedDate,
                    time: details?.data?.signedTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: details?.data?.adminSignature,
                    date: details?.data?.adminDateSigned,
                    time: details?.data?.adminSignedTime,
                    hoursFormat,
                  })}
                </Form.Label>
                <Form.Label className="w-100 text-end mb-0">
                  {details?.data?.signers?.map?.((signer) =>
                    signer?.signature?.length ? (
                      <div key={signer?.signerId}>
                        {signatureFormat({
                          sign: signer?.signature,
                          date: signer?.dateSigned,
                          time: signer?.signedTime,
                          hoursFormat,
                        })}
                      </div>
                    ) : null,
                  )}
                </Form.Label>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12}>
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
        </Container>
      )}
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewMentalStatus,
});
