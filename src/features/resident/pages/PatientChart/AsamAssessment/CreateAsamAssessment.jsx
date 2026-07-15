/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import {
  patientChartService,
  patientService,
} from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { BorderlessInput } from "@/utils/Makers";
import { ROLES } from "@/features/shared/constants";
import { logger } from "@/utils";
const CreateAsamAssessment = () => {
  const navigate = useNavigate();
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [data, setData] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [dateOfAdmission, setDateOfAdmission] = useState("");
  const [dateOfDischarge, setDateOfDischarge] = useState("");
  const [bhpSignature, setBhpSignature] = useState("");
  const [bhpSignatureDateTime, setBhpSignatureDateTime] = useState("");
  const [open3, setOpen3] = useState(false);
  const [patientDetail, setPatientDetail] = useState({});
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [signers, setSigners] = useState([]);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [openAdmin, setAdminOpen] = useState(false);
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
  useEffect(() => {
    if (patientId) {
      patientChartService.asam.getByPatientId(patientId, {
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
    } else if (data?.data) {
      populateData = data.data;
    }
    if (populateData) {
      setDateOfDischarge(populateData?.dateOfDischarge);
      setAcuteIntoxication(populateData?.acuteIntoxication);
      setAcuteIntoxicationIntoxicatedWithdrawalsTextLine(
        populateData?.acuteIntoxicationIntoxicatedWithdrawalsTextLine,
      );
      setAcuteIntoxicationNeedForMedicalMonitoringTextLine(
        populateData?.acuteIntoxicationNeedForMedicalMonitoringTextLine,
      );
      setAcuteIntoxicationWithdrawalsymptomsTextLine(
        populateData?.acuteIntoxicationWithdrawalsymptomsTextLine,
      );
      setAcuteIntoxicationSevereWithdrawalTextLine(
        populateData?.acuteIntoxicationSevereWithdrawalTextLine,
      );
      setBiomedicalConditions(populateData?.biomedicalConditions);
      setBiomedicalConditionsChronicMedicalConditionsTextLine(
        populateData?.biomedicalConditionsChronicMedicalConditionsTextLine,
      );
      setBiomedicalConditionsClientreceivingTextLine(
        populateData?.biomedicalConditionsClientreceivingTextLine,
      );
      setBiomedicalConditionsMedicalissuesTextLine(
        populateData?.biomedicalConditionsMedicalissuesTextLine,
      );
      setBiomedicalConditionsCoordinationspecialistsTextLine(
        populateData?.biomedicalConditionsCoordinationspecialistsTextLine,
      );
      setCognitiveConditions(populateData?.cognitiveConditions);
      setCognitiveConditionsMentalhealthdiagnosesTextLine(
        populateData?.cognitiveConditionsMentalhealthdiagnosesTextLine,
      );
      setCognitiveConditionsHarmtoselfTextLine(
        populateData?.cognitiveConditionsHarmtoselfTextLine,
      );
      setCognitiveConditionsCognitiveimpairmentsaffectingTextLine(
        populateData?.cognitiveConditionsCognitiveimpairmentsaffectingTextLine,
      );
      setCognitiveConditionsPsychiatricevaluationTextLine(
        populateData?.cognitiveConditionsPsychiatricevaluationTextLine,
      );
      setReadinessChange(populateData?.readinessChange);
      setReadinessChangeStageofchangeTextLine(
        populateData?.readinessChangeStageofchangeTextLine,
      );
      setReadinessChangeMotivationfortreatmentTextLine(
        populateData?.readinessChangeMotivationfortreatmentTextLine,
      );
      setReadinessChangeAmbivalenceorresistanceTextLine(
        populateData?.readinessChangeAmbivalenceorresistanceTextLine,
      );
      setReadinessChangeEnhanceengagementTextLine(
        populateData?.readinessChangeEnhanceengagementTextLine,
      );
      setProblemPotential(populateData?.problemPotential);
      setProblemPotentialContinueduseTextLine(
        populateData?.problemPotentialContinueduseTextLine,
      );
      setProblemPotentialHighrisksituationsTextLine(
        populateData?.problemPotentialHighrisksituationsTextLine,
      );
      setProblemPotentialPreventionstrategiesTextLine(
        populateData?.problemPotentialPreventionstrategiesTextLine,
      );
      setProblemPotentialSupportormonitoringTextLine(
        populateData?.problemPotentialSupportormonitoringTextLine,
      );
      setLivingEnvironment(populateData?.livingEnvironment);
      setLivingEnvironmentHousingstabilitysafetyTextLine(
        populateData?.livingEnvironmentHousingstabilitysafetyTextLine,
      );
      setLivingEnvironmentExposuretosubstanceuseTextLine(
        populateData?.livingEnvironmentExposuretosubstanceuseTextLine,
      );
      setLivingEnvironmentSupportsystemTextLine(
        populateData?.livingEnvironmentSupportsystemTextLine,
      );
      setLivingEnvironmentNeedforcasemanagementTextLine(
        populateData?.livingEnvironmentNeedforcasemanagementTextLine,
      );
      setAsamScore(populateData?.asamScore);
      setConsumersFunctioningSeverity(
        populateData?.consumersFunctioningSeverity,
      );
      setResidential(populateData?.residential || []);
      setComment(populateData?.comment);
    } else {
    }
  }, [data, patientId, profile._id]);
  const initialFormData = {
    patientId,
    dateOfDischarge,
    clientName,
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
    saveAsDraft,
    bhpSignature,
    bhpSignatureDateTime,
    adminSignature,
    adminDateSigned,
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
    patientChartService.asam.post(initialFormData, { setLoading, navigate });
  };
  useEffect(() => {
    if (patientDetail) {
      setAhcccsId(patientDetail?.ahcccsId);
      setDateOfAdmission(patientDetail?.admitDate);
      setDiagnosis(patientDetail?.diagnosis);
    }
  }, [patientDetail]);
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
  return (
    <>
      <AddSignature
        show={open3}
        setValue={setBhpSignature}
        setDate={setBhpSignatureDateTime}
      />
      <AddSignature
        show={openAdmin}
        setValue={setAdminSignature}
        setDate={setAdminDateSigned}
        setTime={setAdminSignedTime}
      />
      <NavWrapper
        title={"ASAM Criteria Checklist for Assessment"}
        isArrow={true}
      />
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
                <Col xs={12} md={6} lg={4}>
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
              </Row>
            </Card.Body>
          </Card>

          <Card body className="mb-3 ">
            <div className="flex flex-column">
              <Form.Label className="fw-bold mb-3">Dimension 1</Form.Label>
              <Form.Label className="fw-bold">Acute intoxication</Form.Label>
            </div>
            <div className="radio-inline">
              <div className="flex gap-12">
                <div>
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
              <div className="flex">
                <div>
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

          <Card body className="mb-3 ">
            <div className="flex flex-column">
              <Form.Label className="fw-bold mb-3">Dimension 2</Form.Label>
              <Form.Label className="fw-bold">
                Biomedical Conditions and Complications
              </Form.Label>
            </div>
            <div className="radio-inline">
              <div className="flex gap-12">
                <div>
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

          <Card body className="mb-3 ">
            <div className="flex flex-column">
              <Form.Label className="fw-bold mb-3">Dimension 3</Form.Label>
              <Form.Label className="fw-bold">
                Emotional, Behavioral, or Cognitive Conditions and Complications
              </Form.Label>
            </div>
            <div className="radio-inline">
              <div className="flex gap-12">
                <div>
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

          <Card body className="mb-3 ">
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

          <Card body className="mb-3 ">
            <div className="flex flex-column">
              <Form.Label className="fw-bold mb-3">Dimension 5</Form.Label>
            </div>
            <Form.Label className="fw-bold">
              Relapse, Continued Use, or Continued Problem Potential
            </Form.Label>
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
          <Card body className="mb-3 ">
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
                  {" "}
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

          <Card body className="mb-3">
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
          <Card body className="mb-3">
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
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div className="custome-cloud-btn">
                <div className="btns">
                  <Button
                    type="button"
                    onClick={() =>
                      profile.userType === ROLES.ADMIN
                        ? setAdminOpen(true)
                        : setOpen3(true)
                    }
                    className="theme-button"
                  >
                    {" "}
                    SAVED AND SIGNED
                  </Button>
                </div>
                <div>
                  {signatureFormat({
                    sign: bhpSignature,
                    date: bhpSignatureDateTime,
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
          <Row className="mb-2 mb-md-3">
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
                  disabled={
                    profile.userType === ROLES.ADMIN
                      ? false
                      : bhpSignature?.length === 0
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
  Wcomponenet: CreateAsamAssessment,
});
