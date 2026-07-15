/** @format */

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  employeeSidebarNav,
  GuardianSidebar,
  Innernav,
  ResidentSidebar,
  residentSidebarNav,
} from "../../constants";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import "@/assets/styles/Sidebar.css";

import { ROLES, ACCOUNT_TYPES } from "../../constants";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ProfileDetails = useSelector(userProfile);
  const [navItem, setNavItem] = React.useState([]);
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
    "/patient_panel",
    "/intake",
    "/progress-chart-resident",
    "/assign-resident-list",
  ];

  useEffect(() => {
    if (ProfileDetails?.userType === ROLES.ADMIN) {
      setNavItem(residentSidebarNav);
    } else if (ProfileDetails?.userType === ROLES.EMPLOYEE) {
      if (location?.pathname === "/employment") setNavItem(employeeSidebarNav);
      else {
        setNavItem(Innernav);
      }
    } else if (ProfileDetails?.userType === ROLES.PATIENT) {
      setNavItem(ResidentSidebar);
    } else if (ProfileDetails?.userType === ROLES.GUARDIAN) {
      setNavItem(GuardianSidebar);
    }
  }, [ProfileDetails?.userType, location?.pathname]);

  return (
    <>
      <aside className="sm:bg-[rgb(26,159,178)] outer-sidebar">
        {/* Nav-menu */}

        <nav className="outer-siderbar-nav">
          <ul>
            {Array.isArray(navItem) &&
              navItem?.map((nav, index) =>
                alwaysEnabledItems.includes(nav?.link) ||
                ProfileDetails?.userType === ROLES.ADMIN ? (
                  <li
                    key={`nav${index}`}
                    onClick={() => navigate(nav.link)}
                    className={`menu-item ${
                      location.pathname === nav.link && "active"
                    }`}
                  >
                    {typeof nav.icon === "string" ? (
                      <img src={nav.icon} alt="" />
                    ) : (
                      <nav.icon />
                    )}
                    <div
                      className={`text ${
                        location.pathname === nav.link && "active"
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
                      location?.pathname === nav?.link && "active"
                    } ${
                      (Array.isArray(nav?.permissionKey) &&
                        nav?.permissionKey?.some((value) =>
                          ProfileDetails?.userPermissions?.view
                            ?.split(":")
                            .includes(value),
                        )) ||
                      ProfileDetails?.userPermissions?.view
                        ?.split(":")
                        .includes(nav?.permissionKey) ||
                      ProfileDetails.userType === ROLES.ADMIN ||
                      ProfileDetails?.accountType ===
                        ACCOUNT_TYPES.ADMINISTRATOR
                        ? ""
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
                        location?.pathname === nav?.link && "active"
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
    </>
  );
};

export default Sidebar;
