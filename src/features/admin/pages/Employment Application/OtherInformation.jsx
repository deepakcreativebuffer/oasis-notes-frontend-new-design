/* eslint-disable eqeqeq, no-unused-vars */
/** @format */

import React, { useEffect, useState } from "react";
import { Form, Container, Card, Row, Col, Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {
  adminPortalService,
  employmentService,
} from "@/features/shared/services";
import { RadioMaker } from "@/utils/Makers";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import DatePicker from "react-datepicker";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { useNavigateWithParams } from "@shared/hooks";
import { ROLES } from "@/features/shared/constants";
const OtherInformation = () => {
  const { navigateWithParams } = useNavigateWithParams();
  const navigate = useNavigate();
  const ProfileDetails = useSelector(userProfile);
  const { employeId } = useParams();
  const [militaryExperience, setMilitaryExperience] = useState(false);
  const [ifSpecialty, setIfSpeciality] = useState("");
  const [dateEntered, setDateEntered] = useState("");
  const [dateDischarged, setDateDischarged] = useState("");
  const [nationalGuard, setNationalGuard] = useState(false);
  const [validLicense, setValidLicense] = useState(false);
  const [driverLicenseNumber, setDriverLicenseNumber] = useState("");
  const [driverLicenseClass, setDriverLicenseClass] = useState("");
  const [driverLicenseStatusIssued, setDriverLicenseStatusIssued] =
    useState("");
  const [typingSkill, setTypingSkill] = useState(false);
  const [wordsPerMinute, setWordsPerMinute] = useState("");
  const [familiarWithMicrosoft, setFamiliarWithMicrosoft] = useState(false);
  const [otherSkill, setOtherSkill] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [company, setCompany] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [howLongYouKnow, setHowLongYouKnow] = useState("");
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState({});
  const [professionalReferences, setProfessionalRefrences] = useState([]);
  const refrencePayload = {
    name,
    address,
    company,
    phoneNumber,
    howLongYouKnow,
  };
  const addMore = () => {
    setProfessionalRefrences((prev) => [...prev, refrencePayload]);
    setName("");
    setAddress("");
    setCompany("");
    setPhoneNumber("");
    setHowLongYouKnow("");
  };
  const removePrefrence = (index) => {
    const filteredData = professionalReferences?.filter((_, i) => i != index);
    setProfessionalRefrences(filteredData);
  };
  const payload = {
    militaryExperience,
    ifSpecialty,
    dateEntered,
    dateDischarged,
    nationalGuard,
    validLicense,
    driverLicenseClass,
    driverLicenseNumber,
    driverLicenseStatusIssued,
    typingSkill,
    wordsPerMinute,
    familiarWithMicrosoft,
    otherSkill,
    professionalReferences,
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const additionalFunctions = [() => navigateWithParams("/acknowledgement")];
    employmentService.createEmployeeOtherInfo(payload, {
      setLoading,
      additionalFunctions,
    });
  };
  const updateSubmitHandle = async (e) => {
    e.preventDefault();
    const additionalFunctions = [
      () => navigate(`/acknowledgement/${employeId}`),
    ];
    adminPortalService.updateEmployeeOtherInfo(employeId, payload, {
      setLoading,
      additionalFunctions,
    });
  };
  useEffect(() => {
    employmentService.getOtherInfo({
      ...(ProfileDetails?.userType === ROLES.ADMIN ? { employeId } : {}),
      setResponse: setDetail,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (detail?.data) {
      setMilitaryExperience(detail?.data?.militaryExperience);
      setIfSpeciality(detail?.data?.ifSpecialty);
      setDateEntered(detail?.data?.dateEntered);
      setDateDischarged(detail?.data?.dateDischarged);
      setNationalGuard(detail?.data?.nationalGuard);
      setValidLicense(detail?.data?.validLicense);
      setDriverLicenseNumber(detail?.data?.driverLicenseNumber);
      setDriverLicenseClass(detail?.data?.driverLicenseClass);
      setDriverLicenseStatusIssued(detail?.data?.driverLicenseStatusIssued);
      setTypingSkill(detail?.data?.typingSkill);
      setWordsPerMinute(detail?.data?.wordsPerMinute);
      setFamiliarWithMicrosoft(detail?.data?.familiarWithMicrosoft);
      setOtherSkill(detail?.data?.otherSkill);
      setProfessionalRefrences(detail?.data?.professionalReferences);
    }
  }, [detail]);
  function dateFormation(date) {
    if (date) {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      return formattedDate;
    }
  }
  return (
    <>
      <NavWrapper
        isArrow={true}
        title={"Other Information"}
        filled={4}
        empty={1}
      />
      <Container className="full-width-container">
        <form onSubmit={employeId ? updateSubmitHandle : handleSubmit}>
          <Form.Label className="fw-bold">MILITARY EXPERIENCE</Form.Label>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    If yes, which speciality?
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setIfSpeciality(e.target.value)}
                    placeholder={""}
                    type={"text"}
                    value={ifSpecialty}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Date Entered:</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(dateEntered)}
                    onChange={(selectedDate) =>
                      setDateEntered(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          dateEntered
                            ? formatDateToMMDDYYYY(dateEntered)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Date Discharged:</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(dateDischarged)}
                    onChange={(selectedDate) =>
                      setDateDischarged(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          dateDischarged
                            ? formatDateToMMDDYYYY(dateDischarged)
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
                    Have you ever served in the armed forces?
                  </Form.Label>
                  <div className="radio-inline">
                    <RadioMaker
                      inline
                      name={"militaryExperience"}
                      setValue={setMilitaryExperience}
                      value={true}
                      id={"militaryExperience1"}
                      label={"Yes"}
                      checked={militaryExperience}
                    />
                    <RadioMaker
                      inline
                      name={"militaryExperience"}
                      setValue={setMilitaryExperience}
                      value={false}
                      id={"militaryExperience2"}
                      label={"No"}
                      checked={militaryExperience}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Are you currently a member of the national guard?
                  </Form.Label>
                  <div className="radio-inline">
                    <RadioMaker
                      inline
                      name={"nationalGuard"}
                      setValue={setNationalGuard}
                      value={true}
                      id={"nationalGuard1"}
                      label={"Yes"}
                      checked={nationalGuard}
                    />
                    <RadioMaker
                      inline
                      name={"nationalGuard"}
                      setValue={setNationalGuard}
                      value={false}
                      id={"nationalGuard2"}
                      label={"No"}
                      checked={nationalGuard}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Do you have a Valid Driver’s License?
                  </Form.Label>
                  <div className="radio-inline">
                    <RadioMaker
                      inline
                      name={"validLicense"}
                      setValue={setValidLicense}
                      value={true}
                      id={"validLicense1"}
                      label={"Yes"}
                      checked={validLicense}
                    />
                    <RadioMaker
                      inline
                      name={"validLicense"}
                      setValue={setValidLicense}
                      value={false}
                      id={"validLicense2"}
                      label={"No"}
                      checked={validLicense}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Driver’s License Number:
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setDriverLicenseNumber(e.target.value)}
                    placeholder={""}
                    type={"text"}
                    value={driverLicenseNumber}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Class:</Form.Label>
                  <Form.Control
                    onChange={(e) => setDriverLicenseClass(e.target.value)}
                    placeholder={""}
                    type={"text"}
                    value={driverLicenseClass}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">State Issued:</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setDriverLicenseStatusIssued(e.target.value)
                    }
                    placeholder={""}
                    type={"text"}
                    value={driverLicenseStatusIssued}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Form.Label className="fw-bold">
            {" "}
            FOR OFFICE POSITIONS ONLY{" "}
          </Form.Label>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Do you have typing skills on the computer?
                  </Form.Label>
                  <div className="radio-inline">
                    <RadioMaker
                      inline
                      name={"typingSkill"}
                      setValue={setTypingSkill}
                      value={true}
                      id={"typingSkill1"}
                      label={"Yes"}
                      checked={typingSkill}
                    />
                    <RadioMaker
                      inline
                      name={"typingSkill"}
                      setValue={setTypingSkill}
                      value={false}
                      id={"typingSkill2"}
                      label={"No"}
                      checked={typingSkill}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Words Per Minute:</Form.Label>
                  <Form.Control
                    onChange={(e) => setWordsPerMinute(e.target.value)}
                    placeholder={""}
                    type={"number"}
                    value={wordsPerMinute}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    {" "}
                    Are you familiar with using Microsoft Word, Microsoft Excel,
                    etc?
                  </Form.Label>
                  <div className="radio-inline">
                    <RadioMaker
                      inline
                      name={"familiarWithMicrosoft"}
                      setValue={setFamiliarWithMicrosoft}
                      value={true}
                      id={"familiarWithMicrosoft1"}
                      label={"Yes"}
                      checked={familiarWithMicrosoft}
                    />
                    <RadioMaker
                      inline
                      name={"familiarWithMicrosoft"}
                      setValue={setFamiliarWithMicrosoft}
                      value={false}
                      id={"familiarWithMicrosoft2"}
                      label={"No"}
                      checked={familiarWithMicrosoft}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Other skills:</Form.Label>
                  <Form.Control
                    onChange={(e) => setOtherSkill(e.target.value)}
                    placeholder={""}
                    type={"text"}
                    value={otherSkill}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>{" "}
          <Form.Label className="fw-bold">
            {" "}
            {professionalReferences?.length} PROFESSIONAL REFERENCES{" "}
          </Form.Label>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Full Name:</Form.Label>
                  <Form.Control
                    onChange={(e) => setName(e.target.value)}
                    placeholder={""}
                    type={"text"}
                    value={name}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Address:</Form.Label>
                  <Form.Control
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={""}
                    type={"text"}
                    value={address}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Company:</Form.Label>
                  <Form.Control
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={""}
                    type={"text"}
                    value={company}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Relationship/Phone No:
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={""}
                    type={"text"}
                    value={phoneNumber}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    How long have you known him/her?
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setHowLongYouKnow(e.target.value)}
                    placeholder={""}
                    type={"text"}
                    value={howLongYouKnow}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Row>
            <Col xs={12}>
              <Button
                size="sm"
                className="hidePrint"
                type="button"
                onClick={() => addMore()}
              >
                Add More
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {professionalReferences?.length > 0 && (
                <div className="mt-3 hidePrint">
                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>Address</th>
                        <th>Company</th>
                        <th>Relationship/Phone No</th>
                        <th>How long have you known him/her?</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {professionalReferences?.map((i, index) => (
                        <tr key={index}>
                          <td> {i.name} </td>
                          <td> {i.address} </td>
                          <td> {i.company} </td>
                          <td> {i.phoneNumber} </td>
                          <td> {i.howLongYouKnow} </td>
                          <td>
                            <Link
                              className="del-btn"
                              onClick={() => removePrefrence(index)}
                            >
                              {" "}
                              <i className="fa-solid fa-trash" />{" "}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div className="employee_btn_div view_btn">
                <button
                  className="employee_create_btn mt-3 mt-md-5"
                  type="submit"
                >
                  {loading ? <ClipLoader color="#fff" /> : "NEXT"}
                </button>
              </div>
            </Col>
          </Row>
        </form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: OtherInformation,
});
