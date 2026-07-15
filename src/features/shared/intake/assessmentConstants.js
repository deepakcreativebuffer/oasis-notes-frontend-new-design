/** @format */

/** Form interaction modes — single component, mode-based rendering. */
export const ASSESSMENT_MODES = {
  CREATE: "create",
  EDIT: "edit",
  VIEW: "view",
  PRINT: "print",
};

/** Who is using the form (routing / API source differs). */
export const ASSESSMENT_PORTALS = {
  EMPLOYEE: "employee",
  RESIDENT: "resident",
};

export const EMPLOYEE_ROUTES = {
  CREATE: "/initial-assessment",
  EDIT_PREFIX: "/edit-initial-assessment/",
  VIEW_PREFIX: "/view-initial-assessment/",
  LIST: "/initial-assessment-list",
};

export const RESIDENT_ROUTES = {
  EDIT_PREFIX: "/edit-initial-Assessment-resident/",
  VIEW_PREFIX: "/view-initial-assessment-resident/",
};

export const PRINT_PAGE_STYLE = `
    @page {
        size: auto;
        margin: 10mm !important;
      }
        .card {
      page-break-inside: avoid;
    }
      .table-row-hinde-print{
      display:none;
      }
      table tbody:not(:has(td)) {
    display: none ;
    }
    `;
