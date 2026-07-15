/* eslint-disable no-unused-vars */
/** @format */

import React, { useCallback, useEffect, useState } from "react";
import "./Personal.css";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import { ClipLoader } from "react-spinners";
import { employmentService } from "@/features/shared/services";
import { getData } from "@/features/shared/services";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EmployeeComponent from "@/features/shared/ui/Search/EmployeeComponent";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";

import { ROLES } from "@/features/shared/constants";

const Personal = () => {
  const navigate = useNavigate();
  const userProfil = useSelector(userProfile);
  const hoursFormat = userProfil?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const { employeeId: employeeIdParams } = useParams();
  const location = useLocation().pathname;
  const [data, setData] = useState({});
  const [date, setDate] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [socSecNo, setSocSecNo] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [telephoneHome, setTelephoneHome] = useState("");
  const [telephonePersonalCell, setTelephonePersonalCell] = useState("");
  const [telephoneWork, setTelephoneWork] = useState("");
  const [telephoneBusinessCell, setTelephoneBusinessCell] = useState("");
  const [dLStateOfIssue, setDLStateOfIssue] = useState("");
  const [dLNumber, setDLNumber] = useState("");
  const [dLExpirationDate, setDLExpirationDate] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactRelationship, setEmergencyContactRelationship] =
    useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [savedSigned, setSavedSigned] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signatureDate, setSignatureDate] = useState("");
  const [signatureTime, setSignatureTime] = useState("");
  const [signers, setSigners] = useState([]);
  const [employeeId, setEmployeeId] = useState(employeeIdParams);
  const [employeeData, setEmployeeData] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const resetStates = () => {
    setData({});
    setDate("");
    setLastName("");
    setFirstName("");
    setMiddleInitial("");
    setAddressStreet("");
    setAddressCity("");
    setAddressState("");
    setAddressZip("");
    setSocSecNo("");
    setBirthDate("");
    setTelephoneHome("");
    setTelephonePersonalCell("");
    setTelephoneWork("");
    setTelephoneBusinessCell("");
    setDLStateOfIssue("");
    setDLNumber("");
    setDLExpirationDate("");
    setBusinessEmail("");
    setPersonalEmail("");
    setEmergencyContactName("");
    setEmergencyContactRelationship("");
    setEmergencyContactNumber("");
    setSavedSigned("");
    setOpen(false);
    setLoading(false);
    setSignatureDate("");
    setSignatureTime("");
    setSigners([]);
  };

  const payload = {
    date,
    lastName,
    firstName,
    middleInitial,
    addressStreet,
    addressCity,
    addressState,
    addressZip,
    socSecNo,
    birthDate,
    telephoneHome,
    telephonePersonalCell,
    telephoneWork,
    telephoneBusinessCell,
    dLStateOfIssue,
    dLNumber,
    dLExpirationDate,
    businessEmail,
    personalEmail,
    emergencyContactName,
    emergencyContactRelationship,
    emergencyContactNumber,
    savedSigned,
    signatureDate,
    signatureTime,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    saveAsDraft: false,

    ...(employeeIdParams
      ? { signers }
      : {
          signers: signers?.map((signer) => ({
            signerId: signer.value,
            name: signer.label,
            signature: "",
            dateSigned: "",
            signedTime: "",
          })),
        }),
  };

  useEffect(() => {}, [employeeIdParams]);

  const submitHandler = (e) => {
    e.preventDefault();
    employmentService.createPersonalInfo(payload, {
      employeeId,
      setLoading,
      navigate,
    });
  };

  useEffect(() => {
    getData(
      setData,
      employeeId
        ? `admin/getPersonalInformation/${employeeId}`
        : "employee/getPersonalInformation",
    );
  }, [employeeId]);
  useEffect(() => {
    if (userProfil.userType === ROLES.EMPLOYEE && data?.data?.length > 0) {
      const item = data?.data;
      setFirstName(item[0]?.firstName);
      setLastName(item[0]?.lastName);
      setMiddleInitial(item[0]?.middleInitial);
      setDate(item[0]?.date);
      setAddressStreet(item[0]?.addressStreet);
      setAddressCity(item[0]?.addressCity);
      setAddressState(item[0]?.addressState);
      setAddressZip(item[0]?.addressZip);
      setSocSecNo(item[0]?.socSecNo);
      setBirthDate(item[0]?.birthDate);
      setTelephoneHome(item[0]?.telephoneHome);
      setTelephonePersonalCell(item[0]?.telephonePersonalCell);
      setTelephoneWork(item[0]?.telephoneWork);
      setTelephoneBusinessCell(item[0]?.telephoneBusinessCell);
      setDLStateOfIssue(item[0]?.dLStateOfIssue);
      setDLNumber(item[0]?.dLNumber);
      setDLExpirationDate(item[0]?.dLExpirationDate);
      setBusinessEmail(item[0]?.businessEmail);
      setPersonalEmail(item[0]?.personalEmail);
      setEmergencyContactName(item[0]?.emergencyContactName);
      setEmergencyContactRelationship(item[0]?.emergencyContactRelationship);
      setEmergencyContactNumber(item[0]?.emergencyContactNumber);
      if (location !== "/create-personal-information") {
        setSavedSigned(item[0]?.savedSigned);
        setAdminSignature(item[0]?.adminSignature);
        setAdminDateSigned(item[0]?.adminDateSigned);
        setAdminSignedTime(item[0]?.adminSignedTime);
      }
      setSignatureDate(item[0]?.signatureDate);
      setSignatureTime(item[0]?.signatureTime);
      setSigners(item[0]?.signers);
      setEmployeeData(item[0]?.employeeId);
    } else {
      if (userProfil.userType === ROLES.ADMIN) {
        const item = data?.data;
        setFirstName(item?.firstName);
        setLastName(item?.lastName);
        setMiddleInitial(item?.middleInitial);
        setDate(item?.date);
        setAddressStreet(item?.addressStreet);
        setAddressCity(item?.addressCity);
        setAddressState(item?.addressState);
        setAddressZip(item?.addressZip);
        setSocSecNo(item?.socSecNo);
        setBirthDate(item?.birthDate);
        setTelephoneHome(item?.telephoneHome);
        setTelephonePersonalCell(item?.telephonePersonalCell);
        setTelephoneWork(item?.telephoneWork);
        setTelephoneBusinessCell(item?.telephoneBusinessCell);
        setDLStateOfIssue(item?.dLStateOfIssue);
        setDLNumber(item?.dLNumber);
        setDLExpirationDate(item?.dLExpirationDate);
        setBusinessEmail(item?.businessEmail);
        setPersonalEmail(item?.personalEmail);
        setEmergencyContactName(item?.emergencyContactName);
        setEmergencyContactRelationship(item?.emergencyContactRelationship);
        setEmergencyContactNumber(item?.emergencyContactNumber);
        if (location !== "/create-personal-information") {
          setSavedSigned(item?.savedSigned);
          setSignatureDate(item?.signatureDate);
          setSignatureTime(item?.signatureTime);
          setAdminSignature(item?.adminSignature);
          setAdminDateSigned(item?.adminDateSigned);
          setAdminSignedTime(item?.adminSignedTime);
        }

        setSigners(item?.signers);
        setEmployeeData(item?.employeeId);
      }
    }
    if (data?.data?.length === 0) {
      resetStates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const checkSign = useCallback(async () => {
    let signerIndex = signers?.findIndex?.(
      (signer, i) => signer.signerId === userProfil._id,
    );
    let isSignerValid =
      signerIndex !== -1 && signers?.[signerIndex]?.signature?.length > 0;

    let isAdminConditionValid = userProfil.userType === ROLES.ADMIN;

    let isEmployeeConditionValid =
      (data?.data?.employeeId === userProfil?._id ||
        data?.data?.employeeId?._id === userProfil?._id) &&
      savedSigned?.length > 0;
    let signerGuadianIndex = signers?.findIndex?.((signer, i) =>
      userProfil.patientsAssigned?.includes(signer.signerId),
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
    userProfil.userType,
    userProfil._id,
    userProfil.patientsAssigned,
    data?.data?.employeeId,
    savedSigned?.length,
  ]);

  useEffect(() => {
    if (employeeId) {
      checkSign();
    }
  }, [savedSigned, adminSignature, checkSign, employeeId]);
  let signerIndex = signers?.findIndex?.(
    (signer, i) => signer.signerId === userProfil._id,
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
    if (signers?.[signerIndex]?.signerId === userProfil?._id) {
      setSignerSignature(sign);
    } else if (userProfil.userType === ROLES.EMPLOYEE) {
      setSavedSigned(sign);
    } else if (userProfil.userType === ROLES.ADMIN) {
      setAdminSignature(sign);
    }
  };
  const editDateHandler = (date) => {
    if (signers?.[signerIndex]?.signerId === userProfil?._id) {
      setSignerDate(date);
    } else if (userProfil.userType === ROLES.EMPLOYEE) {
      setSignatureDate(date);
    } else if (userProfil.userType === ROLES.ADMIN) {
      setAdminDateSigned(date);
    }
  };
  const editTimeHandler = (time) => {
    if (signers?.[signerIndex]?.signerId === userProfil?._id) {
      setSignerTime(time);
    } else if (userProfil.userType === ROLES.EMPLOYEE) {
      setSignatureTime(time);
    } else if (userProfil.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };

  return (
    <>
      <AddSignature
        show={open}
        setValue={(sign) =>
          data?.data?.employeeId === userProfil?._id
            ? setSavedSigned(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          data?.data?.employeeId === userProfil?._id
            ? setSignatureDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          data?.data?.employeeId === userProfil?._id
            ? setSignatureTime(time)
            : editTimeHandler(time)
        }
      />

      <NavWrapper title={"Personal Information"} isArrow={true} />

      <Container>
        <Form onSubmit={submitHandler}>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Date:</Form.Label>
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
            </Row>
          </Card>
          <Card body className="mb-3">
            <Row>
              {userProfil.userType === ROLES.ADMIN && !employeeIdParams ? (
                <Col xs={12} md={4} lg={4}>
                  <EmployeeComponent
                    className={"grid-item"}
                    MainPatientId={setEmployeeId}
                    setWholeData={setEmployeeData}
                    MainResidentName={setEmployeeName}
                  />
                </Col>
              ) : (
                <>
                  <Col xs={12} md={4} lg={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">First Name</Form.Label>
                      <Form.Control
                        type={"text"}
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                      ></Form.Control>
                    </Form.Group>{" "}
                  </Col>
                  <Col xs={12} md={4} lg={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Last Name</Form.Label>
                      <Form.Control
                        type={"text"}
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </>
              )}
              <Col xs={12} md={4} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">MI</Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) => setMiddleInitial(e.target.value)}
                    value={middleInitial}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Form.Label className="fw-bold">Address Details</Form.Label>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Street</Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) => setAddressStreet(e.target.value)}
                    value={addressStreet}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">City</Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) => setAddressCity(e.target.value)}
                    value={addressCity}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">State</Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) => setAddressState(e.target.value)}
                    value={addressState}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Zip</Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) => setAddressZip(e.target.value)}
                    value={addressZip}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Soc Sec No</Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) => setSocSecNo(e.target.value)}
                    value={socSecNo}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Birth Date</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(birthDate)}
                    onChange={(selectedDate) =>
                      setBirthDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          birthDate
                            ? formatDateToMMDDYYYY(birthDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Telephone</Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9-]*$/.test(value)) {
                        setTelephoneHome(value);
                      }
                    }}
                    value={telephoneHome}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Personal Cell</Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9-]*$/.test(value)) {
                        setTelephonePersonalCell(value);
                      }
                    }}
                    value={telephonePersonalCell}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Work</Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) => setTelephoneWork(e.target.value)}
                    value={telephoneWork}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Business Cell</Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9-]*$/.test(value)) {
                        setTelephoneBusinessCell(value);
                      }
                    }}
                    value={telephoneBusinessCell}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Form.Label className="fw-bold">Driver’s License</Form.Label>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">State of Issue</Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) => setDLStateOfIssue(e.target.value)}
                    value={dLStateOfIssue}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">No</Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) => setDLNumber(e.target.value)}
                    value={dLNumber}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Expiration Date</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(dLExpirationDate)}
                    onChange={(selectedDate) =>
                      setDLExpirationDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          dLExpirationDate
                            ? formatDateToMMDDYYYY(dLExpirationDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Business Email</Form.Label>
                  <Form.Control
                    type={"email"}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    value={businessEmail}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Personal Email</Form.Label>
                  <Form.Control
                    type={"email"}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    value={personalEmail}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Emergency Contact Name
                  </Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    value={emergencyContactName}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Relationship</Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) =>
                      setEmergencyContactRelationship(e.target.value)
                    }
                    value={emergencyContactRelationship}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Emergency Contact Phone
                  </Form.Label>
                  <Form.Control
                    type={"text"}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9-]*$/.test(value)) {
                        setEmergencyContactNumber(value);
                      }
                    }}
                    value={emergencyContactNumber}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Row>
            <Col xs={12} lg={6}>
              <Button
                type="button"
                className="theme-button"
                onClick={() => setOpen(true)}
              >
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} lg={6}>
              {savedSigned &&
                signatureFormat({
                  sign: savedSigned,
                  date: signatureDate,
                  time: signatureTime,
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
          <Row className="mt-3">
            <Col xs={12}>
              {data?.data === undefined && (
                <div className="hidePrint">
                  <Form.Label className="fw-bold">Signers:</Form.Label>
                  <MultiEmployee setValue={setSigners} value={signers} />
                </div>
              )}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12}>
              <button
                className="employee_create_btn mt-2 mt-md-5"
                type="submit"
                disabled={
                  employeeId
                    ? !isSubmitEnabled
                    : userProfil?.userType === ROLES.ADMIN
                      ? false
                      : savedSigned?.length === 0
                }
              >
                {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
              </button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default HOC({ Wcomponenet: Personal });
