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
  parseTimeStringToDate,
} from "@/utils/utils";
import { CheckBoxMaker, BorderlessInput } from "@/utils/Makers";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { ROLES } from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
const CreateBhpProgress = () => {
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
  const [dateOfDischarge, setDateOfDischarge] = useState(
    new Date().toDateString(),
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalDuration, setTotalDuration] = useState("");
  const [bhpSignature, setBhpSignature] = useState("");
  const [bhpSignatureDateTime, setBhpSignatureDateTime] = useState("");
  const [open3, setOpen3] = useState(false);
  const [patientDetail, setPatientDetail] = useState({});
  const [placeOfService, setPlaceOfService] = useState("");
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [signers, setSigners] = useState([]);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [openAdmin, setAdminOpen] = useState(false);
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

  const { signatures, updateSignature } = useSignatures();
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
  useEffect(() => {
    if (patientId) {
      patientChartService.bhpProgress.getByPatientId(patientId, {
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
      setDateOfDischarge(new Date().toDateString());
      setReasonForContinuedStay(populateData?.reasonForContinuedStay);
      setBhpNameAndCredentials(populateData?.bhpNameAndCredentials);
      setProgressTowardsTreatment(populateData?.progressTowardsTreatment);
      setContinuedTherapeutic(populateData?.continuedTherapeutic);
      setAddressingCognitive(populateData?.addressingCognitive);
      setSustainingSobriety(populateData?.sustainingSobriety);
      setResidentProgress(populateData?.residentProgress);
      setStartTime(populateData?.startTime || "");
      setEndTime(populateData?.endTime || "");
      setTotalDuration(populateData?.totalDuration || "");
      setPlaceOfService(populateData?.placeOfService || "");
      setDress(populateData?.dress || []);
      setDressOther(populateData?.dressOther || "");
      setGrooming(populateData?.grooming || []);
      setPsychomotorActivity(populateData?.psychomotorActivity || []);
      setSpeech(populateData?.speech || []);
      setAffect(populateData?.affect || []);
      setAffectOther(populateData?.affectOther || "");
      setMood(populateData?.mood || []);
      setMoodOther(populateData?.moodOther || "");
      setProcess(populateData?.process || []);
      setProcessOther(populateData?.processOther || "");
      setContent(populateData?.content || []);
      setContentOther(populateData?.contentOther || "");
      setPerceptions(populateData?.perceptions || []);
      setJudgment(populateData?.judgment || []);
      setInsight(populateData?.insight || []);
      setSuicidalIdeation(populateData?.suicidalIdeation || "");
      setSuicidalIdeationOther(populateData?.suicidalIdeationOther || "");
    } else {
    }
  }, [data, patientId, profile._id]);
  const initialFormData = {
    patientId,
    dateOfDischarge,
    startTime,
    endTime,
    totalDuration,
    placeOfService,
    clientName,
    reasonForContinuedStay,
    bhpNameAndCredentials,
    stepDownBarriers,
    stepDownBarriersOther,
    stepDownBarriersText,
    progressTowardsTreatment,
    continuedTherapeutic,
    addressingCognitive,
    sustainingSobriety,
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
    signatures,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    patientChartService.bhpProgress.post(initialFormData, {
      setLoading,
      navigate,
    });
  };
  useEffect(() => {
    if (patientDetail) {
      setAhcccsId(patientDetail?.ahcccsId);
      setDateOfAdmission(patientDetail?.admitDate);
      setDiagnosis(patientDetail?.diagnosis);
      setStepDownBarriers(
        patientDetail?.stepDownBarriers || patientDetail?.barries || [],
      );
      setStepDownBarriersOther(patientDetail?.stepDownBarriersOther || "");
      setStepDownBarriersText(patientDetail?.stepDownBarriersText || "");
      setStepDownBarriersBoolean(
        (
          patientDetail?.stepDownBarriers ||
          patientDetail?.barries ||
          []
        )?.includes("Other") || false,
      );
    }
  }, [patientDetail]);

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
      <NavWrapper title={"BHP Progress Notes"} isArrow={true} />
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
                    <Form.Label className="fw-bold">Today's date</Form.Label>
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
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">Start Time</Form.Label>
                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={
                        startTime ? parseTimeStringToDate(startTime) : null
                      }
                      onChange={(e, timeString) => setStartTime(timeString)}
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
                    <Form.Label className="fw-bold">
                      Place of Services
                    </Form.Label>
                    <div className="d-flex align-items-center mt-2">
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
            </Card.Body>
          </Card>
          <Card className="mb-2 mb-md-3">
            <Card.Body>
              <Row>
                <Col xs={12} md={12} lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Focus of session/Therapeutic intervention:
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={(e) => setResidentProgress(e.target.value)}
                      value={residentProgress}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={12} lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Sustaining Sobriety and managing physical Health:
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={(e) => setSustainingSobriety(e.target.value)}
                      value={sustainingSobriety}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={12} lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Cognitive and emotional challenges:
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={(e) => setAddressingCognitive(e.target.value)}
                      value={addressingCognitive}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={12} lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Continued Therapeutic Support:
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={(e) => setContinuedTherapeutic(e.target.value)}
                      value={continuedTherapeutic}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={12} lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Progress towards treatment goals:
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={(e) =>
                        setProgressTowardsTreatment(e.target.value)
                      }
                      value={progressTowardsTreatment}
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
                      as="textarea"
                      onChange={(e) =>
                        setReasonForContinuedStay(e.target.value)
                      }
                      value={reasonForContinuedStay}
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
                        onChange={() =>
                          handleCheckboxChangeAffect("Appropriate")
                        }
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
                        onChange={() =>
                          handleCheckboxChangeAffect("Flat (void)")
                        }
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
                        checked={mood?.includes(
                          "Hypomanic (revved up Anxious)",
                        )}
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
                        checked={mood?.includes(
                          "Euphoric (intensity elevated)",
                        )}
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
                          handleCheckboxChangeContent(
                            "Obsessive (hyper focused)",
                          )
                        }
                      />
                      <Form.Check
                        inline
                        label="Phobias (unreasonable fear)"
                        type="checkbox"
                        id="ContentPhobias"
                        checked={content?.includes(
                          "Phobias (unreasonable fear)",
                        )}
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
                        onChange={() =>
                          handleCheckboxChangePerceptions("Intact")
                        }
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
                      as="textarea"
                      onChange={(e) => setBhpNameAndCredentials(e.target.value)}
                      value={bhpNameAndCredentials}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
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
  Wcomponenet: CreateBhpProgress,
});
