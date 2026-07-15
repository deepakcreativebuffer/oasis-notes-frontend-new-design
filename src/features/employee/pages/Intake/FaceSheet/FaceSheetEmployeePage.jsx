/* eslint-disable no-unused-vars */
/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { ClipLoader } from "react-spinners";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import {
  AddSignature,
  deletePermission,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import HOC from "@/features/shared/layout/Inner/HOC";
import {
  intakeService,
  patientService,
} from "@/features/shared/services/index";
import "@/features/shared/features/intake/faceSheet/Facesheet.css";
import "@/features/resident/pages/Intake/PatientPanel/FormsUpperbar.css";
import "@/features/shared/features/intake/initialAssessment/InitialAssessment.css";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Table,
} from "react-bootstrap";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import DatePicker from "react-datepicker";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants/index";
import { downloadReport } from "@/utils/index";
const FaceSheet = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const url = useLocation().pathname;
  const [signers, setSigners] = useState([]);
  const [getApiData, setGetApiData] = useState("");
  const [residentName, setResidentName] = useState("");
  const [dob, setDob] = useState("");
  const [dateOfAdmit, setDateOfAdmit] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [facilityAddress, setFacilityAddress] = useState("");
  const [facilityPhoneNumber, setFacilityPhoneNumber] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [race, setRace] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [identifiableMarks, setIdentifiableMarks] = useState("");
  const [primaryLanguage, setPrimaryLanguage] = useState("");
  const [courtOrderedTreatment, setCourtOrderedTreatment] = useState();
  const [familyGuardianEmergencyName, setFamilyGuardianEmergencyName] =
    useState("");
  const [familyGuardianEmergencyContact, setFamilyGuardianEmergencyContact] =
    useState("");
  const [facilityEmergencyContact, setFacilityEmergencyContact] = useState("");
  const [medicationAllergies, setMedicationAllergies] = useState("");
  const [otherAllergies, setOtherAllergies] = useState("");
  const [primaryCareProviderName, setPrimaryCareProviderName] = useState("");
  const [primaryCareProviderContact, setPrimaryCareProviderContact] =
    useState("");
  const [primaryCareProviderAddress, setPrimaryCareProviderAddress] =
    useState("");
  useState("");
  const [primarySpacelistName, setPrimarySpacelistName] = useState("");
  const [primarySpacelistPhone, setPrimarySpacelistPhone] = useState("");
  const [primarySpacelistAddress, setPrimarySpacelistAddress] = useState("");
  const [
    primaryCareProviderOtherSpecialistsArray,
    setPrimaryCareProviderOtherSpecialistsArray,
  ] = useState([]);
  const [preferredHospitalName, setPreferredHospitalName] = useState("");
  const [preferredHospitalPhone, setPreferredHospitalPhone] = useState("");
  const [preferredHospitalAddress, setPreferredHospitalAddress] = useState("");
  const [psychiatricProviderName, setPsychiatricProviderName] = useState("");
  const [psychiatricProviderContact, setPsychiatricProviderContact] =
    useState("");
  const [psychiatricProviderAddress, setPsychiatricProviderAddress] =
    useState("");
  useState("");
  const [psychiatricSpacelistName, setpsychiatricSpacelistName] = useState("");
  const [psychiatricSpacelistPhone, setpsychiatricSpacelistPhone] =
    useState("");
  const [psychiatricSpacelistAddress, setpsychiatricSpacelistAddress] =
    useState("");
  const [
    psychiatricProviderOtherSpecialistsArray,
    setPsychiatricProviderOtherSpecialistsArray,
  ] = useState([]);
  const [healthPlan, setHealthPlan] = useState("");
  const [healthPlanId, setHealthPlanId] = useState("");
  const [openSignModal, setOpenSignModal] = useState(false);
  const [caseManagerName, setCaseManagerName] = useState("");
  const [caseManagerPhone, setCaseManagerPhone] = useState("");
  const [caseManagerEmail, setCaseManagerEmail] = useState("");
  const [
    socialSecurityRepresentativePayeeName,
    setSocialSecurityRepresentativePayeeName,
  ] = useState("");
  const [
    socialSecurityRepresentativePayeePhone,
    setSocialSecurityRepresentativePayeePhone,
  ] = useState("");
  const [
    socialSecurityRepresentativePayeeEmail,
    setSocialSecurityRepresentativePayeeEmail,
  ] = useState("");
  const [mentalHealthDiagnoses, setMentalHealthDiagnoses] = useState("");
  const [medicalDiagnosesHistory, setMedicalDiagnosesHistory] = useState("");
  const [pastSurgeries, setPastSurgeries] = useState("");
  const [signature, setSignature] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [signatureTime, setSegnatureTime] = useState("");
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const componentRef = React.useRef();
  const [patientId, setPatientId] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [userDetail, setUserDetail] = useState("");
  const [adminSignature, setAdminSignature] = useState("");
  const [adminSignatureDate, setAdminSignatureDate] = useState("");
  const [adminSignatureTime, setAdminSignatureTime] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [saveAsDrafIsNotEditable, setSaveAsDrafIsNotEditable] = useState(false);
  const [
    saveAsDrafIsNotEditableWithoutSigner,
    setSaveAsDrafIsNotEditableWithoutSigner,
  ] = useState(false);
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);
  useEffect(() => {
    if (patientId && (url === "/faceSheet" || url === "/create-face-sheet")) {
      intakeService.getFaceSheet({
        patientId,
        setResponse: setGetApiData,
        setLoading,
      });
    }
  }, [patientId, url]);
  useEffect(() => {
    if (id) {
      intakeService.getFaceSheet({ id, setResponse: setGetApiData });
    }
  }, [id]);
  useEffect(() => {
    const item =
      Array.isArray(getApiData?.data) && getApiData?.data.length > 0
        ? getApiData?.data[0]
        : getApiData?.data;
    const pId = item?.patientId?._id || item?.patientId;
    if (pId) {
      patientService.getById(pId, {
        setResponse: (res) => {
          setUserDetail(res);
          setPatientDetail(res?.data || res);
        },
      });
    }
  }, [getApiData]);
  useEffect(() => {
    if (getApiData) {
      let item;
      const isFaceSheetPage =
        url === "/faceSheet" || url === "/create-face-sheet";
      const hasArrayData =
        Array.isArray(getApiData?.data) && getApiData?.data.length > 0;
      const shouldUseFirstItem = isFaceSheetPage && hasArrayData;

      item = shouldUseFirstItem ? getApiData?.data[0] : getApiData?.data;
      if (item) {
        if (!isFaceSheetPage) {
          setDob(item?.patientId?.dateOfBirth);
          setDateOfAdmit(item?.patientId?.admitDate);
          setDiagnosis(item?.patientId?.diagnosis);
          setAhcccsId(item?.patientId?.ahcccsId);
        }
        setResidentName(
          `${item?.patientId?.firstName} ${item?.patientId?.lastName}`,
        );
        setFacilityAddress(item?.facilityAddress);
        setFacilityPhoneNumber(item?.facilityPhoneNumber);
        setPlaceOfBirth(item?.placeOfBirth);
        setEyeColor(item?.eyeColor);
        setRace(item?.race);
        setHeight(item?.height);
        setWeight(item?.weight);
        setHairColor(item?.hairColor);
        setIdentifiableMarks(item?.identifiableMarks);
        if (!isFaceSheetPage) {
          // Fields moved to patientDetail sync
        }
        setFamilyGuardianEmergencyName(item?.familyGuardianEmergencyName);
        setFamilyGuardianEmergencyContact(item?.familyGuardianEmergencyContact);
        setFacilityEmergencyContact(item?.facilityEmergencyContact);
        setMedicationAllergies(item?.medicationAllergies);
        setOtherAllergies(item?.otherAllergies);
        setPrimaryCareProviderName(item?.patientId?.primaryCareProvider);
        setPrimaryCareProviderContact(
          item?.patientId?.primaryCareProviderContact,
        );
        setPrimaryCareProviderAddress(
          item?.patientId?.primaryCareProviderAddress,
        );
        setPrimaryCareProviderOtherSpecialistsArray(
          item?.primaryCareProviderOtherSpecialists
            ? item?.primaryCareProviderOtherSpecialists
            : [],
        );
        setPreferredHospitalName(
          item?.primaryCareProvider?.[0]?.preferredHospitalName,
        );
        setPreferredHospitalPhone(
          item?.primaryCareProvider?.[0]?.preferredHospitalPhone,
        );
        setPreferredHospitalAddress(
          item?.primaryCareProvider?.[0]?.preferredHospitalAddress,
        );
        setPsychiatricProviderName(item?.patientId?.psychiatricProvider);
        setPsychiatricProviderContact(
          item?.patientId?.psychiatricProviderContact,
        );
        setPsychiatricProviderAddress(
          item?.patientId?.psychiatricProviderAddress,
        );
        setPsychiatricProviderOtherSpecialistsArray(
          item?.psychiatricProviderOtherSpecialists
            ? item?.psychiatricProviderOtherSpecialists
            : [],
        );
        if (!isFaceSheetPage) {
          // Fields moved to patientDetail sync
        }
        setCaseManagerName(item?.caseManagerName);
        setCaseManagerPhone(item?.caseManagerPhone);
        setCaseManagerEmail(item?.caseManagerEmail);
        setSocialSecurityRepresentativePayeeName(
          item?.socialSecurityRepresentativePayeeName,
        );
        setSocialSecurityRepresentativePayeePhone(
          item?.socialSecurityRepresentativePayeePhone,
        );
        setSocialSecurityRepresentativePayeeEmail(
          item?.socialSecurityRepresentativePayeeEmail,
        );
        setMentalHealthDiagnoses(item?.mentalHealthDiagnoses);
        setMedicalDiagnosesHistory(item?.medicalDiagnosesHistory);
        if (!isFaceSheetPage) {
          // Fields moved to patientDetail sync
        }
        if (isFaceSheetPage) {
          setSignature("");
          setSignatureDate("");
          setSegnatureTime("");
          setSigners([]);
        } else {
          setSignature(item?.bhpSignature);
          setSignatureDate(item?.bhpDate);
          setSegnatureTime(item?.time);
          setSigners(item?.signers);
          setAdminSignature(item?.adminSignature);
          setAdminSignatureDate(item?.adminSignatureDate);
          setAdminSignatureTime(item?.adminSignatureTime);
        }
      }
    }
  }, [getApiData, url]);
  const handleData = (e) => {
    e.preventDefault();
    const data = {
      patientId: patientId,
      residentName,
      dob,
      dateOfAdmit,
      facilityAddress,
      facilityPhoneNumber,
      placeOfBirth,
      eyeColor,
      race,
      height,
      weight,
      hairColor,
      identifiableMarks,
      primaryLanguage,
      courtOrderedTreatment,
      familyGuardianEmergencyName,
      familyGuardianEmergencyContact,
      facilityEmergencyContact,
      medicationAllergies,
      otherAllergies,
      primaryCareProvider: [
        {
          name: primaryCareProviderName,
          phone: primaryCareProviderContact,
          address: primaryCareProviderAddress,
          preferredHospitalName: preferredHospitalName,
          preferredHospitalPhone: preferredHospitalPhone,
          preferredHospitalAddress: preferredHospitalAddress,
        },
      ],
      primaryCareProviderContact,
      primaryCareProviderAddress,
      primaryCareProviderOtherSpecialists:
        primaryCareProviderOtherSpecialistsArray,
      psychiatricProviderOtherSpecialists:
        psychiatricProviderOtherSpecialistsArray,
      psychiatricProvider: [
        {
          name: psychiatricProviderName,
          phone: psychiatricProviderContact,
          address: psychiatricProviderAddress,
        },
      ],
      psychiatricProviderContact,
      psychiatricProviderAddress,
      caseManagerName,
      caseManagerPhone,
      caseManagerEmail,
      healthPlan,
      healthPlanId,
      socialSecurityRepresentativePayeeName,
      socialSecurityRepresentativePayeePhone,
      socialSecurityRepresentativePayeeEmail,
      mentalHealthDiagnoses,
      medicalDiagnosesHistory,
      pastSurgeries,
      bhpSignature: signature,
      bhpDate: signatureDate,
      time: signatureTime,
      adminSignature,
      adminSignatureDate,
      adminSignatureTime,
      signers: id
        ? signers
        : signers?.map((signer) => ({
            signerId: signer.value,
            name: signer.label,
            signature: "",
            dateSigned: "",
            signedTime: "",
            type: signer.type,
          })),
    };
    if (url === "/faceSheet" || url === "/create-face-sheet") {
      intakeService.faceSheet.create({
        patientId,
        payload: data,
        successMsg: "Face sheet updated !",
        setLoading,
        navigate,
      });
    } else {
      intakeService.faceSheet.update(id, data, { setLoading, navigate });
    }
  };
  const handlePsychiatricArray = () => {
    if (
      psychiatricSpacelistName &&
      psychiatricSpacelistPhone &&
      psychiatricSpacelistAddress
    ) {
      const newData = {
        name: psychiatricSpacelistName,
        phone: psychiatricSpacelistPhone,
        address: psychiatricSpacelistAddress,
      };
      setPsychiatricProviderOtherSpecialistsArray((prev) => [...prev, newData]);
      setpsychiatricSpacelistName("");
      setpsychiatricSpacelistPhone("");
      setpsychiatricSpacelistAddress("");
    }
  };
  const handlePsychiatricArrayDelete = (index) => {
    setPsychiatricProviderOtherSpecialistsArray((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };
  const handlePrimaryCareArray = () => {
    if (
      primarySpacelistName &&
      primarySpacelistPhone &&
      primarySpacelistAddress
    ) {
      const newData = {
        name: primarySpacelistName,
        phone: primarySpacelistPhone,
        address: primarySpacelistAddress,
      };
      setPrimaryCareProviderOtherSpecialistsArray((prev) => [...prev, newData]);
      setPrimarySpacelistName("");
      setPrimarySpacelistPhone("");
      setPrimarySpacelistAddress("");
    }
  };
  const handlePrimaryCareArrayDelete = (index) => {
    setPrimaryCareProviderOtherSpecialistsArray((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        profileInfo,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      patientDetail,
      profileInfo,
    ),
    pageStyle: `
    @page {
      margin: 10mm !important;
    }    
    .card {
      page-break-inside: avoid;
    }
  `,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  useEffect(() => {
    if (Object.keys(patientDetail).length > 0 || getApiData) {
      const isFaceSheetPage =
        url === "/faceSheet" || url === "/create-face-sheet";
      const hasArrayData =
        Array.isArray(getApiData?.data) && getApiData?.data.length > 0;
      const item =
        isFaceSheetPage && hasArrayData
          ? getApiData?.data[0]
          : getApiData?.data;

      setDob(
        patientDetail?.dateOfBirth ||
          item?.patientId?.dateOfBirth ||
          item?.dob ||
          "",
      );
      setDateOfAdmit(
        patientDetail?.admitDate ||
          item?.patientId?.admitDate ||
          item?.dateOfAdmit ||
          "",
      );
      setAhcccsId(
        patientDetail?.ahcccsId ||
          item?.patientId?.ahcccsId ||
          item?.ahcccsId ||
          "",
      );
      setDiagnosis(
        patientDetail?.diagnosis ||
          userDetail?.data?.diagnosis ||
          item?.patientId?.diagnosis ||
          "",
      );
      setPrimaryLanguage(
        patientDetail?.primaryLanguage ||
          patientDetail?.primaryLanguage ||
          item?.primaryLanguage ||
          "",
      );
      const parseBoolean = (val) => {
        if (val === "Yes" || val === "yes" || val === true) return true;
        if (val === "No" || val === "no" || val === false) return false;
        return val;
      };

      setCourtOrderedTreatment(
        patientDetail?.courtOrderedTreatment !== undefined
          ? parseBoolean(patientDetail?.courtOrderedTreatment)
          : parseBoolean(item?.courtOrderedTreatment),
      );
      setHealthPlan(patientDetail?.healthPlan || item?.healthPlan || "");
      setHealthPlanId(patientDetail?.idforPatient || item?.healthPlanId || "");
      setPastSurgeries(
        patientDetail?.pastSurgeries || item?.pastSurgeries || "",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientDetail, userDetail?.data?.ahcccsId, getApiData, url]);
  const checkSign = useCallback(async () => {
    const isSignerFound = signers?.findIndex?.(
      (signer) => signer.signerId === profileInfo._id,
    );
    const hasValidSignature =
      isSignerFound !== -1 && signers?.[isSignerFound]?.signature?.length > 0;
    const isAdmin = profileInfo.userType === ROLES.ADMIN;

    const isEmployeeAssigned =
      getApiData?.data?.employeeId === profileInfo?._id ||
      getApiData?.data?.employeeId?._id === profileInfo?._id;
    const isNewFaceSheetForEmployee =
      !getApiData?.data?.employeeId &&
      (url === "/faceSheet" || url === "/create-face-sheet") &&
      profileInfo?.userType === ROLES.EMPLOYEE;
    const hasEmployeeSignature =
      (isEmployeeAssigned || isNewFaceSheetForEmployee) &&
      signature?.length > 0;

    const guardianIndex = signers?.findIndex?.((signer) =>
      profileInfo.patientsAssigned?.includes(signer.signerId),
    );
    const hasGuardianSignature =
      guardianIndex !== -1 && signers?.[guardianIndex]?.signature?.length > 0;

    const shouldEnableSubmit =
      hasValidSignature ||
      isAdmin ||
      hasEmployeeSignature ||
      hasGuardianSignature;

    setIsSubmitEnabled(shouldEnableSubmit);
  }, [
    signers,
    profileInfo.userType,
    profileInfo._id,
    profileInfo.patientsAssigned,
    getApiData?.data?.employeeId,
    signature?.length,
    url,
  ]);
  useEffect(() => {
    if (!getApiData?.data) return;
    if (getApiData?.data) {
      const { saveAsDraft, signers } = getApiData.data;
      const { _id, userType, accountType, userPermissions } = profileInfo;
      const isSigner = signers?.findIndex?.(
        (signer, i) => signer.signerId === _id,
      );
      const isEmployeeRegular =
        userType === ROLES.EMPLOYEE && accountType === ACCOUNT_TYPES.REGULAR;
      const isEmployeeRestricted =
        userType === ROLES.EMPLOYEE && accountType === ACCOUNT_TYPES.RESTRICTED;
      const cannotEditFs = !(
        typeof userPermissions?.edit === "string"
          ? userPermissions.edit.split(":")
          : []
      ).includes("fs");
      const isSignerFound = isSigner !== -1;
      const isSignerNotFound = isSigner === -1;

      const isRegularSignerWithoutEdit =
        isEmployeeRegular && cannotEditFs && isSignerFound;
      const isRestrictedSigner = isEmployeeRestricted && isSignerFound;
      const isNotEditableSigner =
        isRegularSignerWithoutEdit || isRestrictedSigner;

      const isRegularNonSignerWithoutEdit =
        isEmployeeRegular && cannotEditFs && isSignerNotFound;
      const isRestrictedNonSigner = isEmployeeRestricted && isSignerNotFound;

      const isSaveAsDraftWithSigner = saveAsDraft && isNotEditableSigner;
      setSaveAsDrafIsNotEditable(isSaveAsDraftWithSigner);

      const isSaveAsDraftWithoutSigner =
        saveAsDraft && (isRegularNonSignerWithoutEdit || isRestrictedNonSigner);
      setSaveAsDrafIsNotEditableWithoutSigner(isSaveAsDraftWithoutSigner);

      setIsNotEditableWithSigner(isNotEditableSigner);
    }
  }, [
    getApiData?.data,
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
  }, [signature, adminSignature, id, checkSign]);
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
      setAdminSignatureDate(date);
    }
  };
  const editTimeHandler = (time) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerTime(time);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setSegnatureTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignatureTime(time);
    }
  };
  const canDelete = deletePermission(profileInfo, "fs");

  const isEmployeeCreator = getApiData?.data?.employeeId === profileInfo?._id;
  const isNewFaceSheetForEmployee =
    !getApiData?.data?.employeeId &&
    (url === "/faceSheet" || url === "/create-face-sheet") &&
    profileInfo?.userType === ROLES.EMPLOYEE;
  const shouldSetDirectSignature =
    isEmployeeCreator || isNewFaceSheetForEmployee;

  const isFormDisabled =
    saveAsDrafIsNotEditable ||
    saveAsDrafIsNotEditableWithoutSigner ||
    isNotEditableWithSigner;

  const renderDiagnoses = (title, arr) => {
    let displayArr = arr;
    if (!displayArr || !Array.isArray(displayArr) || displayArr.length === 0) {
      displayArr = [
        { name: "Primary", icdCode: "", description: "" },
        { name: "Secondary", icdCode: "", description: "" },
        { name: "Tertiary", icdCode: "", description: "" },
        { name: "Additional", icdCode: "", description: "" },
        {
          name: "Other",
          isOther: true,
          otherName: "",
          icdCode: "",
          description: "",
        },
      ];
    }

    return (
      <Table responsive="lg" bordered className="mb-0 w-100">
        <thead>
          <tr>
            <th>{title}</th>
            <th>ICD Code</th>
            <th className="w-50">Description</th>
          </tr>
        </thead>
        <tbody>
          {displayArr.map((diag, i) => {
            const isOther = diag.name === "Other" && diag.isOther;
            return (
              <tr key={i}>
                <td>
                  {isOther ? (
                    <div className="d-flex align-items-center">
                      <span className="me-2">Other:</span>
                      <Form.Control
                        type="text"
                        disabled
                        value={diag.otherName || ""}
                      />
                    </div>
                  ) : (
                    <span className="me-2">
                      {diag.name}
                      {diag.name === "Primary" ? "*" : ""}
                    </span>
                  )}
                </td>
                <td>
                  <Form.Control
                    type="text"
                    disabled
                    value={diag.icdCode || ""}
                  />
                </td>
                <td>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    disabled
                    value={diag.description || ""}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      <AddSignature
        show={openSignModal}
        setValue={(sign) =>
          shouldSetDirectSignature ? setSignature(sign) : editSignHandler(sign)
        }
        setDate={(date) =>
          shouldSetDirectSignature
            ? setSignatureDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          shouldSetDirectSignature
            ? setSegnatureTime(time)
            : editTimeHandler(time)
        }
      />
      <div className="facesheet-print" ref={componentRef}>
        <h1 className="pdfTitle mt-3 mb-0 hidden">Face Sheet</h1>
        <Form
          onSubmit={handleData}
          className={`${isFormDisabled ? "pe-none" : ""}`}
        >
          <Container>
            <div className="page-title-bar mb-3 hidePrint">
              <Row className="align-items-center">
                <Col xs={2} lg="3">
                  <div className="d-flex align-items-center">
                    <img
                      onClick={() => navigate(-1)}
                      src="/back_button2.png"
                      alt=""
                      className="arrow cursor-pointer me-1 me-md-3"
                    />
                    <p className="m-0 fw-bold d-none d-md-inline-block">Back</p>
                  </div>
                </Col>
                <Col xs={8} lg="6">
                  <p className="heading mb-sm-0">Face Sheet</p>
                </Col>
                <Col xs={2} lg="3"></Col>
              </Row>
            </div>
            <Row className="mb-2">
              <Col xs={12} md={12} lg={12}>
                {id ? (
                  <>
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        Resident Name:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="residentFullName"
                        placeholder="Type Here"
                        value={residentName}
                        onChange={(e) => setResidentName(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </>
                ) : (
                  <PatientComponent
                    className={"resident-name-facesheet"}
                    MainPatientId={setPatientId}
                    MainResidentName={setResidentName}
                    setWholeData={setPatientDetail}
                  />
                )}
              </Col>
            </Row>
            <Card body className="mb-3">
              <Row>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className={`${!ahcccsId && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      value={ahcccsId}
                      onChange={(e) => setAhcccsId(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className={`${!diagnosis && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Diagnosis (specify if new or continuing)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      placeholder="Type Here....."
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className={`${!dob && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group d-flex flex-column">
                    <Form.Label className="fw-bold">Date of birth</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(dob)}
                      disabled
                      onChange={(selectedDate) =>
                        setDob(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            dob ? formatDateToMMDDYYYY(dob) : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className={`${!dateOfAdmit && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group d-flex flex-column">
                    <Form.Label className="fw-bold">Admit Date</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(dateOfAdmit)}
                      disabled
                      onChange={(selectedDate) =>
                        setDateOfAdmit(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            dateOfAdmit
                              ? formatDateToMMDDYYYY(dateOfAdmit)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Card body className="mb-3">
              <Row>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className={`${!facilityAddress && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Facility Address
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={facilityAddress}
                      placeholder="Type Here....."
                      id="facility-address"
                      onChange={(e) => setFacilityAddress(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className={`${!facilityPhoneNumber && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Facility Phone Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Type Here....."
                      id="AHCCCS"
                      value={facilityPhoneNumber}
                      onChange={(e) => setFacilityPhoneNumber(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className={`${!placeOfBirth && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Place of Birth</Form.Label>
                    <Form.Control
                      type="text"
                      id="AHCCCS"
                      value={placeOfBirth}
                      onChange={(e) => setPlaceOfBirth(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className={`${!eyeColor && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Eye Color</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Type Here....."
                      id="AHCCCS"
                      value={eyeColor}
                      onChange={(e) => setEyeColor(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className={`${!race && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Race</Form.Label>
                    <Form.Control
                      type="text"
                      id="AHCCCS"
                      value={race}
                      placeholder="Type Here....."
                      onChange={(e) => setRace(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className={`${!height && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Height</Form.Label>
                    <Form.Control
                      type="text"
                      value={height}
                      placeholder="Type Here....."
                      onChange={(e) => setHeight(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className={`${!weight && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Weight</Form.Label>
                    <Form.Control
                      type="text"
                      value={weight}
                      placeholder="Type Here....."
                      onChange={(e) => setWeight(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className={`${!hairColor && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Hair Color</Form.Label>
                    <Form.Control
                      type="text"
                      value={hairColor}
                      placeholder="Type Here....."
                      onChange={(e) => setHairColor(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className={`${!identifiableMarks && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Identifiable Marks
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="AHCCCS"
                      value={identifiableMarks}
                      placeholder="Type Here....."
                      onChange={(e) => setIdentifiableMarks(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  className={`${!primaryLanguage && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Primary Language
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="AHCCCS"
                      value={primaryLanguage}
                      placeholder="Type Here....."
                      onChange={(e) => setPrimaryLanguage(e.target.value)}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={6} lg={3}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Court Ordered Treatment?
                    </Form.Label>
                    <div>
                      <span className="show-print-inline hidden">
                        {courtOrderedTreatment ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="hidePrint">
                      <div className="d-flex align-items-center gap-3">
                        <Form.Check className="d-flex align-items-center gap-2">
                          <Form.Check.Input
                            type="checkbox"
                            id="courtOrderedTreatment"
                            onChange={() => setCourtOrderedTreatment(true)}
                            checked={courtOrderedTreatment === true}
                            value={courtOrderedTreatment}
                            disabled
                          />
                          <Form.Check.Label
                            className="form-check-label mb-0 mt-1"
                            htmlFor="courtOrderedTreatment"
                          >
                            {" "}
                            Yes{" "}
                          </Form.Check.Label>
                        </Form.Check>
                        <Form.Check className="d-flex align-items-center gap-2">
                          <Form.Check.Input
                            type="checkbox"
                            id="courtOrderedTreatmentno"
                            value={courtOrderedTreatment}
                            checked={courtOrderedTreatment === false}
                            onChange={(e) => setCourtOrderedTreatment(false)}
                            disabled
                          />
                          <Form.Check.Label
                            className="form-check-label mb-0 mt-1"
                            htmlFor="courtOrderedTreatmentno"
                          >
                            {" "}
                            No{" "}
                          </Form.Check.Label>
                        </Form.Check>
                      </div>
                    </div>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  className={`${!familyGuardianEmergencyName && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Family/Guardian Emergency Name and Contact Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={familyGuardianEmergencyName}
                      placeholder="Type Here....."
                      onChange={(e) =>
                        setFamilyGuardianEmergencyName(e.target.value)
                      }
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  className={`${!facilityEmergencyContact && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Facility Emergency Contact Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={facilityEmergencyContact}
                      placeholder="Type Here....."
                      onChange={(e) =>
                        setFacilityEmergencyContact(e.target.value)
                      }
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} className="mb-3">
                  {(() => {
                    let yes = null;
                    let comment = "";
                    const arr =
                      patientDetail?.allergies ||
                      getApiData?.data?.patientId?.allergies;
                    if (arr && Array.isArray(arr) && arr.length > 0) {
                      const allergy = arr[0];
                      if (allergy) {
                        yes = allergy.yes;
                        comment = allergy.comments || "";
                      }
                    }

                    return (
                      <Table responsive="lg" bordered className="mb-0">
                        <thead>
                          <tr>
                            <th>Condition</th>
                            <th className="text-center">Yes</th>
                            <th className="text-center">No</th>
                            <th className="w-50">Comments</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Allergies</td>
                            <td className="text-center">
                              <Form.Check
                                type="checkbox"
                                checked={yes === true}
                                readOnly
                                disabled
                              />
                            </td>
                            <td className="text-center">
                              <Form.Check
                                type="checkbox"
                                checked={yes === false}
                                readOnly
                                disabled
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                placeholder="_____________"
                                value={comment}
                                readOnly
                                disabled
                              />
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    );
                  })()}
                </Col>
              </Row>
            </Card>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Card body className="mb-3">
                  <Row>
                    <Col
                      xs={12}
                      md={12}
                      lg={12}
                      className={`${!primaryCareProviderName && "hidePrint"}`}
                    >
                      <Row>
                        <Col xs={12} md={4}>
                          <Form.Group className="mb-3 form-print-group-align form-print-group">
                            <Form.Label className="fw-bold">
                              Primary Care Provider Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={primaryCareProviderName}
                              placeholder="Type Here....."
                              disabled
                              onChange={(e) =>
                                setPrimaryCareProviderName(e.target.value)
                              }
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={4}>
                          <Form.Group className="mb-3 form-print-group-align form-print-group">
                            <Form.Label className="fw-bold">
                              Primary Care Provider Contact
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={primaryCareProviderContact}
                              placeholder="Type number....."
                              disabled
                              onChange={(e) =>
                                setPrimaryCareProviderContact(e.target.value)
                              }
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={4}>
                          <Form.Group className="mb-3 form-print-group-align form-print-group">
                            <Form.Label className="fw-bold">
                              Primary Care Provider Address
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={primaryCareProviderAddress}
                              placeholder="Type Here....."
                              disabled
                              onChange={(e) =>
                                setPrimaryCareProviderAddress(e.target.value)
                              }
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
                <Card body className="mb-3">
                  <Form.Label className="fw-bold w-100">
                    Other Specialist - please specify
                  </Form.Label>
                  {primaryCareProviderOtherSpecialistsArray.length > 0 &&
                    primaryCareProviderOtherSpecialistsArray.map(
                      (item, index) => (
                        <>
                          <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <Form.Group className="mb-3 form-print-group-align form-print-group">
                                <Form.Label className="fw-bold">
                                  Name
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={item?.name}
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <Form.Group className="mb-3 form-print-group-align form-print-group">
                                <Form.Label className="fw-bold">
                                  Phone Number
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  value={item?.phone}
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <Form.Group className="mb-3 form-print-group-align form-print-group">
                                <Form.Label className="fw-bold">
                                  Address
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={item?.address}
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                          </Row>
                          {canDelete && (
                            <Row>
                              <Col>
                                <Button
                                  className="hidePrint"
                                  variant="danger"
                                  type="button"
                                  size="sm"
                                  onClick={() =>
                                    handlePrimaryCareArrayDelete(index)
                                  }
                                >
                                  Delete
                                </Button>
                              </Col>
                            </Row>
                          )}
                        </>
                      ),
                    )}
                  <Row className="mt-3">
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Form.Group className="mb-3 form-print-group-align form-print-group">
                        <Form.Label className="fw-bold">Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={primarySpacelistName}
                          placeholder="Type Here....."
                          onChange={(e) =>
                            setPrimarySpacelistName(e.target.value)
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Form.Group className="mb-3 form-print-group-align form-print-group">
                        <Form.Label className="fw-bold">
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={primarySpacelistPhone}
                          placeholder="Type number....."
                          onChange={(e) =>
                            setPrimarySpacelistPhone(e.target.value)
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Form.Group className="mb-3 form-print-group-align form-print-group">
                        <Form.Label className="fw-bold">Address</Form.Label>
                        <Form.Control
                          type="text"
                          value={primarySpacelistAddress}
                          placeholder="Type Here....."
                          onChange={(e) =>
                            setPrimarySpacelistAddress(e.target.value)
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        className="theme-button hidePrint"
                        type="button"
                        size="sm"
                        onClick={handlePrimaryCareArray}
                      >
                        Add
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Card body className="mb-3">
                  <Row>
                    <Col
                      xs={12}
                      md={12}
                      lg={12}
                      className={`${!psychiatricProviderName && "hidePrint"}`}
                    >
                      <Row>
                        <Col xs={12} md={4}>
                          <Form.Group className="mb-3 form-print-group-align form-print-group">
                            <Form.Label className="fw-bold">
                              Psychiatric Provider Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={psychiatricProviderName}
                              placeholder="Type Here....."
                              disabled
                              onChange={(e) =>
                                setPsychiatricProviderName(e.target.value)
                              }
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={4}>
                          <Form.Group className="mb-3 form-print-group-align form-print-group">
                            <Form.Label className="fw-bold">
                              Psychiatric Provider Contact
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={psychiatricProviderContact}
                              placeholder="Type number....."
                              disabled
                              onChange={(e) =>
                                setPsychiatricProviderContact(e.target.value)
                              }
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={4}>
                          <Form.Group className="mb-3 form-print-group-align form-print-group">
                            <Form.Label className="fw-bold">
                              Psychiatric Provider Address
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={psychiatricProviderAddress}
                              placeholder="Type Here....."
                              disabled
                              onChange={(e) =>
                                setPsychiatricProviderAddress(e.target.value)
                              }
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
                <Card body className="mb-3">
                  <Form.Label className="fw-bold w-100">
                    Other Specialist - please specify
                  </Form.Label>
                  {psychiatricProviderOtherSpecialistsArray.length > 0 &&
                    psychiatricProviderOtherSpecialistsArray.map(
                      (item, index) => (
                        <>
                          <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <Form.Group className="mb-3 form-print-group-align form-print-group">
                                <Form.Label className="fw-bold">
                                  Name
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={item?.name}
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <Form.Group className="mb-3 form-print-group-align form-print-group">
                                <Form.Label className="fw-bold">
                                  Phone Number
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  value={item?.phone}
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <Form.Group className="mb-3 form-print-group-align form-print-group">
                                <Form.Label className="fw-bold">
                                  Address
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={item?.address}
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                          </Row>
                          {canDelete && (
                            <Row>
                              <Col>
                                <Button
                                  className="hidePrint"
                                  variant="danger"
                                  type="button"
                                  size="sm"
                                  onClick={() =>
                                    handlePsychiatricArrayDelete(index)
                                  }
                                >
                                  Delete
                                </Button>
                              </Col>
                            </Row>
                          )}
                        </>
                      ),
                    )}
                  <Row className="mt-3">
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Form.Group className="mb-3 form-print-group-align form-print-group">
                        <Form.Label className="fw-bold">Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={psychiatricSpacelistName}
                          placeholder="Type Here....."
                          onChange={(e) =>
                            setpsychiatricSpacelistName(e.target.value)
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Form.Group className="mb-3 form-print-group-align form-print-group">
                        <Form.Label className="fw-bold">
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={psychiatricSpacelistPhone}
                          placeholder="Type number....."
                          onChange={(e) =>
                            setpsychiatricSpacelistPhone(e.target.value)
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Form.Group className="mb-3 form-print-group-align form-print-group">
                        <Form.Label className="fw-bold">Address</Form.Label>
                        <Form.Control
                          type="text"
                          value={psychiatricSpacelistAddress}
                          placeholder="Type Here....."
                          onChange={(e) =>
                            setpsychiatricSpacelistAddress(e.target.value)
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        className="theme-button hidePrint"
                        type="button"
                        size="sm"
                        onClick={handlePsychiatricArray}
                      >
                        Add
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <Card body className="mb-3">
              <Row>
                <Col
                  xs={12}
                  sm={6}
                  md={12}
                  lg={6}
                  className={`${!preferredHospitalName && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Preferred Hospital
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={preferredHospitalName}
                      placeholder="Type Here....."
                      onChange={(e) => setPreferredHospitalName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={12}
                  lg={6}
                  className={`${!preferredHospitalPhone && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Phone Number</Form.Label>
                    <Form.Control
                      type="number"
                      value={preferredHospitalPhone}
                      placeholder="Type Here....."
                      onChange={(e) =>
                        setPreferredHospitalPhone(e.target.value)
                      }
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={12}
                  lg={12}
                  className={`${!preferredHospitalPhone && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Preferred Hospital Address
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={preferredHospitalAddress}
                      placeholder="Type Here....."
                      onChange={(e) =>
                        setPreferredHospitalAddress(e.target.value)
                      }
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Card body className="mb-3">
              <Row>
                <Col
                  xs={12}
                  sm={6}
                  md={12}
                  lg={6}
                  className={`${!healthPlan && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Health Plan</Form.Label>
                    <Form.Control
                      type="text"
                      value={healthPlan}
                      placeholder="Type Here....."
                      onChange={(e) => setHealthPlan(e.target.value)}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={12}
                  lg={6}
                  className={`${!healthPlanId && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">ID #</Form.Label>
                    <Form.Control
                      type="text"
                      value={healthPlanId}
                      placeholder="Type Here....."
                      onChange={(e) => setHealthPlanId(e.target.value)}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={4}
                  className={`${!caseManagerName && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Case Manager</Form.Label>
                    <Form.Control
                      type="text"
                      value={caseManagerName}
                      placeholder="Type Here....."
                      onChange={(e) => setCaseManagerName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  className={`${!caseManagerPhone && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={caseManagerPhone}
                      placeholder="Type Here....."
                      onChange={(e) => setCaseManagerPhone(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  className={`${!caseManagerEmail && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">E-Mail</Form.Label>
                    <Form.Control
                      type="email"
                      value={caseManagerEmail}
                      placeholder="Type Here....."
                      onChange={(e) => setCaseManagerEmail(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={4}
                  className={`${!socialSecurityRepresentativePayeeName && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Social Security Representative Payee
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={socialSecurityRepresentativePayeeName}
                      placeholder="Type Here....."
                      onChange={(e) =>
                        setSocialSecurityRepresentativePayeeName(e.target.value)
                      }
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  className={`${!socialSecurityRepresentativePayeePhone && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={socialSecurityRepresentativePayeePhone}
                      placeholder="Type Here....."
                      onChange={(e) =>
                        setSocialSecurityRepresentativePayeePhone(
                          e.target.value,
                        )
                      }
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  className={`${!socialSecurityRepresentativePayeeEmail && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">E-Mail</Form.Label>
                    <Form.Control
                      type="email"
                      value={socialSecurityRepresentativePayeeEmail}
                      placeholder="Type Here....."
                      onChange={(e) =>
                        setSocialSecurityRepresentativePayeeEmail(
                          e.target.value,
                        )
                      }
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Card body className="mb-3">
              <Row>
                <Col md={12} className="mt-4 mb-3 px-0">
                  {renderDiagnoses(
                    "Mental Health Diagnoses",
                    patientDetail?.psychiatricDiagnoses ||
                      patientDetail?.psychiatricDiagnosesArray ||
                      (Array.isArray(getApiData?.data)
                        ? getApiData?.data[0]
                        : getApiData?.data
                      )?.patientId?.psychiatricDiagnoses ||
                      (Array.isArray(getApiData?.data)
                        ? getApiData?.data[0]
                        : getApiData?.data
                      )?.patientId?.psychiatricDiagnosesArray ||
                      (Array.isArray(getApiData?.data)
                        ? getApiData?.data[0]
                        : getApiData?.data
                      )?.psychiatricDiagnoses,
                  )}
                </Col>
                <Col md={12} className="mt-2 mb-4 px-0">
                  {renderDiagnoses(
                    "Medical Diagnoses",
                    patientDetail?.medicalDiagnoses ||
                      patientDetail?.medicalDiagnosesArray ||
                      (Array.isArray(getApiData?.data)
                        ? getApiData?.data[0]
                        : getApiData?.data
                      )?.patientId?.medicalDiagnoses ||
                      (Array.isArray(getApiData?.data)
                        ? getApiData?.data[0]
                        : getApiData?.data
                      )?.patientId?.medicalDiagnosesArray ||
                      (Array.isArray(getApiData?.data)
                        ? getApiData?.data[0]
                        : getApiData?.data
                      )?.medicalDiagnoses,
                  )}
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  className={`${!pastSurgeries && "hidePrint"}`}
                >
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Past Surgeries</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={pastSurgeries}
                      placeholder="Type Here....."
                      onChange={(e) => setPastSurgeries(e.target.value)}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card>

            <Row>
              <Col xs={12} lg={6}>
                <div className="hidePrint">
                  <Button
                    type="button"
                    className={`theme-button me-2 ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                    onClick={() => setOpenSignModal(true)}
                  >
                    SAVED AND SIGNED
                  </Button>
                </div>
              </Col>
              <Col xs={12} lg={6}>
                <p className="text-end mb-0">
                  {signatureFormat({
                    sign: signature,
                    date: signatureDate,
                    time: signatureTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: adminSignature,
                    date: adminSignatureDate,
                    time: adminSignatureTime,
                    hoursFormat,
                  })}
                </p>
                <p className="text-end mb-0">
                  {signers?.map(
                    (signer) =>
                      signer.signature && (
                        <div key={signer.signerId}>
                          {signatureFormat({
                            sign: signer.signature,
                            date: signer.dateSigned,
                            time: signer.signedTime,
                            hoursFormat,
                          })}
                        </div>
                      ),
                  )}
                </p>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={12}>
                {!id && (
                  <div className="hidePrint">
                    <Form.Label className="fw-bold">Signers:</Form.Label>
                    <MultiEmployee
                      alsoResident
                      setValue={setSigners}
                      value={signers}
                    />
                  </div>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className="employee_btn_div hidePrint">
                  <button
                    className={`employee_create_btn ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                    type="submit"
                    disabled={
                      id
                        ? !isSubmitEnabled
                        : profileInfo?.userType === ROLES.ADMIN
                          ? false
                          : signature?.length === 0
                    }
                  >
                    {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}{" "}
                  </button>
                </div>
              </Col>
            </Row>
          </Container>
        </Form>
      </div>
    </>
  );
};
function DateInput({ value, onChange, id }) {
  return (
    <>
      <input className="show-print-inline hidden" type="text" value={value} />
      <input
        type="date"
        id={id}
        className="hidePrint"
        value={value}
        placeholder="DD/MM/YYYY"
        onChange={onChange}
      />
    </>
  );
}
export default HOC({
  Wcomponenet: FaceSheet,
});
