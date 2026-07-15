/** @format */

import { describe, it, expect } from "vitest";
import { buildAssessmentPayload } from "./payloadMapper";

// Pure transform module: maps flat form state into the Initial Assessment API
// payload. The mapper builds its body via `new Function`, declaring one
// parameter per key actually present on `values`. ARRAY_PAYLOAD_DEFAULTS only
// backfills the array fields the body iterates with .forEach — every OTHER
// identifier the body references (yesDiabetes, person, signers, ...) must be a
// real key on the input or the generated body throws ReferenceError. In the
// original component these were all `useState` values in scope at handleSubmit.
//
// To call the mapper safely in isolation we therefore pass a complete base
// object that declares every referenced identifier (undefined by default) and
// spread the fields under test on top. The base list is exhaustive — it is the
// mapper's true input contract.
const REQUIRED_KEYS = [
  "AccessComment",
  "AccessYesNo",
  "Additional1Description",
  "Additional1icdCode",
  "Agitation",
  "AllergiesComment",
  "AllergiesYes",
  "Anxiety",
  "AnxietyComment",
  "AnxietyYes",
  "ArticulationOtherBooleanOther",
  "BathingComments",
  "BathingFair",
  "BathingGood",
  "BathingGoodNeedAssist",
  "BathingNotSoGood",
  "BipolarComment",
  "BipolarYes",
  "BonePain",
  "ChronicPain",
  "ChronicYesNO",
  "CooperationOtherBooleanType",
  "Current",
  "CurrentYesNO",
  "DepressionComment",
  "DepressionYes",
  "EatingComments",
  "EatingFair",
  "EatingGood",
  "EatingGoodNeedAssist",
  "EatingNotSoGood",
  "EyeContactOtherBooleanType",
  "Family",
  "FamilyYesNO",
  "FearComment",
  "FearYesNo",
  "GooseBumps",
  "GroomingComments",
  "GroomingFair",
  "GroomingGood",
  "GroomingGoodNeedAssist",
  "GroomingNotSoGood",
  "GroomingOther",
  "Headache",
  "HouseworkComments",
  "HouseworkFair",
  "HouseworkGood",
  "HouseworkGoodNeedAssist",
  "HouseworkNotSoGood",
  "InsomniaComment",
  "InsomniaYes",
  "LossofMuscleCoordination",
  "LossofMuscleCoordinationOtherType",
  "ManagingComments",
  "ManagingFair",
  "ManagingGood",
  "ManagingGoodNeedAssist",
  "ManagingNotSoGood",
  "MannerismsOther",
  "MobilityComments",
  "MobilityFair",
  "MobilityGood",
  "MobilityGoodNeedAssist",
  "MobilityNotSoGood",
  "Nausea",
  "ObsessiveComment",
  "ObsessiveYes",
  "Paranoia",
  "PersonalityComment",
  "PersonalityYes",
  "PhobiasComment",
  "PhobiasYes",
  "PostureOther",
  "PreparingComments",
  "PreparingFair",
  "PreparingGood",
  "PreparingGoodNeedAssist",
  "PreparingNotSoGood",
  "PriorComment",
  "PriorYesNo",
  "PsychomotorActivityOther",
  "QuantityOtherBooleanOther",
  "RateOtherBooleanOther",
  "RecentComment",
  "RecentYesNo",
  "ReligiousComment",
  "ReligiousYesNo",
  "Runningnose",
  "SchizophreniaComment",
  "SchizophreniaYes",
  "Seizures",
  "ShoppingComments",
  "ShoppingFair",
  "ShoppingGood",
  "ShoppingGoodNeedAssist",
  "ShoppingNotSoGood",
  "SpiritualComment",
  "SpiritualYesNo",
  "SubstanceAbuseComment",
  "SubstanceComment",
  "SubstanceYes",
  "SubstanceYesNo",
  "SupportsComment",
  "SupportsYesNo",
  "SurgeriesComment",
  "SurgeriesYes",
  "Sweats",
  "SymptomsYesNO",
  "TactileDisturbances",
  "TakingComments",
  "TakingFair",
  "TakingGood",
  "TakingGoodNeedAssist",
  "TakingNotSoGood",
  "Tearing",
  "Terminal",
  "TerminalYesNO",
  "TertiaryDescription",
  "TertiaryIcdCode",
  "ToiletingComments",
  "ToiletingFair",
  "ToiletingGood",
  "ToiletingGoodNeedAssist",
  "ToiletingNotSoGood",
  "ToneOtherBooleanOther",
  "Tremors",
  "VisualDisturbances",
  "VisualDisturbancesOtherType",
  "Vomiting",
  "WeightOther",
  "WillingComment",
  "WillingYesNo",
  "abusingComment",
  "abusingYesNo",
  "acceptResident",
  "accessToHealthCareServices",
  "accidentInjury",
  "activeDuty",
  "additionalNotes",
  "adequateEyeContact",
  "adequateGrooming",
  "adminSignature",
  "adminSignatureDate",
  "adminSignatureTime",
  "agitated",
  "ahcccsId",
  "anxious",
  "appropriate",
  "appropriateCooperation",
  "approvedBy",
  "assessmentOn",
  "assessmentType",
  "attireOther",
  "auditoryHallucinations",
  "averageHeight",
  "averageWeight",
  "awkward",
  "behaviourYesNO",
  "bhpCredentials",
  "bhpDate",
  "bhpName",
  "bhpSignature",
  "bhpTime",
  "bhrfCriteria",
  "calm",
  "casual",
  "childRemovedFromHouse",
  "chronicCommit",
  "circumstances",
  "circumstantial",
  "clinicalSummary",
  "commentCancer",
  "commentDiabety",
  "commentHeart",
  "commentHigh",
  "commentHistory",
  "commentLiver",
  "commentLung",
  "commentSeizures",
  "commentbrain",
  "companyName",
  "concrete",
  "consistent",
  "constricted",
  "currentBehavioralIssues",
  "currentStudent",
  "currentThoughtsOfHarmingOthers",
  "currentThoughtsOfHarmingSelf",
  "currentlyEmployed",
  "dateOfAssessment",
  "death",
  "defensive",
  "delayed",
  "depressedAffect",
  "depressedMood",
  "dirty",
  "disheveled",
  "divorceSeparation",
  "dob",
  "educationalHistory",
  "educationalProblems",
  "elevated",
  "emaciated",
  "employmentLocation",
  "ethnicity",
  "euthymic",
  "euthymicOtherBooleanType",
  "evasive",
  "fairInsight",
  "fairJudgment",
  "fairMemory",
  "fallRisk",
  "fallRiskExplanation",
  "familyProblems",
  "fast",
  "gaitOther",
  "goodInsight",
  "goodJudgment",
  "goodMemory",
  "guardianship",
  "guardianshipPoaPubFidName",
  "hasNotified",
  "healthConditionsYes",
  "healthConditionsYesComment",
  "heigthOther",
  "hobbiesLeisureActivities",
  "hostile",
  "housingProblems",
  "hyperactive",
  "hypoactive",
  "id",
  "ifYesWhere",
  "indifferent",
  "injury",
  "intactAbilityToConcentration",
  "interactionWithLegalSystem",
  "interventionComment",
  "interventionYesNo",
  "irritable",
  "job",
  "labile",
  "logicalCoherent",
  "loud",
  "maritalProblems",
  "medicalSurgical",
  "militaryService",
  "minimal",
  "mumbled",
  "mutism",
  "neat",
  "negative",
  "noDelusions",
  "none",
  "noneReportedOrObserved",
  "normalArticulation",
  "normalGait",
  "normalPosture",
  "normalQuantity",
  "normalRange",
  "normalRate",
  "normalTone",
  "normalresponseLatency",
  "obese",
  "occupationalProblems",
  "older",
  "olderOther",
  "otherAbilityToConcentration",
  "otherSignificantRecentLossesType",
  "otherStressors",
  "otherText",
  "overweight",
  "patient_Id",
  "person",
  "picking",
  "place",
  "poor",
  "poorInsight",
  "poorJudgment",
  "poorMemory",
  "powerOfAttorneyStatus",
  "preferredLanguage",
  "pregnanciesComment",
  "pregnanciesYes",
  "pressured",
  "primaryDescription",
  "primaryIcdCode",
  "primarySupportGroup",
  "programLocation",
  "psychiatricAdditionalDescription",
  "psychiatricAdditionalicdCode",
  "psychiatricPrimaryDescription",
  "psychiatricPrimaryIcdCode",
  "psychiatricSecondaryDescription",
  "psychiatricSecondaryicdCode",
  "psychiatricTertiaryDescription",
  "psychiatricTertiaryIcdCode",
  "relaxed",
  "residentGauardianSignature",
  "residentGoals",
  "residentGuardianDate",
  "residentGuardianName",
  "residentGuardianTime",
  "residentLimitations",
  "residentName",
  "residentRepresentative",
  "responseLatencyOtherBooleanOther",
  "rigid",
  "riskComment",
  "riskLevel",
  "riskYesNo",
  "rocking",
  "secondaryDescription",
  "secondaryicdCode",
  "setNoAndYes",
  "sex",
  "sexualProblems",
  "short",
  "shortened",
  "shuffling",
  "signatures",
  "signers",
  "significantSocialDevelopmentalHistory",
  "slouched",
  "slow",
  "slowGait",
  "slurred",
  "soft",
  "specialEducation",
  "staffDate",
  "staffDateTime",
  "staffName",
  "staffSignature",
  "staggering",
  "stuttered",
  "substanceAbuseDenies",
  "substanceAbuseHistory",
  "substanceAbuseHistoryDataAgeOfFirstUseAlcohol",
  "substanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines",
  "substanceAbuseHistoryDataAgeOfFirstUseCocaine",
  "substanceAbuseHistoryDataAgeOfFirstUseCrack",
  "substanceAbuseHistoryDataAgeOfFirstUseHallucinogens",
  "substanceAbuseHistoryDataAgeOfFirstUseHeroin",
  "substanceAbuseHistoryDataAgeOfFirstUseInhalants",
  "substanceAbuseHistoryDataAgeOfFirstUseMDMA",
  "substanceAbuseHistoryDataAgeOfFirstUseMarijuana",
  "substanceAbuseHistoryDataAgeOfFirstUseMethadone",
  "substanceAbuseHistoryDataAgeOfFirstUseMethamphetamine",
  "substanceAbuseHistoryDataAgeOfFirstUseOTC",
  "substanceAbuseHistoryDataAgeOfFirstUsePCP",
  "substanceAbuseHistoryDataAgeOfFirstUsePrescription",
  "substanceAbuseHistoryDataFrequencyAlcohol",
  "substanceAbuseHistoryDataFrequencyBenzodiazepines",
  "substanceAbuseHistoryDataFrequencyCocaine",
  "substanceAbuseHistoryDataFrequencyCrack",
  "substanceAbuseHistoryDataFrequencyHallucinogens",
  "substanceAbuseHistoryDataFrequencyHeroin",
  "substanceAbuseHistoryDataFrequencyInhalants",
  "substanceAbuseHistoryDataFrequencyMDMA",
  "substanceAbuseHistoryDataFrequencyMarijuana",
  "substanceAbuseHistoryDataFrequencyMethadone",
  "substanceAbuseHistoryDataFrequencyMethamphetamine",
  "substanceAbuseHistoryDataFrequencyOTC",
  "substanceAbuseHistoryDataFrequencyPCP",
  "substanceAbuseHistoryDataFrequencyPrescription",
  "substanceAbuseHistoryDataLastUseAlcohol",
  "substanceAbuseHistoryDataLastUseBenzodiazepines",
  "substanceAbuseHistoryDataLastUseCocaine",
  "substanceAbuseHistoryDataLastUseCrack",
  "substanceAbuseHistoryDataLastUseHallucinogens",
  "substanceAbuseHistoryDataLastUseHeroin",
  "substanceAbuseHistoryDataLastUseInhalants",
  "substanceAbuseHistoryDataLastUseMDMA",
  "substanceAbuseHistoryDataLastUseMarijuana",
  "substanceAbuseHistoryDataLastUseMethadone",
  "substanceAbuseHistoryDataLastUseMethamphetamine",
  "substanceAbuseHistoryDataLastUseOTC",
  "substanceAbuseHistoryDataLastUsePCP",
  "substanceAbuseHistoryDataLastUsePrescription",
  "substanceAbuseHistoryDataLengthOfSobrietyAlcohol",
  "substanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines",
  "substanceAbuseHistoryDataLengthOfSobrietyCocaine",
  "substanceAbuseHistoryDataLengthOfSobrietyCrack",
  "substanceAbuseHistoryDataLengthOfSobrietyHallucinogens",
  "substanceAbuseHistoryDataLengthOfSobrietyHeroin",
  "substanceAbuseHistoryDataLengthOfSobrietyInhalants",
  "substanceAbuseHistoryDataLengthOfSobrietyMDMA",
  "substanceAbuseHistoryDataLengthOfSobrietyMarijuana",
  "substanceAbuseHistoryDataLengthOfSobrietyMethadone",
  "substanceAbuseHistoryDataLengthOfSobrietyMethamphetamine",
  "substanceAbuseHistoryDataLengthOfSobrietyOTC",
  "substanceAbuseHistoryDataLengthOfSobrietyPCP",
  "substanceAbuseHistoryDataLengthOfSobrietyPrescription",
  "substanceUseInHome",
  "suicidalIdeation",
  "suicidalIdeationSeverity",
  "suicidalIdeationUrgency",
  "suspicious",
  "tactileHallucinations",
  "tall",
  "tangential",
  "tattered",
  "tense",
  "thin",
  "thoughtContentOther",
  "thoughtProcessesOther",
  "tics",
  "time",
  "todayDate",
  "treatmentRecommendations",
  "tremorsMannerisms",
  "triggers",
  "typeOfServiceArray",
  "unintelligible",
  "unkempt",
  "unremarkableHallucinations",
  "unremarkablethoughtContent",
  "vague",
  "verbose",
  "violentActsAgainstPersonFamily",
  "visualHallucinations",
  "wellGroomed",
  "withinNormalLimits",
  "workHistory",
  "yesCancer",
  "yesChronic",
  "yesDiabetes",
  "yesGrandiose",
  "yesHeart",
  "yesHigh",
  "yesHistory",
  "yesLiver",
  "yesLung",
  "yesOtherDelusionsText",
  "yesOtherHallucinationsText",
  "yesPersecutory",
  "yesSeizures",
  "yesSomatic",
  "yesThyroid",
  "yesbrain",
  "younger",
];

// Fresh complete base each call so tests never share mutable state.
const baseInput = () =>
  Object.fromEntries(REQUIRED_KEYS.map((k) => [k, undefined]));

// Convenience: build a payload from the full base plus the given overrides.
const build = (overrides = {}) =>
  buildAssessmentPayload({ ...baseInput(), ...overrides });

describe("buildAssessmentPayload", () => {
  it("does not throw and returns an object given a complete (all-undefined) input", () => {
    // WHY: with every referenced identifier present, the generated body runs
    // and the array defaults keep the .forEach loops from blowing up.
    const data = build();
    expect(data).toBeTypeOf("object");
    expect(data).not.toBeNull();
  });

  it("flattens residentStrengths to an array of .value strings", () => {
    const data = build({
      residentStrengths: [{ value: "kind" }, { value: "patient" }],
    });
    expect(data.residentStrengths).toEqual(["kind", "patient"]);
  });

  it("maps reasonForAdmission objects to their .value", () => {
    const data = build({
      reasonForAdmission: [{ value: "stabilization" }, { value: "respite" }],
    });
    expect(data.reasonForAdmission).toEqual(["stabilization", "respite"]);
  });

  it("flattens SignificantFamilyMedicalPsychiatricHistory values", () => {
    const data = build({
      SignificantFamilyMedicalPsychiatricHistory: [
        { value: "depression" },
        { value: "anxiety" },
      ],
    });
    expect(data.SignificantFamilyMedicalPsychiatricHistory).toEqual([
      "depression",
      "anxiety",
    ]);
  });

  it("maps legalHistory (selectedValue) to a flat value array", () => {
    const data = build({ selectedValue: [{ value: "probation" }] });
    expect(data.legalHistory).toEqual(["probation"]);
  });

  it("maps medicalEquipmentArray (selectedValueMedical) to value array", () => {
    const data = build({
      selectedValueMedical: [{ value: "wheelchair" }, { value: "walker" }],
    });
    expect(data.medicalEquipmentArray).toEqual(["wheelchair", "walker"]);
  });

  it("maps specialPrecautions (selectedValueSpecialPrecautions) to value array", () => {
    const data = build({
      selectedValueSpecialPrecautions: [{ value: "fall-risk" }],
    });
    expect(data.specialPrecautions).toEqual(["fall-risk"]);
  });

  it("passes through scalar identity fields and renames the aliased keys", () => {
    const data = build({
      assessmentType: "initial",
      patient_Id: "res-test-001",
      residentName: "Test Patient",
      ahcccsId: "MRN-TEST-001",
      sex: "F",
      riskLevel: "low",
    });
    expect(data.assessmentType).toBe("initial");
    expect(data.patientId).toBe("res-test-001"); // patient_Id -> patientId
    expect(data.residentName).toBe("Test Patient");
    expect(data.ahcccsNumber).toBe("MRN-TEST-001"); // ahcccsId -> ahcccsNumber
    expect(data.sex).toBe("F");
    expect(data.riskLevel).toBe("low");
  });

  it("assembles the personalInformation nested object from flat keys", () => {
    const data = build({
      educationalHistory: "GED",
      specialEducation: true,
      currentStudent: false,
      ifYesWhere: "Community College",
    });
    expect(data.personalInformation).toEqual({
      educationalHistory: "GED",
      specialEducation: true,
      currentStudent: false,
      currentStudentLocation: "Community College", // ifYesWhere -> currentStudentLocation
    });
  });

  it("assembles employmentHistory and militaryHistory nested objects", () => {
    const data = build({
      currentlyEmployed: true,
      employmentLocation: "Clinic",
      militaryService: false,
      activeDuty: false,
    });
    expect(data.employmentHistory).toEqual({
      currentlyEmployed: true,
      employmentLocation: "Clinic",
    });
    expect(data.militaryHistory).toEqual({
      militaryService: false,
      activeDuty: false,
    });
  });

  it("builds the mentalStatusExam orientation and judgment sub-objects", () => {
    const data = build({
      person: true,
      place: true,
      time: false,
      circumstances: true,
      goodJudgment: true,
      fairJudgment: false,
      poorJudgment: false,
    });
    expect(data.mentalStatusExam.orientation).toEqual({
      person: true,
      place: true,
      time: false,
      circumstances: true,
    });
    expect(data.mentalStatusExam.Judgment).toEqual({
      Good: true,
      Fair: false,
      Poor: false,
    });
  });

  it("seeds the static medicalConditions rows from flat yes/comment keys", () => {
    const data = build({ yesDiabetes: true, commentDiabety: "type 2" });
    const diabetes = data.medicalConditions.find(
      (c) => c.condition === "diabetes",
    );
    expect(diabetes).toMatchObject({
      condition: "diabetes",
      yes: true,
      comments: "type 2",
    });
  });

  it("appends extra otherConditionArray rows after the static medical rows", () => {
    const extra = { condition: "custom", yes: true, comments: "x" };
    const data = build({ otherConditionArray: [extra] });
    expect(data.medicalConditions).toContainEqual(extra);
    // static rows still present
    expect(
      data.medicalConditions.some((c) => c.condition === "Allergies"),
    ).toBe(true);
  });

  it("builds substanceAbuseHistoryData merging static types with typeArray", () => {
    const extra = { types: "Custom", ageOfFirstUse: 18 };
    const data = build({
      substanceAbuseHistoryDataAgeOfFirstUseAlcohol: 21,
      typeArray: [extra],
    });
    const alcohol = data.substanceAbuseHistoryData.find(
      (t) => t.types === "Alcohol",
    );
    expect(alcohol.ageOfFirstUse).toBe(21);
    expect(data.substanceAbuseHistoryData).toContainEqual(extra);
  });

  it("builds riskFactors with Behavior cues comments flattened from the dropdown", () => {
    const data = build({
      behaviorcuesDropDown: [{ value: "withdrawn" }, { value: "agitated" }],
      behaviourYesNO: "Yes",
    });
    const behaviorCues = data.riskFactors.find(
      (r) => r.type === "Behavior cues",
    );
    expect(behaviorCues).toMatchObject({
      type: "Behavior cues",
      yesNo: "Yes",
      comments: ["withdrawn", "agitated"],
    });
  });

  it("builds psychiatricDiagnoses with Primary/Secondary/Tertiary/Additional names", () => {
    const data = build({
      psychiatricPrimaryIcdCode: "F32.1",
      psychiatricPrimaryDescription: "MDD",
    });
    const primary = data.psychiatricDiagnoses.find((d) => d.name === "Primary");
    expect(primary).toEqual({
      icdCode: "F32.1",
      description: "MDD",
      name: "Primary",
    });
    expect(data.psychiatricDiagnoses.map((d) => d.name)).toEqual(
      expect.arrayContaining([
        "Primary",
        "Secondary",
        "Tertiary",
        "Additional",
      ]),
    );
  });

  it("derives significantRecentLosses.typeOfLoss.comment as a boolean from the other-loss text", () => {
    const withText = build({ otherSignificantRecentLossesType: "pet died" });
    expect(withText.significantRecentLosses.typeOfLoss.comment).toBe(true);
    expect(withText.significantRecentLosses.comment).toBe("pet died");

    const withoutText = build({ otherSignificantRecentLossesType: "" });
    // WHY: ternary `text ? true : false` collapses falsy ("") to false
    expect(withoutText.significantRecentLosses.typeOfLoss.comment).toBe(false);
  });

  it("maps signers to signer DTOs when id is falsy (new assessment)", () => {
    const data = build({
      id: undefined,
      signers: [{ value: "emp-test-001", label: "Dr Test", type: "BHP" }],
    });
    expect(data.signers).toEqual([
      {
        signerId: "emp-test-001",
        name: "Dr Test",
        signature: "",
        dateSigned: "",
        signedTime: "",
        type: "BHP",
      },
    ]);
  });

  it("preserves signers as-is when id is truthy (editing existing assessment)", () => {
    const existing = [{ signerId: "emp-test-001", signature: "abc" }];
    const data = build({ id: "assessment-1", signers: existing });
    expect(data.signers).toBe(existing);
  });

  it("does not mutate the caller's input object", () => {
    const input = { ...baseInput(), residentStrengths: [{ value: "kind" }] };
    const snapshot = JSON.parse(JSON.stringify(input));
    buildAssessmentPayload(input);
    expect(JSON.parse(JSON.stringify(input))).toEqual(snapshot);
  });
});
