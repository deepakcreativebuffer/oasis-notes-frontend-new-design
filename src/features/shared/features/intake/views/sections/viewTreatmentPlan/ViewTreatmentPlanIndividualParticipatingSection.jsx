/** @format */

import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useViewTreatmentPlanFormContext } from "../../context/ViewTreatmentPlanFormContext";

export default function ViewTreatmentPlanIndividualParticipatingSection() {
  const f = useViewTreatmentPlanFormContext();
  return (
    <>
      <div
        className={`mt-2 ${!f.resident && !f.guardian && !f.staff && !f.bpn && !f.commentIndividual && "hide-data-on-view-print"}`}
      >
        <Row>
          <Col xs={12} md={12} lg={12}>
            <Form.Label className="fw-bold w-100">
              Individual Participating in Developing the Service Plan
            </Form.Label>
          </Col>
        </Row>
        <Row>
          {f.resident && (
            <Col
              xs={12}
              sm={12}
              md={6}
              lg={3}
              className={`${!f.resident && "hidePrint" && "hide-data-on-view-print"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Resident : </p>
                <h5 className="view-value mb-0">{f.resident}</h5>
              </div>
            </Col>
          )}
          {f.guardian && (
            <Col
              xs={12}
              sm={12}
              md={6}
              lg={3}
              className={`${!f.guardian && "hidePrint" && "hide-data-on-view-print"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Guardian : </p>
                <h5 className="view-value mb-0">{f.guardian}</h5>
              </div>
            </Col>
          )}
          {f.staff && (
            <Col
              xs={12}
              sm={12}
              md={6}
              lg={3}
              className={`${!f.staff && "hidePrint" && "hide-data-on-view-print"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Staff : </p>
                <h5 className="view-value mb-0">{f.staff}</h5>
              </div>
            </Col>
          )}
          {f.bpn && (
            <Col
              xs={12}
              sm={12}
              md={6}
              lg={3}
              className={`${!f.bpn && "hidePrint" && "hide-data-on-view-print"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">BHP : </p>
                <h5 className="view-value mb-0">{f.bpn}</h5>
              </div>
            </Col>
          )}
          {f.otherIndividual && (
            <Col
              xs={12}
              sm={12}
              md={6}
              lg={3}
              className={`${!f.otherIndividual && "hidePrint" && "hide-data-on-view-print"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Other : </p>
                <h5 className="view-value mb-0">{f.otherIndividual}</h5>
              </div>
            </Col>
          )}
          {f.commentIndividual && (
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={`${!f.commentIndividual && "hidePrint" && "hide-data-on-view-print"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Comment : </p>
                <h5 className="view-value mb-0">{f.commentIndividual}</h5>
              </div>
            </Col>
          )}
        </Row>
      </div>
      <div>
        <div className="view-details-grid d-block my-1 my-md-2 p-3">
          <p className="view-label fw-bold mb-1">
            Resident / Representative :{" "}
          </p>
          <div className="radio-inline">
            <Form.Check
              inline
              label="Yes, I am in agreement with the services included in this behavioral health treatment Plan"
              className="pe-none"
              type="checkbox"
              id="f.isReason"
              checked={f.isReason === "yes"}
              onChange={() =>
                f.setIsReason(f.isReason === "yes" ? "no" : "yes")
              }
            />{" "}
            <Form.Check
              inline
              label="No, I am not in agreement with the services included inthis behavioral health treatment Plan"
              className="pe-none"
              type="checkbox"
              id="f.refusalReason"
              checked={f.isReason === "no"}
              onChange={() => f.setIsReason(f.isReason === "no" ? "yes" : "no")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
