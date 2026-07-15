/** @format */

import React from "react";
import { Card, Row, Col, Form, Table } from "react-bootstrap";
import { useViewInitialAssessmentForm } from "../formContext";

export default function EmploymentLivingSection() {
  const f = useViewInitialAssessmentForm();
  return (
    <>
      <Row className="mt-2">
        <Col
          xs={12}
          className={`${f.currentlyEmployed !== true && f.currentlyEmployed !== false && !f.employmentLocation && !f.workHistory && f.militaryService !== true && f.militaryService !== false && f.activeDuty !== true && f.activeDuty !== true && f.selectedValue.length < 1 && "table-row-hide-print"}`}
        >
          <Form.Label className="fw-bold mb-0 w-100">
            Employment history
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={6}
          className={`${f.currentlyEmployed !== true && f.currentlyEmployed !== false && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Currently employed : </p>
            <div className="radio-inline">
              <Form.Check
                disabled
                className="pointer-events-f.none"
                inline
                label="Yes"
                type="checkbox"
                id="currentlyEmployed"
                checked={f.currentlyEmployed === true}
                onChange={() => f.setCurrentlyEmployed(true)}
              />
              <Form.Check
                disabled
                className="pointer-events-f.none"
                inline
                label="No"
                type="checkbox"
                id="currentlyEmployedno"
                checked={f.currentlyEmployed === false}
                onChange={() => f.setCurrentlyEmployed(false)}
              />
            </div>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={6}
          className={`${!f.employmentLocation && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">If employed, where? FT or PT? : </p>
            <h5 className="view-value mb-0">{f.employmentLocation}</h5>
          </div>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className={`${!f.workHistory && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">
              Work History (and barriers to employment) :{" "}
            </p>
            <h5 className="view-value mb-0">{f.workHistory}</h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          lg={6}
          className={`${f.militaryService !== true && f.militaryService !== false && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="form-print-group-align-start print-bot-margin d-md-flex gap-2">
              <Form.Label className="fw-bold flex-shrink-0">
                Military History :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="militaryService"
                  checked={f.militaryService === true}
                  onChange={() => f.setMilitaryService(true)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="No"
                  type="checkbox"
                  id="militaryServiceno"
                  checked={f.militaryService === false}
                  onChange={() => f.setMilitaryService(false)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          lg={6}
          className={`${f.activeDuty !== true && f.activeDuty !== false && "table-row-hide-print"}`}
        >
          <Card body className="mb-2">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Currently on active duty? :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="activeDuty"
                  checked={f.activeDuty === true}
                  onChange={() => f.setActiveDuty(true)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="No"
                  type="checkbox"
                  id="activeDutyno"
                  checked={f.activeDuty === false}
                  onChange={() => f.setActiveDuty(false)}
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
          className={`${f.selectedValue.length < 1 && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3 gap-2">
            <p className="view-label mb-1">Criminal Justice Legal History : </p>
            <div className="view-value mb-0">
              <ul className="ps-3 mt-2 mb-0">
                {f.selectedValue?.map((i, index) => (
                  <li className="mb-2 list-disc" key={index}>
                    {i.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col xs={12}>
          <Form.Label className="fw-bold w-100">
            Current Independent Living Skills
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12}>
          <Table responsive bordered>
            <thead>
              <tr>
                <th>Type of Activity</th>
                <th>Good</th>
                <th>Fair</th>
                <th>Not so good</th>
                <th>Need assist</th>
                <th className="w-50">Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={`${f.BathingGood === undefined && f.BathingFair === undefined && f.BathingNotSoGood === undefined && "table-row-hide-print"}`}
              >
                <td>Bathing/Showering</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.BathingGood === true}
                    onChange={() => f.setBathingGood(!f.BathingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.BathingFair === true}
                    onChange={() => f.setBathingFair(!f.BathingFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.BathingNotSoGood === true}
                    onChange={() => f.setBathingNotSoGood(!f.BathingNotSoGood)}
                  />
                </td>
                <td>{f.BathingGoodNeedAssist ? "Yes" : "No"}</td>
                <td className="text-justify">{f.BathingComments}</td>
              </tr>

              <tr
                className={`${f.GroomingGood === undefined && f.GroomingFair === undefined && f.GroomingNotSoGood === undefined && "table-row-hide-print"}`}
              >
                <td>Grooming/hygiene</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.GroomingGood === true}
                    onChange={() => f.setGroomingGood(!f.GroomingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.GroomingFair === true}
                    onChange={() => f.setGroomingFair(!f.GroomingFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.GroomingNotSoGood === true}
                    onChange={() =>
                      f.setGroomingNotSoGood(!f.GroomingNotSoGood)
                    }
                  />
                </td>
                <td>{f.GroomingGoodNeedAssist ? "Yes" : "No"}</td>
                <td className="text-justify">{f.GroomingComments}</td>
              </tr>

              <tr
                className={`${f.MobilityGood === undefined && f.MobilityFair === undefined && f.MobilityNotSoGood === undefined && "table-row-hide-print"}`}
              >
                <td>Mobility</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.MobilityGood === true}
                    onChange={() => f.setMobilityGood(!f.MobilityGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.MobilityFair === true}
                    onChange={() => f.setMobilityFair(!f.MobilityFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.MobilityNotSoGood === true}
                    onChange={() =>
                      f.setMobilityNotSoGood(!f.MobilityNotSoGood)
                    }
                  />
                </td>
                <td>{f.MobilityGoodNeedAssist ? "Yes" : "No"}</td>
                <td className="text-justify">{f.MobilityComments}</td>
              </tr>

              <tr
                className={`${f.HouseworkGood === undefined && f.HouseworkFair === undefined && f.HouseworkNotSoGood === undefined && "table-row-hinde-print"}`}
              >
                <td>Housework</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.HouseworkGood === true}
                    onChange={() => f.setHouseworkGood(!f.HouseworkGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.HouseworkFair === true}
                    onChange={() => f.setHouseworkFair(!f.HouseworkFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.HouseworkNotSoGood === true}
                    onChange={() =>
                      f.setHouseworkNotSoGood(!f.HouseworkNotSoGood)
                    }
                  />
                </td>
                <td>{f.HouseworkGoodNeedAssist ? "Yes" : "No"}</td>
                <td className="text-justify">{f.HouseworkComments}</td>
              </tr>

              <tr
                className={`${f.ShoppingGood === undefined && f.ShoppingFair === undefined && f.ShoppingNotSoGood === undefined && "table-row-hinde-print"}`}
              >
                <td>Shopping</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ShoppingGood === true}
                    onChange={() => f.setShoppingGood(!f.ShoppingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ShoppingFair === true}
                    onChange={() => f.setShoppingFair(!f.ShoppingFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ShoppingNotSoGood === true}
                    onChange={() =>
                      f.setShoppingNotSoGood(!f.ShoppingNotSoGood)
                    }
                  />
                </td>
                <td>{f.ShoppingGoodNeedAssist ? "Yes" : "No"}</td>
                <td className="text-justify">{f.ShoppingComments}</td>
              </tr>

              <tr
                className={`${f.ManagingGood === undefined && f.ManagingFair === undefined && f.ManagingNotSoGood === undefined && "table-row-hinde-print"}`}
              >
                <td>Managing money/budget</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ManagingGood === true}
                    onChange={() => f.setManagingGood(!f.ManagingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ManagingFair === true}
                    onChange={() => f.setManagingFair(!f.ManagingFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ManagingNotSoGood === true}
                    onChange={() =>
                      f.setManagingNotSoGood(!f.ManagingNotSoGood)
                    }
                  />
                </td>
                <td>{f.ManagingGoodNeedAssist ? "Yes" : "No"}</td>
                <td className="text-justify">{f.ManagingComments}</td>
              </tr>

              <tr
                className={`${f.PreparingGood === undefined && f.PreparingFair === undefined && f.PreparingNotSoGood === undefined && "table-row-hinde-print"}`}
              >
                <td>Preparing food</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.PreparingGood === true}
                    onChange={() => f.setPreparingGood(!f.PreparingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.PreparingFair === true}
                    onChange={() => f.setPreparingFair(!f.PreparingFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.PreparingNotSoGood === true}
                    onChange={() =>
                      f.setPreparingNotSoGood(!f.PreparingNotSoGood)
                    }
                  />
                </td>
                <td>{f.PreparingGoodNeedAssist ? "Yes" : "No"}</td>
                <td className="text-justify">{f.PreparingComments}</td>
              </tr>

              <tr
                className={`${f.EatingGood === undefined && f.EatingFair === undefined && f.EatingNotSoGood === undefined && "table-row-hinde-print"}`}
              >
                <td>Eating</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.EatingGood === true}
                    onChange={() => f.setEatingGood(!f.EatingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.EatingFair === true}
                    onChange={() => f.setEatingFair(!f.EatingFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.EatingNotSoGood === true}
                    onChange={() => f.setEatingNotSoGood(!f.EatingNotSoGood)}
                  />
                </td>
                <td>{f.EatingGoodNeedAssist ? "Yes" : "No"}</td>
                <td className="text-justify">{f.EatingComments}</td>
              </tr>

              <tr
                className={`${f.ToiletingGood === undefined && f.ToiletingFair === undefined && f.ToiletingNotSoGood === undefined && "table-row-hinde-print"}`}
              >
                <td>Toileting</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ToiletingGood === true}
                    onChange={() => f.setToiletingGood(!f.ToiletingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ToiletingFair === true}
                    onChange={() => f.setToiletingFair(!f.ToiletingFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ToiletingNotSoGood === true}
                    onChange={() =>
                      f.setToiletingNotSoGood(!f.ToiletingNotSoGood)
                    }
                  />
                </td>
                <td>{f.ToiletingGoodNeedAssist ? "Yes" : "No"}</td>
                <td className="text-justify">{f.ToiletingComments}</td>
              </tr>

              <tr
                className={`${f.TakingGood === undefined && f.TakingFair === undefined && f.TakingNotSoGood === undefined && "table-row-hinde-print"}`}
              >
                <td>Taking medications</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.TakingGood === true}
                    onChange={() => f.setTakingGood(!f.TakingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.TakingFair === true}
                    onChange={() => f.setTakingFair(!f.TakingFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.TakingNotSoGood === true}
                    onChange={() => f.setTakingNotSoGood(!f.TakingNotSoGood)}
                  />
                </td>
                <td>{f.TakingGoodNeedAssist ? "Yes" : "No"}</td>
                <td className="text-justify">{f.TakingComments}</td>
              </tr>

              {f.handleRiskFactorActivityArray?.map((i, index) => (
                <tr key={index}>
                  <td>{i?.type}</td>

                  <td>
                    <Form.Check
                      disabled
                      inline
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={i.good === true}
                    />
                  </td>
                  <td>
                    <Form.Check
                      disabled
                      inline
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={i.fair === true}
                    />
                  </td>
                  <td>
                    <Form.Check
                      disabled
                      inline
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={i.otherCurrentNotSoGood === true}
                    />
                  </td>
                  <td>{` ${i.needAssist === true ? "Yes" : "No"}`} </td>
                  <td className="pl-[20px]"> {i.comments} </td>
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
          lg={12}
          className={`${f.fallRisk !== true && f.fallRisk !== false && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3 d-flex flex-column">
            <div>
              <p className="view-label mb-1 mb-md-2">Fall risk : </p>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="fallRisk"
                  checked={f.fallRisk === true}
                  onChange={() => f.setFallRisk(true)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="No"
                  type="checkbox"
                  id="fallRiskno"
                  checked={f.fallRisk === false}
                  onChange={() => f.setFallRisk(false)}
                />
              </div>
            </div>
            <div>
              <p className="view-label mb-1">If yes please explain : </p>
              <h5 className="view-value mb-0">{f.fallRiskExplanation}</h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          md={6}
          className={`${!f.triggers && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Triggers : </p>
            <h5 className="view-value mb-0">{f.triggers}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={6}
          xl={6}
          xxl={6}
          className={`${!f.hobbiesLeisureActivities && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Hobbies/Leisure Activities : </p>
            <h5 className="view-value mb-0">{f.hobbiesLeisureActivities}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={6}
          className={`mb-3 ${f.selectedValueMedical?.length < 1 && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3 h-100">
            <p className="view-label mb-1">Medical Equipment : </p>
            <div className="view-value mb-0">
              <ul className="ps-3 mt-2 mb-0">
                {f.selectedValueMedical?.map((i, index) => (
                  <li className="mb-2 list-disc" key={index}>
                    {i.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={6}
          className={`mb-3 ${f.selectedValueSpecialPrecautions?.length < 1 && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3 h-100">
            <p className="view-label mb-1">Special Precautions : </p>
            <div className="view-value mb-0">
              <ul className="ps-3 mt-2 mb-0">
                {f.selectedValueSpecialPrecautions?.map((i, index) => (
                  <li className="mb-2 list-disc" key={index}>
                    {i.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col xs={12}>
          <Form.Label
            className={`fw-bold w-100 ${f.currentThoughtsOfHarmingSelf !== true && f.currentThoughtsOfHarmingSelf !== false && "table-row-hide-print"}`}
          >
            Safety and Risk Assessment
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={6}
          className={`${f.currentThoughtsOfHarmingSelf !== true && f.currentThoughtsOfHarmingSelf !== false && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">
                Are you currently thinking about harming yourself or committing
                suicide? :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="currentThoughtsOfHarmingSelf"
                  checked={f.currentThoughtsOfHarmingSelf === true}
                  onChange={() => f.setCurrentThoughtsOfHarmingSelf(true)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="No"
                  type="checkbox"
                  id="currentThoughtsOfHarmingSelfno"
                  checked={f.currentThoughtsOfHarmingSelf === false}
                  onChange={() => f.setCurrentThoughtsOfHarmingSelf(false)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={6}
          className={`${f.currentThoughtsOfHarmingOthers !== true && f.currentThoughtsOfHarmingOthers !== false && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">
                Are you currently thinking about harming others or have
                homicidal thoughts? :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="currentThoughtsOfHarmingOthers"
                  checked={f.currentThoughtsOfHarmingOthers === true}
                  onChange={() => f.setCurrentThoughtsOfHarmingOthers(true)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="No"
                  type="checkbox"
                  id="currentThoughtsOfHarmingOthersno"
                  checked={f.currentThoughtsOfHarmingOthers === false}
                  onChange={() => f.setCurrentThoughtsOfHarmingOthers(false)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={6}
          className={`${!f.suicidalIdeation && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Ideation :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Fleeting"
                  type="checkbox"
                  checked={f.suicidalIdeation?.includes("Fleeting")}
                  onChange={() => f.setSuicidalIdeation("Fleeting")}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Periodic"
                  type="checkbox"
                  checked={f.suicidalIdeation?.includes("Periodic")}
                  onChange={() => f.setSuicidalIdeation("Periodic")}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Constant"
                  type="checkbox"
                  checked={f.suicidalIdeation?.includes("Constant")}
                  onChange={() => f.setSuicidalIdeation("Constant")}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="N/A"
                  type="checkbox"
                  checked={f.suicidalIdeation?.includes("N/A")}
                  onChange={() => f.setSuicidalIdeation("N/A")}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={6}
          className={`${f.suicidalIdeationUrgency !== true && f.suicidalIdeationUrgency !== false && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold">Urgency : </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="suicidalIdeationUrgency"
                  checked={f.suicidalIdeationUrgency === true}
                  onChange={() => f.setSuicidalIdeationUrgency(true)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="NO"
                  type="checkbox"
                  id="suicidalIdeationUrgencyno"
                  checked={f.suicidalIdeationUrgency === false}
                  onChange={() => f.setSuicidalIdeationUrgency(false)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          lg={6}
          className={`${f.suicidalIdeationSeverity !== false && f.suicidalIdeationSeverity !== true && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Severity :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="currentThoughtsOfHarmingSelf"
                  checked={f.suicidalIdeationSeverity === true}
                  onChange={() => f.setSuicidalIdeationSeverity(true)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="NO"
                  type="checkbox"
                  id="suicidalIdeationSeverityno"
                  checked={f.suicidalIdeationSeverity === false}
                  onChange={() => f.setSuicidalIdeationSeverity(false)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
    </>
  );
}
