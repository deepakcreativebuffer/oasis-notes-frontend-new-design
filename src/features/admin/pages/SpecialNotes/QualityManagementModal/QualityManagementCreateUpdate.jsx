import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  ModalBody,
  Row,
} from "react-bootstrap";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import DatePicker from "react-datepicker";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";

const QualityManagementCreateUpdate = ({
  facilitiesList,
  handleSubmit8,
  qualitymanagement,
  setQualityManagement,
  handleAddFormGroup,
  formGroups,
  removeFormGroup,
  handleChangeFormGroup,
  currentUser,
  isSubmitEnabled,
  signHandler,
  editStatus,
  signers,
  setSigners,
  employeeSignature,
  employeeSignatureDate,
  employeeSignatureTime,
  hoursFormat,
  adminSignature,
  adminDateSigned,
  adminSignedTime,
  onHide,
}) => {
  return (
    <>
      <Modal.Header closeButton onHide={onHide}>
        <h5 className="mb-0 fw-bold">Quality Management Data Reports</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit8}>
        <ModalBody>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Select Facility:</Form.Label>
                  <Form.Select
                    value={
                      qualitymanagement?.facilityId?._id ||
                      qualitymanagement?.facilityId ||
                      ""
                    }
                    onChange={(e) => {
                      const selectedFacility = facilitiesList?.find(
                        (fac) => fac._id === e.target.value,
                      );
                      if (selectedFacility) {
                        setQualityManagement({
                          ...qualitymanagement,
                          facilityId: selectedFacility._id,
                          facilityAddress:
                            selectedFacility.address ||
                            selectedFacility.location ||
                            "",
                        });
                      } else {
                        setQualityManagement({
                          ...qualitymanagement,
                          facilityId: "",
                          facilityAddress: "",
                        });
                      }
                    }}
                  >
                    <option value="">Select Facility</option>
                    {facilitiesList?.map((facility) => (
                      <option key={facility._id} value={facility._id}>
                        {facility.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Facility Address:</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setQualityManagement({
                        ...qualitymanagement,
                        facilityAddress: e.target.value,
                      })
                    }
                    value={qualitymanagement?.facilityAddress}
                    type="text"
                    placeholder="Enter Facility Address"
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3 d-flex flex-column"
                  controlId="exampleForm.ControlSelect1"
                >
                  <Form.Label className="w-full font-bold">Date:</Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(
                      qualitymanagement?.dateOfBirth,
                    )}
                    onChange={(selectedDate) =>
                      setQualityManagement({
                        ...qualitymanagement,
                        dateOfBirth: selectedDate?.toDateString(),
                      })
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    className="form-control"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          qualitymanagement?.dateOfBirth
                            ? formatDateToMMDDYYYY(
                                qualitymanagement?.dateOfBirth,
                              )
                            : new Date(),
                        ],
                      },
                    ]}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="w-full font-bold">
                    Areas that have Improved:
                  </Form.Label>
                  <Form.Control
                    as={"textarea"}
                    rows={3}
                    onChange={(e) => {
                      setQualityManagement({
                        ...qualitymanagement,
                        areasImproved: e.target.value,
                      });
                    }}
                    value={qualitymanagement?.areasImproved}
                    required
                    placeholder="Type Here..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Form.Label className="w-full font-bold">Data Collection:</Form.Label>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={12} lg={12}></Col>
              <Form.Label className="fw-bold">Resident Chart:</Form.Label>
              <Form.Group className="mb-3">
                <Form.Select
                  value={qualitymanagement.dataCollectionPatientChart}
                  onChange={(e) => {
                    setQualityManagement({
                      ...qualitymanagement,
                      dataCollectionPatientChart: e.target.value,
                    });
                  }}
                >
                  <option value={""}>Select</option>
                  <option value={"Yes"}>Yes</option>
                  <option value={"No"}>No</option>
                </Form.Select>
              </Form.Group>
            </Row>
          </Card>
          <Form.Group className="mb-3 flex justify-between items-center mt-4">
            <Form.Label className="font-bold mr-4">
              Number of Incident Reports:
            </Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-2 rounded-[8px] w-[100px]">
              <img
                disabled={qualitymanagement.dataCollectionIncidentReports <= 1}
                onClick={() => {
                  setQualityManagement((prevState) => ({
                    ...prevState,
                    dataCollectionIncidentReports: Math.max(
                      0,
                      prevState.dataCollectionIncidentReports - 1,
                    ),
                  }));
                }}
                className="max-w-[25px] max-h-[25px] w-auto h-auto"
                src="/sub.png"
                alt="sub"
              />
              <span>{qualitymanagement.dataCollectionIncidentReports}</span>
              <img
                onClick={() =>
                  setQualityManagement({
                    ...qualitymanagement,
                    dataCollectionIncidentReports:
                      qualitymanagement.dataCollectionIncidentReports + 1,
                  })
                }
                className="max-w-[25px] max-h-[25px] w-auto h-auto"
                src="/add.png"
                alt="sub"
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3 flex justify-between items-center mt-4">
            <Form.Label className="w-full font-bold">
              Number of Admissions:
            </Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-2 rounded-[8px] w-[100px]">
              <img
                disabled={qualitymanagement.dataCollectionAdmissions <= 1}
                onClick={() => {
                  setQualityManagement((prevState) => ({
                    ...prevState,
                    dataCollectionAdmissions: Math.max(
                      0,
                      prevState.dataCollectionAdmissions - 1,
                    ),
                  }));
                }}
                className="max-w-[25px] max-h-[25px] w-auto h-auto"
                src="/sub.png"
                alt="sub"
              />
              <span>{qualitymanagement.dataCollectionAdmissions}</span>
              <img
                onClick={() =>
                  setQualityManagement({
                    ...qualitymanagement,
                    dataCollectionAdmissions:
                      qualitymanagement.dataCollectionAdmissions + 1,
                  })
                }
                className="max-w-[25px] max-h-[25px] w-auto h-auto"
                src="/add.png"
                alt="sub"
              />
            </div>
          </Form.Group>

          <div className="flex justify-between items-center mt-4">
            <Form.Label className="font-bold">Number of Discharges:</Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-[0.2rem] rounded-[8px] w-[100px]">
              <span>
                <img
                  disabled={qualitymanagement.dataCollectionDischarges <= 1}
                  onClick={() => {
                    setQualityManagement((prevState) => ({
                      ...prevState,
                      dataCollectionDischarges: Math.max(
                        0,
                        prevState.dataCollectionDischarges - 1,
                      ),
                    }));
                  }}
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/sub.png"
                  alt="sub"
                />
              </span>
              <span>{qualitymanagement.dataCollectionDischarges}</span>
              <span>
                <img
                  onClick={() =>
                    setQualityManagement({
                      ...qualitymanagement,
                      dataCollectionDischarges:
                        qualitymanagement.dataCollectionDischarges + 1,
                    })
                  }
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/add.png"
                  alt="sub"
                />
              </span>
            </div>
          </div>

          <Form.Group className="mb-3 flex justify-between items-center mt-4">
            <Form.Label className="w-full font-bold mr-4">
              Number of Clients that visited the Hospital:
            </Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-[0.2rem] rounded-[8px] w-[100px]">
              <span>
                <img
                  disabled={
                    qualitymanagement.dataCollectionClientsVisitedHospital <= 1
                  }
                  onClick={() => {
                    setQualityManagement((prevState) => ({
                      ...prevState,
                      dataCollectionClientsVisitedHospital: Math.max(
                        0,
                        prevState.dataCollectionClientsVisitedHospital - 1,
                      ),
                    }));
                  }}
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/sub.png"
                  alt="sub"
                />
              </span>
              <span>
                {qualitymanagement.dataCollectionClientsVisitedHospital}
              </span>
              <span>
                <img
                  onClick={() =>
                    setQualityManagement({
                      ...qualitymanagement,
                      dataCollectionClientsVisitedHospital:
                        qualitymanagement.dataCollectionClientsVisitedHospital +
                        1,
                    })
                  }
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/add.png"
                  alt="sub"
                />
              </span>
            </div>
          </Form.Group>

          <Form.Group className="mb-3 flex items-center justify-between">
            <Form.Label className="font-bold">Number of Falls:</Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-[0.2rem] rounded-[8px] w-[100px]">
              <span>
                <img
                  disabled={qualitymanagement.dataCollectionFalls <= 1}
                  onClick={() => {
                    setQualityManagement((prevState) => ({
                      ...prevState,
                      dataCollectionFalls: Math.max(
                        0,
                        prevState.dataCollectionFalls - 1,
                      ),
                    }));
                  }}
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/sub.png"
                  alt="sub"
                />
              </span>
              <span>{qualitymanagement.dataCollectionFalls}</span>
              <span>
                <img
                  onClick={() =>
                    setQualityManagement({
                      ...qualitymanagement,
                      dataCollectionFalls:
                        qualitymanagement.dataCollectionFalls + 1,
                    })
                  }
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/add.png"
                  alt="sub"
                />
              </span>
            </div>
          </Form.Group>

          <Form.Group className=" mb-3 flex items-center justify-between">
            <Form.Label className="font-bold mr-4">
              Number of Medication Errors:
            </Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-[0.2rem] rounded-[8px] w-[100px]">
              <span>
                <img
                  disabled={
                    qualitymanagement.dataCollectionMedicationErrors <= 1
                  }
                  onClick={() => {
                    setQualityManagement((prevState) => ({
                      ...prevState,
                      dataCollectionMedicationErrors: Math.max(
                        0,
                        prevState.dataCollectionMedicationErrors - 1,
                      ),
                    }));
                  }}
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/sub.png"
                  alt="sub"
                />
              </span>
              <span>{qualitymanagement.dataCollectionMedicationErrors}</span>
              <span>
                <img
                  onClick={() =>
                    setQualityManagement({
                      ...qualitymanagement,
                      dataCollectionMedicationErrors:
                        qualitymanagement.dataCollectionMedicationErrors + 1,
                    })
                  }
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/add.png"
                  alt="sub"
                />
              </span>
            </div>
          </Form.Group>

          <Form.Group className="mb-3 flex flex-1 items-center">
            <Form.Label className="w-full font-bold">
              Number of Infectious Diseases:
            </Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-[0.2rem] rounded-[8px] w-[100px]">
              <span>
                <img
                  disabled={
                    qualitymanagement.dataCollectionInfectiousDisease <= 1
                  }
                  onClick={() => {
                    setQualityManagement((prevState) => ({
                      ...prevState,
                      dataCollectionInfectiousDisease: Math.max(
                        0,
                        prevState.dataCollectionInfectiousDisease - 1,
                      ),
                    }));
                  }}
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/sub.png"
                  alt="sub"
                />
              </span>
              <span></span>
              {qualitymanagement.dataCollectionInfectiousDisease}
              <span>
                <img
                  onClick={() =>
                    setQualityManagement({
                      ...qualitymanagement,
                      dataCollectionInfectiousDisease:
                        qualitymanagement.dataCollectionInfectiousDisease + 1,
                    })
                  }
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/add.png"
                  alt="sub"
                />
              </span>
            </div>
          </Form.Group>

          <Form.Group className="mb-3 flex flex-1 items-center">
            <Form.Label className="w-full font-bold mr-4">
              Number of Clients refusing Medications:
            </Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-[0.2rem] rounded-[8px] w-[100px]">
              <span>
                <img
                  disabled={
                    qualitymanagement.dataCollectionClientsRefusingMedications <=
                    1
                  }
                  onClick={() => {
                    setQualityManagement((prevState) => ({
                      ...prevState,
                      dataCollectionClientsRefusingMedications: Math.max(
                        0,
                        prevState.dataCollectionClientsRefusingMedications - 1,
                      ),
                    }));
                  }}
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/sub.png"
                  alt="sub"
                />
              </span>
              <span></span>
              {qualitymanagement.dataCollectionClientsRefusingMedications}
              <span>
                <img
                  onClick={() =>
                    setQualityManagement({
                      ...qualitymanagement,
                      dataCollectionClientsRefusingMedications:
                        qualitymanagement.dataCollectionClientsRefusingMedications +
                        1,
                    })
                  }
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/add.png"
                  alt="sub"
                />
              </span>
            </div>
          </Form.Group>

          <Form.Group className="mb-3 flex flex-1 items-center">
            <Form.Label className="w-full font-bold">
              Number of clients refusing to attend scheduled appointments:
            </Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-[0.2rem] rounded-[8px] w-[100px]">
              <span>
                <img
                  disabled={
                    qualitymanagement.dataCollectionClientsRefusingAppointments <=
                    1
                  }
                  onClick={() => {
                    setQualityManagement((prevState) => ({
                      ...prevState,
                      dataCollectionClientsRefusingAppointments: Math.max(
                        0,
                        prevState.dataCollectionClientsRefusingAppointments - 1,
                      ),
                    }));
                  }}
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/sub.png"
                  alt="sub"
                />
              </span>
              <span></span>
              {qualitymanagement.dataCollectionClientsRefusingAppointments}
              <span>
                <img
                  onClick={() =>
                    setQualityManagement({
                      ...qualitymanagement,
                      dataCollectionClientsRefusingAppointments:
                        qualitymanagement.dataCollectionClientsRefusingAppointments +
                        1,
                    })
                  }
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/add.png"
                  alt="sub"
                />
              </span>
            </div>
          </Form.Group>

          <Form.Group className="mb-3 flex flex-1 items-center">
            <Form.Label className="w-full font-bold">
              Number of Opioid medication related death or adverse reaction:
            </Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-[0.2rem] rounded-[8px] w-[100px]">
              <span>
                <img
                  disabled={
                    qualitymanagement.dataCollectionOpioidMedicationRelatedDeath <=
                    1
                  }
                  onClick={() => {
                    setQualityManagement((prevState) => ({
                      ...prevState,
                      dataCollectionOpioidMedicationRelatedDeath: Math.max(
                        0,
                        prevState.dataCollectionOpioidMedicationRelatedDeath -
                          1,
                      ),
                    }));
                  }}
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/sub.png"
                  alt="sub"
                />
              </span>
              <span></span>
              {qualitymanagement.dataCollectionOpioidMedicationRelatedDeath}
              <span>
                <img
                  onClick={() =>
                    setQualityManagement({
                      ...qualitymanagement,
                      dataCollectionOpioidMedicationRelatedDeath:
                        qualitymanagement.dataCollectionOpioidMedicationRelatedDeath +
                        1,
                    })
                  }
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/add.png"
                  alt="sub"
                />
              </span>
            </div>
          </Form.Group>

          <Form.Group className="mb-3 flex flex-1 items-center">
            <Form.Label className="w-full font-bold">
              Number of Opioid medication error:
            </Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-[0.2rem] rounded-[8px] w-[100px]">
              <span>
                <img
                  disabled={
                    qualitymanagement.dataCollectionOpioidMedicationError <= 1
                  }
                  onClick={() => {
                    setQualityManagement((prevState) => ({
                      ...prevState,
                      dataCollectionOpioidMedicationError: Math.max(
                        0,
                        prevState.dataCollectionOpioidMedicationError - 1,
                      ),
                    }));
                  }}
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/sub.png"
                  alt="sub"
                />
              </span>
              <span></span>
              {qualitymanagement.dataCollectionOpioidMedicationError}
              <span>
                <img
                  onClick={() =>
                    setQualityManagement({
                      ...qualitymanagement,
                      dataCollectionOpioidMedicationError:
                        qualitymanagement.dataCollectionOpioidMedicationError +
                        1,
                    })
                  }
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/add.png"
                  alt="sub"
                />
              </span>
            </div>
          </Form.Group>

          <Form.Group className="mb-3 flex flex-1 items-center">
            <Form.Label className="w-full font-bold">
              Number of residents experiencing rapid weight loss or excessive
              gain:
            </Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-[0.2rem] rounded-[8px] w-[100px]">
              <span>
                <img
                  disabled={
                    qualitymanagement.dataCollectionExperiencingRapidWeightLossGain <=
                    1
                  }
                  onClick={() => {
                    setQualityManagement((prevState) => ({
                      ...prevState,
                      dataCollectionExperiencingRapidWeightLossGain: Math.max(
                        0,
                        prevState.dataCollectionExperiencingRapidWeightLossGain -
                          1,
                      ),
                    }));
                  }}
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/sub.png"
                  alt="sub"
                />
              </span>
              <span></span>
              {qualitymanagement.dataCollectionExperiencingRapidWeightLossGain}
              <span>
                <img
                  onClick={() =>
                    setQualityManagement({
                      ...qualitymanagement,
                      dataCollectionExperiencingRapidWeightLossGain:
                        qualitymanagement.dataCollectionExperiencingRapidWeightLossGain +
                        1,
                    })
                  }
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/add.png"
                  alt="sub"
                />
              </span>
            </div>
          </Form.Group>

          <Form.Group className="mb-3 flex flex-1 items-center">
            <Form.Label className="w-full font-bold">
              Number of residents with reported relapses:
            </Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-[0.2rem] rounded-[8px] w-[100px]">
              <span>
                <img
                  disabled={
                    qualitymanagement.dataCollectionResidentsReportedRelapses <=
                    1
                  }
                  onClick={() => {
                    setQualityManagement((prevState) => ({
                      ...prevState,
                      dataCollectionResidentsReportedRelapses: Math.max(
                        0,
                        prevState.dataCollectionResidentsReportedRelapses - 1,
                      ),
                    }));
                  }}
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/sub.png"
                  alt="sub"
                />
              </span>
              <span></span>
              {qualitymanagement.dataCollectionResidentsReportedRelapses}
              <span>
                <img
                  onClick={() =>
                    setQualityManagement({
                      ...qualitymanagement,
                      dataCollectionResidentsReportedRelapses:
                        qualitymanagement.dataCollectionResidentsReportedRelapses +
                        1,
                    })
                  }
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/add.png"
                  alt="sub"
                />
              </span>
            </div>
          </Form.Group>

          <Form.Group className="mb-3 flex flex-1 items-center">
            <Form.Label className="w-full font-bold">
              Number of individuals referred to higher or lower level of care:
            </Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-[0.2rem] rounded-[8px] w-[100px]">
              <span>
                <img
                  disabled={
                    qualitymanagement.dataCollectionReferredHigherLowerLevelCare <=
                    1
                  }
                  onClick={() => {
                    setQualityManagement((prevState) => ({
                      ...prevState,
                      dataCollectionReferredHigherLowerLevelCare: Math.max(
                        0,
                        prevState.dataCollectionReferredHigherLowerLevelCare -
                          1,
                      ),
                    }));
                  }}
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/sub.png"
                  alt="sub"
                />
              </span>
              <span></span>
              {qualitymanagement.dataCollectionReferredHigherLowerLevelCare}
              <span>
                <img
                  onClick={() =>
                    setQualityManagement({
                      ...qualitymanagement,
                      dataCollectionReferredHigherLowerLevelCare:
                        qualitymanagement.dataCollectionReferredHigherLowerLevelCare +
                        1,
                    })
                  }
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/add.png"
                  alt="sub"
                />
              </span>
            </div>
          </Form.Group>

          <Form.Group className="mb-3 flex flex-1 items-center">
            <Form.Label className="w-full font-bold">
              Number of residents reporting the loss of personal
              property/clothing:
            </Form.Label>
            <div className="flex justify-between bg-[#EEEEEE] px-[0.9rem] py-[0.3rem] gap-[0.2rem] rounded-[8px] w-[100px]">
              <span>
                <img
                  disabled={
                    qualitymanagement.dataCollectionResidentsReportingLossPersonalProperty <=
                    1
                  }
                  onClick={() => {
                    setQualityManagement((prevState) => ({
                      ...prevState,
                      dataCollectionResidentsReportingLossPersonalProperty:
                        Math.max(
                          0,
                          prevState.dataCollectionResidentsReportingLossPersonalProperty -
                            1,
                        ),
                    }));
                  }}
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/sub.png"
                  alt="sub"
                />
              </span>
              <span></span>
              {
                qualitymanagement.dataCollectionResidentsReportingLossPersonalProperty
              }
              <span>
                <img
                  onClick={() =>
                    setQualityManagement({
                      ...qualitymanagement,
                      dataCollectionResidentsReportingLossPersonalProperty:
                        qualitymanagement.dataCollectionResidentsReportingLossPersonalProperty +
                        1,
                    })
                  }
                  className="max-w-[25px] max-h-[25px] w-auto h-auto"
                  src="/add.png"
                  alt="sub"
                />
              </span>
            </div>
          </Form.Group>

          <Form.Label className="w-full font-bold">Add More:</Form.Label>
          <Card body className="mb-3">
            {formGroups.map((formGroup, index) => (
              <div
                className="flex justify-between items-center"
                key={`staffItem${index}`}
              >
                <Form key={index}>
                  <Row>
                    <Col xs={12} sm={6} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="w-full font-bold">
                          Text:
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formGroup.text}
                          onChange={(e) =>
                            handleChangeFormGroup(index, "text", e.target.value)
                          }
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="w-full font-bold">
                          Count:
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={formGroup.count}
                          onChange={(e) =>
                            handleChangeFormGroup(
                              index,
                              "count",
                              e.target.value,
                            )
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
                {(currentUser?.userType === ROLES.ADMIN ||
                  currentUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                  (currentUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                    currentUser?.userType === ROLES.EMPLOYEE &&
                    currentUser.userPermissions?.delete
                      ?.split(":")
                      .includes("spn"))) && (
                  <div className="icon-joiner">
                    <Link
                      className="del-btn hidePrint"
                      onClick={() => removeFormGroup(index)}
                    >
                      <AiFillDelete />{" "}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </Card>
          <Button size="sm" className="mb-3" onClick={handleAddFormGroup}>
            Add
          </Button>
          <Form.Group className="mb-3">
            <Form.Label className="w-full font-bold">
              Areas of non-compliance or Substandard quality:
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              required
              onChange={(e) =>
                setQualityManagement({
                  ...qualitymanagement,
                  areasNonCompliance: e.target.value,
                })
              }
              placeholder="Type Here"
              value={qualitymanagement?.areasNonCompliance}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="w-full font-bold">Trends:</Form.Label>
            <Form.Control
              required
              onChange={(e) =>
                setQualityManagement({
                  ...qualitymanagement,
                  trends: e.target.value,
                })
              }
              value={qualitymanagement?.trends}
              placeholder="Type Here"
            />
          </Form.Group>

          <Row>
            <Col xs={12} lg={6}>
              <Button
                type="button"
                onClick={signHandler}
                className="theme-button"
              >
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} lg={6} className="text-end">
              {signatureFormat({
                sign: employeeSignature,
                date: employeeSignatureDate,
                time: employeeSignatureTime,
                hoursFormat,
              })}
              {signatureFormat({
                sign: adminSignature,
                date: adminDateSigned,
                time: adminSignedTime,
                hoursFormat,
              })}
              <p className="text-end">
                {signers?.map(
                  (signer) =>
                    signer.signature && (
                      <div key={signer?.signerId}>
                        {signatureFormat({
                          sign: signer.signature,
                          date: signer.dateSigned,
                          time: signer.signedTime,
                          hoursFormat,
                        })}
                      </div>
                    ),
                )}
              </p>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xs={12}>
              {!editStatus && (
                <div>
                  <Form.Label className="fw-bold"> Signers:</Form.Label>
                  <MultiEmployee setValue={setSigners} value={signers} />
                </div>
              )}
            </Col>
          </Row>
        </ModalBody>
        <Modal.Footer className="justify-content-center">
          <Button
            className="theme-button"
            type="submit"
            disabled={
              editStatus
                ? !isSubmitEnabled
                : currentUser.userType === ROLES.ADMIN
                  ? false
                  : employeeSignature.length === 0
            }
          >
            {editStatus ? "UPDATE" : "SAVE"}
          </Button>
          <Button className="theme-button-outline" onClick={onHide}>
            CANCEL
          </Button>
        </Modal.Footer>
      </Form>
    </>
  );
};

export default QualityManagementCreateUpdate;
