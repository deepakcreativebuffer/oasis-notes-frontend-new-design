/** @format */

import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { BorderlessInput, CheckBoxMaker } from "@/utils/Makers";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import { medicationService } from "@/features/shared/services";
import { mentalStatusObj } from "@/features/shared/constants";
import { ClipLoader } from "react-spinners";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ROLES } from "@/features/shared/constants";
const CreateMentalStatus = () => {
  const navigate = useNavigate();
  const [todayDate, setTodayDate] = useState(formatDateToMMDDYYYY(new Date()));
  const [data, setData] = useState("");
  const profileDetail = useSelector(userProfile);
  const hoursFormat = profileDetail?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
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
  const [beforeMood, setBeforeMood] = useState([]);
  const [afterAppearance, setAfterAppearance] = useState([]);
  const [open, setOpen] = useState(false);
  const [signedDate, setSignedDate] = useState("");
  const [signedTime, setSignedTime] = useState("");
  const [driverSignature, setDriverSignature] = useState("");
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
  const [openAdmin, setAdminOpen] = useState(false);
  const payload = {
    todayDate,
    patientId,
    employeeId: profileDetail?._id,
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
    medicationService.mentalStatus.create(payload, {
      successMsg: "Mental status report created !",
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
    if (patientId) {
      medicationService.mentalStatus.getByPatientId(patientId, {
        setResponse: setData,
        setLoading,
      });
    }
  }, [patientId]);
  useEffect(() => {
    let populateData;
    if (Array.isArray(data?.data)) {
      populateData = data?.data?.find((item) => {
        return (
          item?.patientId?._id === patientId || item?.patientId === patientId
        );
      });
    }
    if (populateData) {
      setAfterAffect(populateData?.afterAffect || []);
      setAfterAffectOther(populateData?.afterAffectOther || "");
      setAfterAppearance(populateData?.afterAppearance || []);
      setAfterAppearanceOther(populateData?.afterAppearanceOther || "");
      setAfterBehaviorPsychomotorActivity(
        populateData?.afterBehaviorPsychomotorActivity || [],
      );
      setAfterBehaviorPsychomotorActivityOther(
        populateData?.afterBehaviorPsychomotorActivityOther || "",
      );
      setAfterMemoryAndIntelligence(
        populateData?.afterMemoryAndIntelligence || [],
      );
      setAfterMemoryAndIntelligenceOther(
        populateData?.afterMemoryAndIntelligenceOther || "",
      );
      setAfterMood(populateData?.afterMood || []);
      setAfterMoodOther(populateData?.afterMoodOther || "");
      setAfterOrientation(populateData?.afterOrientation || "");
      setAfterOrientationAndConsciousness(
        populateData?.afterOrientationAndConsciousness || [],
      );
      setAfterOrientationAndConsciousnessOther(
        populateData?.afterOrientationAndConsciousnessOther || "",
      );
      setAfterOrientationOther(populateData?.afterOrientationOther || "");
      setAfterReliabilityJudgmentAndInsight(
        populateData?.afterReliabilityJudgmentAndInsight || [],
      );
      setAfterReliabilityJudgmentAndInsightOther(
        populateData?.afterReliabilityJudgmentAndInsightOther || "",
      );
      setAfterSpeechAndThought(populateData?.afterSpeechAndThought || []);
      setAfterSpeechAndThoughtOther(
        populateData?.afterSpeechAndThoughtOther || "",
      );
      setAfterthoughtContent(populateData?.afterthoughtContent || []);
      setAfterthoughtContentOther(
        populateData?.setAfterthoughtContentOther || "",
      );
      setBeforeAffectOther(populateData?.beforeAffectOther || "");
      setBeforeAppearance(populateData?.beforeAppearance || []);
      setBeforeAppearanceOther(populateData?.beforeAppearanceOther || "");
      setBeforeBehaviorPsychomotorActivity(
        populateData?.beforeBehaviorPsychomotorActivity || [],
      );
      setBeforeBehaviorPsychomotorActivityOther(
        populateData?.beforeBehaviorPsychomotorActivityOther || "",
      );
      setBeforeMemoryAndIntelligence(
        populateData?.beforeMemoryAndIntelligence || [],
      );
      setBeforeMemoryAndIntelligenceOther(
        populateData?.beforeMemoryAndIntelligenceOther || "",
      );
      setBeforeMood(populateData?.beforeMood || []);
      setBeforeMoodOther(populateData?.beforeMoodOther || "");
      setBeforeOrientation(populateData?.beforeOrientation || []);
      setBeforeOrientationAndConsciousness(
        populateData?.beforeOrientationAndConsciousness || [],
      );
      setBeforeOrientationAndConsciousnessOther(
        populateData?.beforeOrientationAndConsciousnessOther || "",
      );
      setBeforeOrientationOther(populateData?.beforeOrientationOther || "");
      setBeforeReliabilityJudgmentAndInsight(
        populateData?.beforeReliabilityJudgmentAndInsight || [],
      );
      setBeforeReliabilityJudgmentAndInsightOther(
        populateData?.beforeReliabilityJudgmentAndInsightOther || "",
      );
      setBeforeSpeechAndThought(populateData?.beforeSpeechAndThought || []);
      setBeforeSpeechAndThoughtOther(
        populateData?.beforeSpeechAndThoughtOther || "",
      );
    } else {
      setAfterAffect([]);
      setAfterAffectOther("");
      setAfterAppearance([]);
      setAfterAppearanceOther("");
      setAfterBehaviorPsychomotorActivity([]);
      setAfterBehaviorPsychomotorActivityOther("");
      setAfterMemoryAndIntelligence([]);
      setAfterMemoryAndIntelligenceOther("");
      setAfterMood([]);
      setAfterMoodOther("");
      setAfterOrientation([]);
      setAfterOrientationAndConsciousness([]);
      setAfterOrientationAndConsciousnessOther("");
      setAfterOrientationOther("");
      setAfterReliabilityJudgmentAndInsight([]);
      setAfterReliabilityJudgmentAndInsightOther("");
      setAfterSpeechAndThought([]);
      setAfterSpeechAndThoughtOther("");
      setAfterthoughtContent([]);
      setAfterthoughtContentOther("");
      setBeforeAffectOther("");
      setBeforeAppearance([]);
      setBeforeAppearanceOther("");
      setBeforeBehaviorPsychomotorActivity([]);
      setBeforeBehaviorPsychomotorActivityOther("");
      setBeforeMemoryAndIntelligence([]);
      setBeforeMemoryAndIntelligenceOther("");
      setBeforeMood([]);
      setBeforeMoodOther("");
      setBeforeOrientation([]);
      setBeforeOrientationAndConsciousness([]);
      setBeforeOrientationAndConsciousnessOther("");
      setBeforeOrientationOther("");
      setBeforeReliabilityJudgmentAndInsight([]);
      setBeforeReliabilityJudgmentAndInsightOther("");
      setBeforeSpeechAndThought([]);
      setBeforeSpeechAndThoughtOther("");
    }
  }, [data, patientId]);
  return (
    <>
      <AddSignature
        show={open}
        setValue={setDriverSignature}
        setDate={setSignedDate}
        setTime={setSignedTime}
      />
      <AddSignature
        show={openAdmin}
        setValue={setAdminSignature}
        setDate={setAdminDateSigned}
        setTime={setAdminSignedTime}
      />
      <NavWrapper title={"Mental Status"} isArrow={true} />
      <Container>
        <Form onSubmit={submitHandler}>
          <Row>
            <Col xs={12} md={12}>
              <Card body className="mb-3">
                <PatientComponent MainPatientId={setPatientId} />
              </Card>
            </Col>
          </Row>
          <Row className="mb-2 text-center">
            <Col xs={12} md={12}>
              <Form.Label className="fw-bold">Before Appointment</Form.Label>
            </Col>
          </Row>
          <Card body className="mb-3">
            <Form.Group className="d-flex flex-column">
              <Form.Label className="fw-bold">Today's Date:</Form.Label>
              <DatePicker
                selected={formatDateToMMDDYYYY(todayDate)}
                onChange={(selectedDate) =>
                  setTodayDate(selectedDate?.toDateString())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className="form-control"
                highlightDates={[
                  {
                    "react-datepicker__day--highlighted-custom": [
                      todayDate ? formatDateToMMDDYYYY(todayDate) : new Date(),
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
          <Row className="mb-2 text-center">
            <Col xs={12} md={12}>
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
                className="theme-button"
                onClick={() =>
                  profileDetail.userType === ROLES.ADMIN
                    ? setAdminOpen(true)
                    : setOpen(true)
                }
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
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Signers</Form.Label>
            <MultiEmployee setValue={setSigners} value={signers} />
          </Form.Group>
          <Row>
            <Col xs={12}>
              <button
                className="employee_create_btn mt-3 mt-md-5"
                disabled={
                  profileDetail?.userType === ROLES.ADMIN
                    ? false
                    : driverSignature?.length === 0
                }
              >
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
  Wcomponenet: CreateMentalStatus,
});
