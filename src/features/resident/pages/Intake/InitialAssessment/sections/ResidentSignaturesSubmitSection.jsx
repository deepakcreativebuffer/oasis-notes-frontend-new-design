/* eslint-disable no-unused-vars */
/** @format */

import React from "react";
import { Card, Row, Col, Form, Button, Table } from "react-bootstrap";
import { useResidentInitialAssessmentFormContext } from "../context/ResidentInitialAssessmentFormContext";
import { signatureFormat } from "@/utils/utils";
import { ROLES } from "@/features/shared/constants/index";
import ResidentPrintSignature from "@/features/shared/ui/ResidentPrintSignature/ResidentPrintSignature";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";

export default function ResidentSignaturesSubmitSection() {
  const f = useResidentInitialAssessmentFormContext();
  return (
    <>
      <div className={`mt-2`}>
        <Form.Label className="fw-bold w-100">
          Signature indicates participation and informed consent for treatment
          services.
        </Form.Label>
        <Row>
          <Col xs={12} sm={12} md={12}>
            <Form.Group>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">
                  {" "}
                  Resident/Representative First and Last Name :{" "}
                </p>
                <h5 className="view-value mb-0">{f.residentRepresentative}</h5>
              </div>
            </Form.Group>
          </Col>
          <Col xs={12} md={12}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">
                <span className="text-muted ms-1">
                  (By signing this document, I acknowledge that I was asked,
                  encouraged to participate in the initial assessment)
                </span>
              </p>
            </div>
          </Col>
        </Row>
      </div>

      <Row className="mt-3">
        <Col xs={12} md={12} lg={6} className="d-flex align-items-start">
          <Button
            type="button"
            className="theme-button hidePrint me-2"
            onClick={() => f.guardTyped(() => f.setShowSignatureResident(true))}
          >
            SAVED AND SIGNED
          </Button>
        </Col>

        <Col xs={12} md={12} lg={6}>
          <div>
            {signatureFormat({
              sign: f.bhpSignature,
              time: f.bhpTime,
              date: f.bhpDate,
              hoursFormat: f.hoursFormat,
            })}
            {signatureFormat({
              sign: f.adminSignature,
              date: f.adminSignatureDate,
              time: f.adminSignatureTime,
              hoursFormat: f.hoursFormat,
            })}
          </div>
          <div>
            {f.signers?.map(
              (signer) =>
                signer.signature && (
                  <div key={signer?.signerId}>
                    {signatureFormat({
                      sign: signer.signature,
                      date: signer.dateSigned,
                      time: signer.signedTime,
                      hoursFormat: f.hoursFormat,
                    })}
                  </div>
                ),
            )}
          </div>
        </Col>
      </Row>
      <ResidentPrintSignature />
      <div className="signature-sections-inline mt-3">
        <SignatureNamesPanel
          signatures={f.signatures}
          onUpdate={f.updateSignature}
          formHasTyped={f.hasTypedInForm}
          onClearAllTyped={f.clearAllTyped}
        />
        {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): hidden per client request. See documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */}
        {/* <SignatureSection role="bht" label="BHT Signature" variant="green" signature={f.signatures.bht} onUpdate={f.updateSignature} formHasTyped={f.hasTypedInForm} onClearAllTyped={f.clearAllTyped} /> */}
        {/* <SignatureSection role="bhp" label="BHP Signature" variant="purple" signature={f.signatures.bhp} onUpdate={f.updateSignature} externalName formHasTyped={f.hasTypedInForm} onClearAllTyped={f.clearAllTyped} /> */}
        {/* <SignatureSection role="admin" label="Admin Signature" variant="pink" signature={f.signatures.admin} onUpdate={f.updateSignature} externalName formHasTyped={f.hasTypedInForm} onClearAllTyped={f.clearAllTyped} /> */}
        <SignatureSection
          role="resident"
          label="Resident/Representative Signature"
          variant="blue"
          signature={f.signatures.resident}
          onUpdate={f.updateSignature}
          signerNameOverride={f.residentName || ""}
          formHasTyped={f.hasTypedInForm}
          onClearAllTyped={f.clearAllTyped}
        />
        <SignatureSection
          role="witness"
          label="Witness Signature"
          variant="yellow"
          signature={f.signatures.witness}
          onUpdate={f.updateSignature}
          externalName
          formHasTyped={f.hasTypedInForm}
          onClearAllTyped={f.clearAllTyped}
        />
      </div>
      {(f.Profile.userType === ROLES.PATIENT ||
        f.profile.userType === ROLES.GUARDIAN) && (
        <Row>
          <Col xs={12}>
            <div className="employee-btn-joiner text-center hidePrint mt-3 mt-md-5">
              <button
                type="submit"
                onClick={f.handleSubmit}
                className="employee_create_btn"
                /* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): submit gate
                     reverted (no disabled prop on resident-side IA).
                     See documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */
                /* TEMP-DISABLED-BHP-BHT-ADMIN: disabled={!f.allPenSigsHaveNames} */ disabled={
                  f.witnessIncomplete
                }
              >
                SUBMIT DETAILS
              </button>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}
