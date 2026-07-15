/** @format */

/**
 * Fixed substance-abuse history rows (indices 0–13).
 * `types` matches payloadMapper typeArrayTemp; `substanceKey` drives legacy flat names.
 */
export const SUBSTANCE_ABUSE_FIXED_ROWS = [
  {
    types: "Alcohol",
    substanceKey: "Alcohol",
  },
  {
    types: "Benzodiazepines",
    substanceKey: "Benzodiazepines",
  },
  {
    types: "Crack",
    substanceKey: "Crack",
  },
  {
    types: "Heroin",
    substanceKey: "Heroin",
  },
  {
    types: "Inhalants",
    substanceKey: "Inhalants",
  },
  {
    types: "Marijuana",
    substanceKey: "Marijuana",
  },
  {
    types: "Methamphetamine",
    substanceKey: "Methamphetamine",
  },
  {
    types: "Methadone",
    substanceKey: "Methadone",
  },
  {
    types: "MDMA (ecstasy)",
    substanceKey: "MDMA",
  },
  {
    types: "Primary Care Physician (angel dust)",
    substanceKey: "PCP",
  },
  {
    types: "Prescription medicine",
    substanceKey: "Prescription",
  },
  {
    types: "OTC medicine",
    substanceKey: "OTC",
  },
  {
    types: "Cocaine",
    substanceKey: "Cocaine",
  },
  {
    types: "Hallucinogens",
    substanceKey: "Hallucinogens",
  },
].map((row) => ({
  ...row,
  legacyKeys: {
    ageOfFirstUse: `substanceAbuseHistoryDataAgeOfFirstUse${row.substanceKey}`,
    lastUse: `substanceAbuseHistoryDataLastUse${row.substanceKey}`,
    frequency: `substanceAbuseHistoryDataFrequency${row.substanceKey}`,
    lengthOfSobriety: `substanceAbuseHistoryDataLengthOfSobriety${row.substanceKey}`,
  },
  setters: {
    ageOfFirstUse: `setSubstanceAbuseHistoryDataAgeOfFirstUse${row.substanceKey}`,
    lastUse: `setSubstanceAbuseHistoryDataLastUse${row.substanceKey}`,
    frequency: `setSubstanceAbuseHistoryDataFrequency${row.substanceKey}`,
    lengthOfSobriety: `setSubstanceAbuseHistoryDataLengthOfSobriety${row.substanceKey}`,
  },
}));

export const SUBSTANCE_ABUSE_FIXED_COUNT = SUBSTANCE_ABUSE_FIXED_ROWS.length;
