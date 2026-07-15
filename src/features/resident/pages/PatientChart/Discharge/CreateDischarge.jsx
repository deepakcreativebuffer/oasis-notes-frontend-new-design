/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { createForRole, patientChartService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import {
  DISCHARGE_PLANNING_OPTIONS,
  PRESENTING_PROBLEMS_OPTIONS,
} from "@/features/shared/constants";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { BorderlessInput } from "@/utils/Makers";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
import { ROLES } from "@/features/shared/constants";
const CreateDischarge = () => {
  const navigate = useNavigate();
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [data, setData] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [dateOfAdmission, setDateOfAdmission] = useState("");
  const [dateOfDischarge, setDateOfDischarge] = useState("");
  const [presentingProblems, setPresentingProblems] = useState([]);
  const [treatmentProvided, setTreatmentProvided] = useState("");
  const [progress, setProgress] = useState("");
  const [medicationUponDischarge, setMedicationUponDischarge] = useState("");
  const [fundsPropertiesUponDischarge, setFundsPropertiesUponDischarge] =
    useState("");
  const [reasonForDischarge, setReasonForDischarge] = useState("");
  const [agreeWithDischarge, setAgreeWithDischarge] = useState(false);
  const [disagreeWithDischarge, setDisagreeWithDischarge] = useState(false);
  const [patientGuardianSignature, setPatientGuardianSignature] = useState("");
  const [patientGuardianSignatureDate, setPatientGuardianSignatureDate] =
    useState("");
  const [staffNameAndTitle, setStaffNameAndTitle] = useState("");
  const [staffSignature, setStaffSignature] = useState("");
  const [staffSignatureDate, setStaffSignatureDate] = useState("");
  const [bhpNameAndCredentials, setBhpNameAndCredentials] = useState("");
  const [bhpSignature, setBhpSignature] = useState("");
  const [bhpSignatureDate, setBhpSignatureDate] = useState("");
  const [open3, setOpen3] = useState(false);
  const [staffTime, setStaffTime] = useState("");
  const [bhpTime, setBhpTime] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [patientGuardianSignatureTime, setPatientGaurdianSignatureTime] =
    useState("");
  const [signers, setSigners] = useState([]);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [openAdmin, setAdminOpen] = useState(false);
  const { signatures, updateSignature } = useSignatures();
  const { guardTyped, dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });
  const hasTypedInForm = !!bhpSignature || !!adminSignature;
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
    setBhpSignature("");
    setBhpSignatureDate("");
    setBhpTime("");
    setAdminSignature("");
    setAdminDateSigned("");
    setAdminSignedTime("");
    setOpen3(false);
    setAdminOpen(false);
  };
  const [modeOfTransportation, setModeOfTransportation] = useState([]);
  const [modeOfTransportationOther, setModeOfTransportationOther] =
    useState("");
  useEffect(() => {
    if (patientId) {
      patientChartService.dischargeSummary.getByPatientId(patientId, {
        setResponse: setData,
        setLoading,
      });
    }
  }, [patientId, profile?.userType]);

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
      setDateOfDischarge(populateData?.dateOfDischarge);
      setTreatmentProvided(populateData?.treatmentProvided);
      setProgress(populateData?.progress);
      setMedicationUponDischarge(populateData?.medicationUponDischarge);
      setFundsPropertiesUponDischarge(
        populateData?.fundsPropertiesUponDischarge,
      );
      setReasonForDischarge(populateData?.reasonForDischarge);
      setPatientGuardianSignature(populateData?.patientGuardianSignature);
      setPatientGuardianSignatureDate(
        populateData?.patientGuardianSignatureDate,
      );
      setStaffNameAndTitle(populateData?.staffNameAndTitle);
      setStaffSignature(populateData?.staffSignature);
      setStaffSignatureDate(populateData?.staffSignatureDate);
      setStaffTime(populateData?.staffSignatureTime);
    } else {
      setDateOfDischarge("");
      setTreatmentProvided("");
      setProgress("");
      setMedicationUponDischarge("");
      setFundsPropertiesUponDischarge("");
      setReasonForDischarge("");
      setPatientGuardianSignature("");
      setPatientGuardianSignatureDate("");
      setStaffNameAndTitle("");
      setStaffSignature("");
      setStaffSignatureDate("");
      setStaffTime("");
    }
  }, [data, patientId, profile._id]);
  const initialFormData = {
    patientId,
    clientName,
    dateOfBirth,
    dateOfAdmission,
    dateOfDischarge,
    presentingProblems: presentingProblems.map((v) =>
      typeof v === "object" ? v.value : v,
    ),
    presentingIssue: presentingProblems
      .map((v) => (typeof v === "object" ? v.value : v))
      .join(", "),
    treatmentProvided,
    progress,
    diagnosis,
    medicationUponDischarge,
    fundsPropertiesUponDischarge,
    reasonForDischarge,
    staffNameAndTitle,
    bhpNameAndCredentials,
    saveAsDraft,
    patientGuardianSignature,
    patientGuardianSignatureDate,
    patientGuardianSignatureTime,
    staffSignature,
    staffSignatureDate,
    staffSignatureTime: staffTime,
    bhpSignature,
    bhpSignatureDate,
    bhpSignatureTime: bhpTime,
    ahcccsId,
    modeOfTransportation,
    modeOfTransportationOther,
    agreeWithDischarge,
    disagreeWithDischarge,
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
      profile?.userType === ROLES.ADMIN,
      "admin/createDischargeSummary",
      "employee/createDischargeSummary",
      initialFormData,
      {
        setLoading,
        navigate,
        successMsg: "Discharge Summary Created Successfully!",
      },
    );
  };
  useEffect(() => {
    if (patientDetail) {
      setDateOfBirth(patientDetail?.dateOfBirth);
      setAhcccsId(patientDetail?.ahcccsId);
      setDateOfAdmission(patientDetail?.admitDate);
      setDiagnosis(patientDetail?.diagnosis);

      const pp = patientDetail?.presentingProblems || [];
      setPresentingProblems(
        pp.map((s) => (typeof s === "string" ? { label: s, value: s } : s)),
      );
    }
  }, [patientDetail]);
  const handleCheckboxChangeTransportation = (transport) => {
    if (transport === "Other") {
      setModeOfTransportation((prevState) => {
        if (prevState.includes("Other")) {
          return prevState.filter((item) => item !== "Other");
        } else {
          return [...prevState, "Other"];
        }
      });
    } else {
      setModeOfTransportation((prevState) => {
        if (prevState.includes(transport)) {
          return prevState.filter((item) => item !== transport);
        } else {
          return [...prevState, transport];
        }
      });
    }
  };
  return (
    <>
      {typedGuardDialog}
      <AddSignature
        show={open3}
        setValue={(sign) => {
          setBhpSignature(sign);
          // setStaffSignature(sign);
        }}
        setTime={(time) => {
          setBhpTime(time);
          // setStaffTime(time);
        }}
        setDate={(date) => {
          setBhpSignatureDate(date);
          // setStaffSignatureDate(date);
        }}
      />
      <AddSignature
        show={openAdmin}
        setValue={setAdminSignature}
        setDate={setAdminDateSigned}
        setTime={setAdminSignedTime}
      />
      <NavWrapper title={"Discharge Summary"} isArrow={true} />
      <Container>
        <Form onSubmit={submitHandler}>
          <PatientComponent
            MainPatientId={setPatientId}
            setWholeData={setPatientDetail}
            MainResidentName={setClientName}
            className="mb-2"
          />
          <Card className="mb-2 mb-md-3">
            <Card.Body>
              <Row>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      onChange={(e) => {
                        setAhcccsId(e.target.value);
                      }}
                      value={ahcccsId}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Diagnosis (specify if new or continuing)
                    </Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      onChange={(e) => {
                        setDiagnosis(e.target.value);
                      }}
                      value={diagnosis}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">DOB</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(dateOfBirth)}
                      disabled
                      onChange={(selectedDate) =>
                        setDateOfBirth(selectedDate?.toDateString())
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
                <Col xs={12} md={6} lg={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">Admit Date</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(dateOfAdmission)}
                      disabled
                      onChange={(selectedDate) =>
                        setDateOfAdmission(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            dateOfAdmission
                              ? formatDateToMMDDYYYY(dateOfAdmission)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">
                      Date of Discharge
                    </Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(dateOfDischarge)}
                      onChange={(selectedDate) =>
                        setDateOfDischarge(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            dateOfDischarge
                              ? formatDateToMMDDYYYY(dateOfDischarge)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-2 mb-md-3">
            <Card.Body>
              <Row>
                <Col xs={12} md={12} lg={12}>
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
                <Col xs={12} md={12} lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Treatment Provided
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={(e) => setTreatmentProvided(e.target.value)}
                      value={treatmentProvided}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={12} lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Progress</Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={(e) => setProgress(e.target.value)}
                      value={progress}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={12} lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Medication Upon Discharge
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={(e) =>
                        setMedicationUponDischarge(e.target.value)
                      }
                      value={medicationUponDischarge}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={12} lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Funds/Properties Upon Discharge
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={(e) =>
                        setFundsPropertiesUponDischarge(e.target.value)
                      }
                      value={fundsPropertiesUponDischarge}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={12} lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Reason for Discharge
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={(e) => setReasonForDischarge(e.target.value)}
                      value={reasonForDischarge}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Card className="mb-3">
                    <Card.Body>
                      <Row>
                        <Col xs={12}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              Discharge planning and After care planning
                            </Form.Label>
                            <div className="radio-inline">
                              {DISCHARGE_PLANNING_OPTIONS.map((opt, idx) => (
                                <Form.Check
                                  key={idx}
                                  inline
                                  label={opt}
                                  type="checkbox"
                                  id={`create-discharge-planning-${idx}`}
                                  checked={(
                                    patientDetail?.dischargePlanningAndAfterCarePlanning ??
                                    []
                                  ).includes(opt)}
                                  disabled
                                />
                              ))}
                              {(
                                patientDetail?.dischargePlanningAndAfterCarePlanning ??
                                []
                              ).includes("Other") && (
                                <BorderlessInput
                                  value={
                                    patientDetail?.dischargePlanningAndAfterCarePlanningOther ||
                                    ""
                                  }
                                  placeholder=""
                                  disabled
                                />
                              )}
                            </div>
                          </Form.Group>

                          <Form.Group className="mt-3">
                            <Form.Label className="fw-bold">
                              Additional discharge planning details
                            </Form.Label>
                            <div>
                              <Form.Check
                                inline
                                label="Yes"
                                type="checkbox"
                                id="create-additional-discharge-yes"
                                checked={
                                  patientDetail?.isAdditionalDischargePlanningChecked ===
                                  true
                                }
                                disabled
                              />{" "}
                              <Form.Check
                                inline
                                label="No"
                                type="checkbox"
                                id="create-additional-discharge-no"
                                checked={
                                  patientDetail?.isAdditionalDischargePlanningChecked ===
                                  false
                                }
                                disabled
                              />
                            </div>
                          </Form.Group>
                          {patientDetail?.isAdditionalDischargePlanningChecked && (
                            <Form.Group className="mt-3">
                              <Form.Label className="fw-bold">
                                Specify ( If Others )
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                className={`${!patientDetail?.additionalDischargePlanningComment && "hidePrint"}`}
                                value={
                                  patientDetail?.additionalDischargePlanningComment ||
                                  ""
                                }
                                cols={130}
                                placeholder="Type Here....."
                                disabled
                              ></Form.Control>
                            </Form.Group>
                          )}
                          <Form.Group className="mt-3">
                            <Form.Label className="fw-bold">
                              Readiness for discharge{" "}
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              className={`${!patientDetail?.readinessDischarge && "hidePrint"}`}
                              value={patientDetail?.readinessDischarge || ""}
                              cols={130}
                              placeholder="Type Here....."
                              disabled
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  {/* Transition Planning Section */}
                  <Card className="mb-3">
                    <Card.Body>
                      <Row>
                        <Col xs={12}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              Transition planning and recommendations for
                              further programs upon discharge
                            </Form.Label>
                            <div className="radio-inline">
                              <Form.Check
                                inline
                                label="PHP"
                                type="checkbox"
                                id="create-transition-php"
                                checked={(
                                  patientDetail?.recommendationsForFurtherPrograms ??
                                  []
                                ).includes("PHP")}
                                disabled
                              />
                              <Form.Check
                                inline
                                label="IOP"
                                type="checkbox"
                                id="create-transition-iop"
                                checked={(
                                  patientDetail?.recommendationsForFurtherPrograms ??
                                  []
                                ).includes("IOP")}
                                disabled
                              />
                              <Form.Check
                                inline
                                label="Sober living"
                                type="checkbox"
                                id="create-transition-sober"
                                checked={(
                                  patientDetail?.recommendationsForFurtherPrograms ??
                                  []
                                ).includes("Sober living")}
                                disabled
                              />
                              <Form.Check
                                inline
                                label="Home"
                                type="checkbox"
                                id="create-transition-home"
                                checked={(
                                  patientDetail?.recommendationsForFurtherPrograms ??
                                  []
                                ).includes("Home")}
                                disabled
                              />
                              <Form.Check
                                inline
                                label="Flex Care 23.9"
                                type="checkbox"
                                id="create-transition-flex239"
                                checked={(
                                  patientDetail?.recommendationsForFurtherPrograms ??
                                  []
                                ).includes("Flex Care 23.9")}
                                disabled
                              />
                              <Form.Check
                                inline
                                label="Flex Care 16"
                                type="checkbox"
                                id="create-transition-flex16"
                                checked={(
                                  patientDetail?.recommendationsForFurtherPrograms ??
                                  []
                                ).includes("Flex Care 16")}
                                disabled
                              />
                              <Form.Check
                                inline
                                label="Flex Care 8"
                                type="checkbox"
                                id="create-transition-flex8"
                                checked={(
                                  patientDetail?.recommendationsForFurtherPrograms ??
                                  []
                                ).includes("Flex Care 8")}
                                disabled
                              />
                              <Form.Check
                                inline
                                label="ABHTH"
                                type="checkbox"
                                id="create-transition-flex8"
                                checked={(
                                  patientDetail?.recommendationsForFurtherPrograms ??
                                  []
                                ).includes("ABHTH")}
                                disabled
                              />
                              <Form.Check
                                inline
                                label="Transition to ALTC"
                                type="checkbox"
                                id="create-transition-flex8"
                                checked={(
                                  patientDetail?.recommendationsForFurtherPrograms ??
                                  []
                                ).includes("Transition to ALTC")}
                                disabled
                              />
                              <Form.Check
                                inline
                                label="Other"
                                type="checkbox"
                                id="create-transition-other"
                                checked={(
                                  patientDetail?.recommendationsForFurtherPrograms ??
                                  []
                                ).includes("Other")}
                                disabled
                              />
                              {(
                                patientDetail?.recommendationsForFurtherPrograms ??
                                []
                              ).includes("Other") && (
                                <BorderlessInput
                                  value={
                                    patientDetail?.recommendationsForFurtherProgramsOther ||
                                    ""
                                  }
                                  placeholder=""
                                  disabled
                                />
                              )}
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  {/* After care and Transition planning / Community Resources */}
                  <Card className="mb-3">
                    <Card.Body>
                      <Row>
                        <Col xs={12}>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              After care and Transition planning / Community
                              Resources
                            </Form.Label>
                            <div className="radio-inline">
                              <Form.Check
                                inline
                                label="National suicide hotline 988 or 1-800-273-8255"
                                type="checkbox"
                                id="create-aftercare-suicide-hotline"
                                checked={(
                                  patientDetail?.afterCareAndTransitionPlanning ??
                                  []
                                ).includes(
                                  "National suicide hotline 988 or 1-800-273-8255",
                                )}
                                disabled
                              />
                              <Form.Check
                                inline
                                label="Emergency care 911"
                                type="checkbox"
                                id="create-aftercare-emergency"
                                checked={(
                                  patientDetail?.afterCareAndTransitionPlanning ??
                                  []
                                ).includes("Emergency care 911")}
                                disabled
                              />
                              <Form.Check
                                inline
                                label="24-Hour crisis in Maricopa County 602-222-9444"
                                type="checkbox"
                                id="create-aftercare-crisis"
                                checked={(
                                  patientDetail?.afterCareAndTransitionPlanning ??
                                  []
                                ).includes(
                                  "24-Hour crisis in Maricopa County 602-222-9444",
                                )}
                                disabled
                              />
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      Mode of Transportation
                    </Form.Label>
                    <div className="radio-inline">
                      <Form.Check
                        inline
                        label="Transported by referring facility"
                        type="checkbox"
                        id="TransportedReferringFacility"
                        checked={modeOfTransportation?.includes(
                          "Transported by referring facility",
                        )}
                        onChange={() =>
                          handleCheckboxChangeTransportation(
                            "Transported by referring facility",
                          )
                        }
                      />
                      <Form.Check
                        inline
                        label="Transported by recieving facility"
                        type="checkbox"
                        id="TransportedRecievingFacility"
                        checked={modeOfTransportation?.includes(
                          "Transported by recieving facility",
                        )}
                        onChange={() =>
                          handleCheckboxChangeTransportation(
                            "Transported by recieving facility",
                          )
                        }
                      />
                      <Form.Check
                        inline
                        label="Transported by case manager"
                        type="checkbox"
                        id="TransportedCaseManager"
                        checked={modeOfTransportation?.includes(
                          "Transported by case manager",
                        )}
                        onChange={() =>
                          handleCheckboxChangeTransportation(
                            "Transported by case manager",
                          )
                        }
                      />
                      <Form.Check
                        inline
                        label="Non Emergency Tranportation"
                        type="checkbox"
                        id="NonEmergencyTranportation"
                        checked={modeOfTransportation?.includes(
                          "Non Emergency Tranportation",
                        )}
                        onChange={() =>
                          handleCheckboxChangeTransportation(
                            "Non Emergency Tranportation",
                          )
                        }
                      />
                      <Form.Check
                        inline
                        label="Transported by family"
                        type="checkbox"
                        id="TransportedByFamily"
                        checked={modeOfTransportation?.includes(
                          "Transported by family",
                        )}
                        onChange={() =>
                          handleCheckboxChangeTransportation(
                            "Transported by family",
                          )
                        }
                      />{" "}
                      <Form.Check
                        inline
                        label="Transported by Uber/Lyft"
                        type="checkbox"
                        id="TransportedByUber/Lyft"
                        checked={modeOfTransportation?.includes(
                          "Transported by Uber/Lyft",
                        )}
                        onChange={() =>
                          handleCheckboxChangeTransportation(
                            "Transported by Uber/Lyft",
                          )
                        }
                      />
                      <Form.Check
                        inline
                        label="Transported by EMS"
                        type="checkbox"
                        id="TransportedByEMS"
                        checked={modeOfTransportation?.includes(
                          "Transported by EMS",
                        )}
                        onChange={() =>
                          handleCheckboxChangeTransportation(
                            "Transported by EMS",
                          )
                        }
                      />
                      <Form.Check
                        inline
                        label="Other"
                        type="checkbox"
                        checked={modeOfTransportation?.includes("Other")}
                        onChange={() =>
                          handleCheckboxChangeTransportation("Other")
                        }
                        id="transportationOther"
                      />
                      {modeOfTransportation?.includes("Other") && (
                        <BorderlessInput
                          value={modeOfTransportationOther}
                          setState={setModeOfTransportationOther}
                          placeholder=" "
                        />
                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-2 mb-md-3">
            <Card.Body>
              <Row>
                <Col xs={12} className="my-3">
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      label="Resident/Representative agree with the discharge plan summary"
                      checked={agreeWithDischarge}
                      onChange={(e) => {
                        setAgreeWithDischarge(e.target.checked);
                        if (e.target.checked) setDisagreeWithDischarge(false);
                      }}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Resident/Representative disagree with the discharge summary"
                      checked={disagreeWithDischarge}
                      onChange={(e) => {
                        setDisagreeWithDischarge(e.target.checked);
                        if (e.target.checked) setAgreeWithDischarge(false);
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Row>
            <Col xs={12} md={12} lg={12}>
              <div className="custome-cloud-btn">
                <div className="btns">
                  <Button
                    type="button"
                    onClick={() => {
                      if (profile.userType === ROLES.ADMIN) {
                        guardTyped(() => setAdminOpen(true));
                      } else {
                        guardTyped(() => setOpen3(true));
                      }
                    }}
                    className="theme-button"
                  >
                    {" "}
                    SAVED AND SIGNED
                  </Button>
                </div>
                <div>
                  {signatureFormat({
                    sign: bhpSignature,
                    date: bhpSignatureDate,
                    time: bhpTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: adminSignature,
                    date: adminDateSigned,
                    time: adminSignedTime,
                    hoursFormat,
                  })}
                </div>
              </div>
            </Col>
          </Row>
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
              signerNameOverride={clientName || ""}
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
          <Row className="mb-2 mb-md-3 mt-3">
            <Col xs={12} md={12} lg={12}>
              <Form.Group>
                <Form.Label className="fw-bold">Signers</Form.Label>
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
              <div className="employee-btn-joiner mt-3 mt-md-4">
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
                  /* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): submit gate
                 reverted + Witness coupled-pair (2026-04-26). See
                 documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */ disabled={
                    witnessIncomplete
                      ? true
                      : profile.userType === ROLES.ADMIN
                        ? false
                        : bhpSignature?.length === 0 &&
                          staffSignature?.length === 0
                  }
                  /* TEMP-DISABLED-BHP-BHT-ADMIN: original gate
              disabled={
                !allPenSigsHaveNames
                  ? true
                  : profile.userType === ROLES.ADMIN
                    ? false
                    : bhpSignature?.length === 0 && !hasAnyPenSig
              }
              */
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
  Wcomponenet: CreateDischarge,
});
