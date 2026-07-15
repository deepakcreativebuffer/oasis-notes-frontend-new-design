/** @format */
import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { ClipLoader } from "react-spinners";
import { TextareaMaker } from "@/utils/Makers";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  patientChartService,
  patientService,
} from "@/features/shared/services";
import { BorderlessInput, CheckBoxMaker, RadioMaker } from "@/utils/Makers";
import {
  AddSignature,
  checkMultiValues,
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
  toDatePickerValue,
} from "@/utils/utils";
import { signatureFormat } from "@/utils/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker.jsx";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import {
  applyResidentHeaderFields,
  formatAdmitForForm,
  hasPatientRecord,
  normalizePatientRecord,
  resolveAdmitDate,
  resolveProgressNoteAdmit,
} from "@/utils/patientPopulate";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
const ProgressNoteForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [admitDate, setAdmitDate] = useState("");
  const [date, setDate] = useState("");
  const [shiftBeginning, setShiftBeginning] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");
  const [appointment, setAppointment] = useState([]);
  const [mood, setMood] = useState([]);
  const [speech, setSpeech] = useState([]);
  const [behaviours, setBehaviours] = useState([]);
  const [residentRedirectedOnBehaviors, setResidentRedirectedOnBehaviors] =
    useState(false);
  const [communityOutings, setCommunityOutings] = useState(true);
  const [adlsCompleted, setAdlsCompleted] = useState(true);
  const [mealPreparation, setMealPreparation] = useState("");
  const [awolElopement, setAwolElopement] = useState(true);
  const [noteSummary, setNoteSummary] = useState("");
  const [bhtSignature, setBhtSignature] = useState("");
  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [
    participatedInGroupIndividualTherapySession,
    setParticipatedInGroupIndividualTherapySession,
  ] = useState("");
  const [mealOffered, setMealOffered] = useState("");
  const [snacksOffered, setSnacksOffered] = useState("");
  const [HealthAndWelfareChecks, setHealthAndWelfareChecks] = useState(true);
  const [medicationAdministered, setMedicationAdministered] = useState("");
  const [promptedToTakeMedications, setPromptedToTakeMedications] =
    useState(true);
  const [promptedToCompleteADLS, setPromptedToCompleteADLS] = useState(true);
  const [waterTemperature, setWaterTemperature] = useState(true);
  const [appropriateClothing, setAppropriateClothing] = useState(true);
  const [dateSigned, setDateSigned] = useState("");
  const [signedTime, setSignedTime] = useState("");
  const [detail, setDetail] = useState({});
  const [isOtherMood, setIsOtherMood] = useState(false);
  const [moodOther, setMoodOther] = useState("");
  const [isOtherSpeech, setIsOtherSpeech] = useState(false);
  const [speechOther, setSpeechOther] = useState("");
  const [isOtherBehaviors, setIsOtherBehaviours] = useState(false);
  const [behaviorsOther, setBehaviourOther] = useState("");
  const [isOtherAppointment, setIsOtherAppointment] = useState(false);
  const [appointmentOther, setAppointmentOther] = useState("");
  const [activitiesOther, setActivitiesOther] = useState("");
  const [signers, setSigners] = useState([]);
  const shift = shiftBeginning + "-" + shiftEnd;
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
  const fetchHandler = useCallback(() => {
    patientChartService.progressNote.getById(id, { setResponse: setDetail });
  }, [id]);
  useEffect(() => {
    if (!isEdit) return;
    fetchHandler();
  }, [fetchHandler, isEdit]);

  useEffect(() => {
    if (isEdit || !hasPatientRecord(patientDetail)) return;
    applyResidentHeaderFields(patientDetail, {
      setDateOfBirth,
      setAdmitDate,
      setAhcccsId,
      setDiagnosis,
      setResidentName,
    });
  }, [patientDetail, isEdit]);

  useEffect(() => {
    if (isEdit || !patientId || admitDate) return;
    patientService.getById(patientId, {
      setResponse: (res) => {
        const patient = normalizePatientRecord(res);
        const resolved = resolveAdmitDate(patient);
        if (resolved) setAdmitDate(formatAdmitForForm(resolved));
      },
    });
  }, [patientId, isEdit, admitDate]);
  const payload = {
    patientId,
    residentName,
    dateOfBirth,
    ahcccsId,
    diagnosis,
    admitDate,
    date,
    shift,
    shiftBeginning,
    shiftEnd,
    appointment,
    mood,
    speech,
    behaviors: behaviours,
    residentRedirectedOnBehaviors,
    communityOutings,
    participatedInGroupIndividualTherapySession,
    mealPreparation,
    mealOffered,
    snacksOffered,
    awolElopement,
    HealthAndWelfareChecks,
    medicationAdministered,
    adlsCompleted,
    promptedToTakeMedications,
    promptedToCompleteADLS,
    waterTemperature,
    appropriateClothing,
    activities,
    noteSummary,
    bhtSignature,
    dateSigned,
    signedTime,
    saveAsDraft,
    activitiesOther,
    isOtherMood,
    moodOther,
    isOtherSpeech,
    speechOther,
    isOtherBehaviors,
    behaviorsOther,
    isOtherAppointment,
    appointmentOther,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    signers,
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      const additionalFunctions = [fetchHandler];
      patientChartService.progressNote.update(id, payload, {
        successMsg: "Shift Progress Note updated !",
        setLoading,
        additionalFunctions,
        navigate,
      });
    } else {
      patientChartService.progressNote.create(
        {
          ...payload,
          signers: signers?.map((signer) => ({
            signerId: signer.value,
            name: signer.label,
            signature: "",
            dateSigned: "",
            signedTime: "",
          })),
        },
        {
          isAdmin: profileInfo?.userType === ROLES.ADMIN,
          setLoading,
          navigate,
        },
      );
    }
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
    if (!isEdit || !detail?.data) return;
    if (detail?.data) {
      const item = detail?.data;
      if (item) {
        setPatientId(item?.patientId || item?.patientId?._id);
        setResidentName(
          item?.residentName ||
            `${item?.patientId?.firstName} ${item?.patientId?.lastName}`,
        );
        setDateOfBirth(item?.dateOfBirth || item?.patientId?.dateOfBirth);
        setAdmitDate(formatAdmitForForm(resolveProgressNoteAdmit(item)));
        setAhcccsId(
          item?.ahcccsId ??
            (typeof item?.patientId === "object"
              ? item?.patientId?.ahcccsId
              : ""),
        );
        setDiagnosis(
          item?.diagnosis ??
            (typeof item?.patientId === "object"
              ? item?.patientId?.diagnosis
              : ""),
        );
        setDate(item?.date);
        setShiftBeginning(item?.shiftBeginning);
        setShiftEnd(item?.shiftEnd);
        setAppointment(item?.appointment);
        setMood(item?.mood);
        setSpeech(item?.speech);
        setBehaviours(item?.behaviors);
        setResidentRedirectedOnBehaviors(item?.residentRedirectedOnBehaviors);
        setCommunityOutings(item?.communityOutings);
        setAdlsCompleted(item?.adlsCompleted);
        setMealPreparation(item?.mealPreparation);
        setAwolElopement(item?.awolElopement);
        setNoteSummary(item?.noteSummary);
        setBhtSignature(item?.bhtSignature);
        setParticipatedInGroupIndividualTherapySession(
          item?.participatedInGroupIndividualTherapySession,
        );
        setMealOffered(item?.mealOffered || "");
        setSnacksOffered(item?.snacksOffered);
        setHealthAndWelfareChecks(item?.HealthAndWelfareChecks);
        setMedicationAdministered(item?.medicationAdministered);
        setPromptedToTakeMedications(item?.promptedToTakeMedications);
        setPromptedToCompleteADLS(item?.promptedToCompleteADLS);
        setWaterTemperature(item?.waterTemperature);
        setAppropriateClothing(item?.appropriateClothing);
        setDateSigned(item?.dateSigned);
        setSignedTime(item?.signedTime);
        setActivities(item?.activities);
        setIsOtherMood(item?.isOtherMood);
        setMoodOther(item?.moodOther);
        setIsOtherSpeech(item?.isOtherSpeech);
        setSpeechOther(item?.speechOther);
        setIsOtherBehaviours(item?.isOtherBehaviors);
        setBehaviourOther(item?.behaviorsOther);
        setIsOtherAppointment(item?.isOtherAppointment);
        setAppointmentOther(item?.appointmentOther);
        setActivitiesOther(item?.activitiesOther);
        setAdminSignature(item?.adminSignature);
        setAdminDateSigned(item?.adminDateSigned);
        setAdminSignedTime(item?.adminSignedTime);
        setSigners(
          item?.signers?.map((s) => ({
            ...s,
            value: s.signerId,
            label: s.name,
          })) || [],
        );
      }
    }
  }, [detail, isEdit]);

  useEffect(() => {
    if (!isEdit || !detail?.data) return;
    if (resolveProgressNoteAdmit(detail.data)) return;

    const item = detail.data;
    const pId =
      typeof item.patientId === "object" ? item.patientId?._id : item.patientId;
    if (!pId) return;

    patientService.getById(pId, {
      setResponse: (res) => {
        const patient = normalizePatientRecord(res);
        const admit = resolveAdmitDate(patient);
        if (admit) setAdmitDate(formatAdmitForForm(admit));
      },
    });
  }, [detail, isEdit]);

  useEffect(() => {
    if (!isEdit || !detail?.data) return;
    if (detail?.data) {
      const { saveAsDraft, signers } = detail.data;
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
        .includes("pn");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    detail?.data,
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
      (detail?.data?.employeeId === profileInfo?._id ||
        detail?.data?.employeeId?._id === profileInfo?._id) &&
      bhtSignature?.length > 0;
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
    detail?.data?.employeeId,
    bhtSignature?.length,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [bhtSignature, adminSignature, id, checkSign]);
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
              name: `${profileInfo?.firstName} ${profileInfo?.lastName}`,
              value: profileInfo._id,
              label: `${profileInfo?.firstName} ${profileInfo?.lastName}`,
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
              name: `${profileInfo?.firstName} ${profileInfo?.lastName}`,
              value: profileInfo._id,
              label: `${profileInfo?.firstName} ${profileInfo?.lastName}`,
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
  return (
    <>
      <AddSignature
        show={open}
        setValue={(sign) =>
          (!isEdit && profileInfo?.userType === ROLES.EMPLOYEE) ||
          detail?.data?.employeeId === profileInfo?._id ||
          detail?.data?.employeeId?._id === profileInfo?._id
            ? setBhtSignature(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          (!isEdit && profileInfo?.userType === ROLES.EMPLOYEE) ||
          detail?.data?.employeeId === profileInfo?._id ||
          detail?.data?.employeeId?._id === profileInfo?._id
            ? setDateSigned(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          (!isEdit && profileInfo?.userType === ROLES.EMPLOYEE) ||
          detail?.data?.employeeId === profileInfo?._id ||
          detail?.data?.employeeId?._id === profileInfo?._id
            ? setSignedTime(time)
            : editTimeHandler(time)
        }
      />
      <NavWrapper title={"Shift Progress Note"} isArrow={true} />
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
            <Form.Group>
              <Form.Label className="fw-bold"> Resident Name :</Form.Label>{" "}
              <Form.Label> {residentName} </Form.Label>{" "}
            </Form.Group>
          )}
          <Card
            className={`mb-2 mb-md-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Card.Body>
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
                <Col col={12} md={6} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">Admit Date</Form.Label>
                    <DatePicker
                      selected={toDatePickerValue(admitDate)}
                      disabled
                      onChange={(selectedDate) =>
                        setAdmitDate(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            toDatePickerValue(admitDate) || new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col col={12} md={6} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">DOB</Form.Label>
                    <DatePicker
                      selected={toDatePickerValue(dateOfBirth)}
                      disabled
                      onChange={(selectedDate) =>
                        setDateOfBirth(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            toDatePickerValue(dateOfBirth) || new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card
            className={`mb-2 mb-md-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Card.Body>
              <Row>
                <Col col={12} md={6} lg={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">Date</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(date)}
                      onChange={(selectedDate) =>
                        setDate(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            date ? formatDateToMMDDYYYY(date) : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col col={12} md={6} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Diagnosis (specify if new or continuing)
                    </Form.Label>
                    <Form.Control
                      disabled
                      onChange={(e) => setDiagnosis(e.target.value)}
                      type="text"
                      value={diagnosis && diagnosis}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card
            className={`mb-2 mb-md-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Card.Body>
              <Row>
                <Col col={12} md={6} lg={6}>
                  <Form.Group className="mb-3 ">
                    <Form.Label className="fw-bold">
                      Shift: Beginning Time
                    </Form.Label>

                    <CustomTimePicker
                      value={
                        shiftBeginning
                          ? parseTimeStringToDate(shiftBeginning)
                          : null
                      }
                      onChange={setShiftBeginning}
                      use24Hours={hoursFormat === "HH:mm"}
                    />
                  </Form.Group>
                </Col>
                <Col col={12} md={6} lg={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">Shift: End Time</Form.Label>

                    <CustomTimePicker
                      value={shiftEnd ? parseTimeStringToDate(shiftEnd) : null}
                      onChange={setShiftEnd}
                      use24Hours={hoursFormat === "HH:mm"}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Row
            className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Col col={12} md={12} lg={12} className="mb-2 mb-md-3">
              <Card className="h-100">
                <Card.Body>
                  <Form.Label className="fw-bold">Appointment:</Form.Label>
                  <div className="radio-inline">
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: appointment,
                          value: "NO",
                          setArr: setAppointment,
                        })
                      }
                      value="NO"
                      id="appointment1"
                      label="NO"
                      checked={appointment?.includes("NO")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: appointment,
                          value: "PCP",
                          setArr: setAppointment,
                        })
                      }
                      value="PCP"
                      id="aapointmentPCP"
                      label="Primary Care Physician"
                      checked={appointment?.includes("PCP")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: appointment,
                          value: "Psych",
                          setArr: setAppointment,
                        })
                      }
                      value="Psych"
                      id="aapointmentPsych"
                      label="Psychiatric Provider"
                      checked={appointment?.includes("Psych")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: appointment,
                          value: "Specialist visit",
                          setArr: setAppointment,
                        })
                      }
                      value="Specialist visit"
                      id="aapointmentSpecialistVisit"
                      label="Specialist visit"
                      checked={appointment?.includes("Specialist visit")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: appointment,
                          value: "Dental",
                          setArr: setAppointment,
                        })
                      }
                      value="Dental"
                      id="aapointmentDental"
                      label="Dental"
                      checked={appointment?.includes("Dental")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: appointment,
                          value: "Emergency Room",
                          setArr: setAppointment,
                        })
                      }
                      value="Emergency Room"
                      id="aapointmentEmergencyRoom"
                      label="Emergency Room"
                      checked={appointment?.includes("Emergency Room")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: appointment,
                          value: "Urgent Care",
                          setArr: setAppointment,
                        })
                      }
                      value="Urgent Care"
                      id="aapointmentUrgent"
                      label="Urgent Care"
                      checked={appointment?.includes("Urgent Care")}
                    />

                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: appointment,
                          value: "Other",
                          setArr: setAppointment,
                        })
                      }
                      value="Other"
                      id="aapointmentOther"
                      label="Other"
                      checked={appointment?.includes("Other")}
                    />
                    {appointment?.includes("Other") && (
                      <BorderlessInput
                        className="w-auto"
                        setState={setAppointmentOther}
                        type="text"
                        value={appointmentOther}
                      />
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={12} lg={12} className="mb-2 mb-md-3">
              <Card className="h-100">
                <Card.Body>
                  <Form.Label className="fw-bold">Mood:</Form.Label>
                  <div className="radio-inline">
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: mood,
                          value: "Appropriate",
                          setArr: setMood,
                        })
                      }
                      value="Appropriate"
                      id="Appropriate"
                      label="Appropriate"
                      checked={mood?.includes("Appropriate")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: mood,
                          value: "Anxious",
                          setArr: setMood,
                        })
                      }
                      value="Anxious"
                      id="Anxious"
                      label="Anxious"
                      checked={mood?.includes("Anxious")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: mood,
                          value: "Worry",
                          setArr: setMood,
                        })
                      }
                      value="Worry"
                      id="Worry"
                      label="Worry"
                      checked={mood?.includes("Worry")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: mood,
                          value: "Sad",
                          setArr: setMood,
                        })
                      }
                      value="Sad"
                      id="Sad"
                      label="Sad"
                      checked={mood?.includes("Sad")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: mood,
                          value: "Depressed",
                          setArr: setMood,
                        })
                      }
                      value="Depressed"
                      id="Depressed"
                      label="Depressed"
                      checked={mood?.includes("Depressed")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: mood,
                          value: "Irritable",
                          setArr: setMood,
                        })
                      }
                      value="Irritable"
                      id="Irritable"
                      label="Irritable"
                      checked={mood?.includes("Irritable")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: mood,
                          value: "Angry",
                          setArr: setMood,
                        })
                      }
                      value="Angry"
                      id="Angry"
                      label="Angry"
                      checked={mood?.includes("Angry")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: mood,
                          value: "Fearful",
                          setArr: setMood,
                        })
                      }
                      value="Fearful"
                      id="Fearful"
                      label="Fearful"
                      checked={mood?.includes("Fearful")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: mood,
                          value: "Other",
                          setArr: setMood,
                        })
                      }
                      value="Other"
                      id="MoodOther"
                      label="Other"
                      checked={mood?.includes("Other")}
                    />
                    {mood?.includes("Other") && (
                      <BorderlessInput
                        className="w-auto"
                        setState={setMoodOther}
                        type="text"
                        value={moodOther}
                      />
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={12} lg={12} className="mb-2 mb-md-3">
              <Card className="h-100">
                <Card.Body>
                  <Form.Label className="fw-bold">Speech:</Form.Label>
                  <div className="radio-inline">
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: speech,
                          value: "Appropriate",
                          setArr: setSpeech,
                        })
                      }
                      value="Appropriate"
                      id="SpeechAppropriate"
                      label="Appropriate"
                      checked={speech?.includes("Appropriate")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: speech,
                          value: "Selective mute",
                          setArr: setSpeech,
                        })
                      }
                      value="Selective mute"
                      id="SpeechSelectiveMute"
                      label="Selective mute"
                      checked={speech?.includes("Selective mute")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: speech,
                          value: "Quiet",
                          setArr: setSpeech,
                        })
                      }
                      value="Quiet"
                      id="SpeechQuiet"
                      label="Quiet"
                      checked={speech?.includes("Quiet")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: speech,
                          value: "Nonverbal",
                          setArr: setSpeech,
                        })
                      }
                      value="Nonverbal"
                      id="SpeechNonverbal"
                      label="Nonverbal"
                      checked={speech?.includes("Nonverbal")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: speech,
                          value: "Hyperverbal",
                          setArr: setSpeech,
                        })
                      }
                      value="Hyperverbal"
                      id="SpeechHyperverbal"
                      label="Hyperverbal"
                      checked={speech?.includes("Hyperverbal")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: speech,
                          value: "Other",
                          setArr: setSpeech,
                        })
                      }
                      value="Other"
                      id="SpeechOther"
                      label="Other"
                      checked={speech?.includes("Other")}
                    />
                    {speech?.includes("Other") && (
                      <BorderlessInput
                        className="w-auto"
                        setState={setSpeechOther}
                        type="text"
                        value={speechOther}
                      />
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={12} lg={12} className="mb-2 mb-md-3">
              <Card className="h-100">
                <Card.Body>
                  <Form.Label className="fw-bold">Behaviors</Form.Label>
                  <div className="radio-inline">
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: behaviours,
                          value: "Appropriate",
                          setArr: setBehaviours,
                        })
                      }
                      value="Appropriate"
                      id="BehaviorsAppropriate"
                      label="Appropriate"
                      checked={behaviours?.includes("Appropriate")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: behaviours,
                          value: "Verbal aggression",
                          setArr: setBehaviours,
                        })
                      }
                      value="Verbal aggression"
                      id="BehaviorsVerbalAggression"
                      label="Verbal aggression"
                      checked={behaviours?.includes("Verbal aggression")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: behaviours,
                          value: "Physical aggression",
                          setArr: setBehaviours,
                        })
                      }
                      value="Physical aggression"
                      id="BehaviorsPhysicalAggression"
                      label="Physical aggression"
                      checked={behaviours?.includes("Physical aggression")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: behaviours,
                          value: "Responding to internal stimuli",
                          setArr: setBehaviours,
                        })
                      }
                      value="Responding to internal stimuli"
                      id="BehaviorsRespondingtointernalstimuli"
                      label="Responding to internal stimuli"
                      checked={behaviours?.includes(
                        "Responding to internal stimuli",
                      )}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: behaviours,
                          value: "Isolation",
                          setArr: setBehaviours,
                        })
                      }
                      value="Isolation"
                      id="BehaviorsIsolation"
                      label="Isolation"
                      checked={behaviours?.includes("Isolation")}
                    />

                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: behaviours,
                          value: "Obsession",
                          setArr: setBehaviours,
                        })
                      }
                      value="Obsession"
                      id="BehaviorsObsession"
                      label="Obsession"
                      checked={behaviours?.includes("Obsession")}
                    />

                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: behaviours,
                          value: "Manipulative",
                          setArr: setBehaviours,
                        })
                      }
                      value="Manipulative"
                      id="BehaviorsManipulative"
                      label="Manipulative"
                      checked={behaviours?.includes("Manipulative")}
                    />

                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: behaviours,
                          value: "Impulsive",
                          setArr: setBehaviours,
                        })
                      }
                      value="Impulsive"
                      id="BehaviorsImpulsive"
                      label="Impulsive"
                      checked={behaviours?.includes("Impulsive")}
                    />

                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: behaviours,
                          value: "Poor boundaries",
                          setArr: setBehaviours,
                        })
                      }
                      value="Poor boundaries"
                      id="BehaviorsPoorBoundaries"
                      label="Poor boundaries"
                      checked={behaviours?.includes("Poor boundaries")}
                    />

                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: behaviours,
                          value: "Sexual maladaptive behaviors",
                          setArr: setBehaviours,
                        })
                      }
                      value="Sexual maladaptive behaviors"
                      id="BehaviorsSexualMaladaptive"
                      label="Sexual maladaptive behaviors"
                      checked={behaviours?.includes(
                        "Sexual maladaptive behaviors",
                      )}
                    />

                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: behaviours,
                          value: "Other",
                          setArr: setBehaviours,
                        })
                      }
                      value="Other"
                      id="BehaviorsOther"
                      label="Other"
                      checked={behaviours?.includes("Other")}
                    />
                    {behaviours?.includes("Other") && (
                      <BorderlessInput
                        className="w-auto"
                        setState={setBehaviourOther}
                        type="text"
                        value={behaviorsOther}
                      />
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row
            className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Col col={12} md={12} lg={12}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <Form.Label className="fw-bold">
                    Resident redirected on behaviors?
                  </Form.Label>
                  <div className="radio-inline">
                    <RadioMaker
                      name="residentRedirectedOnBehaviors"
                      setValue={setResidentRedirectedOnBehaviors}
                      value={true}
                      id={"residentRedirectedOnBehaviors1"}
                      label={"Yes"}
                      checked={residentRedirectedOnBehaviors}
                    />
                    <RadioMaker
                      name="residentRedirectedOnBehaviors"
                      setValue={setResidentRedirectedOnBehaviors}
                      value={false}
                      id={"residentRedirectedOnBehaviors2"}
                      label={"No"}
                      checked={residentRedirectedOnBehaviors}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={12} lg={6}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <div>
                    <Form.Label className="fw-bold">
                      Outing in community?
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <RadioMaker
                      name="Outingincommunity"
                      setValue={setCommunityOutings}
                      value={true}
                      id={"Outingincommunity1"}
                      label={"Yes"}
                      checked={communityOutings}
                    />

                    <RadioMaker
                      name="Outingincommunity"
                      setValue={setCommunityOutings}
                      value={false}
                      id={"Outingincommunity2"}
                      label={"No"}
                      checked={communityOutings}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={12} lg={6}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <div>
                    <Form.Label className="fw-bold">
                      Participated in group/individual therapy session(s)?
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <RadioMaker
                      name="participatedInGroupIndividualTherapySession"
                      setValue={setParticipatedInGroupIndividualTherapySession}
                      value={"Yes"}
                      id={"participatedInGroupIndividualTherapySession1"}
                      label={"Yes"}
                      checked={participatedInGroupIndividualTherapySession}
                    />
                    <RadioMaker
                      name="participatedInGroupIndividualTherapySession"
                      setValue={setParticipatedInGroupIndividualTherapySession}
                      value={"No"}
                      id={"participatedInGroupIndividualTherapySession2"}
                      label={"No"}
                      checked={participatedInGroupIndividualTherapySession}
                    />
                    <RadioMaker
                      name="participatedInGroupIndividualTherapySession"
                      setValue={setParticipatedInGroupIndividualTherapySession}
                      value={"Refused"}
                      id={"participatedInGroupIndividualTherapySessionRefused"}
                      label={"Refused"}
                      checked={participatedInGroupIndividualTherapySession}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={12} lg={6}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <div>
                    <Form.Label className="fw-bold">
                      Meal preparation
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <RadioMaker
                      name="mealPreparation"
                      setValue={setMealPreparation}
                      value={"I"}
                      id={"mealPreparationI"}
                      label={"I"}
                      checked={mealPreparation}
                    />

                    <RadioMaker
                      name="mealPreparation"
                      setValue={setMealPreparation}
                      value={"HP"}
                      id={"mealPreparationHP"}
                      label={"HP"}
                      checked={mealPreparation}
                    />
                    <RadioMaker
                      name="mealPreparation"
                      setValue={setMealPreparation}
                      value={"H"}
                      id={"MealH"}
                      label={"H"}
                      checked={mealPreparation}
                    />
                    <RadioMaker
                      name="mealPreparation"
                      setValue={setMealPreparation}
                      value={"R"}
                      id={"MealR"}
                      label={"R"}
                      checked={mealPreparation}
                    />
                    <RadioMaker
                      name="mealPreparation"
                      setValue={setMealPreparation}
                      value={"PA"}
                      id={"MealPA"}
                      label={"PA"}
                      checked={mealPreparation}
                    />
                    <RadioMaker
                      name="mealPreparation"
                      setValue={setMealPreparation}
                      value={"TA"}
                      id={"MealTA"}
                      label={"TA"}
                      checked={mealPreparation}
                    />
                    <RadioMaker
                      name="mealPreparation"
                      setValue={setMealPreparation}
                      value={"VP"}
                      id={"MealVP"}
                      label={"VP"}
                      checked={mealPreparation}
                    />
                    <RadioMaker
                      name="mealPreparation"
                      setValue={setMealPreparation}
                      value={"NP"}
                      id={"MealNP"}
                      label={"NP"}
                      checked={mealPreparation}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={12} lg={6}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <div className="">
                    <Form.Label className="fw-bold">
                      Meal offered and taken
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <Form.Check
                      className="form-check-inline"
                      label="Meal refused"
                      onChange={() => {
                        checkMultiValues(
                          setMealOffered,
                          mealOffered,
                          "Meal refused",
                        );
                      }}
                      checked={mealOffered?.includes("Meal refused")}
                      id="mealOfferedRefused"
                    />
                    <Form.Check
                      className="form-check-inline"
                      label="Breakfast eaten"
                      onChange={() => {
                        checkMultiValues(
                          setMealOffered,
                          mealOffered,
                          "Breakfast eaten",
                        );
                      }}
                      checked={mealOffered?.includes("Breakfast eaten")}
                      id="mealOfferedEaten"
                    />
                    <Form.Check
                      className="form-check-inline"
                      label="Lunch eaten"
                      onChange={() => {
                        checkMultiValues(
                          setMealOffered,
                          mealOffered,
                          "Lunch eaten",
                        );
                      }}
                      checked={mealOffered?.includes("Lunch eaten")}
                      id="mealOfferedLunch"
                    />
                    <Form.Check
                      className="form-check-inline"
                      label="Dinner eaten"
                      onChange={() => {
                        checkMultiValues(
                          setMealOffered,
                          mealOffered,
                          "Dinner eaten",
                        );
                      }}
                      checked={mealOffered?.includes("Dinner eaten")}
                      id="mealOfferedDinner"
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={12} lg={6}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <div className="">
                    <Form.Label className="fw-bold">
                      Snacks offered and taken
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <RadioMaker
                      name="snacksOffered"
                      setValue={setSnacksOffered}
                      value={"Snacks refused"}
                      id={"SnacksRefused"}
                      label={"Snacks refused"}
                      checked={snacksOffered}
                    />

                    <RadioMaker
                      name="snacksOffered"
                      setValue={setSnacksOffered}
                      value={"Yes"}
                      id={"SnackYes"}
                      label={"Yes"}
                      checked={snacksOffered}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={12} lg={6}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <div className="">
                    <Form.Label className="fw-bold">AWOL</Form.Label>
                  </div>
                  <div className="radio-inline">
                    <RadioMaker
                      name="awol"
                      setValue={setAwolElopement}
                      value={true}
                      id={"awol1"}
                      label={"Yes"}
                      checked={awolElopement}
                    />

                    <RadioMaker
                      name="awol"
                      setValue={setAwolElopement}
                      value={false}
                      id={"awol2"}
                      label={"No"}
                      checked={awolElopement}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={12} lg={12}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <div className="">
                    <Form.Label className="fw-bold">
                      Health and welfare checks at least every 30 minutes to 1
                      hour?
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <RadioMaker
                      name="health"
                      setValue={setHealthAndWelfareChecks}
                      value={true}
                      id={"health1"}
                      label={"Yes"}
                      checked={HealthAndWelfareChecks}
                    />
                    <RadioMaker
                      name="health"
                      setValue={setHealthAndWelfareChecks}
                      value={false}
                      id={"health2"}
                      label={"No"}
                      checked={HealthAndWelfareChecks}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={12} lg={6}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <div className="">
                    <Form.Label className="fw-bold">
                      Medication administered
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <RadioMaker
                      name="medication"
                      setValue={setMedicationAdministered}
                      value={"Yes"}
                      id={"medication1"}
                      label={"Yes"}
                      checked={medicationAdministered}
                    />
                    <RadioMaker
                      name="medication"
                      setValue={setMedicationAdministered}
                      value={"No"}
                      id={"medication2"}
                      label={"No"}
                      checked={medicationAdministered}
                    />
                    <RadioMaker
                      name="medication"
                      setValue={setMedicationAdministered}
                      value={"Refused"}
                      id={"medication3"}
                      label={"Refused"}
                      checked={medicationAdministered}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={12} lg={6}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <div className="">
                    <Form.Label className="fw-bold">ADLS Completed?</Form.Label>
                  </div>
                  <div className="radio-inline">
                    <RadioMaker
                      name="adls"
                      setValue={setAdlsCompleted}
                      value={true}
                      id={"adls1"}
                      label={"Yes"}
                      checked={adlsCompleted}
                    />

                    <RadioMaker
                      name="adls"
                      setValue={setAdlsCompleted}
                      value={false}
                      id={"adls2"}
                      label={"No"}
                      checked={adlsCompleted}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row
            className={`mt-2 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Col>
              <h5 className="fw-bold">Prompts</h5>
            </Col>
          </Row>
          <Row
            className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Col col={12} md={6} lg={6}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <div className="">
                    <Form.Label className="fw-bold">
                      Was resident prompted to take medications
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <RadioMaker
                      name="takeMedication"
                      setValue={setPromptedToTakeMedications}
                      value={true}
                      id={"takeMedication1"}
                      label={"Yes"}
                      checked={promptedToTakeMedications}
                    />
                    <RadioMaker
                      name="takeMedication"
                      setValue={setPromptedToTakeMedications}
                      value={false}
                      id={"takeMedication2"}
                      label={"No"}
                      checked={promptedToTakeMedications}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={6} lg={6}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <div className="">
                    <Form.Label className="fw-bold">
                      Was resident prompted to complete ADLS
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <RadioMaker
                      name="completeAdls"
                      setValue={setPromptedToCompleteADLS}
                      value={true}
                      id={"completeAdls1"}
                      label={"Yes"}
                      checked={promptedToCompleteADLS}
                    />
                    <RadioMaker
                      name="completeAdls"
                      setValue={setPromptedToCompleteADLS}
                      value={false}
                      id={"completeAdls2"}
                      label={"No"}
                      checked={promptedToCompleteADLS}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={6} lg={6}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <div className="">
                    <Form.Label className="fw-bold">
                      Was the water temperature adjusted for resident
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <RadioMaker
                      name="adjustTemp"
                      setValue={setWaterTemperature}
                      value={true}
                      id={"adjustTemp1"}
                      label={"Yes"}
                      checked={waterTemperature}
                    />
                    <RadioMaker
                      name="adjustTemp"
                      setValue={setWaterTemperature}
                      value={false}
                      id={"adjustTemp2"}
                      label={"No"}
                      checked={waterTemperature}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={6} lg={6}>
              <Card className="mb-2 mb-md-3">
                <Card.Body>
                  <div className="">
                    <Form.Label className="fw-bold">
                      Was resident assisted in selecting appropriate clothing
                    </Form.Label>
                  </div>
                  <div className="radio-inline">
                    <RadioMaker
                      name="appClothing"
                      setValue={setAppropriateClothing}
                      value={true}
                      id={"appClothing1"}
                      label={"Yes"}
                      checked={appropriateClothing}
                    />
                    <RadioMaker
                      name="appClothing"
                      setValue={setAppropriateClothing}
                      value={false}
                      id={"appClothing2"}
                      label={"No"}
                      checked={appropriateClothing}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row
            className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Col col={12} md={6} lg={6} className="mb-2 mb-md-3">
              <Card className="h-100">
                <Card.Body>
                  <div className="">
                    <Form.Label className="fw-bold">Activities</Form.Label>
                  </div>
                  <div className="radio-inline">
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: activities,
                          value: "Journaling",
                          setArr: setActivities,
                        })
                      }
                      value="Journaling"
                      id="activitiesJournaling "
                      label="Journaling"
                      checked={activities?.includes("Journaling")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: activities,
                          value: "Coloring",
                          setArr: setActivities,
                        })
                      }
                      value="Coloring"
                      id="activitiesColoring"
                      label="Coloring"
                      checked={activities?.includes("Coloring")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: activities,
                          value: "Socializing",
                          setArr: setActivities,
                        })
                      }
                      value="Socializing"
                      id="activitiesSocializing"
                      label="Socializing"
                      checked={activities?.includes("Socializing")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: activities,
                          value: "Board games",
                          setArr: setActivities,
                        })
                      }
                      value="Board games"
                      id="activitiesBoardGames"
                      label="Board games"
                      checked={activities?.includes("Board games")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: activities,
                          value: "Park",
                          setArr: setActivities,
                        })
                      }
                      value="Park"
                      id="activitiesPark"
                      label="Park"
                      checked={activities?.includes("Park")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: activities,
                          value: "Arts/crafts",
                          setArr: setActivities,
                        })
                      }
                      value="Arts/crafts"
                      id="activitiesArts/crafts"
                      label="Arts/crafts"
                      checked={activities?.includes("Arts/crafts")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: activities,
                          value: "Other",
                          setArr: setActivities,
                        })
                      }
                      value="Other"
                      id="activitiesOTHER"
                      label="Other"
                      checked={activities?.includes("Other")}
                    />

                    {activities?.includes("Other") && (
                      <BorderlessInput
                        setState={setActivitiesOther}
                        value={activitiesOther}
                      />
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col col={12} md={6} lg={6} className="mb-2 mb-md-3">
              <Card className="h-100">
                <Card.Body>
                  <p className="text-desc mb-0">
                    <Form.Label className="fw-bold me-2">I:</Form.Label>
                    <Form.Label>Independent</Form.Label>
                  </p>
                  <p className="text-desc mb-0">
                    <Form.Label className="fw-bold me-2">R:</Form.Label>
                    <Form.Label>Refused</Form.Label>
                  </p>
                  <p className="text-desc mb-0">
                    <Form.Label className="fw-bold me-2">PA:</Form.Label>
                    <Form.Label>Partial Assist</Form.Label>
                  </p>
                  <p className="text-desc mb-0">
                    <Form.Label className="fw-bold me-2">TA:</Form.Label>
                    <Form.Label>Total Assist</Form.Label>
                  </p>
                  <p className="text-desc mb-0">
                    <Form.Label className="fw-bold me-2">VP:</Form.Label>
                    <Form.Label>Verbal Prompt</Form.Label>
                  </p>
                  <p className="text-desc mb-0">
                    <Form.Label className="fw-bold me-2">NP:</Form.Label>
                    <Form.Label>No prompt</Form.Label>
                  </p>
                  <p className="text-desc mb-0">
                    <Form.Label className="fw-bold me-2">HP=</Form.Label>
                    <Form.Label>Home Pass</Form.Label>
                  </p>
                  <p className="text-desc mb-0">
                    <Form.Label className="fw-bold me-2">H=</Form.Label>
                    <Form.Label>Hospitalization</Form.Label>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row
            className={`mb-2 mb-md-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Col col={12} md={12} lg={12}>
              <TextareaMaker
                label="Shift Note Summary"
                setValue={setNoteSummary}
                value={noteSummary}
              />
            </Col>
          </Row>
          <Row
            className={`${saveAsDrafIsNotEditableWithoutSigner && "pe-none"}`}
          >
            <Col col={12} md={12} lg={12}>
              <div className="custome-cloud-btn mb-0">
                <div className="btns">
                  <Button
                    type="button"
                    className="theme-button"
                    onClick={() => setOpen(true)}
                  >
                    SAVED AND SIGNED
                  </Button>
                </div>
                <div className="text-md-right">
                  {signatureFormat({
                    sign: bhtSignature,
                    date: dateSigned,
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
                    (signer) =>
                      signer.signature && (
                        <div className="text-right" key={signer?.signerId}>
                          {signatureFormat({
                            sign: signer.signature,
                            date: signer.dateSigned,
                            time: signer.signedTime,
                            hoursFormat,
                          })}
                        </div>
                      ),
                  )}
                </div>
              </div>
            </Col>
          </Row>
          {!isEdit && (
            <Row>
              <Col col={12} md={12} lg={12}>
                <div className="form-group">
                  <Form.Label className="fw-bold">Signers</Form.Label>
                  <MultiEmployee
                    setValue={(selected) => {
                      setSigners((prev) => {
                        return selected?.map((sel) => {
                          const existing = prev.find(
                            (p) =>
                              p.signerId === sel.value || p.value === sel.value,
                          );
                          return {
                            ...existing,
                            ...sel,
                            signerId: sel.value,
                            name: sel.label,
                          };
                        });
                      });
                    }}
                    value={signers}
                  />
                </div>
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
                      profileInfo.userType === ROLES.ADMIN
                        ? false
                        : bhtSignature?.length === 0
                    }
                  >
                    {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                  </button>
                </div>
              </Col>
            </Row>
          )}
          {isEdit && (
            <Row>
              <Col col={12} md={12} lg={12}>
                <div className="employee-btn-joiner mt-2">
                  {detail?.data?.saveAsDraft && (
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
                    disabled={!isSubmitEnabled}
                  >
                    {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                  </button>
                </div>
              </Col>
            </Row>
          )}
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: ProgressNoteForm,
});
