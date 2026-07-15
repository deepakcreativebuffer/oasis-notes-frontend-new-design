/** @format */

import { useCallback, useEffect, useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import { therapyNotesService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
  fetchPaitentName,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";

const UpdateMilegaLog = () => {
  const navigate = useNavigate();
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [date, setDate] = useState("");
  const [residentInitials, setResidentInitials] = useState("");
  const [beginningMileage, setBeginningMileaga] = useState("");
  const [endingMileage, setEndingMilega] = useState("");
  const [totalMileage, setTotalMilega] = useState("");
  const [driverSignature, setDriverSignature] = useState("");
  const [anyIssues, setAnyIssue] = useState("");
  const [signedDate, setSignedDate] = useState("");
  const [signedTime, setSignedTime] = useState("");
  const [destination, setDestination] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signers, setSigners] = useState([]);
  const [detail, setDetail] = useState({});
  const { id } = useParams();
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
  const { dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });

  const hasTypedInForm = !!driverSignature || !!adminSignature;
  const hasAnyPenSig = Object.values(signatures || {}).some(
    (s) => !!s?.rawSignatureImage,
  );

  const witnessNamePresent = !!(
    signatures?.witness?.name &&
    signatures.witness.name.trim() &&
    signatures.witness.name.trim() !== "undefined undefined"
  );
  const witnessSigPresent = !!signatures?.witness?.rawSignatureImage;
  const witnessIncomplete = witnessSigPresent && !witnessNamePresent;

  const clearAllTyped = () => {
    setDriverSignature("");
    setSignedDate("");
    setSignedTime("");
    setAdminSignature("");
    setAdminDateSigned("");
    setAdminSignedTime("");
  };

  const payload = {
    date,
    residentInitials,
    beginningMileage,
    endingMileage,
    totalMileage,
    driverSignature,
    signedDate,
    anyIssues,
    destination,
    saveAsDraft,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    signatures,
    signers,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    therapyNotesService.mileageLog.update(id, payload, {
      setLoading,
      navigate,
    });
  };
  const fetchHandler = () => {
    therapyNotesService.mileageLog.getById(id, { setResponse: setDetail });
  };
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (detail?.data) {
      const item = detail?.data;
      setDate(item?.date);
      setResidentInitials(item?.residentInitials);
      setBeginningMileaga(item?.beginningMileage);
      setEndingMilega(item?.endingMileage);
      setTotalMilega(item?.totalMileage);
      setDriverSignature(item?.driverSignature);
      setSignedDate(item?.signedDate);
      setSignedTime(item?.signedTime);
      setAnyIssue(item?.anyIssues);
      setDestination(item?.destination);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setAdminSignedTime(item?.adminSignedTime);
      setSigners(item?.signers);
      if (item?.signatures) {
        loadSignaturesFromApi(item.signatures);
      }
    }
  }, [detail, loadSignaturesFromApi]);
  const checkSign = useCallback(async () => {
    let signerIndex = signers?.findIndex?.(
      (signer, i) => signer.signerId === profileInfo._id,
    );
    let isSignerValid =
      signerIndex !== -1 && signers?.[signerIndex]?.signature?.length > 0;
    let isAdminConditionValid = profileInfo.userType === ROLES.ADMIN;
    let isEmployeeConditionValid =
      (detail?.data?.employeeId === profileInfo?._id ||
        detail?.data?.employeeId?._id === profileInfo?._id) &&
      driverSignature?.length > 0;
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
    detail?.data?.employeeId,
    driverSignature?.length,
    hasAnyPenSig,
  ]);
  useEffect(() => {
    if (!detail?.data) return;
    if (detail?.data) {
      const { saveAsDraft, signers } = detail.data;
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
          ).includes("ml") &&
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
          ).includes("ml") &&
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
          ).includes("ml") &&
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
    detail?.data,
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
  }, [driverSignature, adminSignature, id, checkSign, hasAnyPenSig]);
  let signerIndex = signers?.findIndex?.(
    (signer, i) => signer.signerId === profileInfo._id,
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
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
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
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
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
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerTime(time);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setSignedTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };

  return (
    <>
      {typedGuardDialog}
      <AddSignature
        show={open}
        setValue={(sign) =>
          profileInfo?.userType !== ROLES.ADMIN &&
          (detail?.data?.employeeId === profileInfo?._id ||
            detail?.data?.employeeId?._id === profileInfo?._id)
            ? setDriverSignature(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          profileInfo?.userType !== ROLES.ADMIN &&
          (detail?.data?.employeeId === profileInfo?._id ||
            detail?.data?.employeeId?._id === profileInfo?._id)
            ? setSignedDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          profileInfo?.userType !== ROLES.ADMIN &&
          (detail?.data?.employeeId === profileInfo?._id ||
            detail?.data?.employeeId?._id === profileInfo?._id)
            ? setSignedTime(time)
            : editTimeHandler(time)
        }
      />
      <NavWrapper title={"Mileage Log"} isArrow={true} />
      <Container className="full-width-container">
        <Form
          onSubmit={submitHandler}
          className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Date</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(date)}
                    onChange={(selectedDate) =>
                      setDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          date ? formatDateToMMDDYYYY(date) : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Resident Initials</Form.Label>
                  <Form.Control
                    onChange={(e) => setResidentInitials(e.target.value)}
                    value={residentInitials}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Beginning Mileage</Form.Label>
                  <Form.Control
                    onChange={(e) => setBeginningMileaga(e.target.value)}
                    value={beginningMileage}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Ending Mileage</Form.Label>
                  <Form.Control
                    onChange={(e) => setEndingMilega(e.target.value)}
                    value={endingMileage}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Total Mileage</Form.Label>
                  <Form.Control
                    onChange={(e) => setTotalMilega(e.target.value)}
                    value={totalMileage}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Destination</Form.Label>
                  <Form.Control
                    onChange={(e) => setDestination(e.target.value)}
                    value={destination}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Any Issues</Form.Label>
                  <Form.Control
                    onChange={(e) => setAnyIssue(e.target.value)}
                    as="textarea"
                    value={anyIssues}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
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
                fetchPaitentName(detail?.data?.employeeId) || ""
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

          <Row className="mt-4">
            <Col xs={12}>
              <Form.Label className="fw-bold">Drivers Signature</Form.Label>
              <Row>
                <Col xs={12} lg={6}>
                  <Button
                    type="button"
                    className={`theme-button ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                    onClick={() => setOpen(true)}
                  >
                    SAVED AND SIGNED
                  </Button>
                </Col>
                <Col xs={12} lg={6}>
                  {signatureFormat({
                    sign: driverSignature,
                    date: signedDate,
                    time: signedTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: adminSignature,
                    date: adminDateSigned,
                    time: adminSignedTime,
                    hoursFormat,
                  })}
                  {signers?.map(
                    (signer, i) =>
                      signer.signature && (
                        <div className="" key={signer?.signerId}>
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
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <div className="employee-btn-joiner mt-md-3 mt-5">
                {detail?.data?.saveAsDraft && (
                  <button
                    className={`draft ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                    type="submit"
                    onClick={() => setSaveAsDraft(true)}
                  >
                    Save as Draft
                  </button>
                )}

                <button
                  className={`employee_create_btn ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                  disabled={!isSubmitEnabled || witnessIncomplete}
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
  Wcomponenet: UpdateMilegaLog,
});
