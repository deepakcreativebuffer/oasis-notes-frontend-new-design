/** @format */

import { describe, it, expect } from "vitest";
import { mapMentalStatusExamFromApi } from "./mentalStatusExamMapper";

// Pure mapper: flattens a nested API mental-status-exam object into a flat
// form-state object. Test the transform thoroughly across edge cases.
describe("mapMentalStatusExamFromApi", () => {
  it("returns an object with undefined fields when called with no args", () => {
    const result = mapMentalStatusExamFromApi();
    expect(result).toBeTypeOf("object");
    // No nested data -> every value field is undefined
    expect(result.consistent).toBeUndefined();
    expect(result.averageHeight).toBeUndefined();
    expect(result.euthymic).toBeUndefined();
    // otherComment-derived boolean flags default to false (no comment present)
    expect(result.olderOtherBoolean).toBe(false);
    expect(result.heigthBoolean).toBe(false);
    expect(result.WeightBoolean).toBe(false);
  });

  it("treats an empty object like no args", () => {
    expect(mapMentalStatusExamFromApi({})).toEqual(
      mapMentalStatusExamFromApi(),
    );
  });

  it("maps apparentAge, height and weight groups", () => {
    const api = {
      apparentAge: { consistent: true, younger: false, older: true },
      height: { average: true, short: false, tall: true },
      weight: {
        average: false,
        obese: true,
        overweight: false,
        thin: false,
        emaciated: true,
      },
    };
    const result = mapMentalStatusExamFromApi(api);
    expect(result.consistent).toBe(true);
    expect(result.younger).toBe(false);
    expect(result.older).toBe(true);
    expect(result.averageHeight).toBe(true);
    expect(result.short).toBe(false);
    expect(result.tall).toBe(true);
    expect(result.averageWeight).toBe(false);
    expect(result.obese).toBe(true);
    expect(result.emaciated).toBe(true);
  });

  it("derives *Boolean flags as true and copies otherComment text when present", () => {
    const api = {
      apparentAge: { otherComment: "looks tired" },
      height: { otherComment: "very tall" },
      weight: { otherComment: "fluctuating" },
      attire: { otherComment: "torn" },
      grooming: { otherComment: "messy" },
    };
    const result = mapMentalStatusExamFromApi(api);
    // boolean flag is set whenever otherComment is truthy...
    expect(result.olderOtherBoolean).toBe(true);
    expect(result.heigthBoolean).toBe(true);
    expect(result.WeightBoolean).toBe(true);
    expect(result.attireBoolean).toBe(true);
    expect(result.GroomingBoolean).toBe(true);
    // ...and the raw text is carried through to the *Other field
    expect(result.olderOther).toBe("looks tired");
    expect(result.heigthOther).toBe("very tall");
    expect(result.WeightOther).toBe("fluctuating");
    expect(result.attireOther).toBe("torn");
    expect(result.GroomingOther).toBe("messy");
  });

  it("treats an empty-string otherComment as falsy for the boolean flag", () => {
    const api = { apparentAge: { otherComment: "" } };
    const result = mapMentalStatusExamFromApi(api);
    // empty string is falsy -> flag false, but raw value still copied
    expect(result.olderOtherBoolean).toBe(false);
    expect(result.olderOther).toBe("");
  });

  it("maps Mood and Affect groups including their otherComment fields", () => {
    const api = {
      Mood: {
        Euthymic: true,
        Irritable: false,
        Elevated: false,
        Depressed: true,
        Anxious: true,
        otherComment: "mixed",
      },
      Affect: {
        normalRange: true,
        Depressed: false,
        Labile: true,
        Constricted: false,
        otherComment: "flat",
      },
    };
    const result = mapMentalStatusExamFromApi(api);
    expect(result.euthymic).toBe(true);
    expect(result.depressedMood).toBe(true);
    expect(result.anxious).toBe(true);
    expect(result.euthymicOtherBoolean).toBe(true);
    expect(result.euthymicOtherBooleanType).toBe("mixed");
    expect(result.normalRange).toBe(true);
    expect(result.labile).toBe(true);
    expect(result.other).toBe(true);
    expect(result.otherText).toBe("flat");
  });

  it("maps speech-related groups (Articulation, Tone, Rate, Quantity, responseLatency)", () => {
    const api = {
      Articulation: { Normal: true, Slurred: true, otherComment: "lisp" },
      Tone: { Normal: false, Loud: true, otherComment: "booming" },
      Rate: { Normal: true, Fast: true },
      Quantity: { Normal: true, Mutism: false },
      responseLatency: { Normal: false, Delayed: true, otherComment: "slow" },
    };
    const result = mapMentalStatusExamFromApi(api);
    expect(result.normalArticulation).toBe(true);
    expect(result.slurred).toBe(true);
    expect(result.ArticulationOtherBoolean).toBe(true);
    expect(result.ArticulationOtherBooleanOther).toBe("lisp");
    expect(result.loud).toBe(true);
    expect(result.ToneOtherBoolean).toBe(true);
    expect(result.fast).toBe(true);
    expect(result.RateOtherBoolean).toBe(false);
    expect(result.normalQuantity).toBe(true);
    expect(result.delayed).toBe(true);
    expect(result.responseLatencyOtherBoolean).toBe(true);
    expect(result.responseLatencyOtherBooleanOther).toBe("slow");
  });

  it("maps thought, delusion and hallucination groups", () => {
    const api = {
      thoughtContent: { Unremarkable: true, Suspicious: false },
      thoughtProcesses: { logicalCoherent: true, Tangential: false },
      Delusions: { No: true, YesPersecutory: false, otherComment: "religious" },
      Hallucinations: {
        Unremarkable: false,
        AuditoryHallucinations: true,
        otherComment: "voices",
      },
    };
    const result = mapMentalStatusExamFromApi(api);
    expect(result.unremarkablethoughtContent).toBe(true);
    expect(result.logicalCoherent).toBe(true);
    expect(result.noDelusions).toBe(true);
    expect(result.yesOtherDelusionsBoolean).toBe(true);
    expect(result.yesOtherDelusionsText).toBe("religious");
    expect(result.auditoryHallucinations).toBe(true);
    expect(result.yesOtherHallucinationsBoolean).toBe(true);
    expect(result.yesOtherHallucinationsText).toBe("voices");
  });

  it("maps motor groups (Gait, Posture, PsychomotorActivity, Mannerisms)", () => {
    const api = {
      Gait: { Normal: true, Slow: true },
      Posture: { Normal: false, Slouched: true },
      PsychomotorActivity: { Withinnormallimits: true, Agitated: false },
      Mannerisms: { None: false, Tics: true, Tremors: true },
    };
    const result = mapMentalStatusExamFromApi(api);
    expect(result.normalGait).toBe(true);
    expect(result.slowGait).toBe(true);
    expect(result.slouched).toBe(true);
    expect(result.withinNormalLimits).toBe(true);
    expect(result.tics).toBe(true);
    expect(result.tremorsMannerisms).toBe(true);
  });

  it("maps orientation, judgment, insight, memory and concentration", () => {
    const api = {
      orientation: {
        person: true,
        place: true,
        time: false,
        circumstances: true,
      },
      Judgment: { Good: true, Fair: false },
      Insight: { Fair: true, Poor: false },
      Memory: { Good: false, Fair: true, Poor: false },
      AbilityToConcentration: { Intact: true, Other: "distracted" },
    };
    const result = mapMentalStatusExamFromApi(api);
    expect(result.person).toBe(true);
    expect(result.time).toBe(false);
    expect(result.goodJudgment).toBe(true);
    // WHY: source maps goodInsight from Judgment.Good (not Insight) — lock current behavior
    expect(result.goodInsight).toBe(true);
    expect(result.fairInsight).toBe(true);
    // WHY: poorJudgment is sourced from Insight.Poor in the mapper
    expect(result.poorJudgment).toBe(false);
    expect(result.poorInsight).toBe(false);
    expect(result.fairMemory).toBe(true);
    expect(result.intactAbilityToConcentration).toBe(true);
    expect(result.intactAbilityToConcentrationOtherBoolean).toBe(true);
    expect(result.otherAbilityToConcentration).toBe("distracted");
  });

  it("does not throw when only some groups are present (partial payload)", () => {
    const api = { Mood: { Euthymic: true } };
    expect(() => mapMentalStatusExamFromApi(api)).not.toThrow();
    const result = mapMentalStatusExamFromApi(api);
    expect(result.euthymic).toBe(true);
    // unrelated group untouched -> undefined
    expect(result.normalGait).toBeUndefined();
  });
});
