/** @format */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { patientChartService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  formatDateToMMDDYYYY,
  ronSignerLineFromProfile,
  todayLocalNoonDate,
} from "@/utils/utils";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import { RonPrintHeader } from "./RonPrintChrome";
import { RON_INTRO_TEXT } from "./ronConstants";
import RonTreatmentTypeSection from "./RonTreatmentTypeSection";
import RonDemographicsSection from "./RonDemographicsSection";
import RonSectionViAccompanying from "./RonSectionViAccompanying";
import "./RonPrint.css";
import { ROLES } from "@/features/shared/constants";
const CreateRecertificationOfNeed = () => {
  const navigate = useNavigate();
  const profile = useSelector(userProfile);
  const prevPatientRef = useRef("");
  const [data, setData] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState("");
  const [treatmentType, setTreatmentType] = useState("");
  const [memberLastName, setMemberLastName] = useState("");
  const [memberFirstName, setMemberFirstName] = useState("");
  const [memberDob, setMemberDob] = useState("");
  const [memberAhcccsId, setMemberAhcccsId] = useState("");
  const [memberPrimaryIcd10, setMemberPrimaryIcd10] = useState("");
  const [memberOtherIcd10, setMemberOtherIcd10] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [bhpPrintedNameCredentials, setBhpPrintedNameCredentials] =
    useState("");
  const [bhpProviderId, setBhpProviderId] = useState("");
  const [bhpPhone, setBhpPhone] = useState("");
  const [bhpBusinessEmail, setBhpBusinessEmail] = useState("");
  const [certKnowledge, setCertKnowledge] = useState(false);
  const [certAccountability, setCertAccountability] = useState(false);
  const [certSufficientInfo, setCertSufficientInfo] = useState(false);
  const [certMemberAgreement, setCertMemberAgreement] = useState(false);
  const [treatmentPlanDateAcknowledged, setTreatmentPlanDateAcknowledged] =
    useState(false);
  const [currentTreatmentPlanDate, setCurrentTreatmentPlanDate] = useState("");
  const [iopServiceContinuation, setIopServiceContinuation] = useState("");
  const [bhrfServiceContinuation, setBhrfServiceContinuation] = useState("");
  const [accompanyTreatmentPlan, setAccompanyTreatmentPlan] = useState(false);
  const [accompanyProgressNotes, setAccompanyProgressNotes] = useState(false);
  const [bhpSignature, setBhpSignature] = useState("");
  const [bhpSignatureDateTime, setBhpSignatureDateTime] = useState("");
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [signers, setSigners] = useState([]);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const { signatures, updateSignature, loadFromApi } = useSignatures();
  const hasTypedInForm = !!bhpSignature || !!adminSignature;
  const hasPenBhp = !!signatures?.bhp?.rawSignatureImage;
  const clearAllTyped = () => {
    setBhpSignature("");
    setBhpSignatureDateTime("");
    setAdminSignature("");
    setAdminDateSigned("");
  };
  const mergeBhpSignatures = useCallback(
    (role, patch) => {
      updateSignature(role, patch);
      if (role === "bhp") {
        if (patch.signature !== undefined)
          setBhpSignature(patch.signature || "");
        if (patch.date !== undefined && patch.date !== "")
          setBhpSignatureDateTime(patch.date);
      }
    },
    [updateSignature],
  );
  useEffect(() => {
    if (patientId && profile?.userType) {
      patientChartService.recertificationOfNeed.getByPatientId(patientId, {
        setResponse: setData,
        setLoading,
      });
    }
  }, [patientId, profile?.userType]);
  useEffect(() => {
    if (!patientId || !profile) return;
    const fallback = ronSignerLineFromProfile(profile);
    const patientChanged = prevPatientRef.current !== patientId;
    prevPatientRef.current = patientId;
    setBhpPrintedNameCredentials((prev) =>
      String(prev || "").trim() ? prev : fallback || "",
    );
    if (patientChanged) {
      setBhpSignatureDateTime(todayLocalNoonDate());
    }
  }, [patientId, profile]);
  useEffect(() => {
    const row = data?.data;
    if (
      row &&
      patientId &&
      (row.patientId === patientId || row.patientId?._id === patientId)
    ) {
      setTreatmentType(row.treatmentType || "");
      setMemberLastName(row.memberLastName || "");
      setMemberFirstName(row.memberFirstName || "");
      setMemberDob(row.memberDob || "");
      setMemberAhcccsId(row.memberAhcccsId || "");
      setMemberPrimaryIcd10(row.memberPrimaryIcd10 || "");
      setMemberOtherIcd10(row.memberOtherIcd10 || "");
      setMemberPhone(row.memberPhone || "");
      setMemberEmail(row.memberEmail || "");
      setBhpPrintedNameCredentials(
        row.bhpPrintedNameCredentials?.trim()
          ? row.bhpPrintedNameCredentials
          : ronSignerLineFromProfile(profile) || "",
      );
      setBhpProviderId(row.bhpProviderId || "");
      setBhpPhone(row.bhpPhone || "");
      setBhpBusinessEmail(row.bhpBusinessEmail || "");
      setCertKnowledge(!!row.certKnowledge);
      setCertAccountability(!!row.certAccountability);
      setCertSufficientInfo(!!row.certSufficientInfo);
      setCertMemberAgreement(!!row.certMemberAgreement);
      setTreatmentPlanDateAcknowledged(!!row.treatmentPlanDateAcknowledged);
      setCurrentTreatmentPlanDate(row.currentTreatmentPlanDate || "");
      setIopServiceContinuation(row.iopServiceContinuation || "");
      setBhrfServiceContinuation(row.bhrfServiceContinuation || "");
      setAccompanyTreatmentPlan(!!row.accompanyTreatmentPlan);
      setAccompanyProgressNotes(!!row.accompanyProgressNotes);
      setBhpSignature(row.bhpSignature || "");
      setBhpSignatureDateTime(
        row.bhpSignatureDateTime
          ? row.bhpSignatureDateTime
          : todayLocalNoonDate(),
      );
      loadFromApi(row.signatures);
      setAdminSignature(row.adminSignature || "");
      setAdminDateSigned(row.adminDateSigned || "");
      setSigners(
        (row.signers || []).map((s) => ({
          ...s,
          value: String(s.signerId?._id ?? s.signerId ?? ""),
          label: s.name || "",
        })),
      );
    }
  }, [data, patientId, profile, loadFromApi]);
  useEffect(() => {
    if (!patientDetail?._id) return;
    setMemberFirstName(patientDetail.firstName || "");
    setMemberLastName(patientDetail.lastName || "");
    setMemberAhcccsId(patientDetail.ahcccsId || "");
    setMemberPrimaryIcd10(patientDetail.diagnosis || "");
    setMemberPhone(patientDetail.phone || "");
    setMemberEmail(patientDetail.email || "");
    if (patientDetail.dateOfBirth) {
      setMemberDob(patientDetail.dateOfBirth);
    }
    setClientName(
      `${patientDetail.firstName || ""} ${patientDetail.lastName || ""}`.trim(),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientDetail?._id]);
  const signersPayload = () =>
    (signers || []).map((signer) => ({
      signerId: signer.value ?? signer.signerId?._id ?? signer.signerId,
      name: signer.label ?? signer.name ?? "",
      signature: signer.signature ?? "",
      dateSigned: signer.dateSigned ?? "",
      signedTime: signer.signedTime ?? "",
    }));
  const clientComputed =
    `${memberFirstName || ""} ${memberLastName || ""}`.trim() || clientName;
  const initialFormData = {
    patientId,
    clientName: clientComputed,
    treatmentType,
    memberLastName,
    memberFirstName,
    memberDob,
    memberAhcccsId,
    memberPrimaryIcd10,
    memberOtherIcd10,
    memberPhone,
    memberEmail,
    bhpPrintedNameCredentials,
    bhpProviderId,
    bhpPhone,
    bhpBusinessEmail,
    certKnowledge,
    certAccountability,
    certSufficientInfo,
    certMemberAgreement,
    treatmentPlanDateAcknowledged,
    currentTreatmentPlanDate,
    iopServiceContinuation,
    bhrfServiceContinuation,
    accompanyTreatmentPlan,
    accompanyProgressNotes,
    saveAsDraft,
    bhpSignature,
    bhpSignatureDateTime,
    adminSignature,
    adminDateSigned,
    signatures,
    signers: signersPayload(),
  };
  const gateOkForSubmit =
    saveAsDraft ||
    (treatmentType &&
      !!clientComputed &&
      (bhpSignature?.length > 0 || hasPenBhp));
  const submitHandler = (e) => {
    e.preventDefault();
    patientChartService.recertificationOfNeed.post(initialFormData, {
      setLoading,
      navigate,
    });
  };
  return (
    <>
      <NavWrapper title={"Re-Certification of Need (RON)"} isArrow={true} />
      <Container>
        <Form onSubmit={submitHandler}>
          <PatientComponent
            MainPatientId={setPatientId}
            setWholeData={setPatientDetail}
            MainResidentName={setClientName}
            className="mb-2 hidePrint"
          />

          <div className="ron-print-root">
            <RonPrintHeader />

            <div className="ron-intro mb-4 p-3 border rounded bg-white">
              {RON_INTRO_TEXT}
            </div>

            <RonTreatmentTypeSection
              treatmentType={treatmentType}
              setTreatmentType={setTreatmentType}
            />

            <RonDemographicsSection
              memberLastName={memberLastName}
              setMemberLastName={setMemberLastName}
              memberFirstName={memberFirstName}
              setMemberFirstName={setMemberFirstName}
              memberDob={memberDob}
              setMemberDob={setMemberDob}
              memberAhcccsId={memberAhcccsId}
              setMemberAhcccsId={setMemberAhcccsId}
              memberPrimaryIcd10={memberPrimaryIcd10}
              setMemberPrimaryIcd10={setMemberPrimaryIcd10}
              memberOtherIcd10={memberOtherIcd10}
              setMemberOtherIcd10={setMemberOtherIcd10}
              memberPhone={memberPhone}
              setMemberPhone={setMemberPhone}
              memberEmail={memberEmail}
              setMemberEmail={setMemberEmail}
              bhpPrintedNameCredentials={bhpPrintedNameCredentials}
              setBhpPrintedNameCredentials={setBhpPrintedNameCredentials}
              bhpProviderId={bhpProviderId}
              setBhpProviderId={setBhpProviderId}
              bhpPhone={bhpPhone}
              setBhpPhone={setBhpPhone}
              bhpBusinessEmail={bhpBusinessEmail}
              setBhpBusinessEmail={setBhpBusinessEmail}
              bhpSignatureDateTime={bhpSignatureDateTime}
              signatures={signatures}
              mergeBhpSignatures={mergeBhpSignatures}
              hasTypedInForm={hasTypedInForm}
              clearAllTyped={clearAllTyped}
            />

            <div className="d-none d-print-block ron-print-page-break-after" />

            <RonPrintHeader breakBefore />

            <Card body className="mb-3 ron-print-avoid">
              <h5 className="ron-view-section-title ron-print-section-title">
                III. BHP Certification (Required)
              </h5>
              <p className="small mb-2">
                The BHP signature on the RON certifies that he/she is the
                treating BHP, and that:
              </p>
              <Form.Check
                type="checkbox"
                id="cert1"
                checked={certKnowledge || certAccountability}
                onChange={() => {
                  const next = !(certKnowledge || certAccountability);
                  setCertKnowledge(next);
                  setCertAccountability(next);
                }}
                className="mb-2 align-items-start"
                label="He/She has current knowledge of the client's behavioral health condition and treatment needs,"
              />
              <p className="small mb-2 ms-4 ps-1">
                He/She certifies his/her accountability for and oversight of all
                services that are expected to be delivered in accordance with
                the member&apos;s current treatment plan.
              </p>
              <Form.Check
                type="checkbox"
                id="cert2"
                checked={certSufficientInfo}
                onChange={() => setCertSufficientInfo((v) => !v)}
                className="mb-2 align-items-start"
                label="He/She has sufficient information to determine that continued treatment at the specified care level is most appropriate to safely meet the behavioral health needs of the member."
              />
              <Form.Check
                type="checkbox"
                id="cert3"
                checked={certMemberAgreement}
                onChange={() => setCertMemberAgreement((v) => !v)}
                className="mb-2 align-items-start"
                label="The member has agreed to participate in treatment in the level of care specified above, or in the case of a member who has a health care decision maker (HCDM), including minors, the HCDM has agreed to the member's participation in treatment at the level of care specified above."
              />
              <div className="ms-4 mt-2">
                <Form.Check
                  type="checkbox"
                  id="tpdAck"
                  checked={treatmentPlanDateAcknowledged}
                  onChange={() => setTreatmentPlanDateAcknowledged((v) => !v)}
                  className="mb-2"
                  label="Please specify the date of the current treatment plan:"
                />
                {treatmentPlanDateAcknowledged ? (
                  <DatePicker
                    selected={formatDateToMMDDYYYY(currentTreatmentPlanDate)}
                    onChange={(d) =>
                      setCurrentTreatmentPlanDate(d?.toDateString?.() || "")
                    }
                    dateFormat="MM/dd/yyyy"
                    className="form-control"
                    placeholderText="MM/DD/YYYY"
                  />
                ) : null}
              </div>
            </Card>

            <p className="fw-semibold mb-3">
              For IOP see Sections IV. and VI., or For BHRF see Sections V. and
              VI (Required)
            </p>

            <Card body className="mb-3 ron-print-avoid">
              <h5 className="ron-view-section-title">
                IV. IOP Service Continuation
              </h5>
              <p className="small">
                Specify the signs and symptoms that are the result of the
                member’s diagnosed behavioral health condition, and which
                necessitate continued treatment in a Behavioral Health
                Residential Facility, including the specific criteria the member
                has met, in accordance with AMPM 320-V. Please also indicate
                what evidence-based practices and programs (EBPPs) were used to
                determine medical necessity.
              </p>
              <Form.Control
                as="textarea"
                rows={8}
                value={iopServiceContinuation}
                onChange={(e) => setIopServiceContinuation(e.target.value)}
              />
            </Card>

            <div className="d-none d-print-block ron-print-page-break-after" />

            <RonPrintHeader breakBefore />

            <Card body className="mb-3 ron-print-avoid">
              <h5 className="ron-view-section-title">
                V. BHRF Service Continuation
              </h5>
              <p className="small">
                Specify the signs and symptoms that are the result of the
                member’s diagnosed behavioral health condition and which
                necessitate continued treatment in a Behavioral Health
                Residential Facility, and which criteria the member meets in
                accordance with AMPM 320-V:
              </p>
              <Form.Control
                as="textarea"
                rows={8}
                value={bhrfServiceContinuation}
                onChange={(e) => setBhrfServiceContinuation(e.target.value)}
              />
            </Card>

            <RonSectionViAccompanying
              accompanyTreatmentPlan={accompanyTreatmentPlan}
              accompanyProgressNotes={accompanyProgressNotes}
              onAccompanyTreatmentPlanChange={() =>
                setAccompanyTreatmentPlan((v) => !v)
              }
              onAccompanyProgressNotesChange={() =>
                setAccompanyProgressNotes((v) => !v)
              }
              treatmentCheckboxId="ac1"
              progressCheckboxId="ac2"
            />
          </div>

          <div className="signature-sections-inline mt-3 hidePrint">
            <SignatureNamesPanel
              signatures={signatures}
              onUpdate={mergeBhpSignatures}
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
          </div>

          <Row className="mb-3 mt-3 hidePrint">
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">Signers</Form.Label>
                <MultiEmployee
                  setValue={setSigners}
                  value={signers}
                  alsoResident
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="employee-btn-joiner mt-3 mt-md-4 hidePrint">
                <button
                  className="draft"
                  type="submit"
                  onClick={() => setSaveAsDraft(true)}
                >
                  Save as Draft
                </button>
                <button
                  className="employee_create_btn"
                  type="submit"
                  onClick={() => setSaveAsDraft(false)}
                  disabled={
                    profile.userType === ROLES.ADMIN ? false : !gateOkForSubmit
                  }
                >
                  {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: CreateRecertificationOfNeed,
});
