/** @format */

import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { patientChartService } from "@/features/shared/services";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { useParams } from "react-router-dom";
import Loader from "@/features/shared/ui/Loader/Loader";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { fetchPaitentName, signatureFormat } from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
const ViewFinancialRecord = () => {
  const { id } = useParams();
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const Profile = useSelector(userProfile);
  const hoursFormat = Profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = useRef(null);
  const fetchHandler = () => {
    patientChartService.financialRecord.getById(id, {
      setResponse: setDetails,
      setLoading,
    });
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
        Profile,
        Profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(details?.data?.patientId),
    pageStyle: `
    @page {
      size: landscape !important;
      margin: 12mm 9mm!important;
    }    
    .card {
      page-break-inside: avoid;
    }
    .view-details-grid {
      page-break-inside: avoid;
    }
    th {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
`,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const print = usePrint(printRef, handlePrint2);
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper title={"Financial Transactions Record"} isArrow={true} />
      {loading ? (
        <Loader />
      ) : (
        <Container>
          <div className="financial-transactions" ref={componentRef}>
            <h1 className="pdfTitle my-3 hidden">
              Financial Transactions Record
            </h1>
            <Row>
              <Col
                col={12}
                sm={5}
                md={6}
                lg={4}
                className={`${!details?.data?.patientId && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Resident Name : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.patientId &&
                      fetchPaitentName(details?.data?.patientId)}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={3}
                md={6}
                lg={4}
                className={`${!details?.data?.patientId?.ahcccsId && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">AHCCCS ID : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.patientId?.ahcccsId}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={4}
                md={12}
                lg={4}
                className={`${!details?.data?.patientId?.dateOfBirth && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">DOB : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.patientId?.dateOfBirth &&
                      formatDateToMMDDYYYY(
                        details?.data?.patientId?.dateOfBirth,
                      )}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={6}
                className={`${!details?.data?.patientId?.diagnosis && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Diagnosis (specify if new or continuing) :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.patientId?.diagnosis}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={6}
                className={`${!details?.data?.patientId?.admitDate && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Admit Date : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.patientId?.admitDate &&
                      formatDateToMMDDYYYY(details?.data?.patientId?.admitDate)}
                  </h5>
                </div>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col col={12} sm={12} md={12} lg={12}>
                {details?.data?.transactions?.length > 0 && (
                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Deposit</th>
                        <th>
                          <span className="hidePrint">Money</span> Spent
                        </th>
                        <th>Balance</th>
                        <th className="w-[30%]">
                          Description
                          <span className="hidePrint"> of items spent</span>
                        </th>
                        <th>Employee Signature</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details?.data?.transactions
                        ?.sort(
                          (a, b) =>
                            new Date(b.StaffSignDate).getTime() -
                            new Date(a.StaffSignDate).getTime(),
                        )
                        .map((i, index) => (
                          <tr key={index}>
                            <td className={`${i?.date ? "" : "text-center"}`}>
                              {" "}
                              {(i?.date && formatDateToMMDDYYYY(i?.date)) || (
                                <DashComponent />
                              )}{" "}
                            </td>
                            <td>
                              {" "}
                              {i?.deposit || i?.deposit === 0
                                ? i?.deposit
                                : "0"}{" "}
                            </td>
                            <td>
                              {" "}
                              {i?.moneySpent || i?.moneySpent === 0
                                ? i?.moneySpent
                                : "0"}{" "}
                            </td>
                            <td> {i?.balance} </td>
                            <td
                              className={`${i?.description ? "" : "text-center"}`}
                            >
                              {" "}
                              {i?.description || <DashComponent />}{" "}
                            </td>
                            <td
                              className={`${i?.staffSignature ? "" : "text-center"}`}
                            >
                              {" "}
                              {i?.staffSignature ? (
                                signatureFormat({
                                  sign: i?.staffSignature,
                                  date: i?.StaffSignDate,
                                  hoursFormat,
                                })
                              ) : (
                                <DashComponent />
                              )}{" "}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                )}
              </Col>
            </Row>

            <div className="signature-sections-inline mt-3">
              <SignatureSection
                role="resident"
                label="Resident/Representative Signature"
                variant="blue"
                mode="view"
                signature={details?.data?.signatures?.resident}
                signerNameOverride={
                  details?.data?.patientId
                    ? fetchPaitentName(details?.data?.patientId)
                    : ""
                }
              />
              <SignatureSection
                role="witness"
                label="Witness Signature"
                variant="yellow"
                mode="view"
                signature={details?.data?.signatures?.witness}
              />
            </div>

            {details?.data?.signers?.map?.((signer) =>
              signer?.signature?.length ? (
                <div className="text-end mb-0" key={signer?.signerId}>
                  {signatureFormat({
                    sign: signer?.signature,
                    date: signer?.dateSigned,
                    time: signer?.signedTime,
                    hoursFormat,
                  })}
                </div>
              ) : null,
            )}
            <button
              className="print_btn hidePrint"
              type="button"
              onClick={print}
            >
              PRINT REPORT
            </button>
          </div>
        </Container>
      )}
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewFinancialRecord,
});
