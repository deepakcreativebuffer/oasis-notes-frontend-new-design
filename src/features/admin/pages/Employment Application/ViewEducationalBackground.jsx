import { useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { RadioMaker } from "@/utils/Makers";

const ViewEducationalBackground = ({ formData }) => {
  const [highSchoolGraduate, setHighSchoolGraduate] = useState("");
  const [highSchoolName, setHighSchoolName] = useState("");
  const [completeAddress, setCompleteAddress] = useState("");
  const [lastYearCompleted, setLastYearCompleted] = useState("");
  const [collegeGraduate, setCollegeGraduate] = useState("");
  const [collegeSubject, setCollegeSubject] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [collegeAddress, setCollegeAddress] = useState("");
  const [collegeLastYearCompleted, setCollegeLastYearCompleted] = useState("");
  const [youTradeGraduate, setYouTradeGraduate] = useState("");
  const [tradeSubject, setTradeSubject] = useState("");
  const [tradeSchoolName, setTradeSchoolName] = useState("");
  const [tradeAddress, setTradeAddress] = useState("");
  const [tradeLastYearCompleted, setTradeLastYearCompleted] = useState("");
  const [youOtherGraduate, setYouOtherGraduate] = useState("");
  const [otherSubject, setOtherSubject] = useState("");
  const [otherSchoolName, setOtherSchoolName] = useState("");
  const [otherAddress, setOtherAddress] = useState("");
  const [otherLastYearCompleted, setOtherLastYearCompleted] = useState("");
  const [subject, setSubject] = useState("");
  const [convictedCrime, setConvictedCrime] = useState("");
  const [convictedCrimeExplain, setConvictedCrimeExplain] = useState("");

  useEffect(() => {
    if (formData) {
      setHighSchoolGraduate(formData?.highSchoolGraduate);
      setHighSchoolName(formData?.highSchoolName);
      setCompleteAddress(formData?.completeAddress);
      setLastYearCompleted(formData?.lastYearCompleted);
      setCollegeGraduate(formData?.collegeGraduate);
      setCollegeSubject(formData?.collegeSubject);
      setCollegeName(formData?.collegeName);
      setCollegeAddress(formData?.collegeAddress);
      setCollegeLastYearCompleted(formData?.collegeLastYearCompleted);
      setYouTradeGraduate(formData?.youTradeGraduate);
      setTradeSubject(formData?.tradeSubject);
      setTradeSchoolName(formData?.tradeSchoolName);
      setTradeAddress(formData?.tradeAddress);
      setTradeLastYearCompleted(formData?.tradeLastYearCompleted);
      setYouOtherGraduate(formData?.youOtherGraduate);
      setOtherSubject(formData?.otherSubject);
      setOtherSchoolName(formData?.otherSchoolName);
      setOtherAddress(formData?.otherAddress);
      setOtherLastYearCompleted(formData?.otherLastYearCompleted);
      setSubject(formData?.subject);
      setConvictedCrime(formData?.convictedCrime);
      setConvictedCrimeExplain(formData?.convictedCrimeExplain);
    }
  }, [formData]);
  return (
    <>
      <Form className="mt-2">
        <Table table responsive bordered>
          <thead>
            <tr>
              <th>Level</th>
              <th>Complete Address</th>
              <th>Last year completed</th>
              <th>Did you graduate?</th>
              <th>Subject(s) studied/Degree(s) received</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{highSchoolName}</td>
              <td>{completeAddress}</td>
              <td>
                <div className="radio-inline pe-none">
                  <RadioMaker
                    inline
                    name={"highschool"}
                    setValue={setLastYearCompleted}
                    value={1}
                    id={"highschool1"}
                    label={1}
                    checked={lastYearCompleted}
                  />
                  <RadioMaker
                    inline
                    name={"highschool"}
                    setValue={setLastYearCompleted}
                    value={2}
                    id={"highschool2"}
                    label={2}
                    checked={lastYearCompleted}
                  />
                  <RadioMaker
                    inline
                    name={"highschool"}
                    setValue={setLastYearCompleted}
                    value={3}
                    id={"highschool3"}
                    label={3}
                    checked={lastYearCompleted}
                  />
                  <RadioMaker
                    inline
                    name={"highschool"}
                    setValue={setLastYearCompleted}
                    value={4}
                    id={"highschool4"}
                    label={4}
                    checked={lastYearCompleted}
                  />
                </div>
              </td>
              <td>
                <div className="radio-inline pe-none">
                  <RadioMaker
                    inline
                    name={"highschoolGraduate"}
                    setValue={setHighSchoolGraduate}
                    value={true}
                    id={"highschoolGraduate1"}
                    label={"Yes"}
                    checked={highSchoolGraduate}
                  />
                  <RadioMaker
                    inline
                    name={"highschoolGraduate"}
                    setValue={setHighSchoolGraduate}
                    value={false}
                    id={"highschoolGraduate2"}
                    label={"No"}
                    checked={highSchoolGraduate}
                  />
                </div>
              </td>
              <td>{collegeSubject}</td>
            </tr>

            <tr>
              <td>{collegeName}</td>
              <td>{collegeAddress}</td>
              <td>
                <div className="radio-inline pe-none">
                  <RadioMaker
                    inline
                    name={"college"}
                    setValue={setCollegeLastYearCompleted}
                    value={1}
                    id={"college1"}
                    label={1}
                    checked={collegeLastYearCompleted}
                  />
                  <RadioMaker
                    inline
                    name={"college"}
                    setValue={setCollegeLastYearCompleted}
                    value={2}
                    id={"college2"}
                    label={2}
                    checked={collegeLastYearCompleted}
                  />
                  <RadioMaker
                    inline
                    name={"college"}
                    setValue={setCollegeLastYearCompleted}
                    value={3}
                    id={"college3"}
                    label={3}
                    checked={collegeLastYearCompleted}
                  />
                  <RadioMaker
                    inline
                    name={"college"}
                    setValue={setCollegeLastYearCompleted}
                    value={4}
                    id={"college4"}
                    label={4}
                    checked={collegeLastYearCompleted}
                  />
                </div>
              </td>
              <td>
                <div className="radio-inline pe-none">
                  <RadioMaker
                    inline
                    name={"collegeGraduate"}
                    setValue={setCollegeGraduate}
                    value={true}
                    id={"collegeGraduate1"}
                    label={"Yes"}
                    checked={collegeGraduate}
                  />
                  <RadioMaker
                    inline
                    name={"collegeGraduate"}
                    setValue={setCollegeGraduate}
                    value={false}
                    id={"collegeGraduate2"}
                    label={"No"}
                    checked={collegeGraduate}
                  />
                </div>
              </td>
              <td>{tradeSubject}</td>
            </tr>

            <tr>
              <td>{tradeSchoolName}</td>
              <td>{tradeAddress}</td>
              <td>
                <div className="radio-inline pe-none">
                  <RadioMaker
                    inline
                    name={"tradeComplete"}
                    setValue={setTradeLastYearCompleted}
                    value={1}
                    id={"tradeComplete1"}
                    label={1}
                    checked={tradeLastYearCompleted}
                  />
                  <RadioMaker
                    inline
                    name={"tradeComplete"}
                    setValue={setTradeLastYearCompleted}
                    value={2}
                    id={"tradeComplete2"}
                    label={2}
                    checked={tradeLastYearCompleted}
                  />
                  <RadioMaker
                    inline
                    name={"tradeComplete"}
                    setValue={setTradeLastYearCompleted}
                    value={3}
                    id={"tradeComplete3"}
                    label={3}
                    checked={tradeLastYearCompleted}
                  />
                  <RadioMaker
                    inline
                    name={"tradeComplete"}
                    setValue={setTradeLastYearCompleted}
                    value={4}
                    id={"tradeComplete4"}
                    label={4}
                    checked={tradeLastYearCompleted}
                  />
                </div>
              </td>
              <td>
                <div className="radio-inline pe-none">
                  <RadioMaker
                    inline
                    name={"tradeGraduate"}
                    setValue={setYouTradeGraduate}
                    value={true}
                    id={"tradeGraduate1"}
                    label={"Yes"}
                    checked={youTradeGraduate}
                  />

                  <RadioMaker
                    inline
                    name={"tradeGraduate"}
                    setValue={setYouTradeGraduate}
                    value={false}
                    id={"tradeGraduate2"}
                    label={"No"}
                    checked={youTradeGraduate}
                  />
                </div>
              </td>
              <td>{otherSubject}</td>
            </tr>
            <tr>
              <td>{otherSchoolName}</td>
              <td>{otherAddress}</td>
              <td>
                <div className="radio-inline pe-none">
                  <RadioMaker
                    inline
                    name={"lastothercomplteed"}
                    setValue={setOtherLastYearCompleted}
                    value={1}
                    id={"lastothercomplteed1"}
                    label={1}
                    checked={otherLastYearCompleted}
                  />
                  <RadioMaker
                    inline
                    name={"lastothercomplteed"}
                    setValue={setOtherLastYearCompleted}
                    value={2}
                    id={"lastothercomplteed2"}
                    label={2}
                    checked={otherLastYearCompleted}
                  />
                  <RadioMaker
                    inline
                    name={"lastothercomplteed"}
                    setValue={setOtherLastYearCompleted}
                    value={3}
                    id={"lastothercomplteed3"}
                    label={3}
                    checked={otherLastYearCompleted}
                  />
                  <RadioMaker
                    inline
                    name={"lastothercomplteed"}
                    setValue={setOtherLastYearCompleted}
                    value={4}
                    id={"lastothercomplteed4"}
                    label={4}
                    checked={otherLastYearCompleted}
                  />
                </div>
              </td>
              <td>
                <div className="radio-inline pe-none">
                  <RadioMaker
                    inline
                    name={"otherGraduate"}
                    setValue={setYouOtherGraduate}
                    value={true}
                    id={"otherGraduate1"}
                    label={"Yes"}
                    checked={youOtherGraduate}
                  />
                  <RadioMaker
                    inline
                    name={"otherGraduate"}
                    setValue={setYouOtherGraduate}
                    value={false}
                    id={"otherGraduate2"}
                    label={"No"}
                    checked={youOtherGraduate}
                  />
                </div>
              </td>
              <td>{subject}</td>
            </tr>
          </tbody>
        </Table>
        <Row>
          <Col xs={12}>
            <div className="view-details-grid d-sm-flex align-items-center my-1 my-md-2 p-3">
              <p className="view-label mb-sm-0">
                Have you been convicted of a crime, other than minor traffic
                violations? :{" "}
              </p>
              <div className="radio-inline pe-none">
                <RadioMaker
                  inline
                  name={"convictCrime"}
                  setValue={setConvictedCrime}
                  value={true}
                  id={"convictCrime1"}
                  label={"Yes"}
                  checked={convictedCrime}
                />
                <RadioMaker
                  inline
                  name={"convictCrime"}
                  setValue={setConvictedCrime}
                  value={false}
                  id={"convictCrime2"}
                  label={"No"}
                  checked={convictedCrime}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">If yes, please explain : </p>
              <h5 className="view-value mb-0">{convictedCrimeExplain}</h5>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">Please Note : </p>
              <h5 className="view-value mb-0">
                No applicant will be denied employment solely on the grounds of
                conviction of a criminal offense. The nature, date, surrounding
                circumstances and relevance of the offense to the position for
                which you are applying will be taken into consideration. False
                information could be grounds for termination
              </h5>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ViewEducationalBackground;
