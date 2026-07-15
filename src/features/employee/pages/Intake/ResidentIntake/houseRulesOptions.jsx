/** @format */

/**
 * Default selectable house rules (label/value).
 *
 * NOTE: Numbers ("1. ", "2. ", … "27. ") removed from rule text 2026-04-30
 * per client request — out-of-sequence selections looked off when printed
 * (e.g. "1. ... 5. ... 9. ..."). Bullet points (•) come from the host
 * `<ul><li>` rendering. Legacy records may have rule text saved with the
 * old number prefixes; the `sanitizeHouseRuleText` helper strips them at
 * every render boundary so saved records display the current wording
 * without any DB migration.
 */
export const houseRulesOptionValue = [
  {
    label:
      "All residents are required to sign in and out upon leaving and entering the Facility. If you anticipate a late return, please contact staff.",
    value:
      "All residents are required to sign in and out upon leaving and entering the Facility. If you anticipate a late return, please contact staff.",
  },
  {
    label:
      "Refrain from lending or borrowing from clients. Stealing is prohibited.",
    value:
      "Refrain from lending or borrowing from clients. Stealing is prohibited.",
  },
  {
    label:
      "Help support our community by reporting problems, concerns and repairs to staff.",
    value:
      "Help support our community by reporting problems, concerns and repairs to staff.",
  },
  {
    label:
      "Please show respect and kindness towards other clients and staff at Facility.",
    value:
      "Please show respect and kindness towards other clients and staff at Facility.",
  },
  {
    label:
      "All medications, including over the counter medications, are required to be stored in the locked medication storage area.",
    value:
      "All medications, including over the counter medications, are required to be stored in the locked medication storage area.",
  },
  {
    label:
      "Smoking in the house is prohibited. Reference: Tobacco Product Policy. The use of Tobacco Products is limited to designated places only.",
    value:
      "Smoking in the house is prohibited. Reference: Tobacco Product Policy. The use of Tobacco Products is limited to designated places only.",
  },
  {
    label:
      "You are responsible for keeping your room clean. There will be daily room inspections conducted by staff and regular health and safety inspections to ensure the health and safety of your room, you and other clients. Any contraband items listed on the Contraband Policy and items that are deemed a danger to residents and staff may be removed during the inspection and either stored in a safe place or returned to the guardian.",
    value:
      "You are responsible for keeping your room clean. There will be daily room inspections conducted by staff and regular health and safety inspections to ensure the health and safety of your room, you and other clients. Any contraband items listed on the Contraband Policy and items that are deemed a danger to residents and staff may be removed during the inspection and either stored in a safe place or returned to the guardian.",
  },
  {
    label:
      "Residents may store up to two storage containers of personal belongings. It is encouraged residents limit their personal belongings to what can be safely kept in their rooms. Due to safety and health concerns you will be asked to keep your belongings (i.e. clothes, papers, books, etc.) off the floor.",
    value:
      "Residents may store up to two storage containers of personal belongings. It is encouraged residents limit their personal belongings to what can be safely kept in their rooms. Due to safety and health concerns you will be asked to keep your belongings (i.e. clothes, papers, books, etc.) off the floor.",
  },
  {
    label:
      "Visitors must sign in and out of the facility. It is recommended that you let staff know that you are having a visitor(s) in advance. Visitors are required to present identification and must follow the rules of the residence. Visitors are not allowed to stay overnight. Toddlers and infants are not allowed on the property unless special arrangements have been made before the time of their visit. Staff has the right to ask any visitor to leave if they present a danger to the residence. Visitors are requested to not arrive before 8:00 AM and to leave by 10:00 PM.",
    value:
      "Visitors must sign in and out of the facility. It is recommended that you let staff know that you are having a visitor(s) in advance. Visitors are required to present identification and must follow the rules of the residence. Visitors are not allowed to stay overnight. Toddlers and infants are not allowed on the property unless special arrangements have been made before the time of their visit. Staff has the right to ask any visitor to leave if they present a danger to the residence. Visitors are requested to not arrive before 8:00 AM and to leave by 10:00 PM.",
  },
  {
    label:
      "Residents are encouraged to be in by 7 p.m. for non work related outing. In the event you know you will be late, as a courtesy, contact the house.",
    value:
      "Residents are encouraged to be in by 7 p.m. for non work related outing. In the event you know you will be late, as a courtesy, contact the house.",
  },
  {
    label:
      'Out of respect for other clients and neighbors, clients residing at ABCH facilities are requested to observe "quiet time" between the hours of 10:00 PM and 8:00 AM.',
    value:
      'Out of respect for other clients and neighbors, clients residing at ABCH facilities are requested to observe "quiet time" between the hours of 10:00 PM and 8:00 AM.',
  },
  {
    label:
      "Please respect the privacy of all clients at Facility. Visiting clients is limited to common living areas. Clients are not allowed in other residents' bedrooms.",
    value:
      "Please respect the privacy of all clients at Facility. Visiting clients is limited to common living areas. Clients are not allowed in other residents' bedrooms.",
  },
  {
    label:
      "Facility will immediately discharge resident from the facility if a resident whereabouts is unknown for 24 hours, and failure to communicate with Facility over a 24 hour period while on outing.",
    value:
      "Facility will immediately discharge resident from the facility if a resident whereabouts is unknown for 24 hours, and failure to communicate with Facility over a 24 hour period while on outing.",
  },
  {
    label:
      "Please respect your living environment and keep doors and windows shut while the A/C or heat is on.",
    value:
      "Please respect your living environment and keep doors and windows shut while the A/C or heat is on.",
  },
  {
    label:
      "Clients are not to remove items that are required by state guidelines: such as plastic mattress covers; fire extinguishers; batteries from the smoke detectors; freezer and refrigerator thermometers, etc.",
    value:
      "Clients are not to remove items that are required by state guidelines: such as plastic mattress covers; fire extinguishers; batteries from the smoke detectors; freezer and refrigerator thermometers, etc.",
  },
  {
    label:
      "Contraband: Weapons of any kind; all medications and OTC drugs kept by staff; alcohol and products containing alcohol or other mind altering drugs; fireworks or explosive/flammable material; candles; stolen items; pornographic material; sharp objects (nail clippers, files, thumbtacks, razors, scissors, letter openers, etc.). This list is not all inclusive; other items may be determined contraband by staff.",
    value:
      "Contraband: Weapons of any kind; all medications and OTC drugs kept by staff; alcohol and products containing alcohol or other mind altering drugs; fireworks or explosive/flammable material; candles; stolen items; pornographic material; sharp objects (nail clippers, files, thumbtacks, razors, scissors, letter openers, etc.). This list is not all inclusive; other items may be determined contraband by staff.",
  },
  {
    label:
      "In the event of a public health issue for example lice, clients are required to follow standard public health guidelines to reduce / eliminate the spread of the disease.",
    value:
      "In the event of a public health issue for example lice, clients are required to follow standard public health guidelines to reduce / eliminate the spread of the disease.",
  },
  {
    label:
      "In the event of a public health communicable disease outbreak, Facility follows State rules per A.A.C. 9-6-202 A.B.",
    value:
      "In the event of a public health communicable disease outbreak, Facility follows State rules per A.A.C. 9-6-202 A.B.",
  },
  { label: "No pets are allowed.", value: "No pets are allowed." },
  {
    label:
      "Facility recognizes the psychosocial, spiritual and cultural values that influence and affect a client. Facility will provide clients, upon request, non-denominational pastoral services and specifically requested pastoral services.",
    value:
      "Facility recognizes the psychosocial, spiritual and cultural values that influence and affect a client. Facility will provide clients, upon request, non-denominational pastoral services and specifically requested pastoral services.",
  },
  {
    label:
      "House cigarettes are distributed hourly unless otherwise specified by the Program Coordinator.",
    value:
      "House cigarettes are distributed hourly unless otherwise specified by the Program Coordinator.",
  },
  {
    label:
      "Food in refrigerators must be labeled with client name/initials and dated when stored in the refrigerator. Weekly refrigerator checks will be conducted. Any open food not in the original package, not labeled and/or dated will be discarded. Any opened food labeled and dated left in the refrigerator after 14 days due to health concerns of spoiled food will be discarded.",
    value:
      "Food in refrigerators must be labeled with client name/initials and dated when stored in the refrigerator. Weekly refrigerator checks will be conducted. Any open food not in the original package, not labeled and/or dated will be discarded. Any opened food labeled and dated left in the refrigerator after 14 days due to health concerns of spoiled food will be discarded.",
  },
  {
    label:
      "Resident are to participate in group/and individual therapy session per treatment plan daily.",
    value:
      "Resident are to participate in group/and individual therapy session per treatment plan daily.",
  },
  {
    label: "Facility conducts random urine drug and alcohol screening.",
    value: "Facility conducts random urine drug and alcohol screening.",
  },
  {
    label:
      "Facility conducts random searches upon residents returning back to the facility and also randomly searches residents room to avoid contraband.",
    value:
      "Facility conducts random searches upon residents returning back to the facility and also randomly searches residents room to avoid contraband.",
  },
  {
    label:
      "A pass request form must be filled out if you are leaving the facility for family visit, social visit, or work. Passes granted on case by case basis. No Overnight passes are permitted.",
    value:
      "A pass request form must be filled out if you are leaving the facility for family visit, social visit, or work. Passes granted on case by case basis. No Overnight passes are permitted.",
  },
  {
    label:
      "Resident are to take their properties during discharge. In the case resident property is left behind after discharge, resident has 14 days after discharge to pick up their left over properties. The properties will be donated to Goodwill after 14 days of non pick up.",
    value:
      "Resident are to take their properties during discharge. In the case resident property is left behind after discharge, resident has 14 days after discharge to pick up their left over properties. The properties will be donated to Goodwill after 14 days of non pick up.",
  },
  // 2026-04-26: closing acknowledgement removed from selectable list per
  // client — it's a signing statement, not a selectable rule. To restore,
  // uncomment below.
  // { label: "Safety and Environment — House Rules: By signing this form, I am agreeing to the rules above.", value: "Safety and Environment — House Rules: By signing this form, I am agreeing to the rules above." },
];

// Sanitizer for legacy records — applied at every render boundary so saved
// records display the current wording without any DB migration:
//   - "DEVINE CARE LLC" / "Devine Care" → "Facility"   (Session 41)
//   - leading "N. " number prefixes stripped              (2026-04-30)
const LEADING_NUMBER_RE = /^\s*\d+\.\s+/;
export const sanitizeHouseRuleText = (s) =>
  typeof s === "string"
    ? s
        .replace(/DEVINE CARE LLC/g, "Facility")
        .replace(/Devine Care/g, "Facility")
        .replace(LEADING_NUMBER_RE, "")
    : s;

export const sanitizeHouseRulesArray = (rules) =>
  Array.isArray(rules)
    ? rules.map((r) =>
        r && typeof r === "object"
          ? {
              ...r,
              label: sanitizeHouseRuleText(r.label),
              value: sanitizeHouseRuleText(r.value),
            }
          : r,
      )
    : rules;
