/** @format */

import React from "react";
import "@/assets/styles/Print.css";
import { Container, Form, Row, Col } from "react-bootstrap";
import Draftinmodel from "@/features/resident/components/Modal/Draftinmodel";
import { ViewTreatmentPlanFormProvider } from "./context/ViewTreatmentPlanFormContext";
import ViewTreatmentPlanPatientSection from "./sections/viewTreatmentPlan/ViewTreatmentPlanPatientSection";
import ViewTreatmentPlanProvidersGoalsSection from "./sections/viewTreatmentPlan/ViewTreatmentPlanProvidersGoalsSection";
import ViewTreatmentPlanRiskSection from "./sections/viewTreatmentPlan/ViewTreatmentPlanRiskSection";
import ViewTreatmentPlanCounselingSection from "./sections/viewTreatmentPlan/ViewTreatmentPlanCounselingSection";
import ViewTreatmentPlanPsychosocialGoalsPart1 from "./sections/viewTreatmentPlan/ViewTreatmentPlanPsychosocialGoalsPart1";
import ViewTreatmentPlanPsychosocialGoalsPart2 from "./sections/viewTreatmentPlan/ViewTreatmentPlanPsychosocialGoalsPart2";
import ViewTreatmentPlanSupportMedicationsSection from "./sections/viewTreatmentPlan/ViewTreatmentPlanSupportMedicationsSection";
import ViewTreatmentPlanIndividualParticipatingSection from "./sections/viewTreatmentPlan/ViewTreatmentPlanIndividualParticipatingSection";
import ViewTreatmentPlanSignaturesPrintSection from "./sections/viewTreatmentPlan/ViewTreatmentPlanSignaturesPrintSection";

export default function ViewTreatmentPlanPage({ form: f }) {
  return (
    <ViewTreatmentPlanFormProvider value={f}>
      <div ref={f.printRef} tabIndex={0} className="outline-none">
        <div className="hidePrint">
          <Container>
            <div className="page-title-bar mb-3">
              <Row className="align-items-center">
                <Col xs={2} lg="3">
                  <div className="d-flex align-items-center">
                    <img
                      onClick={() => f.navigate(-1)}
                      src="/back_button2.png"
                      alt=""
                      className="arrow cursor-pointer me-1 me-md-3"
                    />
                    <p className="m-0 fw-bold d-none d-md-inline-block">Back</p>
                  </div>
                </Col>
                <Col xs={8} lg="6">
                  <p className="heading mb-sm-0">
                    Behavioral Health Treatment Plan
                  </p>
                </Col>
                <Col xs={2} lg="3"></Col>
              </Row>
            </div>
          </Container>
        </div>
        <Container className="hidePrint">
          <div className="therapy-notes-multiple-radio-wb mb-3">
            <div className="main hidePrint">
              <div className="form-check pl-0">
                <input
                  className="checkinput"
                  type="checkbox"
                  disabled
                  checked={f.initialUpdate === "Initial"}
                  onChange={() => f.setInitialUpdate("Initial")}
                />
                <label className="mb-0">Initial</label>
              </div>
            </div>
            <div className="main hidePrint">
              <div className="form-check pl-0">
                <input
                  className="checkinput"
                  type="checkbox"
                  disabled
                  checked={f.initialUpdate === "Update"}
                  onChange={() => f.setInitialUpdate("Update")}
                  id="update"
                />
                <label className="mb-0">Update</label>
              </div>
            </div>
          </div>
        </Container>
        <Container>
          <div ref={f.componentRef} className="treatment-plan-print">
            <h1 className="pdfTitle my-3 hidden">
              {`${f.initialUpdate === "Initial" ? "Initial" : f.initialUpdate === "Update" ? "Update" : ""} Behavioral Health Treatment Plan`}
            </h1>
            <Form onSubmit={f.handlePost}>
              <div className="pointer-events-none">
                <ViewTreatmentPlanPatientSection />
                <ViewTreatmentPlanProvidersGoalsSection />
                <ViewTreatmentPlanRiskSection />
                <ViewTreatmentPlanCounselingSection />
                <ViewTreatmentPlanPsychosocialGoalsPart1 />
                <ViewTreatmentPlanPsychosocialGoalsPart2 />
                <ViewTreatmentPlanSupportMedicationsSection />
              </div>
              <ViewTreatmentPlanIndividualParticipatingSection />
              <ViewTreatmentPlanSignaturesPrintSection />
            </Form>
          </div>
        </Container>
        {f.draftModel && (
          <Draftinmodel onClose={() => f.setDraftModel(false)} />
        )}
      </div>
    </ViewTreatmentPlanFormProvider>
  );
}
