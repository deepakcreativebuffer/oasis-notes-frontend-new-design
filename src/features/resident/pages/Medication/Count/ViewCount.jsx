/** @format */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Table } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import { medicationService, facilityService } from "@/features/shared/services";
import { ROLES } from "@/features/shared/constants";
import HOC from "@/features/shared/layout/Inner/HOC";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  convertTimeFormat,
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
const ViewCount = () => {
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const { id } = useParams();
  const [details, setDetails] = useState({});
  const [facilitiesList, setFacilitiesList] = useState([]);

  useEffect(() => {
    if (profile?.userType === ROLES.ADMIN) {
      facilityService.list({
        setResponse: (data) => setFacilitiesList(data?.data || []),
      });
    } else {
      setFacilitiesList(profile?.facilityId || []);
    }
  }, [profile]);

  useEffect(() => {
    medicationService.getOpioidCountById(id, {
      page: 1,
      limit: 1000,
      setResponse: setDetails,
    });
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
      margin: 12mm 9mm!important;
      size: landscape !important;
    }   
    .card {
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
      <NavWrapper
        isArrow={true}
        title={
          details?.data?.countType === "medication"
            ? "MEDICATION COUNT"
            : "OPIOID COUNT CONTROL"
        }
      />
      <Container>
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">
            {details?.data?.countType === "medication"
              ? "Medication Count"
              : "Opioid Count Control"}
          </h1>

          <div className="view-details mb-2">
            <Row>
              <Col
                xs={12}
                sm={5}
                md={6}
                lg={4}
                className={`${!details?.data?.patientId && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Resident's Name : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.patientId &&
                      fetchPaitentName(details?.data?.patientId)}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
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
                xs={12}
                sm={4}
                md={6}
                lg={4}
                className={`${!details?.data?.monthYear && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Month/Year : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.monthYear &&
                      formatDateToMMDDYYYY(details?.data?.monthYear)}
                  </h5>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={6}
                lg={12}
                className={`${!details?.data?.patientId?.diagnosis && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Diagnosis (specify if new or continuing) :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.patientId?.diagnosis &&
                      details?.data?.patientId?.diagnosis}
                  </h5>
                </div>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Medication Count : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.countType === "medication"
                      ? "Medication Count"
                      : "Opioid Count Controlled"}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={3}
                className={`${!details?.data?.facilityId && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Facility : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.facilityId?.name ||
                      facilitiesList?.find(
                        (fac) =>
                          fac._id ===
                          (details?.data?.facilityId?._id ||
                            details?.data?.facilityId),
                      )?.name ||
                      ""}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={3}
                className={`${!details?.data?.location && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Facility Address : </p>
                  <h5 className="view-value mb-0">{details?.data?.location}</h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={3}
                className={`${!details?.data?.medicationName && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Medication Name : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.medicationName}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={3}
                className={`${!details?.data?.dose && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Dose : </p>
                  <h5 className="view-value mb-0">{details?.data?.dose}</h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!details?.data?.prescriptionInstruction && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Prescription Instruction : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.prescriptionInstruction}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!details?.data?.prescribingProvider && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Prescribing provider : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.prescribingProvider}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!details?.data?.beginningMedCount && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Beginning med count : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.beginningMedCount}
                  </h5>
                </div>
              </Col>
            </Row>
          </div>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>ShiftFrom</th>
                    <th>ShiftTo</th>
                    <th>Number of tab/cap given</th>
                    <th>Beginning shift count</th>
                    <th>Ending shift count</th>
                    <th>Relieving staff Name and Signature</th>
                  </tr>
                </thead>
                <tbody>
                  {details?.data?.data?.docs
                    ?.slice()
                    ?.sort(
                      (a, b) =>
                        new Date(b.relievingStaffSignatureDate).getTime() -
                        new Date(a.relievingStaffSignatureDate).getTime(),
                    )
                    ?.map((i, index) => (
                      <tr key={index}>
                        <td className={`${i.date ? "" : "text-center"}`}>
                          {" "}
                          {(i.date && formatDateToMMDDYYYY(i.date)) || (
                            <DashComponent />
                          )}{" "}
                        </td>
                        <td className={`${i.shiftFrom ? "" : "text-center"}`}>
                          {" "}
                          {convertTimeFormat(i.shiftFrom, hoursFormat) || (
                            <DashComponent />
                          )}{" "}
                        </td>
                        <td className={`${i.shiftTo ? "" : "text-center"}`}>
                          {" "}
                          {convertTimeFormat(i.shiftTo, hoursFormat) || (
                            <DashComponent />
                          )}{" "}
                        </td>
                        <td>
                          {" "}
                          {i.numberOfTabsGiven || i.numberOfTabsGiven === 0
                            ? i.numberOfTabsGiven
                            : "0"}{" "}
                        </td>
                        <td>
                          {i.beginningCount
                            ? `(${i.beginningCount} + ${i.prevEndingCount})`
                            : `${+i.prevEndingCount}`}
                        </td>
                        <td>
                          {" "}
                          {i.endingCount || i.endingCount === 0
                            ? i.endingCount
                            : "0"}{" "}
                        </td>
                        <td
                          className={`${i.relievingStaffSignature ? "" : "text-center"}`}
                        >
                          {i.relievingStaffSignature ? (
                            signatureFormat({
                              sign: i.relievingStaffSignature,
                              date: i.relievingStaffSignatureDate,
                              time: i.relievingStaffSignatureTime,
                              withText: true,
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
          <Row>
            <Col xs={12} md={12} lg={12} className="text-end">
              {details?.data?.signers?.map(
                (signer) =>
                  signer.signature && (
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
  Wcomponenet: ViewCount,
});
