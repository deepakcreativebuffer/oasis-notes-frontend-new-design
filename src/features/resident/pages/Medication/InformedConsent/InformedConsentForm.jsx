/* eslint-disable no-unused-vars, eqeqeq */
/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
} from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { medicationService } from "@/features/shared/services";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import {
  AddSignature,
  AddSignatureForTable,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteModal from "@/features/shared/ui/Mod/DeleteModal/DeleteModal";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import {
  applyResidentHeaderFields,
  hasPatientRecord,
} from "@/utils/patientPopulate";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
const InformedConsentForm = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const url = useLocation().pathname;
  const [patientId, setPatientId] = useState("");
  const [admitDate, setAdminDate] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [open, setOpen] = useState(false);
  const [medicationInstructions, setMedicationInstructions] = useState("");
  const [medicationStartDate, setMedicationStartDate] = useState("");
  const [fewDaysOnly, setFewDaysOnly] = useState(0);
  const [dischargeDate, setDischargeDate] = useState("");
  const [residentGuardianInitial, setResidentGuardianInitial] = useState("");
  const [staffInitial, setStaffInitial] = useState("");
  const [initial, setInitital] = useState("");
  const [title, setTitle] = useState("");
  const [signature, setSignature] = useState("");
  const [residentGuardianSignature, setResidentGuradianSignature] =
    useState("");
  const [open1, setOpen1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [multipleTable, setMultipleTable] = useState([]);
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [details, setDetails] = useState({});
  const [staffSignedDate, setStaffSignedDate] = useState("");
  const [staffSignedTime, setStaffSignedTime] = useState("");
  const [fiduciarySignedDate, setFiduciarySignedDate] = useState("");
  const [fiduciarySignedTime, setFiduciarySignedTime] = useState("");
  const [openSigner, setOpenSigner] = useState(false);
  const [signers, setSigners] = useState([]);
  const [residentName, setResidentName] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [patientName, setPatientName] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [tablePayload, setTablePayload] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [rowData, setRowData] = useState({});
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

  const hasTypedInForm = !!signature; // the table signature, or we can just pass false if we don't want to clear it. We'll leave it as false so it doesn't clear the table's signature.
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

  const clearAllTyped = () => {};

  const fetchHandler = useCallback(() => {
    medicationService.informedConsent.getById(id, {
      page,
      limit,
      setResponse: setDetails,
      setLoading,
    });
  }, [id, limit, page]);
  useEffect(() => {
    if (!isEdit) return;
    fetchHandler();
    if (details?.data?.tableData?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [details?.data?.tableData?.docs?.length, fetchHandler, page, isEdit]);
  useEffect(() => {
    if (details) {
      const item = details?.data;
      if (item) {
        setPatientId(item?.patientId);
        setAdminDate(item?.patientId?.admitDate);
        setAhcccsId(item?.patientId?.ahcccsId);
        setResidentGuradianSignature(item?.residentGuardianSignature);
        setInitital(item?.staff?.[item.length - 1]?.initial);
        setSignature(item?.staff?.[item.length - 1]?.signature);
        setStaffSignedDate(item?.staff?.[item.length - 1]?.signatureDate);
        setStaffSignedTime(item?.staff?.[item.length - 1]?.signatureTime);
        setFiduciarySignedDate(item?.residentGuardianSignatureDate);
        setFiduciarySignedTime(item?.fiduciarySignedTime);
        setSigners(item?.signers || []);
        setTitle(item?.staff?.[item.length - 1]?.title);
        if (item?.tableDate?.docs?.length > 0) {
          setMultipleTable(item?.tableDate?.docs);
        } else {
          setMultipleTable([]);
        }
        if (item?.signatures) {
          loadSignaturesFromApi(item.signatures);
        }
      }
    }
  }, [details, url, loadSignaturesFromApi]);
  useEffect(() => {
    if (!isEdit || !details?.data) return;
    if (details?.data) {
      const {
        saveAsDraft: apiSaveAsDraft,
        residentGuardianSignatureSaveAsDraft,
        signers,
      } = details.data;
      const saveAsDraft =
        apiSaveAsDraft || residentGuardianSignatureSaveAsDraft;
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
          ).includes("icm") &&
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
          ).includes("icm") &&
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
          ).includes("icm") &&
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    details?.data,
    profileInfo,
    profileInfo?._id,
    profileInfo?.accountType,
    profileInfo?.userPermissions?.edit,
    profileInfo?.userType,
  ]);
  const table = {
    createdAt: new Date(),
    medicationInstructions,
    medicationStartDate,
    fewDaysOnly,
    dischargeDate,
    residentGuardianInitial,
    staffInitial,
    signature,
    staffSignedDate,
    staffSignedTime,
  };
  const addTable = () => {
    if (!signature) {
      setIsEmpty(true);
      return;
    }
    if (isEdit) {
      setTablePayload((prev) => [table, ...prev]);
    }
    setMultipleTable((prev) => [table, ...prev]);
    setMedicationInstructions("");
    setMedicationStartDate("");
    setFewDaysOnly("");
    setDischargeDate("");
    setResidentGuardianInitial("");
    setSignature("");
    setStaffSignedDate("");
    setStaffSignedTime("");
    setOpen(false);
    setIsEmpty(false);
  };
  const removeRow = () => {
    setModalShow(true);
  };

  useEffect(() => {
    if (isEdit || !hasPatientRecord(patientDetail)) return;
    applyResidentHeaderFields(patientDetail, {
      setAdmitDate: setAdminDate,
      setAhcccsId,
    });
    setPatientName(`${patientDetail?.firstName} ${patientDetail?.lastName}`);
  }, [patientDetail, isEdit]);
  const submitHandler = (e, isDraft = false) => {
    e.preventDefault();
    const tableSource = isEdit ? tablePayload : multipleTable;
    const payload = {
      patientId,
      admitDate,
      tableDate: tableSource?.map((i) => ({
        createdAt: i.createdAt,
        medicationInstructions: i.medicationInstructions,
        medicationStartDate: i.medicationStartDate,
        fewDaysOnly: i.fewDaysOnly,
        dischargeDate: i.dischargeDate,
        residentGuardianInitial: i.residentGuardianInitial,
        staffInitial: i.staffInitial,
        signature: i.signature,
        staffSignedDate: i.staffSignedDate,
        staffSignedTime: i.staffSignedTime,
      })),
      staff: [
        {
          initial,
          title,
          signature,
          signatureDate: staffSignedDate,
          signatureTime: staffSignedTime,
        },
      ],
      residentGuardianSignature,
      residentGuardianSignatureDate: fiduciarySignedDate,
      residentGuardianSignatureTime: fiduciarySignedTime,
      residentGuardianSignatureSaveAsDraft: isDraft,
      saveAsDraft: isDraft,
      signatures,
      signers: isEdit
        ? signers
        : signers?.map((signer) => ({
            signerId: signer.value,
            name: signer.label,
            signature: "",
            dateSigned: "",
            signedTime: "",
          })),
    };
    if (isEdit) {
      medicationService.informedConsent.update(id, payload, {
        setLoading,
        navigate,
      });
    } else {
      medicationService.createInformedConsent(payload, {
        isAdmin: profileInfo?.userType === ROLES.ADMIN,
        setLoading,
        navigate,
      });
    }
  };
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
  const canDelete =
    profileInfo.userType === "Admin" ||
    (profileInfo?.accountType === ACCOUNT_TYPES.ADMINISTRATOR &&
      profileInfo?.userType === ROLES.EMPLOYEE);
  return (
    <>
      {typedGuardDialog}
      <AddSignatureForTable
        show={open}
        setValue={setSignature}
        setDate={setStaffSignedDate}
        setTime={setStaffSignedTime}
        setShow={setOpen}
      />

      <AddSignature
        show={openSigner}
        setValue={setSignerSignature}
        setDate={setSignerDate}
        setTime={setSignerTime}
      />
      <DeleteModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        url={"informed-consent-for-medication"}
        id={id}
        row={rowData}
        fetchHandler={fetchHandler}
        tablepayload={setTablePayload}
        responsetable={setMultipleTable}
      />
      <NavWrapper isArrow={true} title={"Informed Consent for Medications"} />
      <Container>
        <Form
          className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
          <Row className="mb-2">
            <Col>
              {!isEdit ? (
                <PatientComponent
                  MainPatientId={setPatientId}
                  setWholeData={setPatientDetail}
                  MainResidentName={setResidentName}
                />
              ) : (
                <Form.Label className="fw-bold">
                  Name:{" "}
                  {residentName
                    ? residentName
                    : details?.data?.patientId?.firstName
                      ? `${details?.data?.patientId?.firstName} ${details?.data?.patientId?.lastName}`
                      : ""}{" "}
                </Form.Label>
              )}
            </Col>
          </Row>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Admin Date</Form.Label>

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
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none form-control"
                        : " form-control"
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
                  <Form.Control
                    onChange={(e) => setAhcccsId(e.target.value)}
                    type={"text"}
                    value={ahcccsId}
                    disabled
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Medication</Form.Label>
                  <Form.Control
                    onChange={(e) => setMedicationInstructions(e.target.value)}
                    placeholder=""
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    type={"text"}
                    value={medicationInstructions}
                    disabled={url === "/create-informed-consent-resident"}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">
                    Medication Start Date
                  </Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(medicationStartDate)}
                    disabled={url === "/create-informed-consent-resident"}
                    onChange={(selectedDate) =>
                      setMedicationStartDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          medicationStartDate
                            ? formatDateToMMDDYYYY(medicationStartDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none form-control"
                        : "form-control"
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Few Days Only</Form.Label>
                  <Form.Control
                    onChange={(e) => setFewDaysOnly(e.target.value)}
                    placeholder=""
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    type={"text"}
                    value={fewDaysOnly}
                    disabled={url === "/create-informed-consent-resident"}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">D/C Date</Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(dischargeDate)}
                    disabled={url === "/create-informed-consent-resident"}
                    onChange={(selectedDate) =>
                      setDischargeDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          dischargeDate
                            ? formatDateToMMDDYYYY(dischargeDate)
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
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Instruction</Form.Label>
                  <Form.Control
                    onChange={(e) => setResidentGuardianInitial(e.target.value)}
                    placeholder=""
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    type={"text"}
                    value={residentGuardianInitial}
                    disabled={url === "/create-informed-consent-resident"}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {profileInfo?.userType !== ROLES.PATIENT && (
              <Row>
                <Col xs={12} md={12} lg={6} className="flex gap-1 items-center">
                  <Button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="theme-button"
                  >
                    {" "}
                    SAVED AND SIGNED
                  </Button>
                  <div className="text-red-600 text-[12px]">
                    *
                    {isEmpty && !signature && (
                      <span>This field is required</span>
                    )}
                  </div>
                </Col>
                <Col xs={12} md={12} lg={6}>
                  <div>
                    {signatureFormat({
                      sign: signature,
                      date: staffSignedDate,
                      time: staffSignedTime,
                      hoursFormat,
                    })}
                  </div>
                </Col>
              </Row>
            )}
          </Card>

          <Row className="mb-3 text-center">
            <Col xs={12}>
              <Button
                className="theme-button"
                onClick={() => addTable()}
                type="button"
                disabled={
                  profileInfo?.userType === ROLES.PATIENT ||
                  profileInfo?.userType === ROLES.GUARDIAN
                }
              >
                Add More
              </Button>
            </Col>
          </Row>
          {multipleTable?.length > 0 && (
            <Row className="mb-3">
              <Col xs={12}>
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>Medication</th>
                      <th>Medication Start Date</th>
                      <th>Few Days Only</th>
                      <th>D/C Date</th>
                      <th>Instruction</th>
                      <th>Signature</th>
                      {canDelete && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {multipleTable
                      ?.slice()
                      ?.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                      )
                      ?.map((i, index) => (
                        <tr key={index}>
                          <td
                            className={`${i.medicationInstructions ? "" : "text-center"}`}
                          >
                            {" "}
                            {i.medicationInstructions || <DashComponent />}{" "}
                          </td>
                          <td
                            className={`${i.medicationStartDate ? "" : "text-center"}`}
                          >
                            {" "}
                            {formatDateToMMDDYYYY(i.medicationStartDate) || (
                              <DashComponent />
                            )}{" "}
                          </td>
                          <td
                            className={`${i.fewDaysOnly || i?.fewDaysOnly == 0 ? "" : "text-center"}`}
                          >
                            {" "}
                            {i.fewDaysOnly || i.fewDaysOnly == 0 ? (
                              i.fewDaysOnly
                            ) : (
                              <DashComponent />
                            )}{" "}
                          </td>
                          <td
                            className={`${i.dischargeDate ? "" : "text-center"}`}
                          >
                            {" "}
                            {formatDateToMMDDYYYY(i.dischargeDate) || (
                              <DashComponent />
                            )}{" "}
                          </td>
                          <td
                            className={`${i.residentGuardianInitial ? "" : "text-center"}`}
                          >
                            {" "}
                            {i.residentGuardianInitial || (
                              <DashComponent />
                            )}{" "}
                          </td>
                          <td className={`${i.signature ? "" : "text-center"}`}>
                            {" "}
                            {i?.signature ? (
                              signatureFormat({
                                sign: i?.signature,
                                date: i?.staffSignedDate,
                                hoursFormat,
                              })
                            ) : (
                              <DashComponent />
                            )}
                          </td>
                          {canDelete && (
                            <td>
                              <div className="icon-joiner">
                                <Link
                                  className={
                                    profileInfo?.userType === ROLES.PATIENT ||
                                    profileInfo?.userType === ROLES.GUARDIAN
                                      ? "del-btn pe-none "
                                      : "del-btn"
                                  }
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeRow();
                                    setRowData(i);
                                  }}
                                >
                                  {" "}
                                  <i className="fa-solid fa-trash" />{" "}
                                </Link>
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
          {details.data?.tableDate?.docs?.length > 0 && (
            <PaginationsPage
              page={page}
              setPage={setPage}
              totalPages={
                details?.data?.tableDate?.totalPages &&
                details?.data?.tableDate?.totalPages
              }
              limit={limit}
              setLimit={setLimit}
            />
          )}

          <Card body className="mb-3">
            <Row className="mb-3">
              <Col xs={12}>
                <Form.Label className="fw-bold">
                  I,{" "}
                  {
                    <span>
                      {residentName
                        ? residentName
                        : details?.data?.patientId?.firstName
                          ? `${details?.data?.patientId?.firstName} ${details?.data?.patientId?.lastName}`
                          : ""}
                    </span>
                  }
                  , have received instruction in the use of the above listed
                  medication(s) including the medication anticipated results,
                  and potential side effect that maybe result from not taking
                  the medication.
                </Form.Label>
              </Col>
            </Row>
          </Card>

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
                  : details?.data?.patientId?.firstName
                    ? `${details?.data?.patientId?.firstName} ${details?.data?.patientId?.lastName}`
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

          <Row className="mt-4">
            {(signers?.[signerIndex]?.signerId === profileInfo._id ||
              profileInfo?.patientsAssigned?.includes(
                signers?.[signerIndex]?.signerId,
              )) && (
              <Col xs={12} md={12} lg={6}>
                <Button
                  type="button"
                  onClick={() => setOpenSigner(true)}
                  className={`theme-button ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                >
                  SAVED AND SIGNED
                </Button>
              </Col>
            )}
            <Col
              xs={12}
              md={12}
              lg={
                signers?.[signerIndex]?.signerId === profileInfo._id ||
                profileInfo?.patientsAssigned?.includes(
                  signers?.[signerIndex]?.signerId,
                )
                  ? 6
                  : 12
              }
            >
              {signers?.map(
                (signer) =>
                  signer.signature && (
                    <div key={signer.signerId}>
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

          {!isEdit && (
            <>
              <Row className="mb-3">
                <Col xs={12} md={12} lg={12}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Signers</Form.Label>
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
                  <div className="employee-btn-joiner mt-3 mt-md-4">
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
                      disabled={witnessIncomplete}
                      onClick={(e) => submitHandler(e, false)}
                    >
                      {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                    </button>
                  </div>
                </Col>
              </Row>
            </>
          )}
          {isEdit && (
            <Row>
              <Col xs={12} md={12} lg={12}>
                <div className="employee-btn-joiner mt-3 mt-md-4">
                  {(details?.data?.saveAsDraft ||
                    details?.data?.residentGuardianSignatureSaveAsDraft) && (
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
                    onClick={(e) => submitHandler(e, false)}
                    type="button"
                    disabled={
                      signers?.[signerIndex]?.signature?.length === 0 ||
                      witnessIncomplete
                    }
                  >
                    {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                  </button>
                </div>
              </Col>
            </Row>
          )}
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: InformedConsentForm,
});
