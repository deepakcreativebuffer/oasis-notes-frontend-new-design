/* eslint-disable no-unused-vars */
/** @format */

import { Container, Form, Card, Row, Col, Button } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import { timeOffService } from "@/features/shared/services";
import { RadioMaker, TextareaMaker } from "@/utils/Makers";
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
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import { ROLES } from "@/features/shared/constants";
const EditTimeOfRequest = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const { id, employeeId } = useParams();
  const [beginDate, setBeginDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [normalShift, setNormalShift] = useState("");
  const [unPaidHrLeft, setUnPaidHrLeft] = useState("");
  const [vacationPersonTimeUsed, setVacationPersonTimeUsed] = useState("");
  const [sickTimeUsed, setSickTimeUsed] = useState("");
  const [notes, setNotes] = useState("");
  const [requestType, setRequestType] = useState("PTO");
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [timeOf, setTimeOf] = useState(false);
  const [signatureDate, setSignatureDate] = useState("");
  const [signatureTime, setSignatureTime] = useState("");
  const [detail, setDetail] = useState({});
  const [signers, setSigners] = useState([]);
  const [openSigner, setOpenSigner] = useState(false);
  const [signatureSaveAsDraft, setSignatureSaveAsDraft] = useState(false);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
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
    signatureDate,
    signatureTime,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    signatureSaveAsDraft,
    signers,
  };
  useEffect(() => {
    getData(setProfile, `employee/getProfile`);
  }, []);
  useEffect(() => {
    if (id || employeeId) {
      timeOffService.getRequestById({
        id,
        employeeId,
        setResponse: setDetail,
      });
    }
  }, [id, employeeId]);
  useEffect(() => {
    if (detail) {
      setRequestType(detail?.data?.requestType);
      setBeginDate(detail?.data?.beginDate);
      setEndDate(detail?.data?.endDate);
      setNormalShift(detail?.data?.normalShift);
      setUnPaidHrLeft(detail?.data?.unPaidHrLeft);
      setVacationPersonTimeUsed(detail?.data?.vacationPersonTimeUsed);
      setSickTimeUsed(detail?.data?.sickTimeUsed);
      setNotes(detail?.data?.notes);
      setSignature(detail?.data?.signature);
      setSignatureDate(detail?.data?.signatureDate);
      setSignatureTime(detail?.data?.signatureTime);
      setAdminSignature(detail?.data?.adminSignature);
      setAdminDateSigned(detail?.data?.adminDateSigned);
      setAdminSignedTime(detail?.data?.adminSignedTime);
      setSigners(detail?.data?.signers);
      setTimeOf(
        detail?.data?.status === "Approved"
          ? true
          : detail?.data?.status === "Pending"
            ? null
            : false,
      );
    }
  }, [detail]);
  const submitHandler = (e) => {
    e.preventDefault();
    let updatedpayload;
    if (profileInfo?.userType === ROLES.ADMIN) {
      updatedpayload = {
        ...payload,
        status: timeOf ? "Approved" : timeOf === null ? "Pending" : "Denied",
      };
    }
    timeOffService.requests.update(
      employeeId || id,
      profileInfo?.userType === ROLES.ADMIN ? updatedpayload : payload,
      { setLoading, navigate },
    );
  };
  const employeeIdFromResponse =
    detail?.data?.employeeId?._id || detail?.data?.employeeId;
  const checkSign = useCallback(async () => {
    let signerIndex = signers?.findIndex?.(
      (signer, i) => signer.signerId === profileInfo._id,
    );
    let isSignerValid =
      signerIndex !== -1 && signers?.[signerIndex]?.signature?.length > 0;
    let isAdminConditionValid = profileInfo.userType === ROLES.ADMIN;
    let isEmployeeConditionValid =
      employeeIdFromResponse === profileInfo?._id && signature?.length > 0;
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
    employeeIdFromResponse,
    signature?.length,
  ]);
  useEffect(() => {
    if (id || employeeId) {
      checkSign();
    }
  }, [signature, adminSignature, id, checkSign, employeeId]);
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
      setSignatureTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };
  return (
    <>
      <AddSignature
        show={openSigner}
        setValue={(sign) =>
          employeeIdFromResponse === profileInfo?._id
            ? setSignature(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          employeeIdFromResponse === profileInfo?._id
            ? setSignatureDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          employeeIdFromResponse === profileInfo?._id
            ? setSignatureTime(time)
            : editTimeHandler(time)
        }
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
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Employee Name</Form.Label>
                  <Form.Control
                    disabled
                    value={fetchPaitentName(detail?.data?.employeeId)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Begin Date requested
                  </Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(beginDate)}
                    disabled
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
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    End Date requested
                  </Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(endDate)}
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
                    onChange={(e) => setSickTimeUsed(e.target.value)}
                    type={"text"}
                    value={sickTimeUsed}
                  ></Form.Control>
                </Form.Group>
              </Col>
              {profileInfo?.userType === ROLES.ADMIN && (
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Time off request approved/denied
                    </Form.Label>
                    <div className="radio-inline">
                      <RadioMaker
                        name="residentCompletedSession"
                        setValue={setTimeOf}
                        value={true}
                        id={"residentCompletedSession1"}
                        label={"Yes"}
                        checked={timeOf}
                      />
                      <RadioMaker
                        name="residentCompletedSession"
                        setValue={setTimeOf}
                        value={false}
                        id={"residentCompletedSession2"}
                        label={"No"}
                        checked={timeOf}
                      />
                    </div>
                  </Form.Group>
                </Col>
              )}
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <TextareaMaker
                    disabled
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
              {
                <Button
                  type="button"
                  onClick={() => setOpenSigner(true)}
                  className="theme-button"
                >
                  SAVED AND SIGNED
                </Button>
              }
            </Col>
            <Col xs={12} lg={6}>
              {signatureFormat({
                sign: signature,
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
          <Row>
            <Col xs={12}>
              <div className="employee-btn-joiner mt-2 mt-md-5">
                {detail?.data?.signatureSaveAsDraft && (
                  <button
                    className="draft"
                    type="submit"
                    onClick={() => setSignatureSaveAsDraft(true)}
                  >
                    Save as Draft
                  </button>
                )}
                <button
                  className="employee_create_btn"
                  type="submit"
                  disabled={!isSubmitEnabled}
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
  Wcomponenet: EditTimeOfRequest,
});
