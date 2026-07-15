/** @format */

import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Outer/Navbar/Navbar";
import OuterSidebar from "../Outer/Sidebar";
import "@/assets/styles/Sidebar.css";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  AdminSidebar,
  GuardianSidebar,
  MainSidebar,
  ResidentSidebar,
  ROLES,
  Innernav,
  employeeSidebarNav,
} from "../../constants";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { LayoutProvider } from "../../contexts/LayoutContext";
import Loader from "../../ui/Loader/Loader";

/**
 * Persistent layout shell that wraps all authenticated routes.
 * Renders sidebar + navbar ONCE — they never unmount during navigation.
 * Children (the route content) swap in/out inside the content area.
 */
import { useLocation } from "react-router-dom";

const AppLayout = ({ children, loading = false }) => {
  const newAdminSidebar = [...AdminSidebar];
  const [hamb, setHamb] = useState(false);
  const [navItem, setNavItem] = useState([]);
  const location = useLocation();

  const ProfileDetails = useSelector(userProfile);
  if (ProfileDetails?.tier === "Growth") {
    newAdminSidebar?.splice(6, 0, {
      icon: MdOutlineLibraryBooks,
      link: "/dashboard/notes",
      name: "Notes Library",
    });
  }

  useEffect(() => {
    if (ProfileDetails?.userType === ROLES.ADMIN) {
      setNavItem(newAdminSidebar);
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
  }, [ProfileDetails?.userType, ProfileDetails?.tier, location.pathname]);

  return (
    <LayoutProvider>
      {loading && <Loader />}
      <section className="flex mh-100vh">
        {/* Sidebar — always mounted */}
        <div
          className={
            hamb
              ? " absolute top-0 z-30 md:w-auto shadow-md sm:bg-[#1A9FB2] w-60 transition-all md:-left-full left duration-150 left-0 "
              : " bg-[#1A9FB2] shadow-md md:static absolute top-0 -left-full transition-all duration-150  asidebar"
          }
        >
          <OuterSidebar hamb={hamb} setHamb={setHamb} />
        </div>
        {/* Navbar + Content — always mounted */}
        <div
          className={
            hamb
              ? "w-full transition-all py-2 duration-150"
              : "w-full transition-all py-2 duration-150 z-50 right-content"
          }
        >
          <Navbar hamb={hamb} setHamb={setHamb} routesMob={navItem} />
          <div className="content-wrappper wcomp">
            <div
              className={
                loading ? "route-content-loading" : "route-content-ready"
              }
            >
              {children || <Outlet />}
            </div>
          </div>
        </div>
      </section>
    </LayoutProvider>
  );
};

export default AppLayout;
