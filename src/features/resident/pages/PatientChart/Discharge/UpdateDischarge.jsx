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
import {
  DISCHARGE_PLANNING_OPTIONS,
  PRESENTING_PROBLEMS_OPTIONS,
} from "@/features/shared/constants";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import { BorderlessInput } from "@/utils/Makers";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
const UpdateDischarge = () => {
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
  const [openSigner, setOpenSigner] = useState(false);
  const [staffTime, setStaffTime] = useState("");
  const [bhpTime, setBhpTime] = useState("");
  const { id } = useParams();
  const [data, setData] = useState({});
  const [patientGuardianSignatureTime, setPatientGaurdianSignatureTime] =
    useState("");
  const [signers, setSigners] = useState([]);
  const [idPatient, setIdPatient] = useState();
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
  const [modeOfTransportation, setModeOfTransportation] = useState([]);
  const [modeOfTransportationOther, setModeOfTransportationOther] =
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
  };

  const initialFormData = {
    patientId: data?.data?.patientId?._id,
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
    medicationUponDischarge,
    fundsPropertiesUponDischarge,
    reasonForDischarge,
    patientGuardianSignature,
    patientGuardianSignatureDate,
    patientGuardianSignatureTime,
    staffNameAndTitle,
    staffSignature,
    staffSignatureDate,
    staffSignatureTime: staffTime,
    bhpNameAndCredentials,
    bhpSignature,
    bhpSignatureDate,
    bhpSignatureTime: bhpTime,
    saveAsDraft,
    modeOfTransportation,
    modeOfTransportationOther,
    agreeWithDischarge,
    disagreeWithDischarge,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    signatures,
    signers,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    patientChartService.dischargeSummary.update(
      id || data?.data[0]?._id,
      initialFormData,
      {
        setLoading,
        navigate,
        successMsg: "Discharge Summary Updated Successfully!",
      },
    );
  };
  useEffect(() => {
    getData(setData, `employee/getDischargeSummaryById/${id}`);
  }, [id, url]);
  useEffect(() => {
    const item = data?.data;
    if (item) {
      setClientName(item?.clientName);
      setDateOfBirth(item?.patientId?.dateOfBirth);
      setAhcccsId(item?.patientId?.ahcccsId);
      setDiagnosis(item?.patientId?.diagnosis);
      setDateOfAdmission(item?.patientId?.admitDate);
      setDateOfDischarge(item?.dateOfDischarge);

      const savedPP = item?.presentingIssue
        ? typeof item.presentingIssue === "string"
          ? item.presentingIssue
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : item.presentingIssue
        : item?.presentingProblems
          ? typeof item.presentingProblems === "string"
            ? item.presentingProblems
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : item.presentingProblems
          : item?.patientId?.presentingProblems || [];

      setPresentingProblems(
        savedPP.map((s) =>
          typeof s === "string" ? { label: s, value: s } : s,
        ),
      );

      setTreatmentProvided(item?.treatmentProvided);
      setProgress(item?.progress);
      setMedicationUponDischarge(item?.medicationUponDischarge);
      setFundsPropertiesUponDischarge(item?.fundsPropertiesUponDischarge);
      setReasonForDischarge(item?.reasonForDischarge);
      setPatientGuardianSignature(item?.patientGuardianSignature);
      setPatientGuardianSignatureDate(item?.patientGuardianSignatureDate);
      setStaffNameAndTitle(item?.staffNameAndTitle);
      setStaffSignature(item?.staffSignature);
      setStaffSignatureDate(item?.staffSignatureDate);
      setStaffTime(item?.staffSignatureTime);
      setBhpNameAndCredentials(item?.bhpNameAndCredentials);
      setBhpSignature(item?.bhpSignature);
      setBhpSignatureDate(item?.bhpSignatureDate);
      setBhpTime(item?.bhpSignatureTime);
      setStaffTime(item?.staffSignatureTime);
      setModeOfTransportation(item?.modeOfTransportation);
      setModeOfTransportationOther(item?.modeOfTransportationOther);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setAdminSignedTime(item?.adminSignedTime);
      setPatientGaurdianSignatureTime(item?.patientGuardianSignatureTime);
      setAgreeWithDischarge(item?.agreeWithDischarge === true);
      setDisagreeWithDischarge(item?.disagreeWithDischarge === true);
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
    (signer) => signer.signerId === profileInfo._id,
  );
  if (signerIndex === -1 || signerIndex === undefined || signerIndex === null) {
    signerIndex = signers?.findIndex?.((signer) =>
      profileInfo?.patientsAssigned?.includes(signer.signerId),
    );
  }
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
      setSigners((prevSigners) => {
        const signerIndex = prevSigners.findIndex(
          (signer) => signer.signerId === profileInfo?._id,
        );
        if (signerIndex !== -1) {
          const updatedSigners = [...prevSigners];
          updatedSigners[signerIndex] = {
            ...updatedSigners[signerIndex],
            signedTime: time,
          };
          return updatedSigners;
        } else {
          return [
            ...prevSigners,
            {
              signerId: profileInfo._id,
              name: `${profileInfo?.firstName} ${profileInfo?.lastName}`,
              value: profileInfo._id,
              label: `${profileInfo?.firstName} ${profileInfo?.lastName}`,
              signature: "",
              dateSigned: "",
              signedTime: time,
            },
          ];
        }
      });
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };
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
            ? setBhpSignatureDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          data?.data?.employeeId === profileInfo?._id ||
          profileInfo?.patientsAssigned?.includes(data?.data?.employeeId)
            ? setBhpTime(time)
            : editTimeHandler(time)
        }
      />
      <NavWrapper title={"Discharge Summary"} isArrow={true} />
      <Container>
        <Form onSubmit={submitHandler}>
          <Card
            body
            className={`mb-2 mb-md-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Resident</Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
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
                  <Form.Label className="fw-bold">DOB</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(dateOfBirth)}
                    disabled
                    onChange={(selectedDate) =>
                      setDateOfBirth(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          dateOfBirth
                            ? formatDateToMMDDYYYY(dateOfBirth)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
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
              <Col xs={12} md={6} lg={6}>
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
                    disabled={url === "/create-discharge-summary-resident"}
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
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    type="text"
                    onChange={(e) => {
                      setTreatmentProvided(e.target.value);
                    }}
                    value={treatmentProvided}
                    disabled={url === "/create-discharge-summary-resident"}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Progress</Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    type="text"
                    onChange={(e) => {
                      setProgress(e.target.value);
                    }}
                    value={progress}
                    disabled={url === "/create-discharge-summary-resident"}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Medication Upon Discharge
                  </Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    type="text"
                    onChange={(e) => {
                      setMedicationUponDischarge(e.target.value);
                    }}
                    value={medicationUponDischarge}
                    disabled={url === "/create-discharge-summary-resident"}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Funds/Properties Upon Discharge
                  </Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    type="text"
                    onChange={(e) => {
                      setFundsPropertiesUponDischarge(e.target.value);
                    }}
                    value={fundsPropertiesUponDischarge}
                    disabled={url === "/create-discharge-summary-resident"}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Reason for Discharge
                  </Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    type="text"
                    onChange={(e) => {
                      setReasonForDischarge(e.target.value);
                    }}
                    value={reasonForDischarge}
                    disabled={url === "/create-discharge-summary-resident"}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
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
                                id={`update-discharge-planning-${idx}`}
                                checked={(
                                  data?.data?.patientId
                                    ?.dischargePlanningAndAfterCarePlanning ??
                                  []
                                ).includes(opt)}
                                disabled
                              />
                            ))}
                            {(
                              data?.data?.patientId
                                ?.dischargePlanningAndAfterCarePlanning ?? []
                            ).includes("Other") && (
                              <BorderlessInput
                                value={
                                  data?.data?.patientId
                                    ?.dischargePlanningAndAfterCarePlanningOther ||
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
                              id="update-additional-discharge-yes"
                              checked={
                                data?.data?.patientId
                                  ?.isAdditionalDischargePlanningChecked ===
                                true
                              }
                              disabled
                            />{" "}
                            <Form.Check
                              inline
                              label="No"
                              type="checkbox"
                              id="update-additional-discharge-no"
                              checked={
                                data?.data?.patientId
                                  ?.isAdditionalDischargePlanningChecked ===
                                false
                              }
                              disabled
                            />
                          </div>
                        </Form.Group>
                        {data?.data?.patientId
                          ?.isAdditionalDischargePlanningChecked && (
                          <Form.Group className="mt-3">
                            <Form.Label className="fw-bold">
                              Specify ( If Others )
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              className={`${!data?.data?.patientId?.additionalDischargePlanningComment && "hidePrint"}`}
                              value={
                                data?.data?.patientId
                                  ?.additionalDischargePlanningComment || ""
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
                            className={`${!data?.data?.patientId?.readinessDischarge && "hidePrint"}`}
                            value={
                              data?.data?.patientId?.readinessDischarge || ""
                            }
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
                            <Form.Check
                              inline
                              label="PHP"
                              type="checkbox"
                              id="update-transition-php"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("PHP")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="IOP"
                              type="checkbox"
                              id="update-transition-iop"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("IOP")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Sober living"
                              type="checkbox"
                              id="update-transition-sober"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("Sober living")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Home"
                              type="checkbox"
                              id="update-transition-home"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("Home")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Flex Care 23.9"
                              type="checkbox"
                              id="update-transition-flex239"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("Flex Care 23.9")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Flex Care 16"
                              type="checkbox"
                              id="update-transition-flex16"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("Flex Care 16")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Flex Care 8"
                              type="checkbox"
                              id="update-transition-flex8"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("Flex Care 8")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="ABHTH"
                              type="checkbox"
                              id="create-transition-flex8"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("ABHTH")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Transition to ALTC"
                              type="checkbox"
                              id="create-transition-flex8"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("Transition to ALTC")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Other"
                              type="checkbox"
                              id="update-transition-other"
                              checked={(
                                data?.data?.patientId
                                  ?.recommendationsForFurtherPrograms ?? []
                              ).includes("Other")}
                              disabled
                            />
                            {(
                              data?.data?.patientId
                                ?.recommendationsForFurtherPrograms ?? []
                            ).includes("Other") && (
                              <BorderlessInput
                                value={
                                  data?.data?.patientId
                                    ?.recommendationsForFurtherProgramsOther ||
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
                              id="update-aftercare-suicide-hotline"
                              checked={(
                                data?.data?.patientId
                                  ?.afterCareAndTransitionPlanning ?? []
                              ).includes(
                                "National suicide hotline 988 or 1-800-273-8255",
                              )}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="Emergency care 911"
                              type="checkbox"
                              id="update-aftercare-emergency"
                              checked={(
                                data?.data?.patientId
                                  ?.afterCareAndTransitionPlanning ?? []
                              ).includes("Emergency care 911")}
                              disabled
                            />
                            <Form.Check
                              inline
                              label="24-Hour crisis in Maricopa County 602-222-9444"
                              type="checkbox"
                              id="update-aftercare-crisis"
                              checked={(
                                data?.data?.patientId
                                  ?.afterCareAndTransitionPlanning ?? []
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
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
                      }
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
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
                      }
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
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
                      }
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
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
                      }
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
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
                      }
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
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
                      }
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
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
                      }
                      label="Transported by EMS"
                      type="checkbox"
                      id="TransportedByEMS"
                      checked={modeOfTransportation?.includes(
                        "Transported by EMS",
                      )}
                      onChange={() =>
                        handleCheckboxChangeTransportation("Transported by EMS")
                      }
                    />
                    <Form.Check
                      inline
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
                      }
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
                        disabled={
                          profileInfo?.userType === ROLES.PATIENT ||
                          profileInfo?.userType === ROLES.GUARDIAN
                            ? true
                            : false
                        }
                      />
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Card
            body
            className={`mb-2 mb-md-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Row
              className={`my-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
            >
              <Col xs={12}>
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
          </Card>

          <Row
            className={`${saveAsDrafIsNotEditableWithoutSigner && "pe-none"}`}
          >
            <Col xs={12} md={12} lg={6}>
              <Button
                type="button"
                onClick={() => guardTyped(() => setOpenSigner(true))}
                className="theme-button"
              >
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <div>
                {/* {signatureFormat({
                  sign: staffSignature,
                  date: staffSignatureDate,
                  time: staffTime,
                  hoursFormat,
                })} */}
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
                  /* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): submit gate
                 reverted + Witness coupled-pair (2026-04-26). See
                 documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */ disabled={
                    witnessIncomplete || !isSubmitEnabled
                  }
                  /* TEMP-DISABLED-BHP-BHT-ADMIN: disabled={!isSubmitEnabled || !allPenSigsHaveNames} */
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
  Wcomponenet: UpdateDischarge,
});
