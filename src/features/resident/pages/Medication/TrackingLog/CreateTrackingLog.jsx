/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import { medicationService } from "@/features/shared/services";
import DatePicker from "react-datepicker";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { ClipLoader } from "react-spinners";

const BookAppointment = () => {
  const navigate = useNavigate();
  const profileUser = useSelector(userProfile);
  const hoursFormat = profileUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [patientId, setPatientId] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [name, setName] = useState("");
  const [contectNumber, setContectNumber] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [appoinmentDate, setAppoinmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("12:00 AM");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (patientDetail) {
      setContectNumber(patientDetail?.mobileNumber?.trim());
      setName(`${patientDetail?.firstName} ${patientDetail?.lastName}`);
    }
  }, [patientDetail]);

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

  const appoinmentData = {
    patientId,
    name,
    contactNumber: contectNumber,
    reasonForVisit: reasonForVisit,
    date: appoinmentDate,
    time: appointmentTime,
    address,
  };
  const initial_value = () => {
    setName("");
    setContectNumber("");
    setReasonForVisit("");
    setAppoinmentDate("");
    setAppointmentTime("");
  };

  const validateForm = () => {
    let formErrors = {};
    const { name, contactNumber, date, reasonForVisit, time } = appoinmentData;
    if (!name) formErrors.name = "Name is required.";
    if (!contactNumber)
      formErrors.contactNumber = "Contact number is required.";
    if (!date) formErrors.appointmentDate = "Appointment date is required.";
    if (!reasonForVisit)
      formErrors.reasonForVisit = "Reason for visit is required.";
    if (!address) formErrors.address = "Address is required.";

    return formErrors;
  };

  const handlePostData = async (e) => {
    e.preventDefault();
    // Form validation
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    // Clear errors and proceed with the API call
    setErrors({});
    const res = await medicationService.createAppointment(appoinmentData, {
      setLoading,
      navigate,
    });
    if (!res.error) {
      initial_value();
    }
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
        <Form onSubmit={handlePostData}>
          <Row className="mb-2">
            <Col xs={12}>
              <PatientComponent
                MainPatientId={setPatientId}
                setWholeData={setPatientDetail}
              />
            </Col>
          </Row>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={12} lg={4}>
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
              <Col xs={12} md={12} lg={4}>
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
                    minDate={new Date()}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.appointmentDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Time Slot</Form.Label>

                  <Form.Select
                    value={appointmentTime}
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
                <button
                  disabled={loading}
                  className="employee_create_btn"
                  type="submit"
                >
                  {loading ? <ClipLoader color="#fff" /> : "SUBMIT DETAILS"}
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default HOC({ Wcomponenet: BookAppointment });
