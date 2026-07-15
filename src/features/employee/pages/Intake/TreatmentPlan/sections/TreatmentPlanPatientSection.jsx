/* eslint-disable no-unused-vars */
/** @format */

import React from "react";
import {
  Form,
  Row,
  Col,
  Card,
  Table,
  Container,
  Button,
} from "react-bootstrap";
import { useTreatmentPlanFormContext } from "../context/TreatmentPlanFormContext";
import DatePicker from "react-datepicker";
import { BorderlessInput } from "@/utils/Makers";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import { formatDateToMMDDYYYY, checkMultiValues } from "@/utils/utils";
import { SelectMultiPrint } from "../components/TreatmentPlanPrintFields";

export default function TreatmentPlanPatientSection() {
  const f = useTreatmentPlanFormContext();
  return (
    <>
      <Row className="mb-2">
        <Col xs={12}>
          {f.id ? (
            <>
              <Card body className="mb-2 print-shadow-none">
                <Form.Group className={"f.resident-name-print w-100"}>
                  <Form.Label
                    className="fw-bold increse-size flex-shrink-0"
                    htmlFor="residentFullName"
                  >
                    Resident Name :
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="residentFullName"
                    value={f.residentName}
                    placeholder="Enter full name"
                    required
                    className="fw-bold increse-size"
                  />
                </Form.Group>
              </Card>
            </>
          ) : (
            <PatientComponent
              MainPatientId={f.setPatientId}
              MainResidentName={f.setResidentName}
              setWholeData={f.setPatientDetail}
            />
          )}
        </Col>
      </Row>
      <Card body className="mb-3">
        <Row>
          <Col
            xs={12}
            sm={6}
            md={4}
            lg={4}
            className={`${!f.ahcccsId && "hidePrint"}`}
          >
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
              <Form.Control
                disabled
                type="text"
                id="f.ahcccsId"
                value={f.ahcccsId}
                onChange={(e) => f.setAhcccsId(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={6}
            md={4}
            lg={4}
            className={`${!f.dob && "hidePrint"}`}
          >
            <Form.Group className="mb-3 d-flex flex-column">
              <Form.Label className="fw-bold">DOB</Form.Label>
              <DatePicker
                selected={formatDateToMMDDYYYY(f.dob)}
                disabled
                onChange={(selectedDate) =>
                  f.setDob(selectedDate?.toDateString())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className="form-control"
                highlightDates={[
                  {
                    "react-datepicker__day--highlighted-custom": [
                      f.dob ? formatDateToMMDDYYYY(f.dob) : new Date(),
                    ],
                  },
                ]}
              />
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={4}
            lg={4}
            className={`${!f.diagnosis && "hidePrint"}`}
          >
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Diagnosis (specify if new or continuing)
              </Form.Label>
              <Form.Control
                disabled
                type="text"
                id="f.ahcccsId"
                value={f.diagnosis}
                onChange={(e) => f.setDiagnosis(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={6} md={6} className={`${!f.date && "hidePrint"}`}>
            <Form.Group className="mb-3 d-flex flex-column">
              <Form.Label className="fw-bold">Date</Form.Label>
              <DatePicker
                selected={formatDateToMMDDYYYY(f.date)}
                onChange={(selectedDate) =>
                  f.setDate(selectedDate?.toDateString())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className="form-control"
                highlightDates={[
                  {
                    "react-datepicker__day--highlighted-custom": [
                      f.date ? formatDateToMMDDYYYY(f.date) : new Date(),
                    ],
                  },
                ]}
              />
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={6}
            md={6}
            className={`${!f.admitDate && "hidePrint"}`}
          >
            <Form.Group className="mb-3 d-flex flex-column">
              <Form.Label className="fw-bold">Admit Date</Form.Label>
              <DatePicker
                selected={formatDateToMMDDYYYY(f.admitDate)}
                disabled
                onChange={(selectedDate) =>
                  f.setAdminDate(selectedDate?.toDateString())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className="form-control"
                highlightDates={[
                  {
                    "react-datepicker__day--highlighted-custom": [
                      f.admitDate
                        ? formatDateToMMDDYYYY(f.admitDate)
                        : new Date(),
                    ],
                  },
                ]}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">Care</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Physical Services"
                  type="checkbox"
                  checked={f.physicalService === "f.physicalService"}
                  onChange={() =>
                    f.setPhysicalService(
                      f.physicalService === "f.physicalService"
                        ? ""
                        : "f.physicalService",
                    )
                  }
                  id="behavioralCheckbox"
                />
                <Form.Check
                  inline
                  label="Behavioral Services"
                  type="checkbox"
                  checked={f.behavior === "f.behavior"}
                  onChange={() =>
                    f.setBehavior(
                      f.behavior === "f.behavior" ? "" : "f.behavior",
                    )
                  }
                  id="f.behavior"
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">Medication Services</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Medication Administration"
                  type="checkbox"
                  checked={
                    f.medicationAdministation === "MedicationAdministration"
                  }
                  onChange={() =>
                    f.setMedicationAdministation(
                      f.medicationAdministation === "MedicationAdministration"
                        ? ""
                        : "MedicationAdministration",
                    )
                  }
                  id="MedicationAdministration"
                />
                <Form.Check
                  inline
                  label="Assistance in the self-Administration of medication"
                  type="checkbox"
                  checked={
                    f.medicationAssistance ===
                    "AssistanceintheselfAdministrationofmedication"
                  }
                  onChange={() =>
                    f.setMedicationAssistence(
                      f.medicationAssistance ===
                        "AssistanceintheselfAdministrationofmedication"
                        ? ""
                        : "AssistanceintheselfAdministrationofmedication",
                    )
                  }
                  id="AssistanceintheselfAdministrationofmedication"
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold me-2">
                Presenting Problems
              </Form.Label>
              <SelectMultiPrint
                isMulti
                onChange={f.presentingPriceHandler}
                value={f.presentingPrice}
                options={f.presentingPriceOption}
                isCreatable={true}
                onKeyDown={f.handleKeyPresentingPrice}
                isDisabled={true}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card>

      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">Mental Status</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Oriented"
                  type="checkbox"
                  id="oriented"
                  checked={f.mendelHealth?.includes("oriented")}
                  onChange={() =>
                    checkMultiValues(
                      f.handleCheckboxChangeMentalHealth,
                      f.mendelHealth,
                      "oriented",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Disoriented"
                  type="checkbox"
                  id="disoriented"
                  checked={f.mendelHealth?.includes("disOriented")}
                  onChange={() =>
                    checkMultiValues(
                      f.handleCheckboxChangeMentalHealth,
                      f.mendelHealth,
                      "disOriented",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Unstable"
                  type="checkbox"
                  id="unstable"
                  checked={f.mendelHealth?.includes("unstable")}
                  onChange={() =>
                    checkMultiValues(
                      f.handleCheckboxChangeMentalHealth,
                      f.mendelHealth,
                      "unstable",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Other"
                  checked={f.mendelHealth?.includes("other")}
                  onChange={() =>
                    checkMultiValues(
                      f.handleCheckboxChangeMentalHealth,
                      f.mendelHealth,
                      "other",
                    )
                  }
                  id="other"
                />
                {f.mendelHealth?.includes("other") && (
                  <BorderlessInput
                    value={f.mentelText}
                    setState={f.setMentelText}
                    placeholder=" "
                  />
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">Mood Level</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Normal"
                  type="checkbox"
                  id="normal"
                  checked={f.mind?.includes("Normal")}
                  onChange={() => checkMultiValues(f.setMind, f.mind, "Normal")}
                />
                <Form.Check
                  inline
                  label="Elevated"
                  type="checkbox"
                  id="elevated"
                  checked={f.mind?.includes("Elevated")}
                  onChange={() =>
                    checkMultiValues(f.setMind, f.mind, "Elevated")
                  }
                />
                <Form.Check
                  inline
                  label="Depressed"
                  className="checkinput"
                  type="checkbox"
                  id="depressed"
                  checked={f.mind?.includes("Depressed")}
                  onChange={() =>
                    checkMultiValues(f.setMind, f.mind, "Depressed")
                  }
                />
                <Form.Check
                  inline
                  label="Anxious"
                  type="checkbox"
                  id="anxious"
                  checked={f.mind?.includes("Anxious")}
                  onChange={() =>
                    checkMultiValues(f.setMind, f.mind, "Anxious")
                  }
                />
                <Form.Check
                  inline
                  label="Other"
                  type="checkbox"
                  checked={f.mind?.includes("other")}
                  onChange={() => checkMultiValues(f.setMind, f.mind, "other")}
                  id="otherMoodLevel"
                />
                {f.mind?.includes("other") && (
                  <BorderlessInput
                    value={f.mindText}
                    setState={f.setMindText}
                    placeholder=""
                  />
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">ADLS</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Is independent with all ADLS"
                  type="checkbox"
                  id="independent"
                  checked={f.adls?.includes("independent")}
                  onChange={() =>
                    checkMultiValues(f.setAdls, f.adls, "independent")
                  }
                />
                <Form.Check
                  inline
                  label="Personal care level – See Attached personal care behavioral health treatment plan"
                  type="checkbox"
                  id="personalCareLevel"
                  checked={f.adls?.includes("personalCareLevel")}
                  onChange={() =>
                    checkMultiValues(f.setAdls, f.adls, "personalCareLevel")
                  }
                />
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-bold">Comment </Form.Label>
              <Form.Control
                as="textarea"
                className={`${!f.adlsText && "hidePrint"}`}
                type="text"
                id="AHCCCS"
                value={f.adlsText}
                cols={130}
                placeholder="Enter text."
                onChange={(e) => f.setAldsText(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">
                Behavioral Health Services
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Receives behavioral health services"
                  type="checkbox"
                  id="receivesServices"
                  value="receivesServices"
                  checked={f.BHealth?.includes("receivesServices")}
                  onChange={() =>
                    checkMultiValues(
                      f.setBHealth,
                      f.BHealth,
                      "receivesServices",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Is prescribed psychotropic medication"
                  type="checkbox"
                  id="prescribedMedication"
                  value="prescribedMedication"
                  checked={f.BHealth?.includes("prescribedMedication")}
                  onChange={() =>
                    checkMultiValues(
                      f.setBHealth,
                      f.BHealth,
                      "prescribedMedication",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Resident agrees to follow house rules"
                  type="checkbox"
                  id="followsHouseRules"
                  value="followsHouseRules"
                  checked={f.BHealth?.includes("followsHouseRules")}
                  onChange={() =>
                    checkMultiValues(
                      f.setBHealth,
                      f.BHealth,
                      "followsHouseRules",
                    )
                  }
                />
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-bold">Comment </Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                id="AHCCCS"
                className={`${!f.Btext && "hidePrint"}`}
                value={f.Btext}
                rows={2}
                cols={130}
                placeholder="Enter text."
                onChange={(e) => f.setBtext(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={6} lg={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Primary Care Provider Name
              </Form.Label>
              <Form.Control
                type="text"
                className={`${!f.primaryCare && "hidePrint"}`}
                placeholder="Enter text."
                value={f.primaryCare}
                disabled
                onChange={(e) => f.setPrimaryCare(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Primary Care Provider Contact
              </Form.Label>
              <Form.Control
                type="text"
                className={`${!f.primaryCareProviderContact && "hidePrint"}`}
                placeholder="Enter text."
                value={f.primaryCareProviderContact}
                disabled
                onChange={(e) =>
                  f.setPrimaryCareProviderContact(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} sm={12} md={6} lg={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Primary Care Provider Address
              </Form.Label>
              <Form.Control
                type="text"
                className={`${!f.primaryCareProviderAddress && "hidePrint"}`}
                placeholder="Enter text."
                value={f.primaryCareProviderAddress}
                disabled
                onChange={(e) =>
                  f.setPrimaryCareProviderAddress(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6} lg={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Psychiatric Provider Name
              </Form.Label>
              <Form.Control
                type="text"
                className={`${!f.psychiatricProvider && "hidePrint"}`}
                placeholder="Enter text."
                value={f.psychiatricProvider}
                disabled
                onChange={(e) => f.setPsychiatricProvider(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Psychiatric Provider Contact
              </Form.Label>
              <Form.Control
                type="text"
                className={`${!f.psychiatricProviderContact && "hidePrint"}`}
                placeholder="Enter text."
                value={f.psychiatricProviderContact}
                disabled
                onChange={(e) =>
                  f.setPsychiatricProviderContact(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Psychiatric Provider Address
              </Form.Label>
              <Form.Control
                type="text"
                className={`${!f.psychiatricProviderAddress && "hidePrint"}`}
                placeholder="Enter text."
                value={f.psychiatricProviderAddress}
                disabled
                onChange={(e) =>
                  f.setPsychiatricProviderAddress(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
    </>
  );
}
