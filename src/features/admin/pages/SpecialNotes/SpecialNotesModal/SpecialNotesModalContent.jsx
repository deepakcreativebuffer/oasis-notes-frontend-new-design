import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import FirstAidChecklistCreateUpdate from "../FirstAidChecklistModal/FirstAidChecklistCreateUpdate";
import FireEquipmentCreateUpdate from "../FireEquipmentModal/FireEquipmentCreateUpdate";
import EvacuationAndFireDrillCreateUpdate from "../EvacuationAndFireDrillModal/EvacuationAndFireDrillCreateUpdate";
import EvacuationAndFireDrillView from "../EvacuationAndFireDrillModal/EvacuationAndFireDrillView";
import DisasterDrillCreateUpdate from "../DisasterDrillModal/DisasterDrillCreateUpdate";
import DisasterDrillView from "../DisasterDrillModal/DisasterDrillView";
import WeeklyVehicleInspectionCreateUpdate from "../WeeklyVehicleInspectionModal/WeeklyVehicleInspectionCreateUpdate";
import WeeklyVehicleInspectionView from "../WeeklyVehicleInspectionModal/WeeklyVehicleInspectionView";
import MonthlyVehicleInspectionCreateUpdate from "../MonthlyVehicleInspectionModal/MonthlyVehicleInspectionCreateUpdate";
import MonthlyVehicleInspectionView from "../MonthlyVehicleInspectionModal/MonthlyVehicleInspectionView";
import VanEmergencyCreateUpdate from "../VanEmergencyModal/VanEmergencyCreateUpdate";
import VanEmergencyView from "../VanEmergencyModal/VanEmergencyView";
import InfectousDataCreateUpdate from "../InfectousDataModal/InfectousDataCreateUpdate";
import InfectousDataView from "../InfectousDataModal/InfectousDataView";
import DisasterPlanReviewCreateUpdate from "../DisasterPlanReviewModal/DisasterPlanReviewCreateUpdate";
import DisasterPlanReviewView from "../DisasterPlanReviewModal/DisasterPlanReviewView";
import QualityManagementCreateUpdate from "../QualityManagementModal/QualityManagementCreateUpdate";
import QualityManagementView from "../QualityManagementModal/QualityManagementView";
import FirstAidChecklistView from "../FirstAidChecklistModal/FirstAidChecklistView";
import FireEquipmentView from "../FireEquipmentModal/FireEquipmentView";
import RefrigeratorTemperatureCreateUpdate from "../RefrigeratorTemperatureModal/RefrigeratorTemperatureCreateUpdate";
import RefrigeratorTemperatureView from "../RefrigeratorTemperatureModal/RefrigeratorTemperatureView";
import WaterTemperatureCreateUpdate from "../WaterTemperatureModal/WaterTemperatureCreateUpdate";
import WaterTemperatureView from "../WaterTemperatureModal/WaterTemperatureView";
import RefrigeratorTemperatureRefEditForm from "./RefrigeratorTemperatureRefEditForm";

const SpecialNotesModalContent = ({
  addContactBtn,
  onHide,
  handleHideAndDateReset,
  filterApply,
  modalStartDate,
  setModalStartDate,
  modalEndDate,
  setModalEndDate,
  submitHandler,
  formState,
  setFormState,
  months3,
  vanEmergency,
  handleQuantityChangeSub,
  handleDateChanger,
  handleQuantityChangeAdd,
  month2,
  handleMonthChange,
  checklistData,
  setChecklistData,
  handleCountChangexyz,
  handleMonthChangexyz,
  addRow,
  deleteRow,
  handleStaffChange,
  currentUser,
  signHandler,
  employeeSignature,
  employeeSignatureDate,
  employeeSignatureTime,
  hoursFormat,
  adminSignature,
  adminDateSigned,
  adminSignedTime,
  removeaddStaff,
  addStaff,
  signers,
  editStatus,
  setSigners,
  isSubmitEnabled,
  itemCounts,
  handleSubmit51,
  fireman,
  setFireman,
  handleAlarmChange,
  handleAddAlarm,
  handleExtinguisherChange,
  handleAddExtinguisher,
  handleStaffChange3,
  removeaddStaff3,
  addStaff3,
  componentRef,
  print,
  print1,
  print2,
  employeeOptions,
  submitHandler3,
  fireDrill,
  setFireDrill,
  counte,
  setCounte,
  residentsOptions,
  handleSubmit4,
  disasterDrillData,
  setDisasterDrillData,
  handleSubmit5,
  weeklyVehicle,
  setWeeklyVehicle,
  handleSubmit10,
  vehicleInspectionData,
  setVehicleInspectionData,
  submitHandler5,
  emergencyData,
  setEmergencyData,
  handleSubmit6,
  infectiousData,
  setInfectiousData,
  handleInputChange6,
  handleAddRow,
  handleDeleteRow,
  handleSubmit7,
  disasterPlanData,
  setDisasterPlanData,
  handleSubmit8,
  qualitymanagement,
  setQualityManagement,
  formGroups,
  handleAddFormGroup,
  handleChangeFormGroup,
  removeFormGroup,
  handleSubmitRef2,
  handleSubmitRef,
  refrigeratorData,
  setRefrigeratorData,
  handleTemperatureChange,
  addTemperature,
  removeRefrigratorTemp,
  handleSubmitWaterTemp,
  handleWaterTempSubmit,
  waterData,
  setWaterData,
  handleWaterTemperatureChange,
  removeWaterTemp,
  addWaterTemperature,
  open,
  setOpen,
  openSigner,
  setOpenSigner,
  openAdmin,
  setOpenAdmin,
  profileInfo,
  setEmployeeSignature,
  editSignHandler,
  setEmployeeSignatureDate,
  editDateHandler,
  setSignerSignature,
  setSignerDate,
  setSignerTime,
  setAdminSignature,
  setAdminDateSigned,
  setAdminSignedTime,
  printRef,
  patientDetail,
  patientId,
  residentName,
  dateOfBirth,
  setPatientId,
  setResidentName,
  setPatientDetail,
  facilitiesList,
}) => {
  return (
    <>
      {addContactBtn === "filter" ? (
        <>
          <Modal.Header closeButton onHide={onHide}>
            <h5 className="mb-0 fw-bold">Filter</h5>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col xs={12} md={12}>
                  <p className="text-black font-semibold">
                    Created On ( Date Range )
                  </p>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={6} md={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="w-full font-bold">From </Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(modalStartDate)}
                      onChange={(selectedDate) =>
                        setModalStartDate(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            modalStartDate
                              ? formatDateToMMDDYYYY(modalStartDate)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="w-full font-bold">To </Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(modalEndDate)}
                      onChange={(selectedDate) =>
                        setModalEndDate(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            modalEndDate
                              ? formatDateToMMDDYYYY(modalEndDate)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button
              className="theme-button"
              onClick={() => {
                filterApply(onHide);
              }}
            >
              APPLY
            </Button>
            <Button
              className="theme-button-outline"
              onClick={() => handleHideAndDateReset(onHide)}
            >
              CANCEL
            </Button>
          </Modal.Footer>
        </>
      ) : addContactBtn === "add" ? (
        <FirstAidChecklistCreateUpdate
          submitHandler={submitHandler}
          formState={formState}
          setFormState={setFormState}
          facilitiesList={facilitiesList}
          months3={months3}
          vanEmergency={vanEmergency}
          handleQuantityChangeSub={handleQuantityChangeSub}
          handleDateChanger={handleDateChanger}
          handleQuantityChangeAdd={handleQuantityChangeAdd}
          month2={month2}
          handleMonthChange={handleMonthChange}
          checklistData={checklistData}
          setChecklistData={setChecklistData}
          handleCountChangexyz={handleCountChangexyz}
          handleMonthChangexyz={handleMonthChangexyz}
          addRow={addRow}
          deleteRow={deleteRow}
          handleStaffChange={handleStaffChange}
          currentUser={currentUser}
          signHandler={signHandler}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          removeaddStaff={removeaddStaff}
          addStaff={addStaff}
          signers={signers}
          editStatus={editStatus}
          setSigners={setSigners}
          isSubmitEnabled={isSubmitEnabled}
          onHide={onHide}
          count1={itemCounts.count1}
          count2={itemCounts.count2}
          count3={itemCounts.count3}
          count4={itemCounts.count4}
          count5={itemCounts.count5}
          count6={itemCounts.count6}
          count7={itemCounts.count7}
          count8={itemCounts.count8}
          count9={itemCounts.count9}
          count10={itemCounts.count10}
        />
      ) : addContactBtn === "fire" ? (
        <FireEquipmentCreateUpdate
          handleSubmit51={handleSubmit51}
          facilitiesList={facilitiesList}
          fireman={fireman}
          setFireman={setFireman}
          handleAlarmChange={handleAlarmChange}
          handleAddAlarm={handleAddAlarm}
          handleExtinguisherChange={handleExtinguisherChange}
          handleAddExtinguisher={handleAddExtinguisher}
          handleStaffChange3={handleStaffChange3}
          currentUser={currentUser}
          removeaddStaff3={removeaddStaff3}
          addStaff3={addStaff3}
          signHandler={signHandler}
          editStatus={editStatus}
          signers={signers}
          setSigners={setSigners}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          isSubmitEnabled={isSubmitEnabled}
          onHide={onHide}
        />
      ) : addContactBtn === "eva" ? (
        <EvacuationAndFireDrillCreateUpdate
          submitHandler3={submitHandler3}
          facilitiesList={facilitiesList}
          fireDrill={fireDrill}
          setFireDrill={setFireDrill}
          employeeOptions={employeeOptions}
          residentsOptions={residentsOptions}
          counte={counte}
          setCounte={setCounte}
          currentUser={currentUser}
          signHandler={signHandler}
          editStatus={editStatus}
          signers={signers}
          setSigners={setSigners}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          isSubmitEnabled={isSubmitEnabled}
          onHide={onHide}
        />
      ) : addContactBtn === "addEv" ? (
        <EvacuationAndFireDrillView
          facilitiesList={facilitiesList}
          submitHandler3={submitHandler3}
          componentRef={componentRef}
          vanEmergency={vanEmergency}
          print={print}
          printRef={printRef}
          employeeOptions={employeeOptions}
          residentsOptions={residentsOptions}
          signers={signers}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "dis" ? (
        <DisasterDrillCreateUpdate
          handleSubmit4={handleSubmit4}
          facilitiesList={facilitiesList}
          disasterDrillData={disasterDrillData}
          setDisasterDrillData={setDisasterDrillData}
          employeeOptions={employeeOptions}
          currentUser={currentUser}
          isSubmitEnabled={isSubmitEnabled}
          signHandler={signHandler}
          editStatus={editStatus}
          signers={signers}
          setSigners={setSigners}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "addEvd" ? (
        <DisasterDrillView
          facilitiesList={facilitiesList}
          handleSubmit4={handleSubmit4}
          componentRef={componentRef}
          vanEmergency={vanEmergency}
          print={print}
          printRef={printRef}
          employeeOptions={employeeOptions}
          signers={signers}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "wee" ? (
        <WeeklyVehicleInspectionCreateUpdate
          handleSubmit5={handleSubmit5}
          facilitiesList={facilitiesList}
          weeklyVehicle={weeklyVehicle}
          setWeeklyVehicle={setWeeklyVehicle}
          currentUser={currentUser}
          isSubmitEnabled={isSubmitEnabled}
          signHandler={signHandler}
          editStatus={editStatus}
          signers={signers}
          setSigners={setSigners}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "wee1" ? (
        <WeeklyVehicleInspectionView
          facilitiesList={facilitiesList}
          handleSubmit5={handleSubmit5}
          componentRef={componentRef}
          vanEmergency={vanEmergency}
          print2={print2}
          printRef={printRef}
          employeeOptions={employeeOptions}
          signers={signers}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "veh" ? (
        <MonthlyVehicleInspectionCreateUpdate
          handleSubmit10={handleSubmit10}
          facilitiesList={facilitiesList}
          vehicleInspectionData={vehicleInspectionData}
          setVehicleInspectionData={setVehicleInspectionData}
          vanEmergency={vanEmergency}
          currentUser={currentUser}
          isSubmitEnabled={isSubmitEnabled}
          signHandler={signHandler}
          editStatus={editStatus}
          signers={signers}
          setSigners={setSigners}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "mvi" ? (
        <MonthlyVehicleInspectionView
          facilitiesList={facilitiesList}
          handleSubmit10={handleSubmit10}
          componentRef={componentRef}
          vanEmergency={vanEmergency}
          print2={print2}
          printRef={printRef}
          signers={signers}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "van" ? (
        <VanEmergencyCreateUpdate
          submitHandler5={submitHandler5}
          facilitiesList={facilitiesList}
          emergencyData={emergencyData}
          setEmergencyData={setEmergencyData}
          dateOfBirth={dateOfBirth}
          setPatientId={setPatientId}
          setResidentName={setResidentName}
          setPatientDetail={setPatientDetail}
          patientDetail={patientDetail}
          vanEmergency={vanEmergency}
          currentUser={currentUser}
          isSubmitEnabled={isSubmitEnabled}
          signHandler={signHandler}
          editStatus={editStatus}
          signers={signers}
          setSigners={setSigners}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "vanemer" ? (
        <VanEmergencyView
          facilitiesList={facilitiesList}
          submitHandler5={submitHandler5}
          componentRef={componentRef}
          vanEmergency={vanEmergency}
          print2={print2}
          printRef={printRef}
          employeeOptions={employeeOptions}
          signers={signers}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          patientDetail={patientDetail}
          onHide={onHide}
        />
      ) : addContactBtn === "dinfectousData" ? (
        <InfectousDataCreateUpdate
          handleSubmit6={handleSubmit6}
          facilitiesList={facilitiesList}
          infectiousData={infectiousData}
          handleInputChange6={handleInputChange6}
          handleAddRow={handleAddRow}
          handleDeleteRow={handleDeleteRow}
          currentUser={currentUser}
          isSubmitEnabled={isSubmitEnabled}
          signHandler={signHandler}
          editStatus={editStatus}
          signers={signers}
          setSigners={setSigners}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "inf" ? (
        <InfectousDataView
          facilitiesList={facilitiesList}
          handleSubmit6={handleSubmit6}
          componentRef={componentRef}
          vanEmergency={vanEmergency}
          print2={print2}
          printRef={printRef}
          employeeOptions={employeeOptions}
          signers={signers}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "disasterPlan" ? (
        <DisasterPlanReviewCreateUpdate
          handleSubmit7={handleSubmit7}
          facilitiesList={facilitiesList}
          disasterPlanData={disasterPlanData}
          setDisasterPlanData={setDisasterPlanData}
          employeeOptions={employeeOptions}
          currentUser={currentUser}
          isSubmitEnabled={isSubmitEnabled}
          signHandler={signHandler}
          editStatus={editStatus}
          signers={signers}
          setSigners={setSigners}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "addEvdd" ? (
        <DisasterPlanReviewView
          facilitiesList={facilitiesList}
          handleSubmit7={handleSubmit7}
          disasterPlanData={disasterPlanData}
          componentRef={componentRef}
          vanEmergency={vanEmergency}
          print2={print2}
          printRef={printRef}
          employeeOptions={employeeOptions}
          signers={signers}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "quality" ? (
        <QualityManagementCreateUpdate
          handleSubmit8={handleSubmit8}
          facilitiesList={facilitiesList}
          qualitymanagement={qualitymanagement}
          setQualityManagement={setQualityManagement}
          handleAddFormGroup={handleAddFormGroup}
          formGroups={formGroups}
          removeFormGroup={removeFormGroup}
          handleChangeFormGroup={handleChangeFormGroup}
          currentUser={currentUser}
          isSubmitEnabled={isSubmitEnabled}
          signHandler={signHandler}
          editStatus={editStatus}
          signers={signers}
          setSigners={setSigners}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "qmanagement" ? (
        <QualityManagementView
          facilitiesList={facilitiesList}
          handleSubmit8={handleSubmit8}
          componentRef={componentRef}
          vanEmergency={vanEmergency}
          print2={print2}
          printRef={printRef}
          signers={signers}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "addE" ? (
        <FirstAidChecklistView
          facilitiesList={facilitiesList}
          month2={month2}
          componentRef={componentRef}
          vanEmergency={vanEmergency}
          print1={print1}
          printRef={printRef}
          signers={signers}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "free" ? (
        <FireEquipmentView
          facilitiesList={facilitiesList}
          handleSubmit51={handleSubmit51}
          componentRef={componentRef}
          vanEmergency={vanEmergency}
          print={print}
          printRef={printRef}
          signers={signers}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "ref" ? (
        <RefrigeratorTemperatureCreateUpdate
          handleSubmitRef2={handleSubmitRef2}
          facilitiesList={facilitiesList}
          handleSubmitRef={handleSubmitRef}
          refrigeratorData={refrigeratorData}
          setRefrigeratorData={setRefrigeratorData}
          handleTemperatureChange={handleTemperatureChange}
          addTemperature={addTemperature}
          removeRefrigratorTemp={removeRefrigratorTemp}
          currentUser={currentUser}
          isSubmitEnabled={isSubmitEnabled}
          signHandler={signHandler}
          editStatus={editStatus}
          signers={signers}
          setSigners={setSigners}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "refedit" ? (
        <RefrigeratorTemperatureRefEditForm
          vanEmergency={vanEmergency}
          handleSubmitRef={handleSubmitRef}
          refrigeratorData={refrigeratorData}
          setRefrigeratorData={setRefrigeratorData}
          handleTemperatureChange={handleTemperatureChange}
          addTemperature={addTemperature}
          editStatus={editStatus}
          isSubmitEnabled={isSubmitEnabled}
          currentUser={currentUser}
          employeeSignature={employeeSignature}
          onHide={onHide}
        />
      ) : addContactBtn === "refView" ? (
        <RefrigeratorTemperatureView
          facilitiesList={facilitiesList}
          handleSubmit51={handleSubmit51}
          componentRef={componentRef}
          vanEmergency={vanEmergency}
          print={print}
          printRef={printRef}
          employeeOptions={employeeOptions}
          signers={signers}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "waterTemp" ? (
        <WaterTemperatureCreateUpdate
          handleSubmitWaterTemp={handleSubmitWaterTemp}
          facilitiesList={facilitiesList}
          handleWaterTempSubmit={handleWaterTempSubmit}
          waterData={waterData}
          setWaterData={setWaterData}
          handleWaterTemperatureChange={handleWaterTemperatureChange}
          removeWaterTemp={removeWaterTemp}
          addWaterTemperature={addWaterTemperature}
          currentUser={currentUser}
          isSubmitEnabled={isSubmitEnabled}
          signHandler={signHandler}
          editStatus={editStatus}
          signers={signers}
          setSigners={setSigners}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : addContactBtn === "waterView" ? (
        <WaterTemperatureView
          facilitiesList={facilitiesList}
          handleSubmit51={handleSubmit51}
          componentRef={componentRef}
          vanEmergency={vanEmergency}
          print={print}
          printRef={printRef}
          employeeOptions={employeeOptions}
          signers={signers}
          employeeSignature={employeeSignature}
          employeeSignatureDate={employeeSignatureDate}
          employeeSignatureTime={employeeSignatureTime}
          hoursFormat={hoursFormat}
          adminSignature={adminSignature}
          adminDateSigned={adminDateSigned}
          adminSignedTime={adminSignedTime}
          onHide={onHide}
        />
      ) : null}
    </>
  );
};

export default SpecialNotesModalContent;
