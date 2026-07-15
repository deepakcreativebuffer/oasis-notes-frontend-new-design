import React from "react";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import PatientChart from "./PatientChart";
import HOC from "@/features/shared/layout/Inner/HOC";
import HOC2 from "@/features/shared/layout/EmployeeBar/HOC";

import { ROLES } from "@/features/shared/constants";

const PatientChartWrapper = () => {
  const ProfileDetails = useSelector(userProfile);

  const WrappedComponent =
    ProfileDetails?.userType === ROLES.EMPLOYEE
      ? HOC({ Wcomponenet: PatientChart })
      : HOC2({ Wcomponenet: PatientChart });

  return <WrappedComponent />;
};

export default PatientChartWrapper;
