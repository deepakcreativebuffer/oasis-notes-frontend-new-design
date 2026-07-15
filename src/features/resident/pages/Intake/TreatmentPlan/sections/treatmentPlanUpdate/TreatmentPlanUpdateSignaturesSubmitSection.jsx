/* eslint-disable no-unused-vars */
/** @format */

import React from "react";
import {
  Form,
  Row,
  Col,
  Card,
  Table,
  Container,
  Button,
} from "react-bootstrap";
import { useTreatmentPlanUpdateFormContext } from "../../context/TreatmentPlanUpdateFormContext";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import ResidentPrintSignature from "@/features/shared/ui/ResidentPrintSignature/ResidentPrintSignature";
import { AddSignature } from "@/utils/utils";
import { signatureFormat } from "@/utils/utils";
import { ROLES } from "@/features/shared/constants/index";

const EMPTY_SIGNATURE_SECTION = {
  name: "",
  signature: "",
  date: "",
  time: "",
  rawSignatureImage: "",
};

const DEFAULT_SIGNATURES = {
  admin: { ...EMPTY_SIGNATURE_SECTION },
  bhp: { ...EMPTY_SIGNATURE_SECTION },
  bht: { ...EMPTY_SIGNATURE_SECTION },
  resident: { ...EMPTY_SIGNATURE_SECTION },
  witness: { ...EMPTY_SIGNATURE_SECTION },
};

export default function TreatmentPlanUpdateSignaturesSubmitSection() {
  const f = useTreatmentPlanUpdateFormContext();
  const signatures = f.signatures ?? DEFAULT_SIGNATURES;
  const updateSignature = f.updateSignature;

  return (
    <>
      <div>
        <Form.Label className="fw-bold">
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
                  encouraged to participate in the assessment)
                </span>
              </p>
            </div>
          </Col>
        </Row>
      </div>
      <Row>
        <Col xs={12} md={6} className="d-flex align-items-start mt-3">
          <Button
            type="button"
            className="theme-button hidePrint me-2"
            onClick={() => f.guardTyped(() => f.setShowSignatureResident(true))}
          >
            SAVED AND SIGNED
          </Button>
        </Col>
        <Col xs={12} md={6} className="mt-3">
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
      <ResidentPrintSignature />
      <div className="signature-sections-inline mt-3">
        <SignatureNamesPanel
          signatures={signatures}
          onUpdate={updateSignature}
          formHasTyped={f.hasTypedInForm}
          onClearAllTyped={f.clearAllTyped}
        />
        {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): hidden per client
                  request. To restore, uncomment block below. See
                  documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */}
        {/*
               <SignatureSection
                role="bht"
                label="BHT Signature"
                variant="green"
                signature={f.signatures.bht}
                onUpdate={f.updateSignature}
                formHasTyped={f.hasTypedInForm}
                onClearAllTyped={f.clearAllTyped}
               />
               <SignatureSection
                role="bhp"
                label="BHP Signature"
                variant="purple"
                signature={f.signatures.bhp}
                onUpdate={f.updateSignature}
                externalName
                formHasTyped={f.hasTypedInForm}
                onClearAllTyped={f.clearAllTyped}
               />
               <SignatureSection
                role="admin"
                label="Admin Signature"
                variant="pink"
                signature={f.signatures.admin}
                onUpdate={f.updateSignature}
                externalName
                formHasTyped={f.hasTypedInForm}
                onClearAllTyped={f.clearAllTyped}
               />
               */}
        <SignatureSection
          role="resident"
          label="Resident/Representative Signature"
          variant="blue"
          signature={signatures.resident}
          onUpdate={updateSignature}
          signerNameOverride={f.residentName || ""}
          formHasTyped={f.hasTypedInForm}
          onClearAllTyped={f.clearAllTyped}
        />
        <SignatureSection
          role="witness"
          label="Witness Signature"
          variant="yellow"
          signature={signatures.witness}
          onUpdate={updateSignature}
          externalName
          formHasTyped={f.hasTypedInForm}
          onClearAllTyped={f.clearAllTyped}
        />
      </div>

      <Row>
        {(f.profile.userType === ROLES.PATIENT ||
          f.profile.userType === ROLES.GUARDIAN) && (
          <Col xs={12} md={12}>
            <div className="employee-btn-joiner mt-3 mt-md-5 hidePrint">
              <button
                onClick={f.handlePost}
                type="submit"
                className="employee_create_btn"
                /* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): submit gate
                   reverted to pre-Session-33 (no disabled prop on
                   f.resident-side TP update). See
                   documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */
                /* TEMP-DISABLED-BHP-BHT-ADMIN: disabled={!f.allPenSigsHaveNames} */ disabled={
                  f.witnessIncomplete
                }
              >
                SUBMIT DETAILS
              </button>
            </div>
          </Col>
        )}
      </Row>
    </>
  );
}
