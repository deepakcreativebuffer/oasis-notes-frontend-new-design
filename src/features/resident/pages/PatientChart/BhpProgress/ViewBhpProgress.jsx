/** @format */

import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { getData } from "@/features/shared/services";
import { useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import {
  PrintThis,
  formatDateToMMDDYYYY,
  signatureFormat,
  convertTimeFormat,
} from "@/utils";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
const ViewBhpProgress = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = useRef(null);
  useEffect(() => {
    getData(setData, `bhp-progress/${id}`);
  }, [id]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        data?.data?.patientId,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(data?.data?.patientId),
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
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper isArrow={true} title={"BHP Progress Notes"} />
      <Container>
        <div className="discharge-summary" ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">BHP Progress Notes</h1>
          <div className="view-details print-view-details">
            <Row>
              <Col
                col={12}
                sm={5}
                md={6}
                lg={6}
                className={`${!data?.data?.clientName && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Resident Name : </p>
                  <h5 className="view-value mb-0">{data?.data?.clientName}</h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={7}
                md={6}
                lg={6}
                className={`${!data?.data?.patientId?.ahcccsId && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">AHCCCS ID : </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.patientId?.ahcccsId}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={6}
                className={`${!data?.data?.patientId?.diagnosis && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Diagnosis (specify if new or continuing) :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.patientId?.diagnosis}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={7}
                md={6}
                lg={3}
                className={`${!data?.data?.dateOfAdmission && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Admit Date : </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.patientId?.admitDate &&
                      formatDateToMMDDYYYY(data?.data?.patientId?.admitDate)}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={3}
                lg={3}
                className={`${!data?.data?.dateOfDischarge && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Today's date : </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.dateOfDischarge &&
                      formatDateToMMDDYYYY(data?.data?.dateOfDischarge)}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={3}
                lg={3}
                className={`${!data?.data?.startTime && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Start Time : </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.startTime &&
                      convertTimeFormat(data?.data?.startTime, hoursFormat)}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={3}
                lg={3}
                className={`${!data?.data?.endTime && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">End Time : </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.endTime &&
                      convertTimeFormat(data?.data?.endTime, hoursFormat)}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={3}
                lg={3}
                className={`${!data?.data?.totalDuration && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Total Duration : </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.totalDuration}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={3}
                lg={3}
                className={`${!data?.data?.placeOfService && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Place of Services : </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.placeOfService}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.residentProgress && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Focus of session/Therapeutic intervention:{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.residentProgress}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.sustainingSobriety && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Sustaining Sobriety and managing physical Health:{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.sustainingSobriety}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.addressingCognitive && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Cognitive and emotional challenges:
                  </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.addressingCognitive}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.continuedTherapeutic && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    {" "}
                    Continued Therapeutic Support:{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.continuedTherapeutic}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.progressTowardsTreatment && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Progress towards treatment goals:
                  </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.progressTowardsTreatment}
                  </h5>
                </div>
              </Col>
              <Col col={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Barriers: </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.patientId?.stepDownBarriers
                      .map(
                        (item) =>
                          ({
                            Cognitive: "Cognitive",
                            cognitive: "Cognitive",
                            "Lack of Insight": "Lack of Insight",
                            lackOfInsight: "Lack of Insight",
                            Financial: "Financial",
                            financial: "Financial",
                            "Refusal of Treatment/services":
                              "Refusal of Treatment/services",
                            refusalOfTreatment: "Refusal of Treatment/services",
                            "Social Stigma": "Social Stigma",
                            socialStigma: "Social Stigma",
                            "Housing instability": "Housing instability",
                            housinginstability: "Housing instability",
                            "Racial/Cultural discrimination":
                              "Racial/Cultural discrimination",
                            racial: "Racial/Cultural discrimination",
                            "Language/Communication barriers":
                              "Language/Communication barriers",
                            language: "Language/Communication barriers",
                            "Poor health literacy": "Poor health literacy",
                            poorHealth: "Poor health literacy",
                            "Social determinants of health":
                              "Social determinants of health",
                            socialDeterminants: "Social determinants of health",
                            "Limited availibility to Mental Health awareness & Education":
                              "Limited availibility to Mental Health awareness & Education",
                            limitedavailibilitytoMentalHealthawarenessEducation:
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
                            unresolvedTrauma: "Unresolved Trauma",
                            "Emerging Psychotic symptoms":
                              "Emerging Psychotic symptoms",
                            emergingPsychoticsymptoms:
                              "Emerging Psychotic symptoms",
                            "Substance use cravings": "Substance use cravings",
                            substanceUseCravings: "Substance use cravings",
                            "Cognitive distortions": "Cognitive distortions",
                            cognitiveDistortions: "Cognitive distortions",
                            "Functional dependence": "Functional dependence",
                            functionalDependence: "Functional dependence",
                            "Lack of coordination between care providers":
                              "Lack of coordination between care providers",
                            lackOfCoordination:
                              "Lack of coordination between care providers",
                            "Geographical barriers": "Geographical barriers",
                            geographicalBarriers: "Geographical barriers",
                            Transportation: "Transportation",
                            transportation: "Transportation",
                            Childcare: "Childcare",
                            childcare: "Childcare",
                            "Time constraint": "Time constraint",
                            timeConstraint: "Time constraint",
                            Other: `Other ${data?.data?.patientId?.stepDownBarriersOther ? ` - ${data?.data?.patientId?.stepDownBarriersOther}` : ""}`,
                            other: `Other ${data?.data?.patientId?.stepDownBarriersOther ? ` - ${data?.data?.patientId?.stepDownBarriersOther}` : ""}`,
                          })[item] || item,
                      )
                      .join(", ")}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.patientId?.stepDownBarriersText && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Barriers Comment: </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.patientId?.stepDownBarriersText}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.reasonForContinuedStay && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Planned interventions/Reason for continued stay:{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.reasonForContinuedStay}
                  </h5>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${(!data?.data?.dress || data?.data?.dress.length === 0) && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-1">
                    Dress (clothing/appearance):
                  </p>
                  <h5 className="view-value mb-0">
                    {(data?.data?.dress || []).join(", ")}
                  </h5>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${(!data?.data?.grooming || data?.data?.grooming.length === 0) && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-1">Grooming (hygiene):</p>
                  <h5 className="view-value mb-0">
                    {(data?.data?.grooming || []).join(", ")}
                  </h5>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${(!data?.data?.psychomotorActivity || data?.data?.psychomotorActivity.length === 0) && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-1">
                    Psychomotor Activity:
                  </p>
                  <h5 className="view-value mb-0">
                    {(data?.data?.psychomotorActivity || []).join(", ")}
                  </h5>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${(!data?.data?.speech || data?.data?.speech.length === 0) && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-1">Speech:</p>
                  <h5 className="view-value mb-0">
                    {(data?.data?.speech || []).join(", ")}
                  </h5>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${(!data?.data?.affect || data?.data?.affect.length === 0) && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-1">
                    Affect(Facial expressions):
                  </p>
                  <h5 className="view-value mb-0">
                    {(data?.data?.affect || [])
                      .map((item) =>
                        item === "Other"
                          ? `Other: ${data?.data?.affectOther || ""}`
                          : item,
                      )
                      .join(", ")}
                  </h5>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${(!data?.data?.mood || data?.data?.mood.length === 0) && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-1">Mood:</p>
                  <h5 className="view-value mb-0">
                    {(data?.data?.mood || [])
                      .map((item) =>
                        item === "Other"
                          ? `Other: ${data?.data?.moodOther || ""}`
                          : item,
                      )
                      .join(", ")}
                  </h5>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${(!data?.data?.process || data?.data?.process.length === 0) && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-1">
                    Process (How they are sharing):
                  </p>
                  <h5 className="view-value mb-0">
                    {(data?.data?.process || [])
                      .map((item) =>
                        item === "Other"
                          ? `Other: ${data?.data?.processOther || ""}`
                          : item,
                      )
                      .join(", ")}
                  </h5>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${(!data?.data?.content || data?.data?.content.length === 0) && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-1">
                    Content (What they are sharing):
                  </p>
                  <h5 className="view-value mb-0">
                    {(data?.data?.content || [])
                      .map((item) =>
                        item === "Other"
                          ? `Other: ${data?.data?.contentOther || ""}`
                          : item,
                      )
                      .join(", ")}
                  </h5>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${(!data?.data?.perceptions || data?.data?.perceptions.length === 0) && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-1">Perceptions:</p>
                  <h5 className="view-value mb-0">
                    {(data?.data?.perceptions || []).join(", ")}
                  </h5>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${(!data?.data?.judgment || data?.data?.judgment.length === 0) && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-1">
                    Judgment(ability to make considered decisions):
                  </p>
                  <h5 className="view-value mb-0">
                    {(data?.data?.judgment || []).join(", ")}
                  </h5>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${(!data?.data?.insight || data?.data?.insight.length === 0) && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-1">
                    Insight (insight is accurate and deep intuitive
                    understanding):
                  </p>
                  <h5 className="view-value mb-0">
                    {(data?.data?.insight || []).join(", ")}
                  </h5>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.suicidalIdeation && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-1">Suicidal Ideation:</p>
                  <h5 className="view-value mb-0">
                    {data?.data?.suicidalIdeation}
                    {data?.data?.suicidalIdeation === "Yes" &&
                    data?.data?.suicidalIdeationOther
                      ? ` - ${data?.data?.suicidalIdeationOther}`
                      : ""}
                  </h5>
                </div>
              </Col>

              <Col
                col={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!data?.data?.bhpNameAndCredentials && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">BHP Name and credential: </p>
                  <h5 className="view-value mb-0">
                    {data?.data?.bhpNameAndCredentials}
                  </h5>
                </div>
              </Col>
            </Row>

            <div className="signature-sections-inline mt-3">
              <SignatureSection
                role="bht"
                label="BHT Signature"
                variant="blue"
                mode="view"
                signature={data?.data?.signatures?.bht}
              />
              <SignatureSection
                role="bhp"
                label="BHP Signature"
                variant="pink"
                mode="view"
                signature={data?.data?.signatures?.bhp}
              />
              {/* <SignatureSection
                role="resident"
                label="Resident/Representative Signature"
                variant="blue"
                mode="view"
                signature={data?.data?.signatures?.resident}
                signerNameOverride={
                  data?.data?.clientName ||
                  data?.data?.residentName ||
                  `${data?.data?.patientId?.firstName ?? ""} ${data?.data?.patientId?.lastName ?? ""}`.trim()
                }
              /> */}
              {/* <SignatureSection
                role="witness"
                label="Witness Signature"
                variant="yellow"
                mode="view"
                signature={data?.data?.signatures?.witness}
              /> */}
            </div>

            <Row>
              <Col col={12} md={12} lg={12}>
                <p className="text-end mb-0">
                  {signatureFormat({
                    sign: data?.data?.bhpSignature,
                    date: data?.data?.bhpSignatureDateTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: data?.data?.adminSignature,
                    date: data?.data?.adminDateSigned,
                    time: data?.data?.adminSignedTime,
                    hoursFormat,
                  })}
                </p>
                {data?.data?.signers?.map?.((signer) =>
                  signer?.signature?.length ? (
                    <p className="text-end mb-0">
                      {signatureFormat({
                        sign: signer?.signature,
                        date: signer?.dateSigned,
                        time: signer?.signedTime,
                        hoursFormat,
                      })}
                    </p>
                  ) : null,
                )}
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
  Wcomponenet: ViewBhpProgress,
});
