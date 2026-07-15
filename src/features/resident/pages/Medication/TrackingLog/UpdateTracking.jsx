/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { medicationService } from "@/features/shared/services";
import DatePicker from "react-datepicker";
import { convertTimeFormat, formatDateToMMDDYYYY } from "@/utils/utils";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
const UpdateTracking = () => {
  const navigate = useNavigate();
  const profileInfo = useSelector(userProfile);
  const { id } = useParams();
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [patientId, setPatientId] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [name, setName] = useState("");
  const [contectNumber, setContectNumber] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [appoinmentDate, setAppoinmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setDate] = useState(false);
  const [address, setAddress] = useState("");
  useEffect(() => {
    if (patientDetail) {
      setContectNumber(patientDetail?.mobileNumber?.trim());
      setName(`${patientDetail?.firstName} ${patientDetail?.lastName}`);
    }
  }, [patientDetail]);
  useEffect(() => {
    medicationService.trackingLog.getById(id, { setResponse: setDate });
  }, [id]);
  useEffect(() => {
    if (data) {
      if (data?.data) {
        const item = data?.data;
        setName(item?.name);
        setPatientId(item);
        setContectNumber(item?.contactNumber?.trim());
        setReasonForVisit(item?.reasonForVisit);
        setAppoinmentDate(item?.date);
        setAppointmentTime(item?.time);
        setAddress(item?.address);
      }
    }
  }, [data]);
  const appoinmentData = {
    name,
    contactNumber: contectNumber,
    reasonForVisit: reasonForVisit,
    date: appoinmentDate,
    time: appointmentTime,
    address,
  };

  // Generate time slots dynamically
  const generateTimeSlots = () => {
    const timeSlots = [];
    const is24HourFormat = hoursFormat === "HH:mm";
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const time = new Date(0, 0, 0, hour, minutes, 0);
        const timeString = time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: !is24HourFormat, // Use 12-hour format if not 24-hour
        });
        timeSlots.push(timeString);
      }
    }
    return timeSlots;
  };
  const validateForm = () => {
    let formErrors = {};
    const {
      name,
      contactNumber,
      date,
      reasonForVisit,
      appointmentTime,
      address,
    } = appoinmentData;
    if (!name) formErrors.name = "Name is required.";
    if (!contactNumber)
      formErrors.contactNumber = "Contact number is required.";
    if (!date) formErrors.appointmentDate = "Appointment date is required.";
    if (!reasonForVisit)
      formErrors.reasonForVisit = "Reason for visit is required.";
    if (!address) formErrors.address = "Address for visit is required.";
    return formErrors;
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    medicationService.trackingLog.update(id, appoinmentData, {
      successMsg: "Updated !",
      setLoading,
      navigate,
    });
  };
  return (
    <>
      <NavWrapper title={"Appointment Tracking Log"} isArrow={true} />
      <Container>
        <Row className="mb-3">
          <Col xs={12} md={12}>
            <Form.Group className="fw-bold fs-5">Booking Details</Form.Group>
          </Col>
        </Row>
        <Form onSubmit={submitHandler}>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={12} lg={6} xl={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Name</Form.Label>
                  <Form.Control
                    type="text"
                    id="name"
                    value={name}
                    isInvalid={!!errors.name}
                    placeholder="Type Here....."
                    required
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={6} xl={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    id="AHCCCS"
                    value={contectNumber}
                    isInvalid={!!errors.contactNumber}
                    placeholder="Type Here....."
                    required
                    onChange={(e) => {
                      const value = e.target.value?.trim();
                      if (/^\d*$/.test(value)) {
                        setContectNumber(value);
                      }
                    }}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.contactNumber}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={6} xl={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Appointment Date</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(appoinmentDate)}
                    onChange={(selectedDate) =>
                      setAppoinmentDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          appoinmentDate
                            ? formatDateToMMDDYYYY(appoinmentDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.appointmentDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={6} xl={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Time Slot</Form.Label>

                  <Form.Select
                    value={convertTimeFormat(appointmentTime, hoursFormat)}
                    required
                    onChange={(e) => setAppointmentTime(e.target.value?.trim())}
                  >
                    {generateTimeSlots().map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    id="programlocation&address"
                    rows={1}
                    cols={50}
                    isInvalid={!!errors.address}
                    placeholder="Type Here......"
                    required
                    maxLength={100}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={12}>
                <Form.Group>
                  <Form.Label className="fw-bold">Reason For Visit</Form.Label>
                  <Form.Control
                    as="textarea"
                    id="programlocation&address"
                    rows={5}
                    cols={130}
                    isInvalid={!!errors.reasonForVisit}
                    placeholder="Type Here......"
                    required
                    maxLength={500}
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.reasonForVisit}
                  </Form.Control.Feedback>
                  <div className="text-muted mt-1">
                    {500 - reasonForVisit.length} characters remaining
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Row>
            <Col xs={12}>
              <div className="employee-btn-joiner hidePrint">
                <button className="employee_create_btn" type="submit">
                  SUBMIT DETAILS
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
  Wcomponenet: UpdateTracking,
});
