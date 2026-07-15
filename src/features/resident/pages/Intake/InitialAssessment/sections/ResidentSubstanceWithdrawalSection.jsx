/* eslint-disable no-unused-vars */
/** @format */

import React from "react";
import { Card, Row, Col, Form, Button, Table } from "react-bootstrap";
import { useResidentInitialAssessmentFormContext } from "../context/ResidentInitialAssessmentFormContext";

export default function ResidentSubstanceWithdrawalSection() {
  const f = useResidentInitialAssessmentFormContext();
  return (
    <>
      <Row className="mb-3">
        <Col
          xs={12}
          className={`${!f.substanceAbuseHistory && !f.substanceAbuseDenies && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <div className="radio-inline">
              <Form.Check
                className="pointer-events-f.none"
                inline
                label="Substance Abuse history"
                type="checkbox"
                id="substanceAbuseHistory"
                checked={f.substanceAbuseHistory}
                onChange={() =>
                  f.setSubstanceAbuseHistory(!f.substanceAbuseHistory)
                }
              />
              <Form.Check
                className="pointer-events-f.none"
                inline
                label="Denies"
                type="checkbox"
                id="substanceAbuseDenies"
                checked={f.substanceAbuseDenies}
                onChange={() =>
                  f.setSubstanceAbuseDenies(!f.substanceAbuseDenies)
                }
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md="12">
          <Table
            responsive="lg"
            bordered
            className={`table-fix-layout ${!f.substanceAbuseHistoryDataAgeOfFirstUseAlcohol && !f.substanceAbuseHistoryDataLastUseAlcohol && !f.substanceAbuseHistoryDataFrequencyAlcohol && !f.substanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines && !f.substanceAbuseHistoryDataLastUseBenzodiazepines && !f.substanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines && !f.substanceAbuseHistoryDataFrequencyBenzodiazepines && !f.substanceAbuseHistoryDataAgeOfFirstUseCrack && !f.substanceAbuseHistoryDataLastUseCrack && !f.substanceAbuseHistoryDataFrequencyCrack && !f.substanceAbuseHistoryDataAgeOfFirstUseHeroin && !f.substanceAbuseHistoryDataLastUseHeroin && !f.substanceAbuseHistoryDataFrequencyHeroin && !f.substanceAbuseHistoryDataAgeOfFirstUseInhalants && !f.substanceAbuseHistoryDataLastUseInhalants && !f.substanceAbuseHistoryDataFrequencyInhalants && !f.substanceAbuseHistoryDataAgeOfFirstUseMarijuana && !f.substanceAbuseHistoryDataLastUseMarijuana && !f.substanceAbuseHistoryDataFrequencyMarijuana && !f.substanceAbuseHistoryDataAgeOfFirstUseMethamphetamine && !f.substanceAbuseHistoryDataLastUseMethamphetamine && !f.substanceAbuseHistoryDataFrequencyMethamphetamine && !f.substanceAbuseHistoryDataAgeOfFirstUseMethadone && !f.substanceAbuseHistoryDataLastUseMethadone && !f.substanceAbuseHistoryDataAgeOfFirstUseMDMA && !f.substanceAbuseHistoryDataLastUseMDMA && !f.substanceAbuseHistoryDataFrequencyMDMA && !f.substanceAbuseHistoryDataAgeOfFirstUsePCP && !f.substanceAbuseHistoryDataLastUsePCP && !f.substanceAbuseHistoryDataFrequencyPCP && !f.substanceAbuseHistoryDataAgeOfFirstUsePrescription && !f.substanceAbuseHistoryDataLastUsePrescription && !f.substanceAbuseHistoryDataFrequencyPrescription && !f.substanceAbuseHistoryDataAgeOfFirstUseOTC && !f.substanceAbuseHistoryDataLastUseOTC && !f.substanceAbuseHistoryDataFrequencyOTC && !f.otherTypeOther && !f.otherAgeOfFirstUse && !f.otherLastUse && "table-row-hide-print"}`}
          >
            <thead>
              <tr>
                <th>Type</th>
                <th>Age of First use</th>
                <th>Last Use</th>
                <th>Frequency </th>
                <th>Length of Sobriety</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={`${!f.substanceAbuseHistoryDataAgeOfFirstUseAlcohol && "table-row-hide-print"}`}
              >
                <td>Alcohol</td>
                <td>{f.substanceAbuseHistoryDataAgeOfFirstUseAlcohol}</td>
                <td>{f.substanceAbuseHistoryDataLastUseAlcohol?.label}</td>

                <td>{f.substanceAbuseHistoryDataFrequencyAlcohol?.label}</td>
                <td>
                  {f.substanceAbuseHistoryDataLengthOfSobrietyAlcohol?.label}
                </td>
              </tr>

              <tr
                className={`${!f.substanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines && "table-row-hide-print"}`}
              >
                <td>Benzodiazepines</td>
                <td>
                  {f.substanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines}
                </td>
                <td>
                  {f.substanceAbuseHistoryDataLastUseBenzodiazepines?.label}
                </td>
                <td>
                  {f.substanceAbuseHistoryDataFrequencyBenzodiazepines?.label}
                </td>
                <td>
                  {
                    f.substanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines
                      ?.label
                  }
                </td>
              </tr>
              <tr
                className={`${!f.substanceAbuseHistoryDataAgeOfFirstUseCrack && "table-row-hide-print"}`}
              >
                <td>Crack</td>
                <td>{f.substanceAbuseHistoryDataAgeOfFirstUseCrack}</td>
                <td>{f.substanceAbuseHistoryDataLastUseCrack?.label}</td>
                <td>{f.substanceAbuseHistoryDataFrequencyCrack?.label}</td>
                <td>
                  {f.substanceAbuseHistoryDataLengthOfSobrietyCrack?.label}
                </td>
              </tr>

              <tr
                className={`${!f.substanceAbuseHistoryDataAgeOfFirstUseHeroin && "table-row-hide-print"}`}
              >
                <td>Heroin</td>
                <td>{f.substanceAbuseHistoryDataAgeOfFirstUseHeroin}</td>
                <td>{f.substanceAbuseHistoryDataLastUseHeroin?.label}</td>
                <td>{f.substanceAbuseHistoryDataFrequencyHeroin?.label}</td>
                <td>
                  {f.substanceAbuseHistoryDataLengthOfSobrietyHeroin?.label}
                </td>
              </tr>

              <tr
                className={`${!f.substanceAbuseHistoryDataAgeOfFirstUseInhalants && "table-row-hide-print"}`}
              >
                <td>Inhalants</td>
                <td>{f.substanceAbuseHistoryDataAgeOfFirstUseInhalants}</td>
                <td>{f.substanceAbuseHistoryDataLastUseInhalants?.label}</td>
                <td>{f.substanceAbuseHistoryDataFrequencyInhalants?.label}</td>
                <td>
                  {f.substanceAbuseHistoryDataLengthOfSobrietyInhalants?.label}
                </td>
              </tr>

              <tr
                className={`${!f.substanceAbuseHistoryDataAgeOfFirstUseMarijuana && "table-row-hide-print"}`}
              >
                <td>Marijuana </td>
                <td>{f.substanceAbuseHistoryDataAgeOfFirstUseMarijuana}</td>
                <td>{f.substanceAbuseHistoryDataLastUseMarijuana.label}</td>
                <td>{f.substanceAbuseHistoryDataFrequencyMarijuana?.label}</td>
                <td>
                  {f.substanceAbuseHistoryDataLengthOfSobrietyMarijuana.label}
                </td>
              </tr>

              <tr
                className={`${!f.substanceAbuseHistoryDataAgeOfFirstUseMethamphetamine && "table-row-hide-print"}`}
              >
                <td>Methamphetamine </td>
                <td>
                  {f.substanceAbuseHistoryDataAgeOfFirstUseMethamphetamine}
                </td>
                <td>
                  {f.substanceAbuseHistoryDataLastUseMethamphetamine.label}
                </td>
                <td>
                  {f.substanceAbuseHistoryDataFrequencyMethamphetamine.label}
                </td>
                <td>
                  {
                    f.substanceAbuseHistoryDataLengthOfSobrietyMethamphetamine
                      .label
                  }
                </td>
              </tr>

              <tr
                className={`${!f.substanceAbuseHistoryDataAgeOfFirstUseMethadone && "table-row-hide-print"}`}
              >
                <td>Methadone</td>
                <td>{f.substanceAbuseHistoryDataAgeOfFirstUseMethadone}</td>
                <td>{f.substanceAbuseHistoryDataLastUseMethadone.label}</td>
                <td>{f.substanceAbuseHistoryDataFrequencyMethadone.label}</td>
                <td>
                  {f.substanceAbuseHistoryDataLengthOfSobrietyMethadone.label}
                </td>
              </tr>

              <tr
                className={`${!f.substanceAbuseHistoryDataAgeOfFirstUseMDMA && "table-row-hide-print"}`}
              >
                <td>MDMA (ecstasy)</td>
                <td>{f.substanceAbuseHistoryDataAgeOfFirstUseMDMA}</td>
                <td>{f.substanceAbuseHistoryDataLastUseMDMA.label}</td>
                <td>{f.substanceAbuseHistoryDataFrequencyMDMA.label}</td>
                <td>{f.substanceAbuseHistoryDataLengthOfSobrietyMDMA.label}</td>
              </tr>

              <tr
                className={`${!f.substanceAbuseHistoryDataAgeOfFirstUsePCP && "table-row-hide-print"}`}
              >
                <td>Primary Care Physician (angel dust)</td>
                <td>{f.substanceAbuseHistoryDataAgeOfFirstUsePCP}</td>
                <td>{f.substanceAbuseHistoryDataLastUsePCP.label}</td>
                <td>{f.substanceAbuseHistoryDataFrequencyPCP.label}</td>
                <td>{f.substanceAbuseHistoryDataLengthOfSobrietyPCP.label}</td>
              </tr>

              <tr
                className={`${!f.substanceAbuseHistoryDataAgeOfFirstUsePrescription && "table-row-hide-print"}`}
              >
                <td>Prescription medicine</td>
                <td>{f.substanceAbuseHistoryDataAgeOfFirstUsePrescription}</td>
                <td>{f.substanceAbuseHistoryDataLastUsePrescription.label}</td>
                <td>
                  {f.substanceAbuseHistoryDataFrequencyPrescription.label}
                </td>
                <td>
                  {
                    f.substanceAbuseHistoryDataLengthOfSobrietyPrescription
                      .label
                  }
                </td>
              </tr>

              <tr
                className={`${!f.substanceAbuseHistoryDataAgeOfFirstUseOTC && "table-row-hide-print"}`}
              >
                <td>OTC medicine</td>
                <td>{f.substanceAbuseHistoryDataAgeOfFirstUseOTC}</td>
                <td>{f.substanceAbuseHistoryDataLastUseOTC?.label}</td>
                <td>{f.substanceAbuseHistoryDataFrequencyOTC?.label}</td>
                <td>{f.substanceAbuseHistoryDataLengthOfSobrietyOTC?.label}</td>
              </tr>

              {/* add some extra */}
              <tr
                className={`${!f.substanceAbuseHistoryDataAgeOfFirstUseCocaine && "table-row-hide-print"}`}
              >
                <td>Cocaine</td>
                <td>{f.substanceAbuseHistoryDataAgeOfFirstUseCocaine}</td>
                <td>{f.substanceAbuseHistoryDataLastUseCocaine?.label}</td>
                <td>{f.substanceAbuseHistoryDataFrequencyCocaine?.label}</td>
                <td>
                  {f.substanceAbuseHistoryDataLengthOfSobrietyCocaine?.label}
                </td>
              </tr>

              <tr
                className={`${!f.substanceAbuseHistoryDataAgeOfFirstUseHallucinogens && "table-row-hide-print"}`}
              >
                <td>Hallucinogens (LSD,mescaline,etc.)</td>
                <td>{f.substanceAbuseHistoryDataAgeOfFirstUseHallucinogens}</td>
                <td>
                  {f.substanceAbuseHistoryDataLastUseHallucinogens?.label}
                </td>
                <td>
                  {f.substanceAbuseHistoryDataFrequencyHallucinogens?.label}
                </td>
                <td>
                  {
                    f.substanceAbuseHistoryDataLengthOfSobrietyHallucinogens
                      ?.label
                  }
                </td>
              </tr>

              {f.typeArray?.map((i, index) => (
                <tr
                  key={index}
                  className={`${!i.types && "table-row-hide-print"}`}
                >
                  <td>{i.types}</td>
                  <td>{i.ageOfFirstUse} </td>
                  <td>{i.lastUse} </td>
                  <td>{i.frequency} </td>
                  <td>{i.lengthOfSobriety} </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row>
        <Col
          xs={12}
          className={`${!f.noneReportedOrObserved && !f.Vomiting && !f.Anxiety && !f.Agitation && !f.Headache && !f.Tremors && !f.Nausea && !f.VisualDisturbances && !f.TactileDisturbances && !f.VisualDisturbancesOtherBoolean && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label">Active Withdrawal Symptoms : </p>
            <div className="radio-inline">
              <Form.Check
                inline
                label="None reported or observed"
                type="checkbox"
                id="noneReportedOrObserved"
                value={f.noneReportedOrObserved}
                checked={f.noneReportedOrObserved}
                onChange={() =>
                  f.setNoneReportedOrObserved(!f.noneReportedOrObserved)
                }
                className={`pe-f.none ${!f.noneReportedOrObserved && "print-hide"}`}
              />
              <Form.Check
                inline
                label="Vomiting"
                type="checkbox"
                id="Vomiting"
                value={f.Vomiting}
                checked={f.Vomiting}
                onChange={() => f.setVomiting(!f.Vomiting)}
                className={`pe-f.none ${!f.Vomiting && "print-hide"}`}
              />
              <Form.Check
                inline
                label="Anxiety"
                type="checkbox"
                id="Anxiety"
                value={f.Anxiety}
                checked={f.Anxiety}
                onChange={() => f.setAnxiety(!f.Anxiety)}
                className={`pe-f.none ${!f.Anxiety && "print-hide"}`}
              />
              <Form.Check
                inline
                label="Agitation"
                type="checkbox"
                id="Agitation"
                value={f.Agitation}
                checked={f.Agitation}
                onChange={() => f.setAgitation(!f.Agitation)}
                className={`pe-f.none ${!f.Agitation && "print-hide"}`}
              />
              <Form.Check
                inline
                label="Headache"
                type="checkbox"
                id="Headache"
                value={f.Headache}
                checked={f.Headache}
                onChange={() => f.setHeadache(!f.Headache)}
                className={`pe-f.none ${!f.Headache && "print-hide"}`}
              />
              <Form.Check
                inline
                label="Tremors"
                type="checkbox"
                id="Tremors"
                value={f.Tremors}
                checked={f.Tremors}
                onChange={() => f.setTremors(!f.Tremors)}
                className={`pe-f.none ${!f.Tremors && "print-hide"}`}
              />
              <Form.Check
                inline
                label="Nausea"
                type="checkbox"
                id="Nausea"
                value={f.Nausea}
                checked={f.Nausea}
                onChange={() => f.setNausea(!f.Nausea)}
                className={`pe-f.none ${!f.Nausea && "print-hide"}`}
              />
              <Form.Check
                inline
                label="Tactile Disturbances"
                type="checkbox"
                id="TactileDisturbances"
                value={f.TactileDisturbances}
                checked={f.TactileDisturbances}
                onChange={() =>
                  f.setTactileDisturbances(!f.TactileDisturbances)
                }
                className={`pe-f.none ${!f.TactileDisturbances && "print-hide"}`}
              />
              <Form.Check
                inline
                label="Visual Disturbances"
                type="checkbox"
                id="VisualDisturbances"
                value={f.VisualDisturbances}
                checked={f.VisualDisturbances}
                onChange={() => f.setVisualDisturbances(!f.VisualDisturbances)}
                className={`pe-f.none ${!f.VisualDisturbances && "print-hide"}`}
              />
              <Form.Check
                inline
                label="Other"
                type="checkbox"
                id="VisualDisturbancesOtherBoolean"
                value={f.VisualDisturbancesOtherBoolean}
                checked={f.VisualDisturbancesOtherBoolean}
                onChange={() =>
                  f.setVisualDisturbancesOtherBoolean(
                    !f.VisualDisturbancesOtherBoolean,
                  )
                }
                className={`pe-f.none ${!f.VisualDisturbancesOtherBoolean && "print-hide"}`}
              />
              {f.VisualDisturbancesOtherBoolean && (
                <span className="view-value pe-f.none">
                  {f.VisualDisturbancesOtherType}
                </span>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          className={`${!f.Sweats && !f.GooseBumps && !f.BonePain && !f.Seizures && !f.Paranoia && !f.Runningnose && !f.Tearing && !f.LossofMuscleCoordination && !f.LossofMuscleCoordinationOtherBoolean && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label">Other Withdraw Symptoms : </p>
            <div className="radio-inline">
              <Form.Check
                className="pe-f.none"
                inline
                label="Sweats"
                type="checkbox"
                id="Sweats"
                value={f.Sweats}
                checked={f.Sweats}
                onChange={() => f.setSweats(!f.Sweats)}
              />
              <Form.Check
                className="pe-f.none"
                inline
                label="Goose Bumps"
                type="checkbox"
                id="GooseBumps"
                value={f.GooseBumps}
                checked={f.GooseBumps}
                onChange={() => f.setGooseBumps(!f.GooseBumps)}
              />
              <Form.Check
                className="pe-f.none"
                inline
                label="Bone Pain"
                type="checkbox"
                id="BonePain"
                value={f.BonePain}
                checked={f.BonePain}
                onChange={() => f.setBonePain(!f.BonePain)}
              />
              <Form.Check
                className="pe-f.none"
                inline
                label="Seizures"
                type="checkbox"
                id="Seizures"
                value={f.Seizures}
                checked={f.Seizures}
                onChange={() => f.setSeizures(!f.Seizures)}
              />
              <Form.Check
                className="pe-f.none"
                inline
                label="Paranoia"
                type="checkbox"
                id="Paranoia"
                value={f.Paranoia}
                checked={f.Paranoia}
                onChange={() => f.setParanoia(!f.Paranoia)}
              />
              <Form.Check
                className="pe-f.none"
                inline
                label="Running nose"
                type="checkbox"
                id="Runningnose"
                value={f.Runningnose}
                checked={f.Runningnose}
                onChange={() => f.setRunningnose(!f.Runningnose)}
              />
              <Form.Check
                className="pe-f.none"
                inline
                label="Tearing"
                type="checkbox"
                id="Tearing"
                value={f.Tearing}
                checked={f.Tearing}
                onChange={() => f.setTearing(!f.Tearing)}
              />
              <Form.Check
                className="pe-f.none"
                inline
                label="Loss of muscle coordination"
                type="checkbox"
                id="LossofMuscleCoordination"
                value={f.LossofMuscleCoordination}
                checked={f.LossofMuscleCoordination}
                onChange={() =>
                  f.setLossofMuscleCoordination(!f.LossofMuscleCoordination)
                }
              />
              <Form.Check
                inline
                label="Other"
                type="checkbox"
                id="LossofMuscleCoordination"
                value={f.LossofMuscleCoordinationOtherBoolean}
                checked={f.LossofMuscleCoordinationOtherBoolean}
                onChange={() =>
                  f.setLossofMuscleCoordinationBoolean(
                    !f.LossofMuscleCoordinationOtherBoolean,
                  )
                }
                className={`pe-f.none ${!f.LossofMuscleCoordinationOtherBoolean && "print-hide"}`}
              />
              {f.LossofMuscleCoordinationOtherBoolean && (
                <span className="view-value pe-f.none">
                  {f.LossofMuscleCoordinationOtherType}
                </span>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
