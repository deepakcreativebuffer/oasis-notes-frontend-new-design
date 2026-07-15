/** @format */

import React, { useEffect, useState } from "react";
import EmployeeSidebar from "./EmployeeSidebar";
import Navbar from "../Outer/Navbar/Navbar";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import ResidentSidebar from "./ResidentSidebar";
import { ROLES } from "../../constants";
import {
  adminEmployeeSidebarNav,
  employeeSidebarNav,
  GuardianSidebar,
  residentSidebarNav,
  isResidentRoute,
} from "../../constants";

const HOC = ({ Wcomponenet, isNavbar = true }) => {
  return function Component() {
    const ProfileDetails = useSelector(userProfile);
    const location = useLocation();
    const [hamb, setHamb] = useState(false);
    const [navList, setNavList] = useState([]);

    useEffect(() => {
      if (
        ProfileDetails.userType === ROLES.ADMIN &&
        isResidentRoute(location.pathname)
      ) {
        setNavList(residentSidebarNav);
      } else {
        if (ProfileDetails?.userType === ROLES.EMPLOYEE) {
          setNavList(employeeSidebarNav);
        } else if (ProfileDetails?.userType === ROLES.GUARDIAN) {
          setNavList(GuardianSidebar);
        } else {
          setNavList(adminEmployeeSidebarNav);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        <section className="flex wrapper-content">
          <div
            className={
              hamb
                ? " absolute top-0 z-30 md:w-auto shadow-md sm:bg-[#1A9FB2]  w-60 transition-all md:-left-full left duration-150  h-screen  left-0 "
                : " bg-[#1A9FB2] shadow-md md:static absolute top-0 -left-full h-screen transition-all duration-150 asidebar"
            }
          >
            {ProfileDetails.userType === ROLES.ADMIN &&
            isResidentRoute(location.pathname) ? (
              <ResidentSidebar hamb={hamb} setHamb={setHamb} />
            ) : (
              <EmployeeSidebar hamb={hamb} setHamb={setHamb} />
            )}
          </div>

          <div
            className={
              hamb
                ? " transition-all py-2 duration-150 w-full h-screen"
                : " w-full py-2 z-50 transition-all duration-150 "
            }
          >
            {isNavbar && (
              <Navbar hamb={hamb} setHamb={setHamb} routesMob={navList} />
            )}
            <div className="content-wrappper wcomp">
              <Wcomponenet />
            </div>
          </div>
        </section>
      </>
    );
  };
};

export default HOC;
