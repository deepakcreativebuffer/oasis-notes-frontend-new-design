/** @format */
import React from "react";
import Draftinmodel from "@/features/resident/components/Modal/Draftinmodel";
import NavWrapper from "@/utils/NavWrapper";
import { Container, Form } from "react-bootstrap";
import ViewResidentIntakesContentPart1 from "./ViewResidentIntakesContentPart1";
import ViewResidentIntakesContentPart2 from "./ViewResidentIntakesContentPart2";

const ViewResidentIntakesContent = (props) => {
  const {
    draftModel,
    setDraftModel,
    Cpage,
    setPage,
    page,
    componentRef9,
    printRef,
    submitHandler,
  } = props;

  return (
    <>
      <div ref={printRef} tabIndex={0} className="outline-none">
        <NavWrapper
          title={
            page === 1
              ? "General consent for treatment"
              : page === 2
                ? "Internal Resident Disclosure List"
                : page === 3
                  ? "R9-10-711. Resident Rights"
                  : page === 4
                    ? "PHOTO/VIDEO CONSENT FORM"
                    : page === 5
                      ? "Advance Directives Form"
                      : page === 6
                        ? "Acknowledgement Of Complaint Process"
                        : page === 7
                          ? "ORIENTATION TO AGENCY"
                          : page === 8
                            ? "RECEIPT OF INFORMATION AT ADMISSION"
                            : page === 9
                              ? "HOUSE RULES ACKNOWLEDGEMENT"
                              : page === 10
                                ? "Resident Lock Box Key Issue and Return Optional"
                                : page === 11
                                  ? "INSURANCE INFORMATION"
                                  : "General consent for treatment"
          }
          isArrow={{
            state: Cpage,
            updater: setPage,
          }}
        />

        <Container>
          <div className="residentintakes-print" ref={componentRef9}>
            <Form onSubmit={submitHandler}>
              <ViewResidentIntakesContentPart1 {...props} />
              <ViewResidentIntakesContentPart2 {...props} />
            </Form>
          </div>
        </Container>
      </div>
      {draftModel && <Draftinmodel onClose={() => setDraftModel(false)} />}
    </>
  );
};

export default ViewResidentIntakesContent;
