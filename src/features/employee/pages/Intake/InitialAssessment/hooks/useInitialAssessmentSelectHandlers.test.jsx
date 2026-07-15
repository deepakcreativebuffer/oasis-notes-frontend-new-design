/** @format */

import { renderHook, act } from "@testing-library/react";

import {
  usePatientInformationSelectHandlers,
  useMedicalConditionsSelectHandlers,
  useFamilyMentalHealthSelectHandlers,
  useDiagnosisSelectHandlers,
  useRiskFactorsSelectHandlers,
} from "./useInitialAssessmentSelectHandlers";
import {
  ADMISSION_STATUS_OPTIONS,
  REASON_FOR_ADMISSION_OPTIONS,
  THYROID_DISORDER_OPTIONS,
  INFECTION_DISEASES_OPTIONS,
  FAMILY_MENTAL_HEALTH_RELATION_OPTIONS,
  MENTAL_HEALTH_TREATMENT_TYPE_OF_SERVICE_OPTIONS,
  MENTAL_HEALTH_TREATMENT_DIAGNOSIS_REASON_OPTIONS,
  LEGAL_SYSTEM_INTERACTION_OPTIONS,
  MEDICAL_EQUIPMENT_OPTIONS,
  SPECIAL_PRECAUTIONS_OPTIONS,
  RISK_FACTORS_BEHAVIOR_OPTIONS,
  RISK_FACTORS_SYMPTOMS_OPTIONS,
} from "../config/initialAssessmentSelectOptions";

// These hooks are pure (only useMemo over config + util closures), so no redux
// or router providers are required — renderHook with default wrapper is enough.

/** Synthesize the keyboard event shape the creatable Enter handlers read. */
function enterEvent(value) {
  return { key: "Enter", target: { value } };
}

describe("useInitialAssessmentSelectHandlers", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("usePatientInformationSelectHandlers", () => {
    it("exposes the admission + reason-for-admission option lists", () => {
      const { result } = renderHook(() =>
        usePatientInformationSelectHandlers({
          admissionStatus: [],
          setAdmissionStatus: vi.fn(),
          reasonForAdmission: [],
          setReasonForAdmission: vi.fn(),
        }),
      );

      // WHY: the picker UI binds these arrays straight from config; identity must pass through.
      expect(result.current.option_value_Admission).toBe(
        ADMISSION_STATUS_OPTIONS,
      );
      expect(result.current.option_value_ReasonForAdmission).toBe(
        REASON_FOR_ADMISSION_OPTIONS,
      );
    });

    it("Enter appends a NEW custom admission value to the existing array", () => {
      const setAdmissionStatus = vi.fn();
      const { result } = renderHook(() =>
        usePatientInformationSelectHandlers({
          admissionStatus: [{ value: "Voluntary", label: "Voluntary" }],
          setAdmissionStatus,
          reasonForAdmission: [],
          setReasonForAdmission: vi.fn(),
        }),
      );

      act(() => {
        result.current.handleKeyDownAdmissionStatus(enterEvent("Self Admit"));
      });

      // WHY: creatable multi-select must keep prior selections and add the typed one.
      expect(setAdmissionStatus).toHaveBeenCalledWith([
        { value: "Voluntary", label: "Voluntary" },
        { value: "Self Admit", label: "Self Admit" },
      ]);
    });

    it("Enter does NOT add a value that already exists in the static options", () => {
      const setAdmissionStatus = vi.fn();
      const { result } = renderHook(() =>
        usePatientInformationSelectHandlers({
          admissionStatus: [],
          setAdmissionStatus,
          reasonForAdmission: [],
          setReasonForAdmission: vi.fn(),
        }),
      );

      act(() => {
        result.current.handleKeyDownAdmissionStatus(enterEvent("Voluntary"));
      });

      // WHY: predefined options should be chosen via the menu, not duplicated as custom entries.
      expect(setAdmissionStatus).not.toHaveBeenCalled();
    });

    it("change handler forwards the selected options array verbatim", () => {
      const setAdmissionStatus = vi.fn();
      const { result } = renderHook(() =>
        usePatientInformationSelectHandlers({
          admissionStatus: [],
          setAdmissionStatus,
          reasonForAdmission: [],
          setReasonForAdmission: vi.fn(),
        }),
      );

      const selection = [{ value: "Voluntary", label: "Voluntary" }];
      act(() => result.current.handleSelectChangeAdmission(selection));

      expect(setAdmissionStatus).toHaveBeenCalledWith(selection);
    });

    it("reason-for-admission change handler forwards the single selection verbatim", () => {
      const setReasonForAdmission = vi.fn();
      const { result } = renderHook(() =>
        usePatientInformationSelectHandlers({
          admissionStatus: [],
          setAdmissionStatus: vi.fn(),
          reasonForAdmission: [],
          setReasonForAdmission,
        }),
      );

      const selection = [{ value: "Anxiety", label: "Anxiety" }];
      act(() =>
        result.current.handleSelectChangeAdmissionReasonForAdmission(selection),
      );

      expect(setReasonForAdmission).toHaveBeenCalledWith(selection);
    });

    it("memoizes the returned object until a dependency changes", () => {
      const props = {
        admissionStatus: [],
        setAdmissionStatus: vi.fn(),
        reasonForAdmission: [],
        setReasonForAdmission: vi.fn(),
      };
      const { result, rerender } = renderHook(
        (p) => usePatientInformationSelectHandlers(p),
        { initialProps: props },
      );

      const first = result.current;
      rerender(props);
      // WHY: stable identity prevents re-rendering every creatable select on unrelated state changes.
      expect(result.current).toBe(first);

      rerender({ ...props, admissionStatus: [{ value: "x", label: "x" }] });
      expect(result.current).not.toBe(first);
    });
  });

  describe("useMedicalConditionsSelectHandlers", () => {
    it("exposes thyroid + infection option lists", () => {
      const { result } = renderHook(() =>
        useMedicalConditionsSelectHandlers({
          thyroidDisorder: [],
          setThyroidDisorder: vi.fn(),
          infectionDiseases: [],
          setInfectionDiseases: vi.fn(),
        }),
      );

      expect(result.current.thyroidOptions).toBe(THYROID_DISORDER_OPTIONS);
      expect(result.current.infectionDiseasesOptions).toBe(
        INFECTION_DISEASES_OPTIONS,
      );
    });

    it("Enter appends a custom infection disease to the current value array", () => {
      const setInfectionDiseases = vi.fn();
      const { result } = renderHook(() =>
        useMedicalConditionsSelectHandlers({
          thyroidDisorder: [],
          setThyroidDisorder: vi.fn(),
          infectionDiseases: [],
          setInfectionDiseases,
        }),
      );

      act(() =>
        result.current.handleKeyInfectionDiseases(enterEvent("Norovirus")),
      );

      // WHY: undefined/empty value coalesces to [] so the first custom entry still saves.
      expect(setInfectionDiseases).toHaveBeenCalledWith([
        { value: "Norovirus", label: "Norovirus" },
      ]);
    });

    it("change handlers forward selections to the right setters", () => {
      const setThyroidDisorder = vi.fn();
      const setInfectionDiseases = vi.fn();
      const { result } = renderHook(() =>
        useMedicalConditionsSelectHandlers({
          thyroidDisorder: [],
          setThyroidDisorder,
          infectionDiseases: [],
          setInfectionDiseases,
        }),
      );

      const thyroid = [{ value: "Hypothyroidism", label: "Hypothyroidism" }];
      const infection = [{ value: "MRSA", label: "MRSA" }];
      act(() => result.current.thyroiddisorderhnadler(thyroid));
      act(() => result.current.infectionDiseasesHandler(infection));

      expect(setThyroidDisorder).toHaveBeenCalledWith(thyroid);
      expect(setInfectionDiseases).toHaveBeenCalledWith(infection);
    });
  });

  describe("useFamilyMentalHealthSelectHandlers", () => {
    it("exposes all three mental-health option lists", () => {
      const { result } = renderHook(() =>
        useFamilyMentalHealthSelectHandlers({
          SignificantFamilyMedicalPsychiatricHistory: [],
          setSignificantFamilyMedicalPsychiatricHistory: vi.fn(),
          mentalHealthTreatmentHistoryTypeOfService: [],
          setMentalHealthTreatmentHistoryTypeOfService: vi.fn(),
          mentalHealthTreatmentHistoryDiagnosisReason: [],
          setMentalHealthTreatmentHistoryDiagnosisReason: vi.fn(),
        }),
      );

      expect(
        result.current.SignificantFamilyMedicalPsychiatricHistoryOptions,
      ).toBe(FAMILY_MENTAL_HEALTH_RELATION_OPTIONS);
      expect(
        result.current.mentalHealthTreatmentHistoryTypeOfServiceOption,
      ).toBe(MENTAL_HEALTH_TREATMENT_TYPE_OF_SERVICE_OPTIONS);
      expect(
        result.current.mentalHealthTreatmentHistoryDiagnosisReasonOption,
      ).toBe(MENTAL_HEALTH_TREATMENT_DIAGNOSIS_REASON_OPTIONS);
    });

    it("Enter appends a custom family relation onto the prior selections", () => {
      const setSignificantFamilyMedicalPsychiatricHistory = vi.fn();
      const { result } = renderHook(() =>
        useFamilyMentalHealthSelectHandlers({
          SignificantFamilyMedicalPsychiatricHistory: [
            { value: "Mother", label: "Mother" },
          ],
          setSignificantFamilyMedicalPsychiatricHistory,
          mentalHealthTreatmentHistoryTypeOfService: [],
          setMentalHealthTreatmentHistoryTypeOfService: vi.fn(),
          mentalHealthTreatmentHistoryDiagnosisReason: [],
          setMentalHealthTreatmentHistoryDiagnosisReason: vi.fn(),
        }),
      );

      act(() =>
        result.current.handleKeySignificantFamilyMedicalPsychiatricHistory(
          enterEvent("Step-parent"),
        ),
      );

      expect(
        setSignificantFamilyMedicalPsychiatricHistory,
      ).toHaveBeenCalledWith([
        { value: "Mother", label: "Mother" },
        { value: "Step-parent", label: "Step-parent" },
      ]);
    });

    it("each change handler routes to its dedicated setter", () => {
      const setType = vi.fn();
      const setReason = vi.fn();
      const { result } = renderHook(() =>
        useFamilyMentalHealthSelectHandlers({
          SignificantFamilyMedicalPsychiatricHistory: [],
          setSignificantFamilyMedicalPsychiatricHistory: vi.fn(),
          mentalHealthTreatmentHistoryTypeOfService: [],
          setMentalHealthTreatmentHistoryTypeOfService: setType,
          mentalHealthTreatmentHistoryDiagnosisReason: [],
          setMentalHealthTreatmentHistoryDiagnosisReason: setReason,
        }),
      );

      const typeSel = [{ value: "IOP", label: "IOP" }];
      const reasonSel = [{ value: "Detox", label: "Detox" }];
      act(() =>
        result.current.mentalHealthTreatmentHistoryTypeOfServiceHandler(
          typeSel,
        ),
      );
      act(() =>
        result.current.mentalHealthTreatmentHistoryDiagnosisReasonHandler(
          reasonSel,
        ),
      );

      expect(setType).toHaveBeenCalledWith(typeSel);
      expect(setReason).toHaveBeenCalledWith(reasonSel);
    });
  });

  describe("useDiagnosisSelectHandlers", () => {
    it("exposes legal / medical-equipment / special-precautions option lists", () => {
      const { result } = renderHook(() =>
        useDiagnosisSelectHandlers({
          selectedValue: [],
          setSelectedValue: vi.fn(),
          selectedValueMedical: [],
          setSelectedValueMedical: vi.fn(),
          selectedValueSpecialPrecautions: [],
          setSelectedValueSpecialPrecautions: vi.fn(),
        }),
      );

      expect(result.current.selectedValueOption).toBe(
        LEGAL_SYSTEM_INTERACTION_OPTIONS,
      );
      expect(result.current.selectedValueMedicalOption).toBe(
        MEDICAL_EQUIPMENT_OPTIONS,
      );
      expect(result.current.selectedValueSpecialPrecautionsOption).toBe(
        SPECIAL_PRECAUTIONS_OPTIONS,
      );
    });

    it("Enter on a known special-precaution option is ignored (no custom create)", () => {
      const setSelectedValueSpecialPrecautions = vi.fn();
      const { result } = renderHook(() =>
        useDiagnosisSelectHandlers({
          selectedValue: [],
          setSelectedValue: vi.fn(),
          selectedValueMedical: [],
          setSelectedValueMedical: vi.fn(),
          selectedValueSpecialPrecautions: [],
          setSelectedValueSpecialPrecautions,
        }),
      );

      act(() =>
        result.current.handleKeySelectedValueSpecialPrecautions(
          enterEvent("Withdrawal"),
        ),
      );

      expect(setSelectedValueSpecialPrecautions).not.toHaveBeenCalled();
    });

    it("medical-equipment change handler forwards the selection", () => {
      const setSelectedValueMedical = vi.fn();
      const { result } = renderHook(() =>
        useDiagnosisSelectHandlers({
          selectedValue: [],
          setSelectedValue: vi.fn(),
          selectedValueMedical: [],
          setSelectedValueMedical,
          selectedValueSpecialPrecautions: [],
          setSelectedValueSpecialPrecautions: vi.fn(),
        }),
      );

      const sel = [{ value: "Walker", label: "Walker" }];
      act(() => result.current.selectedValueMedicalHandler(sel));
      expect(setSelectedValueMedical).toHaveBeenCalledWith(sel);
    });
  });

  describe("useRiskFactorsSelectHandlers", () => {
    /** Build a riskFactors object matching the fixed-row API the hook reads. */
    function makeRiskFactors(updateFixedRow, rows = {}) {
      const fixedRows = [];
      fixedRows[6] = { comments: rows[6] };
      fixedRows[7] = { comments: rows[7] };
      return { fixedRows, updateFixedRow };
    }

    it("exposes the behavior + symptom option lists", () => {
      const { result } = renderHook(() =>
        useRiskFactorsSelectHandlers({
          riskFactors: makeRiskFactors(vi.fn()),
        }),
      );

      expect(result.current.selectedValueRiskFactorsOption1).toBe(
        RISK_FACTORS_BEHAVIOR_OPTIONS,
      );
      expect(result.current.selectedValueRiskFactorsOption2).toBe(
        RISK_FACTORS_SYMPTOMS_OPTIONS,
      );
    });

    it("Enter on behavior writes a new custom comment into fixed row 6", () => {
      const updateFixedRow = vi.fn();
      const { result } = renderHook(() =>
        useRiskFactorsSelectHandlers({
          riskFactors: makeRiskFactors(updateFixedRow, {
            6: [{ value: "anger", label: "anger" }],
          }),
        }),
      );

      act(() =>
        result.current.handleKeySelectedValueRiskFactorsBehavior(
          enterEvent("pacing"),
        ),
      );

      // WHY: behavior creatable maps to fixedRows index 6's comments column.
      expect(updateFixedRow).toHaveBeenCalledWith(6, "comments", [
        { value: "anger", label: "anger" },
        { value: "pacing", label: "pacing" },
      ]);
    });

    it("Enter on symptoms writes a new custom comment into fixed row 7", () => {
      const updateFixedRow = vi.fn();
      const { result } = renderHook(() =>
        useRiskFactorsSelectHandlers({
          riskFactors: makeRiskFactors(updateFixedRow),
        }),
      );

      act(() =>
        result.current.handleKeySelectedValueRiskFactorsSymptoms(
          enterEvent("Command Hallucination"),
        ),
      );

      // WHY: symptoms creatable maps to fixedRows index 7; undefined comments coalesces to [].
      expect(updateFixedRow).toHaveBeenCalledWith(7, "comments", [
        { value: "Command Hallucination", label: "Command Hallucination" },
      ]);
    });

    it("ignores non-Enter keys", () => {
      const updateFixedRow = vi.fn();
      const { result } = renderHook(() =>
        useRiskFactorsSelectHandlers({
          riskFactors: makeRiskFactors(updateFixedRow),
        }),
      );

      act(() =>
        result.current.handleKeySelectedValueRiskFactorsBehavior({
          key: "a",
          target: { value: "typing" },
        }),
      );

      expect(updateFixedRow).not.toHaveBeenCalled();
    });
  });
});
