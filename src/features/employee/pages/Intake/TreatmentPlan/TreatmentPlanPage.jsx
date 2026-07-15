/** @format */

import React from "react";
import "@/features/resident/pages/Intake/FaceSheet/Facesheet.css";
import "@/features/resident/pages/Intake/PatientPanel/FormsUpperbar.css";
import "@/features/shared/features/intake/initialAssessment/InitialAssessment.css";
import { Container, Form, Row, Col } from "react-bootstrap";
import { AddSignature } from "@/utils/utils";
import { ROLES } from "@/features/shared/constants/index";
import { TreatmentPlanFormProvider } from "./context/TreatmentPlanFormContext";
import TreatmentPlanPatientSection from "./sections/TreatmentPlanPatientSection";
import TreatmentPlanProvidersGoalsSection from "./sections/TreatmentPlanProvidersGoalsSection";
import TreatmentPlanRiskAssessmentSection from "./sections/TreatmentPlanRiskAssessmentSection";
import TreatmentPlanCounselingSection from "./sections/TreatmentPlanCounselingSection";
import TreatmentPlanPsychosocialGoalsSection from "./sections/TreatmentPlanPsychosocialGoalsSection";
import TreatmentPlanObjectivesMeasuresSection from "./sections/TreatmentPlanObjectivesMeasuresSection";
import TreatmentPlanMedicationsSupportSection from "./sections/TreatmentPlanMedicationsSupportSection";
import TreatmentPlanSignaturesSubmitSection from "./sections/TreatmentPlanSignaturesSubmitSection";

export default function TreatmentPlanPage({ form: f }) {
  return (
    <TreatmentPlanFormProvider value={f}>
      <>
        {f.typedGuardDialog}
        <AddSignature
          show={f.signatureModel3}
          setValue={(sign) =>
            f.getApiData?.data?.employeeId === f.profileInfo?._id ||
            (!f.getApiData?.data?.employeeId &&
              f.url === "/treatment-plan" &&
              f.profileInfo?.userType === ROLES.EMPLOYEE)
              ? f.setsignatureBhp(sign)
              : f.editSignHandler(sign)
          }
          setDate={(date) =>
            f.getApiData?.data?.employeeId === f.profileInfo?._id ||
            (!f.getApiData?.data?.employeeId &&
              f.url === "/treatment-plan" &&
              f.profileInfo?.userType === ROLES.EMPLOYEE)
              ? f.setDateBhp(date)
              : f.editDateHandler(date)
          }
          setTime={(time) =>
            f.getApiData?.data?.employeeId === f.profileInfo?._id ||
            (!f.getApiData?.data?.employeeId &&
              f.url === "/treatment-plan" &&
              f.profileInfo?.userType === ROLES.EMPLOYEE)
              ? f.setTimeBhp(time)
              : f.editTimeHandler(time)
          }
        />
        <div ref={f.componentRef} className="treatment-plan-print">
          <Container className="hidePrint">
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
          <h1 className="pdfTitle hidden">
            {`${f.initialUpdate === "Initial" ? "Initial" : f.initialUpdate === "Update" ? "Update" : ""} Behavioral Health Treatment Plan`}
          </h1>
          <Container
            className={`hidePrint ${(f.saveAsDrafIsNotEditable || f.saveAsDrafIsNotEditableWithoutSigner || f.isNotEditableWithSigner) && "pe-none"}`}
          >
            <div className="therapy-notes-multiple-radio-wb mb-3">
              <div className="main hidePrint">
                <div className="form-check pl-0 pl-0">
                  <input
                    className="checkinput"
                    type="checkbox"
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
            <Form
              onSubmit={f.handlePost}
              className={`hidePrint ${(f.saveAsDrafIsNotEditable || f.saveAsDrafIsNotEditableWithoutSigner || f.isNotEditableWithSigner) && "pe-none"}`}
            >
              <TreatmentPlanPatientSection />
              <TreatmentPlanProvidersGoalsSection />
              <TreatmentPlanRiskAssessmentSection />
              <TreatmentPlanCounselingSection />
              <TreatmentPlanPsychosocialGoalsSection />
              <TreatmentPlanObjectivesMeasuresSection />
              <TreatmentPlanMedicationsSupportSection />
              <TreatmentPlanSignaturesSubmitSection />
            </Form>
          </Container>
        </div>
      </>
    </TreatmentPlanFormProvider>
  );
}
