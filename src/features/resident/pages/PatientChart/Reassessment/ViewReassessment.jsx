import React, { useCallback, useEffect, useState, useRef } from "react";
import { Container, Row, Col, Table, Form } from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { patientChartService } from "@/features/shared/services";
import { useParams } from "react-router-dom";
import { fetchPaitentName } from "@/utils/utils";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { PrintThis } from "@/utils";
import Loader from "@/features/shared/ui/Loader/Loader";

const ViewReassessment = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const profile = useSelector(userProfile);
  const printRef = useRef(null);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        detail,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(detail),
    pageStyle: `
   @page {
      size: portrait !important;
      margin: 12mm 9mm!important;
    } 
    .card {
      page-break-inside: avoid;
    }
    .view-details-grid{
      page-break-inside: avoid;
    }
  `,
  });

  const handlePrint2 = () => {
    PrintThis(handlePrint);
  };

  const print = usePrint(printRef, handlePrint2);

  const fetchHandler = useCallback(() => {
    setLoading(true);
    patientChartService.reassessment.getById(id).then((res) => {
      setDetail(res.data);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (id) fetchHandler();
  }, [fetchHandler, id]);

  const renderArray = (arr) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return "N/A";
    return arr
      .map((a) => (typeof a === "object" ? a.name || JSON.stringify(a) : a))
      .join(", ");
  };

  const renderArrayWithOtherAtEnd = (arr, otherValue) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) {
      return "";
    }
    const mapped = arr.map((a) =>
      typeof a === "object" ? a.name || JSON.stringify(a) : a,
    );
    const hasOther = mapped.some(
      (v) => typeof v === "string" && v.toLowerCase() === "other",
    );
    const filtered = mapped.filter(
      (v) => typeof v !== "string" || v.toLowerCase() !== "other",
    );

    if (hasOther && otherValue) {
      filtered.push(`Other: ${otherValue}`);
    } else if (hasOther) {
      filtered.push("Other");
    }
    return filtered.length > 0 ? filtered.join(", ") : "N/A";
  };
  const renderDiagnoses = (title, arr) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) {
      return (
        <div
          className="view-details-grid view-details-grid-inline my-1 my-md-2 print-pad-0"
          style={{ padding: "14px" }}
        >
          <p className="view-label mb-1">{title} : </p>
          <h5 className="view-value mb-0">N/A</h5>
        </div>
      );
    }
    return (
      <Table responsive="lg" bordered className="mb-0 w-100">
        <thead>
          <tr>
            <th>{title}</th>
            <th>ICD Code</th>
            <th className="w-50">Description</th>
          </tr>
        </thead>
        <tbody>
          {arr.map((d, i) => {
            const displayName =
              d.name === "Primary"
                ? "Primary*"
                : d.name === "Other" && d.isOther
                  ? `Other: ${d.otherName || ""}`
                  : d.name;
            return (
              <tr key={i}>
                <td>{displayName}</td>
                <td>{d.icdCode || "-"}</td>
                <td>{d.description || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  const renderAllergiesTable = (arr) => {
    let yes = null;
    let comment = "";
    if (arr && Array.isArray(arr) && arr.length > 0) {
      const allergy = arr[0];
      if (allergy) {
        yes = allergy.yes;
        comment = allergy.comments || "";
      }
    }

    return (
      <Col md={12} className="mb-3">
        <Table responsive="lg" bordered className="mb-0">
          <thead>
            <tr>
              <th>Condition</th>
              <th className="text-center">Yes</th>
              <th className="text-center">No</th>
              <th className="w-50">Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Allergies</td>
              <td className="text-center">
                <Form.Check
                  type="checkbox"
                  checked={yes === true}
                  readOnly
                  disabled
                />
              </td>
              <td className="text-center">
                <Form.Check
                  type="checkbox"
                  checked={yes === false}
                  readOnly
                  disabled
                />
              </td>
              <td>{comment}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
    );
  };

  if (loading) return <Loader />;
  if (!detail) return <Container>Not Found</Container>;

  const renderField = (label, value) => (
    <Col md={6} className="mb-3 print-mb-0">
      <div
        className="view-details-grid view-details-grid-inline h-100 print-pad-0"
        style={{ padding: "14px" }}
      >
        <p className="view-label mb-1">{label} : </p>
        <h5 className="view-value mb-0">{value}</h5>
      </div>
    </Col>
  );

  const renderFieldFull = (label, value) => (
    <Col md={12} className="mb-3 print-mb-0">
      <div
        className="view-details-grid view-details-grid-inline h-100 print-pad-0"
        style={{ padding: "14px" }}
      >
        <p className="view-label mb-1">{label} : </p>
        <h5 className="view-value mb-0">{value}</h5>
      </div>
    </Col>
  );

  const residentName =
    detail.fullName ||
    detail.residentName ||
    `${detail?.firstName || ""} ${detail?.lastName || ""}`.trim() ||
    fetchPaitentName(detail.patientId) ||
    "N/A";

  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper title={"Re-Assessment"} isArrow={true} />
      <Container>
        <div className="discharge-summary" ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">Re-Assessment</h1>
          <div className="view-details print-view-details p-3">
            <Row>
              {renderField("Resident Name", residentName)}
              {renderField(
                "Preferred Language",
                detail.preferredLanguage || "N/A",
              )}
              {renderField("Primary Language", detail.primaryLanguage || "N/A")}
              {renderField("Ethnicity", detail.ethnicity || "N/A")}
              {renderField(
                "Admission Status",
                renderArray(detail.admissionStatus),
              )}
              {renderField(
                "Court Ordered Treatment?",
                detail.courtOrderedTreatment || "N/A",
              )}
              {renderField("Program Location", detail.programLocation || "N/A")}
              {renderField("Guardianship", detail.guardianship || "N/A")}
              {renderField(
                "Guardianship/POA/PUB FID Name",
                detail.guardianshipPoaPubFidName || "N/A",
              )}

              {renderField("Resident’s Goals", detail.residentGoals || "N/A")}
              {renderField(
                "Resident’s Strength",
                renderArray(detail.residentStrengths),
              )}

              {renderField(
                "Fall Risk",
                `${detail.fallRisk || "N/A"} ${detail.fallRisk === "Yes" ? `(${detail.fallRiskExplanation || "No explanation"})` : ""}`,
              )}
              {renderField("Triggers", detail.triggers || "N/A")}
              {renderField(
                "Hobbies/Leisure Activities",
                detail.hobbiesLeisureActivities || "N/A",
              )}
              {renderField(
                "Primary Care Provider Name",
                detail.primaryCareProvider || "N/A",
              )}
              {renderField(
                "Primary Care Provider Contact",
                detail.primaryCareProviderContact || "N/A",
              )}
              {renderField(
                "Primary Care Provider Address",
                detail.primaryCareProviderAddress || "N/A",
              )}
              {renderField(
                "Psychiatric Provider Name",
                detail.psychiatricProvider || "N/A",
              )}
              {renderField(
                "Psychiatric Provider Contact",
                detail.psychiatricProviderContact || "N/A",
              )}
              {renderField(
                "Psychiatric Provider Address",
                detail.psychiatricProviderAddress || "N/A",
              )}
              {renderField("Health Plan", detail.healthPlan || "N/A")}
              {renderField("ID", detail.idforPatient || "N/A")}
              {renderField(
                "Presenting Problems",
                renderArray(detail.presentingProblems),
              )}

              {renderFieldFull(
                "Barriers",
                (() => {
                  const mappedBarriers = (detail.stepDownBarriers || []).map(
                    (b) =>
                      ({
                        Cognitive: "Cognitive",
                        "Lack of Insight": "Lack of Insight",
                        Financial: "Financial",
                        "Refusal of Treatment/services":
                          "Refusal of Treatment/services",
                        "Social Stigma": "Social Stigma",
                        "Housing instability": "Housing instability",
                        "Racial/Cultural discrimination":
                          "Racial/Cultural discrimination",
                        "Language/Communication barriers":
                          "Language/Communication barriers",
                        "Poor health literacy": "Poor health literacy",
                        "Social determinants of health":
                          "Social determinants of health",
                        "Limited availibility to Mental Health awareness & Education":
                          "Limited availibility to Mental Health awareness & Education",
                        "Lack of Mental Health professionals & Services":
                          "Lack of Mental Health professionals & Services",
                        "lackofMentalHealthprofessionals&Services":
                          "Lack of Mental Health professionals & Services",
                        "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations":
                          "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations",
                        "warningSigns&SymptomsofSuicidalIdeations":
                          "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations",
                        "Unresolved Trauma": "Unresolved Trauma",
                        "Emerging Psychotic symptoms":
                          "Emerging Psychotic symptoms",
                        "Substance use cravings": "Substance use cravings",
                        "Cognitive distortions": "Cognitive distortions",
                        "Functional dependence": "Functional dependence",
                        "Lack of coordination between care providers":
                          "Lack of coordination between care providers",
                        "Geographical barriers": "Geographical barriers",
                        Transportation: "Transportation",
                        Childcare: "Childcare",
                        "Time constraint": "Time constraint",
                        Other: "Other",
                      })[b] || b,
                  );
                  return (
                    renderArrayWithOtherAtEnd(
                      mappedBarriers,
                      detail.stepDownBarriersOther,
                    ) +
                    (detail.stepDownBarriersText
                      ? ` - Comment: ${detail.stepDownBarriersText}`
                      : "")
                  );
                })(),
              )}
              {renderAllergiesTable(detail.allergies)}
              {renderFieldFull("Past Surgeries", detail.pastSurgeries || "N/A")}
              {renderFieldFull(
                "Discharge planning and After care planning",
                renderArrayWithOtherAtEnd(
                  detail.dischargePlanningAndAfterCarePlanning,
                  detail.dischargePlanningAndAfterCarePlanningOther,
                ),
              )}
              {renderFieldFull(
                "Additional discharge planning details",
                detail.isAdditionalDischargePlanningChecked === true
                  ? "Yes"
                  : detail.isAdditionalDischargePlanningChecked === false
                    ? "No"
                    : "N/A",
              )}
              {detail.isAdditionalDischargePlanningChecked &&
                renderFieldFull(
                  "Specify ( If Others )",
                  detail.additionalDischargePlanningComment || "N/A",
                )}
              {renderFieldFull(
                "Readiness for discharge",
                detail.readinessDischarge || "N/A",
              )}
              {renderFieldFull(
                "Transition planning and recommendations for further programs upon discharge",
                renderArrayWithOtherAtEnd(
                  detail.recommendationsForFurtherPrograms,
                  detail.recommendationsForFurtherProgramsOther,
                ),
              )}
              {renderFieldFull(
                "Resident to continue to attend support groups like",
                renderArrayWithOtherAtEnd(
                  detail.supportGroups,
                  detail.supportGroupsOther,
                ),
              )}
              <Col md={12} className="mt-4 mb-3 px-0">
                {renderDiagnoses(
                  "Mental Health Diagnoses",
                  detail.psychiatricDiagnoses,
                )}
              </Col>
              <Col md={12} className="mt-2 mb-4 px-0">
                {renderDiagnoses("Medical Diagnoses", detail.medicalDiagnoses)}
              </Col>
            </Row>
            <Row>
              <Col>
                <button
                  className="print_btn hidePrint"
                  type="button"
                  onClick={print}
                >
                  PRINT REPORT
                </button>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HOC({
  Wcomponenet: ViewReassessment,
});
