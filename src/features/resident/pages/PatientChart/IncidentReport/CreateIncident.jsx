/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col, Card, Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { BorderlessInput, CheckBoxMaker } from "@/utils/Makers";
import {
  incidentOptions,
  levelSeverityOptions,
} from "@/features/shared/constants";
import {
  createForRole,
  getData,
  patientChartService,
} from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  AddSignature,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiPatients from "@/features/shared/ui/Search/MultiPatients";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
const CreateIncident = () => {
  const navigate = useNavigate();
  const profileUser = useSelector(userProfile);
  const hoursFormat = profileUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState("");
  const [dateOfIncident, setDateOfIncident] = useState("");
  const [employeesInvolved, setEmployeesInvolved] = useState([]);
  const [residentsInvolved, setResidentsInvolved] = useState([]);
  const [personObservingReporting, setPersonObservingReporting] = useState("");
  const [incidents, setIncidents] = useState([]);
  const [severityLevel, setSeverityLevel] = useState([]);
  const [eventDetails, setEventDetails] = useState("");
  const [medicationErrorsMissedDose, setMedicationErrorsMissedDose] =
    useState(true);
  const [
    medicationErrorsRefusedMedication,
    setMedicationErrorsRefusedMedication,
  ] = useState(false);
  const [medicationErrorsWrongClient, setMedicationErrorsWrongClient] =
    useState(false);
  const [medicationErrorsWrongTime, setMedicationErrorsWrongTime] =
    useState(false);
  const [medicationErrorsWrongMed, setMedicationErrorsWrongMed] =
    useState(false);
  const [medicationErrorsNone, setMedicationErrorsNone] = useState(false);
  const [actionsTakenSenttoERHospital, setActionsTakenSenttoERHospital] =
    useState(false);
  const [actionsTakenFirstAid, setActionsTakenFirstAid] = useState(false);
  const [
    actionsTakenNoMedicalCareRequired,
    setActionsTakenNoMedicalCareRequired,
  ] = useState(false);
  const [careRefused, setCareRefused] = useState(false);
  const [
    actionsTakenFireDepartmentCalled,
    setActionsTakenFireDepartmentCalled,
  ] = useState(false);
  const [actionsTakenPoliceCalled, setActionsTakenPoliceCalled] =
    useState(true);
  const [
    actionsTakenReferredtoAdministratorRiskManagement,
    setActionsTakenReferredtoAdministratorRiskManagement,
  ] = useState(false);
  const [
    actionsTakenMaintenanceCalledWorkOrderCompleted,
    setActionsTakenMaintenanceCalledWorkOrderCompleted,
  ] = useState(false);
  const [actionsTakenOther, setActionsTakenOther] = useState(false);
  const [actionsTakenOtherComment, setActionTakerOtherComment] = useState("");
  const [abuseNeglectInvolvedifYes, setAbuseNeglectInvolvedifYes] =
    useState("");
  const [notificationsFamily, setNotificationsFamily] = useState(false);
  const [notificationsGuardian, setNotificationsGuardian] = useState(false);
  const [notificationsCaseManager, setNotificationsCaseManager] =
    useState(false);
  const [reportCompletedBy, setReportCompletedBy] = useState("");
  const [modeEmail, setModeEmail] = useState(false);
  const [modePhoneCall, setModePhoneCall] = useState(false);
  const [modeInPerson, setModeInPerson] = useState(false);
  const [modeOther, setModeOther] = useState(false);
  const [savedSignedPartA, setSavedSignaturePartA] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [employees, setEmployees] = useState({});
  const [signedDate, setSignedDate] = useState("");
  const [signedTime, setSignedTime] = useState("");
  const [notificationTime, setNotificationTime] = useState("");
  const [notificationTimeGuardian, setNotificationTimeGuardian] = useState("");
  const [notificationTimeCaseManager, setNotificationTimeCaseManager] =
    useState("");
  const [notificationDate, setNotificationDate] = useState("");
  const [notificationDateGuardian, setNotificationDateGuardian] = useState("");
  const [notificationDateCaseManager, setNotificationDateCaseManager] =
    useState("");
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [beginTime, setBeginTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [abuseNeglectInvolved, setAbuseNeglectInvolved] = useState(false);
  const [stateContacted, setStateContacted] = useState(false);
  const [signers, setSigners] = useState([]);
  const [investigationOfInvestment, setInvestigationOfInvestment] =
    useState("");
  const [recommendationAndActions, setRecommendationAndActions] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [part, setPart] = useState(1);
  const [aPartId, setAPartId] = useState("");
  const [data, setData] = useState("");
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [notificationsOther, setNotificationsOther] = useState(false);
  const [notificationsOther2, setNotificationsOther2] = useState(false);
  const [notificationDateOther, setNotificationDateOther] = useState("");
  const [notificationDateOther2, setNotificationDateOther2] = useState("");
  const [notificationTimeOther, setNotificationTimeOther] = useState("");
  const [notificationTimeOther2, setNotificationTimeOther2] = useState("");
  const [otherNotificationValue, setOtherNotificationValue] = useState("");
  const [other2NotificationValue, setOther2NotificationValue] = useState("");

  const { signatures, updateSignature } = useSignatures();
  const { guardTyped, dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });

  const hasTypedInForm = !!savedSignedPartA || !!adminSignature;

  const bhtNamePresent = !!(
    signatures?.bht?.name &&
    signatures.bht.name.trim() &&
    signatures.bht.name.trim() !== "undefined undefined"
  );
  const bhtSigPresent = !!signatures?.bht?.rawSignatureImage;
  const bhtIncomplete = bhtSigPresent && !bhtNamePresent && !hasTypedInForm;

  const bhpNamePresent = !!(
    signatures?.bhp?.name &&
    signatures.bhp.name.trim() &&
    signatures.bhp.name.trim() !== "undefined undefined"
  );
  const bhpSigPresent = !!signatures?.bhp?.rawSignatureImage;
  const bhpIncomplete = bhpSigPresent && !bhpNamePresent && !hasTypedInForm;

  const witnessNamePresent = !!(
    signatures?.witness?.name &&
    signatures.witness.name.trim() &&
    signatures.witness.name.trim() !== "undefined undefined"
  );
  const witnessSigPresent = !!signatures?.witness?.rawSignatureImage;
  const witnessRoleIncomplete =
    witnessSigPresent && !witnessNamePresent && !hasTypedInForm;

  const witnessIncomplete =
    bhtIncomplete || bhpIncomplete || witnessRoleIncomplete;

  const clearAllTyped = () => {
    setSavedSignaturePartA("");
    setSignedDate("");
    setSignedTime("");
    setAdminSignature("");
    setAdminDateSigned("");
    setAdminSignedTime("");
  };
  useEffect(() => {
    const part = searchParams.get("part");
    setPart(part || 1);
    setSavedSignaturePartA("");
    setSignedDate("");
    setSignedTime("");
    setSigners([]);
    setOpen(false);
  }, [searchParams, setSearchParams]);
  useEffect(() => {
    if (patientId) {
      patientChartService.incidentReport.getByPatientId(patientId, {
        setResponse: setData,
        setLoading,
      });
    }
  }, [patientId, profileUser?.userType]);
  useEffect(() => {
    let populateData;
    if (Array.isArray(data?.data?.docs)) {
      populateData = data?.data?.docs?.find((item) => {
        return (
          item?.patientId?._id === patientId || item?.patientId === patientId
        );
      });
    }
    if (populateData) {
      setDateOfIncident(populateData?.dateOfIncident);
      setBeginTime(populateData?.beginTime);
      setEndTime(populateData?.endTime);
      if (populateData?.employeesInvolved) {
        setEmployeesInvolved([]);
        const uniqueDate = new Set([...populateData?.employeesInvolved]);
        const uniqueDateArr = Array.from(uniqueDate)?.map((i) => {
          if (!i) return null;
          return {
            label: fetchPaitentName(i) || "Unknown",
            value: i?._id || "N/A",
          };
        });
        setEmployeesInvolved(uniqueDateArr);
      }
      if (populateData?.residentsInvolved) {
        setResidentsInvolved([]);
        const uniqueDate = new Set([...populateData?.residentsInvolved]);
        const uniqueDateArr = Array.from(uniqueDate)?.map((i) => {
          if (!i) return null;
          return {
            label: fetchPaitentName(i) || "Unknown",
            value: i?._id || "N/A",
          };
        });
        setResidentsInvolved(uniqueDateArr);
      }
      if (populateData?.incidents) {
        setIncidents([]);
        const uniqueDate = new Set([...populateData?.incidents]);
        const uniqueDateArr = Array.from(uniqueDate)?.map((i) =>
          typeof i === "object" && i.label && i.value
            ? i // If it's already an object with label and value, return it as is
            : {
                label: i || "Unknown Severity",
                value: i || "N/A",
              },
        );
        setIncidents(uniqueDateArr);
      }
      if (populateData?.levelOfSeverity) {
        setSeverityLevel([]);
        const uniqueDate = new Set([...populateData?.levelOfSeverity]);
        const uniqueDateArr = Array.from(uniqueDate)?.map((i) =>
          typeof i === "object" && i.label && i.value
            ? i // If it's already an object with label and value, return it as is
            : {
                label: i || "Unknown Severity",
                value: i || "N/A",
              },
        );
        setSeverityLevel(uniqueDateArr);
      }
      setPersonObservingReporting(populateData?.personObservingReporting);
      setEventDetails(populateData?.eventDetails);
      setMedicationErrorsMissedDose(populateData?.medicationErrorsMissedDose);
      setMedicationErrorsRefusedMedication(
        populateData?.medicationErrorsRefusedMedication,
      );
      setMedicationErrorsWrongClient(populateData?.medicationErrorsWrongClient);
      setMedicationErrorsWrongTime(populateData?.medicationErrorsWrongTime);
      setMedicationErrorsWrongMed(populateData?.medicationErrorsWrongMed);
      setActionsTakenSenttoERHospital(
        populateData?.actionsTakenSenttoERHospital,
      );
      setActionsTakenFirstAid(populateData?.actionsTakenNoMedicalCareRequired);
      setCareRefused(populateData?.CareRefused);
      setActionsTakenFireDepartmentCalled(
        populateData?.actionsTakenFireDepartmentCalled,
      );
      setActionsTakenPoliceCalled(populateData?.actionsTakenPoliceCalled);
      setActionsTakenReferredtoAdministratorRiskManagement(
        populateData?.actionsTakenReferredtoAdministratorRiskManagement,
      );
      setActionsTakenMaintenanceCalledWorkOrderCompleted(
        populateData?.actionsTakenMaintenanceCalledWorkOrderCompleted,
      );
      setActionsTakenOther(populateData?.actionsTakenOther);
      setActionTakerOtherComment(populateData?.actionsTakenOtherComment);
      setAbuseNeglectInvolved(populateData?.abuseNeglectInvolved);
      setStateContacted(populateData?.stateContacted);
      setAbuseNeglectInvolvedifYes(populateData?.abuseNeglectInvolvedifYes);
      setNotificationsFamily(populateData?.notificationsFamily);
      setNotificationsGuardian(populateData?.notificationsGuardian);
      setNotificationsCaseManager(populateData?.notificationsCaseManager);
      setModeEmail(populateData?.modeEmail);
      setModePhoneCall(populateData?.modePhoneCall);
      setModeInPerson(populateData?.modeInPerson);
      setModeOther(populateData?.modeOther);
      setNotificationTime(populateData?.notificationTime);
      setNotificationTimeGuardian(populateData?.notificationTimeGuardian);
      setNotificationTimeCaseManager(populateData?.notificationTimeCaseManager);
      setNotificationDate(populateData?.notificationDate);
      setNotificationDateGuardian(populateData?.notificationDateGuardian);
      setNotificationDateCaseManager(populateData?.notificationDateCaseManager);
      setInvestigationOfInvestment(populateData?.investigationOfInvestment);
      setReportCompletedBy(populateData?.reportCompletedBy);
      setFollowUp(populateData?.followUp);
      setRecommendationAndActions(populateData?.recommendationAndActions);
    } else {
    }
  }, [data, patientId, profileUser._id]);
  const payloadA = {
    beginTime,
    endTime,
    patientId,
    dateOfIncident,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    employeesInvolved: employeesInvolved?.map((i) => i.value),
    residentsInvolved: residentsInvolved?.map((i) => i.value),
    personObservingReporting,
    incidents: incidents?.map((i) => i.value),
    levelOfSeverity: severityLevel?.map((i) => i.value),
    eventDetails,
    medicationErrorsMissedDose,
    medicationErrorsRefusedMedication,
    medicationErrorsWrongClient,
    medicationErrorsWrongTime,
    medicationErrorsWrongMed,
    actionsTakenSenttoERHospital,
    actionsTakenFirstAid,
    actionsTakenNoMedicalCareRequired,
    careRefused,
    actionsTakenFireDepartmentCalled,
    actionsTakenPoliceCalled,
    actionsTakenReferredtoAdministratorRiskManagement,
    actionsTakenMaintenanceCalledWorkOrderCompleted,
    actionsTakenOther,
    actionsTakenOtherComment,
    abuseNeglectInvolved,
    abuseNeglectInvolvedifYes,
    stateContacted,
    notificationsFamily,
    notificationsCaseManager,
    notificationsGuardian,
    notificationsOther,
    otherNotificationValue,
    notificationsOther2,
    other2NotificationValue,
    notificationDateOther,
    notificationDateOther2,
    notificationTimeOther,
    notificationTimeOther2,
    reportCompletedBy,
    modeEmail,
    modePhoneCall,
    modeInPerson,
    modeOther,
    savedSignedPartA,
    medicationErrorsNone,
    signedDatePartA: signedDate,
    signedTimePartA: signedTime,
    notificationTime,
    notificationTimeGuardian,
    notificationTimeCaseManager,
    notificationDate,
    notificationDateGuardian,
    notificationDateCaseManager,
    saveAsDraft,
    signers: signers?.map((signer) => ({
      signerId: signer.value,
      name: signer.label,
      signature: "",
      dateSigned: "",
      signedTime: "",
    })),
    followUp,
    recommendationAndActions,
    investigationOfInvestment,
    signatures,
  };
  const submitHandlerA = async (e) => {
    e.preventDefault();
    const res = await createForRole(
      profileUser?.userType === ROLES.ADMIN,
      "admin/create-incident-report",
      "employee/create-incident-report",
      payloadA,
      { setLoading, navigate, successMsg: "Created" },
    );
  };
  useEffect(() => {
    getData(
      setEmployees,
      profileUser?.userType === ROLES.ADMIN
        ? `admin/get-employee?userType=Employee`
        : "employee/getEmployee",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [updatedEmployeeOptions, setUpdatedEmployeeOptons] = useState([]);
  useEffect(() => {
    setUpdatedEmployeeOptons(
      employees?.data?.filter((value) => value?.userType !== ROLES.PATIENT),
    );
  }, [employees]);
  const employeeOptions = updatedEmployeeOptions?.map((i) => ({
    label: fetchPaitentName(i),
    value: i._id,
  }));
  const handleNext = (e) => {
    e.preventDefault();
    setPart(2);
  };
  return (
    <>
      {typedGuardDialog}
      <AddSignature
        show={open}
        setValue={setSavedSignaturePartA}
        setDate={setSignedDate}
        setTime={setSignedTime}
      />
      <AddSignature
        show={openAdmin}
        setValue={setAdminSignature}
        setDate={setAdminDateSigned}
        setTime={setAdminSignedTime}
      />
      <NavWrapper title={"Incident Report Form"} isArrow={true} />
      <Container>
        <Form
          onSubmit={
            ((profileUser.accountType === ACCOUNT_TYPES.ADMINISTRATOR &&
              profileUser.userType === ROLES.EMPLOYEE) ||
              profileUser.userType === ROLES.ADMIN) &&
            +part === 1
              ? handleNext
              : submitHandlerA
          }
        >
          {+part === 1 && (
            <>
              <Row className="mb-2 mt-3">
                <Col xs={12}>
                  <PatientComponent
                    MainPatientId={setPatientId}
                    MainResidentName={setResidentName}
                  />
                </Col>
              </Row>
              <Card body className="mb-3">
                <Row>
                  <Col xs={12} md={4} lg={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">
                        Date of Incident :{" "}
                      </Form.Label>

                      <DatePicker
                        selected={formatDateToMMDDYYYY(dateOfIncident)}
                        onChange={(selectedDate) =>
                          setDateOfIncident(selectedDate?.toDateString())
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              dateOfIncident
                                ? formatDateToMMDDYYYY(dateOfIncident)
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4} lg={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">Begin time : </Form.Label>

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
                      <Form.Label className="fw-bold">End time : </Form.Label>

                      <CustomTimePicker
                        use24Hours={hoursFormat === "HH:mm"}
                        value={endTime ? parseTimeStringToDate(endTime) : null}
                        onChange={setEndTime}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
              <Card body className="mb-3">
                <Row>
                  <Col xs={12} md={12} lg={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Name of Employee/s Involved :{" "}
                      </Form.Label>
                      <Select
                        isMulti
                        options={employeeOptions}
                        isSearchable={false}
                        value={employeesInvolved}
                        onChange={(value) => setEmployeesInvolved(value)}
                        overrideStrings={{
                          selectSomeItems: "Select...",
                          allItemsAreSelected: employeesInvolved
                            .map((item) => item.label)
                            .join(", "),
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={12} lg={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Name Resident/s Involved :{" "}
                      </Form.Label>
                      <MultiPatients
                        setValue={setResidentsInvolved}
                        value={residentsInvolved}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={12} lg={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Name/Title of Person Observing/Reporting Incident :{" "}
                      </Form.Label>
                      <Form.Control
                        onChange={(e) =>
                          setPersonObservingReporting(e.target.value)
                        }
                        type={"text"}
                        value={personObservingReporting}
                        as="textarea"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
              <Card body className="mb-3">
                <Row>
                  <Col xs={12} md={12} lg={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Incidents : </Form.Label>
                      <CustomMultiSelectInput
                        multiselect={true}
                        value={incidents}
                        onChange={(value) => setIncidents(value)}
                        options={incidentOptions}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={12} lg={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Level of Severity :{" "}
                      </Form.Label>
                      <CustomMultiSelectInput
                        multiselect={true}
                        value={severityLevel}
                        onChange={(value) => setSeverityLevel(value)}
                        options={levelSeverityOptions}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={12} lg={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Describe the event in detail: What happened before,
                        during, and after the incident :{" "}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        onChange={(e) => setEventDetails(e.target.value)}
                        value={eventDetails}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
              <Card body className="mb-3">
                <Row>
                  <Col xs={12} md={12} lg={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Medication Errors :{" "}
                      </Form.Label>
                      <div className="radio-inline">
                        <CheckBoxMaker
                          inline
                          setValue={setMedicationErrorsMissedDose}
                          value={!medicationErrorsMissedDose}
                          label="Missed Dose"
                          id={"MissedOne"}
                          checked={medicationErrorsMissedDose}
                        />
                        <CheckBoxMaker
                          inline
                          setValue={setMedicationErrorsRefusedMedication}
                          value={!medicationErrorsRefusedMedication}
                          label="Refused Medication"
                          id={"RefusedMedication"}
                          checked={medicationErrorsRefusedMedication}
                        />
                        <CheckBoxMaker
                          inline
                          setValue={setMedicationErrorsWrongClient}
                          value={!medicationErrorsWrongClient}
                          label="Wrong Client"
                          id={"WrongClient"}
                          checked={medicationErrorsWrongClient}
                        />
                        <CheckBoxMaker
                          inline
                          setValue={setMedicationErrorsWrongTime}
                          value={!medicationErrorsWrongTime}
                          label="Wrong Time"
                          id={"WrongTime"}
                          checked={medicationErrorsWrongTime}
                        />
                        <CheckBoxMaker
                          inline
                          setValue={setMedicationErrorsWrongMed}
                          value={!medicationErrorsWrongMed}
                          label="Wrong Med"
                          id={"WrongMed"}
                          checked={medicationErrorsWrongMed}
                        />
                        <CheckBoxMaker
                          inline
                          setValue={setMedicationErrorsNone}
                          value={!medicationErrorsNone}
                          label="None"
                          id={"ErrorNone"}
                          checked={medicationErrorsNone}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
              <Card body className="mb-3">
                <Row>
                  <Col xs={12} md={12} lg={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Action/s taken: (Check all that apply) :{" "}
                      </Form.Label>
                      <div className="radio-inline">
                        <CheckBoxMaker
                          setValue={setActionsTakenSenttoERHospital}
                          value={!actionsTakenSenttoERHospital}
                          label="Sent to ER/Hospital"
                          id={"SenttoERHospital"}
                          checked={actionsTakenSenttoERHospital}
                        />
                        <CheckBoxMaker
                          setValue={setActionsTakenFirstAid}
                          value={!actionsTakenFirstAid}
                          label="First Aid"
                          id={"FirstAid"}
                          checked={actionsTakenFirstAid}
                        />
                        <CheckBoxMaker
                          setValue={setActionsTakenNoMedicalCareRequired}
                          value={!actionsTakenNoMedicalCareRequired}
                          label="No Medical Care Required"
                          id={"NoMedicalCareRequired"}
                          checked={actionsTakenNoMedicalCareRequired}
                        />
                        <CheckBoxMaker
                          setValue={setCareRefused}
                          value={!careRefused}
                          label="Care Refused"
                          id={"CareRefused"}
                          checked={careRefused}
                        />
                        <CheckBoxMaker
                          setValue={setActionsTakenFireDepartmentCalled}
                          value={!actionsTakenFireDepartmentCalled}
                          label="Fire Department Called"
                          id={"FireDepartmentCalled"}
                          checked={actionsTakenFireDepartmentCalled}
                        />
                        <CheckBoxMaker
                          setValue={setActionsTakenPoliceCalled}
                          value={!actionsTakenPoliceCalled}
                          label="Police Called"
                          id={"PoliceCalled"}
                          checked={actionsTakenPoliceCalled}
                        />
                        <CheckBoxMaker
                          setValue={
                            setActionsTakenReferredtoAdministratorRiskManagement
                          }
                          value={
                            !actionsTakenReferredtoAdministratorRiskManagement
                          }
                          label="Referred to Administrator/Risk Management"
                          id={"ReferredtoAdministrator/RiskManagement"}
                          checked={
                            actionsTakenReferredtoAdministratorRiskManagement
                          }
                        />
                        <CheckBoxMaker
                          setValue={
                            setActionsTakenMaintenanceCalledWorkOrderCompleted
                          }
                          value={
                            !actionsTakenMaintenanceCalledWorkOrderCompleted
                          }
                          label="Maintenance Called/Work Order Completed"
                          id={"MaintenanceCalled/WorkOrderCompleted"}
                          checked={
                            actionsTakenMaintenanceCalledWorkOrderCompleted
                          }
                        />
                        <CheckBoxMaker
                          setValue={setActionsTakenOther}
                          value={!actionsTakenOther}
                          label="Other"
                          id={"Other"}
                          checked={actionsTakenOther}
                        />
                        {actionsTakenOther && (
                          <BorderlessInput
                            type={"text"}
                            setState={setActionTakerOtherComment}
                            value={actionsTakenOtherComment}
                          />
                        )}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
              <Row>
                <Col>
                  <Card body className="mb-3">
                    <Row>
                      <Col xs={12} md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            If Abuse , Neglected :{" "}
                          </Form.Label>
                          <div className="radio-inline">
                            <CheckBoxMaker
                              setValue={setAbuseNeglectInvolved}
                              value={true}
                              label="Yes"
                              id={"yes"}
                              checked={abuseNeglectInvolved === true}
                            />
                            <CheckBoxMaker
                              setValue={setAbuseNeglectInvolved}
                              value={false}
                              label="No"
                              id={"no"}
                              checked={abuseNeglectInvolved === false}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            State contacted :{" "}
                          </Form.Label>
                          <div className="radio-inline">
                            <CheckBoxMaker
                              setValue={setStateContacted}
                              value={true}
                              label="Yes"
                              id={"yes"}
                              checked={stateContacted === true}
                            />
                            <CheckBoxMaker
                              setValue={setStateContacted}
                              value={false}
                              label="No"
                              id={"no"}
                              checked={stateContacted === false}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={4}>
                        {!stateContacted && (
                          <Col xs={12} md={12}>
                            <Form.Group>
                              <Form.Label className="fw-bold">
                                If No, Explain :{" "}
                              </Form.Label>
                              <Form.Control
                                onChange={(e) =>
                                  setAbuseNeglectInvolvedifYes(e.target.value)
                                }
                                type={"text"}
                                value={abuseNeglectInvolvedifYes}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                        )}
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12}>
                  <Card body className="mb-3 d-flex">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Notifications :{" "}
                          </Form.Label>
                          <div className="d-flex flex-column d-flex justify-content-center">
                            <CheckBoxMaker
                              setValue={setNotificationsFamily}
                              value={!notificationsFamily}
                              label="Family"
                              id={"Family"}
                              checked={notificationsFamily}
                              className="mb-4"
                            />
                            <CheckBoxMaker
                              setValue={setNotificationsGuardian}
                              value={!notificationsGuardian}
                              label="Guardian"
                              id={"Guardian"}
                              checked={notificationsGuardian}
                              className="mb-4"
                            />
                            <CheckBoxMaker
                              setValue={setNotificationsCaseManager}
                              value={!notificationsCaseManager}
                              label="Case Manager"
                              id={"CaseManager"}
                              checked={notificationsCaseManager}
                              className="mb-4"
                            />
                            <div>
                              <CheckBoxMaker
                                setValue={setNotificationsOther}
                                value={!notificationsOther}
                                label="Other"
                                id={"OtherNoti"}
                                checked={notificationsOther}
                                className="mb-4"
                              />
                              {notificationsOther && (
                                <BorderlessInput
                                  setState={setOtherNotificationValue}
                                  value={otherNotificationValue}
                                />
                              )}
                            </div>
                            <div>
                              <CheckBoxMaker
                                setValue={setNotificationsOther2}
                                value={!notificationsOther2}
                                label="Other"
                                id={"OtherNoti2"}
                                checked={notificationsOther2}
                              />
                              {notificationsOther2 && (
                                <BorderlessInput
                                  setState={setOther2NotificationValue}
                                  value={other2NotificationValue}
                                />
                              )}
                            </div>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3 d-flex flex-column">
                              <Form.Label className="fw-bold">
                                Date Of Notification :{" "}
                              </Form.Label>
                              <Form.Group className="mb-3">
                                <DatePicker
                                  wrapperClassName="w-full"
                                  selected={formatDateToMMDDYYYY(
                                    notificationDate,
                                  )}
                                  onChange={(selectedDate) =>
                                    setNotificationDate(
                                      selectedDate?.toDateString(),
                                    )
                                  }
                                  dateFormat="MM/dd/yyyy"
                                  placeholderText="MM/DD/YYYY"
                                  highlightDates={[
                                    {
                                      "react-datepicker__day--highlighted-custom":
                                        [
                                          notificationDate
                                            ? formatDateToMMDDYYYY(
                                                notificationDate,
                                              )
                                            : new Date(),
                                        ],
                                    },
                                  ]}
                                  className="form-control"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <DatePicker
                                  wrapperClassName="w-full"
                                  selected={formatDateToMMDDYYYY(
                                    notificationDateGuardian,
                                  )}
                                  onChange={(selectedDate) =>
                                    setNotificationDateGuardian(
                                      selectedDate?.toDateString(),
                                    )
                                  }
                                  dateFormat="MM/dd/yyyy"
                                  placeholderText="MM/DD/YYYY"
                                  highlightDates={[
                                    {
                                      "react-datepicker__day--highlighted-custom":
                                        [
                                          notificationDate
                                            ? formatDateToMMDDYYYY(
                                                notificationDateGuardian,
                                              )
                                            : new Date(),
                                        ],
                                    },
                                  ]}
                                  className="form-control"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <DatePicker
                                  wrapperClassName="w-full"
                                  selected={formatDateToMMDDYYYY(
                                    notificationDateCaseManager,
                                  )}
                                  onChange={(selectedDate) =>
                                    setNotificationDateCaseManager(
                                      selectedDate?.toDateString(),
                                    )
                                  }
                                  dateFormat="MM/dd/yyyy"
                                  placeholderText="MM/DD/YYYY"
                                  highlightDates={[
                                    {
                                      "react-datepicker__day--highlighted-custom":
                                        [
                                          notificationDate
                                            ? formatDateToMMDDYYYY(
                                                notificationDateCaseManager,
                                              )
                                            : new Date(),
                                        ],
                                    },
                                  ]}
                                  className="form-control"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <DatePicker
                                  wrapperClassName="w-full"
                                  selected={formatDateToMMDDYYYY(
                                    notificationDateOther,
                                  )}
                                  onChange={(selectedDate) =>
                                    setNotificationDateOther(
                                      selectedDate?.toDateString(),
                                    )
                                  }
                                  dateFormat="MM/dd/yyyy"
                                  placeholderText="MM/DD/YYYY"
                                  highlightDates={[
                                    {
                                      "react-datepicker__day--highlighted-custom":
                                        [
                                          notificationDateOther
                                            ? formatDateToMMDDYYYY(
                                                notificationDateOther,
                                              )
                                            : new Date(),
                                        ],
                                    },
                                  ]}
                                  className="form-control"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <DatePicker
                                  wrapperClassName="w-full"
                                  selected={formatDateToMMDDYYYY(
                                    notificationDateOther2,
                                  )}
                                  onChange={(selectedDate) =>
                                    setNotificationDateOther2(
                                      selectedDate?.toDateString(),
                                    )
                                  }
                                  dateFormat="MM/dd/yyyy"
                                  placeholderText="MM/DD/YYYY"
                                  highlightDates={[
                                    {
                                      "react-datepicker__day--highlighted-custom":
                                        [
                                          notificationDateOther2
                                            ? formatDateToMMDDYYYY(
                                                notificationDateOther2,
                                              )
                                            : new Date(),
                                        ],
                                    },
                                  ]}
                                  className="form-control"
                                />
                              </Form.Group>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3 d-flex flex-column">
                              <Form.Label className="fw-bold">
                                Time of Notification :{" "}
                              </Form.Label>

                              <Form.Group className="mb-3 ">
                                <CustomTimePicker
                                  use24Hours={hoursFormat === "HH:mm"}
                                  value={
                                    notificationTime
                                      ? parseTimeStringToDate(notificationTime)
                                      : null
                                  }
                                  onChange={setNotificationTime}
                                />
                              </Form.Group>

                              <Form.Group className="mb-3 ">
                                <CustomTimePicker
                                  use24Hours={hoursFormat === "HH:mm"}
                                  value={
                                    notificationTimeGuardian
                                      ? parseTimeStringToDate(
                                          notificationTimeGuardian,
                                        )
                                      : null
                                  }
                                  onChange={setNotificationTimeGuardian}
                                />
                              </Form.Group>

                              <Form.Group className="mb-3 ">
                                <CustomTimePicker
                                  use24Hours={hoursFormat === "HH:mm"}
                                  value={
                                    notificationTimeCaseManager
                                      ? parseTimeStringToDate(
                                          notificationTimeCaseManager,
                                        )
                                      : null
                                  }
                                  onChange={setNotificationTimeCaseManager}
                                />
                              </Form.Group>
                              <Form.Group className="mb-3 ">
                                <CustomTimePicker
                                  use24Hours={hoursFormat === "HH:mm"}
                                  value={
                                    notificationTimeOther
                                      ? parseTimeStringToDate(
                                          notificationTimeOther,
                                        )
                                      : null
                                  }
                                  onChange={setNotificationTimeOther}
                                />
                              </Form.Group>
                              <Form.Group className="mb-3 ">
                                <CustomTimePicker
                                  use24Hours={hoursFormat === "HH:mm"}
                                  value={
                                    notificationTimeOther2
                                      ? parseTimeStringToDate(
                                          notificationTimeOther2,
                                        )
                                      : null
                                  }
                                  onChange={setNotificationTimeOther2}
                                />
                              </Form.Group>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6}>
                  <Card body className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        Mode of communication :
                      </Form.Label>
                      <div className="radio-inline">
                        <CheckBoxMaker
                          setValue={setModeEmail}
                          value={!modeEmail}
                          label="Email"
                          id={"Email"}
                          checked={modeEmail}
                        />
                        <CheckBoxMaker
                          setValue={setModePhoneCall}
                          value={!modePhoneCall}
                          label="Phone Call"
                          id={"PhoneCall"}
                          checked={modePhoneCall}
                        />
                        <CheckBoxMaker
                          setValue={setModeInPerson}
                          value={!modeInPerson}
                          label="In Person"
                          id={"InPerson"}
                          checked={modeInPerson}
                        />
                        <CheckBoxMaker
                          setValue={setModeOther}
                          value={!modeOther}
                          label="Other"
                          id={"Other_mode"}
                          checked={modeOther}
                        />
                      </div>
                    </Form.Group>
                  </Card>
                </Col>
                <Col xs={12} md={6}>
                  <Card body className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        Report Completed By :{" "}
                      </Form.Label>
                      <Form.Control
                        onChange={(e) => setReportCompletedBy(e.target.value)}
                        value={reportCompletedBy}
                        type={"text"}
                      ></Form.Control>
                    </Form.Group>
                  </Card>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={12}>
                  <Form.Label className="fw-bold">
                    Incident Reports Are to Be Completed and Forwarded Within 24
                    Hours of Incident to Administrator
                  </Form.Label>
                </Col>
              </Row>
              {!(
                (profileUser.accountType === ACCOUNT_TYPES.ADMINISTRATOR &&
                  profileUser.userType === ROLES.EMPLOYEE) ||
                profileUser.userType === ROLES.ADMIN
              ) && (
                <>
                  <Row className="my-3">
                    <Col xs={12} md={6}>
                      <Button
                        type="button"
                        className="theme-button"
                        onClick={() =>
                          profileUser?.userType === ROLES.ADMIN
                            ? setOpenAdmin(true)
                            : setOpen(true)
                        }
                      >
                        SAVED AND SIGNED
                      </Button>
                    </Col>
                    <Col xs={12} md={6}>
                      {signatureFormat({
                        sign: savedSignedPartA,
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

                  <div className="signature-sections-inline mt-3">
                    <SignatureNamesPanel
                      signatures={signatures}
                      onUpdate={updateSignature}
                      formHasTyped={hasTypedInForm}
                      onClearAllTyped={clearAllTyped}
                      roles={[
                        { role: "bht", label: "BHT" },
                        { role: "bhp", label: "BHP" },
                      ]}
                    />
                    <SignatureSection
                      role="bht"
                      label="BHT Signature"
                      variant="blue"
                      signature={signatures?.bht}
                      onUpdate={updateSignature}
                      externalName
                      signerNameOverride={signatures?.bht?.name || undefined}
                      formHasTyped={hasTypedInForm}
                      onClearAllTyped={clearAllTyped}
                    />
                    <SignatureSection
                      role="bhp"
                      label="BHP Signature"
                      variant="pink"
                      signature={signatures?.bhp}
                      onUpdate={updateSignature}
                      externalName
                      signerNameOverride={signatures?.bhp?.name || undefined}
                      formHasTyped={hasTypedInForm}
                      onClearAllTyped={clearAllTyped}
                    />
                    {/* <SignatureSection
                      role="resident"
                      label="Resident/Representative Signature"
                      variant="blue"
                      signature={signatures?.resident}
                      onUpdate={updateSignature}
                      signerNameOverride={
                        residentsInvolved?.length > 0
                          ? residentsInvolved.map((r) => r.label).join(", ")
                          : ""
                      }
                      formHasTyped={hasTypedInForm}
                      onClearAllTyped={clearAllTyped}
                    /> */}
                    {/* <SignatureSection
                      role="witness"
                      label="Witness Signature"
                      variant="yellow"
                      signature={signatures?.witness}
                      onUpdate={updateSignature}
                      externalName
                      formHasTyped={hasTypedInForm}
                      onClearAllTyped={clearAllTyped}
                    /> */}
                  </div>

                  <Form.Group className="hidePrint mt-3">
                    <Form.Label className="fw-bold">Signers:</Form.Label>
                    <MultiEmployee setValue={setSigners} value={signers} />
                  </Form.Group>
                </>
              )}
            </>
          )}

          {+part === 2 && (
            <>
              <Card body className="mb-3">
                <Row>
                  <Col xs={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Investigation of Incident
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        onChange={(e) =>
                          setInvestigationOfInvestment(e.target.value)
                        }
                        value={investigationOfInvestment}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Recommendation & Actions
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        onChange={(e) =>
                          setRecommendationAndActions(e.target.value)
                        }
                        value={recommendationAndActions}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Follow Up</Form.Label>
                      <Form.Control
                        as="textarea"
                        value={followUp}
                        onChange={(e) => setFollowUp(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
              {((profileUser.accountType === ACCOUNT_TYPES.ADMINISTRATOR &&
                profileUser.userType === ROLES.EMPLOYEE) ||
                profileUser.userType === ROLES.ADMIN) && (
                <>
                  <Row>
                    <Col xs={12} md={6}>
                      <Button
                        type="button"
                        className="theme-button"
                        onClick={() =>
                          profileUser?.userType === ROLES.ADMIN
                            ? setOpenAdmin(true)
                            : setOpen(true)
                        }
                      >
                        SAVED AND SIGNED
                      </Button>
                    </Col>
                    <Col xs={12} md={6}>
                      {signatureFormat({
                        sign: savedSignedPartA,
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

                  <div className="signature-sections-inline mt-3">
                    <SignatureNamesPanel
                      signatures={signatures}
                      onUpdate={updateSignature}
                      formHasTyped={hasTypedInForm}
                      onClearAllTyped={clearAllTyped}
                      roles={[
                        { role: "bht", label: "BHT" },
                        { role: "bhp", label: "BHP" },
                      ]}
                    />
                    <SignatureSection
                      role="bht"
                      label="BHT Signature"
                      variant="blue"
                      signature={signatures?.bht}
                      onUpdate={updateSignature}
                      externalName
                      signerNameOverride={signatures?.bht?.name || undefined}
                      formHasTyped={hasTypedInForm}
                      onClearAllTyped={clearAllTyped}
                    />
                    <SignatureSection
                      role="bhp"
                      label="BHP Signature"
                      variant="pink"
                      signature={signatures?.bhp}
                      onUpdate={updateSignature}
                      externalName
                      signerNameOverride={signatures?.bhp?.name || undefined}
                      formHasTyped={hasTypedInForm}
                      onClearAllTyped={clearAllTyped}
                    />
                    {/* <SignatureSection
                      role="resident"
                      label="Resident/Representative Signature"
                      variant="blue"
                      signature={signatures?.resident}
                      onUpdate={updateSignature}
                      signerNameOverride={residentName || ""}
                      formHasTyped={hasTypedInForm}
                      onClearAllTyped={clearAllTyped}
                    /> */}
                    {/* <SignatureSection
                      role="witness"
                      label="Witness Signature"
                      variant="yellow"
                      signature={signatures?.witness}
                      onUpdate={updateSignature}
                      externalName
                      formHasTyped={hasTypedInForm}
                      onClearAllTyped={clearAllTyped}
                    /> */}
                  </div>

                  <Form.Group className="hidePrint mt-3">
                    <Form.Label className="fw-bold">Signers:</Form.Label>
                    <MultiEmployee setValue={setSigners} value={signers} />
                  </Form.Group>
                </>
              )}
            </>
          )}
          <div className="employee-btn-joiner mt-5">
            {(+part === 1 || +part === 2) && (
              <button
                className="draft"
                type="submit"
                onClick={() => setSaveAsDraft(true)}
              >
                Save as Draft
              </button>
            )}

            <button
              className="employee_create_btn"
              type="submit"
              disabled={
                witnessIncomplete
                  ? true
                  : // Condition 1
                    (profileUser.userType === ROLES.ADMIN &&
                      +part === 2 &&
                      false) ||
                    // Condition 2
                    (profileUser.userType === ROLES.EMPLOYEE &&
                      profileUser.accountType === ACCOUNT_TYPES.ADMINISTRATOR &&
                      +part === 2 &&
                      (!savedSignedPartA || savedSignedPartA.length === 0)) ||
                    // Condition 3
                    (profileUser.userType === ROLES.EMPLOYEE &&
                      profileUser.accountType === ACCOUNT_TYPES.REGULAR &&
                      +part === 1 &&
                      (!savedSignedPartA || savedSignedPartA.length === 0))
              }
            >
              {loading ? (
                <ClipLoader color="#fff" />
              ) : ((profileUser.accountType === ACCOUNT_TYPES.ADMINISTRATOR &&
                  profileUser.userType === ROLES.EMPLOYEE) ||
                  profileUser.userType === ROLES.ADMIN) &&
                +part === 1 ? (
                "NEXT"
              ) : (
                "SUBMIT"
              )}
            </button>
          </div>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: CreateIncident,
});
