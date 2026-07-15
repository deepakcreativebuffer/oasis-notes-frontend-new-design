/** @format */

import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { BorderlessInput } from "@/utils/Makers";
import { useInitialAssessmentFormContext } from "../context/InitialAssessmentFormContext";

export default function MentalStatusExamSection() {
  const f = useInitialAssessmentFormContext();
  return (
    <>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold">
            Mental Status Exam/Behavioral Observations
          </Form.Label>
        </Col>
        <Col xs={12}>
          <Form.Label className="fw-bold">General Appearance</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Apparent age</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Younger"
                type="checkbox"
                id="Younger"
                checked={f.younger}
                onChange={() => f.setYounger(!f.younger)}
              />
              <Form.Check
                inline
                label="Older"
                type="checkbox"
                id="older"
                checked={f.older}
                onChange={() => f.setOlder(!f.older)}
              />
              <Form.Check
                inline
                label="Other"
                id="OtherAge"
                type="checkbox"
                checked={f.olderOtherBoolean}
                onChange={() => f.setOlderOtherBoolean(!f.olderOtherBoolean)}
              />
              {f.olderOtherBoolean && (
                <BorderlessInput
                  value={f.olderOther}
                  setState={f.setOlderOther}
                  placeholder={" "}
                  className={`${!f.olderOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Height</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Average"
                type="checkbox"
                id="averageHeight"
                checked={f.averageHeight}
                onChange={() => f.setAverageHeight(!f.averageHeight)}
              />
              <Form.Check
                inline
                label="Short"
                type="checkbox"
                id="short"
                checked={f.short}
                onChange={() => f.setShort(!f.short)}
              />
              <Form.Check
                inline
                label="Tall"
                type="checkbox"
                id="tall"
                checked={f.tall}
                onChange={() => f.setTall(!f.tall)}
              />
              <Form.Check
                inline
                label="Other"
                type="checkbox"
                id="heightOther"
                checked={f.heigthBoolean}
                onChange={() => f.setHeigthBoolean(!f.heigthBoolean)}
              />
              {f.heigthBoolean && (
                <BorderlessInput
                  value={f.heigthOther}
                  setState={f.setHeigthOther}
                  placeholder={" "}
                  className={`${!f.heigthOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Weight</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Average"
                type="checkbox"
                id="averageWeight"
                checked={f.averageWeight}
                onChange={() => f.setAverageWeight(!f.averageWeight)}
              />
              <Form.Check
                inline
                label="Obese"
                type="checkbox"
                id="obese"
                checked={f.obese}
                onChange={() => f.setObese(!f.obese)}
              />
              <Form.Check
                inline
                label="Overweight"
                type="checkbox"
                id="overweight"
                checked={f.overweight}
                onChange={() => f.setOverweight(!f.overweight)}
              />
              <Form.Check
                inline
                label="Thin"
                type="checkbox"
                id="thin"
                checked={f.thin}
                onChange={() => f.setThin(!f.thin)}
              />
              <Form.Check
                inline
                label="Emaciated"
                type="checkbox"
                id="emaciated"
                checked={f.emaciated}
                onChange={() => f.setEmaciated(!f.emaciated)}
              />
              <Form.Check
                inline
                label="Other"
                id="otherWeight"
                type="checkbox"
                checked={f.WeightBoolean}
                onChange={() => f.setWeightBoolean(!f.WeightBoolean)}
              />
              {f.WeightBoolean && (
                <BorderlessInput
                  value={f.WeightOther}
                  setState={f.setWeightOther}
                  placeholder={" "}
                  className={`${!f.WeightOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Attire</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Casual"
                type="checkbox"
                id="casual"
                checked={f.casual}
                onChange={() => f.setCasual(!f.casual)}
              />
              <Form.Check
                inline
                label="Neat"
                type="checkbox"
                id="neat"
                checked={f.neat}
                onChange={() => f.setNeat(!f.neat)}
              />
              <Form.Check
                inline
                label="Tattered"
                type="checkbox"
                id="tattered"
                checked={f.tattered}
                onChange={() => f.setTattered(!f.tattered)}
              />
              <Form.Check
                inline
                label="Dirty"
                type="checkbox"
                id="dirty"
                checked={f.dirty}
                onChange={() => f.setDirty(!f.dirty)}
              />
              <Form.Check
                inline
                label="Other"
                id="otherAttire"
                type="checkbox"
                checked={f.attireBoolean}
                onChange={() => f.setAttireBoolaen(!f.attireBoolean)}
              />
              {f.attireBoolean && (
                <BorderlessInput
                  value={f.attireOther}
                  setState={f.setAttireOther}
                  placeholder={" "}
                  className={`${!f.attireOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Grooming</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Well-groomed"
                type="checkbox"
                id="wellgroomed"
                checked={f.wellGroomed}
                onChange={() => f.setWellGroomed(!f.wellGroomed)}
              />
              <Form.Check
                inline
                label="Adequate"
                type="checkbox"
                id="adequateGrooming"
                checked={f.adequateGrooming}
                onChange={() => f.setAdequateGrooming(!f.adequateGrooming)}
              />
              <Form.Check
                inline
                label="Unkempt"
                type="checkbox"
                id="unkempt"
                checked={f.unkempt}
                onChange={() => f.setUnkempt(!f.unkempt)}
              />
              <Form.Check
                inline
                label="Disheveled"
                type="checkbox"
                id="disheveled"
                checked={f.disheveled}
                onChange={() => f.setDisheveled(!f.disheveled)}
              />
              <Form.Check
                inline
                label="Other"
                type="checkbox"
                id="otherGrooming"
                checked={f.GroomingBoolean}
                onChange={() => f.setGroomingBoolean(!f.GroomingBoolean)}
              />
              {f.GroomingBoolean && (
                <BorderlessInput
                  value={f.GroomingOther}
                  setState={f.setGroomingOther}
                  placeholder={" "}
                  className={`${!f.GroomingOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold">Demeanor / Interaction</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Mood</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Euthymic"
                type="checkbox"
                id="euthymic"
                checked={f.euthymic}
                onChange={() => f.setEuthymic(!f.euthymic)}
              />
              <Form.Check
                inline
                label="Irritable"
                type="checkbox"
                id="irritable"
                checked={f.irritable}
                onChange={() => f.setIrritable(!f.irritable)}
              />
              <Form.Check
                inline
                label="Elevated"
                type="checkbox"
                id="elevated"
                checked={f.elevated}
                onChange={() => f.setElevated(!f.elevated)}
              />
              <Form.Check
                inline
                label="Depressed"
                type="checkbox"
                id="depressedMood"
                checked={f.depressedMood}
                onChange={() => f.setDepressedMood(!f.depressedMood)}
              />
              <Form.Check
                inline
                label="Anxious"
                type="checkbox"
                id="anxious"
                checked={f.anxious}
                onChange={() => f.setAnxious(!f.anxious)}
              />
              <Form.Check
                inline
                label="Other"
                type="checkbox"
                id="euthymicOtherBoolean"
                checked={f.euthymicOtherBoolean}
                onChange={() =>
                  f.seteuthymicOtherBoolean(!f.euthymicOtherBoolean)
                }
              />
              {f.euthymicOtherBoolean && (
                <BorderlessInput
                  value={f.euthymicOtherBooleanType}
                  setState={f.seteuthymicOtherBooleanType}
                  placeholder={" "}
                  className={`${!f.euthymicOtherBooleanType && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Affect</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Normal range"
                type="checkbox"
                id="normalRange"
                checked={f.normalRange}
                onChange={() => f.setNormalRange(!f.normalRange)}
              />
              <Form.Check
                inline
                label="Depressed"
                type="checkbox"
                id="depressedAffect"
                checked={f.depressedAffect}
                onChange={() => f.setDepressedAffect(!f.depressedAffect)}
              />
              <Form.Check
                inline
                label="Labile"
                type="checkbox"
                id="labile"
                checked={f.labile}
                onChange={() => f.setLabile(!f.labile)}
              />
              <Form.Check
                inline
                label="Constricted"
                type="checkbox"
                id="constricted"
                checked={f.constricted}
                onChange={() => f.setConstricted(!f.constricted)}
              />
              <Form.Check
                inline
                label="Other"
                type="checkbox"
                id="other"
                checked={f.other}
                onChange={() => f.setOther(!f.other)}
              />
              {f.other && (
                <BorderlessInput
                  value={f.otherText}
                  setState={f.setOtherText}
                  placeholder={" "}
                  className={`${!f.otherText && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Eye Contact</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Appropriate"
                type="checkbox"
                id="appropriate"
                checked={f.appropriate}
                onChange={() => f.setAppropriate(!f.appropriate)}
              />
              <Form.Check
                inline
                label="Minimal"
                type="checkbox"
                id="minimal"
                checked={f.minimal}
                onChange={() => f.setMinimal(!f.minimal)}
              />
              <Form.Check
                inline
                label="Poor"
                type="checkbox"
                id="poor"
                checked={f.poor}
                onChange={() => f.setPoor(!f.poor)}
              />
              <Form.Check
                inline
                label="Adequate"
                type="checkbox"
                id="adequateEyeContact"
                checked={f.adequateEyeContact}
                onChange={() => f.setAdequateEyeContact(!f.adequateEyeContact)}
              />
              <Form.Check
                inline
                label="Other"
                id="otherEyeContact"
                type="checkbox"
                checked={f.EyeContactOtherBoolean}
                onChange={() =>
                  f.setEyeContactOtherBoolean(!f.EyeContactOtherBoolean)
                }
              />
              {f.EyeContactOtherBoolean && (
                <BorderlessInput
                  value={f.EyeContactOtherBooleanType}
                  setState={f.setEyeContactOtherBooleanType}
                  placeholder={" "}
                  className={`${!f.EyeContactOtherBooleanType && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Cooperation</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Appropriate"
                type="checkbox"
                id="appropriateCooperation"
                checked={f.appropriateCooperation}
                onChange={() =>
                  f.setAppropriateCooperation(!f.appropriateCooperation)
                }
              />
              <Form.Check
                inline
                label="Hostile"
                type="checkbox"
                id="hostile"
                checked={f.hostile}
                onChange={() => f.setHostile(!f.hostile)}
              />
              <Form.Check
                inline
                label="Evasive"
                type="checkbox"
                id="evasive"
                checked={f.evasive}
                onChange={() => f.setEvasive(!f.evasive)}
              />
              <Form.Check
                inline
                label="Defensive"
                type="checkbox"
                id="defensive"
                checked={f.defensive}
                onChange={() => f.setDefensive(!f.defensive)}
              />
              <Form.Check
                inline
                label="Indifferent"
                type="checkbox"
                id="indifferent"
                checked={f.indifferent}
                onChange={() => f.setIndifferent(!f.indifferent)}
              />
              <Form.Check
                inline
                label="Other"
                id="otherCooperation"
                type="checkbox"
                checked={f.CooperationOtherBoolean}
                onChange={() =>
                  f.setCooperationOtherBoolean(!f.CooperationOtherBoolean)
                }
              />
              {f.CooperationOtherBoolean && (
                <BorderlessInput
                  value={f.CooperationOtherBooleanType}
                  setState={f.setCooperationOtherBooleanType}
                  placeholder={" "}
                  className={`${!f.CooperationOtherBooleanType && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold">Speech</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Articulation</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Normal"
                type="checkbox"
                id="normalArticulation"
                checked={f.normalArticulation}
                onChange={() => f.setNormalArticulation(!f.normalArticulation)}
              />
              <Form.Check
                inline
                label="Unintelligible"
                type="checkbox"
                id="unintelligible"
                checked={f.unintelligible}
                onChange={() => f.setUnintelligible(!f.unintelligible)}
              />
              <Form.Check
                inline
                label="Mumbled"
                type="checkbox"
                id="mumbled"
                checked={f.mumbled}
                onChange={() => f.setMumbled(!f.mumbled)}
              />
              <Form.Check
                inline
                label="Slurred"
                type="checkbox"
                id="slurred"
                checked={f.slurred}
                onChange={() => f.setSlurred(!f.slurred)}
              />
              <Form.Check
                inline
                label="Stuttered"
                type="checkbox"
                id="stuttered"
                checked={f.stuttered}
                onChange={() => f.setStuttered(!f.stuttered)}
              />
              <Form.Check
                inline
                label="Other"
                type="checkbox"
                id="ArticulationOtherBoolean"
                checked={f.ArticulationOtherBoolean}
                onChange={() =>
                  f.setArticulationOtherBoolean(!f.ArticulationOtherBoolean)
                }
              />
              {f.ArticulationOtherBoolean && (
                <BorderlessInput
                  value={f.ArticulationOtherBooleanOther}
                  setState={f.setArticulationOtherBooleanOther}
                  placeholder={" "}
                  className={`${!f.ArticulationOtherBooleanOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Tone</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Normal"
                type="checkbox"
                id="normalTone"
                checked={f.normalRate}
                onChange={() => f.setNormalRate(!f.normalRate)}
              />
              <Form.Check
                inline
                label="Soft"
                type="checkbox"
                id="soft"
                checked={f.soft}
                onChange={() => f.setSoft(!f.soft)}
              />
              <Form.Check
                inline
                label="Loud"
                type="checkbox"
                id="loud"
                checked={f.loud}
                onChange={() => f.setLoud(!f.loud)}
              />
              <Form.Check
                inline
                label="Pressured"
                type="checkbox"
                id="pressured"
                checked={f.pressured}
                onChange={() => f.setPressured(!f.pressured)}
              />
              <Form.Check
                inline
                label="Other"
                type="checkbox"
                id="ToneOtherBoolean"
                checked={f.ToneOtherBoolean}
                onChange={() => f.setToneOtherBoolean(!f.ToneOtherBoolean)}
              />
              {f.ToneOtherBoolean && (
                <BorderlessInput
                  value={f.ToneOtherBooleanOther}
                  setState={f.setToneOtherBooleanOther}
                  placeholder={" "}
                  className={`${!f.ToneOtherBooleanOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Rate</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Normal"
                type="checkbox"
                id="normalToneRate"
                checked={f.normalTone}
                onChange={() => f.setNormalTone(!f.normalTone)}
              />
              <Form.Check
                inline
                label="Slow"
                type="checkbox"
                id="slow"
                checked={f.slow}
                onChange={() => f.setSlow(!f.slow)}
              />
              <Form.Check
                inline
                label="Fast"
                type="checkbox"
                id="fast"
                checked={f.fast}
                onChange={() => f.setFast(!f.fast)}
              />
              <Form.Check
                inline
                label="Other"
                type="checkbox"
                id="RateOtherBoolean"
                checked={f.RateOtherBoolean}
                onChange={() => f.setRateOtherBoolean(!f.RateOtherBoolean)}
              />
              {f.RateOtherBoolean && (
                <BorderlessInput
                  value={f.RateOtherBooleanOther}
                  setState={f.setRateOtherBooleanOther}
                  placeholder={" "}
                  className={`${!f.RateOtherBooleanOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Quantity</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Normal"
                type="checkbox"
                id="normalQuantity"
                checked={f.normalQuantity}
                onChange={() => f.setNormalQuantity(!f.normalQuantity)}
              />
              <Form.Check
                inline
                label="Verbose"
                type="checkbox"
                id="verbose"
                checked={f.verbose}
                onChange={() => f.setVerbose(!f.verbose)}
              />
              <Form.Check
                inline
                label="Mutism"
                type="checkbox"
                id="mutism"
                checked={f.mutism}
                onChange={() => f.setMutism(!f.mutism)}
              />
              <Form.Check
                inline
                label="Other"
                type="checkbox"
                id="QuantityOtherBoolean"
                checked={f.QuantityOtherBoolean}
                onChange={() =>
                  f.setQuantityOtherBoolean(!f.QuantityOtherBoolean)
                }
              />
              {f.QuantityOtherBoolean && (
                <BorderlessInput
                  value={f.QuantityOtherBooleanOther}
                  setState={f.setQuantityOtherBooleanOther}
                  placeholder={" "}
                  className={`${!f.QuantityOtherBooleanOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Response latency</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Normal"
                type="checkbox"
                id="normalresponseLatency"
                checked={f.normalresponseLatency}
                onChange={() =>
                  f.setNormalresponseLatency(!f.normalresponseLatency)
                }
              />
              <Form.Check
                inline
                label="Delayed"
                type="checkbox"
                id="delayed"
                checked={f.delayed}
                onChange={() => f.setDelayed(!f.delayed)}
              />
              <Form.Check
                inline
                label="Shortened"
                type="checkbox"
                id="shortened"
                checked={f.shortened}
                onChange={() => f.setShortened(!f.shortened)}
              />
              <Form.Check
                inline
                label="Other"
                type="checkbox"
                id="responseLatencyOtherBoolean"
                checked={f.responseLatencyOtherBoolean}
                onChange={() =>
                  f.setresponseLatencyOtherBoolean(
                    !f.responseLatencyOtherBoolean,
                  )
                }
              />
              {f.responseLatencyOtherBoolean && (
                <BorderlessInput
                  value={f.responseLatencyOtherBooleanOther}
                  setState={f.setresponseLatencyOtherBooleanOther}
                  placeholder={" "}
                  className={`${!f.responseLatencyOtherBooleanOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold">Cognition</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Thought content</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Unremarkable"
                type="checkbox"
                id="unremarkablethoughtContent"
                checked={f.unremarkablethoughtContent}
                onChange={() =>
                  f.setUnremarkablethoughtContent(!f.unremarkablethoughtContent)
                }
              />
              <Form.Check
                inline
                label="Suspicious"
                type="checkbox"
                id="suspicious"
                checked={f.suspicious}
                onChange={() => f.setSuspicious(!f.suspicious)}
              />
              <Form.Check
                inline
                label="Negative"
                type="checkbox"
                id="negative"
                checked={f.negative}
                onChange={() => f.setNegative(!f.negative)}
              />
              <Form.Check
                inline
                label="Concrete"
                type="checkbox"
                id="concrete"
                checked={f.concrete}
                onChange={() => f.setConcrete(!f.concrete)}
              />
              <Form.Check
                inline
                label="Yes, other"
                type="checkbox"
                id="yesOtherDelusions"
                checked={f.thoughtContentBoolaen}
                onChange={() =>
                  f.setthoughtContentBoolean(!f.thoughtContentBoolaen)
                }
              />
              {f.thoughtContentBoolaen && (
                <BorderlessInput
                  value={f.thoughtContentOther}
                  setState={f.setThoughtContentOther}
                  placeholder={" "}
                  className={`${!f.thoughtContentOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Thought processes </Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Logical /Coherent"
                type="checkbox"
                id="logicalCoherent"
                checked={f.logicalCoherent}
                onChange={() => f.setLogicalCoherent(!f.logicalCoherent)}
              />
              <Form.Check
                inline
                label="Tangential"
                type="checkbox"
                id="tangential"
                checked={f.tangential}
                onChange={() => f.setTangential(!f.tangential)}
              />
              <Form.Check
                inline
                label="Circumstantial"
                type="checkbox"
                id="circumstantial"
                checked={f.circumstantial}
                onChange={() => f.setCircumstantial(!f.circumstantial)}
              />
              <Form.Check
                inline
                label="Vague"
                type="checkbox"
                id="vague"
                checked={f.vague}
                onChange={() => f.setVague(!f.vague)}
              />
              <Form.Check
                inline
                label="Yes, other"
                type="checkbox"
                id="yesOtherDelusions1"
                checked={f.thoughtProcessesBoolean}
                onChange={() =>
                  f.setThoughtProcessesBoolaen(!f.thoughtProcessesBoolean)
                }
              />
              {f.thoughtProcessesBoolean && (
                <BorderlessInput
                  value={f.thoughtProcessesOther}
                  setState={f.setThoughtProcessesOther}
                  placeholder={" "}
                  className={`${!f.thoughtProcessesOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Delusions</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="No"
                type="checkbox"
                id="noDelusions"
                checked={f.noDelusions}
                onChange={() => f.setNoDelusions(!f.noDelusions)}
              />
              <Form.Check
                inline
                label="Yes, persecutory"
                type="checkbox"
                id="yesPersecutory"
                checked={f.yesPersecutory}
                onChange={() => f.setYesPersecutory(!f.yesPersecutory)}
              />
              <Form.Check
                inline
                label="Yes, somatic"
                type="checkbox"
                id="yesSomatic"
                checked={f.yesSomatic}
                onChange={() => f.setYesSomatic(!f.yesSomatic)}
              />
              <Form.Check
                inline
                label="Yes, grandiose"
                type="checkbox"
                id="yesGrandiose"
                checked={f.yesGrandiose}
                onChange={() => f.setYesGrandiose(!f.yesGrandiose)}
              />
              <Form.Check
                inline
                label="Yes, other"
                type="checkbox"
                id="yesOtherDelusionsDelusion"
                checked={f.yesOtherDelusionsBoolean}
                onChange={() =>
                  f.setYesOtherDelusionsBoolean(!f.yesOtherDelusionsBoolean)
                }
              />
              {f.yesOtherDelusionsBoolean && (
                <BorderlessInput
                  value={f.yesOtherDelusionsText}
                  setState={f.setYesOtherDelusionsText}
                  placeholder={" "}
                  className={`${!f.yesOtherDelusionsText && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Hallucinations</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Unremarkable"
                type="checkbox"
                id="unremarkableHallucinations"
                checked={f.unremarkableHallucinations}
                onChange={() =>
                  f.setUnremarkableHallucinations(!f.unremarkableHallucinations)
                }
              />
              <Form.Check
                inline
                label="Visual hallucinations"
                type="checkbox"
                id="visualHallucinations"
                checked={f.visualHallucinations}
                onChange={() =>
                  f.setVisualHallucinations(!f.visualHallucinations)
                }
              />
              <Form.Check
                inline
                label="Auditory hallucinations"
                type="checkbox"
                id="auditoryHallucinations"
                checked={f.auditoryHallucinations}
                onChange={() =>
                  f.setAuditoryHallucinations(!f.auditoryHallucinations)
                }
              />
              <Form.Check
                inline
                label="Tactile hallucinations"
                type="checkbox"
                id="tactileHallucinations"
                checked={f.tactileHallucinations}
                onChange={() =>
                  f.setTactileHallucinations(!f.tactileHallucinations)
                }
              />
              <Form.Check
                inline
                label="Yes, other"
                type="checkbox"
                id="yesOtherHallucinations"
                checked={f.yesOtherHallucinationsBoolean}
                onChange={() =>
                  f.setYesOtherHallucinationsBoolean(
                    !f.yesOtherHallucinationsBoolean,
                  )
                }
              />
              {f.yesOtherHallucinationsBoolean && (
                <BorderlessInput
                  value={f.yesOtherHallucinationsText}
                  setState={f.setYesOtherHallucinationsText}
                  placeholder={" "}
                  className={`${!f.yesOtherHallucinationsText && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold">Motor activity</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Gait</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Normal"
                type="checkbox"
                id="normalGait"
                checked={f.normalGait}
                onChange={() => f.setNormalGait(!f.normalGait)}
              />
              <Form.Check
                inline
                label="Staggering"
                type="checkbox"
                id="staggering"
                checked={f.staggering}
                onChange={() => f.setStaggering(!f.staggering)}
              />
              <Form.Check
                inline
                label="Shuffling"
                type="checkbox"
                id="shuffling"
                checked={f.shuffling}
                onChange={() => f.setShuffling(!f.shuffling)}
              />
              <Form.Check
                inline
                label="Slow"
                type="checkbox"
                id="slowGait"
                checked={f.slowGait}
                onChange={() => f.setSlowGait(!f.slowGait)}
              />
              <Form.Check
                inline
                label="Awkward"
                type="checkbox"
                id="awkward"
                checked={f.awkward}
                onChange={() => f.setAwkward(!f.awkward)}
              />
              <Form.Check
                inline
                label="other"
                type="checkbox"
                id="gaitOtherBoolen"
                checked={f.gaitOtherBoolen}
                onChange={() => f.setGailOtherBoolen(!f.gaitOtherBoolen)}
              />
              {f.gaitOtherBoolen && (
                <BorderlessInput
                  type="text"
                  value={f.gaitOther}
                  setState={f.setgetOther}
                  placeholder={" "}
                  className={`${!f.gaitOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Posture</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Normal"
                type="checkbox"
                id="normalPosture"
                checked={f.normalPosture}
                onChange={() => f.setNormalPosture(!f.normalPosture)}
              />
              <Form.Check
                inline
                label="Relaxed"
                type="checkbox"
                id="relaxed"
                checked={f.relaxed}
                onChange={() => f.setRelaxed(!f.relaxed)}
              />
              <Form.Check
                inline
                label="Rigid"
                type="checkbox"
                id="rigid"
                checked={f.rigid}
                onChange={() => f.setRigid(!f.rigid)}
              />
              <Form.Check
                inline
                label="Tense"
                type="checkbox"
                id="tense"
                checked={f.tense}
                onChange={() => f.setTense(!f.tense)}
              />
              <Form.Check
                inline
                label="Slouched"
                type="checkbox"
                id="slouched"
                checked={f.slouched}
                onChange={() => f.setSlouched(!f.slouched)}
              />
              <Form.Check
                inline
                label="other"
                type="checkbox"
                id="PostureOtherBoolen"
                checked={f.PostureOtherBoolen}
                onChange={() => f.setgaitOtherBoolen(!f.PostureOtherBoolen)}
              />
              {f.PostureOtherBoolen && (
                <BorderlessInput
                  type="text"
                  value={f.PostureOther}
                  setState={f.setPostureOther}
                  placeholder={" "}
                  className={`${!f.PostureOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Psychomotor Activity</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Within normal limits"
                type="checkbox"
                id="withinNormalLimits"
                checked={f.withinNormalLimits}
                onChange={() => f.setWithinNormalLimits(!f.withinNormalLimits)}
              />
              <Form.Check
                inline
                label="Calm"
                type="checkbox"
                id="calm"
                checked={f.calm}
                onChange={() => f.setCalm(!f.calm)}
              />
              <Form.Check
                inline
                label="Hyperactive"
                type="checkbox"
                id="hyperactive"
                checked={f.hyperactive}
                onChange={() => f.setHyperactive(!f.hyperactive)}
              />
              <Form.Check
                inline
                label="Agitated"
                type="checkbox"
                id="agitated"
                checked={f.agitated}
                onChange={() => f.setAgitated(!f.agitated)}
              />
              <Form.Check
                inline
                label="Hypoactive"
                type="checkbox"
                id="hypoactive"
                checked={f.hypoactive}
                onChange={() => f.setHypoactive(!f.hypoactive)}
              />
              <Form.Check
                inline
                label="other"
                type="checkbox"
                id="PsychomotorActivityOtherBoolen"
                checked={f.PsychomotorActivityOtherBoolen}
                onChange={() =>
                  f.setPsychomotorActivityOtherBoolen(
                    !f.PsychomotorActivityOtherBoolen,
                  )
                }
              />
              {f.PsychomotorActivityOtherBoolen && (
                <BorderlessInput
                  type="text"
                  value={f.PsychomotorActivityOther}
                  setState={f.setPsychomotorActivityOther}
                  placeholder={" "}
                  className={`${!f.PsychomotorActivityOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Mannerisms</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="None"
                type="checkbox"
                id="none"
                checked={f.none}
                onChange={() => f.setNone(!f.none)}
              />
              <Form.Check
                inline
                label="Tics"
                type="checkbox"
                id="tics"
                checked={f.tics}
                onChange={() => f.setTics(!f.tics)}
              />
              <Form.Check
                inline
                label="Tremors"
                type="checkbox"
                id="tremorsMannerisms"
                checked={f.tremorsMannerisms}
                onChange={() => f.setTremorsMannerisms(!f.tremorsMannerisms)}
              />
              <Form.Check
                inline
                label="Rocking"
                type="checkbox"
                id="rocking"
                checked={f.rocking}
                onChange={() => f.setRocking(!f.rocking)}
              />
              <Form.Check
                inline
                label="Picking"
                type="checkbox"
                id="picking"
                checked={f.picking}
                onChange={() => f.setPicking(!f.picking)}
              />
              <Form.Check
                inline
                label="other"
                type="checkbox"
                id="yesOtherHallucinationsMannerism"
                checked={f.MannerismsOtherBoolen}
                onChange={() =>
                  f.setMannerismsOtherBoolen(!f.MannerismsOtherBoolen)
                }
              />
              {f.MannerismsOtherBoolen && (
                <BorderlessInput
                  type="text"
                  value={f.MannerismsOther}
                  setState={f.setMannerismsOther}
                  placeholder={" "}
                  className={`${!f.MannerismsOther && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={4}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Orientation to Person</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Yes"
                type="checkbox"
                id="person"
                checked={f.person === true}
                onChange={() => f.setPerson(true)}
              />
              <Form.Check
                inline
                label="No"
                type="checkbox"
                id="personno"
                checked={f.person === false}
                onChange={() => f.setPerson(false)}
              />
            </div>
          </Card>
        </Col>
        <Col xs={12} md={12} lg={4}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Place</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Yes"
                type="checkbox"
                id="place"
                checked={f.place === true}
                onChange={() => f.setPlace(true)}
              />
              <Form.Check
                inline
                label="No"
                type="checkbox"
                id="placeno"
                checked={f.place === false}
                onChange={() => f.setPlace(false)}
              />
            </div>
          </Card>
        </Col>
        <Col xs={12} md={12} lg={4}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Time</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Yes"
                type="checkbox"
                id="placenoTimeYes"
                checked={f.time === true}
                onChange={() => f.setTime(true)}
              />
              <Form.Check
                inline
                label="No"
                type="checkbox"
                id="timeno"
                checked={f.time === false}
                onChange={() => f.setTime(false)}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={6}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Circumstances</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Yes"
                type="checkbox"
                id="circumstances"
                checked={f.circumstances === true}
                onChange={() => f.setCircumstances(true)}
              />
              <Form.Check
                inline
                label="No"
                type="checkbox"
                id="circumstancesno"
                checked={f.circumstances === false}
                onChange={() => f.setCircumstances(false)}
              />
            </div>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Judgment</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Good"
                type="checkbox"
                id="goodJudgment"
                checked={f.goodJudgment}
                onChange={() => f.setGoodJudgment(!f.goodJudgment)}
              />
              <Form.Check
                inline
                label="Fair"
                type="checkbox"
                id="fairJudgment"
                checked={f.fairJudgment}
                onChange={() => f.setFairJudgment(!f.fairJudgment)}
              />
              <Form.Check
                inline
                label="Poor"
                type="checkbox"
                id="poorJudgment"
                checked={f.poorJudgment}
                onChange={() => f.setPoorJudgment(!f.poorJudgment)}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={6}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Insight</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Good"
                type="checkbox"
                id="goodInsight"
                checked={f.goodInsight}
                onChange={() => f.setGoodInsight(!f.goodInsight)}
              />
              <Form.Check
                inline
                label="Fair"
                type="checkbox"
                id="fairInsight"
                checked={f.fairInsight}
                onChange={() => f.setFairInsight(!f.fairInsight)}
              />
              <Form.Check
                inline
                label="Poor"
                type="checkbox"
                id="poorInsight"
                checked={f.poorInsight}
                onChange={() => f.setPoorInsight(!f.poorInsight)}
              />
            </div>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Memory</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Good"
                type="checkbox"
                id="goodMemory"
                checked={f.goodMemory}
                onChange={() => f.setGoodMemory(!f.goodMemory)}
              />
              <Form.Check
                inline
                label="Fair"
                type="checkbox"
                id="fairMemory"
                checked={f.fairMemory}
                onChange={() => f.setFairMemory(!f.fairMemory)}
              />
              <Form.Check
                inline
                label="Poor"
                type="checkbox"
                id="poorMemory"
                checked={f.poorMemory}
                onChange={() => f.setPoorMemory(!f.poorMemory)}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">
              Ability to concentration
            </Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Intact"
                type="checkbox"
                id="intact"
                checked={f.intactAbilityToConcentration}
                onChange={() =>
                  f.setIntactAbilityToConcentration(
                    !f.intactAbilityToConcentration,
                  )
                }
              />
              <Form.Check
                inline
                label="Other"
                type="checkbox"
                id="intactOther"
                checked={f.intactAbilityToConcentrationOtherBoolean}
                onChange={() =>
                  f.setIntactAbilityToConcentrationOtherBoolean(
                    !f.intactAbilityToConcentrationOtherBoolean,
                  )
                }
              />
              {f.intactAbilityToConcentrationOtherBoolean && (
                <BorderlessInput
                  value={f.otherAbilityToConcentration}
                  setState={f.setOtherAbilityToConcentration}
                  placeholder={" "}
                  className={`${!f.otherAbilityToConcentration && "hidePrint"}`}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
