/* eslint-disable no-unused-vars */
/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Card,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { medicationService } from "@/features/shared/services";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import {
  signatureFormat,
  AddSignature,
  formatDateToMMDDYYYY,
  AddSignatureForTable,
  deletePermission,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
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
const ReconciliationForm = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [providerSignatureSaveAsDraft, setProviderSignatureSaveAsDraft] =
    useState(false);
  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [allergiesYes, setAllergiesYes] = useState(null);
  const [allergiesComment, setAllergiesComment] = useState("");
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [route, setRoute] = useState("");
  const [frequency, setFrequency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [stopChangeDate, setStopChangeDate] = useState("");
  const [reasonForStopChange, setReasonForStopChange] = useState("");
  const [providerName, setProviderName] = useState("");
  const [providerSignature, setProviderSignature] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [arr, setArr] = useState([]);
  const [details, setDetails] = useState({});
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [providerSignatureTime, setProviderSignatureTime] = useState("");
  const [providerSignatureDate, setProviderSignatureDate] = useState("");
  const [signers, setSigners] = useState([]);
  const [openSigner, setOpenSigner] = useState(false);
  const [key, setKey] = useState(0);
  const [isEmpty, setIsEmpty] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [tablePayload, setTablePayload] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [rowData, setRowData] = useState({});
  const [ahcccsId, setAhcccsId] = useState("");
  const [saveAsDrafIsNotEditable, setSaveAsDrafIsNotEditable] = useState(false);
  const [
    saveAsDrafIsNotEditableWithoutSigner,
    setSaveAsDrafIsNotEditableWithoutSigner,
  ] = useState(false);
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);
  const fetchHandler = useCallback(() => {
    medicationService.reconciliation.getById(id, {
      page,
      limit,
      setResponse: setDetails,
      setLoading,
    });
  }, [id, limit, page]);
  useEffect(() => {
    if (!isEdit) return;
    fetchHandler();
    if (details?.data?.medications?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [details?.data?.medications?.docs?.length, fetchHandler, page, isEdit]);
  const medications = {
    createdAt: new Date(),
    name,
    dose,
    route,
    frequency,
    startDate,
    stopChangeDate,
    reasonForStopChange,
    providerSignature,
    providerSignatureDate,
    providerSignatureTime,
  };
  const payload = {
    patientId,
    residentName,
    medications: tablePayload?.map((i) => ({
      createdAt: i.createdAt,
      name: i.name,
      dose: i.dose,
      route: i.route,
      frequency: i.frequency,
      startDate: i.startDate,
      stopChangeDate: i.stopChangeDate,
      reasonForStopChange: i.reasonForStopChange,
      providerSignature: i.providerSignature,
      providerSignatureDate: i.providerSignatureDate,
      providerSignatureTime: i.providerSignatureTime,
    })),
    providerName,
    providerSignature: providerSignature
      ? providerSignature
      : arr?.[arr?.length - 1]?.providerSignature,
    providerSignatureDate: providerSignatureDate
      ? providerSignatureDate
      : arr?.[arr?.length - 1]?.providerSignatureDate,
    date,
    providerSignatureTime: providerSignatureTime
      ? providerSignatureTime
      : arr?.[arr?.length - 1]?.providerSignatureTime,
    providerSignatureSaveAsDraft,
    signers,
  };
  const addData = () => {
    if (!providerSignature) {
      setIsEmpty(true);
      return;
    }
    if (isEdit) {
      setTablePayload((prev) => [medications, ...prev]);
    }
    setArr((prev) => [medications, ...prev]);
    setName("");
    setDose("");
    setRoute("");
    setFrequency("");
    setStartDate("");
    setStopChangeDate("");
    setReasonForStopChange("");
    setProviderSignature("");
    setProviderSignatureDate("");
    setProviderSignatureTime("");
    setOpen(false);
    setKey((prev) => prev + 1);
    setIsEmpty(false);
  };
  const removeRow = () => {
    setModalShow(true);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (isEdit) {
      medicationService.reconciliation.update(id, payload, {
        setLoading,
        navigate,
      });
    } else {
      medicationService.createReconciliation(
        {
          ...payload,
          medications: arr?.map((i) => ({
            createdAt: i.createdAt,
            name: i.name,
            dose: i.dose,
            route: i.route,
            frequency: i.frequency,
            startDate: i.startDate,
            stopChangeDate: i.stopChangeDate,
            reasonForStopChange: i.reasonForStopChange,
            providerSignature: i.providerSignature,
            providerSignatureDate: i.providerSignatureDate,
            providerSignatureTime: i.providerSignatureTime,
          })),
          signers: signers?.map((signer) => ({
            signerId: signer.value,
            name: signer.label,
            signature: "",
            dateSigned: "",
            signedTime: "",
          })),
        },
        {
          isAdmin: profileInfo?.userType === ROLES.ADMIN,
          setLoading,
          navigate,
        },
      );
    }
  };

  useEffect(() => {
    if (isEdit || !hasPatientRecord(patientDetail)) return;
    applyResidentHeaderFields(patientDetail, {
      setAhcccsId,
      setResidentName,
    });
  }, [patientDetail, isEdit]);
  useEffect(() => {
    if (!isEdit || !details) return;
    if (details) {
      const item = details?.data;
      setPatientId(item?.patientId);
      setAhcccsId(item?.patientId?.ahcccsId);
      setResidentName(item?.residentName);
      setProviderName(item?.providerName);
      if (item?.medications?.docs?.length > 0) {
        setArr(item?.medications?.docs);
      } else {
        setArr([]);
      }
      setSigners(item?.signers);
      setDate(item?.date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);
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
          ).includes("mr") &&
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
          ).includes("mr") &&
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
          ).includes("mr") &&
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

  useEffect(() => {
    const item = isEdit ? details?.data?.patientId : patientDetail;
    if (item?.allergies && item.allergies.length > 0) {
      const allergy = item.allergies[0];
      if (allergy.yes !== undefined) {
        setAllergiesYes(allergy.yes);
        setAllergiesComment(allergy.comments || allergy.name || "");
      } else {
        setAllergiesYes(true);
        setAllergiesComment(
          item.allergies
            .map((a) =>
              typeof a === "object" ? a.name || JSON.stringify(a) : a,
            )
            .join(", "),
        );
      }
    } else {
      setAllergiesYes(null);
      setAllergiesComment("");
    }
  }, [patientDetail, details?.data?.patientId, isEdit]);
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
  const canDelete = deletePermission(profileInfo, "mr");
  return (
    <>
      <AddSignature
        show={openSigner}
        setValue={(sign) => setSignerSignature(sign)}
        setDate={(date) => setSignerDate(date)}
        setTime={(time) => setSignerTime(time)}
      />

      <AddSignatureForTable
        show={open}
        setValue={(sign) => {
          setProviderSignature(sign);
        }}
        setDate={(date) => {
          setProviderSignatureDate(date);
        }}
        setTime={(time) => {
          setProviderSignatureTime(time);
        }}
        setShow={setOpen}
      />
      <DeleteModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        url={"medication-reconciliation"}
        id={id}
        row={rowData}
        fetchHandler={fetchHandler}
        tablepayload={setTablePayload}
        responsetable={setArr}
      />
      <NavWrapper isArrow={true} title={"Medication Reconciliation"} />
      <Container className="full-width-container">
        <Form
          onSubmit={submitHandler}
          className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
          <Row className="mb-2">
            <Col xs={12}>
              {!isEdit ? (
                <PatientComponent
                  MainPatientId={setPatientId}
                  MainResidentName={setResidentName}
                  setWholeData={setPatientDetail}
                />
              ) : (
                <Form.Label className="fw-bold">
                  Resident Name: {residentName}
                </Form.Label>
              )}
            </Col>
          </Row>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={4}>
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
              <Col xs={12} md={6} lg={4}>
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
              <Col xs={12} md={12} lg={12} className="mb-3">
                <Table responsive="lg" bordered>
                  <thead>
                    <tr>
                      <th>Condition</th>
                      <th className="text-center">Yes</th>
                      <th className="text-center">No</th>
                      <th>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Allergies</td>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          checked={allergiesYes === true}
                          disabled
                        />
                      </td>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          checked={allergiesYes === false}
                          disabled
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="_____________"
                          value={allergiesComment || ""}
                          disabled
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Name of Medication
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setName(e.target.value)}
                    placeholder=""
                    type="text"
                    value={name}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Dose</Form.Label>
                  <Form.Control
                    onChange={(e) => setDose(e.target.value)}
                    placeholder=""
                    type="text"
                    value={dose}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Route</Form.Label>
                  <Form.Control
                    onChange={(e) => setRoute(e.target.value)}
                    placeholder=""
                    type="text"
                    value={route}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Frequency</Form.Label>
                  <Form.Control
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder=""
                    type="text"
                    value={frequency}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Start Date</Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(startDate)}
                    onChange={(selectedDate) =>
                      setStartDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          startDate
                            ? formatDateToMMDDYYYY(startDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Stop/Change Date</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(stopChangeDate)}
                    onChange={(selectedDate) =>
                      setStopChangeDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          stopChangeDate
                            ? formatDateToMMDDYYYY(stopChangeDate)
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
                    Reason for Stop/Change
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setReasonForStopChange(e.target.value)}
                    placeholder=""
                    as="textarea"
                    value={reasonForStopChange}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12} lg={6} className="flex gap-1 items-center">
                <Button
                  type="button"
                  className="theme-button"
                  onClick={() => setOpen(true)}
                >
                  SAVED AND SIGNED
                </Button>
                <div className="text-red-600 text-[12px]">
                  *
                  {isEmpty && !providerSignature && (
                    <span>This field is required</span>
                  )}
                </div>
              </Col>
              <Col xs={12} lg={6}>
                {signatureFormat({
                  sign: providerSignature,
                  date: providerSignatureDate,
                  time: providerSignatureTime,
                  hoursFormat,
                })}
              </Col>
            </Row>
          </Card>
          <Row className="mb-3 text-center">
            <Col xs={12}>
              <Button
                className="theme-button"
                variant="primary"
                type="button"
                onClick={() => addData()}
              >
                + Add
              </Button>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Name of Medication</th>
                    <th>Dose</th>
                    <th>Route</th>
                    <th>Frequency</th>
                    <th>Start Date</th>
                    <th>Stop/Change Date</th>
                    <th>Reason for Stop/Change</th>
                    <th>Signature</th>
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
                        <td className={`${i.name ? "" : "text-center"}`}>
                          {" "}
                          {i.name || <DashComponent />}{" "}
                        </td>
                        <td> {i.dose || "0"} </td>
                        <td className={`${i.route ? "" : "text-center"}`}>
                          {" "}
                          {i.route || <DashComponent />}{" "}
                        </td>
                        <td> {i.frequency || "0"} </td>
                        <td className={`${i.startDate ? "" : "text-center"}`}>
                          {" "}
                          {(i.startDate &&
                            formatDateToMMDDYYYY(i.startDate)) || (
                            <DashComponent />
                          )}{" "}
                        </td>
                        <td
                          className={`${i.stopChangeDate ? "" : "text-center"}`}
                        >
                          {" "}
                          {(i.stopChangeDate &&
                            formatDateToMMDDYYYY(i.stopChangeDate)) || (
                            <DashComponent />
                          )}{" "}
                        </td>
                        <td
                          className={`${i.reasonForStopChange ? "" : "text-center"}`}
                        >
                          {" "}
                          {i.reasonForStopChange || <DashComponent />}{" "}
                        </td>
                        <td
                          className={`${i.providerSignature ? "" : "text-center"}`}
                        >
                          {" "}
                          {i?.providerSignature ? (
                            signatureFormat({
                              sign: i?.providerSignature,
                              date: i?.providerSignatureDate,
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
                                className="del-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeRow();
                                  setRowData(i);
                                }}
                              >
                                <i className="fa-solid fa-trash" />
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

          {details.data?.medications?.docs?.length > 0 && (
            <PaginationsPage
              page={page}
              setPage={setPage}
              totalPages={
                details?.data?.medications?.totalPages &&
                details?.data?.medications?.totalPages
              }
              limit={limit}
              setLimit={setLimit}
            />
          )}

          <Row>
            <Col xs={12}>
              <Card body className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Provider Name</Form.Label>
                  <Form.Control
                    onChange={(e) => setProviderName(e.target.value)}
                    placeholder=""
                    type={"text"}
                    value={providerName}
                  ></Form.Control>
                </Form.Group>
              </Card>
            </Col>
          </Row>
          <Row className="mb-3">
            {signers?.[signerIndex]?.signerId === profileInfo._id && (
              <Col xs={12} lg={6}>
                <Button
                  type="button"
                  className={`theme-button ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                  onClick={() => setOpenSigner(true)}
                >
                  SAVED AND SIGNED
                </Button>
              </Col>
            )}
            <Col
              xs={12}
              lg={signers?.[signerIndex]?.signerId === profileInfo._id ? 6 : 12}
            >
              {signers?.map?.((signer) =>
                signer?.signature?.length ? (
                  <div key={signer?.signerId}>
                    {signatureFormat({
                      sign: signer?.signature,
                      date: signer?.dateSigned,
                      time: signer?.signedTime,
                      hoursFormat,
                    })}
                  </div>
                ) : null,
              )}
            </Col>
          </Row>

          {!isEdit && (
            <>
              <Row>
                <Col xs={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Signers:</Form.Label>
                    <MultiEmployee setValue={setSigners} value={signers} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className="employee-btn-joiner mt-3 mt-md-5">
                    <button
                      className="draft"
                      type="submit"
                      onClick={() => setProviderSignatureSaveAsDraft(true)}
                    >
                      Save as Draft
                    </button>
                    <button className="employee_create_btn" type="submit">
                      {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                    </button>
                  </div>
                </Col>
              </Row>
            </>
          )}
          {isEdit && (
            <Row>
              <Col xs={12}>
                <div className="employee-btn-joiner mt-3 mt-md-5">
                  {details?.data?.providerSignatureSaveAsDraft && (
                    <button
                      className={`draft ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                      type="submit"
                      onClick={() => setProviderSignatureSaveAsDraft(true)}
                    >
                      Save as Draft
                    </button>
                  )}
                  <button
                    className={`employee_create_btn ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                    type="submit"
                    disabled={signers?.[signerIndex]?.signature?.length === 0}
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
  Wcomponenet: ReconciliationForm,
});
