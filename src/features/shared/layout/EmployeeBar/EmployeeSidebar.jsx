/** @format */

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  employeeSidebarNav,
  adminEmployeeSidebarNav,
  GuardianSidebar,
} from "../../constants";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import "@/assets/styles/Sidebar.css";
import { ROLES, ACCOUNT_TYPES } from "../../constants";

const isActiveLink = (pathname, link) => {
  if (!pathname || !link) return false;
  if (pathname === link) return true;
  return pathname.startsWith(link + "/");
};

const EmployeeSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ProfileDetails = useSelector(userProfile);

  const [currentNavList, setCurrentNavList] = useState([]);

  useEffect(() => {
    if (ProfileDetails?.userType === ROLES.EMPLOYEE) {
      setCurrentNavList(employeeSidebarNav);
    } else if (ProfileDetails?.userType === ROLES.GUARDIAN) {
      setCurrentNavList(GuardianSidebar);
    } else {
      setCurrentNavList(adminEmployeeSidebarNav);
    }
  }, [ProfileDetails?.userType]);

  const alwaysEnabledItems = [
    "/Home",
    "/employee/patient-chart",
    "/employment",
    "/employee/training",
    "/dashboard/contacts",
    "/dashboard/tracking",
    "/dashboard/logs",
    "/dashboard/reference-check",
    "/dashboard/pto",
    "dashboard/employee-performance",
    "/dashboard/staff-schedule",
    "/dashboard/notes",
    "/dashboard/offer-letter",
    "/dashboard/job-description",
    "/dashboard/patient-vitals",
    "/dashboard/patient-tracking",
    "/special-notes",
    "/employment-admin ",
    "/patient-list",
    "/employee/patient-chart",
    "/assign-resident-list",
    "/patient_panel",
  ];

  return (
    <aside className="sm:bg-[rgb(26,159,178)] outer-sidebar ">
      {/* Nav-menu */}
      <nav className="outer-siderbar-nav">
        <ul>
          {Array.isArray(currentNavList) &&
            currentNavList?.map((nav, index) =>
              alwaysEnabledItems.includes(nav?.link) ||
              ProfileDetails.userType === ROLES.ADMIN ? (
                <li
                  key={`nav${index}`}
                  onClick={() => navigate(nav.link)}
                  className={`menu-item ${
                    isActiveLink(location.pathname, nav.link) && "active"
                  }`}
                >
                  {typeof nav.icon === "string" ? (
                    <img src={nav.icon} alt="" />
                  ) : (
                    <nav.icon />
                  )}
                  <div
                    className={`text ${
                      isActiveLink(location.pathname, nav.link) && "active"
                    }`}
                  >
                    {nav.name}
                  </div>
                </li>
              ) : (
                <li
                  key={`nav${index}`}
                  onClick={() => navigate(nav?.link)}
                  className={`menu-item ${
                    isActiveLink(location?.pathname, nav?.link) && "active"
                  } ${
                    (ProfileDetails?.userPermissions?.view
                      ?.split(":")
                      .includes(nav?.permissionKey) &&
                      (ProfileDetails?.accountType === ACCOUNT_TYPES.REGULAR ||
                        ProfileDetails?.accountType ===
                          ACCOUNT_TYPES.RESTRICTED)) ||
                    ProfileDetails.userType === ROLES.ADMIN ||
                    ProfileDetails?.accountType === ACCOUNT_TYPES.ADMINISTRATOR
                      ? " "
                      : "disabled-link"
                  }`}
                >
                  {typeof nav?.icon === "string" ? (
                    <img src={nav?.icon} alt="" />
                  ) : (
                    <nav.icon />
                  )}
                  <div
                    className={`text ${
                      isActiveLink(location?.pathname, nav?.link) && "active"
                    }`}
                  >
                    {nav?.name}
                  </div>
                </li>
              ),
            )}
        </ul>
      </nav>
      <h5 className="app-verion-text mb-0">App version 1.0</h5>
    </aside>
  );
};

export default EmployeeSidebar;
