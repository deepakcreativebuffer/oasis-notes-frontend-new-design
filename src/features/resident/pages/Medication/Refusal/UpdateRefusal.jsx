/* eslint-disable no-unused-vars */
/** @format */

import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { medicationService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
const UpdateRefusal = () => {
  const ProfileDetails = useSelector(userProfile);
  const hoursFormat = ProfileDetails?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate(0);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const url = useLocation().pathname;
  const { id } = useParams();
  const [toDayDate, setToDayDate] = useState("");
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
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [openSigner, setOpenSigner] = useState(false);
  const [signers, setSigners] = useState([]);
  const [residentName, setResidentName] = useState("");
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [saveAsDrafIsNotEditable, setSaveAsDrafIsNotEditable] = useState(false);
  const [
    saveAsDrafIsNotEditableWithoutSigner,
    setSaveAsDrafIsNotEditableWithoutSigner,
  ] = useState(false);
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);

  const {
    signatures,
    updateSignature,
    loadFromApi: loadSignaturesFromApi,
  } = useSignatures();
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
    medicationService.refusal.getById(
      id || details?.data[details?.data?.length - 1]?._id,
      { setResponse: setDetails },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, url]);
  const submitHandler = (e, isDraft = false) => {
    e.preventDefault();
    const payload = {
      toDayDate,
      patientId,
      employeeId: ProfileDetails?._id,
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
      saveAsDraft: isDraft,
      adminSignature,
      adminDateSigned,
      adminSignedTime,
      signatures,
      signers,
    };
    medicationService.refusal.update(
      id || details?.data[details?.data?.length - 1]?._id,
      payload,
      {
        successMsg: "Updated !",
        setLoading,
        navigate,
      },
    );
  };
  useEffect(() => {
    if (details) {
      const item = details?.data;
      if (item) {
        setToDayDate(item?.toDayDate);
        setDateOfBirth(item?.patientId?.dateOfBirth);
        setAhcccsId(item?.patientId?.ahcccsId);
        setPatientName(item?.patientName);
        setPatientId(item?.patientId?._id);
        setDescribeIllness(item?.describeIllness);
        setIOffered(item?.iOffered);
        setResidentSignature(item?.residentSignature);
        setResidentDate(item?.residentDate);
        setResidentTime(item?.residentTime);
        setStaffSignature(item?.staffSignature);
        setStaffDate(item?.staffDate);
        setStaffTime(item?.staffTime);
        setAdminSignature(item?.adminSignature);
        setAdminDateSigned(item?.adminDateSigned);
        setAdminSignedTime(item?.adminSignedTime);
        setSigners(item?.signers || []);
        if (item?.signatures) {
          loadSignaturesFromApi(item.signatures);
        }
      }
    }
  }, [details, url, loadSignaturesFromApi]);
  const profileInfo = useSelector(userProfile);
  const checkSign = useCallback(async () => {
    let signerIndex = signers?.findIndex?.(
      (signer, i) => signer.signerId === profileInfo._id,
    );
    let isSignerValid =
      signerIndex !== -1 && signers?.[signerIndex]?.signature?.length > 0;
    let isAdminConditionValid = profileInfo.userType === ROLES.ADMIN;
    let isEmployeeConditionValid =
      (details?.data?.employeeId === profileInfo?._id ||
        details?.data?.employeeId?._id === profileInfo?._id) &&
      staffSignature?.length > 0;
    let signerGuadianIndex = signers?.findIndex?.((signer, i) =>
      profileInfo.patientsAssigned?.includes(signer.signerId),
    );
    let isGuadianConditionValid =
      signerGuadianIndex !== -1 &&
      signers?.[signerGuadianIndex]?.signature?.length > 0;
    if (
      isSignerValid ||
      isAdminConditionValid ||
      isEmployeeConditionValid ||
      isGuadianConditionValid ||
      hasAnyPenSig
    ) {
      setIsSubmitEnabled(true);
    } else {
      setIsSubmitEnabled(false);
    }
  }, [
    signers,
    profileInfo.userType,
    profileInfo._id,
    profileInfo.patientsAssigned,
    details?.data?.employeeId,
    staffSignature?.length,
    hasAnyPenSig,
  ]);
  useEffect(() => {
    if (!details?.data) return;
    if (details?.data) {
      const { saveAsDraft, signers } = details.data;
      const { _id, userType, accountType, userPermissions } = profileInfo;
      const isSigner = signers?.findIndex?.(
        (signer, i) => signer.signerId === _id,
      );
      // SaveAsDraft with signer
      if (
        (saveAsDraft &&
          userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.REGULAR &&
          !(
            typeof userPermissions?.edit === "string"
              ? userPermissions.edit.split(":")
              : []
          ).includes("rmt") &&
          isSigner !== -1) ||
        (saveAsDraft &&
          userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.RESTRICTED &&
          isSigner !== -1)
      ) {
        setSaveAsDrafIsNotEditable(true);
      } else {
        setSaveAsDrafIsNotEditable(false);
      }

      // SaveAsDraft withOut Signer
      if (
        (saveAsDraft &&
          userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.REGULAR &&
          !(
            typeof userPermissions?.edit === "string"
              ? userPermissions.edit.split(":")
              : []
          ).includes("rmt") &&
          isSigner === -1) ||
        (saveAsDraft &&
          userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.RESTRICTED &&
          isSigner === -1)
      ) {
        setSaveAsDrafIsNotEditableWithoutSigner(true);
      } else {
        setSaveAsDrafIsNotEditableWithoutSigner(false);
      }

      // signer without edit permission
      if (
        (userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.REGULAR &&
          !(
            typeof userPermissions?.edit === "string"
              ? userPermissions.edit.split(":")
              : []
          ).includes("rmt") &&
          isSigner !== -1) ||
        (userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.RESTRICTED &&
          isSigner !== -1)
      ) {
        setIsNotEditableWithSigner(true);
      } else {
        setIsNotEditableWithSigner(false);
      }
    }
  }, [
    details?.data,
    profileInfo,
    profileInfo?._id,
    profileInfo?.accountType,
    profileInfo?.userPermissions?.edit,
    profileInfo?.userType,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [staffSignature, adminSignature, id, checkSign, hasAnyPenSig]);
  let signerIndex = signers?.findIndex?.(
    (signer, i) =>
      signer.signerId === profileInfo._id ||
      profileInfo?.patientsAssigned?.includes(signer.signerId),
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
    if (
      signers?.[signerIndex]?.signerId === profileInfo?._id ||
      profileInfo?.patientsAssigned?.includes(signers?.[signerIndex]?.signerId)
    ) {
      setSignerSignature(sign);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setSigners((prevSigners) => {
        const signerIndex = prevSigners.findIndex(
          (signer) => signer.signerId === profileInfo?._id,
        );
        if (signerIndex !== -1) {
          const updatedSigners = [...prevSigners];
          updatedSigners[signerIndex] = {
            ...updatedSigners[signerIndex],
            signature: sign,
          };
          return updatedSigners;
        } else {
          return [
            ...prevSigners,
            {
              signerId: profileInfo._id,
              signature: sign,
              dateSigned: "",
              signedTime: "",
            },
          ];
        }
      });
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignature(sign);
    }
  };
  const editDateHandler = (date) => {
    if (
      signers?.[signerIndex]?.signerId === profileInfo?._id ||
      profileInfo?.patientsAssigned?.includes(signers?.[signerIndex]?.signerId)
    ) {
      setSignerDate(date);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setSigners((prevSigners) => {
        const signerIndex = prevSigners.findIndex(
          (signer) => signer.signerId === profileInfo?._id,
        );
        if (signerIndex !== -1) {
          const updatedSigners = [...prevSigners];
          updatedSigners[signerIndex] = {
            ...updatedSigners[signerIndex],
            dateSigned: date,
          };
          return updatedSigners;
        } else {
          return [
            ...prevSigners,
            {
              signerId: profileInfo._id,
              signature: "",
              dateSigned: date,
              signedTime: "",
            },
          ];
        }
      });
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminDateSigned(date);
    }
  };
  const editTimeHandler = (time) => {
    if (
      signers?.[signerIndex]?.signerId === profileInfo?._id ||
      profileInfo?.patientsAssigned?.includes(signers?.[signerIndex]?.signerId)
    ) {
      setSignerTime(time);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setStaffTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };
  return (
    <>
      {typedGuardDialog}
      <AddSignature
        show={openSigner}
        setValue={(sign) =>
          details?.data?.employeeId === profileInfo?._id ||
          details?.data?.employeeId?._id === profileInfo?._id ||
          profileInfo?.patientsAssigned?.includes(details?.data?.employeeId)
            ? setStaffSignature(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          details?.data?.employeeId === profileInfo?._id ||
          details?.data?.employeeId?._id === profileInfo?._id ||
          profileInfo?.patientsAssigned?.includes(details?.data?.employeeId)
            ? setStaffDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          details?.data?.employeeId === profileInfo?._id ||
          details?.data?.employeeId?._id === profileInfo?._id ||
          profileInfo?.patientsAssigned?.includes(details?.data?.employeeId)
            ? setStaffTime(time)
            : editTimeHandler(time)
        }
      />

      <NavWrapper title={"Refusal of Medical Treatment Form"} isArrow={true} />
      <Container>
        <Form
          onSubmit={submitHandler}
          className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
          <Row className="mb-2">
            <Col xs={12} md={12} lg={12}>
              <Form.Label className="fw-bold me-2">Resident’s Name</Form.Label>
              {residentName ? residentName : details?.data?.patientName}
            </Col>
          </Row>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={4} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Today's Date</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(toDayDate)}
                    disabled={url === "/create-refusal-resident"}
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
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none form-control"
                        : " form-control"
                    }
                  />
                </Form.Group>
              </Col>
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
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none form-control"
                        : " form-control"
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Describe Illness/Injury
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setDescribeIllness(e.target.value)}
                    value={describeIllness}
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    type="text"
                    disabled={url === "/create-refusal-resident"}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Card body className="mb-3">
            <Form.Label>
              I
              <span
                className={`mx-1 d-inline border-b w-[${!patientName ? "100px" : "fit"}]`}
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
              signerNameOverride={
                residentName ? residentName : details?.data?.patientName || ""
              }
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

          <Row>
            <Col xs={12} md={12} lg={6}>
              <Form.Label className="fw-bold">Staff Signature</Form.Label>
              <div>
                <Button
                  type="button"
                  onClick={() => setOpenSigner(true)}
                  className={`theme-button ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                >
                  SAVED AND SIGNED
                </Button>
              </div>
            </Col>
            <Col xs={12} md={12} lg={6}>
              {signatureFormat({
                sign: residentSignature,
                date: residentDate,
                time: residentTime,
                hoursFormat,
              })}
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
              {signers?.map(
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
            <Col xs={12} md={12} lg={12}>
              <div className="employee-btn-joiner mt-3 mt-md-5">
                {details?.data?.saveAsDraft && (
                  <button
                    className={`draft ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                    type="button"
                    onClick={(e) => submitHandler(e, true)}
                  >
                    Save as Draft
                  </button>
                )}
                <button
                  className={`employee_create_btn ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                  disabled={!isSubmitEnabled || witnessIncomplete}
                  type="button"
                  onClick={(e) => submitHandler(e, false)}
                >
                  {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}{" "}
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
  Wcomponenet: UpdateRefusal,
});
