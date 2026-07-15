/* eslint-disable no-unused-vars */
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
import { medicationService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import { Link } from "react-router-dom";
import {
  AddSignature,
  AddSignatureForTable,
  convertTimeFormat,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  otherHandler,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import PrnModel from "./PrnModel";
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
const PrnLogForm = () => {
  const navigate = useNavigate();
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const url = useLocation().pathname;
  const [patientId, setPatientId] = useState("");
  const [medicationAndStrength, setMedicationAndStrength] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prescriberName, setPrescriberName] = useState("");
  const [site, setSite] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tabsGiven, setTabsGiven] = useState("");
  const [intensity, setIntensity] = useState("");
  const [reason, setReason] = useState("");
  const [staffNameAndSignature, setStaffNameAndSignature] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [open, setOpen] = useState(false);
  const [multipleTable, setMultipleTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [signatureTime, setSignatureTime] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [admitDate, setAdmitDate] = useState("");
  const [signers, setSigners] = useState([]);
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [details, setDetails] = useState({});
  const [patientDetail, setPatientDetail] = useState({});
  const [residentName, setResidentName] = useState("");
  const [openSigner, setOpenSigner] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [tableRow, setTableRow] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [tablePayload, setTablePayload] = useState([]);
  const [modalDeleteShow, setModalDeleteShow] = useState(false);
  const [rowData, setRowData] = useState({});
  const isAdminOrAdministrator =
    profileInfo?.userType === ROLES.ADMIN ||
    (profileInfo?.userType === ROLES.EMPLOYEE &&
      profileInfo?.accountType === ACCOUNT_TYPES.ADMINISTRATOR);
  const [saveAsDrafIsNotEditable, setSaveAsDrafIsNotEditable] = useState(false);
  const [
    saveAsDrafIsNotEditableWithoutSigner,
    setSaveAsDrafIsNotEditableWithoutSigner,
  ] = useState(false);
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);
  const table = {
    createdAt: new Date(),
    date,
    time,
    tabsGiven,
    reason,
    staffNameAndSignature,
    signatureDate,
    intensity,
  };
  const addTable = () => {
    if (!staffNameAndSignature) {
      setIsEmpty(true);
      return;
    }
    setMultipleTable((prev) => [
      {
        ...table,
      },
      ...prev,
    ]);
    setReason("");
    setTabsGiven("");
    setTime("");
    setDate("");
    setStaffNameAndSignature("");
    setSignatureDate("");
    setIntensity("");
    setOpen(false);
    setIsEmpty(false);
  };
  const fetchHandler = useCallback(() => {
    medicationService.prnLog.getById(id, {
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
        setPatientId(item?.patientId?._id);
        setMedicationAndStrength(item?.medicationAndStrength);
        setInstructions(item?.instructions);
        setPrescriberName(item?.prescriberName);
        setSite(item?.site);
        setAdmitDate(item?.patientId?.admitDate);
        setDateOfBirth(item?.patientId?.dateOfBirth);
        setAhcccsId(item?.patientId?.ahcccsId);
        if (item?.tableData) {
          setMultipleTable(item?.tableData?.docs);
        }
        setSigners(item?.signers || []);
      }
    }
  }, [details, url]);
  useEffect(() => {
    if (isEdit || !hasPatientRecord(patientDetail)) return;
    applyResidentHeaderFields(patientDetail, {
      setDateOfBirth,
      setAdmitDate,
      setAhcccsId,
    });
  }, [patientDetail, isEdit]);
  useEffect(() => {
    if (!isEdit || !details?.data) return;
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
          ).includes("prn") &&
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
          ).includes("prn") &&
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
          ).includes("prn") &&
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
    isEdit,
  ]);
  const submitHandler = (e, isDraft) => {
    e.preventDefault();
    if (isEdit) {
      const payload = {
        patientId,
        medicationAndStrength,
        instructions,
        prescriberName,
        site,
        dateOfBirth,
        admitDate,
        tableData: multipleTable
          .filter((item) => !item._id)
          ?.map((i) => ({
            createdAt: i.createdAt,
            date: i.date,
            time: i.time,
            tabsGiven: i.tabsGiven,
            reason: i.reason,
            staffNameAndSignature: i.staffNameAndSignature,
            signatureDate: i?.signatureDate,
            intensity: i?.intensity,
            timeReEvaluated: i?.timeReEvaluated,
            resposneCode: i?.resposneCode,
            responseCodeOther: i?.responseCodeOther,
            revaluatedStaffInitials: i?.revaluatedStaffInitials,
            revaluatedStaffSignatureDate: i?.revaluatedStaffSignatureDate,
            isLocked: i?.isLocked,
          })),
        saveAsDraft: isDraft,
        signers,
      };
      medicationService.prnLog.update(id, payload, {
        setLoading,
        navigate,
      });
    } else {
      medicationService.createPrnLog(
        {
          patientId,
          medicationAndStrength,
          instructions,
          prescriberName,
          site,
          dateOfBirth,
          admitDate,
          tableData: multipleTable?.map((i) => ({
            createdAt: i.createdAt,
            date: i.date,
            time: i.time,
            tabsGiven: i.tabsGiven,
            reason: i.reason,
            staffNameAndSignature: i.staffNameAndSignature,
            signatureDate: i?.signatureDate,
            intensity: i?.intensity,
            timeReEvaluated: i?.timeReEvaluated,
            resposneCode: i?.resposneCode,
            responseCodeOther: i?.responseCodeOther,
          })),
          signers: signers?.map((signer) => ({
            signerId: signer.value,
            name: signer.label,
            signature: "",
            dateSigned: "",
            signedTime: "",
          })),
          saveAsDraft: isDraft,
        },
        {
          isAdmin: profileInfo?.userType === ROLES.ADMIN,
          setLoading,
          navigate,
        },
      );
    }
  };
  const removeRow = () => {
    setModalDeleteShow(true);
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
  const handleUpdateRow = (updatedRow) => {
    setMultipleTable((prev) =>
      prev.map((row) =>
        row.createdAt === updatedRow.createdAt ? updatedRow : row,
      ),
    );
  };
  const handleCloseModal = () => {
    setModalShow(false);
  };
  return (
    <>
      <AddSignature
        show={openSigner}
        setValue={(sign) => setSignerSignature(sign)}
        setDate={(date) => setSignerDate(date)}
      />
      <DeleteModal
        show={modalDeleteShow}
        onHide={() => setModalDeleteShow(false)}
        url={"prn-medication-log"}
        id={id}
        row={rowData}
        fetchHandler={fetchHandler}
        tablepayload={setTablePayload}
        responsetable={setMultipleTable}
      />

      {isEdit && (
        <PrnModel
          show={modalShow}
          onHide={handleCloseModal}
          hoursFormat={hoursFormat}
          profileInfo={profileInfo}
          onRefresh={fetchHandler}
          onUpdateRow={handleUpdateRow}
          tableRow={tableRow}
          MedId={id}
        />
      )}
      <AddSignatureForTable
        show={open}
        setValue={(sign) => setStaffNameAndSignature(sign)}
        setDate={(date) => setSignatureDate(date)}
        setShow={setOpen}
      />
      <NavWrapper isArrow={true} title={"PRN"} />
      <Container>
        <Form
          className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
          <Row className="mb-2">
            <Col xs={12} md={12}>
              {isEdit ? (
                <>
                  <Form.Label className="fw-bold">Resident Name:</Form.Label>
                  <Form.Label className="fw-normal">
                    {residentName
                      ? residentName
                      : fetchPaitentName(details?.data?.patientId)}
                  </Form.Label>
                </>
              ) : (
                <PatientComponent
                  MainPatientId={setPatientId}
                  setWholeData={setPatientDetail}
                />
              )}
            </Col>
          </Row>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
                  <Form.Control
                    onChange={(e) => setAhcccsId(e.target.value)}
                    type={"text"}
                    disabled
                    value={ahcccsId}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
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
              <Col xs={12} md={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Admit Date</Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(admitDate)}
                    disabled
                    onChange={(selectedDate) =>
                      setAdmitDate(selectedDate?.toDateString())
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
          </Card>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={4} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Medication and Strength
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setMedicationAndStrength(e.target.value)}
                    placeholder=""
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    type={"text"}
                    value={medicationAndStrength}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Instruction</Form.Label>
                  <Form.Control
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder=""
                    type={"text"}
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    value={instructions}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Prescriber Name</Form.Label>
                  <Form.Control
                    onChange={(e) => setPrescriberName(e.target.value)}
                    placeholder=""
                    type={"text"}
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    value={prescriberName}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Site</Form.Label>
                  <Form.Control
                    onChange={(e) => setSite(e.target.value)}
                    placeholder=""
                    type={"text"}
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    value={site}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Date</Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(date)}
                    disabled={url === "/create-prn-log-resident"}
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
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none form-control"
                        : "form-control"
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Time Initials</Form.Label>

                  <CustomTimePicker
                    use24Hours={hoursFormat === "HH:mm"}
                    value={time ? parseTimeStringToDate(time) : null}
                    onChange={setTime}
                    disabled={
                      url === "/create-prn-log-resident" ||
                      profileInfo?.userType === ROLES.PATIENT
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Quantity</Form.Label>
                  <Form.Control
                    onChange={(e) => setTabsGiven(e.target.value)}
                    type={"text"}
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    value={tabsGiven}
                    disabled={url === "/create-prn-log-resident"}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Specify intensity on 0 - 10 scale if applicable
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      let input = e.target.value;
                      if (/^(10|\d)?$/.test(input)) {
                        setIntensity(input);
                      }
                    }}
                    type={"text"}
                    value={intensity}
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                  ></Form.Control>
                </Form.Group>
              </Col>

              <Col xs={12} md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Reason</Form.Label>
                  <Form.Control
                    onChange={(e) => setReason(e.target.value)}
                    type={"text"}
                    value={reason}
                    className={
                      profileInfo?.userType === ROLES.PATIENT ||
                      profileInfo?.userType === ROLES.GUARDIAN
                        ? "pe-none"
                        : ""
                    }
                    disabled={url === "/create-prn-log-resident"}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={6} className="flex gap-1 items-center">
                <Button
                  type="button"
                  className="theme-button"
                  onClick={() => setOpen(true)}
                >
                  Staff initials
                </Button>
                <div className="text-red-600 text-[12px]">
                  *
                  {isEmpty && !staffNameAndSignature && (
                    <span>This field is required</span>
                  )}
                </div>
              </Col>
              <Col xs={12} md={12} lg={6}>
                {signatureFormat({
                  sign: staffNameAndSignature,
                  date: signatureDate,
                  time: signatureTime,
                  hoursFormat,
                })}
              </Col>
            </Row>
          </Card>
          <Row className="mb-3 text-center">
            <Col xs={12} md={12} lg={12}>
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
              <Col xs={12} md={12} lg={12}>
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time Initials</th>
                      <th>Quantity</th>
                      <th>Reason</th>
                      <th>Specify intensity on 0 - 10 scale if applicable</th>
                      <th>Staff initials</th>
                      <th>Response Code</th>
                      <th>Time Re-evaluated</th>
                      <th>Time Re-evaluated Staff Initials</th>
                      {(isAdminOrAdministrator ||
                        (profileInfo?.userType === ROLES.EMPLOYEE &&
                          profileInfo?.accountType === ACCOUNT_TYPES.REGULAR &&
                          profileInfo.userPermissions?.edit
                            ?.split(":")
                            .includes("prn"))) && <th>Action</th>}
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
                          <td className={`${i.date ? "" : "text-center"}`}>
                            {" "}
                            {(i.date && formatDateToMMDDYYYY(i.date)) || (
                              <DashComponent />
                            )}{" "}
                          </td>
                          <td className={`${i.time ? "" : "text-center"}`}>
                            {" "}
                            {convertTimeFormat(i.time, hoursFormat) || (
                              <DashComponent />
                            )}{" "}
                          </td>
                          <td>
                            {" "}
                            {i.tabsGiven || i.tabsGiven === 0
                              ? i.tabsGiven
                              : "0"}{" "}
                          </td>
                          <td className={`${i.reason ? "" : "text-center"}`}>
                            {" "}
                            {i.reason || <DashComponent />}{" "}
                          </td>
                          <td className={`${i.intensity ? "" : "text-center"}`}>
                            {i?.intensity || <DashComponent />}
                          </td>
                          <td
                            className={`${i.staffNameAndSignature ? "" : "text-center"}`}
                          >
                            {i.staffNameAndSignature ? (
                              signatureFormat({
                                sign: i.staffNameAndSignature,
                                date: i.signatureDate,
                                hoursFormat,
                              })
                            ) : (
                              <DashComponent />
                            )}
                          </td>
                          <td
                            className={`${i.resposneCode?.length ? "" : "text-center"}`}
                          >
                            {otherHandler(
                              i?.resposneCode,
                              "Other",
                              i?.responseCodeOther,
                            ) || <DashComponent />}
                          </td>
                          <td
                            className={`${i.timeReEvaluated ? "" : "text-center"}`}
                          >
                            {convertTimeFormat(
                              i.timeReEvaluated,
                              hoursFormat,
                            ) || <DashComponent />}
                          </td>
                          <td
                            className={`${i.revaluatedStaffInitials ? "" : "text-center"}`}
                          >
                            {i.revaluatedStaffInitials ? (
                              signatureFormat({
                                sign: i.revaluatedStaffInitials,
                                date: i.revaluatedStaffSignatureDate,
                                hoursFormat,
                              })
                            ) : (
                              <DashComponent />
                            )}
                          </td>
                          {(isAdminOrAdministrator ||
                            (profileInfo?.userType === ROLES.EMPLOYEE &&
                              profileInfo?.accountType ===
                                ACCOUNT_TYPES.REGULAR &&
                              profileInfo.userPermissions?.edit
                                ?.split(":")
                                .includes("prn"))) && (
                            <td>
                              <div className="icon-joiner">
                                <Link
                                  className={`edit-btn ${profileInfo.userType !== ROLES.ADMIN && i.isLocked ? "disabled-link" : ""}`}
                                  onClick={(e) => {
                                    if (
                                      profileInfo.userType !== ROLES.ADMIN &&
                                      i.isLocked
                                    ) {
                                      e.preventDefault();
                                      return;
                                    }
                                    setModalShow(true);
                                    setTableRow(i);
                                  }}
                                  style={{
                                    textWrap: "nowrap",
                                    pointerEvents:
                                      profileInfo.userType !== ROLES.ADMIN &&
                                      i.isLocked
                                        ? "none"
                                        : "auto",
                                    opacity:
                                      profileInfo.userType !== ROLES.ADMIN &&
                                      i.isLocked
                                        ? 0.5
                                        : 1,
                                  }}
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </Link>

                                {isAdminOrAdministrator && (
                                  <Link
                                    className={
                                      profileInfo?.userType === ROLES.PATIENT ||
                                      profileInfo?.userType === ROLES.GUARDIAN
                                        ? "del-btn pe-none"
                                        : "del-btn"
                                    }
                                    onClick={(e) => {
                                      e.preventDefault();
                                      removeRow();
                                      setRowData(i);
                                    }}
                                  >
                                    <i className="fa-solid fa-trash" />
                                  </Link>
                                )}
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
          {details.data?.tableData?.docs?.length > 0 && (
            <PaginationsPage
              page={page}
              setPage={setPage}
              totalPages={
                details?.data?.tableData?.totalPages &&
                details?.data?.tableData?.totalPages
              }
              limit={limit}
              setLimit={setLimit}
            />
          )}

          <Row className="mt-3">
            {(signers?.[signerIndex]?.signerId === profileInfo._id ||
              profileInfo?.patientsAssigned?.includes(
                signers?.[signerIndex]?.signerId,
              )) && (
              <>
                <Col xs={12} md={12}>
                  <Form.Label className="fw-bold">Signer Signature</Form.Label>
                </Col>
                <Col xs={12} md={6}>
                  <Button
                    type="button"
                    className={`theme-button ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                    onClick={() => setOpenSigner(true)}
                  >
                    SAVED AND SIGNED
                  </Button>
                </Col>
              </>
            )}
            <Col
              xs={12}
              md={
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

          {!isEdit && (
            <>
              <Row>
                <Col xs={12} md={12} lg={12}>
                  <Form.Group className="mb-3">
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
                <div className="employee-btn-joiner mt-3 mt-md-5">
                  {details?.data?.saveAsDraft && (
                    <button
                      type="button"
                      className={`draft ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                      onClick={(e) => submitHandler(e, true)}
                    >
                      Save as Draft
                    </button>
                  )}
                  <button
                    className={`employee_create_btn ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                    type="button"
                    onClick={(e) => submitHandler(e, false)}
                    disabled={signers[signerIndex]?.signature?.length === 0}
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
  Wcomponenet: PrnLogForm,
});
