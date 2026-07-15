/** @format */

import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import {
  createForRole,
  getData,
  patientChartService,
} from "@/features/shared/services";
import { BorderlessInput } from "@/utils/Makers";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { ClipLoader } from "react-spinners";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { authorizeOptions } from "@/features/shared/constants";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ROLES } from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
const CreateAuthorization = () => {
  const navigate = useNavigate();
  const profileUser = useSelector(userProfile);
  const hoursFormat = profileUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
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
  const [expirationTo, setExpirationTo] = useState("");
  const [residentSignature, setResidentSignature] = useState("");
  const [revocation, setRevocation] = useState("");
  const [specify, setSpecify] = useState("");
  const [signature, setSignature] = useState("");
  const [dateSigned, setDateSigned] = useState("");
  const [relationshipToPerson, setRelationshipToPerson] = useState("");
  const [witness, setWitness] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeSigned, setTimeSigned] = useState("");
  const [offerLetter, setOfferLetter] = useState({});
  const [patientDetail, setPatientDetail] = useState({});
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [signers, setSigners] = useState([]);
  const [data, setData] = useState([]);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [openAdmin, setAdminOpen] = useState(false);

  const { signatures, updateSignature } = useSignatures();
  const { dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });

  const hasTypedInForm = !!signature || !!adminSignature;

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

  useEffect(() => {
    if (patientId) {
      patientChartService.authorization.getByPatientId(patientId, {
        setResponse: setData,
        setLoading,
      });
    }
  }, [patientId, profileUser?.userType]);
  useEffect(() => {
    setAuthorizedPersonName(residentName);
  }, [residentName]);
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
      setAuthorizedPersonName(populateData?.authorizedPersonName);
      setAuthorizedPersonAgency(populateData?.authorizedPersonAgency);
      setAuthorizedPersonPhone(populateData?.authorizedPersonPhone);
      setAuthorizedPersonFax(populateData?.authorizedPersonFax);
      setAuthorizedPersonEmail(populateData?.authorizedPersonEmail);
      setCompanyName(populateData?.companyName);
      setRevocation(populateData?.revocation);
      setExpirationTo(populateData?.expirationTo);
      setSpecify(populateData?.specify);
      if (populateData?.dropDown) {
        const uniqueMoods = new Set([...populateData?.dropDown]);
        const uniqueMoodArray = Array.from(uniqueMoods)?.map((moodItem) => ({
          value: moodItem,
          label: moodItem,
        }));
        setDropDown(uniqueMoodArray);
      }
      setPurposeOfDisclosure(populateData?.purposeOfDisclosure);
    } else {
      setAuthorizedPersonAgency("");
      setAuthorizedPersonPhone("");
      setAuthorizedPersonFax("");
      setAuthorizedPersonEmail("");
      setCompanyName("");
      setRevocation("");
      setExpirationTo("");
      setResidentSignature("");
      setSpecify("");
      setSignature("");
      setDateSigned("");
      setRelationshipToPerson("");
      setWitness("");
      setDropDown([]);
      setPurposeOfDisclosure("");
      setTimeSigned("");
      setDateSigned("");
    }
  }, [data, patientId, profileUser._id]);
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
    residentSignature,
    expirationTo,
    revocation,
    specify,
    signature,
    dateSigned,
    relationshipToPerson,
    witness,
    signedTime: timeSigned,
    saveAsDraft,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    signatures,
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
    createForRole(
      profileUser?.userType === ROLES.ADMIN,
      "admin/create-authorization-for-release-of-information",
      "employee/createAuthorizationForReleaseOfInformation",
      payload,
      { setLoading, navigate, successMsg: "Created !" },
    );
  };
  useEffect(() => {
    if (profileUser) {
      const company =
        profileUser?.userType === ROLES.ADMIN
          ? profileUser?.companyName
          : profileUser?.adminId?.companyName;
      if (company && !companyName) {
        setCompanyName(company);
      }
    }
  }, [profileUser, companyName]);
  useEffect(() => {
    if (patientDetail) {
      setDateOfBirth(patientDetail?.dateOfBirth);
      setAhcccsId(patientDetail?.ahcccsId);
      setDiagnosis(patientDetail?.diagnosis);
      setAuthorizedPersonAddress(patientDetail?.facilityAddress || "");
    }
  }, [patientDetail]);
  return (
    <>
      {typedGuardDialog}
      <AddSignature
        show={open}
        setValue={setSignature}
        setDate={setDateSigned}
        setTime={setTimeSigned}
      />
      <AddSignature
        show={openAdmin}
        setValue={setAdminSignature}
        setDate={setAdminDateSigned}
        setTime={setAdminSignedTime}
      />
      <NavWrapper
        title={"Authorization for Release of information"}
        isArrow={true}
      />
      <Container className="full-width-container">
        <Form onSubmit={submitHandler}>
          <PatientComponent
            className="mb-2"
            MainPatientId={setPatientId}
            MainResidentName={setResidentName}
            setWholeData={setPatientDetail}
          />
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
                  <Form.Control
                    onChange={(e) => setAhcccsId(e.target.value)}
                    value={ahcccsId}
                    disabled
                    type="text"
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
                    className="form-control"
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
                <div className="mixed_input d-md-inline-flex view-value text-[14px]">
                  <label>Authorize</label>
                  <span className={`d-inline mx-1 border-b border-black`}>
                    {profileUser?.userType === ROLES.ADMIN
                      ? profileUser?.companyName
                      : profileUser?.adminId?.companyName}
                  </span>
                  <label>
                    {" "}
                    to release the information described below to:
                  </label>{" "}
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
                  <CustomMultiSelectInput
                    multiselect={true}
                    value={dropDown}
                    onChange={(value) => setDropDown(value)}
                    options={authorizeOptions}
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
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Label>
                  I understand that at anytime, I may revoke this authorization
                  by writing{" "}
                  {`${profileUser?.userType === ROLES.ADMIN ? profileUser?.companyName : profileUser?.adminId?.companyName}`}{" "}
                  .This revocation will be effective except to the extent that
                  action based on this authorization has already been taken.
                  This authorization for release of information will expire :
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
                  className="form-control"
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
                  className="form-control mx-1"
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
                  className="my-1 w-auto mx-3"
                  setState={setSpecify}
                  value={specify}
                  type="text"
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
          <Row className="mb-3">
            <Col xs={12} md={12} lg={12}>
              <Form.Label className="fw-bold">Employee Signature</Form.Label>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <Button
                type="button"
                className="theme-button"
                onClick={() =>
                  profileUser.userType === ROLES.ADMIN
                    ? setAdminOpen(true)
                    : setOpen(true)
                }
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
              signature={signatures.resident}
              onUpdate={updateSignature}
              signerNameOverride={residentName || ""}
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
            <SignatureSection
              role="witness"
              label="Witness Signature"
              variant="yellow"
              signature={signatures.witness}
              onUpdate={updateSignature}
              externalName
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
          </div>
          <Card className="mb-2 mb-md-3 mt-3">
            <Card.Body>
              <Row>
                <Col xs={12} md={12} lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Signers</Form.Label>
                    <MultiEmployee
                      setValue={setSigners}
                      value={signers}
                      alsoResident
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div className="employee-btn-joiner mt-5">
                <button
                  className="draft"
                  type="submit"
                  onClick={() => setSaveAsDraft(!saveAsDraft)}
                >
                  Save as Draft
                </button>

                <button
                  className="employee_create_btn"
                  type="submit"
                  disabled={
                    witnessIncomplete
                      ? true
                      : profileUser?.userType === ROLES.ADMIN
                        ? false
                        : signature?.length === 0
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
  Wcomponenet: CreateAuthorization,
});
