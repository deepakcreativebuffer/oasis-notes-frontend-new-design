/** @format */

import React from "react";
import { Card, Row, Col, Form, Table } from "react-bootstrap";
import AutoSize from "@/features/shared/ui/forms/AutoSize";
import ResidentPrintSignature from "@/features/shared/ui/ResidentPrintSignature/ResidentPrintSignature";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import { signatureFormat } from "@/utils/utils";
import { ROLES } from "@/features/shared/constants/index";
import { useViewInitialAssessmentForm } from "../formContext";

export default function DiagnosesSignaturesSection() {
  const f = useViewInitialAssessmentForm();
  return (
    <>
      <Row>
        <Col xs={12} sm={12} md={12}>
          <Form.Label
            className={`fw-bold w-100 ${f.SupportsYesNo === undefined && f.SpiritualYesNo === undefined && f.ReligiousYesNo === undefined && f.FearYesNo === undefined && f.interventionYesNo === undefined && f.WillingYesNo === undefined && "table-row-hide-print"}`}
          >
            Protective factors
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12}>
          <Table
            responsive
            bordered
            className={`${f.SupportsYesNo === undefined && f.SpiritualYesNo === undefined && f.ReligiousYesNo === undefined && f.FearYesNo === undefined && f.interventionYesNo === undefined && f.WillingYesNo === undefined && "table-row-hide-print"}`}
          >
            <thead
              className={`${f.SupportsYesNo === undefined && f.SpiritualYesNo === undefined && f.ReligiousYesNo === undefined && f.FearYesNo === undefined && f.interventionYesNo === undefined && f.WillingYesNo === undefined && "table-row-hide-print"}`}
            >
              <tr>
                <th>Protective factors that apply</th>
                <th>Yes</th>
                <th>No</th>
                <th className="w-50">Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={`${f.SupportsYesNo === undefined && "table-row-hide-print"}`}
              >
                <td>Supports available (family friends)</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.SupportsYesNo === true}
                    onChange={() => f.setSupportsYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.SupportsYesNo === false}
                    onChange={() => f.setSupportsYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.SupportsComment}</td>
              </tr>

              <tr
                className={`${f.SpiritualYesNo === undefined && "table-row-hide-print"}`}
              >
                <td>Spiritual / religious support</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.SpiritualYesNo === true}
                    onChange={() => f.setSpiritualYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.SpiritualYesNo === false}
                    onChange={() => f.setSpiritualYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.SpiritualComment}</td>
              </tr>

              <tr
                className={`${f.ReligiousYesNo === undefined && "table-row-hide-print"}`}
              >
                <td>Religious/cultural prohibitions</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ReligiousYesNo === true}
                    onChange={() => f.setReligiousYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ReligiousYesNo === false}
                    onChange={() => f.setReligiousYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.ReligiousComment}</td>
              </tr>

              <tr
                className={`${f.FearYesNo === undefined && "table-row-hide-print"}`}
              >
                <td>Fear of consequences</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.FearYesNo === true}
                    onChange={() => f.setFearYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.FearYesNo === false}
                    onChange={() => f.setFearYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.FearComment}</td>
              </tr>

              <tr
                className={`${f.interventionYesNo === undefined && "table-row-hide-print"}`}
              >
                <td>Able to be engaged in intervention</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.interventionYesNo === true}
                    onChange={() => f.setInterventionYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.interventionYesNo === false}
                    onChange={() => f.setInterventionYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.interventionComment}</td>
              </tr>

              <tr
                className={`${f.WillingYesNo === undefined && "table-row-hide-print"}`}
              >
                <td>Willing to commit to keeping self safe</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.WillingYesNo === true}
                    onChange={() => f.setWillingYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.WillingYesNo === false}
                    onChange={() => f.setWillingYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.WillingComment}</td>
              </tr>

              {f.protectiveFactorsArray?.map((i, index) => (
                <tr key={index}>
                  <td>{i?.type}</td>
                  <td>
                    <Form.Check
                      disabled
                      inline
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={i.yesNo === true}
                    />
                  </td>
                  <td>
                    <Form.Check
                      disabled
                      inline
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={i.yesNo === false}
                    />
                  </td>
                  <td className="pl-[20px]">{` ${i.comment}`}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          md={12}
          className={`${!f.riskLevel && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold flex-shrink-0">
                Considering the responses to the above risk factors in
                combination with all the other information you know about the
                person (gender, age, diagnosis, balancing factors-resiliency and
                supports, would you rate the level of risk for this person for
                danger to self (DTS) as :
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="No Risk"
                  type="checkbox"
                  checked={f.riskLevel === "No Risk"}
                  onChange={() => f.setRiskLevel("No Risk")}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Low Risk"
                  type="checkbox"
                  checked={f.riskLevel === "Low Risk"}
                  onChange={() => f.setRiskLevel("Low Risk")}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Moderate Risk"
                  type="checkbox"
                  checked={f.riskLevel === "Moderate Risk"}
                  onChange={() => f.setRiskLevel("Moderate Risk")}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="High Risk"
                  type="checkbox"
                  checked={f.riskLevel === "High Risk"}
                  onChange={() => f.setRiskLevel("High Risk")}
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
          md={12}
          className={`${!f.psychiatricPrimaryIcdCode && !f.psychiatricPrimaryDescription && !f.psychiatricSecondaryicdCode && !f.psychiatricSecondaryDescription && !f.psychiatricTertiaryIcdCode && !f.psychiatricTertiaryDescription && !f.psychiatricAdditionalicdCode && !f.psychiatricAdditionalDescription && "table-row-hide-print"}`}
        >
          <Form.Label className="fw-bold w-100">Diagnoses</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12}>
          <Table
            responsive
            bordered
            className={`${!f.psychiatricPrimaryIcdCode && !f.psychiatricPrimaryDescription && !f.psychiatricSecondaryicdCode && !f.psychiatricSecondaryDescription && !f.psychiatricTertiaryIcdCode && !f.psychiatricTertiaryDescription && !f.psychiatricAdditionalicdCode && !f.psychiatricAdditionalDescription && "table-row-hide-print"}`}
          >
            <thead
              className={`${!f.psychiatricPrimaryIcdCode && !f.psychiatricPrimaryDescription && !f.psychiatricSecondaryicdCode && !f.psychiatricSecondaryDescription && !f.psychiatricTertiaryIcdCode && !f.psychiatricTertiaryDescription && !f.psychiatricAdditionalicdCode && !f.psychiatricAdditionalDescription && "table-row-hide-print"}`}
            >
              <tr>
                <th>Mental Health Diagnoses</th>
                <th>ICD Code</th>
                <th className="w-50">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={`${!f.psychiatricPrimaryIcdCode && !f.psychiatricPrimaryDescription && "table-row-hide-print"}`}
              >
                <td>Primary*</td>
                <td>{f.psychiatricPrimaryIcdCode}</td>
                <td className="text-justify">
                  {f.psychiatricPrimaryDescription || ""}
                </td>
              </tr>

              <tr
                className={`${!f.psychiatricSecondaryicdCode && !f.psychiatricSecondaryDescription && "table-row-hide-print"}`}
              >
                <td>Secondary</td>
                <td>{f.psychiatricSecondaryicdCode}</td>
                <td className="text-justify">
                  {f.psychiatricSecondaryDescription || ""}
                </td>
              </tr>

              <tr
                className={`${!f.psychiatricTertiaryIcdCode && !f.psychiatricTertiaryDescription && "table-row-hide-print"}`}
              >
                <td>Tertiary</td>
                <td>{f.psychiatricTertiaryIcdCode}</td>
                <td className="text-justify">
                  {" "}
                  {f.psychiatricTertiaryDescription || ""}
                </td>
              </tr>

              <tr
                className={`${!f.psychiatricAdditionalicdCode && !f.psychiatricAdditionalDescription && "table-row-hide-print"}`}
              >
                <td>Additional</td>
                <td>{f.psychiatricAdditionalicdCode}</td>
                <td className="text-justify">
                  {f.psychiatricAdditionalDescription || ""}
                </td>
              </tr>

              {f.psychiatricDiagnosesArray.map((i, index) => (
                <tr key={index}>
                  <td>{i?.name}</td>
                  <td className="pl-[20px]">{i?.icdCode}</td>
                  <td className="pl-[20px]">{i?.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12}>
          <Form.Label
            className={`fw-bold w-100 ${!f.primaryIcdCode && !f.primaryDescription && !f.secondaryicdCode && !f.secondaryDescription && !f.TertiaryIcdCode && !f.TertiaryDescription && !f.Additional1icdCode && !f.Additional1Description && "table-row-hide-print"}`}
          >
            Medical Diagnoses
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12}>
          <Table
            responsive
            bordered
            className={`${!f.primaryIcdCode && !f.primaryDescription && !f.secondaryicdCode && !f.secondaryDescription && !f.TertiaryIcdCode && !f.TertiaryDescription && !f.Additional1icdCode && !f.Additional1Description && "table-row-hide-print"}`}
          >
            <thead
              className={`${!f.primaryIcdCode && !f.primaryDescription && !f.secondaryicdCode && !f.secondaryDescription && !f.TertiaryIcdCode && !f.TertiaryDescription && !f.Additional1icdCode && !f.Additional1Description && "table-row-hide-print"}`}
            >
              <tr>
                <th>Medical Diagnoses</th>
                <th>ICD Code</th>
                <th className="w-50">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={`${!f.primaryIcdCode && !f.primaryDescription && "table-row-hide-print"}`}
              >
                <td>Primary*</td>
                <td>{f.primaryIcdCode}</td>
                <td className="text-justify">{f.primaryDescription || ""}</td>
              </tr>

              <tr
                className={`${!f.secondaryicdCode && !f.secondaryDescription && "table-row-hide-print"}`}
              >
                <td>Secondary</td>
                <td>{f.secondaryicdCode}</td>
                <td className="text-justify">{f.secondaryDescription || ""}</td>
              </tr>

              <tr
                className={`${!f.TertiaryIcdCode && !f.TertiaryDescription && "table-row-hide-print"}`}
              >
                <td>Tertiary</td>
                <td>{f.TertiaryIcdCode}</td>
                <td className="text-justify">{f.TertiaryDescription || ""}</td>
              </tr>

              <tr
                className={`${!f.Additional1icdCode && !f.Additional1Description && "table-row-hide-print"}`}
              >
                <td>Additional</td>
                <td>{f.Additional1icdCode}</td>
                <td className="text-justify">
                  {f.Additional1Description || ""}
                </td>
              </tr>

              {f.medicalDiagnosesArray.map((i, index) => (
                <tr key={index}>
                  <td>{i?.name}</td>
                  <td className="pl-[20px]">{i?.icdCode}</td>
                  <td className="pl-[20px]">{i?.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12}>
          <Form.Label
            className={`fw-bold w-100 ${!f.primarySupportGroup && !f.educationalProblems && !f.occupationalProblems && !f.sexualProblems && !f.maritalProblems && !f.housingProblems && !f.interactionWithLegalSystem && !f.otherBoolean && !f.accessToHealthCareServices && !f.familyProblems && !f.substanceUseInHome && "table-row-hide-print"}`}
          >
            Psychosocial or Environmental Stressors
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          md={12}
          className={`${!f.primarySupportGroup && !f.educationalProblems && !f.occupationalProblems && !f.sexualProblems && !f.maritalProblems && !f.housingProblems && !f.interactionWithLegalSystem && !f.otherBoolean && !f.accessToHealthCareServices && !f.familyProblems && !f.substanceUseInHome && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Problems with / related to :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Primary Support Group"
                  type="checkbox"
                  id="primarySupportGroup"
                  checked={f.primarySupportGroup}
                  onChange={() =>
                    f.setPrimarySupportGroup(!f.primarySupportGroup)
                  }
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Educational problems"
                  type="checkbox"
                  id="educationalProblems"
                  checked={f.educationalProblems}
                  onChange={() =>
                    f.setEducationalProblems(!f.educationalProblems)
                  }
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Occupational problems"
                  type="checkbox"
                  id="occupationalProblems"
                  checked={f.occupationalProblems}
                  onChange={() =>
                    f.setOccupationalProblems(!f.occupationalProblems)
                  }
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Sexual problems"
                  type="checkbox"
                  id="sexualProblems"
                  checked={f.sexualProblems}
                  onChange={() => f.setSexualProblems(!f.sexualProblems)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Marital problems"
                  type="checkbox"
                  id="maritalProblems"
                  checked={f.maritalProblems}
                  onChange={() => f.setMaritalProblems(!f.maritalProblems)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Housing problems"
                  type="checkbox"
                  id="housingProblems"
                  checked={f.housingProblems}
                  onChange={() => f.setHousingProblems(!f.housingProblems)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Interaction with legal system"
                  type="checkbox"
                  id="interactionWithLegalSystem"
                  checked={f.interactionWithLegalSystem}
                  onChange={() =>
                    f.setInteractionWithLegalSystem(
                      !f.interactionWithLegalSystem,
                    )
                  }
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Other (please specify)"
                  type="checkbox"
                  id="otherBoolean"
                  checked={f.otherBoolean}
                  onChange={() => f.setOtherBoolean(!f.otherBoolean)}
                />
                {f.otherBoolean && (
                  <AutoSize
                    value={f.otherStressors}
                    setValue={f.setOtherStressors}
                    placeholder={"_______________"}
                  />
                )}
              </div>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Access to health care services"
                  type="checkbox"
                  id="accessToHealthCareServices"
                  checked={f.accessToHealthCareServices}
                  onChange={() =>
                    f.setAccessToHealthCareServices(
                      !f.accessToHealthCareServices,
                    )
                  }
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Family problems"
                  type="checkbox"
                  id="familyProblems"
                  checked={f.familyProblems}
                  onChange={() => f.setFamilyProblems(!f.familyProblems)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Substance use in home"
                  type="checkbox"
                  id="substanceUseInHome"
                  checked={f.substanceUseInHome}
                  onChange={() =>
                    f.setSubstanceUseInHome(!f.substanceUseInHome)
                  }
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
          md={12}
          lg={12}
          className={`${f.setNoAndYes !== true && f.setNoAndYes !== false && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Significant recent losses :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="setSetNoAndYes"
                  checked={f.setNoAndYes === true}
                  onChange={() => f.setSetNoAndYes(true)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="No"
                  type="checkbox"
                  id="setSetNoAndYesno"
                  checked={f.setNoAndYes === false}
                  onChange={() => f.setSetNoAndYes(false)}
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
          md={12}
          lg={12}
          className={`${!f.death && !f.injury && !f.medicalSurgical && !f.job && !f.divorceSeparation && !f.accidentInjury && !f.childRemovedFromHouse && !f.violentActsAgainstPersonFamily && !f.otherSignificantRecentLosses && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                If yes, please check applicable loss(es) :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Death"
                  type="checkbox"
                  id="death"
                  checked={f.death}
                  onChange={() => f.setDeath(!f.death)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Injury"
                  type="checkbox"
                  id="injury"
                  checked={f.injury}
                  onChange={() => f.setInjury(!f.injury)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Medical/ surgical"
                  type="checkbox"
                  id="medicalSurgical"
                  checked={f.medicalSurgical}
                  onChange={() => f.setMedicalSurgical(!f.medicalSurgical)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Job"
                  type="checkbox"
                  id="job"
                  checked={f.job}
                  onChange={() => f.setJob(!f.job)}
                />{" "}
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Divorce / separation"
                  type="checkbox"
                  id="divorceSeparation"
                  checked={f.divorceSeparation}
                  onChange={() => f.setDivorceSeparation(!f.divorceSeparation)}
                />{" "}
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Accident /injury"
                  type="checkbox"
                  id="accidentInjury"
                  checked={f.accidentInjury}
                  onChange={() => f.setAccidentInjury(!f.accidentInjury)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Child removed from house"
                  type="checkbox"
                  id="childRemovedFromHouse"
                  checked={f.childRemovedFromHouse}
                  onChange={() =>
                    f.setChildRemovedFromHouse(!f.childRemovedFromHouse)
                  }
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Violent acts against person/family"
                  type="checkbox"
                  id="violentActsAgainstPersonFamily"
                  checked={f.violentActsAgainstPersonFamily}
                  onChange={() =>
                    f.setViolentActsAgainstPersonFamily(
                      !f.violentActsAgainstPersonFamily,
                    )
                  }
                />{" "}
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Other (please specify)"
                  type="checkbox"
                  id="otherSignificantRecentLosses"
                  checked={f.otherSignificantRecentLosses}
                  onChange={() =>
                    f.setOtherSignificantRecentLosses(
                      !f.otherSignificantRecentLosses,
                    )
                  }
                />
                {f.otherSignificantRecentLosses && (
                  <span className="pointer-events-none">
                    <AutoSize
                      value={f.otherSignificantRecentLossesType}
                      setValue={f.setOtherSignificantRecentLossesType}
                      placeholder={"_______________"}
                    />
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
          <div className="view-details-grid view-details-grid-inline my-1 mt-md-2 p-3 mb-3">
            <p className="view-label mb-1">Additional Notes : </p>
            <h5 className="view-value mb-0">{f.additionalNotes}</h5>
          </div>
          <div className="view-details-grid view-details-grid-inline my-1 mt-md-2 p-3 mb-3">
            <p className="view-label mb-1"> Clinical Summary : </p>
            <h5 className="view-value mb-0">{f.clinicalSummary}</h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12} xl={12}>
          <Card body className="mb-3 ">
            <Form.Label className="fw-bold">
              Treatment Recommendations
            </Form.Label>
            <div className="radio-inline">
              <Form.Check
                disabled
                inline
                label="BHRF"
                type="checkbox"
                id="BHRF"
                checked={f.treatmentRecommendations?.includes("BHRF")}
              />
              <Form.Check
                disabled
                inline
                label=" PHP"
                type="checkbox"
                id=" PHP"
                checked={f.treatmentRecommendations?.includes("PHP")}
              />
              {/* <Form.Check disabled inline
                                      label="Maladaptive physical or sexual behaviors"
                                      type="checkbox"
                                      id="maladaptivePhysical"
                                      checked={f.treatmentRecommendations?.includes("maladaptivePhysical")}
                                   
                                    /> */}
              <Form.Check
                disabled
                inline
                label="IOP"
                type="checkbox"
                id="IOP"
                checked={f.treatmentRecommendations?.includes("IOP")}
              />
              <Form.Check
                disabled
                inline
                label="Sober Living"
                type="checkbox"
                id="soberLiving"
                checked={f.treatmentRecommendations?.includes("soberLiving")}
              />
              <Form.Check
                disabled
                inline
                label="Assisted Living"
                type="checkbox"
                id="assistedLiving"
                checked={f.treatmentRecommendations?.includes("assistedLiving")}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Check
              label={`Yes, I ${f.residentName || f.getApiData?.data?.residentName} am in agreement with the
                      types and levels of services included in my behavior
                      plan.`}
              type="checkbox"
              checked={f.acceptResident === true}
              onChange={() => f.setAcceptResident(true)}
              disabled={f.Profile.userType !== ROLES.PATIENT}
              className={`${f.Profile.userType !== ROLES.PATIENT ? "pointer-events-none" : ""}`}
            />{" "}
            <Form.Check
              label={`No, I ${f.residentName || f.getApiData?.data?.residentName} disagree with the types
                      and/or levels of some or all of the services. By
                      checking this box, I ${f.residentName || f.getApiData?.data?.residentName} will receive
                      the services that I have agreed to receive and may
                      appeal the treatment team’s decision to not include
                      all the types and/ or levels of services that I have
                      requested.`}
              type="checkbox"
              disabled={f.Profile.userType !== ROLES.PATIENT}
              className={`${f.Profile.userType !== ROLES.PATIENT ? "pointer-events-none" : ""}`}
              checked={f.acceptResident === false}
              onChange={() => f.setAcceptResident(false)}
            />
          </Col>
        </Row>
      </Card>
      <div className={`mt-2`}>
        <Form.Label className="fw-bold w-100">
          Signature indicates participation and informed consent for treatment
          services.
        </Form.Label>
        <Row>
          <Col xs={12} sm={12} md={12}>
            <Form.Group>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">
                  {" "}
                  Resident/Representative First and Last Name :{" "}
                </p>
                <h5 className="view-value mb-0">{f.residentRepresentative}</h5>
              </div>
            </Form.Group>
          </Col>
          <Col xs={12} md={12}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">
                <span className="text-muted ms-1">
                  (By signing this document, I acknowledge that I was asked,
                  encouraged to participate in the initial assessment)
                </span>
              </p>
            </div>
          </Col>
        </Row>
      </div>
      <Row className="mt-3">
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className="text-end">
            {signatureFormat({
              sign: f.bhpSignature,
              time: f.bhpTime,
              date: f.bhpDate,
              hoursFormat: f.hoursFormat,
            })}
            {signatureFormat({
              sign: f.adminSignature,
              date: f.adminSignatureDate,
              time: f.adminSignatureTime,
              hoursFormat: f.hoursFormat,
            })}
          </div>
          <div className="text-end">
            {f.signers?.map(
              (signer) =>
                signer.signature && (
                  <div key={signer.signerId}>
                    {signatureFormat({
                      sign: signer.signature,
                      date: signer.dateSigned,
                      time: signer.signedTime,
                      hoursFormat: f.hoursFormat,
                    })}
                  </div>
                ),
            )}
          </div>
        </Col>
      </Row>
      <ResidentPrintSignature />
      <div className="signature-sections-inline mt-3">
        {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): hidden per client request. See documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */}
        {/* <SignatureSection role="bht" label="BHT Signature" variant="green" mode="view" signature={f.getApiData?.signatures?.bht} /> */}
        {/* <SignatureSection role="bhp" label="BHP Signature" variant="purple" mode="view" signature={f.getApiData?.signatures?.bhp} /> */}
        {/* <SignatureSection role="admin" label="Admin Signature" variant="pink" mode="view" signature={f.getApiData?.signatures?.admin} /> */}
        <SignatureSection
          role="resident"
          label="Resident/Representative Signature"
          variant="blue"
          mode="view"
          signature={f.getApiData?.signatures?.resident}
          signerNameOverride={
            f.residentName ||
            `${f.getApiData?.patientId?.firstName ?? ""} ${f.getApiData?.patientId?.lastName ?? ""}`.trim()
          }
        />
        <SignatureSection
          role="witness"
          label="Witness Signature"
          variant="yellow"
          mode="view"
          signature={f.getApiData?.signatures?.witness}
        />
      </div>
      <Row className="mt-3 text-center">
        <Col xs={12} md={12}>
          <div className="employee-btn-joiner hidePrint">
            <button
              className="employee_create_btn"
              type="button"
              onClick={f.print}
            >
              PRINT THIS FORM
            </button>
          </div>
        </Col>
      </Row>
    </>
  );
}
