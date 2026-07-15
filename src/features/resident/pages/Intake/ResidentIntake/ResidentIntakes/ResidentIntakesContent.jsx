/** @format */
import React from "react";
import { AddSignatureForTable } from "@/utils/utils";
import Draftinmodel from "../../../../components/Modal/Draftinmodel";
import NavWrapper from "@/utils/NavWrapper";
import { Container, Form } from "react-bootstrap";
import ResidentIntakesContentPart1 from "./ResidentIntakesContentPart1";
import ResidentIntakesContentPart2 from "./ResidentIntakesContentPart2";

const ResidentIntakesContent = (props) => {
  const {
    signaturePairs,
    editSignHandler,
    editDateHandler,
    editSignHandlerAllPages,
    editDateHandlerAllPages,
    draftModel,
    setDraftModel,
    Cpage,
    setPage,
    page,
    componentRef9,
    submitHandler,
  } = props;

  return (
    <>
      {signaturePairs.map((i, index) => (
        <AddSignatureForTable
          key={index}
          show={i.show}
          setValue={(sign) =>
            i.page === 11
              ? editSignHandlerAllPages(sign)
              : editSignHandler(sign, i.page)
          }
          setDate={(date) =>
            i.page === 11
              ? editDateHandlerAllPages(date)
              : editDateHandler(date, i.page)
          }
          setShow={i.onHide}
        />
      ))}
      <div>
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

        <div className="residentintakes-print" ref={componentRef9}>
          <Container>
            <Form onSubmit={submitHandler}>
              <ResidentIntakesContentPart1 {...props} />
              <ResidentIntakesContentPart2 {...props} />
            </Form>
          </Container>
        </div>
        {draftModel && <Draftinmodel onClose={() => setDraftModel(false)} />}
      </div>
    </>
  );
};

export default ResidentIntakesContent;
