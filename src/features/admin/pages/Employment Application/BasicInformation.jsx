/** @format */
import { useEffect, useState } from "react";
import { Container, Form, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./Dashboard2.css";
import { ClipLoader } from "react-spinners";
import NavWrapper from "@/utils/NavWrapper";
import { RadioMaker } from "@/utils/Makers";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import DatePicker from "react-datepicker";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { useNavigateWithParams } from "@shared/hooks";
import {
  createEmployeeApplication,
  updateEmployeeApplication,
  getEmployeeApplication,
} from "@/features/shared/services";
import { showNotification, logger } from "@/utils";
const BasicInformation = () => {
  const navigate = useNavigate();
  const ProfileDetails = useSelector(userProfile);
  const { employeId } = useParams();
  const [today, setToday] = useState(formatDateToMMDDYYYY(new Date()));
  const [hireDate, setHireDate] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [cityAddress, setCityAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [howLong, setHowLong] = useState("");
  const [primaryPhoneNumber, setPrimaryPhoneNumber] = useState("");
  const [alternativePhoneNumber, setAlternativePhoneNumber] = useState("");
  const [underAgee18, setUnderAgee18] = useState(false);
  const [ssn, setSsn] = useState("");
  const [legallyEligible, setLegallyEligible] = useState(false);
  const [desirePosition, setDesirePosition] = useState("");
  const [desireSalary, setDesireSalary] = useState("");
  const [dateAvailableToStart, setDateAvailableToStart] = useState("");
  const [hourWorkWeekly, setHourWorkWeekly] = useState("");
  const [fullTimeOnly, setFullTimeOnly] = useState("");
  const [partTimeOnly, setPartTimeOnly] = useState("");
  const [fullPartTimeOnly, setFullPartTimeOnly] = useState("");
  const [onCall, setOnCall] = useState("");
  const [monday, setMonday] = useState("");
  const [tuesday, setTuesday] = useState("");
  const [wednesday, setWednesday] = useState("");
  const [thursday, setThursday] = useState("");
  const [friday, setFriday] = useState("");
  const [saturday, setSaturday] = useState("");
  const [sunday, setSunday] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middle, setMiddle] = useState("");
  const [maiden, setMaiden] = useState("");
  const [stateAddress, setStateAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState({});
  const [prefrence, setPrefrence] = useState(false);
  const { navigateWithParams } = useNavigateWithParams();
  const payload = {
    prefrence,
    today,
    hireDate,
    addressNumber,
    streetAddress,
    cityAddress,
    zipCode,
    howLong,
    primaryPhoneNumber,
    alternativePhoneNumber,
    underAgee18,
    ssn,
    legallyEligible,
    desirePosition,
    desireSalary,
    dateAvailableToStart,
    hourWorkWeekly,
    fullTimeOnly,
    partTimeOnly,
    fullPartTimeOnly,
    onCall,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    firstName,
    lastName,
    middle,
    maiden,
    stateAddress,
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createEmployeeApplication(payload);
      setLoading(false);
      if (!result.success) {
        showNotification(result);
        return;
      }
      showNotification({
        message: result.message || "Application saved successfully.",
      });
      navigateWithParams("/educational-background");
    } catch (e) {
      setLoading(false);
      showNotification({
        message: e.message || "Failed to save application.",
        type: "danger",
      });
      logger.error("Failed to submit employee application details", e);
    }
  };
  const updateSubmitHandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateEmployeeApplication(employeId, payload);
      setLoading(false);
      if (!result.success) {
        showNotification(result);
        return;
      }
      showNotification({
        message: result.message || "Application updated successfully.",
      });
      navigate(`/educational-background/${employeId}`);
    } catch (e) {
      setLoading(false);
      showNotification({
        message: e.message || "Failed to update application.",
        type: "danger",
      });
      logger.error("Failed to update employee application details", e);
    }
  };
  const fetchHandler = async () => {
    try {
      const result = await getEmployeeApplication(
        ProfileDetails?.userType,
        employeId,
      );
      if (!result.success) {
        showNotification(result);
        return;
      }
      setDetail(result.data || {});
    } catch (error) {
      showNotification({
        message: error.message || "Failed to load application details.",
        type: "danger",
      });
      logger.error("Failed to load employee application details", error);
    }
  };
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };
  useEffect(() => {
    if (!isEmpty(detail)) {
      setPrefrence(detail?.prefrence);
      setAddressNumber(detail?.addressNumber);
      setHireDate(detail?.hireDate);
      setStreetAddress(detail?.streetAddress);
      setCityAddress(detail?.cityAddress);
      setZipCode(detail?.zipCode);
      setHowLong(detail?.howLong);
      setPrimaryPhoneNumber(detail?.primaryPhoneNumber);
      setAlternativePhoneNumber(detail?.alternativePhoneNumber);
      setUnderAgee18(detail?.underAgee18);
      setSsn(detail?.ssn);
      setLegallyEligible(detail?.legallyEligible);
      setDesirePosition(detail?.desirePosition);
      setDesireSalary(detail?.desireSalary);
      setDateAvailableToStart(detail?.dateAvailableToStart);
      setHourWorkWeekly(detail?.hourworkWeekly);
      setFullTimeOnly(detail?.fullTimeOnly);
      setPartTimeOnly(detail?.partTimeOnly);
      setFullPartTimeOnly(detail?.fullPartTimeOnly);
      setOnCall(detail?.onCall);
      setMonday(detail?.monday);
      setTuesday(detail?.tuesday);
      setWednesday(detail?.wednesday);
      setThursday(detail?.thursday);
      setFriday(detail?.friday);
      setSaturday(detail?.saturday);
      setSunday(detail?.sunday);
      setFirstName(detail?.firstName);
      setLastName(detail?.lastName);
      setMiddle(detail?.middle);
      setMaiden(detail?.maiden);
      setStateAddress(detail?.stateAddress);
      setToday(detail?.today);
    } else {
      setAddressNumber("");
      setHireDate("");
      setStreetAddress("");
      setCityAddress("");
      setZipCode("");
      setHowLong("");
      setPrimaryPhoneNumber("");
      setAlternativePhoneNumber("");
      setUnderAgee18(false);
      setSsn("");
      setLegallyEligible(false);
      setDesirePosition("");
      setDesireSalary("");
      setDateAvailableToStart("");
      setHourWorkWeekly("");
      setFullTimeOnly("");
      setPartTimeOnly("");
      setFullPartTimeOnly("");
      setOnCall("");
      setMonday("");
      setTuesday("");
      setWednesday("");
      setThursday("");
      setFriday("");
      setSaturday("");
      setSunday("");
      setFirstName("");
      setLastName("");
      setMiddle("");
      setMaiden("");
      setStateAddress("");
    }
  }, [detail]);
  const isNineDigitOrEmpty = ssn?.length === 11 || !ssn ? true : false;
  const handleInputChange = (event) => {
    const input = event.target.value;

    // Remove all non-digit characters
    const numericInput = input.replace(/\D/g, "");

    // Add dashes dynamically
    const formattedSsn = numericInput
      .slice(0, 9) // Limit input to 9 digits
      .replace(/(\d{3})(\d{1,2})?(\d{1,4})?/, (match, p1, p2, p3) => {
        if (p3) return `${p1}-${p2}-${p3}`;
        if (p2) return `${p1}-${p2}`;
        return p1;
      });
    setSsn(formattedSsn);
  };
  return (
    <>
      <div className="main-div-personal important h-full">
        <NavWrapper
          title={"Basic Information"}
          filled={1}
          empty={4}
          isArrow={true}
        />
        <Container>
          <Form
            id="form-appendix"
            onSubmit={employeId ? updateSubmitHandle : handleSubmit}
          >
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">Today's Date:</Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(today)}
                      onChange={(selectedDate) =>
                        setToday(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            today ? formatDateToMMDDYYYY(today) : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">Hire Date:</Form.Label>
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
              </Row>
            </Card>
            <Form.Label className="fw-bold">Name</Form.Label>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">First:</Form.Label>
                    <Form.Control
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={firstName}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Last:</Form.Label>
                    <Form.Control
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={lastName}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Middle:</Form.Label>
                    <Form.Control
                      onChange={(e) => setMiddle(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={middle}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Maiden:</Form.Label>
                    <Form.Control
                      onChange={(e) => setMaiden(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={maiden}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Form.Label className="fw-bold">Current Address</Form.Label>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Number:</Form.Label>
                    <Form.Control
                      onChange={(e) => setAddressNumber(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={addressNumber}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Street:</Form.Label>
                    <Form.Control
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={streetAddress}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">City:</Form.Label>
                    <Form.Control
                      onChange={(e) => setCityAddress(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={cityAddress}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">State:</Form.Label>
                    <Form.Control
                      onChange={(e) => setStateAddress(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={stateAddress}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Zip:</Form.Label>
                    <Form.Control
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={zipCode}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      How long have you lived at this address?
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setHowLong(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={howLong}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Primary Phone Number:
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setPrimaryPhoneNumber(e.target.value)}
                      placeholder={""}
                      type={"tel"}
                      value={primaryPhoneNumber}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Alternative Phone Number:
                    </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setAlternativePhoneNumber(e.target.value)
                      }
                      placeholder={""}
                      type={"tel"}
                      value={alternativePhoneNumber}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      SSN:{" "}
                      {!isNineDigitOrEmpty && (
                        <span className="text-red-600">
                          *Please Enter 9 digit SSN number.
                        </span>
                      )}
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => handleInputChange(e)}
                      placeholder={""}
                      type={"text"}
                      value={ssn}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Are you under the age of 18?
                    </Form.Label>
                    <div className="radio-inline">
                      <RadioMaker
                        inline
                        name={"underAgee18"}
                        setValue={setUnderAgee18}
                        value={true}
                        id={"underAge"}
                        label={"Yes"}
                        checked={underAgee18}
                      />
                      <RadioMaker
                        inline
                        name={"underAgee18"}
                        setValue={setUnderAgee18}
                        value={false}
                        id={"Plus"}
                        label={"No"}
                        checked={underAgee18}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Are you legally eligible to work in the US?
                    </Form.Label>
                    <div className="radio-inline">
                      <RadioMaker
                        inline
                        name={"eligible"}
                        setValue={setLegallyEligible}
                        value={true}
                        id={"USDone"}
                        label={"Yes"}
                        checked={legallyEligible}
                      />
                      <RadioMaker
                        inline
                        name={"eligible"}
                        setValue={setLegallyEligible}
                        value={false}
                        id={"UsFalse"}
                        label={"No"}
                        checked={legallyEligible}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Form.Label className="fw-bold">
              {" "}
              (Proof of U.S. citizenship will be required upon hire)
            </Form.Label>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Desired Positions:
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setDesirePosition(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={desirePosition}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Desired Salary:</Form.Label>
                    <Form.Control
                      onChange={(e) => setDesireSalary(e.target.value)}
                      placeholder={"________$"}
                      type={"text"}
                      value={desireSalary}
                    ></Form.Control>
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">
                      Date available to start:
                    </Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(dateAvailableToStart)}
                      onChange={(selectedDate) =>
                        setDateAvailableToStart(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            dateAvailableToStart
                              ? formatDateToMMDDYYYY(dateAvailableToStart)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      How many hours can you work weekly?
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setHourWorkWeekly(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={hourWorkWeekly}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Form.Label className="fw-bold">
              Type of Employment desired
            </Form.Label>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Full time ONLY:</Form.Label>
                    <Form.Control
                      onChange={(e) => setFullTimeOnly(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={fullTimeOnly}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Part time ONLY:</Form.Label>
                    <Form.Control
                      onChange={(e) => setPartTimeOnly(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={partTimeOnly}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Full time or Part time:
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setFullPartTimeOnly(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={fullPartTimeOnly}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">On Call:</Form.Label>
                    <Form.Control
                      onChange={(e) => setOnCall(e.target.value)}
                      placeholder={""}
                      type={"text"}
                      value={onCall}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Form.Label className="fw-bold">
              Days/Hours Available to Work
            </Form.Label>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Monday:</Form.Label>
                    <Form.Control
                      onChange={(e) => setMonday(e.target.value)}
                      placeholder={"10:00 to 05:00"}
                      type={"text"}
                      value={monday}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Tuesday:</Form.Label>
                    <Form.Control
                      onChange={(e) => setTuesday(e.target.value)}
                      placeholder={"10:00 to 05:00"}
                      type={"text"}
                      value={tuesday}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Wednesday:</Form.Label>
                    <Form.Control
                      onChange={(e) => setWednesday(e.target.value)}
                      placeholder={"10:00 to 05:00"}
                      type={"text"}
                      value={wednesday}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Thursday:</Form.Label>
                    <Form.Control
                      onChange={(e) => setThursday(e.target.value)}
                      placeholder={"10:00 to 05:00"}
                      type={"text"}
                      value={thursday}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Friday:</Form.Label>
                    <Form.Control
                      onChange={(e) => setFriday(e.target.value)}
                      placeholder={"10:00 to 05:00"}
                      type={"text"}
                      value={friday}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Saturday:</Form.Label>
                    <Form.Control
                      onChange={(e) => setSaturday(e.target.value)}
                      placeholder={"10:00 to 05:00"}
                      type={"text"}
                      value={saturday}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Sunday:</Form.Label>
                    <Form.Control
                      onChange={(e) => setSunday(e.target.value)}
                      placeholder={"10:00 to 05:00"}
                      type={"text"}
                      value={sunday}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <Form.Group className="mb-3 d-flex justify-start mt-3">
                    <Form.Check
                      className="fw-bold"
                      label="No Prefrence"
                      onChange={() => setPrefrence(!prefrence)}
                      value={prefrence}
                      checked={prefrence === true}
                      id="noPrefrence"
                    ></Form.Check>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Row>
              <Col xs={12}>
                <div
                  className={`employee_btn_div view_btn ${!isNineDigitOrEmpty && "pe-none"}`}
                >
                  <button type="submit" className="employee_create_btn">
                    {loading ? <ClipLoader color="#fff" /> : "NEXT"}
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </>
  );
};
export default HOC({
  Wcomponenet: BasicInformation,
});
