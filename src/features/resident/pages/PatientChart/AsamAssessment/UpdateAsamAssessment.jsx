/* eslint-disable no-unused-vars */
/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { patientChartService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddSignature,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import { BorderlessInput } from "@/utils/Makers";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
const UpdateAsamAssessment = () => {
  const navigate = useNavigate();
  const url = useLocation().pathname;
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [dateOfAdmission, setDateOfAdmission] = useState("");
  const [dateOfDischarge, setDateOfDischarge] = useState("");
  const [bhpSignature, setBhpSignature] = useState("");
  const [bhpSignatureDateTime, setBhpSignatureDateTime] = useState("");
  const [openSigner, setOpenSigner] = useState(false);
  const [bhpTime, setBhpTime] = useState("");
  const { id } = useParams();
  const [data, setData] = useState({});
  const [signers, setSigners] = useState([]);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
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
  const [acuteIntoxication, setAcuteIntoxication] = useState([]);
  const [biomedicalConditions, setBiomedicalConditions] = useState([]);
  const [cognitiveConditions, setCognitiveConditions] = useState([]);
  const [readinessChange, setReadinessChange] = useState([]);
  const [problemPotential, setProblemPotential] = useState([]);
  const [livingEnvironment, setLivingEnvironment] = useState([]);
  const [asamScore, setAsamScore] = useState("");
  const [consumersFunctioningSeverity, setConsumersFunctioningSeverity] =
    useState("");
  const [residential, setResidential] = useState([]);
  const [comment, setComment] = useState("");
  const [
    acuteIntoxicationIntoxicatedWithdrawalsTextLine,
    setAcuteIntoxicationIntoxicatedWithdrawalsTextLine,
  ] = useState("");
  const [
    acuteIntoxicationNeedForMedicalMonitoringTextLine,
    setAcuteIntoxicationNeedForMedicalMonitoringTextLine,
  ] = useState("");
  const [
    acuteIntoxicationWithdrawalsymptomsTextLine,
    setAcuteIntoxicationWithdrawalsymptomsTextLine,
  ] = useState("");
  const [
    acuteIntoxicationSevereWithdrawalTextLine,
    setAcuteIntoxicationSevereWithdrawalTextLine,
  ] = useState("");
  const [
    biomedicalConditionsChronicMedicalConditionsTextLine,
    setBiomedicalConditionsChronicMedicalConditionsTextLine,
  ] = useState("");
  const [
    biomedicalConditionsClientreceivingTextLine,
    setBiomedicalConditionsClientreceivingTextLine,
  ] = useState("");
  const [
    biomedicalConditionsMedicalissuesTextLine,
    setBiomedicalConditionsMedicalissuesTextLine,
  ] = useState("");
  const [
    biomedicalConditionsCoordinationspecialistsTextLine,
    setBiomedicalConditionsCoordinationspecialistsTextLine,
  ] = useState("");
  const [
    cognitiveConditionsMentalhealthdiagnosesTextLine,
    setCognitiveConditionsMentalhealthdiagnosesTextLine,
  ] = useState("");
  const [
    cognitiveConditionsHarmtoselfTextLine,
    setCognitiveConditionsHarmtoselfTextLine,
  ] = useState("");
  const [
    cognitiveConditionsCognitiveimpairmentsaffectingTextLine,
    setCognitiveConditionsCognitiveimpairmentsaffectingTextLine,
  ] = useState("");
  const [
    cognitiveConditionsPsychiatricevaluationTextLine,
    setCognitiveConditionsPsychiatricevaluationTextLine,
  ] = useState("");
  const [
    readinessChangeStageofchangeTextLine,
    setReadinessChangeStageofchangeTextLine,
  ] = useState("");
  const [
    readinessChangeMotivationfortreatmentTextLine,
    setReadinessChangeMotivationfortreatmentTextLine,
  ] = useState("");
  const [
    readinessChangeAmbivalenceorresistanceTextLine,
    setReadinessChangeAmbivalenceorresistanceTextLine,
  ] = useState("");
  const [
    readinessChangeEnhanceengagementTextLine,
    setReadinessChangeEnhanceengagementTextLine,
  ] = useState("");
  const [
    problemPotentialContinueduseTextLine,
    setProblemPotentialContinueduseTextLine,
  ] = useState("");
  const [
    problemPotentialHighrisksituationsTextLine,
    setProblemPotentialHighrisksituationsTextLine,
  ] = useState("");
  const [
    problemPotentialPreventionstrategiesTextLine,
    setProblemPotentialPreventionstrategiesTextLine,
  ] = useState("");
  const [
    problemPotentialSupportormonitoringTextLine,
    setProblemPotentialSupportormonitoringTextLine,
  ] = useState("");
  const [
    livingEnvironmentHousingstabilitysafetyTextLine,
    setLivingEnvironmentHousingstabilitysafetyTextLine,
  ] = useState("");
  const [
    livingEnvironmentExposuretosubstanceuseTextLine,
    setLivingEnvironmentExposuretosubstanceuseTextLine,
  ] = useState("");
  const [
    livingEnvironmentSupportsystemTextLine,
    setLivingEnvironmentSupportsystemTextLine,
  ] = useState("");
  const [
    livingEnvironmentNeedforcasemanagementTextLine,
    setLivingEnvironmentNeedforcasemanagementTextLine,
  ] = useState("");
  const initialFormData = {
    patientId: data?.data?.patientId?._id,
    clientName,
    dateOfBirth,
    dateOfAdmission,
    dateOfDischarge,
    acuteIntoxication,
    acuteIntoxicationIntoxicatedWithdrawalsTextLine,
    acuteIntoxicationNeedForMedicalMonitoringTextLine,
    acuteIntoxicationWithdrawalsymptomsTextLine,
    acuteIntoxicationSevereWithdrawalTextLine,
    biomedicalConditions,
    biomedicalConditionsChronicMedicalConditionsTextLine,
    biomedicalConditionsClientreceivingTextLine,
    biomedicalConditionsMedicalissuesTextLine,
    biomedicalConditionsCoordinationspecialistsTextLine,
    cognitiveConditions,
    cognitiveConditionsMentalhealthdiagnosesTextLine,
    cognitiveConditionsHarmtoselfTextLine,
    cognitiveConditionsCognitiveimpairmentsaffectingTextLine,
    cognitiveConditionsPsychiatricevaluationTextLine,
    readinessChange,
    readinessChangeStageofchangeTextLine,
    readinessChangeMotivationfortreatmentTextLine,
    readinessChangeAmbivalenceorresistanceTextLine,
    readinessChangeEnhanceengagementTextLine,
    problemPotential,
    problemPotentialContinueduseTextLine,
    problemPotentialHighrisksituationsTextLine,
    problemPotentialPreventionstrategiesTextLine,
    problemPotentialSupportormonitoringTextLine,
    livingEnvironment,
    livingEnvironmentHousingstabilitysafetyTextLine,
    livingEnvironmentExposuretosubstanceuseTextLine,
    livingEnvironmentSupportsystemTextLine,
    livingEnvironmentNeedforcasemanagementTextLine,
    asamScore,
    consumersFunctioningSeverity,
    residential,
    comment,
    bhpSignature,
    bhpSignatureDateTime,
    saveAsDraft,
    adminSignature,
    adminDateSigned,
    signers,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    patientChartService.asam.update(id || data?.data[0]?._id, initialFormData, {
      setLoading,
      navigate,
    });
  };
  useEffect(() => {
    patientChartService.asam.getById(id, {
      // Resource services already wrap payload in { data: ... }.
      // This form expects that same shape (data?.data?.*).
      setResponse: setData,
    });
  }, [id, url]);
  useEffect(() => {
    const item = data?.data;
    if (item) {
      setDateOfDischarge(item?.dateOfDischarge);
      setClientName(item?.clientName);
      setDateOfBirth(item?.patientId?.dateOfBirth);
      setAhcccsId(item?.patientId?.ahcccsId);
      setDiagnosis(item?.patientId?.diagnosis);
      setDateOfAdmission(item?.patientId?.admitDate);
      setAcuteIntoxication(item?.acuteIntoxication);
      setAcuteIntoxicationIntoxicatedWithdrawalsTextLine(
        item?.acuteIntoxicationIntoxicatedWithdrawalsTextLine,
      );
      setAcuteIntoxicationNeedForMedicalMonitoringTextLine(
        item?.acuteIntoxicationNeedForMedicalMonitoringTextLine,
      );
      setAcuteIntoxicationWithdrawalsymptomsTextLine(
        item?.acuteIntoxicationWithdrawalsymptomsTextLine,
      );
      setAcuteIntoxicationSevereWithdrawalTextLine(
        item?.acuteIntoxicationSevereWithdrawalTextLine,
      );
      setBiomedicalConditions(item?.biomedicalConditions);
      setBiomedicalConditionsChronicMedicalConditionsTextLine(
        item?.biomedicalConditionsChronicMedicalConditionsTextLine,
      );
      setBiomedicalConditionsClientreceivingTextLine(
        item?.biomedicalConditionsClientreceivingTextLine,
      );
      setBiomedicalConditionsMedicalissuesTextLine(
        item?.biomedicalConditionsMedicalissuesTextLine,
      );
      setBiomedicalConditionsCoordinationspecialistsTextLine(
        item?.biomedicalConditionsCoordinationspecialistsTextLine,
      );
      setCognitiveConditions(item?.cognitiveConditions);
      setCognitiveConditionsMentalhealthdiagnosesTextLine(
        item?.cognitiveConditionsMentalhealthdiagnosesTextLine,
      );
      setCognitiveConditionsHarmtoselfTextLine(
        item?.cognitiveConditionsHarmtoselfTextLine,
      );
      setCognitiveConditionsCognitiveimpairmentsaffectingTextLine(
        item?.cognitiveConditionsCognitiveimpairmentsaffectingTextLine,
      );
      setCognitiveConditionsPsychiatricevaluationTextLine(
        item?.cognitiveConditionsPsychiatricevaluationTextLine,
      );
      setReadinessChange(item?.readinessChange);
      setReadinessChangeStageofchangeTextLine(
        item?.readinessChangeStageofchangeTextLine,
      );
      setReadinessChangeMotivationfortreatmentTextLine(
        item?.readinessChangeMotivationfortreatmentTextLine,
      );
      setReadinessChangeAmbivalenceorresistanceTextLine(
        item?.readinessChangeAmbivalenceorresistanceTextLine,
      );
      setReadinessChangeEnhanceengagementTextLine(
        item?.readinessChangeEnhanceengagementTextLine,
      );
      setProblemPotential(item?.problemPotential);
      setProblemPotentialContinueduseTextLine(
        item?.problemPotentialContinueduseTextLine,
      );
      setProblemPotentialHighrisksituationsTextLine(
        item?.problemPotentialHighrisksituationsTextLine,
      );
      setProblemPotentialPreventionstrategiesTextLine(
        item?.problemPotentialPreventionstrategiesTextLine,
      );
      setProblemPotentialSupportormonitoringTextLine(
        item?.problemPotentialSupportormonitoringTextLine,
      );
      setLivingEnvironment(item?.livingEnvironment);
      setLivingEnvironmentHousingstabilitysafetyTextLine(
        item?.livingEnvironmentHousingstabilitysafetyTextLine,
      );
      setLivingEnvironmentExposuretosubstanceuseTextLine(
        item?.livingEnvironmentExposuretosubstanceuseTextLine,
      );
      setLivingEnvironmentSupportsystemTextLine(
        item?.livingEnvironmentSupportsystemTextLine,
      );
      setLivingEnvironmentNeedforcasemanagementTextLine(
        item?.livingEnvironmentNeedforcasemanagementTextLine,
      );
      setAsamScore(item?.asamScore);
      setConsumersFunctioningSeverity(item?.consumersFunctioningSeverity);
      setResidential(item?.residential || []);
      setComment(item?.comment);
      setBhpSignature(item?.bhpSignature);
      setBhpSignatureDateTime(item?.bhpSignatureDateTime);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setSigners(item?.signers);
    }
  }, [data, url]);
  useEffect(() => {
    if (!data?.data) return;
    if (data?.data) {
      const { saveAsDraft, signers } = data.data;
      const { _id, userType, accountType, userPermissions } = profileInfo;
      const isSigner = signers?.findIndex?.(
        (signer, i) => signer.signerId === _id,
      );
      const isEmployeeRegular =
        userType === ROLES.EMPLOYEE && accountType === ACCOUNT_TYPES.REGULAR;
      const isEmployeeRestricted =
        userType === ROLES.EMPLOYEE && accountType === ACCOUNT_TYPES.RESTRICTED;
      const cannotEditDocument = !userPermissions?.edit
        ?.split(":")
        .includes("discharge");
      const isSignerFound = isSigner !== -1;
      const isSignerNotFound = isSigner === -1;

      const isRegularSignerWithoutEdit =
        isEmployeeRegular && cannotEditDocument && isSignerFound;
      const isRestrictedSigner = isEmployeeRestricted && isSignerFound;
      const isNotEditableSigner =
        isRegularSignerWithoutEdit || isRestrictedSigner;

      const isRegularNonSignerWithoutEdit =
        isEmployeeRegular && cannotEditDocument && isSignerNotFound;
      const isRestrictedNonSigner = isEmployeeRestricted && isSignerNotFound;

      const isSaveAsDraftWithSigner = saveAsDraft && isNotEditableSigner;
      setSaveAsDrafIsNotEditable(isSaveAsDraftWithSigner);

      const isSaveAsDraftWithoutSigner =
        saveAsDraft && (isRegularNonSignerWithoutEdit || isRestrictedNonSigner);
      setSaveAsDrafIsNotEditableWithoutSigner(isSaveAsDraftWithoutSigner);

      setIsNotEditableWithSigner(isNotEditableSigner);
    }
  }, [
    data?.data,
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
      (data?.data?.employeeId === profileInfo?._id ||
        data?.data?.employeeId?._id === profileInfo?._id) &&
      bhpSignature?.length > 0;
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
    data?.data?.employeeId,
    bhpSignature?.length,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [bhpSignature, adminSignature, id, checkSign]);
  const checkboxHandler = (value, name) => {
    if (name === "acuteIntoxication") {
      setAcuteIntoxication((prev) => {
        if (prev.includes(value)) return prev.filter((item) => item !== value);
        else return [...prev, value];
      });
    }
    if (name === "biomedicalConditions") {
      setBiomedicalConditions((prev) => {
        if (prev.includes(value)) return prev.filter((item) => item !== value);
        else return [...prev, value];
      });
    }
    if (name === "cognitiveConditions") {
      setCognitiveConditions((prev) => {
        if (prev.includes(value)) return prev.filter((item) => item !== value);
        else return [...prev, value];
      });
    }
    if (name === "readinessChange") {
      setReadinessChange((prev) => {
        if (prev.includes(value)) return prev.filter((item) => item !== value);
        else return [...prev, value];
      });
    }
    if (name === "problemPotential") {
      setProblemPotential((prev) => {
        if (prev.includes(value)) return prev.filter((item) => item !== value);
        else return [...prev, value];
      });
    }
    if (name === "livingEnvironment") {
      setLivingEnvironment((prev) => {
        if (prev.includes(value)) return prev.filter((item) => item !== value);
        else return [...prev, value];
      });
    }
    if (name === "residential") {
      setResidential((prev) => {
        if (prev.includes(value)) return prev.filter((item) => item !== value);
        else return [...prev, value];
      });
    }
  };
  let signerIndex = signers?.findIndex?.(
    (signer, i) =>
      signer.signerId === profileInfo._id ||
      profileInfo?.patientsAssigned?.includes(signer.signerId),
  );
  if (signerIndex === undefined || signerIndex === null) signerIndex = -1;
  function setSignerSignature(sign) {
    if (signerIndex !== -1)
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          signature: sign,
        };
        return newSigners;
      });
  }
  function setSignerDate(date) {
    if (signerIndex !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          dateSigned: date,
        };
        return newSigners;
      });
    }
  }
  function setSignerTime(time) {
    if (signerIndex !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          signedTime: time,
        };
        return newSigners;
      });
    }
  }
  const editSignHandler = (sign) => {
    if (
      signers?.[signerIndex]?.signerId === profileInfo?._id ||
      profileInfo?.patientsAssigned?.includes(signers?.[signerIndex]?.signerId)
    ) {
      setSignerSignature(sign);
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
    if (
      signers?.[signerIndex]?.signerId === profileInfo?._id ||
      profileInfo?.patientsAssigned?.includes(signers?.[signerIndex]?.signerId)
    ) {
      setSignerDate(date);
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
    if (
      signers?.[signerIndex]?.signerId === profileInfo?._id ||
      profileInfo?.patientsAssigned?.includes(signers?.[signerIndex]?.signerId)
    ) {
      setSignerTime(time);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setBhpTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };
  return (
    <>
      <AddSignature
        show={openSigner}
        setValue={(sign) =>
          data?.data?.employeeId === profileInfo?._id ||
          profileInfo?.patientsAssigned?.includes(data?.data?.employeeId)
            ? setBhpSignature(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          data?.data?.employeeId === profileInfo?._id ||
          profileInfo?.patientsAssigned?.includes(data?.data?.employeeId)
            ? setBhpSignatureDateTime(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          data?.data?.employeeId === profileInfo?._id ||
          profileInfo?.patientsAssigned?.includes(data?.data?.employeeId)
            ? setBhpTime(time)
            : editTimeHandler(time)
        }
      />
      <NavWrapper
        title={"ASAM Criteria Checklist for Assessment"}
        isArrow={true}
      />
      <Container>
        <Form onSubmit={submitHandler}>
          <Card
            body
            className={`mb-2 mb-md-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Resident Name :</Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    disabled
                    type="text"
                    value={
                      clientName
                        ? clientName
                        : fetchPaitentName(data?.data?.patientId)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Card
            body
            className={`mb-2 mb-md-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Row>
              <Col col={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
                  <Form.Control
                    disabled
                    onChange={(e) => setAhcccsId(e.target.value)}
                    type="text"
                    value={ahcccsId && ahcccsId}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
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
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          dateOfAdmission
                            ? formatDateToMMDDYYYY(dateOfAdmission)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Date of Discharge</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(dateOfDischarge)}
                    onChange={(selectedDate) =>
                      setDateOfDischarge(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          dateOfDischarge
                            ? formatDateToMMDDYYYY(dateOfDischarge)
                            : new Date(),
                        ],
                      },
                    ]}
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none form-control"
                        : "form-control"
                    }
                    disabled={url === "/create-asam-assessment-resident"}
                  />
                </Form.Group>
              </Col>
              <Col col={12} md={6} lg={4}>
                <Form.Group className="mb-3 ">
                  <Form.Label className="fw-bold">
                    Diagnosis (specify if new or continuing)
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setDiagnosis(e.target.value)}
                    type="text"
                    value={diagnosis && diagnosis}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Card
            body
            className={
              profileInfo?.userType === ROLES.PATIENT ||
              profileInfo?.userType === ROLES.GUARDIAN
                ? "pe-none mb-3"
                : "mb-3"
            }
          >
            <div className="flex flex-column">
              <Form.Label className="fw-bold mb-3">Dimension 1</Form.Label>
              <Form.Label className="fw-bold">Acute intoxication</Form.Label>
            </div>
            <div className="radio-inline">
              <div className="flex gap-12">
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label=" Is the client currently intoxicated or in withdrawals"
                    type="checkbox"
                    id="intoxicatedWithdrawals"
                    checked={acuteIntoxication?.includes(
                      "intoxicatedWithdrawals",
                    )}
                    onChange={() =>
                      checkboxHandler(
                        "intoxicatedWithdrawals",
                        "acuteIntoxication",
                      )
                    }
                  />
                  {acuteIntoxication?.includes("intoxicatedWithdrawals") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="acuteIntoxicationIntoxicatedWithdrawalsTextLine"
                      value={acuteIntoxicationIntoxicatedWithdrawalsTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setAcuteIntoxicationIntoxicatedWithdrawalsTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="History of substance use and withdrawal symptoms?"
                    type="checkbox"
                    id="withdrawalsymptoms"
                    checked={acuteIntoxication?.includes("withdrawalsymptoms")}
                    onChange={() =>
                      checkboxHandler("withdrawalsymptoms", "acuteIntoxication")
                    }
                  />
                  {acuteIntoxication?.includes("withdrawalsymptoms") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="acuteIntoxicationWithdrawalsymptomsTextLine"
                      value={acuteIntoxicationWithdrawalsymptomsTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setAcuteIntoxicationWithdrawalsymptomsTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Risk of severe withdrawal (e.g., seizures, DTs)?"
                    type="checkbox"
                    id="severeWithdrawal"
                    checked={acuteIntoxication?.includes("severeWithdrawal")}
                    onChange={() =>
                      checkboxHandler("severeWithdrawal", "acuteIntoxication")
                    }
                  />
                  {acuteIntoxication?.includes("severeWithdrawal") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="acuteIntoxicationSevereWithdrawalTextLine"
                      value={acuteIntoxicationSevereWithdrawalTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setAcuteIntoxicationSevereWithdrawalTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-12">
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Need for medical monitoring or detox services?"
                    type="checkbox"
                    id="needForMedicalMonitoring"
                    checked={acuteIntoxication?.includes(
                      "needForMedicalMonitoring",
                    )}
                    onChange={() =>
                      checkboxHandler(
                        "needForMedicalMonitoring",
                        "acuteIntoxication",
                      )
                    }
                  />
                  {acuteIntoxication?.includes("needForMedicalMonitoring") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="acuteIntoxicationNeedForMedicalMonitoringTextLine"
                      value={acuteIntoxicationNeedForMedicalMonitoringTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setAcuteIntoxicationNeedForMedicalMonitoringTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card
            body
            className={
              profileInfo?.userType === ROLES.PATIENT ||
              profileInfo?.userType === ROLES.GUARDIAN
                ? "pe-none mb-3"
                : "mb-3"
            }
          >
            <div className="flex flex-column">
              <Form.Label className="fw-bold mb-3">Dimension 2</Form.Label>
              <Form.Label className="fw-bold">
                Biomedical Conditions and Complications
              </Form.Label>
            </div>
            <div className="radio-inline">
              <div className="flex gap-12">
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Any chronic or acute medical conditions?"
                    type="checkbox"
                    id="chronicMedicalConditions"
                    checked={biomedicalConditions?.includes(
                      "chronicMedicalConditions",
                    )}
                    onChange={() =>
                      checkboxHandler(
                        "chronicMedicalConditions",
                        "biomedicalConditions",
                      )
                    }
                  />
                  {biomedicalConditions?.includes(
                    "chronicMedicalConditions",
                  ) && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="biomedicalConditionsChronicMedicalConditionsTextLine"
                      value={
                        biomedicalConditionsChronicMedicalConditionsTextLine
                      }
                      placeholder="Enter text"
                      onChange={(e) =>
                        setBiomedicalConditionsChronicMedicalConditionsTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Is the client receiving medical care?"
                    type="checkbox"
                    id="clientreceiving"
                    checked={biomedicalConditions?.includes("clientreceiving")}
                    onChange={() =>
                      checkboxHandler("clientreceiving", "biomedicalConditions")
                    }
                  />
                  {biomedicalConditions?.includes("clientreceiving") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="biomedicalConditionsClientreceivingTextLine"
                      value={biomedicalConditionsClientreceivingTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setBiomedicalConditionsClientreceivingTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Are medical issues impacting substance use or recovery?"
                    type="checkbox"
                    id="medicalissues"
                    checked={biomedicalConditions?.includes("medicalissues")}
                    onChange={() =>
                      checkboxHandler("medicalissues", "biomedicalConditions")
                    }
                  />
                  {biomedicalConditions?.includes("medicalissues") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="biomedicalConditionsMedicalissuesTextLine"
                      value={biomedicalConditionsMedicalissuesTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setBiomedicalConditionsMedicalissuesTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-12">
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Need for coordination with Primary Care Physician or specialists?"
                    type="checkbox"
                    id="coordinationspecialists"
                    checked={biomedicalConditions?.includes(
                      "coordinationspecialists",
                    )}
                    onChange={() =>
                      checkboxHandler(
                        "coordinationspecialists",
                        "biomedicalConditions",
                      )
                    }
                  />
                  {biomedicalConditions?.includes(
                    "coordinationspecialists",
                  ) && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="biomedicalConditionsCoordinationspecialistsTextLine"
                      value={
                        biomedicalConditionsCoordinationspecialistsTextLine
                      }
                      placeholder="Enter text"
                      onChange={(e) =>
                        setBiomedicalConditionsCoordinationspecialistsTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card
            body
            className={
              profileInfo?.userType === ROLES.PATIENT ||
              profileInfo?.userType === ROLES.GUARDIAN
                ? "pe-none mb-3"
                : "mb-3"
            }
          >
            <div className="flex flex-column">
              <Form.Label className="fw-bold mb-3">Dimension 3</Form.Label>
              <Form.Label className="fw-bold">
                Emotional, Behavioral, or Cognitive Conditions and Complications
              </Form.Label>
            </div>
            <div className="radio-inline">
              <div className="flex gap-12">
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Current mental health diagnoses or symptoms?"
                    type="checkbox"
                    id="mentalhealthdiagnoses"
                    checked={cognitiveConditions?.includes(
                      "mentalhealthdiagnoses",
                    )}
                    onChange={() =>
                      checkboxHandler(
                        "mentalhealthdiagnoses",
                        "cognitiveConditions",
                      )
                    }
                  />
                  {cognitiveConditions?.includes("mentalhealthdiagnoses") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="cognitiveConditionsMentalhealthdiagnosesTextLine"
                      value={cognitiveConditionsMentalhealthdiagnosesTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setCognitiveConditionsMentalhealthdiagnosesTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Risk of harm to self or others?"
                    type="checkbox"
                    id="harmtoself"
                    checked={cognitiveConditions?.includes("harmtoself")}
                    onChange={() =>
                      checkboxHandler("harmtoself", "cognitiveConditions")
                    }
                  />
                  {cognitiveConditions?.includes("harmtoself") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="cognitiveConditionsHarmtoselfTextLine"
                      value={cognitiveConditionsHarmtoselfTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setCognitiveConditionsHarmtoselfTextLine(e.target.value)
                      }
                    />
                  )}
                </div>
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Cognitive impairments affecting treatment engagement?"
                    type="checkbox"
                    id="cognitiveimpairmentsaffecting"
                    checked={cognitiveConditions?.includes(
                      "cognitiveimpairmentsaffecting",
                    )}
                    onChange={() =>
                      checkboxHandler(
                        "cognitiveimpairmentsaffecting",
                        "cognitiveConditions",
                      )
                    }
                  />
                  {cognitiveConditions?.includes(
                    "cognitiveimpairmentsaffecting",
                  ) && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="cognitiveConditionsCognitiveimpairmentsaffectingTextLine"
                      value={
                        cognitiveConditionsCognitiveimpairmentsaffectingTextLine
                      }
                      placeholder="Enter text"
                      onChange={(e) =>
                        setCognitiveConditionsCognitiveimpairmentsaffectingTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-12">
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Need for psychiatric evaluation or stabilization?"
                    type="checkbox"
                    id="psychiatricevaluation"
                    checked={cognitiveConditions?.includes(
                      "psychiatricevaluation",
                    )}
                    onChange={() =>
                      checkboxHandler(
                        "psychiatricevaluation",
                        "cognitiveConditions",
                      )
                    }
                  />
                  {cognitiveConditions?.includes("psychiatricevaluation") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="cognitiveConditionsPsychiatricevaluationTextLine"
                      value={cognitiveConditionsPsychiatricevaluationTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setCognitiveConditionsPsychiatricevaluationTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card
            body
            className={
              profileInfo?.userType === ROLES.PATIENT ||
              profileInfo?.userType === ROLES.GUARDIAN
                ? "pe-none mb-3"
                : "mb-3"
            }
          >
            <div className="flex flex-column">
              <Form.Label className="fw-bold mb-3">Dimension 4</Form.Label>
              <Form.Label className="fw-bold">Readiness to Change</Form.Label>
            </div>
            <div className="radio-inline">
              <div className="flex gap-12">
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Client’s stage of change (Precontemplation → Maintenance)?"
                    type="checkbox"
                    id="stageofchange"
                    checked={readinessChange?.includes("stageofchange")}
                    onChange={() =>
                      checkboxHandler("stageofchange", "readinessChange")
                    }
                  />
                  {readinessChange?.includes("stageofchange") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="readinessChangeStageofchangeTextLine"
                      value={readinessChangeStageofchangeTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setReadinessChangeStageofchangeTextLine(e.target.value)
                      }
                    />
                  )}
                </div>
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Motivation for treatment?"
                    type="checkbox"
                    id="motivationfortreatment"
                    checked={readinessChange?.includes(
                      "motivationfortreatment",
                    )}
                    onChange={() =>
                      checkboxHandler(
                        "motivationfortreatment",
                        "readinessChange",
                      )
                    }
                  />
                  {readinessChange?.includes("motivationfortreatment") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="readinessChangeMotivationfortreatmentTextLine"
                      value={readinessChangeMotivationfortreatmentTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setReadinessChangeMotivationfortreatmentTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Ambivalence or resistance noted?"
                    type="checkbox"
                    id="ambivalenceorresistance"
                    checked={readinessChange?.includes(
                      "ambivalenceorresistance",
                    )}
                    onChange={() =>
                      checkboxHandler(
                        "ambivalenceorresistance",
                        "readinessChange",
                      )
                    }
                  />
                  {readinessChange?.includes("ambivalenceorresistance") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="readinessChangeAmbivalenceorresistanceTextLine"
                      value={readinessChangeAmbivalenceorresistanceTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setReadinessChangeAmbivalenceorresistanceTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-12">
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Strategies to enhance engagement?"
                    type="checkbox"
                    id="enhanceengagement"
                    checked={readinessChange?.includes("enhanceengagement")}
                    onChange={() =>
                      checkboxHandler("enhanceengagement", "readinessChange")
                    }
                  />
                  {readinessChange?.includes("enhanceengagement") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="readinessChangeEnhanceengagementTextLine"
                      value={readinessChangeEnhanceengagementTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setReadinessChangeEnhanceengagementTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card
            body
            className={
              profileInfo?.userType === ROLES.PATIENT ||
              profileInfo?.userType === ROLES.GUARDIAN
                ? "pe-none mb-3"
                : "mb-3"
            }
          >
            <div className="flex flex-column">
              <Form.Label className="fw-bold mb-3">Dimension 5</Form.Label>
              <Form.Label className="fw-bold">
                Relapse, Continued Use, or Continued Problem Potential
              </Form.Label>
            </div>
            <div className="radio-inline">
              <div className="flex gap-12">
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="History of relapse or continued use?"
                    type="checkbox"
                    id="continueduse"
                    checked={problemPotential?.includes("continueduse")}
                    onChange={() =>
                      checkboxHandler("continueduse", "problemPotential")
                    }
                  />
                  {problemPotential?.includes("continueduse") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="problemPotentialContinueduseTextLine"
                      value={problemPotentialContinueduseTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setProblemPotentialContinueduseTextLine(e.target.value)
                      }
                    />
                  )}
                </div>
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Triggers and high-risk situations?"
                    type="checkbox"
                    id="highrisksituations"
                    checked={problemPotential?.includes("highrisksituations")}
                    onChange={() =>
                      checkboxHandler("highrisksituations", "problemPotential")
                    }
                  />
                  {problemPotential?.includes("highrisksituations") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="problemPotentialHighrisksituationsTextLine"
                      value={problemPotentialHighrisksituationsTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setProblemPotentialHighrisksituationsTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Coping skills and relapse prevention strategies?"
                    type="checkbox"
                    id="preventionstrategies"
                    checked={problemPotential?.includes("preventionstrategies")}
                    onChange={() =>
                      checkboxHandler(
                        "preventionstrategies",
                        "problemPotential",
                      )
                    }
                  />
                  {problemPotential?.includes("preventionstrategies") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="problemPotentialPreventionstrategiesTextLine"
                      value={problemPotentialPreventionstrategiesTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setProblemPotentialPreventionstrategiesTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-12">
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Need for structured support or monitoring?"
                    type="checkbox"
                    id="supportormonitoring"
                    checked={problemPotential?.includes("supportormonitoring")}
                    onChange={() =>
                      checkboxHandler("supportormonitoring", "problemPotential")
                    }
                  />
                  {problemPotential?.includes("supportormonitoring") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="problemPotentialSupportormonitoringTextLine"
                      value={problemPotentialSupportormonitoringTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setProblemPotentialSupportormonitoringTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>
          <Card
            body
            className={
              profileInfo?.userType === ROLES.PATIENT ||
              profileInfo?.userType === ROLES.GUARDIAN
                ? "pe-none mb-3"
                : "mb-3"
            }
          >
            <div className="flex flex-column">
              <Form.Label className="fw-bold mb-3">Dimension 6</Form.Label>
              <Form.Label className="fw-bold">
                Recovery/Living Environment
              </Form.Label>
            </div>
            <div className="radio-inline">
              <div className="flex gap-12">
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Housing stability and safety?"
                    type="checkbox"
                    id="housingstabilitysafety"
                    checked={livingEnvironment?.includes(
                      "housingstabilitysafety",
                    )}
                    onChange={() =>
                      checkboxHandler(
                        "housingstabilitysafety",
                        "livingEnvironment",
                      )
                    }
                  />
                  {livingEnvironment?.includes("housingstabilitysafety") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="livingEnvironmentHousingstabilitysafetyTextLine"
                      value={livingEnvironmentHousingstabilitysafetyTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setLivingEnvironmentHousingstabilitysafetyTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Exposure to substance use in home/community?"
                    type="checkbox"
                    id="exposuretosubstanceuse"
                    checked={livingEnvironment?.includes(
                      "exposuretosubstanceuse",
                    )}
                    onChange={() =>
                      checkboxHandler(
                        "exposuretosubstanceuse",
                        "livingEnvironment",
                      )
                    }
                  />
                  {livingEnvironment?.includes("exposuretosubstanceuse") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="livingEnvironmentExposuretosubstanceuseTextLine"
                      value={livingEnvironmentExposuretosubstanceuseTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setLivingEnvironmentExposuretosubstanceuseTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
                <div>
                  {" "}
                  <Form.Check
                    inline
                    label="Support system (family, peers, providers)?"
                    type="checkbox"
                    id="supportsystem"
                    checked={livingEnvironment?.includes("supportsystem")}
                    onChange={() =>
                      checkboxHandler("supportsystem", "livingEnvironment")
                    }
                  />
                  {livingEnvironment?.includes("supportsystem") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="livingEnvironmentSupportsystemTextLine"
                      value={livingEnvironmentSupportsystemTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setLivingEnvironmentSupportsystemTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-12">
                <div>
                  <Form.Check
                    inline
                    label="Need for case management or residential placement?"
                    type="checkbox"
                    id="needforcasemanagement"
                    checked={livingEnvironment?.includes(
                      "needforcasemanagement",
                    )}
                    onChange={() =>
                      checkboxHandler(
                        "needforcasemanagement",
                        "livingEnvironment",
                      )
                    }
                  />
                  {livingEnvironment?.includes("needforcasemanagement") && (
                    <Form.Control
                      as="textarea"
                      rows={1}
                      id="livingEnvironmentNeedforcasemanagementTextLine"
                      value={livingEnvironmentNeedforcasemanagementTextLine}
                      placeholder="Enter text"
                      onChange={(e) =>
                        setLivingEnvironmentNeedforcasemanagementTextLine(
                          e.target.value,
                        )
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card
            body
            className={
              profileInfo?.userType === ROLES.PATIENT ||
              profileInfo?.userType === ROLES.GUARDIAN
                ? "pe-none mb-3"
                : "mb-3"
            }
          >
            <Form.Group>
              <Form.Label className="fw-bold">ASAM SCORE: </Form.Label>
              <Form.Control
                type="text"
                id="asamScore"
                value={asamScore}
                placeholder="Enter text"
                required
                onChange={(e) => setAsamScore(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
          <Row>
            <Col>
              Level of Care/Service Indicated by ASAM: The following ASAM level
              of care offers the most appropriate level of care/service
            </Col>
          </Row>
          <Card
            body
            className={
              profileInfo?.userType === ROLES.PATIENT ||
              profileInfo?.userType === ROLES.GUARDIAN
                ? "pe-none mb-3"
                : "mb-3"
            }
          >
            <Form.Group>
              <Form.Label className="fw-bold">
                intensity given the consumer’s functioning/severity:{" "}
              </Form.Label>
              <Form.Control
                type="text"
                id="consumersFunctioningSeverity"
                value={consumersFunctioningSeverity}
                placeholder="Enter text"
                required
                onChange={(e) =>
                  setConsumersFunctioningSeverity(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-bold">Residential:</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="3.1"
                  type="checkbox"
                  id="score31"
                  checked={residential?.includes("score31")}
                  onChange={() => checkboxHandler("score31", "residential")}
                />
                <Form.Check
                  inline
                  label="3.3"
                  type="checkbox"
                  id="score33"
                  checked={residential?.includes("score33")}
                  onChange={() => checkboxHandler("score33", "residential")}
                />
                <Form.Check
                  inline
                  label="3.5"
                  type="checkbox"
                  id="score35"
                  checked={residential?.includes("score35")}
                  onChange={() => checkboxHandler("score35", "residential")}
                />
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                as="textarea"
                id="consumersFunctioningSeverity"
                value={comment}
                placeholder="Enter text"
                required
                onChange={(e) => setComment(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>

          <Row
            className={`${saveAsDrafIsNotEditableWithoutSigner && "pe-none"}`}
          >
            <Col xs={12} md={12} lg={6}>
              <Button
                type="button"
                onClick={() => setOpenSigner(true)}
                className="theme-button"
              >
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <div>
                {signatureFormat({
                  sign: bhpSignature,
                  date: bhpSignatureDateTime,
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
              {signers?.map(
                (signer) =>
                  signer.signature && (
                    <div key={signer?.signerId}>
                      {signatureFormat({
                        sign: signer.signature,
                        date: signer.dateSigned,
                        time: signer.signedTime,
                        hoursFormat,
                      })}
                    </div>
                  ),
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="employee-btn-joiner mt-3 mt-md-4">
                {data?.data?.saveAsDraft && (
                  <button
                    className={`draft ${saveAsDrafIsNotEditableWithoutSigner && "pe-none"}`}
                    type="submit"
                    onClick={() => setSaveAsDraft(true)}
                  >
                    Save as Draft
                  </button>
                )}
                <button
                  className="employee_create_btn hidePrint mt-5"
                  type="submit"
                  disabled={!isSubmitEnabled}
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
  Wcomponenet: UpdateAsamAssessment,
});
