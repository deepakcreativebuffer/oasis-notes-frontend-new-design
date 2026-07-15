/** @format */
import React from "react";
import { AddSignature } from "@/utils/utils";
import Draftinmodel from "../../../../components/Modal/Draftinmodel";
import NavWrapper from "@/utils/NavWrapper";
import { Container, Form } from "react-bootstrap";
import NursingAssessmentContentPart1 from "./NursingAssessmentContentPart1";
import NursingAssessmentContentPart2 from "./NursingAssessmentContentPart2";

const NursingAssessmentContent = (props) => {
  const {
    showSignatureResident,
    setSignerSignature,
    setSignerDate,
    setSignerTime,
    componentRef,
    draftModel,
    setDraftModel,
    handlePost,
  } = props;

  return (
    <>
      <AddSignature
        show={showSignatureResident}
        setValue={setSignerSignature}
        setDate={setSignerDate}
        setTime={setSignerTime}
      />
      <div ref={componentRef} className="nursing-form-print">
        <h1 className="pdfTitle mt-2 mb-0 hidden">Nursing Assessment</h1>
        <NavWrapper title={"Nursing Assessment"} isArrow={true} />
        <Container>
          <Form
            onSubmit={handlePost}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            className="mt-3 w-100"
          >
            <div className="view-details">
              <NursingAssessmentContentPart1 {...props} />
              <NursingAssessmentContentPart2 {...props} />
            </div>
          </Form>
        </Container>
      </div>
      {draftModel && <Draftinmodel onClose={() => setDraftModel(false)} />}
    </>
  );
};

export default NursingAssessmentContent;
