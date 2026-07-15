/** @format */
import React from "react";
import { AddSignature } from "@/utils/utils";
import Draftinmodel from "@/features/resident/components/Modal/Draftinmodel";
import NavWrapper from "@/utils/NavWrapper";
import { Container, Form } from "react-bootstrap";
import ViewNursingAssessmentContentPart1 from "./ViewNursingAssessmentContentPart1";
import ViewNursingAssessmentContentPart2 from "./ViewNursingAssessmentContentPart2";

const ViewNursingAssessmentContent = (props) => {
  const {
    printRef,
    showSignatureResident,
    setSignerSignature,
    setSignerDate,
    setSignerTime,
    componentRef,
    draftModel,
    setDraftModel,
  } = props;

  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <AddSignature
        show={showSignatureResident}
        setValue={setSignerSignature}
        setDate={setSignerDate}
        setTime={setSignerTime}
      />
      <NavWrapper title={"Nursing Assessment"} isArrow={true} />
      <Container>
        <div ref={componentRef} className="nursing-form-print">
          <h1 className="pdfTitle my-3 hidden">Nursing Assessment</h1>
          <Form className="w-100">
            <div className="view-details">
              <ViewNursingAssessmentContentPart1 {...props} />
              <ViewNursingAssessmentContentPart2 {...props} />
            </div>
          </Form>
        </div>
      </Container>
      {draftModel && <Draftinmodel onClose={() => setDraftModel(false)} />}
    </div>
  );
};

export default ViewNursingAssessmentContent;
