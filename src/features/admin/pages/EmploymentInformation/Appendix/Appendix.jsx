/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Form, Card, Row, Col, Button } from "react-bootstrap";
import "./Appendix.css";
import NavWrapper from "@/utils/NavWrapper";
import { RadioMaker } from "@/utils/Makers";
import { employmentService, employeeService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useNavigate } from "react-router-dom";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import EmployeeComponent from "@/features/shared/ui/Search/EmployeeComponent";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import { ROLES } from "@/features/shared/constants";
import { downloadReport, showNotification } from "@/utils";
const Appendix = () => {
  const currentUser = useSelector(userProfile);
  const hoursFormat = currentUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [name, setName] = useState("");
  const [nameDate, setNameDate] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState("");
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
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const payload = {
    name,
    nameDate,
    ...(employeeName && {
      employeeName,
    }),
    ...(employeeId && {
      employeeId,
    }),
    ...(resident && {
      resident,
    }),
    spentMoreThan30DaysAbroad,
    closeContactWithActiveTB,
    symptomsFever,
    symptomsCough,
    symptomsBloodySputum,
    symptomsUnintendedWeightLoss,
    symptomsNightSweats,
    symptomsUnexplainedFatigue,
    treatedForTB,
    treatmentDetails,
    diagnosedWithLatentTB,
    diagnosedWithActiveTB,
    positiveTestForTB,
    compromisedImmuneSystem,
    statementAccuracy,
    employeeSignature,
    employeeSignatureDate,
    employeeSignatureTime,
    OccupationalSignature,
    OccupationalSignatureDate,
    OccupationalSignatureTime,
    saveAsDraft,
    signers: signers?.map((signer) => ({
      signerId: signer.value,
      name: signer.label,
      signature: "",
      dateSigned: "",
      signedTime: "",
    })),
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!payload.employeeName && !payload.resident) {
      showNotification({
        message: "Please provide either an Employee Name or a Resident.",
        type: "danger",
      });
      return;
    } else {
      employmentService.appendix.create(payload, {
        successMsg: "Created !",
        setLoading,
        navigate,
      });
    }
  };
  useEffect(() => {
    employmentService.getAppendixAssessment({ setResponse });
  }, []);
  useEffect(() => {
    employeeService.getEmployee({ setResponse: setData });
  }, []);
  useEffect(() => {
    if (response) {
      const item = response?.data;
      if (item) {
        setName(item?.name);
        setNameDate(item?.nameDate);
        setEmployeeName(item?.employeeName);
        setResident(item?.resident);
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
      }
    }
  }, [response]);

  // Download Report
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        response?.data?.employeeId,
        currentUser,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      response?.data?.employeeId,
      currentUser,
    ),
    pageStyle: `
    @page {
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
  return (
    <>
      <AddSignature
        show={open}
        setValue={setEmployeeSignature}
        setTime={setEmployeeSignatureTime}
        setDate={setEmployeeSignatureDate}
      />
      <AddSignature
        show={open1}
        setValue={setOccupationalSignature}
        setTime={setOccupationSignatureTime}
        setDate={setOccupationSignatureDate}
      />
      <NavWrapper isArrow={true} title="TB Risk Assessment" />
      <Container>
        <div ref={componentRef} className="risk-assessment-print">
          <h1 className="pdfTitle my-3 hidden">TB Risk Assessment</h1>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-1">
              <Col xs={12} sm={12}>
                <Form.Group className="mb-1">
                  <Form.Label className="fw-bold">
                    {" "}
                    Tuberculosis (TB) Screening and Risk Assessment Form for
                    Newly Hired and Residents
                  </Form.Label>
                </Form.Group>
              </Col>
            </Row>
            <Card body className="mb-3">
              <Row className="mb-3">
                <Col xs={12} sm={12} md={6} lg={4}>
                  <Form.Label className="fw-bold">1. Employee</Form.Label>
                  {currentUser.userType === ROLES.ADMIN ? (
                    <EmployeeComponent
                      className={"grid-item"}
                      MainPatientId={setEmployeeName}
                      setWholeData={setEmployeeData}
                      MainResidentName={setEmployeeName}
                    />
                  ) : (
                    <>
                      <Form.Group className="form-print-group-align form-print-group">
                        <Form.Select
                          onChange={(e) => setEmployeeName(e.target.value)}
                        >
                          <option value={""}>Select Employee</option>
                          {data?.data?.length > 0 &&
                            data?.data?.map((item) => {
                              if (item?.userType !== ROLES.PATIENT) {
                                return (
                                  <option value={item._id} key={item._id}>
                                    {item.firstName} {item.lastName}
                                  </option>
                                );
                              }
                              return null;
                            })}
                        </Form.Select>
                      </Form.Group>
                    </>
                  )}
                </Col>

                <Col xs={12} sm={12} md={6} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Resident</Form.Label>

                    <Form.Select onChange={(e) => setResident(e.target.value)}>
                      <option value={""}>Select Resident</option>
                      {data?.data?.length > 0 &&
                        data?.data?.map((item) => {
                          if (item?.userType === ROLES.PATIENT) {
                            return (
                              <option value={item._id} key={item._id}>
                                {item.firstName} {item.lastName}
                              </option>
                            );
                          }
                          return null;
                        })}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6} md={6} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group d-flex flex-column d-flex flex-column">
                    <Form.Label className="fw-bold">Date</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(nameDate)}
                      onChange={(selectedDate) =>
                        setNameDate(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            nameDate
                              ? formatDateToMMDDYYYY(nameDate)
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
              <Row className="mb-2">
                <Col xs={12}>
                  <Form.Label className="fw-bold">
                    2. Have you EVER spent more than 30 days in a country with
                    an elevated TB rate? This includes all countries except
                    those in Western Europe, Northern Europe, Canada, Australia,
                    and New Zealand
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className="radio-inline">
                    <RadioMaker
                      block
                      name="spendMoreThanDays"
                      setValue={setSpentMoreThan30DaysAbroad}
                      value={"YES"}
                      id={"spendMoreThanDays1"}
                      label={
                        "A. YES I have been in a foreign country for >30 days (not including those listed above)"
                      }
                      checked={spentMoreThan30DaysAbroad}
                      type="radio"
                    />
                    <RadioMaker
                      block
                      name="spendMoreThanDays"
                      setValue={setSpentMoreThan30DaysAbroad}
                      value={"NO"}
                      id={"spendMoreThanDays2"}
                      label={
                        "B.	NO I have not been in any country for >30 days except the ones listed above"
                      }
                      checked={spentMoreThan30DaysAbroad}
                      type="radio"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
            <Card body className="mb-3">
              <Row className="mb-2">
                <Col xs={12}>
                  <Form.Label className="fw-bold">
                    3. Have you had close contact with anyone who had active TB
                    since your last TB test?
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className="radio-inline">
                    <RadioMaker
                      inline
                      name="closeContactWithActiveTB"
                      setValue={setCloseContactWithActiveTB}
                      value={"YES"}
                      id={"closeContactWithActiveTB1"}
                      label={"Yes"}
                      checked={closeContactWithActiveTB}
                      type="radio"
                    />
                    <RadioMaker
                      inline
                      name="closeContactWithActiveTB"
                      setValue={setCloseContactWithActiveTB}
                      value={"NO"}
                      id={"closeContactWithActiveTB2"}
                      label={"No"}
                      checked={closeContactWithActiveTB}
                      type="radio"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
            <Card body className="mb-3">
              <Row className="mb-2">
                <Col xs={12}>
                  <Form.Label className="fw-bold">
                    4. Do you currently have any of the following symptoms
                  </Form.Label>
                </Col>
              </Row>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold">
                  a. Unexplained fever for more than 3 weeks
                </Form.Label>
                <div className="radio-inline">
                  <RadioMaker
                    inline
                    name="symptomsFever"
                    setValue={setSymptomsFever}
                    value={"YES"}
                    id={"symptomsFever1"}
                    label={"Yes"}
                    checked={symptomsFever}
                    type="radio"
                  />
                  <RadioMaker
                    inline
                    name="symptomsFever"
                    setValue={setSymptomsFever}
                    value={"NO"}
                    id={"symptomsFever2"}
                    label={"No"}
                    checked={symptomsFever}
                    type="radio"
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold">
                  b. Cough for more than 3 weeks with sputum production
                </Form.Label>
                <div className="radio-inline">
                  <RadioMaker
                    inline
                    name="symptomsCough"
                    setValue={setSymptomsCough}
                    value={"YES"}
                    id={"symptomsCough1"}
                    label={"Yes"}
                    checked={symptomsCough}
                    type="radio"
                  />
                  <RadioMaker
                    inline
                    name="symptomsCough"
                    setValue={setSymptomsCough}
                    value={"NO"}
                    id={"symptomsCough2"}
                    label={"No"}
                    checked={symptomsCough}
                    type="radio"
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold">c. Bloody sputum</Form.Label>
                <div className="radio-inline">
                  <RadioMaker
                    inline
                    name="symptomsBloodySputum"
                    setValue={setSymptomsBloodySputum}
                    value={"YES"}
                    id={"symptomsBloodySputum1"}
                    label={"Yes"}
                    checked={symptomsBloodySputum}
                    type="radio"
                  />
                  <RadioMaker
                    inline
                    name="symptomsBloodySputum"
                    setValue={setSymptomsBloodySputum}
                    value={"NO"}
                    id={"symptomsBloodySputum2"}
                    label={"No"}
                    checked={symptomsBloodySputum}
                    type="radio"
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold">
                  d. Unintended weight loss {">"} 10 pounds
                </Form.Label>
                <div className="radio-inline">
                  <RadioMaker
                    inline
                    name="symptomsUnintendedWeightLoss"
                    setValue={setSymtomsUnintendedWeightLoss}
                    value={"YES"}
                    id={"symptomsUnintendedWeightLoss1"}
                    label={"Yes"}
                    checked={symptomsUnintendedWeightLoss}
                    type="radio"
                  />
                  <RadioMaker
                    inline
                    name="symptomsUnintendedWeightLoss"
                    setValue={setSymtomsUnintendedWeightLoss}
                    value={"NO"}
                    id={"symptomsUnintendedWeightLoss2"}
                    label={"No"}
                    checked={symptomsUnintendedWeightLoss}
                    type="radio"
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold">
                  e. Drenching night sweats
                </Form.Label>
                <div className="radio-inline">
                  <RadioMaker
                    inline
                    name="symptomsNightSweats"
                    setValue={setSymptonsNightSweats}
                    value={"YES"}
                    id={"symptomsNightSweats1"}
                    label={"Yes"}
                    checked={symptomsNightSweats}
                    type="radio"
                  />
                  <RadioMaker
                    inline
                    name="symptomsNightSweats"
                    setValue={setSymptonsNightSweats}
                    value={"NO"}
                    id={"symptomsNightSweats2"}
                    label={"No"}
                    checked={symptomsNightSweats}
                    type="radio"
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold">
                  f. Unexplained fatigue for more than 3 weeks
                </Form.Label>
                <div className="radio-inline">
                  <RadioMaker
                    inline
                    name="symptomsUnexplainedFatigue"
                    setValue={setSymtomsUnexplainedFatigue}
                    value={"YES"}
                    id={"symptomsUnexplainedFatigue1"}
                    label={"Yes"}
                    checked={symptomsUnexplainedFatigue}
                    type="radio"
                  />
                  <RadioMaker
                    inline
                    name="symptomsUnexplainedFatigue"
                    setValue={setSymtomsUnexplainedFatigue}
                    value={"NO"}
                    id={"symptomsUnexplainedFatigue2"}
                    label={"No"}
                    checked={symptomsUnexplainedFatigue}
                    type="radio"
                  />
                </div>
              </Form.Group>
            </Card>
            <Card body className="mb-3">
              <Row className="mb-2">
                <Col xs={12}>
                  <Form.Label className="fw-bold">
                    5. Have you been treated with medication for TB ?
                  </Form.Label>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={12}>
                  <div className="radio-inline">
                    <RadioMaker
                      inline
                      name="treatedForTB"
                      setValue={setTratedForTB}
                      value={"YES"}
                      id={"treatedForTB1"}
                      label={"Yes"}
                      checked={treatedForTB}
                      type="radio"
                    />
                    <RadioMaker
                      inline
                      name="treatedForTB"
                      setValue={setTratedForTB}
                      value={"NO"}
                      id={"treatedForTB2"}
                      label={"No"}
                      checked={treatedForTB}
                      type="radio"
                    />
                  </div>
                </Col>
              </Row>
              {treatedForTB === "YES" && (
                <Form.Group>
                  <Form.Label className="fw-bold">
                    If YES, what year, with which medication, for how long, and
                    did you complete the treatment course?
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setTreatmentDetails(e.target.value)}
                    type="text"
                    value={treatmentDetails}
                  ></Form.Control>
                </Form.Group>
              )}
            </Card>
            <Card body className="mb-3">
              <Row className="mb-2">
                <Col xs={12}>
                  <Form.Label className="fw-bold">
                    6. Have you ever been diagnosed with latent TB infection or
                    for a positive TB test?
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className="radio-inline">
                    <RadioMaker
                      inline
                      name="diagnosedWithLatentTB"
                      setValue={setDiagnosedWithLatentTB}
                      value={"YES"}
                      id={"diagnosedWithLatentTB1"}
                      label={"Yes"}
                      checked={diagnosedWithLatentTB}
                      type="radio"
                    />
                    <RadioMaker
                      inline
                      name="diagnosedWithLatentTB"
                      setValue={setDiagnosedWithLatentTB}
                      value={"NO"}
                      id={"diagnosedWithLatentTB2"}
                      label={"No"}
                      checked={diagnosedWithLatentTB}
                      type="radio"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
            <Card body className="mb-3">
              <Row className="mb-2">
                <Col xs={12}>
                  <Form.Label className="fw-bold">
                    7. Have you ever been diagnosed with active TB disease?
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className="radio-inline">
                    <RadioMaker
                      inline
                      name="diagnosedWithActiveTB"
                      setValue={setDiagnosedWithActiveTB}
                      value={"YES"}
                      id={"diagnosedWithActiveTB1"}
                      label={"Yes"}
                      checked={diagnosedWithActiveTB}
                      type="radio"
                    />
                    <RadioMaker
                      inline
                      name="diagnosedWithActiveTB"
                      setValue={setDiagnosedWithActiveTB}
                      value={"NO"}
                      id={"diagnosedWithActiveTB2"}
                      label={"No"}
                      checked={diagnosedWithActiveTB}
                      type="radio"
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            <Card body className="mb-3">
              <Row className="mb-2">
                <Col xs={12}>
                  <Form.Label className="fw-bold">
                    8. Do you have a compromised immune system such as from any
                    of the following conditions: HIV infection, organ
                    transplant, bone marrow transplant, recent chemotherapy,
                    poorly controlled diabetes, cancer, or treatment with
                    steroids for more than 1 month, leukemia, lymphoma,
                    gastrectomy or jejuna bypass, end stage renal disease (on
                    dialysis) or silicosis.
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className="radio-inline">
                    <RadioMaker
                      inline
                      name="compromisedImmuneSystem"
                      setValue={setCompromisedImmuneSystem}
                      value={"YES"}
                      id={"compromisedImmuneSystem1"}
                      label={"Yes"}
                      checked={compromisedImmuneSystem}
                      type="radio"
                    />
                    <RadioMaker
                      inline
                      name="compromisedImmuneSystem"
                      setValue={setCompromisedImmuneSystem}
                      value={"NO"}
                      id={"compromisedImmuneSystem2"}
                      label={"No"}
                      checked={compromisedImmuneSystem}
                      type="radio"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
            <Row>
              <Col xs={12} lg={6}>
                <div>
                  <Form.Label className="font-bold">
                    Employee Signature
                  </Form.Label>
                </div>
                <Button
                  type="button"
                  className="theme-button hidePrint"
                  onClick={() => setOpen(true)}
                >
                  SAVED AND SIGNED
                </Button>
              </Col>
              <Col xs={12} lg={6}>
                <Form.Label className="w-100 text-end">
                  {signatureFormat({
                    sign: employeeSignature,
                    date: employeeSignatureDate,
                    time: employeeSignatureTime,
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
                </Form.Label>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label className="mt-2">
                  Integrated Tuberculosis (TB) Screening and Risk Assessment
                  Form for Newly Hired and Residents
                </Form.Label>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col xs={12} lg={12}>
                <Form.Group className="mb-3 hidePrint">
                  <Form.Label className="fw-bold">Signers</Form.Label>
                  <MultiEmployee
                    setValue={setSigners}
                    value={signers}
                    alsoResident
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2 text-center">
              <Col xs={12} lg={12}>
                <div className="employee-btn-joiner mt-2 mt-md-5">
                  <button
                    type="submit"
                    className="employee_create_btn hidePrint"
                    disabled={employeeSignature?.length === 0}
                  >
                    {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: Appendix,
});
