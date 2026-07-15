/* eslint-disable no-unused-vars */
/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Form,
  Card,
  Row,
  Col,
  Button,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {
  medicationService,
  patientService,
  facilityService,
} from "@/features/shared/services";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import {
  AddSignature,
  AddSignatureForTable,
  convertTimeFormat,
  deletePermission,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import DatePicker from "react-datepicker";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteModal from "@/features/shared/ui/Mod/DeleteModal/DeleteModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
const MedicationCountForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [details, setDetails] = useState({});
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [facilityId, setFacilityId] = useState("");
  const [location, setLocation] = useState("");
  const [facilitiesList, setFacilitiesList] = useState([]);

  useEffect(() => {
    if (profileInfo?.userType === ROLES.ADMIN) {
      facilityService.list({
        setResponse: (data) => setFacilitiesList(data?.data || []),
      });
    } else {
      setFacilitiesList(profileInfo?.facilityId || []);
    }
  }, [profileInfo]);

  const [medicationName, setMedicationName] = useState("");
  const [dose, setDose] = useState("");
  const [prescriptionInstruction, setPrescriptionInstruction] = useState("");
  const [prescribingProvider, setPrescribingProvider] = useState("");
  const [beginningMedCount, setBeginningMedCount] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [countType, setCountType] = useState("medication");
  const [date, setDate] = useState("");
  const [shiftFrom, setShiftFrom] = useState("");
  const [shiftTo, setShiftTo] = useState("");
  const [painLevel, setPainLevel] = useState("");
  const [numberOfTabsGiven, setNumberOfTabsGiven] = useState("");
  const [beginningCount, setBeginningCount] = useState("");
  const [endingCount, setEndingCount] = useState("");
  const [currentStaffOnShiftSignature, setCurrentStaffOnShiftSignature] =
    useState("");
  const [relievingStaffSignature, setRelievingStaffSignature] = useState("");
  const [relievingStaffSignatureDate, setRelievingStaffSignatureDate] =
    useState("");
  const [relievingStaffSignatureTime, setRelievingStaffSignatureTime] =
    useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [name, setName] = useState("");
  const [initials, setInitials] = useState("");
  const [loading, setLoading] = useState(false);
  const [multipleTable, setMultipleTable] = useState([]);
  const [patient, setPatient] = useState({});
  const [patientDetail, setPatientDetail] = useState({});
  const [signers, setSigners] = useState([]);
  const [openSigner, setOpenSigner] = useState(false);
  const [key, setKey] = useState(0);
  const [open, setOpen] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
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
  const fetchHandler = useCallback(() => {
    medicationService.getOpioidCountById(id, {
      page,
      limit,
      setResponse: setDetails,
      setLoading,
    });
  }, [id, limit, page]);
  useEffect(() => {
    if (!isEdit) return;
    fetchHandler();
    if (details?.data?.data?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [details?.data?.data?.docs?.length, fetchHandler, page, isEdit]);
  useEffect(() => {
    if (details?.data) {
      const item = details?.data;
      setPatientId(item?.patientId);
      // setFacilityId(item?.facilityId);
      setLocation(item?.location);
      setMedicationName(item?.medicationName);
      setDose(item?.dose);
      setPrescriptionInstruction(item?.prescriptionInstruction);
      setPrescribingProvider(item?.prescribingProvider);
      setBeginningMedCount(item?.beginningMedCount);
      setMonthYear(item?.monthYear);
      setCountType(item?.countType);
      setSigners(item?.signers);
      setEndingCount(item?.endingCount);
      const table = item?.data?.docs;
      setMultipleTable(table || []);
    }
  }, [details]);

  const resident = isEdit ? patient?.data : patientDetail;

  useEffect(() => {
    if (resident && !isEdit) {
      const resFacilityId = resident.facilityId?._id || resident.facilityId;
      setFacilityId(resFacilityId || "");
      let addressToSet = resident?.facilityAddress;
      if (!addressToSet && resFacilityId) {
        const selectedFacility = facilitiesList?.find(
          (f) => f._id === resFacilityId,
        );
        if (selectedFacility) {
          addressToSet =
            selectedFacility.address || selectedFacility.location || "";
        }
      }
      setLocation(addressToSet || "");
    }
  }, [resident, facilitiesList, isEdit]);
  const table = {
    createdAt: new Date(),
    date,
    shiftFrom,
    shiftTo,
    painLevel,
    numberOfTabsGiven,
    beginningCount,
    endingCount,
    relievingStaffSignature,
    relievingStaffSignatureDate,
    relievingStaffSignatureTime,
    currentDate,
    currentTime,
  };
  const addTable = () => {
    if (!date || !shiftFrom || !shiftTo || !relievingStaffSignature) {
      setIsEmpty(true);
      return;
    }
    if (multipleTable[0]?._id) {
      table.endingCount =
        +(endingCount || 0) + +table.beginningCount - +table.numberOfTabsGiven;
      const newEntry = {
        ...table,
        prevEndingCount: +(endingCount || 0),
      };
      setTablePayload((prev) => [newEntry, ...prev]);
      setMultipleTable((prev) => [newEntry, ...prev]);
    } else {
      table.endingCount =
        +(multipleTable[0]?.endingCount || 0) +
        +table.beginningCount -
        +table.numberOfTabsGiven;
      const newEntry = {
        ...table,
        prevEndingCount: +(multipleTable[0]?.endingCount || 0),
      };
      setTablePayload((prev) => [newEntry, ...prev]);
      setMultipleTable((prev) => [newEntry, ...prev]);
    }
    setShiftFrom("");
    setShiftTo("");
    setNumberOfTabsGiven("");
    setBeginningCount("");
    setRelievingStaffSignature("");
    setRelievingStaffSignatureDate("");
    setRelievingStaffSignatureTime("");
    setOpenEditor(false);
    setKey((prev) => prev + 1);
    setIsEmpty(false);
  };
  const removeRow = () => {
    setModalShow(true);
  };
  const payload = {
    patientId,
    facilityId: facilityId?._id || facilityId || "",
    location,
    medicationName,
    dose,
    prescriptionInstruction,
    prescribingProvider,
    beginningMedCount,
    monthYear,
    data: tablePayload
      ?.sort(
        (a, b) =>
          new Date(b.relievingStaffSignatureDate).getTime() -
          new Date(a.relievingStaffSignatureDate).getTime(),
      )
      .map((i) => ({
        createdAt: i.createdAt,
        date: i.date,
        shiftFrom: i.shiftFrom,
        shiftTo: i.shiftTo,
        painLevel: i.painLevel,
        numberOfTabsGiven: i.numberOfTabsGiven,
        beginningCount: i.beginningCount,
        prevEndingCount: i.prevEndingCount,
        endingCount: i.endingCount,
        relievingStaffSignature: i.relievingStaffSignature,
        relievingStaffSignatureDate: i.relievingStaffSignatureDate,
        relievingStaffSignatureTime: i.relievingStaffSignatureTime,
      })),
    staff: multipleTable?.map((i) => ({
      name: i.name,
      initials: i.initials,
    })),
    countType,
    saveAsDraft,
    signers,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (isEdit) {
      medicationService.updateOpioidCount(id, payload, {
        setLoading,
        navigate,
      });
    } else {
      medicationService.createOpioidCount(payload, { setLoading, navigate });
    }
  };
  const countOptions = [
    {
      value: "Opioid",
      label: "OPIOID COUNT CONTROL",
    },
  ];
  useEffect(() => {
    if (patientId) {
      patientService.getById(patientId?._id || patientId, {
        setResponse: setPatient,
      });
    }
  }, [patientId]);
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
          ).includes("mc") &&
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
          ).includes("mc") &&
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
          ).includes("mc") &&
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
  const canDelete = deletePermission(profileInfo, "mc");
  return (
    <>
      <AddSignatureForTable
        show={openEditor}
        setValue={(sign) => setRelievingStaffSignature(sign)}
        setDate={(date) => setRelievingStaffSignatureDate(date)}
        setTime={(time) => setRelievingStaffSignatureTime(time)}
        setShow={setOpenEditor}
      />
      <AddSignature
        show={openSigner}
        setValue={(sign) => setSignerSignature(sign)}
        setDate={(date) => setSignerDate(date)}
        setTime={(time) => setSignerTime(time)}
      />
      <DeleteModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        url={"medication-opioid-count"}
        id={id}
        row={rowData}
        fetchHandler={fetchHandler}
        tablepayload={setTablePayload}
        responsetable={setMultipleTable}
      />

      <NavWrapper title={"Medication Count"} isArrow={true} />

      <Container className="full-width-container">
        <Form
          onSubmit={!isEdit ? submitHandler : undefined}
          className={`${isEdit && (saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
          {!isEdit ? (
            <Form.Label className="fw-bold">
              <PatientComponent
                MainPatientId={setPatientId}
                setWholeData={setPatientDetail}
              />
            </Form.Label>
          ) : (
            <Form.Label className="fw-bold">
              Resident Name :
              {` ${patient?.data && fetchPaitentName(patient?.data)}`}{" "}
            </Form.Label>
          )}
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
                  <Form.Control
                    disabled
                    value={resident?.ahcccsId}
                    isBots={false}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">DOB</Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(resident?.dateOfBirth)}
                    disabled
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          resident?.dateOfBirth
                            ? formatDateToMMDDYYYY(resident?.dateOfBirth)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    {countType === "medication"
                      ? "Medication Count"
                      : "Opioid Count Controlled"}
                  </Form.Label>
                  <div>
                    {countOptions.find((d) => d.value === countType)?.label ||
                      `Medication Count`}
                  </div>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Month/Year</Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(monthYear)}
                    onChange={(selectedDate) => {
                      setMonthYear(selectedDate?.toDateString());
                    }}
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
            </Row>
          </Card>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Facility Address</Form.Label>
                  <Form.Control
                    disabled={isEdit}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder=""
                    type={"text"}
                    value={location}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Medication Name</Form.Label>
                  <Form.Control
                    onChange={(e) => setMedicationName(e.target.value)}
                    placeholder=""
                    type={"text"}
                    value={medicationName}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Dose</Form.Label>
                  <Form.Control
                    onChange={(e) => setDose(e.target.value)}
                    placeholder=""
                    type={"text"}
                    value={dose}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Diagnosis (specify if new or continuing)
                  </Form.Label>
                  <Form.Control
                    disabled
                    value={patient?.data?.diagnosis}
                    isBots={false}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Prescription instruction
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setPrescriptionInstruction(e.target.value)}
                    placeholder=""
                    type={"text"}
                    value={prescriptionInstruction}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Prescribing provider
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setPrescribingProvider(e.target.value)}
                    placeholder=""
                    type={"text"}
                    value={prescribingProvider}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <div className="flex gap-1 items-baseline">
                    <Form.Label className="fw-bold">Date</Form.Label>
                    <div className="text-red-600 text-[12px]">
                      *{isEmpty && !date && <span>This field is required</span>}
                    </div>
                  </div>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(date)}
                    onChange={(selectedDate) => {
                      setDate(selectedDate?.toDateString());
                    }}
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
                <Form.Group className="mb-3 d-flex flex-column">
                  <div className="flex gap-1 items-baseline">
                    <Form.Label className="fw-bold">Shift From</Form.Label>
                    <div className="text-red-600 text-[12px]">
                      *
                      {isEmpty && !shiftFrom && (
                        <span>This field is required</span>
                      )}
                    </div>
                  </div>

                  <CustomTimePicker
                    value={shiftFrom ? parseTimeStringToDate(shiftFrom) : null}
                    onChange={setShiftFrom}
                    use24Hours={hoursFormat === "HH:mm"}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <div className="flex gap-1 items-baseline">
                    <Form.Label className="fw-bold">Shift To</Form.Label>
                    <div className="text-red-600 text-[12px]">
                      *
                      {isEmpty && !shiftTo && (
                        <span>This field is required</span>
                      )}
                    </div>
                  </div>

                  <CustomTimePicker
                    value={shiftTo ? parseTimeStringToDate(shiftTo) : null}
                    onChange={setShiftTo}
                    use24Hours={hoursFormat === "HH:mm"}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Number of tab/cap given
                  </Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setNumberOfTabsGiven(
                        e.target.value.replace(/^0(?=\d)/, ""),
                      )
                    }
                    placeholder=""
                    type="number"
                    value={numberOfTabsGiven}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Beginning med count
                  </Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setBeginningCount(e.target.value.replace(/^0(?=\d)/, ""))
                    }
                    placeholder=""
                    type="number"
                    value={beginningCount}
                  ></Form.Control>
                </Form.Group>
              </Col>

              <Col xs={12} md={6} lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">End med count</Form.Label>
                  <div>
                    {multipleTable[0]?._id
                      ? endingCount
                      : multipleTable[0]?.endingCount}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Form.Label className="fw-bold w-100">
                  Relieving Staff Signature
                </Form.Label>
                <div className="flex gap-1 items-center">
                  <Button
                    type="button"
                    className="theme-button"
                    onClick={() => setOpenEditor(true)}
                  >
                    SAVED AND SIGNED
                  </Button>
                  <div className="text-red-600 text-[12px]">
                    *
                    {isEmpty && !relievingStaffSignature && (
                      <span>This field is required</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col xs={12} md={6}>
                {signatureFormat({
                  sign: relievingStaffSignature,
                  date: relievingStaffSignatureDate,
                  time: relievingStaffSignatureTime,
                  hoursFormat,
                })}
              </Col>
            </Row>
          </Card>

          <Row className="text-center mb-3">
            <Col xs={12} md={12}>
              <Button
                type="button"
                className="theme-button"
                onClick={() => addTable()}
              >
                Add More{" "}
              </Button>
            </Col>
          </Row>

          {multipleTable?.length > 0 && (
            <Table bordered responsive className="mb-3">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>ShiftFrom</th>
                  <th>ShiftTo</th>
                  <th>Number of tab/cap given</th>
                  <th>Beginning shift count</th>
                  <th>Ending shift count</th>
                  <th>Relieving staff name and signature</th>

                  {canDelete && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {multipleTable?.slice().map((i, index) => (
                  <tr key={index}>
                    <td className={`${i.date ? "" : "text-center"}`}>
                      {" "}
                      {(i.date && formatDateToMMDDYYYY(i.date)) || (
                        <DashComponent />
                      )}{" "}
                    </td>
                    <td className={`${i.shiftFrom ? "" : "text-center"}`}>
                      {" "}
                      {convertTimeFormat(i.shiftFrom, hoursFormat) || (
                        <DashComponent />
                      )}{" "}
                    </td>
                    <td className={`${i.shiftTo ? "" : "text-center"}`}>
                      {" "}
                      {convertTimeFormat(i.shiftTo, hoursFormat) || (
                        <DashComponent />
                      )}{" "}
                    </td>
                    <td>
                      {" "}
                      {i.numberOfTabsGiven || i.numberOfTabsGiven === 0
                        ? i.numberOfTabsGiven
                        : "0"}{" "}
                    </td>
                    <td>
                      {i.beginningCount
                        ? `(${i.beginningCount} + ${i.prevEndingCount})`
                        : `${+i.prevEndingCount}`}
                    </td>
                    <td>
                      {" "}
                      {i.endingCount || i.endingCount === 0
                        ? i.endingCount
                        : "0"}{" "}
                    </td>
                    <td
                      className={`${i.relievingStaffSignature ? "" : "text-center"}`}
                    >
                      {i.relievingStaffSignature ? (
                        signatureFormat({
                          sign: i.relievingStaffSignature,
                          date: i.relievingStaffSignatureDate,
                          time: i.relievingStaffSignatureTime,
                          hoursFormat,
                          withText: true,
                          style: {
                            textAlign: "left",
                          },
                        })
                      ) : (
                        <DashComponent />
                      )}
                    </td>
                    {canDelete && (
                      <td>
                        <div className="icon-jpiner">
                          {" "}
                          <Link
                            className="del-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              removeRow();
                              setRowData(i);
                            }}
                          >
                            <i className="fa-solid fa-trash" />
                          </Link>{" "}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {details?.data?.data?.docs?.length > 0 && (
            <PaginationsPage
              page={page}
              setPage={setPage}
              totalPages={
                details?.data?.data?.totalPages &&
                details?.data?.data?.totalPages
              }
              limit={limit}
              setLimit={setLimit}
            />
          )}

          <Row>
            {signers?.[signerIndex]?.signerId === profileInfo._id && (
              <Col xs={12} md={6}>
                <Form.Label className="fw-bol w-100">
                  Relieving staff Name and Signature
                </Form.Label>
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
              md={signers?.[signerIndex]?.signerId === profileInfo._id ? 6 : 12}
            >
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

          {!id && (
            <Form.Group>
              <Form.Label className="fw-bold">Signers</Form.Label>
              <MultiEmployee setValue={setSigners} value={signers} />
            </Form.Group>
          )}

          <div className="employee-btn-joiner mt-5">
            {details?.data?.saveAsDraft && (
              <button
                className={`draft ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                type="button"
                onClick={() => setSaveAsDraft(true)}
              >
                Save as Draft
              </button>
            )}
            <button
              className={`employee_create_btn ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
              type="button"
              onClick={submitHandler}
              disabled={
                details?.data?.signers?.[signerIndex]?.signature?.length < 0
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
  Wcomponenet: MedicationCountForm,
});
