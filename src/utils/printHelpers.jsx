import { getObjectUrlFromDownloadUrl } from "@/features/shared/services";
import { formatDateToMMDDYYYY } from "./utils";
import { defaultLogo } from "@/assets/index";
import { ROLES } from "@/features/shared/constants";
import { sanitizeHtml } from "./security/sanitizeHtml";

export function printDocumentTitle(user) {
  let title = "";
  if (user) {
    const isPatient = user?.userType === ROLES.PATIENT || user?.ahcccsId;

    const userName = user?.firstName
      ? `${user?.firstName} ${user?.lastName || ""}`.trim()
      : user?.fullName || user?.residentFullName || "";

    title += isPatient ? "Resident Name: " : "Employee Name: ";
    title += `${userName} `;

    if (isPatient) {
      if (user?.ahcccsId) {
        title += `AHCCCS ID: ${user?.ahcccsId} `;
      }
      if (user?.dateOfBirth) {
        title += `DOB: ${formatDateToMMDDYYYY(user?.dateOfBirth)} `;
      }
    }
  }
  return title.trim();
}

export function printDocumentTitleExceptFirstPage(user, Profile) {
  let title = "";
  if (user || Profile) {
    const isPatient =
      user?.userType === ROLES.PATIENT ||
      Profile?.userType === ROLES.PATIENT ||
      user?.ahcccsId ||
      Profile?.ahcccsId;

    const userName = user?.firstName
      ? `${user?.firstName} ${user?.lastName || ""}`.trim()
      : user?.fullName || user?.residentFullName || "";

    const profileName = Profile?.residentFullName
      ? Profile.residentFullName
      : Profile?.firstName
        ? `${Profile?.firstName} ${Profile?.lastName || ""}`.trim()
        : Profile?.fullName || "";

    const finalName = userName || profileName;

    title += isPatient ? "Resident Name: " : "Employee Name: ";
    title += `${finalName} `;

    if (isPatient) {
      const ahcccsId = user?.ahcccsId || Profile?.ahcccsId;
      if (ahcccsId) {
        title += `AHCCCS ID: ${ahcccsId} `;
      }

      const dob = user?.dateOfBirth || Profile?.dateOfBirth;
      if (dob) {
        title += `DOB: ${formatDateToMMDDYYYY(dob)} `;
      }
    }
  }
  return title.trim();
}

export function addressPrintDocumentTitle(user) {
  let title = "";

  if (user) {
    title += `<div class="page-header-title">Company Name: ${
      user?.adminId?.companyName ||
      (user?.userType === ROLES.ADMIN && user?.companyName) ||
      "Oasis Notes"
    }</div>`;
    // title += `<div class="page-header-title">Address: ${
    //   `${splitAddress(user?.adminId?.address || user?.address)}` || "Oasisnotes"
    // }</div>`;
  }
  return title;
}

export function printDocumentContent(componentRef, admin, profile) {
  const tableStat = componentRef;
  const PrintElem = document.createElement("div");

  PrintElem.id = "printContainter";
  const header = `<div class="page-header-wrapper">
  <div>
    <img src="${
      profile?.adminId?.logo ||
      profile?.logo ||
      admin?.logo ||
      admin?.adminId?.logo
        ? getObjectUrlFromDownloadUrl(
            profile?.adminId?.logo ||
              profile?.logo ||
              admin?.logo ||
              admin?.adminId?.logo,
          )
        : defaultLogo
    }" alt="" class="print-page-logo"/>
    </div>
    <div class="page-header-title">
      <div >${addressPrintDocumentTitle(profile)}</div>
    </div>
</div>`;
  PrintElem.innerHTML = sanitizeHtml(header);
  PrintElem.appendChild(tableStat);
  return PrintElem;
}
