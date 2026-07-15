/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { getData } from "@/features/shared/services";
import { useParams, useSearchParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { DISCHARGE_PLANNING_OPTIONS } from "@/features/shared/constants";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import Form from "react-bootstrap/Form";
import { BorderlessInput } from "@/utils/Makers";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import { PrintThis } from "@/utils";
const ViewDischarge = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = useRef(null);
  const [modeOfTransportation, setModeOfTransportation] = useState([]);
  const [modeOfTransportationOther, setModeOfTransportationOther] =
    useState("");
  useEffect(() => {
    getData(setData, `employee/getDischargeSummaryById/${id}`);
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
  const [searchParams] = useSearchParams();
  const [hasAutoPrinted, setHasAutoPrinted] = useState(false);
  useEffect(() => {
    if (
      !hasAutoPrinted &&
      searchParams.get("autoPrint") === "1" &&
      data?.data
    ) {
      setHasAutoPrinted(true);
      setTimeout(() => handlePrint2(), 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, searchParams, hasAutoPrinted]);
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper isArrow={true} title={"Discharge Summary"} />
      <Container>
        <div className="discharge-summary" ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">Discharge Summary</h1>
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
                sm={5}
                md={6}
                lg={3}
                className={`${!data?.data?.patientId?.dateOfBirth && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">DOB : </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.patientId?.dateOfBirth &&
                      formatDateToMMDDYYYY(data?.data?.patientId?.dateOfBirth)}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={7}
                md={6}
                lg={3}
                className={`${!data?.data?.dateOfAdmission && "hidePrint"}`}
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
                className={`${!(data?.data?.patientId?.presentingProblems && data?.data?.patientId?.presentingProblems.length > 0) && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Presenting Problems : </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.patientId?.presentingProblems?.join(", ") ||
                      "N/A"}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.treatmentProvided && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Treatment Provided : </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.treatmentProvided}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.progress && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Progress : </p>
                  <h5 className="view-value mb-0">{data?.data?.progress}</h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.medicationUponDischarge && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Medication Upon Discharge :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.medicationUponDischarge}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.fundsPropertiesUponDischarge && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Funds/Properties Upon Discharge :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.fundsPropertiesUponDischarge}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.reasonForDischarge && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Reason for Discharge : </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.reasonForDischarge}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Card className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col xs={12}>
                        <Form.Group>
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
                                id={`view-discharge-planning-${idx}`}
                                checked={(
                                  data?.data?.patientId
                                    ?.dischargePlanningAndAfterCarePlanning ??
                                  []
                                ).includes(opt)}
                                disabled
                              />
                            ))}
                            {(
                              data?.data?.patientId
                                ?.dischargePlanningAndAfterCarePlanning ?? []
                            ).includes("Other") && (
                              <BorderlessInput
                                value={
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
                              id="view-additional-discharge-yes"
                              checked={
                                data?.data?.patientId
                                  ?.isAdditionalDischargePlanningChecked ===
                                true
                              }
                              disabled
                            />{" "}
                            <Form.Check
                              inline
                              label="No"
                              type="checkbox"
                              id="view-additional-discharge-no"
                              checked={
                                data?.data?.patientId
                                  ?.isAdditionalDischargePlanningChecked ===
                                false
                              }
                              disabled
                            />
                          </div>
                        </Form.Group>
                        {data?.data?.patientId
                          ?.isAdditionalDischargePlanningChecked && (
                          <Form.Group className="mt-3">
                            <Form.Label className="fw-bold">
                              Specify ( If Others )
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              className={`${!data?.data?.patientId?.additionalDischargePlanningComment && "hidePrint"}`}
                              value={
                                data?.data?.patientId
                                  ?.additionalDischargePlanningComment || ""
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
                            className={`${!data?.data?.patientId?.readinessDischarge && "hidePrint"}`}
                            value={
                              data?.data?.patientId?.readinessDischarge || ""
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
                            <Form.Check
                              inline
                              label="PHP"
                              type="checkbox"
                              id="view-transition-php"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("PHP")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="IOP"
                              type="checkbox"
                              id="view-transition-iop"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("IOP")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Sober living"
                              type="checkbox"
                              id="view-transition-sober"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("Sober living")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Home"
                              type="checkbox"
                              id="view-transition-home"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("Home")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Flex Care 23.9"
                              type="checkbox"
                              id="view-transition-flex239"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("Flex Care 23.9")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Flex Care 16"
                              type="checkbox"
                              id="view-transition-flex16"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("Flex Care 16")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Flex Care 8"
                              type="checkbox"
                              id="view-transition-flex8"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("Flex Care 8")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Other"
                              type="checkbox"
                              id="view-transition-other"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("Other")}
                              disabled
                            />
                            {(
                              data?.data?.patientId
                                ?.recommendationsForFurtherPrograms ?? []
                            ).includes("Other") && (
                              <BorderlessInput
                                value={
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
                              id="view-aftercare-suicide-hotline"
                              checked={(
                                data?.data?.patientId
                                  ?.afterCareAndTransitionPlanning ?? []
                              ).includes(
                                "National suicide hotline 988 or 1-800-273-8255",
                              )}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Emergency care 911"
                              type="checkbox"
                              id="view-aftercare-emergency"
                              checked={(
                                data?.data?.patientId
                                  ?.afterCareAndTransitionPlanning ?? []
                              ).includes("Emergency care 911")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="24-Hour crisis in Maricopa County 602-222-9444"
                              type="checkbox"
                              id="view-aftercare-crisis"
                              checked={(
                                data?.data?.patientId
                                  ?.afterCareAndTransitionPlanning ?? []
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
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-1">
                    Mode of Transportation
                  </p>
                  <br />

                  <div>
                    <Form.Check
                      inline
                      label="Transported by referring facility"
                      type="checkbox"
                      id="TransportedReferringFacility"
                      checked={data?.data?.modeOfTransportation?.includes(
                        "Transported by referring facility",
                      )}
                    />
                    <Form.Check
                      inline
                      label="Transported by recieving facility"
                      type="checkbox"
                      id="TransportedRecievingFacility"
                      checked={data?.data?.modeOfTransportation?.includes(
                        "Transported by recieving facility",
                      )}
                    />
                    <Form.Check
                      inline
                      label="Transported by case manager"
                      type="checkbox"
                      id="TransportedCaseManager"
                      checked={data?.data?.modeOfTransportation?.includes(
                        "Transported by case manager",
                      )}
                    />
                    <Form.Check
                      inline
                      label="Non Emergency Tranportation"
                      type="checkbox"
                      id="NonEmergencyTranportation"
                      checked={data?.data?.modeOfTransportation?.includes(
                        "Non Emergency Tranportation",
                      )}
                    />
                    <Form.Check
                      inline
                      label="Transported by family"
                      type="checkbox"
                      id="TransportedByFamily"
                      checked={data?.data?.modeOfTransportation?.includes(
                        "Transported by family",
                      )}
                    />{" "}
                    <Form.Check
                      inline
                      label="Transported by Uber/Lyft"
                      type="checkbox"
                      id="TransportedByUber/Lyft"
                      checked={data?.data?.modeOfTransportation?.includes(
                        "Transported by Uber/Lyft",
                      )}
                    />
                    <Form.Check
                      inline
                      label="Transported by EMS"
                      type="checkbox"
                      id="TransportedByEMS"
                      checked={data?.data?.modeOfTransportation?.includes(
                        "Transported by EMS",
                      )}
                    />
                    <Form.Check
                      inline
                      label="Other"
                      type="checkbox"
                      checked={data?.data?.modeOfTransportation?.includes(
                        "Other",
                      )}
                      id="transportationOther"
                    />
                    {data?.data?.modeOfTransportation?.includes("Other") && (
                      <BorderlessInput
                        value={data?.data?.modeOfTransportationOther}
                        setState={setModeOfTransportationOther}
                        placeholder=" "
                        disabled={true}
                      />
                    )}
                  </div>
                </div>
              </Col>
              <Col xs={12}>
                <div className="my-3 view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      label="Resident/Representative agree with the discharge plan summary"
                      checked={data?.data?.agreeWithDischarge === true}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Resident/Representative disagree with the discharge summary"
                      checked={data?.data?.disagreeWithDischarge === true}
                    />
                  </Form.Group>
                </div>
              </Col>
            </Row>

            <Row>
              <Col col={12} md={12} lg={12}>
                <p className="text-end mb-0">
                  {/* {signatureFormat({
                    sign: data?.data?.staffSignature,
                    date: data?.data?.staffSignatureDate,
                    time: data?.data?.staffSignatureTime,
                    hoursFormat,
                  })} */}
                  {signatureFormat({
                    sign: data?.data?.bhpSignature,
                    date: data?.data?.bhpSignatureDate,
                    time: data?.data?.bhpSignatureTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: data?.data?.adminSignature,
                    date: data?.data?.adminDateSigned,
                    time: data?.data?.adminSignedTime,
                    hoursFormat,
                  })}
                </p>
                {data?.data?.signers?.map?.((signer) =>
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
              {/* <SignatureSection role="bht" label="BHT Signature" variant="green" mode="view" signature={data?.data?.signatures?.bht} /> */}
              {/* <SignatureSection role="bhp" label="BHP Signature" variant="purple" mode="view" signature={data?.data?.signatures?.bhp} /> */}
              {/* <SignatureSection role="admin" label="Admin Signature" variant="pink" mode="view" signature={data?.data?.signatures?.admin} /> */}
              <SignatureSection
                role="resident"
                label="Resident/Representative Signature"
                variant="blue"
                mode="view"
                signature={data?.data?.signatures?.resident}
                signerNameOverride={
                  data?.data?.clientName ||
                  data?.data?.residentName ||
                  `${data?.data?.patientId?.firstName ?? ""} ${data?.data?.patientId?.lastName ?? ""}`.trim()
                }
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
              <Col>
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
  Wcomponenet: ViewDischarge,
});
