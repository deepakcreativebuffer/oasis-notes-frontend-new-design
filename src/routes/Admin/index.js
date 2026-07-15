import { EmployeeManagementRoutes } from "./EmployeeManagementRoutes";
import { FormsRoutes } from "./FormsRoutes";
import { PatientRoutes } from "./PatientRoutes";
import { TrainingRoutes } from "./TrainingRoutes";
import { CoreRoutes } from "./CoreRoutes";

export const adminRoutes = [
  ...EmployeeManagementRoutes,
  ...FormsRoutes,
  ...PatientRoutes,
  ...TrainingRoutes,
  ...CoreRoutes,
];
