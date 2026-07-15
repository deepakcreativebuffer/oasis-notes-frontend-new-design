/** @format */

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import Loader from "@/features/shared/ui/Loader/Loader";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import { medicationService } from "@/features/shared/services";
import { convertTimeFormat, formatDateToMMDDYYYY } from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
const ViewTackingLog = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  useEffect(() => {
    medicationService.trackingLog.getById(id, {
      setResponse: setDetails,
      setLoading,
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
    @page {
      size: portrait !important;
      margin: 10mm 9mm!important;
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
      <NavWrapper title={"Appointment Tracking Log"} isArrow={true} />
      {loading ? (
        <Loader />
      ) : (
        <Container>
          <div ref={componentRef}>
            <h1 className="pdfTitle my-3 hidden">Appointment Tracking log</h1>
            <div className="view-details">
              <Row>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  className={`${!details?.data?.name && "hidePrint"}`}
                >
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Resident's Name : </span>
                    <span className="view-value mb-0">
                      {details?.data?.name && details?.data?.name}
                    </span>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  className={`${!details?.data?.contactNumber && "hidePrint"}`}
                >
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Contact Number : </span>
                    <span className="view-value mb-0">
                      {details?.data?.contactNumber}
                    </span>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  className={`${!details?.data?.date && "hidePrint"}`}
                >
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Appointment Date : </span>
                    <span className="view-value mb-0">
                      {details?.data?.date &&
                        formatDateToMMDDYYYY(details?.data?.date)}
                    </span>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  className={`${!details?.data?.time && "hidePrint"}`}
                >
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Time Slot : </span>
                    <span className="view-value mb-0">
                      {convertTimeFormat(details?.data?.time, hoursFormat)}
                    </span>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  className={`${!details?.data?.reasonForVisit && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Reason For Visit : </span>
                    <span className="view-value mb-0">
                      {details?.data?.reasonForVisit}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
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
      )}
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewTackingLog,
});
