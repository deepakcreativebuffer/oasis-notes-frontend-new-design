/** @format */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { getData } from "@/features/shared/services";
import { useParams, useSearchParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { printDocumentTitleExceptFirstPage } from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { RonPrintHeader } from "./RonPrintChrome";
import { RON_INTRO_TEXT } from "./ronConstants";
import RonTreatmentTypeSection from "./RonTreatmentTypeSection";
import RonDemographicsSectionView from "./RonDemographicsSectionView";
import {
  RonBhpIdPhoneRowPrint,
  RonBhpSignatureOutcome,
} from "./RonSignatureDisplay";
import RonSectionViAccompanying from "./RonSectionViAccompanying";
import "./RonPrint.css";
import {
  PrintThis,
  formatDateToMMDDYYYY,
  formatDateWithoutUTCHandleToMMDDYYYY,
  signatureFormat,
} from "@/utils";
const ViewRecertificationOfNeed = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = useRef(null);
  const componentRef = useRef();
  useEffect(() => {
    getData(setData, `recertification-of-need/${id}`);
  }, [id]);
  const d = data?.data || {};
  const printDocumentTitle = useMemo(() => {
    const p = data?.data?.patientId;
    if (!p || typeof p !== "object") {
      return printDocumentTitleExceptFirstPage(p, profile);
    }
    return printDocumentTitleExceptFirstPage(
      {
        ...p,
        userType: p.userType || "Patient",
      },
      profile,
    );
  }, [data?.data?.patientId, profile]);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: printDocumentTitle,
    pageStyle: `
   @page {
      size: portrait !important;
      margin: 9mm 8mm !important;
    }
    .ron-print-root .card {
      page-break-inside: auto;
    }
    .ron-print-root .ron-print-avoid {
      page-break-inside: avoid !important;
    }
    .ron-print-root {
      width: 100% !important;
      max-width: 100% !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      text-align: left !important;
      box-sizing: border-box;
    }
    .ron-print-header {
      border-bottom: none !important;
      padding-bottom: 0 !important;
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
    <div ref={printRef} tabIndex={0} className="outline-none ron-view-root">
      <NavWrapper isArrow={true} title={"Re-Certification of Need (RON)"} />
      <Container>
        <div ref={componentRef} className="ron-print-root">
          <RonPrintHeader />

          <div className="ron-intro mb-4 p-3 border rounded bg-white">
            {RON_INTRO_TEXT}
          </div>

          <RonTreatmentTypeSection treatmentType={d.treatmentType} readOnly />

          <RonDemographicsSectionView d={d} hoursFormat={hoursFormat} />

          <div className="d-none d-print-block ron-print-page-break-after" />

          <RonPrintHeader breakBefore />

          <Card body className="mb-3 ron-print-avoid">
            <h5 className="ron-view-section-title ron-print-section-title mb-2">
              III. BHP Certification (Required)
            </h5>
            <p className="small mb-2">
              The BHP signature on the RON certifies that he/she is the treating
              BHP, and that:
            </p>
            <Form.Check
              type="checkbox"
              readOnly
              disabled
              checked={!!d.certKnowledge || !!d.certAccountability}
              className="mb-2 align-items-start ron-view-readonly-check"
              label="He/She has current knowledge of the client's behavioral health condition and treatment needs,"
            />
            <p className="small mb-2 ms-4 ps-1">
              He/She certifies his/her accountability for and oversight of all
              services that are expected to be delivered in accordance with the
              member&apos;s current treatment plan.
            </p>
            <Form.Check
              type="checkbox"
              readOnly
              disabled
              checked={!!d.certSufficientInfo}
              className="mb-2 align-items-start ron-view-readonly-check"
              label="He/She has sufficient information to determine that continued treatment at the specified care level is most appropriate to safely meet the behavioral health needs of the member."
            />
            <Form.Check
              type="checkbox"
              readOnly
              disabled
              checked={!!d.certMemberAgreement}
              className="mb-2 align-items-start ron-view-readonly-check"
              label="The member has agreed to participate in treatment in the level of care specified above, or in the case of a member who has a health care decision maker (HCDM), including minors, the HCDM has agreed to the member's participation in treatment at the level of care specified above."
            />
            <div className="ms-4 mt-2">
              <Form.Check
                type="checkbox"
                readOnly
                disabled
                checked={!!d.treatmentPlanDateAcknowledged}
                label="Please specify the date of the current treatment plan:"
                className="mb-2 ron-view-readonly-check"
              />
              {d.treatmentPlanDateAcknowledged ? (
                <p className="small mb-0">
                  {formatDateToMMDDYYYY(d.currentTreatmentPlanDate)}
                </p>
              ) : null}
            </div>

            <div className="mt-4 pt-3 ron-section-iii-bhp-mirror">
              <Row className="g-3 mb-2 ron-ii-field-row">
                <Col xs={6} className="ron-ii-col-left">
                  <p className="ron-field-label mb-1">BHP Signature:</p>
                  <RonBhpSignatureOutcome
                    hoursFormat={hoursFormat}
                    bhpSignature={d.bhpSignature}
                    bhpPrintedNameCredentials={d.bhpPrintedNameCredentials}
                    bhpSignatureDateTime={d.bhpSignatureDateTime}
                    signatures={d.signatures}
                    hideLabel
                  />
                </Col>
                <Col xs={6} className="ron-ii-col-right">
                  <p className="ron-field-label mb-1">Date:</p>
                  <p className="view-value mb-0">
                    {formatDateWithoutUTCHandleToMMDDYYYY(
                      d.bhpSignatureDateTime,
                    ) || "\u2014"}
                  </p>
                </Col>
              </Row>
              <Row className="g-3 mb-0 ron-ii-field-row">
                <RonBhpIdPhoneRowPrint
                  bhpProviderId={d.bhpProviderId}
                  bhpPhone={d.bhpPhone}
                />
              </Row>
            </div>
          </Card>

          <p className="fw-semibold mb-3">
            For IOP see Sections IV. and VI., or For BHRF see Sections V. and VI
            (Required)
          </p>

          <Card body className="mb-3 ron-print-avoid">
            <h5 className="ron-view-section-title">
              IV. IOP Service Continuation
            </h5>
            <p className="small">
              Specify the signs and symptoms that are the result of the member’s
              diagnosed behavioral health condition, and which necessitate
              continued treatment in a Behavioral Health Residential Facility,
              including the specific criteria the member has met, in accordance
              with AMPM 320-V. Please also indicate what evidence-based
              practices and programs (EBPPs) were used to determine medical
              necessity.
            </p>
            <p
              className="view-value mb-0"
              style={{
                whiteSpace: "pre-wrap",
              }}
            >
              {d.iopServiceContinuation || "\u2014"}
            </p>
          </Card>

          <div className="d-none d-print-block ron-print-page-break-after" />

          <RonPrintHeader breakBefore />

          <Card body className="mb-3 ron-print-avoid">
            <h5 className="ron-view-section-title">
              V. BHRF Service Continuation
            </h5>
            <p className="small">
              Specify the signs and symptoms that are the result of the member’s
              diagnosed behavioral health condition and which necessitate
              continued treatment in a Behavioral Health Residential Facility,
              and which criteria the member meets in accordance with AMPM 320-V:
            </p>
            <p
              className="view-value mb-0"
              style={{
                whiteSpace: "pre-wrap",
              }}
            >
              {d.bhrfServiceContinuation || "\u2014"}
            </p>
          </Card>

          <RonSectionViAccompanying
            accompanyTreatmentPlan={d.accompanyTreatmentPlan}
            accompanyProgressNotes={d.accompanyProgressNotes}
            readOnly
          />

          <Card body className="mb-4 ron-print-avoid hidePrint">
            {signatureFormat({
              sign: d.adminSignature,
              date: d.adminDateSigned,
              time: "",
              hoursFormat,
            })}
          </Card>

          <Row className="mb-4 hidePrint">
            <Col className="text-center">
              <Button type="button" onClick={print} className="theme-button">
                Print Report
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
      <div tabIndex={0} role={"button"} onKeyDown={print} className={"hide "} />
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewRecertificationOfNeed,
});
