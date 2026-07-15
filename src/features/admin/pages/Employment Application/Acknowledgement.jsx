/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useState } from "react";
import { Container, Form, Card, Button, Row, Col } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import {
  adminDashboardService,
  employmentService,
} from "@/features/shared/services";
import { InputMaker } from "@/utils/Makers";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { AddSignature, signatureFormat } from "@/utils/utils";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ROLES } from "@/features/shared/constants";
import { downloadReport } from "@/utils";
const Acknowledgement = () => {
  const [searchParams] = useSearchParams();
  const edit = searchParams.get("edit");
  const profileInfo = useSelector(userProfile);
  const { employeId } = useParams();
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [skill, setSkill] = useState("");
  const [nameOfApplicant, setNameOfApplicant] = useState("");
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState({});
  const [open, setOpen] = useState(false);
  const [signature, setSignature] = useState("");
  const [signdate, setSignDate] = useState("");
  const [signtime, setSignTime] = useState("");
  const [adminSignature, setAdminSignature] = useState("");
  const [adminSigndate, setAdminSignDate] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const payload = {
    companyName,
    skill,
    nameOfApplicant,
    signature,
    signdate,
    signtime,
    adminSignature,
    adminSigndate,
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    adminDashboardService.createEmployeeSkillQualification(payload, {
      setLoading,
      successMsg: "Acknowledgement added !",
    });
    navigate(
      edit && profileInfo?.userType === ROLES.EMPLOYEE
        ? "/all-forms"
        : "/view-employement-application",
    );
  };
  const updateSubmitHandle = async (e) => {
    e.preventDefault();
    adminDashboardService.updateEmployeeSkillQualification(employeId, payload, {
      setLoading,
      successMsg: "Acknowledgement added !",
    });
    navigate(`/dashboard/employee-data/${employeId}`);
  };
  useEffect(() => {
    employmentService.getSkillAndQualification({
      ...(profileInfo?.userType === ROLES.ADMIN ? { employeId } : {}),
      setResponse: setDetail,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (detail) {
      const item = detail?.data;
      setCompanyName(item?.companyName);
      setSkill(item?.skill);
      setNameOfApplicant(item?.nameOfApplicant);
      setSignature(item?.signature);
      setSignDate(item?.signdate);
      setSignTime(item?.signtime);
      setAdminSignature(item?.adminSignature);
      setAdminSignDate(item?.adminSigndate);
    }
  }, [detail]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        detail?.data?.employeeId,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      detail?.data?.employeeId,
      profileInfo,
    ),
    pageStyle: `
    @page {
      margin: 10mm !important;
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
  const companyNameFromAdmin = useSelector(userProfile)?.companyName;
  return (
    <>
      <AddSignature
        show={open}
        setValue={setSignature}
        setDate={setSignDate}
        setTime={setSignTime}
      />
      <AddSignature
        show={adminOpen}
        setValue={setAdminSignature}
        setDate={setAdminSignDate}
      />
      <div className="acknowledgement-print" ref={componentRef}>
        <NavWrapper isArrow={true} title={"Acknowledgement"} filled={5} />
        <Container>
          <Form
            id="form-appendix"
            className="w-full"
            onSubmit={employeId ? updateSubmitHandle : submitHandler}
          >
            <Form.Label className="fw-bold">
              SKILLS AND QUALIFICATIONS
            </Form.Label>
            <Row>
              <Col xs={12}>
                <Form.Label className="fw-bold">
                  Summarize special skills and qualifications acquired from
                  employment or other experiences that may qualify you for work
                  with {companyNameFromAdmin}.
                </Form.Label>
              </Col>
            </Row>
            <Card body className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Skills:</Form.Label>
                {"  "}
                <Form.Control
                  type="text"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  className="single_bordered mb-4"
                  placeholder="Skills "
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <p className="font-medium text-sm">
                  By singing below, I acknowledge that all the information I
                  have provided is accurate and true. I understand that, if
                  employed, falsified statement on this application shall be
                  ground to dismissal. I understand and agree that if employed,
                  my employment will be “at will” and can be terminated with or
                  without cause and with or without notice, at any time by{" "}
                  {companyNameFromAdmin}.or myself. Furthermore, I authorize{" "}
                  {companyNameFromAdmin} to thoroughly investigate my work,
                  education and other matters related to my suitability for
                  employment.
                </p>
              </Form.Group>
              <Form.Group>
                <InputMaker
                  label={"Name of Applicant"}
                  setState={setNameOfApplicant}
                  placeholder={"Enter Text"}
                  type={"text"}
                  value={nameOfApplicant}
                />
              </Form.Group>
            </Card>
            <Row>
              <Col xs={12} lg={6}>
                <div className="d-flex">
                  <Button
                    type="button"
                    className="theme-button mb-2 mb-lg-0 hidePrint"
                    onClick={() => {
                      profileInfo?.userType === ROLES.EMPLOYEE
                        ? setOpen(true)
                        : setAdminOpen(true);
                    }}
                  >
                    SAVED AND SIGNED
                  </Button>
                </div>
              </Col>
              <div className="text-end">
                <Col>
                  {signatureFormat({
                    sign: signature,
                    date: signdate,
                    time: signtime,
                    hoursFormat,
                  })}
                </Col>
                <Col>
                  {signatureFormat({
                    sign: adminSignature,
                    date: adminSigndate,
                    hoursFormat,
                  })}
                </Col>
              </div>
            </Row>
            <Row>
              <Col xs={12}>
                <div className="employee-btn-joiner mt-2 mt-md-5">
                  <button
                    className="employee_create_btn mt-3 mt-md-5 hidePrint"
                    type="submit"
                    disabled={
                      adminSignature?.length === 0 || signature?.length === 0
                    }
                  >
                    {loading ? (
                      <ClipLoader color="#fff" />
                    ) : (edit && profileInfo?.userType === ROLES.EMPLOYEE) ||
                      profileInfo?.userType === ROLES.ADMIN ? (
                      "UPDATE"
                    ) : (
                      "SUBMIT"
                    )}
                  </button>
                  {!edit && profileInfo?.userType === ROLES.EMPLOYEE && (
                    <button
                      className={`employee_create_btn ${profileInfo?.userType === ROLES.ADMIN && "hidden"}`}
                      type="button" // Add this line
                      onClick={() => navigate("/view-employement-application")}
                    >
                      {loading ? (
                        <ClipLoader color="#fff" />
                      ) : (
                        "View Application"
                      )}
                    </button>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>{" "}
    </>
  );
};
export default HOC({
  Wcomponenet: Acknowledgement,
});
