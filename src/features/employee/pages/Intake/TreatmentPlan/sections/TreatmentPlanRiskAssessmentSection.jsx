/* eslint-disable no-unused-vars */
/** @format */

import React from "react";
import {
  Form,
  Row,
  Col,
  Card,
  Table,
  Container,
  Button,
} from "react-bootstrap";
import { useTreatmentPlanFormContext } from "../context/TreatmentPlanFormContext";
import { BorderlessInput } from "@/utils/Makers";

export default function TreatmentPlanRiskAssessmentSection() {
  const f = useTreatmentPlanFormContext();
  return (
    <>
      <Form.Label className="fw-bold">
        Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations
      </Form.Label>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">Behavioral Symptoms</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Self-injuring"
                  type="checkbox"
                  id="selfInjuring"
                  checked={f.behavioralSymptoms?.includes("selfInjuring")}
                  onChange={() =>
                    f.handleCheckboxChangeBehavioral("selfInjuring")
                  }
                />
                <Form.Check
                  inline
                  label="Reckless behavior"
                  type="checkbox"
                  id="recklessBehavior"
                  checked={f.behavioralSymptoms?.includes("recklessBehavior")}
                  onChange={() =>
                    f.handleCheckboxChangeBehavioral("recklessBehavior")
                  }
                />
                <Form.Check
                  inline
                  label="Impulsive behaviors"
                  type="checkbox"
                  id="impulsiveBehaviors"
                  checked={f.behavioralSymptoms?.includes("impulsiveBehaviors")}
                  onChange={() =>
                    f.handleCheckboxChangeBehavioral("impulsiveBehaviors")
                  }
                />
                <Form.Check
                  inline
                  label="Social isolation"
                  type="checkbox"
                  id="socialIsolation"
                  checked={f.behavioralSymptoms?.includes("socialIsolation")}
                  onChange={() =>
                    f.handleCheckboxChangeBehavioral("socialIsolation")
                  }
                />
                <Form.Check
                  inline
                  label="No longer enjoying previous activities"
                  type="checkbox"
                  id="nolongerenjoyingpreviousactivities"
                  checked={f.behavioralSymptoms?.includes(
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
                  id="talkingorwriting"
                  checked={f.behavioralSymptoms?.includes("talkingorwriting")}
                  onChange={() =>
                    f.handleCheckboxChangeBehavioral("talkingorwriting")
                  }
                />
                <Form.Check
                  inline
                  label="About death"
                  type="checkbox"
                  id="aboutdeath"
                  checked={f.behavioralSymptoms?.includes("aboutdeath")}
                  onChange={() =>
                    f.handleCheckboxChangeBehavioral("aboutdeath")
                  }
                />
                <Form.Check
                  inline
                  label="None reported"
                  type="checkbox"
                  id="Nonereported"
                  checked={f.behavioralSymptoms?.includes("Nonereported")}
                  onChange={() =>
                    f.handleCheckboxChangeBehavioral("Nonereported")
                  }
                />
                <Form.Check
                  inline
                  label="Other"
                  type="checkbox"
                  checked={f.behavioralSymptoms?.includes("Other")}
                  onChange={() => f.handleCheckboxChangeBehavioral("Other")}
                  id="f.behavioralSymptomsOther"
                />
                {f.behavioralSymptomsBoolean && (
                  <BorderlessInput
                    value={f.behavioralSymptomsOther}
                    setState={f.setBehavioralSymptomsOther}
                    placeholder=" "
                  />
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">Physical Symptoms</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Insomnia"
                  type="checkbox"
                  id="insomnia"
                  checked={f.physicalSymptoms?.includes("insomnia")}
                  onChange={() => f.handleCheckboxChangePhysical("insomnia")}
                />
                <Form.Check
                  inline
                  label="Hypersomnia"
                  type="checkbox"
                  id="hypersomnia"
                  checked={f.physicalSymptoms?.includes("hypersomnia")}
                  onChange={() => f.handleCheckboxChangePhysical("hypersomnia")}
                />
                <Form.Check
                  inline
                  label="Changes in appetite"
                  type="checkbox"
                  id="changesInAppetite"
                  checked={f.physicalSymptoms?.includes("changesInAppetite")}
                  onChange={() =>
                    f.handleCheckboxChangePhysical("changesInAppetite")
                  }
                />
                <Form.Check
                  inline
                  label="Weight gain/loss"
                  type="checkbox"
                  id="weightGainLoss"
                  checked={f.physicalSymptoms?.includes("weightGainLoss")}
                  onChange={() =>
                    f.handleCheckboxChangePhysical("weightGainLoss")
                  }
                />
                <Form.Check
                  inline
                  label="Panic attacks"
                  type="checkbox"
                  id="panicAttacks"
                  checked={f.physicalSymptoms?.includes("panicAttacks")}
                  onChange={() =>
                    f.handleCheckboxChangePhysical("panicAttacks")
                  }
                />
                <Form.Check
                  inline
                  label="None reported"
                  type="checkbox"
                  id="physicalSymptomsNonereported"
                  checked={f.physicalSymptoms?.includes("Nonereported")}
                  onChange={() =>
                    f.handleCheckboxChangePhysical("Nonereported")
                  }
                />
                <Form.Check
                  inline
                  label="Other"
                  type="checkbox"
                  checked={f.physicalSymptoms?.includes("Other")}
                  onChange={() => f.handleCheckboxChangePhysical("Other")}
                  id="f.physicalSymptomsOther"
                />
                {f.physicalSymptomsBoolean && (
                  <BorderlessInput
                    value={f.physicalSymptomsOther}
                    setState={f.setPhysicalSymptomsOther}
                    placeholder=" "
                  />
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">Cognitive Symptoms</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Lacking the ability to concentrate"
                  type="checkbox"
                  id="concentration"
                  checked={f.consnotiveSymptoms?.includes("concentration")}
                  onChange={() =>
                    f.handleCheckboxChangeCognitive("concentration")
                  }
                />
                <Form.Check
                  inline
                  label="Memory impairment, ruminating"
                  type="checkbox"
                  id="memoryImpairment"
                  checked={f.consnotiveSymptoms?.includes("memoryImpairment")}
                  onChange={() =>
                    f.handleCheckboxChangeCognitive("memoryImpairment")
                  }
                />
                <Form.Check
                  inline
                  label="Pervasive thoughts about death and dying"
                  type="checkbox"
                  id="thoughtsAboutDeath"
                  checked={f.consnotiveSymptoms?.includes(
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
                  type="checkbox"
                  id="inabilityToFocus"
                  checked={f.consnotiveSymptoms?.includes(
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
                  type="checkbox"
                  id="specifictasks"
                  checked={f.consnotiveSymptoms?.includes("specifictasks")}
                  onChange={() =>
                    f.handleCheckboxChangeCognitive("specifictasks")
                  }
                />
                <Form.Check
                  inline
                  label="None reported"
                  type="checkbox"
                  id="cognitiveSymptomsNonereported"
                  checked={f.consnotiveSymptoms?.includes("Nonereported")}
                  onChange={() =>
                    f.handleCheckboxChangeCognitive("Nonereported")
                  }
                />
                <Form.Check
                  inline
                  label="Other"
                  type="checkbox"
                  checked={f.consnotiveSymptoms?.includes("Other")}
                  onChange={() => f.handleCheckboxChangeCognitive("Other")}
                  id="cognitiveSymptomsOther"
                />
                {f.consnotiveSymptomsBoolean && (
                  <BorderlessInput
                    value={f.consnotiveSymptomsOther}
                    setState={f.setConsnotiveSymptomsOther}
                    placeholder=" "
                  />
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">
                Psychosocial Symptoms:{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Feeling of helplessness"
                  type="checkbox"
                  id="helplessness"
                  checked={f.psychosocialSymptoms?.includes("helplessness")}
                  onChange={() =>
                    f.handleCheckboxChangePsychosocial("helplessness")
                  }
                />
                <Form.Check
                  inline
                  label="Worthlessness"
                  type="checkbox"
                  id="worthlessness"
                  checked={f.psychosocialSymptoms?.includes("worthlessness")}
                  onChange={() =>
                    f.handleCheckboxChangePsychosocial("worthlessness")
                  }
                />
                <Form.Check
                  inline
                  label="Depression"
                  type="checkbox"
                  id="depression"
                  checked={f.psychosocialSymptoms?.includes("depression")}
                  onChange={() =>
                    f.handleCheckboxChangePsychosocial("depression")
                  }
                />
                <Form.Check
                  inline
                  label="Anxiety"
                  type="checkbox"
                  id="anxiety"
                  checked={f.psychosocialSymptoms?.includes("anxiety")}
                  onChange={() => f.handleCheckboxChangePsychosocial("anxiety")}
                />
                <Form.Check
                  inline
                  label="Mood Swings"
                  type="checkbox"
                  id="moodSwings"
                  checked={f.psychosocialSymptoms?.includes("moodSwings")}
                  onChange={() =>
                    f.handleCheckboxChangePsychosocial("moodSwings")
                  }
                />
                <Form.Check
                  inline
                  label="Irritability"
                  type="checkbox"
                  id="irritability"
                  checked={f.psychosocialSymptoms?.includes("irritability")}
                  onChange={() =>
                    f.handleCheckboxChangePsychosocial("irritability")
                  }
                />
                <Form.Check
                  inline
                  label="None reported"
                  type="checkbox"
                  id="PsycoSymptomsNonereported"
                  checked={f.psychosocialSymptoms?.includes("Nonereported")}
                  onChange={() =>
                    f.handleCheckboxChangePsychosocial("Nonereported")
                  }
                />
                <Form.Check
                  inline
                  label="Other"
                  type="checkbox"
                  id="OtherpsychosocialSymptoms"
                  checked={f.psychosocialSymptoms?.includes("Other")}
                  onChange={() => f.handleCheckboxChangePsychosocial("Other")}
                />
                {f.psychosocialSymptomsBoolean && (
                  <BorderlessInput
                    value={f.psychosocialSymptomssOther}
                    setState={f.setPsychosocialSymptomsOther}
                    placeholder=""
                  />
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      {/* <Card body className="mb-3">
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      Interventions that are being implemented
                    </Form.Label>
                    <CustomMultiSelectInput
                      className="w-100"
                      value={f.interventionsImplemented}
                      onChange={(options) =>
                        f.setInterventionsImplemented(options)
                      }
                      options={f.interventionsOptions}
                      isCreatable={true}
                    />
                      
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Other</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={f.interventionsImplementedOther}
                      onChange={(e) =>
                        f.setInterventionsImplementedOther(e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
             </Card> */}
    </>
  );
}
