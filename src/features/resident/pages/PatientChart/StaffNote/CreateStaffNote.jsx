/* eslint-disable no-unused-vars */
/** @format */

// NOTE: This form is referred to as "Staffing Note" internally (file name,
// state shape, controller, model, schema fields like staffingWithin30Days
// remain unchanged) but is RENAMED in the UI to "ART Meeting". All
// user-facing strings below display "ART Meeting" instead of "Staffing Note".

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { ClipLoader } from "react-spinners";
import { createForRole, patientChartService } from "@/features/shared/services";
import NavWrapper from "@/utils/NavWrapper";
import { BorderlessInput, RadioMaker } from "@/utils/Makers";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import HOC from "@/features/shared/layout/Inner/HOC";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { PRESENTING_PROBLEMS_OPTIONS } from "@/features/shared/constants";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
import { ROLES } from "@/features/shared/constants";
const CreateStaffNote = () => {
  const navigate = useNavigate();
  const profileUser = useSelector(userProfile);
  const hoursFormat = profileUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState("");
  const [todayDate, setTodayDate] = useState(formatDateToMMDDYYYY(new Date()));
  const [beginTime, setBeginTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [participantsPresent, setParticipantsPresent] = useState("");
  const [presentingProblems, setPresentingProblems] = useState([]);
  const [progress, setProgress] = useState("");
  const [stepDownBarriers, setStepDownBarriers] = useState([]);
  const [stepDownBarriersOther, setStepDownBarriersOther] = useState("");
  const [stepDownBarriersText, setStepDownBarriersText] = useState("");
  const [stepDownBarriersBoolean, setStepDownBarriersBoolean] = useState(false);
  const [recommendations, setRecommendations] = useState("");
  const [staffSignature, setStaffSignature] = useState("");
  const [signedDate, setSignedDate] = useState("");
  const [signedTime, setSignedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [staffingWithin30Days, setStaffingWithin30Days] = useState("Yes");
  const [reasonForNoStaffingWithin30Days, setReasonForNoStaffingWithin30Days] =
    useState("");
  const [goalsAddressed, setGoalAddressed] = useState("");
  const [clinicTreatmentPlanRequested, setClinicTreatmentPlanRequested] =
    useState(true);
  const [stepDownDiscussed, setStepDownDiscussed] = useState(true);
  const [explanationForNoStaffing, setExplanationForNoStaffing] = useState("");
  const [signers, setSigners] = useState([]);
  const [patientDetail, setPatientDetail] = useState({});
  const [dateOfBirth, setDOB] = useState("");
  const [admitDate, setAdminDate] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [data, setData] = useState([]);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [openAdmin, setAdminOpen] = useState(false);
  const { signatures, updateSignature } = useSignatures();
  const { guardTyped, dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });
  const hasTypedInForm = !!staffSignature || !!adminSignature;
  const hasAnyPenSig = Object.values(signatures || {}).some(
    (s) => !!s?.rawSignatureImage,
  );
  const allPenSigsHaveNames = Object.values(signatures || {}).every(
    (s) => !s?.rawSignatureImage || !!s?.name?.trim(),
  );
  // Witness coupled-pair: block submit if signature exists without name OR
  // name exists without signature. Per client request 2026-04-26.
  const witnessNamePresent = !!(
    signatures?.witness?.name &&
    signatures.witness.name.trim() &&
    signatures.witness.name.trim() !== "undefined undefined"
  );
  const witnessSigPresent = !!signatures?.witness?.rawSignatureImage;
  const witnessIncomplete = witnessSigPresent && !witnessNamePresent;
  const clearAllTyped = () => {
    setStaffSignature("");
    setSignedDate("");
    setSignedTime("");
    setAdminSignature("");
    setAdminDateSigned("");
    setAdminSignedTime("");
  };

  useEffect(() => {
    if (patientId) {
      patientChartService.staffingNote.getByPatientId(patientId, {
        setResponse: setData,
        setLoading,
      });
    }
  }, [patientId, profileUser?.userType]);
  useEffect(() => {
    let populateData;
    if (Array.isArray(data?.data)) {
      populateData = data?.data?.find((item) => {
        return (
          item?.patientId?._id === patientId || item?.patientId === patientId
        );
      });
    }
    if (populateData) {
      setBeginTime(populateData?.beginTime);
      setEndTime(populateData?.endTime);
      setStaffingWithin30Days(
        populateData?.staffingWithin30Days === "" ||
          populateData?.staffingWithin30Days == null
          ? "Yes"
          : populateData?.staffingWithin30Days,
      );
      setReasonForNoStaffingWithin30Days(
        populateData?.reasonForNoStaffingWithin30Days || "",
      );
      setClinicTreatmentPlanRequested(
        populateData?.clinicTreatmentPlanRequested === "" ||
          populateData?.clinicTreatmentPlanRequested == null
          ? true
          : populateData?.clinicTreatmentPlanRequested,
      );
      setStepDownDiscussed(
        populateData?.stepDownDiscussed === "" ||
          populateData?.stepDownDiscussed == null
          ? true
          : populateData?.stepDownDiscussed,
      );
    } else {
      setBeginTime("");
      setEndTime("");
      setStaffingWithin30Days("Yes");
      setReasonForNoStaffingWithin30Days("");
      setClinicTreatmentPlanRequested(true);
      setStepDownDiscussed(true);
    }
  }, [data, patientId, profileUser._id]);
  const payload = {
    patientId,
    residentName,
    todayDate,
    beginTime,
    endTime,
    participantsPresent,
    presentingProblems: presentingProblems.map((v) =>
      typeof v === "object" ? v.value : v,
    ),
    progress,
    stepDownBarriers,
    stepDownBarriersOther,
    stepDownBarriersText,
    admitDate,
    recommendations,
    staffSignature,
    signedTime,
    signedDate,
    saveAsDraft,
    staffingWithin30Days,
    reasonForNoStaffingWithin30Days,
    goalsAddressed,
    clinicTreatmentPlanRequested,
    stepDownDiscussed,
    explanationForNoStaffing,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    signatures,
    signers: signers?.map((signer) => ({
      signerId: signer.value,
      name: signer.label,
      signature: "",
      dateSigned: "",
      signedTime: "",
    })),
  };
  const submitHandler = (e) => {
    e.preventDefault();
    createForRole(
      profileUser?.userType === ROLES.ADMIN,
      "admin/create-staffing-note",
      "employee/createStaffingNote",
      payload,
      { setLoading, navigate, successMsg: "Created !" },
    );
  };
  useEffect(() => {
    if (patientDetail) {
      setDOB(patientDetail?.dateOfBirth);
      setAdminDate(patientDetail?.admitDate);
      setAhcccsId(patientDetail?.ahcccsId);
      setDiagnosis(patientDetail?.diagnosis);

      const pp = patientDetail?.presentingProblems || [];
      setPresentingProblems(
        pp.map((s) => (typeof s === "string" ? { label: s, value: s } : s)),
      );

      setStepDownBarriers(
        patientDetail?.stepDownBarriers || patientDetail?.barries || [],
      );
      setStepDownBarriersOther(patientDetail?.stepDownBarriersOther || "");
      setStepDownBarriersText(patientDetail?.stepDownBarriersText || "");
      setStepDownBarriersBoolean(
        (
          patientDetail?.stepDownBarriers ||
          patientDetail?.barries ||
          []
        )?.includes("Other") || false,
      );
    }
  }, [patientDetail]);
  return (
    <>
      {typedGuardDialog}
      <AddSignature
        show={open}
        setValue={setStaffSignature}
        setDate={setSignedDate}
        setTime={setSignedTime}
      />
      <AddSignature
        show={openAdmin}
        setValue={setAdminSignature}
        setDate={setAdminDateSigned}
        setTime={setAdminSignedTime}
      />
      <NavWrapper isArrow={true} title={"ART Meeting"} />
      <Container>
        <Form onSubmit={submitHandler}>
          <Row className="mb-2">
            <Col>
              <PatientComponent
                MainResidentName={setResidentName}
                MainPatientId={setPatientId}
                setWholeData={setPatientDetail}
              />
            </Col>
          </Row>
          <Card className="mb-2 mb-md-3">
            <Card.Body>
              <Row>
                <Col xs={12} md={4} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={ahcccsId}
                      onChange={(e) => setAhcccsId(e.target.value)}
                      disabled
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={4} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">DOB</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(dateOfBirth)}
                      disabled
                      onChange={(selectedDate) =>
                        setDOB(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            dateOfBirth
                              ? formatDateToMMDDYYYY(dateOfBirth)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={4} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">Admit Date</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(admitDate)}
                      disabled
                      onChange={(selectedDate) =>
                        setAdminDate(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            admitDate
                              ? formatDateToMMDDYYYY(admitDate)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={4} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Diagnosis (specify if new or continuing)
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder=""
                      type={"text"}
                      value={diagnosis}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-2 mb-md-3">
            <Card.Body>
              <Row>
                <Col xs={12} md={4} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">Date</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(todayDate)}
                      onChange={(selectedDate) =>
                        setTodayDate(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            todayDate
                              ? formatDateToMMDDYYYY(todayDate)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={4} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">Begin time</Form.Label>

                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={
                        beginTime ? parseTimeStringToDate(beginTime) : null
                      }
                      onChange={setBeginTime}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={4} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">End time</Form.Label>

                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={endTime ? parseTimeStringToDate(endTime) : null}
                      onChange={setEndTime}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-2 mb-md-3">
            <Card.Body>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Participant</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      onChange={(e) => setParticipantsPresent(e.target.value)}
                      value={participantsPresent}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Presenting Problems
                    </Form.Label>
                    <CustomMultiSelectInput
                      multiselect={true}
                      className="w-100"
                      value={presentingProblems}
                      onChange={setPresentingProblems}
                      options={PRESENTING_PROBLEMS_OPTIONS}
                      isCreatable={true}
                      isDisabled={true}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Row>
            <Col xs={12} md={4} lg={4}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <Form.Label className="fw-bold">
                    Was ART Meeting conducted within 30 days
                  </Form.Label>
                  <div className="radio-inline">
                    <RadioMaker
                      name="staffingWithin30Days"
                      setValue={setStaffingWithin30Days}
                      value={"Yes"}
                      id={"staffingWithin30Days1"}
                      label={"Yes"}
                      checked={staffingWithin30Days}
                    />
                    <RadioMaker
                      name="staffingWithin30Days"
                      setValue={setStaffingWithin30Days}
                      value={"No"}
                      id={"staffingWithin30Days2"}
                      label={"No"}
                      checked={staffingWithin30Days}
                    />
                  </div>
                  {staffingWithin30Days === "No" && (
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        If ART Meeting was not conducted within 30 days why:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        onChange={(e) =>
                          setReasonForNoStaffingWithin30Days(e.target.value)
                        }
                        value={reasonForNoStaffingWithin30Days}
                      ></Form.Control>
                    </Form.Group>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <Form.Label className="fw-bold">
                    Was resident’s behavioral health treatment plan from the
                    clinic requested:
                  </Form.Label>
                  <div className="radio-inline">
                    <RadioMaker
                      name="clinicTreatmentPlanRequested"
                      setValue={setClinicTreatmentPlanRequested}
                      value={true}
                      id={"clinicTreatmentPlanRequested1"}
                      label={"Yes"}
                      checked={clinicTreatmentPlanRequested}
                    />
                    <RadioMaker
                      name="clinicTreatmentPlanRequested"
                      setValue={setClinicTreatmentPlanRequested}
                      value={false}
                      id={"clinicTreatmentPlanRequested2"}
                      label={"No"}
                      checked={clinicTreatmentPlanRequested}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <Form.Label className="fw-bold">
                    Was step down discussed
                  </Form.Label>
                  <div className="radio-inline">
                    <RadioMaker
                      name="stepDownDiscussed"
                      setValue={setStepDownDiscussed}
                      value={true}
                      id={"stepDownDiscussed1"}
                      label={"Yes"}
                      checked={stepDownDiscussed}
                    />
                    <RadioMaker
                      name="stepDownDiscussed"
                      setValue={setStepDownDiscussed}
                      value={false}
                      id={"stepDownDiscussed2"}
                      label={"No"}
                      checked={stepDownDiscussed}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card className="mb-2 mb-md-3">
            <Card.Body>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Were resident’s goals addressed
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      onChange={(e) => setGoalAddressed(e.target.value)}
                      value={goalsAddressed}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      ART Meeting Summary
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      onChange={(e) => setProgress(e.target.value)}
                      value={progress}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Barriers</Form.Label>
                    <div className="radio-inline">
                      {[
                        { label: "Cognitive", value: "Cognitive" },
                        { label: "Lack of Insight", value: "Lack of Insight" },
                        { label: "Financial", value: "Financial" },
                        {
                          label: "Refusal of Treatment/services",
                          value: "Refusal of Treatment/services",
                        },
                        { label: "Social Stigma", value: "Social Stigma" },
                        {
                          label: "Housing instability",
                          value: "Housing instability",
                        },
                        {
                          label: "Racial/Cultural discrimination",
                          value: "Racial/Cultural discrimination",
                        },
                        {
                          label: "Language/Communication barriers",
                          value: "Language/Communication barriers",
                        },
                        {
                          label: "Poor health literacy",
                          value: "Poor health literacy",
                        },
                        {
                          label: "Social determinants of health",
                          value: "Social determinants of health",
                        },
                        {
                          label:
                            "Limited availibility to Mental Health awareness & Education",
                          value:
                            "Limited availibility to Mental Health awareness & Education",
                        },
                        {
                          label:
                            "Lack of Mental Health professionals & Services",
                          value:
                            "Lack of Mental Health professionals & Services",
                        },
                        {
                          label:
                            "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations",
                          value:
                            "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations",
                        },
                        {
                          label: "Unresolved Trauma",
                          value: "Unresolved Trauma",
                        },
                        {
                          label: "Emerging Psychotic symptoms",
                          value: "Emerging Psychotic symptoms",
                        },
                        {
                          label: "Substance use cravings",
                          value: "Substance use cravings",
                        },
                        {
                          label: "Cognitive distortions",
                          value: "Cognitive distortions",
                        },
                        {
                          label: "Functional dependence",
                          value: "Functional dependence",
                        },
                        {
                          label: "Lack of coordination between care providers",
                          value: "Lack of coordination between care providers",
                        },
                        {
                          label: "Geographical barriers",
                          value: "Geographical barriers",
                        },
                        { label: "Transportation", value: "Transportation" },
                        { label: "Childcare", value: "Childcare" },
                        { label: "Time constraint", value: "Time constraint" },
                        { label: "Other", value: "Other" },
                      ].map((opt, idx) => (
                        <Form.Check
                          key={idx}
                          inline
                          label={opt.label}
                          type="checkbox"
                          id={`barrier-${idx}`}
                          checked={stepDownBarriers?.includes(opt.value)}
                          disabled
                        />
                      ))}
                      {stepDownBarriersBoolean && (
                        <BorderlessInput
                          value={stepDownBarriersOther}
                          setState={setStepDownBarriersOther}
                          placeholder=" "
                          disabled
                        />
                      )}
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="fw-bold">Comment </Form.Label>
                    <Form.Control
                      as="textarea"
                      className={`${!stepDownBarriersText && "hidePrint"}`}
                      type="text"
                      id="stepDownBarriersText"
                      value={stepDownBarriersText}
                      cols={130}
                      placeholder="Enter text."
                      disabled
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      If ART Meeting was not conducted please explain why
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      onChange={(e) =>
                        setExplanationForNoStaffing(e.target.value)
                      }
                      value={explanationForNoStaffing}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Recommendations</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      onChange={(e) => setRecommendations(e.target.value)}
                      value={recommendations}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Row>
                      <Col xs={12} lg={6}>
                        <Button
                          type="button"
                          className="theme-button"
                          onClick={() => {
                            if (profileUser.userType === ROLES.ADMIN) {
                              guardTyped(() => setAdminOpen(true));
                            } else {
                              guardTyped(() => setOpen(true));
                            }
                          }}
                        >
                          SAVED AND SIGNED
                        </Button>
                      </Col>
                      <Col xs={12} lg={6}>
                        {signatureFormat({
                          sign: staffSignature,
                          date: signedDate,
                          time: signedTime,
                          hoursFormat,
                        })}

                        {signatureFormat({
                          sign: adminSignature,
                          date: adminDateSigned,
                          time: adminSignedTime,
                          hoursFormat,
                        })}
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <div className="signature-sections-inline mt-3">
            <SignatureNamesPanel
              signatures={signatures}
              onUpdate={updateSignature}
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
            {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): hidden per client request. See documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */}
            {/* <SignatureSection role="bht" label="BHT Signature" variant="green" signature={signatures.bht} onUpdate={updateSignature} formHasTyped={hasTypedInForm} onClearAllTyped={clearAllTyped} /> */}
            {/* <SignatureSection role="bhp" label="BHP Signature" variant="purple" signature={signatures.bhp} onUpdate={updateSignature} externalName formHasTyped={hasTypedInForm} onClearAllTyped={clearAllTyped} /> */}
            {/* <SignatureSection role="admin" label="Admin Signature" variant="pink" signature={signatures.admin} onUpdate={updateSignature} externalName formHasTyped={hasTypedInForm} onClearAllTyped={clearAllTyped} /> */}
            <SignatureSection
              role="resident"
              label="Resident/Representative Signature"
              variant="blue"
              signature={signatures.resident}
              onUpdate={updateSignature}
              signerNameOverride={residentName || ""}
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
            <SignatureSection
              role="witness"
              label="Witness Signature"
              variant="yellow"
              signature={signatures.witness}
              onUpdate={updateSignature}
              externalName
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
          </div>
          <Card className="mb-2 mb-md-3 mt-3">
            <Card.Body>
              <Row>
                <Col>
                  <Form.Label className="fw-bold">Signers</Form.Label>
                  <MultiEmployee
                    setValue={setSigners}
                    value={signers}
                    alsoResident
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Row>
            <Col>
              <div className="employee-btn-joiner mt-3 mt-md-5">
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
                  disabled={
                    witnessIncomplete
                      ? true
                      : profileUser?.userType === ROLES.ADMIN
                        ? false
                        : staffSignature?.length === 0
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
  Wcomponenet: CreateStaffNote,
});
