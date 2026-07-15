/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Modal,
  Card,
} from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import CustomMultiSelect from "@/features/shared/ui/selectors/CustomMultiSelect";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useFacilities } from "@shared/hooks";
import { usePrint } from "@shared/hooks";
import {
  adminSchedulingService,
  employeeShiftsService,
} from "@/features/shared/services/index";
import { showNotification, logger } from "@/utils";
const Schedule = () => {
  const profileInfo = useSelector(userProfile);
  const [selectedFacility, setSelectedFacility] = useState("");
  const [isInitial, setIsInitial] = useState(true);
  const facilities = useFacilities();
  const facilityList = useMemo(
    () => ({
      data: facilities,
    }),
    [facilities],
  );
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [employeesList, setEmployeesList] = useState([
    {
      label: "Board Games/Arts and Craft",
      value: "Board Games/Arts and Craft",
    },
    {
      label: "QT",
      value: "QT",
    },
    {
      label: "Frys",
      value: "Frys",
    },
    {
      label: "Library",
      value: "Library",
    },
    {
      label: "Walmart",
      value: "Walmart",
    },
    {
      label: "Park",
      value: "Park",
    },
    {
      label: "Church",
      value: "Church",
    },
    {
      label: "Dollar Store",
      value: "Dollar Store",
    },
    {
      label: "walking",
      value: "walking",
    },
    {
      label: "Movie Theatre",
      value: "Movie Theatre",
    },
    {
      label: "Out to eat",
      value: "Out to eat",
    },
    {
      label: "Bookmans",
      value: "Bookmans",
    },
    {
      label: "Karaoke Night",
      value: "Karaoke Night",
    },
  ]);
  const [printStatus, setPrintStatus] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const padDate = (date) => {
    const [year, month, day] = date?.split("-");
    const paddedMonth = month.length === 1 ? `0${month}` : month;
    const paddedDay = day.length === 1 ? `0${day}` : day;
    return `${year}-${paddedMonth}-${paddedDay}`;
  };
  const setTimeoutFun = () => {};
  const [shiftEmployees, setShiftEmployees] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(7).fill("")),
  );
  const [selectedEmployees, setSelectedEmployees] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(new Date(year, month, 0).getDate()).fill([])),
  );
  const [allShifts, setAllShifts] = useState([1]);
  const getAllShifts = async () => {
    try {
      const result = await adminSchedulingService.getAllActivityShifts();
      if (!result.success) {
        showNotification(result);
        return;
      }
      const shiftList = Array.isArray(result.data)
        ? result.data
        : result.data?.data || [];
      const formattedShifts =
        shiftList.map((shift) => ({
          _id: shift?._id ?? "",
          start: shift?.start ?? "",
          end: shift?.end ?? "",
          type: shift?.type ?? "",
          timeTaken: shift?.timeTaken ?? "",
        })) ?? [];
      setAllShifts(formattedShifts);
    } catch (error) {
      showNotification({
        message: error.message || "Failed to retrieve shifts.",
        type: "danger",
      });
      logger.error("Failed to retrieve shifts in ActivitySchedule", error);
    }
  };
  useEffect(() => {
    if (selectedFacility && isInitial) {
      getAllShifts();
      fetchShiftAssignments(year, month);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFacility]);
  const SelectBox = ({ options, previousSelected, i, j, shifts }) => {
    const [value, setValue] = useState([previousSelected]);
    useEffect(() => {
      if (previousSelected) {
        setValue(previousSelected);
      }
    }, [previousSelected]);
    const changeHandler = (e) => {
      setValue(e);
      const newIds = e
        .map((option) => option.value)
        .filter((id) => id !== undefined);
      handleEmployeeChange2(i, j, newIds, shifts);
    };
    return (
      <>
        <CustomMultiSelect
          options={options}
          selected={value}
          onChange={(e) => changeHandler(e)}
        />
      </>
    );
  };
  useEffect(() => {
    setSelectedEmployees(
      Array(3)
        .fill(null)
        .map(() => Array(new Date(year, month, 0).getDate()).fill([])),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);
  const fetchShiftAssignments = async (selectedYear, selectedMonth) => {
    const formattedMonth =
      selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
    try {
      setLoading(true);
      const result = await employeeShiftsService.getActivityScheduleForEmployee(
        {
          month: formattedMonth,
          year: selectedYear,
          facility_id: selectedFacility,
        },
      );
      if (!result.success) {
        showNotification(result);
        setLoading(false);
        return;
      }
      const shiftEmployeesData = result.data || [];
      const formattedShiftEmployees = shiftEmployeesData
        .map((schedule) => {
          const { date, schedule: shiftAssignments } = schedule;
          if (!Array.isArray(shiftAssignments)) return [];
          const formattedAssignments = shiftAssignments.map((assignment) => {
            if (!assignment || !Array.isArray(assignment.data)) {
              return null;
            }
            const employeeIds = assignment?.data?.map((emp) => emp);
            return {
              date,
              employeeId: employeeIds,
            };
          });
          return formattedAssignments.filter(Boolean);
        })
        .flat();
      setShiftEmployees(formattedShiftEmployees);
      setLoading(false);
    } catch (error) {
      setShiftEmployees([]);
      setLoading(false);
      showNotification({
        message: error.message || "Failed to retrieve shift assignments.",
        type: "danger",
      });
      logger.error(
        "Failed to fetch shift assignments in ActivitySchedule",
        error,
      );
    }
  };
  const handleEmployeeChange2 = async (
    rowIndex,
    columnIndex,
    selectedOptions,
    shiftId,
  ) => {
    const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(columnIndex).padStart(2, "0")}`;
    const month1 = dateKey ? dateKey.split("-")[1] : "";
    const year1 = dateKey ? dateKey.split("-")[0] : "";
    const day1 = dateKey ? dateKey.split("-")[2] : "";
    const selectedEmployeeData = {
      currentDate: day1,
      month: month1,
      year: year1,
      shiftId: shiftId,
      data: selectedOptions,
    };
    try {
      const result =
        await employeeShiftsService.addEmployeeActivitySchedule(
          selectedEmployeeData,
        );
      if (!result.success) {
        showNotification(result);
      }
    } catch (error) {
      showNotification(error);
      logger.error("Failed to add activity schedule", error, {
        selectedEmployeeData,
      });
    }
  };
  const renderTable = (startIndex, endIndex, dates, isLastWeek) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="custom-fix print-table custom-fix-responsive table-responsive bg-white">
        <table className="border-collapse w-full text-[0.8rem]">
          <thead>
            <tr>
              {days.map((day, index) => (
                <th
                  key={index}
                  className="border border-[#ECECEC] bg-[#0c5c75] text-white text-center p-[0.80rem] text-[0.80rem] w-[14.28%]"
                >
                  {dates[index] >= 1 ? (
                    <div className="day-head">
                      {day} {dates[index]}
                    </div>
                  ) : (
                    day
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border border-[#ECECEC]">
            {generateRows(startIndex, endIndex, isLastWeek)}
          </tbody>
        </table>
      </div>
    );
  };
  const generateRows = (startIndex, endIndex, isLastWeek) => {
    const rows = [];
    for (let i = 0; i < 1; i++) {
      const row = [];
      for (let j = startIndex; j <= endIndex; j++) {
        if (j >= 1 && j <= new Date(year, month, 0).getDate()) {
          const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(j).padStart(2, "0")}`;
          const shiftEmployee = shiftEmployees?.find((emp) => {
            if (!emp || !emp.date) return false;
            const paddedDateKey = padDate(dateKey);
            const paddedEmpDate = padDate(emp.date);
            return paddedEmpDate === paddedDateKey;
          });
          let assignedEmployeeIds = shiftEmployee
            ? shiftEmployee.employeeId
            : [];
          const missingIds = assignedEmployeeIds
            ?.filter(
              (id) =>
                !employeesList?.some((employee) => employee?.value === id),
            )
            ?.map((value) => {
              return {
                label: value,
                value: value,
              };
            });
          const include = employeesList?.filter((employee) =>
            assignedEmployeeIds?.includes(employee?.value),
          );
          row.push(
            <td
              key={`day-${j}`}
              className="border border-[#ECECEC] text-center p-0 text-[0.8rem] align-top border-l-0 "
            >
              <SelectBox
                options={employeesList}
                previousSelected={[...include, ...missingIds]}
                assignedEmployeeIds={assignedEmployeeIds}
                i={i}
                j={j}
              />
            </td>,
          );
        } else {
          row.push(
            <td
              key={`day-${j}`}
              className="border border-[#ECECEC] text-center p-0 text-[0.8rem] align-top border-l-0 "
            ></td>,
          );
        }
      }
      if (isLastWeek) {
        const lastDate = new Date(year, month, 0);
        const lastDay = lastDate.getDay();
        for (let k = lastDay + 1; k < 7; k++) {
          row.push(
            <td
              key={`empty-${k}`}
              className="border border-[#ECECEC] text-center p-0 text-[0.8rem] align-top border-l-0 "
            ></td>,
          );
        }
      }
      rows.push(<tr key={`row-${i}`}>{row}</tr>);
    }
    return rows;
  };
  const generateTables = () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const tables = [];
    let startDate = 1 - firstDayOfMonth;
    const weeks = Math.ceil((daysInMonth + firstDayOfMonth) / 7);
    for (let i = 0; i < weeks; i++) {
      const endDate = Math.min(startDate + 6, daysInMonth);
      const dates = [];
      for (let j = startDate; j <= endDate; j++) {
        dates.push(j);
      }
      tables.push(
        <div key={`week-${i}`} className="mb-2">
          {renderTable(startDate, endDate, dates, i === weeks - 1)}
        </div>,
      );
      startDate += 7;
    }
    return tables;
  };
  const monthInEng = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const MonthHandler = (newMonth) => {
    let updatedYear = year;
    let updatedMonth = newMonth;
    if (newMonth > 12) {
      updatedYear = year + 1;
      updatedMonth = 1;
    } else if (newMonth < 1) {
      updatedYear = year - 1;
      updatedMonth = 12;
    }
    setYear(updatedYear);
    setMonth(updatedMonth);
    fetchShiftAssignments(updatedYear, updatedMonth);
  };
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef?.current?.cloneNode(true),
        profileInfo,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(profileInfo, profileInfo),
    pageStyle: `
    @page {
      size: landscape!important;
      margin: 12mm 9mm!important;
    }    
    .card {
      page-break-inside: avoid;
    }
    .view-details-grid {
      page-break-inside: avoid;
    }
    th,td {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  `,
  });
  const [details, setDetails] = useState({});
  const getAllDetails = async (year, month) => {
    const formattedMonth = month < 10 ? "0" + month : month;
    try {
      const result = await employeeShiftsService.getActivityScheduleDetails(
        formattedMonth,
        year,
        selectedFacility,
      );
      if (!result.success) {
        if (result.status === 404) {
          setDetails({});
          showNotification({
            message: "No Data found!",
            type: "info",
          });
        } else {
          showNotification(result);
        }
        return;
      }
      setDetails(result.data || {});
    } catch (error) {
      if (error?.status === 404) {
        setDetails({});
        showNotification({
          message: "No Data found!",
          type: "info",
        });
      } else {
        showNotification({
          message: error.message || "Failed to load schedule details.",
          type: "danger",
        });
        logger.error(
          "Failed to load schedule details in ActivitySchedule",
          error,
        );
      }
    }
  };
  function MyVerticallyCenteredModal(props) {
    const [adminstratorAndSignature, setAdminstratorAndSignature] = useState();
    const [registeredNurses, setRegisteredNurses] = useState("");
    const [bhp, setBhp] = useState("");
    const [year4, setYear4] = useState(2023);
    const [year5, setYear5] = useState(1);
    const submitDetails = async (e) => {
      e.preventDefault();
      const payload = {};
      if (registeredNurses) {
        payload.registeredNurseAndNumber = registeredNurses;
      }
      if (bhp) {
        payload.bhtNameAndNumber = bhp;
      }
      if (adminstratorAndSignature) {
        payload.administratorAndNumber = adminstratorAndSignature;
      }
      if (year5 < 10) {
        payload.month = `0${year5}`;
      } else {
        payload.month = year5;
      }
      payload.year = year4;
      try {
        const result =
          await adminSchedulingService.addStaffScheduleAdministrator(payload);
        if (!result.success) {
          showNotification(result);
          return;
        }
        props.onHide();
        getAllDetails(year, month);
      } catch (error) {
        showNotification({
          message: error?.message || "Failed to add staff schedule.",
          type: "danger",
        });
        logger.error("Failed to add staff schedule in ActivitySchedule", error);
      }
    };
    return (
      <>
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Details
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={submitDetails}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Administrator and Number:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Administrator and Number"
                  required
                  onChange={(e) => setAdminstratorAndSignature(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Registered Nurse and Number:{" "}
                </Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Registered Nurse and Number"
                  onChange={(e) => setRegisteredNurses(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  BHP Name and Number:
                </Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="BHP Name and Number"
                  onChange={(e) => setBhp(e.target.value)}
                />
              </Form.Group>
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Year:</Form.Label>
                    <Form.Control
                      type="number"
                      value={year4}
                      onChange={(e) => setYear4(e.target.value)}
                      defaultValue={2023}
                      min={2021}
                      max={3000}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Month:</Form.Label>
                    <Form.Control
                      type="number"
                      value={year5}
                      onChange={(e) => setYear5(e.target.value)}
                      defaultValue={1}
                      min={1}
                      max={12}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button type="submit" className="theme-button">
                Submit
              </Button>
              <Button onClick={props.onHide} className="theme-button-outline">
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }
  const deleteShift = async (id) => {
    try {
      const result = await employeeShiftsService.deleteActivityShiftById(id);
      if (!result.success) {
        showNotification(result);
        return;
      }
      getAllDetails(year, month);
    } catch (error) {
      showNotification({
        message: error?.message || "Failed to delete shift.",
        type: "danger",
      });
      logger.error("Failed to delete shift in ActivitySchedule", error);
    }
  };
  function MyVerticallyCenteredModal2(props) {
    const [schedule, setSchedule] = useState([
      {
        start: "",
        end: "",
      },
    ]);
    const handleStartTimeChange = (index, value) => {
      const updatedSchedule = [...schedule];
      updatedSchedule[index].start = value;
      setSchedule(updatedSchedule);
    };
    const handleEndTimeChange = (index, value) => {
      const updatedSchedule = [...schedule];
      updatedSchedule[index].end = value;
      setSchedule(updatedSchedule);
    };
    const addShiftRow = () => {
      setSchedule([
        ...schedule,
        {
          start: "",
          end: "",
        },
      ]);
    };
    const removeShiftRow = (index) => {
      const updatedSchedule = [...schedule];
      updatedSchedule.splice(index, 1);
      setSchedule(updatedSchedule);
    };
    const submitDetails11 = async (e) => {
      e.preventDefault();
      const payload = {
        schedule: schedule.map(({ start, end }) => ({
          start,
          end,
        })),
      };
      try {
        const result = await adminSchedulingService.addShift(payload);
        getAllDetails(year, month);
        props.onHide();
        showNotification({
          message: result.message || "Shift added successfully",
          type: "success",
        });
      } catch (error) {
        showNotification({
          message: error?.message || "Failed to add shift.",
          type: "danger",
        });
        logger.error("Failed to add shift in ActivitySchedule", error);
      }
    };
    return (
      <>
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Shift
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={submitDetails11}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Label>All Shifts</Form.Label>
                  <br />
                  {allShifts?.map((item, index) => (
                    <Form.Group
                      key={index}
                      className="mb-3 flex gap-4 flex-wrap"
                    >
                      <Form.Label className="flex"></Form.Label>
                      <div>
                        <MdDelete
                          className="cursor-pointer"
                          onClick={() => deleteShift(item._id)}
                        />
                      </div>
                    </Form.Group>
                  ))}
                </Form.Group>
                <hr />
                <br />
                {schedule.map((shift, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <Form.Group className="flex-1">
                      <Form.Label>Start Time:</Form.Label>
                      <Form.Control
                        type="text"
                        pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                        placeholder="HH:MM:SS"
                        value={shift.start}
                        onChange={(e) =>
                          handleStartTimeChange(index, e.target.value)
                        }
                      />
                    </Form.Group>
                    <Form.Group className="flex-1">
                      <Form.Label>End Time:</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                        placeholder="HH:MM:SS"
                        value={shift.end}
                        onChange={(e) =>
                          handleEndTimeChange(index, e.target.value)
                        }
                      />
                    </Form.Group>
                    <Button
                      variant="danger"
                      onClick={() => removeShiftRow(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </Form.Group>
              <hr />
              <Button onClick={addShiftRow}>Add Shift</Button>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button type="submit" className="theme-button">
                Submit
              </Button>
              <Button className="theme-button-outline" onClick={props.onHide}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }
  useEffect(() => {
    if (year && month && selectedFacility && !isInitial) {
      getAllDetails(year, month);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, selectedFacility]);
  useEffect(() => {
    if (selectedFacility && !isInitial) MonthHandler(month);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFacility]);
  const handleAddClick = async () => {
    try {
      setLoading(true);
      const schedule = {
        schedule: [
          {
            start: "2024-07-01",
            end: "2024-07-31",
            type: "amToAm",
            timeTaken: "8am",
          },
        ],
      };
      const result = await adminSchedulingService.addActivityShift(schedule);
      if (!result.success) {
        showNotification(result);
        setLoading(false);
        return;
      }
      const shiftEmployeesData = result.data || [];
      const formattedShiftEmployees = shiftEmployeesData
        .map((schedule) => {
          const { date, schedule: shiftAssignments } = schedule;
          if (!Array.isArray(shiftAssignments)) return [];
          const formattedAssignments = shiftAssignments.map((assignment) => {
            if (
              !assignment ||
              !Array.isArray(assignment.data) ||
              !assignment.shiftId
            ) {
              return null;
            }
            const employeeIds = assignment?.data?.map((emp) => emp);
            return {
              date,
              employeeId: employeeIds,
              shiftId: assignment.shiftId,
            };
          });
          return formattedAssignments.filter(Boolean);
        })
        .flat();
      setShiftEmployees(formattedShiftEmployees);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showNotification({
        message: error.message || "Failed to create activity shift.",
        type: "danger",
      });
      logger.error(
        "Failed to create activity shift in ActivitySchedule",
        error,
      );
    }
  };
  const printRef = React.useRef(null);
  const print = usePrint(componentRef?.current && printRef, handlePrint);
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <div className="page-title-bar mb-3 hidePrint">
        <Container>
          <Row>
            <Col xs={12} md={4} xl={3}></Col>
            <Col xs={12} md={4} xl={6}>
              <p className="heading">Activity Schedule</p>
            </Col>
            <Col xs={12} md={4} xl={3}>
              <Form.Group className="d-flex gap-2 align-items-center justify-content-end">
                <Form.Label className="fw-bold flex-shrink-0 mb-sm-0">
                  Facility :{" "}
                </Form.Label>
                <Form.Select
                  size="sm"
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
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
        </Container>
      </div>

      <Container ref={componentRef}>
        <>
          <MyVerticallyCenteredModal
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
          <MyVerticallyCenteredModal2
            show={modalShow2}
            onHide={() => setModalShow2(false)}
          />
          <div className="monthOnLast fw-bold hidePrint">
            <i
              className="fa-solid fa-caret-left cursor-pointer text-[0.8rem]"
              onClick={() => {
                MonthHandler(month - 1);
                setIsInitial(false);
              }}
            ></i>
            <p className="m-0 text-[0.8rem]">
              {monthInEng[month - 1]} {year}
            </p>
            <i
              className="fa-solid fa-caret-right cursor-pointer text-[0.8rem]"
              onClick={() => {
                MonthHandler(month + 1);
                setIsInitial(false);
              }}
            ></i>
          </div>

          {!selectedFacility ? (
            <Card body className="text-center">
              {" "}
              <span className="fw-bold">
                No Activity Schedule Found! Please Select Facility
              </span>{" "}
            </Card>
          ) : loading ? (
            <Container>
              <h1 className="text-center">Loading...</h1>
            </Container>
          ) : (
            <div>
              <div>
                <div>
                  <Row className="align-items-center my-2">
                    <Col xs={12} sm={4} md={4} xl={3}></Col>
                    <Col xs={12} sm={4} md={4} xl={6}>
                      <p className="heading">
                        {" "}
                        {monthInEng[month - 1]} {year} Activity Schedule
                      </p>
                    </Col>
                    <Col xs={12} sm={4} md={4} xl={3}>
                      <div className="show-data-inprint">
                        <Form.Group className="d-flex gap-2 align-items-center justify-content-end">
                          <Form.Label className="fw-bold flex-shrink-0 mb-sm-0">
                            Facility :{" "}
                          </Form.Label>

                          <Form.Label className="fw-noraml flex-shrink-0 mb-sm-0">
                            {
                              facilityList?.data?.find(
                                (value) => value?._id === selectedFacility,
                              )?.name
                            }
                          </Form.Label>
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="staff_schedule_sheet bg-white">
                  {generateTables()}
                </div>
              </div>

              <Row className="text-center mt-3 hidePrint">
                <Col xs={12}>
                  <Button
                    className="theme-button"
                    onClick={print}
                    variant="primary"
                  >
                    Print Report
                  </Button>
                </Col>
              </Row>
            </div>
          )}
        </>
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: Schedule,
});
