/** @format */

import React, { useEffect, useRef, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AdminSidebar,
  GuardianSidebar,
  MainSidebar,
  ResidentSidebar,
  residentSidebarNav,
  isResidentRoute,
  Innernav,
  employeeSidebarNav,
} from "../../constants";
import { userProfile } from "@/store/authSlice";
import "@/assets/styles/Sidebar.css";
import { MdOutlineLibraryBooks } from "react-icons/md";

import { ROLES } from "../../constants";

/**
 * Check whether a sidebar link should be considered "active" for the
 * current pathname.  Uses startsWith with a `/` boundary so that
 * "/dashboard/homepage" does NOT match "/dashboard/homepageXYZ",
 * but DOES match "/dashboard/homepage/sub-page".
 */
const isActiveLink = (pathname, link) => {
  if (!pathname || !link) return false;
  if (pathname === link) return true;
  return pathname.startsWith(link + "/");
};

const Sidebar = ({ hamb, setHamb }) => {
  const newAdminSidebar = [...AdminSidebar];
  const navigate = useNavigate();
  const location = useLocation();
  const ProfileDetails = useSelector(userProfile);
  if (
    ProfileDetails?.tier === "Growth" ||
    ProfileDetails?.permissionNoteLibrary === true
  ) {
    newAdminSidebar?.splice(6, 0, {
      icon: MdOutlineLibraryBooks,
      link: "/dashboard/notes",
      name: "Notes Library",
    });
  }
  const [navItem, setNavItem] = useState([]);
  const activeItemRef = useRef(null);
  useEffect(() => {
    if (ProfileDetails?.userType === ROLES.ADMIN) {
      if (isResidentRoute(location.pathname)) {
        setNavItem(residentSidebarNav);
      } else {
        setNavItem(newAdminSidebar);
      }
    } else if (ProfileDetails?.userType === ROLES.EMPLOYEE) {
      const innerNavRoutes = [
        "/employee/patient-chart",
        "/vitals",
        "/patient-tracking",
        "/medications",
        "/milega-log",
        "/therapy-log",
        "/reassessment",
        "/view-reassessment",
        "/update-reassessment",
        "/create-reassessment",
      ];
      const employmentRoutes = [
        "/basic-information",
        "/employment",
        "/employee/training",
        "/get-time-of-request",
        "/scheduleGroup",
        "/employee-performance",
        "/employee-tracking",
      ];

      if (innerNavRoutes.some((route) => location.pathname.startsWith(route))) {
        setNavItem(Innernav);
      } else if (
        employmentRoutes.some((route) => location.pathname.startsWith(route))
      ) {
        setNavItem(employeeSidebarNav);
      } else {
        setNavItem(MainSidebar);
      }
    } else if (ProfileDetails?.userType === ROLES.PATIENT) {
      setNavItem(ResidentSidebar);
    } else if (ProfileDetails?.userType === ROLES.GUARDIAN) {
      setNavItem(GuardianSidebar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ProfileDetails, location.pathname]);

  // Scroll the active sidebar item into view on page load or location change
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [location.pathname]);

  return (
    <>
      <aside className="sm:bg-[rgb(26,159,178)] outer-sidebar fixed">
        {/* Top */}
        <div className="w-full md:hidden relative p-2 mb-4">
          <RiCloseLine
            onClick={() => setHamb(!hamb)}
            className="text-3xl  absolute top-2 sm:hover:rotate-[228deg] transition-transform font-bold right-2 sm:hover:text-[22px] text-[rgb(241,146,46)] cursor-pointer"
          />
        </div>

        {/* Nav-menu */}

        <nav className="outer-siderbar-nav">
          <ul>
            {Array.isArray(navItem) &&
              navItem?.map((nav, index) => (
                <li
                  key={`nav${index}`}
                  ref={
                    isActiveLink(location.pathname, nav.link)
                      ? activeItemRef
                      : null
                  }
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
              ))}
          </ul>
        </nav>

        <h5 className="app-verion-text mb-0">App version 1.0</h5>
      </aside>
    </>
  );
};

export default Sidebar;
