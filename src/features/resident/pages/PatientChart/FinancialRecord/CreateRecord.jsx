/* eslint-disable no-unused-vars, jsx-a11y/anchor-is-valid, no-script-url */
/** @format */

import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
} from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { createForRole } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  AddSignatureForTable,
  deletePermission,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import { ROLES } from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";

const CreateRecord = () => {
  const navigate = useNavigate();
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState("");
  const [dateOfBirth, setDOB] = useState("");
  const [admitDate, setAdminDate] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [transDate, setTransDate] = useState("");
  const [deposit, setDeposti] = useState("");
  const [moneySpent, setMoneySpent] = useState("");
  const [balance, setBalance] = useState("");
  const [description, setDescription] = useState("");
  const [arr, setArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [staffSignature, setStaffSignature] = useState("");
  const [staffSignDate, setStaffSignDate] = useState("");
  const [staffSignTime, setStaffSignTime] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [signers, setSigners] = useState([]);
  const [overAllBalance, setOverAllBalance] = useState(0);
  const profileUser = useSelector(userProfile);
  const [date, setDate] = useState(formatDateToMMDDYYYY(new Date()));
  const [isEmpty, setIsEmpty] = useState(false);

  const { signatures, updateSignature } = useSignatures();
  const { guardTyped, dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });

  const hasTypedInForm = false; // Not clearing table signatures

  const witnessNamePresent = !!(
    signatures?.witness?.name &&
    signatures.witness.name.trim() &&
    signatures.witness.name.trim() !== "undefined undefined"
  );
  const witnessSigPresent = !!signatures?.witness?.rawSignatureImage;
  const witnessIncomplete = witnessSigPresent && !witnessNamePresent;

  const clearAllTyped = () => {};

  const arrObj = {
    createdAt: new Date(),
    date,
    deposit,
    moneySpent,
    balance,
    description,
    staffSignature,
    staffSignDate,
    staffSignTime,
  };
  const payload = {
    patientId,
    residentName,
    dateOfBirth,
    admitDate,
    ahcccsId,
    saveAsDraft,
    balance: overAllBalance,
    transactions: arr
      ?.sort(
        (a, b) =>
          new Date(b.staffSignDate).getTime() -
          new Date(a.staffSignDate).getTime(),
      )
      .map((i) => ({
        createdAt: i.createdAt,
        date: formatDateToMMDDYYYY(i.date),
        deposit: i.deposit,
        moneySpent: i.moneySpent,
        balance: i.balance,
        description: i.description,
        StaffSignDate: i.staffSignDate,
        StaffSignTime: i.staffSignTime,
        staffSignature: i.staffSignature,
      })),
    signers: signers?.map((signer) => ({
      signerId: signer.value,
      name: signer.label,
      signature: "",
      dateSigned: "",
      signedTime: "",
    })),
    signatures,
  };

  const transaction_adder = () => {
    if (!arrObj?.staffSignature) {
      setIsEmpty(true);
      return;
    }
    setIsEmpty(false);
    setArr((prev) => [arrObj, ...prev]);
    setTimeout(() => {
      setTransDate("");
      setDeposti("");
      setMoneySpent("");
      setOverAllBalance(balance);
      setDescription("");
      setOpen(false);
      setStaffSignature("");
      setStaffSignDate("");
      setStaffSignTime("");
    }, 100);
  };

  const transaction_remover = (index) => {
    const trans = arr.filter((_, i) => i !== index);
    setArr(trans);
    setBalance(trans?.[0]?.balance || 0);
    setOverAllBalance(trans?.[0]?.balance || 0);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await createForRole(
      profileUser?.userType === ROLES.ADMIN,
      "admin/create-financial-transection-record",
      "employee/createFinancialTransactionsRecord",
      payload,
      {
        setLoading,
        navigate,
        successMsg: "Financial transactions record created",
      },
    );
    setArr([]);
    setDOB("");
    setAdminDate("");
  };

  useEffect(() => {
    if (patientDetail) {
      setDOB(patientDetail?.dateOfBirth);
      setAdminDate(patientDetail?.admitDate);
      setAhcccsId(patientDetail?.ahcccsId);
      setDiagnosis(patientDetail?.diagnosis);
    }
  }, [patientDetail]);

  useEffect(() => {
    setBalance(overAllBalance + +deposit - moneySpent);
  }, [deposit, moneySpent, overAllBalance]);
  const canDelete = deletePermission(profile, "ft");
  return (
    <>
      {typedGuardDialog}
      <AddSignatureForTable
        show={open}
        setValue={setStaffSignature}
        setDate={setStaffSignDate}
        setTime={setStaffSignTime}
        setShow={setOpen}
      />

      <NavWrapper title={"Financial Transactions Record"} isArrow={true} />

      <Container>
        <Form onSubmit={submitHandler}>
          <Row className="mb-2">
            <Col xs={12}>
              <PatientComponent
                MainPatientId={setPatientId}
                MainResidentName={setResidentName}
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
                    type="text"
                    disabled
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">DOB</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(dateOfBirth)}
                    disabled
                    onChange={(selectedDate) =>
                      setDOB(selectedDate?.toDateString())
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

              <Col xs={12} md={4} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Admit Date</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(admitDate)}
                    disabled
                    onChange={(selectedDate) =>
                      setAdminDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          admitDate
                            ? formatDateToMMDDYYYY(admitDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Diagnosis (specify if new or continuing)
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setDiagnosis(e.target.value)}
                    value={diagnosis}
                    type="text"
                    disabled
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Form.Label className="fw-bold">Financial Transitions</Form.Label>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={3} lg={3}>
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
              <Col xs={12} md={4} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Deposit</Form.Label>
                  <Form.Control
                    onChange={(e) => setDeposti(e.target.value)}
                    value={deposit}
                    type="number"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Money Spent</Form.Label>
                  <Form.Control
                    onChange={(e) => setMoneySpent(e.target.value)}
                    value={moneySpent}
                    type="number"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Balance</Form.Label>
                  <Form.Control
                    onChange={(e) => setBalance(e.target.value)}
                    value={balance}
                    type="number"
                    disabled={true}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Description of items spent
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    as="textarea"
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} className="flex gap-1 items-center">
                <Button
                  type="button"
                  className="theme-button"
                  onClick={() => setOpen(true)}
                >
                  SAVED AND SIGNED
                </Button>
                <div className="text-red-600 text-[12px]">
                  *
                  {isEmpty && !arrObj?.staffSignature && (
                    <span>This field is required</span>
                  )}
                </div>
              </Col>
              <Col xs={6} md={6}>
                {signatureFormat({
                  sign: staffSignature,
                  date: staffSignDate,
                  time: staffSignTime,
                  hoursFormat,
                })}
              </Col>
            </Row>
          </Card>
          <Row className="my-3 text-center">
            <Col xs={12}>
              <Button
                type="button"
                className="theme-button hidePrint"
                onClick={() => transaction_adder()}
              >
                Add More
              </Button>
            </Col>
          </Row>

          {arr?.length > 0 && (
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Deposit</th>
                  <th>Money Spent</th>
                  <th>Balance </th>
                  <th>Description of items spent </th>
                  <th>Staff Signature </th>
                  {canDelete && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {arr
                  ?.slice()
                  ?.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                  )
                  ?.map((i, index) => (
                    <tr key={index}>
                      <td className={`${i?.date ? "" : "text-center"}`}>
                        {(i?.date && formatDateToMMDDYYYY(i?.date)) || (
                          <DashComponent />
                        )}
                      </td>
                      <td>
                        {" "}
                        {i?.deposit || i?.deposit === 0 ? i?.deposit : "0"}{" "}
                      </td>
                      <td>
                        {" "}
                        {i?.moneySpent || i?.moneySpent === 0
                          ? i?.moneySpent
                          : "0"}{" "}
                      </td>
                      <td> {i?.balance} </td>
                      <td className={`${i?.description ? "" : "text-center"}`}>
                        {" "}
                        {i?.description || <DashComponent />}{" "}
                      </td>
                      <td
                        className={`${i?.staffSignature ? "" : "text-center"}`}
                      >
                        {i?.staffSignature ? (
                          signatureFormat({
                            sign: i?.staffSignature,
                            date: i?.staffSignDate,
                            hoursFormat,
                          })
                        ) : (
                          <DashComponent />
                        )}
                      </td>
                      {canDelete && (
                        <td>
                          <div className="icon-joiner">
                            <a href="javascript:;" className="del-btn">
                              {" "}
                              <i
                                className="fa-solid fa-trash"
                                onClick={() => transaction_remover(index)}
                              />{" "}
                            </a>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}

          <div className="signature-sections-inline mt-3">
            <SignatureNamesPanel
              signatures={signatures}
              onUpdate={updateSignature}
              formHasTyped={false}
              onClearAllTyped={clearAllTyped}
            />
            <SignatureSection
              role="resident"
              label="Resident/Representative Signature"
              variant="blue"
              signature={signatures?.resident}
              onUpdate={updateSignature}
              signerNameOverride={
                residentName
                  ? residentName
                  : patientDetail?.firstName
                    ? `${patientDetail?.firstName} ${patientDetail?.lastName}`
                    : ""
              }
              formHasTyped={false}
              onClearAllTyped={clearAllTyped}
            />
            <SignatureSection
              role="witness"
              label="Witness Signature"
              variant="yellow"
              signature={signatures?.witness}
              onUpdate={updateSignature}
              externalName
              formHasTyped={false}
              onClearAllTyped={clearAllTyped}
            />
          </div>

          <Row className="mt-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="fw-bold">Signers</Form.Label>
                <MultiEmployee setValue={setSigners} value={signers} />
              </Form.Group>
            </Col>
          </Row>
          <div className="employee-btn-joiner mt-5">
            <button
              className="employee_create_btn"
              type="submit"
              disabled={witnessIncomplete}
            >
              {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
            </button>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default HOC({ Wcomponenet: CreateRecord });
