/** @format */

import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { getData } from "@/features/shared/services";
import { useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import { DISCHARGE_PLANNING_OPTIONS } from "@/features/shared/constants";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { BorderlessInput } from "@/utils/Makers";
import { PrintThis } from "@/utils";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
const ViewDischargePlannning = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = useRef(null);
  useEffect(() => {
    getData(setData, `discharge-planning/${id}`);
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
      <NavWrapper isArrow={true} title={"Discharge planning"} />
      <Container>
        <div className="discharge-summary" ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">Discharge Planning</h1>
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
                lg={6}
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
                lg={6}
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
                lg={6}
                className={`${!data?.data?.assignedCaseManager && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Assigned Case Manager :</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.assignedCaseManager}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.counselor && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Therapist/Counselor : </p>
                  <h5 className="view-value mb-0">{data?.data?.counselor}</h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.patientId?.primaryCareProvider && !data?.data?.patientId?.psychiatricProvider && "hidePrint"}`}
              >
                <div
                  className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3"
                  style={{ display: "block" }}
                >
                  <p className="view-label mb-2">Medication Management: </p>
                  <Row>
                    <Col xs={12} md={6} lg={4} className="mb-3">
                      <p className="view-label mb-1">
                        Primary Care Provider Name:{" "}
                      </p>
                      <h5 className="view-value mb-0">
                        {data?.data?.patientId?.primaryCareProvider}
                      </h5>
                    </Col>
                    <Col xs={12} md={6} lg={4} className="mb-3">
                      <p className="view-label mb-1">
                        Primary Care Provider Contact:{" "}
                      </p>
                      <h5 className="view-value mb-0">
                        {data?.data?.patientId?.primaryCareProviderContact}
                      </h5>
                    </Col>
                    <Col xs={12} md={6} lg={4} className="mb-3">
                      <p className="view-label mb-1">
                        Primary Care Provider Address:{" "}
                      </p>
                      <h5 className="view-value mb-0">
                        {data?.data?.patientId?.primaryCareProviderAddress}
                      </h5>
                    </Col>

                    <Col xs={12} md={6} lg={4} className="mb-3">
                      <p className="view-label mb-1">
                        Psychiatric Provider Name:{" "}
                      </p>
                      <h5 className="view-value mb-0">
                        {data?.data?.patientId?.psychiatricProvider}
                      </h5>
                    </Col>
                    <Col xs={12} md={6} lg={4} className="mb-3">
                      <p className="view-label mb-1">
                        Psychiatric Provider Contact:{" "}
                      </p>
                      <h5 className="view-value mb-0">
                        {data?.data?.patientId?.psychiatricProviderContact}
                      </h5>
                    </Col>
                    <Col xs={12} md={6} lg={4} className="mb-3">
                      <p className="view-label mb-1">
                        Psychiatric Provider Address:{" "}
                      </p>
                      <h5 className="view-value mb-0">
                        {data?.data?.patientId?.psychiatricProviderAddress}
                      </h5>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.residentProgressMade?.length && !data?.data?.residentProgressMadeOther && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Resident progress made: </p>
                  <div className="radio-inline">
                    {[
                      { label: "Sobriety", value: "Sobriety" },
                      {
                        label: "Independent living skills",
                        value: "Independent living skills",
                      },
                      { label: "Employment", value: "Employment" },
                      { label: "ADLs", value: "ADLs" },
                      { label: "Medication", value: "Medication" },
                      { label: "Safety", value: "Safety" },
                      {
                        label: "Managing mental health",
                        value: "Managing mental health",
                      },
                      { label: "Legal", value: "Legal" },
                      { label: "Other", value: "Other" },
                    ].map((opt, idx) => (
                      <Form.Check
                        key={idx}
                        inline
                        label={opt.label}
                        type="checkbox"
                        id={`resident-progress-${idx}`}
                        checked={data?.data?.residentProgressMade?.includes(
                          opt.value,
                        )}
                        disabled
                      />
                    ))}
                    {data?.data?.residentProgressMade?.includes("Other") && (
                      <BorderlessInput
                        value={data?.data?.residentProgressMadeOther}
                        placeholder="Other progress"
                        disabled
                      />
                    )}
                  </div>
                </div>
              </Col>
              <Col col={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-2">
                    Key Area of Progress and Ongoing Needs:{" "}
                  </p>
                  <div
                    className={`my-2 ${!data?.data?.therapyEngagement && "hidePrint"}`}
                  >
                    <p className="view-label mb-1">Therapy engagement: </p>
                    <h5 className="view-value mb-0">
                      {data?.data?.therapyEngagement}
                    </h5>
                  </div>

                  <div
                    className={`my-2 ${!data?.data?.emotionalRegulation && "hidePrint"}`}
                  >
                    <p className="view-label mb-1"> Emotional regulation:</p>
                    <h5 className="view-value mb-0">
                      {data?.data?.emotionalRegulation}
                    </h5>
                  </div>
                </div>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <Card body className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-bold">Barriers</Form.Label>
                    <div className="radio-inline">
                      {[
                        { label: "Cognitive", value: "Cognitive" },
                        { label: "Lack of Insight", value: "Lack of Insight" },
                        { label: "Financial", value: "Financial" },
                        {
                          label: "Refusal of Treatment/services",
                          value: "Refusal of Treatment/services",
                        },
                        { label: "Social Stigma", value: "Social Stigma" },
                        {
                          label: "Housing instability",
                          value: "Housing instability",
                        },
                        {
                          label: "Racial/Cultural discrimination",
                          value: "Racial/Cultural discrimination",
                        },
                        {
                          label: "Language/Communication barriers",
                          value: "Language/Communication barriers",
                        },
                        {
                          label: "Poor health literacy",
                          value: "Poor health literacy",
                        },
                        {
                          label: "Social determinants of health",
                          value: "Social determinants of health",
                        },
                        {
                          label:
                            "Limited availibility to Mental Health awareness & Education",
                          value:
                            "Limited availibility to Mental Health awareness & Education",
                        },
                        {
                          label:
                            "Lack of Mental Health professionals & Services",
                          value:
                            "Lack of Mental Health professionals & Services",
                        },
                        {
                          label:
                            "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations",
                          value:
                            "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations",
                        },
                        {
                          label: "Unresolved Trauma",
                          value: "Unresolved Trauma",
                        },
                        {
                          label: "Emerging Psychotic symptoms",
                          value: "Emerging Psychotic symptoms",
                        },
                        {
                          label: "Substance use cravings",
                          value: "Substance use cravings",
                        },
                        {
                          label: "Cognitive distortions",
                          value: "Cognitive distortions",
                        },
                        {
                          label: "Functional dependence",
                          value: "Functional dependence",
                        },
                        {
                          label: "Lack of coordination between care providers",
                          value: "Lack of coordination between care providers",
                        },
                        {
                          label: "Geographical barriers",
                          value: "Geographical barriers",
                        },
                        { label: "Transportation", value: "Transportation" },
                        { label: "Childcare", value: "Childcare" },
                        { label: "Time constraint", value: "Time constraint" },
                        { label: "Other", value: "Other" },
                      ]?.map((opt, idx) => (
                        <Form.Check
                          key={idx}
                          inline
                          label={opt.label}
                          type="checkbox"
                          id={`barrier-${idx}`}
                          checked={data?.data?.patientId?.stepDownBarriers?.includes(
                            opt.value,
                          )}
                        />
                      ))}

                      {data?.data?.patientId?.stepDownBarriers?.includes(
                        "Other",
                      ) && (
                        <BorderlessInput
                          value={data?.data?.patientId?.stepDownBarriersOther}
                          placeholder=" "
                          disabled={true}
                        />
                      )}
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="fw-bold mt-2">Comment </Form.Label>
                    <div>{data?.data?.patientId?.stepDownBarriersText}</div>
                  </Form.Group>
                </Card>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                {/* Discharge Planning Section */}
                <Card className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col xs={12}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Discharge planning and After care planning
                          </Form.Label>
                          <div className="radio-inline">
                            {DISCHARGE_PLANNING_OPTIONS.map((opt, idx) => (
                              <Form.Check
                                key={idx}
                                inline
                                label={opt}
                                type="checkbox"
                                id={`preassess-discharge-${idx}`}
                                checked={(
                                  (data?.data
                                    ?.dischargePlanningAndAfterCarePlanning ||
                                    data?.data?.patientId
                                      ?.dischargePlanningAndAfterCarePlanning) ??
                                  []
                                ).includes(opt)}
                                disabled
                              />
                            ))}
                            {(
                              (data?.data
                                ?.dischargePlanningAndAfterCarePlanning ||
                                data?.data?.patientId
                                  ?.dischargePlanningAndAfterCarePlanning) ??
                              []
                            ).includes("Other") && (
                              <BorderlessInput
                                value={
                                  data?.data
                                    ?.dischargePlanningAndAfterCarePlanningOther ||
                                  data?.data?.patientId
                                    ?.dischargePlanningAndAfterCarePlanningOther ||
                                  ""
                                }
                                placeholder=""
                                disabled
                              />
                            )}
                          </div>
                        </Form.Group>

                        <Form.Group className="mt-3">
                          <Form.Label className="fw-bold">
                            Additional discharge planning details
                          </Form.Label>
                          <div>
                            <Form.Check
                              inline
                              label="Yes"
                              type="checkbox"
                              id="preassess-additional-discharge-yes"
                              checked={
                                (data?.data
                                  ?.isAdditionalDischargePlanningChecked ??
                                  data?.data?.patientId
                                    ?.isAdditionalDischargePlanningChecked) ===
                                true
                              }
                              disabled
                            />{" "}
                            <Form.Check
                              inline
                              label="No"
                              type="checkbox"
                              id="preassess-additional-discharge-no"
                              checked={
                                (data?.data
                                  ?.isAdditionalDischargePlanningChecked ??
                                  data?.data?.patientId
                                    ?.isAdditionalDischargePlanningChecked) ===
                                false
                              }
                              disabled
                            />
                          </div>
                        </Form.Group>
                        {(data?.data?.isAdditionalDischargePlanningChecked ??
                          data?.data?.patientId
                            ?.isAdditionalDischargePlanningChecked) && (
                          <Form.Group className="mt-3">
                            <Form.Label className="fw-bold">
                              Specify ( If Others )
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              className={`${!(data?.data?.additionalDischargePlanningComment || data?.data?.patientId?.additionalDischargePlanningComment) && "hidePrint"}`}
                              value={
                                data?.data
                                  ?.additionalDischargePlanningComment ||
                                data?.data?.patientId
                                  ?.additionalDischargePlanningComment ||
                                ""
                              }
                              cols={130}
                              placeholder="Type Here....."
                              disabled
                            ></Form.Control>
                          </Form.Group>
                        )}
                        <Form.Group className="mt-3">
                          <Form.Label className="fw-bold">
                            Readiness for discharge{" "}
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            className={`${!(data?.data?.readinessDischarge || data?.data?.patientId?.readinessDischarge) && "hidePrint"}`}
                            value={
                              data?.data?.readinessDischarge ||
                              data?.data?.patientId?.readinessDischarge ||
                              ""
                            }
                            cols={130}
                            placeholder="Type Here....."
                            disabled
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Transition Planning Section */}
                <Card className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            Transition planning and recommendations for further
                            programs upon discharge
                          </Form.Label>
                          <div className="radio-inline">
                            {[
                              "PHP",
                              "IOP",
                              "Sober living",
                              "Home",
                              "Flex Care 23.9",
                              "Flex Care 16",
                              "Flex Care 8",
                              "ABHTH",
                              "Transition to ALTC",
                              "Other",
                            ].map((opt, idx) => (
                              <Form.Check
                                key={idx}
                                inline
                                label={opt}
                                type="checkbox"
                                id={`preassess-transition-${idx}`}
                                checked={(
                                  (data?.data
                                    ?.recommendationsForFurtherPrograms ||
                                    data?.data?.patientId
                                      ?.recommendationsForFurtherPrograms) ??
                                  []
                                ).includes(opt)}
                                disabled
                              />
                            ))}
                            {(
                              (data?.data?.recommendationsForFurtherPrograms ||
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms) ??
                              []
                            ).includes("Other") && (
                              <BorderlessInput
                                value={
                                  data?.data
                                    ?.recommendationsForFurtherProgramsOther ||
                                  data?.data?.patientId
                                    ?.recommendationsForFurtherProgramsOther ||
                                  ""
                                }
                                placeholder=""
                                disabled
                              />
                            )}
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* After care and Transition planning / Community Resources */}
                <Card className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            After care and Transition planning / Community
                            Resources
                          </Form.Label>
                          <div className="radio-inline">
                            <Form.Check
                              inline
                              label="National suicide hotline 988 or 1-800-273-8255"
                              type="checkbox"
                              id="preassess-aftercare-suicide-hotline"
                              checked={(
                                (data?.data?.afterCareAndTransitionPlanning ||
                                  data?.data?.patientId
                                    ?.afterCareAndTransitionPlanning) ??
                                []
                              ).includes(
                                "National suicide hotline 988 or 1-800-273-8255",
                              )}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Emergency care 911"
                              type="checkbox"
                              id="preassess-aftercare-emergency"
                              checked={(
                                (data?.data?.afterCareAndTransitionPlanning ||
                                  data?.data?.patientId
                                    ?.afterCareAndTransitionPlanning) ??
                                []
                              ).includes("Emergency care 911")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="24-Hour crisis in Maricopa County 602-222-9444"
                              type="checkbox"
                              id="preassess-aftercare-crisis"
                              checked={(
                                (data?.data?.afterCareAndTransitionPlanning ||
                                  data?.data?.patientId
                                    ?.afterCareAndTransitionPlanning) ??
                                []
                              ).includes(
                                "24-Hour crisis in Maricopa County 602-222-9444",
                              )}
                              disabled
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Card body className="mb-3 ">
                  <Form.Label className="fw-bold">
                    Resident to continue to attend support groups like
                  </Form.Label>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="AA"
                      type="checkbox"
                      id="AA"
                      checked={data?.data?.patientId?.supportGroups?.includes(
                        "AA",
                      )}
                      disabled
                    />
                    <Form.Check
                      inline
                      label="NA"
                      type="checkbox"
                      id="NA "
                      checked={data?.data?.patientId?.supportGroups?.includes(
                        "NA",
                      )}
                      disabled
                    />
                    <Form.Check
                      inline
                      label="Other"
                      type="checkbox"
                      checked={data?.data?.patientId?.supportGroups?.includes(
                        "Other",
                      )}
                      id="Other"
                      disabled
                    />

                    {data?.data?.patientId?.supportGroups?.includes(
                      "Other",
                    ) && (
                      <BorderlessInput
                        value={data?.data?.patientId?.supportGroupsOther}
                        placeholder=" "
                        disabled={true}
                      />
                    )}
                  </div>
                </Card>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <Card body className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      Post discharge plan:{" "}
                    </Form.Label>
                    <div>
                      <p>
                        Provider will follow up with resident 3 days after
                        discharge to ensure safe and stable housing environment
                        Provider will assist resident in transferring
                        medications to any pharmacy of choice prior to
                        discharge, and will follow up with resident within 5
                        days after discharge to ensure transfer of mediation was
                        successful Provider will follow up with
                        resident/representation to discuss issues related with
                        medication discharge, properties, and funds left behind
                        after discharge
                      </p>
                    </div>
                  </Form.Group>
                </Card>
              </Col>
              <Col col={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 md-2 p-2">
                  <div
                    className={`my-2 mx-2 ${!data?.data?.conclusion && "hidePrint"}`}
                  >
                    <p className="view-label mb-1">Conclusion : </p>
                    <h5 className="view-value mb-0">
                      {data?.data?.conclusion}
                    </h5>
                  </div>
                  <div
                    className={`my-2 mx-2 ${!data?.data?.bht && "hidePrint"}`}
                  >
                    <p className="view-label mb-1">BHT : </p>
                    <h5 className="view-value mb-0">{data?.data?.bht}</h5>
                  </div>
                  <div
                    className={`my-2 mx-2 ${!data?.data?.bhp && "hidePrint"}`}
                  >
                    <p className="view-label mb-1">BHP : </p>
                    <h5 className="view-value mb-0">{data?.data?.bhp}</h5>
                  </div>
                  <div
                    className={`my-2 mx-2 ${!data?.data?.others && "hidePrint"}`}
                  >
                    <p className="view-label mb-1">Others : </p>
                    <h5 className="view-value mb-0">{data?.data?.others}</h5>
                  </div>
                </div>
              </Col>
            </Row>

            <div className="signature-sections-inline mt-3">
              <SignatureSection
                role="resident"
                label="Resident/Representative Signature"
                variant="blue"
                mode="view"
                signature={data?.data?.signatures?.resident}
                signerNameOverride={data?.data?.clientName || ""}
              />
              <SignatureSection
                role="witness"
                label="Witness Signature"
                variant="yellow"
                mode="view"
                signature={data?.data?.signatures?.witness}
              />
            </div>

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
                  signer?.signature?.length &&
                  signer.signature !== data?.data?.bhpSignature &&
                  signer.signature !== data?.data?.adminSignature ? (
                    <p className="text-end mb-0" key={signer?.signerId}>
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
  Wcomponenet: ViewDischargePlannning,
});
