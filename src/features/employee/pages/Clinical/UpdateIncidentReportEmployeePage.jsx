/* eslint-disable no-unused-vars */
/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Row, Col, Card, Button } from "react-bootstrap";
import { getData } from "@/features/shared/services/index";
import { BorderlessInput, CheckBoxMaker, MultiSelect } from "@/utils/Makers";
import {
  incidentOptions,
  levelSeverityOptions,
} from "@/features/shared/constants";
import { patientChartService } from "@/features/shared/services/index";
import { ClipLoader } from "react-spinners";
import NavWrapper from "@/utils/NavWrapper";
import {
  AddSignature,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import HOC from "@/features/shared/layout/Inner/HOC";
import MultiPatients from "@/features/shared/ui/Search/MultiPatients";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants/index";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
const UpdateIncidentReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [patientId, setPatientId] = useState("");
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
  const [abuseNeglectInvolved, setAbuseNeglectInvolved] = useState(false);
  const [abuseNeglectInvolvedifYes, setAbuseNeglectInvolvedifYes] =
    useState("");
  const [notificationsFamily, setNotificationsFamily] = useState(false);
  const [notificationsGuardian, setNotificationsGuardian] = useState(false);
  const [notificationsCaseManager, setNotificationsCaseManager] =
    useState(false);
  const [notificationDate, setNotificationDate] = useState("");
  const [notificationDateGuardian, setNotificationDateGuardian] = useState("");
  const [notificationDateCaseManager, setNotificationDateCaseManager] =
    useState("");
  const [reportCompletedBy, setReportCompletedBy] = useState("");
  const [modeEmail, setModeEmail] = useState(false);
  const [modePhoneCall, setModePhoneCall] = useState(false);
  const [modeInPerson, setModeInPerson] = useState(false);
  const [modeOther, setModeOther] = useState(false);
  const [savedSignedPartA, setSavedSignaturePartA] = useState("");
  const [loading, setLoading] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [employees, setEmployees] = useState({});
  const [signedDate, setSignedDate] = useState("");
  const [signedTime, setSignedTime] = useState("");
  const [detail, setDetail] = useState({});
  const [notificationTime, setNotificationTime] = useState("");
  const [beginTime, setBeginTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [stateContacted, setStateContacted] = useState(false);
  const [signers, setSigners] = useState([]);
  const [investigationOfInvestment, setInvestigationOfInvestment] =
    useState("");
  const [recommendationAndActions, setRecommendationAndActions] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [aPartId, setAPartId] = useState("");
  const [notificationTimeGuardian, setNotificationTimeGuardian] = useState("");
  const [notificationTimeCaseManager, setNotificationTimeCaseManager] =
    useState("");
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [saveAsDrafIsNotEditable, setSaveAsDrafIsNotEditable] = useState(false);
  const [
    saveAsDrafIsNotEditableWithoutSigner,
    setSaveAsDrafIsNotEditableWithoutSigner,
  ] = useState(false);
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);
  const [notificationsOther, setNotificationsOther] = useState("");
  const [notificationsOther2, setNotificationsOther2] = useState("");
  const [notificationDateOther, setNotificationDateOther] = useState("");
  const [notificationDateOther2, setNotificationDateOther2] = useState("");
  const [notificationTimeOther, setNotificationTimeOther] = useState("");
  const [notificationTimeOther2, setNotificationTimeOther2] = useState("");
  const [otherNotificationValue, setOtherNotificationValue] = useState("");
  const [other2NotificationValue, setOther2NotificationValue] = useState("");

  const {
    signatures,
    updateSignature,
    loadFromApi: loadSignaturesFromApi,
  } = useSignatures();
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

  const payloadA = {
    notificationDateCaseManager,
    notificationDateGuardian,
    notificationDate,
    patientId,
    dateOfIncident,
    beginTime,
    endTime,
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
    CareRefused: careRefused,
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
    saveAsDraft,
    signers,
    followUp,
    recommendationAndActions,
    investigationOfInvestment,
    signatures,
  };
  const fetchHandler = () => {
    patientChartService.incidentReport.getById(id, { setResponse: setDetail });
  };
  const submitHandlerA = (e) => {
    e.preventDefault();
    patientChartService.incidentReport.update(id, payloadA, {
      setLoading,
      successMsg: "Updated !",
      navigate,
    });
  };
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    getData(setEmployees, "employee/getEmployee");
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
  useEffect(() => {
    if (detail) {
      const item = detail?.data;
      setPatientId(item?.patientId?._id);
      setDateOfIncident(item?.dateOfIncident);
      setBeginTime(item?.beginTime);
      setEndTime(item?.endTime);
      if (item?.employeesInvolved) {
        const uniqueDate = new Set([
          ...employeesInvolved,
          ...item?.employeesInvolved,
        ]);
        const uniqueDateArr = Array.from(uniqueDate)?.map((i) => ({
          label: fetchPaitentName(i),
          value: i?._id,
        }));
        setEmployeesInvolved(uniqueDateArr);
      }
      if (item?.residentsInvolved) {
        const uniqueDate = new Set([
          ...residentsInvolved,
          ...item?.residentsInvolved,
        ]);
        const uniqueDateArr = Array.from(uniqueDate)?.map((i) => ({
          label: fetchPaitentName(i),
          value: i?._id,
        }));
        setResidentsInvolved(uniqueDateArr);
      }
      setReportCompletedBy(item?.reportCompletedBy);
      if (item?.incidents) {
        const uniqueDate = new Set([...incidents, ...item?.incidents]);
        const uniqueDateArr = Array.from(uniqueDate)?.map((i) => ({
          label: i,
          value: i,
        }));
        setIncidents(uniqueDateArr);
      }
      if (item?.levelOfSeverity) {
        const uniqueDate = new Set([
          ...severityLevel,
          ...item?.levelOfSeverity,
        ]);
        const uniqueDateArr = Array.from(uniqueDate)?.map((i) => ({
          label: i,
          value: i,
        }));
        setSeverityLevel(uniqueDateArr);
      }
      setPersonObservingReporting(item?.personObservingReporting);
      setEventDetails(item?.eventDetails);
      setMedicationErrorsMissedDose(item?.medicationErrorsMissedDose);
      setMedicationErrorsRefusedMedication(
        item?.medicationErrorsRefusedMedication,
      );
      setMedicationErrorsWrongClient(item?.medicationErrorsWrongClient);
      setMedicationErrorsWrongTime(item?.medicationErrorsWrongTime);
      setMedicationErrorsWrongMed(item?.medicationErrorsWrongMed);
      setActionsTakenSenttoERHospital(item?.actionsTakenSenttoERHospital);
      setActionsTakenFirstAid(item?.actionsTakenNoMedicalCareRequired);
      setCareRefused(item?.CareRefused);
      setActionsTakenFireDepartmentCalled(
        item?.actionsTakenFireDepartmentCalled,
      );
      setActionsTakenPoliceCalled(item?.actionsTakenPoliceCalled);
      setActionsTakenReferredtoAdministratorRiskManagement(
        item?.actionsTakenReferredtoAdministratorRiskManagement,
      );
      setActionsTakenMaintenanceCalledWorkOrderCompleted(
        item?.actionsTakenMaintenanceCalledWorkOrderCompleted,
      );
      setActionsTakenOther(item?.actionsTakenOther);
      setActionTakerOtherComment(item?.actionsTakenOtherComment);
      setAbuseNeglectInvolved(item?.abuseNeglectInvolved);
      setStateContacted(item?.stateContacted);
      setAbuseNeglectInvolvedifYes(item?.abuseNeglectInvolvedifYes);
      setNotificationsFamily(item?.notificationsFamily);
      setNotificationsGuardian(item?.notificationsGuardian);
      setNotificationsCaseManager(item?.notificationsCaseManager);
      setNotificationsOther(item?.notificationsOther);
      setNotificationsOther2(item?.notificationsOther2);
      setModeEmail(item?.modeEmail);
      setModePhoneCall(item?.modePhoneCall);
      setModeInPerson(item?.modeInPerson);
      setModeOther(item?.modeOther);
      setSavedSignaturePartA(item?.savedSignedPartA);
      setSignedDate(item?.signedDatePartA);
      setSignedTime(item?.signedTimePartA);
      setNotificationTime(item?.notificationTime);
      setNotificationTimeGuardian(item?.notificationTimeGuardian);
      setNotificationTimeCaseManager(item?.notificationTimeCaseManager);
      setNotificationTimeOther(item?.notificationTimeOther);
      setOtherNotificationValue(item?.otherNotificationValue);
      setNotificationTimeOther2(item?.notificationTimeOther2);
      setOther2NotificationValue(item?.other2NotificationValue);
      setNotificationDate(item?.notificationDate);
      setNotificationDateGuardian(item?.notificationDateGuardian);
      setNotificationDateCaseManager(item?.notificationDateCaseManager);
      setNotificationDateOther(item?.notificationDateOther);
      setNotificationDateOther2(item?.notificationDateOther2);
      setInvestigationOfInvestment(item?.investigationOfInvestment);
      setFollowUp(item?.followUp);
      setRecommendationAndActions(item?.recommendationAndActions);
      setSigners(item?.signers);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setAdminSignedTime(item?.adminSignedTime);
      setAPartId(item?._id);
      if (item?.signatures) {
        loadSignaturesFromApi(item.signatures);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);
  useEffect(() => {
    if (!detail?.data) return;
    if (detail?.data) {
      const { saveAsDraft, signers } = detail.data;
      const { _id, userType, accountType, userPermissions } = profileInfo;
      const isSigner = signers?.findIndex?.(
        (signer, i) => signer.signerId === _id,
      );
      // SaveAsDraft with signer
      if (
        (saveAsDraft &&
          userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.REGULAR &&
          !(
            typeof userPermissions?.edit === "string"
              ? userPermissions.edit.split(":")
              : []
          ).includes("inr") &&
          isSigner !== -1) ||
        (saveAsDraft &&
          userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.RESTRICTED &&
          isSigner !== -1)
      ) {
        setSaveAsDrafIsNotEditable(true);
      } else {
        setSaveAsDrafIsNotEditable(false);
      }

      // SaveAsDraft withOut Signer
      if (
        (saveAsDraft &&
          userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.REGULAR &&
          !(
            typeof userPermissions?.edit === "string"
              ? userPermissions.edit.split(":")
              : []
          ).includes("inr") &&
          isSigner === -1) ||
        (saveAsDraft &&
          userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.RESTRICTED &&
          isSigner === -1)
      ) {
        setSaveAsDrafIsNotEditableWithoutSigner(true);
      } else {
        setSaveAsDrafIsNotEditableWithoutSigner(false);
      }

      // signer without edit permission
      if (
        (userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.REGULAR &&
          !(
            typeof userPermissions?.edit === "string"
              ? userPermissions.edit.split(":")
              : []
          ).includes("inr") &&
          isSigner !== -1) ||
        (userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.RESTRICTED &&
          isSigner !== -1)
      ) {
        setIsNotEditableWithSigner(true);
      } else {
        setIsNotEditableWithSigner(false);
      }
    }
  }, [
    detail?.data,
    profileInfo,
    profileInfo?._id,
    profileInfo?.accountType,
    profileInfo?.userPermissions?.edit,
    profileInfo?.userType,
  ]);
  const checkSign = useCallback(async () => {
    let signerIndex = signers?.findIndex?.(
      (signer, i) => signer.signerId === profileInfo._id,
    );
    let isSignerValid =
      signerIndex !== -1 && signers?.[signerIndex]?.signature?.length > 0;
    let isAdminConditionValid = profileInfo.userType === ROLES.ADMIN;
    let isEmployeeConditionValid =
      (detail?.data?.employeeId === profileInfo?._id ||
        detail?.data?.employeeId?._id === profileInfo?._id) &&
      savedSignedPartA?.length > 0;
    let signerGuadianIndex = signers?.findIndex?.((signer, i) =>
      profileInfo.patientsAssigned?.includes(signer.signerId),
    );
    let isGuadianConditionValid =
      signerGuadianIndex !== -1 &&
      signers?.[signerGuadianIndex]?.signature?.length > 0;
    if (
      isSignerValid ||
      isAdminConditionValid ||
      isEmployeeConditionValid ||
      isGuadianConditionValid
    ) {
      setIsSubmitEnabled(true);
    } else {
      setIsSubmitEnabled(false);
    }
  }, [
    signers,
    profileInfo.userType,
    profileInfo._id,
    profileInfo.patientsAssigned,
    detail?.data?.employeeId,
    savedSignedPartA?.length,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [savedSignedPartA, adminSignature, id, checkSign]);
  let signerIndex1 = signers?.findIndex?.(
    (signer, i) => signer.signerId === profileInfo._id,
  );
  if (signerIndex1 === undefined || signerIndex1 === null) signerIndex1 = -1;
  function setSignerSignature1(sign) {
    if (signerIndex1 !== -1)
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex1] = {
          ...newSigners[signerIndex1],
          signature: sign,
        };
        return newSigners;
      });
  }
  function setSignerDate1(date) {
    if (signerIndex1 !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex1] = {
          ...newSigners[signerIndex1],
          dateSigned: date,
        };
        return newSigners;
      });
    }
  }
  function setSignerTime1(time) {
    if (signerIndex1 !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex1] = {
          ...newSigners[signerIndex1],
          signedTime: time,
        };
        return newSigners;
      });
    }
  }
  const editSignHandler = (sign) => {
    if (signers?.[signerIndex1]?.signerId === profileInfo?._id) {
      setSignerSignature1(sign);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setSigners((prevSigners) => {
        const signerIndex = prevSigners.findIndex(
          (signer) => signer.signerId === profileInfo?._id,
        );
        if (signerIndex !== -1) {
          const updatedSigners = [...prevSigners];
          updatedSigners[signerIndex] = {
            ...updatedSigners[signerIndex],
            signature: sign,
          };
          return updatedSigners;
        } else {
          return [
            ...prevSigners,
            {
              signerId: profileInfo._id,
              signature: sign,
              dateSigned: "",
              signedTime: "",
            },
          ];
        }
      });
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignature(sign);
    }
  };
  const editDateHandler = (date) => {
    if (signers?.[signerIndex1]?.signerId === profileInfo?._id) {
      setSignerDate1(date);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setSigners((prevSigners) => {
        const signerIndex = prevSigners.findIndex(
          (signer) => signer.signerId === profileInfo?._id,
        );
        if (signerIndex !== -1) {
          const updatedSigners = [...prevSigners];
          updatedSigners[signerIndex] = {
            ...updatedSigners[signerIndex],
            dateSigned: date,
          };
          return updatedSigners;
        } else {
          return [
            ...prevSigners,
            {
              signerId: profileInfo._id,
              signature: "",
              dateSigned: date,
              signedTime: "",
            },
          ];
        }
      });
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminDateSigned(date);
    }
  };
  const editTimeHandler = (time) => {
    if (signers?.[signerIndex1]?.signerId === profileInfo?._id) {
      setSignerTime1(time);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setSignedTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };
  return (
    <>
      {typedGuardDialog}
      <AddSignature
        show={open1}
        setValue={(sign) =>
          detail?.data?.employeeId === profileInfo?._id
            ? setSavedSignaturePartA(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          detail?.data?.employeeId === profileInfo?._id
            ? setSignedDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          detail?.data?.employeeId === profileInfo?._id
            ? setSignedTime(time)
            : editTimeHandler(time)
        }
      />

      <NavWrapper title={"Incident Report Form"} isArrow={true} />
      <Container>
        <Form
          onSubmit={(e) => {
            submitHandlerA(e);
          }}
          className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
          {(profileInfo.userType === ROLES.ADMIN ||
            (profileInfo.userType === ROLES.EMPLOYEE &&
              profileInfo.accountType === ACCOUNT_TYPES.ADMINISTRATOR) ||
            (profileInfo.userType === ROLES.EMPLOYEE &&
              profileInfo.accountType === ACCOUNT_TYPES.REGULAR) ||
            (profileInfo.userType === ROLES.EMPLOYEE &&
              profileInfo.accountType === ACCOUNT_TYPES.RESTRICTED)) && (
            <>
              <Row className="mb-2 mt-3">
                <Col xs={12}>
                  <Form.Label className="fw-bold">Resident Name :</Form.Label>
                  <Form.Label className="ms-2">
                    {detail?.data?.patientId &&
                      fetchPaitentName(detail?.data?.patientId)}
                  </Form.Label>
                </Col>
              </Row>
              <Card body className="mb-3">
                <Row>
                  <Col xs={12} md={6} lg={3}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">
                        Date of Incident
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
                  <Col xs={12} md={6} lg={3}>
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
                  <Col xs={12} md={6} lg={3}>
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
              </Card>
              <Card body className="mb-3">
                <Row>
                  <Col xs={12} md={6} lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Name of Employee/s Involved
                      </Form.Label>
                      <MultiSelect
                        options={employeeOptions}
                        setValue={setEmployeesInvolved}
                        value={employeesInvolved}
                        overrideStrings={{
                          selectSomeItems: "Select...",
                          allItemsAreSelected: employeesInvolved
                            .map((item) => item.label)
                            .join(", "),
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Name Resident/s Involved:
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
                        Name/Title of Person Observing/Reporting Incident:
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
                  <Col xs={12} md={6} lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Incidents</Form.Label>
                      <MultiSelect
                        options={incidentOptions}
                        setValue={setIncidents}
                        value={incidents}
                        overrideStrings={{
                          selectSomeItems: "Select...",
                          allItemsAreSelected: incidents
                            .map((item) => item.label)
                            .join(", "),
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Level of Severity
                      </Form.Label>
                      <MultiSelect
                        options={levelSeverityOptions}
                        setValue={setSeverityLevel}
                        value={severityLevel}
                        overrideStrings={{
                          selectSomeItems: "Select...",
                          allItemsAreSelected: severityLevel
                            .map((item) => item.label)
                            .join(", "),
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={12} lg={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Describe the event in detail: What happened before,
                        during, and after the incident
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
                        Medication Errors
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
                        Action/s taken: (Check all that apply)
                      </Form.Label>
                      <div className="radio-inline">
                        <CheckBoxMaker
                          inline
                          setValue={setActionsTakenSenttoERHospital}
                          value={!actionsTakenSenttoERHospital}
                          label="Sent to ER/Hospital"
                          id={"SenttoERHospital"}
                          checked={actionsTakenSenttoERHospital}
                        />
                        <CheckBoxMaker
                          inline
                          setValue={setActionsTakenFirstAid}
                          value={!actionsTakenFirstAid}
                          label="First Aid"
                          id={"FirstAid"}
                          checked={actionsTakenFirstAid}
                        />
                        <CheckBoxMaker
                          inline
                          setValue={setActionsTakenNoMedicalCareRequired}
                          value={!actionsTakenNoMedicalCareRequired}
                          label="No Medical Care Required"
                          id={"NoMedicalCareRequired"}
                          checked={actionsTakenNoMedicalCareRequired}
                        />
                        <CheckBoxMaker
                          inline
                          setValue={setCareRefused}
                          value={!careRefused}
                          label="Care Refused"
                          id={"CareRefused"}
                          checked={careRefused}
                        />
                        <CheckBoxMaker
                          inline
                          setValue={setActionsTakenFireDepartmentCalled}
                          value={!actionsTakenFireDepartmentCalled}
                          label="Fire Department Called"
                          id={"FireDepartmentCalled"}
                          checked={actionsTakenFireDepartmentCalled}
                        />
                        <CheckBoxMaker
                          inline
                          setValue={setActionsTakenPoliceCalled}
                          value={!actionsTakenPoliceCalled}
                          label="Police Called"
                          id={"PoliceCalled"}
                          checked={actionsTakenPoliceCalled}
                        />
                        <CheckBoxMaker
                          inline
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
                          inline
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
                          inline
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
                <Col xs={12} md={12}>
                  <Card body className="mb-3">
                    <Row>
                      <Col xs={12} md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            If Abuse , Neglected{" "}
                          </Form.Label>
                          <div className="radio-inline">
                            <CheckBoxMaker
                              inline
                              setValue={setAbuseNeglectInvolved}
                              value={true}
                              label="Yes"
                              id={"yes"}
                              checked={abuseNeglectInvolved === true}
                            />
                            <CheckBoxMaker
                              inline
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
                            State contacted{" "}
                          </Form.Label>
                          <div className="radio-inline">
                            <CheckBoxMaker
                              inline
                              setValue={setStateContacted}
                              value={true}
                              label="Yes"
                              id={"yes"}
                              checked={stateContacted === true}
                            />
                            <CheckBoxMaker
                              inline
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
                                If No, Explain{" "}
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
                  <Card body className="mb-3">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Notifications{" "}
                          </Form.Label>
                          <div className="d-flex flex-column d-flex justify-content-center">
                            <CheckBoxMaker
                              inline
                              setValue={setNotificationsFamily}
                              value={!notificationsFamily}
                              label="Family"
                              id={"Family"}
                              checked={notificationsFamily}
                              className="mb-4"
                            />
                            <CheckBoxMaker
                              inline
                              setValue={setNotificationsGuardian}
                              value={!notificationsGuardian}
                              label="Guardian"
                              id={"Guardian"}
                              checked={notificationsGuardian}
                              className="mb-4"
                            />
                            <CheckBoxMaker
                              inline
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
                                Time of Notification{" "}
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
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        {" "}
                        Mode of communication:
                      </Form.Label>
                      <div className="radio-inline">
                        <CheckBoxMaker
                          inline
                          setValue={setModeEmail}
                          value={!modeEmail}
                          label="Email"
                          id={"Email"}
                          checked={modeEmail}
                        />
                        <CheckBoxMaker
                          inline
                          setValue={setModePhoneCall}
                          value={!modePhoneCall}
                          label="Phone Call"
                          id={"PhoneCall"}
                          checked={modePhoneCall}
                        />
                        <CheckBoxMaker
                          inline
                          setValue={setModeInPerson}
                          value={!modeInPerson}
                          label="In Person"
                          id={"InPerson"}
                          checked={modeInPerson}
                        />
                        <CheckBoxMaker
                          inline
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
                        Report Completed By:{" "}
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
              <Row className="my-3">
                <Col xs={12}>
                  <Form.Label className="fw-bold">
                    Incident Reports Are to Be Completed and Forwarded Within 24
                    Hours of Incident to Administrator
                  </Form.Label>
                </Col>
              </Row>
            </>
          )}
          {(profileInfo.userType === ROLES.ADMIN ||
            (profileInfo.userType === ROLES.EMPLOYEE &&
              profileInfo.accountType === ACCOUNT_TYPES.ADMINISTRATOR)) && (
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
            </>
          )}

          <Row>
            <Col xs={12} md={6}>
              <Button
                type="button"
                className={`theme-button ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                onClick={() => setOpen1(true)}
              >
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} md={6}>
              {savedSignedPartA &&
                signedDate &&
                signatureFormat({
                  sign: savedSignedPartA,
                  date: signedDate,
                  time: signedTime,
                  hoursFormat,
                })}
              {adminSignature &&
                adminDateSigned &&
                signatureFormat({
                  sign: adminSignature,
                  date: adminDateSigned,
                  time: adminSignedTime,
                  hoursFormat,
                })}

              {signers &&
                signers?.map(
                  (signer, i) =>
                    signer.signature && (
                      <>
                        {signatureFormat({
                          sign: signer.signature,
                          date: signer.dateSigned,
                          time: signer.signedTime,
                          hoursFormat,
                        })}
                      </>
                    ),
                )}
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
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
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

          <div className="employee-btn-joiner mt-5">
            {detail?.data?.saveAsDraft && (
              <button
                className={`draft ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                type="submit"
                onClick={() => setSaveAsDraft(true)}
              >
                Save as Draft
              </button>
            )}
            <button
              className={`employee_create_btn ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
              type="submit"
              disabled={witnessIncomplete ? true : !isSubmitEnabled}
            >
              {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
            </button>
          </div>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: UpdateIncidentReport,
});
