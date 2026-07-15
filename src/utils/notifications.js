import { Store } from "react-notifications-component";
import {
  ERROR_MESSAGE,
  NOTIFICATION_DURATION_MS,
} from "@/features/shared/constants/uiConstants";

const getNotificationTitle = (type) => {
  if (type === "danger") return "Error";
  if (type === "success") return "Success";
  if (type === "info") return "";
  return "Success";
};

/**
 * Shows a toast notification.
 * Accepts a message string, a result object from the API layer, or { message, type }.
 */
export const showNotification = (input) => {
  let message = ERROR_MESSAGE;
  let type = "success";

  if (typeof input === "string") {
    message = input;
  } else if (input && typeof input === "object") {
    message = input.message ?? ERROR_MESSAGE;

    // Normalize type to ensure it is compatible with react-notifications-component
    if (input.success === false) {
      type = "danger";
    } else {
      const validTypes = [
        "success",
        "danger",
        "info",
        "default",
        "warning",
        "error",
      ];
      if (validTypes.includes(input.type)) {
        type = input.type;
      } else {
        type = "success";
      }
    }
  }

  const finalType = type === "error" ? "danger" : type;

  Store.addNotification({
    id: `${Date.now()}-${Math.random()}`,
    title: getNotificationTitle(finalType),
    message,
    type: finalType,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: NOTIFICATION_DURATION_MS,
      onScreen: true,
    },
  });
};

export {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  REMOVE_MESSAGE,
  PDF_PROCESSING_ERROR_MESSAGE,
  NOTIFICATION_DURATION_MS,
} from "@/features/shared/constants/uiConstants";
