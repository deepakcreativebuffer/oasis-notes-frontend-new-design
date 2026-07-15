/** @format */

import React from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import { AddSignature } from "@/utils/utils";
import Draftinmodel from "../../../components/Modal/Draftinmodel";
import { TreatmentPlanUpdateFormProvider } from "./context/TreatmentPlanUpdateFormContext";
import TreatmentPlanUpdatePatientSection from "./sections/treatmentPlanUpdate/TreatmentPlanUpdatePatientSection";
import TreatmentPlanUpdateProvidersGoalsSection from "./sections/treatmentPlanUpdate/TreatmentPlanUpdateProvidersGoalsSection";
import TreatmentPlanUpdateRiskSection from "./sections/treatmentPlanUpdate/TreatmentPlanUpdateRiskSection";
import TreatmentPlanUpdateCounselingSection from "./sections/treatmentPlanUpdate/TreatmentPlanUpdateCounselingSection";
import TreatmentPlanUpdatePsychosocialGoalsPart1 from "./sections/treatmentPlanUpdate/TreatmentPlanUpdatePsychosocialGoalsPart1";
import TreatmentPlanUpdatePsychosocialGoalsPart2 from "./sections/treatmentPlanUpdate/TreatmentPlanUpdatePsychosocialGoalsPart2";
import TreatmentPlanUpdateSupportMedicationsSection from "./sections/treatmentPlanUpdate/TreatmentPlanUpdateSupportMedicationsSection";
import TreatmentPlanUpdateIndividualParticipatingSection from "./sections/treatmentPlanUpdate/TreatmentPlanUpdateIndividualParticipatingSection";
import TreatmentPlanUpdateSignaturesSubmitSection from "./sections/treatmentPlanUpdate/TreatmentPlanUpdateSignaturesSubmitSection";

export default function TreatmentPlanUpdatePage({ form: f }) {
  return (
    <TreatmentPlanUpdateFormProvider value={f}>
      <>
        {f.typedGuardDialog}
        <AddSignature
          show={f.signatureModel3}
          setValue={f.setSignerSignature}
          setDate={f.setSignerDate}
          setTime={f.setSignerTime}
        />
        <div ref={f.componentRef} className="treatment-plan-print">
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
                      <p className="m-0 fw-bold d-none d-md-inline-block">
                        Back
                      </p>
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
          <h1 className="pdfTitle hidden">
            {`${f.initialUpdate === "Initial" ? "Initial" : f.initialUpdate === "Update" ? "Update" : ""} Behavioral Health Treatment Plan`}
          </h1>
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
            <Form onSubmit={f.handlePost}>
              <TreatmentPlanUpdatePatientSection />
              <TreatmentPlanUpdateProvidersGoalsSection />
              <TreatmentPlanUpdateRiskSection />
              <TreatmentPlanUpdateCounselingSection />
              <TreatmentPlanUpdatePsychosocialGoalsPart1 />
              <TreatmentPlanUpdatePsychosocialGoalsPart2 />
              <TreatmentPlanUpdateSupportMedicationsSection />
              <TreatmentPlanUpdateIndividualParticipatingSection />
              <TreatmentPlanUpdateSignaturesSubmitSection />
            </Form>
          </Container>
          {f.draftModel && (
            <Draftinmodel onClose={() => f.setDraftModel(false)} />
          )}
        </div>
      </>
    </TreatmentPlanUpdateFormProvider>
  );
}
