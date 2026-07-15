/* eslint-disable no-unused-vars */
/** @format */

import React from "react";
import { Card, Row, Col, Form, Button, Table } from "react-bootstrap";
import { useResidentInitialAssessmentFormContext } from "../context/ResidentInitialAssessmentFormContext";

export default function ResidentSocialLivingSection() {
  const f = useResidentInitialAssessmentFormContext();
  return (
    <>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold w-100">
            Significant Social/Developmental History:
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          lg={6}
          className={`${!f.significantSocialDevelopmentalHistory && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">
              Childhood (include parents, siblings, family) :
            </p>
            <h5 className="view-value mb-0">
              {f.significantSocialDevelopmentalHistory}
            </h5>
          </div>
        </Col>
        <Col
          xs={12}
          lg={6}
          className={`${!f.educationalHistory && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Highest level of education: </p>
            <h5 className="view-value mb-0">{f.educationalHistory}</h5>
          </div>
        </Col>
      </Row>
      <Row>
        {/* <Col xs={12} lg={6} className={`${!f.highestEducation && "table-row-hide-print"}`}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Highest level of education :</p>
                    <h5 className="view-value mb-0">
                      {f.highestEducation}
                    </h5>
                  </div>
                 </Col> */}
        <Col
          xs={12}
          lg={6}
          className={`${f.specialEducation !== true && f.specialEducation !== false && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Special education :</p>
            <div className="radio-inline">
              <Form.Check
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
          md={6}
          className={`${f.currentStudent !== true && f.currentStudent !== false && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Currently a student? : </p>
            <div className="radio-inline">
              <Form.Check
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
          md={6}
          className={`${!f.ifYesWhere && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">If yes, where? : </p>
            <h5 className="view-value mb-0">{f.ifYesWhere}</h5>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold w-100">Employment history</Form.Label>
        </Col>
      </Row>

      <Row>
        <Col
          xs={12}
          md={6}
          className={`${f.currentlyEmployed !== true && f.currentlyEmployed !== false && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Currently employed : </p>
            <div className="radio-inline">
              <Form.Check
                className="pointer-events-f.none"
                inline
                label="Yes"
                type="checkbox"
                id="currentlyEmployed"
                checked={f.currentlyEmployed === true}
                onChange={() => f.setCurrentlyEmployed(true)}
              />
              <Form.Check
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
          md={6}
          className={`${!f.employmentLocation && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">If employed, where? FT or PT? : </p>
            <h5 className="view-value mb-0">{f.employmentLocation}</h5>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xs={12} className={`${!f.workHistory && "table-row-hide-print"}`}>
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
          lg={12}
          className={`${!f.militaryService !== true && f.militaryService !== false && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Military History : </p>
            <div className="radio-inline">
              <Form.Check
                className="pointer-events-f.none"
                inline
                label="Yes"
                type="checkbox"
                id="militaryService"
                checked={f.militaryService === true}
                onChange={() => f.setMilitaryService(true)}
              />
              <Form.Check
                className="pointer-events-f.none"
                inline
                label="No"
                type="checkbox"
                id="militaryServiceno"
                checked={f.militaryService === false}
                onChange={() => f.setMilitaryService(false)}
              />
            </div>
          </div>
        </Col>
        <Col
          xs={12}
          lg={12}
          className={`${f.activeDuty !== true && f.activeDuty !== true && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Currently on active duty? : </p>
            <div className="radio-inline">
              <Form.Check
                className="pointer-events-f.none"
                inline
                label="Yes"
                type="checkbox"
                id="activeDuty"
                checked={f.activeDuty === true}
                onChange={() => f.setActiveDuty(true)}
              />
              <Form.Check
                className="pointer-events-f.none"
                inline
                label="No"
                type="checkbox"
                id="activeDutyno"
                checked={f.activeDuty === false}
                onChange={() => f.setActiveDuty(false)}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          className={`${f.selectedValue.length < 1 && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3 gap-2">
            <p className="view-label mb-1">Criminal Justice Legal History : </p>
            <h5 className="view-value mb-0">
              {f.selectedValue?.map((status) => status?.label).join(", ")}
            </h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold w-100">
            Current Independent Living Skills
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Table responsive="lg" bordered>
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
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.BathingGood === true}
                    onChange={() => f.setBathingGood(!f.BathingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.BathingFair === true}
                    onChange={() => f.setBathingFair(!f.BathingFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.BathingNotSoGood === true}
                    onChange={() => f.setBathingNotSoGood(!f.BathingNotSoGood)}
                  />
                </td>
                <td>{f.BathingGoodNeedAssist ? "Yes" : "No"}</td>
                <td>{f.BathingComments}</td>
              </tr>

              <tr
                className={`${f.GroomingGood === undefined && f.GroomingFair === undefined && f.GroomingNotSoGood === undefined && "table-row-hide-print"}`}
              >
                <td>Grooming/hygiene</td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.GroomingGood === true}
                    onChange={() => f.setGroomingGood(!f.GroomingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.GroomingFair === true}
                    onChange={() => f.setGroomingFair(!f.GroomingFair)}
                  />
                </td>
                <td>
                  <input
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.GroomingNotSoGood === true}
                    onChange={() =>
                      f.setGroomingNotSoGood(!f.GroomingNotSoGood)
                    }
                  />
                </td>
                <td>{f.GroomingGoodNeedAssist ? "Yes" : "No"}</td>
                <td>{f.GroomingComments}</td>
              </tr>
              <tr
                className={`${f.MobilityGood === undefined && f.MobilityFair === undefined && f.MobilityNotSoGood === undefined && "table-row-hide-print"}`}
              >
                <td>Mobility</td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.MobilityGood === true}
                    onChange={() => f.setMobilityGood(!f.MobilityGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.MobilityFair === true}
                    onChange={() => f.setMobilityFair(!f.MobilityFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.MobilityNotSoGood === true}
                    onChange={() =>
                      f.setMobilityNotSoGood(!f.MobilityNotSoGood)
                    }
                  />
                </td>
                <td>{f.MobilityGoodNeedAssist ? "Yes" : "No"}</td>
                <td>{f.MobilityComments}</td>
              </tr>

              <tr
                className={`${f.HouseworkGood === undefined && f.HouseworkFair === undefined && f.HouseworkNotSoGood === undefined && "table-row-hinde-print"}`}
              >
                <td>Housework</td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.HouseworkGood === true}
                    onChange={() => f.setHouseworkGood(!f.HouseworkGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.HouseworkFair === true}
                    onChange={() => f.setHouseworkFair(!f.HouseworkFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.HouseworkNotSoGood === true}
                    onChange={() =>
                      f.setHouseworkNotSoGood(!f.HouseworkNotSoGood)
                    }
                  />
                </td>
                <td>{f.HouseworkGoodNeedAssist ? "Yes" : "No"}</td>
                <td>{f.HouseworkComments}</td>
              </tr>

              <tr
                className={`${f.ShoppingGood === undefined && f.ShoppingFair === undefined && f.ShoppingNotSoGood === undefined && "table-row-hinde-print"}`}
              >
                <td>Shopping</td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ShoppingGood === true}
                    onChange={() => f.setShoppingGood(!f.ShoppingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ShoppingFair === true}
                    onChange={() => f.setShoppingFair(!f.ShoppingFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ShoppingNotSoGood === true}
                    onChange={() =>
                      f.setShoppingNotSoGood(!f.ShoppingNotSoGood)
                    }
                  />
                </td>
                <td>{f.ShoppingGoodNeedAssist ? "Yes" : "No"}</td>
                <td>{f.ShoppingComments}</td>
              </tr>

              <tr
                className={`${f.ManagingGood === undefined && f.ManagingFair === undefined && f.ManagingNotSoGood === undefined && "table-row-hinde-print"}`}
              >
                <td>Managing money/budget</td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ManagingGood === true}
                    onChange={() => f.setManagingGood(!f.ManagingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ManagingFair === true}
                    onChange={() => f.setManagingFair(!f.ManagingFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ManagingNotSoGood === true}
                    onChange={() =>
                      f.setManagingNotSoGood(!f.ManagingNotSoGood)
                    }
                  />
                </td>
                <td>{f.ManagingGoodNeedAssist ? "Yes" : "No"}</td>
                <td>{f.ManagingComments}</td>
              </tr>

              <tr
                className={`${f.PreparingGood === undefined && f.PreparingFair === undefined && f.PreparingNotSoGood === undefined && "table-row-hinde-print"}`}
              >
                <td>Preparing food</td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.PreparingGood === true}
                    onChange={() => f.setPreparingGood(!f.PreparingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.PreparingFair === true}
                    onChange={() => f.setPreparingFair(!f.PreparingFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.PreparingNotSoGood === true}
                    onChange={() =>
                      f.setPreparingNotSoGood(!f.PreparingNotSoGood)
                    }
                  />
                </td>
                <td>{f.PreparingGoodNeedAssist ? "Yes" : "No"}</td>
                <td>{f.PreparingComments}</td>
              </tr>

              <tr
                className={`${f.EatingGood === undefined && f.EatingFair === undefined && f.EatingNotSoGood === undefined && "table-row-hinde-print"}`}
              >
                <td>Eating</td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.EatingGood === true}
                    onChange={() => f.setEatingGood(!f.EatingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.EatingFair === true}
                    onChange={() => f.setEatingFair(!f.EatingFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.EatingNotSoGood === true}
                    onChange={() => f.setEatingNotSoGood(!f.EatingNotSoGood)}
                  />
                </td>
                <td>{f.EatingGoodNeedAssist ? "Yes" : "No"}</td>
                <td>{f.EatingComments}</td>
              </tr>

              <tr
                className={`${f.ToiletingGood === undefined && f.ToiletingFair === undefined && f.ToiletingNotSoGood === undefined && "table-row-hinde-print"}`}
              >
                <td>Toileting</td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ToiletingGood === true}
                    onChange={() => f.setToiletingGood(!f.ToiletingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ToiletingFair === true}
                    onChange={() => f.setToiletingFair(!f.ToiletingFair)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ToiletingNotSoGood === true}
                    onChange={() =>
                      f.setToiletingNotSoGood(!f.ToiletingNotSoGood)
                    }
                  />
                </td>
                <td>{f.ToiletingGoodNeedAssist ? "Yes" : "No"}</td>
                <td>{f.ToiletingComments}</td>
              </tr>

              <tr
                className={`${f.TakingGood === undefined && f.TakingFair === undefined && f.TakingNotSoGood === undefined && "table-row-hinde-print"}`}
              >
                <td>Taking medications</td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.TakingGood === true}
                    onChange={() => f.setTakingGood(!f.TakingGood)}
                  />
                </td>
                <td>
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.TakingFair === true}
                    onChange={() => f.setTakingFair(!f.TakingFair)}
                  />
                </td>
                <td>
                  <input
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.TakingNotSoGood === true}
                    onChange={() => f.setTakingNotSoGood(!f.TakingNotSoGood)}
                  />
                </td>
                <td>{f.TakingGoodNeedAssist ? "Yes" : "No"}</td>
                <td>{f.TakingComments}</td>
              </tr>

              {f.handleRiskFactorActivityArray?.map((i, index) => (
                <tr key={index}>
                  <td>{i?.type}</td>

                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={i.good === true}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={i.fair === true}
                    />
                  </td>
                  <td>
                    <Form.Check
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
          sm={6}
          md="6"
          className={`${!f.triggers && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Triggers : </p>
            <h5 className="view-value mb-0">{f.triggers}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          md="12"
          lg={6}
          className={`${!f.hobbiesLeisureActivities && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Hobbies/Leisure Activities : </p>
            <h5 className="view-value mb-0">{f.hobbiesLeisureActivities}</h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          md="12"
          lg={6}
          className={`${f.selectedValueMedical?.length < 1 && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Medical Equipment : </p>
            <h5 className="view-value mb-0">
              {f.selectedValueMedical
                ?.map((status) => status?.label)
                .join(", ")}
            </h5>
          </div>
        </Col>
        <Col
          xs={12}
          md="12"
          lg={6}
          className={`${f.selectedValueSpecialPrecautions?.length < 1 && "table-row-hide-print"}`}
        >
          <div className="view-details-grid my-1 view-details-grid-inline my-md-2 p-3">
            <p className="view-label mb-1">Special Precautions : </p>
            <h5 className="view-value mb-0">
              {f.selectedValueSpecialPrecautions
                ?.map((status) => status?.label)
                .join(", ")}
            </h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xxl={12}
          className={`${f.fallRisk !== true && f.fallRisk !== false && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3 d-flex flex-column">
            <div>
              <p className="view-label mb-1">Fall risk : </p>
              <div className="radio-inline">
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="fallRisk"
                  checked={f.fallRisk === true}
                  onChange={() => f.setFallRisk(true)}
                />
                <Form.Check
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
    </>
  );
}
