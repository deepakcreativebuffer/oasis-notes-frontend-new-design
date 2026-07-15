/** @format */

import React from "react";
import { Col } from "react-bootstrap";
import { signatureFormat } from "@/utils/utils";

export function RonBhpSignatureOutcome({
  hoursFormat,
  bhpSignature,
  bhpPrintedNameCredentials,
  bhpSignatureDateTime,
  signatures,
  hideLabel,
}) {
  const img = signatures?.bhp?.rawSignatureImage;

  const cred = String(bhpPrintedNameCredentials || "").trim();
  const typedSign = String(bhpSignature || "").trim();
  const penStoredName =
    signatures?.bhp?.name &&
    signatures.bhp.name.trim() &&
    signatures.bhp.name !== "undefined undefined"
      ? signatures.bhp.name.trim()
      : "";
  const displayPenName = penStoredName || cred || "";

  return (
    <div className="ron-print-avoid mt-2">
      {hideLabel ? null : <p className="fw-semibold mb-2">BHP Signature</p>}
      {img ? (
        <div>
          <img
            src={img}
            alt=""
            style={{ maxHeight: 72, borderBottom: "1px solid #333" }}
          />
          {displayPenName ? (
            <p className="small mb-0 mt-1">{displayPenName}</p>
          ) : null}
        </div>
      ) : (
        <>
          {signatureFormat({
            sign: cred || typedSign,
            date: bhpSignatureDateTime,
            time: "",
            hoursFormat,
          })}
        </>
      )}
    </div>
  );
}

export function RonBhpIdPhoneRowPrint({ bhpProviderId, bhpPhone }) {
  return (
    <>
      <Col xs={6} className="ron-ii-col-left">
        <p className="ron-field-label mb-1">
          BHP AHCCCS Provider ID Number (six digits):
        </p>
        <div className="view-value">{bhpProviderId || "\u2014"}</div>
      </Col>
      <Col xs={6} className="ron-ii-col-right">
        <p className="ron-field-label mb-1">BHP Phone Number:</p>
        <div className="view-value">{bhpPhone || "\u2014"}</div>
      </Col>
    </>
  );
}
