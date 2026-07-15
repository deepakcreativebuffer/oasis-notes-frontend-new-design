/** @format */

import React from "react";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { timeSheet, schedule } from "@/assets/index";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";

import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";

const ScheduleGroup = () => {
  const profileData = useSelector(userProfile);
  const profileDetails =
    typeof profileData?.userPermissions?.view === "string"
      ? profileData.userPermissions.view.split(":")
      : [];
  const userType = profileData?.userType;
  const accountType = profileData?.accountType;

  const isAdmin = userType === ROLES.ADMIN;
  const isAdministrator = accountType === ACCOUNT_TYPES.ADMINISTRATOR;
  const isReadOnlyEmployee =
    accountType === ACCOUNT_TYPES.RESTRICTED && userType === ROLES.EMPLOYEE;
  const isRegularEmployee =
    accountType === ACCOUNT_TYPES.REGULAR && userType === ROLES.EMPLOYEE;
  const isAdministratorEmployee =
    isAdministrator && userType === ROLES.EMPLOYEE;
  const data = [
    {
      src: schedule,
      link: "/schedule",
      title: "Staff Schedule",
      permissionKey: "staffsch",
    },
    {
      src: timeSheet,
      link: "/time-sheet",
      title: "Time Sheet",
      permissionKey: "timesheet",
    },
  ];

  return (
    <>
      <NavWrapper title={"Time Sheet / Staff Schedule"} isArrow={true} />
      <Container>
        <div className="patient_chart_container">
          {data?.map((i, index) => {
            const isAllowed =
              (profileDetails?.includes(i?.permissionKey) &&
                (isRegularEmployee || isReadOnlyEmployee)) ||
              isAdmin ||
              isAdministratorEmployee;
            return (
              <Link
                to={i?.link}
                key={index}
                className={`chart_images ${isAllowed ? "" : "disabled-link"} `}
              >
                <img src={i.src} alt="" />
                <p> {i.title} </p>
              </Link>
            );
          })}
        </div>
      </Container>
    </>
  );
};

export default HOC({ Wcomponenet: ScheduleGroup });
