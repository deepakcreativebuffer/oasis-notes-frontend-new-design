/* eslint-disable no-unused-vars */
/** @format */
import { useEffect, useState } from "react";
import { Form, Container, Row, Col, Card, Button } from "react-bootstrap";
import { adminPortalService, patientService } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { ClipLoader } from "react-spinners";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";

import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";

const PatientTracking = () => {
  const profileUser = useSelector(userProfile);
  const hoursFormat = profileUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [patientId, setPatientId] = useState("");
  const [initialAssessment, setInitialAssessment] = useState("");
  const [nursingAssessment, setNursingAssessment] = useState("");
  const [treatmentPlanReviewDate, setTreatmentPlanReviewDate] = useState("");
  const [staffing, setStaffing] = useState("");
  const [fluShot, setFluShot] = useState("");
  const [signature, setSignature] = useState("");
  const [additionalDocument, setAdditionalDocument] = useState("");
  const [signDate, setSignDate] = useState("");
  const [signTime, setSignTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState({});
  const [tbTestDate, setTbTestDate] = useState("");
  const [currentReviewDate, setCurrentReviewDate] = useState("");
  const [signers, setSigners] = useState([]);

  const payload = {
    patientId,
    tbTestDate,
    initialAssessment,
    nursingAssessment,
    treatmentPlanReviewDate,
    staffing,
    fluShot,
    additionalDocument,
    currentReviewDate,
    signatureDate: signDate,
    time: signTime,
    signature,
    saveAsDraft: false,
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
    adminPortalService.createPatientTracking(payload, {
      isAdmin: profileUser?.userType === ROLES.ADMIN,
      setLoading,
    });
  };

  useEffect(() => {
    if (patientId) {
      patientService.getPatientTracking(patientId, { setResponse: setDetail });
    }
  }, [patientId, profileUser?.userType]);

  useEffect(() => {
    if (detail?.data) {
      const item = detail?.data;
      setTbTestDate(item?.tbTestDate);
      setInitialAssessment(item?.initialAssessment);
      setNursingAssessment(item?.nursingAssessment);
      setTreatmentPlanReviewDate(item?.treatmentPlanReviewDate);
      setStaffing(item?.staffing);
      setFluShot(item?.fluShot);
      setCurrentReviewDate(item?.currentReviewDate);
    }
  }, [detail]);

  return (
    <>
      <AddSignature
        show={open}
        setValue={setSignature}
        setDate={setSignDate}
        setTime={setSignTime}
      />
      <NavWrapper title={"Resident Tracking"} isArrow={true} />

      <Container>
        <Form onSubmit={submitHandler}>
          <Row className="mb-2">
            <Col xs={12} md={12} lg={12}>
              <PatientComponent MainPatientId={setPatientId} />
            </Col>
          </Row>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">TB Test due date</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(tbTestDate)}
                    onChange={(selectedDate) =>
                      setTbTestDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          tbTestDate
                            ? formatDateToMMDDYYYY(tbTestDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control width-unset-input"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">
                    Initial Assessment due date
                  </Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(initialAssessment)}
                    onChange={(selectedDate) =>
                      setInitialAssessment(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          initialAssessment
                            ? formatDateToMMDDYYYY(initialAssessment)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control width-unset-input"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">
                    Nursing Assessment due date
                  </Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(nursingAssessment)}
                    onChange={(selectedDate) =>
                      setNursingAssessment(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          nursingAssessment
                            ? formatDateToMMDDYYYY(nursingAssessment)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control width-unset-input"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">
                    Behavioral Health Treatment Plan Review due date
                  </Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(treatmentPlanReviewDate)}
                    onChange={(selectedDate) =>
                      setTreatmentPlanReviewDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          treatmentPlanReviewDate
                            ? formatDateToMMDDYYYY(treatmentPlanReviewDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control width-unset-input"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Staffing due date</Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(staffing)}
                    onChange={(selectedDate) =>
                      setStaffing(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          staffing
                            ? formatDateToMMDDYYYY(staffing)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control width-unset-input"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Flu Shot due date</Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(fluShot)}
                    onChange={(selectedDate) =>
                      setFluShot(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          fluShot ? formatDateToMMDDYYYY(fluShot) : new Date(),
                        ],
                      },
                    ]}
                    className="form-control width-unset-input"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">
                    Concurrent Review due date
                  </Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(currentReviewDate)}
                    onChange={(selectedDate) =>
                      setCurrentReviewDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          currentReviewDate
                            ? formatDateToMMDDYYYY(currentReviewDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control width-unset-input"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Row>
            <Col xs={12} md={6}>
              <Button
                type="button"
                onClick={() => setOpen(true)}
                className="theme-button"
              >
                {" "}
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} md={6}>
              {" "}
              {signatureFormat({
                sign: signature,
                date: signDate,
                time: signTime,
                hoursFormat,
              })}{" "}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12} md={12}>
              <Form.Group>
                <Form.Label className="fw-bold">Signers</Form.Label>
                <MultiEmployee
                  setValue={setSigners}
                  value={signers}
                  alsoResident
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12} md={12}>
              <button
                className="employee_create_btn"
                disabled={
                  profileUser?.userType === ROLES.ADMIN
                    ? false
                    : signature?.length === 0 ||
                      (profileUser?.accountType === ACCOUNT_TYPES.RESTRICTED &&
                        profileUser?.userType === ROLES.EMPLOYEE)
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

export default HOC({ Wcomponenet: PatientTracking });
