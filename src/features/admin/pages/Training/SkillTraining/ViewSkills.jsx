/** @format */

import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import { getData } from "@/features/shared/services";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
import { ROLES } from "@/features/shared/constants";
const ViewSkills = () => {
  const { id, employeeId } = useParams();
  const [detail, setDetails] = useState({});
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const fetchHandler = () => {
    getData(
      setDetails,
      `employee/getSkillAndKnowledgeById/${employeeId || id}`,
    );
  };
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        detail?.data?.employeeId,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      detail?.data?.employeeId,
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
      <NavWrapper title={"Skills and Knowledge Training"} isArrow={true} />

      <Container>
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">
            Skills and Knowledge Training
          </h1>
          <Form>
            <div className="view-details-grid d-block my-1 my-md-2 p-3">
              <Row>
                <Col xs={12}>
                  <Form.Label className="w-100">
                    I,{" "}
                    <span className="fw-bold">
                      {detail?.data?.employeeId?.firstName}{" "}
                      {detail?.data?.employeeId?.lastName}
                    </span>{" "}
                    attest I have received{" "}
                    <span className="fw-bold">
                      {detail?.data?.hoursCompleted}
                    </span>{" "}
                    hour(s) of Skills and Knowledge training at{" "}
                    <span className="fw-bold">
                      {profileInfo?.userType === ROLES.ADMIN
                        ? profileInfo?.companyName
                        : profileInfo?.adminId?.companyName}
                    </span>{" "}
                    to perform the job duties as consistent with my job
                    description.
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className="view-value">
                    <ul className="ps-3 mt-2">
                      {detail?.data?.selectedTrainingTopics?.map(
                        (topic, index) => (
                          <li className="mb-2 list-disc" key={index}>
                            {topic}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col xs={12}>
                <Form.Label className="fw-bold">
                  The above listed skills and knowledge were verified by
                </Form.Label>
              </Col>
            </Row>
            <div className="view-details mb-3">
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Verification Method </p>
                    <div className="view-value">
                      <ul className="ps-3 mt-2">
                        {detail?.data?.verificationMethod?.map(
                          (verificationMethod, index) => (
                            <li className="mb-2 list-disc" key={index}>
                              {verificationMethod}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Verified by : </p>
                    <h5 className="view-value mb-0">
                      {" "}
                      {detail?.data?.employeeTitle}
                    </h5>{" "}
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Date : </p>
                    <h5 className="view-value mb-0">
                      {detail?.data?.employeeTitleDate &&
                        formatDateToMMDDYYYY(detail?.data?.employeeTitleDate)}
                    </h5>
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col xs={12} lg={12}>
                <Form.Label className="w-100 text-end">
                  {signatureFormat({
                    sign: detail?.data?.employeeSignature,
                    time: detail?.data?.employeeTime,
                    date: detail?.data?.employeeDate,
                    hoursFormat,
                  })}

                  {signatureFormat({
                    sign: detail?.data?.adminSignature,
                    date: detail?.data?.adminDateSigned,
                    time: detail?.data?.adminSignedTime,
                    hoursFormat,
                  })}
                </Form.Label>
                {detail?.data?.signers?.map(
                  (signer) =>
                    signer.signature && (
                      <Form.Label className="w-100 text-end mb-0">
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
              <Col xs={12} md={12}>
                <div className="employee-btn-joiner mt-3 hidePrint">
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
  Wcomponenet: ViewSkills,
});
