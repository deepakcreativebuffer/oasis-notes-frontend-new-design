/* eslint-disable no-unused-vars */
/** @format */

import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { Container, Form, Row, Col, Card, Button } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import { employmentService } from "@/features/shared/services";
import Loader from "@/features/shared/ui/Loader/Loader";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { ROLES } from "@/features/shared/constants";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { downloadReport } from "@/utils";
const SignOfferLetter = () => {
  const ProfileDetails = useSelector(userProfile);
  const hoursFormat = ProfileDetails?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const { id, employeeId } = useParams();
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
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  useEffect(() => {
    if (data) {
      const item = data?.data;
      setofferDate(item?.offerDate);
      setEmployeeName(item?.employeeName);
      setStartingPay(item?.startingPay);
      setJoinDate(item?.startDate?.slice(0, 10));
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
    if (id || employeeId) {
      employmentService.getOfferLetter({
        ...(employeeId
          ? { employeeId, isAdmin: true }
          : { id, signById: true }),
        setLoading,
        setResponse: setData,
      });
    }
  }, [employeeId, id]);
  const payload = {
    employeeSignature,
    employeeSignDate,
    signers,
  };
  const handleSign = (e) => {
    e.preventDefault();
    employmentService.signOfferLetter(id, payload, { setLoading, navigate });
  };

  // Download Report
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        ProfileDetails,
        ProfileDetails,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      ProfileDetails,
      ProfileDetails,
    ),
    pageStyle: `
     @page {
      size: portrait !important;
      margin: 10mm 9mm !important;
    }    
    .card {
      page-break-inside: avoid;
    }
      .view-details-grid {
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
  const employeeIdFromResponse =
    data?.data?.employeeId?._id || data?.data?.employeeId;
  const checkSign = useCallback(async () => {
    let signerIndex = signers?.findIndex?.(
      (signer, i) => signer.signerId === ProfileDetails._id,
    );
    let isSignerValid =
      signerIndex !== -1 && signers?.[signerIndex]?.signature?.length > 0;
    let isAdminConditionValid =
      ProfileDetails.userType === ROLES.ADMIN &&
      administratorsSignature?.length > 0;
    let isEmployeeConditionValid =
      employeeIdFromResponse === ProfileDetails?._id &&
      employeeSignature?.length > 0;
    let signerGuadianIndex = signers?.findIndex?.((signer, i) =>
      ProfileDetails.patientsAssigned?.includes(signer.signerId),
    );
    let isGuadianConditionValid =
      signerGuadianIndex !== -1 &&
      signers?.[signerGuadianIndex]?.signature?.length > 0;
    if (
      isSignerValid ||
      isAdminConditionValid ||
      isEmployeeConditionValid ||
      isGuadianConditionValid
    ) {
      setIsSubmitEnabled(true);
    } else {
      setIsSubmitEnabled(false);
    }
  }, [
    signers,
    ProfileDetails.userType,
    ProfileDetails._id,
    ProfileDetails.patientsAssigned,
    administratorsSignature?.length,
    employeeIdFromResponse,
    employeeSignature?.length,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [employeeSignature, administratorsSignature, id, checkSign]);
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
  const editSignHandler = (sign) => {
    if (signers?.[signerIndex]?.signerId === ProfileDetails?._id) {
      setSignerSignature(sign);
    } else if (ProfileDetails.userType === ROLES.EMPLOYEE) {
      setEmployeeSignature(sign);
    }
  };
  const editDateHandler = (date) => {
    if (signers?.[signerIndex]?.signerId === ProfileDetails?._id) {
      setSignerDate(date);
    } else if (ProfileDetails.userType === ROLES.EMPLOYEE) {
      setEmployeeSignDate(date);
    }
  };
  return (
    <>
      <div ref={componentRef}>
        <AddSignature
          show={openSigner}
          setValue={setSignerSignature}
          setDate={setSignerDate}
          setTime={setSignerTime}
        />

        <AddSignature
          show={openSigner}
          setValue={(sign) =>
            data?.data?.employeeId === ProfileDetails?._id
              ? setEmployeeSignature(sign)
              : editSignHandler(sign)
          }
          setDate={(date) =>
            data?.data?.employeeId === ProfileDetails?._id
              ? setEmployeeSignDate(date)
              : editDateHandler(date)
          }
        />
        <NavWrapper title={"Offer Letter"} isArrow={true} />
        {loading ? (
          <Loader />
        ) : data?.data && Object.keys(data.data).length !== 0 ? (
          <Container className="full-width-container">
            <h1 className="pdfTitle hidden">Offer Letter</h1>
            <Form onSubmit={handleSign}>
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
                          {" "}
                          is pleased to offer you the position of Behavioral
                          Health Technician. We trust that you will find this
                          opportunity both exciting and rewarding. As discussed,
                          this is a full-time position, with a starting pay rate
                          of
                          <span className="mx-1">${startingPay}</span>per hour.
                          Your first day of work will be{" "}
                          <span className="ms-1">
                            {" "}
                            {formatDateToMMDDYYYY(joinDate)}
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
                        <span className="mx-1">{companyName}</span> is excited
                        to welcome you aboard, and we are confident that you
                        will make valuable contributions to the success of our
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
                      <Form.Label className="w-100 text-end">
                        Date : <span>{formatDateToMMDDYYYY(offerDate)} </span>
                      </Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
              <Row>
                <Col xs={12} lg={6}>
                  <Form.Label className="fw-bold w-100">
                    Employee Signature:
                  </Form.Label>

                  <Button
                    type="button"
                    onClick={() => setOpenSigner(true)}
                    className="theme-button hidePrint"
                  >
                    SAVED AND SIGNED
                  </Button>
                </Col>
                <Col xs={12} lg={6}>
                  <label className="w-100 text-end">
                    {" "}
                    <span>
                      {signatureFormat({
                        sign: administratorsSignature,
                        date: administratorsSignatureDate,
                        time: administratorsSignatureTime,
                        hoursFormat,
                      })}
                    </span>
                    <span>
                      {signatureFormat({
                        sign: employeeSignature,
                        date: employeeSignDate,
                        hoursFormat,
                      })}
                    </span>
                  </label>
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
                      type="submit"
                      disabled={!isSubmitEnabled}
                    >
                      {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
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
    </>
  );
};
export default HOC({
  Wcomponenet: SignOfferLetter,
});
