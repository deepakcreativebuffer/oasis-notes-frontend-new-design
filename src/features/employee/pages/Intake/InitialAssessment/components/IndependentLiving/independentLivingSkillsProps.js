/** @format */

export function buildIndependentLivingSkillsProps(
  independentLiving,
  { canDelete },
) {
  return {
    fixedRows: independentLiving.fixedRows,
    extraRows: independentLiving.extraRows,
    otherDraft: independentLiving.otherDraft,
    showTakingMedications: independentLiving.showTakingMedications,
    updateFixedRow: independentLiving.updateFixedRow,
    updateOtherDraft: independentLiving.updateOtherDraft,
    appendOtherDraft: independentLiving.appendOtherDraft,
    removeExtraRow: independentLiving.removeExtraRow,
    canDelete,
  };
}
