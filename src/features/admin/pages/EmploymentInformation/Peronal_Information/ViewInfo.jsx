/** @format */

import React, { useEffect, useState } from "react";
import "./Personal.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import { getData } from "@/features/shared/services";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import { useParams } from "react-router-dom";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
const ViewInfo = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const [data, setData] = useState({});
  const { id, employeeId } = useParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [date, setDate] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [socSecNo, setSocSecNo] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [telephoneHome, setTelephoneHome] = useState("");
  const [telephonePersonalCell, setTelephonePersonalCell] = useState("");
  const [telephoneWork, setTelephoneWork] = useState("");
  const [telephoneBusinessCell, setTelephoneBusinessCell] = useState("");
  const [dLStateOfIssue, setDLStateOfIssue] = useState("");
  const [dLNumber, setDLNumber] = useState("");
  const [dLExpirationDate, DLExpirationDate] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactRelationship, setEmergencyContactRelationship] =
    useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [savedSigned, setSavedSigned] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [signatureTime, setSignatureTime] = useState("");
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [signers, setSigners] = useState([]);
  useEffect(() => {
    if (id) {
      getData(setData, `employee/getPersonalInformationById/${id}`);
    } else {
      getData(
        setData,
        employeeId
          ? `admin/getPersonalInformation/${employeeId}`
          : "employee/getPersonalInformation",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    if (data) {
      const personalInformationData = data?.data;
      setFirstName(personalInformationData?.firstName);
      setLastName(personalInformationData?.lastName);
      setMiddleInitial(personalInformationData?.middleInitial);
      setDate(personalInformationData?.date);
      setAddressStreet(personalInformationData?.addressStreet);
      setAddressCity(personalInformationData?.addressCity);
      setAddressState(personalInformationData?.addressState);
      setAddressZip(personalInformationData?.addressZip);
      setSocSecNo(personalInformationData?.socSecNo);
      setBirthDate(personalInformationData?.birthDate);
      setTelephoneHome(personalInformationData?.telephoneHome);
      setTelephonePersonalCell(personalInformationData?.telephonePersonalCell);
      setTelephoneWork(personalInformationData?.telephoneWork);
      setTelephoneBusinessCell(personalInformationData?.telephoneBusinessCell);
      setDLStateOfIssue(personalInformationData?.dLStateOfIssue);
      setDLNumber(personalInformationData?.dLNumber);
      DLExpirationDate(personalInformationData?.dLExpirationDate);
      setBusinessEmail(personalInformationData?.businessEmail);
      setPersonalEmail(personalInformationData?.personalEmail);
      setEmergencyContactName(personalInformationData?.emergencyContactName);
      setEmergencyContactRelationship(
        personalInformationData?.emergencyContactRelationship,
      );
      setEmergencyContactNumber(
        personalInformationData?.emergencyContactNumber,
      );
      setSavedSigned(personalInformationData?.savedSigned);
      setSignatureDate(personalInformationData?.signatureDate);
      setSignatureTime(personalInformationData?.signatureTime);
      setAdminSignature(personalInformationData?.adminSignature);
      setAdminDateSigned(personalInformationData?.adminDateSigned);
      setAdminSignedTime(personalInformationData?.adminSignedTime);
      setSigners(personalInformationData?.signers);
    }
  }, [data]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        data?.data?.employeeId,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      data?.data?.employeeId,
      profileInfo,
    ),
    pageStyle: `
    @page {
      size: portrait !important;
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
      <NavWrapper title={"Personal Information"} isArrow={true} />
      <Container>
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">Personal Information</h1>
          <Form>
            <Row>
              <Col col={12} sm={3} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">First Name :</p>
                  <h5 className="view-value mb-0">{firstName}</h5>
                </div>
              </Col>
              <Col col={12} sm={3} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Last Name : </p>
                  <h5 className="view-value mb-0">{lastName}</h5>
                </div>
              </Col>
              <Col col={12} sm={3} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">MI : </p>
                  <h5 className="view-value mb-0">{middleInitial}</h5>
                </div>
              </Col>
              <Col col={12} sm={3} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date : </p>
                  <h5 className="view-value mb-0">
                    {" "}
                    {date && formatDateToMMDDYYYY(date)}
                  </h5>{" "}
                </div>
              </Col>
              <Col col={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Street Address : </p>
                  <h5 className="view-value mb-0">{addressStreet}</h5>
                </div>
              </Col>
              <Col col={12} sm={3} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">City : </p>
                  <h5 className="view-value mb-0">{addressCity}</h5>
                </div>
              </Col>
              <Col col={12} sm={3} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">State : </p>
                  <h5 className="view-value mb-0">{addressState}</h5>
                </div>
              </Col>
              <Col col={12} sm={3} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Zip : </p>
                  <h5 className="view-value mb-0">{addressZip}</h5>
                </div>
              </Col>
              <Col col={12} sm={3} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Soc Sec No : </p>
                  <h5 className="view-value mb-0">{socSecNo}</h5>
                </div>
              </Col>
              <Col col={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Birth Date : </p>
                  <h5 className="view-value mb-0">
                    {birthDate && formatDateToMMDDYYYY(birthDate)}
                  </h5>{" "}
                </div>
              </Col>
              <Col col={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Telephone : </p>
                  <h5 className="view-value mb-0">{telephoneHome}</h5>
                </div>
              </Col>
              <Col col={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Personal Cell : </p>
                  <h5 className="view-value mb-0">
                    {telephonePersonalCell}
                  </h5>{" "}
                </div>
              </Col>
              <Col col={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Work : </p>
                  <h5 className="view-value mb-0">{telephoneWork}</h5>
                </div>
              </Col>
              <Col col={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Business Cell : </p>
                  <h5 className="view-value mb-0">
                    {telephoneBusinessCell}
                  </h5>{" "}
                </div>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col col={12} sm={12} md={12} lg={12}>
                <Form.Label className="fw-bold">Driver’s License : </Form.Label>
              </Col>
            </Row>
            <Row>
              <Col col={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">State of Issue : </p>
                  <h5 className="view-value mb-0">{dLStateOfIssue}</h5>
                </div>
              </Col>
              <Col col={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">No : </p>
                  <h5 className="view-value mb-0">{dLNumber}</h5>
                </div>
              </Col>
              <Col col={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Expiration Date : </p>
                  <h5 className="view-value mb-0">
                    {dLExpirationDate && formatDateToMMDDYYYY(dLExpirationDate)}
                  </h5>{" "}
                </div>
              </Col>
              <Col col={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Business Email : </p>
                  <h5 className="view-value mb-0">{businessEmail}</h5>
                </div>
              </Col>
              <Col col={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Personal Email : </p>
                  <h5 className="view-value mb-0">{personalEmail}</h5>
                </div>
              </Col>
              <Col col={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Emergency Contact Name: </p>
                  <h5 className="view-value mb-0">{emergencyContactName}</h5>
                </div>
              </Col>
              <Col col={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Relationship : </p>
                  <h5 className="view-value mb-0">
                    {emergencyContactRelationship}
                  </h5>{" "}
                </div>
              </Col>
              <Col col={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Emergency Contact Phone : </p>
                  <h5 className="view-value mb-0">
                    {emergencyContactNumber}
                  </h5>{" "}
                </div>
              </Col>
            </Row>
            <div className="">
              <Form.Label className="w-100 text-end">
                {" "}
                {signatureFormat({
                  sign: savedSigned,
                  date: signatureDate,
                  time: signatureTime,
                  hoursFormat,
                })}
                {signatureFormat({
                  sign: adminSignature,
                  date: adminDateSigned,
                  time: adminSignedTime,
                  hoursFormat,
                })}
              </Form.Label>
            </div>

            {signers?.map(
              (signer) =>
                signer.signature && (
                  <Form.Label key={signer?.signerId} className="w-100 text-end">
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
  Wcomponenet: ViewInfo,
});
