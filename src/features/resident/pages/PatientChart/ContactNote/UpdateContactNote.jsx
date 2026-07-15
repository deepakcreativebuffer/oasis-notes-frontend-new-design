/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Card, Col, Container, Form, Row, Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { patientChartService } from "@/features/shared/services";
import { CheckBoxMaker } from "@/utils/Makers";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddSignature,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
const UpdateContactNote = () => {
  const profileInfo = useSelector(userProfile);
  const navigate = useNavigate();
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState("");
  const [guardian, setGuardian] = useState("");
  const [caseManager, setCaseManager] = useState("");
  const [pharmacy, setPharmacy] = useState("");
  const [familyMember, setFamilyMember] = useState("");
  const [doctorsOffice, setDoctorsOffice] = useState("");
  const [personContactedOther, setPersonContactedOther] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [textMessage, setTextMessage] = useState("");
  const [phoneCall, setPhoneCall] = useState("");
  const [inPerson, setInPerson] = useState("");
  const [modeOfContactOther, setModeOfContactOther] = useState("");
  const [contactSummaryNote, setContactSummaryNote] = useState("");
  const [emergencyIssue, setEmergencyIssue] = useState(true);
  const [loading, setLoading] = useState(false);
  const [savedSigned, setSavedSigned] = useState("");
  const [open, setOpen] = useState(false);
  const [savedTime, setSavedTime] = useState("");
  const [savedDate, setSavedDate] = useState("");
  const [details, setDetails] = useState({});
  const { id } = useParams();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [signers, setSigners] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfAdmission, setDateOfAdmission] = useState("");
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
  const fetchDetail = () => {
    patientChartService.contactNote.getById(id, { setResponse: setDetails });
  };
  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const payload = {
    patientId,
    residentName,
    guardian,
    caseManager,
    pharmacy,
    familyMember,
    doctorsOffice,
    personContactedOther,
    contactName,
    email,
    textMessage,
    phoneCall,
    contactSummaryNote,
    inPerson,
    modeOfContactOther,
    emergencyIssue,
    savedSigned,
    savedTime,
    savedDate,
    saveAsDraft,
    date,
    time,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    signers,
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const additionalFunctions = [fetchDetail];
    patientChartService.contactNote.update(id, payload, {
      setLoading,
      additionalFunctions,
      navigate,
    });
  };
  useEffect(() => {
    if (details) {
      const item = details?.data;
      setPatientId(item?.patientId?._id);
      setAhcccsId(item?.patientId?.ahcccsId);
      setDiagnosis(item?.patientId?.diagnosis);
      setResidentName(item?.residentName);
      setDateOfBirth(item?.patientId?.dateOfBirth);
      setDateOfAdmission(item?.patientId?.admitDate);
      setGuardian(item?.guardian);
      setCaseManager(item?.caseManager);
      setPharmacy(item?.pharmacy);
      setFamilyMember(item?.familyMember);
      setDoctorsOffice(item?.doctorsOffice);
      setPersonContactedOther(item?.personContactedOther);
      setContactName(item?.contactName);
      setTextMessage(item?.textMessage);
      setPhoneCall(item?.phoneCall);
      setInPerson(item?.inPerson);
      setModeOfContactOther(item?.modeOfContactOther);
      setContactSummaryNote(item?.contactSummaryNote);
      setEmergencyIssue(item?.emergencyIssue);
      setSavedSigned(item?.savedSigned);
      setSavedDate(item?.savedDate);
      setSavedTime(item?.savedTime);
      setDate(item?.date);
      setTime(item?.time);
      setEmail(item?.email);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setAdminSignedTime(item?.adminSignedTime);
      setSigners(item?.signers);
    }
  }, [details]);
  useEffect(() => {
    if (!details?.data) return;
    if (details?.data) {
      const { saveAsDraft, signers } = details.data;
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
          ).includes("cn") &&
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
          ).includes("cn") &&
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
          ).includes("cn") &&
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
    details?.data,
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
      (details?.data?.employeeId === profileInfo?._id ||
        details?.data?.employeeId?._id === profileInfo?._id) &&
      savedSigned?.length > 0;
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
    details?.data?.employeeId,
    savedSigned?.length,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [savedSigned, adminSignature, id, checkSign]);
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
      setAdminDateSigned(date);
    }
  };
  const editTimeHandler = (time) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerTime(time);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setSavedTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };
  return (
    <>
      <AddSignature
        show={open}
        setValue={(sign) =>
          details?.data?.employeeId === profileInfo?._id ||
          details?.data?.employeeId?._id === profileInfo?._id
            ? setSavedSigned(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          details?.data?.employeeId === profileInfo?._id ||
          details?.data?.employeeId?._id === profileInfo?._id
            ? setSavedDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          details?.data?.employeeId === profileInfo?._id ||
          details?.data?.employeeId?._id === profileInfo?._id
            ? setSavedTime(time)
            : editTimeHandler(time)
        }
      />
      <NavWrapper title={"Contact Note"} isArrow={true} />

      <Container className="full-width-container">
        <Form
          onSubmit={submitHandler}
          className={`w-100 text-start ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
          <Row>
            <Col xs={12}>
              <Form.Label className="fw-bold">
                Resident:{" "}
                {details?.data?.patientId &&
                  fetchPaitentName(details?.data?.patientId)}{" "}
              </Form.Label>
            </Col>
          </Row>
          <Card className="mb-2 mb-md-3">
            <Card.Body>
              <Row>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      onChange={(e) => {
                        setAhcccsId(e.target.value);
                      }}
                      value={ahcccsId}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">DOB</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(dateOfBirth)}
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
                            dateOfBirth
                              ? formatDateToMMDDYYYY(dateOfBirth)
                              : new Date(),
                          ],
                        },
                      ]}
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
              </Row>
            </Card.Body>
          </Card>
          <Card body className="mb-2 mb-md-3">
            <Row>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Diagnosis (specify if new or continuing)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    disabled
                    onChange={(e) => {
                      setDiagnosis(e.target.value);
                    }}
                    value={diagnosis}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Date</Form.Label>
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
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Time</Form.Label>

                  <CustomTimePicker
                    use24Hours={hoursFormat === "HH:mm"}
                    value={time ? parseTimeStringToDate(time) : null}
                    onChange={setTime}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Form.Label className="fw-bold">Person contacted</Form.Label>
          <Card body className="mb-2 mb-md-3">
            <Row>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Guardian</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setGuardian(e.target.value);
                    }}
                    value={guardian}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Case Manager</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setCaseManager(e.target.value);
                    }}
                    value={caseManager}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Pharmacy</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setPharmacy(e.target.value);
                    }}
                    value={pharmacy}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Family member</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setFamilyMember(e.target.value);
                    }}
                    value={familyMember}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Doctors office</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setDoctorsOffice(e.target.value);
                    }}
                    value={doctorsOffice}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Other</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setPersonContactedOther(e.target.value);
                    }}
                    value={personContactedOther}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Contact Name</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setContactName(e.target.value);
                    }}
                    value={contactName}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Form.Label className="fw-bold">Mode of contact</Form.Label>
          <Card body className="mb-2 mb-md-3">
            <Row>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Email</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    value={email}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Text message</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setTextMessage(e.target.value);
                    }}
                    value={textMessage}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Phone call</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setPhoneCall(e.target.value);
                    }}
                    value={phoneCall}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">In person</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setInPerson(e.target.value);
                    }}
                    value={inPerson}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Other, please specify
                  </Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setModeOfContactOther(e.target.value);
                    }}
                    value={modeOfContactOther}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Card body className="mb-2 mb-md-3">
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Contact Summary Note
                  </Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setContactSummaryNote(e.target.value);
                    }}
                    value={contactSummaryNote}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Emergency issue</Form.Label>
                  <div className="radio-inline">
                    <CheckBoxMaker
                      inline
                      setValue={setEmergencyIssue}
                      value={true}
                      label="yes"
                      id={"yes"}
                      checked={emergencyIssue}
                    />
                    <CheckBoxMaker
                      inline
                      setValue={setEmergencyIssue}
                      value={false}
                      label="No"
                      id={"no"}
                      checked={!emergencyIssue}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Row>
            <Col xs={12} md={6}>
              <Button
                type="button"
                className={`theme-button ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                onClick={() => setOpen(true)}
              >
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} md={6}>
              {signatureFormat({
                sign: savedSigned,
                date: savedDate,
                time: savedTime,
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
                  signer.signature && (
                    <div>
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

          <div className="employee-btn-joiner mt-5">
            {details?.data?.saveAsDraft && (
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
              disabled={!isSubmitEnabled}
            >
              {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
            </button>
          </div>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: UpdateContactNote,
});
