/* eslint-disable no-unused-vars */
/** @format */
import React from "react";
import {
  Row,
  Col,
  Button,
  Form,
  ModalBody,
  Table,
  Card,
  Modal,
} from "react-bootstrap";
import Select from "@/features/shared/ui/Search/Search";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import DatePicker from "react-datepicker";
import { ClipLoader } from "react-spinners";
import { FaEdit, FaEye, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import {
  RiDeleteBin5Fill,
  RiCloseFill,
  RiCheckLine,
  RiAddLine,
} from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import {
  convertTimeFormat,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
} from "@/utils/utils";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import { showNotification } from "@/utils";
import {
  ColourOption,
  ColourSingleValue,
} from "./employeeMedicationColourComponents";

const EmployeeMedicationModalEdit = (props) => {
  const {
    ColourOption,
    ColourSingleValue,
    addContactBtn,
    addHandleAddMedication,
    addHandleChangeExpirationDate,
    addHandleChangeMedicationName,
    addHandleChangeOtherInstructions,
    addHandleChangeProvider,
    addHandleChangeRefillCount,
    addHandleInstructionChange,
    addHandleSelectChange21,
    addHandleTimeStatusChange,
    addMedication,
    admitDate,
    ahcccsId,
    allergies,
    colorOption,
    componentRef,
    datesList,
    delMedStatusLoading,
    deleteMedication,
    diagnosis,
    diet,
    editCheckMedications,
    fluidRestriction,
    formatDate,
    getAllDataById,
    getAllEmployeeMedications,
    getAllPatients,
    getApiData,
    handleAddMedication,
    handleAddTimeRow,
    handleAdminDeleteTimeRow,
    handleChangeExpirationDate,
    handleChangeMedicationName,
    handleChangeOtherInstructions,
    handleChangeProvider,
    handleChangeRefillChange,
    handleDeleteMedication,
    handleInstructionChange,
    handleMonthChange,
    handlePrint,
    handleRemoveTimeRow,
    handleSaveMedication,
    handleSaveTimeRow,
    handleTimeStatusChange,
    hoursFormat,
    location,
    medLoading,
    medStatusLoading,
    medications,
    medicationsCopy,
    month,
    noteData,
    noteId,
    noteUrl,
    options,
    patientId,
    pcpProvider,
    print,
    printRef,
    profile,
    psychiatricProvider,
    selectedValues,
    setNoteData,
    setNoteId,
    submitHandler,
    submitHandler2,
    timeLoading,
    medicationRefs,
    profileUser,
    loading,
    viewItem,
    year,
  } = props;

  return (
    <>
      <Modal.Header closeButton>
        <h5 className="mb-0 fw-bold">{`Edit Resident Medication`}</h5>
      </Modal.Header>
      {
        <Form onSubmit={submitHandler2}>
          <ModalBody>
            <Form className="grid gap-4">
              <Card className="p-2 mb-1">
                <Row>
                  <Col className="d-flex" xs={6} sm={6} md={4} xl={4}>
                    <Form.Label className="fw-bold mt-1">
                      Resident Name:
                    </Form.Label>
                    <span className="mx-2 ">
                      {fetchPaitentName(noteData?.patientId)}
                    </span>
                  </Col>
                  <Col xs={6} sm={6} md={4} xl={4}>
                    <Form.Label className="fw-bold mt-1">Month :</Form.Label>
                    <span className="mx-2 mt-1">
                      {noteData?.medication?.[0]?.year &&
                        `${new Date(
                          noteData?.medication?.[0]?.year,
                          noteData?.medication?.[0]?.month - 1,
                        ).toLocaleString("default", {
                          month: "long",
                        })} ${noteData?.medication?.[0]?.year}`}
                    </span>
                  </Col>
                  <Col xs={6} sm={6} md={4} xl={4}>
                    <Form.Label className="fw-bold mt-1">
                      AHCCCS ID :
                    </Form.Label>
                    <span className="mx-2 mt-1">
                      {noteData?.patientId?.ahcccsId}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12} md={12} xl={12}>
                    <Form.Label className="fw-bold mt-1">
                      Diagnosis (specify if new or continuing) :
                    </Form.Label>
                    <span className="mx-2 mt-1">
                      {noteData?.patientId?.diagnosis}
                    </span>
                  </Col>
                </Row>
              </Card>
              <Form.Group>
                {medications
                  ?.filter((item) => item.status === "Continue")
                  ?.map((medication, index) => {
                    const originalIndex = medications.findIndex(
                      (med) => med._id === medication._id,
                    );
                    return (
                      <>
                        {
                          <Card
                            className="p-3 mb-4"
                            key={index}
                            ref={(el) =>
                              (medicationRefs.current[medication._id] = el)
                            }
                          >
                            <Row>
                              <Col xs="12" md="8" lg="9">
                                <Form.Group className="mb-3">
                                  <Form.Label className="font-bold">
                                    Medication Name:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={medication?.name}
                                    onChange={(e) =>
                                      handleChangeMedicationName(
                                        index,
                                        e.target.value,
                                        "Continue",
                                      )
                                    }
                                    placeholder={`Medication Name`}
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs="12" md="4" lg="3">
                                <Form.Group className="mb-3">
                                  <Form.Label className="font-bold">
                                    Refill Count:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={medication?.refillCount}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (/^\d*$/.test(value)) {
                                        handleChangeRefillChange(
                                          index,
                                          e.target.value,
                                          "Continue",
                                        );
                                      }
                                    }}
                                    placeholder={`Refill Count`}
                                  />
                                </Form.Group>
                              </Col>

                              <Col xs="12" md="8" lg="9">
                                <Form.Group className="mb-3">
                                  <Form.Label className="font-bold">
                                    Provider Name:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={medication?.provider}
                                    onChange={(e) =>
                                      handleChangeProvider(
                                        index,
                                        e.target.value,
                                        "Continue",
                                      )
                                    }
                                    placeholder={`Provider Name`}
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs="12" md="4" lg="3">
                                <Form.Group className="mb-3">
                                  <Form.Label className="font-bold">
                                    Expiration Date
                                  </Form.Label>
                                  <DatePicker
                                    selected={formatDateToMMDDYYYY(
                                      medication?.expirationDate,
                                    )}
                                    onChange={(selectedDate) =>
                                      handleChangeExpirationDate(
                                        index,
                                        selectedDate?.toDateString(),
                                        "Continue",
                                      )
                                    }
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="MM/DD/YYYY"
                                    className="form-control"
                                    highlightDates={[
                                      {
                                        "react-datepicker__day--highlighted-custom":
                                          [
                                            medication?.expirationDate
                                              ? formatDateToMMDDYYYY(
                                                  medication?.expirationDate,
                                                )
                                              : new Date(),
                                          ],
                                      },
                                    ]}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            <Form.Group className="mb-3">
                              <Form.Label className="w-full font-bold">
                                Instructions:
                              </Form.Label>
                              <CustomMultiSelectInput
                                options={options}
                                isMulti
                                placeholder="All Accessible"
                                onChange={(value) =>
                                  handleInstructionChange(
                                    index,
                                    value,
                                    "Continue",
                                  )
                                }
                                value={medication?.instruction}
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label className="w-full font-bold">
                                Other Instructions:
                              </Form.Label>
                              <Form.Control
                                value={medication.other}
                                onChange={(e) =>
                                  handleChangeOtherInstructions(
                                    index,
                                    e.target.value,
                                    "Continue",
                                  )
                                }
                                type="text"
                                placeholder="Other Instructions"
                              />
                            </Form.Group>
                            <div>
                              <Table bordered hover responsive="md">
                                <thead className="overflow-clip">
                                  <tr>
                                    <th>Time</th>
                                    <th>Color</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {medication?.timeStatus?.map(
                                    (status, timeStatusIndex) => (
                                      <tr key={timeStatusIndex}>
                                        {/* Time Column */}
                                        <td>
                                          <CustomTimePicker
                                            value={
                                              status?.time
                                                ? parseTimeStringToDate(
                                                    status?.time,
                                                  )
                                                : null
                                            }
                                            onChange={(e, timeString) => {
                                              handleTimeStatusChange(
                                                index,
                                                timeStatusIndex,
                                                "time",
                                                timeString,
                                                "Continue",
                                                medication,
                                              );
                                            }}
                                            use24Hours={hoursFormat === "HH:mm"}
                                            disabled={status?.disabled}
                                          />
                                        </td>

                                        {/* Color Column */}
                                        <td
                                          className={` ${!status?.time || timeLoading ? "pe-none" : ""}`}
                                        >
                                          <Select
                                            name="color"
                                            isDisabled={
                                              !status?.time || timeLoading
                                                ? true
                                                : status?.disabled
                                            }
                                            options={
                                              !status?.time || timeLoading
                                                ? []
                                                : colorOption
                                            }
                                            closeMenuOnSelect={true}
                                            placeholder="Colors"
                                            onChange={(selectedOption) => {
                                              if (status?.time) {
                                                handleTimeStatusChange(
                                                  index,
                                                  timeStatusIndex,
                                                  "color",
                                                  selectedOption?.value,
                                                  "Continue",
                                                  medication,
                                                );
                                              } else {
                                                showNotification({
                                                  message:
                                                    "Please fill time first",
                                                  type: "danger",
                                                });
                                              }
                                            }}
                                            value={
                                              status?.time
                                                ? colorOption?.find(
                                                    (option) =>
                                                      option?.value ===
                                                      status?.color,
                                                  )
                                                : null
                                            }
                                            className={`cus-select-med cus-select-color color-input-none`}
                                            components={{
                                              Option: ColourOption,
                                              SingleValue: ColourSingleValue,
                                            }}
                                          />
                                        </td>

                                        {/* Actions Column */}
                                        <td>
                                          <div className="flex items-center gap-2 flex-wrap">
                                            {medication?.timeStatus.length >
                                              0 &&
                                              (status?.disabled ? (
                                                <Button
                                                  size="sm"
                                                  className="m-0"
                                                  variant="secondary"
                                                  onClick={() => {
                                                    handleRemoveTimeRow(
                                                      originalIndex,
                                                      timeStatusIndex,
                                                      medication._id,
                                                      medication,
                                                    );
                                                  }}
                                                >
                                                  <RiCheckLine className="d-inline-flex" />
                                                </Button>
                                              ) : (
                                                <Button
                                                  size="sm"
                                                  className="m-0 btn-light-secondary"
                                                  onClick={() => {
                                                    const lastStatus =
                                                      medication.timeStatus[
                                                        timeStatusIndex
                                                      ];
                                                    const isColorIncluded =
                                                      colorOption.some(
                                                        (option) =>
                                                          option?.value ===
                                                          lastStatus?.color,
                                                      );
                                                    if (
                                                      lastStatus.time &&
                                                      isColorIncluded
                                                    ) {
                                                      handleRemoveTimeRow(
                                                        originalIndex,
                                                        timeStatusIndex,
                                                        medication._id,
                                                        medication,
                                                      );
                                                    } else {
                                                      showNotification({
                                                        message:
                                                          "Please fill out the row before discontinue.",
                                                        type: "danger",
                                                      });
                                                    }
                                                  }}
                                                >
                                                  <RiCloseFill className="d-inline-flex" />
                                                </Button>
                                              ))}
                                            {medication?.timeStatus.length >
                                              0 &&
                                              (profileUser?.userType ===
                                                ROLES.ADMIN ||
                                                (profileUser?.userType ===
                                                  ROLES.EMPLOYEE &&
                                                  profileUser.accountType ===
                                                    ACCOUNT_TYPES.ADMINISTRATOR)) && (
                                                <button
                                                  type="button"
                                                  className="m-0 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors inline-flex items-center justify-center"
                                                  title="Delete Time Row"
                                                  onClick={() => {
                                                    handleAdminDeleteTimeRow(
                                                      originalIndex,
                                                      timeStatusIndex,
                                                      medication._id,
                                                      medication,
                                                    );
                                                  }}
                                                >
                                                  <RiDeleteBin5Fill
                                                    size={18}
                                                    className="d-inline-flex"
                                                  />
                                                </button>
                                              )}
                                            {medication?.timeStatus.length -
                                              1 ===
                                              timeStatusIndex && (
                                              <Button
                                                className="m-0"
                                                size="sm"
                                                onClick={() => {
                                                  const lastStatus =
                                                    medication.timeStatus[
                                                      medication.timeStatus
                                                        .length - 1
                                                    ];
                                                  const isColorIncluded =
                                                    colorOption.some(
                                                      (option) =>
                                                        option.value ===
                                                        lastStatus.color,
                                                    );
                                                  if (
                                                    lastStatus.time &&
                                                    isColorIncluded
                                                  ) {
                                                    handleAddTimeRow(index);
                                                  } else {
                                                    showNotification({
                                                      message:
                                                        "Please fill out the previous row before adding a new one.",
                                                      type: "danger",
                                                    });
                                                  }
                                                }}
                                              >
                                                <RiAddLine className="d-inline-flex" />{" "}
                                                <span className="d-none d-lg-inline-flex text-[12px]">
                                                  Time
                                                </span>
                                              </Button>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    ),
                                  )}
                                </tbody>
                              </Table>
                            </div>
                            <Form.Group>
                              <div className="text-center">
                                <Button
                                  size="sm"
                                  className="m-1 min-w-[142px]"
                                  variant="success"
                                  onClick={() => {
                                    handleSaveMedication(medication);
                                  }}
                                >
                                  {loading || medLoading ? (
                                    <ClipLoader size={15} color="#fff" />
                                  ) : (
                                    "Update Medication"
                                  )}
                                </Button>
                                {medication?.MarsId && (
                                  <Button
                                    onClick={() =>
                                      addMedication(
                                        medication?._id,
                                        medication.status,
                                      )
                                    }
                                    size="sm"
                                    className="m-1 btn-light-secondary hidePrint"
                                  >
                                    {medStatusLoading ? (
                                      <ClipLoader size={15} color="#fff" />
                                    ) : (
                                      "Discontinue"
                                    )}
                                  </Button>
                                )}
                                {(profileUser?.userType === ROLES.ADMIN ||
                                  (profileUser?.userType === ROLES.EMPLOYEE &&
                                    profileUser.accountType ===
                                      ACCOUNT_TYPES.ADMINISTRATOR)) && (
                                  <Button
                                    onClick={() =>
                                      deleteMedication(
                                        medication?._id,
                                        medication?.MarsId,
                                        index,
                                      )
                                    }
                                    size="sm"
                                    className="m-1 hidePrint bg-red-500 border-none min-w-[92px]"
                                  >
                                    {delMedStatusLoading ? (
                                      <ClipLoader size={15} color="#fff" />
                                    ) : (
                                      "Delete Medication"
                                    )}
                                  </Button>
                                )}
                                {medication?.timeStatus?.length < 1 && (
                                  <Button
                                    className="ms-sm-1 mt-1 mt-sm-0"
                                    size="sm"
                                    onClick={() => {
                                      handleAddTimeRow(index);
                                    }}
                                  >
                                    <FaPlus className="d-inline-block" />{" "}
                                    <span className="d-none d-lg-inline-block">
                                      Time
                                    </span>
                                  </Button>
                                )}
                              </div>
                            </Form.Group>
                          </Card>
                        }
                      </>
                    );
                  })}

                {medications
                  ?.filter((item) => item.status === "DisContinue")
                  ?.map((medication, index) => {
                    return (
                      <>
                        {
                          <Card className="p-3 mb-4" key={index}>
                            <Row>
                              <Col xs="12" md="8" lg="9">
                                <Form.Group className="mb-3">
                                  <Form.Label className="font-bold">
                                    Medication Name:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    disabled
                                    value={medication?.name}
                                    onChange={(e) =>
                                      handleChangeMedicationName(
                                        index,
                                        e.target.value,
                                        "DisContinue",
                                      )
                                    }
                                    placeholder={`Medication Name ${index + 1}`}
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs="12" md="4" lg="3">
                                <Form.Group className="mb-3">
                                  <Form.Label className="font-bold">
                                    Refill Count:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    disabled
                                    value={medication?.refillCount}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (/^\d*$/.test(value)) {
                                        addHandleChangeRefillCount(
                                          index,
                                          e.target.value,
                                          "Continue",
                                        );
                                      }
                                    }}
                                    placeholder={`Refill Count`}
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs="12" md="8" lg="9">
                                <Form.Group className="mb-3">
                                  <Form.Label className="font-bold">
                                    Provider Name:
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    disabled
                                    value={medication?.provider}
                                    onChange={(e) =>
                                      handleChangeProvider(
                                        index,
                                        e.target.value,
                                        "DisContinue",
                                      )
                                    }
                                    placeholder={`Provider Name`}
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs="12" md="4" lg="3">
                                <Form.Group className="mb-3">
                                  <Form.Label className="font-bold">
                                    Expiration Date :
                                  </Form.Label>
                                  <DatePicker
                                    selected={formatDateToMMDDYYYY(
                                      medication?.expirationDate,
                                    )}
                                    onChange={(selectedDate) =>
                                      addHandleChangeExpirationDate(
                                        index,
                                        selectedDate?.toDateString(),
                                        "DisContinue",
                                      )
                                    }
                                    disabled
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="MM/DD/YYYY"
                                    className="form-control"
                                    highlightDates={[
                                      {
                                        "react-datepicker__day--highlighted-custom":
                                          [
                                            medication?.expirationDate
                                              ? formatDateToMMDDYYYY(
                                                  medication?.expirationDate,
                                                )
                                              : new Date(),
                                          ],
                                      },
                                    ]}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <Form.Group className="mb-3">
                              <Form.Label className="w-full font-bold">
                                Instructions:
                              </Form.Label>
                              <CustomMultiSelectInput
                                options={options}
                                isMulti
                                required
                                placeholder="All Accessible"
                                onChange={(value) =>
                                  addHandleSelectChange21(
                                    index,
                                    value,
                                    "DisContinue",
                                  )
                                }
                                value={medication?.instruction || []}
                                isDisabled={true}
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label className="w-full font-bold">
                                Other Instructions:
                              </Form.Label>
                              <Form.Control
                                value={medication.other}
                                disabled
                                onChange={(e) =>
                                  handleChangeOtherInstructions(
                                    index,
                                    e.target.value,
                                    "DisContinue",
                                  )
                                }
                                type="text"
                                placeholder="Other Instructions"
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Table bordered hover responsive>
                                <thead className="overflow-clip">
                                  <tr>
                                    <th>Time</th>
                                    <th>Color</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {medication?.timeStatus?.map(
                                    (status, timeStatusIndex) => (
                                      <tr key={timeStatusIndex}>
                                        <td>
                                          <CustomTimePicker
                                            value={
                                              status.time
                                                ? parseTimeStringToDate(
                                                    status.time,
                                                  )
                                                : null
                                            }
                                            onChange={(e) =>
                                              handleTimeStatusChange(
                                                index,
                                                timeStatusIndex,
                                                e.target.name,
                                                e.target.value,
                                                "DisContinue",
                                              )
                                            }
                                            use24Hours={hoursFormat === "HH:mm"}
                                            disabled={true}
                                          />
                                        </td>
                                        <td className="pe-none">
                                          <Select
                                            name="color"
                                            options={colorOption}
                                            isDisabled
                                            closeMenuOnSelect={true}
                                            placeholder="Colors"
                                            onChange={(selectedOption) =>
                                              handleTimeStatusChange(
                                                index,
                                                timeStatusIndex,
                                                "color",
                                                selectedOption.value,
                                                "DisContinue",
                                              )
                                            }
                                            value={colorOption.find(
                                              (option) =>
                                                option.value === status.color,
                                            )}
                                            className="cus-select-med cus-select-color color-input-none"
                                            components={{
                                              Option: ColourOption,
                                              SingleValue: ColourSingleValue,
                                            }}
                                          />
                                        </td>
                                      </tr>
                                    ),
                                  )}
                                </tbody>
                              </Table>
                            </Form.Group>
                            <Form.Group className="text-center">
                              <Button
                                onClick={() =>
                                  addMedication(
                                    medication?._id,
                                    medication.status,
                                    "DisContinue",
                                  )
                                }
                                size="sm"
                                className="hidePrint bg-red-500 border-none min-w-[90px]"
                              >
                                {medStatusLoading ? (
                                  <ClipLoader size={15} color="#fff" />
                                ) : (
                                  "Continue"
                                )}
                              </Button>
                            </Form.Group>
                          </Card>
                        }
                      </>
                    );
                  })}
              </Form.Group>
              <div>
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    const lastMedication = medications[medications.length - 1];
                    if (lastMedication?.name || medications.length === 0) {
                      handleAddMedication();
                    } else {
                      showNotification({
                        message:
                          "Please fill out all fields before adding a new medication.",
                        type: "danger",
                      });
                    }
                  }}
                >
                  Add Medication
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Form>
      }
    </>
  );
};

export default EmployeeMedicationModalEdit;
