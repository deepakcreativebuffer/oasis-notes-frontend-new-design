/** @format */

import { Button, Container, Row, Col, Form } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import { timeOffService } from "@/features/shared/services";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import NavWrapper from "@/utils/NavWrapper";
import Loader from "@/features/shared/ui/Loader/Loader";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  fetchPaitentName,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useParams } from "react-router-dom";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
const ViewTimeOfRequest = () => {
  const { id, employeeId } = useParams();
  const [loading, setLoading] = useState(false);
  const profileDetail = useSelector(userProfile);
  const hoursFormat = profileDetail?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const [data, setData] = useState({});
  useEffect(() => {
    timeOffService.getRequestById({
      id,
      employeeId,
      setResponse: setData,
      setLoading,
    });
  }, [id, employeeId]);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        data?.data?.employeeId,
        profileDetail,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      data?.data?.employeeId,
      profileDetail,
    ),
    pageStyle: `
    @page {
      size: portrait!important;
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
      <NavWrapper title={"Time of Request"} isArrow={true} />
      {loading ? (
        <Loader />
      ) : (
        <Container>
          <div ref={componentRef}>
            <h1 className="pdfTitle my-3 hidden">Time of Request</h1>
            <Form>
              <div className="view-details">
                <Row>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Employee Name : </p>
                      <h5 className="view-value mb-0">
                        {data && fetchPaitentName(data?.data?.employeeId)}{" "}
                      </h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Time of Request : </p>
                      <h5 className="view-value mb-0">
                        {data?.data?.requestType}
                      </h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Begin Date requested : </p>
                      <h5 className="view-value mb-0">
                        {data?.data?.beginDate &&
                          formatDateToMMDDYYYY(data?.data?.beginDate)}
                      </h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">End Date requested : </p>
                      <h5 className="view-value mb-0">
                        {data?.data?.endDate &&
                          formatDateToMMDDYYYY(data?.data?.endDate)}
                      </h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Normal Shift : </p>
                      <h5 className="view-value mb-0">
                        {data?.data?.normalShift}
                      </h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Unpaid Hours left : </p>
                      <h5 className="view-value mb-0">
                        {data?.data?.unPaidHrLeft}
                      </h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">
                        Vacation/Personal time used :{" "}
                      </p>
                      <h5 className="view-value mb-0">
                        {data?.data?.vacationPersonTimeUsed}
                      </h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Sick Time used : </p>
                      <h5 className="view-value mb-0">
                        {data?.data?.sickTimeUsed}
                      </h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">
                        Time off request approved :{" "}
                      </p>
                      <h5 className="view-value mb-0">{data?.data?.status}</h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Notes : </p>
                      <h5 className="view-value mb-0">{data?.data?.notes}</h5>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12} lg={12} className="text-end">
                    {signatureFormat({
                      sign: data?.data?.signature,
                      date: data?.data?.signatureDate,
                      time: data?.data?.signatureTime,
                      hoursFormat,
                    })}
                    {signatureFormat({
                      sign: data?.data?.adminSignature,
                      date: data?.data?.adminDateSigned,
                      time: data?.data?.adminSignedTime,
                      hoursFormat,
                    })}
                    {data?.data?.signers?.map(
                      (signer) =>
                        signer.signature && (
                          <Form.Label
                            className="w-100 text-end"
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
                  </Col>
                </Row>
                <Row className="text-center">
                  <Col xs={12} md={12} lg={12}>
                    <Button
                      className="theme-button hidePrint mt-3"
                      type="button"
                      onClick={print}
                    >
                      PRINT REPORT
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>
          </div>
        </Container>
      )}
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewTimeOfRequest,
});
