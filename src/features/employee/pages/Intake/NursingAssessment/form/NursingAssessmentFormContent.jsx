/** @format */
import React from "react";
import { AddSignature } from "@/utils/utils";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import { ROLES } from "@/features/shared/constants/index";
import NursingAssessmentFormContentPart1 from "./NursingAssessmentFormContentPart1";
import NursingAssessmentFormContentPart2 from "./NursingAssessmentFormContentPart2";

const NursingAssessmentFormContent = (props) => {
  const {
    showSingInTwo,
    getApiData,
    profileInfo,
    url,
    setRnSignature,
    editSignHandler,
    setrnDate,
    editDateHandler,
    setRnTime,
    editTimeHandler,
    componentRef,
    handlePost,
    saveAsDrafIsNotEditable,
    saveAsDrafIsNotEditableWithoutSigner,
    isNotEditableWithSigner,
    id,
    setName,
    name,
    setPatientId,
    setResidentName,
    setPatientDetail,
    navigate,
  } = props;

  return (
    <>
      <AddSignature
        show={showSingInTwo}
        setValue={(sign) =>
          getApiData?.data?.employeeId === profileInfo?._id ||
          (!getApiData?.data?.employeeId &&
            url === "/nursing-assessment" &&
            profileInfo?.userType === ROLES.EMPLOYEE)
            ? setRnSignature(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          getApiData?.data?.employeeId === profileInfo?._id ||
          (!getApiData?.data?.employeeId &&
            url === "/nursing-assessment" &&
            profileInfo?.userType === ROLES.EMPLOYEE)
            ? setrnDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          getApiData?.data?.employeeId === profileInfo?._id ||
          (!getApiData?.data?.employeeId &&
            url === "/nursing-assessment" &&
            profileInfo?.userType === ROLES.EMPLOYEE)
            ? setRnTime(time)
            : editTimeHandler(time)
        }
      />

      <div ref={componentRef} className="nursing-form-print">
        <h1 className="pdfTitle mt-2 mb-0 hidden">Nursing Assessment</h1>
        <Container>
          <div className="page-title-bar hidePrint">
            <Row className="align-items-center">
              <Col xs={2} lg="3">
                <div className="d-flex align-items-center">
                  <img
                    onClick={() => navigate(-1)}
                    src="/back_button2.png"
                    alt=""
                    className="arrow cursor-pointer me-1 me-md-3"
                  />
                  <p className="m-0 fw-bold d-none d-md-inline-block">Back</p>
                </div>
              </Col>
              <Col xs={8} lg="6">
                <p className="heading mb-sm-0">Nursing Assessment</p>
              </Col>
              <Col xs={2} lg="3"></Col>
            </Row>
          </div>
          <Form
            onSubmit={handlePost}
            className={`mt-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <Row>
              <Col xs={12}>
                {id ? (
                  <>
                    <Card body className="mb-2 print-shadow-none">
                      <Form.Group className={"resident-name-print w-100"}>
                        <Form.Label className="fw-bold increse-size flex-shrink-0">
                          {" "}
                          Resident’s Full Name:
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="dateOfBirth"
                          className={`increse-size ${!name && "hidePrint"}`}
                          value={name}
                          placeholder="Enter name"
                          required
                          onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                    </Card>
                  </>
                ) : (
                  <PatientComponent
                    MainPatientId={setPatientId}
                    MainResidentName={setResidentName}
                    setWholeData={setPatientDetail}
                  />
                )}
              </Col>
            </Row>
            <NursingAssessmentFormContentPart1 {...props} />
            <NursingAssessmentFormContentPart2 {...props} />
          </Form>
        </Container>
      </div>
    </>
  );
};

export default NursingAssessmentFormContent;
