/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Card, Row, Col, Form } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { employmentService } from "@/features/shared/services";
import Loader from "@/features/shared/ui/Loader/Loader";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { fetchPaitentName, signatureFormat } from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useParams } from "react-router-dom";
import { usePrint } from "@shared/hooks";
import SafeHtml from "@/features/shared/ui/common/SafeHtml";
import { ROLES } from "@/features/shared/constants";
import { downloadReport } from "@/utils";
const JobDescription = () => {
  const ProfileDetails = useSelector(userProfile);
  const hoursFormat = ProfileDetails?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const companyName =
    ProfileDetails?.userType === ROLES.ADMIN
      ? ProfileDetails?.companyName
      : ProfileDetails?.adminId?.companyName;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [employeeInfoSignature, setEmployeeInfoSignature] = useState("");
  const [employeeInfoDate, setEmployeeInfoDate] = useState("");
  const [signers, setSigners] = useState([]);
  const [name, setName] = useState({});
  const { employeeId, id } = useParams();
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeSignDate, setEmployeeSignDate] = useState("");
  useEffect(() => {
    employmentService.getJobDescription({
      employeeId,
      id,
      setResponse: setData,
      setLoading,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (data) {
      const item = data?.data;
      setEmployeeInfoDate(item?.employeeInfoDate);
      setEmployeeInfoSignature(item?.employeeInfoSignature);
      setSigners(item?.signers);
      setName(item?.employeeId);
      setEmployeeSignature(item?.employeeSignature);
      setEmployeeSignDate(item?.employeeSignDate);
    }
  }, [data]);

  // Download Report
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        data?.data?.employeeId,
        ProfileDetails,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      data?.data?.employeeId,
      ProfileDetails,
    ),
    pageStyle: `
    @page {
      size: portrait !important;
      margin: 12mm 9mm!important;
    }    
      .view-details-grid {
        page-break-inside: avoid;
      }
        .Form.Label{
        page-break-inside: avoid;
        }
  `,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const print = usePrint(componentRef, handlePrint2);
  let signerIndex = signers?.findIndex?.(
    (signer, i) => signer.signerId === ProfileDetails._id,
  );
  if (signerIndex === undefined || signerIndex === null) signerIndex = -1;
  return (
    <div ref={componentRef} tabIndex={0} className="outline-none">
      <NavWrapper title="Job Description" isArrow={true} />
      {loading ? (
        <Loader />
      ) : Object.keys(data).length !== 0 ||
        (employeeId && ProfileDetails.userType === ROLES.ADMIN) ? (
        <Container>
          <h1 className="pdfTitle hidden">Job Description</h1>
          <Form>
            <Row className="mt-3">
              <Col xs={12}>
                <Form.Label className="fw-bold me-2">
                  Employee Name :{" "}
                </Form.Label>
                <Form.Label> {name && fetchPaitentName(name)}</Form.Label>{" "}
              </Col>
            </Row>
            <Card body className="mb-3">
              {data?.data?.jobDescription ? (
                <SafeHtml
                  html={data?.data?.jobDescription
                    ?.replaceAll("undefineds", "tests")
                    ?.replaceAll("undefined", companyName)
                    ?.replace(
                      /<span class="companyName">.*?<\/span>/g,
                      `<span class="companyName">${companyName}</span>`,
                    )
                    ?.replaceAll("--company-name--", companyName)}
                  className="job-description"
                />
              ) : (
                <p>No Job Description found</p>
              )}
            </Card>
            <Row>
              <Col xs={12} xl={12} lg={6}></Col>
              <Col xs={12} xl={12} lg={6} className="text-end">
                {signatureFormat({
                  sign: employeeSignature,
                  date: employeeSignDate,
                  hoursFormat,
                })}
                {signers?.map(
                  (signer) =>
                    signer?.signature && (
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
              </Col>
            </Row>
            <Row className="text-center">
              <Col xs={12}>
                <div className="employee-btn-joiner mt-3 mt-md-5">
                  <button
                    className="hidePrint employee_create_btn"
                    type="button"
                    onClick={print}
                  >
                    PRINT REPORT
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      ) : (
        <Container>
          <NoFound />
        </Container>
      )}
    </div>
  );
};
export default HOC({
  Wcomponenet: JobDescription,
});
