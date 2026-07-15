import { useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { RadioMaker } from "@/utils/Makers";
import { formatDateToMMDDYYYY } from "@/utils/utils";

const ViewOtherInformation = ({ formData }) => {
  const [militaryExperience, setMilitaryExperience] = useState("");
  const [ifSpecialty, setIfSpeciality] = useState("");
  const [dateEntered, setDateEntered] = useState("");
  const [dateDischarged, setDateDischarged] = useState("");
  const [nationalGuard, setNationalGuard] = useState("");
  const [validLicense, setValidLicense] = useState("");
  const [driverLicenseNumber, setDriverLicenseNumber] = useState("");
  const [driverLicenseClass, setDriverLicenseClass] = useState("");
  const [driverLicenseStatusIssued, setDriverLicenseStatusIssued] =
    useState("");
  const [typingSkill, setTypingSkill] = useState("");
  const [wordsPerMinute, setWordsPerMinute] = useState("");
  const [familiarWithMicrosoft, setFamiliarWithMicrosoft] = useState("");
  const [otherSkill, setOtherSkill] = useState("");
  const [professionalReferences, setProfessionalRefrences] = useState([]);

  useEffect(() => {
    if (formData) {
      setMilitaryExperience(formData?.militaryExperience);
      setIfSpeciality(formData?.ifSpecialty);
      setDateEntered(formData?.dateEntered);
      setDateDischarged(formData?.dateDischarged);
      setNationalGuard(formData?.nationalGuard);
      setValidLicense(formData?.validLicense);
      setDriverLicenseNumber(formData?.driverLicenseNumber);
      setDriverLicenseClass(formData?.driverLicenseClass);
      setDriverLicenseStatusIssued(formData?.driverLicenseStatusIssued);
      setTypingSkill(formData?.typingSkill);
      setWordsPerMinute(formData?.wordsPerMinute);
      setFamiliarWithMicrosoft(formData?.familiarWithMicrosoft);
      setOtherSkill(formData?.otherSkill);
      setProfessionalRefrences(formData?.professionalReferences);
    }
  }, [formData]);

  return (
    <>
      <Form>
        <div className="view-details w-100 mt-2">
          <h6 className="fw-bold">Military Experience</h6>
          <Row>
            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">If yes, which speciality? : </p>
                <h5 className="view-value mb-0">{ifSpecialty}</h5>
              </div>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Date Entered : </p>
                <h5 className="view-value mb-0">
                  {formatDateToMMDDYYYY(dateEntered)}
                </h5>
              </div>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Date Discharged : </p>
                <h5 className="view-value mb-0">
                  {formatDateToMMDDYYYY(dateDischarged)}
                </h5>
              </div>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid d-sm-flex align-items-center my-1 my-md-2 p-3">
                <p className="view-label mb-sm-0">
                  Have you ever served in the armed forces? :{" "}
                </p>
                <div className="radio-inline pe-none">
                  <RadioMaker
                    inline
                    name={"militaryExperience"}
                    setValue={setMilitaryExperience}
                    value={true}
                    id={"militaryExperience1"}
                    label={"Yes"}
                    checked={militaryExperience}
                  />
                  <RadioMaker
                    inline
                    name={"militaryExperience"}
                    setValue={setMilitaryExperience}
                    value={false}
                    id={"militaryExperience2"}
                    label={"No"}
                    checked={militaryExperience}
                  />
                </div>
              </div>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid view-details-grid-inline d-sm-flex align-items-center my-1 my-md-2 p-3">
                <p className="view-label mb-sm-0">
                  Are you currently a member of the national guard? :{" "}
                </p>
                <div className="radio-inline pe-none">
                  <RadioMaker
                    inline
                    name={"nationalGuard"}
                    setValue={setNationalGuard}
                    value={true}
                    id={"nationalGuard1"}
                    label={"Yes"}
                    checked={nationalGuard}
                  />
                  <RadioMaker
                    inline
                    name={"nationalGuard"}
                    setValue={setNationalGuard}
                    value={false}
                    id={"nationalGuard2"}
                    label={"No"}
                    checked={nationalGuard}
                  />
                </div>
              </div>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid view-details-grid-inline d-sm-flex align-items-center my-1 my-md-2 p-3">
                <p className="view-label mb-sm-0">
                  Do you have a Valid Driver’s License? :{" "}
                </p>
                <div className="radio-inline pe-none">
                  <RadioMaker
                    inline
                    name={"validLicense"}
                    setValue={setValidLicense}
                    value={true}
                    id={"validLicense1"}
                    label={"Yes"}
                    checked={validLicense}
                  />
                  <RadioMaker
                    inline
                    name={"validLicense"}
                    setValue={setValidLicense}
                    value={false}
                    id={"validLicense2"}
                    label={"No"}
                    checked={validLicense}
                  />
                </div>
              </div>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Driver’s License Number : </p>
                <h5 className="view-value mb-0">{driverLicenseNumber}</h5>
              </div>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">class : </p>
                <h5 className="view-value mb-0">{driverLicenseClass}</h5>
              </div>
            </Col>
            <Col xs={12} md={12} lg={12}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">State Issued : </p>
                <h5 className="view-value mb-0">{driverLicenseStatusIssued}</h5>
              </div>
            </Col>
          </Row>
        </div>
        <div className="view-details w-100 mt-2">
          <h6 className="fw-bold"> For Office Positions Only </h6>

          <Row>
            <Col xs={12} md={12}>
              <div className="view-details-grid view-details-grid-inline d-sm-flex align-items-center my-1 my-md-2 p-3">
                <p className="view-label mb-sm-0">
                  Do you have typing skills on the computer? :{" "}
                </p>
                <div className="radio-inline pe-none">
                  <RadioMaker
                    inline
                    name={"typingSkill"}
                    setValue={setTypingSkill}
                    value={true}
                    id={"typingSkill1"}
                    label={"Yes"}
                    checked={typingSkill}
                  />
                  <RadioMaker
                    inline
                    name={"typingSkill"}
                    setValue={setTypingSkill}
                    value={false}
                    id={"typingSkill2"}
                    label={"No"}
                    checked={typingSkill}
                  />
                </div>
              </div>
            </Col>
            <Col xs={12} md={12}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Words Per Minute : </p>
                <h5 className="view-value mb-0">{wordsPerMinute}</h5>
              </div>
            </Col>
            <Col xs={12} md={12}>
              <div className="view-details-grid view-details-grid-inline d-sm-flex align-items-center my-1 my-md-2 p-3">
                <p className="view-label mb-sm-0">
                  Are you familiar with using Microsoft Word, Microsoft Excel,
                  etc? :{" "}
                </p>
                <div className="radio-inline pe-none">
                  <RadioMaker
                    inline
                    name={"familiarWithMicrosoft"}
                    setValue={setFamiliarWithMicrosoft}
                    value={true}
                    id={"familiarWithMicrosoft1"}
                    label={"Yes"}
                    checked={familiarWithMicrosoft}
                  />
                  <RadioMaker
                    inline
                    name={"familiarWithMicrosoft"}
                    setValue={setFamiliarWithMicrosoft}
                    value={false}
                    id={"familiarWithMicrosoft2"}
                    label={"No"}
                    checked={familiarWithMicrosoft}
                  />
                </div>
              </div>
            </Col>
            <Col xs={12} md={12}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Other skills : </p>
                <h5 className="view-value mb-0">{otherSkill}</h5>
              </div>
            </Col>
          </Row>
        </div>
        <div className="view-details w-100 mt-2">
          <h6 className="fw-bold">
            {" "}
            {professionalReferences?.length} Professional References{" "}
          </h6>
          <Row></Row>
        </div>

        <div className="view-details w-100">
          <Row>
            <Col xs={12}>
              {professionalReferences?.length > 0 && (
                <div className="mt-3 ">
                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>Address</th>
                        <th>Company</th>
                        <th>Relationship/Phone No</th>
                        <th>How long have you known him/her?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {professionalReferences?.map((i, index) => (
                        <tr key={index}>
                          <td> {i.name} </td>
                          <td> {i.address} </td>
                          <td> {i.company} </td>
                          <td> {i.phoneNumber} </td>
                          <td> {i.howLongYouKnow} </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </Form>
    </>
  );
};

export default ViewOtherInformation;
