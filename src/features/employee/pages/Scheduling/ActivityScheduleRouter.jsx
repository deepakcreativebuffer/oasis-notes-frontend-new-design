import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import ActivityScheduleEmployeePage from "./ActivityScheduleEmployeePage";
import ActivityScheduleAdminPage from "@/features/admin/pages/Scheduling/ActivityScheduleAdminPage";

import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants/index";

export default function ActivityScheduleByUser() {
  const user = useSelector(userProfile);

  return user.userType === ROLES.EMPLOYEE &&
    user.accountType === ACCOUNT_TYPES.RESTRICTED ? (
    <ActivityScheduleEmployeePage />
  ) : (
    <ActivityScheduleAdminPage />
  );
}
