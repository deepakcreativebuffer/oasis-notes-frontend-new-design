/** @format */

import React from "react";
import "@/features/shared/features/intake/initialAssessment/ResidentInitialAssessment.css";
import FormUpper from "@/features/shared/features/intake/FormsUpperbar";
import { Container, Card, Row, Col, Form } from "react-bootstrap";
import { AddSignature } from "@/utils/utils";
import { ResidentInitialAssessmentFormProvider } from "./context/ResidentInitialAssessmentFormContext";
import ResidentSectionOnePatientView from "../../../components/Forms/sections/ResidentSectionOnePatientView";
import ResidentMedicalHistorySection from "./sections/ResidentMedicalHistorySection";
import ResidentSubstanceWithdrawalSection from "./sections/ResidentSubstanceWithdrawalSection";
import ResidentMentalStatusExamSection from "./sections/ResidentMentalStatusExamSection";
import ResidentSocialLivingSection from "./sections/ResidentSocialLivingSection";
import ResidentSafetyRiskDiagnosesSection from "./sections/ResidentSafetyRiskDiagnosesSection";
import ResidentSignaturesSubmitSection from "./sections/ResidentSignaturesSubmitSection";

export default function InitialAssessmentPage({ form: f }) {
  return (
    <ResidentInitialAssessmentFormProvider value={f}>
      <>
        {f.typedGuardDialog}
        <Container>
          <AddSignature
            show={f.showSignatureResident}
            setValue={f.setSignerSignature}
            setDate={f.setSignerDate}
            setTime={f.setSignerTime}
          />
          <div ref={f.componentRef} className="initial-assessment-print">
            <div className="page-title-bar mb-3 hidePrint">
              <Row className="align-items-center">
                <Col xs={2} lg="3">
                  <div className="d-flex align-items-center">
                    <img
                      onClick={() => f.navigate(-1)}
                      src="/back_button2.png"
                      alt=""
                      className="arrow cursor-pointer me-2"
                    />
                    <p className="m-0 fw-bold d-none d-md-inline-block">Back</p>
                  </div>
                </Col>
                <Col xs={8} lg="6">
                  <p className="heading mb-sm-0">Initial Assessment</p>
                </Col>
                <Col xs={2} lg="3"></Col>
              </Row>
            </div>
            <div className="initial-assessment">
              <FormUpper
                disabled={true}
                setAssessmentType={f.setAssessmentType}
                assessmentType={f.assessmentType}
              />
              <Card body className="mb-3 hidePrint">
                <p className="mb-0 text-sm">
                  <span>{f.companyName}</span>
                  <span className="pl-[10px]">has notified</span>
                  <span className="mx-1 view-value">{f.residentName}</span>
                  to participate in his/her Service Behavioral Health Treatment
                  Plan/Initial Assessment on
                  <span className="mx-1 view-value">{f.assessmentOn}</span>
                </p>
              </Card>
              <Form onSubmit={f.handleSubmit} className="mt-3">
                <div className="pointer-events-none">
                  <ResidentSectionOnePatientView />
                  <ResidentMedicalHistorySection />
                  <ResidentSubstanceWithdrawalSection />
                  <ResidentMentalStatusExamSection />
                  <ResidentSocialLivingSection />
                </div>
                <ResidentSafetyRiskDiagnosesSection />
                <ResidentSignaturesSubmitSection />
              </Form>
            </div>
          </div>
        </Container>
      </>
    </ResidentInitialAssessmentFormProvider>
  );
}
