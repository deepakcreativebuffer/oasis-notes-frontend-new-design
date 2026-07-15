import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import PatientList from "./PatientList";
import HOC from "@/features/shared/layout/Outer/HOC";
import HOC2 from "@/features/shared/layout/EmployeeBar/HOC";

import { ROLES } from "@/features/shared/constants";

const EmployeePatientList = HOC({ Wcomponenet: PatientList });
const OtherPatientList = HOC2({ Wcomponenet: PatientList });

const PatientListWrapper = () => {
  const ProfileDetails = useSelector(userProfile);

  if (ProfileDetails?.userType === ROLES.EMPLOYEE) {
    return <EmployeePatientList />;
  }

  return <OtherPatientList />;
};

export default PatientListWrapper;
