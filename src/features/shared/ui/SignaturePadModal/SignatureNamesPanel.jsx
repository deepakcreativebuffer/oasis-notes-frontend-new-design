/** @format */

import React, { useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import SignatureConflictDialog from "./SignatureConflictDialog";
import "./SignaturePadModal.css";

import { ROLES } from "../../constants";

/**
 * Single panel rendered ABOVE the 5 inline signature sections.
 * Contains Print Name inputs for Admin, BHT, Witness.
 *
 * Mutual exclusivity (FORM-LEVEL):
 *   If formHasTyped=true (any legacy SAVED AND SIGNED fields populated
 *   anywhere in the form), focusing or typing in ANY input shows the
 *   conflict dialog. On confirm, onClearAllTyped() wipes typed state
 *   and the user can type.
 *
 * Props:
 *   signatures        full signatures object from useSignatures
 *   onUpdate          (role, patch) => void
 *   roles             optional — customize which roles get inputs
 *   title             optional card header
 *   formHasTyped      default false — if true, any edit fires the dialog
 *   onClearAllTyped   () => void — called when user confirms
 */
// Default role list depends on userType:
//   Employee logged in  → Employee IS the BHT, so Panel asks for BHP / Admin / Witness
//   Admin logged in     → Admin IS the Admin, so Panel asks for BHP / BHT / Witness
// TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): BHP / BHT / Admin Print Name
// inputs hidden per client request. Witness remains visible. To restore,
// uncomment the disabled rows below. See
// documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md.
const DEFAULT_ROLES_EMPLOYEE = [
  // TEMP-DISABLED-BHP-BHT-ADMIN: { role: "bhp", label: "BHP" },
  // TEMP-DISABLED-BHP-BHT-ADMIN: { role: "admin", label: "Admin" },
  { role: "witness", label: "Witness" },
];
const DEFAULT_ROLES_ADMIN = [
  // TEMP-DISABLED-BHP-BHT-ADMIN: { role: "bhp", label: "BHP" },
  // TEMP-DISABLED-BHP-BHT-ADMIN: { role: "bht", label: "BHT" },
  { role: "witness", label: "Witness" },
];

const SignatureNamesPanel = ({
  signatures,
  onUpdate,
  roles,
  title = "Signer Names",
  formHasTyped = false,
  onClearAllTyped,
}) => {
  const [conflictOpen, setConflictOpen] = useState(false);
  const profile = useSelector(userProfile);
  const isAdminUser = profile?.userType === ROLES.ADMIN;
  const effectiveRoles =
    roles || (isAdminUser ? DEFAULT_ROLES_ADMIN : DEFAULT_ROLES_EMPLOYEE);

  if (!signatures || !onUpdate) return null;

  // TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): typed-vs-pen mutex disabled
  // per client request — Print Name inputs no longer fire the conflict
  // dialog. To restore the mutex, uncomment the formHasTyped guards below.
  // See documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md.
  const handleFocus = (e) => {
    // TEMP-DISABLED-BHP-BHT-ADMIN: if (formHasTyped) { e.target.blur(); setConflictOpen(true); }
  };

  const handleChange = (role, e) => {
    // TEMP-DISABLED-BHP-BHT-ADMIN: if (formHasTyped) { setConflictOpen(true); return; }
    onUpdate(role, { name: e.target.value });
  };

  const handleConfirmClear = () => {
    if (onClearAllTyped) onClearAllTyped();
    setConflictOpen(false);
  };

  return (
    <>
      <SignatureConflictDialog
        show={conflictOpen}
        onHide={() => setConflictOpen(false)}
        onConfirm={handleConfirmClear}
        existingMethod="typed"
        roleLabel="This form"
      />
      <Card className="hidePrint sig-names-panel mb-3">
        <Card.Body>
          {title && <h5 className="sig-names-panel-title mb-3">{title}</h5>}
          <Row>
            {effectiveRoles.map(({ role, label }) => (
              <Col xs={12} md={6} lg={4} key={role} className="mb-3 mb-lg-0">
                <Form.Group>
                  <Form.Label className="fw-bold">{label} Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={signatures?.[role]?.name || ""}
                    onFocus={handleFocus}
                    onChange={(e) => handleChange(role, e)}
                    placeholder="Enter text"
                  />
                </Form.Group>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default SignatureNamesPanel;
