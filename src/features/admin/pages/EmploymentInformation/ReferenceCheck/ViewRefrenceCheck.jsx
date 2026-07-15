/** @format */

import React, { useEffect, useState } from "react";
import { Container, Form, Table, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import Loader from "@/features/shared/ui/Loader/Loader";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { employmentService } from "@/features/shared/services";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { downloadReport } from "@/utils";
const ViewRefrenceCheck = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [loading, setLoading] = useState(false);
  const { id, employeeId } = useParams();
  const [detail, setDetail] = useState({});
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        profileInfo,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(profileInfo, profileInfo),
    pageStyle: `
    @page {
      margin: 10mm !important;
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
  useEffect(() => {
    employmentService.referenceCheck.getById(employeeId || id, {
      setResponse: setDetail,
      setLoading,
    });
  }, [id, employeeId]);
  return (
    <>
      <div ref={componentRef}>
        <NavWrapper
          title={"Reference Check and Recommendation"}
          isArrow={true}
        />

        <Container className="full-width-container">
          {loading ? (
            <Loader />
          ) : (
            <Form className="w-100 text-start">
              <h1 className="pdfTitle hidden">
                Reference Check and Recommendation
              </h1>
              <Form.Label className="fw-bold text-center w-100">
                Good faith recommendation from references to include a former
                employer.
              </Form.Label>

              {detail?.data?.data?.length > 0 && (
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>Date of Contact</th>
                      <th>Reference Name</th>
                      <th>Reference Recommendation</th>
                      <th>Signature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail?.data?.data?.map((i, index) => (
                      <tr key={index}>
                        <td> {i.date && formatDateToMMDDYYYY(i.date)} </td>
                        <td> {i.referenceName} </td>
                        <td> {i.referenceRecommendation} </td>
                        <td>
                          {" "}
                          {signatureFormat({
                            sign: i.savedSigned,
                            date: i.signDate,
                            time: i.signTime,
                            hoursFormat,
                            style: {
                              textAlign: "left",
                            },
                          })}{" "}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              {detail?.data &&
                signatureFormat({
                  sign: detail?.data?.employeeSignature,
                  date: detail?.data?.employeeSignDate,
                  hoursFormat,
                })}
              {detail?.data?.signers?.map(
                (signer) =>
                  signer.signature && (
                    <Form.Label
                      className="text-end w-100 mb-0"
                      key={signer?.signerId}
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

              <Row>
                <Col xs={12}>
                  <div className="employee_btn_div hidePrint">
                    <button
                      className="employee_create_btn"
                      type="button"
                      onClick={handlePrint2}
                    >
                      PRINT REPORT
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Container>
      </div>
    </>
  );
};
export default HOC({
  Wcomponenet: ViewRefrenceCheck,
});
