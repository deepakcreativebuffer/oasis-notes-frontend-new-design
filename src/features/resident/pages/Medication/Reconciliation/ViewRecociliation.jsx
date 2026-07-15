/** @format */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Form, Row, Col, Table } from "react-bootstrap";
import { getData } from "@/features/shared/services";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { signatureFormat, formatDateToMMDDYYYY } from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
const ViewRecociliation = () => {
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const [details, setDetails] = useState({});
  const { id } = useParams();
  useEffect(() => {
    getData(setDetails, `employee/getMedicationReconciliationById/${id}`);
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
    @page {
      size:portrait!important;
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
      <NavWrapper isArrow={true} title={"Medication Reconciliation"} />
      <Container>
        <div className="medication-reconciliati" ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">Medication Reconciliation</h1>
          <Form>
            <div className="view-details">
              <Row>
                <Col
                  xs={12}
                  sm={8}
                  md={6}
                  lg={6}
                  className={`${!details?.data?.residentName && "hidePrint"}`}
                >
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Resident's Name : </span>
                    <span className="view-value mb-0">
                      {details?.data?.residentName}
                    </span>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={4}
                  md={6}
                  lg={6}
                  className={`${!details?.data?.patientId?.ahcccsId && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">AHCCCS ID : </span>
                    <span className="view-value mb-0">
                      {details?.data?.patientId?.ahcccsId}
                    </span>{" "}
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Table responsive="lg" bordered>
                    <thead>
                      <tr>
                        <th>Condition</th>
                        <th className="text-center">Yes</th>
                        <th className="text-center">No</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Allergies</td>
                        <td className="text-center">
                          <Form.Check
                            type="checkbox"
                            checked={
                              details?.data?.patientId?.allergies?.[0]?.yes ===
                                true ||
                              (details?.data?.patientId?.allergies?.length >
                                0 &&
                                details?.data?.patientId?.allergies?.[0]
                                  ?.yes === undefined)
                            }
                            disabled
                          />
                        </td>
                        <td className="text-center">
                          <Form.Check
                            type="checkbox"
                            checked={
                              details?.data?.patientId?.allergies?.[0]?.yes ===
                              false
                            }
                            disabled
                          />
                        </td>
                        <td>
                          {details?.data?.patientId?.allergies?.[0]?.comments ||
                            details?.data?.patientId?.allergies?.[0]?.name ||
                            (details?.data?.patientId?.allergies?.[0]?.yes ===
                            undefined
                              ? details?.data?.patientId?.allergies
                                  ?.map((a) =>
                                    typeof a === "object" ? a.name : a,
                                  )
                                  .join(", ")
                              : "") || <DashComponent />}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
            {details?.data?.medications?.map((i, index) => (
              <React.Fragment key={index}>
                <div className="view-details">
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={4}>
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <span className="view-label mb-1">
                          Name of Medication :{" "}
                        </span>
                        <span className="view-value mb-0">
                          {i.name || <DashComponent />}
                        </span>{" "}
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <span className="view-label mb-1">Dose : </span>
                        <span className="view-value mb-0">
                          {i.dose || 0}
                        </span>{" "}
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <span className="view-label mb-1">Route : </span>
                        <span className="view-value mb-0">
                          {i.route || <DashComponent />}
                        </span>{" "}
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <span className="view-label mb-1">Frequency : </span>
                        <span className="view-value mb-0">
                          {i.frequency || 0}
                        </span>{" "}
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <span className="view-label mb-1">Start Date : </span>
                        <span className="view-value mb-0">
                          {(i.startDate &&
                            formatDateToMMDDYYYY(i.startDate)) || (
                            <DashComponent />
                          )}
                        </span>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <span className="view-label mb-1">
                          Stop/Change Date :{" "}
                        </span>
                        <span className="view-value mb-0">
                          {" "}
                          {(i.stopChangeDate &&
                            formatDateToMMDDYYYY(i.stopChangeDate)) || (
                            <DashComponent />
                          )}
                        </span>{" "}
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <span className="view-label mb-1">
                          Reason for Stop/Change :{" "}
                        </span>
                        <span className="view-value mb-0">
                          {i.reasonForStopChange || <DashComponent />}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>
              </React.Fragment>
            ))}
            <div className="view-details">
              <Row>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  className={`${!details?.data?.providerName && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Provider Name : </span>
                    <span className="view-value mb-0">
                      {details?.data?.providerName}
                    </span>{" "}
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Label className="w-100 text-end">
                  {signatureFormat({
                    sign: details?.data?.providerSignature,
                    date: details?.data?.providerSignatureDate,
                    time: details?.data?.providerSignatureTime,
                    hoursFormat,
                  })}
                </Form.Label>
                {details?.data?.signers?.map?.((signer) =>
                  signer?.signature?.length ? (
                    <Form.Label
                      className="w-100 text-end"
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
              <Col xs={12} sm={12}>
                <div className="employee_btn_div hidePrint">
                  <button
                    className="employee_create_btn hidePrint"
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
  Wcomponenet: ViewRecociliation,
});
