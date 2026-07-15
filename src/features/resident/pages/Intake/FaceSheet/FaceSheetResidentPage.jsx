/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Draftinmodel from "../../../components/Modal/Draftinmodel";
import "../../../components/Forms/form-css/nursing.css";
import { AddSignature, signatureFormat } from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import "@/features/shared/features/intake/initialAssessment/ResidentInitialAssessment.css";
import {
  intakeService,
  residentService,
  EMPLOYEE_APIS,
} from "@/features/shared/services/index";
import { ROLES } from "@/features/shared/constants/index";
const FaceSheet = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [showSignatureResident, setShowSignatureResident] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [getApiData, setGetApiData] = useState("");

  //draft model
  const [draftModel, setDraftModel] = useState(false);
  const componentRef = React.useRef();
  const [filedForm, setFiledForm] = useState("");
  const [userDetail, setUserDetail] = useState("");
  const navigate = useNavigate();
  const [adminSignature, setAdminSignature] = useState("");
  const [adminSignatureDate, setAdminSignatureDate] = useState("");
  const [adminSignatureTime, setAdminSignatureTime] = useState("");
  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [dob, setDob] = useState("");
  const [dateOfAdmit, setDateOfAdmit] = useState("");
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
  // primary care provider
  const [primaryCareProviderName, setPrimaryCareProviderName] = useState("");
  const [primaryCareProviderContact, setPrimaryCareProviderContact] =
    useState("");
  const [primaryCareProviderAddress, setPrimaryCareProviderAddress] =
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
  const [psychiatricProviderName, setPsychiatricProviderName] = useState("");
  const [psychiatricProviderContact, setPsychiatricProviderContact] =
    useState("");
  const [psychiatricProviderAddress, setPsychiatricProviderAddress] =
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

  //signature and also date
  const [signature, setSignature] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [signatureTime, setSegnatureTime] = useState("");
  const [signers, setSigners] = useState([]);
  useEffect(() => {
    // Function to format the date as MM-DD-YYYY

    if (getApiData) {
      setDiagnosis(getApiData?.patientId?.diagnosis);
      setResidentName(
        `${getApiData?.patientId?.firstName}  ${getApiData?.patientId?.lastName}`,
      );
      setDob(
        getApiData?.patientId?.dateOfBirth?.slice(0, 10) ||
          getApiData?.dob?.slice(0, 10),
      );
      setDateOfAdmit(
        getApiData?.patientId?.admitDate
          ? getApiData?.patientId?.admitDate?.slice(0, 10)
          : 0,
      );
      setFacilityAddress(getApiData?.facilityAddress);
      setFacilityPhoneNumber(getApiData?.facilityPhoneNumber);
      setPlaceOfBirth(getApiData?.placeOfBirth);
      setEyeColor(getApiData?.eyeColor);
      setRace(getApiData?.race);
      setHeight(getApiData?.height);
      setWeight(getApiData?.weight);
      setHairColor(getApiData?.hairColor);
      setIdentifiableMarks(getApiData?.identifiableMarks);
      setPrimaryLanguage(getApiData?.primaryLanguage);
      // true false value
      setCourtOrderedTreatment(getApiData?.courtOrderedTreatment);
      setFamilyGuardianEmergencyName(getApiData?.familyGuardianEmergencyName);
      setFamilyGuardianEmergencyContact(
        getApiData?.familyGuardianEmergencyContact,
      );
      setFacilityEmergencyContact(getApiData?.facilityEmergencyContact);
      setMedicationAllergies(getApiData?.medicationAllergies);
      setOtherAllergies(getApiData?.otherAllergies);

      // primary provider
      setPrimaryCareProviderName(getApiData?.patientId?.primaryCareProvider);
      setPrimaryCareProviderContact(
        getApiData?.patientId?.primaryCareProviderContact,
      );
      setPrimaryCareProviderAddress(
        getApiData?.patientId?.primaryCareProviderAddress,
      );
      setPrimaryCareProviderOtherSpecialistsArray(
        getApiData?.primaryCareProviderOtherSpecialists
          ? getApiData?.primaryCareProviderOtherSpecialists
          : [],
      );
      setPreferredHospitalName(
        getApiData?.primaryCareProvider?.[0]?.preferredHospitalName,
      );
      setPreferredHospitalPhone(
        getApiData?.primaryCareProvider?.[0]?.preferredHospitalPhone,
      );
      setPreferredHospitalAddress(
        getApiData?.primaryCareProvider?.[0]?.preferredHospitalAddress,
      );

      //shycrometric provider
      setPsychiatricProviderName(getApiData?.patientId?.psychiatricProvider);
      setPsychiatricProviderContact(
        getApiData?.patientId?.psychiatricProviderContact,
      );
      setPsychiatricProviderAddress(
        getApiData?.patientId?.psychiatricProviderAddress,
      );
      setPsychiatricProviderOtherSpecialistsArray(
        getApiData?.psychiatricProviderOtherSpecialists
          ? getApiData?.psychiatricProviderOtherSpecialists
          : [],
      );
      // set data 2 state is pending
      setHealthPlan(getApiData?.healthPlan);
      setHealthPlanId(getApiData?.healthPlanId);
      setCaseManagerName(getApiData?.caseManagerName);
      setCaseManagerPhone(getApiData?.caseManagerPhone);
      setCaseManagerEmail(getApiData?.caseManagerEmail);
      setSocialSecurityRepresentativePayeeName(
        getApiData?.socialSecurityRepresentativePayeeName,
      );
      setSocialSecurityRepresentativePayeePhone(
        getApiData?.socialSecurityRepresentativePayeePhone,
      );
      setSocialSecurityRepresentativePayeeEmail(
        getApiData?.socialSecurityRepresentativePayeeEmail,
      );
      setMentalHealthDiagnoses(getApiData?.mentalHealthDiagnoses);
      setMedicalDiagnosesHistory(getApiData?.medicalDiagnosesHistory);
      setPastSurgeries(getApiData?.pastSurgeries);
      setSignature(getApiData?.bhpSignature);
      setSignatureDate(getApiData?.bhpDate ? getApiData?.bhpDate : "");
      setSegnatureTime(getApiData?.time);
      setAdminSignature(getApiData?.adminSignature);
      setAdminSignatureDate(getApiData?.adminSignatureDate);
      setAdminSignatureTime(getApiData?.adminSignatureTime);
      setSigners(getApiData.signers);
    }
  }, [getApiData]);
  useEffect(() => {
    if (id) {
      residentService.getApiResident({
        url: EMPLOYEE_APIS.EMPLOYEE_GETFACESHEETBYID(id),
        setResponse: setGetApiData,
        isIntake: true,
      });
    }
  }, [id]);
  useEffect(() => {
    setFiledForm(userDetail?.faceSheet);
    setPatientId(userDetail?._id);
  }, [userDetail]);
  useEffect(() => {
    if (profile) {
      setUserDetail(profile);
    }
  }, [profile]);
  const initial_Value = () => {
    setResidentName("");
    setDob("");
    setDateOfAdmit("");
    setFacilityAddress("");
    setFacilityPhoneNumber("");
    setPlaceOfBirth("");
    setEyeColor("");
    setRace("");
    setHeight("");
    setWeight("");
    setHairColor("");
    setIdentifiableMarks("");
    setPrimaryLanguage("");
    setCourtOrderedTreatment();
    setFamilyGuardianEmergencyName("");
    setFamilyGuardianEmergencyContact("");
    setFacilityEmergencyContact("");
    setMedicationAllergies("");
    setOtherAllergies("");
    setPrimaryCareProviderName("");
    setPrimaryCareProviderContact("");
    setPrimaryCareProviderAddress("");
    setPreferredHospitalName("");
    setPreferredHospitalPhone("");
    setPreferredHospitalAddress("");
    setPrimaryCareProviderOtherSpecialistsArray([]);
    setPsychiatricProviderName("");
    setPsychiatricProviderContact("");
    setPsychiatricProviderAddress("");
    setHealthPlan("");
    setHealthPlanId("");
    setPsychiatricProviderOtherSpecialistsArray([]);
    setCaseManagerName("");
    setCaseManagerPhone("");
    setCaseManagerEmail("");
    setSocialSecurityRepresentativePayeeName("");
    setSocialSecurityRepresentativePayeePhone("");
    setSocialSecurityRepresentativePayeeEmail("");
    setMentalHealthDiagnoses("");
    setMedicalDiagnosesHistory("");
    setPastSurgeries("");
    setSignature("");
    setSignatureDate("");
    setSegnatureTime("");
  };
  const handleData = (e) => {
    e.preventDefault();
    const data = {
      saveAsDraft,
      patientId,
      residentName,
      dateOfBirth: dob,
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
      signers,
    };
    intakeService.faceSheet.update(id, data, { setLoading, navigate });
    initial_Value();
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
      <div className="face-sheet-print" ref={componentRef}>
        <NavWrapper
          title={"FaceSheet/Resident Emergency Information"}
          isArrow={true}
        />
        <Form onSubmit={handleData} className="facesheet-print">
          <Container>
            <h1 className="pdfTitle mb-0 hidden">Face Sheet</h1>
            <Row>
              <Col xs={12} sm={6} md={6} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Resident Name : </p>
                  <h5 className="view-value mb-0">{residentName}</h5>
                </div>
              </Col>
              <Col xs={12} sm={6} md={6} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date of Birth : </p>
                  <h5 className="view-value mb-0">{dob}</h5>
                </div>
              </Col>
              <Col xs={12} sm={4} md={4} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Admit Date : </p>
                  <h5 className="view-value mb-0">{dateOfAdmit}</h5>
                </div>
              </Col>
              <Col xs={12} sm={8} md={8} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Diagnosis (specify if new or continuing) :{" "}
                  </p>
                  <h5 className="view-value mb-0">{diagnosis}</h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={6}
                md={6}
                lg={4}
                className={`${!facilityAddress && "table-row-hide-print"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Facility Address : </p>
                  <h5 className="view-value mb-0">{facilityAddress}</h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={6}
                md={6}
                lg={4}
                className={`${!facilityPhoneNumber && "table-row-hide-print"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Facility Phone Number : </p>
                  <h5 className="view-value mb-0">{facilityPhoneNumber}</h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={6}
                md={6}
                lg={4}
                className={`${!placeOfBirth && "table-row-hide-print"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Place of Birth : </p>
                  <h5 className="view-value mb-0">{placeOfBirth}</h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={6}
                md={6}
                lg={4}
                className={`${!eyeColor && "table-row-hide-print"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Eye Color : </p>
                  <h5 className="view-value mb-0">{eyeColor}</h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={6}
                md={6}
                lg={4}
                className={`${!race && "table-row-hide-print"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Race : </p>
                  <h5 className="view-value mb-0">{race}</h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={6}
                md={6}
                lg={4}
                className={`${!height && "table-row-hide-print"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Height : </p>
                  <h5 className="view-value mb-0">{height}</h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={6}
                md={6}
                lg={4}
                className={`${!weight && "table-row-hide-print"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Weight : </p>
                  <h5 className="view-value mb-0">{height}</h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={6}
                md={6}
                lg={4}
                className={`${!hairColor && "table-row-hide-print"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Hair Color : </p>
                  <h5 className="view-value mb-0">{hairColor}</h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={6}
                md={6}
                lg={4}
                className={`${!identifiableMarks && "table-row-hide-print"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Hair Color : </p>
                  <h5 className="view-value mb-0">{identifiableMarks}</h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={6}
                md={6}
                lg={6}
                className={`${!primaryLanguage && "table-row-hide-print"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Primary Language : </p>
                  <h5 className="view-value mb-0">{primaryLanguage}</h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={6}
                lg={6}
                className={`${courtOrderedTreatment !== true && courtOrderedTreatment !== false && "table-row-hide-print"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Court Ordered Treatment? : </p>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Yes"
                      type="checkbox"
                      className="pe-none"
                      id="courtOrderedTreatment"
                      value={courtOrderedTreatment}
                      checked={courtOrderedTreatment === true}
                      onChange={() => setCourtOrderedTreatment(true)}
                    />
                    <Form.Check
                      inline
                      label="No"
                      className="pe-none"
                      type="checkbox"
                      id="courtOrderedTreatmentno"
                      value={courtOrderedTreatment}
                      checked={courtOrderedTreatment === false}
                      onChange={(e) => setCourtOrderedTreatment(false)}
                    />
                  </div>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={6}
                className={`${!familyGuardianEmergencyName && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Family/Guardian Emergency Name and Contact Number :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {familyGuardianEmergencyName}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={6}
                className={`${!facilityEmergencyContact && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Facility Emergency Contact Number :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {facilityEmergencyContact}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-3">
                {(() => {
                  let yes = null;
                  let comment = "";
                  const arr = getApiData?.patientId?.allergies;
                  if (arr && Array.isArray(arr) && arr.length > 0) {
                    const allergy = arr[0];
                    if (allergy) {
                      yes = allergy.yes;
                      comment = allergy.comments || "";
                    }
                  }

                  return (
                    <Table responsive="lg" bordered className="mb-0 mt-3">
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
            <Row>
              <Col xs={12} sm={6} md={12} lg={12}>
                <div className="mb-3">
                  <Row>
                    <Col
                      xs={12}
                      md={12}
                      lg={12}
                      className={`${!primaryCareProviderName && "hidePrint"}`}
                    >
                      <Row>
                        <Col xs={12} md={4}>
                          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                            <p className="view-label mb-1">
                              Primary Care Provider Name :{" "}
                            </p>
                            <h5 className="view-value mb-0">
                              {primaryCareProviderName}
                            </h5>
                          </div>
                        </Col>
                        <Col xs={12} md={4}>
                          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                            <p className="view-label mb-1">
                              Primary Care Provider Contact :{" "}
                            </p>
                            <h5 className="view-value mb-0">
                              {primaryCareProviderContact}
                            </h5>
                          </div>
                        </Col>
                        <Col xs={12} md={4}>
                          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                            <p className="view-label mb-1">
                              Primary Care Provider Address :{" "}
                            </p>
                            <h5 className="view-value mb-0">
                              {primaryCareProviderAddress}
                            </h5>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
                <div className="mb-3">
                  <Form.Label className="fw-bold w-100">
                    Other Specialist - please specify
                  </Form.Label>
                  {primaryCareProviderOtherSpecialistsArray.length > 0 &&
                    primaryCareProviderOtherSpecialistsArray.map(
                      (item, index) => (
                        <>
                          <Row>
                            <Col xs={12} sm={12} md={12} lg={6}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                <p className="view-label mb-1">Name : </p>
                                <h5 className="view-value mb-0">
                                  {item?.name}
                                </h5>
                              </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={6}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                <p className="view-label mb-1">
                                  Phone Number :{" "}
                                </p>
                                <h5 className="view-value mb-0">
                                  {item?.phone}
                                </h5>
                              </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                <p className="view-label mb-1">Address : </p>
                                <h5 className="view-value mb-0">
                                  {item?.address}
                                </h5>
                              </div>
                            </Col>
                          </Row>
                          <Row className="mb-3 mt-2">
                            <Col>
                              <Button
                                disabled
                                size="sm"
                                className="hidePrint"
                                variant="danger"
                                type="button"
                                onClick={() =>
                                  handlePrimaryCareArrayDelete(index)
                                }
                              >
                                Delete
                              </Button>
                            </Col>
                          </Row>
                        </>
                      ),
                    )}
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={6}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Name : </p>
                        <h5 className="view-value mb-0">
                          {primarySpacelistName}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Phone Number : </p>
                        <h5 className="view-value mb-0">
                          {primarySpacelistPhone}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Address : </p>
                        <h5 className="view-value mb-0">
                          {primarySpacelistAddress}
                        </h5>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col>
                      <Button
                        disabled
                        size="sm"
                        className="theme-button hidePrint"
                        type="button"
                        onClick={handlePrimaryCareArray}
                      >
                        Add
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs={12} sm={6} md={12} lg={12}>
                <div className="mb-3">
                  <Row>
                    <Col
                      xs={12}
                      md={12}
                      lg={12}
                      className={`${!psychiatricProviderName && "hidePrint"}`}
                    >
                      <Row>
                        <Col xs={12} md={4}>
                          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                            <p className="view-label mb-1">
                              Psychiatric Provider Name :{" "}
                            </p>
                            <h5 className="view-value mb-0">
                              {psychiatricProviderName}
                            </h5>
                          </div>
                        </Col>
                        <Col xs={12} md={4}>
                          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                            <p className="view-label mb-1">
                              Psychiatric Provider Contact :{" "}
                            </p>
                            <h5 className="view-value mb-0">
                              {psychiatricProviderContact}
                            </h5>
                          </div>
                        </Col>
                        <Col xs={12} md={4}>
                          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                            <p className="view-label mb-1">
                              Psychiatric Provider Address :{" "}
                            </p>
                            <h5 className="view-value mb-0">
                              {psychiatricProviderAddress}
                            </h5>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
                <div className="mb-3">
                  <Form.Label className="fw-bold w-100">
                    Other Specialist - please specify
                  </Form.Label>
                  {psychiatricProviderOtherSpecialistsArray.length > 0 &&
                    psychiatricProviderOtherSpecialistsArray.map(
                      (item, index) => (
                        <>
                          <Row>
                            <Col xs={12} sm={12} md={12} lg={6}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                <p className="view-label mb-1">Name : </p>
                                <h5 className="view-value mb-0">
                                  {item?.name}
                                </h5>
                              </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={6}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                <p className="view-label mb-1">
                                  Phone Number :{" "}
                                </p>
                                <h5 className="view-value mb-0">
                                  {item?.phone}
                                </h5>
                              </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                <p className="view-label mb-1">Address : </p>
                                <h5 className="view-value mb-0">
                                  {item?.address}
                                </h5>
                              </div>
                            </Col>
                          </Row>
                          <Row className="mb-3 mt-2">
                            <Col>
                              <Button
                                disabled
                                size="sm"
                                className="hidePrint"
                                variant="danger"
                                type="button"
                                onClick={() =>
                                  handlePsychiatricArrayDelete(index)
                                }
                              >
                                Delete
                              </Button>
                            </Col>
                          </Row>
                        </>
                      ),
                    )}
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={6}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Name : </p>
                        <h5 className="view-value mb-0">
                          {psychiatricSpacelistName}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Phone Number : </p>
                        <h5 className="view-value mb-0">
                          {psychiatricSpacelistPhone}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Address : </p>
                        <h5 className="view-value mb-0">
                          {psychiatricSpacelistAddress}
                        </h5>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col>
                      <Button
                        disabled
                        size="sm"
                        className="theme-button hidePrint"
                        type="button"
                        onClick={handlePsychiatricArray}
                      >
                        Add
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <div body className="mb-3">
              <Row>
                <Col
                  xs={12}
                  sm={6}
                  md={12}
                  lg={6}
                  className={`${!preferredHospitalName && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Preferred Hospital : </p>
                    <h5 className="view-value mb-0">{preferredHospitalName}</h5>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={12}
                  lg={6}
                  className={`${!preferredHospitalPhone && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">
                      Preferred Hospital Phone Number :{" "}
                    </p>
                    <h5 className="view-value mb-0">
                      {preferredHospitalPhone}
                    </h5>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={12}
                  lg={12}
                  className={`${!preferredHospitalAddress && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">
                      Preferred Hospital Address :{" "}
                    </p>
                    <h5 className="view-value mb-0">
                      {preferredHospitalAddress}
                    </h5>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="mb-3">
              <Row>
                <Col
                  xs={12}
                  sm={6}
                  md={12}
                  lg={6}
                  className={`${!healthPlan && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Health Plan : </p>
                    <h5 className="view-value mb-0">{healthPlan}</h5>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={12}
                  lg={6}
                  className={`${!healthPlanId && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">ID # : </p>
                    <h5 className="view-value mb-0">{healthPlanId}</h5>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={4}
                  className={`${!caseManagerName && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Case Manager : </p>
                    <h5 className="view-value mb-0">{caseManagerName}</h5>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  className={`${!caseManagerPhone && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Phone Number : </p>
                    <h5 className="view-value mb-0">{caseManagerPhone}</h5>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  className={`${!caseManagerEmail && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">E-Mail : </p>
                    <h5 className="view-value mb-0">{caseManagerEmail}</h5>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={4}
                  className={`${!socialSecurityRepresentativePayeeName && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">
                      Social Security Representative Payee :{" "}
                    </p>
                    <h5 className="view-value mb-0">
                      {socialSecurityRepresentativePayeeName}
                    </h5>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  className={`${!socialSecurityRepresentativePayeePhone && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Phone Number : </p>
                    <h5 className="view-value mb-0">
                      {socialSecurityRepresentativePayeePhone}
                    </h5>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  className={`${!socialSecurityRepresentativePayeeEmail && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">E-Mail : </p>
                    <h5 className="view-value mb-0">
                      {socialSecurityRepresentativePayeeEmail}
                    </h5>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="mb-3">
              <Row>
                <Col md={12} className="mt-4 mb-3 px-0">
                  {renderDiagnoses(
                    "Mental Health Diagnoses",
                    getApiData?.patientId?.psychiatricDiagnoses ||
                      getApiData?.patientId?.psychiatricDiagnosesArray ||
                      getApiData?.psychiatricDiagnoses,
                  )}
                </Col>
                <Col md={12} className="mt-2 mb-4 px-0">
                  {renderDiagnoses(
                    "Medical Diagnoses",
                    getApiData?.patientId?.medicalDiagnoses ||
                      getApiData?.patientId?.medicalDiagnosesArray ||
                      getApiData?.medicalDiagnoses,
                  )}
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  className={`${!pastSurgeries && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Past Surgeries : </p>
                    <h5 className="view-value mb-0">{pastSurgeries}</h5>
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col xs={12} lg={6} className="d-flex align-items-start">
                <div className="hidePrint">
                  <Button
                    type="button"
                    className="theme-button me-2"
                    onClick={() => setShowSignatureResident(true)}
                  >
                    SAVED AND SIGNED
                  </Button>
                </div>
              </Col>
              <Col xs={12} lg={6}>
                {signature &&
                  signatureFormat({
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
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <AddSignature
                  show={showSignatureResident}
                  setValue={setSignerSignature}
                  setDate={setSignerDate}
                  setTime={setSignerTime}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
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
          </Container>
          {draftModel && <Draftinmodel onClose={() => setDraftModel(false)} />}
        </Form>
      </div>
    </>
  );
};
export default HOC({
  Wcomponenet: FaceSheet,
});
