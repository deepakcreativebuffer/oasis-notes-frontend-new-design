/** @format */

import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import CreateNav from "@/utils/CreateNav";
import HOC from "@/features/shared/layout/Inner/HOC";
import { timesheetService } from "@/features/shared/services";
import { TableLayout } from "@/features/shared/ui/HelpingComponents";
import { Link } from "react-router-dom";
const TimeSheetList = () => {
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchHandler = () => {
    timesheetService.listEmployeesTimeSheets({
      setLoading,
      setResponse: setData,
    });
  };
  useEffect(() => {
    fetchHandler();
  }, []);
  useEffect(() => {
    if (Array.isArray(data?.data)) {
      const tempData = data?.data.map((i) => [
        i?.employeeId?.fullName ||
          i?.employeeId?.firstName + " " + i?.employeeId?.lastName,
        <Link to={`/time-sheet/${i._id}`}>View ID</Link>,
      ]);
      setTableData(tempData);
    }
  }, [data]);
  return (
    <>
      <CreateNav title={"Time Sheet"} isTimesheet={true} />

      <Container className="full-width-container">
        <TableLayout
          thead={["Employee Name", "View"]}
          tbody={tableData}
          loading={loading}
        />
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: TimeSheetList,
});
