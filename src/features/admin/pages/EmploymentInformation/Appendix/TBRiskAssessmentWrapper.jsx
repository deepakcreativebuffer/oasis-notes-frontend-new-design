import React from "react";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import HOC from "@/features/shared/layout/Inner/HOC";
import HOC2 from "@/features/shared/layout/EmployeeBar/HOC";

import { ROLES } from "@/features/shared/constants";

const TBRiskAssessmentWrapper = ({ component }) => {
  const ProfileDetails = useSelector(userProfile);
  const WrappedComponent =
    ProfileDetails?.userType === ROLES.EMPLOYEE ||
    ProfileDetails?.userType === ROLES.ADMIN
      ? HOC2({ Wcomponenet: component })
      : HOC({ Wcomponenet: component });
  return <WrappedComponent />;
};

export default TBRiskAssessmentWrapper;
