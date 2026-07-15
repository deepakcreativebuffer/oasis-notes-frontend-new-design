/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Form, Row, Col, Card } from "react-bootstrap";
import "./OfferLetterEmployeePage.css";
import NavWrapper from "@/utils/NavWrapper";
import { employmentService } from "@/features/shared/services/index";
import Loader from "@/features/shared/ui/Loader/Loader";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useParams } from "react-router-dom";
import { ROLES } from "@/features/shared/constants";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils/index";
const OfferLetter = () => {
  const ProfileDetails = useSelector(userProfile);
  const { id } = useParams();
  const hoursFormat = ProfileDetails?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [offerDate, setofferDate] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const companyName =
    ProfileDetails?.userType === ROLES.ADMIN
      ? ProfileDetails?.companyName
      : ProfileDetails?.adminId?.companyName;
  const [startingPay, setStartingPay] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [administratorName, setAdministratorName] = useState("");
  const [openSigner, setOpenSigner] = useState(false);
  const [signers, setSigners] = useState([]);
  const [administratorsSignatureTime, setAdministratorsSignatureTime] =
    useState("");
  const [administratorsSignatureDate, setAdministratorsSignatureDate] =
    useState("");
  const [administratorsSignature, setAdministratorsSignature] = useState("");
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeSignDate, setEmployeeSignDate] = useState("");
  useEffect(() => {
    if (data) {
      const item = data?.data;
      setofferDate(item?.offerDate);
      setEmployeeName(item?.employeeName);
      setStartingPay(item?.startingPay);
      setJoinDate(formatDateToMMDDYYYY(item?.startDate));
      setAdministratorName(item?.administratorsName);
      setSigners(item?.signers);
      setAdministratorsSignatureDate(item?.administratorsSignatureDate);
      setAdministratorsSignatureTime(item?.administratorsSignatureTime);
      setAdministratorsSignature(item?.administratorsSignature);
      setEmployeeSignature(item?.employeeSignature);
      setEmployeeSignDate(item?.employeeSignDate);
    }
  }, [data]);
  useEffect(() => {
    employmentService.getOfferLetter({
      id: id || ProfileDetails._id,
      setLoading,
      setResponse: setData,
    });
  }, [ProfileDetails._id, id]);

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
      margin: 10mm 9mm!important;
    }    
    .card {
      page-break-inside: avoid;
    }
    .form-label {
      page-break-inside: avoid;
    }
  `,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const print = usePrint(printRef, handlePrint2);
  let signerIndex = signers?.findIndex?.(
    (signer, i) => signer.signerId === ProfileDetails._id,
  );
  if (signerIndex === undefined || signerIndex === null) signerIndex = -1;
  function setSignerSignature(sign) {
    if (signerIndex !== -1)
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          signature: sign,
        };
        return newSigners;
      });
  }
  function setSignerDate(date) {
    if (signerIndex !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          dateSigned: date,
        };
        return newSigners;
      });
    }
  }
  function setSignerTime(time) {
    if (signerIndex !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          signedTime: time,
        };
        return newSigners;
      });
    }
  }
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <div ref={componentRef}>
        <AddSignature
          show={openSigner}
          setValue={setSignerSignature}
          setDate={setSignerDate}
          setTime={setSignerTime}
        />
        <NavWrapper title={"Offer Letter"} isArrow={true} />
        {loading ? (
          <Loader />
        ) : data?.data && Object.keys(data.data).length !== 0 ? (
          <Container className="full-width-container">
            <h1 className="pdfTitle hidden">Offer Letter</h1>
            <Form>
              <Card body className="mb-3">
                <Row>
                  <Col xs={12} md={12}>
                    <Form.Group className="text-start mb-3">
                      <Form.Label>Offer Date :</Form.Label>
                      <Form.Label className="ms-1">
                        {offerDate && formatDateToMMDDYYYY(offerDate)}
                      </Form.Label>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Dear</Form.Label>
                      <Form.Label className="ms-1">{employeeName},</Form.Label>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>
                        Congratulations!
                        <span className="ms-1">{companyName}</span>
                        <span className="ms-1">
                          is pleased to offer you the position of Behavioral
                          Health Technician. We trust that you will find this
                          opportunity both exciting and rewarding. As discussed,
                          this is a full-time position, with a starting pay rate
                          of
                          <span className="mx-1">${startingPay}</span>
                          per hour. Your first day of work will be{" "}
                          <span className="ms-1">
                            {" "}
                            {formatDateToMMDDYYYY(joinDate)}{" "}
                          </span>
                          . Please note that this offer is contingent upon the
                          satisfactory completion of your reference checks and
                          submission of all required documentation.
                        </span>
                      </Form.Label>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>
                        The entire team at
                        <span className="mx-1">{companyName}</span>is excited to
                        welcome you aboard, and we are confident that you will
                        make valuable contributions to the success of our
                        organization.
                      </Form.Label>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>
                        Once again, congratulations, and we look forward to
                        having you as part of our team!
                      </Form.Label>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Sincerely,</Form.Label>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        Administrators Name : <span>{administratorName} </span>
                      </Form.Label>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        Date : <span>{formatDateToMMDDYYYY(offerDate)} </span>
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
              <Form.Group>
                <Form.Label className="w-100 text-end">
                  {" "}
                  {signatureFormat({
                    sign: administratorsSignature,
                    date: administratorsSignatureDate,
                    time: administratorsSignatureTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: employeeSignature,
                    date: employeeSignDate,
                    hoursFormat,
                  })}
                </Form.Label>
              </Form.Group>
              <Row>
                <Col xs={12} lg={12}>
                  {signers?.map(
                    (signer) =>
                      signer.signature && (
                        <label
                          key={signer?.signerId}
                          className="w-100 text-end print-lightest-weight"
                        >
                          {signatureFormat({
                            sign: signer.signature,
                            date: signer.dateSigned,
                            time: signer.signedTime,
                            hoursFormat,
                          })}
                        </label>
                      ),
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={12} lg={12}>
                  <div className="employee-btn-joiner mt-2 mt-md-5">
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
          </Container>
        ) : (
          <Container>
            <NoFound />
          </Container>
        )}
      </div>
    </div>
  );
};
export default HOC({
  Wcomponenet: OfferLetter,
});
