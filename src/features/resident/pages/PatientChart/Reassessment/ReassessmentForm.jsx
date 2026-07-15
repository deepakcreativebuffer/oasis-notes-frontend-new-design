import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Table,
} from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  patientChartService,
  patientService,
} from "@/features/shared/services";
import { useNavigate, useParams } from "react-router-dom";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import {
  hasPatientRecord,
  normalizePatientRecord,
} from "@/utils/patientPopulate";
import { AddSignature } from "@/utils/utils";
import { BorderlessInput } from "@/utils/Makers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { ROLES } from "@/features/shared/constants";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import { REASON_FOR_ADMISSION_OPTIONS } from "@/features/employee/pages/Intake/InitialAssessment/config/initialAssessmentSelectOptions";
import {
  DISCHARGE_PLANNING_OPTIONS,
  PRESENTING_PROBLEMS_OPTIONS,
} from "@/features/shared/constants";
import { QUALITIES_OPTIONS } from "@/features/employee/pages/Intake/InitialAssessment/config/assessmentFields";
import { AiFillDelete } from "react-icons/ai";
import { ClipLoader } from "react-spinners";

const ReassessmentForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const profileInfo = useSelector(userProfile);

  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState("");
  const [patientDetail, setPatientDetail] = useState({});

  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [primaryLanguage, setPrimaryLanguage] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [admissionStatus, setAdmissionStatus] = useState("");
  const [courtOrderedTreatment, setCourtOrderedTreatment] = useState("");
  const [programLocation, setProgramLocation] = useState("");
  const [guardianship, setGuardianship] = useState("");
  const [guardianshipPoaPubFidName, setGuardianshipPoaPubFidName] =
    useState("");
  const [reasonForAdmission, setReasonForAdmission] = useState([]);
  const [residentGoals, setResidentGoals] = useState("");
  const [residentStrengths, setResidentStrengths] = useState([]);
  const [fallRisk, setFallRisk] = useState("");
  const [fallRiskExplanation, setFallRiskExplanation] = useState("");
  const [triggers, setTriggers] = useState("");
  const [hobbiesLeisureActivities, setHobbiesLeisureActivities] = useState("");
  const [primaryCareProvider, setPrimaryCareProvider] = useState("");
  const [primaryCareProviderContact, setPrimaryCareProviderContact] =
    useState("");
  const [primaryCareProviderAddress, setPrimaryCareProviderAddress] =
    useState("");
  const [psychiatricProvider, setPsychiatricProvider] = useState("");
  const [psychiatricProviderContact, setPsychiatricProviderContact] =
    useState("");
  const [psychiatricProviderAddress, setPsychiatricProviderAddress] =
    useState("");
  const [healthPlan, setHealthPlan] = useState("");
  const [idforPatient, setIdforPatient] = useState("");
  const [presentingProblems, setPresentingProblems] = useState([]);
  const [barries, setBarries] = useState("");

  const [presentingIssue, setPresentingIssue] = useState("");
  const [location, setLocation] = useState([]);
  const [locationOther, setLocationOther] = useState("");
  const [locationBoolean, setLocationBoolean] = useState(false);
  const [supportGroups, setSupportGroups] = useState([]);
  const [supportGroupsOther, setSupportGroupsOther] = useState("");
  const [supportGroupsBoolean, setSupportGroupsBoolean] = useState(false);
  const [stepDownBarriers, setStepDownBarriers] = useState([]);
  const [stepDownBarriersOther, setStepDownBarriersOther] = useState("");
  const [stepDownBarriersBoolean, setStepDownBarriersBoolean] = useState(false);
  const [stepDownBarriersText, setStepDownBarriersText] = useState("");

  // Discharge Planning fields
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

  // Discharge Planning checkbox handlers
  const handleCheckboxChangeDischargePlanning = (value) => {
    setDischargePlanningAndAfterCarePlanning((prev) => {
      const updated = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];

      if (!updated.includes("Other")) {
        setDischargePlanningAndAfterCarePlanningOther("");
      }
      return updated;
    });
  };

  const handleCheckboxChangeRecommendationsForFurtherPrograms = (value) => {
    setRecommendationsForFurtherPrograms((prev) => {
      const updated = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];
      const isOtherSelected = updated.includes("Other");
      if (!isOtherSelected) {
        setRecommendationsForFurtherProgramsOther("");
      }
      return updated;
    });
  };

  const handleCheckboxChangeAfterCareAndTransitionPlanning = (value) => {
    setAfterCareAndTransitionPlanning((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
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

  const [allergiesYes, setAllergiesYes] = useState(null);
  const [allergiesComment, setAllergiesComment] = useState("");
  const [pastSurgeries, setPastSurgeries] = useState("");

  const getDefaultDiagnoses = () => [
    { name: "Primary", icdCode: "", description: "" },
    { name: "Secondary", icdCode: "", description: "" },
    { name: "Tertiary", icdCode: "", description: "" },
    { name: "Additional", icdCode: "", description: "" },
    { name: "Other", icdCode: "", description: "", otherName: "" },
  ];

  const [psychiatricDiagnoses, setPsychiatricDiagnoses] = useState(
    getDefaultDiagnoses(),
  );
  const [medicalDiagnoses, setMedicalDiagnoses] = useState(
    getDefaultDiagnoses(),
  );

  const getMergedDiagnoses = (fetchedList) => {
    if (!fetchedList || !fetchedList.length) return getDefaultDiagnoses();
    const result = getDefaultDiagnoses();
    const rest = [];
    fetchedList.forEach((d) => {
      const fIdx = result.findIndex(
        (r) => r.name === d.name && r.name !== "Other",
      );
      if (fIdx !== -1) {
        result[fIdx] = { ...result[fIdx], ...d };
      } else if (d.isOther) {
        result[4] = { ...result[4], ...d, otherName: d.name, name: "Other" };
      } else {
        rest.push(d);
      }
    });
    return [...result, ...rest];
  };

  const populateData = useCallback((item) => {
    if (!item) return;
    setPreferredLanguage(item.preferredLanguage || "");
    setPrimaryLanguage(item.primaryLanguage || "");
    setEthnicity(item.ethnicity || "");
    setAdmissionStatus(item.admissionStatus || []);
    setCourtOrderedTreatment(item.courtOrderedTreatment || "");
    setProgramLocation(item.programLocation || "");
    setGuardianship(item.guardianship || "");
    setGuardianshipPoaPubFidName(item.guardianshipPoaPubFidName || "");
    setReasonForAdmission(
      item.reasonForAdmission
        ? item.reasonForAdmission.map((s) => ({ label: s, value: s }))
        : [],
    );
    setResidentGoals(item.residentGoals || "");
    setResidentStrengths(
      item.residentStrengths
        ? item.residentStrengths.map((s) => ({ label: s, value: s }))
        : [],
    );
    setFallRisk(item.fallRisk || "");
    setFallRiskExplanation(item.fallRiskExplanation || "");
    setTriggers(item.triggers || "");
    setHobbiesLeisureActivities(item.hobbiesLeisureActivities || "");
    setPrimaryCareProvider(item.primaryCareProvider || "");
    setPrimaryCareProviderContact(item.primaryCareProviderContact || "");
    setPrimaryCareProviderAddress(item.primaryCareProviderAddress || "");
    setPsychiatricProvider(item.psychiatricProvider || "");
    setPsychiatricProviderContact(item.psychiatricProviderContact || "");
    setPsychiatricProviderAddress(item.psychiatricProviderAddress || "");
    setHealthPlan(item.healthPlan || "");
    setIdforPatient(item.idforPatient || "");
    setPresentingProblems(
      item.presentingProblems
        ? item.presentingProblems.map((s) => ({ label: s, value: s }))
        : [],
    );
    setBarries(item.barries || "");
    setPresentingIssue(item.presentingIssue || "");
    setLocation(item.location || []);
    setLocationOther(item.locationOther || "");
    setLocationBoolean(item.location?.includes("Other") || false);
    setSupportGroups(item.supportGroups || []);
    setSupportGroupsOther(item.supportGroupsOther || "");
    setSupportGroupsBoolean(item.supportGroups?.includes("Other") || false);
    setStepDownBarriers(item.stepDownBarriers || []);
    setStepDownBarriersOther(item.stepDownBarriersOther || "");
    setStepDownBarriersBoolean(
      item.stepDownBarriers?.includes("Other") || false,
    );
    setStepDownBarriersText(item.stepDownBarriersText || "");

    // Discharge Planning populate
    setDischargePlanningAndAfterCarePlanning(
      item.dischargePlanningAndAfterCarePlanning || [],
    );
    setDischargePlanningAndAfterCarePlanningOther(
      item.dischargePlanningAndAfterCarePlanningOther || "",
    );
    setIsAdditionalDischargePlanningChecked(
      item.isAdditionalDischargePlanningChecked ?? null,
    );
    setAdditionalDischargePlanningComment(
      item.additionalDischargePlanningComment || "",
    );
    setReadinessDischarge(item.readinessDischarge || "");
    setRecommendationsForFurtherPrograms(
      item.recommendationsForFurtherPrograms || [],
    );
    setRecommendationsForFurtherProgramsOther(
      item.recommendationsForFurtherProgramsOther || "",
    );
    setAfterCareAndTransitionPlanning(
      item.afterCareAndTransitionPlanning || [],
    );

    if (item.allergies && item.allergies.length > 0) {
      const allergy = item.allergies[0];
      if (allergy.yes !== undefined) {
        setAllergiesYes(allergy.yes);
        setAllergiesComment(allergy.comments || allergy.name || "");
      } else {
        setAllergiesYes(true);
        setAllergiesComment(
          item.allergies
            .map((a) =>
              typeof a === "object" ? a.name || JSON.stringify(a) : a,
            )
            .join(", "),
        );
      }
    } else {
      setAllergiesYes(null);
      setAllergiesComment("");
    }
    setPastSurgeries(item.pastSurgeries || "");
    if (item.psychiatricDiagnoses) {
      setPsychiatricDiagnoses(getMergedDiagnoses(item.psychiatricDiagnoses));
    }
    if (item.medicalDiagnoses) {
      setMedicalDiagnoses(getMergedDiagnoses(item.medicalDiagnoses));
    }
  }, []);

  const fetchHandler = useCallback(() => {
    patientChartService.reassessment.getById(id).then((res) => {
      if (res.data) {
        const item = res.data;
        setPatientId(item?.patientId?._id || item?.patientId || item?._id);
        setResidentName(
          item?.fullName ||
            item?.residentName ||
            `${item?.firstName || ""} ${item?.lastName || ""}`.trim() ||
            `${item?.patientId?.firstName || ""} ${item?.patientId?.lastName || ""}`.trim(),
        );
        populateData(item);
      }
    });
  }, [id, populateData]);

  useEffect(() => {
    if (!isEdit && patientId) {
      patientService.getById(patientId).then((res) => {
        if (res.data) {
          populateData(res.data);
        }
      });
    }
  }, [patientId, isEdit, populateData]);

  useEffect(() => {
    if (!isEdit) return;
    fetchHandler();
  }, [fetchHandler, isEdit]);

  const handleCheckboxAdmisionStatus = (val) => {
    setAdmissionStatus((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      return arr.includes(val)
        ? arr.filter((item) => item !== val)
        : [...arr, val];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      patientId,
      residentName,
      preferredLanguage,
      primaryLanguage,
      ethnicity,
      admissionStatus: Array.isArray(admissionStatus) ? admissionStatus : [],
      courtOrderedTreatment,
      programLocation,
      guardianship,
      guardianshipPoaPubFidName,
      reasonForAdmission: reasonForAdmission.map((v) => v.value),
      residentGoals,
      residentStrengths: residentStrengths.map((v) => v.value),
      fallRisk,
      fallRiskExplanation,
      triggers,
      hobbiesLeisureActivities,
      primaryCareProvider,
      primaryCareProviderContact,
      primaryCareProviderAddress,
      psychiatricProvider,
      psychiatricProviderContact,
      psychiatricProviderAddress,
      healthPlan,
      idforPatient,
      presentingProblems: presentingProblems.map((v) => v.value),
      barries,
      presentingIssue,
      location,
      locationOther,
      supportGroups,
      supportGroupsOther,
      stepDownBarriers,
      stepDownBarriersOther,
      stepDownBarriersText,
      allergies: [
        {
          yes: allergiesYes,
          comments: allergiesComment,
          name: allergiesComment,
        },
      ],
      pastSurgeries,
      // Discharge Planning payload keys
      dischargePlanningAndAfterCarePlanning,
      dischargePlanningAndAfterCarePlanningOther,
      isAdditionalDischargePlanningChecked,
      additionalDischargePlanningComment,
      readinessDischarge,
      recommendationsForFurtherPrograms,
      recommendationsForFurtherProgramsOther,
      afterCareAndTransitionPlanning,
      psychiatricDiagnoses: psychiatricDiagnoses
        .map((d) => ({
          name: d.name === "Other" ? d.otherName : d.name,
          isOther: d.name === "Other",
          icdCode: d.icdCode,
          description: d.description,
        }))
        .filter((d) => d.icdCode || d.description || d.name),
      medicalDiagnoses: medicalDiagnoses
        .map((d) => ({
          name: d.name === "Other" ? d.otherName : d.name,
          isOther: d.name === "Other",
          icdCode: d.icdCode,
          description: d.description,
        }))
        .filter((d) => d.icdCode || d.description || d.name),
    };

    // Since the API uses POST for both creation and updates (upsert pattern), we use .create()
    patientChartService.reassessment
      .create({ payload })
      .then(() => {
        navigate("/reassessment-list");
      })
      .finally(() => setLoading(false));
  };

  const renderDiagnosesTable = (title, diagnoses, setDiagnoses) => {
    const handleAdd = () =>
      setDiagnoses([...diagnoses, { name: "", icdCode: "", description: "" }]);

    const handleChange = (index, field, value) => {
      const newArr = [...diagnoses];
      newArr[index] = { ...newArr[index], [field]: value };
      setDiagnoses(newArr);
    };

    const handleRemove = (index) => {
      const newArr = [...diagnoses];
      newArr.splice(index, 1);
      setDiagnoses(newArr);
    };

    return (
      <Col md={12} className="mb-3">
        <Table responsive="lg" bordered>
          <thead>
            <tr>
              <th>{title}</th>
              <th>ICD Code</th>
              <th className="w-50">Description</th>
            </tr>
          </thead>
          <tbody>
            {diagnoses.map((diag, i) => {
              const isFixed =
                ["Primary", "Secondary", "Tertiary", "Additional"].includes(
                  diag.name,
                ) && i < 4;
              const isOther = diag.name === "Other" && i === 4;

              return (
                <tr key={i}>
                  <td>
                    {isOther ? (
                      <div className="d-flex align-items-center">
                        <span className="me-2">Other:</span>
                        <Form.Control
                          type="text"
                          value={diag.otherName || ""}
                          placeholder="__________"
                          onChange={(e) =>
                            handleChange(i, "otherName", e.target.value)
                          }
                          className="border-0 border-bottom rounded-0 px-0 bg-transparent shadow-none"
                        />
                      </div>
                    ) : isFixed ? (
                      diag.name === "Primary" ? (
                        "Primary*"
                      ) : (
                        diag.name
                      )
                    ) : (
                      <Form.Control
                        type="text"
                        value={diag.name || ""}
                        onChange={(e) =>
                          handleChange(i, "name", e.target.value)
                        }
                      />
                    )}
                  </td>
                  <td>
                    <Form.Control
                      as="textarea"
                      rows={1}
                      value={diag.icdCode || ""}
                      onChange={(e) =>
                        handleChange(i, "icdCode", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <Form.Control
                        as="textarea"
                        rows={1}
                        value={diag.description || ""}
                        onChange={(e) =>
                          handleChange(i, "description", e.target.value)
                        }
                        className="me-2"
                      />
                      {!isFixed && !isOther && (
                        <div className="del-btn">
                          <AiFillDelete
                            className="text-danger cursor-pointer"
                            onClick={() => handleRemove(i)}
                            size={20}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="text-center hidePrint">
          <Button type="button" className="theme-button" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </Col>
    );
  };

  return (
    <>
      <NavWrapper title={"Re-Assessment"} isArrow={true} />
      <Container>
        <Form onSubmit={handleSubmit}>
          {!isEdit ? (
            <div>
              <PatientComponent
                className={"mb-2"}
                MainPatientId={setPatientId}
                MainResidentName={setResidentName}
                setWholeData={setPatientDetail}
              />
            </div>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold"> Resident Name :</Form.Label>
              <Form.Label> {residentName} </Form.Label>
            </Form.Group>
          )}

          <Card className="mb-3">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Preferred Language
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Primary Language
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={primaryLanguage}
                      onChange={(e) => setPrimaryLanguage(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Ethnicity</Form.Label>
                    <Form.Control
                      type="text"
                      value={ethnicity}
                      onChange={(e) => setEthnicity(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Admission Status
                    </Form.Label>
                    <div className="radio-inline mt-1">
                      <Form.Check
                        inline
                        label="Voluntary"
                        type="checkbox"
                        id="Voluntary"
                        checked={
                          Array.isArray(admissionStatus) &&
                          admissionStatus.includes("Voluntary")
                        }
                        onChange={() =>
                          handleCheckboxAdmisionStatus("Voluntary")
                        }
                      />
                      <Form.Check
                        inline
                        label="Court Ordered Treatment"
                        type="checkbox"
                        id="courtOrderedTreatment"
                        checked={
                          Array.isArray(admissionStatus) &&
                          admissionStatus.includes("Court Ordered Treatment")
                        }
                        onChange={() =>
                          handleCheckboxAdmisionStatus(
                            "Court Ordered Treatment",
                          )
                        }
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Court Ordered Treatment?
                    </Form.Label>
                    <div className="radio-inline mt-1">
                      <Form.Check
                        inline
                        label="Yes"
                        type="checkbox"
                        id="courtOrderedTreatmentYes"
                        checked={courtOrderedTreatment === "Yes"}
                        onChange={() => setCourtOrderedTreatment("Yes")}
                      />
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="courtOrderedTreatmentNo"
                        checked={courtOrderedTreatment === "No"}
                        onChange={() => setCourtOrderedTreatment("No")}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Program Location & Address
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={programLocation}
                      onChange={(e) => setProgramLocation(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Guardianship Yes/No
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={guardianship}
                      onChange={(e) => setGuardianship(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Guardianship/POA/PUB FID Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={guardianshipPoaPubFidName}
                      onChange={(e) =>
                        setGuardianshipPoaPubFidName(e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Resident’s Goals
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={residentGoals}
                      onChange={(e) => setResidentGoals(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Resident’s Strength
                    </Form.Label>
                    <CustomMultiSelectInput
                      multiselect={true}
                      className="w-100"
                      value={residentStrengths}
                      onChange={setResidentStrengths}
                      options={QUALITIES_OPTIONS}
                      isCreatable={true}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Fall risk</Form.Label>
                    <div className="radio-inline mt-1">
                      <Form.Check
                        inline
                        label="Yes"
                        type="checkbox"
                        id="fallRiskYes"
                        checked={fallRisk === "Yes"}
                        onChange={() => setFallRisk("Yes")}
                      />
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="fallRiskNo"
                        checked={fallRisk === "No"}
                        onChange={() => {
                          setFallRisk("No");
                          setFallRiskExplanation("");
                        }}
                      />
                    </div>
                  </Form.Group>
                  {fallRisk === "Yes" && (
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        If yes please explain
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={fallRiskExplanation}
                        placeholder="Enter text"
                        onChange={(e) => setFallRiskExplanation(e.target.value)}
                      />
                    </Form.Group>
                  )}
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Triggers</Form.Label>
                    <Form.Control
                      type="text"
                      value={triggers}
                      onChange={(e) => setTriggers(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Hobbies/Leisure Activities
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={hobbiesLeisureActivities}
                      onChange={(e) =>
                        setHobbiesLeisureActivities(e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Primary Care Provider Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={primaryCareProvider}
                      onChange={(e) => setPrimaryCareProvider(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Primary Care Provider Contact
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={primaryCareProviderContact}
                      onChange={(e) =>
                        setPrimaryCareProviderContact(e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Primary Care Provider Address
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={primaryCareProviderAddress}
                      onChange={(e) =>
                        setPrimaryCareProviderAddress(e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Psychiatric Provider Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={psychiatricProvider}
                      onChange={(e) => setPsychiatricProvider(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Psychiatric Provider Contact
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={psychiatricProviderContact}
                      onChange={(e) =>
                        setPsychiatricProviderContact(e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Psychiatric Provider Address
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={psychiatricProviderAddress}
                      onChange={(e) =>
                        setPsychiatricProviderAddress(e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Health Plan</Form.Label>
                    <Form.Control
                      type="text"
                      value={healthPlan}
                      onChange={(e) => setHealthPlan(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={idforPatient}
                      onChange={(e) => setIdforPatient(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
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
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
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
                        onChange={() => handleCheckboxChangeSupportGroups("AA")}
                      />
                      <Form.Check
                        inline
                        label="NA"
                        type="checkbox"
                        id="NA "
                        checked={supportGroups?.includes("NA")}
                        onChange={() => handleCheckboxChangeSupportGroups("NA")}
                      />
                      <Form.Check
                        inline
                        label="Other"
                        type="checkbox"
                        checked={supportGroups.includes("Other")}
                        onChange={() =>
                          handleCheckboxChangeSupportGroups("Other")
                        }
                        id="Other"
                      />
                      {supportGroupsBoolean && (
                        <BorderlessInput
                          value={supportGroupsOther}
                          setState={setSupportGroupsOther}
                          placeholder=" "
                        />
                      )}
                    </div>
                  </Card>
                </Col>
                <Col md={12}>
                  <Card body className="mb-3">
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Barriers</Form.Label>
                        <div className="radio-inline">
                          {[
                            { label: "Cognitive", value: "Cognitive" },
                            {
                              label: "Lack of Insight",
                              value: "Lack of Insight",
                            },
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
                              label:
                                "Lack of coordination between care providers",
                              value:
                                "Lack of coordination between care providers",
                            },
                            {
                              label: "Geographical barriers",
                              value: "Geographical barriers",
                            },
                            {
                              label: "Transportation",
                              value: "Transportation",
                            },
                            { label: "Childcare", value: "Childcare" },
                            {
                              label: "Time constraint",
                              value: "Time constraint",
                            },
                            { label: "Other", value: "Other" },
                          ].map((opt, idx) => (
                            <Form.Check
                              key={idx}
                              inline
                              label={opt.label}
                              type="checkbox"
                              id={`barrier-${idx}`}
                              checked={stepDownBarriers?.includes(opt.value)}
                              onChange={() =>
                                handleCheckboxChangeStepDownBarrier(opt.value)
                              }
                            />
                          ))}
                          {stepDownBarriersBoolean && (
                            <BorderlessInput
                              value={stepDownBarriersOther}
                              setState={setStepDownBarriersOther}
                              placeholder=" "
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
                          onChange={(e) =>
                            setStepDownBarriersText(e.target.value)
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Card>
                </Col>
                <Col md={12} className="mb-3">
                  <Table responsive="lg" bordered>
                    <thead>
                      <tr>
                        <th>Condition</th>
                        <th className="text-center">Yes</th>
                        <th className="text-center">No</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Allergies</td>
                        <td className="text-center">
                          <Form.Check
                            type="checkbox"
                            checked={allergiesYes === true}
                            onChange={(e) => setAllergiesYes(e.target.checked)}
                          />
                        </td>
                        <td className="text-center">
                          <Form.Check
                            type="checkbox"
                            checked={allergiesYes === false}
                            onChange={(e) =>
                              setAllergiesYes(e.target.checked ? false : null)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            placeholder="_____________"
                            value={allergiesComment || ""}
                            onChange={(e) =>
                              setAllergiesComment(e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Past Surgeries</Form.Label>
                    <Form.Control
                      type="text"
                      value={pastSurgeries}
                      onChange={(e) => setPastSurgeries(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                {renderDiagnosesTable(
                  "Mental Health Diagnoses",
                  psychiatricDiagnoses,
                  setPsychiatricDiagnoses,
                )}
                {renderDiagnosesTable(
                  "Medical Diagnoses",
                  medicalDiagnoses,
                  setMedicalDiagnoses,
                )}
              </Row>
            </Card.Body>
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
                          onChange={() =>
                            handleCheckboxChangeDischargePlanning(opt)
                          }
                        />
                      ))}
                      {(dischargePlanningAndAfterCarePlanning ?? []).includes(
                        "Other",
                      ) && (
                        <BorderlessInput
                          value={dischargePlanningAndAfterCarePlanningOther}
                          setState={
                            setDischargePlanningAndAfterCarePlanningOther
                          }
                          placeholder=""
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
                        onChange={() =>
                          setIsAdditionalDischargePlanningChecked((prev) =>
                            prev === true ? null : true,
                          )
                        }
                      />{" "}
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="preassess-additional-discharge-no"
                        checked={isAdditionalDischargePlanningChecked === false}
                        onChange={() =>
                          setIsAdditionalDischargePlanningChecked((prev) =>
                            prev === false ? null : false,
                          )
                        }
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
                        onChange={(e) =>
                          setAdditionalDischargePlanningComment(e.target.value)
                        }
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
                      onChange={(e) => setReadinessDischarge(e.target.value)}
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
                          onChange={() =>
                            handleCheckboxChangeRecommendationsForFurtherPrograms(
                              opt,
                            )
                          }
                        />
                      ))}
                      {recommendationsForFurtherPrograms?.includes("Other") && (
                        <BorderlessInput
                          value={recommendationsForFurtherProgramsOther}
                          setState={setRecommendationsForFurtherProgramsOther}
                          placeholder=""
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
                        onChange={() =>
                          handleCheckboxChangeAfterCareAndTransitionPlanning(
                            "National suicide hotline 988 or 1-800-273-8255",
                          )
                        }
                      />
                      <Form.Check
                        inline
                        label="Emergency care 911"
                        type="checkbox"
                        id="preassess-aftercare-emergency"
                        checked={(
                          afterCareAndTransitionPlanning ?? []
                        ).includes("Emergency care 911")}
                        onChange={() =>
                          handleCheckboxChangeAfterCareAndTransitionPlanning(
                            "Emergency care 911",
                          )
                        }
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
                        onChange={() =>
                          handleCheckboxChangeAfterCareAndTransitionPlanning(
                            "24-Hour crisis in Maricopa County 602-222-9444",
                          )
                        }
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-end gap-3 align-items-center mb-5 mt-4">
            <button
              className="employee_create_btn hidePrint"
              type="submit"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "SUBMIT"}
            </button>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default HOC({
  Wcomponenet: ReassessmentForm,
});
