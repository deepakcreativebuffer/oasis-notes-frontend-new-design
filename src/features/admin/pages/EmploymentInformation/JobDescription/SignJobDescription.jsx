/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { employmentService } from "@/features/shared/services";
import Loader from "@/features/shared/ui/Loader/Loader";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { AddSignature, fetchPaitentName, signatureFormat } from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import ReactQuill from "react-quill";
import SafeHtml from "@/features/shared/ui/common/SafeHtml";
import { ROLES } from "@/features/shared/constants";
import { downloadReport } from "@/utils";
const SignJobDescription = () => {
  const ProfileDetails = useSelector(userProfile);
  const hoursFormat = ProfileDetails?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const companyName =
    ProfileDetails?.userType === ROLES.ADMIN
      ? ProfileDetails?.companyName
      : ProfileDetails?.adminId?.companyName;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [employeeInfoSignature, setEmployeeInfoSignature] = useState("");
  const [employeeInfoDate, setEmployeeInfoDate] = useState("");
  const [open, setOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { id, employeeId } = useParams();
  const [signers, setSigners] = useState([]);
  const [value2, setValue2] = useState("");
  const [name, setName] = useState({});
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeSignDate, setEmployeeSignDate] = useState("");
  useEffect(() => {
    if (id || employeeId) {
      employmentService.getJobDescription({
        employeeId: employeeId || id,
        setResponse: setData,
        setLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    if (data) {
      const item = data?.data;
      setValue2(
        item?.jobDescription
          ?.replaceAll("undefineds", "tests")
          ?.replaceAll("undefined", companyName)
          ?.replace(
            /<span class="companyName">.*?<\/span>/g,
            `<span class="companyName">${companyName}</span>`,
          )
          ?.replaceAll("--company-name--", companyName) || "",
      );
      setEmployeeInfoDate(item?.employeeInfoDate);
      setEmployeeInfoSignature(item?.employeeInfoSignature);
      setSigners(item?.signers);
      setName(item?.employeeId);
      setEmployeeSignature(item?.employeeSignature || "");
      setEmployeeSignDate(item?.employeeSignDate || "");
    }
  }, [data, companyName]);

  // Download Report
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        data?.data?.employeeId,
        ProfileDetails,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      data?.data?.employeeId,
      ProfileDetails,
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
        .Form.Label{
        page-break-inside: avoid;
        }
  `,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const profileInfo = useSelector(userProfile);
  let signerIndex = signers?.findIndex?.(
    (signer, i) => signer.signerId === profileInfo._id,
  );
  if (signerIndex === undefined || signerIndex === null) signerIndex = -1;
  function setSignerSignature(sign) {
    if (signerIndex !== -1)
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          signature: sign,
        };
        return newSigners;
      });
  }
  function setSignerDate(date) {
    if (signerIndex !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          dateSigned: date,
        };
        return newSigners;
      });
    }
  }
  const handleChange2 = (content, delta, source, editor) => {
    setValue2(content);
  };
  const editSignHandler = (sign) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerSignature(sign);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setEmployeeSignature(sign);
    }
  };
  const editDateHandler = (date) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerDate(date);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setEmployeeSignDate(date);
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const payload = {
      employeeSignature,
      employeeSignDate,
      signers,
    };
    employmentService.updateJobDescription(payload, {
      setLoading: setSubmitLoading,
      navigate,
    });
  };
  return (
    <>
      <div ref={componentRef}>
        <AddSignature
          show={open}
          setValue={(sign) =>
            data?.data?.employeeId === profileInfo?._id
              ? setEmployeeSignature(sign)
              : editSignHandler(sign)
          }
          setDate={(date) =>
            data?.data?.employeeId === profileInfo?._id
              ? setEmployeeSignDate(date)
              : editDateHandler(date)
          }
        />
        <NavWrapper title="Job Description" isArrow={true} />
        {loading ? (
          <Loader />
        ) : (
          <Container>
            <h1 className="pdfTitle hidden">Job Description</h1>
            <Form onSubmit={submitHandler}>
              {data?.data?.jobDescription && (
                <Row className="mt-3">
                  <Col xs={12}>
                    <Form.Label className="fw-bold me-2">
                      Employee Name:
                    </Form.Label>
                    <Form.Label>{name && fetchPaitentName(name)}</Form.Label>
                  </Col>
                </Row>
              )}
              <Card body className="mb-3">
                {profileInfo?.userType === ROLES.ADMIN ? (
                  <Form.Group className="mb-3">
                    <ReactQuill
                      theme="snow"
                      value={value2}
                      onChange={handleChange2}
                    />
                  </Form.Group>
                ) : data?.data?.jobDescription ? (
                  <SafeHtml
                    html={data?.data?.jobDescription
                      ?.replaceAll("undefineds", "tests")
                      ?.replaceAll("undefined", companyName)
                      ?.replace(
                        /<span class="companyName">.*?<\/span>/g,
                        `<span class="companyName">${companyName}</span>`,
                      )
                      ?.replaceAll("--company-name--", companyName)}
                    className="job-description"
                  />
                ) : (
                  <p>No Job Description Found</p>
                )}
              </Card>
              <Row>
                {profileInfo?.userType !== ROLES.ADMIN &&
                  data?.data?.jobDescription && (
                    <Col xs={12} lg={6}>
                      <Button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="theme-button hidePrint"
                      >
                        SAVED AND SIGNED
                      </Button>
                    </Col>
                  )}
                <Col xs={12} lg={12} xl={12} className="text-end">
                  {signatureFormat({
                    sign: employeeSignature,
                    date: employeeSignDate,
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
              <Row className="text-center">
                <Col xs={12}>
                  <div className="employee-btn-joiner mt-3 mt-md-5">
                    {profileInfo?.userType !== ROLES.ADMIN &&
                      data?.data?.jobDescription && (
                        <button
                          className="hidePrint employee_create_btn"
                          type="submit"
                          onClick={submitHandler}
                          disabled={
                            signers?.[signerIndex]?.signature?.length === 0
                          }
                        >
                          {submitLoading ? (
                            <ClipLoader color="#fff" />
                          ) : (
                            "SUBMIT"
                          )}
                        </button>
                      )}
                  </div>
                </Col>
              </Row>
            </Form>
          </Container>
        )}
      </div>
    </>
  );
};
export default HOC({
  Wcomponenet: SignJobDescription,
});
