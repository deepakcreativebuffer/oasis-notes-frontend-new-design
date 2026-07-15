/** @format */

import React from "react";
import FormUpper from "../../FormsUpperbar";
import { Container, Card, Row, Col, Form } from "react-bootstrap";
import "@/assets/styles/Print.css";
import "../../initialAssessment/InitialAssessment.css";
import { AddSignature } from "@/utils/utils";
import HOC from "@/features/shared/layout/Inner/HOC";
import { ViewInitialAssessmentFormContext } from "./formContext";
import { useViewInitialAssessment } from "./useViewInitialAssessment";
import PatientAdmissionSection from "./sections/PatientAdmissionSection";
import MedicalHistorySection from "./sections/MedicalHistorySection";
import SubstanceAbuseSection from "./sections/SubstanceAbuseSection";
import WithdrawalMseIntroSection from "./sections/WithdrawalMseIntroSection";
import MentalStatusExamSection from "./sections/MentalStatusExamSection";
import EmploymentLivingSection from "./sections/EmploymentLivingSection";
import SafetyRiskSection from "./sections/SafetyRiskSection";
import DiagnosesSignaturesSection from "./sections/DiagnosesSignaturesSection";

const ViewInitialAssessment = () => {
  const form = useViewInitialAssessment();
  const {
    printRef,
    componentRef,
    showSignatureResident,
    setSignerSignature,
    setSignerDate,
    setSignerTime,
    handleSubmit,
    assessmentType,
    setAssessmentType,
    companyName,
    residentName,
    assessmentOn,
  } = form;

  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <Container>
        <AddSignature
          show={showSignatureResident}
          setValue={setSignerSignature}
          setDate={setSignerDate}
          setTime={setSignerTime}
        />
        <div ref={componentRef} className="initial-assessment-print">
          <div className="page-title-bar mb-3 hidePrint">
            <Row className="align-items-center">
              <Col xs={2} lg="3">
                <div className="d-flex align-items-center">
                  <img
                    onClick={() => form.navigate(-1)}
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
            <ViewInitialAssessmentFormContext.Provider value={form}>
              <FormUpper
                disabled
                setAssessmentType={setAssessmentType}
                assessmentType={assessmentType}
              />
              <Card body className="mb-3">
                <p className="mb-0 text-sm">
                  <span>{companyName}</span> <span>has notified</span>
                  <span className="mx-1">{residentName}</span>
                  to participate in his/her Service Behavioral Health Treatment
                  Plan/Initial Assessment on
                  <span className="mx-1">{assessmentOn}</span>
                </p>
              </Card>
              <Form onSubmit={handleSubmit} className="mt-3">
                <PatientAdmissionSection />
                <MedicalHistorySection />
                <SubstanceAbuseSection />
                <WithdrawalMseIntroSection />
                <MentalStatusExamSection />
                <EmploymentLivingSection />
                <SafetyRiskSection />
                <DiagnosesSignaturesSection />
              </Form>
            </ViewInitialAssessmentFormContext.Provider>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HOC({
  Wcomponenet: ViewInitialAssessment,
});
