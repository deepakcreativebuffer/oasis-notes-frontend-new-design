/** @format */

import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import {
  formatDateToMMDDYYYY,
  formatDateWithoutUTCHandleToMMDDYYYY,
} from "@/utils/utils";
import {
  RonBhpIdPhoneRowPrint,
  RonBhpSignatureOutcome,
} from "./RonSignatureDisplay";

export default function RonDemographicsSectionView({ d, hoursFormat }) {
  return (
    <Card body className="mb-4 ron-card-section ron-section-ii-card">
      <h5 className="ron-section-heading mb-4">
        II. Member and BHP Demographic Information
      </h5>

      <div className="ron-member-section">
        <h6 className="ron-subsection-title">Member</h6>
        <Row className="g-3 mb-2 ron-ii-field-row">
          <Col xs={6} className="ron-ii-col-left">
            <p className="ron-field-label mb-1">Member Last Name:</p>
            <p className="view-value mb-0">{d.memberLastName || "\u2014"}</p>
          </Col>
          <Col xs={6} className="ron-ii-col-right">
            <p className="ron-field-label mb-1">Member First Name:</p>
            <p className="view-value mb-0">{d.memberFirstName || "\u2014"}</p>
          </Col>
          <Col xs={6} className="ron-ii-col-left">
            <p className="ron-field-label mb-1">Member DOB:</p>
            <p className="view-value mb-0">
              {d.memberDob ? formatDateToMMDDYYYY(d.memberDob) : "\u2014"}
            </p>
          </Col>
          <Col xs={6} className="ron-ii-col-right">
            <p className="ron-field-label mb-1">Member AHCCCS ID Number:</p>
            <p className="view-value mb-0">{d.memberAhcccsId || "\u2014"}</p>
          </Col>
          <Col xs={6} className="ron-ii-col-left">
            <p className="ron-field-label mb-1">
              Member Behavioral Health ICD-10 Diagnosis- Primary:
            </p>
            <p className="view-value mb-0">
              {d.memberPrimaryIcd10 || "\u2014"}
            </p>
          </Col>
          <Col xs={6} className="ron-ii-col-right">
            <p className="ron-field-label mb-1">Other ICD-10 Diagnoses:</p>
            <p className="view-value mb-0">{d.memberOtherIcd10 || "\u2014"}</p>
          </Col>
          <Col xs={6} className="ron-ii-col-left">
            <p className="ron-field-label mb-1">Member&apos;s Phone:</p>
            <p className="view-value mb-0">{d.memberPhone || "\u2014"}</p>
          </Col>
          <Col xs={6} className="ron-ii-col-right">
            <p className="ron-field-label mb-1">Member&apos;s Email:</p>
            <p className="view-value mb-0">{d.memberEmail || "\u2014"}</p>
          </Col>
        </Row>
      </div>

      <div className="ron-bhp-section pt-1">
        <h6 className="ron-subsection-title">Certifying BHP</h6>
        <Row className="g-3 mb-2 ron-ii-field-row">
          <Col xs={12}>
            <p className="ron-field-label mb-1">
              BHP Printed Name and Credentials:
            </p>
            <p className="view-value mb-0">
              {d.bhpPrintedNameCredentials || "\u2014"}
            </p>
          </Col>
          <RonBhpIdPhoneRowPrint
            bhpProviderId={d.bhpProviderId}
            bhpPhone={d.bhpPhone}
          />
          <Col xs={6} className="ron-ii-col-left">
            <p className="ron-field-label mb-1">BHP Business Email:</p>
            <p className="view-value mb-0">{d.bhpBusinessEmail || "\u2014"}</p>
          </Col>
          <Col xs={6} className="ron-ii-col-right" aria-hidden="true" />
        </Row>

        <Row className="g-3 mt-3 align-items-start ron-ii-field-row ron-ii-signature-row">
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
              {formatDateWithoutUTCHandleToMMDDYYYY(d.bhpSignatureDateTime) ||
                "\u2014"}
            </p>
          </Col>
        </Row>
      </div>
    </Card>
  );
}
