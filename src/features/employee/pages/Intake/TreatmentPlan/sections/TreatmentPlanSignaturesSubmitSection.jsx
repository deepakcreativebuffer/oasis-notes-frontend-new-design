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
import { useTreatmentPlanFormContext } from "../context/TreatmentPlanFormContext";
import { ClipLoader } from "react-spinners";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import ResidentPrintSignature from "@/features/shared/ui/ResidentPrintSignature/ResidentPrintSignature";
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

export default function TreatmentPlanSignaturesSubmitSection() {
  const f = useTreatmentPlanFormContext();
  const signatures = f.signatures ?? DEFAULT_SIGNATURES;
  const updateSignature = f.updateSignature;

  return (
    <>
      <Card body className="mb-3">
        <Form.Label className="fw-bold">Resident / Representative</Form.Label>
        <div className="radio-inline">
          <Form.Check
            inline
            label="Yes, I am in agreement with the services included in this behavioral health treatment Plan"
            type="checkbox"
            id="isReason"
            checked={f.isReason === "yes"}
            onChange={() => f.setIsReason("yes")}
          />{" "}
          <Form.Check
            inline
            label="No, I am not in agreement with the services included in this treatment Plan"
            type="checkbox"
            id="refusalReason"
            checked={f.isReason === "no"}
            onChange={() => f.setIsReason("no")}
          />
        </div>
      </Card>
      <Form.Label className="fw-bold">
        Signature indicates participation and informed consent for treatment
        services.
      </Form.Label>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Resident/Representative First and Last Name
              </Form.Label>
              <Form.Control
                className={`${!f.nameResident && "hidePrint"}`}
                value={f.nameResident}
                placeholder="Enter text"
                onChange={(e) => f.setNameResident(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} sm={12} md={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                <span className="text-muted">
                  (By signing this document, I acknowledge that I was asked,
                  encouraged to participate in the behavioral health treatment
                  plan)
                </span>
              </Form.Label>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Verbal Consent given by resident/representative:
              </Form.Label>
              <Form.Control
                className={`${!f.verbalConsentResidentRepresentative && "hidePrint"}`}
                value={f.verbalConsentResidentRepresentative}
                placeholder="Enter text"
                onChange={(e) =>
                  f.setVerbalConsentResidentRepresentative(e.target.value)
                }
              />
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Row>
        <Col xs={12} sm={12} md={6} className="d-flex align-items-start">
          <Button
            type="button"
            className={`theme-button hidePrint me-2 ${!f.saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
            onClick={() => f.guardTyped(() => f.setSignatureModel3(true))}
          >
            SAVED AND SIGNED
          </Button>
        </Col>
        <Col xs={12} sm={12} lg={6} className="text-end">
          {signatureFormat({
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
        <ResidentPrintSignature />
      </Row>
      <div className="signature-sections-inline mt-3">
        <SignatureNamesPanel
          signatures={signatures}
          onUpdate={updateSignature}
          formHasTyped={f.hasTypedInForm}
          onClearAllTyped={f.clearAllTyped}
        />
        {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): BHT/BHP/Admin
                  inline signature boxes hidden per client request. To restore,
                  uncomment the block below. See
                  documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */}
        {/*
               <SignatureSection
                role="bht"
                label="BHT Signature"
                variant="green"
                signature={signatures.bht}
                onUpdate={updateSignature}
                formHasTyped={f.hasTypedInForm}
                onClearAllTyped={f.clearAllTyped}
               />
               <SignatureSection
                role="bhp"
                label="BHP Signature"
                variant="purple"
                signature={signatures.bhp}
                onUpdate={updateSignature}
                externalName
                formHasTyped={f.hasTypedInForm}
                onClearAllTyped={f.clearAllTyped}
               />
               <SignatureSection
                role="admin"
                label="Admin Signature"
                variant="pink"
                signature={signatures.admin}
                onUpdate={updateSignature}
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
      {!f.id && (
        <Row className="mt-3 hidePrint">
          <Col xs={12} md={12}>
            <Form.Group>
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
        <Col xs={12} md={12}>
          <div className="employee-btn-joiner mt-3 mt-md-5 hidePrint">
            <button
              onClick={f.handlePost}
              type="submit"
              className={`employee_create_btn ${!f.saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
              /* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): submit gate
                   reverted + Witness coupled-pair check (2026-04-26). See
                   documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */ disabled={
                f.witnessIncomplete
                  ? true
                  : f.id
                    ? !f.isSubmitEnabled
                    : f.profileInfo?.userType === ROLES.ADMIN
                      ? false
                      : f.signatureBhp?.length === 0
              }
              /* TEMP-DISABLED-BHP-BHT-ADMIN: original gate
                disabled={
                  !f.allPenSigsHaveNames
                    ? true
                    : f.id
                      ? !f.isSubmitEnabled
                      : f.profileInfo?.userType === ROLES.ADMIN
                        ? false
                        : f.signatureBhp?.length === 0 && !f.hasAnyPenSig
                }
                */
            >
              {f.loading ? <ClipLoader color="#fff" /> : "SUBMIT DETAILS"}{" "}
            </button>
          </div>
        </Col>
      </Row>
    </>
  );
}
