/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { Button, Container, Form, Row, Col, Card } from "react-bootstrap";
import "@/assets/styles/admin/Staff.css";
import CustomMultiSelect from "@/features/shared/ui/selectors/CustomMultiSelect";
import AddDetailsModal from "../../components/ModalComponent/AddDetailsModal";
import AddShiftModal from "../../components/ModalComponent/AddShiftModal";
import HOC from "@/features/shared/layout/Outer/HOC";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import StaffScheduleSelect from "./StaffScheduleSelect";
import { convertTimeFormat } from "@/utils/utils";
import {
  adminPortalService,
  facilityService,
  adminSchedulingService,
} from "@/features/shared/services/index";
import { usePrint } from "@shared/hooks";
import { showNotification, logger } from "@/utils";
import { ClipLoader } from "react-spinners";
const StaffSchedule2 = () => {
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const [employeesList, setEmployeesList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const [isFacilityData, setIsFacilityData] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState("");
  const [staffAdministrator, setStaffAdminstrator] = useState([]);
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const [allShifts, setAllShifts] = useState([]);
  const [shiftEmployees, setShiftEmployees] = useState(
    Array(3)
      .fill(null)
      ?.map(() => Array(7).fill("")),
  );
  const getAllShifts = async (facilityId) => {
    try {
      const res = await adminSchedulingService.getShifts(
        facilityId ?? selectedFacility,
      );
      const formattedShifts =
        res?.data?.map((shift) => ({
          _id: shift?._id ?? "",
          start: shift?.start ?? "",
          end: shift?.end ?? "",
          type: shift?.type ?? "",
          timeTaken: shift?.timeTaken ?? "",
        })) ?? [];
      setAllShifts(formattedShifts);
    } catch (error) {
      setAllShifts();
    }
  };
  const fetchHandler = () => {
    facilityService.list({
      setResponse: setFacilityList,
    });
  };
  useEffect(() => {
    fetchHandler();
  }, []);
  useEffect(() => {
    if (month === 0 || year === 0) {
      return;
    }
    fetchShiftAssignments(year, month, selectedFacility);
  }, [modalShow, modalShow2, month, selectedFacility, year]);
  const getScheduleAdministrator = useCallback(async () => {
    const formattedMonth = month < 10 ? `0${month}` : month;
    await adminSchedulingService
      .getStaffScheduleAdministratorForAdmin({
        month: formattedMonth,
        year: year,
        facility_id: selectedFacility,
      })
      .then((res) => {
        if (res?.data?.length > 0) {
          setStaffAdminstrator(res.data);
        } else {
          setStaffAdminstrator([]);
        }
      })
      .catch((err) => {
        logger.error(err);
        setStaffAdminstrator([]);
      });
  }, [month, selectedFacility, year]);
  useEffect(() => {
    if (month === 0 || year === 0) {
      return; // Prevent API call when month or year is 0
    }
    getScheduleAdministrator();
  }, [getScheduleAdministrator, month, year]);
  const getAllEmployees = async () => {
    setLoading(true);
    try {
      const res = await adminSchedulingService.getActiveEmployees();
      setEmployeesList(
        res?.data?.map((item) => ({
          label: item.firstName ? item?.firstName : "-",
          value: item._id,
        })),
      );
    } catch (error) {
      showNotification({ message: error.message, type: "danger" });
    } finally {
      setLoading(false); // End loading
    }
  };
  const SelectBox = ({
    options,
    previousSelected,
    i,
    j,
    shifts,
    facilityId,
  }) => {
    const [value, setValue] = useState([previousSelected]);
    useEffect(() => {
      if (previousSelected) {
        setValue(previousSelected);
      }
    }, [previousSelected]);
    const changeHandler = (e) => {
      setValue(e);
      const newIds = e
        ?.map((option) => option.value)
        .filter((id) => id !== undefined);
      handleEmployeeChange2(i, j, newIds, shifts, facilityId);
    };
    return (
      <>
        <CustomMultiSelect
          options={options}
          selected={value.length > 0 ? value : []}
          onChange={(e) => changeHandler(e)}
          max={3}
        />
      </>
    );
  };
  const fetchShiftAssignments = async (
    selectedYear,
    selectedMonth,
    facilityId,
  ) => {
    const formattedMonth =
      selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
    try {
      setLoading(true);
      const res = await adminSchedulingService.getStaffScheduleForAdmins({
        month: formattedMonth,
        year: selectedYear,
        facility_id: facilityId,
      });
      const shiftEmployeesData = res?.data;
      const formattedShiftEmployees = shiftEmployeesData
        ?.map((schedule) => {
          const { date, schedule: shiftAssignments } = schedule;
          if (!Array.isArray(shiftAssignments)) return [];
          const formattedAssignments = shiftAssignments?.map((assignment) => {
            if (
              !assignment ||
              !Array.isArray(assignment.employeeId) ||
              !assignment.shiftId
            ) {
              return null;
            }
            const employeeIds = assignment.employeeId?.map((emp) => emp._id);
            return {
              date,
              employeeId: employeeIds,
              shiftId: assignment.shiftId._id,
            };
          });
          return formattedAssignments.filter(Boolean);
        })
        .flat();
      setShiftEmployees(formattedShiftEmployees);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const addStaff = (selectedEmployeeData) => {
    adminSchedulingService
      .addStaffSchedule(selectedEmployeeData)
      .then((res) => {})
      .catch((err) => {
        logger.error(err);
      });
  };
  const handleEmployeeChange2 = async (
    rowIndex,
    columnIndex,
    selectedOptions,
    shiftId,
    facilityId,
  ) => {
    const selectedEmployeeData = {
      currentDate: +columnIndex,
      month: month.toString().padStart(2, "0"),
      year: year.toString(),
      shiftId: shiftId,
      employeeId: selectedOptions,
      facility_id: facilityId,
    };
    if (selectedEmployeeData) {
      addStaff(selectedEmployeeData);
    }
  };
  const renderTable = (startIndex, endIndex, dates) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div
        className={
          "custom-fix custom-fix-responsive print-table table-responsive over-flow-of-able"
        }
      >
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            fontSize: "0.8rem",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  ...tableHeaderStyle,
                  width: "0px",
                  textWrap: "nowrap",
                }}
              >
                Shifts
              </th>
              {days?.map((day, index) => (
                <th key={index} style={tableHeaderStyle}>
                  {dates[index] >= 1 ? (
                    <div className="print-column">
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
  const padDate = (date) => {
    const [year, month, day] = date.split("-");
    const paddedMonth = month.length === 1 ? `0${month}` : month;
    const paddedDay = day.length === 1 ? `0${day}` : day;
    return `${year}-${paddedMonth}-${paddedDay}`;
  };
  const generateRows = (startIndex, endIndex) => {
    const rows = [];
    let shifts = allShifts?.map((shift) => ({
      _id: shift._id,
      display:
        convertTimeFormat(shift.start, hoursFormat) +
        " - " +
        convertTimeFormat(shift.end, hoursFormat),
    }));
    for (let i = 0; i < shifts?.length; i++) {
      const row = [];
      row.push(
        <td
          key={`shift-${i}`}
          style={{
            textAlign: "center",
            width: "0px",
            border: "1px solid #ECECEC",
            textWrap: "nowrap",
            padding: "0 8px",
          }}
        >
          {shifts[i]?.display}
        </td>,
      );
      for (let j = startIndex; j <= endIndex; j++) {
        if (j >= 1 && j <= new Date(year, month, 0).getDate()) {
          const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(j).padStart(2, "0")}`;
          const shiftEmployee = shiftEmployees?.find((emp) => {
            if (!emp || !emp.date) return false;
            const paddedDateKey = padDate(dateKey);
            const paddedEmpDate = padDate(emp.date);
            return (
              paddedEmpDate === paddedDateKey && emp.shiftId === shifts[i]?._id
            );
          });
          let assignedEmployeeIds = shiftEmployee
            ? shiftEmployee.employeeId
            : [];
          row.push(
            <td
              key={`day-${j}`}
              style={{
                ...tableCellStyle,
                border: "1px solid #ECECEC",
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <SelectBox
                options={employeesList && employeesList}
                previousSelected={
                  employeesList &&
                  employeesList.filter((employee) =>
                    assignedEmployeeIds.includes(employee?.value),
                  )
                }
                assignedEmployeeIds={assignedEmployeeIds}
                i={i}
                j={j}
                shifts={shifts[i]?._id}
                facilityId={selectedFacility}
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
        <div
          key={`week-${i}`}
          style={{
            marginBottom: "0.5rem",
          }}
        >
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
    fetchShiftAssignments(updatedYear, updatedMonth, selectedFacility);
  };
  const iconStyle = {
    cursor: "pointer",
    fontSize: "0.8rem",
  };
  const tableHeaderStyle = {
    border: "1px solid",
    backgroundColor: "#0C5C75",
    color: "white",
    textAlign: "center",
    padding: "0.2rem 0.5rem 0.2rem 0.5rem",
    fontSize: "0.7rem",
    width: "14.28%",
  };
  const tableCellStyle = {
    border: "1px solid",
    textAlign: "center",
    padding: "0",
    fontSize: "0.8rem",
    borderLeft: "none",
    verticalAlign: "top",
  };
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        profile,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(profile),
    pageStyle: `
      @page {
        size: landscape!important;
        margin: 12mm 9mm!important;
      }   
    `,
  });
  const handlePrint1 = () => {
    handlePrint();
  };
  const print = usePrint(componentRef?.current && printRef, handlePrint1);
  const deleteShift = async (id) => {
    try {
      const res = await adminSchedulingService.deleteShift(id);
      setModalShow2(false);
      getAllShifts();
    } catch (error) {
      showNotification({
        message: error.response.data.message,
        type: "danger",
      });
    } finally {
      getAllShifts();
      fetchShiftAssignments(year, month, selectedFacility);
    }
  };
  const handleCarryForward = async () => {
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedYear = year.toString();
    try {
      await adminPortalService.forwardStaffSchedule(
        {
          month: formattedMonth,
          year: formattedYear,
          facility_id: selectedFacility,
        },
        { setLoading },
      );
      fetchShiftAssignments(year, month, selectedFacility);
    } catch (error) {
      const msg = error?.response?.data?.message || "An error occurred";
      showNotification({
        message: msg,
        type: "danger",
      });
    }
  };

  // Call fetchHandler when the dropdown value is selected
  const handleSelect = (e) => {
    const facilityId = e.target.value;
    setSelectedFacility(facilityId);
    setIsFacilityData(false);
    // Fetch data when a facility is selected
    if (facilityId) {
      getAllShifts(facilityId);
      const today = new Date();
      setMonth(today.getMonth() + 1);
      setYear(today.getFullYear());
      fetchShiftAssignments(
        today.getFullYear(),
        today.getMonth() + 1,
        facilityId,
      );
      getAllEmployees();
      setIsFacilityData(true);
    }
  };
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <AddDetailsModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        year={year}
        month={month}
        facilityId={selectedFacility}
        getScheduleAdministrator={getScheduleAdministrator}
      />
      {modalShow2 && (
        <AddShiftModal
          show={modalShow2}
          onHide={() => setModalShow2(false)}
          allShifts={allShifts && allShifts}
          deleteShift={deleteShift}
          getAllShifts={getAllShifts}
          getAllDetails={fetchShiftAssignments}
          year={year}
          month={month}
          facilityId={selectedFacility}
        />
      )}
      <Container>
        <div className="page-title-bar mb-3 hidePrint">
          <Row>
            <Col xs={12} md={4} xl={3}></Col>
            <Col xs={12} md={4} xl={6}>
              <p className="heading">Staff Schedule</p>
            </Col>
            <Col xs={12} md={4} xl={3}>
              <Form.Group className="d-flex gap-2 align-items-center justify-content-end">
                <Form.Label className="fw-bold flex-shrink-0 mb-sm-0">
                  Facility :{" "}
                </Form.Label>
                <Form.Select
                  size="sm"
                  value={selectedFacility}
                  onChange={handleSelect}
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
        {isFacilityData && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #0C5C75",
              width: "100%",
              padding: "0.5rem",
            }}
            className="monthOnLast fw-bold"
          >
            <i
              className="fa-solid fa-caret-left"
              style={iconStyle}
              onClick={() => MonthHandler(month - 1)}
            ></i>
            <p>
              Month/Year : {monthInEng[month - 1]} {year}
            </p>
            <i
              className="fa-solid fa-caret-right"
              style={iconStyle}
              onClick={() => MonthHandler(month + 1)}
            ></i>

            <button
              className="employee_create_btn_refill print-btn"
              onClick={handleCarryForward}
            >
              Carry Forward
            </button>
          </div>
        )}
      </Container>

      {loading ? (
        <Container>
          <Card body>
            <Form.Label className="w-100 text-center">
              <ClipLoader color="rgb(26, 159, 178)" />
            </Form.Label>
          </Card>
        </Container>
      ) : (
        <>
          <Container>
            {isFacilityData ? (
              <>
                <div ref={componentRef}>
                  <Row className="mt-lg-3 mb-3 align-items-center">
                    <Col xs={12} sm={3} md={4} xl={3}></Col>
                    <Col xs={12} sm={6} md={4} xl={6}>
                      <h1 className="pdfTitle my-2 hidden">
                        Staff Schedule for {monthInEng[month - 1]} {year}
                      </h1>
                      <div className="hidePrint text-center font-bold">
                        <p className="mb-0">
                          Staff Schedule for {monthInEng[month - 1]} {year}
                        </p>
                      </div>
                    </Col>
                    <Col xs={12} sm={3} md={4} xl={3}>
                      <div className="show-data-inprint">
                        <Form.Group className="d-flex gap-2 align-items-center justify-content-end my-2">
                          <Form.Label className="fw-bold flex-shrink-0 mb-sm-0">
                            Facility :{" "}
                          </Form.Label>
                          <Form.Label className="mb-sm-0">
                            {selectedFacility && (
                              <Form.Label className="mb-sm-0">
                                {
                                  facilityList?.data?.find(
                                    (facility) =>
                                      facility._id === selectedFacility,
                                  )?.name
                                }
                              </Form.Label>
                            )}
                          </Form.Label>
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>
                  <div className="bg-white">{generateTables()}</div>
                  <div className="table-print-footer">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold mb-0 w-100">
                        Administrator, House manager, BHP and Registered Nurse
                        are On-Call 24/7
                      </Form.Label>
                      <Form.Label className="fw-bold mb-0 w-100">
                        {" "}
                        Administrator and Number:{" "}
                        {staffAdministrator?.[0]?.administratorAndNumber}
                      </Form.Label>
                      <Form.Label className="fw-bold mb-0 w-100">
                        {" "}
                        Registered Nurse and Number :{" "}
                        {staffAdministrator?.[0]?.registeredNurseAndNumber}{" "}
                      </Form.Label>
                      <Form.Label className="fw-bold mb-0 w-100">
                        BHP Name and Number:{" "}
                        {staffAdministrator?.[0]?.bhtNameAndNumber}{" "}
                      </Form.Label>
                    </Form.Group>
                    <Form.Group className="mb-3 text-center hidePrint">
                      <Button
                        variant="primary"
                        onClick={() => setModalShow(true)}
                        className="theme-button mx-1"
                      >
                        Add Details
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => setModalShow2(true)}
                        className="theme-button mx-1"
                      >
                        Add Shifts
                      </Button>
                    </Form.Group>
                    <StaffScheduleSelect />
                  </div>
                </div>
                <Row className="mt-3 mt-md-4 text-center">
                  <Col xs={12}>
                    <Button
                      className="theme-button"
                      onClick={print}
                      variant="primary"
                    >
                      PRINT
                    </Button>
                  </Col>
                </Row>
              </>
            ) : (
              <Card body className="text-center">
                {" "}
                <span className="fw-bold">
                  No Staff Schedule Found! Please Select Facility
                </span>{" "}
              </Card>
            )}
          </Container>
        </>
      )}
    </div>
  );
};
export default HOC({
  Wcomponenet: StaffSchedule2,
});
