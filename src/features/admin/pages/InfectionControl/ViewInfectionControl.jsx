/** @format */

import React, { useEffect, useState } from "react";
import { Container, Table, Form, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import NavWrapper from "@/utils/NavWrapper";
import SafeHtml from "@/features/shared/ui/common/SafeHtml";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { trainingService } from "@/features/shared/services";
import {
  fetchPaitentName,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
const ViewInfectionControl = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const [response, setResponse] = useState({});
  const { id, employeeId } = useParams();
  useEffect(() => {
    trainingService.getInfectionControlById(id || employeeId, { setResponse });
  }, [id, employeeId]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        response?.data?.employeeId,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      response?.data?.employeeId,
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
  `,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const print = usePrint(printRef, handlePrint2);
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper title={"Infection Control"} isArrow={true} />
      <Container>
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">Infection Control</h1>
          <Form>
            <div className="view-details">
              <Row>
                <Col xs={12} sm={5} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Employee Name : </p>
                    <h5 className="view-value mb-0">
                      {response?.data?.employeeName}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Position : </p>
                    <h5 className="view-value mb-0">
                      {response?.data?.position}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={3} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Date : </p>
                    <h5 className="view-value mb-0">
                      {formatDateToMMDDYYYY(response?.data?.employeeDate)}
                    </h5>
                  </div>
                </Col>
              </Row>
            </div>
            {response?.data?.topicsCovered?.length > 0 && (
              <Row className="mt-2">
                <Col xs={12} sm={12}>
                  {response?.data?.topicsCovered?.length > 0 && (
                    <Table responsive bordered>
                      <thead>
                        <tr>
                          <th>Topic Covered</th>
                          <th>Teaching Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {response?.data?.topicsCovered?.map((i, index) => (
                          <tr key={index}>
                            <td className={`${i?.topic ? "" : "text-center"}`}>
                              {i?.topic ? (
                                <SafeHtml
                                  as="ul"
                                  className="ps-3 mb-0 list-style"
                                  html={i?.topic}
                                />
                              ) : (
                                <DashComponent />
                              )}
                            </td>
                            <td
                              className={`${i?.teachingMethod ? "" : "text-center"}`}
                            >
                              {i?.teachingMethod ? (
                                <SafeHtml
                                  as="ul"
                                  className="ps-3 mb-0 list-style"
                                  html={i?.teachingMethod}
                                />
                              ) : (
                                <DashComponent />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Col>
              </Row>
            )}
            <Row>
              <Col xs={12} sm={12}>
                <Row className="mb-3">
                  <Col xs={12}>
                    <Form.Label>
                      Acknowledged that
                      <span className="fw-bold">
                        {" "}
                        {fetchPaitentName(response?.data?.employeeId)}{" "}
                      </span>
                      has successfully completed
                      <span className="fw-bold">
                        {" "}
                        {response?.data?.hoursCompleted}{" "}
                      </span>
                      hour(s) of annual Infection Control Training.
                    </Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12}>
                    <Form.Label className="w-100 text-end">
                      {signatureFormat({
                        sign: response?.data?.employeeSignature,
                        date: response?.data?.employeeSignatureDate,
                        time: response?.data?.employeeSignatureTime,
                        hoursFormat,
                      })}

                      {signatureFormat({
                        sign: response?.data?.adminSignature,
                        date: response?.data?.adminDateSigned,
                        time: response?.data?.adminSignedTime,
                        hoursFormat,
                      })}
                    </Form.Label>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={12}>
                {response?.data?.signers?.map(
                  (signer) =>
                    signer.signature && (
                      <Form.Label
                        key={signer?.signerId}
                        className="w-100 text-end mb-0"
                      >
                        {signatureFormat({
                          sign: signer.signature,
                          date: signer.dateSigned,
                          time: signer.signedTime,
                          hoursFormat,
                        })}
                      </Form.Label>
                    ),
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className="employee_btn_div hidePrint">
                  <button
                    className="employee_create_btn"
                    type="button"
                    onClick={print}
                  >
                    PRINT REPORT
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewInfectionControl,
});
