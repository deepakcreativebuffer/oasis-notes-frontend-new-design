/** @format */

import React, { useCallback, useEffect, useState } from "react";
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
import { patientChartService } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddSignature,
  AddSignatureForTable,
  deletePermission,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteModal from "@/features/shared/ui/Mod/DeleteModal/DeleteModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
const EditFinancialRecord = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const { id } = useParams();
  const navigate = useNavigate();
  const [saveAsDraft, setSaveAsDraft] = useState();
  const [patientId, setPatientId] = useState("");
  const [dateOfBirth, setDOB] = useState("");
  const [admitDate, setAdminDate] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [date, setDate] = useState(new Date());
  const [deposit, setDeposti] = useState("");
  const [moneySpent, setMoneySpent] = useState("");
  const [balance, setBalance] = useState("");
  const [description, setDescription] = useState("");
  const [arr, setArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSigner, setOpenSigner] = useState(false);
  const [staffSignature, setStaffSignature] = useState("");
  const [staffSignDate, setStaffSignDate] = useState("");
  const [staffSignTime, setStaffSignTime] = useState("");
  const [details, setDetails] = useState({});
  const [signers, setSigners] = useState([]);
  const [overAllBalance, setOverAllBalance] = useState(0);
  const [openStaff, setOpenStaff] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [saveAsDrafIsNotEditable, setSaveAsDrafIsNotEditable] = useState(false);
  const [
    saveAsDrafIsNotEditableWithoutSigner,
    setSaveAsDrafIsNotEditableWithoutSigner,
  ] = useState(false);
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [tablePayload, setTablePayload] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [rowData, setRowData] = useState({});

  const {
    signatures,
    updateSignature,
    loadFromApi: loadSignaturesFromApi,
  } = useSignatures();
  const { dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });

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
    dateOfBirth,
    admitDate,
    saveAsDraft,
    balance: overAllBalance,
    transactions: (tablePayload || [])
      .sort(
        (a, b) =>
          new Date(b.staffSignDate).getTime() -
          new Date(a.staffSignDate).getTime(),
      )
      .map((i) => {
        return {
          createdAt: i.createdAt,
          date: i.date,
          deposit: i.deposit,
          moneySpent: i.moneySpent,
          balance: i.balance,
          description: i.description,
          StaffSignDate: i.staffSignDate,
          StaffSignTime: i.staffSignTime,
          staffSignature: i.staffSignature,
        };
      }),
    signatures,
    signers,
  };
  const transaction_adder = () => {
    if (!arrObj?.staffSignature) {
      setIsEmpty(true);
      return;
    }
    setIsEmpty(false);
    setTablePayload((prev) => [arrObj, ...prev]);
    setArr((prev) => [arrObj, ...prev]);
    setDeposti("");
    setMoneySpent("");
    setDescription("");
    setOverAllBalance(balance);
    setOpenStaff(false);
    setStaffSignature("");
    setStaffSignDate("");
    setStaffSignTime("");
  };
  const removeRow = () => {
    setModalShow(true);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    patientChartService.financialRecord.update(id, payload, {
      setLoading,
      navigate,
    });
  };
  const fetchHandler = useCallback(() => {
    patientChartService.financialRecord.listWithTransactions({
      id,
      page,
      limit,
      setResponse: setDetails,
      setLoading,
    });
  }, [id, limit, page]);
  useEffect(() => {
    fetchHandler();
    if (details?.data?.transactions?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [details?.data?.transactions?.docs?.length, fetchHandler, page]);
  useEffect(() => {
    setBalance(overAllBalance + +deposit - moneySpent);
  }, [deposit, moneySpent, overAllBalance]);
  useEffect(() => {
    if (details?.data && !Array.isArray(details.data)) {
      const item = details.data;
      setPatientId(item?.patientId?._id);
      setAdminDate(item?.patientId?.admitDate);
      setAhcccsId(item?.patientId?.ahcccsId);
      setDiagnosis(item?.patientId?.diagnosis);
      setDOB(item?.patientId?.dateOfBirth);
      setOverAllBalance(item?.balance);
      setBalance(item?.balance);
      if (item) setSigners(item?.signers);
      if (item?.transactions?.docs?.length > 0) {
        const newTransactions = item.transactions.docs.map((i) => ({
          date: formatDateToMMDDYYYY(i.date),
          deposit: i.deposit,
          moneySpent: i.moneySpent,
          balance: i.balance,
          description: i.description,
          staffSignature: i.staffSignature,
          staffSignDate: i.StaffSignDate,
          staffSignTime: i.StaffSignTime,
        }));

        // Deduplicate within newTransactions only
        const seen = new Set();
        const unique = [];
        for (const entry of newTransactions) {
          const key = `${entry.date}-${entry.description}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(entry);
          }
        }

        // Replace instead of appending
        setArr(unique);
      } else {
        setArr([]);
      }
      if (item?.signatures) {
        loadSignaturesFromApi(item.signatures);
      }
    }
  }, [details, loadSignaturesFromApi]);
  useEffect(() => {
    if (!details?.data) return;
    if (details?.data) {
      const { saveAsDraft, signers } = details.data;
      const { _id, userType, accountType, userPermissions } = profileInfo;
      const isSigner = signers?.findIndex?.(
        (signer, i) => signer.signerId === _id,
      );
      const isEmployeeRegular =
        userType === ROLES.EMPLOYEE && accountType === ACCOUNT_TYPES.REGULAR;
      const isEmployeeRestricted =
        userType === ROLES.EMPLOYEE && accountType === ACCOUNT_TYPES.RESTRICTED;
      const cannotEditDocument = !userPermissions?.edit
        ?.split(":")
        .includes("ft");
      const isSignerFound = isSigner !== -1;
      const isSignerNotFound = isSigner === -1;

      const isRegularSignerWithoutEdit =
        isEmployeeRegular && cannotEditDocument && isSignerFound;
      const isRestrictedSigner = isEmployeeRestricted && isSignerFound;
      const isNotEditableSigner =
        isRegularSignerWithoutEdit || isRestrictedSigner;

      const isRegularNonSignerWithoutEdit =
        isEmployeeRegular && cannotEditDocument && isSignerNotFound;
      const isRestrictedNonSigner = isEmployeeRestricted && isSignerNotFound;

      const isSaveAsDraftWithSigner = saveAsDraft && isNotEditableSigner;
      setSaveAsDrafIsNotEditable(isSaveAsDraftWithSigner);

      const isSaveAsDraftWithoutSigner =
        saveAsDraft && (isRegularNonSignerWithoutEdit || isRestrictedNonSigner);
      setSaveAsDrafIsNotEditableWithoutSigner(isSaveAsDraftWithoutSigner);

      setIsNotEditableWithSigner(isNotEditableSigner);
    }
  }, [
    details?.data,
    profileInfo,
    profileInfo?._id,
    profileInfo?.accountType,
    profileInfo?.userPermissions?.edit,
    profileInfo?.userType,
  ]);
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
  const canDelete = deletePermission(profileInfo, "ft");
  return (
    <>
      {typedGuardDialog}
      <AddSignature
        show={openSigner}
        setValue={(sign) => {
          setSignerSignature(sign);
        }}
        setDate={(date) => {
          setSignerDate(date);
        }}
        setTime={(time) => {
          setSignerTime(time);
        }}
      />

      <AddSignatureForTable
        show={openStaff}
        setValue={(sign) => {
          setStaffSignature(sign);
        }}
        setDate={(date) => {
          setStaffSignDate(date);
        }}
        setTime={(time) => {
          setStaffSignTime(time);
        }}
        setShow={setOpenStaff}
      />
      <DeleteModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        url={"financial-transactions-record"}
        id={id}
        row={rowData}
        fetchHandler={fetchHandler}
        tablepayload={setTablePayload}
        responsetable={setArr}
        setBalance={setBalance}
        arr={arr}
        setOverAllBalance={setOverAllBalance}
      />

      <NavWrapper title={"Financial Transactions Record"} isArrow={true} />

      <Container>
        <Form onSubmit={submitHandler}>
          <Row>
            <Col xs={12}>
              <label className="fw-bold mb-2">
                Resident:{" "}
                {details?.data?.patientId &&
                  fetchPaitentName(details?.data?.patientId)}{" "}
              </label>
            </Col>
          </Row>
          <Card
            body
            className={`mb-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
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
          <Card
            body
            className={`mb-3 d-flex flex-column ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
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
              <Col xs={12} md={3} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Deposit</Form.Label>
                  <Form.Control
                    onChange={(e) => setDeposti(e.target.value)}
                    value={deposit}
                    type="number"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={3} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Money Spent</Form.Label>
                  <Form.Control
                    onChange={(e) => setMoneySpent(e.target.value)}
                    value={moneySpent}
                    type="number"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={3} lg={3}>
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
              <Col xs={12} md={12}>
                <Form.Label className="fw-bold">Employee Signature</Form.Label>
              </Col>
              <Col xs={12} md={6} className="flex gap-1 items-center">
                <Button
                  type="button"
                  className="theme-button"
                  onClick={() => setOpenStaff(true)}
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
              <Col xs={12} md={6}>
                {signatureFormat({
                  sign: staffSignature,
                  date: staffSignDate,
                  time: staffSignTime,
                  hoursFormat,
                })}
              </Col>
            </Row>
          </Card>
          <Row
            className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Col xs={12} className="d-flex justify-content-center mb-2">
              <Button
                type="button"
                className="theme-button hidePrint "
                onClick={() => transaction_adder()}
              >
                Add More
              </Button>
            </Col>
          </Row>
          {arr?.length > 0 && (
            <Row
              className={`mt-2 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
            >
              <Col xs={12}>
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
                            {i?.deposit || i?.deposit === 0 ? i?.deposit : "0"}
                          </td>
                          <td>
                            {" "}
                            {i?.moneySpent || i?.moneySpent === 0
                              ? i?.moneySpent
                              : "0"}
                          </td>
                          <td> {i?.balance} </td>
                          <td
                            className={`${i?.description ? "" : "text-center"}`}
                          >
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
                                <button className="del-btn">
                                  <i
                                    className="fa-solid fa-trash"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      removeRow();
                                      setRowData(i);
                                    }}
                                  />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}
          {details.data?.transactions?.docs?.length > 0 && (
            <PaginationsPage
              page={page}
              setPage={setPage}
              totalPages={
                details?.data?.transactions?.totalPages &&
                details?.data?.transactions?.totalPages
              }
              limit={limit}
              setLimit={setLimit}
            />
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
                details?.data?.patientId
                  ? fetchPaitentName(details?.data?.patientId)
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

          <Row
            className={`mt-3 ${saveAsDrafIsNotEditableWithoutSigner && "pe-none"}`}
          >
            {signers?.[signerIndex]?.signerId === profileInfo._id && (
              <>
                <Col xs={12} md={12}>
                  <Form.Label className="fw-bold">Signer Signature</Form.Label>
                </Col>
                <Col xs={12} md={6}>
                  <Button
                    type="button"
                    className="theme-button"
                    onClick={() => setOpenSigner(true)}
                  >
                    SAVED AND SIGNED
                  </Button>
                </Col>
              </>
            )}
            <Col
              xs={12}
              md={signers?.[signerIndex]?.signerId === profileInfo._id ? 6 : 12}
            >
              {signers?.map(
                (signer) =>
                  signer.signature && (
                    <div className="text-right" key={signer?.signerId}>
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

          <div className="employee-btn-joiner mt-2">
            {details?.data?.saveAsDraft && (
              <button
                className={`draft ${saveAsDrafIsNotEditableWithoutSigner && "pe-none"}`}
                type="submit"
                onClick={() => setSaveAsDraft(true)}
              >
                Save as Draft
              </button>
            )}
            <button
              className="employee_create_btn"
              disabled={
                signers?.[signerIndex]?.signature?.length === 0 ||
                witnessIncomplete
              }
            >
              {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
            </button>
          </div>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: EditFinancialRecord,
});
