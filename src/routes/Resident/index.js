import { IntakeRoutes } from "./IntakeRoutes";
import { AppointmentRoutes } from "./AppointmentRoutes";
import { ChartRoutes } from "./ChartRoutes";
import { MedicationRoutes } from "./MedicationRoutes";
import { GeneralRoutes } from "./GeneralRoutes";

export const residentRoutes = [
  ...IntakeRoutes,
  ...AppointmentRoutes,
  ...ChartRoutes,
  ...MedicationRoutes,
  ...GeneralRoutes,
];
