/* eslint-disable no-unused-vars */
/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { BorderlessInput, CheckBoxMaker } from "@/utils/Makers";
import { getData } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { therapyNotesService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import TextEditor from "@/features/shared/ui/TextEditor/TextEditor";
import { useNavigate, useParams } from "react-router-dom";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import { showNotification } from "@/utils";
import { useFacilities } from "@shared/hooks";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
const UpdateTherapyLog = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [topic, setTopic] = useState([]);
  const [residentId, setResidentId] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalDuration, setTotalDuration] = useState("");
  const [behaviorTech, setBehaviorTech] = useState("");
  const [location, setLocation] = useState("");
  const [topicId, setTopicId] = useState(null);
  const [residentCompletedSession] = useState(null);
  const [treatmentGoalsAddressed] = useState(null);
  const [residentParticipation] = useState("");
  const [residentQuality] = useState([]);
  const [residentAppearance] = useState([]);
  const [residentMood] = useState([]);
  const [residentProgress] = useState([]);
  const [pleaseSpecify] = useState("");
  const [residentResponse] = useState("");
  const [therapyType, setTheraphyType] = useState([]);
  const [searchTopicsQuery, setSearchTopicsQuery] = useState("");
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [saveAsDrafIsNotEditable, setSaveAsDrafIsNotEditable] = useState(false);
  const [
    saveAsDrafIsNotEditableWithoutSigner,
    setSaveAsDrafIsNotEditableWithoutSigner,
  ] = useState(false);
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);
  const [behavioralTechnicianSignature, setBehavioralTechnicianSignature] =
    useState("");
  const [behavioralTechnicianName, setBehavioralTechnicianName] = useState("");
  const [
    behavioralHealthProfessionalSignature,
    setBehavioralHealthProfessionalSignature,
  ] = useState("");
  const [behavioralHealthProfessional, setBehavioralHealthProfessional] =
    useState([]);
  const [
    behavioralHealthProfessionalData,
    setBehavioralHealthProfessionalData,
  ] = useState([]);
  const [technicianDate, setTechnicianDate] = useState("");
  const [technicianTime, setTechnicianTime] = useState("");
  const [healthDate, setHealthDate] = useState("");
  const [healthTime, setHealthTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [noteSummary, setNoteSummary] = useState("");
  const [planRecommendation, setPlanRecommendation] = useState("");
  const [residentData, setResidentData] = useState({});
  const [residentIdData, setResidentIdData] = useState({});
  const [residentAppearanceOther] = useState("");
  const [residentMoodOther] = useState("");
  const [residentQualityOther] = useState("");
  const [residentProgressOther] = useState("");
  const [residentParticipationOther] = useState("");
  const [detail, setDetail] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const profileUser = useSelector(userProfile);
  const [signers, setSigners] = useState([]);
  const [openSigner, setOpenSigner] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(true);
  const [isSubmitFormEnabled, setIsSubmitFormEnabled] = useState(false);
  const [saveAsDraft, setSavedAsDraft] = useState(false);
  const [facility, setFacility] = useState([]);
  const facilities = useFacilities();
  const [facilityList, setFacilityList] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState("");

  const {
    signatures,
    updateSignature,
    loadFromApi: loadSignaturesFromApi,
  } = useSignatures();
  const { guardTyped, dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });

  const hasTypedInForm = !!behavioralTechnicianSignature || !!adminSignature;

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
    setBehavioralTechnicianSignature("");
    setTechnicianDate("");
    setTechnicianTime("");
    setAdminSignature("");
    setAdminDateSigned("");
    setAdminSignedTime("");
  };

  useEffect(() => {
    if (profileUser?.userType === ROLES.EMPLOYEE) {
      setFacilityList(profileUser?.facilityId || []);
    } else {
      setFacilityList(facilities || []);
    }
  }, [profileUser, facilities]);

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
        setTotalDuration(result.trim());
      }
    } else {
      setTotalDuration("");
    }
  }, [startTime, endTime]);

  useEffect(() => {
    getData(setDetail, `employee/getTherapySessionById/${id}`);
  }, [id]);
  useEffect(() => {
    if (
      (profileUser?.userType === ROLES.ADMIN &&
        profileUser?.tier === "Growth") ||
      (profileUser?.userType === ROLES.EMPLOYEE &&
        profileUser?.adminId?.tier === "Growth")
    ) {
      getData(setTopic, `employee/getAllBhrfTherapyTopic`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateResidentDatan = (residentIds, residentIdData) => {
    if (!residentIds || !residentIdData) return [];
    const updatedData = residentIds?.map((residentId) => {
      const data = residentIdData.find(
        (data) => (data?.patientId?._id || data?.patientId) === residentId._id,
      );
      const tempData = {
        ...residentId,
        patientId: data?.patientId?._id || data?.patientId || "",
        residentCompletedSession: data?.residentCompletedSession,
        treatmentGoalsAddressed: data?.treatmentGoalsAddressed,
        goalsAddressed: data?.goalsAddressed || [],
        goalsAddressedOther: data?.goalsAddressedOther || "",
        // Example for arrays
        residentParticipation: data?.residentParticipation || [],
        residentParticipationOther: data?.residentParticipationOther || "",
        residentAppearance: data?.residentAppearance || [],
        residentAppearanceOther: data?.residentAppearanceOther || "",
        residentMood: data?.residentMood || [],
        residentMoodOther: data?.residentMoodOther || "",
        residentQuality: data?.residentQuality || [],
        residentQualityOther: data?.residentQualityOther || "",
        residentProgress: data?.residentProgress || [],
        residentProgressOther: data?.residentProgressOther || "",
        residentResponse: data?.residentResponse || "",
        significantInfoNotSpecifiedAbove1:
          data?.significantInfoNotSpecifiedAbove1 || false,
        pleaseSpecify: data?.pleaseSpecify || "",
      };
      setResidentData((prevData) => ({
        ...prevData,
        [residentId._id]: tempData, // Assuming residents is the key in state holding the resident data
      }));
      return tempData;
    });
    return updatedData;
  };
  useEffect(() => {
    if (detail) {
      setSavedAsDraft(detail?.data?.saveAsDraft);
      setTheraphyType(detail?.data?.therapyType);
      if (detail?.data?.residentId?.length > 0) {
        const firstResident = detail.data.residentId?.[0];
        const residentIds = [
          {
            value: firstResident._id,
            label: `${firstResident.firstName} ${firstResident.lastName}`,
            accessId: firstResident?.ahcccsId,
            diagnosis: firstResident?.diagnosis,
          },
        ];
        setResidentId(residentIds);
      }
      setDate(detail?.data?.date);
      setStartTime(detail?.data?.startTime);
      setTotalDuration(detail?.data?.totalDuration);
      setBehaviorTech(detail?.data?.behaviorTech);
      setLocation(detail?.data?.location);
      setBehavioralHealthProfessionalData(
        detail?.data?.behavioralHealthProfessionalData,
      );
      setBehavioralHealthProfessional(
        detail?.data?.behavioralHealthProfessional,
      );
      if (detail?.data?.behavioralHealthProfessional) {
        const healthProfessionals =
          detail?.data?.behavioralHealthProfessional?.map(
            (healthProfessional, i) => ({
              value: healthProfessional,
              label: `${detail?.data?.behavioralHealthProfessionalData[i].name}`,
            }),
          );
        setBehavioralHealthProfessional(healthProfessionals);
      }
      setBehavioralTechnicianName(detail?.data?.behavioralTechnicianName);
      updateResidentDatan(
        detail?.data?.residentId,
        detail?.data?.residentIdData,
      );
      setBehavioralTechnicianSignature(
        detail?.data?.behavioralTechnicianSignature,
      );
      setEndTime(detail?.data?.endTime);
      setTopicId(detail?.data?.topicId);
      setSearchTopicsQuery(detail?.data?.topic);
      setNoteSummary(detail?.data?.noteSummary);
      setPlanRecommendation(detail?.data?.planRecommendation);
      setTechnicianDate(detail?.data?.behavioralTechnicianDateSigned);
      setTechnicianTime(detail?.data?.behavioralTechnicianSignedTime);
      setHealthTime(detail?.data?.behavioralHealthProfessionalSignedTime);
      setHealthDate(detail?.data?.behavioralHealthProfessionalDateSigned);
      setSigners(detail?.data?.signers);
      setAdminSignature(detail?.data?.adminSignature);
      setAdminDateSigned(detail?.data?.adminDateSigned);
      setAdminSignedTime(detail?.data?.adminSignedTime);
      setFacility(detail?.data?.facilityId);
      if (detail?.data?.facilityId?.length > 0) {
        setSelectedFacilityId(detail.data.facilityId[0]._id || "");
      }
      if (detail?.data?.signatures) {
        loadSignaturesFromApi(detail.data.signatures);
      }
    }
  }, [detail, loadSignaturesFromApi]);
  useEffect(() => {
    if (residentId && residentData) {
      setResidentData((data) => {
        const temp = residentId
          ?.map((item) => item.value)
          .reduce((acc, curr) => {
            acc[curr] = data[curr];
            return acc;
          }, {});
        return temp;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residentId]);
  useEffect(() => {
    const residentIdDatatemp =
      residentData &&
      Object.keys(residentData)?.map((residentId) => {
        return {
          residentId,
          residentCompletedSession,
          treatmentGoalsAddressed,
          residentParticipation,
          residentParticipationOther,
          residentAppearance,
          residentAppearanceOther,
          residentMood,
          residentMoodOther,
          residentQuality,
          residentQualityOther,
          residentProgress,
          residentProgressOther,
          residentResponse,
          pleaseSpecify,
          ...residentData[residentId],
          patientId: residentId || "",
        };
      });
    setResidentIdData(residentIdDatatemp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residentData]);
  const checkAllFields = async () => {
    const isResidentDataFilled = Object.values(residentData).every(
      (data) =>
        data?.residentCompletedSession !== undefined &&
        data?.treatmentGoalsAddressed !== undefined &&
        data?.residentParticipation?.length > 0 &&
        data?.residentQuality?.length > 0 &&
        data?.residentAppearance?.length > 0 &&
        data?.residentMood?.length > 0 &&
        data?.residentProgress?.length > 0 &&
        data?.residentResponse?.trim() !== "" &&
        data?.goalsAddressed?.length > 0 &&
        data?.pleaseSpecify?.trim() !== "",
    );
    if (
      (residentId || residentId.length > 0) &&
      date &&
      startTime &&
      endTime &&
      totalDuration &&
      behaviorTech &&
      location &&
      therapyType.length > 0 &&
      (isResidentDataFilled !== undefined || null) &&
      behavioralTechnicianName.length > 0
    ) {
      setIsSubmitEnabled(true);
    } else {
      setIsSubmitEnabled(false);
    }
  };
  const selectHandler = (e, clearAll) => {
    if (clearAll) {
      setTopicId(null);
      setNoteSummary("");
      setPlanRecommendation("");
    } else if (e?.length) {
      const obj = JSON.parse(e);
      setTopicId(obj?._id);
      setNoteSummary(obj?.notesSummary);
      setPlanRecommendation(obj?.planRecommendation);
    }
  };
  useEffect(() => {
    if (searchTopicsQuery?.length === 0) clearAll();
  }, [searchTopicsQuery]);
  function clearAll() {
    setTopicId(null);
    setNoteSummary("");
    setPlanRecommendation("");
  }
  const handleSubmit = async (e, isDraft) => {
    e.preventDefault();
    const payload = {
      residentId: residentId?.map((i) => i.value),
      therapyType,
      date,
      startTime,
      endTime,
      totalDuration,
      behaviorTech,
      location,
      topicId,
      topic: searchTopicsQuery,
      noteSummary,
      planRecommendation,
      pleaseSpecify,
      residentIdData,
      pleaseSpecify1Date: date,
      saveAsDraft: isDraft,
      ...(selectedFacilityId && selectedFacilityId.trim() !== ""
        ? {
            facilityId: [selectedFacilityId],
          }
        : {}),
      behavioralTechnicianSignature,
      behavioralTechnicianDateSigned: technicianDate,
      behavioralTechnicianSignedTime: technicianTime,
      adminSignature,
      adminDateSigned,
      adminSignedTime,
      signers,
      signatures,
    };
    await therapyNotesService.therapySession
      .update(id, payload, { setLoading })
      .then((res) => {
        if (res?.status === 200) {
          navigate(-1);
        }
      });
    return;
  };
  const updateResidentData = (residentId, newData) => {
    setResidentData((prevData) => ({
      ...prevData,
      [residentId]: newData,
    }));
  };
  const pushInResidentData = ({ residentId, key, value }) => {
    setResidentData((prevData) => {
      const newData = {
        ...prevData,
      };
      if (!newData[residentId]) {
        newData[residentId] = {};
      }
      if (Array.isArray(newData[residentId][key])) {
        newData[residentId][key] = newData[residentId][key].includes(value)
          ? newData[residentId][key].filter((item) => item !== value)
          : [...newData[residentId][key], value];
      } else {
        newData[residentId][key] = [value];
      }
      return newData;
    });
  };
  const pushInArr = (value) => {
    let filtered = [];
    const removeItem = (item, arr) => arr?.filter((ele) => ele !== item);
    if (therapyType?.includes(value)) {
      filtered = removeItem(value, therapyType);
    } else {
      filtered = [...therapyType, value];
      if (value === "Group Therapy") {
        filtered = removeItem("Individual Therapy", filtered);
        if (selectedFacilityId && facilityList?.length > 0) {
          const facility = facilityList.find(
            (f) => f._id === selectedFacilityId,
          );
          if (facility) {
            setLocation(facility.location || facility.address || "");
          }
        } else {
          setLocation("");
        }
      }
      if (value === "Individual Therapy") {
        filtered = removeItem("Group Therapy", filtered);
        if (residentId && residentId.length > 0) {
          const selectedRes = residentId[0];
          let addressToSet = selectedRes?.facilityAddress;

          if (!addressToSet && selectedRes?.facilityId) {
            let facility = facilityList?.find(
              (f) => f._id === selectedRes.facilityId,
            );
            if (!facility && facilities?.length > 0) {
              facility = facilities.find(
                (f) => f._id === selectedRes.facilityId,
              );
            }
            if (facility) {
              addressToSet = facility.location || facility.address;
            }
          }

          if (addressToSet) {
            setLocation(addressToSet);
          } else {
            setLocation("");
          }
        } else {
          setLocation("");
        }
      }
      if (value === "In Person") filtered = removeItem("Telehealth", filtered);
      if (value === "Telehealth") filtered = removeItem("In Person", filtered);
    }
    setTheraphyType(filtered);
  };
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
      behavioralTechnicianSignature?.length > 0;
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
      setIsSubmitFormEnabled(true);
    } else {
      setIsSubmitFormEnabled(false);
    }
  }, [
    signers,
    profileInfo.userType,
    profileInfo._id,
    profileInfo.patientsAssigned,
    detail?.data?.employeeId,
    behavioralTechnicianSignature?.length,
  ]);
  useEffect(() => {
    if (!detail?.data) return;
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
        .includes("tn");
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
    detail?.data,
    profileInfo,
    profileInfo?._id,
    profileInfo?.accountType,
    profileInfo?.userPermissions?.edit,
    profileInfo?.userType,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [behavioralTechnicianSignature, adminSignature, id, checkSign]);
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
      // setBehavioralTechnicianSignature(sign)
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
      setTechnicianTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };
  return (
    <>
      {typedGuardDialog}
      <AddSignature
        show={openSigner}
        setValue={
          detail?.data?.employeeId === profileInfo?._id ||
          detail?.data?.employeeId?._id === profileInfo?._id
            ? setBehavioralTechnicianSignature
            : editSignHandler
        }
        setDate={
          detail?.data?.employeeId === profileInfo?._id ||
          detail?.data?.employeeId?._id === profileInfo?._id
            ? setTechnicianDate
            : editDateHandler
        }
        setTime={
          detail?.data?.employeeId === profileInfo?._id ||
          detail?.data?.employeeId?._id === profileInfo?._id
            ? setTechnicianTime
            : editTimeHandler
        }
      />
      <NavWrapper title={"Therapy Progress Notes"} isArrow={true} />

      <Container className="full-width-container">
        <Form
          className={`w-100 text-start ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
          <div className="therapy-notes-multiple-radio-wb mb-3">
            <div className="main">
              <CheckBoxMaker
                setValue={() => pushInArr("Group Therapy")}
                value="Group Therapy"
                id="GroupTherapy"
                label="Group Therapy"
                checked={therapyType?.includes("Group Therapy")}
              />
            </div>

            <div className="main">
              <CheckBoxMaker
                setValue={() => pushInArr("Individual Therapy")}
                value="Individual Therapy"
                id="IndividualTherapy"
                label="Individual Therapy"
                checked={therapyType?.includes("Individual Therapy")}
              />
            </div>
            <div className="main">
              <CheckBoxMaker
                setValue={() => pushInArr("In Person")}
                value="In Person"
                id="InPerson"
                label="In Person"
                checked={therapyType?.includes("In Person")}
              />
            </div>
            <div className="main">
              <CheckBoxMaker
                setValue={() => pushInArr("Telehealth")}
                value="Telehealth"
                id="Telehealth"
                label="Telehealth"
                checked={therapyType?.includes("Telehealth")}
              />
            </div>
          </div>
          {therapyType?.includes("Group Therapy") && (
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Facility</Form.Label>
                    <Form.Select
                      disabled
                      value={selectedFacilityId}
                      onChange={(e) => {
                        const newFacilityId = e.target.value;
                        setSelectedFacilityId(newFacilityId);
                        const selected = facilityList?.find(
                          (f) => f._id === newFacilityId,
                        );
                        if (selected) {
                          setLocation(
                            selected.location || selected.address || "",
                          );
                        } else {
                          setLocation("");
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select facility
                      </option>
                      {facilityList?.map((fac) => (
                        <option key={fac._id} value={fac._id}>
                          {`${fac?.name}`}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
          )}

          <Card body className="mb-3">
            <Form.Group className="mb-1">
              <Form.Label className="fw-bold">Resident’s Name : </Form.Label>
              <Form.Label className="fw-bold mx-2">
                {residentId && residentId?.map((id) => id.label).join(", ")}
              </Form.Label>
            </Form.Group>
          </Card>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Today’s Date</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(date)}
                    onChange={(selectedDate) =>
                      setDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          date ? formatDateToMMDDYYYY(date) : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Start time</Form.Label>

                  <CustomTimePicker
                    use24Hours={hoursFormat === "HH:mm"}
                    value={startTime ? parseTimeStringToDate(startTime) : null}
                    onChange={setStartTime}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">End time</Form.Label>

                  <CustomTimePicker
                    use24Hours={hoursFormat === "HH:mm"}
                    value={endTime ? parseTimeStringToDate(endTime) : null}
                    onChange={setEndTime}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Total Duration</Form.Label>
                  <Form.Control
                    onChange={(e) => setTotalDuration(e.target.value)}
                    value={totalDuration}
                    type="text"
                    placeholder={"hours(Ex. 1hr)"}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Employee/Contractor
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setBehaviorTech(e.target.value)}
                    value={behaviorTech}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Facility Address</Form.Label>
                  <Form.Control
                    disabled
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Topic</Form.Label>
                  <Form.Control
                    type="text"
                    value={searchTopicsQuery}
                    onFocus={() => {
                      const topicsArray = Array.isArray(topic?.data)
                        ? [...topic.data].reverse()
                        : [];
                      setFilteredTopics(topicsArray);
                    }}
                    onBlur={() => {
                      setTimeout(() => setFilteredTopics([]), 500);
                    }}
                    onChange={(e) => {
                      const newQuery = e.target.value;
                      setSearchTopicsQuery(newQuery);
                      setTopicId(null);
                      const topicsArray = Array.isArray(topic?.data)
                        ? [...topic.data].reverse()
                        : [];
                      setFilteredTopics(
                        topicsArray.filter(({ topic }) =>
                          topic.toLowerCase().includes(newQuery),
                        ),
                      );
                      checkAllFields();
                    }}
                    placeholder="Select Topic..."
                  ></Form.Control>
                </Form.Group>
                {filteredTopics?.length > 0 && (
                  <ul className="dropdown_select list-unstyled">
                    {filteredTopics.map((i) => (
                      <li
                        key={i._id}
                        onClick={() => {
                          selectHandler("", true);
                          setTimeout(() => {
                            setSearchTopicsQuery(i.topic);
                            selectHandler(JSON.stringify(i));
                            setFilteredTopics();
                          }, 50);
                        }}
                        className={
                          i._id === topicId ? "selected_topic" : "mb-2"
                        }
                      >
                        {i.topic}
                      </li>
                    ))}
                  </ul>
                )}
              </Col>
            </Row>
          </Card>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Note Summary</Form.Label>
                  <TextEditor value={noteSummary} setValue={setNoteSummary} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Recommendation</Form.Label>
                  <TextEditor
                    value={planRecommendation}
                    setValue={setPlanRecommendation}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
          {residentId?.map((i, index) => (
            <Card body className="mb-3" key={index}>
              <div className="" key={`resident${index}`}>
                <div className="view-details mb-2">
                  <Row>
                    <Col xs={12} sm={12} md={6} lg={4}>
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">RESIDENT NAME : </p>
                        <h5 className="view-value mb-0">{i.label}</h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={4}>
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">AHCCCS ID : </p>
                        <h5 className="view-value mb-0">{i.accessId}</h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Diagnosis (specify if new or continuing) :{" "}
                        </p>
                        <h5 className="view-value mb-0">{i.diagnosis}</h5>
                      </div>
                    </Col>
                  </Row>
                </div>
                <Row>
                  <Col xs={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Resident Completed Therapy Session
                      </Form.Label>
                      <div className="radio-inline">
                        <Form.Check
                          inline
                          name={`residentCompletedSession_${i.value}`}
                          onChange={(value) =>
                            updateResidentData(i.value, {
                              ...residentData[i.value],
                              residentCompletedSession: true,
                            })
                          }
                          value={"true"}
                          id={`residentCompletedSession1_${i.value}`}
                          label={"Yes"}
                          checked={
                            residentData[i.value]?.residentCompletedSession ===
                            true
                          }
                        />
                        <Form.Check
                          inline
                          name={`residentCompletedSession_${i.value}`}
                          onChange={(value) =>
                            updateResidentData(i.value, {
                              ...residentData[i.value],
                              residentCompletedSession: false,
                            })
                          }
                          value={"false"}
                          id={`residentCompletedSession2_${i.value}`}
                          label={"No"}
                          checked={
                            residentData[i.value]?.residentCompletedSession ===
                            false
                          }
                        />
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Were there any treatment goals addressed?
                      </Form.Label>
                      <div className="radio-inline">
                        <Form.Check
                          inline
                          name={`treatmentGoalsAddressed_${i.value}`}
                          onChange={(value) =>
                            updateResidentData(i.value, {
                              ...residentData[i.value],
                              treatmentGoalsAddressed: true,
                            })
                          }
                          value={"true"}
                          id={`treatmentGoalsAddressed1_${i.value}`}
                          label={"Yes"}
                          checked={
                            residentData[i.value]?.treatmentGoalsAddressed ===
                            true
                          }
                        />
                        <Form.Check
                          inline
                          name={`treatmentGoalsAddressed_${i.value}`}
                          onChange={(value) =>
                            updateResidentData(i.value, {
                              ...residentData[i.value],
                              treatmentGoalsAddressed: false,
                            })
                          }
                          value={"false"}
                          id={`treatmentGoalsAddressed2_${i.value}`}
                          label={"No"}
                          checked={
                            residentData[i.value]?.treatmentGoalsAddressed ===
                            false
                          }
                        />
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Resident Participation
                      </Form.Label>
                      <div className="radio-inline">
                        <Form.Check
                          inline
                          name={`residentParticipation_${i.value}`}
                          onChange={(e) =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentParticipation",
                              value: "100",
                            })
                          }
                          value={100}
                          id={`residentParticipation1_${i.value}`}
                          label={"100%"}
                          checked={residentData[
                            i.value
                          ]?.residentParticipation?.includes("100")}
                        />
                        <Form.Check
                          inline
                          name={`residentParticipation_${i.value}`}
                          onChange={(e) =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentParticipation",
                              value: "75",
                            })
                          }
                          value={75}
                          id={`residentParticipation2_${i.value}`}
                          label={"75%"}
                          checked={residentData[
                            i.value
                          ]?.residentParticipation?.includes("75")}
                        />
                        <Form.Check
                          inline
                          name={`residentParticipation_${i.value}`}
                          onChange={(e) =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentParticipation",
                              value: "50",
                            })
                          }
                          value={50}
                          id={`residentParticipation3_${i.value}`}
                          label={"50%"}
                          checked={residentData[
                            i.value
                          ]?.residentParticipation?.includes("50")}
                        />
                        <Form.Check
                          inline
                          name={`residentParticipation_${i.value}`}
                          onChange={(e) =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentParticipation",
                              value: "25",
                            })
                          }
                          value={25}
                          id={`residentParticipation4_${i.value}`}
                          label={"25%"}
                          checked={residentData[
                            i.value
                          ]?.residentParticipation?.includes("25")}
                        />
                        <Form.Check
                          inline
                          name={`residentParticipation_${i.value}`}
                          onChange={(e) =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentParticipation",
                              value: "None",
                            })
                          }
                          value={0}
                          id={`residentParticipationNone_${i.value}`}
                          label={"None"}
                          checked={residentData[
                            i.value
                          ]?.residentParticipation?.includes("None")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentParticipation",
                              value: "Other",
                            })
                          }
                          value="Other"
                          id={`ResidentParticipationOther_${i.value}`}
                          label="Other"
                          checked={residentData[
                            i.value
                          ]?.residentParticipation?.includes("Other")}
                        />
                        {residentData[i.value]?.residentParticipation?.includes(
                          "Other",
                        ) && (
                          <BorderlessInput
                            setState={(value) => {
                              updateResidentData(i.value, {
                                ...residentData[i.value],
                                residentParticipationOther: value,
                              });
                            }}
                            value={
                              residentData[i?.value]?.residentParticipationOther
                            }
                          />
                        )}
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Resident Appearance
                      </Form.Label>
                      <div className="radio-inline">
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentAppearance",
                              value: "Neat",
                            })
                          }
                          value="Neat"
                          id={`ResidentNeat_${i.value}`}
                          label="Neat"
                          checked={residentData[
                            i.value
                          ]?.residentAppearance?.includes("Neat")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentAppearance",
                              value: "Unkept",
                            })
                          }
                          value="Unkept"
                          id={`ResidentUnkept_${i.value}`}
                          label="Unkept"
                          checked={residentData[
                            i.value
                          ]?.residentAppearance?.includes("Unkept")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentAppearance",
                              value: "Inappropriate",
                            })
                          }
                          value="Inappropriate"
                          id={`ResidentInappropriate_${i.value}`}
                          label="Inappropriate"
                          checked={residentData[
                            i.value
                          ]?.residentAppearance?.includes("Inappropriate")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentAppearance",
                              value: "Bizarre",
                            })
                          }
                          value="Bizarre"
                          id={`ResidentBizarre_${i.value}`}
                          label="Bizarre"
                          checked={residentData[
                            i.value
                          ]?.residentAppearance?.includes("Bizarre")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentAppearance",
                              value: "Other",
                            })
                          }
                          value="Other"
                          id={`ResidentAppearanceOther_${i.value}`}
                          label="Other"
                          checked={residentData[
                            i.value
                          ]?.residentAppearance?.includes("Other")}
                        />
                        {residentData[i.value]?.residentAppearance?.includes(
                          "Other",
                        ) && (
                          <BorderlessInput
                            setState={(value) => {
                              updateResidentData(i.value, {
                                ...residentData[i.value],
                                residentAppearanceOther: value,
                              });
                            }}
                            value={
                              residentData[i.value]?.residentAppearanceOther
                            }
                            type="text"
                          />
                        )}
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Resident Mood</Form.Label>
                      <div className="radio-inline">
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentMood",
                              value: "Normal",
                            })
                          }
                          value="Normal"
                          id={`residentMoodNormal_${i.value}`}
                          label="Normal"
                          checked={residentData[
                            i.value
                          ]?.residentMood?.includes("Normal")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentMood",
                              value: "Euthymic",
                            })
                          }
                          value="Euthymic"
                          id={`residentMoodEuthymic_${i.value}`}
                          label="Euthymic"
                          checked={residentData[
                            i.value
                          ]?.residentMood?.includes("Euthymic")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentMood",
                              value: "Anxious",
                            })
                          }
                          value="Anxious"
                          id={`residentMoodAnxious_${i.value}`}
                          label="Anxious"
                          checked={residentData[
                            i.value
                          ]?.residentMood?.includes("Anxious")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentMood",
                              value: "Depressed",
                            })
                          }
                          value="Depressed"
                          id={`residentMoodDepressed_${i.value}`}
                          label="Depressed"
                          checked={residentData[
                            i.value
                          ]?.residentMood?.includes("Depressed")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentMood",
                              value: "Euphoric",
                            })
                          }
                          value="Euphoric"
                          id={`residentMoodEuphoric_${i.value}`}
                          label="Euphoric"
                          checked={residentData[
                            i.value
                          ]?.residentMood?.includes("Euphoric")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentMood",
                              value: "Irritable",
                            })
                          }
                          value="Euphoric"
                          id={`residentMoodIrritable_${i.value}`}
                          label="Irritable"
                          checked={residentData[
                            i.value
                          ]?.residentMood?.includes("Irritable")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentMood",
                              value: "Other",
                            })
                          }
                          value="Other"
                          id={`ResidentMoodOther_${i.value}`}
                          label="Other"
                          checked={residentData[
                            i.value
                          ]?.residentMood?.includes("Other")}
                        />
                        {residentData[i.value]?.residentMood?.includes(
                          "Other",
                        ) && (
                          <BorderlessInput
                            setState={(value) => {
                              updateResidentData(i.value, {
                                ...residentData[i.value],
                                residentMoodOther: value,
                              });
                            }}
                            value={residentData[i?.value]?.residentMoodOther}
                          />
                        )}
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Resident Quality
                      </Form.Label>
                      <div className="radio-inline">
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentQuality",
                              value: "Attentive",
                            })
                          }
                          value="Attentive"
                          id={`residentQuality_Attentive_${i.value}`}
                          label="Attentive"
                          checked={residentData[
                            i.value
                          ]?.residentQuality?.includes("Attentive")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentQuality",
                              value: "Supportive",
                            })
                          }
                          value="Supportive"
                          id={`residentQuality_Supportive_${i.value}`}
                          label="Supportive"
                          checked={residentData[
                            i.value
                          ]?.residentQuality?.includes("Supportive")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentQuality",
                              value: "Sharing",
                            })
                          }
                          value="Sharing"
                          id={`residentQuality_Sharing_${i.value}`}
                          label="Sharing"
                          checked={residentData[
                            i.value
                          ]?.residentQuality?.includes("Sharing")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentQuality",
                              value: "Intrusive",
                            })
                          }
                          value="Intrusive"
                          id={`residentQuality_Intrusive_${i.value}`}
                          label="Intrusive"
                          checked={residentData[
                            i.value
                          ]?.residentQuality?.includes("Intrusive")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentQuality",
                              value: "Resistant",
                            })
                          }
                          value="Resistant"
                          id={`residentQuality_Resistant_${i.value}`}
                          label="Resistant"
                          checked={residentData[
                            i.value
                          ]?.residentQuality?.includes("Resistant")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentQuality",
                              value: "Other",
                            })
                          }
                          value="Other"
                          id={`ResidentQualityOther_${i.value}`}
                          label="Other"
                          checked={residentData[
                            i.value
                          ]?.residentQuality?.includes("Other")}
                        />
                        {residentData[i.value]?.residentQuality?.includes(
                          "Other",
                        ) && (
                          <BorderlessInput
                            setState={(value) => {
                              updateResidentData(i.value, {
                                ...residentData[i.value],
                                residentQualityOther: value,
                              });
                            }}
                            value={residentData[i?.value]?.residentQualityOther}
                          />
                        )}
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Resident Progress
                      </Form.Label>
                      <div className="radio-inline">
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentProgress",
                              value: "Deterioration",
                            })
                          }
                          value="Deterioration"
                          id={`residentProgress_Deterioration_${i.value}`}
                          label="Deterioration"
                          checked={residentData[
                            i.value
                          ]?.residentProgress?.includes("Deterioration")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentProgress",
                              value: "No Progress",
                            })
                          }
                          value="No Progress"
                          id={`residentProgress_No_Progress_${i.value}`}
                          label="No Progress"
                          checked={residentData[
                            i.value
                          ]?.residentProgress?.includes("No Progress")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentProgress",
                              value: "Small Progress",
                            })
                          }
                          value="Small Progress"
                          id={`residentProgress_Small_Progress_${i.value}`}
                          label="Small Progress"
                          checked={residentData[
                            i.value
                          ]?.residentProgress?.includes("Small Progress")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentProgress",
                              value: "Good Progress",
                            })
                          }
                          value="Good Progress"
                          id={`residentProgress_Good_Progress_${i.value}`}
                          label="Good Progress"
                          checked={residentData[
                            i.value
                          ]?.residentProgress?.includes("Good Progress")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentProgress",
                              value: "Goal Achieved",
                            })
                          }
                          value="Goal Achieved"
                          id={`residentProgress_Goal_Achieved_${i.value}`}
                          label="Goal Achieved"
                          checked={residentData[
                            i.value
                          ]?.residentProgress?.includes("Goal Achieved")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "residentProgress",
                              value: "Other",
                            })
                          }
                          value="Other"
                          id={`ResidentProgressOther_${i.value}`}
                          label="Other"
                          checked={residentData[
                            i.value
                          ]?.residentProgress?.includes("Other")}
                        />
                        {residentData[i.value]?.residentProgress?.includes(
                          "Other",
                        ) && (
                          <BorderlessInput
                            setState={(value) => {
                              updateResidentData(i.value, {
                                ...residentData[i.value],
                                residentProgressOther: value,
                              });
                            }}
                            value={
                              residentData[i?.value]?.residentProgressOther
                            }
                          />
                        )}
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Resident Response
                      </Form.Label>
                      <BorderlessInput
                        setState={(value) =>
                          updateResidentData(i.value, {
                            ...residentData[i.value],
                            residentResponse: value,
                          })
                        }
                        value={residentData[i.value]?.residentResponse}
                        type="text"
                        className="ms-2"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Goals addressed
                      </Form.Label>
                      <div className="radio-inline">
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "goalsAddressed",
                              value: "Sobriety",
                            })
                          }
                          value="Sobriety"
                          id={`goalsAddressed_Sobriety_${i.value}`}
                          label="Sobriety"
                          checked={residentData[
                            i.value
                          ]?.goalsAddressed?.includes("Sobriety")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "goalsAddressed",
                              value: "Independent Living Skills",
                            })
                          }
                          value="Independent Living Skills"
                          id={`goalsAddressed_Independent_Living_Skills_${i.value}`}
                          label="Independent Living Skills"
                          checked={residentData[
                            i.value
                          ]?.goalsAddressed?.includes(
                            "Independent Living Skills",
                          )}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "goalsAddressed",
                              value: "Medication",
                            })
                          }
                          value="Medication"
                          id={`goalsAddressed_Medication_${i.value}`}
                          label="Medication"
                          checked={residentData[
                            i.value
                          ]?.goalsAddressed?.includes("Medication")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "goalsAddressed",
                              value: "Safety",
                            })
                          }
                          value="Safety"
                          id={`goalsAddressed_Safety_${i.value}`}
                          label="Safety"
                          checked={residentData[
                            i.value
                          ]?.goalsAddressed?.includes("Safety")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "goalsAddressed",
                              value: "ADLS",
                            })
                          }
                          value="ADLS"
                          id={`goalsAddressed_ADLS_${i.value}`}
                          label="ADLS"
                          checked={residentData[
                            i.value
                          ]?.goalsAddressed?.includes("ADLS")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "goalsAddressed",
                              value: "Managing Mental Health",
                            })
                          }
                          value="Managing Mental Health"
                          id={`goalsAddressed_Managing_Mental_Health_${i.value}`}
                          label="Managing Mental Health"
                          checked={residentData[
                            i.value
                          ]?.goalsAddressed?.includes("Managing Mental Health")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "goalsAddressed",
                              value: "Legal",
                            })
                          }
                          value="Legal"
                          id={`goalsAddressed_Legal_${i.value}`}
                          label="Legal"
                          checked={residentData[
                            i.value
                          ]?.goalsAddressed?.includes("Legal")}
                        />
                        <Form.Check
                          inline
                          onChange={() =>
                            pushInResidentData({
                              residentId: i.value,
                              key: "goalsAddressed",
                              value: "Other",
                            })
                          }
                          value="Other"
                          id={`goalsAddressed_Other_${i.value}`}
                          label="Other"
                          checked={residentData[
                            i.value
                          ]?.goalsAddressed?.includes("Other")}
                        />
                        {residentData[i.value]?.goalsAddressed?.includes(
                          "Other",
                        ) && (
                          <BorderlessInput
                            setState={(value) => {
                              updateResidentData(i.value, {
                                ...residentData[i.value],
                                goalsAddressedOther: value,
                              });
                            }}
                            value={residentData[i?.value]?.goalsAddressedOther}
                          />
                        )}
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Any significant information not specified above?
                      </Form.Label>
                      <div className="radio-inline d-flex align-items-center">
                        <Form.Check
                          inline
                          name={`significantInfoNotSpecifiedAbove${i.value}`}
                          onChange={(value) =>
                            updateResidentData(i.value, {
                              ...residentData[i.value],
                              significantInfoNotSpecifiedAbove1: false,
                              pleaseSpecify: "",
                            })
                          }
                          value={"false"}
                          id={`significantInfoNotSpecifiedAbove2_${i.value}`}
                          label={"No"}
                          checked={
                            residentData[i.value]
                              ?.significantInfoNotSpecifiedAbove1 === false
                          }
                          className="mb-0"
                        />
                        <Form.Check
                          inline
                          name={`significantInfoNotSpecifiedAbove${i.value}`}
                          onChange={(value) =>
                            updateResidentData(i.value, {
                              ...residentData[i.value],
                              significantInfoNotSpecifiedAbove1: true,
                            })
                          }
                          value={"true"}
                          id={`significantInfoNotSpecifiedAbove1_${i.value}`}
                          label={"Yes"}
                          checked={
                            residentData[i.value]
                              ?.significantInfoNotSpecifiedAbove1 === true
                          }
                          className="mb-0"
                        />
                        {residentData[i.value]
                          ?.significantInfoNotSpecifiedAbove1 === true && (
                          <BorderlessInput
                            setState={(value) =>
                              updateResidentData(i.value, {
                                ...residentData[i.value],
                                pleaseSpecify: value,
                              })
                            }
                            value={residentData[i.value]?.pleaseSpecify}
                            type="text"
                          />
                        )}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Card>
          ))}

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
              signerNameOverride={
                residentId?.length > 0
                  ? residentId.map((r) => r.label).join(", ")
                  : ""
              }
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

          <Row>
            <Col xs={12} lg={6}>
              <Button
                type="button"
                className={`theme-button ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                onClick={() => setOpenSigner(true)}
              >
                {" "}
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} lg={6}>
              {signatureFormat({
                sign: behavioralTechnicianSignature,
                date: technicianDate,
                time: technicianTime,
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
            <Col xs={12}>
              <div className="employee-btn-joiner mt-3 mt-md-4">
                {saveAsDraft && (
                  <button
                    className={`employee_create_btn draft ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                  >
                    Save as Draft
                  </button>
                )}
                <button
                  className={`employee_create_btn ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                  type="button"
                  disabled={!isSubmitFormEnabled || witnessIncomplete}
                  onClick={(e) => handleSubmit(e, false)}
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
  Wcomponenet: UpdateTherapyLog,
});
