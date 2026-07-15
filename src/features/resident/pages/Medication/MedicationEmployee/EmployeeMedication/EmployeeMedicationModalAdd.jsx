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
import {
  ColourOption,
  ColourSingleValue,
} from "./employeeMedicationColourComponents";

const EmployeeMedicationModalAdd = (props) => {
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
    patients,
    setPatientId,
    setAdmitDate,
    setAhcccsId,
    setDiagnosis,
    setLocation,
    setPsychiatricProvider,
    setPsychiatricProviderContact,
    setPsychiatricProviderAddress,
    setPcpProvider,
    setPrimaryCareProviderContact,
    setPrimaryCareProviderAddress,
    setDiet,
    setFluidRestriction,
    setAllergies,
    showNotification,
    pcpProvider,
    print,
    printRef,
    profile,
    psychiatricProvider,
    psychiatricProviderContact,
    psychiatricProviderAddress,
    primaryCareProviderContact,
    primaryCareProviderAddress,
    selectedValues,
    setNoteData,
    setNoteId,
    submitHandler,
    submitHandler2,
    timeLoading,
    viewItem,
    year,
  } = props;

  return (
    <>
      <Modal.Header closeButton>
        <h5 className="mb-0 fw-bold">Add Resident Medication</h5>
      </Modal.Header>
      <ModalBody>
        <div>
          <Form className="add-medication-modal">
            <div className="add-medication-container">
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 add-medication-form">
                    <Form.Label className="font-bold">
                      Resident Name:
                    </Form.Label>
                    <Form.Select
                      onChange={(e) => {
                        setPatientId(e.target.value);
                      }}
                      aria-label="Default select example"
                    >
                      <option>Open this select menu</option>
                      {patients &&
                        patients.map((item) => {
                          return (
                            <option key={item._id} value={item._id}>
                              {item.firstName + " " + item.lastName}
                            </option>
                          );
                        })}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 add-medication-form d-flex flex-column">
                    <Form.Label className="font-bold">Admit Date</Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(admitDate)}
                      disabled
                      onChange={(selectedDate) =>
                        setAdmitDate(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            admitDate
                              ? formatDateToMMDDYYYY(admitDate)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 add-medication-form">
                    <Form.Label className="font-bold">AHCCCS ID</Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      onChange={(e) => setAhcccsId(e.target.value)}
                      value={ahcccsId}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 add-medication-form">
                    <Form.Label className="font-bold">
                      Diagnosis (specify if new or continuing)
                    </Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      onChange={(e) => setDiagnosis(e.target.value)}
                      value={diagnosis}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 add-medication-form">
                    <Form.Label className="font-bold">
                      Facility Address
                    </Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      onChange={(e) => setLocation(e.target.value)}
                      value={location}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 add-medication-form">
                    <Form.Label className="font-bold">
                      Psychiatric Provider Name
                    </Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      onChange={(e) => setPsychiatricProvider(e.target.value)}
                      value={psychiatricProvider}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 add-medication-form">
                    <Form.Label className="font-bold">
                      Psychiatric Provider Contact
                    </Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      onChange={(e) =>
                        setPsychiatricProviderContact(e.target.value)
                      }
                      value={psychiatricProviderContact}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 add-medication-form">
                    <Form.Label className="font-bold">
                      Psychiatric Provider Address
                    </Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      onChange={(e) =>
                        setPsychiatricProviderAddress(e.target.value)
                      }
                      value={psychiatricProviderAddress}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 add-medication-form">
                    <Form.Label className="font-bold">
                      Primary Care Provider Name
                    </Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      onChange={(e) => setPcpProvider(e.target.value)}
                      value={pcpProvider}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 add-medication-form">
                    <Form.Label className="font-bold">
                      Primary Care Provider Contact
                    </Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      onChange={(e) =>
                        setPrimaryCareProviderContact(e.target.value)
                      }
                      value={primaryCareProviderContact}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 add-medication-form">
                    <Form.Label className="font-bold">
                      Primary Care Provider Address
                    </Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      onChange={(e) =>
                        setPrimaryCareProviderAddress(e.target.value)
                      }
                      value={primaryCareProviderAddress}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 add-medication-form">
                    <Form.Label className="font-bold">Diet</Form.Label>
                    <Form.Control
                      disabled
                      type="text"
                      onChange={(e) => setDiet(e.target.value)}
                      value={diet}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="mb-1 add-medication-form w-full">
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="font-bold">
                        Fluid Restrictions
                      </Form.Label>
                      <Form.Control
                        disabled
                        type="text"
                        onChange={(e) => setFluidRestriction(e.target.value)}
                        value={fluidRestriction}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label className="font-bold">
                        Medication Month
                      </Form.Label>
                      <Form.Control
                        required
                        type="Month"
                        min={1}
                        max={12}
                        onChange={handleMonthChange}
                        value={month}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              <Row>
                <Col xs={12} md={12}>
                  <Form.Group className="mb-3 add-medication-form">
                    <Form.Label className="font-bold">Allergies</Form.Label>
                    <Table responsive="lg" bordered className="mb-0 bg-white">
                      <thead>
                        <tr>
                          <th>Condition</th>
                          <th className="text-center">Yes</th>
                          <th className="text-center">No</th>
                          <th className="w-50">Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Allergies</td>
                          <td className="text-center">
                            <Form.Check
                              type="checkbox"
                              checked={
                                Array.isArray(allergies) && allergies.length > 0
                                  ? allergies[0]?.yes === true
                                  : false
                              }
                              readOnly
                              disabled
                            />
                          </td>
                          <td className="text-center">
                            <Form.Check
                              type="checkbox"
                              checked={
                                Array.isArray(allergies) && allergies.length > 0
                                  ? allergies[0]?.yes === false
                                  : false
                              }
                              readOnly
                              disabled
                            />
                          </td>
                          <td>
                            {Array.isArray(allergies) && allergies.length > 0
                              ? allergies[0]?.comments || ""
                              : typeof allergies === "string"
                                ? allergies
                                : ""}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <hr></hr>
            <Row>
              <Col xs={12} md={12} className="over-flow-of-able">
                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th className="w-[25%]">Medication Name</th>
                      <th className="w-[30%]">Instructions</th>
                      <th>Time/Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications?.map((medication, index) => (
                      <tr key={index}>
                        {index === medications.length - 1 ? (
                          <>
                            <td>
                              <Form.Group required className="mb-3">
                                <Form.Control
                                  required
                                  type="text"
                                  value={medication?.name}
                                  onChange={(e) =>
                                    addHandleChangeMedicationName(
                                      index,
                                      e.target.value,
                                    )
                                  }
                                  placeholder={`Medication Name ${index + 1}`}
                                />
                              </Form.Group>
                              <Form.Group required className="mb-3">
                                <Form.Label className="fw-bold">
                                  Refill Count{" "}
                                </Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  value={medication?.refillCount}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                      addHandleChangeRefillCount(index, value);
                                    }
                                  }}
                                  placeholder={`Refill Count`}
                                />
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Label className="font-bold">
                                  Expiration Date
                                </Form.Label>
                                <DatePicker
                                  selected={formatDateToMMDDYYYY(
                                    medication?.expirationDate,
                                  )}
                                  onChange={(selectedDate) =>
                                    addHandleChangeExpirationDate(
                                      index,
                                      selectedDate?.toDateString(),
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
                            </td>
                            <td>
                              <Form.Group required className="mb-3">
                                <CustomMultiSelectInput
                                  className="custom-color-medication"
                                  options={options}
                                  isMulti
                                  required
                                  placeholder="All Accessible"
                                  onChange={(value) =>
                                    addHandleSelectChange21(index, value)
                                  }
                                  value={
                                    selectedValues[index] ||
                                    medication?.instruction ||
                                    []
                                  }
                                />
                              </Form.Group>
                              <Form.Label className="fw-bold">
                                Other Instructions
                              </Form.Label>
                              <Form.Group required className="mb-3">
                                <Form.Control
                                  required
                                  onChange={(e) =>
                                    addHandleInstructionChange(
                                      index,
                                      e.target.value,
                                    )
                                  }
                                  type="text"
                                  placeholder="Other Instructions"
                                  value={medication.other || ""}
                                />
                              </Form.Group>
                              <Form.Group required className="mb-3">
                                <Form.Label className="fw-bold">
                                  Provider Name
                                </Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  value={medication?.provider}
                                  onChange={(e) =>
                                    addHandleChangeProvider(
                                      index,
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Provider Name"
                                />
                              </Form.Group>
                            </td>

                            <td>
                              {medication?.timeStatus?.map(
                                (status, timeStatusIndex) => (
                                  <Row
                                    key={timeStatusIndex}
                                    className="align-items-center mb-3"
                                  >
                                    <Col xs="12" md="4" lg="4">
                                      {/* Time Input */}
                                      <Form.Group className="flexchild">
                                        <CustomTimePicker
                                          value={
                                            status?.time
                                              ? parseTimeStringToDate(
                                                  status?.time,
                                                )
                                              : null
                                          }
                                          onChange={(e, timeString) => {
                                            addHandleTimeStatusChange(
                                              index,
                                              timeStatusIndex,
                                              "time",
                                              timeString,
                                            );
                                          }}
                                          use24Hours={hoursFormat === "HH:mm"}
                                        />
                                      </Form.Group>
                                    </Col>
                                    <Col xs="12" md="5" lg="6">
                                      {/* Color Selector */}
                                      <Form.Group className="flexchild">
                                        <Select
                                          name="color"
                                          options={colorOption}
                                          required
                                          closeMenuOnSelect={true}
                                          placeholder="Colors"
                                          onChange={(selectedOption) =>
                                            addHandleChangeOtherInstructions(
                                              index,
                                              timeStatusIndex,
                                              "color",
                                              selectedOption.value,
                                            )
                                          }
                                          value={colorOption.find(
                                            (option) =>
                                              option.value === status.color,
                                          )}
                                          className="cus-select-med cus-select-color"
                                          components={{
                                            Option: ColourOption,
                                            SingleValue: ColourSingleValue,
                                          }}
                                        />
                                      </Form.Group>
                                    </Col>
                                    <Col
                                      xs="12"
                                      md="2"
                                      lg="2"
                                      className="flex items-center justify-center"
                                    >
                                      <div className="flexchild">
                                        {medication?.timeStatus.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleRemoveTimeRow(
                                                index,
                                                timeStatusIndex,
                                              )
                                            }
                                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
                                            title="Remove Time"
                                          >
                                            <RiDeleteBin5Fill size={18} />
                                          </button>
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                ),
                              )}
                              <div className="flex items-center justify-between mt-2">
                                {/* Add Time Button */}
                                <Button
                                  size="sm"
                                  className="text-nowrap"
                                  onClick={() => {
                                    const lastStatus =
                                      medication.timeStatus[
                                        medication.timeStatus.length - 1
                                      ];
                                    if (lastStatus.time && lastStatus.color) {
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
                                  + Time
                                </Button>
                                {medications?.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteMedication(
                                        medication?._id,
                                        index,
                                      )
                                    }
                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
                                    title="Remove Medication"
                                  >
                                    <RiDeleteBin5Fill size={18} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>
                              <span>
                                {medication?.name ||
                                  `Medication Name ${index + 1}`}
                              </span>
                              <th>Refill Count:</th>
                              <span>{medication?.refillCount}</span>
                            </td>
                            <td>
                              <div>
                                {medication?.instruction?.length > 0
                                  ? medication.instruction
                                      .map((item) => item.value)
                                      .join(", ")
                                  : "N/A"}
                              </div>
                              <div>
                                <th>Other Instructions:</th>
                                {medication?.other || "N/A"}
                              </div>
                            </td>
                            <td className="relative">
                              <div>
                                {medication?.timeStatus?.map(
                                  (status, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between w-[110px] my-1 bg-white border border-gray-200 px-2 py-1 rounded-md shadow-sm"
                                    >
                                      <span className="text-sm font-medium text-gray-700">
                                        {status.time}
                                      </span>
                                      <div
                                        className="w-4 h-4 rounded-full border border-gray-300 shadow-inner flex-shrink-0"
                                        style={{
                                          backgroundColor: status.color,
                                        }}
                                      ></div>
                                    </div>
                                  ),
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteMedication(medication?._id, index)
                                }
                                className="absolute right-[5px] top-[5px] text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-colors flex items-center justify-center"
                                title="Remove Medication"
                              >
                                <RiDeleteBin5Fill size={18} />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <div>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => {
                  const lastMedication = medications[medications.length - 1];
                  const lastStatus =
                    lastMedication?.timeStatus?.[
                      lastMedication.timeStatus.length - 1
                    ];
                  if (lastMedication?.name) {
                    addHandleAddMedication();
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
        </div>
      </ModalBody>
      <Modal.Footer className="justify-content-center">
        <Button className="theme-button" onClick={submitHandler}>
          SAVE
        </Button>
        <Button onClick={props.onHide} className="theme-button-outline">
          CANCEL
        </Button>
      </Modal.Footer>
    </>
  );
};

export default EmployeeMedicationModalAdd;
