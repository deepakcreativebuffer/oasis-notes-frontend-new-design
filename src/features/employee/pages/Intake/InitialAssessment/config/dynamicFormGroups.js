/** @format */

/**
 * Schema for array-backed form sections that mirror the API payload shape.
 * Each fixed row maps to a legacy flat variable prefix for payloadMapper compatibility.
 */

export const INDEPENDENT_LIVING_SKILLS_FIXED_ROWS = [
  { type: "Bathing/Showering", legacyPrefix: "Bathing" },
  { type: "Grooming/hygiene", legacyPrefix: "Grooming" },
  { type: "Mobility", legacyPrefix: "Mobility" },
  { type: "Housework", legacyPrefix: "Housework" },
  { type: "Shopping", legacyPrefix: "Shopping" },
  { type: "Managing money/budget", legacyPrefix: "Managing" },
  { type: "Preparing food", legacyPrefix: "Preparing" },
  { type: "Eating", legacyPrefix: "Eating" },
  { type: "Toileting", legacyPrefix: "Toileting" },
  {
    type: "Taking medications",
    legacyPrefix: "Taking",
    requiresIndependent10: true,
  },
];

export const INDEPENDENT_LIVING_SKILL_FIELDS = [
  "good",
  "fair",
  "otherCurrentNotSoGood",
  "needAssist",
  "comments",
];

/** Fixed risk-factor rows (index 0–11) — migrate in a follow-up pass. */
export const RISK_FACTORS_FIXED_ROWS = [
  {
    type: "Current suicidal ideation",
    legacyKeys: { yesNo: "riskYesNo", comment: "riskComment" },
    setters: { yesNo: "setRiskYesNo", comment: "setRiskComment" },
  },
  {
    type: "Prior suicide attempt",
    legacyKeys: { yesNo: "PriorYesNo", comment: "PriorComment" },
    setters: { yesNo: "setPriorYesNo", comment: "setPriorComment" },
  },
  {
    type: "Access to means (i.e. weapon)",
    legacyKeys: { yesNo: "AccessYesNo", comment: "AccessComment" },
    setters: { yesNo: "setAccessYesNo", comment: "setAccessComment" },
  },
  {
    type: "Substance abuse",
    legacyKeys: { yesNo: "SubstanceYesNo", comment: "SubstanceAbuseComment" },
    setters: {
      yesNo: "setSubstanceYesNo",
      comment: "setSubstanceCommentAbuse",
    },
  },
  {
    type: "Other self-abusing behavior",
    legacyKeys: { yesNo: "abusingYesNo", comment: "abusingComment" },
    setters: { yesNo: "setabusingYesNo", comment: "setabusingComment" },
  },
  {
    type: "Recent losses/lack of support",
    legacyKeys: { yesNo: "RecentYesNo", comment: "RecentComment" },
    setters: { yesNo: "setRecentYesNo", comment: "setRecentComment" },
  },
  {
    type: "Behavior cues",
    legacyKeys: { yesNo: "behaviourYesNO", comments: "behaviorcuesDropDown" },
    setters: {
      yesNo: "setBehaviourYesNo",
      comments: "setBehaviorcuesDropDown",
    },
  },
  {
    type: "Symptoms of psychosis",
    legacyKeys: {
      yesNo: "SymptomsYesNO",
      comments: "symptomsOfPsychosisDropDown",
    },
    setters: {
      yesNo: "setSymptomsYesNo",
      comments: "setSymptomsOfPsychosisDropDown",
    },
  },
  {
    type: "Family history of suicide",
    legacyKeys: { yesNo: "FamilyYesNO", comment: "Family" },
    setters: { yesNo: "setFamilyYesNo", comment: "setFamily" },
  },
  {
    type: "Terminal physical illness",
    legacyKeys: { yesNo: "TerminalYesNO", comment: "Terminal" },
    setters: { yesNo: "setTerminalYesNo", comment: "setTerminal" },
  },
  {
    type: "Current stressors (specify)",
    legacyKeys: { yesNo: "CurrentYesNO", comment: "Current" },
    setters: { yesNo: "setCurrentYesNo", comment: "setCurrent" },
  },
  {
    type: "Chronic pain",
    legacyKeys: { yesNo: "ChronicYesNO", comment: "ChronicPain" },
    setters: { yesNo: "setChronicYesNo", comment: "setChronicPain" },
  },
];

export const PROTECTIVE_FACTORS_FIXED_ROWS = [
  {
    type: "Supports available (family friends)",
    legacyKeys: { yesNo: "SupportsYesNo", comment: "SupportsComment" },
    setters: { yesNo: "setSupportsYesNo", comment: "setSupportsComment" },
  },
  {
    type: "Spiritual / religious support",
    legacyKeys: { yesNo: "SpiritualYesNo", comment: "SpiritualComment" },
    setters: { yesNo: "setSpiritualYesNo", comment: "setSpiritualComment" },
  },
  {
    type: "Religious/cultural prohibitions",
    legacyKeys: { yesNo: "ReligiousYesNo", comment: "ReligiousComment" },
    setters: { yesNo: "setReligiousYesNo", comment: "setReligiousComment" },
  },
  {
    type: "Fear of consequences",
    legacyKeys: { yesNo: "FearYesNo", comment: "FearComment" },
    setters: { yesNo: "setFearYesNo", comment: "setFearComment" },
  },
  {
    type: "Able to be engaged in intervention",
    legacyKeys: { yesNo: "interventionYesNo", comment: "interventionComment" },
    setters: {
      yesNo: "setInterventionYesNo",
      comment: "setInterventionComment",
    },
  },
  {
    type: "Willing to commit to keeping self safe",
    legacyKeys: { yesNo: "WillingYesNo", comment: "WillingComment" },
    setters: { yesNo: "setWillingYesNo", comment: "setWillingComment" },
  },
];

export const DYNAMIC_FORM_GROUPS = {
  independentLivingSkills: {
    apiKey: "independentLivingSkills",
    fixedCount: 10,
    fixedRows: INDEPENDENT_LIVING_SKILLS_FIXED_ROWS,
    fields: INDEPENDENT_LIVING_SKILL_FIELDS,
  },
  riskFactors: {
    apiKey: "riskFactors",
    fixedCount: 12,
    fixedRows: RISK_FACTORS_FIXED_ROWS,
  },
  protectiveFactors: {
    apiKey: "protectiveFactors",
    fixedCount: 6,
    fixedRows: PROTECTIVE_FACTORS_FIXED_ROWS,
  },
};
