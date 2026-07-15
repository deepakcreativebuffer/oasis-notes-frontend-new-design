/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { patientChartService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { DISCHARGE_PLANNING_OPTIONS } from "@/features/shared/constants";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { BorderlessInput } from "@/utils/Makers";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import { ROLES } from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
const CreateDischargePlannning = () => {
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
  const [openAdmin, setAdminOpen] = useState(false);
  const [therapyEngagement, setTherapyEngagement] = useState("");
  const [emotionalRegulation, setEmotionalRegulation] = useState("");
  const [residentProgressMade, setResidentProgressMade] = useState([]);
  const [residentProgressMadeOther, setResidentProgressMadeOther] =
    useState("");
  const [residentProgressMadeBoolean, setResidentProgressMadeBoolean] =
    useState(false);
  const [stepDownBarriers, setStepDownBarriers] = useState([]);
  const [stepDownBarriersOther, setStepDownBarriersOther] = useState("");
  const [stepDownBarriersText, setStepDownBarriersText] = useState("");
  const [stepDownBarriersBoolean, setStepDownBarriersBoolean] = useState(false);

  const [
    dischargePlanningAndAfterCarePlanning,
    setDischargePlanningAndAfterCarePlanning,
  ] = useState([]);
  const [
    dischargePlanningAndAfterCarePlanningOther,
    setDischargePlanningAndAfterCarePlanningOther,
  ] = useState("");
  const [
    isAdditionalDischargePlanningChecked,
    setIsAdditionalDischargePlanningChecked,
  ] = useState(null);
  const [
    additionalDischargePlanningComment,
    setAdditionalDischargePlanningComment,
  ] = useState("");
  const [readinessDischarge, setReadinessDischarge] = useState("");
  const [
    recommendationsForFurtherPrograms,
    setRecommendationsForFurtherPrograms,
  ] = useState([]);
  const [
    recommendationsForFurtherProgramsOther,
    setRecommendationsForFurtherProgramsOther,
  ] = useState("");
  const [afterCareAndTransitionPlanning, setAfterCareAndTransitionPlanning] =
    useState([]);

  const [supportGroupsOther, setSupportGroupsOther] = useState("");
  const [supportGroups, setSupportGroups] = useState([]);
  const [supportGroupsBoolean, setSupportGroupsBoolean] = useState(false);
  const [location, setLocation] = useState([]);
  const [locationOther, setLocationOther] = useState("");
  const [locationBoolean, setLocationBoolean] = useState(false);
  const [conclusion, setConclusion] = useState("");
  const [bht, setBht] = useState("");
  const [bhp, setBhp] = useState("");
  const [others, setOthers] = useState("");
  const [assignedCaseManager, setAssignedCaseManager] = useState("");
  const [counselor, setCounselor] = useState("");
  const [pcp, setPcp] = useState("");
  const [primaryCareProviderContact, setPrimaryCareProviderContact] =
    useState("");
  const [primaryCareProviderAddress, setPrimaryCareProviderAddress] =
    useState("");
  const [psych, setPsych] = useState("");
  const [psychiatricProviderContact, setPsychiatricProviderContact] =
    useState("");
  const [psychiatricProviderAddress, setPsychiatricProviderAddress] =
    useState("");

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

  const witnessNamePresent = !!(
    signatures?.witness?.name &&
    signatures.witness.name.trim() &&
    signatures.witness.name.trim() !== "undefined undefined"
  );
  const witnessSigPresent = !!signatures?.witness?.rawSignatureImage;
  const witnessIncomplete = witnessSigPresent && !witnessNamePresent;

  const clearAllTyped = () => {
    setBhpSignature("");
    setBhpSignatureDateTime("");
    setAdminSignature("");
    setAdminDateSigned("");
  };

  useEffect(() => {
    if (patientId) {
      patientChartService.dischargePlanning.getByPatientId(patientId, {
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
      setAssignedCaseManager(populateData?.assignedCaseManager);
      setCounselor(populateData?.counselor);
      setResidentProgressMade(populateData?.residentProgressMade || []);
      setResidentProgressMadeBoolean(
        populateData?.residentProgressMade?.includes("Other") || false,
      );
      setResidentProgressMadeOther(
        populateData?.residentProgressMadeOther || "",
      );
      setTherapyEngagement(populateData?.therapyEngagement);
      setEmotionalRegulation(populateData?.emotionalRegulation);
      setLocation(populateData?.location || []);
      setConclusion(populateData?.conclusion);
      setBht(populateData?.bht);
      setBhp(populateData?.bhp);
      setOthers(populateData?.others);
    }
  }, [data, patientId, profile._id]);
  const initialFormData = {
    patientId,
    dateOfDischarge,
    clientName,
    assignedCaseManager,
    counselor,
    pcp,
    primaryCareProviderContact,
    primaryCareProviderAddress,
    psych,
    psychiatricProviderContact,
    psychiatricProviderAddress,
    residentProgressMade,
    residentProgressMadeOther,
    therapyEngagement,
    emotionalRegulation,
    stepDownBarriers,
    stepDownBarriersOther,
    stepDownBarriersText,
    dischargePlanningAndAfterCarePlanning,
    dischargePlanningAndAfterCarePlanningOther,
    isAdditionalDischargePlanningChecked,
    additionalDischargePlanningComment,
    readinessDischarge,
    recommendationsForFurtherPrograms,
    recommendationsForFurtherProgramsOther,
    afterCareAndTransitionPlanning,
    supportGroups,
    supportGroupsOther,
    location,
    locationOther,
    conclusion,
    bht,
    bhp,
    others,
    saveAsDraft,
    bhpSignature,
    bhpSignatureDateTime,
    adminSignature,
    adminDateSigned,
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
    patientChartService.dischargePlanning.post(initialFormData, {
      setLoading,
      navigate,
    });
  };
  useEffect(() => {
    if (patientDetail) {
      setAhcccsId(patientDetail?.ahcccsId);
      setDateOfAdmission(patientDetail?.admitDate);
      setDiagnosis(patientDetail?.diagnosis);
      setPcp(patientDetail?.primaryCareProvider);
      setPrimaryCareProviderContact(patientDetail?.primaryCareProviderContact);
      setPrimaryCareProviderAddress(patientDetail?.primaryCareProviderAddress);
      setPsych(patientDetail?.psychiatricProvider);
      setPsychiatricProviderContact(patientDetail?.psychiatricProviderContact);
      setPsychiatricProviderAddress(patientDetail?.psychiatricProviderAddress);
      setSupportGroups(patientDetail?.supportGroups || []);
      setSupportGroupsOther(patientDetail?.supportGroupsOther || "");
      setSupportGroupsBoolean(
        patientDetail?.supportGroups?.includes("Other") || false,
      );
      setLocation(patientDetail?.location || []);
      setLocationOther(patientDetail?.locationOther || "");
      setLocationBoolean(patientDetail?.location?.includes("Other") || false);
      setStepDownBarriers(patientDetail?.stepDownBarriers || []);
      setStepDownBarriersOther(patientDetail?.stepDownBarriersOther || "");
      setStepDownBarriersText(patientDetail?.stepDownBarriersText || "");
      setStepDownBarriersBoolean(
        patientDetail?.stepDownBarriers?.includes("Other") || false,
      );

      setDischargePlanningAndAfterCarePlanning(
        patientDetail?.dischargePlanningAndAfterCarePlanning || [],
      );
      setDischargePlanningAndAfterCarePlanningOther(
        patientDetail?.dischargePlanningAndAfterCarePlanningOther || "",
      );
      setIsAdditionalDischargePlanningChecked(
        patientDetail?.isAdditionalDischargePlanningChecked ?? null,
      );
      setAdditionalDischargePlanningComment(
        patientDetail?.additionalDischargePlanningComment || "",
      );
      setReadinessDischarge(patientDetail?.readinessDischarge || "");
      setRecommendationsForFurtherPrograms(
        patientDetail?.recommendationsForFurtherPrograms || [],
      );
      setRecommendationsForFurtherProgramsOther(
        patientDetail?.recommendationsForFurtherProgramsOther || "",
      );
      setAfterCareAndTransitionPlanning(
        patientDetail?.afterCareAndTransitionPlanning || [],
      );
    }
  }, [patientDetail]);
  const handleCheckboxChangeResidentProgressMade = (symptom) => {
    if (symptom === "Other") {
      setResidentProgressMade((prevState) => {
        if (prevState.includes("Other")) {
          return prevState.filter((item) => item !== "Other");
        } else {
          return [...prevState, "Other"];
        }
      });
      setResidentProgressMadeBoolean(!residentProgressMadeBoolean);
    } else {
      setResidentProgressMade((prevState) => {
        if (prevState.includes(symptom)) {
          return prevState.filter((item) => item !== symptom);
        } else {
          return [...prevState, symptom];
        }
      });
    }
  };
  const handleCheckboxChangeStepDownBarrier = (symptom) => {
    if (symptom === "Other") {
      setStepDownBarriers((prevState) => {
        if (prevState.includes("Other")) {
          return prevState.filter((item) => item !== "Other");
        } else {
          return [...prevState, "Other"];
        }
      });
      setStepDownBarriersBoolean(!stepDownBarriersBoolean);
    } else {
      setStepDownBarriers((prevState) => {
        if (prevState.includes(symptom)) {
          return prevState.filter((item) => item !== symptom);
        } else {
          return [...prevState, symptom];
        }
      });
    }
  };
  const handleCheckboxChangeSupportGroups = (symptom) => {
    if (symptom === "Other") {
      setSupportGroups((prevState) => {
        if (prevState.includes("Other")) {
          return prevState.filter((item) => item !== "Other");
        } else {
          return [...prevState, "Other"];
        }
      });
      setSupportGroupsBoolean(!supportGroupsBoolean);
    } else {
      setSupportGroups((prevState) => {
        if (prevState.includes(symptom)) {
          return prevState.filter((item) => item !== symptom);
        } else {
          return [...prevState, symptom];
        }
      });
    }
  };
  const handleCheckboxChangeLocation = (symptom) => {
    if (symptom === "Other") {
      setLocation((prevState) => {
        if (prevState.includes("Other")) {
          return prevState.filter((item) => item !== "Other");
        } else {
          return [...prevState, "Other"];
        }
      });
      setLocationBoolean(!locationBoolean);
    } else {
      setLocation((prevState) => {
        if (prevState.includes(symptom)) {
          return prevState.filter((item) => item !== symptom);
        } else {
          return [...prevState, symptom];
        }
      });
    }
  };

  return (
    <>
      {typedGuardDialog}
      <AddSignature
        show={open3}
        setValue={setBhpSignature}
        setDate={setBhpSignatureDateTime}
      />
      <AddSignature
        show={openAdmin}
        setValue={setAdminSignature}
        setDate={setAdminDateSigned}
      />
      <NavWrapper title={"Discharge Planning"} isArrow={true} />
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
                <Col xs={12} md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      Assigned Case Manager
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="consumersFunctioningSeverity"
                      value={assignedCaseManager}
                      placeholder="Enter text"
                      onChange={(e) => setAssignedCaseManager(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      Therapist/Counselor:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="counselor"
                      value={counselor}
                      placeholder="Enter text"
                      onChange={(e) => setCounselor(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Row>
                <Row>
                  <Form.Label className="fw-bold">
                    Medication Management
                  </Form.Label>
                </Row>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold mx-2">
                      Primary Care Provider Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      value={pcp}
                      onChange={(e) => setPcp(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold mx-2">
                      Primary Care Provider Contact
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      value={primaryCareProviderContact}
                      onChange={(e) =>
                        setPrimaryCareProviderContact(e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold mx-2">
                      Primary Care Provider Address
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      value={primaryCareProviderAddress}
                      onChange={(e) =>
                        setPrimaryCareProviderAddress(e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold mx-2">
                      Psychiatric Provider Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      value={psych}
                      onChange={(e) => setPsych(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold mx-2">
                      Psychiatric Provider Contact
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      value={psychiatricProviderContact}
                      onChange={(e) =>
                        setPsychiatricProviderContact(e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold mx-2">
                      Psychiatric Provider Address
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      value={psychiatricProviderAddress}
                      onChange={(e) =>
                        setPsychiatricProviderAddress(e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    Resident progress made:
                  </Form.Label>
                  <div className="radio-inline">
                    {[
                      { label: "Sobriety", value: "Sobriety" },
                      {
                        label: "Independent living skills",
                        value: "Independent living skills",
                      },
                      { label: "Employment", value: "Employment" },
                      { label: "ADLs", value: "ADLs" },
                      { label: "Medication", value: "Medication" },
                      { label: "Safety", value: "Safety" },
                      {
                        label: "Managing mental health",
                        value: "Managing mental health",
                      },
                      { label: "Legal", value: "Legal" },
                      { label: "Other", value: "Other" },
                    ].map((opt, idx) => (
                      <Form.Check
                        key={idx}
                        inline
                        label={opt.label}
                        type="checkbox"
                        id={`resident-progress-${idx}`}
                        checked={residentProgressMade?.includes(opt.value)}
                        onChange={() =>
                          handleCheckboxChangeResidentProgressMade(opt.value)
                        }
                      />
                    ))}
                    {residentProgressMadeBoolean && (
                      <BorderlessInput
                        value={residentProgressMadeOther}
                        setState={setResidentProgressMadeOther}
                        placeholder="Other progress"
                      />
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Card body className="mb-3 ">
            <Row>
              <Col>
                <Form.Label className="fw-bold mb-3">
                  Key Area of Progress and Ongoing Needs:
                </Form.Label>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    Therapy engagement:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="therapyEngagement"
                    value={therapyEngagement}
                    placeholder="Enter text"
                    onChange={(e) => setTherapyEngagement(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    Emotional regulation:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="emotionalRegulation"
                    value={emotionalRegulation}
                    placeholder="Enter text"
                    onChange={(e) => setEmotionalRegulation(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Card body className="mb-3">
            <Col xs={12} sm={12} md={12} lg={12}>
              <Form.Group>
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
                      label: "Lack of Mental Health professionals & Services",
                      value: "Lack of Mental Health professionals & Services",
                    },
                    {
                      label:
                        "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations",
                      value:
                        "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations",
                    },
                    { label: "Unresolved Trauma", value: "Unresolved Trauma" },
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
                  id="AHCCCS"
                  value={stepDownBarriersText}
                  cols={130}
                  placeholder="Enter text."
                  disabled
                ></Form.Control>
              </Form.Group>
            </Col>
          </Card>

          {/* Discharge Planning Section */}
          <Card className="mb-3">
            <Card.Body>
              <Row>
                <Col xs={12}>
                  <Form.Group className="mb-3">
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
                          id={`preassess-discharge-${idx}`}
                          checked={(
                            dischargePlanningAndAfterCarePlanning ?? []
                          ).includes(opt)}
                          disabled
                        />
                      ))}
                      {(dischargePlanningAndAfterCarePlanning ?? []).includes(
                        "Other",
                      ) && (
                        <BorderlessInput
                          value={dischargePlanningAndAfterCarePlanningOther}
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
                        id="preassess-additional-discharge-yes"
                        checked={isAdditionalDischargePlanningChecked === true}
                        disabled
                      />{" "}
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="preassess-additional-discharge-no"
                        checked={isAdditionalDischargePlanningChecked === false}
                        disabled
                      />
                    </div>
                  </Form.Group>
                  {isAdditionalDischargePlanningChecked && (
                    <Form.Group className="mt-3">
                      <Form.Label className="fw-bold">
                        Specify ( If Others )
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        className={`${!additionalDischargePlanningComment && "hidePrint"}`}
                        value={additionalDischargePlanningComment}
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
                      className={`${!readinessDischarge && "hidePrint"}`}
                      value={readinessDischarge}
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
                      Transition planning and recommendations for further
                      programs upon discharge
                    </Form.Label>
                    <div className="radio-inline">
                      {[
                        "PHP",
                        "IOP",
                        "Sober living",
                        "Home",
                        "Flex Care 23.9",
                        "Flex Care 16",
                        "Flex Care 8",
                        "ABHTH",
                        "Transition to ALTC",
                        "Other",
                      ].map((opt, idx) => (
                        <Form.Check
                          key={idx}
                          inline
                          label={opt}
                          type="checkbox"
                          id={`preassess-transition-${idx}`}
                          checked={recommendationsForFurtherPrograms?.includes(
                            opt,
                          )}
                          disabled
                        />
                      ))}
                      {recommendationsForFurtherPrograms?.includes("Other") && (
                        <BorderlessInput
                          value={recommendationsForFurtherProgramsOther}
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
                      After care and Transition planning / Community Resources
                    </Form.Label>
                    <div className="radio-inline">
                      <Form.Check
                        inline
                        label="National suicide hotline 988 or 1-800-273-8255"
                        type="checkbox"
                        id="preassess-aftercare-suicide-hotline"
                        checked={(
                          afterCareAndTransitionPlanning ?? []
                        ).includes(
                          "National suicide hotline 988 or 1-800-273-8255",
                        )}
                        disabled
                      />
                      <Form.Check
                        inline
                        label="Emergency care 911"
                        type="checkbox"
                        id="preassess-aftercare-emergency"
                        checked={(
                          afterCareAndTransitionPlanning ?? []
                        ).includes("Emergency care 911")}
                        disabled
                      />
                      <Form.Check
                        inline
                        label="24-Hour crisis in Maricopa County 602-222-9444"
                        type="checkbox"
                        id="preassess-aftercare-crisis"
                        checked={(
                          afterCareAndTransitionPlanning ?? []
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

          <Card body className="mb-3 ">
            <Form.Label className="fw-bold">
              Resident to continue to attend support groups like
            </Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="AA"
                type="checkbox"
                id="AA"
                checked={supportGroups?.includes("AA")}
                disabled
              />
              <Form.Check
                inline
                label="NA"
                type="checkbox"
                id="NA "
                checked={supportGroups?.includes("NA")}
                disabled
              />
              <Form.Check
                inline
                label="Other"
                type="checkbox"
                checked={supportGroups.includes("Other")}
                id="Other"
                disabled
              />
              {supportGroupsBoolean && (
                <BorderlessInput
                  value={supportGroupsOther}
                  setState={setSupportGroupsOther}
                  placeholder=" "
                  disabled
                />
              )}
            </div>
          </Card>

          <Card body className="mb-3">
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    Post discharge plan:{" "}
                  </Form.Label>
                  <div>
                    <p>
                      Provider will follow up with resident 3 days after
                      discharge to ensure safe and stable housing environment
                      Provider will assist resident in transferring medications
                      to any pharmacy of choice prior to discharge, and will
                      follow up with resident within 5 days after discharge to
                      ensure transfer of mediation was successful Provider will
                      follow up with resident/representation to discuss issues
                      related with medication discharge, properties, and funds
                      left behind after discharge
                    </p>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Conclusion: </Form.Label>
              <Form.Control
                type="text"
                id="Conclusion"
                value={conclusion}
                placeholder="Enter text"
                onChange={(e) => setConclusion(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-bold">BHT: </Form.Label>
              <Form.Control
                type="text"
                id="BHT"
                value={bht}
                placeholder="Enter text"
                onChange={(e) => setBht(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-bold">BHP: </Form.Label>
              <Form.Control
                type="text"
                id="BHP"
                value={bhp}
                placeholder="Enter text"
                onChange={(e) => setBhp(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-bold">Others </Form.Label>
              <Form.Control
                type="text"
                id="Others"
                value={others}
                placeholder="Enter text"
                onChange={(e) => setOthers(e.target.value)}
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
                  disabled={
                    witnessIncomplete
                      ? true
                      : profile.userType === ROLES.ADMIN
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
  Wcomponenet: CreateDischargePlannning,
});
