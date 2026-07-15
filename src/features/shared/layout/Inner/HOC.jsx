/** @format */

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "@/assets/styles/Sidebar.css";
import Navbar from "../Outer/Navbar/Navbar";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  employeeSidebarNav,
  GuardianSidebar,
  Innernav,
  ResidentSidebar,
  residentSidebarNav,
} from "../../constants";
import { useLocation } from "react-router-dom";

import { ROLES } from "../../constants";
import { useHasParentLayout } from "../../contexts/LayoutContext";

const HOC = ({ Wcomponenet, isNavbar = true }) => {
  return function Component() {
    const hasParentLayout = useHasParentLayout();
    const ProfileDetails = useSelector(userProfile);
    const location = useLocation();
    const [hamb, setHamb] = useState(false);
    const [navItem, setNavItem] = useState([]);

    useEffect(() => {
      if (hasParentLayout) return;
      if (ProfileDetails?.userType === ROLES.ADMIN) {
        setNavItem(residentSidebarNav);
      } else if (ProfileDetails?.userType === ROLES.EMPLOYEE) {
        if (location?.pathname === "/employment")
          setNavItem(employeeSidebarNav);
        else {
          setNavItem(Innernav);
        }
      } else if (ProfileDetails?.userType === ROLES.PATIENT) {
        setNavItem(ResidentSidebar);
      } else if (ProfileDetails?.userType === ROLES.GUARDIAN) {
        setNavItem(GuardianSidebar);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasParentLayout]);

    // If a persistent AppLayout shell is already rendered, render content only
    if (hasParentLayout) {
      return <Wcomponenet />;
    }

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
            <Sidebar hamb={hamb} setHamb={setHamb} />
          </div>

          <div
            className={
              hamb
                ? " transition-all py-2 duration-150 w-full h-screen"
                : " w-full py-2 z-50 transition-all duration-150 right-content"
            }
          >
            {isNavbar && (
              <Navbar hamb={hamb} setHamb={setHamb} routesMob={navItem} />
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
