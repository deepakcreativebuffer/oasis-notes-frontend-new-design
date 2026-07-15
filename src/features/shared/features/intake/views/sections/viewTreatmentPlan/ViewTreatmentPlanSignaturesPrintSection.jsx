/** @format */

import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useViewTreatmentPlanFormContext } from "../../context/ViewTreatmentPlanFormContext";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import ResidentPrintSignature from "@/features/shared/ui/ResidentPrintSignature/ResidentPrintSignature";
import { AddSignature } from "@/utils/utils";
import { signatureFormat } from "@/utils/utils";

export default function ViewTreatmentPlanSignaturesPrintSection() {
  const f = useViewTreatmentPlanFormContext();
  return (
    <>
      <div className={`mt-2`}>
        <Form.Label className="fw-bold w-100">
          Signature indicates participation and informed consent for treatment
          services.
        </Form.Label>
        <Row>
          {/* 2026-04-29: don't render label/row if value is empty (per client). */}
          {f.nameResident && f.nameResident.trim() && (
            <Col xs={12} sm={12} md={12}>
              <Form.Group>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    {" "}
                    Resident/Representative First and Last Name :{" "}
                  </p>
                  <h5 className="view-value mb-0">{f.nameResident}</h5>
                </div>
              </Form.Group>
            </Col>
          )}
          {f.verbalConsentResidentRepresentative &&
            f.verbalConsentResidentRepresentative.trim() && (
              <Col xs={12} sm={12} md={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Verbal Consent given by resident/representative :
                  </p>
                  <h5 className="view-value mb-0">
                    {f.verbalConsentResidentRepresentative}
                  </h5>
                </div>
              </Col>
            )}
          <Col xs={12} md={12}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">
                <span className="text-muted ms-1">
                  (By signing this document, I acknowledge that I was asked,
                  encouraged to participate in the behavioral health treatment
                  plan)
                </span>
              </p>
            </div>
          </Col>
        </Row>
      </div>
      <Row>
        <Col xs={12} md={12} className="text-md-end text-end">
          {f.signatureBhp &&
            signatureFormat({
              sign: f.signatureBhp,
              date: f.dateBhp,
              time: f.timeBhp,
              hoursFormat: f.hoursFormat,
            })}
          {signatureFormat({
            sign: f.adminSignature,
            date: f.adminSignatureDate,
            time: f.adminSignatureTime,
            hoursFormat: f.hoursFormat,
          })}
          {f.signers?.map(
            (signer) =>
              signer.signature && (
                <div key={signer.signerId}>
                  {signatureFormat({
                    sign: signer.signature,
                    date: signer.dateSigned,
                    time: signer.signedTime,
                    hoursFormat: f.hoursFormat,
                  })}
                </div>
              ),
          )}
        </Col>
      </Row>
      <ResidentPrintSignature />
      <div className="signature-sections-inline mt-3">
        {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): hidden per client request. See documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */}
        {/* <SignatureSection role="bht" label="BHT Signature" variant="green" mode="view" signature={f.getApiData?.signatures?.bht} /> */}
        {/* <SignatureSection role="bhp" label="BHP Signature" variant="purple" mode="view" signature={f.getApiData?.signatures?.bhp} /> */}
        {/* <SignatureSection role="admin" label="Admin Signature" variant="pink" mode="view" signature={f.getApiData?.signatures?.admin} /> */}
        <SignatureSection
          role="resident"
          label="Resident/Representative Signature"
          variant="blue"
          mode="view"
          signature={f.getApiData?.signatures?.resident}
          signerNameOverride={
            f.residentName ||
            `${f.getApiData?.data?.patientId?.firstName ?? ""} ${f.getApiData?.data?.patientId?.lastName ?? ""}`.trim()
          }
        />
        <SignatureSection
          role="witness"
          label="Witness Signature"
          variant="yellow"
          mode="view"
          signature={f.getApiData?.signatures?.witness}
        />
      </div>

      <Row>
        <Col xs={12} md={12}>
          <div className="employee-btn-joiner hidePrint">
            <button
              className="employee_create_btn"
              type="button"
              onClick={f.print}
            >
              PRINT THIS FORM
            </button>
          </div>
        </Col>
      </Row>
      <Row className="mt-3 hidePrint">
        <Col xs={12} md={12}>
          <AddSignature
            show={f.showSignatureResident}
            setValue={f.setSignerSignature}
            setDate={f.setSignerDate}
            setTime={f.setSignerTime}
          />
        </Col>
      </Row>
      <Row></Row>
    </>
  );
}
