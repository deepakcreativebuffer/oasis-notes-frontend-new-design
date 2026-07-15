/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  Button,
  Container,
  Form,
  Modal,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import "@/assets/styles/admin/Staff.css";
import HOC from "@/features/shared/layout/Outer/HOC";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  printDocumentTitleExceptFirstPage,
  printDocumentContent,
} from "@/utils/printHelpers";
import CustomMultiSelect from "@/features/shared/ui/selectors/CustomMultiSelect";
import {
  adminPortalService,
  facilityService,
  adminSchedulingService,
} from "@/features/shared/services/index";
import { usePrint } from "@shared/hooks";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants/index";
import { showNotification } from "@/utils";
const ActivitySchedule = () => {
  const [selectedFacility, setSelectedFacility] = useState("");
  const [facilityList, setFacilityList] = useState([]);
  useEffect(() => {
    fetchHandler();
  }, []);
  const fetchHandler = () => {
    facilityService.list({
      setResponse: setFacilityList,
    });
  };
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(0);
  const [shiftLength, setShiftLength] = useState(0);
  const [isInitial, setIsInitial] = useState(true);
  const [year, setYear] = useState(0);
  const profile = useSelector(userProfile);
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
  const componentRef = React.useRef(null);
  const [printStatus, setPrintStatus] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const [details, setDetails] = useState({});
  const padDate = (date) => {
    const [year, month, day] = date?.split("-");
    const paddedMonth = month.length === 1 ? `0${month}` : month;
    const paddedDay = day.length === 1 ? `0${day}` : day;
    return `${year}-${paddedMonth}-${paddedDay}`;
  };
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
    const res = await adminSchedulingService.getAllActivityShifts();
    if (res.success) {
      setShiftLength(res.data?.length);
      const formattedShifts =
        res.data?.map((shift) => ({
          _id: shift?._id ?? "",
          start: shift?.start ?? "",
          end: shift?.end ?? "",
          type: shift?.type ?? "",
          timeTaken: shift?.timeTaken ?? "",
        })) ?? [];
      setAllShifts(formattedShifts);
    }
  };
  useEffect(() => {
    if (selectedFacility && isInitial) {
      getAllShifts();
      const today = new Date();
      setMonth(today.getUTCMonth() + 1);
      setYear(today.getUTCFullYear());
      fetchShiftAssignments(today.getUTCFullYear(), today.getUTCMonth() + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFacility]);
  useEffect(() => {
    if (selectedFacility && !isInitial) {
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
      <CustomMultiSelect
        allowCustomOptions
        options={options}
        selected={value.length > 0 ? value : []}
        onChange={(e) => changeHandler(e)}
      />
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
    setLoading(true);
    const res = await adminSchedulingService.getActivityScheduleForAdmin({
      month: formattedMonth,
      year: selectedYear,
      facility_id: selectedFacility,
    });
    if (res.success) {
      const shiftEmployeesData = res.data;
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
    } else {
      setShiftEmployees([]);
    }
    setLoading(false);
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
      facility_id: selectedFacility,
    };
    const result =
      await adminSchedulingService.addActivitySchedule(selectedEmployeeData);
    if (!result.success) {
      showNotification(result);
    }
  };
  const renderTable = (startIndex, endIndex, dates) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="custom-fix print-table print-table-border custom-fix-responsive table-responsive">
        <table className="border-collapse w-full text-[0.8rem]">
          <thead>
            <tr>
              {days.map((day, index) => (
                <th key={index} style={tableHeaderStyle}>
                  {dates[index] >= 1 ? (
                    <div>
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
            {generateRows(startIndex, endIndex)}
          </tbody>
        </table>
      </div>
    );
  };
  const generateRows = (startIndex, endIndex) => {
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
              style={{
                ...tableCellStyle,
                border: "1px solid #ECECEC",
                textAlign: "center",
              }}
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
              style={{
                ...tableCellStyle,
                border: "1px solid #ECECEC",
                visibility: "hidden",
              }}
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
        <div key={`week-${i}`} className="mb-4">
          {renderTable(startDate, endDate, dates)}
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
  const iconStyle = {
    cursor: "pointer",
    fontSize: "0.8rem",
  };
  const tableHeaderStyle = {
    border: "1px solid #ECECEC",
    backgroundColor: "#0c5c75",
    color: "#fff",
    textAlign: "center",
    padding: "0.3rem 0.5rem",
    fontSize: "0.7rem",
    width: "14.28%",
  };
  const tableCellStyle = {
    border: "1px solid",
    textAlign: "center",
    padding: "0",
    fontSize: "0.7rem",
    borderLeft: "none",
    verticalAlign: "top",
  };
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef?.current?.cloneNode(true),
        profile,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(profile),
    pageStyle: `
     @page {
      size: landscape;
        margin: 12mm 9mm!important;
      }    
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
      th, td {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
  `,
  });
  const printRef = React.useRef(null);
  const print = usePrint(printRef, handlePrint);
  const getAllDetails = async (year, month) => {
    let formattedMonth = month;
    if (month < 10) {
      formattedMonth = "0" + month;
    }
    const res = await adminSchedulingService.getActivityScheduleForAdmin({
      month: formattedMonth,
      year,
      facility_id: selectedFacility,
    });
    if (res.success) {
      setDetails(res.data);
    } else {
      setDetails({});
      if (res.status === 404) {
        showNotification({
          message: `No activity schedule for ${monthInEng[+month - 1]}/${year}`,
          type: "info",
        });
      } else {
        showNotification({ message: res.message, type: "danger" });
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
      const res =
        await adminSchedulingService.addStaffScheduleAdministrator(payload);
      if (res.success) {
        props.onHide();
        getAllDetails(year, month);
      } else {
        showNotification({ message: res.message, type: "danger" });
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
                <Form.Label>Administrator and Number:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Administrator and Number"
                  required
                  onChange={(e) => setAdminstratorAndSignature(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Registered Nurse and Number: </Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Registered Nurse and Number"
                  onChange={(e) => setRegisteredNurses(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>BHP Name and Number:</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="BHP Name and Number"
                  onChange={(e) => setBhp(e.target.value)}
                />
              </Form.Group>
              <span className="flex gap-4 flex-wrap">
                <Form.Group className="mb-3">
                  <Form.Label>Year:</Form.Label>
                  <Form.Control
                    type="number"
                    value={year4}
                    onChange={(e) => setYear4(e.target.value)}
                    defaultValue={2023}
                    min={2021}
                    max={3000}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Month:</Form.Label>
                  <Form.Control
                    type="number"
                    value={year5}
                    onChange={(e) => setYear5(e.target.value)}
                    defaultValue={1}
                    min={1}
                    max={12}
                  />
                </Form.Group>
              </span>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit">Submit</Button>
              <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }
  const deleteShift = async (id) => {
    const res = await adminSchedulingService.deleteActivityShift(id);
    if (res.success) {
      getAllDetails(year, month);
      getAllShifts();
      setModalShow2(false);
      showNotification({ message: res.message, type: "success" });
    } else {
      showNotification({ message: res.message, type: "danger" });
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
      const res = await adminSchedulingService.addActivityShift(payload);
      if (res.success) {
        getAllDetails(year, month);
        props.onHide();
        getAllShifts();
        showNotification({ message: res.message, type: "success" });
      } else {
        showNotification({ message: res.message, type: "danger" });
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
                <Form.Label className="fw-bold w-100">All Shifts</Form.Label>
                {allShifts?.map((item, index) => (
                  <ListGroup key={index}>
                    <ListGroup.Item>
                      <Row>
                        <Col xs={8}>
                          <Form.Label className="fw-bold"></Form.Label>
                        </Col>
                        <Col xs={4}>
                          <div className="icon-joiner justify-content-end">
                            <Link
                              className="del-btn"
                              onClick={() => deleteShift(item._id)}
                            >
                              <MdDelete />
                            </Link>
                          </div>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                ))}
              </Form.Group>
              {schedule.map((shift, index) => (
                <Row key={index}>
                  <Col xs={8}>
                    <Row>
                      <Col xs={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Start Time
                          </Form.Label>
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
                      </Col>
                      <Col xs={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">End Time</Form.Label>
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
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={4}>
                    <div className="icon-joiner justify-content-end">
                      <Link
                        className="del-btn"
                        onClick={() => removeShiftRow(index)}
                      >
                        <MdDelete />
                      </Link>
                    </div>
                  </Col>
                </Row>
              ))}
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" type="submit">
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
  const handleCarryForward = async () => {
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedYear = year.toString();
    const result = await adminPortalService.forwardActivitySchedule(
      {
        month: formattedMonth,
        year: formattedYear,
        facility_id: selectedFacility,
      },
      { setLoading },
    );
    if (result.success) {
      fetchShiftAssignments(year, month, selectedFacility);
    }
  };
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <MyVerticallyCenteredModal2
        show={modalShow2}
        onHide={() => setModalShow2(false)}
      />
      <Container ref={componentRef}>
        <div className="page-title-bar mb-3 hidePrint">
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
        </div>
        {!selectedFacility ? (
          <Card body className="text-center">
            {" "}
            <span className="fw-bold">
              No Activity Schedule Found! Please Select Facility
            </span>{" "}
          </Card>
        ) : (
          <div>
            <div className="monthOnLast fw-bold hidePrint flex items-center justify-center border border-[#0C5C75] w-full mb-4 p-2">
              <i
                className="fa-solid fa-caret-left "
                style={iconStyle}
                onClick={() => {
                  MonthHandler(month - 1);
                  setIsInitial(false);
                }}
              ></i>
              <p className="m-0 text-[0.8rem]">
                {monthInEng[month - 1]} {year}
              </p>
              <i
                className="fa-solid fa-caret-right"
                style={iconStyle}
                onClick={() => {
                  MonthHandler(month + 1);
                  setIsInitial(false);
                }}
              ></i>
              {(profile.userType === ROLES.ADMIN ||
                (profile.userType === ROLES.EMPLOYEE &&
                  profile.accountType === ACCOUNT_TYPES.ADMINISTRATOR)) && (
                <button
                  className="employee_create_btn_refill print-btn"
                  onClick={handleCarryForward}
                >
                  Carry Forward
                </button>
              )}
            </div>

            {loading ? (
              <Container>
                <div className="text-center">
                  <ClipLoader color="rgb(26, 159, 178)" />
                </div>
              </Container>
            ) : (
              <div>
                <div>
                  <div className="hidePrint my-2 text-center font-bold">
                    <p>
                      {monthInEng[month - 1]} {year} Activity Schedule
                    </p>
                  </div>

                  <div className="show-data-inprint my-2">
                    <Row className="align-items-center">
                      <Col xs={12} sm={4} md={4} xl={3}></Col>
                      <Col xs={12} sm={4} md={4} xl={6}>
                        <p className="heading">
                          {" "}
                          {monthInEng[month - 1]} {year} Activity Schedule
                        </p>
                      </Col>
                      <Col xs={12} sm={4} md={4} xl={3}>
                        <Form.Group className="d-flex gap-2 align-items-center justify-content-end">
                          <Form.Label className="fw-bold flex-shrink-0 mb-sm-0">
                            Facility :{" "}
                          </Form.Label>
                          <Form.Label className="fw-normal flex-shrink-0 mb-sm-0">
                            {
                              facilityList?.data?.find(
                                (value) => value?._id === selectedFacility,
                              )?.name
                            }
                          </Form.Label>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  <div className="bg-white activity-schedule">
                    {generateTables()}
                  </div>
                </div>
                <div className="mt-3 text-center hidePrint">
                  <Button
                    className="theme-button"
                    onClick={print}
                    variant="primary"
                  >
                    Print
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: ActivitySchedule,
});
