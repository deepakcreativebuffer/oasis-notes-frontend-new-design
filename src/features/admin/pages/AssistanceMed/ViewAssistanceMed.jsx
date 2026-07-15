/** @format */

import React, { useEffect, useState } from "react";
import { Container, Table, Card, Form, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { DefaultCheckBox } from "@/utils/Makers";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { assistanceService } from "@/features/shared/services";
import { fetchPaitentName, signatureFormat } from "@/utils/utils";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import SafeHtml from "@/features/shared/ui/common/SafeHtml";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
const ViewAssistanceMed = () => {
  const { id, employeeId } = useParams();
  const [response, setResponse] = useState({});
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  useEffect(() => {
    assistanceService.selfAdministration.getById(employeeId || id, {
      setResponse,
    });
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
      size: portrait!important;
      margin: 12mm 9mm!important;
    } 
    .print-lightest-weight p{
      all: initial;
      color:#0f0f0fcc;
      font-family: Quicksand;
    }
    `,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const print = usePrint(printRef, handlePrint2);
  const employeeName = fetchPaitentName(response?.data?.employeeId);
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper
        title={"Assistance with Self-Administration of Medication"}
        isArrow={true}
      />
      <Container>
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">
            Assistance with Self-Administration of Medication
          </h1>
          <Form>
            {response?.data?.skillsAndKnowledge?.length > 0 && (
              <Table className="table-fix-layout" responsive bordered>
                <thead>
                  <tr>
                    <th>Skill and Knowledge</th>
                    <th>Training Method</th>
                  </tr>
                </thead>
                <tbody>
                  {response?.data?.skillsAndKnowledge?.map((i, index) => (
                    <tr key={index}>
                      <td
                        className={`${i?.skillsAndKnowledge ? "" : "text-center"}`}
                      >
                        {i?.skillsAndKnowledge ? (
                          <SafeHtml
                            as="ul"
                            className="ps-3 mb-0 list-style"
                            html={i?.skillsAndKnowledge}
                          />
                        ) : (
                          <DashComponent />
                        )}
                      </td>
                      <td
                        className={`${i?.trainingMethod ? "" : "text-center"}`}
                      >
                        {i?.trainingMethod ? (
                          <SafeHtml
                            as="ul"
                            className="ps-3 mb-0 list-style"
                            html={i?.trainingMethod}
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
            <Card body className="mb-3">
              <Row>
                <Col xs={12}>
                  <div className="d-flex gap-2">
                    <DefaultCheckBox />
                    <Form.Label className="w-100">
                      I <span className="fw-bold mx-1">{employeeName}</span>{" "}
                      acknowledged, read and understand the skills and knowledge
                      requirement to perform Assistance in the
                      Self-administration of Medication.
                    </Form.Label>
                  </div>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col xs={12}>
                  <Form.Label className="w-100">
                    <span>
                      Acknowledged that{" "}
                      <span className="fw-bold mx-1">{employeeName}</span> has
                      successfully completed
                    </span>
                    <span className="fw-bold mx-1">
                      {" "}
                      {response?.data?.trainingHours}{" "}
                    </span>
                    <span>
                      {" "}
                      hour(s) Assistance in the self-administration of
                      medication training.
                    </span>{" "}
                  </Form.Label>
                </Col>
              </Row>
            </Card>
            <Row>
              <Col xs={12}>
                <Form.Label className="w-100 mb-0 print-lightest-weight text-end">
                  {signatureFormat({
                    sign: response?.data?.employeeSignature,
                    date: response?.data?.employeeSignatureDate,
                    time: response?.data?.employeeSignatureTime,
                    hoursFormat,
                  })}
                </Form.Label>
                <Form.Label className="w-100 mb-0 print-lightest-weight text-end">
                  {signatureFormat({
                    sign: response?.data?.adminSignature,
                    date: response?.data?.adminDateSigned,
                    time: response?.data?.adminSignedTime,
                    hoursFormat,
                  })}
                </Form.Label>
                {response?.data?.signers?.map(
                  (signer) =>
                    signer.signature && (
                      <Form.Label
                        key={signer?.signerId}
                        className="w-100 mb-0 print-lightest-weight fw-normal text-end"
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

            <Row className="text-center">
              <Col xs={12} lg={12}>
                <div className="employee-btn-joiner hidePrint">
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
  Wcomponenet: ViewAssistanceMed,
});
