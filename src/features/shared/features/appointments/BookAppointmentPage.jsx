/** @format */

import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import NavWrapper from "@/utils/NavWrapper";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { userProfile } from "@/store/authSlice";
import { ROLES, ACCOUNT_TYPES } from "../../constants/index";
import { patientService, residentService } from "../../services/index";
import HOC from "../../layout/Outer/HOC";
import InnerHOC from "../../layout/Inner/HOC";

export const BOOK_APPOINTMENT_PORTALS = {
  EMPLOYEE: "employee",
  RESIDENT: "resident",
};

function generateTimeSlots(hoursFormat) {
  const timeSlots = [];
  const is24HourFormat = hoursFormat === "HH:mm";
  for (let hour = 0; hour < 24; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      const time = new Date(0, 0, 0, hour, minutes, 0);
      timeSlots.push(
        time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: !is24HourFormat,
        }),
      );
    }
  }
  return timeSlots;
}

function BookAppointmentForm({ portal }) {
  const navigate = useNavigate();
  const { id: patientId } = useParams();
  const profileUser = useSelector(userProfile);
  const hoursFormat = profileUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const isEmployeePortal = portal === BOOK_APPOINTMENT_PORTALS.EMPLOYEE;

  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState(
    isEmployeePortal ? "" : "12:00 AM",
  );
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEmployeePortal && profileUser) {
      setName(
        `${profileUser?.firstName || ""} ${profileUser?.lastName || ""}`.trim(),
      );
      setContactNumber(profileUser?.mobileNumber?.trim() || "");
    }
  }, [isEmployeePortal, profileUser]);

  useEffect(() => {
    if (isEmployeePortal && patientId) {
      patientService.getById(patientId, {
        setResponse: (response) => {
          const item = response?.data;
          if (item) {
            setName(`${item?.firstName} ${item?.lastName}`);
            setContactNumber(item?.mobileNumber?.trim() || "");
          }
        },
      });
    }
  }, [isEmployeePortal, patientId]);

  const payload = {
    ...(isEmployeePortal && patientId ? { patientId } : {}),
    name,
    contactNumber,
    reasonForVisit,
    date: appointmentDate,
    time: appointmentTime,
    address,
  };

  const validateResidentForm = () => {
    const formErrors = {};
    if (!name) formErrors.name = "Name is required.";
    if (!contactNumber)
      formErrors.contactNumber = "Contact number is required.";
    if (!appointmentDate)
      formErrors.appointmentDate = "Appointment date is required.";
    if (!reasonForVisit)
      formErrors.reasonForVisit = "Reason for visit is required.";
    if (!address) formErrors.address = "Address for visit is required.";
    return formErrors;
  };

  const resetForm = () => {
    setName(
      isEmployeePortal
        ? ""
        : `${profileUser?.firstName || ""} ${profileUser?.lastName || ""}`.trim(),
    );
    setContactNumber(
      isEmployeePortal ? "" : profileUser?.mobileNumber?.trim() || "",
    );
    setReasonForVisit("");
    setAppointmentDate("");
    setAppointmentTime(isEmployeePortal ? "" : "12:00 AM");
    setAddress("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isEmployeePortal) {
      const formErrors = validateResidentForm();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }
      setErrors({});
      setLoading(true);
      const res = await residentService.bookAppointment(payload);
      setLoading(false);
      if (!res.error) {
        resetForm();
        navigate(-1);
      }
      return;
    }

    const res = await patientService.createAppointment(payload, {
      setLoading,
      navigate,
    });
    if (!res.error) {
      resetForm();
    }
  };

  const timeSlots = generateTimeSlots(hoursFormat);
  const title = isEmployeePortal
    ? "Book Appointment"
    : "Appointment Tracking Log";
  const submitLabel = isEmployeePortal ? "SUBMIT" : "SUBMIT DETAILS";
  const submitDisabled =
    loading ||
    (isEmployeePortal &&
      profileUser?.accountType === ACCOUNT_TYPES.RESTRICTED &&
      profileUser?.userType === ROLES.EMPLOYEE);

  return (
    <>
      <NavWrapper title={title} isArrow={true} />
      <Container>
        <Form onSubmit={submitHandler}>
          {!isEmployeePortal && (
            <Row className="mb-2">
              <Col xs={12} md={12}>
                <Form.Group className="fw-bold">Booking Details</Form.Group>
              </Col>
            </Row>
          )}
          <Card body className="mb-3">
            <Row>
              <Col
                xs={12}
                md={isEmployeePortal ? 6 : 12}
                lg={isEmployeePortal ? 6 : 4}
              >
                <Form.Group className={isEmployeePortal ? undefined : "mb-3"}>
                  <Form.Label className="fw-bold">
                    {isEmployeePortal ? "Name:" : "Name"}
                  </Form.Label>
                  <Form.Control
                    required
                    value={name}
                    isInvalid={!!errors.name}
                    onChange={(e) => setName(e.target.value)}
                    onInput={isEmployeePortal ? undefined : undefined}
                  />
                  {!isEmployeePortal && (
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col
                xs={12}
                md={isEmployeePortal ? 6 : 12}
                lg={isEmployeePortal ? 6 : 4}
              >
                <Form.Group className={isEmployeePortal ? undefined : "mb-3"}>
                  <Form.Label className="fw-bold">
                    {isEmployeePortal ? "Contact Number:" : "Contact Number"}
                  </Form.Label>
                  <Form.Control
                    required
                    value={contactNumber}
                    isInvalid={!!errors.contactNumber}
                    onChange={(e) => {
                      const value = e.target.value?.trim();
                      if (isEmployeePortal && !/^\d*$/.test(value)) return;
                      setContactNumber(value);
                    }}
                  />
                  {!isEmployeePortal && (
                    <Form.Control.Feedback type="invalid">
                      {errors.contactNumber}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              {!isEmployeePortal && (
                <>
                  <Col xs={12} md={12} lg={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">
                        Appointment Date
                      </Form.Label>
                      <DatePicker
                        selected={formatDateToMMDDYYYY(appointmentDate)}
                        onChange={(selectedDate) =>
                          setAppointmentDate(selectedDate?.toDateString())
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        minDate={new Date()}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.appointmentDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={12} lg={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Time Slot</Form.Label>
                      <Form.Select
                        value={appointmentTime}
                        required
                        onChange={(e) =>
                          setAppointmentTime(e.target.value?.trim())
                        }
                      >
                        {timeSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={12} lg={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={1}
                        required
                        maxLength={100}
                        value={address}
                        isInvalid={!!errors.address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </>
              )}
            </Row>
          </Card>

          {isEmployeePortal && (
            <>
              <Form.Label className="fw-bold">Choose your slot</Form.Label>
              <Card body className="mb-3">
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="d-flex flex-column">
                      <Form.Label className="fw-bold">
                        Appointment Date:
                      </Form.Label>
                      <DatePicker
                        selected={formatDateToMMDDYYYY(appointmentDate)}
                        onChange={(selectedDate) =>
                          setAppointmentDate(selectedDate?.toDateString())
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        minDate={new Date()}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Time Slot:</Form.Label>
                      <Form.Select
                        value={appointmentTime}
                        required
                        onChange={(e) =>
                          setAppointmentTime(e.target.value?.trim())
                        }
                      >
                        {timeSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
              <Row>
                <Col xs={12} md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={1}
                      required
                      maxLength={100}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}

          <Row>
            <Col xs={12} md={12}>
              <Form.Group className={isEmployeePortal ? undefined : "mb-3"}>
                <Form.Label className="fw-bold">Reason For Visit</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={isEmployeePortal ? 6 : 5}
                  required
                  maxLength={500}
                  value={reasonForVisit}
                  isInvalid={!!errors.reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                />
                {!isEmployeePortal && (
                  <Form.Control.Feedback type="invalid">
                    {errors.reasonForVisit}
                  </Form.Control.Feedback>
                )}
                <div className="text-muted mt-1">
                  {500 - reasonForVisit.length} characters remaining
                </div>
              </Form.Group>
            </Col>
          </Row>

          <div
            className={
              isEmployeePortal
                ? "save-as-draft-btn123 hidePrint"
                : "employee-btn-joiner hidePrint"
            }
          >
            <button
              className="employee_create_btn"
              type="submit"
              disabled={submitDisabled}
            >
              {loading ? <ClipLoader color="#fff" /> : submitLabel}
            </button>
          </div>
        </Form>
      </Container>
    </>
  );
}

const BookAppointmentEmployee = () => (
  <BookAppointmentForm portal={BOOK_APPOINTMENT_PORTALS.EMPLOYEE} />
);
const BookAppointmentResident = () => (
  <BookAppointmentForm portal={BOOK_APPOINTMENT_PORTALS.RESIDENT} />
);

export default HOC({ Wcomponenet: BookAppointmentEmployee });
export const BookAppointmentResidentPage = InnerHOC({
  Wcomponenet: BookAppointmentResident,
});
