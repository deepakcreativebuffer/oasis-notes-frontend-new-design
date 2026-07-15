/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { Card, Row, Col, Form, Table, Button } from "react-bootstrap";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";

/**
 * Significant family history + mental health treatment history.
 */
export default function FamilyMentalHealthSection(props) {
  const {
    SignificantFamilyMedicalPsychiatricHistory,
    SignificantFamilyMedicalPsychiatricHistoryHandler,
    SignificantFamilyMedicalPsychiatricHistoryOptions,
    handleKeySignificantFamilyMedicalPsychiatricHistory,
    mentalHealthTreatmentHistoryTypeOfService,
    mentalHealthTreatmentHistoryTypeOfServiceHandler,
    mentalHealthTreatmentHistoryTypeOfServiceOption,
    handleKeyMentalHealthTreatmentHistoryTypeOfService,
    mentalHealthTreatmentHistoryWhere,
    setMentalHealthTreatmentHistoryWhere,
    mentalHealthTreatmentHistoryDates,
    setMentalHealthTreatmentHistoryDates,
    mentalHealthTreatmentHistoryDiagnosisReason,
    mentalHealthTreatmentHistoryDiagnosisReasonHandler,
    mentalHealthTreatmentHistoryDiagnosisReasonOption,
    handleKeyDownMentalHealthTreatmentHistoryDiagnosisReason,
    handleTypeOfService,
    typeOfServiceArray,
    handleRemoveItem,
    canDelete,
  } = props;

  return (
    <>
      <Row>
        <Col
          xs={12}
          className={`${!SignificantFamilyMedicalPsychiatricHistory && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Label className="fw-bold w-100">
              Significant Family Medical/Psychiatric History:
            </Form.Label>
            <div className="hidePrint">
              <CustomMultiSelectInput
                className="w-100 border-none outline-none"
                value={SignificantFamilyMedicalPsychiatricHistory}
                onChange={SignificantFamilyMedicalPsychiatricHistoryHandler}
                options={SignificantFamilyMedicalPsychiatricHistoryOptions}
                isCreatable={true}
                onKeyDown={handleKeySignificantFamilyMedicalPsychiatricHistory}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col
          xs={12}
          sm={12}
          className={`${!mentalHealthTreatmentHistoryTypeOfService && "hidePrint"}`}
        >
          <Form.Label className="fw-bold">
            Mental Health Treatment History (in Resident hospitalization,
            partial hospitalization, out Resident, etc) :
          </Form.Label>
          <Card body className="mb-3">
            <Form.Label className="fw-bold w-100">Type of Service</Form.Label>

            <div className="hidePrint">
              <CustomMultiSelectInput
                className="w-100 border-none outline-none"
                value={mentalHealthTreatmentHistoryTypeOfService}
                onChange={mentalHealthTreatmentHistoryTypeOfServiceHandler}
                options={mentalHealthTreatmentHistoryTypeOfServiceOption}
                isCreatable={true}
                onKeyDown={handleKeyMentalHealthTreatmentHistoryTypeOfService}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={6}
          className={`${!mentalHealthTreatmentHistoryWhere && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Where</Form.Label>
              <Form.Control
                type="text"
                value={mentalHealthTreatmentHistoryWhere}
                placeholder="Enter text"
                onChange={(e) =>
                  setMentalHealthTreatmentHistoryWhere(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={6}
          className={`${!mentalHealthTreatmentHistoryDates && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="d-flex flex-column">
              <Form.Label className="fw-bold">Dates</Form.Label>
              <Form.Control
                type="text"
                id="approvedby"
                value={mentalHealthTreatmentHistoryDates}
                placeholder="Enter Date"
                onChange={(e) =>
                  setMentalHealthTreatmentHistoryDates(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className={`${!mentalHealthTreatmentHistoryDiagnosisReason && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold w-100">
                Diagnosis/Reason for Treatment
              </Form.Label>

              <div className="hidePrint">
                <CustomMultiSelectInput
                  className="w-100"
                  placeholder="Select Multiple Type"
                  value={mentalHealthTreatmentHistoryDiagnosisReason}
                  onChange={mentalHealthTreatmentHistoryDiagnosisReasonHandler}
                  options={mentalHealthTreatmentHistoryDiagnosisReasonOption}
                  isCreatable={true}
                  onKeyDown={
                    handleKeyDownMentalHealthTreatmentHistoryDiagnosisReason
                  }
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>

      <Row className="mb-3 hidePrint">
        <Col xs={12} className="text-center">
          <Button
            type="button"
            className="theme-button"
            onClick={handleTypeOfService}
          >
            Add
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md="12">
          {typeOfServiceArray.length > 0 && (
            <Table responsive="lg" bordered>
              <thead>
                <tr>
                  <th>Type of Services</th>
                  <th>Where</th>
                  <th>Dates</th>
                  <th>Diagnosis/Reason for Treatment </th>
                  {canDelete && <th className="hidePrint">Action</th>}
                </tr>
              </thead>
              <tbody>
                {typeOfServiceArray?.map((i, index) => (
                  <tr
                    key={index}
                    className={`${!(i?.diagnosisReason || i?.where || i?.dates || i?.typeOfService) && "hidePrint"}`}
                  >
                    <td>
                      {i?.typeOfService?.map((item) => (
                        <p key={item?.value}>{item?.value}</p>
                      ))}
                    </td>
                    <td>{`${i?.where}`} </td>
                    <td>{`${i?.dates}`}</td>
                    <td className={`${!i?.diagnosisReason && "hidePrint"}`}>
                      {i?.diagnosisReason?.map((item) => (
                        <p key={item?.value}>{item?.value}</p>
                      ))}
                    </td>
                    {canDelete && (
                      <td className="hidePrint">
                        <div className="icon-joiner">
                          <Link className="del-btn">
                            <AiFillDelete
                              onClick={() => handleRemoveItem(index)}
                            />{" "}
                          </Link>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  );
}

export const FAMILY_MENTAL_HEALTH_SECTION_PROP_KEYS = [
  "SignificantFamilyMedicalPsychiatricHistory",
  "SignificantFamilyMedicalPsychiatricHistoryHandler",
  "SignificantFamilyMedicalPsychiatricHistoryOptions",
  "handleKeySignificantFamilyMedicalPsychiatricHistory",
  "mentalHealthTreatmentHistoryTypeOfService",
  "mentalHealthTreatmentHistoryTypeOfServiceHandler",
  "mentalHealthTreatmentHistoryTypeOfServiceOption",
  "handleKeyMentalHealthTreatmentHistoryTypeOfService",
  "mentalHealthTreatmentHistoryWhere",
  "setMentalHealthTreatmentHistoryWhere",
  "mentalHealthTreatmentHistoryDates",
  "setMentalHealthTreatmentHistoryDates",
  "mentalHealthTreatmentHistoryDiagnosisReason",
  "mentalHealthTreatmentHistoryDiagnosisReasonHandler",
  "mentalHealthTreatmentHistoryDiagnosisReasonOption",
  "handleKeyDownMentalHealthTreatmentHistoryDiagnosisReason",
  "handleTypeOfService",
  "typeOfServiceArray",
  "handleRemoveItem",
  "canDelete",
];
