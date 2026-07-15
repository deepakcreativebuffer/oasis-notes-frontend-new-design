/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Form, Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import NavWrapper from "@/utils/NavWrapper";
import { getAdminUsers } from "@/features/shared/services";
import DatePicker from "react-datepicker";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import { BorderlessInput } from "@/utils/Makers";
import { ClipLoader } from "react-spinners";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { adminDashboardService } from "@/features/shared/services";
import { useNavigate } from "react-router-dom";
import { ROLES } from "@/features/shared/constants";
const EmploymentTermination = () => {
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [disciplinaryAction, setDisciplinaryAction] = useState([]);
  const [copyProvidedTo, setCopyProvidedTo] = useState([]);
  const [rehireEligibility, setRehireEligibility] = useState(null);
  const [rehireDate, setRehireDate] = useState("");
  const [explanation, setExplanation] = useState("");
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [dateSigned, setDateSigned] = useState("");
  const [open, setOpen] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [allEmployes, setAllEmployes] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [terminationDate, setTerminationDate] = useState("");
  const [selectedVoluntary, setSelectedVoluntary] = useState([]);
  const [selectedInvoluntary, setSelectedInvoluntary] = useState([]);
  const [signers, setSigners] = useState([]);
  const [copyProvidedOther, setCopyProvidedOther] = useState("");
  const [savedAsDraft, setSavedAsDraft] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const voluntaryOptions = [
    {
      label: "Moved out of area",
      value: "Moved out of area",
    },
    {
      label: "No call no show",
      value: "No call no show",
    },
    {
      label: "Personal",
      value: "Personal",
    },
    {
      label: "Resigned without notice",
      value: "Resigned without notice",
    },
    {
      label: "Retired",
      value: "Retired",
    },
    {
      label: "Retirement",
      value: "Retirement",
    },
  ];
  const involuntaryOptions = [
    {
      label: "Contract Work ended",
      value: "Contract Work ended",
    },
    {
      label: "Laid off",
      value: "Laid off",
    },
    {
      label: "Policy Violation",
      value: "Policy Violation",
    },
    {
      label: "Poor Performance",
      value: "Poor Performance",
    },
    {
      label: "Transferred",
      value: "Transferred",
    },
    {
      label: "Absenteeism or Tardiness",
      value: "Absenteeism or Tardiness",
    },
    {
      label: "In Lieu of Discharge",
      value: "In Lieu of Discharge",
    },
    {
      label: "Job Abandonment",
      value: "Job Abandonment",
    },
  ];
  const handleCheckboxChange = (state, setState, value) => {
    setState(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value],
    );
  };
  const getAllEmployees = () => {
    getAdminUsers().then((res) => {
      const filteredData = (res.data || []).filter(
        (item) => item.userType === ROLES.EMPLOYEE,
      );
      setAllEmployes(filteredData);
    });
  };
  useEffect(() => {
    getAllEmployees();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      employeeId,
      date,
      hireDate,
      terminationDate,
      selectedVoluntary: selectedVoluntary?.map((elm) => elm.value),
      selectedInvoluntary: selectedInvoluntary?.map((elm) => elm.value),
      disciplinaryAction,
      copyProvidedTo,
      copyProvidedOther,
      rehireEligibility,
      rehireDate,
      explanation,
      savedAsDraft,
      employeeSignature,
      dateSigned,
      adminSignature,
      adminDateSigned,
      signers: signers.map((signer) => ({
        signerId: signer.value,
        name: signer.label,
        signature: "",
        dateSigned: "",
        signedTime: "",
      })),
    };
    adminDashboardService.createTermination(employeeId, formData, {
      setLoading,
      navigate,
    });
  };
  return (
    <>
      <AddSignature
        show={open}
        setValue={setEmployeeSignature}
        setDate={setDateSigned}
      />
      <AddSignature
        show={openAdmin}
        setValue={setAdminSignature}
        setDate={setAdminDateSigned}
      />
      <NavWrapper title={"Employee Termination"} isArrow={true} />
      <Container>
        <Form onSubmit={handleSubmit}>
          <Card className="mt-3">
            <Card.Body>
              <Row className="mb-3">
                <Col>
                  <Form.Label className="fw-bold">
                    Name of Terminated Employee
                  </Form.Label>
                  <Form.Select
                    required
                    onChange={(e) => setEmployeeId(e.target.value)}
                  >
                    <option value={""}>Select Employee</option>
                    {allEmployes?.map((item) => {
                      return (
                        <option value={item._id} key={item._id}>
                          {item.firstName} {item.lastName}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group className="d-flex flex-column">
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
                <Col md={4}>
                  <Form.Group className="d-flex flex-column">
                    <Form.Label className="fw-bold">Hire Date</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(hireDate)}
                      onChange={(selectedDate) =>
                        setHireDate(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            hireDate
                              ? formatDateToMMDDYYYY(hireDate)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="d-flex flex-column">
                    <Form.Label className="fw-bold">
                      Termination Date
                    </Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(terminationDate)}
                      onChange={(selectedDate) =>
                        setTerminationDate(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            terminationDate
                              ? formatDateToMMDDYYYY(terminationDate)
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
          <Card className="my-3">
            <Card.Body>
              <Form.Label className="fw-bold">
                Reason for Termination
              </Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Voluntary</Form.Label>
                    <CustomMultiSelectInput
                      multiselect={true}
                      value={selectedVoluntary}
                      onChange={(value) => setSelectedVoluntary(value)}
                      options={voluntaryOptions}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Involuntary</Form.Label>
                    <CustomMultiSelectInput
                      multiselect={true}
                      value={selectedInvoluntary}
                      onChange={(value) => setSelectedInvoluntary(value)}
                      options={involuntaryOptions}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Form.Label className="fw-bold">
                Documented disciplinary action prior to termination
              </Form.Label>
              <Row>
                <Col>
                  <Form.Check
                    inline
                    type="checkbox"
                    label="Verbal warnings"
                    id="Verbal warnings"
                    onChange={() =>
                      handleCheckboxChange(
                        disciplinaryAction,
                        setDisciplinaryAction,
                        "Verbal warnings",
                      )
                    }
                    checked={disciplinaryAction.includes("Verbal warnings")}
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    label="Written warnings"
                    id="Written warnings"
                    onChange={() =>
                      handleCheckboxChange(
                        disciplinaryAction,
                        setDisciplinaryAction,
                        "Written warnings",
                      )
                    }
                    checked={disciplinaryAction.includes("Written warnings")}
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    label="None"
                    id="NoneDiscipline"
                    onChange={() =>
                      handleCheckboxChange(
                        disciplinaryAction,
                        setDisciplinaryAction,
                        "None",
                      )
                    }
                    checked={disciplinaryAction.includes("None")}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Form.Label className="fw-bold">
                Copy Provided to Employee
              </Form.Label>
              <Row>
                <Col>
                  <Form.Check
                    inline
                    type="checkbox"
                    label="Employee"
                    id="compyEmployee"
                    onChange={() =>
                      handleCheckboxChange(
                        copyProvidedTo,
                        setCopyProvidedTo,
                        "Employee",
                      )
                    }
                    checked={copyProvidedTo.includes("Employee")}
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    label="Employee File"
                    id="copyFile"
                    onChange={() =>
                      handleCheckboxChange(
                        copyProvidedTo,
                        setCopyProvidedTo,
                        "Employee File",
                      )
                    }
                    checked={copyProvidedTo.includes("Employee File")}
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    label="Other"
                    id="copyOther"
                    onChange={() =>
                      handleCheckboxChange(
                        copyProvidedTo,
                        setCopyProvidedTo,
                        "Other",
                      )
                    }
                    checked={copyProvidedTo.includes("Other")}
                  />
                  {copyProvidedTo?.includes("Other") && (
                    <BorderlessInput
                      className="w-auto"
                      setState={setCopyProvidedOther}
                      type="text"
                      value={copyProvidedOther}
                    />
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Form.Label className="fw-bold">Eligible for Rehire</Form.Label>
              <Row>
                <Col>
                  <Form.Check
                    inline
                    type="radio"
                    name="rehireEligibility"
                    label="Yes"
                    id="rehireYes"
                    onChange={() => setRehireEligibility(true)}
                    checked={rehireEligibility === true}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    name="rehireEligibility"
                    label="No"
                    id="rehireNo"
                    onChange={() => setRehireEligibility(false)}
                    checked={rehireEligibility === false}
                  />
                </Col>
              </Row>
              {rehireEligibility === true && (
                <Form.Group className="mt-2">
                  <Form.Label>Rehire Date</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(rehireDate)}
                    onChange={(selectedDate) =>
                      setRehireDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    className="form-control"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          rehireDate
                            ? formatDateToMMDDYYYY(rehireDate)
                            : new Date(),
                        ],
                      },
                    ]}
                  />
                </Form.Group>
              )}
              {rehireEligibility === false && (
                <Form.Group className="mt-2">
                  <Form.Label>If no, please explain</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                  />
                </Form.Group>
              )}
            </Card.Body>
          </Card>

          <Row className="my-2">
            <Col xs={12} md={6}>
              <Button
                type="button"
                className="theme-button"
                onClick={() =>
                  profile.userType === ROLES.ADMIN
                    ? setOpenAdmin(true)
                    : setOpen(true)
                }
              >
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} md={6}>
              {signatureFormat({
                sign: employeeSignature,
                date: dateSigned,
                hoursFormat,
              })}
              {signatureFormat({
                sign: adminSignature,
                date: adminDateSigned,
                hoursFormat,
              })}
            </Col>
          </Row>

          <Row>
            <Col col={12} md={12} lg={12}>
              <div className="employee-btn-joiner mt-3 mt-md-4">
                <button
                  className="draft hidden"
                  type="submit"
                  onClick={() => setSavedAsDraft(true)}
                >
                  Save as Draft
                </button>

                <button
                  className="employee_create_btn"
                  type="submit"
                  disabled={
                    profile?.userType === ROLES.ADMIN
                      ? false
                      : employeeSignature?.length === 0
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
  Wcomponenet: EmploymentTermination,
});
