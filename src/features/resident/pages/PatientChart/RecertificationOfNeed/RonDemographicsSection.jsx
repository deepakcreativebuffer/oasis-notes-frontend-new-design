/** @format */

import React, { useEffect, useRef } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { BorderlessInput } from "@/utils/Makers";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";

export default function RonDemographicsSection({
  memberLastName,
  setMemberLastName,
  memberFirstName,
  setMemberFirstName,
  memberDob,
  setMemberDob,
  memberAhcccsId,
  setMemberAhcccsId,
  memberPrimaryIcd10,
  setMemberPrimaryIcd10,
  memberOtherIcd10,
  setMemberOtherIcd10,
  memberPhone,
  setMemberPhone,
  memberEmail,
  setMemberEmail,
  bhpPrintedNameCredentials,
  setBhpPrintedNameCredentials,
  bhpProviderId,
  setBhpProviderId,
  bhpPhone,
  setBhpPhone,
  bhpBusinessEmail,
  setBhpBusinessEmail,
  bhpSignatureDateTime,
  signatures,
  mergeBhpSignatures,
  hasTypedInForm,
  clearAllTyped,
}) {
  const syncedPenDateRef = useRef(null);

  useEffect(() => {
    const img = String(signatures?.bhp?.rawSignatureImage || "").trim();
    if (!mergeBhpSignatures || img.length < 32 || !bhpSignatureDateTime) {
      syncedPenDateRef.current = null;
      return;
    }
    const stamp =
      bhpSignatureDateTime instanceof Date
        ? bhpSignatureDateTime.getTime()
        : String(bhpSignatureDateTime);
    if (syncedPenDateRef.current === stamp) return;
    syncedPenDateRef.current = stamp;
    mergeBhpSignatures("bhp", { date: bhpSignatureDateTime });
  }, [
    bhpSignatureDateTime,
    signatures?.bhp?.rawSignatureImage,
    mergeBhpSignatures,
  ]);

  useEffect(() => {
    const img = String(signatures?.bhp?.rawSignatureImage || "").trim();
    if (!mergeBhpSignatures || img.length < 32) return;
    const cred = String(bhpPrintedNameCredentials || "").trim();
    if (!cred) return;
    const secName = String(signatures?.bhp?.name || "").trim();
    if (secName === cred) return;
    mergeBhpSignatures("bhp", { name: cred });
  }, [
    bhpPrintedNameCredentials,
    signatures?.bhp?.rawSignatureImage,
    signatures?.bhp?.name,
    mergeBhpSignatures,
  ]);

  return (
    <Card body className="mb-4 ron-card-section ron-section-ii-card">
      <h5 className="ron-section-heading mb-4">
        II. Member and BHP Demographic Information
      </h5>

      <div className="ron-member-section">
        <h6 className="ron-subsection-title">Member</h6>
        <Row className="g-3 mb-2 ron-ii-field-row">
          <Col xs={6} className="ron-ii-col-left">
            <Form.Label className="ron-field-label">
              Member Last Name:
            </Form.Label>
            <BorderlessInput
              value={memberLastName}
              setState={setMemberLastName}
              placeholder=""
            />
          </Col>
          <Col xs={6} className="ron-ii-col-right">
            <Form.Label className="ron-field-label">
              Member First Name:
            </Form.Label>
            <BorderlessInput
              value={memberFirstName}
              setState={setMemberFirstName}
              placeholder=""
            />
          </Col>
          <Col xs={6} className="ron-ii-col-left">
            <Form.Label className="ron-field-label">Member DOB:</Form.Label>
            <DatePicker
              selected={formatDateToMMDDYYYY(memberDob)}
              onChange={(d) => setMemberDob(d?.toDateString?.() || "")}
              dateFormat="MM/dd/yyyy"
              className="form-control"
              placeholderText="MM/DD/YYYY"
            />
          </Col>
          <Col xs={6} className="ron-ii-col-right">
            <Form.Label className="ron-field-label">
              Member AHCCCS ID Number:
            </Form.Label>
            <BorderlessInput
              value={memberAhcccsId}
              setState={setMemberAhcccsId}
              placeholder=""
            />
          </Col>
          <Col xs={6} className="ron-ii-col-left">
            <Form.Label className="ron-field-label">
              Member Behavioral Health ICD-10 Diagnosis- Primary:
            </Form.Label>
            <BorderlessInput
              value={memberPrimaryIcd10}
              setState={setMemberPrimaryIcd10}
              placeholder=""
            />
          </Col>
          <Col xs={6} className="ron-ii-col-right">
            <Form.Label className="ron-field-label">
              Other ICD-10 Diagnoses:
            </Form.Label>
            <BorderlessInput
              value={memberOtherIcd10}
              setState={setMemberOtherIcd10}
              placeholder=""
            />
          </Col>
          <Col xs={6} className="ron-ii-col-left">
            <Form.Label className="ron-field-label">
              Member&apos;s Phone:
            </Form.Label>
            <BorderlessInput
              value={memberPhone}
              setState={setMemberPhone}
              placeholder=""
            />
          </Col>
          <Col xs={6} className="ron-ii-col-right">
            <Form.Label className="ron-field-label">
              Member&apos;s Email:
            </Form.Label>
            <BorderlessInput
              value={memberEmail}
              setState={setMemberEmail}
              placeholder=""
            />
          </Col>
        </Row>
      </div>

      <div className="ron-bhp-section pt-1">
        <h6 className="ron-subsection-title">Certifying BHP</h6>
        <Row className="g-3 mb-2 ron-ii-field-row">
          <Col xs={12}>
            <Form.Label className="ron-field-label">
              BHP Printed Name and Credentials:
            </Form.Label>
            <BorderlessInput
              value={bhpPrintedNameCredentials}
              setState={setBhpPrintedNameCredentials}
              placeholder=""
            />
          </Col>
          <Col xs={6} className="ron-ii-col-left">
            <Form.Label className="ron-field-label">
              BHP AHCCCS Provider ID Number (six digits):
            </Form.Label>
            <BorderlessInput
              value={bhpProviderId}
              setState={setBhpProviderId}
              placeholder=""
            />
          </Col>
          <Col xs={6} className="ron-ii-col-right">
            <Form.Label className="ron-field-label">
              BHP Phone Number:
            </Form.Label>
            <BorderlessInput
              value={bhpPhone}
              setState={setBhpPhone}
              placeholder=""
            />
          </Col>
          <Col xs={6} className="ron-ii-col-left">
            <Form.Label className="ron-field-label">
              BHP Business Email:
            </Form.Label>
            <BorderlessInput
              value={bhpBusinessEmail}
              setState={setBhpBusinessEmail}
              placeholder=""
            />
          </Col>
          <Col xs={6} className="ron-ii-col-right" aria-hidden="true" />
        </Row>

        <Row className="g-3 mt-3 align-items-start ron-ii-field-row ron-ii-signature-row">
          <Col xs={12}>
            <Form.Label className="ron-field-label">BHP Signature:</Form.Label>
            <div className="signature-sections-inline">
              <SignatureSection
                role="bhp"
                label="Signature"
                variant="purple"
                signature={signatures?.bhp}
                onUpdate={mergeBhpSignatures}
                signerNameOverride={bhpPrintedNameCredentials}
                inlineDateFallback={bhpSignatureDateTime}
                externalName
                formHasTyped={hasTypedInForm}
                onClearAllTyped={clearAllTyped}
              />
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );
}
