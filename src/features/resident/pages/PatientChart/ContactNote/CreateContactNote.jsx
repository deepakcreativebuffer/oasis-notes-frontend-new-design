/** @format */

import React, { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row, Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { CheckBoxMaker } from "@/utils/Makers";
import { createForRole, patientChartService } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import { ROLES } from "@/features/shared/constants";
const CreateContactNote = () => {
  const profileUser = useSelector(userProfile);
  const hoursFormat = profileUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [dateOfAdmission, setDateOfAdmission] = useState("");
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
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [date, setDate] = useState(formatDateToMMDDYYYY(new Date()));
  const [time, setTime] = useState("");
  const [signers, setSigners] = useState([]);
  const [data, setData] = useState([]);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [openAdmin, setAdminOpen] = useState(false);
  useEffect(() => {
    if (patientId) {
      patientChartService.contactNote.getByPatientId(patientId, {
        setResponse: setData,
        setLoading,
      });
    }
  }, [patientId, profileUser?.userType]);
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
      setGuardian(populateData?.guardian);
      setCaseManager(populateData?.caseManager);
      setPharmacy(populateData?.pharmacy);
      setFamilyMember(populateData?.familyMember);
      setDoctorsOffice(populateData?.doctorsOffice);
      setPersonContactedOther(populateData?.personContactedOther);
      setContactName(populateData?.contactName);
      setTextMessage(populateData?.textMessage);
      setPhoneCall(populateData?.phoneCall);
      setInPerson(populateData?.inPerson);
      setModeOfContactOther(populateData?.modeOfContactOther);
      setDate(populateData?.date?.slice(0, 10) || date);
      setTime(populateData?.time);
      setEmail(populateData?.email);
    } else {
      setGuardian("");
      setCaseManager("");
      setPharmacy("");
      setFamilyMember("");
      setDoctorsOffice("");
      setPersonContactedOther("");
      setContactName("");
      setTextMessage("");
      setPhoneCall("");
      setInPerson("");
      setModeOfContactOther("");
      setTime("");
      setEmail("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, patientId, profileUser._id]);
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
      "admin/create-contact-note",
      "employee/createContactNote",
      payload,
      { setLoading, navigate, successMsg: "Created !" },
    );
  };
  useEffect(() => {
    if (patientDetail) {
      setDateOfBirth(patientDetail?.dateOfBirth);
      setAhcccsId(patientDetail?.ahcccsId);
      setDateOfAdmission(patientDetail?.admitDate);
      setDiagnosis(patientDetail?.diagnosis);
    }
  }, [patientDetail]);
  return (
    <>
      <AddSignature
        show={open}
        setValue={setSavedSigned}
        setDate={setSavedDate}
        setTime={setSavedTime}
      />
      <AddSignature
        show={openAdmin}
        setValue={setAdminSignature}
        setDate={setAdminDateSigned}
        setTime={setAdminSignedTime}
      />
      <NavWrapper title={"Contact Note"} isArrow={true} />

      <Container className="full-width-container">
        <Form className="w-100 text-start" onSubmit={submitHandler}>
          <PatientComponent
            className={"mb-2"}
            MainPatientId={setPatientId}
            MainResidentName={setResidentName}
            setWholeData={setPatientDetail}
          />
          <Card className="mb-2 mb-md-3">
            <Card.Body>
              <Row>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
                    <Form.Control
                      disabled
                      type="text"
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
                <Form.Group className="mb-3  d-flex flex-column">
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
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12} md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Signers</Form.Label>
                <MultiEmployee setValue={setSigners} value={signers} />
              </Form.Group>
            </Col>
          </Row>

          <div className="employee-btn-joiner mt-5">
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
                profileUser?.userType === ROLES.ADMIN
                  ? false
                  : savedSigned?.length === 0
              }
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
  Wcomponenet: CreateContactNote,
});
