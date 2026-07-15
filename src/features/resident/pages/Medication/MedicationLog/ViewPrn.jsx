/** @format */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Form, Row, Col, Table } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import { getData } from "@/features/shared/services";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import HOC from "@/features/shared/layout/Inner/HOC";
import {
  convertTimeFormat,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  otherHandler,
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
const ViewPrn = () => {
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const { id } = useParams();
  const [details, setDetails] = useState({});
  useEffect(() => {
    getData(setDetails, `employee/getPrnMedicationLogById/${id}`);
  }, [id]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        details?.data?.patientId,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(details?.data?.patientId),
    pageStyle: `
    td ,th {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @page {
      size: LandScape !important;
    
    } 
`,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const print = usePrint(printRef, handlePrint2);
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper isArrow={true} title={"PRN"} />
      <Container>
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">PRN Medication Log</h1>
          <div className="view-details">
            <Row>
              <Col
                xs={12}
                sm={5}
                md={12}
                lg={4}
                className={`${!details?.data?.patientId && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Resident Name : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.patientId &&
                      fetchPaitentName(details?.data?.patientId)}
                  </h5>{" "}
                </div>
              </Col>
              <Col
                xs={12}
                sm={3}
                md={12}
                lg={4}
                className={`${!details?.data?.ahcccsId && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> AHCCCS ID : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.ahcccsId ||
                      details?.data?.patientId?.ahcccsId}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={3}
                md={12}
                lg={4}
                className={`${!details?.data?.patientId?.admitDate && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Admit Date : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.patientId?.admitDate &&
                      formatDateToMMDDYYYY(details?.data?.patientId?.admitDate)}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={3}
                md={12}
                lg={4}
                className={`${!details?.data?.patientId?.dateOfBirth && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Date of Birth : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.patientId?.dateOfBirth &&
                      formatDateToMMDDYYYY(
                        details?.data?.patientId?.dateOfBirth,
                      )}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={3}
                md={12}
                lg={4}
                className={`${!details?.data?.prescriberName && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Prescriber Name : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.prescriberName}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={4}
                className={`${!details?.data?.site && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Site : </p>
                  <h5 className="view-value mb-0">{details?.data?.site}</h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!details?.data?.medicationAndStrength && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Medication and Strength : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.medicationAndStrength}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!details?.data?.instructions && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Instruction : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.instructions}
                  </h5>
                </div>
              </Col>
            </Row>
          </div>
          {details?.data?.tableData?.length > 0 && (
            <Row className="mt-2">
              <Col xs={12}>
                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time Initials</th>
                      <th>Quantity</th>
                      <th>Reason</th>
                      <th>Specify intensity on 0 - 10 scale if applicable</th>
                      <th>Staff initials</th>
                      <th>Response Code</th>
                      <th>Time Re-evaluated</th>
                      <th>Time Re-evaluated Staff Initials</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details?.data?.tableData?.map((i, index) => (
                      <tr key={index}>
                        <td className={`${i.date ? "" : "text-center"}`}>
                          {" "}
                          {(i.date && formatDateToMMDDYYYY(i.date)) || (
                            <DashComponent />
                          )}{" "}
                        </td>
                        <td className={`${i.time ? "" : "text-center"}`}>
                          {" "}
                          {convertTimeFormat(i.time, hoursFormat) || (
                            <DashComponent />
                          )}{" "}
                        </td>
                        <td>
                          {" "}
                          {i.tabsGiven || i.tabsGiven === 0
                            ? i.tabsGiven
                            : "0"}{" "}
                        </td>
                        <td className={`${i.reason ? "" : "text-center"}`}>
                          {" "}
                          {i.reason || <DashComponent />}{" "}
                        </td>
                        <td className={`${i.intensity ? "" : "text-center"}`}>
                          {i?.intensity || <DashComponent />}
                        </td>
                        <td
                          className={`${i.staffNameAndSignature ? "" : "text-center"}`}
                        >
                          {i.staffNameAndSignature ? (
                            signatureFormat({
                              sign: i.staffNameAndSignature,
                              date: i.signatureDate,
                              hoursFormat,
                            })
                          ) : (
                            <DashComponent />
                          )}
                        </td>
                        <td
                          className={`${i.resposneCode?.length ? "" : "text-center"}`}
                        >
                          {otherHandler(
                            i?.resposneCode,
                            "Other",
                            i?.responseCodeOther,
                          ) || <DashComponent />}
                        </td>
                        <td
                          className={`${i.timeReEvaluated ? "" : "text-center"}`}
                        >
                          {convertTimeFormat(
                            i.timeReEvaluated,
                            hoursFormat,
                          ) || <DashComponent />}
                        </td>
                        <td
                          className={`${i.revaluatedStaffInitials ? "" : "text-center"}`}
                        >
                          {i.revaluatedStaffInitials ? (
                            signatureFormat({
                              sign: i.revaluatedStaffInitials,
                              date: i.revaluatedStaffSignatureDate,
                              hoursFormat,
                            })
                          ) : (
                            <DashComponent />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}
          <Row className="mb-2">
            <Col xs={12} sm={12}>
              {details?.data?.signers?.map?.((signer) =>
                signer?.signature?.length ? (
                  <Form.Label
                    className="w-100 mb-0 text-end"
                    key={signer?.signerId}
                  >
                    {signatureFormat({
                      sign: signer?.signature,
                      date: signer?.dateSigned,
                      time: signer?.signedTime,
                      hoursFormat,
                    })}
                  </Form.Label>
                ) : null,
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <button
                className="employee_create_btn hidePrint mt-3 mt-md-4"
                type="button"
                onClick={print}
              >
                PRINT REPORT
              </button>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewPrn,
});
