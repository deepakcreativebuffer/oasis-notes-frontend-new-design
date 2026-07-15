/** @format */

const toOptions = (values) => values.map((value) => ({ label: value, value }));

export const SUBSTANCE_LAST_USE_OPTIONS = toOptions([
  "Weeks ago",
  "Days ago",
  "Yesterday",
  "Months ago",
  "Few hours ago",
  "Unsure",
]);

export const SUBSTANCE_FREQUENCY_OPTIONS = toOptions([
  "Daily",
  "Two to four times weekly",
  "Multiple times a day",
  "Chronic",
  "Intermittent",
  "Only on social events",
  "Only on weekends",
  "Few times a month",
]);

export const SUBSTANCE_LENGTH_OF_SOBRIETY_OPTIONS = toOptions([
  "One week",
  "A few days ago",
  "One month",
  "Two months",
  "Three months",
  "Four months",
  "Five to Six months",
  "One year",
  "Two years",
  "Many years",
]);

export const SUBSTANCE_FIELD_OPTIONS = {
  lastUse: SUBSTANCE_LAST_USE_OPTIONS,
  frequency: SUBSTANCE_FREQUENCY_OPTIONS,
  lengthOfSobriety: SUBSTANCE_LENGTH_OF_SOBRIETY_OPTIONS,
};
