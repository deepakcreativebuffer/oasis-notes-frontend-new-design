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
  parseTimeStringToDate,
} from "@/utils/utils";
import { CheckBoxMaker, BorderlessInput } from "@/utils/Makers";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
const UpdateBhpProgress = () => {
  const navigate = useNavigate();
  const url = useLocation().pathname;
  const profileInfo = useSelector(userProfile);
  const isPatient = profileInfo?.userType === ROLES.PATIENT;
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [dateOfAdmission, setDateOfAdmission] = useState("");
  const [dateOfDischarge, setDateOfDischarge] = useState(
    new Date().toDateString(),
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalDuration, setTotalDuration] = useState("");
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
  const [reasonForContinuedStay, setReasonForContinuedStay] = useState("");
  const [bhpNameAndCredentials, setBhpNameAndCredentials] = useState("");
  const [stepDownBarriers, setStepDownBarriers] = useState([]);
  const [stepDownBarriersOther, setStepDownBarriersOther] = useState("");
  const [stepDownBarriersText, setStepDownBarriersText] = useState("");
  const [stepDownBarriersBoolean, setStepDownBarriersBoolean] = useState(false);
  const [progressTowardsTreatment, setProgressTowardsTreatment] = useState("");
  const [continuedTherapeutic, setContinuedTherapeutic] = useState("");
  const [addressingCognitive, setAddressingCognitive] = useState("");
  const [sustainingSobriety, setSustainingSobriety] = useState("");
  const [residentProgress, setResidentProgress] = useState("");
  const [dress, setDress] = useState([]);
  const [dressOther, setDressOther] = useState("");
  const [grooming, setGrooming] = useState([]);
  const [psychomotorActivity, setPsychomotorActivity] = useState([]);
  const [speech, setSpeech] = useState([]);
  const [affect, setAffect] = useState([]);
  const [affectOther, setAffectOther] = useState("");
  const [mood, setMood] = useState([]);
  const [moodOther, setMoodOther] = useState("");
  const [process, setProcess] = useState([]);
  const [processOther, setProcessOther] = useState("");
  const [content, setContent] = useState([]);
  const [contentOther, setContentOther] = useState("");
  const [perceptions, setPerceptions] = useState([]);
  const [judgment, setJudgment] = useState([]);
  const [insight, setInsight] = useState([]);
  const [suicidalIdeation, setSuicidalIdeation] = useState("");
  const [suicidalIdeationOther, setSuicidalIdeationOther] = useState("");
  const [placeOfService, setPlaceOfService] = useState("");

  const {
    signatures,
    updateSignature,
    loadFromApi: loadSignaturesFromApi,
  } = useSignatures();
  const { dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });

  const hasTypedInForm = !!bhpSignature || !!adminSignature;

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
    setBhpSignature("");
    setBhpSignatureDateTime("");
    setAdminSignature("");
    setAdminDateSigned("");
    setAdminSignedTime("");
  };

  useEffect(() => {
    if (startTime && endTime) {
      const start = parseTimeStringToDate(startTime);
      const end = parseTimeStringToDate(endTime);
      if (start && end) {
        let diff = (end - start) / 60000;
        if (diff < 0) diff += 24 * 60;
        const hours = Math.floor(diff / 60);
        const mins = Math.round(diff % 60);
        let result = "";
        if (hours > 0) result += `${hours} hr${hours > 1 ? "s" : ""} `;
        if (mins > 0) result += `${mins} min${mins > 1 ? "s" : ""}`;
        result = result.trim();
        setTotalDuration(result);
      }
    } else {
      setTotalDuration("");
    }
  }, [startTime, endTime]);
  const initialFormData = {
    patientId: data?.data?.patientId?._id,
    clientName,
    dateOfBirth,
    reasonForContinuedStay,
    stepDownBarriers,
    stepDownBarriersOther,
    stepDownBarriersText,
    progressTowardsTreatment,
    continuedTherapeutic,
    sustainingSobriety,
    dateOfAdmission,
    startTime,
    endTime,
    totalDuration,
    addressingCognitive,
    dateOfDischarge,
    residentProgress,
    dress,
    dressOther,
    grooming,
    psychomotorActivity,
    speech,
    affect,
    affectOther,
    mood,
    moodOther,
    process,
    processOther,
    content,
    contentOther,
    perceptions,
    judgment,
    insight,
    suicidalIdeation,
    suicidalIdeationOther,
    bhpNameAndCredentials,
    bhpSignature,
    bhpSignatureDateTime,
    saveAsDraft,
    adminSignature,
    adminDateSigned,
    signers,
    placeOfService,
    signatures,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    patientChartService.bhpProgress.update(
      id || data?.data[0]?._id,
      initialFormData,
      { setLoading, navigate },
    );
  };
  useEffect(() => {
    patientChartService.bhpProgress.getById(id, { setResponse: setData });
  }, [id, url]);
  useEffect(() => {
    const item = data?.data;
    if (item) {
      setDateOfDischarge(item?.dateOfDischarge || new Date().toDateString());
      setClientName(item?.clientName);
      setReasonForContinuedStay(item?.reasonForContinuedStay);
      setBhpNameAndCredentials(item?.bhpNameAndCredentials);
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
      setProgressTowardsTreatment(item?.progressTowardsTreatment);
      setContinuedTherapeutic(item?.continuedTherapeutic);
      setAddressingCognitive(item?.addressingCognitive);
      setSustainingSobriety(item?.sustainingSobriety);
      setResidentProgress(item?.residentProgress);
      setStartTime(item?.startTime || "");
      setEndTime(item?.endTime || "");
      setTotalDuration(item?.totalDuration || "");
      setDateOfBirth(item?.patientId?.dateOfBirth);
      setAhcccsId(item?.patientId?.ahcccsId);
      setDiagnosis(item?.patientId?.diagnosis);
      setDateOfAdmission(item?.patientId?.admitDate);
      setBhpSignature(item?.bhpSignature);
      setBhpSignatureDateTime(item?.bhpSignatureDateTime);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setSigners(item?.signers);
      setPlaceOfService(item?.placeOfService || "");
      setDress(item?.dress || []);
      setDressOther(item?.dressOther || "");
      setGrooming(item?.grooming || []);
      setPsychomotorActivity(item?.psychomotorActivity || []);
      setSpeech(item?.speech || []);
      setAffect(item?.affect || []);
      setAffectOther(item?.affectOther || "");
      setMood(item?.mood || []);
      setMoodOther(item?.moodOther || "");
      setProcess(item?.process || []);
      setProcessOther(item?.processOther || "");
      setContent(item?.content || []);
      setContentOther(item?.contentOther || "");
      setPerceptions(item?.perceptions || []);
      setJudgment(item?.judgment || []);
      setInsight(item?.insight || []);
      setSuicidalIdeation(item?.suicidalIdeation || "");
      setSuicidalIdeationOther(item?.suicidalIdeationOther || "");
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

  const handleCheckboxChangeDress = (dressOption) => {
    setDress((prevState = []) => {
      if (prevState.includes(dressOption)) {
        return prevState.filter((item) => item !== dressOption);
      } else {
        return [...prevState, dressOption];
      }
    });
  };

  const handleCheckboxChangeGrooming = (groomingOption) => {
    setGrooming((prevState = []) => {
      if (prevState.includes(groomingOption)) {
        return prevState.filter((item) => item !== groomingOption);
      } else {
        return [...prevState, groomingOption];
      }
    });
  };

  const handleCheckboxChangePsychomotorActivity = (option) => {
    setPsychomotorActivity((prevState = []) => {
      if (prevState.includes(option)) {
        return prevState.filter((item) => item !== option);
      } else {
        return [...prevState, option];
      }
    });
  };

  const handleCheckboxChangeSpeech = (speechOption) => {
    setSpeech((prevState = []) => {
      if (prevState.includes(speechOption)) {
        return prevState.filter((item) => item !== speechOption);
      } else {
        return [...prevState, speechOption];
      }
    });
  };

  const handleCheckboxChangeAffect = (affectOption) => {
    setAffect((prevState = []) => {
      if (prevState.includes(affectOption)) {
        return prevState.filter((item) => item !== affectOption);
      } else {
        return [...prevState, affectOption];
      }
    });
  };

  const handleCheckboxChangeMood = (moodOption) => {
    setMood((prevState = []) => {
      if (prevState.includes(moodOption)) {
        return prevState.filter((item) => item !== moodOption);
      } else {
        return [...prevState, moodOption];
      }
    });
  };

  const handleCheckboxChangeProcess = (processOption) => {
    setProcess((prevState = []) => {
      if (prevState.includes(processOption)) {
        return prevState.filter((item) => item !== processOption);
      } else {
        return [...prevState, processOption];
      }
    });
  };

  const handleCheckboxChangeContent = (contentOption) => {
    setContent((prevState = []) => {
      if (prevState.includes(contentOption)) {
        return prevState.filter((item) => item !== contentOption);
      } else {
        return [...prevState, contentOption];
      }
    });
  };

  const handleCheckboxChangePerceptions = (perceptionsOption) => {
    setPerceptions((prevState = []) => {
      if (prevState.includes(perceptionsOption)) {
        return prevState.filter((item) => item !== perceptionsOption);
      } else {
        return [...prevState, perceptionsOption];
      }
    });
  };

  const handleCheckboxChangeJudgment = (judgmentOption) => {
    setJudgment((prevState = []) => {
      if (prevState.includes(judgmentOption)) {
        return prevState.filter((item) => item !== judgmentOption);
      } else {
        return [...prevState, judgmentOption];
      }
    });
  };

  const handleCheckboxChangeInsight = (insightOption) => {
    setInsight((prevState = []) => {
      if (prevState.includes(insightOption)) {
        return prevState.filter((item) => item !== insightOption);
      } else {
        return [...prevState, insightOption];
      }
    });
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
      <NavWrapper title={"BHP Progress Notes"} isArrow={true} />
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
                  <Form.Label className="fw-bold">Today's date</Form.Label>
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
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Start Time</Form.Label>
                  <CustomTimePicker
                    use24Hours={hoursFormat === "HH:mm"}
                    value={startTime ? parseTimeStringToDate(startTime) : null}
                    onChange={(e, timeString) => setStartTime(timeString)}
                    disabled={isPatient}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">End Time</Form.Label>
                  <CustomTimePicker
                    use24Hours={hoursFormat === "HH:mm"}
                    value={endTime ? parseTimeStringToDate(endTime) : null}
                    onChange={(e, timeString) => setEndTime(timeString)}
                    disabled={isPatient}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Total Duration</Form.Label>
                  <Form.Control disabled type="text" value={totalDuration} />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Place of Services</Form.Label>
                  <div
                    className={`d-flex align-items-center mt-2 ${isPatient ? "pe-none" : ""}`}
                  >
                    <CheckBoxMaker
                      setValue={() =>
                        setPlaceOfService(
                          placeOfService === "In Person" ? "" : "In Person",
                        )
                      }
                      value="In Person"
                      id="InPerson"
                      label="In Person"
                      checked={placeOfService === "In Person"}
                      className="me-3"
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        setPlaceOfService(
                          placeOfService === "Telehealth" ? "" : "Telehealth",
                        )
                      }
                      value="Telehealth"
                      id="Telehealth"
                      label="Telehealth"
                      checked={placeOfService === "Telehealth"}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Card
            body
            className={`mb-2 mb-md-3 ${
              (saveAsDrafIsNotEditable ||
                saveAsDrafIsNotEditableWithoutSigner ||
                isNotEditableWithSigner ||
                isPatient) &&
              "pe-none"
            }`}
          >
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Focus of session/Therapeutic intervention:
                  </Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    as="textarea"
                    onChange={(e) => {
                      setResidentProgress(e.target.value);
                    }}
                    value={residentProgress}
                    disabled={url === "/create-discharge-summary-resident"}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Sustaining Sobriety and managing physical Health:
                  </Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    as="textarea"
                    onChange={(e) => {
                      setSustainingSobriety(e.target.value);
                    }}
                    value={sustainingSobriety}
                    disabled={url === "/create-discharge-summary-resident"}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Cognitive and emotional challenges:
                  </Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    as="textarea"
                    onChange={(e) => {
                      setAddressingCognitive(e.target.value);
                    }}
                    value={addressingCognitive}
                    disabled={url === "/create-discharge-summary-resident"}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Continued Therapeutic Support:
                  </Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    as="textarea"
                    onChange={(e) => {
                      setContinuedTherapeutic(e.target.value);
                    }}
                    value={continuedTherapeutic}
                    disabled={url === "/create-discharge-summary-resident"}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Progress towards treatment goals:
                  </Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    as="textarea"
                    onChange={(e) => {
                      setProgressTowardsTreatment(e.target.value);
                    }}
                    value={progressTowardsTreatment}
                    disabled={url === "/create-discharge-summary-resident"}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Barriers:</Form.Label>
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
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Planned interventions/Reason for continued stay:
                  </Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    as="textarea"
                    onChange={(e) => {
                      setReasonForContinuedStay(e.target.value);
                    }}
                    value={reasonForContinuedStay}
                    disabled={url === "/create-discharge-summary-resident"}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Dress (clothing/appearance)
                  </Form.Label>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Clothes appear unclean"
                      type="checkbox"
                      id="DressUnclean"
                      checked={dress?.includes("Clothes appear unclean")}
                      onChange={() =>
                        handleCheckboxChangeDress("Clothes appear unclean")
                      }
                    />
                    <Form.Check
                      inline
                      label="Cloths appear clean"
                      type="checkbox"
                      id="DressClean"
                      checked={dress?.includes("Cloths appear clean")}
                      onChange={() =>
                        handleCheckboxChangeDress("Cloths appear clean")
                      }
                    />
                    <Form.Check
                      inline
                      label="Clothes inappropriate to season or situation"
                      type="checkbox"
                      id="DressInappropriate"
                      checked={dress?.includes(
                        "Clothes inappropriate to season or situation",
                      )}
                      onChange={() =>
                        handleCheckboxChangeDress(
                          "Clothes inappropriate to season or situation",
                        )
                      }
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Grooming (hygiene):
                  </Form.Label>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Well Groomed"
                      type="checkbox"
                      id="GroomingWellGroomed"
                      checked={grooming?.includes("Well Groomed")}
                      onChange={() =>
                        handleCheckboxChangeGrooming("Well Groomed")
                      }
                    />
                    <Form.Check
                      inline
                      label="Disheveled"
                      type="checkbox"
                      id="GroomingDisheveled"
                      checked={grooming?.includes("Disheveled")}
                      onChange={() =>
                        handleCheckboxChangeGrooming("Disheveled")
                      }
                    />
                    <Form.Check
                      inline
                      label="Dirt under nails"
                      type="checkbox"
                      id="GroomingDirtUnderNails"
                      checked={grooming?.includes("Dirt under nails")}
                      onChange={() =>
                        handleCheckboxChangeGrooming("Dirt under nails")
                      }
                    />
                    <Form.Check
                      inline
                      label="Malodorous"
                      type="checkbox"
                      id="GroomingMalodorous"
                      checked={grooming?.includes("Malodorous")}
                      onChange={() =>
                        handleCheckboxChangeGrooming("Malodorous")
                      }
                    />
                    <Form.Check
                      inline
                      label="Appropriate"
                      type="checkbox"
                      id="GroomingAppropriate"
                      checked={grooming?.includes("Appropriate")}
                      onChange={() =>
                        handleCheckboxChangeGrooming("Appropriate")
                      }
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Psychomotor Activity:
                  </Form.Label>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Appropriate"
                      type="checkbox"
                      id="PsychomotorAppropriate"
                      checked={psychomotorActivity?.includes("Appropriate")}
                      onChange={() =>
                        handleCheckboxChangePsychomotorActivity("Appropriate")
                      }
                    />
                    <Form.Check
                      inline
                      label="Delayed"
                      type="checkbox"
                      id="PsychomotorDelayed"
                      checked={psychomotorActivity?.includes("Delayed")}
                      onChange={() =>
                        handleCheckboxChangePsychomotorActivity("Delayed")
                      }
                    />
                    <Form.Check
                      inline
                      label="Agitated"
                      type="checkbox"
                      id="PsychomotorAgitated"
                      checked={psychomotorActivity?.includes("Agitated")}
                      onChange={() =>
                        handleCheckboxChangePsychomotorActivity("Agitated")
                      }
                    />
                    <Form.Check
                      inline
                      label="Posturing"
                      type="checkbox"
                      id="PsychomotorPosturing"
                      checked={psychomotorActivity?.includes("Posturing")}
                      onChange={() =>
                        handleCheckboxChangePsychomotorActivity("Posturing")
                      }
                    />
                    <Form.Check
                      inline
                      label="Restless"
                      type="checkbox"
                      id="PsychomotorRestless"
                      checked={psychomotorActivity?.includes("Restless")}
                      onChange={() =>
                        handleCheckboxChangePsychomotorActivity("Restless")
                      }
                    />
                    <Form.Check
                      inline
                      label="Tics/Spasms"
                      type="checkbox"
                      id="PsychomotorTics"
                      checked={psychomotorActivity?.includes("Tics/Spasms")}
                      onChange={() =>
                        handleCheckboxChangePsychomotorActivity("Tics/Spasms")
                      }
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Speech:</Form.Label>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Normal/Baseline"
                      type="checkbox"
                      id="SpeechNormal"
                      checked={speech?.includes("Normal/Baseline")}
                      onChange={() =>
                        handleCheckboxChangeSpeech("Normal/Baseline")
                      }
                    />
                    <Form.Check
                      inline
                      label="Slow"
                      type="checkbox"
                      id="SpeechSlow"
                      checked={speech?.includes("Slow")}
                      onChange={() => handleCheckboxChangeSpeech("Slow")}
                    />
                    <Form.Check
                      inline
                      label="Mumbled"
                      type="checkbox"
                      id="SpeechMumbled"
                      checked={speech?.includes("Mumbled")}
                      onChange={() => handleCheckboxChangeSpeech("Mumbled")}
                    />
                    <Form.Check
                      inline
                      label="Loud"
                      type="checkbox"
                      id="SpeechLoud"
                      checked={speech?.includes("Loud")}
                      onChange={() => handleCheckboxChangeSpeech("Loud")}
                    />
                    <Form.Check
                      inline
                      label="Soft"
                      type="checkbox"
                      id="SpeechSoft"
                      checked={speech?.includes("Soft")}
                      onChange={() => handleCheckboxChangeSpeech("Soft")}
                    />
                    <Form.Check
                      inline
                      label="Slurred"
                      type="checkbox"
                      id="SpeechSlurred"
                      checked={speech?.includes("Slurred")}
                      onChange={() => handleCheckboxChangeSpeech("Slurred")}
                    />
                    <Form.Check
                      inline
                      label="Pressured"
                      type="checkbox"
                      id="SpeechPressured"
                      checked={speech?.includes("Pressured")}
                      onChange={() => handleCheckboxChangeSpeech("Pressured")}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Affect(Facial expressions):
                  </Form.Label>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Appropriate"
                      type="checkbox"
                      id="AffectAppropriate"
                      checked={affect?.includes("Appropriate")}
                      onChange={() => handleCheckboxChangeAffect("Appropriate")}
                    />
                    <Form.Check
                      inline
                      label="Labile"
                      type="checkbox"
                      id="AffectLabile"
                      checked={affect?.includes("Labile")}
                      onChange={() => handleCheckboxChangeAffect("Labile")}
                    />
                    <Form.Check
                      inline
                      label="Restricted (reduction in intensity)"
                      type="checkbox"
                      id="AffectRestricted"
                      checked={affect?.includes(
                        "Restricted (reduction in intensity)",
                      )}
                      onChange={() =>
                        handleCheckboxChangeAffect(
                          "Restricted (reduction in intensity)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Blunted (dulled in tone)"
                      type="checkbox"
                      id="AffectBlunted"
                      checked={affect?.includes("Blunted (dulled in tone)")}
                      onChange={() =>
                        handleCheckboxChangeAffect("Blunted (dulled in tone)")
                      }
                    />
                    <Form.Check
                      inline
                      label="Flat (void)"
                      type="checkbox"
                      id="AffectFlat"
                      checked={affect?.includes("Flat (void)")}
                      onChange={() => handleCheckboxChangeAffect("Flat (void)")}
                    />
                    <Form.Check
                      inline
                      label="Other"
                      type="checkbox"
                      id="AffectOther"
                      checked={affect?.includes("Other")}
                      onChange={() => handleCheckboxChangeAffect("Other")}
                    />
                    {affect?.includes("Other") && (
                      <BorderlessInput
                        value={affectOther}
                        setState={setAffectOther}
                        placeholder=" "
                      />
                    )}
                  </div>
                </Form.Group>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Mood:</Form.Label>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Stable"
                      type="checkbox"
                      id="MoodStable"
                      checked={mood?.includes("Stable")}
                      onChange={() => handleCheckboxChangeMood("Stable")}
                    />
                    <Form.Check
                      inline
                      label="Unstable"
                      type="checkbox"
                      id="MoodUnstable"
                      checked={mood?.includes("Unstable")}
                      onChange={() => handleCheckboxChangeMood("Unstable")}
                    />
                    <Form.Check
                      inline
                      label="Euthymic (normal)"
                      type="checkbox"
                      id="MoodEuthymic"
                      checked={mood?.includes("Euthymic (normal)")}
                      onChange={() =>
                        handleCheckboxChangeMood("Euthymic (normal)")
                      }
                    />
                    <Form.Check
                      inline
                      label="Pessimistic (sees the worst in things)"
                      type="checkbox"
                      id="MoodPessimistic"
                      checked={mood?.includes(
                        "Pessimistic (sees the worst in things)",
                      )}
                      onChange={() =>
                        handleCheckboxChangeMood(
                          "Pessimistic (sees the worst in things)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Depressed(down/sad)"
                      type="checkbox"
                      id="MoodDepressed"
                      checked={mood?.includes("Depressed(down/sad)")}
                      onChange={() =>
                        handleCheckboxChangeMood("Depressed(down/sad)")
                      }
                    />
                    <Form.Check
                      inline
                      label="Hypomanic (revved up Anxious)"
                      type="checkbox"
                      id="MoodHypomanic"
                      checked={mood?.includes("Hypomanic (revved up Anxious)")}
                      onChange={() =>
                        handleCheckboxChangeMood(
                          "Hypomanic (revved up Anxious)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Euphoric (intensity elevated)"
                      type="checkbox"
                      id="MoodEuphoric"
                      checked={mood?.includes("Euphoric (intensity elevated)")}
                      onChange={() =>
                        handleCheckboxChangeMood(
                          "Euphoric (intensity elevated)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Other"
                      type="checkbox"
                      id="MoodOther"
                      checked={mood?.includes("Other")}
                      onChange={() => handleCheckboxChangeMood("Other")}
                    />
                    {mood?.includes("Other") && (
                      <BorderlessInput
                        value={moodOther}
                        setState={setMoodOther}
                        placeholder=" "
                      />
                    )}
                  </div>
                </Form.Group>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Process (How they are sharing):
                  </Form.Label>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Logical & Organized"
                      type="checkbox"
                      id="ProcessLogical"
                      checked={process?.includes("Logical & Organized")}
                      onChange={() =>
                        handleCheckboxChangeProcess("Logical & Organized")
                      }
                    />
                    <Form.Check
                      inline
                      label="Circumstantial (provide unnecessary detail but eventually get to the point)"
                      type="checkbox"
                      id="ProcessCircumstantial"
                      checked={process?.includes(
                        "Circumstantial (provide unnecessary detail but eventually get to the point)",
                      )}
                      onChange={() =>
                        handleCheckboxChangeProcess(
                          "Circumstantial (provide unnecessary detail but eventually get to the point)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Tangential (moving from thought to thought)"
                      type="checkbox"
                      id="ProcessTangential"
                      checked={process?.includes(
                        "Tangential (moving from thought to thought)",
                      )}
                      onChange={() =>
                        handleCheckboxChangeProcess(
                          "Tangential (moving from thought to thought)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Scattered (thoughts come and go rapidly)"
                      type="checkbox"
                      id="ProcessScattered"
                      checked={process?.includes(
                        "Scattered (thoughts come and go rapidly)",
                      )}
                      onChange={() =>
                        handleCheckboxChangeProcess(
                          "Scattered (thoughts come and go rapidly)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Obsessed (overthinking, hyper focused)"
                      type="checkbox"
                      id="ProcessObsessed"
                      checked={process?.includes(
                        "Obsessed (overthinking, hyper focused)",
                      )}
                      onChange={() =>
                        handleCheckboxChangeProcess(
                          "Obsessed (overthinking, hyper focused)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Blocking (speech stopped mid thought or sentence)"
                      type="checkbox"
                      id="ProcessBlocking"
                      checked={process?.includes(
                        "Blocking (speech stopped mid thought or sentence)",
                      )}
                      onChange={() =>
                        handleCheckboxChangeProcess(
                          "Blocking (speech stopped mid thought or sentence)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Other"
                      type="checkbox"
                      id="ProcessOther"
                      checked={process?.includes("Other")}
                      onChange={() => handleCheckboxChangeProcess("Other")}
                    />
                    {process?.includes("Other") && (
                      <BorderlessInput
                        value={processOther}
                        setState={setProcessOther}
                        placeholder=" "
                      />
                    )}
                  </div>
                </Form.Group>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Content (What they are sharing):
                  </Form.Label>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Appropriate"
                      type="checkbox"
                      id="ContentAppropriate"
                      checked={content?.includes("Appropriate")}
                      onChange={() =>
                        handleCheckboxChangeContent("Appropriate")
                      }
                    />
                    <Form.Check
                      inline
                      label="Preoccupied (lost in their own world)"
                      type="checkbox"
                      id="ContentPreoccupied"
                      checked={content?.includes(
                        "Preoccupied (lost in their own world)",
                      )}
                      onChange={() =>
                        handleCheckboxChangeContent(
                          "Preoccupied (lost in their own world)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Obsessive (hyper focused)"
                      type="checkbox"
                      id="ContentObsessive"
                      checked={content?.includes("Obsessive (hyper focused)")}
                      onChange={() =>
                        handleCheckboxChangeContent("Obsessive (hyper focused)")
                      }
                    />
                    <Form.Check
                      inline
                      label="Phobias (unreasonable fear)"
                      type="checkbox"
                      id="ContentPhobias"
                      checked={content?.includes("Phobias (unreasonable fear)")}
                      onChange={() =>
                        handleCheckboxChangeContent(
                          "Phobias (unreasonable fear)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Delusions (unshakable belief in something that's untrue)"
                      type="checkbox"
                      id="ContentDelusions"
                      checked={content?.includes(
                        "Delusions (unshakable belief in something that's untrue)",
                      )}
                      onChange={() =>
                        handleCheckboxChangeContent(
                          "Delusions (unshakable belief in something that's untrue)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Other"
                      type="checkbox"
                      id="ContentOther"
                      checked={content?.includes("Other")}
                      onChange={() => handleCheckboxChangeContent("Other")}
                    />
                    {content?.includes("Other") && (
                      <BorderlessInput
                        value={contentOther}
                        setState={setContentOther}
                        placeholder=" "
                      />
                    )}
                  </div>
                </Form.Group>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Perceptions:</Form.Label>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Intact"
                      type="checkbox"
                      id="PerceptionsIntact"
                      checked={perceptions?.includes("Intact")}
                      onChange={() => handleCheckboxChangePerceptions("Intact")}
                    />
                    <Form.Check
                      inline
                      label="Auditory Hallucinations (hearing things not heard by others)"
                      type="checkbox"
                      id="PerceptionsAuditory"
                      checked={perceptions?.includes(
                        "Auditory Hallucinations (hearing things not heard by others)",
                      )}
                      onChange={() =>
                        handleCheckboxChangePerceptions(
                          "Auditory Hallucinations (hearing things not heard by others)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Visual Hallucinations (seeing things not seen by others)"
                      type="checkbox"
                      id="PerceptionsVisual"
                      checked={perceptions?.includes(
                        "Visual Hallucinations (seeing things not seen by others)",
                      )}
                      onChange={() =>
                        handleCheckboxChangePerceptions(
                          "Visual Hallucinations (seeing things not seen by others)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Depersonalization (believes the outer environment feels unreal)"
                      type="checkbox"
                      id="PerceptionsDepersonalization"
                      checked={perceptions?.includes(
                        "Depersonalization (believes the outer environment feels unreal)",
                      )}
                      onChange={() =>
                        handleCheckboxChangePerceptions(
                          "Depersonalization (believes the outer environment feels unreal)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Derealization (sensation of altered reality concerning self or parts of oneself)"
                      type="checkbox"
                      id="PerceptionsDerealization"
                      checked={perceptions?.includes(
                        "Derealization (sensation of altered reality concerning self or parts of oneself)",
                      )}
                      onChange={() =>
                        handleCheckboxChangePerceptions(
                          "Derealization (sensation of altered reality concerning self or parts of oneself)",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="Unable to assess"
                      type="checkbox"
                      id="PerceptionsUnableToAssess"
                      checked={perceptions?.includes("Unable to assess")}
                      onChange={() =>
                        handleCheckboxChangePerceptions("Unable to assess")
                      }
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Judgment(ability to make considered decisions):
                  </Form.Label>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Good"
                      type="checkbox"
                      id="JudgmentGood"
                      checked={judgment?.includes("Good")}
                      onChange={() => handleCheckboxChangeJudgment("Good")}
                    />
                    <Form.Check
                      inline
                      label="Fair"
                      type="checkbox"
                      id="JudgmentFair"
                      checked={judgment?.includes("Fair")}
                      onChange={() => handleCheckboxChangeJudgment("Fair")}
                    />
                    <Form.Check
                      inline
                      label="Poor - yet intact"
                      type="checkbox"
                      id="JudgmentPoorIntact"
                      checked={judgment?.includes("Poor - yet intact")}
                      onChange={() =>
                        handleCheckboxChangeJudgment("Poor - yet intact")
                      }
                    />
                    <Form.Check
                      inline
                      label="Not intact"
                      type="checkbox"
                      id="JudgmentNotIntact"
                      checked={judgment?.includes("Not intact")}
                      onChange={() =>
                        handleCheckboxChangeJudgment("Not intact")
                      }
                    />
                    <Form.Check
                      inline
                      label="Unable to assess"
                      type="checkbox"
                      id="JudgmentUnableToAssess"
                      checked={judgment?.includes("Unable to assess")}
                      onChange={() =>
                        handleCheckboxChangeJudgment("Unable to assess")
                      }
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Insight (insight is accurate and deep intuitive
                    understanding):
                  </Form.Label>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Appropriate"
                      type="checkbox"
                      id="InsightAppropriate"
                      checked={insight?.includes("Appropriate")}
                      onChange={() =>
                        handleCheckboxChangeInsight("Appropriate")
                      }
                    />
                    <Form.Check
                      inline
                      label="Fair"
                      type="checkbox"
                      id="InsightFair"
                      checked={insight?.includes("Fair")}
                      onChange={() => handleCheckboxChangeInsight("Fair")}
                    />
                    <Form.Check
                      inline
                      label="Poor"
                      type="checkbox"
                      id="InsightPoor"
                      checked={insight?.includes("Poor")}
                      onChange={() => handleCheckboxChangeInsight("Poor")}
                    />
                    <Form.Check
                      inline
                      label="Denial"
                      type="checkbox"
                      id="InsightDenial"
                      checked={insight?.includes("Denial")}
                      onChange={() => handleCheckboxChangeInsight("Denial")}
                    />
                    <Form.Check
                      inline
                      label="None"
                      type="checkbox"
                      id="InsightNone"
                      checked={insight?.includes("None")}
                      onChange={() => handleCheckboxChangeInsight("None")}
                    />
                    <Form.Check
                      inline
                      label="Unable to assess"
                      type="checkbox"
                      id="InsightUnableToAssess"
                      checked={insight?.includes("Unable to assess")}
                      onChange={() =>
                        handleCheckboxChangeInsight("Unable to assess")
                      }
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Suicidal Ideation:
                  </Form.Label>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Yes"
                      type="checkbox"
                      id="SuicidalIdeationYes"
                      checked={suicidalIdeation === "Yes"}
                      onChange={() =>
                        setSuicidalIdeation(
                          suicidalIdeation === "Yes" ? "" : "Yes",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      label="No"
                      type="checkbox"
                      id="SuicidalIdeationNo"
                      checked={suicidalIdeation === "No"}
                      onChange={() => {
                        setSuicidalIdeation(
                          suicidalIdeation === "No" ? "" : "No",
                        );
                        if (suicidalIdeation !== "No") {
                          setSuicidalIdeationOther("");
                        }
                      }}
                    />
                  </div>
                  {suicidalIdeation === "Yes" && (
                    <BorderlessInput
                      value={suicidalIdeationOther}
                      setState={setSuicidalIdeationOther}
                      placeholder="Please specify"
                    />
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    BHP Name and credential:
                  </Form.Label>
                  <Form.Control
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    as="textarea"
                    onChange={(e) => {
                      setBhpNameAndCredentials(e.target.value);
                    }}
                    value={bhpNameAndCredentials}
                    disabled={url === "/create-discharge-summary-resident"}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>

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
              signerNameOverride={clientName || ""}
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
  Wcomponenet: UpdateBhpProgress,
});
