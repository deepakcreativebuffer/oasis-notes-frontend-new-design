import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { RadioMaker } from "@/utils/Makers";
import { formatDateToMMDDYYYY } from "@/utils/utils";

const ViewBasicInformation = ({ formData }) => {
  const [today, setToday] = useState("");
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
  const [prefrence, setPrefrence] = useState("");

  const isEmpty = (obj) => {
    return Object?.keys(obj)?.length === 0;
  };

  useEffect(() => {
    if (!isEmpty(formData)) {
      setToday(formData?.today);
      setPrefrence(formData?.prefrence);
      setAddressNumber(formData?.addressNumber);
      setHireDate(formData?.hireDate);
      setStreetAddress(formData?.streetAddress);
      setCityAddress(formData?.cityAddress);
      setZipCode(formData?.zipCode);
      setHowLong(formData?.howLong);
      setPrimaryPhoneNumber(formData?.primaryPhoneNumber);
      setAlternativePhoneNumber(formData?.alternativePhoneNumber);
      setUnderAgee18(formData?.underAgee18);
      formData?.ssn &&
        setSsn(
          formData?.ssn?.replaceAll("-", "")?.slice(5, 9)?.padStart(9, "*"),
        );
      setLegallyEligible(formData?.legallyEligible);
      setDesirePosition(formData?.desirePosition);
      setDesireSalary(formData?.desireSalary);
      setDateAvailableToStart(formData?.dateAvailableToStart);
      setHourWorkWeekly(formData?.hourworkWeekly);
      setFullTimeOnly(formData?.fullTimeOnly);
      setPartTimeOnly(formData?.partTimeOnly);
      setFullPartTimeOnly(formData?.fullPartTimeOnly);
      setOnCall(formData?.onCall);
      setMonday(formData?.monday);
      setTuesday(formData?.tuesday);
      setWednesday(formData?.wednesday);
      setThursday(formData?.thursday);
      setFriday(formData?.friday);
      setSaturday(formData?.saturday);
      setSunday(formData?.sunday);
      setFirstName(formData?.firstName);
      setLastName(formData?.lastName);
      setMiddle(formData?.middle);
      setMaiden(formData?.maiden);
      setStateAddress(formData?.stateAddress);
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
  }, [formData]);

  return (
    <>
      <Form id="form-appendix">
        <div className="view-details w-100">
          <Row>
            <Col xs={12} sm={6} md={6} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Today's Date : </p>
                <h5 className="view-value mb-0">
                  {formatDateToMMDDYYYY(today)}
                </h5>
              </div>
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Hire Date : </p>
                <h5 className="view-value mb-0">
                  {formatDateToMMDDYYYY(hireDate)}
                </h5>
              </div>
            </Col>
          </Row>
        </div>
        <div className="view-details w-100 mt-2">
          <h6 className="fw-bold">Name</h6>
          <Row>
            <Col xs={12} sm={3} md={6} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">First : </p>
                <h5 className="view-value mb-0">{firstName}</h5>
              </div>
            </Col>
            <Col xs={12} sm={3} md={6} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Last : </p>
                <h5 className="view-value mb-0">{lastName}</h5>
              </div>
            </Col>
            <Col xs={12} sm={3} md={6} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Middle : </p>
                <h5 className="view-value mb-0">{middle}</h5>
              </div>
            </Col>
            <Col xs={12} sm={3} md={6} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Maiden : </p>
                <h5 className="view-value mb-0">{maiden}</h5>
              </div>
            </Col>
          </Row>
        </div>
        <div className="view-details w-100 mt-2">
          <h6 className="fw-bold">Current Address</h6>
          <Row>
            <Col xs={12} md={6} lg={4}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Number : </p>
                <h5 className="view-value mb-0">{addressNumber}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Street : </p>
                <h5 className="view-value mb-0">{streetAddress}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">City : </p>
                <h5 className="view-value mb-0">{cityAddress}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">State : </p>
                <h5 className="view-value mb-0">{stateAddress}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Zip : </p>
                <h5 className="view-value mb-0">{zipCode}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">SSN : </p>
                <h5 className="view-value mb-0">{ssn}</h5>
              </div>
            </Col>

            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Primary Phone Number : </p>
                <h5 className="view-value mb-0">{primaryPhoneNumber}</h5>
              </div>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Alternative Phone Number : </p>
                <h5 className="view-value mb-0">{alternativePhoneNumber}</h5>
              </div>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">
                  How long have you lived at this address? :{" "}
                </p>
                <h5 className="view-value mb-0">{howLong}</h5>
              </div>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid view-details-grid-inline d-sm-flex align-items-center my-1 my-md-2 p-3">
                <p className="view-label mb-sm-0">
                  Are you under the age of 18? :{" "}
                </p>
                <div className="radio-inline pe-none">
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
              </div>
            </Col>
            <Col xs={12} md={12} lg={12}>
              <div className="view-details-grid view-details-grid-inline d-sm-flex align-items-center my-1 my-md-2 p-3">
                <p className="view-label mb-sm-0">
                  Are you legally eligible to work in the US? :{" "}
                </p>
                <div className="radio-inline pe-none">
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
              </div>
            </Col>
          </Row>
        </div>
        <div className="view-details w-100 mt-2">
          <h6 className="fw-bold">
            {" "}
            (Proof of U.S. citizenship will be required upon hire)
          </h6>
          <Row>
            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Desired Positions : </p>
                <h5 className="view-value mb-0">{desirePosition}</h5>
              </div>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Desired Salary : </p>
                <h5 className="view-value mb-0">{desireSalary}</h5>
              </div>
            </Col>

            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Date available to start : </p>
                <h5 className="view-value mb-0">
                  {formatDateToMMDDYYYY(dateAvailableToStart)}
                </h5>
              </div>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">
                  How many hours can you work weekly? :{" "}
                </p>
                <h5 className="view-value mb-0">{hourWorkWeekly}</h5>
              </div>
            </Col>
          </Row>
        </div>
        <div className="view-details w-100 mt-2">
          <h6 className="fw-bold mb-2">Type of Employment desired</h6>

          <Row>
            <Col xs={12} md={6} lg={3}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Full time ONLY : </p>
                <h5 className="view-value mb-0">{fullTimeOnly}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Part time ONLY : </p>
                <h5 className="view-value mb-0">{partTimeOnly}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Full time or Part time : </p>
                <h5 className="view-value mb-0">{fullPartTimeOnly}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">On Call : </p>
                <h5 className="view-value mb-0">{onCall}</h5>
              </div>
            </Col>
          </Row>
        </div>

        <div className="view-details w-100 mt-2">
          <h6 className="fw-bold mb-2">Days/Hours Available to Work</h6>

          <Row>
            <Col xs={12} md={6} lg={3}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Monday : </p>
                <h5 className="view-value mb-0">{monday}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Tuesday : </p>
                <h5 className="view-value mb-0">{tuesday}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Wednesday : </p>
                <h5 className="view-value mb-0">{wednesday}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Thursday : </p>
                <h5 className="view-value mb-0">{thursday}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Friday : </p>
                <h5 className="view-value mb-0">{friday}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Saturday : </p>
                <h5 className="view-value mb-0">{saturday}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Sunday : </p>
                <h5 className="view-value mb-0">{sunday}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <div className="view-details-grid d-flex align-items-center my-1 my-md-2 p-3">
                <div className="radio-inline pe-none">
                  <Form.Check
                    className="fw-bold"
                    label="No Prefrence"
                    onChange={() => setPrefrence(!prefrence)}
                    value={prefrence}
                    checked={prefrence}
                    id="noPrefrence"
                  ></Form.Check>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Form>
    </>
  );
};

export default ViewBasicInformation;
