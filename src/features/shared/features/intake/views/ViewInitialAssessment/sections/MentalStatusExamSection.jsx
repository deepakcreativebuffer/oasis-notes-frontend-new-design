/** @format */

import React from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { useViewInitialAssessmentForm } from "../formContext";

export default function MentalStatusExamSection() {
  const f = useViewInitialAssessmentForm();
  return (
    <>
      <Row>
        <Col xs={12} sm={12}>
          <Form.Label className="fw-bold w-100">
            Mental Status Exam/Behavioral Observations
          </Form.Label>
        </Col>
        <Col xs={12} sm={12}>
          <Form.Label
            className={`fw-bold w-100  ${!f.younger && !f.older && !f.olderOtherBoolean && !f.averageHeight && !f.short && !f.tall && !f.heigthBoolean && !f.averageWeight && !f.obese && !f.overweight && !f.thin && !f.emaciated && !f.WeightBoolean && !f.casual && !f.neat && !f.tattered && !f.dirty && !f.attireBoolean && !f.wellGroomed && !f.adequateGrooming && !f.unkempt && !f.disheveled && !f.GroomingBoolean && "table-row-hide-print"}`}
          >
            General Appearance
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.younger && !f.older && !f.olderOtherBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Apparent age :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Younger"
                  type="checkbox"
                  id="Younger"
                  checked={f.younger}
                  onChange={() => f.setYounger(!f.younger)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Older"
                  type="checkbox"
                  id="older"
                  checked={f.older}
                  onChange={() => f.setOlder(!f.older)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Other"
                  type="checkbox"
                  checked={f.olderOtherBoolean}
                  onChange={() => f.setOlderOtherBoolean(!f.olderOtherBoolean)}
                />
                {f.olderOtherBoolean && (
                  <span className="view-value">{f.olderOther}</span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.averageHeight && !f.short && !f.tall && !f.heigthBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Height :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Average"
                  type="checkbox"
                  id="averageHeight"
                  checked={f.averageHeight}
                  onChange={() => f.setAverageHeight(!f.averageHeight)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Short"
                  type="checkbox"
                  id="short"
                  checked={f.short}
                  onChange={() => f.setShort(!f.short)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Tall"
                  type="checkbox"
                  id="tall"
                  checked={f.tall}
                  onChange={() => f.setTall(!f.tall)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Other"
                  type="checkbox"
                  checked={f.heigthBoolean}
                  onChange={() => f.setHeigthBoolean(!f.heigthBoolean)}
                />
                {f.heigthBoolean && (
                  <span className="view-value">{f.heigthOther}</span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.averageWeight && !f.obese && !f.overweight && !f.thin && !f.emaciated && !f.WeightBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Weight :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Average"
                  type="checkbox"
                  id="averageWeight"
                  checked={f.averageWeight}
                  onChange={() => f.setAverageWeight(!f.averageWeight)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Obese"
                  type="checkbox"
                  id="obese"
                  checked={f.obese}
                  onChange={() => f.setObese(!f.obese)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Overweight"
                  type="checkbox"
                  id="overweight"
                  checked={f.overweight}
                  onChange={() => f.setOverweight(!f.overweight)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Thin"
                  type="checkbox"
                  id="thin"
                  checked={f.thin}
                  onChange={() => f.setThin(!f.thin)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Emaciated"
                  type="checkbox"
                  id="emaciated"
                  checked={f.emaciated}
                  onChange={() => f.setEmaciated(!f.emaciated)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Other"
                  type="checkbox"
                  checked={f.WeightBoolean}
                  onChange={() => f.setWeightBoolean(!f.WeightBoolean)}
                />
                {f.WeightBoolean && (
                  <span className="view-value">{f.WeightOther}</span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.casual && !f.neat && !f.tattered && !f.dirty && !f.attireBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Attire :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Casual"
                  type="checkbox"
                  id="casual"
                  checked={f.casual}
                  onChange={() => f.setCasual(!f.casual)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Neat"
                  type="checkbox"
                  id="neat"
                  checked={f.neat}
                  onChange={() => f.setNeat(!f.neat)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Tattered"
                  type="checkbox"
                  id="tattered"
                  checked={f.tattered}
                  onChange={() => f.setTattered(!f.tattered)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Dirty"
                  type="checkbox"
                  id="dirty"
                  checked={f.dirty}
                  onChange={() => f.setDirty(!f.dirty)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Other"
                  type="checkbox"
                  checked={f.attireBoolean}
                  onChange={() => f.setAttireBoolaen(!f.attireBoolean)}
                />
                {f.attireBoolean && (
                  <span className="view-value">{f.attireOther}</span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.wellGroomed && !f.adequateGrooming && !f.unkempt && !f.disheveled && !f.GroomingBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Grooming :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Well-groomed"
                  type="checkbox"
                  id="wellgroomed"
                  checked={f.wellGroomed}
                  onChange={() => f.setWellGroomed(!f.wellGroomed)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Adequate"
                  type="checkbox"
                  id="adequateGrooming"
                  checked={f.adequateGrooming}
                  onChange={() => f.setAdequateGrooming(!f.adequateGrooming)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Unkempt"
                  type="checkbox"
                  id="unkempt"
                  checked={f.unkempt}
                  onChange={() => f.setUnkempt(!f.unkempt)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Disheveled"
                  type="checkbox"
                  id="disheveled"
                  checked={f.disheveled}
                  onChange={() => f.setDisheveled(!f.disheveled)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Other"
                  type="checkbox"
                  checked={f.GroomingBoolean}
                  onChange={() => f.setGroomingBoolean(!f.GroomingBoolean)}
                />
                {f.GroomingBoolean && (
                  <span className="view-value">{f.GroomingOther}</span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          className={`${!f.euthymic && !f.irritable && !f.elevated && !f.depressedMood && !f.anxious && !f.euthymicOtherBoolean && !f.normalRange && !f.depressedAffect && !f.labile && !f.constricted && !f.other && !f.appropriate && !f.minimal && !f.poor && !f.adequateEyeContact && !f.EyeContactOtherBoolean && !f.appropriateCooperation && !f.hostile && !f.evasive && !f.defensive && !f.indifferent && !f.CooperationOtherBoolean && "table-row-hide-print"}`}
        >
          <Form.Label className="fw-bold w-100">
            Demeanor / Interaction
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.euthymic && !f.irritable && !f.elevated && !f.depressedMood && !f.anxious && !f.euthymicOtherBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">Mood : </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Euthymic"
                  type="checkbox"
                  id="euthymic"
                  checked={f.euthymic}
                  onChange={() => f.setEuthymic(!f.euthymic)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Irritable"
                  type="checkbox"
                  id="irritable"
                  checked={f.irritable}
                  onChange={() => f.setIrritable(!f.irritable)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Elevated"
                  type="checkbox"
                  id="elevated"
                  checked={f.elevated}
                  onChange={() => f.setElevated(!f.elevated)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Depressed"
                  type="checkbox"
                  id="depressedMood"
                  checked={f.depressedMood}
                  onChange={() => f.setDepressedMood(!f.depressedMood)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Anxious"
                  type="checkbox"
                  id="anxious"
                  checked={f.anxious}
                  onChange={() => f.setAnxious(!f.anxious)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
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
                  <span className="pointer-events-none view-value">
                    {f.euthymicOtherBooleanType}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.normalRange && !f.depressedAffect && !f.labile && !f.constricted && !f.other && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Affect :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Normal range"
                  type="checkbox"
                  id="normalRange"
                  checked={f.normalRange}
                  onChange={() => f.setNormalRange(!f.normalRange)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Depressed"
                  type="checkbox"
                  id="depressedAffect"
                  checked={f.depressedAffect}
                  onChange={() => f.setDepressedAffect(!f.depressedAffect)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Labile"
                  type="checkbox"
                  id="labile"
                  checked={f.labile}
                  onChange={() => f.setLabile(!f.labile)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Constricted"
                  type="checkbox"
                  id="constricted"
                  checked={f.constricted}
                  onChange={() => f.setConstricted(!f.constricted)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Other"
                  type="checkbox"
                  id="other"
                  checked={f.other}
                  onChange={() => f.setOther(!f.other)}
                />
                {f.other && (
                  <span className="pointer-events-none view-value">
                    {f.otherText}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.appropriate && !f.minimal && !f.poor && !f.adequateEyeContact && !f.EyeContactOtherBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Eye Contact :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Appropriate"
                  type="checkbox"
                  id="appropriate"
                  checked={f.appropriate}
                  onChange={() => f.setAppropriate(!f.appropriate)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Minimal"
                  type="checkbox"
                  id="minimal"
                  checked={f.minimal}
                  onChange={() => f.setMinimal(!f.minimal)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Poor"
                  type="checkbox"
                  id="poor"
                  checked={f.poor}
                  onChange={() => f.setPoor(!f.poor)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Adequate"
                  type="checkbox"
                  id="adequateEyeContact"
                  checked={f.adequateEyeContact}
                  onChange={() =>
                    f.setAdequateEyeContact(!f.adequateEyeContact)
                  }
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Other"
                  type="checkbox"
                  checked={f.EyeContactOtherBoolean}
                  onChange={() =>
                    f.setEyeContactOtherBoolean(!f.EyeContactOtherBoolean)
                  }
                />
                {f.EyeContactOtherBoolean && (
                  <span className="pointer-events-none view-value">
                    {f.EyeContactOtherBooleanType}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.appropriateCooperation && !f.hostile && !f.evasive && !f.defensive && !f.indifferent && !f.CooperationOtherBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Cooperation :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
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
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Hostile"
                  type="checkbox"
                  id="hostile"
                  checked={f.hostile}
                  onChange={() => f.setHostile(!f.hostile)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Evasive"
                  type="checkbox"
                  id="evasive"
                  checked={f.evasive}
                  onChange={() => f.setEvasive(!f.evasive)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Defensive"
                  type="checkbox"
                  id="defensive"
                  checked={f.defensive}
                  onChange={() => f.setDefensive(!f.defensive)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Indifferent"
                  type="checkbox"
                  id="indifferent"
                  checked={f.indifferent}
                  onChange={() => f.setIndifferent(!f.indifferent)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Other"
                  type="checkbox"
                  checked={f.CooperationOtherBoolean}
                  onChange={() =>
                    f.setCooperationOtherBoolean(!f.CooperationOtherBoolean)
                  }
                />
                {f.CooperationOtherBoolean && (
                  <span className="pointer-events-none view-value">
                    {f.CooperationOtherBooleanType}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          className={`${!f.normalArticulation && !f.unintelligible && !f.mumbled && !f.slurred && !f.stuttered && !f.ArticulationOtherBoolean && "table-row-hide-print"}`}
        >
          <Form.Label className="fw-bold w-100">Speech</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.normalArticulation && !f.unintelligible && !f.mumbled && !f.slurred && !f.stuttered && !f.ArticulationOtherBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Articulation :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Normal"
                  type="checkbox"
                  id="normalArticulation"
                  checked={f.normalArticulation}
                  onChange={() =>
                    f.setNormalArticulation(!f.normalArticulation)
                  }
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Unintelligible"
                  type="checkbox"
                  id="unintelligible"
                  checked={f.unintelligible}
                  onChange={() => f.setUnintelligible(!f.unintelligible)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Mumbled"
                  type="checkbox"
                  id="mumbled"
                  checked={f.mumbled}
                  onChange={() => f.setMumbled(!f.mumbled)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Slurred"
                  type="checkbox"
                  id="slurred"
                  checked={f.slurred}
                  onChange={() => f.setSlurred(!f.slurred)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Stuttered"
                  type="checkbox"
                  id="stuttered"
                  checked={f.stuttered}
                  onChange={() => f.setStuttered(!f.stuttered)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
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
                  <span className="pointer-events-none view-value">
                    {f.ArticulationOtherBooleanOther}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.normalRate && !f.soft && !f.loud && !f.pressured && !f.ToneOtherBooleanOther && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">Tone : </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Normal"
                  type="checkbox"
                  id="normalTone"
                  checked={f.normalRate}
                  onChange={() => f.setNormalRate(!f.normalRate)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Soft"
                  type="checkbox"
                  id="soft"
                  checked={f.soft}
                  onChange={() => f.setSoft(!f.soft)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Loud"
                  type="checkbox"
                  id="loud"
                  checked={f.loud}
                  onChange={() => f.setLoud(!f.loud)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Pressured"
                  type="checkbox"
                  id="pressured"
                  checked={f.pressured}
                  onChange={() => f.setPressured(!f.pressured)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Other"
                  type="checkbox"
                  id="other"
                  checked={f.ToneOtherBooleanOther}
                  onChange={() => {
                    f.setToneOtherBoolean(!f.ToneOtherBooleanOther);
                  }}
                />
                {f.ToneOtherBoolean && (
                  <span className="pointer-events-none view-value">
                    {f.ToneOtherBooleanOther}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.normalTone && !f.slow && !f.fast && !f.RateOtherBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">Rate : </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Normal"
                  type="checkbox"
                  id="normalRate"
                  checked={f.normalTone}
                  onChange={() => f.setNormalTone(!f.normalTone)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Slow"
                  type="checkbox"
                  id="slow"
                  checked={f.slow}
                  onChange={() => f.setSlow(!f.slow)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Fast"
                  type="checkbox"
                  id="fast"
                  checked={f.fast}
                  onChange={() => f.setFast(!f.fast)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Other"
                  type="checkbox"
                  id="RateOtherBoolean"
                  checked={f.RateOtherBoolean}
                  onChange={() => f.setRateOtherBoolean(!f.RateOtherBoolean)}
                />
                {f.RateOtherBoolean && (
                  <span className="pointer-events-none view-value">
                    {f.RateOtherBooleanOther}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.normalQuantity && !f.verbose && !f.mutism && !f.QuantityOtherBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Quantity :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Normal"
                  type="checkbox"
                  id="normalQuantity"
                  checked={f.normalQuantity}
                  onChange={() => f.setNormalQuantity(!f.normalQuantity)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Verbose"
                  type="checkbox"
                  id="verbose"
                  checked={f.verbose}
                  onChange={() => f.setVerbose(!f.verbose)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Mutism"
                  type="checkbox"
                  id="mutism"
                  checked={f.mutism}
                  onChange={() => f.setMutism(!f.mutism)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
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
                  <span className="pointer-events-none view-value">
                    {f.QuantityOtherBooleanOther}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.normalresponseLatency && !f.delayed && !f.shortened && !f.responseLatencyOtherBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Response latency :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
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
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Delayed"
                  type="checkbox"
                  id="delayed"
                  checked={f.delayed}
                  onChange={() => f.setDelayed(!f.delayed)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Shortened"
                  type="checkbox"
                  id="shortened"
                  checked={f.shortened}
                  onChange={() => f.setShortened(!f.shortened)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
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
                  <span className="pointer-events-none view-value">
                    {f.responseLatencyOtherBooleanOther}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Form.Label
            className={`fw-bold w-100 ${!f.unremarkablethoughtContent && !f.suspicious && !f.negative && !f.concrete && !f.thoughtContentBoolaen && !f.logicalCoherent && !f.tangential && !f.circumstantial && !f.vague && !f.thoughtProcessesBoolean && !f.noDelusions && !f.yesPersecutory && !f.yesSomatic && !f.yesGrandiose && !f.yesOtherDelusionsBoolean && !f.unremarkableHallucinations && !f.visualHallucinations && !f.auditoryHallucinations && !f.tactileHallucinations && !f.yesOtherHallucinationsBoolean && "table-row-hide-print"}`}
          >
            Cognition
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.unremarkablethoughtContent && !f.suspicious && !f.negative && !f.concrete && !f.thoughtContentBoolaen && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Thought content :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Unremarkable"
                  type="checkbox"
                  id="unremarkablethoughtContent"
                  checked={f.unremarkablethoughtContent}
                  onChange={() =>
                    f.setUnremarkablethoughtContent(
                      !f.unremarkablethoughtContent,
                    )
                  }
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Suspicious"
                  type="checkbox"
                  id="suspicious"
                  checked={f.suspicious}
                  onChange={() => f.setSuspicious(!f.suspicious)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Negative"
                  type="checkbox"
                  id="negative"
                  checked={f.negative}
                  onChange={() => f.setNegative(!f.negative)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Concrete"
                  type="checkbox"
                  id="concrete"
                  checked={f.concrete}
                  onChange={() => f.setConcrete(!f.concrete)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
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
                  <span className="pointer-events-none view-value">
                    {f.thoughtContentOther}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.logicalCoherent && !f.tangential && !f.circumstantial && !f.vague && !f.thoughtProcessesBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Thought processes :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Logical /Coherent"
                  type="checkbox"
                  id="logicalCoherent"
                  checked={f.logicalCoherent}
                  onChange={() => f.setLogicalCoherent(!f.logicalCoherent)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Tangential"
                  type="checkbox"
                  id="tangential"
                  checked={f.tangential}
                  onChange={() => f.setTangential(!f.tangential)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Circumstantial"
                  type="checkbox"
                  id="circumstantial"
                  checked={f.circumstantial}
                  onChange={() => f.setCircumstantial(!f.circumstantial)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Vague"
                  type="checkbox"
                  id="vague"
                  checked={f.vague}
                  onChange={() => f.setVague(!f.vague)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Yes, other"
                  type="checkbox"
                  id="yesOtherDelusions"
                  checked={f.thoughtProcessesBoolean}
                  onChange={() =>
                    f.setThoughtProcessesBoolaen(!f.thoughtProcessesBoolean)
                  }
                />
                {f.thoughtProcessesBoolean && (
                  <span className="pointer-events-none view-value">
                    {f.thoughtProcessesOther}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.noDelusions && !f.yesPersecutory && !f.yesSomatic && !f.yesGrandiose && !f.yesOtherDelusionsBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Delusions :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="No"
                  type="checkbox"
                  id="noDelusions"
                  checked={f.noDelusions}
                  onChange={() => f.setNoDelusions(!f.noDelusions)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Yes, persecutory"
                  type="checkbox"
                  id="yesPersecutory"
                  checked={f.yesPersecutory}
                  onChange={() => f.setYesPersecutory(!f.yesPersecutory)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Yes, somatic"
                  type="checkbox"
                  id="yesSomatic"
                  checked={f.yesSomatic}
                  onChange={() => f.setYesSomatic(!f.yesSomatic)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Yes, grandiose"
                  type="checkbox"
                  id="yesGrandiose"
                  checked={f.yesGrandiose}
                  onChange={() => f.setYesGrandiose(!f.yesGrandiose)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Yes, other"
                  type="checkbox"
                  id="yesOtherDelusions"
                  checked={f.yesOtherDelusionsBoolean}
                  onChange={() =>
                    f.setYesOtherDelusionsBoolean(!f.yesOtherDelusionsBoolean)
                  }
                />
                {f.yesOtherDelusionsBoolean && (
                  <span className="pointer-events-none view-value">
                    {f.yesOtherDelusionsText}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.unremarkableHallucinations && !f.visualHallucinations && !f.auditoryHallucinations && !f.tactileHallucinations && !f.yesOtherHallucinationsBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Hallucinations :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Unremarkable"
                  type="checkbox"
                  id="unremarkableHallucinations"
                  checked={f.unremarkableHallucinations}
                  onChange={() =>
                    f.setUnremarkableHallucinations(
                      !f.unremarkableHallucinations,
                    )
                  }
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
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
                  disabled
                  className="pointer-events-none"
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
                  disabled
                  className="pointer-events-none"
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
                  disabled
                  className="pointer-events-none"
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
                  <span className="pointer-events-none view-value">
                    {f.yesOtherHallucinationsText}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          className={`${!f.normalGait && !f.staggering && !f.shuffling && !f.slowGait && !f.awkward && !f.gaitOtherBoolen && !f.normalPosture && !f.relaxed && !f.rigid && !f.tense && !f.slouched && !f.PostureOtherBoolen && !f.withinNormalLimits && !f.calm && !f.hyperactive && !f.agitated && !f.hypoactive && !f.PsychomotorActivityOtherBoolen && !f.none && !f.tics && !f.tremorsMannerisms && !f.rocking && !f.picking && !f.MannerismsOtherBoolen && f.person !== true && f.person !== false && f.place !== true && f.place !== false && f.time !== true && f.time !== false && f.circumstances !== true && f.circumstances !== false && !f.goodJudgment && !f.fairJudgment && !f.poorJudgment && !f.goodInsight && !f.fairInsight && !f.poorInsight && !f.goodMemory && !f.fairMemory && !f.poorMemory && "table-row-hide-print"}`}
        >
          <Form.Label className="fw-bold w-100">Motor activity</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.normalGait && !f.staggering && !f.shuffling && !f.slowGait && !f.awkward && !f.gaitOtherBoolen && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">Gait : </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Normal"
                  type="checkbox"
                  id="normalGait"
                  checked={f.normalGait}
                  onChange={() => f.setNormalGait(!f.normalGait)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Staggering"
                  type="checkbox"
                  id="staggering"
                  checked={f.staggering}
                  onChange={() => f.setStaggering(!f.staggering)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Shuffling"
                  type="checkbox"
                  id="shuffling"
                  checked={f.shuffling}
                  onChange={() => f.setShuffling(!f.shuffling)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Slow"
                  type="checkbox"
                  id="slowGait"
                  checked={f.slowGait}
                  onChange={() => f.setSlowGait(!f.slowGait)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Awkward"
                  type="checkbox"
                  id="awkward"
                  checked={f.awkward}
                  onChange={() => f.setAwkward(!f.awkward)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="other"
                  type="checkbox"
                  id="gaitOtherBoolen"
                  checked={f.gaitOtherBoolen}
                  onChange={() => f.setGailOtherBoolen(!f.gaitOtherBoolen)}
                />
                {f.gaitOtherBoolen && (
                  <span className="pointer-events-none view-value">
                    {f.gaitOther}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.normalPosture && !f.relaxed && !f.rigid && !f.tense && !f.slouched && !f.PostureOtherBoolen && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Posture :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Normal"
                  type="checkbox"
                  id="normalPosture"
                  checked={f.normalPosture}
                  onChange={() => f.setNormalPosture(!f.normalPosture)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Relaxed"
                  type="checkbox"
                  id="relaxed"
                  checked={f.relaxed}
                  onChange={() => f.setRelaxed(!f.relaxed)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Rigid"
                  type="checkbox"
                  id="rigid"
                  checked={f.rigid}
                  onChange={() => f.setRigid(!f.rigid)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Tense"
                  type="checkbox"
                  id="tense"
                  checked={f.tense}
                  onChange={() => f.setTense(!f.tense)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Slouched"
                  type="checkbox"
                  id="slouched"
                  checked={f.slouched}
                  onChange={() => f.setSlouched(!f.slouched)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="other"
                  type="checkbox"
                  id="PostureOtherBoolen"
                  checked={f.PostureOtherBoolen}
                  onChange={() => f.setgaitOtherBoolen(!f.PostureOtherBoolen)}
                />
                {f.PostureOtherBoolen && (
                  <span className="pointer-events-none view-value">
                    {f.PostureOther}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.withinNormalLimits && !f.calm && !f.hyperactive && !f.agitated && !f.hypoactive && !f.PsychomotorActivityOtherBoolen && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Psychomotor Activity :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Within normal limits"
                  type="checkbox"
                  id="withinNormalLimits"
                  checked={f.withinNormalLimits}
                  onChange={() =>
                    f.setWithinNormalLimits(!f.withinNormalLimits)
                  }
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Calm"
                  type="checkbox"
                  id="calm"
                  checked={f.calm}
                  onChange={() => f.setCalm(!f.calm)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Hyperactive"
                  type="checkbox"
                  id="hyperactive"
                  checked={f.hyperactive}
                  onChange={() => f.setHyperactive(!f.hyperactive)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Agitated"
                  type="checkbox"
                  id="agitated"
                  checked={f.agitated}
                  onChange={() => f.setAgitated(!f.agitated)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Hypoactive"
                  type="checkbox"
                  id="hypoactive"
                  checked={f.hypoactive}
                  onChange={() => f.setHypoactive(!f.hypoactive)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
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
                  <span className="pointer-events-none view-value">
                    {f.PsychomotorActivityOther}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.none && !f.tics && !f.tremorsMannerisms && !f.rocking && !f.picking && !f.MannerismsOtherBoolen && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Mannerisms :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="None"
                  type="checkbox"
                  id="none"
                  checked={f.none}
                  onChange={() => f.setNone(!f.none)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Tics"
                  type="checkbox"
                  id="tics"
                  checked={f.tics}
                  onChange={() => f.setTics(!f.tics)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Tremors"
                  type="checkbox"
                  id="tremorsMannerisms"
                  checked={f.tremorsMannerisms}
                  onChange={() => f.setTremorsMannerisms(!f.tremorsMannerisms)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Rocking"
                  type="checkbox"
                  id="rocking"
                  checked={f.rocking}
                  onChange={() => f.setRocking(!f.rocking)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Picking"
                  type="checkbox"
                  id="picking"
                  checked={f.picking}
                  onChange={() => f.setPicking(!f.picking)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="other"
                  type="checkbox"
                  id="yesOtherHallucinations"
                  checked={f.MannerismsOtherBoolen}
                  onChange={() =>
                    f.setMannerismsOtherBoolen(!f.MannerismsOtherBoolen)
                  }
                />
                {f.MannerismsOtherBoolen && (
                  <span className="pointer-events-none view-value">
                    {f.MannerismsOther}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={4}
          className={`${f.person !== true && f.person !== false && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Orientation to Person :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="person"
                  checked={f.person === true}
                  onChange={() => f.setPerson(true)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="No"
                  type="checkbox"
                  id="personno"
                  checked={f.person === false}
                  onChange={() => f.setPerson(false)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={4}
          className={`${f.place !== true && f.place !== false && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Place :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="place"
                  checked={f.place === true}
                  onChange={() => f.setPlace(true)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="No"
                  type="checkbox"
                  id="placeno"
                  checked={f.place === false}
                  onChange={() => f.setPlace(false)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={4}
          className={`${f.time !== true && f.time !== false && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">Time : </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="placeno"
                  checked={f.time === true}
                  onChange={() => f.setTime(true)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="No"
                  type="checkbox"
                  id="timeno"
                  checked={f.time === false}
                  onChange={() => f.setTime(false)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          lg={6}
          className={`${f.circumstances !== true && f.circumstances !== false && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Circumstances :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="circumstances"
                  checked={f.circumstances === true}
                  onChange={() => f.setCircumstances(true)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="No"
                  type="checkbox"
                  id="circumstancesno"
                  checked={f.circumstances === false}
                  onChange={() => f.setCircumstances(false)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          lg={6}
          className={`${!f.goodJudgment && !f.fairJudgment && !f.poorJudgment && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Judgment :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Good"
                  type="checkbox"
                  id="goodJudgment"
                  checked={f.goodJudgment}
                  onChange={() => f.setGoodJudgment(!f.goodJudgment)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Fair"
                  type="checkbox"
                  id="fairJudgment"
                  checked={f.fairJudgment}
                  onChange={() => f.setFairJudgment(!f.fairJudgment)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Poor"
                  type="checkbox"
                  id="poorJudgment"
                  checked={f.poorJudgment}
                  onChange={() => f.setPoorJudgment(!f.poorJudgment)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          lg={6}
          className={`${!f.goodInsight && !f.fairInsight && !f.poorInsight && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Insight :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Good"
                  type="checkbox"
                  id="goodInsight"
                  checked={f.goodInsight}
                  onChange={() => f.setGoodInsight(!f.goodInsight)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Fair"
                  type="checkbox"
                  id="fairInsight"
                  checked={f.fairInsight}
                  onChange={() => f.setFairInsight(!f.fairInsight)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Poor"
                  type="checkbox"
                  id="poorInsight"
                  checked={f.poorInsight}
                  onChange={() => f.setPoorInsight(!f.poorInsight)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          lg={6}
          className={`${!f.goodMemory && !f.fairMemory && !f.poorMemory && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Memory :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Good"
                  type="checkbox"
                  id="goodMemory"
                  checked={f.goodMemory}
                  onChange={() => f.setGoodMemory(!f.goodMemory)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Fair"
                  type="checkbox"
                  id="fairMemory"
                  checked={f.fairMemory}
                  onChange={() => f.setFairMemory(!f.fairMemory)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Poor"
                  type="checkbox"
                  id="poorMemory"
                  checked={f.poorMemory}
                  onChange={() => f.setPoorMemory(!f.poorMemory)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!f.intactAbilityToConcentration && !f.intactAbilityToConcentrationOtherBoolean && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Ability to concentration :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
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
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Other"
                  type="checkbox"
                  id="intact"
                  checked={f.intactAbilityToConcentrationOtherBoolean}
                  onChange={() =>
                    f.setIntactAbilityToConcentrationOtherBoolean(
                      !f.intactAbilityToConcentrationOtherBoolean,
                    )
                  }
                />
                {f.intactAbilityToConcentrationOtherBoolean && (
                  <span className="pointer-events-none view-value">
                    {f.otherAbilityToConcentration}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col xs={12}>
          <Form.Label
            className={`fw-bold mb-0 w-100 ${
              !f.significantSocialDevelopmentalHistory &&
              !f.educationalHistory &&
              // !f.highestEducation &&
              f.specialEducation !== true &&
              f.specialEducation !== false &&
              f.currentStudent !== true &&
              f.currentStudent !== false &&
              !f.ifYesWhere &&
              "table-row-hide-print"
            }`}
          >
            Significant Social/Developmental History
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          lg={6}
          className={`${!f.significantSocialDevelopmentalHistory && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">
              Childhood (include parents, siblings, family) :{" "}
            </p>
            <h5 className="view-value mb-0">
              {f.significantSocialDevelopmentalHistory}
            </h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          lg={6}
          className={`${!f.educationalHistory && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Highest level of education : </p>
            <h5 className="view-value mb-0">{f.educationalHistory}</h5>
          </div>
        </Col>
      </Row>
      <Row>
        {/* <Col
                  xs={12}
                  sm={12}
                  lg={6}
                  className={`${!f.highestEducation && "table-row-hide-print"}`}
                 >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">
                      Highest level of education :{" "}
                    </p>
                    <h5 className="view-value mb-0">{f.highestEducation}</h5>
                  </div>
                 </Col> */}
        <Col
          xs={12}
          sm={12}
          lg={6}
          className={`${f.specialEducation !== true && f.specialEducation !== false && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Special education :</p>
            <div className="radio-inline">
              <Form.Check
                disabled
                className="pointer-events-f.none"
                inline
                label="Yes"
                type="checkbox"
                name=""
                id=""
                checked={f.specialEducation === true}
                onChange={() => f.setSpecialEducation(true)}
              />
              <Form.Check
                disabled
                className="pointer-events-f.none"
                inline
                label="No"
                type="checkbox"
                name=""
                id=""
                checked={f.specialEducation === false}
                onChange={() => f.setSpecialEducation(false)}
              />
            </div>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={6}
          className={`${f.currentStudent !== true && f.currentStudent !== false && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Currently a student? : </p>
            <div className="radio-inline">
              <Form.Check
                disabled
                className="pointer-events-f.none"
                inline
                label="Yes"
                type="checkbox"
                name=""
                id=""
                checked={f.currentStudent === true}
                onChange={() => f.setCurrentStudent(true)}
              />
              <Form.Check
                disabled
                className="pointer-events-f.none"
                inline
                label="No"
                type="checkbox"
                checked={f.currentStudent === false}
                onChange={() => f.setCurrentStudent(false)}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={6}
          className={`${!f.ifYesWhere && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">If yes, where? : </p>
            <h5 className="view-value mb-0">{f.ifYesWhere}</h5>
          </div>
        </Col>
      </Row>
    </>
  );
}
