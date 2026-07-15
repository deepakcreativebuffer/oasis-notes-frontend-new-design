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
import { getData } from "@/features/shared/services";
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
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import { DISCHARGE_PLANNING_OPTIONS } from "@/features/shared/constants";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
const UpdateDischargePlannning = () => {
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
  const [supportGroupsOther, setSupportGroupsOther] = useState([]);
  const [supportGroups, setSupportGroups] = useState([]);
  const [supportGroupsBoolean, setSupportGroupsBoolean] = useState(false);
  const [location, setLocation] = useState("");
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

  const {
    signatures,
    updateSignature,
    loadFromApi: loadSignaturesFromApi,
  } = useSignatures();
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

  const initialFormData = {
    patientId: data?.data?.patientId?._id,
    clientName,
    dateOfBirth,
    dateOfAdmission,
    dateOfDischarge,
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
    bhpSignature,
    bhpSignatureDateTime,
    saveAsDraft,
    adminSignature,
    adminDateSigned,
    signatures,
    signers,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    patientChartService.dischargePlanning.update(
      id || data?.data[0]?._id,
      initialFormData,
      { setLoading, navigate },
    );
  };
  useEffect(() => {
    getData(setData, `discharge-planning/${id}`);
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
      setAssignedCaseManager(item?.assignedCaseManager);
      setResidentProgressMade(item?.residentProgressMade || []);
      setResidentProgressMadeBoolean(
        item?.residentProgressMade?.includes("Other") || false,
      );
      setResidentProgressMadeOther(item?.residentProgressMadeOther || "");
      setTherapyEngagement(item?.therapyEngagement);
      setEmotionalRegulation(item?.emotionalRegulation);
      setPcp(item?.patientId?.primaryCareProvider);
      setPrimaryCareProviderContact(
        item?.patientId?.primaryCareProviderContact,
      );
      setPrimaryCareProviderAddress(
        item?.patientId?.primaryCareProviderAddress,
      );
      setPsych(item?.patientId?.psychiatricProvider);
      setPsychiatricProviderContact(
        item?.patientId?.psychiatricProviderContact,
      );
      setPsychiatricProviderAddress(
        item?.patientId?.psychiatricProviderAddress,
      );
      setStepDownBarriers(item?.patientId?.stepDownBarriers || []);
      setStepDownBarriersBoolean(
        item?.patientId?.stepDownBarriers?.includes("Other") || false,
      );
      setStepDownBarriersOther(item?.patientId?.stepDownBarriersOther || "");
      setStepDownBarriersText(item?.patientId?.stepDownBarriersText || "");

      setDischargePlanningAndAfterCarePlanning(
        item?.dischargePlanningAndAfterCarePlanning ||
          item?.patientId?.dischargePlanningAndAfterCarePlanning ||
          [],
      );
      setDischargePlanningAndAfterCarePlanningOther(
        item?.dischargePlanningAndAfterCarePlanningOther ||
          item?.patientId?.dischargePlanningAndAfterCarePlanningOther ||
          "",
      );
      setIsAdditionalDischargePlanningChecked(
        item?.isAdditionalDischargePlanningChecked ??
          item?.patientId?.isAdditionalDischargePlanningChecked ??
          null,
      );
      setAdditionalDischargePlanningComment(
        item?.additionalDischargePlanningComment ||
          item?.patientId?.additionalDischargePlanningComment ||
          "",
      );
      setReadinessDischarge(
        item?.readinessDischarge || item?.patientId?.readinessDischarge || "",
      );
      setRecommendationsForFurtherPrograms(
        item?.recommendationsForFurtherPrograms ||
          item?.patientId?.recommendationsForFurtherPrograms ||
          [],
      );
      setRecommendationsForFurtherProgramsOther(
        item?.recommendationsForFurtherProgramsOther ||
          item?.patientId?.recommendationsForFurtherProgramsOther ||
          "",
      );
      setAfterCareAndTransitionPlanning(
        item?.afterCareAndTransitionPlanning ||
          item?.patientId?.afterCareAndTransitionPlanning ||
          [],
      );
      setSupportGroups(item?.patientId?.supportGroups || []);
      setSupportGroupsBoolean(
        item?.patientId?.supportGroups?.includes("Other") || false,
      );
      setSupportGroupsOther(item?.patientId?.supportGroupsOther || "");
      setLocation(item?.patientId?.location || []);
      setLocationBoolean(item?.patientId?.location?.includes("Other") || false);
      setLocationOther(item?.patientId?.locationOther || "");
      setConclusion(item?.conclusion);
      setBht(item?.bht);
      setBhp(item?.bhp);
      setOthers(item?.others);
      setCounselor(item?.counselor);
      setBhpSignature(item?.bhpSignature);
      setBhpSignatureDateTime(item?.bhpSignatureDateTime);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setSigners(item?.signers);
      if (item?.signatures) {
        loadSignaturesFromApi(item.signatures);
      }
    }
  }, [data, url, loadSignaturesFromApi]);
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
      isGuadianConditionValid ||
      hasAnyPenSig
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
    hasAnyPenSig,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [bhpSignature, adminSignature, id, checkSign, hasAnyPenSig]);
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
      {typedGuardDialog}
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
      <NavWrapper title={"Discharge Planning"} isArrow={true} />
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
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
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
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Row>
                <Row>
                  <Form.Label className="fw-bold">
                    Medication Management:
                  </Form.Label>
                </Row>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold mx-2">
                      Primary Care Provider Name:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      value={pcp}
                      onChange={(e) => setPcp(e.target.value)}
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold mx-2">
                      Primary Care Provider Contact:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      value={primaryCareProviderContact}
                      onChange={(e) =>
                        setPrimaryCareProviderContact(e.target.value)
                      }
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold mx-2">
                      Primary Care Provider Address:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      value={primaryCareProviderAddress}
                      onChange={(e) =>
                        setPrimaryCareProviderAddress(e.target.value)
                      }
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold mx-2">
                      Psychiatric Provider Name:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      value={psych}
                      onChange={(e) => setPsych(e.target.value)}
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold mx-2">
                      Psychiatric Provider Contact:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      value={psychiatricProviderContact}
                      onChange={(e) =>
                        setPsychiatricProviderContact(e.target.value)
                      }
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold mx-2">
                      Psychiatric Provider Address:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      value={psychiatricProviderAddress}
                      onChange={(e) =>
                        setPsychiatricProviderAddress(e.target.value)
                      }
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
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
                        className={
                          profileInfo?.userType === ROLES.PATIENT ||
                          profileInfo?.userType === ROLES.GUARDIAN
                            ? "pe-none"
                            : ""
                        }
                      />
                    ))}
                    {residentProgressMadeBoolean && (
                      <BorderlessInput
                        value={residentProgressMadeOther}
                        setState={setResidentProgressMadeOther}
                        placeholder="Other progress"
                        className={
                          profileInfo?.userType === ROLES.PATIENT ||
                          profileInfo?.userType === ROLES.GUARDIAN
                            ? "pe-none"
                            : ""
                        }
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
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
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
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    onChange={(e) => setEmotionalRegulation(e.target.value)}
                  ></Form.Control>
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

          <Card
            body
            className={
              profileInfo?.userType === ROLES.PATIENT ||
              profileInfo?.userType === ROLES.GUARDIAN
                ? "pe-none mb-3"
                : "mb-3"
            }
          >
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
                checked={supportGroups?.includes("Other")}
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

          <Card className="mb-3">
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label className="fw-bold p-3">
                    Post discharge plan:{" "}
                  </Form.Label>
                  <div>
                    <p className="px-3">
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
                id="Others1"
                value={others}
                placeholder="Enter text"
                onChange={(e) => setOthers(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>

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
              signature={signatures?.resident}
              onUpdate={updateSignature}
              signerNameOverride={clientName || ""}
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
            <SignatureSection
              role="witness"
              label="Witness Signature"
              variant="yellow"
              signature={signatures?.witness}
              onUpdate={updateSignature}
              externalName
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
          </div>

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
                  signer.signature &&
                  signer.signature !== bhpSignature &&
                  signer.signature !== adminSignature && (
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
                  disabled={!isSubmitEnabled || witnessIncomplete}
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
  Wcomponenet: UpdateDischargePlannning,
});
