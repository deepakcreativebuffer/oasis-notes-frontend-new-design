/** @format */

import React, { useEffect, useState } from "react";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar";
import "@/assets/styles/Sidebar.css";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  AdminSidebar,
  GuardianSidebar,
  MainSidebar,
  ResidentSidebar,
} from "../../constants";
import { MdOutlineLibraryBooks } from "react-icons/md";

import { ROLES } from "../../constants";
import { useHasParentLayout } from "../../contexts/LayoutContext";

const HOC = ({ Wcomponenet, isNavbar = true }) => {
  return function Component() {
    const hasParentLayout = useHasParentLayout();
    const [hamb, setHamb] = useState(false);
    const [navItem, setNavItem] = useState([]);
    const ProfileDetails = useSelector(userProfile);

    const newAdminSidebar = [...AdminSidebar];
    if (ProfileDetails?.tier === "Growth") {
      newAdminSidebar?.splice(6, 0, {
        icon: MdOutlineLibraryBooks,
        link: "/dashboard/notes",
        name: "Notes Library",
      });
    }

    useEffect(() => {
      if (hasParentLayout) return;
      if (ProfileDetails?.userType === ROLES.ADMIN) {
        setNavItem(newAdminSidebar);
      } else if (ProfileDetails?.userType === ROLES.EMPLOYEE) {
        setNavItem(MainSidebar);
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
        <section className="flex mh-100vh">
          {/* Sidebar */}
          <div
            className={
              hamb
                ? " absolute top-0 z-30 md:w-auto shadow-md sm:bg-[#1A9FB2] w-60 transition-all md:-left-full left duration-150 left-0 "
                : " bg-[#1A9FB2] shadow-md md:static absolute top-0 -left-full transition-all duration-150  asidebar"
            }
          >
            <Sidebar hamb={hamb} setHamb={setHamb} />
          </div>
          {/* Components & Navbar */}
          <div
            className={
              hamb
                ? "w-full transition-all py-2 duration-150"
                : "w-full transition-all py-2 duration-150 z-50 right-content"
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
