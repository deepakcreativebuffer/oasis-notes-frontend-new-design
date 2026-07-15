/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { BorderlessInput, CheckBoxMaker } from "@/utils/Makers";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import { medicationService } from "@/features/shared/services";
import { mentalStatusObj } from "@/features/shared/constants";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddSignature,
  fetchPaitentName,
  formatDateWithoutUTCHandleToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
const UpdateMentalStatus = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [todayDate, setTodayDate] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState("");
  const [beforeAppearance, setBeforeAppearance] = useState([]);
  const [
    beforeBehaviorPsychomotorActivity,
    setBeforeBehaviorPsychomotorActivity,
  ] = useState([]);
  const [beforeOrientation, setBeforeOrientation] = useState([]);
  const [beforeAffect, setBeforeAffect] = useState([]);
  const [beforeSpeechAndThought, setBeforeSpeechAndThought] = useState([]);
  const [beforeThoughtContent, setBeforeThoughtContent] = useState([]);
  const [
    beforeOrientationAndConsciousness,
    setBeforeOrientationAndConsciousness,
  ] = useState([]);
  const [beforeMemoryAndIntelligence, setBeforeMemoryAndIntelligence] =
    useState([]);
  const [
    beforeReliabilityJudgmentAndInsight,
    setBeforeReliabilityJudgmentAndInsight,
  ] = useState([]);
  const [open, setOpen] = useState(false);
  const [signedDate, setSignedDate] = useState("");
  const [signedTime, setSignedTime] = useState("");
  const [driverSignature, setDriverSignature] = useState("");
  const [beforeMood, setBeforeMood] = useState([]);
  const [afterAppearance, setAfterAppearance] = useState([]);
  const [
    afterBehaviorPsychomotorActivity,
    setAfterBehaviorPsychomotorActivity,
  ] = useState([]);
  const [afterOrientation, setAfterOrientation] = useState([]);
  const [afterAffect, setAfterAffect] = useState([]);
  const [afterSpeechAndThought, setAfterSpeechAndThought] = useState([]);
  const [afterthoughtContent, setAfterthoughtContent] = useState([]);
  const [
    afterOrientationAndConsciousness,
    setAfterOrientationAndConsciousness,
  ] = useState([]);
  const [afterMemoryAndIntelligence, setAfterMemoryAndIntelligence] = useState(
    [],
  );
  const [
    afterReliabilityJudgmentAndInsight,
    setAfterReliabilityJudgmentAndInsight,
  ] = useState([]);
  const [afterMood, setAfterMood] = useState([]);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [employeeId, setEmployeeId] = useState("");
  const [beforeAppearanceOther, setBeforeAppearanceOther] = useState("");
  const [
    beforeBehaviorPsychomotorActivityOther,
    setBeforeBehaviorPsychomotorActivityOther,
  ] = useState("");
  const [beforeOrientationOther, setBeforeOrientationOther] = useState("");
  const [beforeAffectOther, setBeforeAffectOther] = useState("");
  const [beforeSpeechAndThoughtOther, setBeforeSpeechAndThoughtOther] =
    useState("");
  const [beforeThoughtContentOther, setBeforeThoughtContentOther] =
    useState("");
  const [
    beforeOrientationAndConsciousnessOther,
    setBeforeOrientationAndConsciousnessOther,
  ] = useState("");
  const [
    beforeMemoryAndIntelligenceOther,
    setBeforeMemoryAndIntelligenceOther,
  ] = useState("");
  const [
    beforeReliabilityJudgmentAndInsightOther,
    setBeforeReliabilityJudgmentAndInsightOther,
  ] = useState("");
  const [beforeMoodOther, setBeforeMoodOther] = useState("");
  const [afterAppearanceOther, setAfterAppearanceOther] = useState("");
  const [
    afterBehaviorPsychomotorActivityOther,
    setAfterBehaviorPsychomotorActivityOther,
  ] = useState("");
  const [afterOrientationOther, setAfterOrientationOther] = useState("");
  const [afterAffectOther, setAfterAffectOther] = useState("");
  const [afterSpeechAndThoughtOther, setAfterSpeechAndThoughtOther] =
    useState("");
  const [afterthoughtContentOther, setAfterthoughtContentOther] = useState("");
  const [
    afterOrientationAndConsciousnessOther,
    setAfterOrientationAndConsciousnessOther,
  ] = useState("");
  const [afterMemoryAndIntelligenceOther, setAfterMemoryAndIntelligenceOther] =
    useState("");
  const [
    afterReliabilityJudgmentAndInsightOther,
    setAfterReliabilityJudgmentAndInsightOther,
  ] = useState("");
  const [afterMoodOther, setAfterMoodOther] = useState("");
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
  useEffect(() => {
    medicationService.mentalStatus.getById(id, { setResponse: setDetails });
  }, [id]);
  const payload = {
    todayDate,
    patientId,
    employeeId,
    beforeAppearance,
    beforeBehaviorPsychomotorActivity,
    beforeOrientation,
    beforeAffect,
    beforeSpeechAndThought,
    beforeThoughtContent,
    beforeOrientationAndConsciousness,
    beforeMemoryAndIntelligence,
    beforeReliabilityJudgmentAndInsight,
    beforeMood,
    afterAppearance,
    afterBehaviorPsychomotorActivity,
    afterOrientation,
    afterAffect,
    afterSpeechAndThought,
    afterthoughtContent,
    afterOrientationAndConsciousness,
    afterMemoryAndIntelligence,
    afterReliabilityJudgmentAndInsight,
    afterMood,
    beforeAppearanceOther,
    beforeBehaviorPsychomotorActivityOther,
    beforeOrientationOther,
    beforeAffectOther,
    beforeSpeechAndThoughtOther,
    beforeThoughtContentOther,
    beforeOrientationAndConsciousnessOther,
    beforeMemoryAndIntelligenceOther,
    beforeReliabilityJudgmentAndInsightOther,
    beforeMoodOther,
    afterAppearanceOther,
    afterBehaviorPsychomotorActivityOther,
    afterOrientationOther,
    afterAffectOther,
    afterSpeechAndThoughtOther,
    afterthoughtContentOther,
    afterOrientationAndConsciousnessOther,
    afterMemoryAndIntelligenceOther,
    afterReliabilityJudgmentAndInsightOther,
    afterMoodOther,
    driverSignature,
    signedDate,
    signedTime,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    signers,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    medicationService.mentalStatus.update(id, payload, {
      successMsg: "Mental status report updated !",
      setLoading,
      navigate,
    });
  };
  const pushInArr = ({ array, value, setArr }) => {
    if (array?.includes(value)) {
      const filtered = array?.filter((item) => item !== value);
      setArr(filtered);
    } else {
      setArr([...array, value]);
    }
  };
  useEffect(() => {
    if (details) {
      const item = details?.data;
      setTodayDate(item?.createdAt);
      setEmployeeId(item?.employeeId?._id);
      setPatientId(item?.patientId?._id);
      setBeforeAppearance(item?.beforeAppearance);
      setBeforeBehaviorPsychomotorActivity(
        item?.beforeBehaviorPsychomotorActivity,
      );
      setBeforeOrientation(item?.beforeOrientation);
      setBeforeAffect(item?.beforeAffect);
      setBeforeSpeechAndThought(item?.beforeSpeechAndThought);
      setBeforeThoughtContent(item?.beforeThoughtContent);
      setBeforeOrientationAndConsciousness(
        item?.beforeOrientationAndConsciousness,
      );
      setBeforeMemoryAndIntelligence(item?.beforeMemoryAndIntelligence);
      setBeforeReliabilityJudgmentAndInsight(
        item?.beforeReliabilityJudgmentAndInsight,
      );
      setBeforeMood(item?.beforeMood);
      setAfterAppearance(item?.afterAppearance);
      setAfterBehaviorPsychomotorActivity(
        item?.afterBehaviorPsychomotorActivity,
      );
      setAfterOrientation(item?.afterOrientation);
      setAfterAffect(item?.afterAffect);
      setAfterSpeechAndThought(item?.afterSpeechAndThought);
      setAfterthoughtContent(item?.afterthoughtContent);
      setAfterOrientationAndConsciousness(
        item?.afterOrientationAndConsciousness,
      );
      setAfterMemoryAndIntelligence(item?.afterMemoryAndIntelligence);
      setAfterReliabilityJudgmentAndInsight(
        item?.afterReliabilityJudgmentAndInsight,
      );
      setAfterMood(item?.afterMood);
      setBeforeAppearanceOther(item?.beforeAppearanceOther);
      setBeforeBehaviorPsychomotorActivityOther(
        item?.beforeBehaviorPsychomotorActivityOther,
      );
      setBeforeOrientationOther(item?.beforeOrientationOther);
      setBeforeAffectOther(item?.beforeAffectOther);
      setBeforeSpeechAndThoughtOther(item?.beforeSpeechAndThoughtOther);
      setBeforeThoughtContentOther(item?.beforeThoughtContentOther);
      setBeforeOrientationAndConsciousnessOther(
        item?.beforeOrientationAndConsciousnessOther,
      );
      setBeforeMemoryAndIntelligenceOther(
        item?.beforeMemoryAndIntelligenceOther,
      );
      setBeforeReliabilityJudgmentAndInsightOther(
        item?.beforeReliabilityJudgmentAndInsightOther,
      );
      setBeforeMoodOther(item?.beforeMoodOther);
      setAfterAppearanceOther(item?.afterAppearanceOther);
      setAfterBehaviorPsychomotorActivityOther(
        item?.afterBehaviorPsychomotorActivityOther,
      );
      setAfterOrientationOther(item?.afterOrientationOther);
      setAfterAffectOther(item?.afterAffectOther);
      setAfterSpeechAndThoughtOther(item?.afterSpeechAndThoughtOther);
      setAfterthoughtContentOther(item?.afterthoughtContentOther);
      setAfterOrientationAndConsciousnessOther(
        item?.afterOrientationAndConsciousnessOther,
      );
      setAfterMemoryAndIntelligenceOther(item?.afterMemoryAndIntelligenceOther);
      setAfterReliabilityJudgmentAndInsightOther(
        item?.afterReliabilityJudgmentAndInsightOther,
      );
      setAfterMoodOther(item?.afterMoodOther);
      setSignedDate(item?.signedDate);
      setSignedTime(item?.signedTime);
      setDriverSignature(item?.driverSignature);
      setSigners(item?.signers);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setAdminSignedTime(item?.adminSignedTime);
    }
  }, [details]);
  useEffect(() => {
    if (!details?.data) return;
    if (details?.data) {
      const { saveAsDraft, signers } = details.data;
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
          ).includes("ms") &&
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
          ).includes("ms") &&
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
          ).includes("ms") &&
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
      driverSignature?.length > 0;
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
    details?.data?.employeeId,
    driverSignature?.length,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [driverSignature, adminSignature, id, checkSign]);
  let signerIndex = signers?.findIndex?.(
    (signer, i) => signer.signerId === profileInfo._id,
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
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
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
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
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
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerTime(time);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setSignedTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };
  return (
    <>
      <AddSignature
        show={open}
        setValue={(sign) =>
          details?.data?.employeeId === profileInfo?._id ||
          details?.data?.employeeId?._id === profileInfo?._id
            ? setDriverSignature(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          details?.data?.employeeId === profileInfo?._id ||
          details?.data?.employeeId?._id === profileInfo?._id
            ? setSignedDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          details?.data?.employeeId === profileInfo?._id ||
          details?.data?.employeeId?._id === profileInfo?._id
            ? setSignedTime(time)
            : editTimeHandler(time)
        }
      />
      <NavWrapper title={"Mental Status"} isArrow={true} />

      <Container>
        <Form
          onSubmit={submitHandler}
          className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
          <Row className="mb-2">
            <Col xs={12} md={12}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1"> Patient : </p>
                <h5 className="view-value mb-0">
                  {details?.data?.patientId &&
                    fetchPaitentName(details?.data?.patientId)}{" "}
                </h5>
              </div>
            </Col>
          </Row>
          <Row className="mb-3 text-center">
            <Col xs={12} md={12}>
              <Form.Label className="fw-bold">Before Appointment</Form.Label>
            </Col>
          </Row>
          <Card body className="mb-3 d-flex flex-column">
            <Form.Group className="d-flex flex-column">
              <Form.Label className="fw-bold">Today's Date:</Form.Label>
              <DatePicker
                selected={formatDateWithoutUTCHandleToMMDDYYYY(todayDate)}
                onChange={(selectedDate) =>
                  setTodayDate(selectedDate?.toDateString())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className="form-control"
                highlightDates={[
                  {
                    "react-datepicker__day--highlighted-custom": [
                      todayDate
                        ? formatDateWithoutUTCHandleToMMDDYYYY(todayDate)
                        : new Date(),
                    ],
                  },
                ]}
              />
            </Form.Group>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Appearance:</Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.apperanceOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: beforeAppearance,
                      value: i,
                      setArr: setBeforeAppearance,
                    })
                  }
                  value={i}
                  id={`Appearance${index}`}
                  label={i}
                  key={index}
                  checked={beforeAppearance?.includes(i)}
                />
              ))}
              {beforeAppearance?.includes("Other") && (
                <BorderlessInput
                  setState={setBeforeAppearanceOther}
                  value={beforeAppearanceOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">
              Behavior/psychomotor activity:
            </Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.behaviourAppointmentOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: beforeBehaviorPsychomotorActivity,
                      value: i,
                      setArr: setBeforeBehaviorPsychomotorActivity,
                    })
                  }
                  value={i}
                  id={`Behavior${index}`}
                  key={index}
                  label={i}
                  checked={beforeBehaviorPsychomotorActivity?.includes(i)}
                />
              ))}
              {beforeBehaviorPsychomotorActivity?.includes("Other") && (
                <BorderlessInput
                  setState={setBeforeBehaviorPsychomotorActivityOther}
                  value={beforeBehaviorPsychomotorActivityOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>

          <Card body className="mb-3">
            <Form.Label className="fw-bold">Orientation:</Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.OrientationOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: beforeOrientation,
                      value: i,
                      setArr: setBeforeOrientation,
                    })
                  }
                  value={i}
                  id={`beforeOrientation${index}`}
                  key={index}
                  label={i}
                  checked={beforeOrientation?.includes(i)}
                />
              ))}
              {beforeOrientation?.includes("Other") && (
                <BorderlessInput
                  setState={setBeforeOrientationOther}
                  value={beforeOrientationOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Affect:</Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.affectOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: beforeAffect,
                      value: i,
                      setArr: setBeforeAffect,
                    })
                  }
                  value={i}
                  id={`affectOptions${index}`}
                  key={index}
                  label={i}
                  checked={beforeAffect?.includes(i)}
                />
              ))}

              {beforeAffect?.includes("Other") && (
                <BorderlessInput
                  setState={setBeforeAffectOther}
                  value={beforeAffectOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Speech and thought:</Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.speechOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: beforeSpeechAndThought,
                      value: i,
                      setArr: setBeforeSpeechAndThought,
                    })
                  }
                  value={i}
                  id={`beforeSpeechAndThought${index}`}
                  key={index}
                  label={i}
                  checked={beforeSpeechAndThought?.includes(i)}
                />
              ))}
              {beforeSpeechAndThought?.includes("Other") && (
                <BorderlessInput
                  setState={setBeforeSpeechAndThoughtOther}
                  value={beforeSpeechAndThoughtOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Thought Content:</Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.thoughtOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: beforeThoughtContent,
                      value: i,
                      setArr: setBeforeThoughtContent,
                    })
                  }
                  value={i}
                  id={`beforeThoughtContent${index}`}
                  key={index}
                  label={i}
                  checked={beforeThoughtContent?.includes(i)}
                />
              ))}
              {beforeThoughtContent?.includes("Other") && (
                <BorderlessInput
                  setState={setBeforeThoughtContentOther}
                  value={beforeThoughtContentOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">
              Orientation and consciousness:
            </Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.orientationOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: beforeOrientationAndConsciousness,
                      value: i,
                      setArr: setBeforeOrientationAndConsciousness,
                    })
                  }
                  value={i}
                  id={`orientationOptions${index}`}
                  key={index}
                  label={i}
                  checked={beforeOrientationAndConsciousness?.includes(i)}
                />
              ))}
              {beforeOrientationAndConsciousness?.includes("Other") && (
                <BorderlessInput
                  setState={setBeforeOrientationAndConsciousnessOther}
                  value={beforeOrientationAndConsciousnessOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">
              Memory and intelligence:
            </Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.memoryOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: beforeMemoryAndIntelligence,
                      value: i,
                      setArr: setBeforeMemoryAndIntelligence,
                    })
                  }
                  value={i}
                  id={`memoryOptions${index}`}
                  key={index}
                  label={i}
                  checked={beforeMemoryAndIntelligence?.includes(i)}
                />
              ))}
              {beforeMemoryAndIntelligence?.includes("Other") && (
                <BorderlessInput
                  setState={setBeforeMemoryAndIntelligenceOther}
                  value={beforeMemoryAndIntelligenceOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">
              Reliability, judgment, and insight:
            </Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.reliabilityOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: beforeReliabilityJudgmentAndInsight,
                      value: i,
                      setArr: setBeforeReliabilityJudgmentAndInsight,
                    })
                  }
                  value={i}
                  id={`reliabilityOptions${index}`}
                  key={index}
                  label={i}
                  checked={beforeReliabilityJudgmentAndInsight?.includes(i)}
                />
              ))}
              {beforeReliabilityJudgmentAndInsight?.includes("Other") && (
                <BorderlessInput
                  setState={setBeforeReliabilityJudgmentAndInsightOther}
                  value={beforeReliabilityJudgmentAndInsightOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Mood:</Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.moodOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: beforeMood,
                      value: i,
                      setArr: setBeforeMood,
                    })
                  }
                  value={i}
                  id={`moodOptions${index}`}
                  key={index}
                  label={i}
                  checked={beforeMood?.includes(i)}
                />
              ))}

              {beforeMood?.includes("Other") && (
                <BorderlessInput
                  setState={setBeforeMoodOther}
                  value={beforeMoodOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Row className="mb-3 text-center">
            <Col xs={12}>
              <Form.Label className="fw-bold">After Appointment</Form.Label>
            </Col>
          </Row>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Appearance:</Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.apperanceOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: afterAppearance,
                      value: i,
                      setArr: setAfterAppearance,
                    })
                  }
                  value={i}
                  id={`afterAppearance${index}`}
                  label={i}
                  key={index}
                  checked={afterAppearance?.includes(i)}
                />
              ))}
              {afterAppearance?.includes("Other") && (
                <BorderlessInput
                  setState={setAfterAppearanceOther}
                  value={afterAppearanceOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">
              Behavior/psychomotor activity:
            </Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.behaviourAppointmentOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: afterBehaviorPsychomotorActivity,
                      value: i,
                      setArr: setAfterBehaviorPsychomotorActivity,
                    })
                  }
                  value={i}
                  id={`afterBehaviorPsychomotorActivity${index}`}
                  key={index}
                  label={i}
                  checked={afterBehaviorPsychomotorActivity?.includes(i)}
                />
              ))}
              {afterBehaviorPsychomotorActivity?.includes("Other") && (
                <BorderlessInput
                  setState={setAfterBehaviorPsychomotorActivityOther}
                  value={afterBehaviorPsychomotorActivityOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Orientation:</Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.OrientationOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: afterOrientation,
                      value: i,
                      setArr: setAfterOrientation,
                    })
                  }
                  value={i}
                  id={`afterOrientation${index}`}
                  key={index}
                  label={i}
                  checked={afterOrientation?.includes(i)}
                />
              ))}
              {afterOrientation?.includes("Other") && (
                <BorderlessInput
                  setState={setAfterOrientationOther}
                  value={afterOrientationOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Affect:</Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.affectOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: afterAffect,
                      value: i,
                      setArr: setAfterAffect,
                    })
                  }
                  value={i}
                  id={`afterAffect${index}`}
                  key={index}
                  label={i}
                  checked={afterAffect?.includes(i)}
                />
              ))}
              {afterAffect?.includes("Other") && (
                <BorderlessInput
                  setState={setAfterAffectOther}
                  value={afterAffectOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Speech and thought:</Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.speechOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: afterSpeechAndThought,
                      value: i,
                      setArr: setAfterSpeechAndThought,
                    })
                  }
                  value={i}
                  id={`afterSpeechAndThought${index}`}
                  key={index}
                  label={i}
                  checked={afterSpeechAndThought?.includes(i)}
                />
              ))}
              {afterSpeechAndThought?.includes("Other") && (
                <BorderlessInput
                  setState={setAfterSpeechAndThoughtOther}
                  value={afterSpeechAndThoughtOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Thought Content:</Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.thoughtOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: afterthoughtContent,
                      value: i,
                      setArr: setAfterthoughtContent,
                    })
                  }
                  value={i}
                  id={`afterthoughtContent${index}`}
                  key={index}
                  label={i}
                  checked={afterthoughtContent?.includes(i)}
                />
              ))}
              {afterthoughtContent?.includes("Other") && (
                <BorderlessInput
                  setState={setAfterthoughtContentOther}
                  value={afterthoughtContentOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">
              Orientation and consciousness:
            </Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.orientationOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: afterOrientationAndConsciousness,
                      value: i,
                      setArr: setAfterOrientationAndConsciousness,
                    })
                  }
                  value={i}
                  id={`afterOrientationAndConsciousness${index}`}
                  key={index}
                  label={i}
                  checked={afterOrientationAndConsciousness?.includes(i)}
                />
              ))}
              {afterOrientationAndConsciousness?.includes("Other") && (
                <BorderlessInput
                  setState={setAfterOrientationAndConsciousnessOther}
                  value={afterOrientationAndConsciousnessOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">
              Memory and intelligence:
            </Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.memoryOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: afterMemoryAndIntelligence,
                      value: i,
                      setArr: setAfterMemoryAndIntelligence,
                    })
                  }
                  value={i}
                  id={`afterMemoryAndIntelligence${index}`}
                  key={index}
                  label={i}
                  checked={afterMemoryAndIntelligence?.includes(i)}
                />
              ))}
              {afterMemoryAndIntelligence?.includes("Other") && (
                <BorderlessInput
                  setState={setAfterMemoryAndIntelligenceOther}
                  value={afterMemoryAndIntelligenceOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">
              Reliability, judgment, and insight:
            </Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.reliabilityOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: afterReliabilityJudgmentAndInsight,
                      value: i,
                      setArr: setAfterReliabilityJudgmentAndInsight,
                    })
                  }
                  value={i}
                  id={`afterReliabilityJudgmentAndInsight${index}`}
                  key={index}
                  label={i}
                  checked={afterReliabilityJudgmentAndInsight?.includes(i)}
                />
              ))}
              {afterReliabilityJudgmentAndInsight?.includes("Other") && (
                <BorderlessInput
                  setState={setAfterReliabilityJudgmentAndInsightOther}
                  value={afterReliabilityJudgmentAndInsightOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Mood:</Form.Label>
            <div className="radio-inline">
              {mentalStatusObj?.moodOptions?.map((i, index) => (
                <CheckBoxMaker
                  setValue={() =>
                    pushInArr({
                      array: afterMood,
                      value: i,
                      setArr: setAfterMood,
                    })
                  }
                  value={i}
                  id={`afterMood${index}`}
                  key={index}
                  label={i}
                  checked={afterMood?.includes(i)}
                />
              ))}
              {afterMood?.includes("Other") && (
                <BorderlessInput
                  setState={setAfterMoodOther}
                  value={afterMoodOther}
                  className="w-auto"
                />
              )}
            </div>
          </Card>
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Label className="w-100 fw-bold">
                Employee Signature
              </Form.Label>
              <Button
                type="button"
                className={`theme-button ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                onClick={() => setOpen(true)}
              >
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} md={6}>
              {signatureFormat({
                sign: driverSignature,
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
              {signers?.map(
                (signer, i) =>
                  signer.signature && (
                    <div>
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
          <Row className="text-center">
            <Col xs={12}>
              <button
                className={`employee_create_btn mt-3 mt-md-5 ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                disabled={!isSubmitEnabled}
              >
                {" "}
                {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}{" "}
              </button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: UpdateMentalStatus,
});
