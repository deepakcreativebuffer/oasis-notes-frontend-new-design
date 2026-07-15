export const RON_INTRO_TEXT =
  "The RON must be completed and signed by the treating behavioral health professional (BHP), licensed under A.R.S. Title 32, Chapter 33, and submitted to DFSM upon expiration of the CON, or upon expiration of a previously submitted RON.";

export const SECTION_I_REQUIRED_LINE =
  "Check the applicable treatment type (required):";

export const TREATMENT_IOP_SUD = "iopSud";
export const TREATMENT_IOP_PM_BH = "iopPmBh";
export const TREATMENT_BHRF = "bhrf";

export const TREATMENT_OPTIONS = [
  {
    value: TREATMENT_IOP_SUD,
    title: "IOP SUD Treatment:",
    body: "Treatment for alcohol or other substances at least three hours/day and at least three days/week (Nine hours or more per week, may be less with adolescents). Non-IHS/638 IOPs focused on the treatment of substance use and co-occurring disorders shall include a copy of the American Society of Addiction Medicine (ASAM, 3rd edition) with the RON. RON for IOP SUD treatment is due at a minimum every 12 weeks.",
  },
  {
    value: TREATMENT_IOP_PM_BH,
    title: "IOP Psychiatric Mental and Behavioral Health:",
    body: "All-inclusive behavioral health service. All IOP related services and programming are included in the rate. Treatment is at least three hours per day for two or more days per week (9-19 hours per week). Non-IHS/638 IOPs focused on the treatment of substance use and co-occurring disorders shall include a copy of the American Society of Addiction Medicine (ASAM, 3rd edition) with the RON. RON for IOP psychiatric treatment is due at a minimum every 30 days.",
  },
  {
    value: TREATMENT_BHRF,
    title: "BHRF Treatment:",
    body: "BH treatment for an individual experiencing issues that limit the individual's ability to be independent or causes the individual to require treatment to maintain or enhance independence, as specified in the member's treatment plan. BHRF treatment is expected to be inclusive of all services specified in the member's BH treatment plan developed by the member's outpatient treatment team. Members in a BHRF shall not receive consecutive IOP treatment or other treatment from outside providers that is duplicative of the services the BHRF is expected to provide. RON for BHRF services is due at a minimum every 60 days.",
  },
];

export const RON_VI_INTRO =
  "* The following documents shall accompany submission of the RON:";

export const RON_VI_SUBITEMS = [
  "Targeted discharge date,",
  "Member/HCDM signature,",
  "Evidence of treatment planning/coordination with the member's outpatient treatment team.",
];

export const RON_VI_PROGRESS_NOTES =
  "Progress Notes (most recent 7 days preceding RON submission).";

export const RON_VI_DISCLAIMER =
  "* Prior Authorization is not a guarantee of payment. Additional documentation may be requested as needed by AHCCCS/DFSM for the purpose of determining the medical necessity and quality of services delivered.";
