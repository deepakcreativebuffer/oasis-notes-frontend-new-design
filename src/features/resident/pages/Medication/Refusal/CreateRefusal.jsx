/* eslint-disable no-unused-vars */
/** @format */

import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Card, Button } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { employeeService, medicationService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { ROLES } from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
import { useNavigate } from "react-router-dom";
const CreateRefusal = () => {
  const navigate = useNavigate();
  const profileDetail = useSelector(userProfile);
  const hoursFormat = profileDetail?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [toDayDate, setToDayDate] = useState(
    formatDateToMMDDYYYY(new Date()) || "",
  );
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [describeIllness, setDescribeIllness] = useState("");
  const [iOffered, setIOffered] = useState("");
  const [residentSignature, setResidentSignature] = useState("");
  const [residentDate, setResidentDate] = useState("");
  const [residentTime, setResidentTime] = useState("");
  const [staffSignature, setStaffSignature] = useState("");
  const [staffDate, setStaffDate] = useState("");
  const [staffTime, setStaffTime] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [patientDetail, setPatientDetail] = useState({});
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [signers, setSigners] = useState([]);
  const [data, setData] = useState("");
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [openAdmin, setAdminOpen] = useState(false);

  const { signatures, updateSignature } = useSignatures();
  const { guardTyped, dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });

  const hasTypedInForm = !!staffSignature || !!adminSignature;
  const hasAnyPenSig = Object.values(signatures || {}).some(
    (s) => !!s?.rawSignatureImage,
  );
  const allPenSigsHaveNames = Object.values(signatures || {}).every(
    (s) => !s?.rawSignatureImage || !!s?.name?.trim(),
  );

  const witnessNamePresent = !!(
    signatures?.witness?.name &&
    signatures.witness.name.trim() &&
    signatures.witness.name.trim() !== "undefined undefined"
  );
  const witnessSigPresent = !!signatures?.witness?.rawSignatureImage;
  const witnessIncomplete = witnessSigPresent && !witnessNamePresent;

  const clearAllTyped = () => {
    setStaffSignature("");
    setStaffDate("");
    setStaffTime("");
    setAdminSignature("");
    setAdminDateSigned("");
    setAdminSignedTime("");
  };
  useEffect(() => {
    employeeService.getProfile({ setResponse: setProfile });
  }, []);
  const submitHandler = (e, isDraft = false) => {
    e.preventDefault();
    const payload = {
      toDayDate,
      patientId,
      employeeId: profile?.data?._id,
      patientName,
      dateOfBirth,
      describeIllness,
      iOffered,
      residentSignature,
      residentDate,
      residentTime,
      staffSignature,
      staffDate,
      staffTime,
      adminSignature,
      adminDateSigned,
      adminSignedTime,
      signatures,
      signers: signers?.map((signer) => ({
        signerId: signer.value,
        name: signer.label,
        signature: "",
        dateSigned: "",
        signedTime: "",
      })),
      saveAsDraft: isDraft,
    };
    medicationService.refusal.create(payload, {
      successMsg: "Created !",
      setLoading,
      navigate,
    });
  };
  useEffect(() => {
    if (patientDetail) {
      setDateOfBirth(patientDetail?.dateOfBirth);
      setAhcccsId(patientDetail?.ahcccsId);
    }
  }, [patientDetail]);
  useEffect(() => {
    if (patientId) {
      medicationService.refusal.getByPatientId(patientId, {
        setResponse: setData,
        setLoading,
      });
    }
  }, [patientId]);
  useEffect(() => {
    let populateData;
    if (Array.isArray(data?.data)) {
      populateData = data?.data?.find((item) => {
        return (
          item?.patientId?._id === patientId || item?.patientId === patientId
        );
      });
    }
    if (populateData) {
      setDescribeIllness(populateData?.describeIllness || "");
      setIOffered(populateData?.iOffered || "");
    } else {
      setDescribeIllness("");
      setIOffered("");
    }
  }, [data, patientId, profile._id]);
  return (
    <>
      {typedGuardDialog}
      <AddSignature
        setValue={setStaffSignature}
        setDate={setStaffDate}
        setTime={setStaffTime}
        show={open}
      />
      <AddSignature
        show={openAdmin}
        setValue={setAdminSignature}
        setDate={setAdminDateSigned}
        setTime={setAdminSignedTime}
      />
      <NavWrapper title={"Refusal of Medical Treatment Form"} isArrow={true} />
      <Container>
        <Form onSubmit={submitHandler}>
          <Row className="mb-2">
            <Col xs={12} md={12} lg={12}>
              <PatientComponent
                MainResidentName={setPatientName}
                MainPatientId={setPatientId}
                setWholeData={setPatientDetail}
              />
            </Col>
          </Row>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={4} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
                  <Form.Control
                    onChange={(e) => setAhcccsId(e.target.value)}
                    value={ahcccsId}
                    disabled
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Today's Date</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(toDayDate)}
                    onChange={(selectedDate) =>
                      setToDayDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          toDayDate
                            ? formatDateToMMDDYYYY(toDayDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Date of Birth</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(dateOfBirth)}
                    disabled
                    onChange={(selectedDate) =>
                      setDateOfBirth(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          dateOfBirth
                            ? formatDateToMMDDYYYY(dateOfBirth)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Describe Illness/Injury
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setDescribeIllness(e.target.value)}
                    value={describeIllness}
                    as="textarea"
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Card body className="mb-3">
            <Form.Label className="w-100">
              I
              <span
                className={`mx-1 d-inline-block fit-content-span border-b w-[${!patientName ? "100px" : "fit"}]`}
              >
                {patientName}
              </span>
              have been offered the opportunity to have medical care at the
              doctors office,hospital,urgent care for the above illness/injury.
              I feel as though I do not require medical care at this time.
              However, should I feel the need to have medical care, I will
              immediately report this to a staff.
            </Form.Label>
          </Card>
          <Row>
            <Col xs={12} md={12} lg={6}>
              <Form.Label className="fw-bold">Staff Signature</Form.Label>
              <div>
                <Button
                  type="button"
                  onClick={() =>
                    profileDetail?.userType === ROLES.ADMIN
                      ? setAdminOpen(true)
                      : setOpen(true)
                  }
                  className="theme-button"
                >
                  {" "}
                  SAVED AND SIGNED
                </Button>
              </div>
            </Col>
            <Col xs={12} md={12} lg={6}>
              {signatureFormat({
                sign: staffSignature,
                date: staffDate,
                time: staffTime,
                hoursFormat,
              })}
              {signatureFormat({
                sign: adminSignature,
                date: adminDateSigned,
                time: adminSignedTime,
                hoursFormat,
              })}
            </Col>
          </Row>

          <div className="signature-sections-inline mt-3">
            <SignatureNamesPanel
              signatures={signatures}
              onUpdate={updateSignature}
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
            <SignatureSection
              role="resident"
              label="Resident/Representative Signature"
              variant="blue"
              signature={signatures?.resident}
              onUpdate={updateSignature}
              signerNameOverride={patientName || ""}
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
            <SignatureSection
              role="witness"
              label="Witness Signature"
              variant="yellow"
              signature={signatures?.witness}
              onUpdate={updateSignature}
              externalName
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
          </div>

          <Row className="my-3 mt-4">
            <Col xs={12} md={12} lg={12}>
              <Form.Group>
                <Form.Label className="fw-bold">Signers:</Form.Label>
                <MultiEmployee
                  setValue={setSigners}
                  value={signers}
                  alsoResident
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div className="employee-btn-joiner mt-3 mt-md-5">
                <button
                  className="draft"
                  type="button"
                  onClick={(e) => submitHandler(e, true)}
                >
                  Save as Draft
                </button>

                <button
                  className="employee_create_btn"
                  type="button"
                  disabled={
                    witnessIncomplete
                      ? true
                      : profileDetail?.userType === ROLES.ADMIN
                        ? false
                        : staffSignature?.length === 0
                  }
                  onClick={(e) => submitHandler(e, false)}
                >
                  {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: CreateRefusal,
});
