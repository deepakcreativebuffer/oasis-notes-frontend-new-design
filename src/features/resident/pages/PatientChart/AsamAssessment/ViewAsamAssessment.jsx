/** @format */

import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { getData } from "@/features/shared/services";
import { useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { PrintThis } from "@/utils";
const ViewAsamAssessment = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = useRef(null);
  useEffect(() => {
    getData(setData, `asam-assessment/${id}`);
  }, [id]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        data?.data?.patientId,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(data?.data?.patientId),
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
  const print = usePrint(printRef, handlePrint2);
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper
        isArrow={true}
        title={"ASAM Criteria Checklist for Assessment"}
      />
      <Container>
        <div className="discharge-summary" ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">
            ASAM Criteria Checklist for Assessment
          </h1>
          <div className="view-details print-view-details">
            <Row>
              <Col
                col={12}
                sm={5}
                md={6}
                lg={6}
                className={`${!data?.data?.clientName && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Resident Name : </p>
                  <h5 className="view-value mb-0">{data?.data?.clientName}</h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={7}
                md={6}
                lg={6}
                className={`${!data?.data?.patientId?.ahcccsId && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">AHCCCS ID : </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.patientId?.ahcccsId}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={6}
                className={`${!data?.data?.patientId?.diagnosis && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Diagnosis (specify if new or continuing) :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.patientId?.diagnosis}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={7}
                md={6}
                lg={3}
                className={`${!data?.data?.patientId?.admitDate && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Admit Date : </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.patientId?.admitDate &&
                      formatDateToMMDDYYYY(data?.data?.patientId?.admitDate)}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={4}
                md={6}
                lg={3}
                className={`${!data?.data?.dateOfDischarge && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date of Discharge : </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.dateOfDischarge &&
                      formatDateToMMDDYYYY(data?.data?.dateOfDischarge)}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.acuteIntoxication?.length > 0 && "hidePrint"}`}
              >
                <Card body className="mb-3 ">
                  <div className="flex flex-column">
                    <Form.Label className="fw-bold mb-3">
                      Dimension 1
                    </Form.Label>
                    <Form.Label className="fw-bold">
                      Acute intoxication
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <div>
                      <Form.Check
                        inline
                        label="Is the client currently intoxicated or in withdrawals"
                        type="checkbox"
                        id="intoxicatedWithdrawals"
                        checked={data?.data?.acuteIntoxication?.includes(
                          "intoxicatedWithdrawals",
                        )}
                      />
                      {data?.data?.acuteIntoxication?.includes(
                        "intoxicatedWithdrawals",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.acuteIntoxicationIntoxicatedWithdrawalsTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="History of substance use and withdrawal symptoms?"
                        type="checkbox"
                        id="withdrawalsymptoms"
                        checked={data?.data?.acuteIntoxication?.includes(
                          "withdrawalsymptoms",
                        )}
                      />
                      {data?.data?.acuteIntoxication?.includes(
                        "withdrawalsymptoms",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.acuteIntoxicationWithdrawalsymptomsTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Risk of severe withdrawal (e.g., seizures, DTs)?"
                        type="checkbox"
                        id="severeWithdrawal"
                        checked={data?.data?.acuteIntoxication?.includes(
                          "severeWithdrawal",
                        )}
                      />
                      {data?.data?.acuteIntoxication?.includes(
                        "severeWithdrawal",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.acuteIntoxicationSevereWithdrawalTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Need for medical monitoring or detox services?"
                        type="checkbox"
                        id="needForMedicalMonitoring"
                        checked={data?.data?.acuteIntoxication?.includes(
                          "needForMedicalMonitoring",
                        )}
                      />
                      {data?.data?.acuteIntoxication?.includes(
                        "needForMedicalMonitoring",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.acuteIntoxicationNeedForMedicalMonitoringTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.biomedicalConditions?.length > 0 && "hidePrint"}`}
              >
                <Card body className="mb-3 ">
                  <div className="flex flex-column">
                    <Form.Label className="fw-bold mb-3">
                      Dimension 2
                    </Form.Label>
                    <Form.Label className="fw-bold">
                      Biomedical Conditions and Complications
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <div>
                      <Form.Check
                        inline
                        label="Any chronic or acute medical conditions?"
                        type="checkbox"
                        id="chronicMedicalConditions"
                        checked={data?.data?.biomedicalConditions?.includes(
                          "chronicMedicalConditions",
                        )}
                      />

                      {data?.data?.biomedicalConditions?.includes(
                        "chronicMedicalConditions",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.biomedicalConditionsChronicMedicalConditionsTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>

                    <div>
                      <Form.Check
                        inline
                        label="Is the client receiving medical care?"
                        type="checkbox"
                        id="clientreceiving"
                        checked={data?.data?.biomedicalConditions?.includes(
                          "clientreceiving",
                        )}
                      />
                      {data?.data?.biomedicalConditions?.includes(
                        "clientreceiving",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.biomedicalConditionsClientreceivingTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Are medical issues impacting substance use or recovery?"
                        type="checkbox"
                        id="medicalissues"
                        checked={data?.data?.biomedicalConditions?.includes(
                          "medicalissues",
                        )}
                      />
                      {data?.data?.biomedicalConditions?.includes(
                        "medicalissues",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.biomedicalConditionsMedicalissuesTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Need for coordination with Primary Care Physician or specialists?"
                        type="checkbox"
                        id="coordinationspecialists"
                        checked={data?.data?.biomedicalConditions?.includes(
                          "coordinationspecialists",
                        )}
                      />
                      {data?.data?.biomedicalConditions?.includes(
                        "coordinationspecialists",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.biomedicalConditionsCoordinationspecialistsTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.cognitiveConditions?.length > 0 && "hidePrint"}`}
              >
                <Card body className="mb-3 ">
                  <div className="flex flex-column">
                    <Form.Label className="fw-bold mb-3">
                      Dimension 3
                    </Form.Label>
                    <Form.Label className="fw-bold">
                      Emotional, Behavioral, or Cognitive Conditions and
                      Complications
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <div>
                      <Form.Check
                        inline
                        label="Current mental health diagnoses or symptoms?"
                        type="checkbox"
                        id="mentalhealthdiagnoses"
                        checked={data?.data?.cognitiveConditions?.includes(
                          "mentalhealthdiagnoses",
                        )}
                      />
                      {data?.data?.cognitiveConditions?.includes(
                        "mentalhealthdiagnoses",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.cognitiveConditionsMentalhealthdiagnosesTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Risk of harm to self or others?"
                        type="checkbox"
                        id="harmtoself"
                        checked={data?.data?.cognitiveConditions?.includes(
                          "harmtoself",
                        )}
                      />
                      {data?.data?.cognitiveConditions?.includes(
                        "harmtoself",
                      ) ? (
                        <p className="text-sm">
                          {data?.data?.cognitiveConditionsHarmtoselfTextLine}
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Cognitive impairments affecting treatment engagement?"
                        type="checkbox"
                        id="cognitiveimpairmentsaffecting"
                        checked={data?.data?.cognitiveConditions?.includes(
                          "cognitiveimpairmentsaffecting",
                        )}
                      />
                      {data?.data?.cognitiveConditions?.includes(
                        "cognitiveimpairmentsaffecting",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.cognitiveConditionsCognitiveimpairmentsaffectingTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Need for psychiatric evaluation or stabilization?"
                        type="checkbox"
                        id="psychiatricevaluation"
                        checked={data?.data?.cognitiveConditions?.includes(
                          "psychiatricevaluation",
                        )}
                      />
                      {data?.data?.cognitiveConditions?.includes(
                        "psychiatricevaluation",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.cognitiveConditionsPsychiatricevaluationTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.readinessChange?.length > 0 && "hidePrint"}`}
              >
                <Card body className="mb-3 ">
                  <div className="flex flex-column">
                    <Form.Label className="fw-bold mb-3">
                      Dimension 4
                    </Form.Label>
                    <Form.Label className="fw-bold">
                      Readiness to Change
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <div>
                      <Form.Check
                        inline
                        label="Client’s stage of change (Precontemplation → Maintenance)?"
                        type="checkbox"
                        id="stageofchange"
                        checked={data?.data?.readinessChange?.includes(
                          "stageofchange",
                        )}
                      />
                      {data?.data?.readinessChange?.includes(
                        "stageofchange",
                      ) ? (
                        <p className="text-sm">
                          {data?.data?.readinessChangeStageofchangeTextLine}
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Motivation for treatment?"
                        type="checkbox"
                        id="motivationfortreatment"
                        checked={data?.data?.readinessChange?.includes(
                          "motivationfortreatment",
                        )}
                      />
                      {data?.data?.readinessChange?.includes(
                        "motivationfortreatment",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.readinessChangeMotivationfortreatmentTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Ambivalence or resistance noted?"
                        type="checkbox"
                        id="ambivalenceorresistance"
                        checked={data?.data?.readinessChange?.includes(
                          "ambivalenceorresistance",
                        )}
                      />
                      {data?.data?.readinessChange?.includes(
                        "ambivalenceorresistance",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.readinessChangeAmbivalenceorresistanceTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Strategies to enhance engagement?"
                        type="checkbox"
                        id="enhanceengagement"
                        checked={data?.data?.readinessChange?.includes(
                          "enhanceengagement",
                        )}
                      />
                      {data?.data?.readinessChange?.includes(
                        "enhanceengagement",
                      ) ? (
                        <p className="text-sm">
                          {data?.data?.readinessChangeEnhanceengagementTextLine}
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.problemPotential?.length > 0 && "hidePrint"}`}
              >
                <Card body className="mb-3 ">
                  <div className="flex flex-column">
                    <Form.Label className="fw-bold mb-3">
                      Dimension 5
                    </Form.Label>
                    <Form.Label className="fw-bold">
                      Relapse, Continued Use, or Continued Problem Potential
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <div>
                      <Form.Check
                        inline
                        label="History of relapse or continued use?"
                        type="checkbox"
                        id="continueduse"
                        checked={data?.data?.problemPotential?.includes(
                          "continueduse",
                        )}
                      />
                      {data?.data?.problemPotential?.includes(
                        "continueduse",
                      ) ? (
                        <p className="text-sm">
                          {data?.data?.problemPotentialContinueduseTextLine}
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Triggers and high-risk situations?"
                        type="checkbox"
                        id="highrisksituations"
                        checked={data?.data?.problemPotential?.includes(
                          "highrisksituations",
                        )}
                      />
                      {data?.data?.problemPotential?.includes(
                        "highrisksituations",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.problemPotentialHighrisksituationsTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Coping skills and relapse prevention strategies?"
                        type="checkbox"
                        id="preventionstrategies"
                        checked={data?.data?.problemPotential?.includes(
                          "preventionstrategies",
                        )}
                      />
                      {data?.data?.problemPotential?.includes(
                        "preventionstrategies",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.problemPotentialPreventionstrategiesTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Need for structured support or monitoring?"
                        type="checkbox"
                        id="supportormonitoring"
                        checked={data?.data?.problemPotential?.includes(
                          "supportormonitoring",
                        )}
                      />
                      {data?.data?.problemPotential?.includes(
                        "supportormonitoring",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.problemPotentialSupportormonitoringTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.livingEnvironment?.length > 0 && "hidePrint"}`}
              >
                <Card body className="mb-3 ">
                  <div className="flex flex-column">
                    <Form.Label className="fw-bold mb-3">
                      Dimension 6
                    </Form.Label>
                    <Form.Label className="fw-bold">
                      Recovery/Living Environment
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <div>
                      <Form.Check
                        inline
                        label="Housing stability and safety?"
                        type="checkbox"
                        id="housingstabilitysafety"
                        checked={data?.data?.livingEnvironment?.includes(
                          "housingstabilitysafety",
                        )}
                      />
                      {data?.data?.livingEnvironment?.includes(
                        "housingstabilitysafety",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.livingEnvironmentHousingstabilitysafetyTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Exposure to substance use in home/community?"
                        type="checkbox"
                        id="exposuretosubstanceuse"
                        checked={data?.data?.livingEnvironment?.includes(
                          "exposuretosubstanceuse",
                        )}
                      />
                      {data?.data?.livingEnvironment?.includes(
                        "exposuretosubstanceuse",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.livingEnvironmentExposuretosubstanceuseTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Support system (family, peers, providers)?"
                        type="checkbox"
                        id="supportsystem"
                        checked={data?.data?.livingEnvironment?.includes(
                          "supportsystem",
                        )}
                      />
                      {data?.data?.livingEnvironment?.includes(
                        "supportsystem",
                      ) ? (
                        <p className="text-sm">
                          {data?.data?.livingEnvironmentSupportsystemTextLine}
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div>
                      <Form.Check
                        inline
                        label="Need for case management or residential placement?"
                        type="checkbox"
                        id="needforcasemanagement"
                        checked={data?.data?.livingEnvironment?.includes(
                          "needforcasemanagement",
                        )}
                      />
                      {data?.data?.livingEnvironment?.includes(
                        "needforcasemanagement",
                      ) ? (
                        <p className="text-sm">
                          {
                            data?.data
                              ?.livingEnvironmentNeedforcasemanagementTextLine
                          }
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.asamScore && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">ASAM SCORE: </p>
                  <h5 className="view-value mb-0">{data?.data?.asamScore}</h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.consumersFunctioningSeverity && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    intensity given the consumer’s functioning/severity:{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.consumersFunctioningSeverity}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.residential?.length > 0 && "hidePrint"}`}
              >
                <Card body className="mb-3">
                  <Form.Label className="fw-bold">Residential:</Form.Label>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="3.1"
                      type="checkbox"
                      id="score31"
                      checked={data?.data?.residential?.includes("score31")}
                    />
                    <Form.Check
                      inline
                      label="3.3"
                      type="checkbox"
                      id="score33"
                      checked={data?.data?.residential?.includes("score33")}
                    />
                    <Form.Check
                      inline
                      label="3.5"
                      type="checkbox"
                      id="score35"
                      checked={data?.data?.residential?.includes("score35")}
                    />
                  </div>
                </Card>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.comment && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Comment : </p>
                  <h5 className="view-value mb-0">{data?.data?.comment}</h5>
                </div>
              </Col>
            </Row>
            <Row>
              <Col col={12} md={12} lg={12}>
                <p className="text-end mb-0">
                  {signatureFormat({
                    sign: data?.data?.bhpSignature,
                    date: data?.data?.bhpSignatureDateTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: data?.data?.adminSignature,
                    date: data?.data?.adminDateSigned,
                    hoursFormat,
                  })}
                </p>
                {data?.data?.signers?.map?.((signer) =>
                  signer?.signature?.length ? (
                    <p className="text-end mb-0">
                      {signatureFormat({
                        sign: signer?.signature,
                        date: signer?.dateSigned,
                        time: signer?.signedTime,
                        hoursFormat,
                      })}
                    </p>
                  ) : null,
                )}
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
  Wcomponenet: ViewAsamAssessment,
});
