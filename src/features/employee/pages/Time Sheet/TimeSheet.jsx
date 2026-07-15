/* eslint-disable no-unused-vars */
/** @format */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { timesheetService } from "@/features/shared/services";
import {
  Button,
  Container,
  Form,
  Table,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { BorderlessInput, DefaultInput } from "@/utils/Makers";
import { ClipLoader } from "react-spinners";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  AddSignature,
  convertTimeFormat,
  formatDateforTimeSheet,
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import "./Styles.css";
import SignerEmployee from "@/features/shared/ui/Search/SignerEmployee.jsx";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import EmployeeComponent from "@/features/shared/ui/Search/EmployeeComponent";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker.jsx";
import { ROLES } from "@/features/shared/constants";
import { useFacilities } from "@shared/hooks";
import { showNotification } from "@/utils";
const TimeSheet = () => {
  const { employeeId } = useParams();
  const profileUser = useSelector(userProfile);
  const hoursFormat = profileUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [initialStartDate, setInitialStartDate] = useState("");
  const [initialEndDate, setInitialEndDate] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [registeredHours, setRegisteredHours] = useState(0);
  const [otHours, setOtHours] = useState(0);
  const [holiday, setHoliday] = useState(0);
  const [total, setTotal] = useState(0);
  const [managerName, setManagerName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeeDate, setEmployeeDate] = useState("");
  const [employeeTime, setEmployeeTime] = useState("");
  const facilities = useFacilities();
  const facilityList = useMemo(
    () => ({
      data: facilities,
    }),
    [facilities],
  );
  const [selectedFacility, setSelectedFacility] = useState("");
  const [isFacilityData, setIsFacilityData] = useState(false);
  const [entries, setEntries] = useState({});
  const [currentEntry, setCurrentEntry] = useState({
    clockIn: "",
    clockOut: "",
  });
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [employeeProfile, setEmployeeProfile] = useState({});
  const [signer, setSigner] = useState(null);
  const [signersData, setSignersData] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [employeeid, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeData, setEmployeeData] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState();
  const [changeWeekStartDate, setChangeWeekStartDate] = useState("");
  const [changeWeekEndDate, setChangeWeekEndDate] = useState("");
  const fetchHandler = useCallback(
    (startDate, endDate, facilityId) => {
      const facility_id = facilityId || selectedFacility;
      timesheetService.getTimeSheet({
        isAdmin: profileUser?.userType === ROLES.ADMIN,
        employeeid,
        routeEmployeeId: employeeId,
        startDate: startDate
          ? formatDateToMMDDYYYY(startDate)
          : formatDateToMMDDYYYY(initialStartDate),
        endDate: endDate
          ? formatDateToMMDDYYYY(endDate)
          : formatDateToMMDDYYYY(initialEndDate),
        facilityId: facility_id,
        setResponse: setData,
        setErrorMessage: setError,
        setLoading,
      });
    },
    [
      employeeId,
      employeeid,
      initialEndDate,
      initialStartDate,
      profileUser?.userType,
      selectedFacility,
    ],
  );
  const handleAddHoursClick = (e, itemIndex, shiftIndex) => {
    e.preventDefault();
    setSelectedDay({
      itemIndex,
      shiftIndex,
    });
    setCurrentEntry({
      clockIn: "",
      clockOut: "",
    });
  };
  const handleEditHoursClick = (
    e,
    itemIndex,
    shiftIndex,
    clockIn,
    clockOut,
  ) => {
    e.preventDefault();
    setSelectedDay({
      itemIndex,
      shiftIndex,
    });
    setCurrentEntry({
      clockIn,
      clockOut,
    });
  };
  const handleSaveClick = async (date, shiftId, staffScheduleId) => {
    setEntries({
      ...currentEntry,
      shiftId,
      staffScheduleId,
    });
    const payload = {
      clockIn: currentEntry.clockIn,
      clockOut: currentEntry.clockOut,
      shiftId,
      staffScheduleId,
    };
    await timesheetService.updateShiftTime(payload, {
      isAdmin: profileUser?.userType === ROLES.ADMIN,
      employeeId: employeeid,
      setLoading,
      successMsg: "Updated Shift Time !",
    });
    setCurrentEntry({
      clockIn: "",
      clockOut: "",
    });
    setSelectedDay(null);
    const [startDate, endDate] = selectedWeek.split(" - ");
    fetchHandler(startDate, endDate);
  };
  useEffect(() => {
    const [startDate, endDate] = selectedWeek.split(" - ");
    if (startDate && endDate && selectedFacility) {
      fetchHandler(startDate, endDate, selectedFacility);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeid]);
  const payload = {
    employeeId: employeeid || employeeProfile?.data?._id,
    year,
    month,
    employeeName: employeeName || employeeProfile?.data?.fullName,
    employeeSignature,
    employeeSignatureDate: employeeDate,
    employeeSignatureTime: employeeTime,
    registeredHours,
    otHours,
    holiday,
    total,
    managerName,
    signers: signer && [
      {
        signerId: signer.value,
        name: signer.label,
        signature: "",
        dateSigned: "",
        signedTime: "",
      },
    ],
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    timesheetService.createTimeSheet(payload, {
      setLoading,
      successMsg: "Time sheet created !",
    });
  };
  const getProfile = async () => {
    timesheetService.getProfile({
      isAdmin: profileUser?.userType === ROLES.ADMIN,
      setResponse: setEmployeeProfile,
    });
  };
  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchHandlerSigner = (startDate, endDate) => {
    timesheetService.getTimeSheetEmployees({
      setResponse: setSignersData,
    });
  };
  useEffect(() => {
    if (data) {
      setRegisteredHours(data?.data?.regularHours);
      setOtHours(data?.data?.overtimeHours);
      setTotal(data?.data?.week1TotalHr + data?.data?.week2TotalHr);
    }
  }, [data]);
  const uniqueScheduleTypes = new Set();
  data?.data?.scheduleData?.forEach((item) => {
    item.work.forEach((workItem) => {
      uniqueScheduleTypes.add(workItem.type);
    });
  });
  const schedules = {};
  uniqueScheduleTypes.forEach((type) => {
    schedules[type] =
      data?.data?.scheduleData?.map((item) => {
        return item.work.find((workItem) => workItem.type === type) || {};
      }) || [];
  });
  const scheduleData = useMemo(() => {
    return data?.data?.scheduleData || [];
  }, [data?.data?.scheduleData]);
  function getWeekRange(startDate, startOfWeek = 1) {
    const dayOfWeek = startDate.getUTCDay();
    const diff = (dayOfWeek - startOfWeek + 7) % 7;
    const weekStart = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate() - diff,
      ),
    );
    const weekEnd = new Date(
      Date.UTC(
        weekStart.getUTCFullYear(),
        weekStart.getUTCMonth(),
        weekStart.getUTCDate() + 6,
      ),
    );
    return {
      startDate: weekStart,
      endDate: weekEnd,
    };
  }
  const generateWeekOptions = (year) => {
    const startOfWeek =
      Number(profileUser?.adminId?.payPeriodStart) ||
      Number(profileUser?.payPeriodStart) ||
      1;
    let date = new Date(Date.UTC(year, 0, 1));
    let weekArray = [];
    const currentDate = new Date();
    let currentWeek = "";
    let foundCurrentWeek = false;
    while (date.getUTCFullYear() === year) {
      const weekRange = getWeekRange(date, startOfWeek);
      const weekStart = new Date(weekRange.startDate || date);
      const weekEnd = new Date(weekRange.endDate || date);
      const weekValue = `${weekStart.toISOString().split("T")[0]} - ${weekEnd.toISOString().split("T")[0]}`;
      const weekLabel = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
      if (currentDate >= weekStart && currentDate <= weekEnd) {
        currentWeek = weekValue;
        foundCurrentWeek = true;
        weekArray.unshift({
          start: weekStart,
          end: weekEnd,
          label: `${weekLabel} (In Progress)`,
          value: weekValue,
        });
      } else if (currentDate > weekEnd) {
        weekArray.unshift({
          start: weekStart,
          end: weekEnd,
          label: weekLabel,
          value: weekValue,
        });
      }
      date = new Date(
        Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 7,
        ),
      ); // Use UTC
    }
    const formatedWeekStart = formatDateforTimeSheet(
      new Date(weekArray[0].start),
    );
    const formatedWeekEnd = formatDateforTimeSheet(new Date(weekArray[0].end));
    setInitialStartDate(formatedWeekStart);
    setInitialEndDate(formatedWeekEnd);
    setWeeks(weekArray.slice(0, 10));
    if (!selectedWeek) {
      if (foundCurrentWeek) {
        setSelectedWeek(currentWeek);
      } else if (weekArray.length > 0) {
        setSelectedWeek(weekArray[0].value);
      }
    }
  };
  useEffect(() => {
    generateWeekOptions(year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, profileUser]);
  const formatDate = (date) => {
    return new Date(
      date.getTime() + date.getTimezoneOffset() * 60000,
    ).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const handleWeekChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedWeek(selectedValue);
    const [startDate, endDate] = event.target.value.split(" - ");
    setChangeWeekStartDate(startDate);
    setChangeWeekEndDate(endDate);
    fetchHandler(startDate, endDate, selectedFacility);
  };
  const isButtonEnabled = useMemo(() => {
    return scheduleData.some((day) =>
      day.work.some((shift) => shift.clockIn && shift.clockOut),
    );
  }, [scheduleData]);

  // Call fetchHandler when the dropdown value is selected
  const handleSelect = (e) => {
    if (profileUser?.userType === ROLES.ADMIN && !employeeid) {
      showNotification({
        message: "Select Employee First",
        type: "danger",
      });
    }
    const facilityId = e.target.value;
    setSelectedFacility(facilityId);
    setIsFacilityData(false);
    if (facilityId) {
      if (changeWeekStartDate && changeWeekEndDate) {
        fetchHandler(changeWeekStartDate, changeWeekEndDate, facilityId);
      } else if (employeeProfile?.data?._id || employeeId) {
        fetchHandler(undefined, undefined, facilityId);
        fetchHandlerSigner();
      }
      setIsFacilityData(true);
    }
  };
  return (
    <>
      <AddSignature
        show={open}
        setValue={setEmployeeSignature}
        setDate={setEmployeeDate}
        setTime={setEmployeeTime}
      />

      <NavWrapper title={"Time Sheet"} isArrow={true} />

      <Container>
        <Form>
          <Row>
            <Col xs={12} md={12} lg={6} className="mb-3">
              <Card body className="mb-3 h-100">
                <Row>
                  <Col xs={12} md={12}>
                    {useSelector(userProfile)?.userType === ROLES.ADMIN ? (
                      <Form.Group className="mb-3">
                        <EmployeeComponent
                          MainPatientId={setEmployeeId}
                          setWholeData={setEmployeeData}
                          MainResidentName={setEmployeeName}
                        />
                      </Form.Group>
                    ) : (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Employee Name:
                          </Form.Label>
                          {employeeProfile?.data && (
                            <DefaultInput
                              value={`${employeeProfile?.data?.firstName} ${employeeProfile?.data?.lastName}`}
                              isBots={false}
                            />
                          )}
                        </Form.Group>
                      </>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6} xl={6}>
                    <Form.Group className="d-flex flex-column gap-2 align-items-start mb-1">
                      <Form.Label className="fw-bold mb-md-0">
                        Facility
                      </Form.Label>
                      <Form.Select
                        size="sm"
                        value={selectedFacility}
                        onChange={handleSelect}
                        disabled={
                          profileUser?.userType === ROLES.ADMIN && !employeeid
                        }
                      >
                        <option value="" disabled>
                          Select a Facility
                        </option>
                        {facilityList?.data?.map((facility) => (
                          <option key={facility._id} value={facility._id}>
                            {`${facility?.name}`}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12}>
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        Employee Signature :
                      </Form.Label>
                      <Row>
                        <Col xs={12} md={12} lg={5}>
                          {(data?.data?.findStaffScheduleSigner
                            ?.employeeSignature.length === 0 ||
                            !data?.data?.findStaffScheduleSigner
                              ?.employeeSignature) && (
                            <Button
                              type="button"
                              onClick={() => setOpen(true)}
                              className="theme-button"
                              size="sm"
                            >
                              {" "}
                              SAVED AND SIGNED
                            </Button>
                          )}
                        </Col>
                        <Col xs={12} md={12} lg={7}>
                          {signatureFormat({
                            sign:
                              data?.data?.findStaffScheduleSigner
                                ?.employeeSignature || employeeSignature,
                            date:
                              data?.data?.findStaffScheduleSigner
                                ?.employeeDate || employeeDate,
                            time:
                              data?.data?.findStaffScheduleSigner
                                ?.employeeTime || employeeTime,
                            hoursFormat,
                          })}
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xs={12} md={12} lg={6}>
              <Card body className="mb-3 bg-[rgb(255_0_0_/_13%)]">
                <Row className="mb-2">
                  <Col xs={12} md={12}>
                    <Form.Label className="fw-bold h5">
                      Office Use Only
                    </Form.Label>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col xs={6} sm={5}>
                    <Form.Label className="fw-bold">Reg. Hours</Form.Label>
                  </Col>
                  <Col xs={6} sm={7}>
                    <BorderlessInput
                      setState={setRegisteredHours}
                      value={registeredHours && registeredHours}
                      type="number"
                      disabled={true}
                    />
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col xs={6} sm={5}>
                    <Form.Label className="fw-bold">O.T Hours</Form.Label>
                  </Col>
                  <Col xs={6} sm={7}>
                    <BorderlessInput
                      setState={setOtHours}
                      value={otHours}
                      type="number"
                    />
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col xs={6} sm={5}>
                    <Form.Label className="fw-bold">Holiday</Form.Label>
                  </Col>
                  <Col xs={6} sm={7}>
                    <BorderlessInput
                      setState={setHoliday}
                      value={holiday}
                      type="number"
                    />
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col xs={6} sm={5}>
                    <Form.Label className="fw-bold">Total</Form.Label>
                  </Col>
                  <Col xs={6} sm={7}>
                    <BorderlessInput
                      setState={setTotal}
                      value={total}
                      type="number"
                      disabled={true}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          {isFacilityData && (
            <Row>
              <Col xs={12} md={6} xl={6}>
                <Form.Group className="my-3">
                  <Form.Label className="fw-bold">Week</Form.Label>
                  <Form.Select
                    required
                    value={selectedWeek}
                    onChange={handleWeekChange}
                  >
                    {weeks.map((week, index) => (
                      <option
                        key={index}
                        value={`${week.start.toISOString().split("T")[0]} - ${week.end.toISOString().split("T")[0]}`}
                      >
                        {week.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          )}

          {data?.data?.scheduleData?.length > 0 && isFacilityData ? (
            <>
              <div className="week-section">
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th className="headTitle">Day</th>
                      <th className="headTitle">Date</th>
                      <th className="headTitle">Shift</th>
                      <th className="headTitle">Hours</th>
                      <th className="headTitle">TOTAL</th>
                      <th className="headTitle">Daily Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData?.map((item, itemIndex) => (
                      <tr key={`day-${item.date}-${itemIndex}`}>
                        <td className="timeDataTable">{item.weekday}</td>
                        <td className="timeDataTable">
                          {formatDateToMMDDYYYY(item.date)}
                        </td>
                        <td className="timeDataTable">
                          {item.work.map((value, index) => (
                            <>
                              <div
                                key={`shift-${itemIndex}-${index}`}
                                className={`${itemIndex > 0 ? "cellTable" : "cellTable_single"}`}
                              >
                                {convertTimeFormat(value.start, hoursFormat)}-{" "}
                                {convertTimeFormat(value.end, hoursFormat)}
                              </div>
                            </>
                          ))}
                        </td>
                        <td className="timeDataTable">
                          {item.work.map((value, shiftIndex) => (
                            <div
                              key={`shift-time-${shiftIndex}`}
                              className={`${itemIndex > 0 ? "cellTable" : "cellTable_single"}`}
                            >
                              <>
                                {value.clockIn && value.clockOut && (
                                  <div>
                                    {convertTimeFormat(
                                      value.clockIn,
                                      hoursFormat,
                                    )}{" "}
                                    -{" "}
                                    {convertTimeFormat(
                                      value.clockOut,
                                      hoursFormat,
                                    )}
                                  </div>
                                )}

                                {weeks.findIndex(
                                  (item) => item.value === selectedWeek,
                                ) < 2 &&
                                  selectedDay?.itemIndex === itemIndex &&
                                  selectedDay?.shiftIndex === shiftIndex && (
                                    <div className="add-hours-ui">
                                      <div className="timeBlock">
                                        <div className="timeFeild">
                                          <Form.Group className="d-flex flex-column flex-1">
                                            <Form.Label>Start Time:</Form.Label>

                                            <CustomTimePicker
                                              use24Hours={
                                                hoursFormat === "HH:mm"
                                              }
                                              value={
                                                currentEntry.clockIn
                                                  ? parseTimeStringToDate(
                                                      currentEntry.clockIn,
                                                    )
                                                  : null
                                              }
                                              onChange={(e, timeString) => {
                                                setCurrentEntry({
                                                  ...currentEntry,
                                                  clockIn:
                                                    parseTimeStringToDate(
                                                      timeString,
                                                    ),
                                                });
                                              }}
                                            />
                                          </Form.Group>
                                        </div>
                                        <div className="timeFeild">
                                          <Form.Group className="d-flex flex-column flex-1">
                                            <Form.Label>End Time:</Form.Label>

                                            <CustomTimePicker
                                              use24Hours={
                                                hoursFormat === "HH:mm"
                                              }
                                              value={
                                                currentEntry.clockOut
                                                  ? parseTimeStringToDate(
                                                      currentEntry.clockOut,
                                                    )
                                                  : null
                                              }
                                              onChange={(e, timeString) => {
                                                setCurrentEntry({
                                                  ...currentEntry,
                                                  clockOut:
                                                    parseTimeStringToDate(
                                                      timeString,
                                                    ),
                                                });
                                              }}
                                            />
                                          </Form.Group>
                                        </div>
                                      </div>
                                      <div className="btnTime">
                                        <Button
                                          onClick={() =>
                                            handleSaveClick(
                                              item.date,
                                              value.shiftId,
                                              value.staffScheduleId,
                                            )
                                          }
                                          className="mr-5 edit-time-btn"
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          onClick={() => setSelectedDay(null)}
                                          className="edit-time-btn-cancel"
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                {!loading &&
                                  weeks.findIndex(
                                    (item) =>
                                      item.value.trim() === selectedWeek.trim(),
                                  ) < 2 && (
                                    <>
                                      {value.clockIn && value.clockOut ? (
                                        <button
                                          className="addOn_btn"
                                          onClick={(e) =>
                                            handleEditHoursClick(
                                              e,
                                              itemIndex,
                                              shiftIndex,
                                              value.clockIn,
                                              value.clockOut,
                                            )
                                          }
                                        >
                                          <i className="fa-solid fa-edit" />{" "}
                                          <span>Edit </span>
                                        </button>
                                      ) : (
                                        <>
                                          <button
                                            className="addOn_btn"
                                            onClick={(e) =>
                                              handleAddHoursClick(
                                                e,
                                                itemIndex,
                                                shiftIndex,
                                              )
                                            }
                                          >
                                            <i className="fa-solid fa-add" />{" "}
                                            <span>Add hours</span>
                                          </button>
                                        </>
                                      )}
                                    </>
                                  )}
                              </>
                            </div>
                          ))}
                        </td>

                        <td className="timeDataTable">
                          {item?.work.map((value, index) => (
                            <>
                              <div
                                className={`${itemIndex > 0 ? "cellTable" : "cellTable_single"}`}
                              >
                                {value.timeTaken}
                              </div>
                            </>
                          ))}
                        </td>
                        <td className="timeDataTable">{item?.totalTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="payCheck">
                <span className="week1 mx-2 px-4">
                  WEEK 1 Total Hours : {data?.data?.week1TotalHr}
                </span>
                <span className="pay mx-2 px-4">
                  PAYCHECK Total Hours : $ {data?.data?.paycheckTotalHr}
                </span>
              </div>
            </>
          ) : (
            <Card body className="mb-3">
              <div className="error-msg">
                {(error && error) || "No Data Found Select Facility"}
              </div>
            </Card>
          )}

          <Row className="mt-3">
            <Col>
              {!!signersData?.data?.length &&
                !data?.data?.findStaffScheduleSigner?.signers?.length && (
                  <Form.Group>
                    <Form.Label className="fw-bold">Signer:</Form.Label>
                    <SignerEmployee
                      setValue={setSigner}
                      value={signer}
                      options={signersData}
                    />
                  </Form.Group>
                )}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              {data?.data?.findStaffScheduleSigner?.signers?.map(
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
          <Row className="mt-3 mt-md-5">
            <Col>
              <button
                disabled={!isButtonEnabled}
                className="employee_create_btn"
                onClick={submitHandler}
              >
                {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
              </button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: TimeSheet,
});
