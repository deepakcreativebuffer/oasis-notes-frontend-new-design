import React, { useEffect, useState } from "react";
import { Form, Container, Card, Row, Col } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { RadioMaker } from "@/utils/Makers";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { useNavigateWithParams } from "@shared/hooks";
import {
  createEmployeeEducation,
  updateEmployeeEducation,
  getEmployeeEducation,
} from "@/features/shared/services";
import { showNotification, logger } from "@/utils";
const EducationalBackground = () => {
  const navigate = useNavigate();
  const ProfileDetails = useSelector(userProfile);
  const { employeId } = useParams();
  const [highSchoolGraduate, setHighSchoolGraduate] = useState(false);
  const [highSchoolName, setHighSchoolName] = useState("");
  const [completeAddress, setCompleteAddress] = useState("");
  const [lastYearCompleted, setLastYearCompleted] = useState("");
  const [collegeGraduate, setCollegeGraduate] = useState(false);
  const [collegeSubject, setCollegeSubject] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [collegeAddress, setCollegeAddress] = useState("");
  const [collegeLastYearCompleted, setCollegeLastYearCompleted] = useState("");
  const [youTradeGraduate, setYouTradeGraduate] = useState(false);
  const [tradeSubject, setTradeSubject] = useState("");
  const [tradeSchoolName, setTradeSchoolName] = useState("");
  const [tradeAddress, setTradeAddress] = useState("");
  const [tradeLastYearCompleted, setTradeLastYearCompleted] = useState("");
  const [youOtherGraduate, setYouOtherGraduate] = useState(false);
  const [otherSubject, setOtherSubject] = useState("");
  const [otherSchoolName, setOtherSchoolName] = useState("");
  const [otherAddress, setOtherAddress] = useState("");
  const [otherLastYearCompleted, setOtherLastYearCompleted] = useState("");
  const [subject, setSubject] = useState("");
  const [convictedCrime, setConvictedCrime] = useState(false);
  const [convictedCrimeExplain, setConvictedCrimeExplain] = useState("");
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState({});
  const { navigateWithParams } = useNavigateWithParams();
  const payload = {
    highSchoolGraduate,
    highSchoolName,
    completeAddress,
    lastYearCompleted,
    collegeGraduate,
    collegeSubject,
    collegeName,
    collegeAddress,
    collegeLastYearCompleted,
    youTradeGraduate,
    tradeSubject,
    tradeSchoolName,
    tradeAddress,
    tradeLastYearCompleted,
    youOtherGraduate,
    otherSubject,
    otherSchoolName,
    otherAddress,
    otherLastYearCompleted,
    subject,
    convictedCrime,
    convictedCrimeExplain,
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createEmployeeEducation(payload);
      if (!result.success) {
        showNotification(result);
        setLoading(false);
        return;
      }
      showNotification({
        message: result.message || "Education saved successfully.",
      });
      setLoading(false);
      navigateWithParams(`/employement-history`);
    } catch (e) {
      setLoading(false);
      showNotification({
        message: e.message || "Failed to save education.",
        type: "danger",
      });
      logger.error("Failed to save employee education details", e);
    }
  };
  const updateSubmitHandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateEmployeeEducation(employeId, payload);
      if (!result.success) {
        showNotification(result);
        setLoading(false);
        return;
      }
      showNotification({
        message: result.message || "Education updated successfully.",
      });
      setLoading(false);
      navigate(`/employement-history/${employeId}`);
    } catch (e) {
      setLoading(false);
      showNotification({
        message: e.message || "Failed to update education.",
        type: "danger",
      });
      logger.error("Failed to update employee education details", e);
    }
  };
  const fetchHandler = async () => {
    try {
      const result = await getEmployeeEducation(
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
        message: error.message || "Failed to load education details.",
        type: "danger",
      });
      logger.error("Failed to load employee education details", error);
    }
  };
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (detail) {
      setHighSchoolGraduate(detail?.highSchoolGraduate);
      setHighSchoolName(detail?.highSchoolName);
      setCompleteAddress(detail?.completeAddress);
      setLastYearCompleted(detail?.lastYearCompleted);
      setCollegeGraduate(detail?.collegeGraduate);
      setCollegeSubject(detail?.collegeSubject);
      setCollegeName(detail?.collegeName);
      setCollegeAddress(detail?.collegeAddress);
      setCollegeLastYearCompleted(detail?.collegeLastYearCompleted);
      setYouTradeGraduate(detail?.youTradeGraduate);
      setTradeSubject(detail?.tradeSubject);
      setTradeSchoolName(detail?.tradeSchoolName);
      setTradeAddress(detail?.tradeAddress);
      setTradeLastYearCompleted(detail?.tradeLastYearCompleted);
      setYouOtherGraduate(detail?.youOtherGraduate);
      setOtherSubject(detail?.otherSubject);
      setOtherSchoolName(detail?.otherSchoolName);
      setOtherAddress(detail?.otherAddress);
      setOtherLastYearCompleted(detail?.otherLastYearCompleted);
      setSubject(detail?.subject);
      setConvictedCrime(detail?.convictedCrime);
      setConvictedCrimeExplain(detail?.convictedCrimeExplain);
    }
  }, [detail]);
  return (
    <>
      <NavWrapper
        title={"Educational Background"}
        isArrow={true}
        filled={2}
        empty={3}
      />

      <Container className="full-width-container">
        <form
          onSubmit={employeId ? updateSubmitHandle : submitHandler}
          className="employee1"
        >
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
                <td>
                  <Form.Control
                    size="sm"
                    onChange={(e) => setHighSchoolName(e.target.value)}
                    placeholder={"High School Name:"}
                    type={"text"}
                    value={highSchoolName}
                  ></Form.Control>
                </td>
                <td>
                  <Form.Control
                    size="sm"
                    onChange={(e) => setCompleteAddress(e.target.value)}
                    placeholder={"Complete Address:"}
                    type={"text"}
                    value={completeAddress}
                  ></Form.Control>
                </td>
                <td>
                  <div className="radio-inline">
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
                  <div className="radio-inline">
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
                <td>
                  <Form.Control
                    size="sm"
                    onChange={(e) => setCollegeSubject(e.target.value)}
                    placeholder={""}
                    type={"text"}
                    value={collegeSubject}
                  ></Form.Control>
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Control
                    size="sm"
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder={"College Name:"}
                    type={"text"}
                    value={collegeName}
                  ></Form.Control>
                </td>
                <td>
                  <Form.Control
                    size="sm"
                    onChange={(e) => setCollegeAddress(e.target.value)}
                    placeholder={"Complete Address:"}
                    type={"text"}
                    value={collegeAddress}
                  ></Form.Control>
                </td>
                <td>
                  <div className="radio-inline">
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
                  <div className="radio-inline">
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
                <td>
                  <Form.Control
                    size="sm"
                    onChange={(e) => setTradeSubject(e.target.value)}
                    placeholder={""}
                    type={"text"}
                    value={tradeSubject}
                  ></Form.Control>
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Control
                    size="sm"
                    onChange={(e) => setTradeSchoolName(e.target.value)}
                    placeholder={"Trade School Name:"}
                    type={"text"}
                    value={tradeSchoolName}
                  ></Form.Control>
                </td>
                <td>
                  <Form.Control
                    size="sm"
                    onChange={(e) => setTradeAddress(e.target.value)}
                    placeholder={"Complete Address:"}
                    type={"text"}
                    value={tradeAddress}
                  ></Form.Control>
                </td>
                <td>
                  <div className="radio-inline">
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
                  <div className="radio-inline">
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
                <td>
                  <Form.Control
                    size="sm"
                    onChange={(e) => setOtherSubject(e.target.value)}
                    placeholder={""}
                    type={"text"}
                    value={otherSubject}
                  ></Form.Control>
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Control
                    size="sm"
                    onChange={(e) => setOtherSchoolName(e.target.value)}
                    placeholder={"Other:"}
                    type={"text"}
                    value={otherSchoolName}
                  ></Form.Control>
                </td>
                <td>
                  <Form.Control
                    size="sm"
                    onChange={(e) => setOtherAddress(e.target.value)}
                    placeholder={"Complete Address:"}
                    type={"text"}
                    value={otherAddress}
                  ></Form.Control>
                </td>
                <td>
                  <div className="radio-inline">
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
                  <div className="radio-inline">
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
                <td>
                  <Form.Control
                    size="sm"
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={""}
                    type={"text"}
                    value={subject}
                  ></Form.Control>
                </td>
              </tr>
            </tbody>
          </Table>
          <Row>
            <Col xs={12}>
              <Card body className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Have you been convicted of a crime, other than minor traffic
                    violations?
                  </Form.Label>
                  <div className="radio-inline">
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
                </Form.Group>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Card body className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    If yes, please explain:
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setConvictedCrimeExplain(e.target.value)}
                    placeholder={"Enter Text"}
                    type={"text"}
                    as={"textarea"}
                    value={convictedCrimeExplain}
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <p className="text-left text-sm">
                    <span className="fw-bold">Please note : </span>
                    No applicant will be denied employment solely on the grounds
                    of conviction of a criminal offense. The nature, date,
                    surrounding circumstances and relevance of the offense to
                    the position for which you are applying will be taken into
                    consideration. False information could be grounds for
                    termination
                  </p>
                </Form.Group>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div className="employee_btn_div view_btn">
                <button className="employee_create_btn" type="submit">
                  {loading ? <ClipLoader color="#fff" /> : "NEXT"}
                </button>
              </div>
            </Col>
          </Row>
        </form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: EducationalBackground,
});
