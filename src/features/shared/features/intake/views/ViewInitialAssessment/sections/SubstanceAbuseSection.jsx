/** @format */

import React from "react";
import { Row, Col, Form, Table } from "react-bootstrap";
import { useViewInitialAssessmentForm } from "../formContext";

export default function SubstanceAbuseSection() {
  const f = useViewInitialAssessmentForm();
  return (
    <>
      <Row className="mb-2">
        <Col
          xs={12}
          sm={12}
          className={`${!f.substanceAbuseHistory && !f.substanceAbuseDenies && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <div className="radio-inline">
              <Form.Check
                disabled
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
                disabled
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
          {(f.substanceAbuseHistoryDataAgeOfFirstUseAlcohol ||
            f.substanceAbuseHistoryDataLastUseAlcohol ||
            f.substanceAbuseHistoryDataFrequencyAlcohol ||
            f.substanceAbuseHistoryDataLengthOfSobrietyAlcohol ||
            f.substanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines ||
            f.substanceAbuseHistoryDataLastUseBenzodiazepines ||
            f.substanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines ||
            f.substanceAbuseHistoryDataFrequencyBenzodiazepines ||
            f.substanceAbuseHistoryDataAgeOfFirstUseCrack ||
            f.substanceAbuseHistoryDataLastUseCrack ||
            f.substanceAbuseHistoryDataFrequencyCrack ||
            f.substanceAbuseHistoryDataLengthOfSobrietyCrack ||
            f.substanceAbuseHistoryDataAgeOfFirstUseHeroin ||
            f.substanceAbuseHistoryDataLastUseHeroin ||
            f.substanceAbuseHistoryDataFrequencyHeroin ||
            f.substanceAbuseHistoryDataLengthOfSobrietyHeroin ||
            f.substanceAbuseHistoryDataAgeOfFirstUseInhalants ||
            f.substanceAbuseHistoryDataLastUseInhalants ||
            f.substanceAbuseHistoryDataFrequencyInhalants ||
            f.substanceAbuseHistoryDataLengthOfSobrietyInhalants ||
            f.substanceAbuseHistoryDataAgeOfFirstUseMarijuana ||
            f.substanceAbuseHistoryDataLengthOfSobrietyMarijuana ||
            f.substanceAbuseHistoryDataLastUseMarijuana ||
            f.substanceAbuseHistoryDataFrequencyMarijuana ||
            f.substanceAbuseHistoryDataAgeOfFirstUseMethamphetamine ||
            f.substanceAbuseHistoryDataLastUseMethamphetamine ||
            f.substanceAbuseHistoryDataFrequencyMethamphetamine ||
            f.substanceAbuseHistoryDataLengthOfSobrietyMethamphetamine ||
            f.substanceAbuseHistoryDataAgeOfFirstUseMethadone ||
            f.substanceAbuseHistoryDataLastUseMethadone ||
            f.substanceAbuseHistoryDataFrequencyMethadone ||
            f.substanceAbuseHistoryDataLengthOfSobrietyMethadone ||
            f.substanceAbuseHistoryDataAgeOfFirstUseMDMA ||
            f.substanceAbuseHistoryDataLastUseMDMA ||
            f.substanceAbuseHistoryDataFrequencyMDMA ||
            f.substanceAbuseHistoryDataFrequencyMDMA ||
            f.substanceAbuseHistoryDataLengthOfSobrietyMDMA ||
            f.substanceAbuseHistoryDataAgeOfFirstUsePCP ||
            f.substanceAbuseHistoryDataLastUsePCP ||
            f.substanceAbuseHistoryDataFrequencyPCP ||
            f.substanceAbuseHistoryDataAgeOfFirstUsePrescription ||
            f.substanceAbuseHistoryDataLengthOfSobrietyPCP ||
            f.substanceAbuseHistoryDataLastUsePrescription ||
            f.substanceAbuseHistoryDataFrequencyPrescription ||
            f.substanceAbuseHistoryDataLengthOfSobrietyPrescription ||
            f.substanceAbuseHistoryDataAgeOfFirstUseOTC ||
            f.substanceAbuseHistoryDataLastUseOTC ||
            f.substanceAbuseHistoryDataFrequencyOTC ||
            f.substanceAbuseHistoryDataLengthOfSobrietyOTC ||
            f.substanceAbuseHistoryDataAgeOfFirstUseCocaine ||
            f.substanceAbuseHistoryDataLastUseCocaine ||
            f.substanceAbuseHistoryDataFrequencyCocaine ||
            f.substanceAbuseHistoryDataLengthOfSobrietyCocaine ||
            f.substanceAbuseHistoryDataAgeOfFirstUseHallucinogens ||
            f.substanceAbuseHistoryDataLastUseHallucinogens ||
            f.substanceAbuseHistoryDataFrequencyHallucinogens ||
            f.substanceAbuseHistoryDataLengthOfSobrietyHallucinogens ||
            f.otherTypeOther ||
            f.otherAgeOfFirstUse ||
            f.otherLastUse) && (
            <Table
              responsive
              bordered
              className={`fixed-table-data ${!f.substanceAbuseHistoryDataAgeOfFirstUseAlcohol && !f.substanceAbuseHistoryDataLastUseAlcohol && !f.substanceAbuseHistoryDataFrequencyAlcohol && !f.substanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines && !f.substanceAbuseHistoryDataLastUseBenzodiazepines && !f.substanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines && !f.substanceAbuseHistoryDataFrequencyBenzodiazepines && !f.substanceAbuseHistoryDataAgeOfFirstUseCrack && !f.substanceAbuseHistoryDataLastUseCrack && !f.substanceAbuseHistoryDataFrequencyCrack && !f.substanceAbuseHistoryDataAgeOfFirstUseHeroin && !f.substanceAbuseHistoryDataLastUseHeroin && !f.substanceAbuseHistoryDataFrequencyHeroin && !f.substanceAbuseHistoryDataAgeOfFirstUseInhalants && !f.substanceAbuseHistoryDataLastUseInhalants && !f.substanceAbuseHistoryDataFrequencyInhalants && !f.substanceAbuseHistoryDataAgeOfFirstUseMarijuana && !f.substanceAbuseHistoryDataLastUseMarijuana && !f.substanceAbuseHistoryDataFrequencyMarijuana && !f.substanceAbuseHistoryDataAgeOfFirstUseMethamphetamine && !f.substanceAbuseHistoryDataLastUseMethamphetamine && !f.substanceAbuseHistoryDataFrequencyMethamphetamine && !f.substanceAbuseHistoryDataAgeOfFirstUseMethadone && !f.substanceAbuseHistoryDataLastUseMethadone && !f.substanceAbuseHistoryDataAgeOfFirstUseMDMA && !f.substanceAbuseHistoryDataLastUseMDMA && !f.substanceAbuseHistoryDataFrequencyMDMA && !f.substanceAbuseHistoryDataAgeOfFirstUsePCP && !f.substanceAbuseHistoryDataLastUsePCP && !f.substanceAbuseHistoryDataFrequencyPCP && !f.substanceAbuseHistoryDataAgeOfFirstUsePrescription && !f.substanceAbuseHistoryDataLastUsePrescription && !f.substanceAbuseHistoryDataFrequencyPrescription && !f.substanceAbuseHistoryDataAgeOfFirstUseOTC && !f.substanceAbuseHistoryDataLastUseOTC && !f.substanceAbuseHistoryDataFrequencyOTC && !f.otherTypeOther && !f.otherAgeOfFirstUse && !f.otherLastUse && "table-row-hide-print"}`}
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
                  <td>
                    {f.substanceAbuseHistoryDataFrequencyInhalants?.label}
                  </td>
                  <td>
                    {
                      f.substanceAbuseHistoryDataLengthOfSobrietyInhalants
                        ?.label
                    }
                  </td>
                </tr>

                <tr
                  className={`${!f.substanceAbuseHistoryDataAgeOfFirstUseMarijuana && "table-row-hide-print"}`}
                >
                  <td>Marijuana </td>
                  <td>{f.substanceAbuseHistoryDataAgeOfFirstUseMarijuana}</td>
                  <td>{f.substanceAbuseHistoryDataLastUseMarijuana.label}</td>
                  <td>
                    {f.substanceAbuseHistoryDataFrequencyMarijuana?.label}
                  </td>
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
                  <td>
                    {f.substanceAbuseHistoryDataLengthOfSobrietyMDMA.label}
                  </td>
                </tr>

                <tr
                  className={`${!f.substanceAbuseHistoryDataAgeOfFirstUsePCP && "table-row-hide-print"}`}
                >
                  <td>Primary Care Physician (angel dust)</td>
                  <td>{f.substanceAbuseHistoryDataAgeOfFirstUsePCP}</td>
                  <td>{f.substanceAbuseHistoryDataLastUsePCP.label}</td>
                  <td>{f.substanceAbuseHistoryDataFrequencyPCP.label}</td>
                  <td>
                    {f.substanceAbuseHistoryDataLengthOfSobrietyPCP.label}
                  </td>
                </tr>

                <tr
                  className={`${!f.substanceAbuseHistoryDataAgeOfFirstUsePrescription && "table-row-hide-print"}`}
                >
                  <td>Prescription medicine</td>
                  <td>
                    {f.substanceAbuseHistoryDataAgeOfFirstUsePrescription}
                  </td>
                  <td>
                    {f.substanceAbuseHistoryDataLastUsePrescription.label}
                  </td>
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
                  <td>
                    {f.substanceAbuseHistoryDataLengthOfSobrietyOTC?.label}
                  </td>
                </tr>

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
                  <td>
                    {f.substanceAbuseHistoryDataAgeOfFirstUseHallucinogens}
                  </td>
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
          )}
        </Col>
      </Row>
    </>
  );
}
