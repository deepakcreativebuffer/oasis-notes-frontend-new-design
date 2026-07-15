/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useRef, useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { adminDashboardService } from "@/features/shared/services/index";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { getData } from "@/features/shared/services/index";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  AddSignature,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { ROLES } from "@/features/shared/constants/index";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { downloadReport } from "@/utils/index";
const EmployeePerformanceById = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState("");
  const [employeeDate, setEmployeeDate] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [employeeManager, setEmployeeManager] = useState("");
  const [typeOfReview, setTypeofReview] = useState("");
  const [employeeHireDate, setHireDate] = useState("");
  const [reviewPeriod, setReviewPeriod] = useState("");
  const [
    ratingsPerformanceAndQualityOfWork,
    setRatingsPerformanceAndQualityOfWork,
  ] = useState("");
  const [ratingsCommunication, setRatingsCommunication] = useState("");
  const [ratingsProfessionalism, setRatingsProfessionalism] = useState("");
  const [ratingsAttendanceAndPunctuality, setRatingsAttendanceAndPunctuality] =
    useState("");
  const [ratingsTimeManagement, setRatingsTimeManagement] = useState("");
  const [ratingsReliabilityDependability, setRatingsReliabilityDependability] =
    useState("");
  const [overallRating, setOverallRating] = useState("");
  const [evaluation, setEvalution] = useState("");
  const [additionalComments, setAdditionalCommet] = useState("");
  const [administratorName, setAdministratorName] = useState("");
  const [administratorSignature, setAdministratorSignature] = useState("");
  const [administratorDate, setAdministratorDate] = useState("");
  const [administratorTime, setAdministratorTime] = useState("");
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeSignDate, setEmployeeSignDate] = useState("");
  const [signers, setSigners] = useState([]);
  const [details, setDetails] = useState();
  const [open, setOpen] = useState();
  const [loading, setLoading] = useState();
  const { id, employeeId } = useParams();
  const fetchHandler = () => {
    getData(setDetails, `employee/getEmployeePerformanceReviewById/${id}`);
  };
  useEffect(() => {
    const data = details?.performanceReview || details?.data?.performanceReview;
    if (data) {
      setEmployeeDate(data?.employeeDate);
      setJobTitle(data?.employeeJobTitle);
      setEmployeeManager(data?.employeeManager);
      setTypeofReview(data?.typeOfReview);
      setHireDate(data?.employeeHireDate);
      setReviewPeriod(data?.reviewPeriod);
      setRatingsPerformanceAndQualityOfWork(
        data?.ratingsPerformanceAndQualityOfWork,
      );
      setRatingsCommunication(data?.ratingsCommunication);
      setRatingsProfessionalism(data?.ratingsProfessionalism);
      setRatingsAttendanceAndPunctuality(data?.ratingsAttendanceAndPunctuality);
      setRatingsTimeManagement(data?.ratingsTimeManagement);
      setRatingsReliabilityDependability(data?.ratingsReliabilityDependability);
      setOverallRating(data?.overallRating);
      setEvalution(data?.evaluation);
      setAdditionalCommet(data?.additionalComments);
      setAdministratorName(data?.administratorName);
      setAdministratorSignature(data?.administratorSignature);
      setAdministratorDate(data?.administratorDate);
      setAdministratorTime(data?.administratorTime);
      setSigners(data?.signers);
      setEmployeeName(fetchPaitentName(data?.employeeId));
      setEmployeeSignature(data?.employeeSignature);
      setEmployeeSignDate(data?.employeeSignDate);
    }
  }, [details]);
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        (details?.performanceReview || details?.data?.performanceReview)
          ?.employeeId,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      (details?.performanceReview || details?.data?.performanceReview)
        ?.employeeId,
      profileInfo,
    ),
    pageStyle: `
    @page {
     size: portrait !important;
      margin: 12mm 9mm!important;
    }    
    .card {
      page-break-inside: avoid;
    }
    .view-details-grid {
      page-break-inside: avoid;
    }
      .list-group-item{
      page-break-inside: avoid;
    }
  `,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  function handleSubmit(e) {
    e.preventDefault();
    const additionalFunctions = [fetchHandler];
    adminDashboardService.updateEmployeePerformanceReview(
      id,
      {
        employeeSignature,
        employeeSignDate,
        signers,
      },
      {
        setLoading,
        successMsg: "Success",
        additionalFunctions,
        navigate,
      },
    );
  }
  let signerIndex = signers?.findIndex?.(
    (signer, i) => signer.signerId === profileInfo._id,
  );
  if (signerIndex === undefined || signerIndex === null) signerIndex = -1;
  function setSignerSignature(sign) {
    if (signerIndex !== -1)
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          signature: sign,
        };
        return newSigners;
      });
  }
  function setSignerDate(date) {
    if (signerIndex !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          dateSigned: date,
        };
        return newSigners;
      });
    }
  }
  function setSignerTime(time) {
    if (signerIndex !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          signedTime: time,
        };
        return newSigners;
      });
    }
  }
  const editSignHandler = (sign) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerSignature(sign);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setEmployeeSignature(sign);
    }
  };
  const editDateHandler = (date) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerDate(date);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setEmployeeSignDate(date);
    }
  };
  return (
    <>
      <AddSignature
        show={open}
        setValue={(sign) =>
          details?.data?.employeeId === profileInfo?._id
            ? setEmployeeSignature(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          details?.data?.employeeId === profileInfo?._id
            ? setEmployeeSignDate(date)
            : editDateHandler(date)
        }
      />
      <NavWrapper title={"Employee Performance"} isArrow={true} />
      <Container>
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">Employee Performance</h1>
          <Form>
            <Row>
              <Col xs={12}>
                <Form.Label className="text-desc fw-bold hidePrint">
                  Employee Information :{" "}
                </Form.Label>
              </Col>
            </Row>
            <div className="view-details">
              <Row>
                <Col xs={12} sm={5} md={6} lg={3}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Name : </p>
                    <h5 className="view-value mb-0">{employeeName}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={3} md={6} lg={3}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Date : </p>
                    <h5 className="view-value mb-0">
                      {employeeDate && formatDateToMMDDYYYY(employeeDate)}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={3}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Job Title : </p>
                    <h5 className="view-value mb-0">{jobTitle}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={3}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Manager : </p>
                    <h5 className="view-value mb-0">{employeeManager}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Hire Date : </p>
                    <h5 className="view-value mb-0">
                      {employeeHireDate &&
                        formatDateToMMDDYYYY(employeeHireDate)}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Type of Review : </p>
                    <h5 className="view-value mb-0">{typeOfReview}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Review Period : </p>
                    <h5 className="view-value mb-0">{reviewPeriod}</h5>
                  </div>
                </Col>
              </Row>
            </div>
            <Row className="mt-2">
              <Col xs={12}>
                <Form.Label className="text-desc fw-bold hidePrint">
                  Rating Criteria :{" "}
                </Form.Label>
              </Col>
            </Row>
            <div className="view-details-grid d-block my-1 my-md-2 p-3">
              <p className="mb-0">
                <Form.Label className="fw-bold d-sm-inline">
                  (1) Expectation Not Met :{" "}
                </Form.Label>
                <Form.Label className="d-sm-inline">
                  Improve in all areas is needed
                </Form.Label>
              </p>
              <p className="mb-0">
                <Form.Label className="fw-bold d-sm-inline">
                  (2) Needs Improvement :{" "}
                </Form.Label>
                <Form.Label className="d-sm-inline">
                  Requires significant amount of guidance and supervision
                </Form.Label>
              </p>
              <p className="mb-0">
                <Form.Label className="fw-bold d-sm-inline">
                  (3) Meets Expectations :{" "}
                </Form.Label>
                <Form.Label className="d-sm-inline">
                  Fully competent, consistently meets requirements and
                  expectations
                </Form.Label>
              </p>
              <p className="mb-0">
                <Form.Label className="fw-bold d-sm-inline">
                  (4) Exceed Expectations :{" "}
                </Form.Label>
                <Form.Label className="d-sm-inline">
                  Accomplished more than expected
                </Form.Label>
              </p>
              <p className="mb-0">
                <Form.Label className="fw-bold d-sm-inline">
                  (5) Outstanding :{" "}
                </Form.Label>
                <Form.Label className="d-sm-inline">
                  Performance in this area is far exceeded expectations and
                  requirements
                </Form.Label>
              </p>
            </div>
            <Row className="mt-2">
              <Col xs={12}>
                <Form.Label className="text-desc fw-bold hidePrint">
                  Ratings :{" "}
                </Form.Label>
              </Col>
            </Row>
            <div className="view-details-grid d-block my-1 my-md-2 p-3">
              <p className="mb-1">
                <Form.Label className="fw-noraml d-sm-inline">
                  Performance and Quality of work ( work is completed without
                  guidance of supervision, work is completed accurately and met
                  within deadline) :{" "}
                </Form.Label>
                <Form.Label className="fw-bold d-sm-inline">
                  {ratingsPerformanceAndQualityOfWork}
                </Form.Label>
              </p>
              <p className="mb-1">
                <Form.Label className="fw-noraml d-sm-inline">
                  Communication (positive interaction with staff, management,
                  and other employees. Communicate essential information
                  relating to patient care and employment. Written and oral
                  communications are clear and effective.) :{" "}
                </Form.Label>
                <Form.Label className="fw-bold d-sm-inline">
                  {" "}
                  {ratingsCommunication}
                </Form.Label>
              </p>
              <p className="mb-1">
                <Form.Label className="fw-noraml d-sm-inline">
                  Professionalism (employee maintains professionalism when
                  dealing with staff, residents, and others) :{" "}
                </Form.Label>
                <Form.Label className="fw-bold d-sm-inline">
                  {" "}
                  {ratingsProfessionalism}
                </Form.Label>
              </p>
              <p className="mb-1">
                <Form.Label className="fw-noraml d-sm-inline">
                  Attendance and Punctuality (employee is punctual to work.
                  Employee notifies supervisor ahead of time in the case of
                  absence. Employee always shows up to work) :{" "}
                </Form.Label>
                <Form.Label className="fw-bold d-sm-inline">
                  {" "}
                  {ratingsAttendanceAndPunctuality}
                </Form.Label>
              </p>
              <p className="mb-1">
                <Form.Label className="fw-noraml d-sm-inline">
                  Time management (time management in completing task and
                  meeting deadline) :{" "}
                </Form.Label>
                <Form.Label className="fw-bold d-sm-inline">
                  {" "}
                  {ratingsTimeManagement}
                </Form.Label>
              </p>
              <p className="mb-1">
                <Form.Label className="fw-noraml d-sm-inline">
                  {" "}
                  Reliaility/Depedendability (manage workload effectively.
                  Willing to assist others. Goes over and beyond to ensure task
                  is completed) :{" "}
                </Form.Label>
                <Form.Label className="fw-bold d-sm-inline">
                  {" "}
                  {ratingsReliabilityDependability}
                </Form.Label>
              </p>
              <p className="mb-1">
                <Form.Label className="fw-noraml d-sm-inline">
                  Overall Rating – Rate employee’s overall performance in
                  comparison to position duties and responsibilities. :{" "}
                </Form.Label>
                <Form.Label className="fw-bold d-sm-inline">
                  {" "}
                  {overallRating}
                </Form.Label>
              </p>
              <p className="mb-1">
                <Form.Label className="fw-noraml d-sm-inline">
                  Evaluation :{" "}
                </Form.Label>
                <Form.Label className="fw-bold d-sm-inline">
                  {" "}
                  {evaluation}
                </Form.Label>
              </p>
              <p className="mb-1">
                <Form.Label className="fw-noraml d-sm-inline">
                  Additional Comments :{" "}
                </Form.Label>
                <Form.Label className="fw-bold d-sm-inline">
                  {" "}
                  {additionalComments}
                </Form.Label>
              </p>
            </div>
            <div className="view-details-grid d-block my-1 my-md-2 p-3">
              <p className="mb-1">
                <Form.Label className="fw-bold d-sm-inline me-2">
                  Verification of Review :{" "}
                </Form.Label>
                <Form.Label className="fw-noraml d-sm-inline">
                  By signing this form, you confirm that you have discussed this
                  review in detail with your supervisor. Signing this form does
                  not necessarily indicate that you agree with this
                  evaluation.{" "}
                </Form.Label>
              </p>
            </div>
            <div className="view-details-grid d-block my-1 my-md-2 p-3">
              <p className="mb-1">
                <Form.Label className="fw-bold d-sm-inline me-2">
                  Administrator Name :{" "}
                </Form.Label>
                <Form.Label className="fw-noraml d-sm-inline">
                  {" "}
                  {administratorName}
                </Form.Label>
              </p>
            </div>
            <Row>
              <Col xs={12} lg={4}>
                <Button
                  type="button"
                  className="theme-button hidePrint"
                  onClick={() => setOpen(true)}
                >
                  SAVED AND SIGNED
                </Button>
              </Col>
              <Col xs={12} lg={8}>
                {signatureFormat({
                  sign: administratorSignature,
                  date: administratorDate,
                  time: administratorTime,
                  hoursFormat,
                })}
                {signatureFormat({
                  sign: employeeSignature,
                  date: employeeSignDate,
                  hoursFormat,
                })}
                {signers?.map?.((signer) =>
                  signer?.signature?.length ? (
                    <label
                      key={signer?.signerId}
                      className="print-light-weight w-100 text-end"
                    >
                      {signatureFormat({
                        sign: signer?.signature,
                        date: signer?.dateSigned,
                        time: signer?.signedTime,
                        hoursFormat,
                      })}
                    </label>
                  ) : null,
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={12}>
                <div className="employee-btn-joiner mt-2 mt-md-5">
                  <button
                    className="employee_create_btn hidePrint"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: EmployeePerformanceById,
});
