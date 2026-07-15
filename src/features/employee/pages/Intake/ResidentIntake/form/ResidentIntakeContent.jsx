/** @format */
import React from "react";
import { AddSignatureForTable } from "@/utils/utils";
import NavWrapper from "@/utils/NavWrapper";
import { Container, Form } from "react-bootstrap";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import { fetchPaitentName } from "@/utils/utils";
import ResidentIntakeContentPart1 from "./ResidentIntakeContentPart1";
import ResidentIntakeContentPart2 from "./ResidentIntakeContentPart2";
import { useResidentIntakeFormContext } from "../context/ResidentIntakeFormContext";

const ResidentIntakeContent = () => {
  const props = useResidentIntakeFormContext();
  const {
    signaturePairs,
    editSignHandler,
    editDateHandler,
    editSignHandlerAllPages,
    editDateHandlerAllPages,
    typedGuardDialog,
    Cpage,
    setPage,
    page,
    id,
    setPatientId,
    setResidentName,
    setPatientDetail,
    getApiData,
    submitHandler,
    isNotEditableWithSigner,
  } = props;

  return (
    <>
      {typedGuardDialog}
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
      <Container className="resident-intake-print">
        {!id ? (
          <PatientComponent
            className={"resident-name-facesheet mb-2"}
            MainPatientId={setPatientId}
            MainResidentName={setResidentName}
            setWholeData={setPatientDetail}
          />
        ) : (
          <div className="resident-name-facesheet mb-2">
            <span className="increse-size fw-bold">Resident Name : </span>
            <span className="increse-size">
              {fetchPaitentName(getApiData?.data?.patientId)}
            </span>
          </div>
        )}
        <Form
          onSubmit={submitHandler}
          className={`intake-print ${isNotEditableWithSigner && "pe-none"}`}
        >
          <ResidentIntakeContentPart1 {...props} />
          <ResidentIntakeContentPart2 {...props} />
        </Form>
      </Container>
    </>
  );
};

export default ResidentIntakeContent;
