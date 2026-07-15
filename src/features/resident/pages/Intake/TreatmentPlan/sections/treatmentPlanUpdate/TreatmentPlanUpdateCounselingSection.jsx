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
import { useTreatmentPlanUpdateFormContext } from "../../context/TreatmentPlanUpdateFormContext";

export default function TreatmentPlanUpdateCounselingSection() {
  const f = useTreatmentPlanUpdateFormContext();
  return (
    <>
      <div
        className={`${!f.minimumHoure && f.counselingOptions?.length < 1 && "hide-data-on-view-print"}`}
      >
        <Form.Label className="fw-bold w-100">
          Counseling Frequency and Duration
        </Form.Label>

        <Row>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={12}
            className={`${!f.minimumHoure && "hidePrint" && "hide-data-on-view-print"}`}
          >
            <div className="view-details-grid d-block my-1 my-md-2 p-3">
              <div className="view-details-grid-inline">
                <p className="view-label mb-1">Total of minimum : </p>
                <h5 className="view-value mb-0">{f.minimumHoure}</h5>
                <p className="view-label fw-bold mb-1 ms-sm-2">
                  Hours daily :{" "}
                </p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    className="pointer-events-none"
                    label="Group"
                    type="checkbox"
                    id="Group"
                    checked={f.counselingOptions.includes("Group")}
                    onChange={() => f.handleCheckboxChangeCounsiling("Group")}
                  />
                  <Form.Check
                    inline
                    className="pointer-events-none"
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
                    className="pointer-events-none"
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
                    className="pointer-events-none"
                    label="Other"
                    type="checkbox"
                    checked={f.counselingOptions.includes("Other")}
                    onChange={() => f.handleCheckboxChangeCounsiling("Other")}
                  />
                  {f.counselingOptionsTextBoolean && (
                    <span className="d-inline view-value">
                      {f.counselingOptionsText}
                    </span>
                  )}
                </div>
              </div>
              <div className="d-block">
                <div className="view-details-grid-inline">
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      className="pointer-events-none"
                      label="Individual Counseling: Minimum 1 hour session per week"
                      type="checkbox"
                      id="Individual Counseling: Minimum 1 hour session per week"
                      checked={f.counselingOptions.includes(
                        "Individual Counseling: Minimum 1 hour session per week",
                      )}
                      onChange={() =>
                        f.handleCheckboxChangeCounsiling(
                          "Individual Counseling: Minimum 1 hour session per week",
                        )
                      }
                    />
                    <Form.Check
                      inline
                      className="pointer-events-none"
                      label="8 minutes to 1 hour session every 2 weeks"
                      type="checkbox"
                      id="8 minutes to 1 hour session every 2 weeks"
                      checked={f.counselingOptions.includes(
                        "8 minutes to 1 hour session every 2 weeks",
                      )}
                      onChange={() =>
                        f.handleCheckboxChangeCounsiling(
                          "8 minutes to 1 hour session every 2 weeks",
                        )
                      }
                    />
                    {/* <Form.Check
                      inline
                      className="pointer-events-none"
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
                      className="pe-none"
                      type="checkbox"
                      id="Nonereported"
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
                      className="pe-none"
                      type="checkbox"
                      id="Family Counseling"
                      checked={f.counselingOptions.includes(
                        "Family Counseling",
                      )}
                      onChange={() =>
                        f.handleCheckboxChangeCounsiling("Family Counseling")
                      }
                    />
                    <Form.Check
                      inline
                      label="NA"
                      className="pe-none"
                      type="checkbox"
                      id="NA"
                      checked={f.counselingOptions.includes("NA")}
                      onChange={() => f.handleCheckboxChangeCounsiling("NA")}
                    />
                    <Form.Check
                      inline
                      label="AA"
                      className="pe-none"
                      type="checkbox"
                      id="AA"
                      checked={f.counselingOptions.includes("AA")}
                      onChange={() => f.handleCheckboxChangeCounsiling("AA")}
                    />
                    <Form.Check
                      inline
                      label="Monthly ART Meeting/Staffing"
                      className="pe-none"
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
                      className="pe-none"
                      type="checkbox"
                      id="WeeklyARTMeeting/Staffing"
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
                      className="pe-none"
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
                      <span className="d-inline view-value">
                        f.IndividualComment
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
