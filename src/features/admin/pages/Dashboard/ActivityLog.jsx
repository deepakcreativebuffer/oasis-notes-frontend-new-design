/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import HOC from "@/features/shared/layout/Outer/HOC";
import { Button, Table } from "react-bootstrap";
import { adminPortalService } from "@/features/shared/services";
import { fetchPaitentName, getFormattedDateTime } from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { getObjectUrlFromDownloadUrl } from "@/features/shared/services";
import { defaultProfileIcon } from "@/assets";
import DatePicker from "react-datepicker";
import { MdFilterAltOff } from "react-icons/md";
import { SearchAndSelect } from "@/utils/SearchAndSelect";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import { DEFAULT_PAGE_SIZE } from "@/features/shared/constants";
import { ClipLoader } from "react-spinners";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

const ActivityLog = () => {
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [days, setDays] = useState(1);
  const [users, setUsers] = useState([]);
  const [formOptions, setFormOptions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchFormType, setSearchFormType] = useState("All Form Type");
  const [searchUser, setSearchUser] = useState("All Users");
  const [filters, setFilters] = useState({
    timeStart: "",
    timeEnd: "",
    user: "All Users",
    formType: "All Form Type",
  });
  useEffect(() => {
    adminPortalService.getActiveUsers({
      setResponse: (response) => {
        const usersData = response?.data || [];
        const formattedUsers = usersData.map((user) => ({
          label: fetchPaitentName(user),
          value: user._id,
        }));
        const userOptions = [
          {
            label: "All Users",
            value: "All Users",
          },
          ...formattedUsers,
        ];
        setUsers(userOptions);
      },
      setLoading: () => {},
    });
    adminPortalService.getActivityLogFormTypes({
      setResponse: (response) => {
        const usersData = response?.data || [];
        const formattedUsers = usersData.map((formName) => ({
          label: formName,
          value: formName,
        }));
        const userOptions = [
          {
            label: "All Form Type",
            value: "All Form Type",
          },
          ...formattedUsers,
        ];
        setFormOptions(userOptions);
      },
      setLoading: () => {},
    });
  }, []);
  const getQueryParams = useCallback(() => {
    let query = `limit=${limit}&page=${page}`;
    if (filters.timeStart !== "") {
      query += `&from=${filters.timeStart}`;
    }
    if (filters.timeEnd !== "") {
      query += `&to=${filters.timeEnd}`;
    }
    if (filters.user !== "All Users") {
      query += `&user=${filters.user}`;
    }
    if (filters.formType !== "All Form Type") {
      query += `&form_type=${decodeURIComponent(encodeURIComponent(filters.formType))}`;
    }
    return query;
  }, [limit, page, filters]);
  const { data, isLoading: loading } = useQuery({
    queryKey: queryKeys.adminPortal.list({
      filters,
      limit,
      page,
      activityLog: true,
    }),
    queryFn: () => adminPortalService.getActivityLogs(getQueryParams()),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();
  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.adminPortal.all() });
  }, [queryClient]);
  const clearFilter = () => {
    setFilters({
      timeStart: "",
      timeEnd: "",
      user: "All Users",
      formType: "All Form Type",
    });
    setStartDate("");
    setEndDate("");
    setSearchFormType("");
    setSearchUser("");
  };
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };
  const exportData = (format) => {
    let csvContent = "";
    const headers = ["Activity Time", "User Name", "Form Type", "Action Type"];
    if (format === "csv") {
      csvContent = headers.join(",") + "\n";
      data?.data?.docs?.forEach((row) => {
        csvContent += `${getFormattedDateTime(row.activityTime, hoursFormat)},${fetchPaitentName(row.user)},${row.formType},${row.action}\n`;
      });
    } else {
      csvContent = headers.join("\t") + "\n";
      data?.data?.docs?.forEach((row) => {
        csvContent += `${getFormattedDateTime(row.activityTime, hoursFormat)}\t${fetchPaitentName(row.user)}\t${row.formType}\t${row.action}\n`;
      });
    }
    const blob = new Blob([csvContent], {
      type: format === "csv" ? "text/csv" : "application/vnd.ms-excel",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `export.${format}`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <div>
      <div>
        <div>
          <div className="p-2 p-xl-6">
            <div className="flex flex-column flex-lg-row justify-between items-center gap-2 mb-2 mb-md-5 activity-log-header-filter">
              <div className="flex flex-column flex-lg-row gap-2">
                <div className="flex-sm mb-2 mb-md-0">
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px]">From</span>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        handleFilterChange("timeStart", date);
                        setStartDate(date);
                      }}
                      showTimeSelect
                      className="p-1 w-100"
                      timeFormat={
                        profile?.hoursFormat === "24" ? "HH:mm" : "h:mm a"
                      }
                      timeIntervals={1}
                      timeCaption="time"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      placeholderText="Select Start Date"
                    />
                  </div>
                </div>
                <div className="flex-sm gap-2 mb-2 mb-md-0">
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px]">To</span>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => {
                        handleFilterChange("timeEnd", date);
                        setEndDate(date);
                      }}
                      showTimeSelect
                      className="p-1 w-100"
                      timeFormat={
                        profile?.hoursFormat === "24" ? "HH:mm" : "h:mm a"
                      }
                      timeIntervals={1}
                      timeCaption="time"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      placeholderText="Select End Date"
                    />
                  </div>
                </div>

                {formOptions?.length > 0 && (
                  <div className="flex gap-2 mb-3 mb-md-0">
                    <SearchAndSelect
                      text="Search Form Type"
                      options={formOptions && formOptions}
                      selectedValue={searchFormType}
                      setSelectedValue={setSearchFormType}
                      isOtherState={true}
                      otherType="formType"
                      otherState={handleFilterChange}
                    />
                  </div>
                )}
                {users.length > 0 && (
                  <div className="flex gap-2 mb-3 mb-md-0">
                    <SearchAndSelect
                      text="Search User"
                      options={users && users}
                      selectedValue={searchUser}
                      setSelectedValue={setSearchUser}
                      isOtherState={true}
                      otherType="user"
                      otherState={handleFilterChange}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-[14px]"> Reset</span>
                  <Button
                    type="button"
                    className="theme-button "
                    onClick={clearFilter}
                  >
                    <MdFilterAltOff />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => exportData("csv")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => exportData("xlsx")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Export Excel
                </button>
              </div>
            </div>
            <Table responsive bordered>
              <thead className="overflow-clip">
                <tr>
                  <th>Activity Time</th>
                  <th>User Name</th>
                  <th>Form Type</th>
                  <th>Action Type</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-2">
                      <ClipLoader color="rgb(26, 159, 178)" />
                    </td>
                  </tr>
                ) : data?.data?.docs?.length > 0 ? (
                  data?.data?.docs?.map((row, index) => (
                    <tr
                      key={row.id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="whitespace-nowrap">
                        {getFormattedDateTime(row.activityTime, hoursFormat)}
                      </td>
                      <td className="whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            {row?.user?.profilePic ? (
                              <img
                                src={getObjectUrlFromDownloadUrl(
                                  row?.user?.profilePic,
                                )}
                                alt=""
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              <img
                                src={defaultProfileIcon}
                                alt=""
                                className="h-8 w-8 rounded-full"
                              />
                            )}
                          </div>
                          {fetchPaitentName(row.user)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap">{row.formType}</td>
                      <td className="whitespace-nowrap">
                        <span
                          className={`text-sm ${row.action === "Created" ? "text-green-800" : row.action === "Updated" ? "text-blue-800" : "text-red-800"}`}
                        >
                          {row.action}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      No Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          {data?.data?.docs.length > 0 && (
            <PaginationsPage
              page={page}
              setPage={setPage}
              totalPages={data?.data?.totalPages && data?.data?.totalPages}
              limit={limit}
              setLimit={setLimit}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default HOC({
  Wcomponenet: ActivityLog,
});
