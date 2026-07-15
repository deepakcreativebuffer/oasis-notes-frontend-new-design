import React from "react";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import SearchPage from "./SearchPage";
import HOC from "@/features/shared/layout/Outer/HOC";
import HOC2 from "@/features/shared/layout/EmployeeBar/HOC";

import { ROLES } from "@/features/shared/constants";

const SearchPageWrapper = () => {
  const ProfileDetails = useSelector(userProfile);

  const WrappedComponent =
    ProfileDetails?.userType === ROLES.EMPLOYEE
      ? HOC({ Wcomponenet: SearchPage })
      : HOC2({ Wcomponenet: SearchPage });

  return <WrappedComponent />;
};

export default SearchPageWrapper;
