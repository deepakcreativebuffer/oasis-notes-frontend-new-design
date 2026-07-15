/** @format */

import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import { therapyNotesService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
  fetchPaitentName,
} from "@/utils/utils";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";

import { ROLES } from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";

const CreateMilegaLog = () => {
  const navigate = useNavigate();
  const profileUser = useSelector(userProfile);
  const hoursFormat = profileUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
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
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [signers, setSigners] = useState([]);
  const [data, setData] = useState({});
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [openAdmin, setAdminOpen] = useState(false);

  const { signatures, updateSignature } = useSignatures();
  const { dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });

  const hasTypedInForm = !!driverSignature || !!adminSignature;

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

  useEffect(() => {
    if (profileUser?.userType !== ROLES.ADMIN) {
      therapyNotesService.mileageLog.getPrefillData({
        isAdmin: false,
        setResponse: setData,
        setLoading,
      });
    }
  }, [profileUser?.userType]);

  useEffect(() => {
    if (data?.data) {
      const item = data?.data;
      setResidentInitials(item[0]?.residentInitials);
      setDate(item[0]?.date);
      setBeginningMileaga(item[0]?.beginningMileage);
      setEndingMilega(item[0]?.endingMileage);
      setTotalMilega(item[0]?.totalMileage);
      setAnyIssue(item[0]?.anyIssues);
      setDestination(item[0]?.destination);
    }
  }, [data]);

  const payload = {
    date,
    residentInitials,
    beginningMileage,
    endingMileage,
    totalMileage,
    driverSignature,
    signedTime,
    signedDate,
    anyIssues,
    destination,
    saveAsDraft,
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
  };

  const submitHandler = (e) => {
    e.preventDefault();
    therapyNotesService.mileageLog.create(payload, {
      isAdmin: profileUser?.userType === ROLES.ADMIN,
      setLoading,
      navigate,
    });
  };

  return (
    <>
      {typedGuardDialog}
      <AddSignature
        show={open}
        setValue={setDriverSignature}
        setDate={setSignedDate}
        setTime={setSignedTime}
      />
      <AddSignature
        show={openAdmin}
        setValue={setAdminSignature}
        setDate={setAdminDateSigned}
        setTime={setAdminSignedTime}
      />
      <NavWrapper title={"Mileage Log"} isArrow={true} />

      <Container className="full-width-container">
        <Form onSubmit={submitHandler}>
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
          <Row>
            <Col xs={12}>
              <Form.Label className="fw-bold">Drivers Signature</Form.Label>
              <Row>
                <Col xs={12} lg={6}>
                  <Button
                    type="button"
                    className="theme-button"
                    onClick={() =>
                      profileUser.userType === ROLES.ADMIN
                        ? setAdminOpen(true)
                        : setOpen(true)
                    }
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
                </Col>
              </Row>
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
              signerNameOverride={fetchPaitentName(profileUser) || ""}
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

          <Row className="mt-3 mt-4">
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="fw-bold">Signers</Form.Label>
                <MultiEmployee setValue={setSigners} value={signers} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div className="employee-btn-joiner mt-md-3 mt-5">
                <button
                  className="draft"
                  type="submit"
                  onClick={() => setSaveAsDraft(!saveAsDraft)}
                >
                  Save as Draft
                </button>

                <button
                  className="employee_create_btn"
                  type="submit"
                  disabled={
                    witnessIncomplete
                      ? true
                      : profileUser.userType === ROLES.ADMIN
                        ? false
                        : driverSignature?.length === 0
                  }
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

export default HOC({ Wcomponenet: CreateMilegaLog });
