/* eslint-disable no-unused-vars */
/** @format */
import { useEffect, useState } from "react";
import { Form, Container, Card, Row, Col, Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import {
  UploadImage,
  employeeTrackingService,
} from "@/features/shared/services";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import EmployeeComponent from "@/features/shared/ui/Search/EmployeeComponent";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ROLES } from "@/features/shared/constants";
const EmployeeTracking = () => {
  const profileDetail = useSelector(userProfile);
  const hoursFormat = profileDetail?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [CPRFirstAid, setCPRFirstAid] = useState("");
  const [TBTestChestXray, setTBTestChestXray] = useState("");
  const [TBtestQuestionnaire, setTBTestQuestionnaire] = useState("");
  const [FingerprintClearanceCard, setFingerprintClearanceCard] = useState("");
  const [InfectiousControlTraining, setInfectiousControlTraining] =
    useState("");
  const [TBAnnualEducation, setTBAnnualEducation] = useState("");
  const [FallPreventionandFallRecovery, setFallPreventionandFallRecovery] =
    useState("");
  const [APSSearch, setAPSSearch] = useState("");
  const [CPIPreventionandControl, setCPIPreventionandControl] = useState("");
  const [Annualabuseandneglecttraining, setAnnualabuseandneglecttraining] =
    useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeeSignatureTime, setEmployeeSignatureTime] = useState("");
  const [employeeSignatureDate, setEmployeeSignatureDate] = useState("");
  const [details, setDetails] = useState({});
  // Due date states
  const [CPRFirstAidExpireDate, setCPRFirstAidExpireDate] = useState("");
  const [TBTestChestXrayExpireDate, setTBTestChestXrayExpireDate] =
    useState("");
  const [TBtestQuestionnaireExpireDate, setTBtestQuestionnaireExpireDate] =
    useState("");
  const [
    FingerprintClearanceCardExpireDate,
    setFingerprintClearanceCardExpireDate,
  ] = useState("");
  const [
    InfectiousControlTrainingExpireDate,
    setInfectiousControlTrainingExpireDate,
  ] = useState("");
  const [TBAnnualEducationExpireDate, setTBAnnualEducationExpireDate] =
    useState("");
  const [
    FallPreventionandFallRecoveryExpireDate,
    setFallPreventionandFallRecoveryExpireDate,
  ] = useState("");
  const [APSSearchExpireDate, setAPSSearchExpireDate] = useState("");
  const [
    CPIPreventionandControlExpireDate,
    setCPIPreventionandControlExpireDate,
  ] = useState("");
  const [
    AnnualabuseandneglecttrainingExpireDate,
    setAnnualabuseandneglecttrainingExpireDate,
  ] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  useEffect(() => {
    if (profileDetail) {
      employeeTrackingService.getTracking({
        isAdmin: profileDetail?.userType === ROLES.ADMIN,
        employeeId:
          profileDetail?.userType === ROLES.ADMIN
            ? employeeId
            : profileDetail?._id,
        setResponse: setDetails,
      });
    }
  }, [profileDetail, employeeId]);
  const payload = {
    employeeId:
      profileDetail?.userType === ROLES.ADMIN ? employeeId : profileDetail?._id,
    employeeSignature,
    employeeSignatureSaveAsDraft: false,
    employeeSignatureTime,
    employeeSignatureDate,
    CPRFirstAid: CPRFirstAid && CPRFirstAid?.CPRFirstAid,
    TBTestChestXray: TBTestChestXray && TBTestChestXray?.TBTestChestXray,
    TBtestQuestionnaire:
      TBtestQuestionnaire && TBtestQuestionnaire?.TBtestQuestionnaire,
    FingerprintClearanceCard:
      FingerprintClearanceCard &&
      FingerprintClearanceCard?.FingerprintClearanceCard,
    InfectiousControlTraining:
      InfectiousControlTraining &&
      InfectiousControlTraining?.InfectiousControlTraining,
    TBAnnualEducation:
      TBAnnualEducation && TBAnnualEducation?.TBAnnualEducation,
    FallPreventionandFallRecovery:
      FallPreventionandFallRecovery &&
      FallPreventionandFallRecovery?.FallPreventionandFallRecovery,
    APSSearch: APSSearch && APSSearch?.APSSearch,
    CPIPreventionandControl:
      CPIPreventionandControl &&
      CPIPreventionandControl?.CPIPreventionandControl,
    Annualabuseandneglecttraining:
      Annualabuseandneglecttraining &&
      Annualabuseandneglecttraining?.Annualabuseandneglecttraining,
    CPRFirstAidExpireDate,
    TBtestQuestionnaireExpireDate,
    FingerprintClearanceCardExpireDate,
    InfectiousControlTrainingExpireDate,
    TBAnnualEducationExpireDate,
    FallPreventionandFallRecoveryExpireDate,
    APSSearchExpireDate,
    CPIPreventionandControlExpireDate,
    TBTestChestXrayExpireDate,
    AnnualabuseandneglecttrainingExpireDate,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    employeeTrackingService.create(payload, {
      setLoading,
      successMsg: "Created !",
      navigate,
    });
  };
  const ImageHandler = (file, setValue, fileName) => {
    if (details?.data?._id)
      UploadImage(file, setValue, details.data._id, fileName);
  };
  return (
    <>
      <AddSignature
        show={open}
        setValue={setEmployeeSignature}
        setTime={setEmployeeSignatureTime}
        setDate={setEmployeeSignatureDate}
      />
      <NavWrapper title={"Employee Tracking / Upload"} isArrow={true} />
      <Form onSubmit={submitHandler}>
        <Container className="full-width-container">
          <Row>
            <Col xs={12} md={12} lg={12}>
              <Form.Label className="fw-bold">
                {profileDetail?.userType === ROLES.ADMIN && (
                  <EmployeeComponent
                    className={"grid-item"}
                    MainPatientId={setEmployeeId}
                    setWholeData={setEmployeeData}
                    MainResidentName={setEmployeeName}
                  />
                )}
              </Form.Label>
            </Col>
          </Row>
          {profileDetail?.userType === ROLES.EMPLOYEE || employeeId ? (
            <>
              <Card body className="mb-3">
                <Row>
                  <Col xs={12} md={6} lg={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">CPR/First Aid</Form.Label>
                      <Form.Control
                        type="file"
                        placeholder=""
                        onChange={(e) =>
                          ImageHandler(
                            e.target.files[0],
                            setCPRFirstAid,
                            "CPRFirstAid",
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">Due Date</Form.Label>
                      <DatePicker
                        selected={formatDateToMMDDYYYY(CPRFirstAidExpireDate)}
                        onChange={(selectedDate) =>
                          setCPRFirstAidExpireDate(selectedDate?.toDateString())
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              CPRFirstAidExpireDate
                                ? formatDateToMMDDYYYY(CPRFirstAidExpireDate)
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        TB Test/Chest Xray
                      </Form.Label>
                      <Form.Control
                        type="file"
                        placeholder=""
                        onChange={(e) =>
                          ImageHandler(
                            e.target.files[0],
                            setTBTestChestXray,
                            "TBTestChestXray",
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">Due Date</Form.Label>

                      <DatePicker
                        selected={formatDateToMMDDYYYY(
                          TBTestChestXrayExpireDate,
                        )}
                        onChange={(selectedDate) =>
                          setTBTestChestXrayExpireDate(
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              TBTestChestXrayExpireDate
                                ? formatDateToMMDDYYYY(
                                    TBTestChestXrayExpireDate,
                                  )
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={8}>
                    <Form.Group className="mb-3 ">
                      <Form.Label className="fw-bold">
                        TB test Questionnaire
                      </Form.Label>
                      <Form.Control
                        type="file"
                        placeholder=""
                        onChange={(e) =>
                          ImageHandler(
                            e.target.files[0],
                            setTBTestQuestionnaire,
                            "TBtestQuestionnaire",
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">Due Date</Form.Label>

                      <DatePicker
                        selected={formatDateToMMDDYYYY(
                          TBtestQuestionnaireExpireDate,
                        )}
                        onChange={(selectedDate) =>
                          setTBtestQuestionnaireExpireDate(
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              TBtestQuestionnaireExpireDate
                                ? formatDateToMMDDYYYY(
                                    TBtestQuestionnaireExpireDate,
                                  )
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Fingerprint Clearance Card
                      </Form.Label>
                      <Form.Control
                        type="file"
                        placeholder=""
                        onChange={(e) =>
                          ImageHandler(
                            e.target.files[0],
                            setFingerprintClearanceCard,
                            "FingerprintClearanceCard",
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">Due Date</Form.Label>

                      <DatePicker
                        selected={formatDateToMMDDYYYY(
                          FingerprintClearanceCardExpireDate,
                        )}
                        onChange={(selectedDate) =>
                          setFingerprintClearanceCardExpireDate(
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              FingerprintClearanceCardExpireDate
                                ? formatDateToMMDDYYYY(
                                    FingerprintClearanceCardExpireDate,
                                  )
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Infectious Control Training
                      </Form.Label>
                      <Form.Control
                        type="file"
                        placeholder=""
                        onChange={(e) =>
                          ImageHandler(
                            e.target.files[0],
                            setInfectiousControlTraining,
                            "InfectiousControlTraining",
                          )
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">Due Date</Form.Label>

                      <DatePicker
                        selected={formatDateToMMDDYYYY(
                          InfectiousControlTrainingExpireDate,
                        )}
                        onChange={(selectedDate) =>
                          setInfectiousControlTrainingExpireDate(
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              InfectiousControlTrainingExpireDate
                                ? formatDateToMMDDYYYY(
                                    InfectiousControlTrainingExpireDate,
                                  )
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        TB Annual Education
                      </Form.Label>
                      <Form.Control
                        type="file"
                        placeholder=""
                        onChange={(e) =>
                          ImageHandler(
                            e.target.files[0],
                            setTBAnnualEducation,
                            "TBAnnualEducation",
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">Due Date</Form.Label>

                      <DatePicker
                        selected={formatDateToMMDDYYYY(
                          TBAnnualEducationExpireDate,
                        )}
                        onChange={(selectedDate) =>
                          setTBAnnualEducationExpireDate(
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              TBAnnualEducationExpireDate
                                ? formatDateToMMDDYYYY(
                                    TBAnnualEducationExpireDate,
                                  )
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Fall Prevention and Fall Recovery
                      </Form.Label>
                      <Form.Control
                        type="file"
                        placeholder=""
                        onChange={(e) =>
                          ImageHandler(
                            e.target.files[0],
                            setFallPreventionandFallRecovery,
                            "FallPreventionandFallRecovery",
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">Due Date</Form.Label>

                      <DatePicker
                        selected={formatDateToMMDDYYYY(
                          FallPreventionandFallRecoveryExpireDate,
                        )}
                        onChange={(selectedDate) =>
                          setFallPreventionandFallRecoveryExpireDate(
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              FallPreventionandFallRecoveryExpireDate
                                ? formatDateToMMDDYYYY(
                                    FallPreventionandFallRecoveryExpireDate,
                                  )
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">APS Search</Form.Label>
                      <Form.Control
                        type="file"
                        placeholder=""
                        onChange={(e) =>
                          ImageHandler(
                            e.target.files[0],
                            setAPSSearch,
                            "APSSearch",
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">Due Date</Form.Label>

                      <DatePicker
                        selected={formatDateToMMDDYYYY(APSSearchExpireDate)}
                        onChange={(selectedDate) =>
                          setAPSSearchExpireDate(selectedDate?.toDateString())
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              APSSearchExpireDate
                                ? formatDateToMMDDYYYY(APSSearchExpireDate)
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        CPI/Prevention and Support
                      </Form.Label>
                      <Form.Control
                        type="file"
                        placeholder=""
                        onChange={(e) =>
                          ImageHandler(
                            e.target.files[0],
                            setCPIPreventionandControl,
                            "CPIPreventionandControl",
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">Due Date</Form.Label>

                      <DatePicker
                        selected={formatDateToMMDDYYYY(
                          CPIPreventionandControlExpireDate,
                        )}
                        onChange={(selectedDate) =>
                          setCPIPreventionandControlExpireDate(
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              CPIPreventionandControlExpireDate
                                ? formatDateToMMDDYYYY(
                                    CPIPreventionandControlExpireDate,
                                  )
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Annual abuse and neglect training
                      </Form.Label>
                      <Form.Control
                        type="file"
                        placeholder=""
                        onChange={(e) =>
                          ImageHandler(
                            e.target.files[0],
                            setAnnualabuseandneglecttraining,
                            "Annualabuseandneglecttraining",
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">Due Date</Form.Label>

                      <DatePicker
                        selected={formatDateToMMDDYYYY(
                          AnnualabuseandneglecttrainingExpireDate,
                        )}
                        onChange={(selectedDate) =>
                          setAnnualabuseandneglecttrainingExpireDate(
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              AnnualabuseandneglecttrainingExpireDate
                                ? formatDateToMMDDYYYY(
                                    AnnualabuseandneglecttrainingExpireDate,
                                  )
                                : new Date(),
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
                  <Button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="theme-button"
                  >
                    {" "}
                    SAVED AND SIGNED
                  </Button>
                </Col>
                <Col xs={12} lg={6}>
                  {signatureFormat({
                    sign: employeeSignature,
                    date: employeeSignatureDate,
                    time: employeeSignatureTime,
                    hoursFormat,
                  })}
                </Col>
              </Row>
              <Row>
                <Col xs={12} lg={12}>
                  <div className="employee-btn-joiner">
                    <button className="employee_create_btn" type="submit">
                      {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                    </button>
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            <Card body className="mb-3">
              <Form.Label className="fw-bold text-center">
                Select an Employee first
              </Form.Label>
            </Card>
          )}
        </Container>
      </Form>
    </>
  );
};
export default HOC({
  Wcomponenet: EmployeeTracking,
});
