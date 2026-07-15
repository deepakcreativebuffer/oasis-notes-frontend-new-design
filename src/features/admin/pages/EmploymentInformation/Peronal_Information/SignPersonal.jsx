/** @format */

import React, { useEffect, useState } from "react";
import "./Personal.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import { employmentService } from "@/features/shared/services";
import { getData } from "@/features/shared/services";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { ClipLoader } from "react-spinners";
const ViewInfo = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const { id, employeeId } = useParams();
  const [open, setOpen] = useState(false);
  const [savedSigned, setSavedSigned] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [signatureTime, setSignatureTime] = useState("");
  const [loading, setLoading] = useState(false);
  let signerIndex = data?.data?.signers?.findIndex?.(
    (signer, i) => signer.signerId === profileInfo._id,
  );
  useEffect(() => {
    if (id || employeeId)
      getData(
        setData,
        employeeId
          ? `admin/getPersonalInformation/${employeeId}`
          : `employee/getPersonalInformationById/${id}`,
      );
  }, [employeeId, id]);
  const componentRef = React.useRef();
  function handleSign(e) {
    e.preventDefault();
    if (data?.data && signerIndex !== -1)
      employmentService.signPersonalInfo(
        id,
        {
          signature: savedSigned,
          signedTime: signatureTime,
          dateSigned: signatureDate,
          name: data?.data?.signers[signerIndex]?.name,
          signerId: data?.data?.signers[signerIndex]?.signerId,
        },
        { setLoading, navigate },
      );
  }
  return (
    <>
      {(signerIndex !== -1 ||
        data?.data?.signers?.[signerIndex]?.signature?.length) && (
        <AddSignature
          show={open}
          setValue={setSavedSigned}
          setDate={setSignatureDate}
          setTime={setSignatureTime}
        />
      )}
      <div ref={componentRef}>
        <NavWrapper title={"Personal Information"} isArrow={true} />

        <Container>
          <Form>
            <Row>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">First Name</p>
                  <h5 className="view-value mb-0">{data?.data?.firstName}</h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Last Name</p>
                  <h5 className="view-value mb-0">{data?.data?.lastName}</h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">MI</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.middleInitial}
                  </h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date</p>
                  <h5 className="view-value mb-0">
                    {" "}
                    {data?.data?.date && formatDateToMMDDYYYY(data?.data?.date)}
                  </h5>{" "}
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Street Address</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.addressStreet}
                  </h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">City</p>
                  <h5 className="view-value mb-0">{data?.data?.addressCity}</h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">State</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.addressState}
                  </h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Zip</p>
                  <h5 className="view-value mb-0">{data?.data?.addressZip}</h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Soc Sec No</p>
                  <h5 className="view-value mb-0">{data?.data?.socSecNo}</h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Birth Date</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.birthDate &&
                      formatDateToMMDDYYYY(data?.data?.birthDate)}
                  </h5>{" "}
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Telephone</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.telephoneHome}
                  </h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Personal Cell</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.telephonePersonalCell}
                  </h5>{" "}
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Work</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.telephoneWork}
                  </h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Business Cell </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.telephoneBusinessCell}
                  </h5>{" "}
                </div>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col col={12} md={12} lg={12}>
                <Form.Label className="fw-bold">Driver’s License</Form.Label>
              </Col>
            </Row>
            <Row>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">State of Issue </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.dLStateOfIssue}
                  </h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">No </p>
                  <h5 className="view-value mb-0">{data?.data?.dLNumber}</h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Expiration Date</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.dLExpirationDate &&
                      formatDateToMMDDYYYY(data?.data?.dLExpirationDate)}
                  </h5>{" "}
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Business Email</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.businessEmail}
                  </h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Personal Email</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.personalEmail}
                  </h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Emergency Contact</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.emergencyContactRelationship}
                  </h5>
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Relationship</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.emergencyContactRelationship}
                  </h5>{" "}
                </div>
              </Col>
              <Col col={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Emergency Contact Phone</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.emergencyContactNumber}
                  </h5>{" "}
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={6}>
                {signerIndex !== -1 &&
                  !data?.data?.signers?.[signerIndex]?.signature?.length && (
                    <Button
                      type="button"
                      className="theme-button"
                      onClick={() => setOpen(true)}
                    >
                      SAVED AND SIGNED
                    </Button>
                  )}
              </Col>
              <Col xs={12} lg={6}>
                <Form.Label className="w-100 text-end">
                  {" "}
                  {signatureFormat({
                    sign: data?.data?.savedSigned,
                    date: data?.data?.signatureDate,
                    time: data?.data?.signatureTime,
                    hoursFormat,
                  })}{" "}
                </Form.Label>
                {savedSigned && (
                  <Form.Label className="w-100 text-end">
                    {signatureFormat({
                      sign: savedSigned,
                      date: signatureDate,
                      time: signatureTime,
                      hoursFormat,
                    })}
                  </Form.Label>
                )}

                {data?.data?.signers?.map(
                  (signer) =>
                    signer.signature && (
                      <Form.Label
                        key={signer?.signerId}
                        className="w-100 text-end"
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

            <Row>
              <Col xs={12}>
                {signerIndex !== -1 &&
                  !data?.data?.signers?.[signerIndex]?.signature?.length && (
                    <button
                      className="print_btn hidePrint"
                      type="button"
                      onClick={handleSign}
                    >
                      {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                    </button>
                  )}
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </>
  );
};
export default HOC({
  Wcomponenet: ViewInfo,
});
