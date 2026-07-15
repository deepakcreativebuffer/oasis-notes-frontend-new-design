/** @format */

import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import { useInitialAssessmentFormContext } from "../context/InitialAssessmentFormContext";
export default function SocialDevelopmentEmploymentSection() {
  const f = useInitialAssessmentFormContext();
  return (
    <>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold">
            Significant Social/Developmental History:
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6} lg={4}>
          <Card body className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Childhood (include parents, siblings, family)
              </Form.Label>
              <Form.Control
                type="text"
                id="approvedby"
                value={f.significantSocialDevelopmentalHistory}
                placeholder="Enter "
                //required
                onChange={(e) =>
                  f.setSignificantSocialDevelopmentalHistory(e.target.value)
                }
                className={`${!f.significantSocialDevelopmentalHistory && "hidePrint"}`}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card body className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Highest level of education
              </Form.Label>
              <Form.Control
                type="text"
                id="approvedby"
                value={f.educationalHistory}
                placeholder="Enter here"
                //required
                className={`${!f.educationalHistory && "hidePrint"}`}
                onChange={(e) => f.setEducationalHistory(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card body className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Special education</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Yes"
                  type="checkbox"
                  name=""
                  id="educationYes"
                  checked={f.specialEducation === true}
                  onChange={() => f.setSpecialEducation(true)}
                />
                <Form.Check
                  inline
                  label="No"
                  type="checkbox"
                  name=""
                  id="educationNo"
                  checked={f.specialEducation === false}
                  onChange={() => f.setSpecialEducation(false)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row></Row>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} md={12}>
            <Form.Group>
              <Form.Label className="fw-bold">Currently a student?</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Yes"
                  type="checkbox"
                  name=""
                  id="studentYes"
                  checked={f.currentStudent === true}
                  onChange={() => f.setCurrentStudent(true)}
                />
                <Form.Check
                  inline
                  label="No"
                  id="studentNO"
                  type="checkbox"
                  checked={f.currentStudent === false}
                  onChange={() => f.setCurrentStudent(false)}
                />
              </div>
            </Form.Group>
          </Col>
          <Col xs={12} md={12}>
            <Form.Group>
              <Form.Label className="fw-bold">If yes, where?</Form.Label>
              <Form.Control
                type="text"
                value={f.ifYesWhere}
                placeholder="Enter text"
                //required
                className={`${!f.ifYesWhere && "hidePrint"}`}
                onChange={(e) => f.setIfYesWhere(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold">Employment history</Form.Label>
        </Col>
      </Row>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} md={12}>
            <Form.Group>
              <Form.Label className="fw-bold">Currently employed</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Yes"
                  type="checkbox"
                  id="currentlyEmployed"
                  checked={f.currentlyEmployed === true}
                  onChange={() => f.setCurrentlyEmployed(true)}
                />
                <Form.Check
                  inline
                  label="No"
                  type="checkbox"
                  id="currentlyEmployedno"
                  checked={f.currentlyEmployed === false}
                  onChange={() => f.setCurrentlyEmployed(false)}
                />
              </div>
            </Form.Group>
          </Col>
          <Col xs={12} md={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                If employed, where? FT or PT?
              </Form.Label>
              <Form.Control
                type="text"
                //required
                className={`${!f.employmentLocation && "hidePrint"}`}
                value={f.employmentLocation}
                placeholder="Enter text"
                onChange={(e) => f.setEmploymentLocation(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Row>
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Work History (and barriers to employment)
              </Form.Label>
              <Form.Control
                type="text"
                className={`${!f.workHistory && "hidePrint"}`}
                placeholder="Enter text"
                value={f.workHistory}
                onChange={(e) => f.setWorkHistory(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={6}>
          <Card body className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Military History</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Yes"
                  type="checkbox"
                  id="militaryService"
                  checked={f.militaryService === true}
                  onChange={() => f.setMilitaryService(true)}
                />
                <Form.Check
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
        <Col xs={12} lg={6}>
          <Card body className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                {" "}
                Currently on active duty?
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Yes"
                  type="checkbox"
                  id="activeDuty"
                  checked={f.activeDuty === true}
                  onChange={() => f.setActiveDuty(true)}
                />
                <Form.Check
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
        <Col xs={12} className={`${!f.selectedValue && "hidePrint"}`}>
          <Card body className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold w-100">
                Criminal Justice Legal History
              </Form.Label>
              <div className="hidePrint">
                <CustomMultiSelectInput
                  className="w-100 border-none outline-none"
                  value={f.selectedValue}
                  onChange={f.diagnosisSelect.selectedValueHandler}
                  options={f.diagnosisSelect.selectedValueOption}
                  isCreatable={true}
                  onKeyDown={f.diagnosisSelect.handleKeyDownSelectedValue}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
    </>
  );
}
