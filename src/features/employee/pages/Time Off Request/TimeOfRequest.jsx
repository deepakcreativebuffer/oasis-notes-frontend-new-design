/* eslint-disable no-unused-vars */
/** @format */
import { Container, Form, Card, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { timeOffService } from "@/features/shared/services";
import { TextareaMaker } from "@/utils/Makers";
import { getData } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  AddSignature,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import EmployeeComponent from "@/features/shared/ui/Search/EmployeeComponent";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";

import { ROLES } from "@/features/shared/constants";

const TimeOfRequest = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(userProfile);
  const hoursFormat = currentUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [beginDate, setBeginDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [normalShift, setNormalShift] = useState("");
  const [unPaidHrLeft, setUnPaidHrLeft] = useState("");
  const [vacationPersonTimeUsed, setVacationPersonTimeUsed] = useState("");
  const [sickTimeUsed, setSickTimeUsed] = useState("");
  const [notes, setNotes] = useState("");
  const [requestType, setRequestType] = useState("PTO");
  const [signature, setSignature] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [timeOf, setTimeOf] = useState(false);
  const [signatureDate, setSignatureDate] = useState("");
  const [signatureTime, setSignatureTime] = useState("");
  const [signatureSaveAsDraft, setSgnatureSaveAsDraft] = useState(false);
  const [signers, setSigners] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeData, setEmployeeData] = useState("");

  const payload = {
    beginDate,
    endDate,
    normalShift,
    unPaidHrLeft,
    vacationPersonTimeUsed,
    sickTimeUsed,
    notes,
    requestType,
    signature,
    employeeId,
    signatureDate,
    signatureTime,
    signatureSaveAsDraft,
    signers: signers?.map((signer) => ({
      signerId: signer.value,
      name: signer.label,
      signature: "",
      dateSigned: "",
      signedTime: "",
    })),
  };

  useEffect(() => {
    getData(setProfile, `employee/getProfile`);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    await timeOffService.createRequest(payload, { setLoading, navigate });
    setBeginDate("");
    setEndDate("");
    setNormalShift("");
    setUnPaidHrLeft("");
    setVacationPersonTimeUsed("");
    setSickTimeUsed("");
    setNotes("");
    setSignature("");
  };

  return (
    <>
      <AddSignature
        show={open}
        setValue={setSignature}
        setDate={setSignatureDate}
        setTime={setSignatureTime}
      />
      <NavWrapper title={"Time of Request"} isArrow={true} />
      <Container>
        <div className="therapy-notes-multiple-radio-wb mb-3">
          <div className="main">
            <Form.Check type={"radio"}>
              <Form.Check.Input
                name="behaviorTech"
                type={"radio"}
                isValid
                id={"PTO"}
                value={"PTO"}
                checked={requestType === "PTO"}
                onChange={(e) => setRequestType(e.target.value)}
              />
              <Form.Check.Label htmlFor="PTO">PTO REQUEST</Form.Check.Label>
            </Form.Check>
          </div>
          <div className="main">
            <Form.Check type={"radio"}>
              <Form.Check.Input
                name="behaviorTech"
                type={"radio"}
                isValid
                id={"SICKTIME"}
                value={"SICKTIME"}
                checked={requestType === "SICKTIME"}
                onChange={(e) => setRequestType(e.target.value)}
              />
              <Form.Check.Label htmlFor="SICKTIME">
                SICK TIME REQUEST
              </Form.Check.Label>
            </Form.Check>
          </div>
        </div>
        <Form onSubmit={submitHandler}>
          <Row>
            <Col xs={12}>
              {currentUser?.userType === ROLES.ADMIN ? (
                <EmployeeComponent
                  className="mb-2"
                  MainPatientId={setEmployeeId}
                  setWholeData={setEmployeeData}
                  MainResidentName={setEmployeeName}
                />
              ) : (
                <Form.Group className="mb-2">
                  <Form.Label className="fw-bold">Employee Name</Form.Label>
                  <Form.Control
                    className="pe-none"
                    value={fetchPaitentName(profile?.data)}
                  ></Form.Control>
                </Form.Group>
              )}
            </Col>
          </Row>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">
                    Begin Date requested
                  </Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(beginDate)}
                    onChange={(selectedDate) =>
                      setBeginDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          beginDate
                            ? formatDateToMMDDYYYY(beginDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">
                    End Date requested
                  </Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(endDate)}
                    onChange={(selectedDate) =>
                      setEndDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          endDate ? formatDateToMMDDYYYY(endDate) : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Normal Shift</Form.Label>
                  <Form.Control
                    onChange={(e) => setNormalShift(e.target.value)}
                    type={"text"}
                    value={normalShift}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Unpaid Hours left</Form.Label>
                  <Form.Control
                    onChange={(e) => setUnPaidHrLeft(e.target.value)}
                    type={"text"}
                    value={unPaidHrLeft}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Vacation/Personal time used
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setVacationPersonTimeUsed(e.target.value)}
                    type={"text"}
                    value={vacationPersonTimeUsed}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Sick Time used</Form.Label>
                  <Form.Control
                    onChange={(e) => setSickTimeUsed(e.target.value)}
                    type={"text"}
                    value={sickTimeUsed}
                  ></Form.Control>
                </Form.Group>
              </Col>

              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <TextareaMaker
                    label={"Notes"}
                    setValue={setNotes}
                    value={notes}
                    row={2}
                    placeholder=""
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Row>
            <Col xs={12} lg={6}>
              <Button
                type="button"
                onClick={() => setOpen(true)}
                className="theme-button hidePrint"
              >
                {" "}
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} lg={6}>
              {signatureFormat({
                sign: signature,
                date: signatureDate,
                time: signatureTime,
                hoursFormat,
              })}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12} lg={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Signers</Form.Label>
                <MultiEmployee setValue={setSigners} value={signers} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div className="employee-btn-joiner mt-2 mt-md-5">
                <button
                  className="draft"
                  type="submit"
                  onClick={() => setSgnatureSaveAsDraft(!signatureSaveAsDraft)}
                >
                  Save as Draft
                </button>

                <button
                  className="employee_create_btn"
                  type="submit"
                  disabled={signature?.length === 0}
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

export default HOC({ Wcomponenet: TimeOfRequest });
