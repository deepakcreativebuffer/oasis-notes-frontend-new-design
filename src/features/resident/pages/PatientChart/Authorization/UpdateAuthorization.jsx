/* eslint-disable no-unused-vars */
/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { getData, patientChartService } from "@/features/shared/services";
import { BorderlessInput, MultiSelect } from "@/utils/Makers";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { authorizeOptions } from "@/features/shared/constants";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
const UpdateAuthorization = () => {
  const navigate = useNavigate();
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const url = useLocation().pathname;
  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [authorizedPersonName, setAuthorizedPersonName] = useState("");
  const [authorizedPersonAgency, setAuthorizedPersonAgency] = useState("");
  const [authorizedPersonAddress, setAuthorizedPersonAddress] = useState("");
  const [authorizedPersonPhone, setAuthorizedPersonPhone] = useState("");
  const [authorizedPersonFax, setAuthorizedPersonFax] = useState("");
  const [authorizedPersonEmail, setAuthorizedPersonEmail] = useState("");
  const [dropDown, setDropDown] = useState([]);
  const [purposeOfDisclosure, setPurposeOfDisclosure] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [expirationFrom, setExpirationFrom] = useState("");
  const [expirationTo, setExpirationTo] = useState("");
  const [revocation, setRevocation] = useState("");
  const [specify, setSpecify] = useState("");
  const [signature, setSignature] = useState("");
  const [dateSigned, setDateSigned] = useState("");
  const [relationshipToPerson, setRelationshipToPerson] = useState("");
  const [residentSignature, setResidentSignature] = useState("");
  const [witness, setWitness] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeSigned, setTimeSigned] = useState("");
  const [offerLetter, setOfferLetter] = useState({});
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
  const { id } = useParams();
  const [detail, setDetail] = useState({});

  const {
    signatures,
    updateSignature,
    loadFromApi: loadSignaturesFromApi,
  } = useSignatures();
  const { guardTyped, dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });

  const hasTypedInForm = !!signature || !!adminSignature;
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
    setSignature("");
    setDateSigned("");
    setTimeSigned("");
    setAdminSignature("");
    setAdminDateSigned("");
    setAdminSignedTime("");
  };

  const payload = {
    patientId,
    residentName,
    dateOfBirth,
    authorizedPersonAddress,
    authorizedPersonAgency,
    authorizedPersonName,
    authorizedPersonPhone,
    authorizedPersonFax,
    authorizedPersonEmail,
    dropDown: dropDown?.map((i) => i.value),
    purposeOfDisclosure,
    companyName,
    expirationFrom,
    expirationTo,
    revocation,
    specify,
    signature,
    dateSigned,
    relationshipToPerson,
    signedTime: timeSigned,
    saveAsDraft,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    signatures,
    signers,
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    patientChartService.authorization.update(
      id || detail?.data[0]?._id,
      payload,
      { setLoading, navigate },
    );
  };
  useEffect(() => {
    patientChartService.authorization.getById(id, { setResponse: setDetail });
  }, [id, url]);
  useEffect(() => {
    if (detail && url === "/create-authorization-resident") {
      if (detail?.data?.length > 0) {
        const item = detail.data;
        setPatientId(item[0]?.patientId);
        setResidentName(item[0]?.residentName);
        setDateOfBirth(item[0]?.dateOfBirth);
        setAhcccsId(item[0]?.patientId?.ahcccsId);
        setDiagnosis(item[0]?.patientId?.diagnosis);
        setAuthorizedPersonName(item[0]?.authorizedPersonName);
        setAuthorizedPersonAgency(item[0]?.authorizedPersonAgency);
        setAuthorizedPersonAddress(item[0]?.authorizedPersonAddress);
        setAuthorizedPersonPhone(item[0]?.authorizedPersonPhone);
        setAuthorizedPersonFax(item[0]?.authorizedPersonFax);
        setAuthorizedPersonEmail(item[0]?.authorizedPersonEmail);
        setCompanyName(item[0]?.companyName);
        setRevocation(item[0]?.revocation);
        setExpirationTo(item[0]?.expirationTo);
        setSpecify(item[0]?.specify);
        setSignature(item[0]?.signature);
        setDateSigned(item[0]?.dateSigned);
        setRelationshipToPerson(item[0]?.relationshipToPerson);
        setAdminSignature(item[0]?.adminSignature);
        setAdminDateSigned(item[0]?.adminDateSigned);
        setAdminSignedTime(item[0]?.adminSignedTime);
        if (item[0]?.signatures) {
          loadSignaturesFromApi(item[0].signatures);
        }
        if (item[0]?.dropDown) {
          const uniqueMoods = new Set([...item[0]?.dropDown]);
          const uniqueMoodArray = Array.from(uniqueMoods)?.map((moodItem) => ({
            value: moodItem,
            label: moodItem,
          }));
          setDropDown(uniqueMoodArray);
        }
        setPurposeOfDisclosure(item[0]?.purposeOfDisclosure);
        setTimeSigned(item[0]?.signedTime);
        setDateSigned(item[0]?.dateSigned);
        setSigners(item[0]?.signers);
      }
    } else if (detail) {
      const item = detail.data;
      if (item) {
        setPatientId(item.patientId);
        setResidentName(item.residentName);
        setDateOfBirth(item?.patientId?.dateOfBirth);
        setAhcccsId(item?.patientId?.ahcccsId);
        setDiagnosis(item?.patientId?.diagnosis);
        setAuthorizedPersonName(item.authorizedPersonName);
        setAuthorizedPersonAgency(item.authorizedPersonAgency);
        setAuthorizedPersonAddress(item.authorizedPersonAddress);
        setAuthorizedPersonPhone(item.authorizedPersonPhone);
        setAuthorizedPersonFax(item.authorizedPersonFax);
        setAuthorizedPersonEmail(item.authorizedPersonEmail);
        setCompanyName(item.companyName);
        setRevocation(item.revocation);
        setExpirationTo(item.expirationTo);
        setSpecify(item.specify);
        setSignature(item.signature);
        setDateSigned(item.dateSigned);
        setRelationshipToPerson(item.relationshipToPerson);
        setAdminSignature(item?.adminSignature);
        setAdminDateSigned(item?.adminDateSigned);
        setAdminSignedTime(item?.adminSignedTime);
        if (item.signatures) {
          loadSignaturesFromApi(item.signatures);
        }
        if (item.dropDown) {
          const uniqueMoods = new Set([...dropDown, ...item.dropDown]);
          const uniqueMoodArray = Array.from(uniqueMoods)?.map((moodItem) => ({
            value: moodItem,
            label: moodItem,
          }));
          setDropDown(uniqueMoodArray);
        }
        setPurposeOfDisclosure(item.purposeOfDisclosure);
        setTimeSigned(item.signedTime);
        setSigners(item.signers);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail, url]);
  useEffect(() => {
    if (profileInfo) {
      const company =
        profileInfo?.userType === ROLES.ADMIN
          ? profileInfo?.companyName
          : profileInfo?.adminId?.companyName;
      if (company && !companyName) {
        setCompanyName(company);
      }
    }
  }, [profileInfo, companyName]);
  useEffect(() => {
    if (!detail?.data) return;
    if (detail?.data) {
      const { saveAsDraft, signers } = detail.data;
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
          ).includes("ari") &&
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
          ).includes("ari") &&
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
          ).includes("ari") &&
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
      signature?.length > 0;
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
    detail?.data?.employeeId,
    signature?.length,
    hasAnyPenSig,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [signature, adminSignature, id, checkSign, hasAnyPenSig]);
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
      setTimeSigned(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };
  return (
    <>
      {typedGuardDialog}
      <AddSignature
        show={open}
        setValue={(sign) =>
          detail?.data?.employeeId === profileInfo?._id
            ? setSignature(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          detail?.data?.employeeId === profileInfo?._id
            ? setDateSigned(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          detail?.data?.employeeId === profileInfo?._id
            ? setTimeSigned(time)
            : editTimeHandler(time)
        }
      />
      <NavWrapper
        title={"Authorization for Release of information"}
        isArrow={true}
      />

      <Container className="full-width-container">
        <Form
          onSubmit={submitHandler}
          className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
          <Row className="mb-2">
            <Col xs={12} md={12} lg={12}>
              <Form.Label className="fw-bold">Resident’s Name :</Form.Label>
              <Form.Label>{residentName}</Form.Label>
            </Col>
          </Row>

          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
                  <Form.Control
                    onChange={(e) => setAhcccsId(e.target.value)}
                    value={ahcccsId}
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    type="text"
                    disabled
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Date of Birth</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(dateOfBirth)}
                    disabled
                    onChange={(selectedDate) =>
                      setDateOfBirth(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          dateOfBirth
                            ? formatDateToMMDDYYYY(dateOfBirth)
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
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Diagnosis (specify if new or continuing)
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setDiagnosis(e.target.value)}
                    value={diagnosis}
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    type="text"
                    disabled
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={12} lg={12}>
                <div className="d-sm-flex align-items-center">
                  <Form.Label className="mb-0">Authorize</Form.Label>
                  <span
                    className={`d-inline-block mx-1 border-b border-black text-sm`}
                  >
                    {profileInfo?.userType === ROLES.ADMIN
                      ? profileInfo?.companyName
                      : profileInfo?.adminId?.companyName}
                  </span>
                  <Form.Label className="mb-0">
                    {" "}
                    to release the information described below to:
                  </Form.Label>{" "}
                </div>
              </Col>
            </Row>
          </Card>
          <Form.Label className="fw-bold">
            Person and Agency (recipient)
          </Form.Label>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Facility Address</Form.Label>
                  <Form.Control
                    onChange={(e) => setAuthorizedPersonAddress(e.target.value)}
                    value={authorizedPersonAddress}
                    type="text"
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    disabled
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Phone</Form.Label>
                  <Form.Control
                    onChange={(e) => setAuthorizedPersonPhone(e.target.value)}
                    value={authorizedPersonPhone}
                    type="number"
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    disabled={url === "/create-authorization-resident"}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Fax</Form.Label>
                  <Form.Control
                    onChange={(e) => setAuthorizedPersonFax(e.target.value)}
                    value={authorizedPersonFax}
                    type="text"
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    disabled={url === "/create-authorization-resident"}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Email</Form.Label>
                  <Form.Control
                    onChange={(e) => setAuthorizedPersonEmail(e.target.value)}
                    value={authorizedPersonEmail}
                    type="email"
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    disabled={url === "/create-authorization-resident"}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Agency Name</Form.Label>
                  <Form.Control
                    onChange={(e) => setAuthorizedPersonAgency(e.target.value)}
                    value={authorizedPersonAgency}
                    type="text"
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    disabled={url === "/create-authorization-resident"}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Notice to Recipient
                  </Form.Label>
                  <p className="mb-0 text-sm">
                    This information has been disclosed to you from records that
                    Federal law protects. These records are not subject to re
                    disclosure. Federal regulations (42 CFR Part 2) prohibit you
                    from making further disclosure of Substance Abuse
                    Information without this specific written consent of the
                    person to whom it pertains, or as otherwise permitted by
                    such regulations. A general authorization for the release of
                    medical or other information is not sufficient for this
                    purpose.
                  </p>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    I authorize to release the following Information below:
                  </Form.Label>
                  <MultiSelect
                    disabled={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? true
                        : false
                    }
                    setValue={setDropDown}
                    value={dropDown}
                    options={authorizeOptions}
                    overrideStrings={{
                      selectSomeItems: "Select...",
                      allItemsAreSelected: dropDown
                        .map((item) => item.label)
                        .join(", "),
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Purpose of Disclosure:
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setPurposeOfDisclosure(e.target.value)}
                    value={purposeOfDisclosure}
                    type="text"
                    disabled={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? true
                        : false
                    }
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Label>
                  I understand that at anytime, I may revoke this authorization
                  by writing to{" "}
                  {`${profileInfo?.userType === ROLES.ADMIN ? profileInfo?.companyName : profileInfo?.adminId?.companyName}`}{" "}
                  .This revocation will be effective except to the extent that
                  has already been taken. This authorization for release of
                  information will expire :
                </Form.Label>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12}>
                <label className="mx-1 inline text-wrap text-sm">
                  One year from date
                </label>

                <DatePicker
                  selected={formatDateToMMDDYYYY(expirationTo)}
                  onChange={(selectedDate) =>
                    setExpirationTo(selectedDate?.toDateString())
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  className="form-control w-auto mx-3"
                  disabled={
                    profileInfo?.userType === ROLES.PATIENT ||
                    profileInfo?.userType === ROLES.GUARDIAN
                      ? true
                      : false
                  }
                  highlightDates={[
                    {
                      "react-datepicker__day--highlighted-custom": [
                        expirationTo
                          ? formatDateToMMDDYYYY(expirationTo)
                          : new Date(),
                      ],
                    },
                  ]}
                />

                <label className="inline text-wrap text-sm">
                  60 Days (Substance Abuse Services)
                </label>

                <DatePicker
                  selected={formatDateToMMDDYYYY(revocation)}
                  onChange={(selectedDate) =>
                    setRevocation(selectedDate?.toDateString())
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  className="form-control w-auto mx-3"
                  disabled={
                    profileInfo?.userType === ROLES.PATIENT ||
                    profileInfo?.userType === ROLES.GUARDIAN
                      ? true
                      : false
                  }
                  highlightDates={[
                    {
                      "react-datepicker__day--highlighted-custom": [
                        revocation
                          ? formatDateToMMDDYYYY(revocation)
                          : new Date(),
                      ],
                    },
                  ]}
                />
                <br />
                <label className="inline text-wrap text-sm">
                  Other (specify)
                </label>
                <BorderlessInput
                  setState={setSpecify}
                  value={specify}
                  type="text"
                  className="w-auto mx-3"
                  disabled={
                    profileInfo?.userType === ROLES.PATIENT ||
                    profileInfo?.userType === ROLES.GUARDIAN
                      ? true
                      : false
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Label>
                  By signing below, I acknowledge that I have read and
                  understand this document. I have given authorization to my
                  provider to disclose my records. I understand that my
                  information being disclosed to the receiving agency may no
                  longer be protected under the terms of this agreement.
                </Form.Label>
              </Col>
            </Row>
          </Card>

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
              signerNameOverride={residentName || ""}
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

          <Row
            className={`${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
          >
            <Col xs={12} md={12} lg={6}>
              <Button
                type="button"
                className="theme-button"
                onClick={() => setOpen(true)}
              >
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} md={12} lg={6}>
              {signatureFormat({
                sign: signature,
                date: dateSigned,
                time: timeSigned,
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
                  signer.signature &&
                  signatureFormat({
                    sign: signer.signature,
                    date: signer.dateSigned,
                    time: signer.signedTime,
                    hoursFormat,
                  }),
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div className="employee-btn-joiner mt-5">
                {detail?.data?.saveAsDraft && (
                  <button
                    className={`draft ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                    type="submit"
                    onClick={() => setSaveAsDraft(true)}
                  >
                    Save as Draft
                  </button>
                )}
                <button
                  className={`employee_create_btn ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
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
  Wcomponenet: UpdateAuthorization,
});
