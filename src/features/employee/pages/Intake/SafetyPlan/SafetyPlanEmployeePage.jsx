/* eslint-disable no-unused-vars */
/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "@/features/shared/ui/Search/Search";
import { AiFillDelete } from "react-icons/ai";
import {
  intakeService,
  patientService,
} from "@/features/shared/services/index";
import {
  AddSignature,
  deletePermission,
  formatDateToMMDDYYYY,
} from "@/utils/utils";
import HOC from "@/features/shared/layout/Inner/HOC";
import { signatureFormat } from "@/utils/utils";
import { ClipLoader } from "react-spinners";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import "@/features/resident/pages/Intake/FaceSheet/Facesheet.css";
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
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
const SafetyPlan = () => {
  const navigate = useNavigate();
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const url = useLocation().pathname;
  const [getApiData, setGetApiData] = useState("");
  const [showSingIn, setShowSingIn] = useState(false);
  const [userDetail, setUserDetail] = useState("");
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [warning1, setWarning1] = useState("");
  const [warning2, setWarning2] = useState("");
  const [warning3, setWarning3] = useState("");
  const [internalCopy1, setInernalCopy1] = useState("");
  const [internalCopy2, setInernalCopy2] = useState("");
  const [internalCopy3, setInernalCopy3] = useState("");
  const [socialName, setSocialName] = useState("");
  const [socialPhone, setSocialPhone] = useState("");
  const [socialRelationship, setSocialRelationship] = useState("");
  const [socialName1, setSocialName1] = useState("");
  const [socialPhone1, setSocialPhone1] = useState("");
  const [socialRelationship1, setSocialRelationship1] = useState("");
  const [address, setAdress] = useState("");
  const [place, setPlace] = useState("");
  const [helpName, setHelpName] = useState("");
  const [helpPhone, setHelpPhone] = useState("");
  const [helpRelationship, setHelpRelationship] = useState("");
  const [helpArray, setHelpArray] = useState([]);
  const [professionalsClinicianName, setProfessionalsClinicianName] =
    useState("");
  const [professionalsPhone, setProfessionalsPhone] = useState("");
  const [professionalsRelationship, setProfessionalsRelationship] =
    useState("");
  const [crisisName, setCrisisName] = useState("");
  const [crisisPhone, setCrisisPhone] = useState("");
  const [crisisRelationship, setCrisisRelationship] = useState("");
  const [crisisName1, setCrisisName1] = useState("");
  const [crisisPhone1, setCrisisPhone1] = useState("");
  const [crisisRelationship1, setCrisisRelationship1] = useState("");
  const [enviromentAdress, setEnviromentAdress] = useState([]);
  const [singin, setSingIn] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [signatureTime, setSignatureTime] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [signers, setSigners] = useState([]);
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
  const [internalCopies, setInternalCopies] = useState(["", "", ""]);
  const [warnings, setWarnings] = useState(["", "", ""]);

  const {
    signatures,
    updateSignature,
    loadFromApi: loadSignaturesFromApi,
  } = useSignatures();
  const { guardTyped, dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });

  const hasTypedInForm = !!singin || !!adminSignature;
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
    setSingIn("");
    setSignatureDate("");
    setSignatureTime("");
    setAdminSignature("");
    setAdminSignatureDate("");
    setAdminSignatureTime("");
  };
  useEffect(() => {
    if (getApiData) {
      let item;
      if (
        Array.isArray(getApiData?.data) &&
        getApiData?.data.length > 0 &&
        url === "/safety-plan"
      ) {
        item = getApiData?.data[0];
      } else {
        item = getApiData?.data;
      }
      if (item) {
        if (id) {
          setPatientId(item?.patientId);
        }
        if (item?.internalCopingStrategies?.length > 0) {
          const strategy = item.internalCopingStrategies[0];
          setInternalCopies([
            strategy.internalCopy1 || "",
            strategy.internalCopy2 || "",
            strategy.internalCopy3 || "",
          ]);
        }
        if (item?.warningSigns?.length > 0) {
          const strategy = item.warningSigns[0];
          setWarnings([
            strategy.warning1 || "",
            strategy.warning2 || "",
            strategy.warning3 || "",
          ]);
        }
        setSocialName(item?.distractionsPeople?.[0]?.name);
        setSocialPhone(item?.distractionsPeople?.[0]?.phone);
        setSocialRelationship(item?.distractionsPeople?.[0]?.relationship);
        setSocialName1(item?.distractionsPeople?.[1]?.name);
        setSocialPhone1(item?.distractionsPeople?.[1]?.phone);
        setSocialRelationship1(item?.distractionsPeople?.[1]?.relationship);
        setAdress(item?.distractionsPlace);
        setPlace(item?.distractionsPlane);
        setHelpName("");
        setHelpPhone("");
        setHelpRelationship("");
        setHelpArray(item?.helpContactsPeople ? item?.helpContactsPeople : []);
        setProfessionalsClinicianName(item?.professionalsClinicianName);
        setProfessionalsPhone(item?.professionalsPhone);
        setCrisisName(item?.professionals?.[0]?.clinicianName);
        setCrisisPhone(item?.professionals?.[0]?.phone);
        setCrisisRelationship(item?.professionals?.[0]?.relationship);
        setCrisisName1(item?.professionals?.[1]?.clinicianName);
        setCrisisPhone1(item?.professionals?.[1]?.phone);
        setCrisisRelationship1(item?.professionals?.[1]?.relationship);
        setEnviromentAdress(
          item?.environmentSafetyMedications
            ? item.environmentSafetyMedications.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        if (url === "/safety-plan") {
          setSignatureTime("");
          setSigners([]);
        } else {
          setSignatureTime(item?.signatureTime);
          setSigners(item?.signers);
          setSingIn(item?.signature);
          setSignatureDate(new Date(item?.signatureDate));
          setAdminSignature(item?.adminSignature);
          setAdminSignatureDate(item?.adminSignatureDate);
          setAdminSignatureTime(item?.adminSignatureTime);
          if (item?.signatures) {
            loadSignaturesFromApi(item.signatures);
          }
        }
      }
    }
  }, [getApiData, id, url, loadSignaturesFromApi]);
  useEffect(() => {
    if (patientId && url === "/safety-plan") {
      intakeService.getSafetyPlan({
        patientId,
        setResponse: setGetApiData,
        setLoading,
      });
    }
  }, [patientId, url]);
  useEffect(() => {
    if (id) {
      intakeService.getSafetyPlan({ id, setResponse: setGetApiData });
    }
  }, [id]);
  useEffect(() => {
    const patientId =
      getApiData?.data?.patientId?._id || getApiData?.data?.patientId;
    if (patientId && !userDetail) {
      patientService.getById(patientId, { setResponse: setUserDetail });
    }
  }, [getApiData, userDetail]);
  useEffect(() => {
    if (userDetail) {
      const detail = userDetail?.data;
      setUserId(detail?._id);
      setUser(`${detail?.firstName} ${detail?.lastName}`);
      setDate(detail?.dateOfBirth);
    }
  }, [userDetail]);
  useEffect(() => {
    if (patientDetail || userDetail) {
      setDate(
        patientDetail?.dateOfBirth
          ? patientDetail?.dateOfBirth
          : userDetail?.data?.dateOfBirth,
      );
      setAhcccsId(
        patientDetail?.ahcccsId
          ? patientDetail?.ahcccsId
          : userDetail?.data?.ahcccsId,
      );
      setDiagnosis(
        patientDetail?.diagnosis
          ? patientDetail?.diagnosis
          : userDetail?.data?.diagnosis,
      );
    }
  }, [patientDetail, userDetail]);
  const handlePost = (e) => {
    e.preventDefault();
    const enviromentAdressArray = [];
    for (let i = 0; i < enviromentAdress.length; i++) {
      enviromentAdressArray.push(enviromentAdress[i].value);
    }
    const data = {
      patientId: patientId,
      residentName: id ? user : residentName,
      date: date,
      warningSigns: [
        {
          warning1: warnings[0],
          warning2: warnings[1],
          warning3: warnings[2],
        },
      ],
      internalCopingStrategies: [
        {
          internalCopy1: internalCopies[0],
          internalCopy2: internalCopies[1],
          internalCopy3: internalCopies[2],
        },
      ],
      distractionsPeople: [
        {
          name: socialName,
          phone: socialPhone,
          relationship: socialRelationship,
        },
        {
          name: socialName1,
          phone: socialPhone1,
          relationship: socialRelationship1,
        },
      ],
      distractionsPlace: address,
      distractionsPlane: place,
      helpContactsPeople: helpArray,
      professionalsClinicianName,
      professionalsPhone,
      professionalsRelationship,
      professionals: [
        {
          clinicianName: crisisName,
          phone: crisisPhone,
          relationship: crisisRelationship,
        },
        {
          clinicianName: crisisName1,
          phone: crisisPhone1,
          relationship: crisisRelationship1,
        },
      ],
      environmentSafetyMedications: enviromentAdressArray,
      signature: singin,
      signatureDate,
      signatureTime,
      adminSignature,
      adminSignatureDate,
      adminSignatureTime,
      signatures,
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
    if (url === "/safety-plan") {
      intakeService.safetyPlan.create({
        patientId,
        payload: data,
        setLoading,
        successMsg: "Success !",
        navigate,
      });
    } else {
      intakeService.safetyPlan.update(id, data, { setLoading, navigate });
    }
  };
  const handleHelpArray = () => {
    if (helpName || helpPhone || helpRelationship) {
      const newContact = {
        name: helpName,
        phone: helpPhone,
        relationship: helpRelationship,
      };
      setHelpArray((prev) => [...prev, newContact]);
      setHelpName("");
      setHelpPhone("");
      setHelpRelationship("");
    }
  };
  const handleDeleteArray = (index) => {
    setHelpArray((prev) => [...prev.filter((_, i) => i !== index)]);
  };
  const enviromentAdressOptions = [
    {
      label:
        "No prescribed medications or OTC medications to be kept in person",
      value:
        "No prescribed medications or OTC medications to be kept in person",
    },
    {
      label:
        "No firearms allowed, no sharp object such as razor, scissor, knife, needle, nail, etc  to be kept in person",
      value:
        "No firearms allowed, no sharp object such as razor, scissor, knife, needle, nail, etc to be kept in person",
    },
    {
      label: "No drugs or alcohol",
      value: "No drugs or alcohol",
    },
    {
      label: "No long strings or rope allowed",
      value: "No long strings or rope allowed",
    },
  ];
  const handleKeySelectedValueSpecialPrecautions = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();
      const optionExists = enviromentAdressOptions.some(
        (option) => option.value === inputValue,
      );
      if (!optionExists) {
        const newOptions = [
          ...enviromentAdressOptions,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setEnviromentAdress(newOptions);
        const newSelectedValues = [
          ...enviromentAdress,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setEnviromentAdress(newSelectedValues);
      }
      event.target.value = "";
    }
  };
  const enviromentAdresshandler = (optionValue) => {
    setEnviromentAdress(optionValue);
  };
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        profileInfo,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      userDetail?.data,
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
  const checkSign = useCallback(async () => {
    let signerIndex = signers?.findIndex?.(
      (signer, i) => signer.signerId === profileInfo._id,
    );
    let isSignerValid =
      signerIndex !== -1 && signers?.[signerIndex]?.signature?.length > 0;
    let isAdminConditionValid = profileInfo.userType === ROLES.ADMIN;
    let isEmployeeConditionValid =
      (getApiData?.data?.employeeId === profileInfo?._id ||
        getApiData?.data?.employeeId?._id === profileInfo?._id) &&
      singin?.length > 0;
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
    getApiData?.data?.employeeId,
    singin?.length,
    hasAnyPenSig,
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
      const cannotEditDocument = !userPermissions?.edit
        ?.split(":")
        .includes("sp");
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
  }, [singin, adminSignature, id, checkSign, hasAnyPenSig]);
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
      setSignatureTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignatureTime(time);
    }
  };
  const canDelete = deletePermission(profileInfo, "sp");
  const handleInternalCopyChange = (index, value) => {
    const updatedCopies = [...internalCopies];
    updatedCopies[index] = value;
    setInternalCopies(updatedCopies);
  };
  const handleWarningsChange = (index, value) => {
    const updatedCopies = [...warnings];
    updatedCopies[index] = value;
    setWarnings(updatedCopies);
  };
  return (
    <>
      {typedGuardDialog}
      <AddSignature
        show={showSingIn}
        setValue={(sign) =>
          getApiData?.data?.employeeId === profileInfo?._id ||
          (!getApiData?.data?.employeeId &&
            url === "/safety-plan" &&
            profileInfo?.userType === ROLES.EMPLOYEE)
            ? setSingIn(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          getApiData?.data?.employeeId === profileInfo?._id ||
          (!getApiData?.data?.employeeId &&
            url === "/safety-plan" &&
            profileInfo?.userType === ROLES.EMPLOYEE)
            ? setSignatureDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          getApiData?.data?.employeeId === profileInfo?._id ||
          (!getApiData?.data?.employeeId &&
            url === "/safety-plan" &&
            profileInfo?.userType === ROLES.EMPLOYEE)
            ? setSignatureTime(time)
            : editTimeHandler(time)
        }
      />
      <div className="safety-plan w-full" ref={componentRef}>
        <Container>
          <div className="page-title-bar hidePrint mb-3">
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
                <p className="heading mb-sm-0">Safety Plan</p>
              </Col>
              <Col xs={2} lg="3"></Col>
            </Row>
          </div>
          <h1 className="pdfTitle hidden">Safety Plan</h1>
          <Form
            className={`form-safety-plan  ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Row className="mb-2">
              <Col xs={12} md={12} lg={12}>
                {id ? (
                  <>
                    <Card body className="mb-2 print-shadow-none">
                      <Form.Group className={"resident-name-print w-100"}>
                        <Form.Label
                          className="fw-bold increse-size flex-shrink-0"
                          htmlFor="residentFullName"
                        >
                          Resident Name :
                        </Form.Label>
                        <Form.Control
                          type="text"
                          required
                          id="residentFullName"
                          placeholder="Enter full name"
                          value={user}
                          className="fw-bold increse-size"
                        />
                      </Form.Group>
                    </Card>
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
                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
                    <Form.Control
                      type="text"
                      id="ahcccsId"
                      disabled
                      value={ahcccsId}
                      required
                      onChange={(e) => setAhcccsId(e?.target?.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">Date of Birth</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(date)}
                      disabled
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
                <Col xs={12} sm={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Diagnosis (specify if new or continuing)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      id="diagnosis"
                      value={diagnosis}
                      required
                      onChange={(e) => setDiagnosis(e?.target?.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card>

            <Form.Label className="fw-bold">
              {" "}
              <span className="text-[#0C5C75]">STEP 1 :</span> Warning Signs{" "}
              <span className="text-[#000000B2]">
                ( thoughts, images, mood, situation, behavior )
              </span>{" "}
              that a crisis may be developing :
            </Form.Label>
            <Card body className="mb-3">
              {warnings.map((copy, index) => (
                <Row key={index} className="my-2">
                  <Col xs={2} lg="1">
                    <Form.Label className="fw-bold">{index + 1}</Form.Label>
                  </Col>
                  <Col xs={10} lg="11">
                    <Form.Control
                      value={copy}
                      required
                      onChange={(e) =>
                        handleWarningsChange(index, e.target.value)
                      }
                    />
                  </Col>
                </Row>
              ))}
            </Card>

            <Form.Label className="fw-bold w-100">
              {" "}
              <span className="text-[#0C5C75]">STEP 2 :</span> Internal Coping
              Strategies :
            </Form.Label>
            <Form.Label className="w-100">
              Things I can do to take my mind off my problems without contacting
              other Person :
            </Form.Label>
            <Card body className="mb-3">
              {internalCopies.map((copy, index) => (
                <Row key={index} className="my-2">
                  <Col xs={2} lg="1">
                    <Form.Label className="fw-bold">{index + 1}</Form.Label>
                  </Col>
                  <Col xs={10} lg="11">
                    <Form.Control
                      value={copy}
                      required
                      onChange={(e) =>
                        handleInternalCopyChange(index, e.target.value)
                      }
                    />
                  </Col>
                </Row>
              ))}
            </Card>

            <Form.Label className="fw-bold">
              {" "}
              <span className="text-[#0C5C75]">STEP 3 :</span> People & Social
              settings that provide Distraction :
            </Form.Label>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={socialName}
                      placeholder="Enter name"
                      onChange={(e) => setSocialName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={socialPhone}
                      placeholder="Enter number"
                      onChange={(e) => setSocialPhone(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Relationship</Form.Label>
                    <Form.Control
                      type="text"
                      value={socialRelationship}
                      placeholder="Enter text"
                      onChange={(e) => setSocialRelationship(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={socialName1}
                      placeholder="Enter name"
                      onChange={(e) => setSocialName1(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={socialPhone1}
                      placeholder="Enter number"
                      onChange={(e) => setSocialPhone1(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Relationship</Form.Label>
                    <Form.Control
                      type="text"
                      value={socialRelationship1}
                      placeholder="Enter text"
                      onChange={(e) => setSocialRelationship1(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Place</Form.Label>
                    <Form.Control
                      value={address}
                      placeholder="Enter Address"
                      required
                      onChange={(e) => setAdress(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Plane</Form.Label>
                    <Form.Control
                      value={place}
                      placeholder="Enter Address"
                      required
                      onChange={(e) => setPlace(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card>

            <Form.Label className="fw-bold">
              {" "}
              <span className="text-[#0C5C75]">STEP 4 :</span> People whom I can
              ask for Help :
            </Form.Label>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} sm={6} md={4} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Name</Form.Label>
                    <Form.Control
                      type="text"
                      id="AHCCCS"
                      value={helpName}
                      placeholder="Enter name"
                      onChange={(e) => setHelpName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={4} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      id="AHCCCS"
                      value={helpPhone}
                      placeholder="Enter number"
                      onChange={(e) => {
                        const value = e.target.value?.trim();
                        if (/^(|\d[\d-]*)$/.test(value)) {
                          setHelpPhone(value);
                        }
                      }}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={4} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Relationship</Form.Label>
                    <Form.Control
                      type="text"
                      id="AHCCCS"
                      value={helpRelationship}
                      placeholder="Enter text"
                      onChange={(e) => setHelpRelationship(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card>

            <Row>
              <Col xs={12}>
                <div className="hidePrint text-center mb-3">
                  <Button
                    type="button"
                    className="theme-button"
                    onClick={handleHelpArray}
                  >
                    Add
                  </Button>
                </div>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                {helpArray.length > 0 && (
                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Relationship</th>
                        {canDelete && <th className="hidePrint">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {helpArray?.map((i, index) => (
                        <tr key={index}>
                          <td>{` ${i.name}`} </td>
                          <td>{` ${i.phone}`} </td>
                          <td>{` ${i.relationship}`} </td>
                          {canDelete && (
                            <td className="hidePrint">
                              <div className="iocn-joiner">
                                <Link
                                  className="del-btn"
                                  onClick={() => handleDeleteArray(index)}
                                >
                                  <AiFillDelete />
                                </Link>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Col>
            </Row>

            <Form.Label className="fw-bold">
              {" "}
              Professionals or agencies I can contact during Crisis :
            </Form.Label>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Clinician/Facility Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={professionalsClinicianName}
                      placeholder="Enter name"
                      onChange={(e) =>
                        setProfessionalsClinicianName(e.target.value)
                      }
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={professionalsPhone}
                      placeholder="Enter number"
                      onChange={(e) => setProfessionalsPhone(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Clinician Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={crisisName}
                      placeholder="Enter name"
                      onChange={(e) => setCrisisName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={crisisPhone}
                      placeholder="Enter name"
                      onChange={(e) => setCrisisPhone(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Relationship</Form.Label>
                    <Form.Control
                      type="text"
                      value={crisisRelationship}
                      placeholder="Enter text"
                      onChange={(e) => setCrisisRelationship(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Clinician Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={crisisName1}
                      placeholder="Enter name"
                      onChange={(e) => setCrisisName1(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={crisisPhone1}
                      placeholder="Enter name"
                      onChange={(e) => setCrisisPhone1(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Relationship</Form.Label>
                    <Form.Control
                      type="text"
                      value={crisisRelationship1}
                      placeholder="Enter text"
                      onChange={(e) => setCrisisRelationship1(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Row className="my-2">
              <Col xs={12}>
                <Form.Label className="fw-bold">
                  {" "}
                  Suicide Prevention Lifeline :{" "}
                  <span className="font-medium text-[red]">
                    1-800-273-TALK(8255)/988
                  </span>
                </Form.Label>
              </Col>
              <Col xs={12}>
                <Form.Label className="fw-bold">
                  {" "}
                  Emergency :{" "}
                  <span className="font-medium text-[red]">911</span>
                </Form.Label>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    Making the Environment Safe :
                  </Form.Label>
                  <SelectMultiPrint
                    isMulti
                    options={enviromentAdressOptions}
                    value={enviromentAdress}
                    onChange={enviromentAdresshandler}
                    isCreatable={true}
                    onKeyDown={handleKeySelectedValueSpecialPrecautions}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="my-3">
              <Col xs={12} lg={6} className="d-flex align-items-start">
                <Button
                  type="button"
                  className={`theme-button me-2 hidePrint ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                  onClick={() => setShowSingIn(true)}
                >
                  SAVED AND SIGNED
                </Button>
              </Col>
              <Col xs={12} lg={6}>
                {signatureFormat({
                  sign: singin,
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
              </Col>
            </Row>

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
                signerNameOverride={id ? user : residentName || ""}
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

            <Row className="my-2 mt-4">
              <Col xs={12}>
                {!id && (
                  <div className="hidePrint">
                    <Form.Label className="fw-bold">Signers :</Form.Label>
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
              <Col xs={12} className="text-center">
                <div className="employee_btn_div hidePrint">
                  <button
                    className={`employee_create_btn ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                    type="button"
                    disabled={
                      witnessIncomplete
                        ? true
                        : id
                          ? !isSubmitEnabled
                          : profileInfo?.userType === ROLES.ADMIN
                            ? false
                            : singin?.length === 0
                    }
                    onClick={handlePost}
                  >
                    {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </>
  );
};
function DateInput({ value, onChange, id }) {
  return (
    <>
      <input
        className="show-print-inline"
        style={{
          display: "none",
        }}
        type="text"
        value={value}
      />
      <input
        type="date"
        id={id}
        className="hidePrint"
        value={value}
        placeholder="DD/MM/YYYY"
        required
        onChange={onChange}
      />
    </>
  );
}
function InputToP({ value, style, onChange, required }) {
  return (
    <>
      <input
        style={style}
        value={value}
        required={required}
        onChange={onChange}
        className="hidePrint"
      />
      <p
        style={{
          display: "none",
        }}
        className="show-print-inline"
      >
        {value}
      </p>
    </>
  );
}
function SelectMultiPrint({
  value,
  onChange,
  options,
  isCreatable,
  onKeyDown,
}) {
  return (
    <>
      <span
        className="show-print-inline"
        style={{
          display: "none",
        }}
      >
        {Array.isArray(value)
          ? value.map((val) => val.label)?.join(", ")
          : value.label}
      </span>
      <div className="hidePrint">
        <Select
          isMulti
          className="w-100"
          value={value}
          onChange={onChange}
          options={options}
          isCreatable={isCreatable}
          onKeyDown={onKeyDown || onChange}
        />
      </div>
    </>
  );
}
export default HOC({
  Wcomponenet: SafetyPlan,
});
