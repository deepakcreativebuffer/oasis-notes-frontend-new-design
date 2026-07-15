/** @format */

export function mapActiveWithdrawalFromApi(api = {}) {
  return {
    noneReportedOrObserved: api.noneReportedOrObserved,
    Agitation: api.Agitation,
    Nausea: api.Nausea,
    Vomiting: api.Vomiting,
    Headache: api.Headache,
    TactileDisturbances: api.TactileDisturbances,
    Anxiety: api.Anxiety,
    Tremors: api.Tremors,
    VisualDisturbances: api.VisualDisturbances,
    VisualDisturbancesOtherBoolean: api.AuditoryDisturbances ? true : false,
    VisualDisturbancesOtherType: api.AuditoryDisturbances,
    Sweats: api.Sweats,
    Paranoia: api.Paranoia,
    GooseBumps: api.GooseBumps,
    Runningnose: api.Runningnose,
    BonePain: api.BonePain,
    Tearing: api.Tearing,
    Seizures: api.Seizures,
    LossofMuscleCoordination: api.LossofMuscleCoordination,
    LossofMuscleCoordinationOtherBoolean: api.LossofMuscleCoordinationOtherType
      ? true
      : false,
    LossofMuscleCoordinationOtherType: api.LossofMuscleCoordinationOtherType,
  };
}
