/** @format */

/**
 * Fixed medical/psychiatric condition rows (indices 0–25).
 * Legacy keys must match payloadMapper otherConditionArrayTemp order.
 */
export const MEDICAL_CONDITIONS_FIXED_ROWS = [
  {
    condition: "diabetes",
    legacyKeys: { yesNo: "yesDiabetes", comment: "commentDiabety" },
    setters: { yesNo: "setYesDiabetes", comment: "setCommentDeabetes" },
  },
  {
    condition: "Heart disease / heart attack",
    legacyKeys: { yesNo: "yesHeart", comment: "commentHeart" },
    setters: { yesNo: "setYesHeart", comment: "setCommentHeart" },
  },
  {
    condition: "History",
    legacyKeys: { yesNo: "yesHistory", comment: "commentHistory" },
    setters: { yesNo: "setYesHistory", comment: "setCommentHistory" },
  },
  {
    condition: "High Blood Pressure",
    legacyKeys: { yesNo: "yesHigh", comment: "commentHigh" },
    setters: { yesNo: "setYesHigh", comment: "setCommentHigh" },
  },
  {
    condition: "Lung disease (ie asthma, COPD, emphysema)",
    legacyKeys: { yesNo: "yesLung", comment: "commentLung" },
    setters: { yesNo: "setYesLung", comment: "setCommentLung" },
  },
  {
    condition: "Seizures",
    legacyKeys: { yesNo: "yesSeizures", comment: "commentSeizures" },
    setters: { yesNo: "setYesSeizures", comment: "setCommentSeizures" },
  },
  {
    condition: "Cancer",
    legacyKeys: { yesNo: "yesCancer", comment: "commentCancer" },
    setters: { yesNo: "setYesCancer", comment: "setCommentCancer" },
  },
  {
    condition: "Liver/kidney disease",
    legacyKeys: { yesNo: "yesLiver", comment: "commentLiver" },
    setters: { yesNo: "setYesLiver", comment: "setCommentLiver" },
  },
  {
    condition: "Thyroid disorder",
    fieldType: "multiselect",
    legacyKeys: { yesNo: "yesThyroid", comments: "thyroidDisorder" },
    setters: { yesNo: "setYesThyroid", comments: "setThyroidDisorder" },
  },
  {
    condition: "History of head trauma/traumatic brain injury",
    legacyKeys: { yesNo: "yesbrain", comment: "commentbrain" },
    setters: { yesNo: "setYesBrain", comment: "setbrain" },
  },
  {
    condition: "Chronic painChronic pain",
    legacyKeys: { yesNo: "yesChronic", comment: "chronicCommit" },
    setters: { yesNo: "setYesChronic", comment: "setChronicCommit" },
  },
  {
    condition: "Allergies",
    legacyKeys: { yesNo: "AllergiesYes", comment: "AllergiesComment" },
    setters: { yesNo: "setAllergiesYes", comment: "setAllergiesComment" },
  },
  {
    condition: "Surgeries",
    legacyKeys: { yesNo: "SurgeriesYes", comment: "SurgeriesComment" },
    setters: { yesNo: "setSurgeriessYes", comment: "setSurgeriesComment" },
  },
  {
    condition: "Number of pregnancies / births",
    legacyKeys: { yesNo: "pregnanciesYes", comment: "pregnanciesComment" },
    setters: { yesNo: "setPregnanciesYes", comment: "setPregnanciesComment" },
  },
  {
    condition: "Substance use disorder (please specify)",
    legacyKeys: { yesNo: "SubstanceYes", comment: "SubstanceComment" },
    setters: { yesNo: "setSubstanceYes", comment: "setSubstanceComment" },
  },
  {
    condition: "Depression",
    legacyKeys: { yesNo: "DepressionYes", comment: "DepressionComment" },
    setters: { yesNo: "setDepressionYes", comment: "setDepressionComment" },
  },
  {
    condition: "Anxiety/panic attacks",
    legacyKeys: { yesNo: "AnxietyYes", comment: "AnxietyComment" },
    setters: { yesNo: "setAnxietyYes", comment: "setAnxietyComment" },
  },
  {
    condition: "Insomnia",
    legacyKeys: { yesNo: "InsomniaYes", comment: "InsomniaComment" },
    setters: { yesNo: "setInsomniaYes", comment: "setInsomniaComment" },
  },
  {
    condition: "Bipolar disorder",
    legacyKeys: { yesNo: "BipolarYes", comment: "BipolarComment" },
    setters: { yesNo: "setBipolarYes", comment: "setBipolarComment" },
  },
  {
    condition: "Schizophrenia",
    legacyKeys: { yesNo: "SchizophreniaYes", comment: "SchizophreniaComment" },
    setters: {
      yesNo: "setSchizophreniaYes",
      comment: "setSchizophreniaComment",
    },
  },
  {
    condition: "Obsessive compulsive disorder",
    legacyKeys: { yesNo: "ObsessiveYes", comment: "ObsessiveComment" },
    setters: { yesNo: "setObsessiveYes", comment: "setObsessiveComment" },
  },
  {
    condition: "Personality disorder (please specify)",
    legacyKeys: { yesNo: "PersonalityYes", comment: "PersonalityComment" },
    setters: { yesNo: "setPersonalityYes", comment: "setPersonalityComment" },
  },
  {
    condition: "Phobias",
    legacyKeys: { yesNo: "PhobiasYes", comment: "PhobiasComment" },
    setters: { yesNo: "setPhobiasYes", comment: "setPhobiasComment" },
  },
  {
    condition: "Any other health conditions",
    legacyKeys: {
      yesNo: "healthConditionsYes",
      comment: "healthConditionsYesComment",
    },
    setters: {
      yesNo: "setHealthConditionsYes",
      comment: "sethealthConditionsYesComment",
    },
  },
  {
    condition: "Infection or Diseases",
    fieldType: "multiselect",
    legacyKeys: { yesNo: "InfectionYes", comments: "infectionDiseases" },
    setters: { yesNo: "setInfectionYes", comments: "setInfectionDiseases" },
  },
];

export const MEDICAL_CONDITIONS_FIXED_COUNT =
  MEDICAL_CONDITIONS_FIXED_ROWS.length;
