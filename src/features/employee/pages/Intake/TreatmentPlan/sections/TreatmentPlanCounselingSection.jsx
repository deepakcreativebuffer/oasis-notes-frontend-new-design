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

export default function TreatmentPlanCounselingSection() {
  const f = useTreatmentPlanFormContext();
  return (
    <>
      <Form.Label className="fw-bold">
        Counseling Frequency and Duration
      </Form.Label>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className="d-lg-flex align-items-center">
              <Form.Group className="mb-3 mb-md-0 d-md-flex align-items-center me-2 me-md-3">
                <Form.Label className="fw-bold flex-shirnk-0 mb-1">
                  Total of minimum
                </Form.Label>

                <BorderlessInput
                  className="ms-2 border-bottom px-2 mb-1 w-[60px]"
                  value={f.minimumHoure}
                  setState={f.setMinimumHoure}
                  placeholder=""
                  type="Number"
                />
              </Form.Group>
              <Form.Group className="mb-3 mb-md-0 d-md-flex align-items-center">
                <Form.Label className="fw-bold mb-md-1 me-2 me-md-3">
                  Hours daily
                </Form.Label>
                <Form.Check
                  inline
                  label="Group"
                  type="checkbox"
                  id="Group"
                  checked={f.counselingOptions.includes("Group")}
                  onChange={() => f.handleCheckboxChangeCounsiling("Group")}
                />
                <Form.Check
                  inline
                  label="3 times a day"
                  type="checkbox"
                  id="3 times a day"
                  checked={f.counselingOptions.includes("3 times a day")}
                  onChange={() =>
                    f.handleCheckboxChangeCounsiling("3 times a day")
                  }
                />
                <Form.Check
                  inline
                  label="4 times a day"
                  type="checkbox"
                  id="4 times a day"
                  checked={f.counselingOptions.includes("4 times a day")}
                  onChange={() =>
                    f.handleCheckboxChangeCounsiling("4 times a day")
                  }
                />
                <Form.Check
                  inline
                  label="Other"
                  type="checkbox"
                  checked={f.counselingOptions.includes("Other")}
                  onChange={() => f.handleCheckboxChangeCounsiling("Other")}
                  id="counselingOptionsOther"
                />
                {f.counselingOptionsTextBoolean && (
                  <BorderlessInput
                    value={f.counselingOptionsText}
                    setState={f.setCounselingOptionsOther}
                    placeholder=" "
                  />
                )}
              </Form.Group>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Individual Counseling: 8 minutes to 1 hour session per week"
                type="checkbox"
                id="Individual Counseling: 8 minutes to 1 hour session per week"
                checked={f.counselingOptions.includes(
                  "Individual Counseling: 8 minutes to 1 hour session per week",
                )}
                onChange={() =>
                  f.handleCheckboxChangeCounsiling(
                    "Individual Counseling: 8 minutes to 1 hour session per week",
                  )
                }
              />
              <Form.Check
                inline
                label="Individual Counseling: 8 minutes to 1 hour session every 2 weeks"
                type="checkbox"
                id="Individual Counseling: 8 minutes to 1 hour session every 2 weeks"
                checked={f.counselingOptions.includes(
                  "Individual Counseling: 8 minutes to 1 hour session every 2 weeks",
                )}
                onChange={() =>
                  f.handleCheckboxChangeCounsiling(
                    "Individual Counseling: 8 minutes to 1 hour session every 2 weeks",
                  )
                }
              />
              {/* <Form.Check
                inline
                label="Individual Therapy: As needed"
                type="checkbox"
                id="Individual Therapy: As needed"
                checked={f.counselingOptions.includes(
                  "Individual Therapy: As needed",
                )}
                onChange={() =>
                  f.handleCheckboxChangeCounsiling(
                    "Individual Therapy: As needed",
                  )
                }
              /> */}

              <Form.Check
                inline
                label="Resident decline individual therapy services"
                type="checkbox"
                id="counselingOptionsResidentDecline"
                checked={f.counselingOptions.includes(
                  "Resident decline individual therapy services",
                )}
                onChange={() =>
                  f.handleCheckboxChangeCounsiling(
                    "Resident decline individual therapy services",
                  )
                }
              />
              <Form.Check
                inline
                label="Family Counseling"
                type="checkbox"
                id="Family Counseling"
                checked={f.counselingOptions.includes("Family Counseling")}
                onChange={() =>
                  f.handleCheckboxChangeCounsiling("Family Counseling")
                }
              />
              <Form.Check
                inline
                label="NA"
                type="checkbox"
                id="NA"
                checked={f.counselingOptions.includes("NA")}
                onChange={() => f.handleCheckboxChangeCounsiling("NA")}
              />
              <Form.Check
                inline
                label="AA"
                type="checkbox"
                id="AA"
                checked={f.counselingOptions.includes("AA")}
                onChange={() => f.handleCheckboxChangeCounsiling("AA")}
              />
              <Form.Check
                inline
                label="Monthly ART Meeting/Staffing"
                type="checkbox"
                id="Monthly ART Meeting/Staffing"
                checked={f.counselingOptions.includes(
                  "Monthly ART Meeting/Staffing",
                )}
                onChange={() =>
                  f.handleCheckboxChangeCounsiling(
                    "Monthly ART Meeting/Staffing",
                  )
                }
              />
              <Form.Check
                inline
                label="Weekly ART Meeting/Staffing"
                type="checkbox"
                id="Weekly ART Meeting/Staffing"
                checked={f.counselingOptions.includes(
                  "Weekly ART Meeting/Staffing",
                )}
                onChange={() =>
                  f.handleCheckboxChangeCounsiling(
                    "Weekly ART Meeting/Staffing",
                  )
                }
              />
              <Form.Check
                inline
                label="Individual Therapy: Please Specify"
                type="checkbox"
                id="Individual Therapy: Please Specify"
                checked={f.counselingOptions.includes(
                  "Individual Therapy: Please Specify",
                )}
                onChange={() =>
                  f.handleCheckboxChangeCounsiling(
                    "Individual Therapy: Please Specify",
                  )
                }
              />
              {f.counselingOptions.includes(
                "Individual Therapy: Please Specify",
              ) && (
                <BorderlessInput
                  value={f.individualTherapy}
                  setState={f.setIndividualTherapy}
                  placeholder=" "
                />
              )}
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
}
