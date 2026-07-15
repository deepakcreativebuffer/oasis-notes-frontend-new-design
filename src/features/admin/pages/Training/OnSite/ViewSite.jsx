/** @format */

import React, { useEffect, useState } from "react";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { useParams } from "react-router-dom";
import { getData } from "@/features/shared/services";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
const ViewSite = () => {
  const { id, employeeId } = useParams();
  const [data, setData] = useState({});
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const fetchHandler = () => {
    getData(
      setData,
      employeeId
        ? `employee/getOnSiteFacilityById/${employeeId}`
        : `employee/getOnSiteFacilityById/${id}`,
    );
  };
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, employeeId]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        data?.data?.employeeId,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      data?.data?.employeeId,
      profile,
    ),
    pageStyle: `
    @page {
      size: portrait !important;
      margin: 12mm 9mm !important;
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
      <NavWrapper
        title={"On Site and Facility Orientation Verification"}
        isArrow={true}
      />
      <Container className="viewapis-print-view">
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">
            On Site and Facility Orientation Verification
          </h1>
          <Form>
            <Card body className="mb-3">
              <Row>
                <Col xs={12}>
                  <Form.Label className="w-100">
                    The following orientation trainings are conducted during the
                    1 st week of hire and before providing services to
                    residents.
                  </Form.Label>
                  <Form.Label className="w-100">
                    Document more than one training date and duration of
                    training if training occurs more than in one time period.
                  </Form.Label>
                </Col>
              </Row>
            </Card>
            {data?.data?.training?.map((i, index) => (
              <React.Fragment key={index} className="view-details mb-4">
                <Row>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Training Date : </p>
                      <h5 className="view-value mb-0">
                        <span>
                          {(i.date && formatDateToMMDDYYYY(i.date)) || (
                            <DashComponent />
                          )}
                        </span>{" "}
                      </h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Duration : </p>
                      <h5 className="view-value mb-0">{i.duration || 0}</h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <div className="view-details-grid d-block my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Training Name </p>

                      <div className="view-value">
                        <ul className="ps-3 mt-2 mb-0">
                          {i?.title?.length ? (
                            i.title.map((i, index) => (
                              <li className="mb-2 list-disc" key={index}>
                                {i.label}
                              </li>
                            ))
                          ) : (
                            <span className="me-2">
                              <DashComponent />
                            </span>
                          )}
                        </ul>
                      </div>
                    </div>
                  </Col>
                </Row>
              </React.Fragment>
            ))}

            <Row className="mb-3">
              <Col xs={12} sm={12}>
                <Form.Label className="mb-0 w-100 text-end">
                  {signatureFormat({
                    sign: data?.data?.employeeSignature,
                    date: data?.data?.employeeDate,
                    time: data?.data?.employeeTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: data?.data?.adminSignature,
                    date: data?.data?.adminDateSigned,
                    time: data?.data?.adminSignedTime,
                    hoursFormat,
                  })}
                </Form.Label>
              </Col>
              <Col xs={12}>
                {data?.data?.signers?.map(
                  (signer) =>
                    signer.signature && (
                      <Form.Label
                        key={signer?.signerId}
                        className="mb-0 w-100 text-end"
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
  Wcomponenet: ViewSite,
});
