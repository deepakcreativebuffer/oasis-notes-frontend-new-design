/** @format */

import { describe, it, expect } from "vitest";
import * as utils from "./index";

// The barrel re-aggregates helpers/validators/constants/payloadMapper. These
// symbols are the public contract the InitialAssessment feature imports, so the
// barrel must surface every one with the correct type/behavior.
describe("InitialAssessment utils barrel", () => {
  it("re-exports helpers from assessmentContext", () => {
    expect(typeof utils.resolveAssessmentContext).toBe("function");
    expect(typeof utils.mapSelectValuesToArray).toBe("function");
    expect(typeof utils.getApiArrayData).toBe("function");
  });

  it("re-exports validator helpers", () => {
    expect(typeof utils.isWitnessIncomplete).toBe("function");
    expect(typeof utils.allPenSignaturesHaveNames).toBe("function");
    expect(typeof utils.hasAnyTypedSignature).toBe("function");
  });

  it("re-exports assessment constants with expected shapes", () => {
    expect(utils.ASSESSMENT_MODES).toMatchObject({
      CREATE: "create",
      EDIT: "edit",
      VIEW: "view",
    });
    expect(utils.ASSESSMENT_PORTALS).toMatchObject({
      EMPLOYEE: "employee",
      RESIDENT: "resident",
    });
    expect(utils.EMPLOYEE_ROUTES.CREATE).toBe("/initial-assessment");
    expect(utils.RESIDENT_ROUTES.VIEW_PREFIX).toBe(
      "/view-initial-assessment-resident/",
    );
    expect(typeof utils.PRINT_PAGE_STYLE).toBe("string");
  });

  it("re-exports buildAssessmentPayload", () => {
    expect(typeof utils.buildAssessmentPayload).toBe("function");
  });
});

describe("resolveAssessmentContext (re-exported)", () => {
  it("defaults to CREATE/EMPLOYEE when pathname is missing", () => {
    const ctx = utils.resolveAssessmentContext();
    expect(ctx).toEqual({
      mode: utils.ASSESSMENT_MODES.CREATE,
      portal: utils.ASSESSMENT_PORTALS.EMPLOYEE,
      isCreate: true,
      isView: false,
      isEdit: false,
      isReadOnly: false,
    });
  });

  it("detects the resident portal from the pathname", () => {
    const ctx = utils.resolveAssessmentContext(
      "/view-initial-assessment-resident/res-test-001",
    );
    expect(ctx.portal).toBe(utils.ASSESSMENT_PORTALS.RESIDENT);
    // VIEW_PREFIX match => view mode => read-only
    expect(ctx.isView).toBe(true);
    expect(ctx.isReadOnly).toBe(true);
  });

  it("treats the bare create route as CREATE mode", () => {
    const ctx = utils.resolveAssessmentContext("/initial-assessment");
    expect(ctx.isCreate).toBe(true);
    expect(ctx.mode).toBe(utils.ASSESSMENT_MODES.CREATE);
  });

  it("treats the edit prefix as EDIT mode (employee portal)", () => {
    const ctx = utils.resolveAssessmentContext(
      "/edit-initial-assessment/emp-test-001",
    );
    expect(ctx.isEdit).toBe(true);
    expect(ctx.portal).toBe(utils.ASSESSMENT_PORTALS.EMPLOYEE);
    expect(ctx.isReadOnly).toBe(false);
  });
});

describe("mapSelectValuesToArray (re-exported)", () => {
  it("returns [] for no args", () => {
    expect(utils.mapSelectValuesToArray()).toEqual([]);
  });

  it("unwraps {value} objects and passes through items without a value", () => {
    // item?.value ?? item -> object without `value` falls back to the item
    const noValue = { label: "x" };
    expect(
      utils.mapSelectValuesToArray([{ value: "a" }, "b", noValue]),
    ).toEqual(["a", "b", noValue]);
  });
});

describe("getApiArrayData (re-exported)", () => {
  it("returns [] when arrayLength <= startIndex", () => {
    expect(utils.getApiArrayData(3, 3, ["a", "b", "c"])).toEqual([]);
  });

  it("slices from startIndex to arrayLength", () => {
    expect(utils.getApiArrayData(1, 3, ["a", "b", "c"])).toEqual(["b", "c"]);
  });
});

describe("signature validators (re-exported)", () => {
  it("isWitnessIncomplete: signature present but name missing => true", () => {
    expect(
      utils.isWitnessIncomplete({ witness: { rawSignatureImage: "img" } }),
    ).toBe(true);
  });

  it("isWitnessIncomplete: 'undefined undefined' name counts as missing", () => {
    expect(
      utils.isWitnessIncomplete({
        witness: { rawSignatureImage: "img", name: "undefined undefined" },
      }),
    ).toBe(true);
  });

  it("isWitnessIncomplete: name + signature => false", () => {
    expect(
      utils.isWitnessIncomplete({
        witness: { rawSignatureImage: "img", name: "Test Patient" },
      }),
    ).toBe(false);
  });

  it("isWitnessIncomplete: no signature => false", () => {
    expect(utils.isWitnessIncomplete({})).toBe(false);
    expect(utils.isWitnessIncomplete(undefined)).toBe(false);
  });

  it("allPenSignaturesHaveNames: every pen signature must have a name", () => {
    // signed-without-name => false
    expect(
      utils.allPenSignaturesHaveNames({
        a: { rawSignatureImage: "img", name: "" },
      }),
    ).toBe(false);
    // signed-with-name and unsigned entries => true
    expect(
      utils.allPenSignaturesHaveNames({
        a: { rawSignatureImage: "img", name: "Test Patient" },
        b: { name: "" },
      }),
    ).toBe(true);
    expect(utils.allPenSignaturesHaveNames(undefined)).toBe(true);
  });

  it("hasAnyTypedSignature: detects bhp/admin/pen signatures", () => {
    expect(
      utils.hasAnyTypedSignature({ bhpSignature: "x", signatures: {} }),
    ).toBe(true);
    expect(
      utils.hasAnyTypedSignature({ adminSignature: "y", signatures: {} }),
    ).toBe(true);
    expect(
      utils.hasAnyTypedSignature({
        signatures: { a: { rawSignatureImage: "img" } },
      }),
    ).toBe(true);
    expect(utils.hasAnyTypedSignature({ signatures: {} })).toBe(false);
  });
});

// The mapper body is generated via `new Function(...keys, body)`, so EVERY
// identifier the body references must be supplied as a key in `values` — any
// missing one becomes an undeclared global and throws a ReferenceError. The
// caller (handleSubmit) always passes the full form state. We reproduce that by
// declaring a complete base of every referenced identifier as `undefined`, then
// overriding only the fields under test.
//
// The full identifier set is derived directly from the source body so the test
// stays faithful to the real call contract.
const FULL_VALUES_BASE = Object.fromEntries(
  `assessmentType patient_Id dob hasNotified assessmentOn companyName residentName sex
  dateOfAssessment ahcccsId preferredLanguage ethnicity programLocation
  guardianship powerOfAttorneyStatus todayDate guardianshipPoaPubFidName approvedBy
  residentGoals residentLimitations
  currentBehavioralIssues
  yesDiabetes commentDiabety yesHeart commentHeart yesHistory commentHistory yesHigh
  commentHigh yesLung commentLung yesSeizures commentSeizures yesCancer commentCancer
  yesLiver commentLiver yesThyroid yesbrain commentbrain
  chronicCommit yesChronic AllergiesYes AllergiesComment SurgeriesYes SurgeriesComment
  pregnanciesYes pregnanciesComment SubstanceYes SubstanceComment DepressionYes
  DepressionComment AnxietyYes AnxietyComment InsomniaYes InsomniaComment BipolarYes
  BipolarComment SchizophreniaYes SchizophreniaComment ObsessiveYes ObsessiveComment
  PersonalityYes PersonalityComment PhobiasYes PhobiasComment healthConditionsYes
  healthConditionsYesComment
  substanceAbuseHistoryDataAgeOfFirstUseAlcohol substanceAbuseHistoryDataLastUseAlcohol
  substanceAbuseHistoryDataFrequencyAlcohol substanceAbuseHistoryDataLengthOfSobrietyAlcohol
  substanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines substanceAbuseHistoryDataLastUseBenzodiazepines
  substanceAbuseHistoryDataFrequencyBenzodiazepines substanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines
  substanceAbuseHistoryDataAgeOfFirstUseCrack substanceAbuseHistoryDataLastUseCrack
  substanceAbuseHistoryDataFrequencyCrack substanceAbuseHistoryDataLengthOfSobrietyCrack
  substanceAbuseHistoryDataAgeOfFirstUseHeroin substanceAbuseHistoryDataLastUseHeroin
  substanceAbuseHistoryDataFrequencyHeroin substanceAbuseHistoryDataLengthOfSobrietyHeroin
  substanceAbuseHistoryDataAgeOfFirstUseInhalants substanceAbuseHistoryDataLastUseInhalants
  substanceAbuseHistoryDataFrequencyInhalants substanceAbuseHistoryDataLengthOfSobrietyInhalants
  substanceAbuseHistoryDataAgeOfFirstUseMarijuana substanceAbuseHistoryDataLastUseMarijuana
  substanceAbuseHistoryDataFrequencyMarijuana substanceAbuseHistoryDataLengthOfSobrietyMarijuana
  substanceAbuseHistoryDataAgeOfFirstUseMethamphetamine substanceAbuseHistoryDataLastUseMethamphetamine
  substanceAbuseHistoryDataFrequencyMethamphetamine substanceAbuseHistoryDataLengthOfSobrietyMethamphetamine
  substanceAbuseHistoryDataAgeOfFirstUseMethadone substanceAbuseHistoryDataLastUseMethadone
  substanceAbuseHistoryDataFrequencyMethadone substanceAbuseHistoryDataLengthOfSobrietyMethadone
  substanceAbuseHistoryDataAgeOfFirstUseMDMA substanceAbuseHistoryDataLastUseMDMA
  substanceAbuseHistoryDataFrequencyMDMA substanceAbuseHistoryDataLengthOfSobrietyMDMA
  substanceAbuseHistoryDataAgeOfFirstUsePCP substanceAbuseHistoryDataLastUsePCP
  substanceAbuseHistoryDataFrequencyPCP substanceAbuseHistoryDataLengthOfSobrietyPCP
  substanceAbuseHistoryDataAgeOfFirstUsePrescription substanceAbuseHistoryDataLastUsePrescription
  substanceAbuseHistoryDataFrequencyPrescription substanceAbuseHistoryDataLengthOfSobrietyPrescription
  substanceAbuseHistoryDataAgeOfFirstUseOTC substanceAbuseHistoryDataLastUseOTC
  substanceAbuseHistoryDataFrequencyOTC substanceAbuseHistoryDataLengthOfSobrietyOTC
  substanceAbuseHistoryDataAgeOfFirstUseCocaine substanceAbuseHistoryDataLastUseCocaine
  substanceAbuseHistoryDataFrequencyCocaine substanceAbuseHistoryDataLengthOfSobrietyCocaine
  substanceAbuseHistoryDataAgeOfFirstUseHallucinogens substanceAbuseHistoryDataLastUseHallucinogens
  substanceAbuseHistoryDataFrequencyHallucinogens substanceAbuseHistoryDataLengthOfSobrietyHallucinogens
  BathingGood BathingFair BathingNotSoGood BathingGoodNeedAssist BathingComments
  GroomingGood GroomingFair GroomingNotSoGood GroomingGoodNeedAssist GroomingComments
  MobilityGood MobilityFair MobilityNotSoGood MobilityGoodNeedAssist MobilityComments
  HouseworkGood HouseworkFair HouseworkNotSoGood HouseworkGoodNeedAssist HouseworkComments
  ShoppingGood ShoppingFair ShoppingNotSoGood ShoppingGoodNeedAssist ShoppingComments
  ManagingGood ManagingFair ManagingNotSoGood ManagingGoodNeedAssist ManagingComments
  PreparingGood PreparingFair PreparingNotSoGood PreparingGoodNeedAssist PreparingComments
  EatingGood EatingFair EatingNotSoGood EatingGoodNeedAssist EatingComments
  ToiletingGood ToiletingFair ToiletingNotSoGood ToiletingGoodNeedAssist ToiletingComments
  TakingGood TakingFair TakingNotSoGood TakingGoodNeedAssist TakingComments
  riskYesNo riskComment PriorYesNo PriorComment AccessYesNo AccessComment SubstanceYesNo
  SubstanceAbuseComment abusingYesNo abusingComment RecentYesNo RecentComment behaviourYesNO
  SymptomsYesNO FamilyYesNO Family TerminalYesNO Terminal CurrentYesNO Current ChronicYesNO
  ChronicPain
  SupportsYesNo SupportsComment SpiritualYesNo SpiritualComment ReligiousYesNo
  ReligiousComment FearYesNo FearComment interventionYesNo interventionComment WillingYesNo
  WillingComment
  psychiatricPrimaryIcdCode psychiatricPrimaryDescription psychiatricSecondaryicdCode
  psychiatricSecondaryDescription psychiatricTertiaryIcdCode psychiatricTertiaryDescription
  psychiatricAdditionalicdCode psychiatricAdditionalDescription
  primaryIcdCode primaryDescription secondaryicdCode secondaryDescription TertiaryIcdCode
  TertiaryDescription Additional1icdCode Additional1Description
  typeOfServiceArray substanceAbuseHistory substanceAbuseDenies
  noneReportedOrObserved Agitation Nausea Vomiting Headache TactileDisturbances Anxiety
  Tremors VisualDisturbances VisualDisturbancesOtherType Sweats Paranoia GooseBumps
  Runningnose BonePain Tearing Seizures LossofMuscleCoordination
  LossofMuscleCoordinationOtherType
  consistent younger older olderOther averageHeight short tall heigthOther averageWeight
  obese overweight thin emaciated WeightOther casual neat tattered dirty attireOther
  wellGroomed adequateGrooming unkempt disheveled GroomingOther euthymic irritable elevated
  depressedMood anxious euthymicOtherBooleanType normalRange depressedAffect labile
  constricted otherText appropriate minimal poor adequateEyeContact EyeContactOtherBooleanType
  appropriateCooperation hostile evasive defensive indifferent CooperationOtherBooleanType
  normalArticulation unintelligible mumbled slurred stuttered ArticulationOtherBooleanOther
  normalTone soft loud pressured ToneOtherBooleanOther normalRate slow fast
  RateOtherBooleanOther normalQuantity verbose mutism QuantityOtherBooleanOther
  normalresponseLatency delayed shortened responseLatencyOtherBooleanOther
  unremarkablethoughtContent suspicious negative concrete thoughtContentOther logicalCoherent
  tangential circumstantial vague thoughtProcessesOther noDelusions yesPersecutory yesSomatic
  yesGrandiose yesOtherDelusionsText unremarkableHallucinations visualHallucinations
  auditoryHallucinations tactileHallucinations yesOtherHallucinationsText normalGait
  staggering shuffling slowGait awkward gaitOther normalPosture relaxed rigid tense slouched
  PostureOther withinNormalLimits calm hyperactive agitated hypoactive PsychomotorActivityOther
  none tics tremorsMannerisms rocking picking MannerismsOther person place time circumstances
  goodJudgment fairJudgment poorJudgment goodInsight fairInsight poorInsight goodMemory
  fairMemory poorMemory intactAbilityToConcentration otherAbilityToConcentration
  significantSocialDevelopmentalHistory educationalHistory specialEducation currentStudent
  ifYesWhere currentlyEmployed employmentLocation workHistory militaryService activeDuty
  triggers fallRisk fallRiskExplanation hobbiesLeisureActivities currentThoughtsOfHarmingSelf
  suicidalIdeation suicidalIdeationUrgency suicidalIdeationSeverity
  currentThoughtsOfHarmingOthers riskLevel primarySupportGroup maritalProblems
  accessToHealthCareServices educationalProblems housingProblems familyProblems
  occupationalProblems interactionWithLegalSystem substanceUseInHome sexualProblems
  otherStressors setNoAndYes death injury medicalSurgical job divorceSeparation accidentInjury
  childRemovedFromHouse violentActsAgainstPersonFamily otherSignificantRecentLossesType
  additionalNotes acceptResident residentGuardianName residentGauardianSignature
  residentGuardianDate residentGuardianTime staffName staffSignature staffDate staffDateTime
  bhpName bhpCredentials bhpSignature bhpDate bhpTime bhrfCriteria clinicalSummary
  treatmentRecommendations residentRepresentative adminSignature adminSignatureDate
  adminSignatureTime signatures bhpSignature id signers`
    .split(/\s+/)
    .filter(Boolean)
    .map((k) => [k, undefined]),
);

const build = (overrides = {}) =>
  utils.buildAssessmentPayload({ ...FULL_VALUES_BASE, ...overrides });

describe("buildAssessmentPayload (re-exported)", () => {
  it("produces the canonical data shape from a complete (empty-valued) form state", () => {
    const payload = build();
    expect(payload).toBeTypeOf("object");
    // array defaults map to []
    expect(payload.residentStrengths).toEqual([]);
    expect(payload.reasonForAdmission).toEqual([]);
    // static section templates are always present even with no input
    expect(Array.isArray(payload.medicalConditions)).toBe(true);
    expect(payload.medicalConditions.length).toBeGreaterThan(0);
    expect(Array.isArray(payload.riskFactors)).toBe(true);
    expect(Array.isArray(payload.protectiveFactors)).toBe(true);
    // nested grouped objects are emitted
    expect(payload.mentalStatusExam).toBeTypeOf("object");
    expect(payload.ActiveWithdrawalSymptoms).toBeTypeOf("object");
  });

  it("maps {value} option arrays into plain value arrays", () => {
    const payload = build({
      reasonForAdmission: [{ value: "intake" }, { value: "crisis" }],
      residentStrengths: [{ value: "resilient" }],
    });
    expect(payload.reasonForAdmission).toEqual(["intake", "crisis"]);
    expect(payload.residentStrengths).toEqual(["resilient"]);
  });

  it("transforms signers when there is no id (create flow)", () => {
    const payload = build({
      id: undefined,
      signers: [
        { value: "emp-test-001", label: "Test Clinician", type: "bhp" },
      ],
    });
    expect(payload.signers).toEqual([
      {
        signerId: "emp-test-001",
        name: "Test Clinician",
        signature: "",
        dateSigned: "",
        signedTime: "",
        type: "bhp",
      },
    ]);
  });

  it("passes signers through unchanged when an id is present (edit flow)", () => {
    const existing = [{ signerId: "emp-test-001", name: "Test Clinician" }];
    const payload = build({ id: "assessment-1", signers: existing });
    expect(payload.signers).toBe(existing);
  });

  it("throws when called with incomplete form state (every referenced field required)", () => {
    // WHY: body is `new Function(...keys, ...)`; a missing key becomes an
    // undeclared global -> ReferenceError. Documents the strict call contract.
    expect(() => utils.buildAssessmentPayload({})).toThrow();
  });
});
