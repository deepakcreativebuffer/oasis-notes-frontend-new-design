/** @format */

import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useViewTreatmentPlanFormContext } from "../../context/ViewTreatmentPlanFormContext";
import { formatDateToMMDDYYYY } from "@/utils/utils";

export default function ViewTreatmentPlanPatientSection() {
  const f = useViewTreatmentPlanFormContext();
  return (
    <>
      <Row>
        <Col
          xs={12}
          sm={5}
          md={6}
          lg={4}
          className={`${!f.residentName && "hidePrint" && "hide-data-on-view-print"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Resident Name : </p>
            <h5 className="view-value mb-0">{f.residentName}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={4}
          md={6}
          lg={4}
          className={`${!f.ahcccsId && "hidePrint" && "hide-data-on-view-print"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">AHCCCS ID : </p>
            <h5 className="view-value mb-0">{f.ahcccsId}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={3}
          md={6}
          lg={4}
          className={`${!f.dob && "hidePrint" && "hide-data-on-view-print"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">DOB : </p>
            <h5 className="view-value mb-0">
              {f.dob && formatDateToMMDDYYYY(f.dob)}
            </h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={6}
          className={`${!f.diagnosis && "hidePrint" && "hide-data-on-view-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">
              Diagnosis (specify if new or continuing) :{" "}
            </p>
            <h5 className="view-value mb-0">{f.diagnosis}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={5}
          md={6}
          lg={3}
          className={`${!f.date && "hidePrint" && "hide-data-on-view-print"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Date : </p>
            <h5 className="view-value mb-0">{formatDateToMMDDYYYY(f.date)}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={7}
          md={6}
          lg={3}
          className={`${!f.admitDate && "hidePrint" && "hide-data-on-view-print"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Admit Date : </p>
            <h5 className="view-value mb-0">
              {f.admitDate && formatDateToMMDDYYYY(f.admitDate)}
            </h5>
          </div>
        </Col>
      </Row>

      <div
        className={`${!f.physicalService && !f.behavior && "hide-data-on-view-print"}`}
      >
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className="view-details-grid d-lg-flex align-items-md-center my-1 my-md-2 p-3">
              <p className="view-label fw-bold mb-1">Care : </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Physical Services"
                  className="pe-none"
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
                  className="pe-none"
                  type="checkbox"
                  checked={f.behavior === "f.behavior"}
                  onChange={() =>
                    f.setBehavior(
                      f.behavior === "f.behavior" ? "" : "f.behavior",
                    )
                  }
                  id="behavioralCheckbox"
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div
        className={`${!f.medicationAdministation?.length && !f.medicationAssistance && "hide-data-on-view-print"}`}
      >
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label fw-bold mb-1">Medication Services : </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Medication Administration"
                  className="pe-none"
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
                />
                <Form.Check
                  inline
                  label="Assistance in the self-Administration of medication"
                  className="pe-none"
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
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {f.presentingPrice?.length > 0 && (
        <div
          className={`mb-3 ${f.presentingPrice?.length < 1 && "hide-data-on-view-print"}`}
        >
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3 h-100">
                <p className="view-label mb-1">Presenting Problems : </p>
                <div className="view-value mb-0">
                  <ul className="ps-3 mt-2 mb-0 tw-column">
                    {f.presentingPrice?.map((i, index) => (
                      <li className="mb-2 list-disc" key={index}>
                        {i.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {(f.mendelHealth || f.mentelText) && (
        <div
          className={`${!f.mendelHealth && !f.mentelText && "hide-data-on-view-print"}`}
        >
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label fw-bold mb-1">Mental Status : </p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="Oriented"
                    className="pe-none"
                    type="checkbox"
                    id="oriented"
                    checked={f.mendelHealth?.includes("oriented")}
                    onChange={() =>
                      f.handleCheckboxChangeMentalHealth("oriented")
                    }
                  />
                  <Form.Check
                    inline
                    label="Disoriented"
                    className="pe-none"
                    type="checkbox"
                    id="disoriented"
                    checked={f.mendelHealth?.includes("disOriented")}
                    onChange={() =>
                      f.handleCheckboxChangeMentalHealth("disOriented")
                    }
                  />
                  <Form.Check
                    inline
                    label="Unstable"
                    className="pe-none"
                    type="checkbox"
                    id="unstable"
                    checked={f.mendelHealth?.includes("unstable")}
                    onChange={() =>
                      f.handleCheckboxChangeMentalHealth("unstable")
                    }
                  />
                  <Form.Check
                    inline
                    label="Other"
                    className="pe-none"
                    type="checkbox"
                    checked={f.mendelHealth?.includes("other")}
                    onChange={() => f.handleCheckboxChangeMentalHealth("other")}
                  />

                  {f.mendelHealth?.includes("other") && (
                    <span className="view-value">{f.mentelText}</span>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {f.mind !== "undefined" && (
        <div
          className={`mb-2 ${(f.mind === undefined || f.mind?.length < 1) && "hide-data-on-view-print"}`}
        >
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label fw-bold mb-1">Mood Level : </p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="Normal"
                    className="pe-none"
                    type="checkbox"
                    id="normal"
                    checked={f.mind?.includes("Normal")}
                    onChange={() => f.handleCheckboxChangeMind("Normal")}
                  />
                  <Form.Check
                    inline
                    label="Elevated"
                    className="pe-none"
                    type="checkbox"
                    id="elevated"
                    checked={f.mind?.includes("Elevated")}
                    onChange={() => f.handleCheckboxChangeMind("Elevated")}
                  />
                  <Form.Check
                    inline
                    label="Depressed"
                    className="pe-none"
                    type="checkbox"
                    id="depressed"
                    checked={f.mind?.includes("Depressed")}
                    onChange={() => f.handleCheckboxChangeMind("Depressed")}
                  />
                  <Form.Check
                    inline
                    label="Anxious"
                    className="pe-none"
                    type="checkbox"
                    id="anxious"
                    checked={f.mind?.includes("Anxious")}
                    onChange={() => f.handleCheckboxChangeMind("Anxious")}
                  />
                  <Form.Check
                    inline
                    label="Other"
                    className="pe-none"
                    type="checkbox"
                    checked={f.mind?.includes("other")}
                    onChange={() => f.handleCheckboxChangeMind("other")}
                  />
                  {(f.mind === "other" || f.mind?.includes("other")) && (
                    <span className="view-value">{f.mindText}</span>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {f.adls !== "undefined" && (
        <div
          className={`mb-sm-2 mb-md-3 ${(f.adls === undefined || f.adls?.length < 1) && !f.adlsText && "hide-data-on-view-print"}`}
        >
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div className="view-details-grid d-block">
                <div
                  className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 `}
                >
                  <p className="view-label fw-bold mb-1">ADLS : </p>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Is independent with all ADLS"
                      className="pe-none"
                      type="checkbox"
                      id="independent"
                      checked={f.adls?.includes("independent")}
                      onChange={() => f.setAdls("independent")}
                    />
                    <Form.Check
                      inline
                      label="Personal care level – See Attached personal care behavioral health treatment plan"
                      className="pe-none"
                      type="checkbox"
                      id="personalCareLevel"
                      checked={f.adls?.includes("personalCareLevel")}
                      onChange={() => f.setAdls("personalCareLevel")}
                    />
                  </div>
                </div>
                <div
                  className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!f.adlsText && "hidePrint" && "hide-data-on-view-print"}`}
                >
                  <p className="view-label fw-bold mb-1">Comment : </p>
                  <h5 className="view-value mb-0">{f.adlsText}</h5>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {(f.BHealth !== "undefined" || f.Btext) && (
        <div
          className={`mb-2 ${!f.BHealth && !f.Btext && "hide-data-on-view-print"}`}
        >
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div className="view-details-grid d-block">
                <div
                  className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 `}
                >
                  <p className="view-label fw-bold mb-1">
                    Behavioral Health Services :{" "}
                  </p>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Receives behavioral health services"
                      className="pe-none"
                      type="checkbox"
                      id="receivesServices"
                      value="receivesServices"
                      checked={f.BHealth?.includes("receivesServices")}
                      onChange={() => f.setBHealth("receivesServices")}
                    />
                    <Form.Check
                      inline
                      label="Is prescribed psychotropic medication"
                      className="pe-none"
                      type="checkbox"
                      id="prescribedMedication"
                      value="prescribedMedication"
                      checked={f.BHealth?.includes("prescribedMedication")}
                      onChange={() => f.setBHealth("prescribedMedication")}
                    />
                    <Form.Check
                      inline
                      label="Resident agrees to follow house rules"
                      className="pe-none"
                      type="checkbox"
                      id="followsHouseRules"
                      value="followsHouseRules"
                      checked={f.BHealth?.includes("followsHouseRules")}
                      onChange={() => f.setBHealth("followsHouseRules")}
                    />
                  </div>
                </div>
                <div
                  className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!f.Btext && "hidePrint" && "hide-data-on-view-print"}`}
                >
                  <p className="view-label fw-bold mb-1">Comment : </p>
                  <h5 className="view-value mb-0">{f.Btext}</h5>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      <div
        className={`${!f.primaryCare && !f.psychiatricProvider && "hide-data-on-view-print"}`}
      >
        <div className="view-details-grid view-details-grid-inline my-1 p-3">
          <Row>
            <Col
              xs={12}
              md={6}
              lg={4}
              className={`${!f.primaryCare && "hidePrint" && "hide-data-on-view-print"}`}
            >
              <div className="my-1">
                <p className="view-label mb-1">Primary Care Provider Name : </p>
                <h5 className="view-value mb-0">{f.primaryCare}</h5>
              </div>
            </Col>
            <Col
              xs={12}
              md={6}
              lg={4}
              className={`${!f.primaryCareProviderContact && "hidePrint" && "hide-data-on-view-print"}`}
            >
              <div className="my-1">
                <p className="view-label mb-1">
                  Primary Care Provider Contact :{" "}
                </p>
                <h5 className="view-value mb-0">
                  {f.primaryCareProviderContact}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              md={6}
              lg={4}
              className={`${!f.primaryCareProviderAddress && "hidePrint" && "hide-data-on-view-print"}`}
            >
              <div className="my-1">
                <p className="view-label mb-1">
                  Primary Care Provider Address :{" "}
                </p>
                <h5 className="view-value mb-0">
                  {f.primaryCareProviderAddress}
                </h5>
              </div>
            </Col>
          </Row>
        </div>
        <div className="view-details-grid view-details-grid-inline my-1 p-3">
          <Row className="mt-3">
            <Col
              xs={12}
              md={6}
              lg={4}
              className={`${!f.psychiatricProvider && "hidePrint" && "hide-data-on-view-print"}`}
            >
              <div className="my-1">
                <p className="view-label mb-1">Psychiatric Provider Name : </p>
                <h5 className="view-value mb-0">{f.psychiatricProvider}</h5>
              </div>
            </Col>
            <Col
              xs={12}
              md={6}
              lg={4}
              className={`${!f.psychiatricProviderContact && "hidePrint" && "hide-data-on-view-print"}`}
            >
              <div className="my-1">
                <p className="view-label mb-1">
                  Psychiatric Provider Contact :{" "}
                </p>
                <h5 className="view-value mb-0">
                  {f.psychiatricProviderContact}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              md={6}
              lg={4}
              className={`${!f.psychiatricProviderAddress && "hidePrint" && "hide-data-on-view-print"}`}
            >
              <div className="my-1">
                <p className="view-label mb-1">
                  Psychiatric Provider Address :{" "}
                </p>
                <h5 className="view-value mb-0">
                  {f.psychiatricProviderAddress}
                </h5>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
