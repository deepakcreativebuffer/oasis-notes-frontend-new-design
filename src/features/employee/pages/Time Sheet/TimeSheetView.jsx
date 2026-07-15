/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useState } from "react";
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
import { AddSignature, signatureFormat } from "@/utils/utils";
import "./Styles.css";
import SignerEmployee from "@/features/shared/ui/Search/SignerEmployee.jsx";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { ROLES } from "@/features/shared/constants";
import { logger } from "@/utils";
const TimeSheetView = () => {
  const profileUser = useSelector(userProfile);
  const hoursFormat = profileUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const { id, employeeId } = useParams();
  const [initialStartDate, setInitialStartDate] = useState("");
  const [initialEndDate, setInitialEndDate] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [employeeSignature, setEmployeeSignature] = useState([]);
  const [registeredHours, setRegisteredHours] = useState(0);
  const [otHours, setOtHours] = useState(0);
  const [holiday, setHoliday] = useState(0);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeeDate, setEmployeeDate] = useState("");
  const [employeeTime, setEmployeeTime] = useState("");
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
  const [signers, setSigners] = useState([]);
  const handleSaveClick = (date, shiftId, staffScheduleId) => {
    setEntries({
      ...currentEntry,
      shiftId,
      staffScheduleId,
    });
    const payload = {
      clockIn: `${date}T${currentEntry.clockIn}:00Z`,
      clockOut: `${date}T${currentEntry.clockOut}:00Z`,
      shiftId,
      staffScheduleId,
    };
    timesheetService.updateShiftEntry(payload, {
      setLoading,
      successMsg: "Updated Shift Time !",
    });
    setCurrentEntry({
      clockIn: "",
      clockOut: "",
    });
    setSelectedDay(null);
    fetchHandler();
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    timesheetService.signTimeSheet(
      employeeId || id,
      {
        signers,
      },
      {
        setLoading,
        successMsg: "Time sheet Signed !",
      },
    );
  };
  const getProfile = async () => {
    if (!employeeId)
      timesheetService.getProfile({
        isAdmin: profileUser?.userType === ROLES.ADMIN,
        setResponse: setEmployeeProfile,
      });
  };
  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [data, setData] = useState({});
  const [error, setError] = useState();
  const fetchHandler = (startDate, endDate) => {
    timesheetService.getTimeSheetView({
      employeeId,
      signerId: id,
      startDate: startDate || initialStartDate,
      endDate: endDate || initialEndDate,
      setResponse: setData,
      setErrorMessage: setError,
    });
  };
  useEffect(() => {
    if (data) {
      setRegisteredHours(data?.data?.regularHours);
      setOtHours(data?.data?.overtimeHours);
      setTotal(data?.data?.week1TotalHr + data?.data?.week2TotalHr);
      setSigners(data?.data?.signers);
      setEmployeeSignature(data?.data?.employeeSignature);
      setEmployeeDate(data?.data?.employeeDate);
      setEmployeeTime(data?.data?.employeeTime);
    }
    if (error) {
      logger.error("err", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  useEffect(() => {
    if (employeeProfile?.data?._id || employeeId) {
      const currentWeek = generateWeekOptions(new Date().getUTCFullYear());
      const [startDate, endDate] = currentWeek?.split(" - ");
      fetchHandler(startDate, endDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeProfile, employeeId]);
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
  const scheduleData = data?.data?.scheduleData || [];
  function getWeekRange() {
    const today = new Date();

    // Get the current day of the week (0 for Sunday, 1 for Monday, etc.)
    const dayOfWeek = today.getDay();

    // Calculate the start date (Monday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Adjust for Sunday

    // Calculate the end date (Sunday)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // Format the dates as YYYY-MM-DD
    const formatDate = (date) => date.toISOString().slice(0, 10);
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  }
  const generateWeekOptions = (year) => {
    const date = new Date(`${year}-01-01`);
    let weekArray = [];
    const currentDate = new Date();
    let currentWeek = "";
    let foundCurrentWeek = false;
    while (date.getFullYear() === year) {
      const weekStart = new Date(date);
      const weekEnd = new Date(date);
      weekEnd.setDate(weekStart.getDate() + 6);
      const weekRange = getWeekRange();
      setInitialStartDate(weekRange.startDate);
      setInitialEndDate(weekRange.endDate);
      if (weekEnd.getFullYear() !== year) {
        weekEnd.setFullYear(year, 11, 31);
      }
      const weekValue = `${weekStart.toISOString().split("T")[0]} - ${weekEnd.toISOString().split("T")[0]}`;
      const weekLabel = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
      if (currentDate >= weekStart && currentDate <= weekEnd) {
        // Current week, push to the front
        currentWeek = weekValue;
        foundCurrentWeek = true;
        weekArray.unshift({
          start: weekStart,
          end: weekEnd,
          label: `${weekLabel} (In Progress)`,
          value: weekValue,
        });
      } else if (currentDate > weekEnd) {
        // Past weeks, add them in reverse order
        weekArray.unshift({
          start: weekStart,
          end: weekEnd,
          label: weekLabel,
          value: weekValue,
        });
      }
      date.setDate(date.getDate() + 7);
    }
    setWeeks(weekArray);
    if (!selectedWeek) {
      if (foundCurrentWeek) {
        setSelectedWeek(currentWeek);
      } else if (weekArray.length > 0) {
        setSelectedWeek(weekArray[0].value);
      }
    }
    return currentWeek;
  };
  useEffect(() => {
    generateWeekOptions(year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek, year]);
  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const profileInfo = useSelector(userProfile);
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
  return (
    <>
      <AddSignature
        show={open}
        setValue={setSignerSignature}
        setDate={setSignerDate}
        setTime={setSignerTime}
      />

      <NavWrapper title={"Time Sheet"} isArrow={true} />

      <Container>
        <Form>
          <Row>
            <Col xs={12} md={12} lg={6} className="mb-3">
              <Card body className="mb-3 h-100">
                <Row>
                  <Col xs={12} md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Employee Name:
                      </Form.Label>
                      {data?.data && (
                        <DefaultInput
                          value={`${data?.data?.employeeName}`}
                          isBots={false}
                        />
                      )}
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
                          {!employeeId &&
                            (signerIndex === -1 ||
                              !signers[signerIndex]?.signature?.length) && (
                              <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="theme-button"
                              >
                                SAVED AND SIGNED
                              </button>
                            )}
                        </Col>
                        <Col xs={12} md={12} lg={7}>
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

          {data?.data?.scheduleData?.length > 0 ? (
            <>
              <div className="week-section">
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th className="headTitle">Day</th>
                      <th className="headTitle">Date</th>
                      <th className="headTitle">Shift</th>
                      <th className="headTitle">Hours</th>
                      <th className="headTitle">TOTAL 1</th>
                      <th className="headTitle">Daily Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData?.map((item, itemIndex) => (
                      <React.Fragment key={`day-${item.date}-${itemIndex}`}>
                        <tr>
                          <td className="timeDataTable">{item.weekday}</td>
                          <td className="timeDataTable">{item.date}</td>
                          <td className="timeDataTable">
                            {item.work.map((value, index) => (
                              <>
                                <div
                                  className={`${itemIndex > 0 ? "cellTable" : "cellTable_single"}`}
                                >
                                  {value.start} - {value.end}
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
                                      {value.clockIn} - {value.clockOut}
                                    </div>
                                  )}
                                  {selectedDay?.itemIndex === itemIndex &&
                                    selectedDay?.shiftIndex === shiftIndex && (
                                      <div className="add-hours-ui">
                                        <div className="timeBlock">
                                          <div className="timeFeild">
                                            <Form.Group className="flex-1">
                                              <Form.Label>
                                                Start Time:
                                              </Form.Label>
                                              <Form.Control
                                                type="time"
                                                value={currentEntry.clockIn}
                                                onChange={(e) =>
                                                  setCurrentEntry({
                                                    ...currentEntry,
                                                    clockIn: e.target.value,
                                                  })
                                                }
                                              />
                                            </Form.Group>
                                          </div>
                                          <div className="timeFeild">
                                            <Form.Group className="flex-1">
                                              <Form.Label>End Time:</Form.Label>
                                              <Form.Control
                                                type="time"
                                                value={currentEntry.clockOut}
                                                onChange={(e) =>
                                                  setCurrentEntry({
                                                    ...currentEntry,
                                                    clockOut: e.target.value,
                                                  })
                                                }
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
                      </React.Fragment>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="payCheck">
                <span className="week1 mx-2 px-4">
                  WEEK 1 Total Hours : {data?.data?.week1TotalHr}
                </span>
                <span className="pay mx-2 px-4">
                  PAYCHECK Total Hours : {data?.data?.paycheckTotalHr}
                </span>
              </div>
            </>
          ) : (
            <Card body className="mb-3">
              No Data Found
            </Card>
          )}

          <Row className="mt-3">
            <Col>
              {!!signersData?.data?.length && (
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
            <Col xs={12} lg={6}>
              {!employeeId && (
                <Form.Label className="fw-bold">
                  Employee Signature :
                </Form.Label>
              )}
              {!employeeId && employeeSignature?.length === 0 && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="theme-button"
                >
                  {" "}
                  SAVED AND SIGNED
                </button>
              )}
            </Col>
            <Col xs={12} lg={6}>
              {signatureFormat({
                sign: employeeSignature,
                date: employeeDate,
                time: employeeTime,
                hoursFormat,
              })}
            </Col>
          </Row>
          <Row className="mt-3 mt-md-5">
            <Col>
              {!employeeId && (
                <button className="employee_create_btn" onClick={submitHandler}>
                  {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                </button>
              )}
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: TimeSheetView,
});
