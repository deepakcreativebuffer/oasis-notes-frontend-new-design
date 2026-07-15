import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import React from "react";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import { usePrint } from "@shared/hooks";
export const EmployeePerformance2 = ({ item, ad, ads }) => {
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        profile,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(item?.employeeId, profile),
    pageStyle: `
      @page {
        size: portrait !important;
        margin: 12mm 9mm!important;
      }
      
      .print-container {
        border: 3px solid red;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        page-break-after: always;
      }
     .needtoMove{
      marginTop: 40px;
     }
      footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        padding: 10px;
        background-color: #fff;
        border-top: 1px solid #ddd;
        box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
      }
      footer::before {
        content: counter(page);
        margin-right: 10px;
      }
      footer::after {
        content: attr(data-site-name);
        position: absolute;
        left: 20px;
        bottom: 0;
      }
    `,
  });
  const print = usePrint(printRef, handlePrint);

  return (
    <div
      className="main-div-personal important outline-none"
      ref={printRef}
      tabIndex={0}
    >
      <div className="top-div-personal">
        <Form ref={componentRef} id="form-appendix">
          <h1 className="pdfTitle my-3 hidden">Employee Performance</h1>
          <div>
            <Row>
              <Col xs={12} sm={5} md={12} lg={12}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Name :</p>
                  <h5 className="view-value mb-0">{`${item?.employeeId?.firstName} ${item?.employeeId?.lastName}`}</h5>
                </div>
              </Col>
              <Col xs={12} sm={3} md={6} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date :</p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(item?.employeeDate)}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={4} md={6} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Job Title :</p>
                  <h5 className="view-value mb-0">{item?.employeeJobTitle}</h5>
                </div>
              </Col>

              <Col xs={12} sm={5} md={6} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Type of Review :</p>
                  <h5 className="view-value mb-0">{item?.typeOfReview}</h5>
                </div>
              </Col>
              <Col xs={12} sm={3} md={6} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Manager :</p>
                  <h5 className="view-value mb-0">{item?.employeeManager}</h5>
                </div>
              </Col>
              <Col xs={12} sm={4} md={6} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Hire Date :</p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(item?.employeeHireDate)}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Review Period :</p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(item?.reviewPeriod)}
                  </h5>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label className="fw-bold w-100">
                  Rating Criteria
                </Form.Label>
                <Card body className="mb-2">
                  <ul className="list-unstyled mb-0 text-sm">
                    <li className="mb-2">
                      <b>Outstanding : </b>
                      Performance in this area is far exceeded expectations and
                      requirements
                    </li>
                    <li className="mb-2">
                      <b>Exceed Expectations : </b>
                      Accomplished more than expected
                    </li>
                    <li className="mb-2">
                      <b>Meets Expectations : </b>
                      Fully competent, consistently meets requirements and
                      expectations
                    </li>
                    <li className="mb-2">
                      <b>Needs Improvement : </b>
                      Requires significant amount of guidance and supervision
                    </li>
                    <li className="mb-2">
                      <b>Expectation not met : </b>
                      Improve in all areas is needed
                    </li>
                  </ul>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label className="fw-bold w-100">Ratings : </Form.Label>

                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Performance and Quality of work ( work is completed without
                    guidance of supervision, work is completed accurately and
                    met within deadline) :
                  </p>
                  <h5 className="view-value mb-0 ms-2">
                    {item?.ratingsPerformanceAndQualityOfWork}
                  </h5>
                </div>

                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Communication (positive interaction with staff, management,
                    and other employees. Communicate essential information
                    relating to patient care and employment. Written and oral
                    communications are clear and effective.) :
                  </p>
                  <h5 className="view-value mb-0 ms-2">
                    {item?.ratingsCommunication}
                  </h5>
                </div>

                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Professionalism (employee maintains professionalism when
                    dealing with staff, residents, and others) :
                  </p>
                  <h5 className="view-value mb-0 ms-2">
                    {item?.ratingsProfessionalism}
                  </h5>
                </div>

                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Attendance and Punctuality (employee is punctual to work.
                    Employee notifies supervisor ahead of time in the case of
                    absence. Employee always shows up to work) :
                  </p>
                  <h5 className="view-value mb-0 ms-2">
                    {item?.ratingsAttendanceAndPunctuality}
                  </h5>
                </div>

                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Time management (time management in completing task and
                    meeting deadline) :
                  </p>
                  <h5 className="view-value mb-0 ms-2">
                    {item?.ratingsTimeManagement}
                  </h5>
                </div>

                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Reliaility/Depedendability (manage workload effectively.
                    Willing to assist others. Goes over and beyond to ensure
                    task is completed) :
                  </p>
                  <h5 className="view-value mb-0 ms-2">
                    {item?.ratingsReliabilityDependability}
                  </h5>
                </div>

                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Overall Rating – Rate employee’s overall performance in
                    comparison to position duties and responsibilities. :
                  </p>
                  <h5 className="view-value mb-0 ms-2">
                    {item?.overallRating}
                  </h5>
                </div>
                <Row>
                  <Col xs={12} sm={12} md={12}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Evaluation : </p>
                      <h5 className="view-value mb-0 ">{item?.evaluation}</h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Additional Comments : </p>
                      <h5 className="view-value mb-0">
                        {item?.additionalComments}
                      </h5>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>

            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">Verification of Review : </p>
              <h5 className="view-value mb-0">
                By signing this form, you confirm that you have discussed this
                review in detail with your supervisor. Signing this form does
                not necessarily indicate that you agree with this evaluation.
              </h5>
            </div>
            <div className="text-end">
              {signatureFormat({
                sign: item?.administratorSignature,
                date: item?.administratorDate,
                hoursFormat,
              })}
            </div>
            <div className="text-end">
              {signatureFormat({
                sign: item?.employeeSignature,
                date: item?.employeeSignDate,
                hoursFormat,
              })}
            </div>
            <div className="text-end">
              {item?.signers?.map?.((signer) =>
                signer?.signature?.length
                  ? signatureFormat({
                      sign: signer?.signature,
                      date: signer?.dateSigned,
                      hoursFormat,
                    })
                  : null,
              )}
            </div>
          </div>
        </Form>
        <Row className="mt-3 mt-md-5 text-center">
          <Col xs={12}>
            <Button onClick={print} type="submit" className="theme-button">
              PRINT
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};
