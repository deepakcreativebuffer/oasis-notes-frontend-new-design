/** @format */

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { userProfile } from "../store/authSlice";
import { parse, format, isValid, parseISO } from "date-fns";
import { sanitizeHtml } from "./security/sanitizeHtml";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";

// print report
import { getPatientDetails } from "@/features/shared/services";
import { showNotification } from "./notifications";
import { PRINT_TIMEOUT_MS } from "@/features/shared/constants";
import logger from "./logger";
export const PrintThis = (handlePrint) => {
  const elements = document.getElementsByClassName("hidePrint");
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
  }
  handlePrint();
  setTimeout(() => {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "block";
    }
  }, PRINT_TIMEOUT_MS);
};
export const downloadReport = PrintThis;

// Return Signature
export const signatureFormat = ({
  sign,
  date,
  time,
  hoursFormat,
  withText = true,
  style = {},
}) => {
  const formattedDateTime = getFormattedDateTime(date, hoursFormat);
  return withText === true
    ? sign && (
        <p
          className="mb-0 mt-0 align-items-center text-lg-end font-light text-sm w-full"
          id="Print23"
          style={{
            ...style,
          }}
        >
          Digitally Signed by {sign} {formattedDateTime}{" "}
        </p>
      )
    : sign && (
        <p
          className="mb-0 mt-0 align-items-center text-lg-end font-light text-sm w-full"
          style={{
            ...style,
          }}
        >
          {sign} {formattedDateTime}{" "}
        </p>
      );
};

// Shared parser for signature timestamps (inline pen + "Digitally Signed by…")
export const parseSignatureDate = (date) => {
  if (!date) return null;
  const parsedDate =
    typeof date === "object" &&
    !(date instanceof Date) &&
    date !== null &&
    typeof date?.toDate === "function"
      ? date.toDate()
      : date instanceof Date
        ? date
        : new Date(date);
  return isValid(parsedDate) ? parsedDate : null;
};

/** Date-only display for inline signature boxes — matches getFormattedDateTime calendar day */
export const formatSignatureDateOnly = (date) => {
  const parsedDate = parseSignatureDate(date);
  if (!parsedDate) return "";
  return format(parsedDate, "MM/dd/yyyy");
};

// Utility function for formatting date and time
export const getFormattedDateTime = (date, hoursFormat) => {
  let formattedDateTime = "";
  let updatedFormatString;
  // Adjust formatString for consistency
  if (hoursFormat === "h:mm A") {
    updatedFormatString = "h:mm a";
  } else {
    updatedFormatString = hoursFormat;
  }
  try {
    const parsedDate = parseSignatureDate(date);
    if (parsedDate) {
      const formattedDate = format(parsedDate, "MM/dd/yyyy");
      const formattedTime = format(parsedDate, updatedFormatString);
      formattedDateTime = `${formattedDate} ${formattedTime}`;
    }
  } catch (error) {
    logger.error("Error formatting date or time", error, {
      context: "getFormattedDateTime",
    });
  }
  return formattedDateTime;
};

// Debouncing Set Query
export const debouncedSetQuery = ({ term, setQuery }) => {
  clearTimeout(debouncedSetQuery.timeoutId);
  debouncedSetQuery.timeoutId = setTimeout(() => {
    setQuery(term);
  }, 500);
};
export const fetchPaitentName = (i) => {
  if (i?.firstName || i?.lastName) {
    return `${i?.firstName} ${i?.lastName}`;
  } else {
    return i?.fullName;
  }
};
export const ronSignerLineFromProfile = (profile) => {
  if (!profile) return "";
  const nm = String(fetchPaitentName(profile) || "").trim();
  const displayName =
    nm ||
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
    String(profile.fullName || "").trim();
  if (!displayName) return "";
  if (profile.userType === ROLES.ADMIN) {
    return `${displayName} Admin`.trim();
  }
  const pos = String(profile.position || "").trim();
  return `${displayName} ${pos || "BHP"}`.trim();
};
export function todayLocalNoonDate() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate(), 12, 0, 0, 0);
}
export const checkMultiValues = (setState, state, value) => {
  if (state?.includes(value)) setState((pre) => pre?.replace(value, ""));
  else setState((pre) => pre?.replaceAll(undefined, "") + value);
};

// Bold syntax
export const BoldSyntax = (text) => {
  return <span className="fw-bold"> {text} </span>;
};

// get Random Color
export const getRandomColor = (() => {
  let previousColorIndex = -1;
  return (colors) => {
    let randomIndex = Math.floor(Math.random() * colors.length);
    while (randomIndex === previousColorIndex) {
      randomIndex = Math.floor(Math.random() * colors.length);
    }
    previousColorIndex = randomIndex;
    return colors[randomIndex];
  };
})();

// className getter
export const getClassName = (value, key) => {
  if (key === value) {
    return "active";
  } else {
    return "";
  }
};
export const AddSignature = ({ show, setValue, setTime, setDate }) => {
  const capturedTimeRef = useRef("");
  const hasLoggedRef = useRef(false);
  const profileDetails = useSelector(userProfile);
  const employeeName = profileDetails && fetchPaitentName(profileDetails);
  const employeePosition = profileDetails?.position;
  const employeeSign = `${employeeName} ${profileDetails.userType === ROLES.ADMIN ? "Admin" : employeePosition}`;
  const hoursFormat = profileDetails?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  useEffect(() => {
    if (show && !capturedTimeRef.current) {
      let updatedformatString;
      if (hoursFormat === "h:mm A") {
        updatedformatString = "h:mm a";
      } else {
        updatedformatString = hoursFormat;
      }
      const currentDate = new Date();
      const capturedTime = format(currentDate, updatedformatString);
      capturedTimeRef.current = capturedTime;
      setValue(employeeSign);
      // setTime(capturedTime);
      setDate(currentDate);

      // Log only once for debugging
      if (!hasLoggedRef.current) {
        hasLoggedRef.current = true;
      }
    } else if (!show) {
      capturedTimeRef.current = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, employeeSign, setValue, setTime, setDate]);
  return null;
};
export const AddSignatureForTable = ({
  show,
  setValue,
  setTime,
  setDate,
  setShow,
}) => {
  const capturedTimeRef = useRef("");
  const hasLoggedRef = useRef(false);
  const profileDetails = useSelector(userProfile);
  const employeeName = profileDetails && fetchPaitentName(profileDetails);
  const employeePosition = profileDetails?.position;
  const employeeSign = `${employeeName} ${profileDetails.userType === ROLES.ADMIN ? "Admin" : employeePosition}`;
  const hoursFormat = profileDetails?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  useEffect(() => {
    if (show) {
      let updatedformatString;
      if (hoursFormat === "h:mm A") {
        updatedformatString = "h:mm a";
      } else {
        updatedformatString = hoursFormat;
      }
      const currentDate = new Date();
      const capturedTime = format(currentDate, updatedformatString);
      capturedTimeRef.current = capturedTime;
      setValue(employeeSign);
      setDate(currentDate);
      if (!hasLoggedRef.current) {
        hasLoggedRef.current = true;
      }
      setShow(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, employeeSign, setValue, setTime, setDate]);
  return null;
};

// export function formatDateToMMDDYYYY(dateInput) {
//   if (!dateInput) return "";

//   let date;
//   if (dateInput instanceof Date) {
//     date = dateInput;
//   } else if (typeof dateInput === "string") {
//     date = parseISO(dateInput);

//     if (!isValid(date)) {
//       date = parse(dateInput, "EEE MMM dd yyyy", new Date());
//     }

//     if (!isValid(date)) {
//       date = new Date(dateInput);
//     }
//   }

//   if (!isValid(date)) return "";

//   return format(date, "MM/dd/yyyy");
// }
// export function formatDateToMMDDYYYY(dateInput) {
//   if (!dateInput) return "";

//   let parsed;

//   if (dateInput instanceof Date) {
//     parsed = dateInput;
//   } else if (typeof dateInput === "string") {
//     const trimmed = dateInput.trim();
//     if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
//       const [y, m, d] = trimmed.split("-").map(Number);
//       parsed = new Date(y, m - 1, d);
//     } else if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
//       const fromIso = parseISO(trimmed);
//       parsed =
//         fromIso instanceof Date && isValid(fromIso)
//           ? fromIso
//           : new Date(trimmed);
//     } else {
//       parsed = parseISO(trimmed);
//       if (!isValid(parsed)) {
//         parsed = parse(trimmed, "EEE MMM dd yyyy", new Date());
//       }
//       if (!isValid(parsed)) {
//         parsed = new Date(trimmed);
//       }
//     }
//   } else {
//     return "";
//   }

//   if (!isValid(parsed)) return "";

//   const date = new Date(
//     parsed.getFullYear(),
//     parsed.getMonth(),
//     parsed.getDate(),
//   );

//   return format(date, "MM/dd/yyyy");
// }

export function formatDateToMMDDYYYY(dateInput) {
  if (!dateInput) return "";

  let date;

  if (dateInput instanceof Date) {
    date = new Date(
      dateInput.getFullYear(),
      dateInput.getMonth(),
      dateInput.getDate(),
    );
  } else if (typeof dateInput === "string") {
    let rawDatePart = dateInput.split("T")[0];
    const [year, month, day] = rawDatePart.split("-").map(Number);

    if (year && month && day) {
      date = new Date(year, month - 1, day);
    }

    if (!isValid(date)) {
      date = parseISO(dateInput);
    }

    if (!isValid(date)) {
      date = parse(dateInput, "EEE MMM dd yyyy", new Date());
    }

    if (!isValid(date)) {
      date = new Date(dateInput);
    }
  }

  if (!isValid(date)) return "";

  return format(date, "MM/dd/yyyy");
}

/** Date object for react-datepicker `selected` (avoids empty display with string values) */
export function toDatePickerValue(dateInput) {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return isValid(dateInput)
      ? new Date(
          dateInput.getFullYear(),
          dateInput.getMonth(),
          dateInput.getDate(),
        )
      : null;
  }
  const mmddyyyy = formatDateToMMDDYYYY(dateInput);
  if (!mmddyyyy) return null;
  const [month, day, year] = mmddyyyy.split("/").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function formatDateWithoutUTCHandleToMMDDYYYY(dateInput) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (!isValid(date)) return "";
  return format(date, "MM/dd/yyyy");
}
export const formatDateWithoutTimezoneInfluenceMMDDYYYY = (dateInput) => {
  if (!dateInput) return "";
  const plainDate =
    typeof dateInput === "string"
      ? dateInput.split("T")[0]
      : format(dateInput, "yyyy-MM-dd");
  const [year, month, day] = plainDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return format(date, "MM/dd/yyyy");
};
export const formatDateTimeSheet = (dateInput) => {
  if (!dateInput) return "";

  // Ensure the date is treated as UTC
  const date = new Date(`${dateInput}T00:00:00Z`);
  if (isNaN(date?.getTime())) return "";
  const month = String(date?.getUTCMonth() + 1)?.padStart(2, "0");
  const day = String(date?.getUTCDate())?.padStart(2, "0");
  const year = date?.getUTCFullYear();
  return `${month}/${day}/${year}`;
};

/**
 * Converts a time string to a specified format.
 * @param {string} time - The time string to convert (e.g., "15:53").
 * @param {string} formatString - The target format string (e.g., "HH:mm" or "h:mm A").
 * @returns {string} - The formatted time string.
 */

export const convertTimeFormat = (time, formatString) => {
  let updatedFormatString;
  if (time === null || time === undefined || time === "") return "";

  // Adjust formatString for consistency
  if (formatString === "h:mm A") {
    updatedFormatString = "h:mm a";
  } else {
    updatedFormatString = formatString;
  }
  let parsedTime;
  try {
    if (
      typeof time === "string" &&
      (time.includes("am") ||
        time.includes("Am") ||
        time.includes("AM") ||
        time.includes("pm") ||
        time.includes("Pm") ||
        time.includes("PM"))
    ) {
      parsedTime = parse(time, "h:mm a", new Date());
    } else if (typeof time === "string" && time.includes("T")) {
      parsedTime = new Date(time);
    } else if (
      typeof time === "string" &&
      time.includes(":") &&
      time.split(":").length === 3
    ) {
      parsedTime = parse(time, "HH:mm:ss", new Date());
    } else if (typeof time === "string" && time.includes(":")) {
      parsedTime = parse(time, "HH:mm", new Date());
    } else if (time instanceof Date) {
      parsedTime = time;
    } else {
      throw new Error("Unsupported time format");
    }
    if (!isValid(parsedTime)) {
      throw new Error("Invalid time format");
    }
    return format(parsedTime, updatedFormatString);
  } catch (error) {
    logger.error("Error converting time format", error, {
      context: "convertTimeFormat",
      time,
    });
    return time;
  }
};
export const parseTimeStringToDate = (timeInput) => {
  if (!timeInput) return null;

  // If the input is already a Date object, return it as-is
  if (timeInput instanceof Date) {
    return timeInput;
  }
  if (typeof timeInput === "string") {
    const regex12Hour = /^(\d{1,2}):(\d{2})\s*(am|pm|Am|Pm)$/i;
    const regex24Hour = /^(\d{1,2}):(\d{2})$/;
    const regexDateOnly = /^\d{4}-\d{2}-\d{2}$/; // Matches 'YYYY-MM-DD'

    // Handle ISO 8601 format (e.g., '2024-09-07T12:00:00Z')
    if (timeInput.includes("T")) {
      const parsedDate = new Date(timeInput);
      if (!isNaN(parsedDate)) {
        return parsedDate;
      } else {
        logger.warn("Invalid ISO time format", {
          timeInput,
        });
        return null;
      }
    }

    // Handle date-only format like '2024-09-07'
    if (regexDateOnly.test(timeInput)) {
      try {
        const parsedDate = new Date(timeInput);
        if (!isNaN(parsedDate)) {
          return parsedDate;
        }
      } catch (err) {
        logger.warn("Invalid date-only format", {
          timeInput,
          error: err,
        });
        return null;
      }
    }
    const match12Hour = timeInput?.match(regex12Hour);
    if (match12Hour) {
      let [, hourStr, minuteStr, meridiem] = match12Hour;
      let hours = parseInt(hourStr, 10);
      const minutes = parseInt(minuteStr, 10);
      if (
        (meridiem.toLowerCase() === "pm" || meridiem.toLowerCase() === "Pm") &&
        hours !== 12
      ) {
        hours += 12;
      } else if (
        (meridiem.toLowerCase() === "am" || meridiem.toLowerCase() === "Am") &&
        hours === 12
      ) {
        hours = 0;
      }
      const now = new Date();
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
      );
    }
    const match24Hour = timeInput.match(regex24Hour);
    if (match24Hour) {
      const [, hourStr, minuteStr] = match24Hour;
      const hours = parseInt(hourStr, 10);
      const minutes = parseInt(minuteStr, 10);
      const now = new Date();
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
      );
    }

    // Invalid string input
    logger.warn("Invalid time input format", {
      timeInput,
    });
    return null;
  }

  // Invalid input type
  logger.warn("Invalid time input type", {
    type: typeof timeInput,
  });
  return null;
};
export const formatDateforTimeSheet = (date) => {
  const adjustedDate = new Date(
    date.getTime() + date.getTimezoneOffset() * 60000,
  );
  const month = String(adjustedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(adjustedDate.getDate()).padStart(2, "0");
  const year = adjustedDate.getFullYear();
  return `${month}/${day}/${year}`;
};

// Encryption and decryption functions are now imported from cryptoUtils.js

export function isSignerPresentOnAllPages(data, prodileId) {
  const signersignature = data.every((page) =>
    page.sign.some((sign) => sign.signerId === prodileId),
  );
  return signersignature;
}
export function isSignaturePresentOnAllPages(data, patientIds) {
  const signature = data?.every((page) =>
    page?.sign?.some((sign) => {
      return patientIds.includes(sign.signerId);
    }),
  );
  return signature;
}
export function isGuardianSignaturePresentOnAllPages(data, guardianIds) {
  const signature = data?.every((page) =>
    page?.sign?.some((sign) => {
      return guardianIds.includes(sign.signerId) && sign.signature.length > 0;
    }),
  );
  return signature;
}
export const getSignature = (
  i,
  hoursFormat,
  adminKey,
  adminDateKey,
  employeeKey,
  employeeDateKey,
) => {
  let oldestSignature = null;
  let oldestDate = null;
  const checkAndSetOldest = (signature, date) => {
    if (signature && date) {
      const parsedDate = new Date(date);
      if (!oldestDate || parsedDate < oldestDate) {
        oldestDate = parsedDate;
        oldestSignature = `${signature} ${getFormattedDateTime(date, hoursFormat)}`;
      }
    }
  };
  checkAndSetOldest(i?.[adminKey], i?.[adminDateKey]);
  checkAndSetOldest(i?.[employeeKey], i?.[employeeDateKey]);
  if (i?.signers?.length) {
    i.signers.forEach((signer) => {
      checkAndSetOldest(signer?.signature, signer?.dateSigned);
    });
  }
  return oldestSignature || "-";
};
export const getEmployeeListSignature = (
  form,
  hoursFormat,
  documentTypesObject,
  key,
  adminKey,
  adminDateKey,
  employeeKey,
  employeeDateKey,
) => {
  let oldestSignature = null;
  let oldestDate = null;
  const checkAndSetOldest = (signature, date) => {
    if (signature && date) {
      const parsedDate = new Date(date);
      if (!oldestDate || parsedDate < oldestDate) {
        oldestDate = parsedDate;
        oldestSignature = `${signature} ${getFormattedDateTime(date, hoursFormat)}`;
      }
    }
  };
  checkAndSetOldest(
    form?.[documentTypesObject[key]?.[employeeKey]],
    form?.[documentTypesObject[key]?.[employeeDateKey]],
  );
  checkAndSetOldest(
    form?.[documentTypesObject[key]?.[adminKey]],
    form?.[documentTypesObject[key]?.[adminDateKey]],
  );
  if (form?.signers?.length) {
    form.signers.forEach((signer) => {
      checkAndSetOldest(signer?.signature, signer?.dateSigned);
    });
  }
  return oldestSignature || "-";
};
export const getNestedSignature = (
  i,
  hoursFormat,
  adminKey,
  adminDateKey,
  signObj,
  employeeKey,
  employeeDateKey,
) => {
  let oldestSignature = null;
  let oldestDate = null;
  const checkAndSetOldest = (signature, date) => {
    if (signature && date) {
      const parsedDate = new Date(date);
      if (!oldestDate || parsedDate < oldestDate) {
        oldestDate = parsedDate;
        oldestSignature = `${signature} ${getFormattedDateTime(date, hoursFormat)}`;
      }
    }
  };
  checkAndSetOldest(
    i?.[signObj]?.[employeeKey],
    i?.[signObj]?.[employeeDateKey],
  );
  checkAndSetOldest(i?.[adminKey], i?.[adminDateKey]);
  if (i?.signers?.length) {
    i.signers.forEach((signer) => {
      checkAndSetOldest(signer?.signature, signer?.dateSigned);
    });
  }
  return oldestSignature || "-";
};
export const updateArrayOrder = (nums) => {
  if (Array.isArray(nums) && nums.includes("Other")) {
    const extractedOther = nums.splice(nums.indexOf("Other"), 1)[0];
    nums.push(extractedOther);
  }
  return nums;
};
export const patient_form_treatment_get = async (id) => {
  const result = await getPatientDetails(id);
  if (!result.success) {
    showNotification(result);
    throw result;
  }
  return result.data;
};
export const splitAddress = (address) => {
  if (!address) return "";
  const words = address.split(" ");
  const midIndex = Math.ceil(words.length / 2);

  // Split into two lines
  const firstLine = words.slice(0, midIndex).join(" ");
  const secondLine = words.slice(midIndex).join(" ");
  return `${firstLine}<br>${secondLine}`;
};
export const handleMeal = (str) => {
  const meal = [
    "Meal refused",
    "Breakfast eaten",
    "Lunch eaten",
    "Dinner eaten",
  ];
  const res = [];
  meal.forEach((value) => {
    if (str?.includes(value)) res.push(value);
  });
  return res.join(", ");
};
export const deletePermission = (profile, permissionKey) => {
  const isDelete =
    profile.userType === ROLES.ADMIN ||
    profile?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
    (profile?.accountType === ACCOUNT_TYPES.REGULAR &&
      profile?.userType === ROLES.EMPLOYEE &&
      (typeof profile?.userPermissions?.delete === "string"
        ? profile.userPermissions.delete.split(":")
        : []
      ).includes(permissionKey));
  return isDelete;
};
export const extractSignFromSigner = (
  signers,
  userId,
  hoursFormat,
  wantDate,
  wantTrainingCompletion,
) => {
  const obj = signers?.find((i) => i?.signerId === userId);
  if (obj?.signature) {
    if (wantTrainingCompletion) return true;
    return wantDate
      ? formatDateToMMDDYYYY(obj?.dateSigned)
      : `${obj?.signature} ${getFormattedDateTime(obj?.dateSigned, hoursFormat)}`;
  }
  return false;
};
export function otherHandler(arr, otherKey, otherValue) {
  const index = arr?.indexOf(otherKey);
  if (index > -1) {
    arr?.splice(index, 1);
    arr?.push(otherKey);
    return otherValue ? `${arr?.join(", ")}: ${otherValue}` : arr?.join(", ");
  } else {
    return arr?.join(", ");
  }
}
export const stripHtmlList = (html) => {
  const div = document.createElement("div");
  div.innerHTML = sanitizeHtml(html);
  const listItems = div.querySelectorAll("li");
  return Array.from(listItems).map((li) => {
    const text = li.textContent.trim();
    return {
      id: crypto.randomUUID(),
      label: text,
      value: text,
    };
  });
};
export const checkAnyValue = (...fields) => {
  return fields.some((field) => {
    if (field === null || field === undefined) return false;
    if (typeof field === "string") {
      const trimmed = field.trim();
      const emptyValues = [
        "",
        "<ul></ul>",
        "<p><br></p>",
        "<p><br></p><ul></ul>",
      ];
      return !emptyValues.includes(trimmed);
    }
    if (typeof field === "boolean") return true;
    return Boolean(field);
  });
};
export const extractParagraphText = (text = "") => {
  if (typeof text !== "string") return "";
  const match = text.match(/<p[^>]*>(.*?)<\/p>/i);
  return match ? match[1].trim() : text;
};

export const resolveFacilityName = (row, facilitiesList = []) => {
  if (!row) return "";
  const facId =
    typeof row?.facilityId === "object" && row?.facilityId !== null
      ? row.facilityId._id || row.facilityId
      : row?.facilityId;

  // Priority 1: Look up from the live facilities list using ID (most reliable)
  if (facId && Array.isArray(facilitiesList) && facilitiesList.length > 0) {
    const facility = facilitiesList.find(
      (f) => String(f._id) === String(facId),
    );
    if (facility) {
      return facility.facilityName || facility.name || "";
    }
  }

  // Priority 2: Match by saved address text (fallback if facilityId is missing)
  const savedLoc =
    row?.location ||
    row?.facilityAddress ||
    row?.facititAddress ||
    row?.data?.[row?.data?.length - 1]?.facilityAddress ||
    row?.data?.[row?.data?.length - 1]?.location;

  if (savedLoc && Array.isArray(facilitiesList) && facilitiesList.length > 0) {
    const matchedFac = facilitiesList.find(
      (f) => f.address === savedLoc || f.location === savedLoc,
    );
    if (matchedFac) {
      return matchedFac.facilityName || matchedFac.name || "";
    }
  }

  // Priority 3: facilityName stored directly on the row
  if (row?.facilityName) return row.facilityName;

  // Priority 4: populated facilityId object
  if (row?.facilityId && typeof row.facilityId === "object") {
    return row.facilityId.facilityName || row.facilityId.name || "";
  }

  return "";
};
