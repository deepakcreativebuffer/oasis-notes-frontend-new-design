import { IntakeRoutes } from "./IntakeRoutes";
import { ChartRoutes } from "./ChartRoutes";
import { MedicationRoutes } from "./MedicationRoutes";
import { EmploymentRoutes } from "./EmploymentRoutes";
import { GeneralRoutes } from "./GeneralRoutes";

export const employeeRoutes = [
  ...IntakeRoutes,
  ...ChartRoutes,
  ...MedicationRoutes,
  ...EmploymentRoutes,
  ...GeneralRoutes,
];
