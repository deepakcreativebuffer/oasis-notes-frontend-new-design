/** @format */

import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { fetchPaitentName } from "@/utils/utils";
import "./SignaturePadModal.css";

import { ROLES } from "../../constants";

const SignaturePadModal = ({
  show,
  onHide,
  setValue,
  setDate,
  setTime,
  setRawSignatureImage,
  signerNameOverride,
}) => {
  const sigCanvasRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const profileDetails = useSelector(userProfile);
  const employeeName = profileDetails && fetchPaitentName(profileDetails);
  const employeePosition = profileDetails?.position;
  const employeeSign = `${employeeName} ${
    profileDetails?.userType === ROLES.ADMIN ? "Admin" : employeePosition || ""
  }`.trim();
  const hoursFormat = profileDetails?.hoursFormat === "24" ? "HH:mm" : "h:mm A";

  // If a specific name override is passed (even if it's an empty string),
  // we must respect it. Empty strings mean the user intentionally hasn't typed
  // a name yet (e.g. for Witness). We only fall back to the logged-in user
  // when the override is completely undefined (e.g. for Admin/BHT).
  const displayName =
    signerNameOverride !== undefined
      ? signerNameOverride === "undefined undefined"
        ? ""
        : signerNameOverride
      : employeeSign;

  useEffect(() => {
    if (show) {
      setIsEmpty(true);
    }
  }, [show]);

  const handleClear = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      setIsEmpty(true);
    }
  };

  const handleDrawEnd = () => {
    if (sigCanvasRef.current) {
      setIsEmpty(sigCanvasRef.current.isEmpty());
    }
  };

  const handleSign = () => {
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      return;
    }

    const rawDataUrl = sigCanvasRef.current.getCanvas().toDataURL("image/png");

    let updatedformatString;
    if (hoursFormat === "h:mm A") {
      updatedformatString = "h:mm a";
    } else {
      updatedformatString = hoursFormat;
    }
    const currentDate = new Date();
    const capturedTime = format(currentDate, updatedformatString);

    // Save what the form provided literally — empty/undefined override saves
    // empty so role-specific submit gates (e.g. Witness coupled-pair) can
    // detect missing names. Cosmetic fallback to the logged-in user only
    // happens in displayName above. Per client request 2026-04-26: Witness
    // pen save must NOT auto-populate from the logged-in user; the name has
    // to come from the Print Name text field. Sanitize the obvious garbage
    // strings so neither path saves "undefined undefined".
    const sanitizedOverride =
      signerNameOverride === "undefined undefined" ? "" : signerNameOverride;
    const finalName =
      sanitizedOverride !== undefined ? sanitizedOverride : employeeSign;
    if (setValue) setValue(finalName);
    if (setTime) setTime(capturedTime);
    if (setDate) setDate(currentDate);
    if (setRawSignatureImage) setRawSignatureImage(rawDataUrl);

    if (onHide) onHide();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onHide) {
      onHide();
    }
  };

  if (!show) return null;

  return (
    <div
      className="sig-pad-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div className="sig-pad-modal">
        <div className="sig-pad-header">
          <h3 className="sig-pad-title">Sign with Pen</h3>
          <button
            type="button"
            className="sig-pad-close"
            onClick={onHide}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="sig-pad-body">
          <p className="sig-pad-signer">{displayName}</p>
          <div className="sig-pad-canvas-wrap">
            <SignatureCanvas
              ref={sigCanvasRef}
              onEnd={handleDrawEnd}
              penColor="#000000"
              minWidth={1.5}
              maxWidth={5}
              dotSize={2.5}
              canvasProps={{
                className: "sig-pad-canvas",
                width: 620,
                height: 220,
              }}
            />
            <div className="sig-pad-baseline" />
          </div>
        </div>
        <div className="sig-pad-footer">
          <button
            type="button"
            className="sig-pad-btn sig-pad-btn-secondary"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            type="button"
            className="sig-pad-btn sig-pad-btn-primary"
            onClick={handleSign}
            disabled={isEmpty}
          >
            Sign Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePadModal;
