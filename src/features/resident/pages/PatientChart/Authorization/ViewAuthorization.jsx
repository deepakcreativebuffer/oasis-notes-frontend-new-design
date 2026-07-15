/** @format */

import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { getData } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { ROLES } from "@/features/shared/constants";
import { downloadReport } from "@/utils";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
const ViewAuthorization = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const Profile = useSelector(userProfile);
  const companyName =
    Profile?.userType === ROLES.ADMIN
      ? Profile?.companyName
      : Profile?.adminId?.companyName;
  const hoursFormat = Profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = useRef(null);
  const fetchHandler = useCallback(() => {
    getData(
      setDetail,
      `employee/getAuthorizationForReleaseOfInformationById/${id}`,
    );
  }, [id]);
  useEffect(() => {
    fetchHandler();
  }, [fetchHandler]);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        Profile,
        Profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(detail?.data?.patientId),
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
      <NavWrapper
        title={"Authorization for Release of information"}
        isArrow={true}
      />
      <Container>
        <div className="authorization-release" ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">
            Authorization for release of Information
          </h1>
          <div className="view-details">
            <Row>
              <Col
                xs={12}
                sm={5}
                md={6}
                lg={3}
                className={`${!detail?.data?.patientId && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Resident Name : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.residentName}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={3}
                md={6}
                lg={3}
                className={`${!detail?.data?.patientId?.ahcccsId && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">AHCCCS ID : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.patientId?.ahcccsId}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={4}
                md={6}
                lg={3}
                className={`${!detail?.data?.patientId?.dateOfBirth && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date of Birth : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.patientId?.dateOfBirth &&
                      formatDateToMMDDYYYY(
                        detail?.data?.patientId?.dateOfBirth,
                      )}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={6}
                lg={3}
                className={`${!detail?.data?.patientId?.diagnosis && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Diagnosis (specify if new or continuing) :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.patientId?.diagnosis}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!detail?.data?.authorizedPersonName && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <div className="mixed_input">
                    <Form.Label className="mb-0 view-value">
                      Authorize <span>{companyName} </span>
                      to release the information described below to :
                    </Form.Label>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col xs={12} md={12} lg={12}>
                <h6 className="fw-bold w-100">Person and Agency (recipient)</h6>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={4}
                className={`${!detail?.data?.authorizedPersonAddress && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Facility Address : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.authorizedPersonAddress}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={4}
                className={`${!detail?.data?.authorizedPersonPhone && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Phone : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.authorizedPersonPhone}{" "}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={4}
                className={`${!detail?.data?.authorizedPersonFax && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Fax : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.authorizedPersonFax}{" "}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={6}
                className={`${!detail?.data?.authorizedPersonEmail && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Email : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.authorizedPersonEmail}
                  </h5>{" "}
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={6}
                className={`${!detail?.data?.authorizedPersonAgency && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Agency Name : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.authorizedPersonAgency}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Notice to Recipient : </p>
                  <h5 className="view-value mb-0">
                    This information has been disclosed to you from records that
                    Federal law protects. These records are not subject to re
                    disclosure. Federal regulations (42 CFR Part 2) prohibit you
                    from making further disclosure of Substance Abuse
                    Information without this specific written consent of the
                    person to whom it pertains, or as otherwise permitted by
                    such regulations. A general authorization for the release of
                    medical or other information is not sufficient for this
                    purpose.
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!detail?.data?.dropDown && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <Form.Label className="mb-0 fw-bold">
                    I authorize to release the following Information below :
                  </Form.Label>
                  <Form.Label className="mb-0">
                    <ul className="ps-3 mt-2 mb-0">
                      {detail?.data?.dropDown?.map((i, index) => (
                        <li className="mb-2 list-disc" key={index}>
                          {i}
                          {index !== detail.data.dropDown.length - 1}
                        </li>
                      ))}
                    </ul>
                  </Form.Label>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!detail?.data?.purposeOfDisclosure && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Purpose of Disclosure : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.purposeOfDisclosure}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${(!detail?.data?.expirationTo || !detail?.data?.revocation) && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <Form.Label className="w-100 mb-0">
                    I understand that at anytime, I may revoke this
                    authorization by writing to <span>{companyName}</span> .This
                    revocation will be effective except to the extent that
                    action based on this authorization has already been taken.
                    This authorization for release of information will expire:
                    One year from date{" "}
                    {detail?.data?.expirationTo &&
                      formatDateToMMDDYYYY(detail?.data?.expirationTo)}{" "}
                    60 Days (Substance Abuse Services){" "}
                    {detail?.data?.revocation &&
                      formatDateToMMDDYYYY(detail?.data?.revocation)}{" "}
                    Other (specify) : {detail?.data?.specify}
                  </Form.Label>
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <Form.Label className="w-100 mb-0">
                    By signing below, I acknowledge that I have read and
                    understand this document. I have given authorization to my
                    provider to disclose my records. I understand that my
                    information being disclosed to the receiving agency may no
                    longer be protected under the terms of this agreement.
                  </Form.Label>
                </div>
              </Col>
            </Row>
            <div className="signature-sections-inline mt-3">
              <SignatureSection
                role="resident"
                label="Resident/Representative Signature"
                variant="blue"
                mode="view"
                signature={detail?.data?.signatures?.resident}
                signerNameOverride={
                  detail?.data?.residentName ||
                  `${detail?.data?.patientId?.firstName ?? ""} ${detail?.data?.patientId?.lastName ?? ""}`.trim()
                }
              />
              <SignatureSection
                role="witness"
                label="Witness Signature"
                variant="yellow"
                mode="view"
                signature={detail?.data?.signatures?.witness}
              />
            </div>
            <Row>
              <Col xs={12}>
                <span className="w-100 text-end">
                  {signatureFormat({
                    sign: detail?.data?.signature,
                    date: detail?.data?.dateSigned,
                    time: detail?.data?.signedTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: detail?.data?.adminSignature,
                    date: detail?.data?.adminDateSigned,
                    time: detail?.data?.adminSignedTime,
                    hoursFormat,
                  })}
                </span>
                {detail?.data?.signers?.map?.((signer) =>
                  signer?.signature?.length ? (
                    <div className="w-100 text-end" key={signer?.signerId}>
                      {signatureFormat({
                        sign: signer?.signature,
                        date: signer?.dateSigned,
                        time: signer?.signedTime,
                        hoursFormat,
                      })}
                    </div>
                  ) : null,
                )}
              </Col>
            </Row>
          </div>
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
        </div>
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewAuthorization,
});
