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

const EmployeeMedicationModalView = (props) => {
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
    viewItem,
    year,
  } = props;

  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <Modal.Header closeButton>
        <h5 className="mb-0 fw-bold">Resident Medication Details</h5>
      </Modal.Header>
      <ModalBody>
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">Resident Medication Details </h1>
          <Card className="view-details">
            <Row>
              <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                <div className=" view-details-grid-inline my-1 my-md-2 mx-3">
                  <p className="fw-bold view-label mb-1">Resident Name : </p>
                  <h5 className="view-value mb-0">
                    {noteData?.patientId?._id &&
                      `${noteData?.patientId?.firstName} ${noteData?.patientId?.lastName}`}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                <div className=" view-details-grid-inline my-1 my-md-2">
                  <p className="fw-bold view-label mb-1">Month : </p>
                  <h5 className="view-value mb-0">
                    {noteData?.medication?.[0]?.year &&
                      `${new Date(
                        noteData?.medication?.[0]?.year,
                        noteData?.medication?.[0]?.month - 1,
                      ).toLocaleString("default", {
                        month: "long",
                      })} ${noteData?.medication?.[0]?.year}`}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                <div className="view-details-grid-inline my-1 my-md-2 ">
                  <p className="fw-bold view-label mb-1">AHCCCS ID : </p>
                  <h5 className="view-value mb-0">
                    {noteData?.patientId?._id && noteData?.patientId?.ahcccsId}
                  </h5>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className=" view-details-grid-inline my-1 my-md-2 mx-3">
                  <p className="fw-bold view-label mb-1">
                    Diagnosis (specify if new or continuing) :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {noteData?.patientId?._id && noteData?.patientId?.diagnosis}
                  </h5>
                </div>
              </Col>
            </Row>
          </Card>
          {noteData?.medication?.map((medication, index) => (
            <div
              key={medication?._id}
              className={
                medication?.status === "Continue" ? "block  " : "hidden"
              }
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Medication Name : </p>
                <h5 className="view-value mb-0">{medication?.name}</h5>
              </div>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Refill Count : </p>
                <h5 className="view-value mb-0">{medication?.refillCount}</h5>
              </div>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Provider Name : </p>
                <h5 className="view-value mb-0">{medication?.provider}</h5>
              </div>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Expiration Date : </p>
                <h5 className="view-value mb-0">
                  {formatDateToMMDDYYYY(medication?.expirationDate)}
                </h5>
              </div>
              {medication?.instruction && (
                <>
                  {medication?.instruction.map((instruction, idx) => (
                    <div
                      className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3"
                      key={idx + 1}
                    >
                      <p className="view-label mb-1">
                        Instruction {idx + 1} :{" "}
                      </p>
                      <h5 className="view-value mb-0">
                        {instruction.instruction}
                      </h5>
                    </div>
                  ))}
                </>
              )}
              <>
                {medication?.otherInstruction && (
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Other Instruction : </p>
                    <h5 className="view-value mb-0">
                      {medication?.otherInstruction}
                    </h5>
                  </div>
                )}
              </>
              <>
                {medication?.medicationStatus &&
                  medication?.medicationStatus.length > 0 && (
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Time : </p>
                      <h5 className="view-value mb-0">
                        {medication.medicationStatus[0].timeStatus
                          ?.map((item) =>
                            convertTimeFormat(`${item.time}`, hoursFormat),
                          )
                          .join(" , ")}
                      </h5>
                    </div>
                  )}
              </>
            </div>
          ))}

          {noteData?.medication?.some(
            (medication) => medication?.status === "DisContinue",
          ) && (
            <Form.Label className="fw-bold w-100">
              Discontinued Medication
            </Form.Label>
          )}

          {noteData?.medication?.map((medication, index) => (
            <>
              {medication?.status === "DisContinue" && (
                <div key={medication?._id}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Medication Name : </p>
                    <h5 className="view-value mb-0">{medication?.name}</h5>
                  </div>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Refill Count : </p>
                    <h5 className="view-value mb-0">
                      {medication?.refillCount}
                    </h5>
                  </div>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Provider Name : </p>
                    <h5 className="view-value mb-0">{medication?.provider}</h5>
                  </div>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Expiration Date : </p>
                    <h5 className="view-value mb-0">
                      {formatDateToMMDDYYYY(medication?.expirationDate)}
                    </h5>
                  </div>
                  {medication?.instruction && (
                    <>
                      {medication?.instruction?.map(
                        (instruction, idx) =>
                          instruction.instruction && (
                            <div
                              className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3"
                              key={idx}
                            >
                              <p className="view-label mb-1">
                                Instruction {idx + 1} :
                              </p>
                              <h5 className="view-value mb-0">
                                {instruction.instruction}
                              </h5>
                            </div>
                          ),
                      )}
                    </>
                  )}

                  <>
                    {medication?.other && (
                      <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Other Instruction : </p>
                        <h5 className="view-value mb-0">{medication?.other}</h5>
                      </div>
                    )}
                  </>
                  <>
                    {medication?.medicationStatus &&
                      medication?.medicationStatus.length > 0 && (
                        <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                          <p className="view-label mb-1">Time : </p>
                          <h5 className="view-value mb-0">
                            {medication.medicationStatus[0].timeStatus
                              ?.map((item) => `${item.time}`)
                              .join(", ")}
                          </h5>
                        </div>
                      )}
                  </>
                </div>
              )}
            </>
          ))}
        </div>
      </ModalBody>
      <Modal.Footer className="justify-content-center">
        <Button className="theme-button" onClick={print}>
          PRINT
        </Button>
        <Button className="theme-button-outline" onClick={props.onHide}>
          CANCEL
        </Button>
      </Modal.Footer>
    </div>
  );
};

export default EmployeeMedicationModalView;
