/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import { RadioMaker } from "@/utils/Makers";
import { employmentService } from "@/features/shared/services";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
const Appendix = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const { id } = useParams();
  const [name, setName] = useState("");
  const [nameDate, setNameDate] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [resident, setResident] = useState("");
  const [spentMoreThan30DaysAbroad, setSpentMoreThan30DaysAbroad] =
    useState("YES");
  const [closeContactWithActiveTB, setCloseContactWithActiveTB] =
    useState("YES");
  const [symptomsFever, setSymptomsFever] = useState("YES");
  const [symptomsCough, setSymptomsCough] = useState("YES");
  const [symptomsBloodySputum, setSymptomsBloodySputum] = useState("YES");
  const [symptomsUnintendedWeightLoss, setSymtomsUnintendedWeightLoss] =
    useState("YES");
  const [symptomsNightSweats, setSymptonsNightSweats] = useState("YES");
  const [symptomsUnexplainedFatigue, setSymtomsUnexplainedFatigue] =
    useState("YES");
  const [treatedForTB, setTratedForTB] = useState("YES");
  const [treatmentDetails, setTreatmentDetails] = useState("");
  const [diagnosedWithLatentTB, setDiagnosedWithLatentTB] = useState("YES");
  const [diagnosedWithActiveTB, setDiagnosedWithActiveTB] = useState("YES");
  const [positiveTestForTB, setPositiveTestForTB] = useState("YES");
  const [compromisedImmuneSystem, setCompromisedImmuneSystem] = useState("YES");
  const [statementAccuracy, setStatementAccuracy] = useState("YES");
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeSignatureDate, setEmployeeSignatureDate] = useState("");
  const [employeeSignatureTime, setEmployeeSignatureTime] = useState("");
  const [OccupationalSignature, setOccupationalSignature] = useState("");
  const [OccupationalSignatureDate, setOccupationSignatureDate] = useState("");
  const [OccupationalSignatureTime, setOccupationSignatureTime] = useState("");
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const saveAsDraft = false;
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [signers, setSigners] = useState([]);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminSignatureDate, setAdminSignatureDate] = useState("");
  const [adminSignatureTime, setAdminSignatureTime] = useState("");
  useEffect(() => {
    employmentService.getAppendixById(id, { setResponse });
  }, [id]);
  useEffect(() => {
    if (response) {
      const item = response?.data;
      setName(item?.name);
      setNameDate(item?.nameDate);
      setEmployeeName(
        `${item?.employeeName?.firstName} ${item?.employeeName?.lastName}`,
      );
      setResident(`${item?.resident?.firstName} ${item?.resident?.lastName}`);
      setSpentMoreThan30DaysAbroad(item?.spentMoreThan30DaysAbroad);
      setCloseContactWithActiveTB(item?.closeContactWithActiveTB);
      setSymptomsFever(item?.symptomsFever);
      setSymptomsCough(item?.symptomsCough);
      setSymptomsBloodySputum(item?.symptomsBloodySputum);
      setSymtomsUnintendedWeightLoss(item?.symptomsUnintendedWeightLoss);
      setSymptonsNightSweats(item?.symptomsNightSweats);
      setSymtomsUnexplainedFatigue(item?.symptomsUnexplainedFatigue);
      setTratedForTB(item?.treatedForTB);
      setTreatmentDetails(item?.treatmentDetails);
      setDiagnosedWithLatentTB(item?.diagnosedWithLatentTB);
      setDiagnosedWithActiveTB(item?.diagnosedWithActiveTB);
      setPositiveTestForTB(item?.positiveTestForTB);
      setCompromisedImmuneSystem(item?.compromisedImmuneSystem);
      setStatementAccuracy(item?.statementAccuracy);
      setEmployeeSignature(item?.employeeSignature);
      setEmployeeSignatureDate(item?.employeeSignatureDate);
      setEmployeeSignatureTime(item?.employeeSignatureTime);
      setOccupationalSignature(item?.OccupationalSignature);
      setOccupationSignatureDate(item?.OccupationalSignatureDate);
      setOccupationSignatureTime(item?.OccupationalSignatureTime);
      setSigners(item?.signers);
      setAdminSignature(item?.adminSignature);
      setAdminSignatureDate(item?.adminSignatureDate);
      setAdminSignatureTime(item?.adminSignatureTime);
    }
  }, [response]);

  // Download Report
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        response?.data?.employeeId,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      response?.data?.employeeId,
      profileInfo,
    ),
    pageStyle: `
    @page {
      size: portrait !important;
      margin: 12mm 9mm!important;
    }    
    .card {
      page-break-inside: avoid;
    }
    .view-details-grid {
      page-break-inside: avoid;
    }
  `,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const print = usePrint(printRef, handlePrint2);
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper isArrow={true} title="TB Risk Assessment" />
      <Container>
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">TB Risk Assessment</h1>
          <Form>
            <Form.Label className="fw-bold w-100">
              Tuberculosis (TB) Screening and Risk Assessment Form for Newly
              Hired and Residents
            </Form.Label>
            <Row>
              {employeeName && !employeeName?.includes("undefined") && (
                <Col col={12} sm={4} md={4} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Employee : </p>
                    <h5 className="view-value mb-0">{employeeName}</h5>
                  </div>
                </Col>
              )}
              {resident && !resident?.includes("undefined") && (
                <Col col={12} sm={4} md={4} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Resident : </p>
                    <h5 className="view-value mb-0">{resident}</h5>
                  </div>
                </Col>
              )}
              <Col col={12} sm={4} md={4} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date : </p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(nameDate)}
                  </h5>
                </div>
              </Col>
              <Col col={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid d-block my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-2">
                    2. Have you EVER spent more than 30 days in a country with
                    an elevated TB rate? This includes all countries except
                    those in Western Europe, Northern Europe, Canada, Australia,
                    and New Zealand :
                  </p>
                  <div className="radio-inline">
                    <RadioMaker
                      name="spendMoreThanDays"
                      setValue={setSpentMoreThan30DaysAbroad}
                      value={"YES"}
                      disableRadio
                      id={"spendMoreThanDays1"}
                      label={
                        "A. YES I have been in a foreign country for >30 days (not including those listed above)"
                      }
                      checked={spentMoreThan30DaysAbroad}
                    />
                    <RadioMaker
                      name="spendMoreThanDays"
                      setValue={setSpentMoreThan30DaysAbroad}
                      value={"NO"}
                      disableRadio
                      id={"spendMoreThanDays2"}
                      label={
                        "B.	NO I have not been in any country for >30 days except the ones listed above"
                      }
                      checked={spentMoreThan30DaysAbroad}
                    />
                  </div>
                </div>
              </Col>
              <Col col={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-2">
                    3. Have you had close contact with anyone who had active TB
                    since your last TB test? :
                  </p>
                  <div className="radio-inline">
                    <RadioMaker
                      name="closeContactWithActiveTB"
                      setValue={setCloseContactWithActiveTB}
                      value={"YES"}
                      disableRadio
                      id={"closeContactWithActiveTB1"}
                      label={"Yes"}
                      checked={closeContactWithActiveTB}
                    />
                    <RadioMaker
                      name="closeContactWithActiveTB"
                      setValue={setCloseContactWithActiveTB}
                      value={"NO"}
                      disableRadio
                      id={"closeContactWithActiveTB2"}
                      label={"No"}
                      checked={closeContactWithActiveTB}
                    />
                  </div>
                </div>
              </Col>
              <Col col={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid d-block my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-2">
                    4. Do you currently have any of the following symptoms :
                  </p>
                  <div className="radio-inline">
                    <Form.Label className="me-3">
                      a. unexplained fever for more than 3 weeks
                    </Form.Label>
                    <RadioMaker
                      name="symptomsFever"
                      setValue={setSymptomsFever}
                      value={"YES"}
                      disableRadio
                      id={"symptomsFever1"}
                      label={"Yes"}
                      checked={symptomsFever}
                    />
                    <RadioMaker
                      name="symptomsFever"
                      setValue={setSymptomsFever}
                      value={"NO"}
                      disableRadio
                      id={"symptomsFever2"}
                      label={"No"}
                      checked={symptomsFever}
                    />
                  </div>
                  <div className="radio-inline">
                    <Form.Label className="me-3">
                      b. cough for more than 3 weeks with sputum production
                    </Form.Label>
                    <RadioMaker
                      name="symptomsCough"
                      value={"YES"}
                      disableRadio
                      id={"symptomsCough1"}
                      label={"Yes"}
                      checked={symptomsCough}
                    />
                    <RadioMaker
                      name="symptomsCough"
                      value={"NO"}
                      disableRadio
                      id={"symptomsCough2"}
                      label={"No"}
                      checked={symptomsCough}
                    />
                  </div>
                  <div className="radio-inline">
                    <Form.Label className="me-3">c. bloody sputum</Form.Label>
                    <RadioMaker
                      name="symptomsBloodySputum"
                      value={"YES"}
                      disableRadio
                      id={"symptomsBloodySputum1"}
                      label={"Yes"}
                      checked={symptomsBloodySputum}
                    />
                    <RadioMaker
                      name="symptomsBloodySputum"
                      value={"NO"}
                      disableRadio
                      id={"symptomsBloodySputum2"}
                      label={"No"}
                      checked={symptomsBloodySputum}
                    />
                  </div>
                  <div className="radio-inline">
                    <Form.Label className="me-3">
                      d. unintended weight loss {">"} 10 pounds
                    </Form.Label>
                    <RadioMaker
                      name="symptomsUnintendedWeightLoss"
                      setValue={setSymtomsUnintendedWeightLoss}
                      value={"YES"}
                      disableRadio
                      id={"symptomsUnintendedWeightLoss1"}
                      label={"Yes"}
                      checked={symptomsUnintendedWeightLoss}
                    />
                    <RadioMaker
                      name="symptomsUnintendedWeightLoss"
                      setValue={setSymtomsUnintendedWeightLoss}
                      value={"NO"}
                      disableRadio
                      id={"symptomsUnintendedWeightLoss2"}
                      label={"No"}
                      checked={symptomsUnintendedWeightLoss}
                    />
                  </div>
                  <div className="radio-inline">
                    <Form.Label className="me-3">
                      e. drenching night sweats
                    </Form.Label>
                    <RadioMaker
                      name="symptomsNightSweats"
                      setValue={setSymptonsNightSweats}
                      value={"YES"}
                      disableRadio
                      id={"symptomsNightSweats1"}
                      label={"Yes"}
                      checked={symptomsNightSweats}
                    />
                    <RadioMaker
                      name="symptomsNightSweats"
                      setValue={setSymptonsNightSweats}
                      value={"NO"}
                      disableRadio
                      id={"symptomsNightSweats2"}
                      label={"No"}
                      checked={symptomsNightSweats}
                    />
                  </div>
                  <div className="radio-inline">
                    <Form.Label className="me-3">
                      f. unexplained fatigue for more than 3 weeks
                    </Form.Label>
                    <RadioMaker
                      name="symptomsUnexplainedFatigue"
                      setValue={setSymtomsUnexplainedFatigue}
                      value={"YES"}
                      id={"symptomsUnexplainedFatigue1"}
                      label={"Yes"}
                      disableRadio
                      checked={symptomsUnexplainedFatigue}
                    />
                    <RadioMaker
                      name="symptomsUnexplainedFatigue"
                      setValue={setSymtomsUnexplainedFatigue}
                      value={"NO"}
                      id={"symptomsUnexplainedFatigue2"}
                      label={"No"}
                      disableRadio
                      checked={symptomsUnexplainedFatigue}
                    />
                  </div>
                </div>
              </Col>
              <Col col={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-2">
                    5. Have you been treated with medication for TB or for a
                    positive TB test ? :
                  </p>
                  <div className="radio-inline">
                    <RadioMaker
                      name="treatedForTB"
                      setValue={setTratedForTB}
                      value={"YES"}
                      disableRadio
                      id={"treatedForTB1"}
                      label={"Yes"}
                      checked={treatedForTB}
                    />
                    <RadioMaker
                      name="treatedForTB"
                      setValue={setTratedForTB}
                      value={"NO"}
                      disableRadio
                      id={"treatedForTB2"}
                      label={"No"}
                      checked={treatedForTB}
                    />
                  </div>
                  {treatedForTB === "YES" && (
                    <div className="radio-inline mt-3">
                      <p className="view-label fw-bold mb-2">
                        If YES, what year, with which medication, for how long,
                        and did you complete the treatment course?
                      </p>
                      <h5 className="view-value mb-0">{treatmentDetails}</h5>
                    </div>
                  )}
                </div>
              </Col>
              <Col col={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-2">
                    6. Have you ever been diagnosed with latent TB infection? :
                  </p>
                  <div className="radio-inline">
                    <RadioMaker
                      name="diagnosedWithLatentTB"
                      setValue={setDiagnosedWithLatentTB}
                      value={"YES"}
                      disableRadio
                      id={"diagnosedWithLatentTB1"}
                      label={"Yes"}
                      checked={diagnosedWithLatentTB}
                    />
                    <RadioMaker
                      name="diagnosedWithLatentTB"
                      setValue={setDiagnosedWithLatentTB}
                      value={"NO"}
                      disableRadio
                      id={"diagnosedWithLatentTB2"}
                      label={"No"}
                      checked={diagnosedWithLatentTB}
                    />
                  </div>
                </div>
              </Col>
              <Col col={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label fw-bold mb-2">
                    7. Have you ever been diagnosed with active TB disease? :
                  </p>
                  <div className="radio-inline">
                    <RadioMaker
                      name="diagnosedWithActiveTB"
                      setValue={setDiagnosedWithActiveTB}
                      value={"YES"}
                      disableRadio
                      id={"diagnosedWithActiveTB1"}
                      label={"Yes"}
                      checked={diagnosedWithActiveTB}
                    />
                    <RadioMaker
                      name="diagnosedWithActiveTB"
                      setValue={setDiagnosedWithActiveTB}
                      value={"NO"}
                      disableRadio
                      id={"diagnosedWithActiveTB2"}
                      label={"No"}
                      checked={diagnosedWithActiveTB}
                    />
                  </div>
                </div>
              </Col>

              <Col col={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label d-inline-flex fw-bold mb-2">
                    8. Do you have a compromised immune system such as from any
                    of the following conditions : HIV infection, organ
                    transplant, bone marrow transplant, recent chemotherapy,{" "}
                    poorly controlled diabetes, cancer, or treatment with
                    steroids for more than 1 month, l eukemia, lymphoma,
                    gastrectomy or jejuna bypass, end stage renal disease (on
                    dialysis) or silicosis. :
                  </p>
                  <div className="radio-inline">
                    <RadioMaker
                      name="compromisedImmuneSystem"
                      setValue={setCompromisedImmuneSystem}
                      value={"YES"}
                      disableRadio
                      id={"compromisedImmuneSystem1"}
                      label={"Yes"}
                      checked={compromisedImmuneSystem}
                    />
                    <RadioMaker
                      name="compromisedImmuneSystem"
                      setValue={setCompromisedImmuneSystem}
                      value={"NO"}
                      disableRadio
                      id={"compromisedImmuneSystem2"}
                      label={"No"}
                      checked={compromisedImmuneSystem}
                    />
                  </div>
                </div>
              </Col>

              <Col col={12} sm={12} md={12} lg={12}>
                <Row className="mt-2">
                  <Col col={12} sm={4} md={4} lg={4}>
                    <Form.Label className="fw-bold">
                      Employee Signature
                    </Form.Label>
                  </Col>
                  <Col col={12} sm={8} md={8} lg={8} className="text-sm-end">
                    {signatureFormat({
                      sign: employeeSignature,
                      date: employeeSignatureDate,
                      time: employeeSignatureTime,
                      hoursFormat,
                    })}
                    {signatureFormat({
                      sign: adminSignature,
                      date: adminSignatureDate,
                      time: adminSignatureTime,
                      hoursFormat,
                    })}
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
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col col={12} sm={12} md={12} lg={12}>
                    <Form.Label>
                      Integrated Tuberculosis (TB) Screening and Risk Assessment
                      Form for Newly Hired and Residents
                    </Form.Label>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col col={12} sm={12} md={12} lg={12}>
                <button
                  className="print_btn hidePrint"
                  type="button"
                  onClick={print}
                >
                  PRINT REPORT
                </button>
              </Col>
            </Row>
          </Form>
        </div>
      </Container>
    </div>
  );
};
export default Appendix;
