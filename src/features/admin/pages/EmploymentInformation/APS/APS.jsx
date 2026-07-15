/* eslint-disable no-unused-vars */
/** @format */

import React from "react";
import { useState } from "react";
import { Container, Card, Form, Row, Col, Button } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import { ClipLoader } from "react-spinners";
import { employmentService } from "@/features/shared/services";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import EmployeeComponent from "@/features/shared/ui/Search/EmployeeComponent";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ROLES } from "@/features/shared/constants";
const APS = () => {
  const profileDetail = useSelector(userProfile);
  const navigate = useNavigate();
  const hoursFormat = profileDetail?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [date, setDate] = useState("");
  const [classification, setClassification] = useState(false);
  const [dateOfIncident, setDateOfIncident] = useState("");
  const [noRecordFound, setNoRecordFound] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeeDate, setEmployeeDate] = useState("");
  const [employeeTime, setEmplyeeTime] = useState("");
  const [saveAsDraft, setSaveASDraft] = useState(false);
  const [signers, setSigners] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const options = [
    {
      label: "Yes",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
  ];
  const payload = {
    employeeName: `${profileDetail?.firstName} ${profileDetail?.lastName}`,
    employeeSignature,
    employeeDate,
    employeeId,
    employeeTime,
    date,
    dateOfIncident,
    noRecordFound,
    classification: classification === "true" ? true : false,
    saveAsDraft,
    signers: signers.map((signer) => ({
      signerId: signer.value,
      name: signer.label,
      signature: "",
      dateSigned: "",
      signedTime: "",
    })),
  };
  const submitHandler = (e) => {
    e.preventDefault();
    employmentService.aps.create(payload, { setLoading, navigate });
  };
  const currentUser = useSelector(userProfile);
  const companyName =
    currentUser?.userType === ROLES.ADMIN
      ? currentUser?.companyName
      : currentUser?.adminId?.companyName;
  return (
    <>
      <AddSignature
        show={open}
        setValue={setEmployeeSignature}
        setTime={setEmplyeeTime}
        setDate={setEmployeeDate}
      />

      <NavWrapper title="APS Consent" isArrow={true} />

      {true && (
        <Container>
          <Form onSubmit={submitHandler}>
            <Row className="mb-2">
              <Col xs={12}>
                {currentUser?.userType === ROLES.ADMIN && (
                  <EmployeeComponent
                    MainPatientId={setEmployeeId}
                    setWholeData={setEmployeeData}
                    MainResidentName={setEmployeeName}
                  />
                )}
              </Col>
            </Row>
            <Card body className="mb-3">
              <Row>
                <Col xs={12}>
                  <Form.Label>
                    <span className="fw-bold">{companyName}</span> conducts
                    adult protective service search through the department of
                    health services APS search registry. These searches are
                    conducted randomly and also yearly thereafter.
                  </Form.Label>
                  <Form.Label>
                    a. Administrator will conduct a search on the APS registry
                    through he department of health services AZ Care Check using
                    employee’s first name, last name and date of birth. Search
                    results will fall into the following categories:
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      i. Record Found with (a) Classification
                    </Form.Label>
                    <Form.Select
                      onChange={(e) => setClassification(e.target.value)}
                      value={classification}
                    >
                      {options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">
                      (b) Date of the incident
                    </Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(dateOfIncident)}
                      onChange={(selectedDate) =>
                        setDateOfIncident(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            dateOfIncident
                              ? formatDateToMMDDYYYY(dateOfIncident)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      ii. APS Registry Record Found
                    </Form.Label>
                    <Form.Select
                      onChange={(e) => setNoRecordFound(e.target.value)}
                      value={noRecordFound}
                    >
                      {options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Card body className="mb-3">
              <Row>
                <Col xs={12}>
                  <Form.Label>
                    b. Employees or subcontractors shall be prohibited from
                    providing services to{" "}
                    <span className="fw-bold">{companyName}</span> residents if
                    the search of the APS Registry contains any substantiated
                    report of abuse, neglect, or exploitation of vulnerable
                    adults or children.
                  </Form.Label>
                  <Form.Label>
                    By Signing this, Employee gives{" "}
                    <span className="fw-bold">{companyName}</span> consent to
                    conduct a search on the AZ Department of Health APS search
                    registry
                  </Form.Label>
                </Col>
              </Row>
              <Row>
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
              </Row>
            </Card>

            <Row>
              <Col xs={12} lg={6}>
                <Form.Label className="fw-bold d-block">
                  Employee Signature{" "}
                </Form.Label>
                <Button
                  type="button"
                  className="theme-button"
                  onClick={() => setOpen(true)}
                >
                  SAVED AND SIGNED
                </Button>
              </Col>
              <Col xs={12} lg={6}>
                {signatureFormat({
                  sign: employeeSignature,
                  date: employeeDate,
                  time: employeeTime,
                  hoursFormat,
                })}
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Signers</Form.Label>
                  <MultiEmployee setValue={setSigners} value={signers} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3 mt-md-5">
              <Col xs={12}>
                <div className="employee-btn-joiner">
                  <button
                    className="draft"
                    type="submit"
                    onClick={() => setSaveASDraft(!saveAsDraft)}
                  >
                    Save as Draft
                  </button>

                  <button
                    className="employee_create_btn"
                    type="submit"
                    disabled={employeeSignature.length === 0}
                  >
                    {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      )}
    </>
  );
};
export default HOC({
  Wcomponenet: APS,
});
