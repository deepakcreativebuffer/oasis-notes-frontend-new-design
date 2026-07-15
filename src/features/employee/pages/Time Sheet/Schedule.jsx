/** @format */
import { useEffect, useRef, useState, useMemo } from "react";
import Loader from "@/features/shared/ui/Loader/Loader";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { Container, Form, Row, Col, Button, Card } from "react-bootstrap";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { timesheetService } from "@/features/shared/services";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { convertTimeFormat } from "@/utils/utils";
import { usePrint } from "@shared/hooks";
import { useFacilities } from "@shared/hooks";
import { PrintThis, showNotification } from "@/utils";
const Schedule = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [updateMonth, setUpdatedMonth] = useState(0);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const [sortedData, setSortedData] = useState([]);
  const [allShift, setAllShifts] = useState({});
  const [formatedShifts, setFormatedShifts] = useState([]);
  const ProfileDetail = useSelector(userProfile);
  const hoursFormat = ProfileDetail?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = useRef(null);
  const facilities = useFacilities();
  const facilityList = useMemo(
    () => ({
      data: facilities,
    }),
    [facilities],
  );
  const [selectedFacility, setSelectedFacility] = useState("");
  const [isFacilityData, setIsFacilityData] = useState(false);
  const getAllShifts = (facilityId) => {
    timesheetService.getShiftsByFacility({
      facilityId: facilityId ?? selectedFacility,
      setResponse: setAllShifts,
      setLoading,
    });
  };
  useEffect(() => {
    if (allShift?.data?.length > 0) {
      const formattedShifts = allShift?.data?.map((shift) => ({
        _id: shift?._id,
        start: shift?.start,
        end: shift?.end,
        type: shift?.type,
        timeTaken: shift?.timeTaken,
      }));
      if (formattedShifts) {
        setFormatedShifts(formattedShifts);
      }
    } else {
      setFormatedShifts([]);
    }
  }, [allShift]);
  const today = new Date();
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
  useEffect(() => {
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function formatMonthNumber(month) {
    return month < 10 && `${month}`.length <= 1 ? `0${month}` : month;
  }
  useEffect(() => {
    if (month) {
      setUpdatedMonth(formatMonthNumber(month));
    }
  }, [month]);
  useEffect(() => {
    if (month) {
      getStaffScheduleByEmployeId(selectedFacility);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateMonth]);
  const getStaffScheduleByEmployeId = (facilityId) => {
    if (ProfileDetail) {
      const today = new Date();
      timesheetService.getStaffScheduleByEmployee({
        employeeId: ProfileDetail?._id,
        year: year || today.getFullYear(),
        month: formatMonthNumber(updateMonth || today.getMonth() + 1),
        facilityId,
        setResponse: setData,
        setLoading,
      });
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (data && Array.isArray(data?.data) && data.data.length > 0) {
        const item = data.data;
        setSortedData(
          [...item]?.sort(
            (a, b) => new Date(a?.currentDate) - new Date(b?.currentDate),
          ),
        );
      } else if (!loading) {
        showNotification({
          message: "No Data Found",
          type: "info",
        });
      }
    }, 800);
    return () => clearTimeout(timeout);
  }, [data, loading]);
  const renderTable = (startIndex, endIndex, dates) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div
        className={
          "staff_schedule_sheet  custom-fix print-table table-responsive "
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
                className="scheldule_th"
                style={{
                  ...tableHeaderStyle,
                  width: "0px",
                }}
              >
                Shifts
              </th>
              {days.map((day, index) => (
                <th key={index} className="scheldule_th">
                  {dates[index] >= 1 ? (
                    <div>
                      {day} {dates[index]}
                    </div>
                  ) : (
                    <div>{day}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            style={{
              border: "1px solid #ECECEC",
            }}
          >
            {generateRows(startIndex, endIndex)}
          </tbody>
        </table>
      </div>
    );
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
  const generateRows = (startIndex, endIndex) => {
    const rows = [];
    let shifts = formatedShifts.map((shift) => ({
      _id: shift._id,
      display:
        convertTimeFormat(shift.start, hoursFormat) +
        " - " +
        convertTimeFormat(shift.end, hoursFormat),
    }));
    for (let i = 0; i < shifts.length; i++) {
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
          <span className="shift-time">{shifts[i]?.display}</span>
        </td>,
      );
      for (let j = startIndex; j <= endIndex; j++) {
        if (j >= 1 && j <= new Date(year, month, 0).getDate()) {
          const mainData = sortedData.find((day) => day.currentDate === j);
          row.push(
            <td
              className="scheldule_td"
              style={{
                ...tableCellStyle,
                border: "1px solid #ECECEC",
              }}
              key={`day-${j}`}
            >
              <ul
                className="schelduleprint mb-0 text-left"
                style={{
                  padding: "5px",
                }}
              >
                {mainData?.schedule
                  ?.filter((scheduleItem) => {
                    return scheduleItem?.shiftId?._id === shifts[i]?._id;
                  })
                  ?.map((employee) => {
                    return employee.employeeId.map((i) => {
                      return i?.firstName && <li> {i?.firstName} </li>;
                    });
                  })}
              </ul>
            </td>,
          );
        } else {
          row.push(<td key={`day-${j}`}></td>);
        }
      }
      rows.push(<tr key={`row-${i}`}>{row}</tr>);
    }
    return rows;
  };
  const monthInEng = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const MonthHandler = (newMonth, facilityId) => {
    if (newMonth > 12) {
      setYear(year + 1);
      setMonth(1);
    } else if (newMonth < 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(newMonth);
    }
  };
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        ProfileDetail,
        ProfileDetail,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      ProfileDetail,
      ProfileDetail,
    ),
    pageStyle: `
       @page {
        size: landscape!important;
        margin: 12mm 9mm!important;
      }    
    `,
  });
  const handlePrint2 = () => {
    PrintThis(handlePrint);
  };
  const print = usePrint(printRef, handlePrint2);
  const handleSelect = (e) => {
    const facilityId = e.target.value;
    setSelectedFacility(facilityId);
    setIsFacilityData(false);
    if (facilityId) {
      getAllShifts(facilityId);
      getStaffScheduleByEmployeId(facilityId);
      setIsFacilityData(true);
    }
  };
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <Container>
        <div className="page-title-bar mb-3 hidePrint">
          <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 ">
            <div className=" flex-1">
              <p className="mb-0 text-sm md:text-base">
                Total Shifts:{" "}
                <span className="font-semibold">
                  {ProfileDetail.totalShiftCount}
                </span>
              </p>
            </div>
            <div className="flex-[0_0_50%]">
              <p className="heading">Staff Schedule</p>
            </div>
            <div className="flex-1">
              <Form.Group className="d-flex gap-2 align-items-center justify-content-end">
                <Form.Label className="fw-bold flex-shrink-0 mb-sm-0">
                  Facility :{" "}
                </Form.Label>
                <Form.Select
                  className="hidePrint"
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
            </div>
          </div>
        </div>
        <div className="print-staff-schedule" ref={componentRef}>
          <div className="monthOnLast fw-bold hidePrint flex">
            <i
              className="fa-solid fa-caret-left"
              onClick={() => MonthHandler(month - 1, selectedFacility)}
            ></i>
            <p>
              Month/Year : {monthInEng[updateMonth - 1]} {year}
            </p>
            <i
              className="fa-solid fa-caret-right"
              onClick={() => MonthHandler(month + 1, selectedFacility)}
            ></i>
          </div>
          <Row>
            <Col xs={12} sm={3} md={4} xl={3}></Col>
            <Col xs={12} sm={6} md={4} xl={6}>
              <h1 className="pdfTitle my-2 hidden">Staff Schedule</h1>
            </Col>
            <Col xs={12} sm={3} md={4} xl={3}>
              <div className="show-data-inprint">
                <Form.Group className="d-flex gap-2 align-items-center justify-content-end my-2">
                  <Form.Label className="fw-bold flex-shrink-0 mb-sm-0">
                    Facility :{" "}
                  </Form.Label>
                  <Form.Label className="mb-sm-0">
                    {selectedFacility && (
                      <Form.Label className="fw-noraml mb-sm-0">
                        {
                          facilityList?.data?.find(
                            (facility) => facility._id === selectedFacility,
                          )?.name
                        }
                      </Form.Label>
                    )}
                  </Form.Label>
                </Form.Group>
              </div>
            </Col>
          </Row>
          {loading ? (
            <Loader />
          ) : (
            <>
              {data?.data?.length > 0 &&
              isFacilityData &&
              allShift?.data?.length > 0 ? (
                <>
                  <div className="bg-white">{generateTables()}</div>
                  <div className="table-print-footer">
                    <Form.Label className="fw-bold mb-0 w-100">
                      {" "}
                      Administrator, House manager, BHT and Registered Nurse are
                      On-Call 24/7
                    </Form.Label>
                    <Form.Label className="fw-bold mb-0 w-100">
                      Administrator and Number:{" "}
                      {data?.administratorData?.administratorAndNumber}
                    </Form.Label>
                    <Form.Label className="fw-bold mb-0 w-100">
                      Registered Nurse and Number:{" "}
                      {data?.administratorData?.registeredNurseAndNumber}
                    </Form.Label>
                    <Form.Label className="fw-bold mb-0 w-100">
                      BHT Name and Number:{" "}
                      {data?.administratorData?.bhtNameAndNumber}
                    </Form.Label>
                  </div>
                  <Row>
                    <Col xs={12}>
                      <div className="text-center mt-2 mt-md-5">
                        <Button
                          className="theme-button hidePrint"
                          type="button"
                          onClick={print}
                        >
                          PRINT REPORT
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </>
              ) : (
                <Card body className="text-center">
                  {" "}
                  <span className="fw-bold">
                    {!isFacilityData &&
                    !data?.data?.length &&
                    !allShift?.data?.length
                      ? "No Staff Schedule Found! Please Select Facility"
                      : (isFacilityData &&
                            !data?.data?.length &&
                            allShift?.data?.length) ||
                          (isFacilityData &&
                            data?.data?.length &&
                            !allShift?.data?.length)
                        ? "Shift Is Not Assigned!"
                        : isFacilityData &&
                            !data?.data?.length &&
                            !allShift?.data?.length
                          ? "Shift Is Not Assigned!"
                          : ""}
                  </span>
                </Card>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: Schedule,
});
