/** @format */

import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useViewTreatmentPlanFormContext } from "../../context/ViewTreatmentPlanFormContext";

export default function ViewTreatmentPlanRiskSection() {
  const f = useViewTreatmentPlanFormContext();
  return (
    <>
      <Form.Label
        className={`w-100 fw-bold mt-2 ${f.behavioralSymptoms?.length < 1 && !f.behavioralSymptomsOther && f.physicalSymptoms?.length < 1 && !f.physicalSymptomsOther && f.consnotiveSymptoms?.length < 1 && !f.consnotiveSymptomsOther && f.psychosocialSymptoms?.length < 1 && !f.psychosocialSymptomssOther && f.interventionsImplemented?.length < 1 && !f.interventionsImplementedOther && "hide-data-on-view-print"}`}
      >
        Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations
      </Form.Label>
      {(f.behavioralSymptoms?.length > 0 || f.behavioralSymptomsOther) && (
        <div
          className={`${f.behavioralSymptoms?.length < 1 && !f.behavioralSymptomsOther && "hide-data-on-view-print"}`}
        >
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label fw-bold mb-1">
                  Behavioral Symptoms :{" "}
                </p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="Self-injuring"
                    type="checkbox"
                    className="pe-none"
                    id="selfInjuring"
                    checked={f.behavioralSymptoms.includes("selfInjuring")}
                    onChange={() =>
                      f.handleCheckboxChangeBehavioral("selfInjuring")
                    }
                  />
                  <Form.Check
                    inline
                    label="Reckless behavior"
                    type="checkbox"
                    className="pe-none"
                    id="recklessBehavior"
                    checked={f.behavioralSymptoms.includes("recklessBehavior")}
                    onChange={() =>
                      f.handleCheckboxChangeBehavioral("recklessBehavior")
                    }
                  />
                  <Form.Check
                    inline
                    label="Impulsive behaviors"
                    type="checkbox"
                    className="pe-none"
                    id="impulsiveBehaviors"
                    checked={f.behavioralSymptoms.includes(
                      "impulsiveBehaviors",
                    )}
                    onChange={() =>
                      f.handleCheckboxChangeBehavioral("impulsiveBehaviors")
                    }
                  />
                  <Form.Check
                    inline
                    label="Social isolation"
                    type="checkbox"
                    className="pe-none"
                    id="socialIsolation"
                    checked={f.behavioralSymptoms.includes("socialIsolation")}
                    onChange={() =>
                      f.handleCheckboxChangeBehavioral("socialIsolation")
                    }
                  />
                  <Form.Check
                    inline
                    label="No longer enjoying previous activities"
                    type="checkbox"
                    className="pe-none"
                    id="nolongerenjoyingpreviousactivities"
                    checked={f.behavioralSymptoms.includes(
                      "nolongerenjoyingpreviousactivities",
                    )}
                    onChange={() =>
                      f.handleCheckboxChangeBehavioral(
                        "nolongerenjoyingpreviousactivities",
                      )
                    }
                  />{" "}
                  <Form.Check
                    inline
                    label="Talking, or writing"
                    type="checkbox"
                    className="pe-none"
                    id="talkingorwriting"
                    checked={f.behavioralSymptoms.includes("talkingorwriting")}
                    onChange={() =>
                      f.handleCheckboxChangeBehavioral("talkingorwriting")
                    }
                  />
                  <Form.Check
                    inline
                    label="About death"
                    type="checkbox"
                    className="pe-none"
                    id="aboutdeath"
                    checked={f.behavioralSymptoms.includes("aboutdeath")}
                    onChange={() =>
                      f.handleCheckboxChangeBehavioral("aboutdeath")
                    }
                  />
                  <Form.Check
                    inline
                    label="None reported"
                    type="checkbox"
                    className="pe-none"
                    id="Nonereported"
                    checked={f.behavioralSymptoms.includes("Nonereported")}
                    onChange={() =>
                      f.handleCheckboxChangeBehavioral("Nonereported")
                    }
                  />
                  <Form.Check
                    inline
                    label="Other"
                    className="pe-none"
                    type="checkbox"
                    checked={f.behavioralSymptoms.includes("Other")}
                    onChange={() => f.handleCheckboxChangeBehavioral("Other")}
                  />
                  {f.behavioralSymptomsBoolean && (
                    <span className="view-value">
                      {f.behavioralSymptomsOther}
                    </span>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {(f.physicalSymptoms?.length > 0 || f.physicalSymptomsOther) && (
        <div
          className={`${f.physicalSymptoms?.length < 1 && !f.physicalSymptomsOther && "hide-data-on-view-print"}`}
        >
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label fw-bold mb-1">Physical Symptoms : </p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="Insomnia"
                    className="pe-none"
                    type="checkbox"
                    id="insomnia"
                    checked={f.physicalSymptoms.includes("insomnia")}
                    onChange={() => f.handleCheckboxChangePhysical("insomnia")}
                  />
                  <Form.Check
                    inline
                    label="Hypersomnia"
                    className="pe-none"
                    type="checkbox"
                    id="hypersomnia"
                    checked={f.physicalSymptoms.includes("hypersomnia")}
                    onChange={() =>
                      f.handleCheckboxChangePhysical("hypersomnia")
                    }
                  />
                  <Form.Check
                    inline
                    label="Changes in appetite"
                    className="pe-none"
                    type="checkbox"
                    id="changesInAppetite"
                    checked={f.physicalSymptoms.includes("changesInAppetite")}
                    onChange={() =>
                      f.handleCheckboxChangePhysical("changesInAppetite")
                    }
                  />
                  <Form.Check
                    inline
                    label="Weight gain/loss"
                    className="pe-none"
                    type="checkbox"
                    id="weightGainLoss"
                    checked={f.physicalSymptoms.includes("weightGainLoss")}
                    onChange={() =>
                      f.handleCheckboxChangePhysical("weightGainLoss")
                    }
                  />
                  <Form.Check
                    inline
                    label="Panic attacks"
                    className="pe-none"
                    type="checkbox"
                    id="panicAttacks"
                    checked={f.physicalSymptoms.includes("panicAttacks")}
                    onChange={() =>
                      f.handleCheckboxChangePhysical("panicAttacks")
                    }
                  />
                  <Form.Check
                    inline
                    label="None reported"
                    className="pe-none"
                    type="checkbox"
                    id="Nonereported"
                    checked={f.physicalSymptoms.includes("Nonereported")}
                    onChange={() =>
                      f.handleCheckboxChangePhysical("Nonereported")
                    }
                  />
                  <Form.Check
                    inline
                    label="Other"
                    className="pe-none"
                    type="checkbox"
                    checked={f.physicalSymptoms.includes("Other")}
                    onChange={() => f.handleCheckboxChangePhysical("Other")}
                  />
                  {f.physicalSymptomsBoolean && (
                    <span className="view-value">
                      {f.physicalSymptomsOther}
                    </span>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {(f.consnotiveSymptoms?.length > 0 || f.consnotiveSymptomsOther) && (
        <div
          className={`${f.consnotiveSymptoms?.length < 1 && !f.consnotiveSymptomsOther && "hide-data-on-view-print"}`}
        >
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label fw-bold mb-1">Cognitive Symptoms : </p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="Lacking the ability to concentrate"
                    className="pe-none"
                    type="checkbox"
                    id="concentration"
                    checked={f.consnotiveSymptoms.includes("concentration")}
                    onChange={() =>
                      f.handleCheckboxChangeCognitive("concentration")
                    }
                  />
                  <Form.Check
                    inline
                    label="Memory impairment, ruminating"
                    className="pe-none"
                    type="checkbox"
                    id="memoryImpairment"
                    checked={f.consnotiveSymptoms.includes("memoryImpairment")}
                    onChange={() =>
                      f.handleCheckboxChangeCognitive("memoryImpairment")
                    }
                  />
                  <Form.Check
                    inline
                    label="Pervasive thoughts about death and dying"
                    type="checkbox"
                    className="pe-none"
                    id="thoughtsAboutDeath"
                    checked={f.consnotiveSymptoms.includes(
                      "pervasivethoughtsaboutdeathanddying",
                    )}
                    onChange={() =>
                      f.handleCheckboxChangeCognitive(
                        "pervasivethoughtsaboutdeathanddying",
                      )
                    }
                  />
                  <Form.Check
                    inline
                    label="Inability to focus on specific tasks"
                    className="pe-none"
                    type="checkbox"
                    id="inabilityToFocus"
                    checked={f.consnotiveSymptoms.includes(
                      "inabilitytofocusonspecifictasks",
                    )}
                    onChange={() =>
                      f.handleCheckboxChangeCognitive(
                        "inabilitytofocusonspecifictasks",
                      )
                    }
                  />
                  <Form.Check
                    inline
                    label="Specific tasks"
                    className="pe-none"
                    type="checkbox"
                    id="specifictasks"
                    checked={f.consnotiveSymptoms.includes("specifictasks")}
                    onChange={() =>
                      f.handleCheckboxChangeCognitive("specifictasks")
                    }
                  />
                  <Form.Check
                    inline
                    label="None reported"
                    className="pe-none"
                    type="checkbox"
                    id="Nonereported"
                    checked={f.consnotiveSymptoms.includes("Nonereported")}
                    onChange={() =>
                      f.handleCheckboxChangeCognitive("Nonereported")
                    }
                  />
                  <Form.Check
                    inline
                    label="Other"
                    className="pe-none"
                    type="checkbox"
                    checked={f.consnotiveSymptoms.includes("Other")}
                    onChange={() => f.handleCheckboxChangeCognitive("Other")}
                  />
                  {f.consnotiveSymptomsBoolean && (
                    <span className="view-value">
                      {f.consnotiveSymptomsOther}
                    </span>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {(f.psychosocialSymptoms?.length > 0 || f.psychosocialSymptomssOther) && (
        <div
          className={`${f.psychosocialSymptoms?.length < 1 && !f.psychosocialSymptomssOther && "hide-data-on-view-print"}`}
        >
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label fw-bold mb-1">
                  Psychosocial Symptoms :{" "}
                </p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="Feeling of helplessness"
                    className="pe-none"
                    type="checkbox"
                    id="helplessness"
                    checked={f.psychosocialSymptoms.includes("helplessness")}
                    onChange={() =>
                      f.handleCheckboxChangePsychosocial("helplessness")
                    }
                  />
                  <Form.Check
                    inline
                    label="Worthlessness"
                    className="pe-none"
                    type="checkbox"
                    id="worthlessness"
                    checked={f.psychosocialSymptoms.includes("worthlessness")}
                    onChange={() =>
                      f.handleCheckboxChangePsychosocial("worthlessness")
                    }
                  />
                  <Form.Check
                    inline
                    label="Depression"
                    className="pe-none"
                    type="checkbox"
                    id="depression"
                    checked={f.psychosocialSymptoms.includes("depression")}
                    onChange={() =>
                      f.handleCheckboxChangePsychosocial("depression")
                    }
                  />
                  <Form.Check
                    inline
                    label="Anxiety"
                    className="pe-none"
                    type="checkbox"
                    id="anxiety"
                    checked={f.psychosocialSymptoms.includes("anxiety")}
                    onChange={() =>
                      f.handleCheckboxChangePsychosocial("anxiety")
                    }
                  />
                  <Form.Check
                    inline
                    label="Mood Swings"
                    className="pe-none"
                    type="checkbox"
                    id="moodSwings"
                    checked={f.psychosocialSymptoms.includes("moodSwings")}
                    onChange={() =>
                      f.handleCheckboxChangePsychosocial("moodSwings")
                    }
                  />
                  <Form.Check
                    inline
                    label="Irritability"
                    className="pe-none"
                    type="checkbox"
                    id="irritability"
                    checked={f.psychosocialSymptoms.includes("irritability")}
                    onChange={() =>
                      f.handleCheckboxChangePsychosocial("irritability")
                    }
                  />
                  <Form.Check
                    inline
                    label="None reported"
                    className="pe-none"
                    type="checkbox"
                    id="Nonereported"
                    checked={f.psychosocialSymptoms.includes("Nonereported")}
                    onChange={() =>
                      f.handleCheckboxChangePsychosocial("Nonereported")
                    }
                  />
                  <Form.Check
                    inline
                    label="Other"
                    className="pe-none"
                    type="checkbox"
                    id="OtherpsychosocialSymptoms"
                    checked={f.psychosocialSymptoms.includes("Other")}
                    onChange={() => f.handleCheckboxChangePsychosocial("Other")}
                  />
                  {f.psychosocialSymptomsBoolean && (
                    <span className="view-value">
                      {f.psychosocialSymptomssOther}
                    </span>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {/* {(f.interventionsImplemented?.length > 0 ||
              f.interventionsImplementedOther) && (
              <div
                className={`${
                  f.interventionsImplemented?.length < 1 &&
                  !f.interventionsImplementedOther &&
                  "hide-data-on-view-print"
                }`}
              >
                <Row>
                  <Col xs={12} md={12} lg={12}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label fw-bold mb-1">
                        Interventions that are being implemented :{" "}
                      </p>
                      <div className="view-value">
                        <ul className="ps-3 mt-2 mb-0 tw-column">
                          {f.interventionsImplemented?.map((i, index) => (
                            <li className="mb-2 list-disc" key={index}>
                              {i.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                        <p className="view-label fw-bold mb-1">Other :</p>
                      <p className="view-value">
                        {f.interventionsImplementedOther}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
             )} */}
    </>
  );
}
