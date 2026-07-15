/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { vitalsService } from "@/features/shared/services/index";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  AddSignature,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";

import { ROLES } from "@/features/shared/constants/index";

const VitalsForm = () => {
  const profileInfo = useSelector(userProfile);
  const navigate = useNavigate();
  const profileUser = useSelector(userProfile);
  const hoursFormat = profileUser?.hoursFormat === "24" ? "HH:mm" : "h:mm a";
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [getDate, setGetDate] = useState([]);
  const [bodyTemperature, setBodyTemp] = useState("");
  const [pulseRate, setPulseRate] = useState("");
  const [respirationRate, setResRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [bloodOxygen, setBloodOxygen] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodGlucoseLevel, setBloodGlucose] = useState("");
  const [height, setHeight] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [signers, setSigners] = useState([]);
  const [open3, setOpen3] = useState(false);
  const [bhpSignature, setBhpSignature] = useState("");
  const [bhpSignatureDate, setBhpSignatureDate] = useState("");
  const [bhpTime, setBhpTime] = useState("");
  const [patient, setPatient] = useState({});

  const createPayload = {
    patientId,
    date,
    bodyTemperature,
    pulseRate,
    respirationRate,
    bloodPressure,
    bloodOxygen,
    weight,
    bloodGlucoseLevel,
    height,
    time,
    bhpSignature,
    bhpSignatureDate,
    bhpTime,
    signers: signers?.map((signer) => ({
      signerId: signer.value,
      name: signer.label,
      signature: "",
      dateSigned: "",
      signedTime: "",
    })),
  };

  const editPayload = {
    date,
    bodyTemperature,
    pulseRate,
    respirationRate,
    bloodPressure,
    bloodOxygen,
    weight,
    bloodGlucoseLevel,
    height,
    time,
    bhpSignature,
    bhpSignatureDate,
    bhpTime,
    signers,
  };

  useEffect(() => {
    if (isEdit && id) {
      vitalsService.getById(id, {
        setResponse: setGetDate,
        setLoading,
      });
    }
  }, [id, isEdit]);

  useEffect(() => {
    if (!isEdit && patientId) {
      vitalsService.getByPatient({
        patientId,
        forFilter: "week",
        isAdmin: profileUser?.userType === ROLES.ADMIN,
        setResponse: setGetDate,
        setLoading,
      });
    }
  }, [patientId, profileUser?.userType, isEdit]);

  useEffect(() => {
    const item = isEdit
      ? getDate?.data
      : Array.isArray(getDate?.data)
        ? getDate?.data?.find(
            (row) =>
              row?.patientId?._id === patientId || row?.patientId === patientId,
          )
        : null;

    if (item) {
      setBodyTemp(item?.bodyTemperature);
      setPulseRate(item?.pulseRate);
      setResRate(item?.respirationRate);
      setBloodPressure(item?.bloodPressure);
      setBloodOxygen(item?.bloodOxygen);
      setWeight(item?.weight);
      setBloodGlucose(item?.bloodGlucoseLevel);
      setHeight(item?.height);
      setTime(item?.time);
      setDate(item?.date);
      if (isEdit) {
        setPatient(item?.patientId);
        setBhpSignature(item?.bhpSignature);
        setBhpSignatureDate(item?.bhpSignatureDate);
        setSigners(item?.signers);
      }
    } else {
      setBodyTemp("");
      setPulseRate("");
      setResRate("");
      setBloodPressure("");
      setBloodOxygen("");
      setWeight("");
      setBloodGlucose("");
      setHeight("");
      setTime("");
      setDate("");
    }
  }, [getDate, patientId, profileUser._id, isEdit]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (isEdit) {
      vitalsService.update(id, editPayload, {
        isAdmin: profileUser?.userType === ROLES.ADMIN,
        successMsg: "Vital Updated !",
        setLoading,
        navigate,
      });
    } else {
      vitalsService.create(createPayload, {
        isAdmin: profileUser?.userType === ROLES.ADMIN,
        successMsg: "Vital created !",
        setLoading,
        navigate,
      });
    }
  };

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
    }
  };

  return (
    <>
      <AddSignature
        show={open3}
        setValue={(sign) =>
          isEdit
            ? getDate?.data?.employeeId === profileInfo?._id
              ? setBhpSignature(sign)
              : editSignHandler(sign)
            : setBhpSignature(sign)
        }
        setTime={isEdit ? undefined : setBhpTime}
        setDate={(date) =>
          isEdit
            ? getDate?.data?.employeeId === profileInfo?._id
              ? setBhpSignatureDate(date)
              : editDateHandler(date)
            : setBhpSignatureDate(date)
        }
      />
      <NavWrapper title={"Resident Vitals"} isArrow={true} />
      <Container>
        <Row className="mb-2">
          <Col xs={12}>
            {isEdit ? (
              <Form.Group className="d-flex flex-row">
                <Form.Label>Resident Name : </Form.Label>
                <Form.Label>{fetchPaitentName(patient)}</Form.Label>
              </Form.Group>
            ) : (
              <PatientComponent MainPatientId={setPatientId} />
            )}
          </Col>
        </Row>
        <Form onSubmit={submitHandler}>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={3}>
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
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Time</Form.Label>

                  <CustomTimePicker
                    use24Hours={hoursFormat === "HH:mm"}
                    value={time ? parseTimeStringToDate(time) : null}
                    onChange={setTime}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Body Temperature</Form.Label>
                  <Form.Control
                    onChange={(e) => setBodyTemp(e.target.value)}
                    value={bodyTemperature}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Pulse Rate</Form.Label>
                  <Form.Control
                    onChange={(e) => setPulseRate(e.target.value)}
                    value={pulseRate}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Respiration Rate</Form.Label>
                  <Form.Control
                    onChange={(e) => setResRate(e.target.value)}
                    value={respirationRate}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Blood Pressure Systolic/Diastolic
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setBloodPressure(e.target.value)}
                    value={bloodPressure}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Blood oxygen</Form.Label>
                  <Form.Control
                    onChange={(e) => setBloodOxygen(e.target.value)}
                    value={bloodOxygen}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Weight</Form.Label>
                  <Form.Control
                    onChange={(e) => setWeight(e.target.value)}
                    value={weight}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Blood glucose level
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setBloodGlucose(e.target.value)}
                    value={bloodGlucoseLevel}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Height</Form.Label>
                  <Form.Control
                    onChange={(e) => setHeight(e.target.value)}
                    value={height}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Row>
            <Col xs={12} md={6}>
              <Button
                type="button"
                onClick={() => setOpen3(true)}
                className="theme-button"
              >
                {" "}
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} md={6}>
              {signatureFormat({
                sign: bhpSignature,
                date: bhpSignatureDate,
                time: bhpTime,
                hoursFormat,
              })}
              {isEdit &&
                signers?.map(
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
          {!isEdit && (
            <Row className="mt-3">
              <Col xs={12} md={12}>
                <Form.Group>
                  <Form.Label className="fw-bold">Signers</Form.Label>
                  <MultiEmployee setValue={setSigners} value={signers} />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Row>
            <Col xs={12} md={12}>
              <button
                className="employee_create_btn mt-3 mt-md-5"
                disabled={!isEdit && bhpSignature?.length === 0}
              >
                {" "}
                {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}{" "}
              </button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default HOC({ Wcomponenet: VitalsForm });
