/** @format */

import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import ResidentPrintSignature from "@/features/shared/ui/ResidentPrintSignature/ResidentPrintSignature";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import { ROLES } from "@/features/shared/constants/index";
import { signatureFormat } from "@/utils/utils";
import { useInitialAssessmentFormContext } from "../context/InitialAssessmentFormContext";

export default function SignaturesSubmitSection() {
  const f = useInitialAssessmentFormContext();
  return (
    <>
      <Row>
        <Col>
          <Form.Label className="fw-bold w-100">
            Signature indicates participation and informed consent for treatment
            services.
          </Form.Label>
        </Col>
      </Row>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Resident/Representative First and Last Name
              </Form.Label>
              <Form.Control
                className={`${!f.residentRepresentative && "hidePrint"}`}
                value={f.residentRepresentative}
                placeholder="Enter text"
                //required
                onChange={(e) => f.setResidentRepresentative(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} sm={12} md={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                <span className="text-muted">
                  (By signing this document, I acknowledge that I was asked,
                  encouraged to participate in the initial assessment)
                </span>
              </Form.Label>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Row className="mt-3">
        <Col xs={12} md={12} lg={6} className="d-flex align-items-start">
          <Button
            type="button"
            className={`theme-button me-2 hidePrint inline-block ${!f.saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"} inline-block`}
            onClick={() => f.guardTyped(() => f.setSigInModel7(true))}
          >
            SAVED AND SIGNED
          </Button>
        </Col>
        <Col xs={12} md={12} lg={6} className="text-end">
          <div className="text-end mb-0">
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
            <p className="text-end mb-0">
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
            </p>
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
      {!f.id && (
        <Row className="mt-3">
          <Col xs={12}>
            <Form.Group className="mb-3 hidePrint block">
              <Form.Label className="fw-bold">Signers</Form.Label>
              <MultiEmployee
                alsoResident
                setValue={f.setSigners}
                value={f.signers}
              />
            </Form.Group>
          </Col>
        </Row>
      )}

      <Row>
        <Col xs={12}>
          <div className="employee_btn_div hidePrint">
            <button
              type="submit"
              className={`employee_create_btn ${!f.saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
              /* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): submit gate
                     reverted + Witness coupled-pair (2026-04-26). See
                     documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */ disabled={
                f.witnessIncomplete
                  ? true
                  : f.id
                    ? !f.isSubmitEnabled
                    : f.profileInfo?.userType === ROLES.ADMIN
                      ? false
                      : f.bhpSignature?.length === 0
              }
              /* TEMP-DISABLED-BHP-BHT-ADMIN: original gate
                disabled={
                  !f.allPenSigsHaveNames
                    ? true
                    : id
                      ? !f.isSubmitEnabled
                      : f.profileInfo?.userType === ROLES.ADMIN
                        ? false
                        : f.bhpSignature?.length === 0 && !f.hasAnyPenSig
                }
                */
            >
              {f.loading ? <ClipLoader color="#fff" /> : "  SUBMIT DETAILS"}
            </button>
          </div>
        </Col>
      </Row>
    </>
  );
}
