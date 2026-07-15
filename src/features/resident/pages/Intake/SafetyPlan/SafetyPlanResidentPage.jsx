/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { residentService } from "@/features/shared/services/index";
import Draftinmodel from "../../../components/Modal/Draftinmodel";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import "../../../components/Forms/form-css/nursing.css";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { AddSignature, signatureFormat } from "@/utils/utils";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import "@/features/shared/features/intake/initialAssessment/ResidentInitialAssessment.css";
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
import { intakeService } from "@/features/shared/services/index";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { ROLES } from "@/features/shared/constants/index";
import { EMPLOYEE_APIS } from "@/features/shared/services/index";
const SafetyPlan = () => {
  const [getApiData, setGetApiData] = useState("");
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [draftModel, setDraftModel] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
      profile,
    ),
    pageStyle: `
    @page {
      margin: 10mm !important;
    }    
    .card {
      page-break-inside: avoid;
    }
    .table-row-hide-print {
      display: none;
      }
  `,
  });
  const handlePrint2 = (e) => {
    e?.preventDefault();
    handlePrint();
  };

  //singIn model state
  const [filedForm, setFiledForm] = useState("");
  const [showSingIn, setShowSingIn] = useState(false);
  const [userDetail, setUserDetail] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [warning1, setWarning1] = useState("");
  const [warning2, setWarning2] = useState("");
  const [warning3, setWarning3] = useState("");
  const [internalCopy1, setInernalCopy1] = useState("");
  const [internalCopy2, setInernalCopy2] = useState("");
  const [internalCopy3, setInernalCopy3] = useState("");
  //People & Social settings that provide Distraction
  const [socialName, setSocialName] = useState("");
  const [socialPhone, setSocialPhone] = useState("");
  const [socialRelationship, setSocialRelationship] = useState("");
  const [socialName1, setSocialName1] = useState("");
  const [socialPhone1, setSocialPhone1] = useState("");
  const [socialRelationship1, setSocialRelationship1] = useState("");
  //address and place
  const [address, setAdress] = useState("");
  const [place, setPlace] = useState("");
  //People whom I can ask for Help
  const [helpName, setHelpName] = useState("");
  const [helpPhone, setHelpPhone] = useState("");
  const [helpRelationship, setHelpRelationship] = useState("");
  const [helpArray, setHelpArray] = useState([]);
  //Professionals or agencies I can contact during Crisis
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
  const [adminSignature, setAdminSignature] = useState("");
  const [adminSignatureDate, setAdminSignatureDate] = useState("");
  const [adminSignatureTime, setAdminSignatureTime] = useState("");
  //environmentSafetyMedications
  const [enviromentAdress, setEnviromentAdress] = useState([]);
  //singin
  const [singin, setSingIn] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [signatureTime, setSignatureTime] = useState("");
  const [signatures, setSignatures] = useState({});
  const [signers, setSigners] = useState([]);

  const handleSignatureUpdate = (role, patch) => {
    setSignatures((prev) => ({
      ...prev,
      [role]: { ...(prev[role] || {}), ...patch },
    }));
  };

  // Function to format the date as MM-DD-YYYY

  useEffect(() => {
    // add patient name key and date key

    if (getApiData) {
      setUser(getApiData?.residentName);
      setAhcccsId(getApiData?.patientId?.ahcccsId);
      setDiagnosis(getApiData?.patientId?.diagnosis);
      setDate(
        getApiData?.patientId?.dateOfBirth
          ? getApiData?.patientId?.dateOfBirth?.slice(0, 10)
          : "",
      );
      setWarning1(getApiData?.warningSigns?.[0]?.warning1);
      setWarning2(getApiData?.warningSigns?.[0]?.warning2);
      setWarning3(getApiData?.warningSigns?.[0]?.warning3);
      setInernalCopy1(getApiData?.internalCopingStrategies?.[0]?.internalCopy1);
      setInernalCopy2(getApiData?.internalCopingStrategies?.[0]?.internalCopy2);
      setInernalCopy3(getApiData?.internalCopingStrategies?.[0]?.internalCopy3);
      setSocialName(getApiData?.distractionsPeople?.[0]?.name);
      setSocialPhone(getApiData?.distractionsPeople?.[0]?.phone);
      setSocialRelationship(getApiData?.distractionsPeople?.[0]?.relationship);
      setSocialName1(getApiData?.distractionsPeople?.[1]?.name);
      setSocialPhone1(getApiData?.distractionsPeople?.[1]?.phone);
      setSocialRelationship1(getApiData?.distractionsPeople?.[1]?.relationship);
      setAdress(getApiData?.distractionsPlace);
      setPlace(getApiData?.distractionsPlane);
      setHelpName("");
      setHelpPhone("");
      setHelpRelationship("");
      setHelpArray(
        getApiData?.helpContactsPeople ? getApiData?.helpContactsPeople : [],
      );
      // Professionals or agencies I can contact during Crisis:
      setProfessionalsClinicianName(getApiData?.professionalsClinicianName);
      setProfessionalsPhone(getApiData?.professionalsPhone);
      setCrisisName(getApiData?.professionals?.[0]?.clinicianName);
      setCrisisPhone(getApiData?.professionals?.[0]?.phone);
      setCrisisRelationship(getApiData?.professionals?.[0]?.relationship);
      setCrisisName1(getApiData?.professionals?.[1]?.clinicianName);
      setCrisisPhone1(getApiData?.professionals?.[1]?.phone);
      setCrisisRelationship1(getApiData?.professionals?.[1]?.relationship);
      setEnviromentAdress(
        getApiData?.environmentSafetyMedications
          ? getApiData.environmentSafetyMedications.map((item) => ({
              label: item,
              // Assuming 'name' is the property you want to use as label
              value: item, // Assuming 'id' is the property you want to use as value
            }))
          : [],
      );
      setSingIn(getApiData?.signature);
      setSignatureDate(
        getApiData?.signatureDate ? getApiData?.signatureDate : "",
      );
      setSignatureTime(getApiData?.signatureTime);
      setAdminSignature(getApiData?.adminSignature);
      setAdminSignatureDate(getApiData?.adminSignatureDate);
      setAdminSignatureTime(getApiData?.adminSignatureTime);
      setSignatures(getApiData?.signatures || {});
      setSigners(getApiData.signers);
    }
  }, [getApiData]);
  useEffect(() => {
    if (id) {
      residentService.getApiResident({
        url: EMPLOYEE_APIS.EMPLOYEE_GETRESIDENTSAFETYPLANBYID(id),
        setResponse: setGetApiData,
        isIntake: true,
      });
    }
  }, [id]);
  useEffect(() => {
    setFiledForm(userDetail?.safetyPlan);
    setUserId(userDetail?._id);
  }, [userDetail]);
  useEffect(() => {
    if (profile) {
      setUserDetail(profile);
    }
  }, [profile]);
  const initial_value = () => {
    setUserDetail("");
    setUser("");
    setUserId("");
    setDate("");
    setWarning1("");
    setWarning2("");
    setWarning3("");
    setInernalCopy1("");
    setInernalCopy2("");
    setInernalCopy3("");
    setSocialName("");
    setSocialPhone("");
    setSocialRelationship("");
    setSocialName1("");
    setSocialPhone1("");
    setSocialRelationship1("");
    setAdress("");
    setPlace("");
    setHelpName("");
    setHelpPhone("");
    setHelpRelationship("");
    setHelpArray([]);
    // Professionals or agencies I can contact during Crisis:
    setProfessionalsClinicianName("");
    setProfessionalsPhone("");
    setProfessionalsRelationship("");
    setCrisisName("");
    setCrisisPhone("");
    setCrisisRelationship("");
    setCrisisName1("");
    setCrisisPhone1("");
    setCrisisRelationship1("");
    setEnviromentAdress([]);
    setSingIn("");
    setSignatureDate("");
    setSignatureTime("");
    setSignatures({});
  };
  const handlePost = (e) => {
    e.preventDefault();
    const enviromentAdressArray = [];
    for (let i = 0; i < enviromentAdress.length; i++) {
      enviromentAdressArray.push(enviromentAdress[i].value);
    }
    const data = {
      saveAsDraft,
      patientId: userId,
      residentName: user,
      dateOfBirth: date,
      warningSigns: [
        {
          warning1,
          warning2,
          warning3,
        },
      ],
      internalCopingStrategies: [
        {
          internalCopy1,
          internalCopy2,
          internalCopy3,
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
      // internalCopyinternalCopy: socialArray,
      distractionsPlace: address,
      distractionsPlane: place,
      // array add
      helpContactsPeople: helpArray,
      // Professionals or agencies I can contact during Crisis
      professionalsClinicianName,
      professionalsPhone,
      professionalsRelationship,
      // professionals: crisisArray,
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
      //penddig
      environmentSafetyMedications: enviromentAdressArray,
      signature: singin,
      signatureDate,
      signatureTime,
      signatures,
      signers,
    };
    intakeService.safetyPlan.update(id, data, { setLoading, navigate });
  };
  const handleData = () => {
    const enviromentAdressArray = [];
    for (let i = 0; i < enviromentAdress.length; i++) {
      enviromentAdressArray.push(enviromentAdress[i].value);
    }
    const data = {
      saveAsDraft,
      patientId: userId,
      residentName: user,
      dateOfBirth: date,
      warningSigns: [
        {
          warning1,
          warning2,
          warning3,
        },
      ],
      internalCopingStrategies: [
        {
          internalCopy1,
          internalCopy2,
          internalCopy3,
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
      // internalCopyinternalCopy: socialArray,
      distractionsPlace: address,
      distractionsPlane: place,
      // array add
      helpContactsPeople: helpArray,
      // Professionals or agencies I can contact during Crisis
      professionalsClinicianName,
      professionalsPhone,
      professionalsRelationship,
      // professionals: crisisArray,
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
      //penddig
      environmentSafetyMedications: enviromentAdressArray,
      signature: singin,
      signatureDate,
      signatureTime,
      signatures,
      signers,
    };
    intakeService.safetyPlan.update(id, data, { setLoading, navigate });
    initial_value();
  };
  useEffect(() => {
    if (saveAsDraft) {
      handleData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveAsDraft]);

  // Making the environment safe
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

      // Check if the input value already exists in the options array
      const optionExists = enviromentAdressOptions.some(
        (option) => option.value === inputValue,
      );

      // If the input value doesn't exist, add it to the array
      if (!optionExists) {
        const newOptions = [
          ...enviromentAdressOptions,
          {
            value: inputValue,
            label: inputValue,
          },
        ];

        // Update the state with the new options
        setEnviromentAdress(newOptions);

        // Update the selected values to include the newly created option
        const newSelectedValues = [
          ...enviromentAdress,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setEnviromentAdress(newSelectedValues);
      }

      // Clear the input value after adding the option
      event.target.value = "";
    }
  };
  const enviromentAdresshandler = (optionValue) => {
    setEnviromentAdress(optionValue);
  };
  const profileInfo = useSelector(userProfile);
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
  return (
    <>
      <AddSignature
        show={showSingIn}
        setValue={setSignerSignature}
        setDate={setSignerDate}
        setTime={setSignerTime}
      />
      <div className="form-safety-plan block" ref={componentRef}>
        <NavWrapper title={"Safety Plan"} isArrow={true} />
        <h1 className="pdfTitle hidden">Safety Plan</h1>
        <Container>
          <Form onSubmit={handlePost} className="form-safety-plan">
            <Row className="mb-2">
              <Col xs={12} sm={12} md={6} lg={6} xl={4}>
                <div className="view-details-grid resident-name-print my-1 my-md-2 p-3">
                  <p className="view-label increse-size mb-1 mb-md-0">
                    Resident Name :{" "}
                  </p>
                  <h5 className="view-value increse-size mb-0">{user}</h5>
                </div>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6} xl={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1 mb-md-0">AHCCCS ID : </p>
                  <h5 className="view-value mb-0">{ahcccsId}</h5>
                </div>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6} xl={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1 mb-md-0">DOB : </p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(date)}
                  </h5>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1 mb-md-0">
                    Diagnosis (specify if new or continuing) :{" "}
                  </p>
                  <h5 className="view-value mb-0">{diagnosis}</h5>
                </div>
              </Col>
            </Row>
            <div
              className={`${!warning1 && !warning2 && !warning3 && "table-row-hide-print"}`}
            >
              <Row>
                <Col xs={12}>
                  <Form.Label className="fw-bold w-100">
                    {" "}
                    <span className="text-[#0C5C75]">STEP 1 :</span> Warning
                    Signs{" "}
                    <span className="text-[#000000B2]">
                      ( thoughts, images, mood, situation, behavior )
                    </span>{" "}
                    that a crisis may be developing:
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={4} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">1 : </p>
                    <h5 className="view-value mb-0">{warning1}</h5>
                  </div>
                </Col>

                <Col xs={12} sm={4} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">2 : </p>
                    <h5 className="view-value mb-0">{warning2}</h5>
                  </div>
                </Col>

                <Col xs={12} sm={4} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">3 : </p>
                    <h5 className="view-value mb-0">{warning3}</h5>
                  </div>
                </Col>
              </Row>
            </div>
            <div
              className={`${!internalCopy1 && !internalCopy2 && !internalCopy3 && "table-row-hide-print"}`}
            >
              <Row className="mt-2">
                <Col xs={12}>
                  <Form.Label className="fw-bold w-100">
                    {" "}
                    <span className="text-[#0C5C75]">STEP 2 :</span> Internal
                    Coping Strategies:
                  </Form.Label>
                  <Form.Label className="mb-2 w-100">
                    Things I can do to take my mind off my problems without
                    contacting other Person:
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={4} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">1 : </p>
                    <h5 className="view-value mb-0">{internalCopy1}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">2 : </p>
                    <h5 className="view-value mb-0">{internalCopy2}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">3 : </p>
                    <h5 className="view-value mb-0">{internalCopy3}</h5>
                  </div>
                </Col>
              </Row>
            </div>
            <div
              className={`${!socialName && !socialPhone && !socialRelationship && !socialName1 && !socialPhone1 && !socialRelationship1 && !address && !place && "table-row-hide-print"}`}
            >
              <Row className="mt-2">
                <Col xs={12}>
                  <Form.Label className="fw-bold w-100">
                    {" "}
                    <span className="text-[#0C5C75]">STEP 3 :</span> People &
                    Social settings that provide Distraction:
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Name : </p>
                    <h5 className="view-value mb-0">{socialName}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Phone Number : </p>
                    <h5 className="view-value mb-0">{socialPhone}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Relationship : </p>
                    <h5 className="view-value mb-0">{socialRelationship}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Name : </p>
                    <h5 className="view-value mb-0">{socialName1}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Phone Number : </p>
                    <h5 className="view-value mb-0">{socialPhone1}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Relationship : </p>
                    <h5 className="view-value mb-0">{socialRelationship1}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={6}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Place : </p>
                    <h5 className="view-value mb-0">{address}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={6}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Plane : </p>
                    <h5 className="view-value mb-0">{place}</h5>
                  </div>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col xs={12}>
                  <Form.Label className="fw-bold w-100">
                    {" "}
                    <span className="text-[#0C5C75]">STEP 4 :</span> People whom
                    I can ask for Help:
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Name : </p>
                    <h5 className="view-value mb-0">{helpName}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Phone Number : </p>
                    <h5 className="view-value mb-0">{helpPhone}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Relationship : </p>
                    <h5 className="view-value mb-0">{helpRelationship}</h5>
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
                        </tr>
                      </thead>
                      <tbody>
                        {helpArray?.map((i, index) => (
                          <tr>
                            <td>{` ${i.name}`} </td>
                            <td>{` ${i.phone}`} </td>
                            <td>{` ${i.relationship}`} </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <Form.Label className="fw-bold">
                    {" "}
                    Professionals or agencies I can contact during Crisis:
                  </Form.Label>
                </Col>
              </Row>
              <div
                className={`${!professionalsClinicianName && !professionalsPhone && !crisisName && !crisisPhone && !crisisRelationship && !crisisName1 && !crisisPhone1 && !crisisRelationship1 && "table-row-hide-print"}`}
              >
                <Row>
                  <Col
                    xs={12}
                    sm={6}
                    md={6}
                    lg={3}
                    className={`proportional-nums`}
                  >
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">
                        Clinician/Facility Name :{" "}
                      </p>
                      <h5 className="view-value mb-0">
                        {professionalsClinicianName}
                      </h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Phone Number : </p>
                      <h5 className="view-value mb-0">{professionalsPhone}</h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Clinician Name : </p>
                      <h5 className="view-value mb-0">{crisisName}</h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Phone : </p>
                      <h5 className="view-value mb-0">{crisisPhone}</h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Relationship : </p>
                      <h5 className="view-value mb-0">{crisisRelationship}</h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Clinician Name : </p>
                      <h5 className="view-value mb-0">{crisisName1}</h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Phone : </p>
                      <h5 className="view-value mb-0">{crisisPhone1}</h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={3}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Relationship : </p>
                      <h5 className="view-value mb-0">{crisisRelationship1}</h5>
                    </div>
                  </Col>
                </Row>
              </div>

              <Card body>
                <Row>
                  <Col xs={12} lg={6}>
                    <Form.Label className="fw-bold">
                      {" "}
                      Suicide Prevention Lifeline :{" "}
                      <span className="font-medium text-red-500">
                        +1-800-273-TALK (8255)/988{" "}
                      </span>
                    </Form.Label>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Label className="fw-bold">
                      {" "}
                      Emergency :{" "}
                      <span className="font-medium text-red-500">911</span>
                    </Form.Label>
                  </Col>
                </Row>
              </Card>
              <div
                className={`${enviromentAdress?.length < 1 && "table-row-hide-print"}`}
              >
                <Row>
                  <Col xs={12}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">
                        Making the Environment Safe :{" "}
                      </p>
                      <h5 className="view-value mb-0">
                        {enviromentAdress?.map((i) => i.label)?.join(", ")}
                      </h5>
                    </div>
                  </Col>
                </Row>
              </div>

              <Row className="my-3">
                {signerIndex !== -1 && (
                  <Col xs={12} className="mb-3">
                    <Button
                      type="button"
                      className="theme-button hidePrint"
                      onClick={() => setShowSingIn(true)}
                    >
                      SAVED AND SIGNED
                    </Button>
                  </Col>
                )}
                <Col xs={12} className="signature-sections-inline">
                  <SignatureSection
                    role="resident"
                    label="Resident/Representative Signature"
                    variant="blue"
                    mode="edit"
                    signature={signatures?.resident}
                    onUpdate={handleSignatureUpdate}
                    signerNameOverride={user || ""}
                  />
                  <SignatureSection
                    role="witness"
                    label="Witness Signature"
                    variant="yellow"
                    mode="edit"
                    signature={signatures?.witness}
                    onUpdate={handleSignatureUpdate}
                  />
                </Col>
                <Col xs={12} lg={12} className="text-end">
                  {singin &&
                    signatureFormat({
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
              {(profile.userType === ROLES.PATIENT ||
                profile.userType === ROLES.GUARDIAN) && (
                <Row>
                  <Col xs={12}>
                    <div className="employee_btn_div hidePrint">
                      <button className="employee_create_btn" type="submit">
                        SUBMIT DETAILS
                      </button>
                    </div>
                  </Col>
                </Row>
              )}
            </div>
            {draftModel && (
              <Draftinmodel onClose={() => setDraftModel(false)} />
            )}
          </Form>
        </Container>
      </div>
    </>
  );
};
export default HOC({
  Wcomponenet: SafetyPlan,
});
