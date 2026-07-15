import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import DatePicker from "react-datepicker";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  getOfferLetterByEmployeeId,
  addOfferLetter,
} from "@/features/shared/services/index";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { ClipLoader } from "react-spinners";

const OfferletterAdmin = () => {
  const profileInfo = useSelector(userProfile);
  const navigate = useNavigate();

  const { employeId } = useParams();
  const [data, setData] = useState({});
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [positionOffered, setPositionOffered] = useState("");
  const [loading, setloading] = useState("");
  const [startingPay, setStartingPay] = useState("");
  const [offerDate, setOfferDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [administratorsName, setAdministratorsName] = useState("");
  const [signAdmin, setSignAdmin] = useState(false);
  const [signers, setSigners] = useState([]);
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeSignDate, setEmployeeSignDate] = useState("");
  const [administratorsSignature, setAdministratorsSignature] = useState("");
  const [administratorsSignatureDate, setAdministratorsSignatureDate] =
    useState([]);
  const [administratorsSignatureTime, setAdministratorsSignatureTime] =
    useState([]);

  const getAllnotes = () => {
    getOfferLetterByEmployeeId(employeId)
      .then((res) => {
        setData(res.data || {});
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setData({});
        }
      });
  };

  useEffect(() => {
    getAllnotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) {
      // Set the state values
      setPositionOffered(data.positionOffered || "");
      setStartingPay(data.startingPay || "");
      setOfferDate(data.offerDate || "");
      setStartDate(data.startDate || "");
      setEmployeeName(data.employeeName || "");
      setEmployeeId(employeId || "");
      setCompanyName(data.companyName || "");
      setAdministratorsName(data.administratorsName || "");
      setSignAdmin(data.signAdmin || false);
      setSigners(data.signers || []);
      setAdministratorsSignature(data.administratorsSignature);
      setAdministratorsSignatureDate(data.administratorsSignatureDate);
      setAdministratorsSignatureTime(data.administratorsSignatureTime);
      setEmployeeSignature(data.employeeSignature || "");
      setEmployeeSignDate(data.employeeSignDate || "");
    }
  }, [data, employeId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setloading(true);
    const employeeDetails = {
      employeeId,
      employeeName,
      companyName,
      positionOffered,
      startingPay,
      startDate,
      offerDate,
      administratorsName,
      administratorsSignature,
      administratorsSignatureDate,
      administratorsSignatureTime,
      signers,
    };

    try {
      await addOfferLetter(employeeDetails);
      navigate(-1);
    } catch {
      // Error notification handled by addOfferLetter
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <AddSignature
        show={signAdmin}
        setValue={setAdministratorsSignature}
        setDate={setAdministratorsSignatureDate}
        setTime={setAdministratorsSignatureTime}
      />
      <NavWrapper isArrow={true} title={"Offer Letter"} />
      <Container>
        <Form onSubmit={submitHandler}>
          <Card body>
            <Row>
              <Col xs={12} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Position Offered</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    onChange={(e) => setPositionOffered(e.target.value)}
                    placeholder="Enter Position Offered"
                    value={positionOffered}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Starting Pay</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    onChange={(e) => setStartingPay(e.target.value)}
                    placeholder="Enter Starting Pay"
                    value={startingPay}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} lg={6}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Start Date</Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(startDate)}
                    onChange={(selectedDate) =>
                      setStartDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          startDate
                            ? formatDateToMMDDYYYY(startDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} lg={6}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Offer Date</Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(offerDate)}
                    onChange={(selectedDate) =>
                      setOfferDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          offerDate
                            ? formatDateToMMDDYYYY(offerDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={6}>
                <Button
                  className="theme-button"
                  onClick={() => setSignAdmin(true)}
                >
                  SAVED AND SIGNED
                </Button>
              </Col>
              <Col xs={12} lg={6}>
                <Form.Label className="w-100 text-end">
                  {signatureFormat({
                    sign: administratorsSignature,
                    date: administratorsSignatureDate,
                    time: administratorsSignatureTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: employeeSignature,
                    date: employeeSignDate,
                    hoursFormat,
                  })}
                </Form.Label>
                {signers?.map?.((signer) =>
                  signer?.signature?.length ? (
                    <Form.Label
                      className="w-100 text-end"
                      key={signer?.signerId}
                    >
                      {signatureFormat({
                        sign: signer?.signature,
                        time: signer?.signedTime,
                        date: signer?.dateSigned,
                        hoursFormat,
                      })}
                    </Form.Label>
                  ) : null,
                )}
              </Col>
            </Row>
          </Card>
          <Row className="mt-3 text-center">
            <Col xs={12} lg={12}>
              <div className="employee-btn-joiner mt-2 mt-md-5">
                <button type="submit" className="employee_create_btn hidePrint">
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

export default HOC({ Wcomponenet: OfferletterAdmin });
