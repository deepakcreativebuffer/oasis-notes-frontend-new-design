/* eslint-disable no-unused-vars */
/** @format */

// NOTE: Form is "Staffing Note" in code (file name, state, schema fields)
// but "ART Meeting" in the UI. See CreateStaffNote.js header for context.

import React, { useCallback, useEffect, useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { patientChartService } from "@/features/shared/services";
import NavWrapper from "@/utils/NavWrapper";
import { BorderlessInput, RadioMaker } from "@/utils/Makers";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import HOC from "@/features/shared/layout/Inner/HOC";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import { PRESENTING_PROBLEMS_OPTIONS } from "@/features/shared/constants";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
const UpdateStaffNote = () => {
  const url = useLocation().pathname;
  const profileInfo = useSelector(userProfile);
  const navigate = useNavigate();
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [beginTime, setBeginTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [admitDate, setAdmitDate] = useState("");
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
  const { id } = useParams();
  const [details, setDetails] = useState({});
  const [signers, setSigners] = useState([]);
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
  const {
    signatures,
    updateSignature,
    loadFromApi: loadSignaturesFromApi,
  } = useSignatures();
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
    recommendations,
    staffSignature,
    signedTime,
    signedDate,
    staffingWithin30Days,
    reasonForNoStaffingWithin30Days,
    goalsAddressed,
    clinicTreatmentPlanRequested,
    stepDownDiscussed,
    explanationForNoStaffing,
    saveAsDraft,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    signatures,
    signers,
  };
  const fetchHandler = () => {
    patientChartService.staffingNote.getById(id, { setResponse: setDetails });
  };
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const submitHandler = (e) => {
    e.preventDefault();
    patientChartService.staffingNote.update(
      id || details?.data[0]?._id,
      payload,
      { setLoading, navigate, successMsg: "Created" },
    );
  };
  useEffect(() => {
    if (details?.data) {
      const item = details?.data;
      setPatientId(item?.patientId);
      setAhcccsId(item?.patientId?.ahcccsId);
      setDiagnosis(item?.patientId?.diagnosis);
      setAdmitDate(item?.patientId?.admitDate);

      const savedPP = item?.presentingProblems?.length
        ? item.presentingProblems
        : item?.patientId?.presentingProblems || [];

      setPresentingProblems(
        savedPP.map((s) =>
          typeof s === "string" ? { label: s, value: s } : s,
        ),
      );

      setResidentName(item?.residentName);
      setTodayDate(item?.todayDate);
      setBeginTime(item?.beginTime);
      setEndTime(item?.endTime);
      setParticipantsPresent(item?.participantsPresent);
      setProgress(item?.progress);
      setStepDownBarriers(
        item?.patientId?.stepDownBarriers || item?.patientId?.barries || [],
      );
      setStepDownBarriersOther(item?.patientId?.stepDownBarriersOther || "");
      setStepDownBarriersText(item?.patientId?.stepDownBarriersText || "");
      setStepDownBarriersBoolean(
        (
          item?.patientId?.stepDownBarriers ||
          item?.patientId?.barries ||
          []
        )?.includes("Other") || false,
      );
      setRecommendations(item?.recommendations);
      setStaffSignature(item?.staffSignature);
      setSignedDate(item?.signedDate);
      setSignedTime(item?.signedTime);
      setStaffingWithin30Days(
        item?.staffingWithin30Days === "" || item?.staffingWithin30Days == null
          ? "Yes"
          : item?.staffingWithin30Days,
      );
      setReasonForNoStaffingWithin30Days(
        item?.reasonForNoStaffingWithin30Days || "",
      );
      setGoalAddressed(item?.goalsAddressed);
      setClinicTreatmentPlanRequested(
        item?.clinicTreatmentPlanRequested === "" ||
          item?.clinicTreatmentPlanRequested == null
          ? true
          : item?.clinicTreatmentPlanRequested,
      );
      setStepDownDiscussed(
        item?.stepDownDiscussed === "" || item?.stepDownDiscussed == null
          ? true
          : item?.stepDownDiscussed,
      );
      setExplanationForNoStaffing(item?.explanationForNoStaffing);
      setSigners(item?.signers);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setAdminSignedTime(item?.adminSignedTime);
      if (item?.signatures) {
        loadSignaturesFromApi(item.signatures);
      }
    }
  }, [details, url, loadSignaturesFromApi]);
  useEffect(() => {
    if (!details?.data) return;
    if (details?.data) {
      const { saveAsDraft, signers } = details.data;
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
        .includes("sn");
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
    details?.data,
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
      (details?.data?.employeeId === profileInfo?._id ||
        details?.data?.employeeId?._id === profileInfo?._id) &&
      staffSignature?.length > 0;
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
    details?.data?.employeeId,
    staffSignature?.length,
    hasAnyPenSig,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [staffSignature, adminSignature, id, checkSign, hasAnyPenSig]);
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
      setSignedTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };
  return (
    <>
      {typedGuardDialog}
      <AddSignature
        show={open}
        setValue={(sign) =>
          details?.data?.employeeId === profileInfo?._id
            ? setStaffSignature(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          details?.data?.employeeId === profileInfo?._id
            ? setSignedDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          details?.data?.employeeId === profileInfo?._id
            ? setSignedTime(time)
            : editTimeHandler(time)
        }
      />
      <NavWrapper isArrow={true} title={"ART Meeting"} />
      <Container>
        <Form onSubmit={submitHandler}>
          <Row
            className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Col xs={12} md={4} lg={4}>
              <Card body className="mb-3">
                <Form.Label className="fw-bold w-100">
                  Resident Name:{" "}
                </Form.Label>
                <Form.Control value={residentName} disabled />
              </Card>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <Card body className="mb-3">
                <Form.Label className="fw-bold">AHCCCS ID: </Form.Label>
                <Form.Control value={ahcccsId} disabled />
              </Card>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <Card body className="mb-3">
                <Form.Group className="d-flex flex-column">
                  <Form.Label className="fw-bold">Admit Date</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(admitDate)}
                    disabled
                    onChange={(selectedDate) =>
                      setAdmitDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none form-control"
                        : "form-control"
                    }
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
              </Card>
            </Col>
          </Row>
          <Card
            className={`mb-2 mb-md-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Card.Body>
              <Row>
                <Col xs={12} md={4} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">Begin time</Form.Label>

                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={
                        beginTime ? parseTimeStringToDate(beginTime) : null
                      }
                      onChange={setBeginTime}
                      disabled={
                        url === "/create-staff-note-resident" ||
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                      }
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
                      disabled={
                        url === "/create-staff-note-resident" ||
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                      }
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={4} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">Date</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(todayDate)}
                      disabled={url === "/create-staff-note-resident"}
                      onChange={(selectedDate) =>
                        setTodayDate(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none form-control"
                          : "form-control"
                      }
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
              </Row>
              <Row>
                <Col xs={12} md={4} lg={4}>
                  <Form.Label className="fw-bold">
                    Diagnosis (specify if new or continuing):{" "}
                  </Form.Label>
                  <Form.Control value={diagnosis} disabled />
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card
            className={`mb-2 mb-md-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Card.Body>
              <Row>
                <Col xs={12} md={12} lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Participant</Form.Label>
                    <Form.Control
                      onChange={(e) => setParticipantsPresent(e.target.value)}
                      className={
                        profileInfo?.userType === ROLES.PATIENT ||
                        profileInfo?.userType === ROLES.GUARDIAN
                          ? "pe-none"
                          : ""
                      }
                      as="textarea"
                      rows={3}
                      value={participantsPresent}
                      disabled={url === "/create-staff-note-resident"}
                    />
                  </Form.Group>
                </Col>
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
              </Row>
            </Card.Body>
          </Card>

          <Row
            className={` ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
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
                      disabled={url === "/create-staff-note-resident"}
                    />
                    <RadioMaker
                      name="staffingWithin30Days"
                      setValue={setStaffingWithin30Days}
                      value={"No"}
                      id={"staffingWithin30Days2"}
                      label={"No"}
                      checked={staffingWithin30Days}
                      disabled={url === "/create-staff-note-resident"}
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
                        className={
                          profileInfo?.userType === ROLES.PATIENT ||
                          profileInfo?.userType === ROLES.GUARDIAN
                            ? "pe-none"
                            : ""
                        }
                        value={reasonForNoStaffingWithin30Days}
                        disabled={url === "/create-staff-note-resident"}
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
                      disabled={url === "/create-staff-note-resident"}
                    />
                    <RadioMaker
                      name="clinicTreatmentPlanRequested"
                      setValue={setClinicTreatmentPlanRequested}
                      value={false}
                      id={"clinicTreatmentPlanRequested2"}
                      label={"No"}
                      checked={clinicTreatmentPlanRequested}
                      disabled={url === "/create-staff-note-resident"}
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
                      disabled={url === "/create-staff-note-resident"}
                    />
                    <RadioMaker
                      name="stepDownDiscussed"
                      setValue={setStepDownDiscussed}
                      value={false}
                      id={"stepDownDiscussed2"}
                      label={"No"}
                      checked={stepDownDiscussed}
                      disabled={url === "/create-staff-note-resident"}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card
            body
            className={`mb-2 mb-md-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Were resident’s goals addressed
                  </Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    as="textarea"
                    rows={3}
                    onChange={(e) => setGoalAddressed(e.target.value)}
                    value={goalsAddressed}
                    disabled={url === "/create-staff-note-resident"}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    ART Meeting Summary
                  </Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    as="textarea"
                    rows={3}
                    onChange={(e) => setProgress(e.target.value)}
                    value={progress}
                    disabled={url === "/create-staff-note-resident"}
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
                        label: "Lack of Mental Health professionals & Services",
                        value: "Lack of Mental Health professionals & Services",
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
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    as="textarea"
                    rows={3}
                    onChange={(e) =>
                      setExplanationForNoStaffing(e.target.value)
                    }
                    value={explanationForNoStaffing}
                    disabled={url === "/create-staff-note-resident"}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Recommendations</Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    as="textarea"
                    rows={3}
                    onChange={(e) => setRecommendations(e.target.value)}
                    value={recommendations}
                    disabled={url === "/create-staff-note-resident"}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Row
            className={`mb-3 ${saveAsDrafIsNotEditableWithoutSigner && "pe-none"}`}
          >
            <Col xs={12}>
              <Form.Label className="fw-bold">
                Name and Signature of person completing this report:
              </Form.Label>
            </Col>
            <Col xs={12} md={6}>
              <Button
                type="button"
                className="theme-button"
                onClick={() => guardTyped(() => setOpen(true))}
              >
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-md-end">
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
              </div>
              {signers?.map(
                (signer, i) =>
                  signer.signature && (
                    <div className="text-md-end" key={signer?.signerId}>
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
          <Row>
            <Col>
              <div className="employee-btn-joiner mt-3 mt-md-5">
                {details?.data?.saveAsDraft && (
                  <button
                    className={`draft ${saveAsDrafIsNotEditableWithoutSigner && "pe-none"}`}
                    type="submit"
                    onClick={() => setSaveAsDraft(true)}
                  >
                    Save as Draft
                  </button>
                )}
                <button
                  className="employee_create_btn"
                  type="submit"
                  /* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): submit gate
                 reverted + Witness coupled-pair check (2026-04-26). See
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
  Wcomponenet: UpdateStaffNote,
});
