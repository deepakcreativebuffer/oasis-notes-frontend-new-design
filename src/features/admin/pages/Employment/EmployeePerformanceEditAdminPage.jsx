import React, { useEffect, useState } from "react";
import {
  AddSignature,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import NavWrapper from "@/utils/NavWrapper";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { getData } from "@/features/shared/services/index";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ClipLoader } from "react-spinners";
import { adminDashboardService } from "@/features/shared/services/index";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
const EmployeePerformanceEditAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const profilePermission = useSelector(userProfile);
  const hoursFormat =
    profilePermission?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [details, setDetails] = useState({});
  const [employeeName, setEmployeeName] = useState("");
  const [date, setDate] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [mangager, setMangager] = useState("");
  const [typeofReview, setTypeofReview] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [reviewPeriod, setReviewPeriod] = useState("");
  const [signAdmin, setSignAdmin] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [rating1, setRating1] = useState("");
  const [rating2, setRating2] = useState("");
  const [rating3, setRating3] = useState("");
  const [rating4, setRating4] = useState("");
  const [rating5, setRating5] = useState("");
  const [rating6, setRating6] = useState("");
  const [overallRating, setOverallRating] = useState("");
  const [evolution, setEvolution] = useState("");
  const [additionalCommet, setAdditionalCommet] = useState("");
  const [administratorName, setAdministratorName] = useState("");
  const [administratorSignature, setAdministratorSignature] = useState("");
  const [administratorDate, setAdministratorDate] = useState("");
  const [administratorTime, setAdministratorTime] = useState("");
  const [signers, setSigners] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchHandler = () => {
    getData(setDetails, `employee/getEmployeePerformanceReviewById/${id}`);
  };
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const data = details?.performanceReview || details?.data?.performanceReview;
    if (data) {
      setJobTitle(data?.employeeJobTitle);
      setTypeofReview(data?.typeOfReview);
      setHireDate(data?.employeeHireDate);
      setReviewPeriod(data?.reviewPeriod);
      setDate(data?.employeeDate);
      setMangager(data?.employeeManager);
      setEvolution(data?.evaluation);
      setEmployeeId(data?.employeeId);
      setRating1(data?.ratingsPerformanceAndQualityOfWork);
      setRating2(data?.ratingsCommunication);
      setRating3(data?.ratingsProfessionalism);
      setRating4(data?.ratingsAttendanceAndPunctuality);
      setRating5(data?.ratingsTimeManagement);
      setRating6(data?.ratingsReliabilityDependability);
      setOverallRating(data?.overallRating);
      setAdditionalCommet(data?.additionalComments);
      setAdministratorName(data?.administratorName);
      setAdministratorSignature(data?.administratorSignature);
      setAdministratorDate(data?.administratorDate);
      setAdministratorTime(data?.administratorTime);
      setSigners(data?.signers);
      setEmployeeName(fetchPaitentName(data?.employeeId));
    }
  }, [details]);
  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      employeeId,
      employeeDate: date,
      employeeJobTitle: jobTitle,
      employeeManager: mangager,
      typeofReview,
      employeeHireDate: hireDate,
      reviewPeriod,
      ratingsPerformanceAndQualityOfWork: rating1,
      ratingsCommunication: rating2,
      ratingsProfessionalism: rating3,
      ratingsAttendanceAndPunctuality: rating4,
      ratingsTimeManagement: rating5,
      ratingsReliabilityDependability: rating6,
      overallRating,
      evolution,
      additionalComments: additionalCommet,
      administratorSignature,
      administratorDate,
      administratorTime,
      administratorName,
      signers,
    };
    adminDashboardService.createEmployeePerformanceReview(payload, {
      setLoading,
      successMsg: "Success",
      navigate,
    });
  }
  return (
    <>
      <AddSignature
        show={signAdmin}
        setValue={setAdministratorSignature}
        setDate={setAdministratorDate}
        setTime={setAdministratorTime}
      />
      <NavWrapper title={"Employee Performance"} isArrow={true} />
      <Container>
        <div id="form-appendix">
          <Form>
            <Card body>
              <Row className="mb-3">
                <Col sm="12" md="6">
                  <Form.Group className="mb-3">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control disabled type="text" value={employeeName} />
                  </Form.Group>
                </Col>
                <Col sm="12" md="6">
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label>Date:</Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(date)}
                      onChange={(selectedDate) =>
                        setDate(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            date ? formatDateToMMDDYYYY(date) : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col sm="12" md="6">
                  <Form.Group className="mb-3">
                    <Form.Label>Job Title:</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={(e) => setJobTitle(e.target.value)}
                      value={jobTitle}
                    />
                  </Form.Group>
                </Col>
                <Col sm="12" md="6">
                  <Form.Group className="mb-3">
                    <Form.Label>Manager:</Form.Label>
                    <Form.Control
                      onChange={(e) => setMangager(e.target.value)}
                      type="text"
                      value={mangager}
                    />
                  </Form.Group>
                </Col>
                <Col sm="12" md="6">
                  <Form.Group className="mb-3">
                    <Form.Label>Type of Review</Form.Label>
                    <Form.Select
                      required
                      onChange={(e) => setTypeofReview(e.target.value)}
                      value={typeofReview}
                      aria-label="Default select example"
                    >
                      <option value={"sixMonth"}>6 months</option>
                      <option value={"Annual"}>Annual</option>
                      <option value={"Other"}>Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm="12" md="6">
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label>Hire Date:</Form.Label>

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
                <Col sm="12" md="12">
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label>Review Period:</Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(reviewPeriod)}
                      onChange={(selectedDate) =>
                        setReviewPeriod(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            reviewPeriod
                              ? formatDateToMMDDYYYY(reviewPeriod)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <div className="rating-criteria mt-2">
                    <Form.Label className="w-100 fw-bold">
                      Rating Criteria
                    </Form.Label>
                    <ul className="list-unstyled text-sm">
                      <li>
                        <b>Outstanding:</b> Performance in this area is far
                        exceeded expectations and requirements
                      </li>
                      <li>
                        <b>Exceed Expectations:</b> Accomplished more than
                        expected
                      </li>
                      <li>
                        <b>Meets Expectations:</b> Fully competent, consistently
                        meets requirements and expectations
                      </li>
                      <li>
                        <b>Needs Improvement:</b>
                        Requires significant amount of guidance and supervision
                      </li>
                      <li>
                        <b>Expectation not met:</b> Improve in all areas is
                        needed
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Label className="w-100 fw-bold">Ratings:</Form.Label>
                  <Form.Label className="w-100 fw-bold">Factors </Form.Label>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Performance and Quality of work ( work is completed
                      without guidance of supervision, work is completed
                      accurately and met within deadline)
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setRating1(e.target.value)}
                      value={rating1}
                      type="text"
                      placeholder="Enter Rating like: (0/10)"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Communication (positive interaction with staff,
                      management, and other employees. Communicate essential
                      information relating to patient care and employment.
                      Written and oral communications are clear and effective.)
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setRating2(e.target.value)}
                      value={rating2}
                      type="text"
                      placeholder="Enter Rating like: (0/10)"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Professionalism (employee maintains professionalism when
                      dealing with staff, residents, and others)
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setRating3(e.target.value)}
                      value={rating3}
                      type="text"
                      placeholder="Enter Rating like: (0/10)"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Attendance and Punctuality (employee is punctual to work.
                      Employee notifies supervisor ahead of time in the case of
                      absence. Employee always shows up to work)
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setRating4(e.target.value)}
                      value={rating4}
                      type="text"
                      placeholder="Enter Rating like: (0/10)"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Time management (time management in completing task and
                      meeting deadline)
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setRating5(e.target.value)}
                      value={rating5}
                      type="text"
                      placeholder="Enter Rating like: (0/10)"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Reliaility/Depedendability (manage workload effectively.
                      Willing to assist others. Goes over and beyond to ensure
                      task is completed)
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setRating6(e.target.value)}
                      value={rating6}
                      type="text"
                      placeholder="Enter Rating like: (0/10)"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Overall Rating – Rate employee’s overall performance in
                      comparison to position duties and responsibilities.
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setOverallRating(e.target.value)}
                      value={overallRating}
                      type="text"
                      placeholder="Enter Rating like: (0/10)"
                    />
                  </Form.Group>
                  <Row className="mb-3">
                    <Col sm="12" md="6">
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Evaluation:</Form.Label>
                        <Form.Control
                          onChange={(e) => setEvolution(e.target.value)}
                          type="text"
                          rows="3"
                          value={evolution}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm="12" md="6">
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Additional Comments:
                        </Form.Label>
                        <Form.Control
                          onChange={(e) => setAdditionalCommet(e.target.value)}
                          type="text"
                          rows="3"
                          value={additionalCommet}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Form.Label className="fw-bold w-100">
                <span> Verification of Review:</span> By signing this form, you
                confirm that you have discussed this review in detail with your
                supervisor. Signing this form does not necessarily indicate that
                you agree with this evaluation.
              </Form.Label>
              <Row>
                <Col xs={12} lg={4}>
                  <Button
                    className="theme-button"
                    onClick={() => setSignAdmin(true)}
                  >
                    SAVED AND SIGNED
                  </Button>
                </Col>
                <Col xs={12} lg={8}>
                  <Form.Label className="w-100">
                    {signatureFormat({
                      sign: administratorSignature,
                      date: administratorDate,
                      time: administratorTime,
                      hoursFormat,
                    })}
                    {signatureFormat({
                      sign:
                        (
                          details?.performanceReview ||
                          details?.data?.performanceReview
                        )?.employeeSignature || "",
                      date:
                        (
                          details?.performanceReview ||
                          details?.data?.performanceReview
                        )?.employeeSignDate || "",
                      hoursFormat,
                    })}
                  </Form.Label>
                  <Form.Label className="w-100">
                    {signers?.map(
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
                  </Form.Label>
                </Col>
              </Row>
            </Card>
            <button
              className="employee_create_btn hidePrint"
              type="submit"
              onClick={handleSubmit}
            >
              {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
            </button>
          </Form>
        </div>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: EmployeePerformanceEditAdmin,
});
